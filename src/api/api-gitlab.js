import { request } from '@/shared/axios';
import { Base64 } from 'js-base64';

import { useUserInfoStore, useLoginStore } from '@/stores';
import { LOGIN_KEYS } from '@/shared/login';
import { ElMessage } from 'element-plus';

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

export async function getGitlabConfig() {
  const loginStore = useLoginStore();
  let headersConfig = {
    headers: {
      'PRIVATE-TOKEN': '',
    },
  };
  if (!loginStore.isLogined) {
    headersConfig = {};
  } else if (getUserInfo().gitlabToken) {
    headersConfig.headers['PRIVATE-TOKEN'] = getUserInfo().gitlabToken;
  } else {
    let res = await getGitlabToken();
    getUserInfo()['gitlabToken'] = res.data.token;
    headersConfig.headers['PRIVATE-TOKEN'] = res.data.token;
  }
  return headersConfig;
}

export function getGitlabToken() {
  const url = `/server/user/${getUserInfo().userName}/gitlab`;
  return request.get(url, getHeaderConfig()).then((res) => {
    return res.data;
  });
}

// 获取仓库详情
export function getRepoDetailByName(params) {
  const url = `/server/${params.modular}/${params.user}/${params.repoName}`;
  return request
    .get(url, getHeaderConfig())
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      ElMessage({
        type: 'error',
        message: err.message,
      });
      throw new Error(err);
    });
}
//上传文件
export async function uploadFileGitlab(params, path) {
  const url = `/api/v1/repo/${params.type}/${
    params.name
  }/file/${encodeURIComponent(path)}`;
  return request
    .post(url, params, await getHeaderConfig())
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      ElMessage({
        type: 'error',
        message: err.message,
      });
      throw new Error(err);
    });
}
//更新上传文件
export async function editorFileGitlab(params) {
  const url = `/api/v1/repo/${params.type}/${
    params.name
  }/file/${encodeURIComponent(params.path)}`;
  return request
    .put(url, params, await getHeaderConfig())
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      ElMessage({
        type: 'error',
        message: err.message,
      });
      throw new Error(err);
    });
}
// 获取 gitlab 树
export async function getGitlabTree(params) {
  const url = `/api/v1/repo/${params.type}/${params.user}/${
    params.name
  }/files?path=${encodeURIComponent(params.path)}`;
  return request
    .get(url, await getHeaderConfig())
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      ElMessage({
        type: 'error',
        message: err.message,
      });
      throw new Error(err);
    });
}
// 删除文件
export async function deleteFile(params) {
  const url = `/api/v1/repo/${params.type}/${
    params.name
  }/file/${encodeURIComponent(params.path)}`;
  return request
    .delete(url, await getHeaderConfig())
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      ElMessage({
        type: 'error',
        message: err.message,
      });
      throw new Error(err);
    });
}

// gitlab 文件预览 不添加下载量
export async function getGitlabFileRaw(params) {
  const url = `/api/v1/repo/${params.type}/${params.user}/${
    params.name
  }/file/${encodeURIComponent(params.path)}/preview`;
  return request
    .get(url, await getHeaderConfig())
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      ElMessage({
        type: 'error',
        message: err.message,
      });
      throw new Error(err);
    });
}
// gitlab 原文件下载
export async function getGitlabFile(params) {
  const url = `/api/v1/repo/${params.type}/${params.user}/${
    params.name
  }/file/${encodeURIComponent(params.path)}`;
  return request
    .get(url, await getHeaderConfig())
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      ElMessage({
        type: 'error',
        message: err?.message,
      });
      throw new Error(err);
    });
}
// 下载全部
export async function gitlabDownloadAll(params) {
  const url = `/api/v1/repo/${params.type}/${params.user}/${params.name}`;
  let config = await getHeaderConfig();
  config['responseType'] = 'blob';
  config['timeout'] = 60000;
  return request
    .get(url, config)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      ElMessage({
        type: 'error',
        message: err.message,
      });
      throw new Error(err);
    });
}

// 删除文件夹

export async function deleteFolder(params) {
  const url = `/api/v1/repo/${params.type}/${
    params.name
  }/dir/${encodeURIComponent(params.path)}`;
  return request
    .delete(url, await getHeaderConfig())
    .then((res) => {
      return res;
    })
    .catch((err) => {
      ElMessage({
        type: 'error',
        message: err.message,
      });
      throw new Error(err);
    });
}

export function downloadFile(params) {
  getGitlabFile(params).then((res) => {
    let downloadElement = document.createElement('a'); //创建一个a 虚拟标签
    let href = null;
    if (res?.data?.content) {
      let blob = new Blob([Base64.toUint8Array(res?.data?.content).buffer], {
        type: 'text/plain;charset=UTF-8',
      });
      href = window.URL.createObjectURL(blob); // 创建下载的链接
    } else if (res?.data.download_url) {
      href = `${res.data.download_url}`;
    }
    downloadElement.href = href;
    downloadElement.download = params.path; // 下载后文件名
    document.body.appendChild(downloadElement);
    downloadElement.click(); // 点击下载
    document.body.removeChild(downloadElement); // 下载完成移除元素
    window.URL.revokeObjectURL(href);
  });
}
