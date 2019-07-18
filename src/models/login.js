import { message } from 'antd';
import { routerRedux } from 'dva/router';
import { accountLogin, accountLogout, getFakeCaptcha } from '@/services/api';
import { setAuthority } from '@/utils/authority';
import { reloadAuthorized } from '@/utils/Authorized';
import { isSuccess } from '../utils/common';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *scanLogin({ payload }, { call, put }) {
      const response = yield call(accountLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // Login successfully
      if (isSuccess(response)) {
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        sessionStorage.removeItem('registerToken');
        yield put({
          type: 'user/loginFetchCurrent',
        });
        return;
      }

      switch (response.code) {
        case '50001':
          message.error(response.msg);
          return;
        case '50002':
        case '50005':
          message.error('账号或密码错误');
          return;
        case '50003':
        case '50004':
        case '50006':
          message.error('账号被停用'); // 无论在什么页面，遇到这种情况应统一跳转到登录页
          break;
        default:
          // 无论在什么页面，遇到这种情况应统一跳转到登录页
          message.error('登录异常');
          break;
      }
      yield put(
        routerRedux.push({
          pathname: '/user/login',
        })
      );
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },

    *logout(_, { put, call }) {
      const tokens = {
        accessToken: localStorage.getItem('accessToken'),
        refreshToken: localStorage.getItem('refreshToken'),
      };
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setAuthority('guest');
      reloadAuthorized();
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
        },
      });
      yield put(
        routerRedux.push({
          pathname: '/user/login',
          // 退出时不保存当前页：退出后再登录后应默认回到首页
          // search: stringify({
          //   redirect: window.location.href,
          // }),
        })
      );
      if (tokens.accessToken && tokens.refreshToken) {
        yield call(accountLogout, tokens);
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      return {
        ...state,
        status: payload.status || payload.code,
      };
    },
  },
};
