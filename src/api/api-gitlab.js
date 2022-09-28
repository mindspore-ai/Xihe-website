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
// 获取仓库详情
export function getRepoDetailByName(params) {
  const url = `/server/${params.modular}/${params.user}/${params.repoName}`;
  // console.log('url: ', url);
  return request.get(url, getHeaderConfig()).then((res) => {
    return res.data;
  });
}
//上传文件
export async function uploadFileGitlab(params, path) {
  const url = `/repo/projects/${
    params.id
  }/repository/files/${encodeURIComponent(path)}`;
  return request.post(url, params, await getGitlabConfig()).then((res) => {
    return res.data;
  });
}
//更新上传文件
export async function editorFileGitlab(params, path) {
  const url = `/repo/projects/${
    params.id
  }/repository/files/${encodeURIComponent(path)}`;
  return request.put(url, params, await getGitlabConfig()).then((res) => {
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
export async function deleteFile(path, id) {
  const url = `/repo/projects/${id}/repository/files/${encodeURIComponent(
    path
  )}`;
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
// 删除文件夹
export async function deleteFolder(path, id) {
  const url = `/projects/${id}/repository/commits`;
  const params = {
    branch: 'main',
    commit_message: 'delete file',
    actions: [{}],
  };

  return request
    .delete(url, { params, ...(await getGitlabConfig()) })
    .then((res) => {
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
export async function getGitlabFileRaw(path, id) {
  const url = `/repo/projects/${id}/repository/files/${encodeURIComponent(
    path
  )}/raw?ref=main`;

  return request.get(url, await getGitlabConfig()).then((res) => {
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
  const url = `/repo/projects/${id}/repository/commits?path=${path}&per_page=100`;

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
      'query findAllFileByPath($fullPath:ID!,$path:String)   { project(fullPath: $fullPath) { repository { tree(ref: "main", recursive: true, path:$path ,pre_page:1000){ blobs{ nodes { name type path } } } } } } ',
    variables: {
      path,
      fullPath,
    },
  };
  return request.post(url, params, await getGitlabConfig()).then((res) => {
    return res.data;
  });
}

export function downloadFile(path, id) {
  getGitlabFileRaw(path, id).then((res) => {
    let blob = new Blob([res], { type: 'text/plain;charset=UTF-8' });
    let downloadElement = document.createElement('a'); //创建一个a 虚拟标签
    let href = window.URL.createObjectURL(blob); // 创建下载的链接
    downloadElement.href = href;
    downloadElement.download = path; // 下载后文件名
    document.body.appendChild(downloadElement);
    downloadElement.click(); // 点击下载
    document.body.removeChild(downloadElement); // 下载完成移除元素
    window.URL.revokeObjectURL(href);
  });
}
