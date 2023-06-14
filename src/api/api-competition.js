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
 * 获取单个比赛信息
 * @returns
 */
export function getCompetition(params) {
  const url = `/server/competition/${params.id}`;
  return request.get(url, getHeaderConfig()).then((res) => {
    return res;
  });
}
/**
 * 获取所有比赛信息(全部、已完成、进行中、未开始)
 * @returns
 */
export function getCompetitionList({
  status = undefined,
  tag = undefined,
} = {}) {
  const queryParams = {};
  if (status !== undefined) {
    queryParams.status = status;
  }
  if (tag !== undefined) {
    queryParams.tag = tag;
  }
  const queryString = Object.keys(queryParams)
    .map((key) => `${key}=${queryParams[key]}`)
    .join('&');
  const url = `/server/competition${queryString ? `?${queryString}` : ''}`;
  return request.get(url).then((res) => {
    return res.data;
  });
}
/**
 * 获取排行榜信息
 * @returns
 */
export function getRank(params) {
  const url = `/server/competition/${params.id}/ranking`;
  return request.get(url).then((res) => {
    return res;
  });
}
/**
 * 保存信息，报名比赛----复赛无此功能
 * @returns
 */
export function applyCompetition(id, params) {
  const url = `/server/competition/${id}/competitor`;
  return request.post(url, params, getHeaderConfig()).then((res) => {
    return res.data;
  });
}
/**
 * 创建团队----复赛无此功能
 * @returns
 */
export function createTeam(id, params) {
  const url = `/server/competition/${id}/team`;
  return request
    .post(url, params, { $doException: true, ...getHeaderConfig() })
    .then((res) => {
      return res.data;
    });
}
/**
 * 获取团队信息
 * @returns
 */
export function getTeamInfor(competitionId) {
  const url = `/server/competition/${competitionId}/team`;
  return request.get(url, getHeaderConfig()).then((res) => {
    return res;
  });
}
/**
 * 查询团队提交记录
 * @returns
 */
export function getSubmissions(id) {
  const url = `/server/competition/${id}/submissions`;
  return request.get(url, getHeaderConfig()).then((res) => {
    return res.data;
  });
}
/**
 * 上传结果
 * @returns
 */
export function submit(id, file) {
  const url = `/server/competition/${id}/submissions`;
  let config = getHeaderConfig();
  config['timeout'] = 60000;
  return request.post(url, file, config).then((res) => {
    return res.data;
  });
}
/**
 * 用户加入团队（仅初赛）
 * @returns
 */
export function joinTeam(competitionId, params) {
  const url = `/server/competition/${competitionId}/team`;
  return request
    .put(url, params, { $doException: true, ...getHeaderConfig() })
    .then((res) => {
      return res.data;
    });
}
/**
 * 修改团队名（仅初赛）
 * @returns
 */
export function changTeamName(competitionId, params) {
  const url = `/server/competition/${competitionId}/team/action/change_name`;
  return request.put(url, params, getHeaderConfig()).then((res) => {
    return res.data;
  });
}
/**
 * 移除团队成员（仅初赛）
 * @returns
 */
export function removeMember(competitionId, params) {
  const url = `/server/competition/${competitionId}/team/action/delete_member`;
  return request.put(url, params, getHeaderConfig()).then((res) => {
    return res.data;
  });
}
/**
 * 退出团队（仅初赛）
 * @returns
 */
export function quitTeam(competitionId) {
  const url = `/server/competition/${competitionId}/team/action/quit`;
  return request.put(url, null, getHeaderConfig()).then((res) => {
    return res.data;
  });
}
/**
 * 移交队长（仅初赛）
 * @returns
 */
export function transferCaptain(competitionId, params) {
  const url = `/server/competition/${competitionId}/team/action/transfer_leader`;
  return request.put(url, params, getHeaderConfig()).then((res) => {
    return res.data;
  });
}

/**
 * 删除团队----复赛无此功能
 * @returns
 */
export function dissolveTeam(id) {
  const url = `/server/competition/${id}/team/action/dissolve`;
  return request.put(url, null, getHeaderConfig()).then((res) => {
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
export function addProject(params, id) {
  const url = `/server/competition/${id}/realted_project`;
  return request
    .put(url, params, { $doException: true, ...getHeaderConfig() })
    .then((res) => {
      return res.data;
    });
}
/**
 * 队长提交结果
 * @returns
 */
export function handleSubmit(params, pk) {
  const url = `/api/competitions/commit_result/${pk}`;
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
