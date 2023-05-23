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
      userName: '', // 用户名
      description: '', //个人描述
      avatar: '', //头像
      email: '', // 邮箱
      fansCount: 0, // 粉丝数量
      followingCount: 0, // 关注数量
    };
  },
  getters: {},
});

// 访客信息
export const useVisitorInfoStore = defineStore('visitorInfo', {
  state: () => {
    return {
      id: null, // id
      userName: '', // 用户名
      description: '', //个人描述
      avatar: '', //头像
      email: '', // 邮箱
      fansCount: 0, // 粉丝数量
      followingCount: 0, // 关注数量
      isFollower: false,
    };
  },
  getters: {},
});

// 语言
export const useLangStore = defineStore('lang', {
  state: () => {
    return {
      lang: '',
    };
  },
  actions: {
    setLangStore(val) {
      this.lang = val;
    },
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
// 是否有在进行中的请求
export const useLoadingState = defineStore('loading', {
  state: () => {
    return {
      loadingState: false,
    };
  },
  actions: {
    setloadingState(data) {
      this.loadingState = data;
    },
  },
});
// 绑定邮箱弹窗
export const useEmailDialogState = defineStore('dialog', {
  state: () => {
    return {
      dialogState: false,
    };
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

// 比赛信息
export const useCompetitionData = defineStore('competitionInfo', {
  state: () => {
    return {
      competitionData: null,
    };
  },
  actions: {
    setCompetitionData(data) {
      this.competitionData = data;
    },
  },
});

// 微调任务
export const useFinetuneData = defineStore('finetuneInfo', {
  state: () => {
    return {
      finetuneListData: null,
      isAllowed: false, //是否有微调资格
    };
  },
  actions: {
    setFinetuneData(data) {
      this.finetuneListData = data;
    },
    setFinetuneWhiteList(val) {
      this.isAllowed = val;
    },
  },
});

// 课程信息
export const useCourseData = defineStore('courseInfo', {
  state: () => {
    return {
      courseData: null,
    };
  },
  actions: {
    setCourseData(data) {
      this.courseData = data;
    },
  },
});
