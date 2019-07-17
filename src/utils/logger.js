/** 这个Logger实现仍在打磨阶段，不在项目中正式使用 */

const levels = {
  error: 4,
  warn: 3,
  info: 2,
  debug: 1,
};

const log = (level, ...msg) => {
  // eslint-disable-next-line no-undef
  if (levels[level] >= levels[LOGGER_LEVEL_CONF]) {
    const obj = {};
    Error.captureStackTrace(obj, log);
    console[level](
      level.toUpperCase(),
      'log',
      obj.stack
        .split('\n')[2]
        .split('(')[0]
        .trim()
    );
    console.trace('Trace');
    console[level](...msg);
  }
};

export default {
  info: (...msg) => log('info', ...msg),
  warn: (...msg) => log('warn', ...msg),
  error: (...msg) => log('error', ...msg),
};
