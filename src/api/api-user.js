import { request } from '@/shared/axios';
import { saveUserAuth, getHeaderConfig } from '@/shared/login';

export function buildAuthenticationClient(params) {
  const url = '/oneid/oidc/authorize';
  return request.get(url, { params }).then((res) => res.data);
}

/**
 * 获取用户token
 * @returns
 */
export function queryUserToken(params) {
  const url = '/server/login';
  return request
    .get(url, { $doException: true, params })
    .then((res) => {
      return res.data;
    })
    .catch(() => {
      saveUserAuth();
    });
}

/**
 * 获取用户信息
 * @returns
 */
export async function queryUserInfo(params) {
  const { token, userName } = params;
  if (token) {
    const url = '/server/user';
    return request
      .get(url, { $doException: true, ...getHeaderConfig() })
      .then((res) => {
        return res.data;
      })
      .catch(() => {
        saveUserAuth();
      });
  } else if (userName) {
    const url = `/server/user?account=${userName}`;
    return request
      .get(url, { $doException: true, ...getHeaderConfig() })
      .then((res) => {
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
  return request
    .get(url, { $doException: true, ...getHeaderConfig() })
    .then((res) => {
      return res.data;
    })
    .catch(() => {
      saveUserAuth();
    });
}

/**
 * 获取用户的模型
 * @returns
 */
export function getUserModelData(params, name) {
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
 * 获取用户的数据集
 * @returns
 */
export function getUserDatasetData(params, name) {
  const url = `/server/dataset/${name}`;
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
 * 获取用户的项目
 * @returns
 */
export function getUserProjectData(params, name) {
  const url = `/server/project/${name}`;
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
 * 设置用户信息
 * @returns
 */
export function setUserData(params) {
  const url = '/server/user';
  return request
    .put(url, params, { $doException: true, ...getHeaderConfig() })
    .then((res) => {
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
export function sendCode(reopt) {
  const url = '/server/user/email/sendbind';
  return request
    .post(url, reopt, { $doException: true, ...getHeaderConfig() })
    .then((res) => {
      return res.data;
    });
}
export function bindUserEmail(params) {
  const url = '/server/user/email/bind';
  return request
    .post(url, params, { $doException: true, ...getHeaderConfig() })
    .then((res) => {
      return res.data;
    });
}
export function changeUserEmail(params) {
  const url = '/api/users/change_email/';
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
  const url = '/api/users/send_phone_code/';
  return request.post(url, { phone: reopt }, getHeaderConfig()).then((res) => {
    return res.data;
  });
}
export function keepUserPhone(params) {
  const url = '/api/users/set_phone/';
  return request.post(url, params, getHeaderConfig()).then((res) => {
    return res.data;
  });
}
export function changeUserPhone(params) {
  const url = '/api/users/change_phone/';
  return request.put(url, params, getHeaderConfig()).then((res) => {
    return res.data;
  });
}

/**
 * 排行榜
 * @returns
 */
export function getRank() {
  const url = '/api/base/statistics/';
  return request.put(url, null, getHeaderConfig()).then((res) => {
    return res.data;
  });
}
/**
 * 获取用户参加的所有、进行中、已结束的比赛
 * @returns
 */
export function getUserCompetition(params) {
  const url = '/server/competition';
  return request
    .get(url, { ...{ params }, ...getHeaderConfig() })
    .then((res) => {
      return res;
    });
}

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
  const url = '/server/user/following';
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
  return request
    .delete(url, { ...{ data: params }, ...getHeaderConfig() })
    .then((res) => {
      return res.data;
    });
}

/**
 * 用户的粉丝列表
 * @returns
 */
export function getUserFans(name) {
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
  return request.get(url, getHeaderConfig()).then((res) => {
    return res.data;
  });
}
/**
 * 检查邮箱是否存在
 */
export function checkEmail() {
  const url = '/server/user/check_email';
  return request.get(url, getHeaderConfig()).then((res) => {
    return res.data;
  });
}
/**
 * 获取验证图片  以及token
 */
export function reqGet(data) {
  const url = '/oneid/captcha/get';
  return request.post(url, data).then((res) => res.data);
}

/**
 * 滑动或者点选验证
 */
export function reqCheck(data) {
  const url = '/oneid/captcha/check';
  return request.post(url, data).then((res) => res.data);
}
