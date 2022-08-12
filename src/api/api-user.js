import { request } from '@/shared/axios';
import { useUserInfoStore } from '@/stores';

function getHeaderConfig() {
  let headersConfig = {
    headers: {
      Authorization: useUserInfoStore().token
        ? `Bearer ${useUserInfoStore().token}`
        : '',
    },
  };
  return headersConfig;
}

/**
 * 获取应用Id
 * @returns
 */
export function queryAppId() {
  const url = '/api/users/appid/';
  return request.get(url).then((res) => {
    return res.data;
  });
}

/**
 * 获取用户token
 * @returns
 */
export function queryUserToken(params) {
  const url = '/server/login/';
  return request.post(url, params).then((res) => {
    return res.data;
  });
}

/**
 * 获取用户idToken
 * @returns
 */
export function queryUserIdToken(params) {
  const { token } = params;
  const url = '/api/users/idtoken_bytoken/';
  return request
    .get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      return res.data;
    });
}

/**
 * 获取用户信息
 * @returns
 */
export async function queryUserInfo(params) {
  const { token, userName } = params;
  if (token) {
    const url = `/api/users/userinfo_bytoken/`;
    return request
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        return res.data;
      });
  } else if (userName) {
    const url = `/api/users/?username=${userName}`;
    return request.get(url).then((res) => {
      return res.data;
    });
  }
}

/**
 * 获取用户模型信息
 * @returns
 */
export function getUserModelData(id) {
  const url = `/api/users/${id}/models`;
  return request.get(url, getHeaderConfig()).then((res) => {
    return res.data;
  });
}
/**
 * 获取用户数据集信息
 * @returns
 */
export function getUserDatasetData(id) {
  const url = `/api/users/${id}/datasets`;
  return request.get(url, getHeaderConfig()).then((res) => {
    return res.data;
  });
}

/**
 * 获取用户项目信息
 * @returns
 */
export function getProjectData(id) {
  const url = `/api/users/${id}/projects`;
  return request.get(url, getHeaderConfig()).then((res) => {
    return res.data;
  });
}

/**
 * 设置用户信息
 * @returns
 */
export function setUserData(params) {
  const url = '/api/users/';
  return request.put(url, params, getHeaderConfig()).then((res) => {
    return res.data;
  });
}
/**
 * 关注用户or取消关注
 * @returns
 */
export function getUserDig(reopt) {
  const url = `/api/users/${reopt.userId}/users/${reopt.fans.id}`;
  return request.put(url, reopt, getHeaderConfig()).then((res) => {
    return res.data;
  });
}
export function getUserDig2(reopt) {
  const url = `/api/users/${reopt.userId}/users/${reopt.follow.id}`;
  return request.put(url, reopt, getHeaderConfig()).then((res) => {
    return res.data;
  });
}

/**
 * 邮箱
 * @returns
 */
export function getUserEmail(id) {
  const url = `/api/users/${id}/email`;
  return request.get(url, getHeaderConfig()).then((res) => {
    return res.data;
  });
}
export function setUserEmail(reopt) {
  const url = `/api/users/send_email_code/${reopt.scene.value}`;
  return request
    .post(url, { email: reopt.email }, getHeaderConfig())
    .then((res) => {
      return res.data;
    });
}
export function keepUserEmail(params) {
  const url = `/api/users/set_email/`;
  return request.post(url, params, getHeaderConfig()).then((res) => {
    return res.data;
  });
}
export function changeUserEmail(params) {
  const url = `/api/users/change_email/`;
  return request.put(url, params, getHeaderConfig()).then((res) => {
    return res.data;
  });
}
/**
 * 手机号
 * @returns
 */
export function getUserPhone(id) {
  const url = `/api/users/${id}/mobile`;
  return request.get(url, getHeaderConfig()).then((res) => {
    return res.data;
  });
}
export function setUserPhone(reopt) {
  const url = `/api/users/send_phone_code/`;
  return request.post(url, { phone: reopt }, getHeaderConfig()).then((res) => {
    return res.data;
  });
}
export function keepUserPhone(params) {
  const url = `/api/users/set_phone/`;
  return request.post(url, params, getHeaderConfig()).then((res) => {
    return res.data;
  });
}
export function changeUserPhone(params) {
  const url = `/api/users/change_phone/`;
  return request.put(url, params, getHeaderConfig()).then((res) => {
    return res.data;
  });
}

/**
 * 用户动态
 * @returns
 */
export function getUserLive(id) {
  const url = `/api/users/actions/actions/${id}`;
  return request.get(url).then((res) => {
    return res.data;
  });
}

/**
 * 用户收藏
 * @returns
 */
export function getUserCollection(id) {
  const url = `/api/users/actions/digg/${id}`;
  return request.get(url).then((res) => {
    return res.data;
  });
}
