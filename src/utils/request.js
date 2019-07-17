import fetch from 'dva/fetch';
import _ from 'lodash';
import { notification } from 'antd';
import locks from 'locks';
import { REFRESH_TOKEN_URL } from '../config';
import { InvalidTokenError, InvalidResponseFormatError } from '../errors';
import { needAuthUrl } from './utils';

const mutex = locks.createMutex();

let tokenNeedRefresh = false;

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '没有权限。',
  403: '访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器或联系技术人员。',
  502: '网络中转错误，从上游服务器收到无效响应。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '服务超时。',
};

async function checkStatus(response, url) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const errortext = codeMessage[response.status] || response.statusText;
  const error = new Error(errortext);
  error.name = response.status;
  error.response = response;

  // 系统中出现401并且是因为Token 失效导致，则不需要notification提示。
  if (response.status === 401 && needAuthUrl(url)) {
    const body = await response.json();
    if (body && ['20001', '20002', '20003', 20001, 20002, 20003].includes(body.code)) {
      error.message = 'You are unauthorized!';
      tokenNeedRefresh = true;
      throw new InvalidTokenError(error);
    }
  }

  notification.error({
    message: `发生请求错误: ${response.status}`,
    description: errortext,
  });
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [option]  The options we want to pass to "fetch"
 * @param  {string} [token]   Token will add to header param 'Authorization'.
 * @return {object}           An object or string
 */
export function fetchRequest(url, option, token) {
  console.info(`Global request ${url}`);

  const defaultOptions = {
    credentials: 'include',
  };
  const newOptions = { ...defaultOptions, ...option };
  if (
    newOptions.method === 'POST' ||
    newOptions.method === 'PUT' ||
    newOptions.method === 'DELETE'
  ) {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        ...newOptions.headers,
      };
      newOptions.body = JSON.stringify(newOptions.body);
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        Accept: 'application/json',
        ...newOptions.headers,
      };
    }
  }

  if (token) {
    newOptions.headers = {
      ...newOptions.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  const SYSTEM_ROUTE = localStorage.getItem('SYSTEM_ROUTE');
  if (!_.isEmpty(SYSTEM_ROUTE)) {
    newOptions.headers = {
      ...newOptions.headers,
      'SYSTEM-ROUTE': SYSTEM_ROUTE,
    };
  }

  return fetch(url, newOptions)
    .then(response => checkStatus(response, url))
    .then(response => {
      // DELETE and 204 do not return data by default
      // using .json will report an error.
      if (newOptions.method === 'DELETE' || response.status === 204) {
        return response.text();
      }
      return response.json();
    })
    .catch(e => {
      throw e;
    });
}

const refreshToken = async (e, url, option) => {
  if (e.name === 'InvalidTokenError') {
    // Token 失效后，先请求刷新token，然后重新再执行一次原请求(不做递归调用)。如果刷新token也失败，直接回登录页。
    let refreshTokenResponse;
    const theFetchResultWithNewToken = await new Promise(resolve =>
      // 对请求刷新token并用token重新请求的部分加原子锁。
      mutex.lock(async () => {
        let currentToken = localStorage.getItem('accessToken');
        if (tokenNeedRefresh) {
          try {
            refreshTokenResponse = await fetchRequest(REFRESH_TOKEN_URL, {
              method: 'POST',
              body: {
                accessToken: currentToken,
                refreshToken: localStorage.getItem('refreshToken'),
              },
            });
          } catch (error) {
            refreshTokenResponse = {};
          }

          if (refreshTokenResponse.code === '10000' || refreshTokenResponse.code === 10000) {
            // 刷新token成功状态码是10000，其他状态码都是失败的情况。
            currentToken = refreshTokenResponse.data.accessToken;
            localStorage.setItem('accessToken', currentToken);
            localStorage.setItem('refreshToken', refreshTokenResponse.data.refreshToken);
            tokenNeedRefresh = false;
          } else {
            resolve({});
            mutex.unlock();
            return;
          }
        }
        // TODO 如果这种情况下token还有问题，那么此次的这些请求将会卡死
        resolve(fetchRequest(url, option, currentToken));
        mutex.unlock();
      })
    );

    if (refreshTokenResponse.code === '10000' || refreshTokenResponse.code === 10000) {
      return theFetchResultWithNewToken;
    }
    notification.error({
      message: '登录超时',
      description: '请重新登录',
    });
    /* eslint-disable no-underscore-dangle */
    window.g_app._store.dispatch({
      type: 'login/logout',
    });
  }

  if (e.name === 'SyntaxError') {
    throw new InvalidResponseFormatError(
      `${e.message}. Response Body Format Error! It Maybe Empty!`
    );
  }

  // 其他类型的异常暂不处理
  throw e;
};

/**
 * Requests a URL, returning a response body.
 * Will refresh token when get 401.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [option] The options we want to pass to "fetch"
 * @return {object}           An object or string
 */
export default async function request(url, option) {
  const token = localStorage.getItem('accessToken');
  const responseBody = await fetchRequest(url, option, token).catch(async e =>
    refreshToken(e, url, option)
  );

  if (_.isEmpty(responseBody)) {
    throw new InvalidResponseFormatError('Response Body is Empty!');
  }
  return responseBody;
}
