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
    timeout: 50000,
  };
  return headersConfig;
}
/**
 * 上传紫东太初大模型推理图片
 * @returns
 */
export function uploadModelzooPic(params) {
  const url = `/api/foundation/taichu_opt`;
  return request
    .post(url, params, getHeaderConfig())
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return e;
    });
}

/**
 * 上传紫东太初大模型以文生图
 * @returns
 */
export function getInferencePicture(params) {
  const url = `/api/foundation/taichu_opt`;
  return request
    .post(url, params, getHeaderConfig())
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return e;
    });
}
