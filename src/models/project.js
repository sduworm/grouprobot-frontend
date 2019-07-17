import { sendSmsVerificationCode } from '@/services/api';
import { message } from 'antd';
import { isSuccess } from '../utils/common';

export default {
  namespace: 'project',

  state: {
    notice: [],
  },

  effects: {
    /**
     * 获取手机验证码
     * @param payload 包含PhoneNumber字段 手机号
     * @param call
     */
    *sendSmsVerificationCode({ payload }, { call }) {
      const response = yield call(sendSmsVerificationCode, payload);
      const { msg } = response;

      if (isSuccess(response)) {
        message.success('短信发送成功');
      } else {
        message.error(msg, 2);
      }
    },
  },

  reducers: {},
};
