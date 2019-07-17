// eslint-disable-next-line import/prefer-default-export, Todo--后续还会加东西
export const isSuccess = response => [200, '200', 10000, '10000'].includes(response.code);
