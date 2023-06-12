import { request } from '@/shared/axios';
import { LOGIN_KEYS } from '@/shared/login';
import { ElMessage } from 'element-plus';

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
    .post(url, params, {
      $noLoading: true,
      headers: {
        'private-token': localStorage.getItem(LOGIN_KEYS.USER_TOKEN),
      },
    })
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
  const url = '/server/bigmodel/wukong_async';
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
    });
}
/**
 * 悟空-画集
 * @returns
 */
export function getWuKongPic(params) {
  const url = '/server/bigmodel/wukong/publics';
  return request
    .get(url, { params, $doException: true, ...getHeaderConfig() })
    .then((res) => {
      return res.data;
    });
}
/**
/**
 * 悟空-点赞
 * @returns
 */
export function toDigg(params) {
  const url = '/server/bigmodel/wukong/digg';
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
/**
 * 悟空-取消点赞
 * @returns
 */
export function cancelDigg(params) {
  const url = '/server/bigmodel/wukong/digg';
  return request
    .delete(url, { data: params, ...getHeaderConfig() })
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return e;
    });
}
/**
/**
 * 悟空-收藏公开
 * @returns
 */
export function addLikePicture2(params) {
  const url = '/server/bigmodel/wukong/like';
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
 * 悟空-收藏
 * @returns
 */
export function addLikePicture(params) {
  const url = '/server/bigmodel/wukong/like';
  return request
    .post(url, params, {
      $doException: true,
      $noLoading: true,
      ...getHeaderConfig(),
    })
    .then((res) => {
      return res;
    })
    .catch((e) => {
      if (e.code === 'wukong_excced_max_like_num') {
        ElMessage({
          type: 'warning',
          message: '收藏上限为10张，请取消收藏后再操作',
        });
      }
      return e;
    });
}

/**
 * 悟空-取消收藏
 * @returns
 */
export function cancelLikePicture(id) {
  const url = `/server/bigmodel/wukong/like/${id}`;
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
 * 悟空-我的收藏图片
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
    .put(url, params, { $noLoading: true, ...getHeaderConfig() })
    .then((res) => {
      return res;
    })
    .catch((e) => {
      return e;
    });
}

/**
 * 悟空-我的公开图片
 * @returns
 */
export function publicPictures() {
  const url = '/server/bigmodel/wukong/public';
  return request.get(url, getHeaderConfig()).then((res) => {
    return res;
  });
}

/**
 * 悟空-公开临时图片
 * @returns
 */
export function publicTemporaryPicture(params) {
  const url = '/server/bigmodel/wukong/public';
  return request
    .post(url, params, { $noLoading: true, ...getHeaderConfig() })
    .then((res) => {
      return res;
    })
    .catch((e) => {
      return e;
    });
}

/**
 * 悟空-取消公开临时图片
 * @returns
 */
export function cancelPublic(id) {
  const url = `/server/bigmodel/wukong/public/${id}`;
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
 * 悟空-公开收藏图片
 * @returns
 */
export function publicCollectedPicture(params) {
  const url = '/server/bigmodel/wukong/public';
  return request
    .post(url, params, {
      $doException: true,
      ...getHeaderConfig(),
    })
    .then((res) => {
      return res;
    });
}
/**
 * 悟空-查询排位
 * @returns
 */
export function getRank() {
  const url = '/server/bigmodel/wukong/rank';
  return request.get(url, getHeaderConfig()).then((res) => {
    return res.data;
  });
}
/**
 * 悟空-查询图片
 * @returns
 */
export function getPic() {
  const url = '/server/bigmodel/wukong/task';
  return request
    .get(url, { $doException: true, ...getHeaderConfig() })
    .then((res) => {
      return res.data;
    });
}

/**
 * AI检测器推理
 * @returns
 */
export function textDetectorInfer(params) {
  const url = '/server/bigmodel/ai_detector';
  return request.post(url, params, getHeaderConfig()).then((res) => {
    return res.data;
  });
}
