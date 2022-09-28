import { request } from '@/shared/axios';
import { LOGIN_KEYS } from '@/shared/login';

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

/**
 * 获取用户token
 * @returns
 */
export function queryUserToken(params) {
  const url = `/server/login`;
  return request.get(url, { params }).then((res) => {
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
    const url = `/server/user`;
    return request.get(url, getHeaderConfig()).then((res) => {
      return res.data;
    });
  } else if (userName) {
    const url = `/server/user?account=${userName}`;
    return request.get(url).then((res) => {
      return res.data;
    });
  }
}

/**
 * 获取用户idToken
 * @returns
 */
export function queryUserIdToken(params) {
  const url = `/server/login/${params.userName}`;
  return request.get(url, getHeaderConfig()).then((res) => {
    return res.data;
  });
}

/**
 * 获取用户模型信息
 * @returns
 */
/* export function getUserModelData(id) {
  const url = `/api/users/${id}/models`;
  return request.get(url, getHeaderConfig()).then((res) => {
    return res.data;
  });
} */
export function getUserModelData(params, name) {
  console.log('params: ', params);
  const url = `/server/model/${name}`;
  let header = getHeaderConfig();
  // 登录之后携带token
  return request
    .get(url, {
      params,
      ...header,
    })
    .then((res) => {
      return res.data;
    });
}
/**
 * 获取用户数据集信息
 * @returns
 */
/* export function getUserDatasetData(id) {
  const url = `/api/users/${id}/datasets`;
  return request.get(url, getHeaderConfig()).then((res) => {
    return res.data;
  });
} */
export function getDatasetData(params) {
  const url = `/api/datasets/`;
  let header = getHeaderConfig();
  // 登录之后携带token
  if (getUserInfo().token) {
    return request
      .get(url, {
        params,
        ...header,
      })
      .then((res) => {
        return res.data;
      });
  } else {
    return request.get(url, { params }).then((res) => {
      return res.data;
    });
  }
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

// TODO:换后台的接口
/**
 * 用户动态
 * @returns
 */
export function getUserLive(name) {
  const url = `/server/user/activity/${name}`;
  return request.get(url, getHeaderConfig()).then((res) => {
    return res.data;
  });
}

/**
 * 用户收藏
 * @returns
 */
export function getUserCollection(name) {
  const url = `/server/user/like/${name}`;
  return request.get(url, getHeaderConfig()).then((res) => {
    return res.data;
  });
}

/**
 * 关注他人
 * @returns
 */
export function getFollowing(params) {
  const url = `/server/user/following`;
  return request.post(url, params, getHeaderConfig()).then((res) => {
    return res.data;
  });
}

/**
 * 取消关注他人
 * @returns
 */
export function cancelFollowing(params) {
  const url = `/server/user/following/${params.account}`;
  debugger;
  return request
    .delete(url, Object.assign({ data: params }, getHeaderConfig()))
    .then((res) => {
      return res.data;
    });
}

/**
 * 用户的粉丝列表
 * @returns
 */
export function getUserFans(name) {
  console.log('name: ', name);
  const url = `/server/user/follower/${name}`;
  return request.get(url, getHeaderConfig()).then((res) => {
    return res.data;
  });
}

/**
 * 用户的关注列表
 * @returns
 */
export function getUserFollow(name) {
  const url = `/server/user/following/${name}`;
  return request
    .get(url, getHeaderConfig())
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log(err);
    });
}
