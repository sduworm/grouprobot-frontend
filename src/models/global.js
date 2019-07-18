import querystring from 'querystring';
import { queryNotices } from '@/services/api';

const AVAILABLE_BASE_MENU = ['/paas', '/settings'];

export default {
  namespace: 'global',

  state: {
    collapsed: false,
    notices: [],
    baseMenu: '/paas',
  },

  effects: {
    *fetchNotices(_, { call, put }) {
      const data = yield call(queryNotices);
      yield put({
        type: 'saveNotices',
        payload: data,
      });
      yield put({
        type: 'user/changeNotifyCount',
        payload: data.length,
      });
    },
    *clearNotices({ payload }, { put, select }) {
      yield put({
        type: 'saveClearedNotices',
        payload,
      });
      const count = yield select(state => state.global.notices.length);
      yield put({
        type: 'user/changeNotifyCount',
        payload: count,
      });
    },
  },

  reducers: {
    setBaseMenu(state, { payload }) {
      if (AVAILABLE_BASE_MENU.includes(payload)) {
        return {
          ...state,
          baseMenu: payload,
        };
      }
      return state;
    },
    resetBaseMenu(state) {
      return {
        ...state,
        baseMenu: '/paas',
      };
    },
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },
    saveNotices(state, { payload }) {
      return {
        ...state,
        notices: payload,
      };
    },
    saveClearedNotices(state, { payload }) {
      return {
        ...state,
        notices: state.notices.filter(item => item.type !== payload),
      };
    },
  },

  subscriptions: {
    setup({ history, dispatch }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
        if (['/scan/dingtalk'].includes(pathname)) {
          dispatch({
            type: 'login/scanLogin',
            payload: querystring.parse(search.replace('?', ''))
          });
        }
        if (['/paas/basicInfo', '/paas/link'].includes(pathname)) {
          dispatch({
            type: 'resetBaseMenu',
          });
        }
      });
    },
  },
};
