import { LOGIN_KEYS } from '@/shared/login';
export default (response) => {
  const headers = response.headers;
  if (headers['private-token']) {
    localStorage.setItem(LOGIN_KEYS.USER_TOKEN, headers['private-token']);
  }
  const status = response.status;
  // 如果http响应状态码response.status正常，则直接返回数据
  if ((status >= 200 && status <= 300) || status === 304) {
    return response;
  }
  // status不正常的话，根据与后端约定好的code，做出对应的提示与处理
  // 返回一个带有code和message属性的对象
  else {
    const code = parseInt(response.data && response.data.code);
    // msg为服务端返回的错误信息，字段名自定义，此处以msg为例
    let message = (response.data || {}).msg;

    switch (code) {
      case 400:
        break;
      case 404:
        message = message || '请求地址错误';
        break;
      default:
        break;
    }
    return {
      code,
      message,
    };
  }
};
