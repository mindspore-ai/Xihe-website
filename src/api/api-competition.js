import { request } from '@/shared/axios';
import { useUserInfoStore } from '@/stores';

function getUserInfo() {
  return useUserInfoStore();
}

function getHeaderConfig() {
  let headersConfig = {
    headers: {
      Authorization: getUserInfo().token ? `Bearer ${getUserInfo().token}` : '',
    },
  };
  return headersConfig;
}

/**
 * 获取比赛信息
 * @returns
 */
export function getCompetition(id) {
  if (id) {
    const url = `/api/competitions/competitions/${id}`;
    return request.get(url).then((res) => {
      return res.data;
    });
  } else {
    const url = `/api/competitions/competitions/`;
    return request.get(url).then((res) => {
      return res.data;
    });
  }
}
/**
 * 获取排行榜信息
 * @returns
 */
export function getFile(id) {
  const url = `/api/base/files/${id}`;
  return request.get(url).then((res) => {
    return res.data;
  });
}
