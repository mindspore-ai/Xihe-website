import { request } from '@/shared/axios';
import { getHeaderConfig } from '@/shared/login';

export function getCourseList({ status = undefined, type = undefined } = {}) {
  const queryParams = {};
  if (status !== undefined) {
    queryParams.status = status;
  }
  if (type !== undefined) {
    queryParams.type = type;
  }
  const queryString = Object.keys(queryParams)
    .map((key) => `${key}=${queryParams[key]}`)
    .join('&');
  const url = `/server/course${queryString ? `?${queryString}` : ''}`;
  return request.get(url).then((res) => {
    return res.data;
  });
}
export function getMyCourseList({
  status = undefined,
  type = undefined,
  mine = undefined,
} = {}) {
  const queryParams = {};
  if (status !== undefined) {
    queryParams.status = status;
  }
  if (type !== undefined) {
    queryParams.type = type;
  }
  if (mine !== undefined) {
    queryParams.mine = mine;
  }
  const queryString = Object.keys(queryParams)
    .map((key) => `${key}=${queryParams[key]}`)
    .join('&');
  const url = `/server/course${queryString ? `?${queryString}` : ''}`;
  return request.get(url, getHeaderConfig()).then((res) => {
    return res.data;
  });
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

/**
 * 获取作业列表
 * @returns
 */
export function getTaskList(id, status) {
  const url = `/server/course/${id}/asg/list${
    status ? `?status=${status}` : ''
  }`;
  return request.get(url, getHeaderConfig()).then((res) => {
    return res.data;
  });
}

/**
 * 获取作业详情
 * @returns
 */
export function getTaskDetail(courseId, taskId) {
  const url = `/server/course/${courseId}/asg/${taskId}`;
  return request
    .get(url, { $doException: true, ...getHeaderConfig() })
    .then((res) => {
      return res.data;
    });
}

/**
 * 获取关联项目
 * @returns
 */
export function getProject(id) {
  const url = `/server/course/${id}/asg/result`;
  return request.get(url, getHeaderConfig()).then((res) => {
    return res.data;
  });
}

/**
 * 关联项目
 * @returns
 */
export function increaseProject(params, id) {
  const url = `/server/course/${id}/realted_project`;
  return request
    .put(url, params, { $doException: true, ...getHeaderConfig() })
    .then((res) => {
      return res.data;
    });
}

/**
 * 获取课程证书
 * @returns
 */
export function getCertificate(id) {
  const url = `/server/course/${id}/cert`;
  return request.get(url, getHeaderConfig()).then((res) => {
    return res.data;
  });
}
/**
 * 获取报名信息
 * @returns
 */
export function getReginfo() {
  const url = '/server/course/reginfo';
  return request
    .get(url, { $doException: true, ...getHeaderConfig() })
    .then((res) => {
      return res.data;
    });
}

/**
 * 视频播放量
 * @returns
 */
export function getViewCounts(params, id) {
  const url = `/server/course/${id}/record`;
  return request.put(url, params, getHeaderConfig()).then((res) => {
    return res.data;
  });
}
