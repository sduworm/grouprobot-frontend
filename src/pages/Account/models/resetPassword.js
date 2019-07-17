import resetPassword from '@/services/account';
import { message } from 'antd';
import { formatMessage } from 'umi/locale';
import { isSuccess } from '../../../utils/common';

export default {
  namespace: 'resetPassword',

  state: {},

  effects: {
    *submit({ payload }, { call }) {
      const response = yield call(resetPassword, payload);
      if (isSuccess(response)) {
        message.success(formatMessage({ id: 'app.resetPassword.submit.success' }));
        return;
      }
      message.error(response.msg);
    },
  },
};
