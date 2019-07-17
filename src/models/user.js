import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { setAuthority } from '@/utils/authority';
import { reloadAuthorized } from '@/utils/Authorized';
import { getPageQuery } from '@/utils/utils';

const mockUser = {
  name: '元某人',
  mobile: '13838383838',
  userId: '5bc934bec9492c2934b5ba46',
  supplierId: '5bc934bec9492c2934b5ba46',
  supplierSetupType: '1',
  isManager: true,
  supplierAuditState: '1',
};

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
  },

  effects: {
    *fetchCurrent(_, { put }) {
      yield put({
        type: 'saveCurrentUser',
        payload: mockUser,
      });
    },
    *loginFetchCurrent(_, { put }) {
      yield put({
        type: 'saveCurrentUser',
        payload: mockUser,
      });
      message.success('登录成功');
      const urlParams = new URL(window.location.href);
      const params = getPageQuery();
      let { redirect } = params;
      if (redirect) {
        const redirectUrlParams = new URL(redirect);
        if (redirectUrlParams.origin === urlParams.origin) {
          redirect = redirect.substr(urlParams.origin.length);
          if (redirect.startsWith('/#')) {
            redirect = redirect.substr(2);
          }
        } else {
          window.location.href = redirect;
          return;
        }
        if (redirect.includes('user/login')) {
          redirect = '/';
        }
      }
      yield put(routerRedux.replace(redirect || '/'));
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      const currentUser = action.payload;
      setAuthority(currentUser.isManager ? 'administrator' : 'staff');
      reloadAuthorized();
      return {
        ...state,
        currentUser,
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload,
        },
      };
    },
  },
};
