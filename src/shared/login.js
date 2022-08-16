import {
  queryUserInfo,
  queryUserToken,
  queryUserIdToken,
} from '@/api/api-user';
import { AuthenticationClient } from 'authing-js-sdk';
import { useLoginStore, useUserInfoStore } from '@/stores';

const APP_ID = '62f463c917a9cd81591e0be1';
const APP_HOST = 'https://xihe-test2-cz.authing.cn';

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
  USER_TOKEN: '_XIHE_U_T_',
};

// 修改pinia登录状态
function setStatus(status) {
  const loginStore = useLoginStore();
  loginStore.loginStatus = status;
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
  if (localStorage.getItem('XIHE_INVITED')) {
    params.invited = localStorage.getItem('XIHE_INVITED');
  }
  try {
    await queryUserToken(params);
    // 去掉url中的code
    const newUrl = window.location.href.replace(/\?code=(.)+/g, '');
    window.location.href = newUrl;

    // WARNING: 该方法会导致code无法清除
    // if (window.history.replaceState) {
    //   window.history.replaceState({}, '', newUrl);
    //   await requestUserInfo();
    // } else {
    //   window.location.href = newUrl;
    // }
  } catch (error) {
    const newUrl = window.location.href.replace(/\?code=(.)+/g, '');
    window.location.href = newUrl;
    setStatus(LOGIN_STATUS.FAILED);
    console.error('获取用户信息失败！');
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
    return console.error('用户信息不正确！');
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

// 登录
export async function doLogin() {
  const query = getUrlParam();
  const { token } = getUserAuth();
  if (query.code && query.state) {
    debugger;
    await getUserToken({ code: query.code });
  } else if (token) {
    await requestUserInfo();
  }
}

// 存储用户token至本地，用于下次登录
export function saveUserAuth(token) {
  if (!token) {
    localStorage.removeItem(LOGIN_KEYS.USER_TOKEN);
    const userInfoStore = useUserInfoStore();
    userInfoStore.$reset();
  } else {
    localStorage.removeItem('XIHE_INVITED');
    localStorage.setItem(LOGIN_KEYS.USER_TOKEN, token);
  }
}

// 获取本地token
export function getUserAuth() {
  return {
    token: localStorage.getItem(LOGIN_KEYS.USER_TOKEN) || '',
  };
}

// 退出
export async function logout() {
  try {
    const userName = useUserInfoStore().userName;
    const idTokenRes = await queryUserIdToken({ userName });
    const { info: idToken } = idTokenRes.data;
    const redirectUri = window.location.origin;
    const client = new AuthenticationClient({
      appId: APP_ID,
      appHost: APP_HOST,
      redirectUri,
      idToken,
    });

    // 构造 OIDC 登出URL
    const url = client.buildLogoutUrl({
      protocol: 'oidc',
      expert: true,
      redirectUri,
      idToken,
    });
    setStatus(LOGIN_STATUS.NOT);
    saveUserAuth();
    window.location.href = url;
  } catch (error) {
    console.error('退出失败！');
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
        console.error('获取用户信息失败：', err);
      }
    } catch (err) {
      logout();
      setStatus(LOGIN_STATUS.FAILED);
      console.error('获取用户信息失败：', err);
    }
  }
}

// authing认证
export async function goAuthorize() {
  try {
    const client = new AuthenticationClient({
      appId: APP_ID,
      appHost: APP_HOST,
      redirectUri: `${window.location.href}`,
    });
    // 构造 OIDC 授权登录 URL
    const url = client.buildAuthorizeUrl({
      scope: 'openid profile email phone address username',
    });
    window.location.href = url;
  } catch (error) {
    setStatus(LOGIN_STATUS.FAILED);
    console.error('获取登录信息失败！');
  }
}
