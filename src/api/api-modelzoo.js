import { request } from '@/shared/axios';
import { LOGIN_KEYS } from '@/shared/login';
import { ElMessage } from 'element-plus';
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
 * 上传紫东太初大模型以文生图
 * @returns
 */
export function getMultiplePicture(params) {
  const url = `/server/bigmodel/multiple_pictures`;
  return request
    .post(url, params, {
      headers: {
        'private-token': localStorage.getItem(LOGIN_KEYS.USER_TOKEN),
      },
      timeout: 60000,
    })
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
 * CodeGeex 生成代码
 * @returns
 */
export function handleGenerateCode(params) {
  const url = `/server/bigmodel/codegeex`;
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
 * 盘古推理
 * @returns
 */
export function handlePanguInfer(params) {
  const url = '/server/bigmodel/pangu';
  return request
    .post(url, params, {
      headers: {
        'private-token': localStorage.getItem(LOGIN_KEYS.USER_TOKEN),
      },
      timeout: 60000,
    })
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
  const url = '/server/bigmodel/luojia';
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
 * 悟空-获取样例
 * @returns
 */
export function getWkExamples() {
  const url = '/server/bigmodel/wukong/samples/5';
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
 * 悟空-推理
 * @returns
 */
export function wuKongInfer(params) {
  const url = '/server/bigmodel/wukong';
  return request
    .post(url, params, {
      $doException: true,
      $noLoading: true,
      headers: {
        'private-token': localStorage.getItem(LOGIN_KEYS.USER_TOKEN),
      },
      timeout: 60000,
    })
    .then((res) => {
      return res;
    })
    .catch((e) => {
      console.log(e.code);
      if (e.code === 'bigmodel_sensitive_info') {
        ElMessage({
          type: 'error',
          message: '输入的内容不合规,请重新输入！',
        });
      }
      return e;
    });
}
/**
 * 悟空-画集
 * @returns
 */
export function getWuKongPic(params) {
  const url = '/server/bigmodel/wukong/pictures';
  return request
    .get(url, { params, ...getHeaderConfig() })
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return e;
    });
}
/**
 * 悟空-收藏
 * @returns
 */
export function addLikePicture(params) {
  const url = '/server/bigmodel/wukong';
  return request
    .put(url, params, { $noLoading: true, ...getHeaderConfig() })
    .then((res) => {
      return res;
    })
    .catch((e) => {
      return e;
    });
}

/**
 * 悟空-取消收藏
 * @returns
 */
export function cancelLikePicture(id) {
  const url = `/server/bigmodel/wukong/${id}`;
  return request
    .delete(url, { $noLoading: true, ...getHeaderConfig() })
    .then((res) => {
      return res;
    })
    .catch((e) => {
      return e;
    });
}

/**
 * 悟空-收藏图片
 * @returns
 */
export function collectedPictures() {
  const url = '/server/bigmodel/wukong';
  return request
    .get(url, getHeaderConfig())
    .then((res) => {
      return res;
    })
    .catch((e) => {
      return e;
    });
}

/**
 * 悟空-重新获取临时url
 * @returns
 */
export function temporaryLink(params) {
  const url = '/server/bigmodel/wukong/link';
  return request
    .put(url, params, getHeaderConfig())
    .then((res) => {
      return res;
    })
    .catch((e) => {
      return e;
    });
}
