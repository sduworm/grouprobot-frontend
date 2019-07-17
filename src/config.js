export const ICON_FONT_URL = '//at.alicdn.com/t/font_260796_inwsfidks58.js';
export const REFRESH_TOKEN_URL = '/api/auth/token';
// export const SERVICE_BASE_URL = '/choice-smp/metadata';
export const SERVICE_BASE_URL = '/choice-paas';
export const META_REQ_BASE_URL = `${SERVICE_BASE_URL}/api`;

export const FILE_OPERATION_URLS = {
  CONF_FILE_UPLOAD_API: `${META_REQ_BASE_URL}/file/upload`,
  CONF_FILE_DOWNLOAD_API: `${META_REQ_BASE_URL}/file/download`,
};

export const REQUEST_URLS_NEED_NOT_AUTH = [
  FILE_OPERATION_URLS.CONF_FILE_DOWNLOAD_API,
  FILE_OPERATION_URLS.CONF_FILE_UPLOAD_API,
  '/api/account/forgetResetPassword',
  '/api/account/sendSmsVerificationCode',
  '/api/auth/*',
  `${SERVICE_BASE_URL}/staff/register/*`,
  `${SERVICE_BASE_URL}/supplier/register/*`,
  `${SERVICE_BASE_URL}/token/getToken/register`,
];
