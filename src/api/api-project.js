import { request } from '@/shared/axios';
// import { useUserInfoStore } from '@/stores';
import { LOGIN_KEYS } from '@/shared/login';

// function getUserInfo() {
//   return useUserInfoStore();
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
 * 获取项目页面数据（筛选）
 * @returns
 */
export function getProjectData(params, name) {
  const url = `/server/project/${name}`;
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
 * 点赞(收藏)
 * @returns
 */
/* export function getUserDig(reopt) {
  return request(reopt).then((res) => {
    return res;
  });
} */
export function getUserDig(params) {
  const url = `/server/user/like`;
  return request.post(url, params, getHeaderConfig()).then((res) => {
    return res.data;
  });
}
/**
 * 取消点赞(取消收藏)
 * @returns
 */
export function cancelCollection(params) {
  // console.log('params: ', params);
  const url = `/server/user/like`;
  return request
    .delete(url, Object.assign({}, { data: params }, getHeaderConfig()))
    .then((res) => {
      return res.data;
    });
}

/**
 * 新建项目
 * @returns
 */
export function setNewProject(params) {
  const url = `/server/project`;
  return request.post(url, params, getHeaderConfig()).then((res) => {
    return res.data;
  });
}

/**
 * 修改项目信息
 * @returns
 */
export function modifyProject(params, owner, id) {
  const url = `/server/project/${owner}/${id}`;
  // console.log(params);
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
 * 修改项目标签
 * @returns
 */
export function modifyTags(params, owner, id) {
  const url = `/server/project/${owner}/${id}/tags`;
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
export function getTags() {
  const url = `/server/tags/project`;
  return request.get(url, getHeaderConfig()).then((res) => {
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
export function addDataset(params, owner, id) {
  const url = `/server/project/${owner}/${id}/dataset/relation`;
  return request.put(url, params, getHeaderConfig()).then((res) => {
    return res.data;
  });
}
export function deleteDataset(params, owner, id) {
  const url = `/server/project/${owner}/${id}/dataset/relation`;
  return request
    .delete(url, { data: params, ...getHeaderConfig() })
    .then((res) => {
      return res.data;
    });
}
/**
 * 添加模型（查询模型信息）
 * @returns
 */
export function addModel(params, owner, id) {
  const url = `/server/project/${owner}/${id}/model/relation`;
  return request.put(url, params, getHeaderConfig()).then((res) => {
    return res.data;
  });
}
/**
 * 删除模型（查询模型信息）
 * @returns
 */
export function deleteModel(params, owner, id) {
  const url = `/server/project/${owner}/${id}/model/relation`;
  return request
    .delete(url, { data: params, ...getHeaderConfig() })
    .then((res) => {
      return res.data;
    });
}

/**
 * 修改项目信息(inference)
 * @returns
 */
export function modifyProjectAdd(params, projectId) {
  const url = `/server/project/${owner}/${id}/model/relation`;
  return request
    .delete(url, { params, ...getHeaderConfig() })
    .then((res) => {
      return res;
    })
    .catch((e) => {
      return e;
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
  const url = `/server/train/project/${projectId}/training`;
  return request.get(url, getHeaderConfig()).then((res) => {
    return res;
  });
}

/**
 * 终止训练
 * @returns
 */
export function stopTrain(projectId, trainId) {
  const url = `/server/train/project/${projectId}/training/${trainId}`;
  return request.put(url, null, getHeaderConfig()).then((res) => {
    return res;
  });
}

/**
 * 重建训练
 * @returns
 */
export function rebuildTrain(projectId, trainId) {
  const url = `/server/train/project/${projectId}/training/${trainId}`;
  return request.post(url, null, getHeaderConfig()).then((res) => {
    return res;
  });
}

/**
 * 训练列表--删除
 * @returns
 */
export function deleteTainList(projectId, trainId) {
  const url = `/server/train/project/${projectId}/training/${trainId}`;
  return request.delete(url, getHeaderConfig()).then((res) => {
    console.log('res: ', res);
    return res;
  });
}

/**
 * 获得训练日志数据
 * @returns
 */
export function getTrainLog(params) {
  const { projectId, trainId } = params;
  const url = `/server/train/project/${projectId}/training/${trainId}`;
  return request
    .get(url, getHeaderConfig())
    .then((res) => {
      return res;
    })
    .catch((e) => {
      return e;
    });
}

/* 选择配置文件创建训练实例
 * @returns
 */
export function createTrainProject(params, projectId) {
  const url = `/server/train/project/${projectId}/training`;
  return request.post(url, params, getHeaderConfig()).then((res) => {
    return res.data;
  });
}

/**
 * Fork
 * @returns
 */
export function projectFork(owner, projectId) {
  const url = `/server/project/${owner}/${projectId}`;
  // console.log(url);
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
export function startInference2(params) {
  // const { projectId } = params;
  const url = `/server/inference/project/${params.owner}/${params.pid}`;
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
 * 项目推理日志
 * @returns
 */
export function getLog(pk) {
  // const { projectId } = params;
  const url = `/api/projects/${pk}/inference/errorlog/`;
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
// export function autoEvaluate(params, projectId, trainId) {
//   const url = `/api/projects/${projectId}/train/trainins/${trainId}/logvisual/`;
//   return request
//     .post(url, params, getHeaderConfig())
//     .then((res) => {
//       return res;
//     })
//     .catch((e) => {
//       return e;
//     });
// }

export function autoEvaluate(params, projectId, trainId) {
  const url = `/server/evaluate/project/${projectId}/training/${trainId}/evaluate`;
  return request
    .post(url, params, getHeaderConfig())
    .then((res) => {
      return res;
    })
    .catch((e) => {
      return e;
    });
}