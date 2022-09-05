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
  const url = `/repo/gzbang/gitlab`;
  return request.get(url, getHeaderConfig()).then((res) => {
    return res.data;
  });
}
