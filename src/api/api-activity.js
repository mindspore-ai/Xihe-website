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
 * 详情
 * @returns
 */
export function getActivityDetail() {
  const url = '/server/challenge';
  return request.get(url, getHeaderConfig()).then((res) => {
    return res.data;
  });
}

/**
 * 获取考题信息
 * @returns
 */
export function getQuestions() {
  const url = '/server/challenge/aiquestions';
  return request
    .get(url, {
      headers: {
        'private-token': localStorage.getItem(LOGIN_KEYS.USER_TOKEN),
      },
      timeout: 60000,
    })
    .then((res) => {
      return res.data;
    });
}

/**
 * 提交答案
 * @returns
 */
export function submitPapers(params) {
  const url = '/server/challenge/aiquestions';
  return request.post(url, params, getHeaderConfig()).then((res) => {
    return res.data;
  });
}

/**
 * 报名
 * @returns
 */
export function applyActivity(params) {
  const url = '/server/challenge/competitor';
  return request.post(url, params, getHeaderConfig()).then((res) => {
    return res.data;
  });
}
/**
 * 获取排行榜
 * @returns
 */
export function GetRankingList() {
  const url = '/server/challenge/ranking';
  return request.get(url, getHeaderConfig()).then((res) => {
    return res.data;
  });
}
