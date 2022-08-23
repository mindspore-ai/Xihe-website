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
 * 获取所有或单个比赛信息
 * @returns
 */
export function getCompetition(params) {
  if (params) {
    const url = `/api/competitions/competitions/${params.id}`;
    return request.get(url, getHeaderConfig()).then((res) => {
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
/**
 * 获取用户所在团队id（是否报名）
 * @returns
 */
export function getGroupid(params) {
  const url = `/api/competitions/user_group_id/${params.id}`;
  return request.get(url, getHeaderConfig()).then((res) => {
    return res.data;
  });
}
/**
 * 保存信息，确定报名
 * @returns
 */
export function goCompetition(params) {
  const url = `/api/competitions/user_competition_info/`;
  return request.post(url, params, getHeaderConfig()).then((res) => {
    return res.data;
  });
}
/**
 * 创建团队
 * @returns
 */
export function createTeam(params) {
  const url = `/api/competitions/groups/`;
  return request.post(url, params, getHeaderConfig()).then((res) => {
    return res.data;
  });
}
/**
 * 获取团队信息
 * @returns
 */
export function getTeamInfo(params) {
  // console.log('params: ', params);
  const url = `/api/competitions/groups/${params.id}`;
  return request.get(url, params, getHeaderConfig()).then((res) => {
    return res.data;
  });
}
export function getTeamInfoByName(params) {
  // console.log('params: ', params);
  const url = `/api/competitions/groups/?name=${params.name}`;
  return request.get(url, params, getHeaderConfig()).then((res) => {
    return res.data;
  });
}
/**
 * 用户加入团队
 * @returns
 */
export function joinTeam(params) {
  console.log('params: ', params);
  const url = `/api/competitions/groups/${params.id}`;
  return request.post(url, params, getHeaderConfig()).then((res) => {
    return res.data;
  });
}
/**
 * 获取城市数据
 * @returns
 */
export function getAreaData() {
  // const url = `/api/competitions/user_competition_info/`;
  // return request.post(url, params, getHeaderConfig()).then((res) => {
  //   return res.data;
  // });
  return request.get('/public/data.json').then((res) => {
    return res;
  });
}
