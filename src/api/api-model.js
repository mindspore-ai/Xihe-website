import { request } from '@/shared/axios';
import { getHeaderConfig } from '@/shared/login';
import { ElMessage } from 'element-plus';
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
 * 获取模型筛选条件
 * @returns
 */
export function getSortData() {
  const url = '/api/tasks/taskscate/';
  return request.get(url).then((res) => {
    return res.data;
  });
}
/**
 * 获取模型页面数据
 * @returns
 */
export function getModelData(params) {
  const url = '/server/model';
  let header = getHeaderConfig();
  // 登录之后携带token
  return request
    .get(url, {
      params,
      ...header,
    })
    .then((res) => {
      return res.data;
    });
}
/**
 * 创建模型仓库
 * @returns
 */
export function createModel(params) {
  const url = '/api/models/';
  return request.post(url, JSON.stringify(params)).then((res) => {
    return res.data;
  });
}

/**
 * 修改模型信息
 * @returns
 */
export function modifyModel(params, owner, id) {
  const url = `/server/model/${owner}/${id}`;
  return request.put(url, params, getHeaderConfig()).then((res) => {
    return res.data;
  });
}
/**
 * 修改标签
 * @returns
 */
export function modifyTags(params, owner, id) {
  const url = `/server/model/${owner}/${id}/tags`;
  return request
    .put(url, params, getHeaderConfig())
    .then((res) => {
      return res.data;
    })
    .catch(() => {
      ElMessage({
        type: 'error',
        message: 'error',
      });
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
export function getTags(type) {
  const url = `/server/tags/${type}`;
  return request.get(url).then((res) => {
    return res.data;
  });
}
/**
 * 删除模型仓库
 * @returns
 */
export function deleteModel(owner, name) {
  const url = `/server/model/${owner}/${name}`;
  return request.delete(url, getHeaderConfig()).then((res) => {
    return res.data;
  });
}

/**
 * 添加下载记录
 * @returns
 */
export function addDownloadRecord(id) {
  const url = `/api/models/${id}/download`;
  return request.post(url).then((res) => {
    return res.data;
  });
}

/**
 * 查看是否含有readme文件
 * @returns
 */
export function getReadmeInfo(ownerName, modelName) {
  const url = `/server/repo/model/${ownerName}/${modelName}/readme`;
  return request.get(url, getHeaderConfig()).then((res) => {
    return res.data;
  });
}

/**
 * 创建模型集仓库
 * @returns
 */
export function createModelStore(params) {
  const url = '/server/model';
  return request.post(url, params, getHeaderConfig()).then((res) => {
    return res.data;
  });
}
export function checkNames(params) {
  const url = `/server/model/${params.owner}/${params.name}/check`;
  return request
    .get(url, { $doException: true, ...getHeaderConfig() })
    .then((res) => {
      return res.data;
    });
}
/**
 * 添加相关数据集（查询数据集信息）
 * @returns
 */
export function addDataset(params, owner, id) {
  const url = `/server/model/relation/${owner}/${id}/dataset`;
  return request.put(url, params, getHeaderConfig()).then((res) => {
    return res.data;
  });
}
export function deleteDataset(params, owner, id) {
  const url = `/server/model/relation/${owner}/${id}/dataset`;
  return request
    .delete(url, { data: params, ...getHeaderConfig() })
    .then((res) => {
      return res.data;
    });
}

/**
 * 修改项目信息(推理)
 * @returns
 */
export function modifyProjectAdd(params, projectId) {
  const url = `/api/models/${projectId}`;
  return request
    .put(url, params, getHeaderConfig())
    .then((res) => {
      return res;
    })
    .catch(() => {
      ElMessage({
        type: 'error',
        message: 'error',
      });
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
 * 修改项目信息(训练)
 * @returns
 */
export function modifyModelAdd(params, projectId) {
  const url = `/api/projects/${projectId}/inference`;
  return request
    .put(url, params, getHeaderConfig())
    .then((res) => {
      return res;
    })
    .catch(() => {
      ElMessage({
        type: 'error',
        message: 'error',
      });
    });
}
