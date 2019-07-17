import request from '@/utils/request';

export default async function resetPassword(params) {
  return request('/api/account/resetPassword', {
    method: 'POST',
    body: params,
  });
}
