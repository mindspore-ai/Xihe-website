import { LOGIN_KEYS } from '@/shared/login';

export default (err) => {
  const { response } = err;

  if (response.headers['csrf-token'] && response.status !== 404) {
    localStorage.setItem(LOGIN_KEYS.USER_TOKEN, response.headers['csrf-token']);
  }

  if (!response.status) {
    err.status = '';
    err.code = '';
    err.msg = '有response但没有response.status的情况';
  }
  err.status = response.status;
  err.code = response.data?.code || '';
  err.msg = response.data?.msg || '';

  if (err.msg === '' && err.status !== 400) {
    switch (response.status) {
      case 200:
        err.msg = '错误响应也会有状态码为200的情况';
        break;
      case 401:
        err.msg = '请重新登录(401)';
        break;
      case 403:
        err.msg = '拒绝访问(403)';
        break;
      case 404:
        err.msg = '请求出错(404)';
        break;
      case 408:
        err.msg = '请求超时(408)';
        break;
      case 500:
        err.msg = '服务器错误(500)';
        break;
      case 501:
        err.msg = '服务未实现(501)';
        break;
      case 502:
        err.msg = '网络错误(502)';
        break;
      case 503:
        err.msg = '服务不可用(503)';
        break;
      case 504:
        err.msg = '网络超时(504)';
        break;
      case 505:
        err.msg = 'HTTP版本不受支持(505)';
        break;
      default:
        err.msg = `连接出错，状态码：(${err.response.status})!`;
    }
  }

  return err;
};
