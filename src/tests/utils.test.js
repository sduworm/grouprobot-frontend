const { needAuthUrl } = require('../utils/utils');

test('Simple tests for function needAuthUrl', () => {
  expect(needAuthUrl('/choice/api/mate')).toEqual(true);
  expect(needAuthUrl('/choice/metadata/api/form')).toEqual(true);
  expect(needAuthUrl('/choice-paas/metadata/api/form')).toEqual(true);
  expect(needAuthUrl('/choice-paas/api/auth/form')).toEqual(true);
  expect(needAuthUrl('/api/auth/form')).toEqual(false);
  expect(needAuthUrl('/api/auth/login')).toEqual(false);
  expect(needAuthUrl('/api/auth/logout')).toEqual(false);
  expect(needAuthUrl('/api/account/login')).toEqual(true);
  expect(needAuthUrl('/api/api/account/api')).toEqual(true);
  expect(needAuthUrl('/api/account/forgetResetPassword')).toEqual(false);
  expect(needAuthUrl('/file/upload')).toEqual(true);
  expect(needAuthUrl('/choice-paas/api/file/upload')).toEqual(false);
  expect(needAuthUrl('/choice-paas/token/getToken/register')).toEqual(false);
  expect(needAuthUrl('/choice-paas/token/getToken/register/yyyy')).toEqual(true);
  expect(needAuthUrl('/choice-paas/supplier/register')).toEqual(true);
  expect(needAuthUrl('/choice-paas/staff/register/in')).toEqual(false);
});
