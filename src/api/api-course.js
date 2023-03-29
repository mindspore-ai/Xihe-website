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
 * 获取课程列表
 * @returns
 */
export function getCourseList(params) {
  if (params) {
    const url = `/server/course?status=${params.status}`;
    return request.get(url).then((res) => {
      return res;
    });
  } else {
    const url = `/server/course`;
    return request.get(url).then((res) => {
      return res;
    });
  }
}
/**
 * 获取单个课程信息
 * @returns
 */
export function getCourseData(id) {
  const url = `/server/course/${id}`;
  return request.get(url, getHeaderConfig()).then((res) => {
    return res.data;
  });
}

/**
 * 课程报名
 * @returns
 */
export function applyCourse(id, params) {
  const url = `/server/course/${id}/player`;
  return request.post(url, params, getHeaderConfig()).then((res) => {
    return res.data;
  });
}
