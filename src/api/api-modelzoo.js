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
    .put(url, params, getHeaderConfig())
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return e;
    });
}

/**
 * 更换以文生图样例
 * @returns
 */
export function getExampleTags() {
  const url = `/api/foundation/taichu_opt`;
  return request
    .get(url, getHeaderConfig())
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return e;
    });
}

/**
 * VQA文字审核
 * @returns
 */

export function handleTextRview(params) {
  const url = `/api/base/content_auditing/`;
  return request
    .post(url, params)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return e;
    });
}

/**
 * VQA推理
 * @returns
 */
export function handleVqaInference(params) {
  const url = `/api/foundation/taichu_vqa`;
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
 * CodeGeex 生成代码
 * @returns
 */
export function handleGenerateCode(params) {
  const url = `/api/foundation/CodeGeeX`;
  return request
    .post(url, params, getHeaderConfig())
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return e;
    });
}
