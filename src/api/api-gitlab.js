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

export function getGitlabToken() {
  const url = `/server/888/gitlab`;
  return request.get(url, getHeaderConfig()).then((res) => {
    return res.data;
  });
}

export function creatModelRepo() {
  const url = `/server/model`;
  const params = {
    desc: '描述',
    name: 'firstModel',
    owner: '888',
    protocol: 'mit',
    repo_type: 'public',
  };
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

export function uploadFileGitlab() {
  const url = `/repo/projects/2/repository/files/${encodeURIComponent(
    'app%2Fproject%2Erb2'
  )}`;
  const headers = {
    'PRIVATE-TOKEN': 'hGq8ze9XF6VDsis2t4SY',
  };
  const data = {
    branch: 'main',
    author_email: '845831435@qq.com',
    author_name: '888',
    content: '第一文件',
    commit_message: 'commit_message',
  };
  return request.post(url, data, { headers }).then((res) => {
    return res.data;
  });
}

export function getGitlabTree() {
  const url = '/repo/projects/2/repository/tree';
  const headers = {
    'PRIVATE-TOKEN': 'hGq8ze9XF6VDsis2t4SY',
  };
  return request.get(url, { headers }).then((res) => {
    return res.data;
  });
}
