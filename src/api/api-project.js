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
  };
  return headersConfig;
}
/**
 * 获取项目页面数据（筛选）
 * @returns
 */
export function getProjectData(params) {
  const url = `/api/projects/?`;
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
 * 点赞
 * @returns
 */
export function getUserDig(reopt) {
  return request(reopt).then((res) => {
    return res;
  });
}

/**
 * 新建项目
 * @returns
 */
export function setNewProject(params) {
  const url = `/api/projects/`;
  return request.post(url, params, getHeaderConfig()).then((res) => {
    return res.data;
  });
}

/**
 * 修改项目信息
 * @returns
 */
export function modifyProject(params) {
  const url = `/api/projects/${params.id}`;
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
 * 获取标签信息
 * @returns
 */
export function getModelTags() {
  const url = `/api/base/filter/`;
  return request.get(url).then((res) => {
    return res.data;
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
 * 添加下载记录
 * @returns
 */
export function addDownloadRecord(id) {
  const url = `/api/projects/${id}/download`;
  return request.post(url).then((res) => {
    return res.data;
  });
}

/**
 * 删除项目仓库
 * @returns
 */
export function deleteProject(id) {
  const url = `/api/projects/${id}`;
  return request
    .delete(url, getHeaderConfig())
    .then((res) => {
      return res;
    })
    .catch((e) => {
      return e;
    });
}

/**
 * 按（条件）排序
 * @returns
 */

export function projectsOrder(params) {
  const url = `/api/projects/`;
  return request.get(url, params).then((res) => {
    return res.data;
  });
}

/**
 * 添加数据集（查询数据集信息）
 * @returns
 */
export function addDataset(params) {
  const url = `/api/datasets/?name=${params.name}&owner_name=${params.owner_name}`;
  return request.get(url, params).then((res) => {
    return res.data;
  });
}

/**
 * 修改项目信息(inference)
 * @returns
 */
export function modifyProjectAdd(params, projectId) {
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

/**
 * 训练列表
 * @returns
 */
export function trainList(projectId) {
  const url = `/api/projects/${projectId}/train/trainins/`;
  return request.get(url, getHeaderConfig()).then((res) => {
    return res;
  });
}

/**
 * 终止训练
 * @returns
 */
export function stopTrain(projectId, trainId) {
  const url = `/api/projects/${projectId}/train/trainins/${trainId}`;
  return request.put(url, null, getHeaderConfig()).then((res) => {
    return res;
  });
}

/**
 * 重建训练
 * @returns
 */
export function rebuildTrain(projectId, trainId) {
  const url = `/api/projects/${projectId}/train/trainins/${trainId}/rebuild/`;
  return request.put(url, null, getHeaderConfig()).then((res) => {
    return res;
  });
}

/**
 * 训练列表--删除
 * @returns
 */
export function deleteTainList(projectId, trainId) {
  const url = `/api/projects/${projectId}/train/trainins/${trainId}`;
  return request.delete(url, getHeaderConfig()).then((res) => {
    return res;
  });
}

/* 选择配置文件创建训练实例
 * @returns
 */
export function createTrainProject(params, projectId) {
  const url = `/api/projects/${projectId}/train/trainins/`;
  return request.post(url, params, getHeaderConfig()).then((res) => {
    return res.data;
  });
}

/**
 * Fork
 * @returns
 */
export function projectFork(params, projectId) {
  const url = `/api/projects/fork/${projectId}`;
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
 * 获得训练日志数据
 * @returns
 */
export function getTrainLog(params) {
  const { projectId, trainId } = params;
  const url = `/api/projects/${projectId}/train/trainins/${trainId}`;
  return request
    .get(url, params, getHeaderConfig())
    .then((res) => {
      return res;
    })
    .catch((e) => {
      return e;
    });
}

/**
 * 新增项目推理
 * @returns
 */
export function startInference(params) {
  // const { projectId } = params;
  const url = `/api/projects/${params}/inference/infertask/`;
  return request
    .post(url, params)
    .then((res) => {
      return res;
    })
    .catch((e) => {
      return e;
    });
}

/**
 * 终止项目推理
 * @returns
 */
export function stopInference(params) {
  // const { projectId } = params;
  const url = `/api/projects/${params}/inference/infertask/`;
  return request
    .delete(url, getHeaderConfig())
    .then((res) => {
      return res;
    })
    .catch((e) => {
      return e;
    });
}

/**
 * 获取用户指引
 * @returns
 */
export function getGuide() {
  const url = `https://obs-xihe-beijing4.obs.cn-north-4.myhuaweicloud.com/xihe-img/default_docs/README.md`;
  return request
    .get(url)
    .then((res) => {
      return res;
    })
    .catch((e) => {
      return e;
    });
}

/**
 * 自动评估
 * @returns
 */
export function autoEvaluate(params, projectId, trainId) {
  const url = `/api/projects/${projectId}/train/trainins/${trainId}/logvisual/`;
  return request
    .post(url, params, getHeaderConfig())
    .then((res) => {
      return res;
    })
    .catch((e) => {
      return e;
    });
}
