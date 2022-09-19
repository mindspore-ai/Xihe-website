import { request } from '@/shared/axios';
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

export function getModelById(user, repoName) {
  // const url = `/server/model/${user}/${repoName}`;
  const url = '/server/model/888/6315f1007187a3b38b417638';
  return request.get(url, getHeaderConfig()).then((res) => {
    return res.data;
  });
}
//上传文件
export async function uploadFileGitlab(params, path) {
  const url = `/repo/projects/2/repository/files/${encodeURIComponent(path)}`;
  return request.post(url, params, await getGitlabConfig()).then((res) => {
    return res.data;
  });
}
//更新上传文件
export async function editorFileGitlab(params, path) {
  const url = `/repo/projects/2/repository/files/${encodeURIComponent(path)}`;
  return request.put(url, params, await getGitlabConfig()).then((res) => {
    return res.data;
  });
}
// 获取 gitlab 树
export async function getGitlabTree(path, id) {
  const url = `/repo/projects/2/repository/tree?path=${path}`;
  return request.get(url, await getGitlabConfig()).then((res) => {
    return res.data;
  });
}
// 删除文件
export async function deleteFile(path, id) {
  const url = `/repo/projects/2/repository/files/${encodeURIComponent(path)}`;
  const params = {
    branch: 'main',
    commit_message: 'delete file',
  };

  return request
    .delete(url, { params, ...(await getGitlabConfig()) })
    .then((res) => {
      return res.data;
    });
}
// gitlab 文件详情
export async function getGitlabFileDetail(path, id) {
  const url = `/repo/projects/2/repository/files/${encodeURIComponent(
    path
  )}?ref=main`;
  return request.get(url, await getGitlabConfig()).then((res) => {
    return res.data;
  });
}
// gitlab 原文件下载
export async function getGitlabFileRaw(path, id) {
  const url = `/repo/projects/2/repository/files/${encodeURIComponent(
    path
  )}/raw?ref=main`;

  return request.get(url, await getGitlabConfig()).then((res) => {
    return res.data;
  });
}
// 下载全部
export async function gitlabDownloadAll(id) {
  const url = `/repo/projects/2/repository/archive.zip`;
  return request.get(url, await getGitlabConfig()).then((res) => {
    return res.data;
  });
}
export function getGitlabCommit(id, path) {
  // const url = `/graphql/api/graphql`;
  // const params = {
  //   operationName: 'getPaginatedTree',
  //   query:
  //     'fragment TreeEntry on Entry {\n  __typename\n  id\n  sha\n  name\n  flatPath\n  type\n }\n\nquery getPaginatedTree($projectPath: ID!, $path: String, $ref: String!, $nextPageCursor: String) {\n  project(fullPath: $projectPath) {\n    id\n    __typename\n    repository {\n      __typename\n      paginatedTree(path: $path, ref: $ref, after: $nextPageCursor) {\n        __typename\n        pageInfo {\n          __typename\n          endCursor\n          startCursor\n          hasNextPage\n        }\n        nodes {\n          __typename\n          trees {\n            __typename\n            nodes {\n              ...TreeEntry\n              webPath\n              __typename\n            }\n          }\n          submodules {\n            __typename\n            nodes {\n              ...TreeEntry\n              webUrl\n              treeUrl\n              __typename\n            }\n          }\n          blobs {\n            __typename\n            nodes {\n              ...TreeEntry\n              mode\n              webPath\n              lfsOid\n              __typename\n            }\n          }\n        }\n      }\n    }\n  }\n}\n',
  //   variables: {
  //     nextPageCursor: '',
  //     pageSize: 100,
  //     path: '/',
  //     projectPath: '888/model-firstModel',
  //     ref: 'main',
  //   },
  // };
  const url = `/repo/projects/${id}/repository/commits?path=${path}`;

  const headers = {
    Authorization: ' Bearer hGq8ze9XF6VDsis2t4SY',
  };
  const params = {
    path: path,
  };
  return request.get(url, { headers }).then((res) => {
    return res.data;
  });
}
