import { request } from '@/shared/axios';
import { useUserInfoStore } from '@/stores';
import { LOGIN_KEYS } from '@/shared/login';

function getUserInfo() {
  return useUserInfoStore();
}

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
 * 获取数据集筛选条件
 * @returns
 */
export function getSortData() {
  const url = '/api/tasks/taskscate/';
  return request.get(url).then((res) => {
    return res.data;
  });
}
/**
 * 获取数据集页面数据
 * @returns
 */
export function getDatasetData(params) {
  const url = `/api/datasets/`;
  let header = getHeaderConfig();
  // 登录之后携带token
  if (getUserInfo().token) {
    return request
      .get(url, {
        params,
        ...header,
      })
      .then((res) => {
        return res.data;
      });
  } else {
    return request.get(url, { params }).then((res) => {
      return res.data;
    });
  }
}
/**
 * 创建数据集仓库
 * @returns
 */
export function createDataset(params) {
  const url = `/server/dataset`;
  return request
    .post(url, JSON.stringify(params), getHeaderConfig())
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log(err);
    });
}
/**
 * 修改数据集信息
 * @returns
 */
/* export function modifyDataset(params) {
  const url = `/api/datasets/${params.id}`;
  return request
    .put(url, params, getHeaderConfig())
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return e;
    });
} */
export function modifyDataset(params, owner, id) {
  const url = `/server/dataset/${owner}/${id}`;
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
 * 删除数据集仓库
 * @returns
 */
export function deleteDataset(id) {
  const url = `/api/datasets/${id}`;
  return request
    .delete(url, getHeaderConfig())
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return e;
    });
}
/**
 * 获取标签信息
 * @returns
 */
export function getModelTags() {
  const url = `/api/base/filter/`;
  return request.get(url).then((res) => {
    return res.data;
  });
}
export function getTags() {
  const url = `/server/tags/dataset`;
  return request.get(url, getHeaderConfig()).then((res) => {
    return res.data;
  });
}
/**
 * 修改标签
 * @returns
 */
export function modifyTags(params, owner, id) {
  const url = `/server/dataset/${owner}/${id}/tags`;
  console.log(params, owner, id);
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
 * 点赞
 * @returns
 */
export function getUserDig(reopt) {
  return request(reopt).then((res) => {
    return res;
  });
}
/**
 * 添加下载记录
 * @returns
 */
export function addDownloadRecord(id) {
  const url = `/api/datasets/${id}/download`;
  return request.post(url).then((res) => {
    return res.data;
  });
}
/**
 * 添加模型（查询模型信息）
 * @returns
 */
export function addModel(params) {
  const url = `/api/models/?name=${params.name}&owner_name=${params.owner_name}`;
  return request.get(url, params).then((res) => {
    return res.data;
  });
}
/**
 * 修改项目信息(inference)
 * @returns
 */
export function modifyModelAdd(params, projectId) {
  const url = `/api/projects/${projectId}/inference`;
  return request
    .put(url, params, getHeaderConfig())
    .then((res) => {
      return res;
    })
    .catch((e) => {
      return e;
    });
}
