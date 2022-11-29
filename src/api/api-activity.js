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
  return request.get(url, getHeaderConfig()).then((res) => {
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
export function applyToActivity(params) {
  const url = '/server/challenge/aiquestions';
  return request.post(url, params, getHeaderConfig()).then((res) => {
    return res.data;
  });
}
