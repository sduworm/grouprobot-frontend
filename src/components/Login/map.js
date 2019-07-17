import React from 'react';
import { Icon } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from './index.less';

export default {
  UserName: {
    props: {
      size: 'large',
      prefix: <Icon type="user" className={styles.prefixIcon} />,
      placeholder: formatMessage({ id: 'app.login.username' }),
    },
    rules: [
      {
        required: true,
        validateTrigger: 'onSubmit',
        message: formatMessage({ id: 'app.login.message-valid-username' }),
      },
      {
        validateTrigger: ['onBlur', 'onSubmit'],
        pattern: /^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/,
        message: formatMessage({ id: 'app.login.message-valid-format-username' }),
      },
    ],
  },
  Password: {
    props: {
      size: 'large',
      prefix: <Icon type="lock" className={styles.prefixIcon} />,
      type: 'password',
      placeholder: formatMessage({ id: 'app.login.password' }),
    },
    rules: [
      {
        required: true,
        message: formatMessage({ id: 'app.login.message-valid-password' }),
      },
    ],
  },
};
