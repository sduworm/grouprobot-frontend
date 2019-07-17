import { routerRedux } from 'dva/router';
import { accountLogout, getFakeCaptcha } from '@/services/api';
import { setAuthority } from '@/utils/authority';
import { reloadAuthorized } from '@/utils/Authorized';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login(_, { put }) {
      yield put({
        type: 'changeLoginStatus',
        payload: { status: true },
      });
      yield put({
        type: 'user/loginFetchCurrent',
      });
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
