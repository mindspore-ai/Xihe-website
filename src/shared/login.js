import { Guard, GuardMode } from '@authing/native-js-ui-components';
import { queryAppId, queryAuthentication, queryUserInfo } from '@/api/api-user';

import { useLoginStore, useUserInfoStore } from '@/stores';

let guard = null;
let authId = '';
let authIdentity = '';

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
  USER_TOKEN: '_U_T_',
  USER_ID: '_U_I_',
};

function setStatus(status) {
  const loginStore = useLoginStore();
  loginStore.loginStatus = status;
}

// 登录
export async function doLogin() {
  if (authId) {
    try {
      setStatus(LOGIN_STATUS.DOING);
      // 使用用户id和身份源id获取用户token及其他信息
      const res = await queryAuthentication({
        sub: authId,
        federationIdentityId: authIdentity,
      });

      if (res.status === 200 && res.data) {
        afterLogined(res.data);
      } else {
        throw new Error(res.status + ' ' + res.msg);
      }
    } catch (error) {
      setStatus(LOGIN_STATUS.FAILED);
      saveUserAuth();
      console.error('授权获取用户信息失败：', error);
    }
  } else {
    await requestUserInfo();
  }
}

// 存储用户id及token，用于下次登录
export function saveUserAuth(id, token) {
  if (!id && !token) {
    localStorage.removeItem(LOGIN_KEYS.USER_ID);
    localStorage.removeItem(LOGIN_KEYS.USER_TOKEN);

    authId = '';

    const userInfoStore = useUserInfoStore();
    userInfoStore.$reset();
  } else {
    localStorage.setItem(LOGIN_KEYS.USER_ID, id);
    localStorage.setItem(LOGIN_KEYS.USER_TOKEN, token);
  }
}

// 获取用户id及token
export function getUserAuth() {
  let token = localStorage.getItem(LOGIN_KEYS.USER_TOKEN);
  let id = localStorage.getItem(LOGIN_KEYS.USER_ID);
  if (token === 'undefined' || id === 'undefined') {
    saveUserAuth();
    token = '';
    id = 0;
  } else {
    id = parseInt(id);
  }
  return {
    id,
    token,
  };
}

// 显示登录组件
export function showLogin() {
  const loginStore = useLoginStore();
  loginStore.loginStatus = LOGIN_EVENTS.SHOW_LOGIN;
}

// 退出
export function logout() {
  setStatus(LOGIN_STATUS.NOT);
  saveUserAuth();
}

// 请求用户信息
export async function requestUserInfo() {
  const { id, token } = getUserAuth();
  if (id && token) {
    try {
      setStatus(LOGIN_STATUS.DOING);
      const res = await queryUserInfo({
        id,
        token,
      });

      if (res.status === 200 && res.data) {
        afterLogined(res.data);
      } else {
        setStatus(LOGIN_STATUS.FAILED);
        saveUserAuth();
        throw new Error(res.status + ' ' + res.msg);
      }
    } catch (err) {
      setStatus(LOGIN_STATUS.FAILED);
      saveUserAuth();
      console.error('获取用户信息失败：', err);
    }
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
  } = userInfo;

  if (!id || !token) {
    setStatus(LOGIN_STATUS.FAILED);
    saveUserAuth();
    return console.error('用户信息不正确！');
  }

  saveUserAuth(id, token);
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
}

export function reLogin() {
  logout();
  showLogin();
}

/**
 * 调用登录组件
 * @returns
 */
export async function initGuard() {
  if (!guard) {
    try {
      const res = await queryAppId();
      if (res.status === 200) {
        // 初始化登录组件
        guard = new Guard(res.data.appid, {
          title: '羲和平台',
          mode: GuardMode.Modal,
          clickCloseable: true,
          escCloseable: true,
        });
        guard.on('login', (authClient) => {
          if (authClient && authClient.id) {
            // 用户id
            authId = authClient.id;
            // 身份源id
            authIdentity = authClient.federationIdentityId || '';
            // 登录，获取用户token
            doLogin();

            setTimeout(() => {
              guard.hide();
              removeGuard();
            }, 300);
          }
        });
      } else {
        console.error('获取登录信息失败！');
      }
    } catch (error) {
      console.error('获取登录信息失败！');
    }
  }
  return guard;
}

export async function goAuthorize() {
  const guard = await initGuard();
  if (guard) {
    guard.show();
  }
}

export function removeGuard() {
  guard = null;
}
