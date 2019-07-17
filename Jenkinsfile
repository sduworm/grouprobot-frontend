pipeline {
  agent any
  stages {
    stage('Build Project') {
      steps {
        sh 'npm install'
        sh 'npm run build'
        sh 'tar -cvzf  frontend-framework.tar.gz dist/* --transform s=dist/=='
      }
    }
    stage('Build Docker Image') {
      steps {
        sh 'docker build --build-arg env=${build_env} --build-arg idc=${build_idc}  -t ${tag} .'
      }
    }
    stage('Push image') {
      steps {
        sh 'docker push ${tag}'
      }
    }
    stage('Deploy to enviroment') {
      steps {
        sh 'sed -i "s*customimage*${tag}*" kubernetes.yml'
        sh '/usr/local/bin/kubectl --context choice-rancher apply --namespace=${namespace} -f kubernetes.yml'
      }
    }
  }

  post {
    always {
      sh 'sonar-scanner'
    }
  }

  environment {
    tag = "r.cn/choice/${env.JOB_NAME}:${env.BUILD_NUMBER}"
    namespace = "palteform-${params.build_env}"
    build_env = "${params.build_env}"
    build_idc = "${params.build_idc}"
  }
  parameters {
    choice(name: 'build_env', choices: ['dev','test','pre','pro'], description: '将应用部署到以下环境')
    choice(name: 'build_idc', choices: ['default','grey','pro'], description: '选择IDC，请参考apollo配置默认为default')
  }
}
