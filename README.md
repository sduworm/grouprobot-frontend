# 元数据引擎开发平台

* 核心价值：
  * 元数据功能验证平台
  * 元数据引擎调开发调试平台
  * [元数据引擎和元数据组件库](doc/MetaComponent.md)源码维护
* 项目依赖Antd Pro、Ant Design、DVA(计划替换为KOS), 项目工程构建基于[umi](https://umijs.org/zh)
* 元数据引擎依赖AAnt Design、React 16、React-Redux 库构建基于原生webpack
* 元数据引擎应用案例：[供应商平台](http://gitlab.choicesoft.com.cn/choice/supplier)

### 快速开始
* `npm install` 安装所有依赖包 
* `npm start` 启动本地HTTP服务（默认监听9488端口）

### 打包构建
* `npm build` 打包构建 
* `npm build-meta-lib` 打包元数据引擎Module

### 发布
* 将元数据组件库打包成功后，在src/meta-component/dist目录中生成打包结果文件。
* 将元数据组件库的打包结果文件提交到**元数据工程**的对应分支：具体方式请移步[meta-component](http://gitlab.choicesoft.com.cn/metadata-frontend/meta-component)工程
* 建议使用（或参考）[dev-scripts](http://gitlab.choicesoft.com.cn/metadata/frontend-framework/tree/feature/dev-scripts)脚本

### 开发
* 本项目内部对元数据组件（库）的使用，统一采用`import { initMetadata } from '@/meta-component';`，**注意@符号**，用于适配业务开发时库引用侧的`import { initMetadata } from 'meta-component'`，写法。

### 代码规范 
* 本项目代码规范基于[AirBnb](https://github.com/dwqs/react-style-guide)和[prettier](https://prettier.io/)的代码约定
* 代码提交前会进行eslint校验，**请所有同学务必遵守代码规范**。 
* 手动执行提交前的eslint校验：`git add .`, `npm run precommit`。
* 相关的 IDE 可以配置eslint检验，以方便你在编辑代码的时候就可以清楚知道，自己错误的地方。
	* 如：Webstorm 可以参考[这篇文档](https://www.jetbrains.com/help/webstorm/eslint.html)进行配置

### 日志规则 TODO 增加日志级别可配置

### 异常处理 TODO 完善库内的异常抛出机制

### 单元测试
- 开发的单元测试可放到代码文件平级目录，或者放到tests目录。
- 注意文件命名为xxx.test.js。
- 使用npm test运行所有测试。

### 相关学习文档：
* [Ant Design](https://react-guide.github.io/react-router-cn/) 
* [Ant Design Pro](https://pro.ant.design/index-cn)
* [DVA](https://github.com/dvajs/dva/blob/master/docs/API_zh-CN.md)
* [React-router](https://react-guide.github.io/react-router-cn/)
* [Redux](http://cn.redux.js.org/index.html)
* [Redux-saga](http://leonshi.com/redux-saga-in-chinese/index.html)
* [UMI](https://umijs.org/zh)

