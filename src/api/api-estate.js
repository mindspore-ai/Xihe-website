import { request } from '@/shared/axios';

import { LOGIN_KEYS } from '@/shared/login';

function getHeaderConfig() {
  const headersConfig = localStorage.getItem(LOGIN_KEYS.USER_TOKEN)
    ? {
        headers: {
          'private-token': localStorage.getItem(LOGIN_KEYS.USER_TOKEN),
        },
      }
    : {};
  return headersConfig;
}

/**
 * 电力主页
 * @returns
 */
export function getElectricitydata() {
  const url = '/server/homepage/electricity';
  return request.get(url, getHeaderConfig()).then((res) => {
    return res.data;
  });
}
