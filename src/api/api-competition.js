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
export function getAllCompetition(params) {
  const url = `/api/competitions/competitions/?status=${params}`;
  return request.get(url).then((res) => {
    return res.data;
  });
}
/**
 * 获取排行榜信息
 * @returns
 */
export function getRank(id) {
  const url = `/api/competitions/competition_ranklist`;
  console.log(id);
  return request.post(url, id).then((res) => {
    return res.data;
  });
}
/**
 * 获取用户所在团队id（是否报名）
 * @returns
 */
export function getGroupid(id) {
  const url = `/api/competitions/user_group_id/${id}`;
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
 * 修改团队信息(点击创建团队，修改团队名)
 * @returns
 */
export function changeTeam(params, id) {
  const url = `/api/competitions/groups/${id}`;
  return request.put(url, params, getHeaderConfig()).then((res) => {
    return res.data;
  });
}
/**
 * 获取团队信息
 * @returns
 */
export function getTeamInfo(params) {
  const url = `/api/competitions/groups/${params.id}`;
  return request.get(url, getHeaderConfig()).then((res) => {
    return res.data;
  });
}
// 通过团队名获取团队信息
export function getTeamInfoByName(name, competitionId) {
  const url = `/api/competitions/groups/?name=${name}&relate_competition=${competitionId}`;
  return request.get(url, getHeaderConfig()).then((res) => {
    return res.data;
  });
}
// 通过比赛id获取团队信息
export function getTeamInfoById(id) {
  const url = `/api/competitions/groups/${id}`;
  return request.get(url, getHeaderConfig()).then((res) => {
    return res.data;
  });
}
/**
 * 用户加入团队
 * @returns
 */
export function joinTeam(params) {
  const url = `/api/competitions/join_group/${params.id}`;
  return request.post(url, params, getHeaderConfig()).then((res) => {
    return res.data;
  });
}
/**
 * 删除团队
 * @returns
 */
export function deleteTeam(id) {
  const url = `/api/competitions/groups/${id}`;
  return request.delete(url, getHeaderConfig()).then((res) => {
    return res.data;
  });
}
/**
 * 退出团队
 * @returns
 */
export function quitTeam(params) {
  const url = `/api/competitions/leave_group/${params.id}`;
  return request.post(url, params, getHeaderConfig()).then((res) => {
    return res.data;
  });
}
/**
 * 移除团队成员
 * @returns
 */
export function removeMember(params, id) {
  const url = `/api/competitions/groups/${id}`;
  return request.put(url, params, getHeaderConfig()).then((res) => {
    return res.data;
  });
}
/**
 * 移交队长
 * @returns
 */
export function transferCaptain(params) {
  const url = `/api/competitions/groups/${params.id}`;
  return request.put(url, params, getHeaderConfig()).then((res) => {
    return res.data;
  });
}
/**
 * 获取城市数据
 * @returns
 */
export function getAreaData() {
  return request.get('/data.json').then((res) => {
    return res;
  });
}
/**
 * 添加项目（查询数据集信息）
 * @returns
 */
export function addProject(params) {
  const url = `/api/projects/?name=${params.name}&owner_name=${params.owner_name}`;
  return request.get(url, { params, ...getHeaderConfig() }).then((res) => {
    return res.data;
  });
}
/**
 * 队长提交结果
 * @returns
 */
export function handleSubmit(params) {
  const url = `/api/competitions/commit_result/`;
  return request.post(url, params, getHeaderConfig()).then((res) => {
    return res.data;
  });
}
/**
 * 自动评分
 * @returns
 */
export function handleScoring(params, pk) {
  const url = `/api/competitions/evaluation/${pk}`;
  return request.post(url, params, getHeaderConfig()).then((res) => {
    return res.data;
  });
}
/**
 * 艺术家画作风格查分数
 * @returns
 */
export function getScore(params, pk) {
  const url = `/api/competitions/get_score_obs/${pk}`;
  return request.post(url, params, getHeaderConfig()).then((res) => {
    return res.data;
  });
}
/**
 * 获取介绍
 * @returns
 */
export function getGuide(link) {
  const url = link;
  return request
    .get(url)
    .then((res) => {
      return res;
    })
    .catch((e) => {
      return e;
    });
}
