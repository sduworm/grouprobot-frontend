const GATEWAY_DEV = 'http://usergate.dev.choicesaas.cn/';
const LOCALHOST = 'http://localhost:8080/';
// const CUSTOM_DEV_SERVER = 'http://10.10.12.239:8080/'; // 超哥
// const CUSTOM_DEV_SERVER = 'http://10.10.14.115:8080/'; // 胜哥
// const CUSTOM_DEV_SERVER = 'http://10.10.12.17:8080/'; // 杰哥
// const CUSTOM_DEV_SERVER = 'http://10.10.12.54:8080/'; // 想哥
const CUSTOM_DEV_SERVER = 'http://10.10.12.37:8080/'; // 先哥
// const CUSTOM_DEV_SERVER = 'http://10.10.1.12:8080/'; // 建伟
const ONLINE_MOCK = 'http://pickpost.choicesaas.cn/mock/srm/';

const APP_PREFIX = '/choice-paas/';
const BIZ_APP_PREFIX = '/choice-smp/';

export default {
  devGateway: {
    changeOrigin: true,
    target: GATEWAY_DEV,
  },
  localhost: {
    target: LOCALHOST,
    pathRewrite: { [APP_PREFIX]: '/', [BIZ_APP_PREFIX]: '/' },
  },
  customDevServer: {
    changeOrigin: true,
    target: CUSTOM_DEV_SERVER,
    pathRewrite: { [APP_PREFIX]: '/', [BIZ_APP_PREFIX]: '/' },
  },
  onlineMock: {
    changeOrigin: true,
    target: ONLINE_MOCK,
  },
};
