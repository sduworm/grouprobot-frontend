const levels = {
  error: 4,
  warn: 3,
  info: 2,
  log: 1,
};

if (!sessionStorage.getItem('alwaysOpenLog') === 'true') {
  Object.keys(levels).forEach(level => {
    // eslint-disable-next-line no-undef
    if (levels[level] < levels[LOGGER_LEVEL_CONF]) {
      console[level] = () => {};
    }
  });
}
