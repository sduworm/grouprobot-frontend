import request from '@/utils/request';

export async function accountLogin(params) {
  return request('/api/auth/login', {
    method: 'POST',
    body: params,
  });
}

export async function accountLogout(params) {
  return request('/api/auth/logout', {
    method: 'POST',
    body: params,
  });
}
