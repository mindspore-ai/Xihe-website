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
export function getFiles(id) {
  const url = `/api/competitions/competitions/${id}`;
  return request.get(url).then((res) => {
    return res.data;
  });
}
