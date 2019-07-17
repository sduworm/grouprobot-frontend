import os from 'os';
import pageRoutes from './router.config';
import webpackPlugin from './plugin.config';
import defaultSettings from '../src/defaultSettings';
import proxyRules from './proxy.rules.config';

const proxy = {
  '/choice-paas/api': proxyRules.onlineMock,
  '/choice-paas': proxyRules.onlineMock,
  // '/choice-smp/metadata/api': proxyRules.customDevServer,
  // '/choice-paas/api/list-table': proxyRules.onlineMock,
  // '/choice-paas/bizData/form': proxyRules.onlineMock,
};

export default {
  proxy,
  history: 'hash',
  plugins: [
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: {
          hmr: true,
        },
        targets: {
          ie: 11,
        },
        locale: {
          enable: true, // default false
          default: 'zh-CN', // default zh-CN
          baseNavigator: true, // default true, when it is true, will use `navigator.language` overwrite default
        },
        dynamicImport: {
          loadingComponent: './components/PageLoading/index',
        },
        ...(!process.env.TEST && os.platform() === 'darwin'
          ? {
              dll: {
                include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
                exclude: ['@babel/runtime'],
              },
              hardSource: true,
            }
          : {}),
      },
    ],
    [
      'umi-plugin-ga',
      {
        code: 'UA-72788897-6',
        judge: () => process.env.APP_TYPE === 'site',
      },
    ],
  ],
  targets: {
    ie: 11,
  },
  define: {
    APP_TYPE: process.env.APP_TYPE || '',
    LOGGER_LEVEL_CONF: 'log',
  },
  // 路由配置
  routes: pageRoutes,
  // Theme for antd
  // https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': defaultSettings.primaryColor,
  },
  externals: {
    '@antv/data-set': 'DataSet',
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (context, localIdentName, localName) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }
      const match = context.resourcePath.match(/src(.*)/);
      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = antdProPath
          .split('/')
          .map(a => a.replace(/([A-Z])/g, '-$1'))
          .map(a => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }
      return localName;
    },
  },
  manifest: {
    name: 'supplier',
    background_color: '#FFF',
    description: 'Supplier Platform.',
    display: 'standalone',
    start_url: '/index.html',
    icons: [
      {
        src: '/favicon.ico',
        sizes: '64x64',
        type: 'image/png',
      },
    ],
  },

  chainWebpack: webpackPlugin,
  cssnano: {
    mergeRules: false,
  },
  hash: true,
};
