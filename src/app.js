// eslint-disable-next-line import/prefer-default-export
export const dva = {
  config: {
    onError(e) {
      // 公共错误处理
      e.preventDefault();
      // eslint-disable-next-line no-undef
      const errMsg = LOGGER_LEVEL_CONF === 'log' ? e : `${e.name}. ${e.message}`;
      console.error('Supplier Platform App caught an ERROR.', errMsg);
    },
  },
};
