import request, { fetchRequest } from '@/utils/request';

export async function registeVerify(params) {
  return request('/choice-smp/supplier/register/validateAccount', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function inquire(params) {
  const { registerToken } = params;
  return fetchRequest('/choice-smp/supplier/register/refresh', {}, registerToken);
}

export async function updateCompany(params) {
  const { authToken, status, ...param } = params;
  return fetchRequest(
    `/choice-smp/supplier/register/submitCompanyForm?status=${status}`,
    {
      method: 'POST',
      body: {
        ...param,
      },
    },
    authToken
  );
}

export async function updatePerson(params) {
  const { authToken, status, ...param } = params;
  return fetchRequest(
    `/choice-smp/supplier/register/submitPersonForm?status=${status}`,
    {
      method: 'POST',
      body: {
        ...param,
      },
    },
    authToken
  );
}

export async function acquireSubmitToken(params) {
  const { registerToken } = params;
  return fetchRequest('/choice-smp/token/getToken/register', {}, registerToken);
}
