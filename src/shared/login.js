import {
  queryAppId,
  queryUserInfo,
  queryUserToken,
  queryUserIdToken,
} from '@/api/api-user';
import { AuthenticationClient } from 'authing-js-sdk';
import { useLoginStore, useUserInfoStore } from '@/stores';

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

const LOGIN_KEYS = {
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
    const res = await queryUserToken(params);
    if (res.status === 200) {
      const { token = '' } = res.data;
      saveUserAuth(token);
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
    } else {
      setStatus(LOGIN_STATUS.FAILED);
      saveUserAuth();
      // goAuthorize();
    }
  } catch (error) {
    setStatus(LOGIN_STATUS.FAILED);
    console.error('获取用户信息失败！');
  }
}

function afterLogined(userInfo) {
  const {
    id,
    token = localStorage.getItem(LOGIN_KEYS.USER_TOKEN),
    username: userName,
    fans_list: fansList,
    follow_list: followList,
    models_digg_list: modelDiggList,
    datasets_digg_list: datasetDiggList,
    organization_list: organizationList,
    organization_admin_list: organizationAdminList,
    user_detail: {
      avatar_url: avatar,
      description,
      gitee,
      github,
      nickname: nickName,
    },
    user_email: { email, is_active },
    bonus = 0,
  } = userInfo;

  if (!id || !token) {
    setStatus(LOGIN_STATUS.FAILED);
    saveUserAuth();
    return console.error('用户信息不正确！');
  }

  saveUserAuth(token);
  setStatus(LOGIN_STATUS.DONE);

  const userInfoStore = useUserInfoStore();
  userInfoStore.id = id;
  userInfoStore.token = token;
  userInfoStore.userName = userName;
  userInfoStore.avatar = avatar;
  userInfoStore.description = description;
  userInfoStore.nickName = nickName;
  userInfoStore.gitee = gitee;
  userInfoStore.github = github;
  userInfoStore.fansList = fansList;
  userInfoStore.followList = followList;
  userInfoStore.modelDiggList = modelDiggList;
  userInfoStore.datasetDiggList = datasetDiggList;
  userInfoStore.organizationList = organizationList;
  userInfoStore.organizationAdminList = organizationAdminList;

  userInfoStore.email = email;
  userInfoStore.emailStatus = is_active;
  userInfoStore.bonus = bonus;
}

// 登录
export async function doLogin() {
  const query = getUrlParam();
  const { token } = getUserAuth();
  if (query.code && query.state) {
    await getUserToken({
      code: query.code,
      origin: `${window.location.href}`,
    });
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
    const res = await queryAppId();
    if (res.status === 200) {
      const { appid: appId, apphost: appHost } = res.data;
      const { token } = getUserAuth();
      const idTokenRes = await queryUserIdToken({ token });
      const { id_token: idToken } = idTokenRes.data;
      const redirectUri = window.location.origin;
      if (idTokenRes.status === 200) {
        const client = new AuthenticationClient({
          appId,
          appHost,
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
      } else {
        console.error('退出失败！');
      }
    } else {
      console.error('退出失败！');
    }
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

      if (res.status === 200 && res.data) {
        afterLogined(res.data);
      } else {
        logout();
        setStatus(LOGIN_STATUS.FAILED);
        throw new Error(res.status + ' ' + res.msg);
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
    const res = await queryAppId();
    if (res.status === 200) {
      const client = new AuthenticationClient({
        appId: res.data.appid,
        appHost: res.data.apphost,
        redirectUri: `${window.location.href}`,
      });
      // 构造 OIDC 授权登录 URL
      const url = client.buildAuthorizeUrl();
      window.location.href = url;
    } else {
      setStatus(LOGIN_STATUS.FAILED);
      console.error('获取登录信息失败！');
    }
  } catch (error) {
    setStatus(LOGIN_STATUS.FAILED);
    console.error('获取登录信息失败！');
  }
}
