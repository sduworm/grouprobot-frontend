import React from 'react';
import { connect } from 'dva';
import { FormattedMessage } from 'umi/locale';
import Login from '@/components/Login';
import styles from './Login.less';

const { UserName, Password, Submit } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'] || loading.effects['user/loginFetchCurrent'],
}))
class LoginPage extends React.Component {
  state = {
    type: 'account',
  };

  handleSubmit = (err, values) => {
    if (!err) {
      const { dispatch } = this.props;
      dispatch({
        type: 'login/login',
        payload: {
          ...values,
        },
      });
    }
  };

  render() {
    const { submitting } = this.props;
    const { type } = this.state;
    const FormComponent = (
      <div>
        <div className={styles.formTitle}>登录</div>
        <div className={styles.form}>
          <Login
            defaultActiveKey={type}
            onSubmit={this.handleSubmit}
            ref={form => {
              this.loginForm = form;
            }}
          >
            <div className={styles.label}>账号</div>
            <UserName name="username" placeholder="请输入手机号" />
            <div className={styles.label}>密码</div>
            <Password
              name="password"
              placeholder="请输入密码"
              onPressEnter={() =>
                this.loginForm.validateFields(this.handleSubmit).catch(e => {
                  throw e;
                })
              }
            />
            <Submit loading={submitting}>
              <FormattedMessage id="app.login.login" />
            </Submit>
          </Login>
        </div>
      </div>
    );
    return (
      <div className={styles.main}>
        <div className={styles.contentBackground}>
          <div className={styles.content}>
            <div className={styles.textContent}>
              <div className={styles.cutDiv} />
            </div>
            <div className={styles.formContainer}>
              <div className={styles.formContent}>{FormComponent}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default LoginPage;
