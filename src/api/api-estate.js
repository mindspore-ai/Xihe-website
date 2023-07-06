import { request } from '@/shared/axios';

import { getHeaderConfig } from '@/shared/login';

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
