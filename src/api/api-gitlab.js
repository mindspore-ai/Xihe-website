import { request } from '@/shared/axios';
import { Base64 } from 'js-base64';

import { useUserInfoStore, useLoginStore } from '@/stores';
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

export function creatModelRepo(params) {
  const url = `/server/model`;
  return request.post(url, params, getHeaderConfig()).then((res) => {
    return res.data;
  });
}
// 获取仓库详情
export function getRepoDetailByName(params) {
  const url = `/server/${params.modular}/${params.user}/${params.repoName}`;
  return request.get(url, getHeaderConfig()).then((res) => {
    return res.data;
  });
}
//上传文件
export async function uploadFileGitlab(params, path) {
  const url = `/server/repo/${params.name}/file/${encodeURIComponent(path)}`;
  return request.post(url, params, await getHeaderConfig()).then((res) => {
    return res.data;
  });
}
//更新上传文件
export async function editorFileGitlab(params) {
  const url = `/server/repo/${params.name}/file/${encodeURIComponent(
    params.path
  )}`;
  return request.put(url, params, await getHeaderConfig()).then((res) => {
    return res.data;
  });
}
// 获取 gitlab 树
export async function getGitlabTree(path, id) {
  const url = `/repo/projects/${id}/repository/tree?path=${path}&per_page=100`;
  return request.get(url, await getGitlabConfig()).then((res) => {
    return res.data;
  });
}
// 删除文件
export async function deleteFile(params) {
  const url = `/server/repo/${params.name}/file/${encodeURIComponent(
    params.path
  )}`;
  return request.delete(url, await getHeaderConfig()).then((res) => {
    return res.data;
  });
}
// 删除文件夹
export async function deleteFolder(actions, id) {
  const url = `/repo/projects/${id}/repository/commits`;
  const params = {
    branch: 'main',
    commit_message: 'delete file',
    actions: actions,
  };
  return request.post(url, params, await getGitlabConfig()).then((res) => {
    return res.data;
  });
}
// gitlab 文件详情
export async function getGitlabFileDetail(path, id) {
  const url = `/repo/projects/${id}/repository/files/${encodeURIComponent(
    path
  )}?ref=main`;
  return request.get(url, await getGitlabConfig()).then((res) => {
    return res.data;
  });
}

// gitlab 原文件下载
export async function getGitlabFileRaw(params) {
  const url = `/server/repo/${params.user}//${
    params.name
  }/file/${encodeURIComponent(params.path)}/preview`;
  return request.get(url, await getHeaderConfig()).then((res) => {
    return res.data;
  });
}
// gitlab 原文件下载
export async function getGitlabFile(params) {
  const url = `/server/repo/${params.user}//${
    params.name
  }/file/${encodeURIComponent(params.path)}`;
  return request.get(url, await getHeaderConfig()).then((res) => {
    return res.data;
  });
}
// 下载全部
export async function gitlabDownloadAll(id) {
  const url = `/repo/projects/${id}/repository/archive.zip`;
  return request.get(url, await getGitlabConfig()).then((res) => {
    return res.data;
  });
}
export function getGitlabCommit(path, id) {
  const url = `/repo/projects/${id}/repository/commits?path=${path}&trailers=true`;

  const headers = {
    Authorization: ' Bearer hGq8ze9XF6VDsis2t4SY',
  };
  return request.get(url, { headers }).then((res) => {
    return res.data;
  });
}
// 递归查询所有文件
export async function findAllFileByPath(fullPath, path) {
  const url = `/graphql/api/graphql`;
  const params = {
    query:
      'query findAllFileByPath($fullPath:ID!,$path:String)   { project(fullPath: $fullPath) { repository { tree(ref: "main", recursive: true, path:$path ){ blobs{ nodes { name type path } } } } } } ',
    variables: {
      path,
      fullPath,
    },
  };
  return request.post(url, params, await getGitlabConfig()).then((res) => {
    return res.data;
  });
}

export function downloadFile(params) {
  getGitlabFile(params).then((res) => {
    if (res?.data?.content) {
      let blob = new Blob([Base64.toUint8Array(res?.data?.content).buffer], {
        type: 'text/plain;charset=UTF-8',
      });
      let downloadElement = document.createElement('a'); //创建一个a 虚拟标签
      let href = window.URL.createObjectURL(blob); // 创建下载的链接
      // downloadElement.href = href;
      // downloadElement.download = params.path; // 下载后文件名
      // document.body.appendChild(downloadElement);
      // downloadElement.click(); // 点击下载
      // document.body.removeChild(downloadElement); // 下载完成移除元素
      // window.URL.revokeObjectURL(href);
    }
  });
}
