import { LOGIN_STATUS } from '@/shared/login';
import { defineStore } from 'pinia';

// 登录
export const useLoginStore = defineStore('login', {
  state: () => {
    return {
      loginEvent: '',
      loginStatus: LOGIN_STATUS.NOT,
    };
  },
  actions: {
    setLoginEvent(envent) {
      this.loginEvent = envent;
    },
    setLoginStatus(status) {
      this.loginStatus = status;
    },
  },
  getters: {
    // 登录失败
    isLoginFailed() {
      return this.loginStatus === LOGIN_STATUS.NOT;
    },
    // 未登录
    isLoginNot() {
      return this.loginStatus === LOGIN_STATUS.NOT;
    },
    // 登录中
    isLoggingIn() {
      return this.loginStatus === LOGIN_STATUS.DOING;
    },
    // 登录成功
    isLogined() {
      return this.loginStatus === LOGIN_STATUS.DONE;
    },
  },
});

// 用户信息
export const useUserInfoStore = defineStore('userInfo', {
  state: () => {
    return {
      id: null, // id
      token: '', // token
      userName: '', // userName
      avatar: '', // 头像
      description: '', // 个人描述
      nickName: '', // 昵称
      gitee: '', // gitee账号
      github: '', // github账号
      fansList: [], // 粉丝列表
      followList: [], // 关注列表
      modelDiggList: [], // 模型点赞信息列表
      datasetDiggList: [], // 数据集点赞信息列表
      organizationList: [], // 组织列表
      organizationAdminList: [], // 可转移组织列表
      phone: null,
      email: null,
      emailStatus: false, // 邮箱状态
    };
  },
  getters: {
    fansCount() {
      return this.fansList.length;
    },
    followCount() {
      return this.followList.length;
    },
    modelDiggCount() {
      return this.modelDiggList.length;
    },
    datasetDiggCount() {
      return this.datasetDiggList.length;
    },
    organizationCount() {
      return this.organizationList.length;
    },
    owner() {
      return [{ id: this.id, name: this.userName }];
    },
  },
});

// 访客信息
export const useVisitorInfoStore = defineStore('visitorInfo', {
  state: () => {
    return {
      id: null, // id
      userName: '', // userName
      avatar: '', // 头像
      description: '', // 个人描述
      nickName: '', // 昵称
      gitee: '', // gitee账号
      github: '', // github账号
      fansList: [], // 粉丝列表
      followList: [], // 关注列表
      modelDiggList: [], // 模型点赞信息列表
      datasetDiggList: [], // 数据集点赞信息列表
      organizationList: [], // 组织列表
      email: null,
      emailStatus: false, // 邮箱状态
    };
  },
  getters: {
    fansCount() {
      return this.fansList.length;
    },
    followCount() {
      return this.followList.length;
    },
    modelDiggCount() {
      return this.modelDiggList.length;
    },
    datasetDiggCount() {
      return this.datasetDiggList.length;
    },
    organizationCount() {
      return this.organizationList.length;
    },
  },
});

// 语言
export const useLangStore = defineStore('lang', {
  state: () => {
    return {
      lang: '',
    };
  },
});

// 文件仓库信息
export const useFileData = defineStore('file', {
  state: () => {
    return {
      fileStoreData: null,
      showCreateFolder: false,
    };
  },
  actions: {
    setFileData(data) {
      this.fileStoreData = data;
    },
    setShowFolder(data) {
      this.showCreateFolder = data;
    },
  },
});

// 基础信息
export const useBaseData = defineStore('baseInfo', {
  state: () => {
    return {
      modelType: '',
      datasetsType: '',
      organizationsType: '',
      projectsType: '',
      userType: '',
    };
  },
  actions: {
    setBaseData(data) {
      this.modelType = data.models_type_id;
      this.datasetsType = data.datasets_type_id;
      this.organizationsType = data.organizations_type_id;
      this.projectsType = data.projects_type_id;
      this.userType = data.user_type_id;
    },
  },
});

// 筛选信息/头像信息
export const useFilterData = defineStore('filterInfo', {
  state: () => {
    return {
      filterData: null,
    };
  },
  actions: {
    setFilterData(data) {
      this.filterData = data;
    },
  },
});
