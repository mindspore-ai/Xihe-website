import { request } from '@/shared/axios';

import { LOGIN_KEYS } from '@/shared/login';

function getHeaderConfig() {
  const headersConfig = localStorage.getItem(LOGIN_KEYS.USER_TOKEN)
    ? {
        headers: {
          'csrf-token': localStorage.getItem(LOGIN_KEYS.USER_TOKEN),
        },
      }
    : {};
  return headersConfig;
}

/**
 * 电力主页
 * @returns
 */
export function getElectricitydata(kinds) {
  const url = `/server/homepage/electricity?tag_kinds=${kinds}`;
  return request.get(url, getHeaderConfig()).then((res) => {
    return res.data;
  });
}
