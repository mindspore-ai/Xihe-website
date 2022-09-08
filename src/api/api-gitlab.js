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

export function getGitlabToken() {
  const url = `/server/${getUserInfo().userName}/gitlab`;
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

export function getModelById() {
  const url = '/server/model/888/6315f1007187a3b38b417638';
  return request.get(url, getHeaderConfig()).then((res) => {
    return res.data;
  });
}

export function uploadFileGitlab(params, path) {
  const url = `/repo/projects/2/repository/files/${encodeURIComponent(path)}`;
  const headers = {
    'PRIVATE-TOKEN': 'hGq8ze9XF6VDsis2t4SY',
  };
  return request.post(url, params, { headers }).then((res) => {
    return res.data;
  });
}
// 获取 gitlab 树
export function getGitlabTree(path) {
  console.log(path);
  const url = `/repo/projects/2/repository/tree?path=${path}`;
  const headers = {
    'PRIVATE-TOKEN': 'hGq8ze9XF6VDsis2t4SY',
  };
  return request.get(url, { headers }).then((res) => {
    return res.data;
  });
}
// 删除文件
export function deleteFile(path, id) {
  console.log(path);
  const url = `/repo/projects/2/repository/files/${encodeURIComponent(path)}`;
  const params = {
    branch: 'main',
    commit_message: 'delete file',
  };
  const headers = {
    'PRIVATE-TOKEN': 'hGq8ze9XF6VDsis2t4SY',
  };
  return request.delete(url, { params, headers }).then((res) => {
    return res.data;
  });
}
// gitlab 文件下载
export function getGitlabFileDetail(path) {
  const url = `/repo/projects/2/repository/files/${encodeURIComponent(
    path
  )}?ref=main`;
  const headers = {
    'PRIVATE-TOKEN': 'hGq8ze9XF6VDsis2t4SY',
  };
  return request.get(url, { headers }).then((res) => {
    return res.data;
  });
}
export function getGitlabFileRaw(path) {
  const url = `/repo/projects/2/repository/files/${encodeURIComponent(
    path
  )}/raw?ref=main`;
  const headers = {
    responseType: 'blob',
    'PRIVATE-TOKEN': 'hGq8ze9XF6VDsis2t4SY',
  };
  return request.get(url, { headers }).then((res) => {
    return res.data;
  });
}
