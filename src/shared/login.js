import {
  queryUserInfo,
  queryUserToken,
  queryUserIdToken,
} from '@/api/api-user';
import { useLoginStore, useUserInfoStore } from '@/stores';
import Cookies from 'js-cookie';
import { ElMessage } from 'element-plus';

const APP_ID = import.meta.env.VITE_APP_ID;
const LOGIN_URL = import.meta.env.VITE_LOGIN_URL;
const LOGOUT_URL = import.meta.env.VITE_LOGOUT_URL;

// 登录事件
export const LOGIN_EVENTS = {
  SHOW_LOGIN: 'show-login',
  LOGOUT: 'do-logout',
  LOGINED: 'logined',
};

// 登录状态
// -1: 登录失败；0：未登录；1：登录中；2：登录成功
export const LOGIN_STATUS = {
  FAILED: -1,
  NOT: 0,
  DOING: 1,
  DONE: 2,
};

export const LOGIN_KEYS = {
  SERVE_CODE: 'CSRF-Token',
};

// 修改pinia登录状态
function setStatus(status) {
  const loginStore = useLoginStore();
  loginStore.loginStatus = status;
}

// 获取存在服务端的CSRF-Token
export function getHeaderConfig() {
  const headersConfig = Cookies.get(LOGIN_KEYS.SERVE_CODE)
    ? {
        headers: {
          'csrf-token': Cookies.get(LOGIN_KEYS.SERVE_CODE),
        },
      }
    : {};
  return headersConfig;
}

// 获取url回调参数
function getUrlParam(url = window.location.search) {
  const param = {};
  const arr = url.split('?');
  if (arr[1]) {
    const _arr = arr[1].split('&') || [];
    _arr.forEach((item) => {
      const it = item.split('=');
      if (it.length === 2) {
        param[it[0]] = it[1];
      }
    });
  }
  return param;
}

// code换token
async function getUserToken(params) {
  try {
    // 去掉url中的code
    const newUrl = window.location.href.replace(/\?code=(.)+/g, '');
    await queryUserToken({ ...params, redirect_uri: newUrl });
    window.location.href = newUrl;
  } catch (error) {
    const newUrl = window.location.href.replace(/\?code=(.)+/g, '');
    window.location.href = newUrl;
    setStatus(LOGIN_STATUS.FAILED);
  }
}

// 存储用户token至本地，用于下次登录
export function saveUserAuth(code) {
  if (!code) {
    const userInfoStore = useUserInfoStore();
    userInfoStore.$reset();
  }
}

function afterLogined(userInfo) {
  const {
    id,
    account: userName,
    bio: description,
    avatar_id: avatar,
    email,
    follower_count: fansCount,
    following_count: followingCount,
    bonus = 0,
  } = userInfo;

  if (!id) {
    setStatus(LOGIN_STATUS.FAILED);
    saveUserAuth();
  }

  setStatus(LOGIN_STATUS.DONE);

  const userInfoStore = useUserInfoStore();
  userInfoStore.id = id;
  userInfoStore.userName = userName;
  userInfoStore.description = description;
  userInfoStore.avatar = avatar;
  userInfoStore.email = email;
  userInfoStore.fansCount = fansCount;
  userInfoStore.followingCount = followingCount;
  userInfoStore.bonus = bonus;
}
// 获取本地token
export function getUserAuth() {
  return {
    token: Cookies.get(LOGIN_KEYS.SERVE_CODE) || '',
  };
}

// 退出
export async function logout() {
  try {
    const userName = useUserInfoStore().userName;
    const idTokenRes = await queryUserIdToken({ userName });
    const { info: idToken } = idTokenRes.data;
    const redirectUri = `${window.location.origin}/`;

    setStatus(LOGIN_STATUS.NOT);
    saveUserAuth();
    window.location.href = `${LOGOUT_URL}/logout?redirect_uri=${redirectUri}&id_token=${idToken}`;
  } catch (error) {
    ElMessage({
      type: 'error',
      message: 'error',
    });
  }
}

// 请求用户信息
export async function requestUserInfo() {
  const { token } = getUserAuth();
  if (token) {
    try {
      setStatus(LOGIN_STATUS.DOING);
      const res = await queryUserInfo({
        token,
      });
      if (res.data) {
        afterLogined(res.data);
      } else {
        logout();
        setStatus(LOGIN_STATUS.FAILED);
      }
    } catch (err) {
      logout();
      setStatus(LOGIN_STATUS.FAILED);
    }
  }
}
// 登录
export async function doLogin() {
  const query = getUrlParam();
  const { token } = getUserAuth();
  if (query.code && query.state) {
    await getUserToken({ code: query.code });
  } else if (token) {
    await requestUserInfo();
  }
}

// authing认证
export async function goAuthorize() {
  try {
    window.location.href = `${LOGIN_URL}/oneid/oidc/authorize?client_id=${APP_ID}&redirect_uri=${decodeURI(
      window.location.href
    )}&response_type=code&scope=openid+profile+email+phone+address+username+id_token`;
  } catch (error) {
    setStatus(LOGIN_STATUS.FAILED);
  }
}
