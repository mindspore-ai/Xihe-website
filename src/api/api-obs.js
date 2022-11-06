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
 * 获取上传OBS token
 * @returns
 */
export function getUploadToken(params) {
  const url = `/api/users/obsurl/`;
  return request.put(url, params, getHeaderConfig()).then((res) => {
    return res.data;
  });
}
/**
 * 获取下载OBS token
 * @returns
 */
export function getDownLoadToken(params) {
  const url = `/api/users/obsurl/`;
  return request.get(url, { params, ...getHeaderConfig() }).then((res) => {
    return res.data;
  });
}

/**
 * 获取删除OBS token
 * @returns
 */
export function getDelToken(params) {
  const url = `/api/users/obsurl/?objkey=${params.objkey}`;
  return request.delete(url, getHeaderConfig()).then((res) => {
    return res.data;
  });
}

/**
 * 删除OBS 文件
 * @returns
 */

export function delFileObs(reopt) {
  return request(reopt).then((res) => {
    return res.data;
  });
}

/**
 * 下载OBS文件
 * @returns
 */
export function downloadFileObs(reopt) {
  return request(reopt).then((res) => {
    return res.data;
  });
}

/**
 * 获取AK SK
 * @returns
 */
export function getAsToken(path) {
  const url = `/api/base/getas/?path=${path}`;
  return request.get(url, getHeaderConfig()).then((res) => {
    return res.data;
  });
}

/**
 * 预览文件 封装
 * @returns
 */
let reopt = {
  method: 'get',
  url: null,
  withCredentials: false,
  headers: null,
  validateStatus: function (status) {
    return status >= 200;
  },
  maxRedirects: 0,
  responseType: 'text',
  data: null,
};
export async function downloadObs(objkey) {
  await getDownLoadToken({ objkey }).then((res) => {
    reopt.url = res.data.signedUrl;
  });
  return downloadFileObs(reopt);
}
// 文件名称校验
export function fileVerify(params) {
  const url = `/api/base/fileverify/`;
  return request.post(url, params, getHeaderConfig()).then((res) => {
    return res.data;
  });
}

// 仓库及文件名查找
export function findFile(path) {
  const url = `/api/base/find/?path=${path}`;
  return request.get(url, getHeaderConfig()).then((res) => {
    return res.data;
  });
}

// 删除文件夹
export function deleteFolder(path) {
  const url = `/api/base/find/?path=${path}`;
  return request.delete(url, getHeaderConfig()).then((res) => {
    return res.data;
  });
}

// 文件夹/文件改名
export function fileRename(params) {
  const url = `/api/base/rename/`;
  return request.put(url, params, getHeaderConfig()).then((res) => {
    return res.data;
  });
}
export function addDownloadRecord(id, module) {
  const url = `/api/${module}/${id}/download`;
  return request.post(url, null, getHeaderConfig()).then((res) => {
    return res.data;
  });
}
// 上传方法封装
export async function handleUpload(params, progressCallback, successCallback) {
  // 验证文件名合法性
  let { path, file, isEdit, description } = params;
  try {
    if (!isEdit) {
      await fileVerify({ path }).then((res) => {
        if (res.status === 200) {
          isEdit = true;
        } else {
          ElMessage({
            type: 'error',
            message: res.msg,
          });
        }
      });
    }
    // 编辑文件不验证文件名
    if (isEdit) {
      // 验证成功获取AK SK 上传obs
      await getAsToken(path).then((res) => {
        if (res.status === 200) {
          res = res.data;
          let obsClient = new ObsClient({
            access_key_id: res.access_key,
            secret_access_key: res.secret_key,
            security_token: res.security_token,
            server: `https://${res.endpoint}`,
            timeout: 1800,
          });
          obsClient.putObject(
            {
              Bucket: res.bucket_name,
              Key: path,
              SourceFile: file,
              ProgressCallback: progressCallback || null,
              Metadata: {
                description,
              },
              ContentDisposition: 'attachment', // 文件直接下载
            },
            function (err, result) {
              if (err) {
                ElMessage({
                  type: 'error',
                  message: err,
                });
              } else if (result.CommonMsg.Status === 200) {
                successCallback();
              }
            }
          );
        } else {
          ElMessage({
            type: 'error',
            message: res.msg,
          });
        }
      });
    }
  } catch (error) {
    console.error(error);
  }
}

/**
 * 获取AK SK(VQA)
 * @returns
 */
export function getVqaAsToken(path) {
  const url = `/api/base/getas_wh/?path=${path}`;
  return request.get(url, getHeaderConfig()).then((res) => {
    return res.data;
  });
}

// LuoJia 上传图片封装
export async function handleLuoJiaUpload(
  params,
  progressCallback,
  successCallback,
  failedCallback
) {
  // 验证文件名合法性
  let { path, file, isEdit, description } = params;
  try {
    if (!isEdit) {
      await fileVerify({ path }).then((res) => {
        if (res.status === 200) {
          isEdit = true;
        } else {
          ElMessage({
            type: 'error',
            message: res.msg,
          });
        }
      });
    }
    // 编辑文件不验证文件名
    if (isEdit) {
      // 验证成功获取AK SK 上传obs
      await getLuoJiaAsToken(path).then((res) => {
        if (res.status === 200) {
          res = res.data;
          let obsClient = new ObsClient({
            access_key_id: res.access_key,
            secret_access_key: res.secret_key,
            security_token: res.security_token,
            server: 'https://obs.cn-central-221.ovaijisuan.com',
            timeout: 1800,
          });
          obsClient.putObject(
            {
              Bucket: res.bucket_name,
              Key: path,
              SourceFile: file,
              ProgressCallback: progressCallback || null,
              Metadata: {
                description,
              },
              ContentDisposition: 'attachment', // 文件直接下载
            },
            function (err, result) {
              if (err) {
                ElMessage({
                  type: 'error',
                  message: err,
                });
                failedCallback();
              } else if (result.CommonMsg.Status === 200) {
                successCallback();
              }
            }
          );
        } else {
          ElMessage({
            type: 'error',
            message: res.msg,
          });
        }
      });
    }
  } catch (error) {
    console.error(error);
  }
}

//VQA上传图片方法封装
export async function handleVqaUpload(
  params,
  progressCallback,
  successCallback
) {
  // 验证文件名合法性
  let { path, file, isEdit, description } = params;
  try {
    if (!isEdit) {
      await fileVerify({ path }).then((res) => {
        if (res.status === 200) {
          isEdit = true;
        } else {
          ElMessage({
            type: 'error',
            message: res.msg,
          });
        }
      });
    }
    // 编辑文件不验证文件名
    if (isEdit) {
      // 验证成功获取AK SK 上传obs
      await getVqaAsToken(path).then((res) => {
        if (res.status === 200) {
          res = res.data;
          let obsClient = new ObsClient({
            access_key_id: res.access_key,
            secret_access_key: res.secret_key,
            security_token: res.security_token,
            server: 'https://obs.cn-central-221.ovaijisuan.com',
            timeout: 1800,
          });
          obsClient.putObject(
            {
              Bucket: res.bucket_name,
              Key: path,
              SourceFile: file,
              ProgressCallback: progressCallback || null,
              Metadata: {
                description,
              },
              ContentDisposition: 'attachment', // 文件直接下载
            },
            function (err, result) {
              if (err) {
                ElMessage({
                  type: 'error',
                  message: err,
                });
              } else if (result.CommonMsg.Status === 200) {
                successCallback();
              }
            }
          );
        } else {
          ElMessage({
            type: 'error',
            message: res.msg,
          });
        }
      });
    }
  } catch (error) {
    console.error(error);
  }
}

// 新建文件夹封装
export async function createFolder(params, successCallback) {
  let { path } = params;
  let flag = false;
  // 验证文件名合法性
  try {
    await fileVerify({ path }).then((res) => {
      if (res.status === 200) {
        flag = true;
      } else {
        ElMessage({
          type: 'error',
          message: res.msg,
        });
      }
    });
    // 编辑文件不验证文件名
    if (flag) {
      // 验证成功获取AK SK 上传obs
      await getAsToken(path).then((res) => {
        if (res.status === 200) {
          res = res.data;
          let obsClient = new ObsClient({
            access_key_id: res.access_key,
            secret_access_key: res.secret_key,
            security_token: res.security_token,
            server: `https://${res.endpoint}`,
          });
          obsClient.putObject(
            {
              Bucket: res.bucket_name,
              Key: path,
            },
            function (err, result) {
              if (result.CommonMsg.Status === 200) {
                successCallback();
              } else {
                ElMessage({
                  type: 'error',
                  message: err,
                });
              }
            }
          );
        } else {
          ElMessage({
            type: 'error',
            message: res.msg,
          });
        }
      });
    }
  } catch (error) {
    console.error(error);
  }
}
// 文件下载 封装
export function downloadFile(objkey, fileName, storeId) {
  try {
    getDownLoadToken({ objkey }).then((res) => {
      reopt.method = 'get';
      reopt.url = res.data.signedUrl;
      reopt.responseType = 'blob';
      let link = document.createElement('a');
      link.href = res.data.signedUrl;
      link.click();
      addDownloadRecord(storeId, objkey.split('/')[1])
        .then(() => {
          // ElMessage({
          //   type: 'success',
          //   message: res.msg,
          //   center: true,
          // });
        })
        .catch((error) => {
          console.error(error);
        });
    });
  } catch (error) {
    ElMessage({
      type: 'error',
      message: error,
      center: true,
    });
  }
}
// 比赛数据集下载
export function downloadDataset(objkey) {
  try {
    getDownLoadToken({ objkey }).then((res) => {
      // reopt.method = 'get';
      // reopt.url = res.data.signedUrl;
      // reopt.responseType = 'blob';
      // reopt.headers = { 'request-module': 'app_info' };
      let link = document.createElement('a');
      link.href = res.data.signedUrl;
      link.click();
    });
  } catch (error) {
    ElMessage({
      type: 'error',
      message: error,
      center: true,
    });
  }
}
