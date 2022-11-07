import { request } from '@/shared/axios';
import { LOGIN_KEYS } from '@/shared/login';
// import { useUserInfoStore } from '@/stores';

// function getUserInfo() {
//   return useUserInfoStore();
// }
// function getHeaderConfig() {
//   let headersConfig = {
//     headers: {
//       Authorization: getUserInfo().token ? `Bearer ${getUserInfo().token}` : '',
//     },
//     timeout: 50000,
//   };
//   return headersConfig;
// }
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
 * 上传紫东太初大模型推理图片
 * @returns
 */
export function uploadModelzooPic(params) {
  const url = `/server/bigmodel/describe_picture`;

  getHeaderConfig().headers['Content-Type:multipart/form-data'];

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
 * 上传紫东太初大模型以文生图(生成一张图片)
 * @returns
 */
export function getSinglePicture(params) {
  const url = `/server/bigmodel/single_picture`;
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
 * 上传紫东太初大模型以文生图(生成一张图片)
 * @returns
 */
export function getMultiplePicture(params) {
  const url = `/server/bigmodel/multiple_pictures`;
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
 * VQA图片上传
 * @returns
 */
export function uploadVqaPicture(params) {
  const url = `/server/bigmodel/vqa_upload_picture`;
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
 * VQA推理
 * @returns
 */
export function handleVqaInference(params) {
  const url = '/server/bigmodel/ask';
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

/**
 * 盘古推理（测试）
 * @returns
 */
export function handlePanguInfer(params) {
  const url = '/server/bigmodel/pangu';
  return request
    .post(url, params, getHeaderConfig())
    .then((res) => {
      return res;
    })
    .catch((e) => {
      return e;
    });
}

/**
 * LuoJia上传图片
 * @returns
 */
export function handleLuojiaUploadPic(params) {
  const url = '/server/bigmodel/luojia_upload_picture';
  return request
    .post(url, params, getHeaderConfig())
    .then((res) => {
      return res;
    })
    .catch((e) => {
      return e;
    });
}

/**
 * LuoJia推理
 * @returns
 */
export function handleLuoJiaInfer() {
  const url = '/server/bigmodel/luojia';
  return request
    .post(url, null, getHeaderConfig())
    .then((res) => {
      return res;
    })
    .catch((e) => {
      return e;
    });
}

/**
 * LuoJia推理记录
 * @returns
 */
export function handleLuoJiaHistory() {
  const url = '/api/foundation/luojianet';
  return request
    .get(url, getHeaderConfig())
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return e;
    });
}
