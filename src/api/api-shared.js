import { request } from '@/shared/axios';

/**
 * 获取基础信息（用户类型，组织类型...）
 * @returns
 */
export function getBaseInfo() {
  const url = '/api/base/base/';
  return request.get(url).then((res) => {
    return res.data;
  });
}
/**
 * 获取标签信息
 * @returns
 */
export function getModelTags() {
  const url = '/api/base/filter/';
  return request.get(url).then((res) => {
    return res.data;
  });
}

/**
 *
 * 点赞
 * @returns
 */
export function getUserDig(reopt) {
  return request(reopt).then((res) => {
    return res;
  });
}
/**
 * 查询文件
 * @returns
 */
export function getFiles(id) {
  const url = `/api/base/files/${id}`;
  return request.get(url).then((res) => {
    return res.data;
  });
}
/**
 * 获取首页比赛课程信息
 * @returns
 */
export function getHomeInfo() {
  const url = '/server/homepage';
  return request.get(url).then((res) => {
    return res.data;
  });
}
