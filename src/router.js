import { createRouter, createWebHistory } from 'vue-router';
import { queryUserInfo } from './api/api-user';
import { doLogin, LOGIN_STATUS } from './shared/login';
import {
  useLangStore,
  useLoginStore,
  useUserInfoStore,
  useVistorInfoStore,
} from './stores';

export const routes = [
  {
    path: '/',
    redirect: '/home',
  },
  // 主页
  {
    path: '/home',
    name: 'home',
    component: () => {
      return import('@/views/TheHome.vue');
    },
  },
  // 个人中心
  {
    path: '/:user',
    name: 'user',
    component: () => {
      return import('@/views/user/TheUser.vue');
    },
    beforeEnter: async (to) => {
      const info = to.path.split('/')[1];
      const name = decodeURI(info);
      const userInfoStore = useUserInfoStore();
      if (userInfoStore.userName === name) {
        return true;
      } else {
        try {
          const res = await queryUserInfo({
            userName: name,
          });
          if (res.status === 200 && res.data && res.data.length) {
            const vistorInfo = res.data[0];
            console.log(vistorInfo);
            const {
              id,
              username: userName,
              fans_list: fansList,
              follow_list: followList,
              models_digg_list: modelDiggList,
              datasets_digg_list: datasetDiggList,
              organization_list: organizationList,
              organization_admin_list: organizationAdminList,
              user_detail: {
                avatar_url,
                description,
                gitee,
                github,
                nickname: nickName,
              },
            } = vistorInfo;

            const vistorInfoStore = useVistorInfoStore();
            vistorInfoStore.id = id;
            vistorInfoStore.userName = userName;
            vistorInfoStore.avatar = avatar_url;
            vistorInfoStore.description = description;
            vistorInfoStore.nickName = nickName;
            vistorInfoStore.gitee = gitee;
            vistorInfoStore.github = github;
            vistorInfoStore.fansList = fansList;
            vistorInfoStore.followList = followList;
            vistorInfoStore.modelDiggList = modelDiggList;
            vistorInfoStore.datasetDiggList = datasetDiggList;
            vistorInfoStore.organizationList = organizationList;
            vistorInfoStore.organizationAdminList = organizationAdminList;
          } else {
            return { name: 'home' };
          }
          return true;
        } catch (err) {
          console.error('获取用户信息失败：', err);
          return { name: 'home' };
        }
      }
    },
    children: [
      {
        path: '',
        name: 'userLives',
        component: () => {
          return import('@/views/user/UserLive.vue');
        },
      },
      {
        path: 'models',
        name: 'userModels',
        component: () => {
          return import('@/views/user/UserModel.vue');
        },
        beforeEach: (to) => {
          console.log(to);
        },
      },
      {
        path: 'datasets',
        name: 'userDatasets',
        component: () => {
          return import('@/views/user/UserDataset.vue');
        },
      },
      {
        path: 'projects',
        name: 'userProjects',
        component: () => {
          return import('@/views/user/UserProject.vue');
        },
      },
      {
        path: 'collections',
        name: 'userCollections',
        component: () => {
          return import('@/views/user/UserCollection.vue');
        },
      },
      {
        path: 'follows',
        name: 'userFollows',
        component: () => {
          return import('@/views/user/UserFollow.vue');
        },
      },
      {
        path: 'watched',
        name: 'userWatched',
        component: () => {
          return import('@/views/user/UserWatched.vue');
        },
      },
    ],
  },
  // 个人主页空白页，用于点击左侧按钮刷新粉丝数量
  {
    path: '/:user/userblack',
    name: 'userblack',
    component: () => {
      return import('@/views/user/UserBlack.vue');
    },
  },
  // 个人中心设置页
  {
    path: '/settings',
    name: 'settings',
    component: () => {
      return import('@/views/setting/TheSetting.vue');
    },
    beforeEnter: async () => {
      const logingStore = useLoginStore();
      if (logingStore.loginStatus !== LOGIN_STATUS.DONE) {
        return {
          name: 'home',
        };
      }
    },
    redirect: '/settings/profile',
    children: [
      {
        path: 'profile',
        name: 'settingsProfile',
        component: () => {
          return import('@/views/setting/SettingProfile.vue');
        },
      },
      {
        path: 'security',
        name: 'settingsSecurity',
        component: () => {
          return import('@/views/setting/SettingSecurity.vue');
        },
      },
      {
        path: 'email',
        name: 'settingsEmail',
        component: () => {
          return import('@/views/setting/SettingEmail.vue');
        },
      },
    ],
  },
  // 创建 新模型｜新数据集｜新项目
  {
    path: '/new',
    name: 'new',
    component: () => {
      return import('@/views/TheCreating.vue');
    },
    children: [
      {
        path: 'models',
        name: 'createModel',
        component: () => {
          return import('@/views/model/ModelCreating.vue');
        },
      },
      {
        path: 'datasets',
        name: 'createDataset',
        component: () => {
          return import('@/views/dataset/DatasetCreating.vue');
        },
      },
      {
        path: 'projects',
        name: 'createProject',
        component: () => {
          return import('@/views/project/ProjectCreating.vue');
        },
      },
    ],
  },
  // 模型
  {
    path: '/models',
    name: 'models',
    component: () => {
      return import('@/views/model/TheModel.vue');
    },
  },
  {
    path: '/models/:user/:name',
    component: () => {
      return import('@/views/model/ModelDetail.vue');
    },
    children: [
      {
        path: '',
        name: 'modelCard',
        component: () => {
          return import('@/views/model/ModelCard.vue');
        },
        meta: {
          index: 0,
        },
      },
      {
        path: 'tree/:contents*',
        name: 'modelFile',
        component: () => {
          return import('@/views/model/ModelFile.vue');
        },
        meta: {
          index: 1,
        },
      },
      // 文件详情页
      {
        path: 'blob/:contents*',
        name: 'modelFileBlob',
        component: () => {
          return import('@/views/model/ModelFileBlob.vue');
        },
        meta: {
          index: 1,
        },
      },
      // 新建文件页
      {
        path: 'new/:contents*',
        name: 'modelFileNew',
        component: () => {
          return import('@/views/model/ModelFileNew.vue');
        },
        meta: {
          index: 1,
          isPrivate: true,
        },
      },
      // 编辑页面
      {
        path: 'edit/:contents*',
        name: 'modelFileEditor',
        component: () => {
          return import('@/views/model/ModelFileEditor.vue');
        },
        meta: {
          index: 1,
          isPrivate: true,
        },
      },
      // 上传页
      {
        path: 'upload/:contents*',
        name: 'modelFileUpload',
        component: () => {
          return import('@/views/model/ModelFileUpload.vue');
        },
        meta: {
          index: 1,
          isPrivate: true,
        },
      },
      // 仓库设置
      {
        path: 'settings',
        name: 'modelSet',
        component: () => {
          return import('@/views/model/ModelSet.vue');
        },
        meta: {
          index: 2,
          isPrivate: true,
        },
      },
    ],
  },
  // 数据集
  {
    path: '/datasets',
    name: 'datasets',
    component: () => {
      return import('@/views/dataset/TheDataset.vue');
    },
  },
  {
    path: '/datasets/:user/:name',
    name: 'dataset-detail',
    component: () => {
      return import('@/views/dataset/DatasetDetail.vue');
    },
    children: [
      {
        path: '',
        name: 'datasetCard',
        component: () => {
          return import('@/views/dataset/DatasetCard.vue');
        },
        meta: {
          index: 0,
        },
      },
      {
        path: 'tree/:contents*',
        name: 'datasetFile',
        component: () => {
          return import('@/views/dataset/DatasetFile.vue');
        },
        meta: {
          index: 1,
        },
      },
      // 文件详情页
      {
        path: 'blob/:contents*',
        name: 'datasetFileBlob',
        component: () => {
          return import('@/views/dataset/DatasetFileBlob.vue');
        },
        meta: {
          index: 1,
        },
      },
      // 新建文件页
      {
        path: 'new/:contents*',
        name: 'datasetFileNew',
        component: () => {
          return import('@/views/dataset/DatasetFileNew.vue');
        },
        meta: {
          index: 1,
          isPrivate: true,
        },
      },
      // 编辑页面
      {
        path: 'edit/:contents*',
        name: 'datasetFileEditor',
        component: () => {
          return import('@/views/dataset/DatasetFileEditor.vue');
        },
        meta: {
          index: 1,
          isPrivate: true,
        },
      },
      // 上传页
      {
        path: 'upload/:contents*',
        name: 'datasetFileUpload',
        component: () => {
          return import('@/views/dataset/DatasetFileUpload.vue');
        },
        meta: {
          index: 1,
          isPrivate: true,
        },
      },
      {
        path: 'settings',
        name: 'datasetSet',
        component: () => {
          return import('@/views/dataset/DatasetSet.vue');
        },
        meta: {
          index: 2,
          isPrivate: true,
        },
      },
    ],
  },
  // 项目
  {
    path: '/projects',
    name: 'projects',
    component: () => {
      return import('@/views/project/TheProject.vue');
    },
  },
  {
    path: '/projects/:user/:name/selectfile',
    name: 'projectsSelectFile',
    component: () => {
      return import('@/views/project/ProjectSelectFile.vue');
    },
  },
  {
    path: '/projects/:user/:name',
    name: 'project-detail',
    component: () => {
      return import('@/views/project/ProjectDetail.vue');
    },
    children: [
      {
        path: '',
        name: 'projectCard',
        component: () => {
          return import('@/views/project/ProjectCard.vue');
        },
        meta: {
          index: 0,
        },
      },
      {
        path: 'train',
        name: 'projectTrain',
        component: () => {
          return import('@/views/project/ProjectTrain.vue');
        },
        meta: {
          index: 1,
        },
      },
      {
        path: 'settings',
        name: 'projectSet',
        component: () => {
          return import('@/views/project/ProjectSet.vue');
        },
        meta: {
          index: 3,
          isPrivate: true,
        },
      },
      {
        path: 'trainlist',
        name: 'projectTrainList',
        component: () => {
          return import('@/views/project/ProjectTrainList.vue');
        },
        meta: {
          index: 4,
        },
      },
      {
        path: 'trainlog/:trainId',
        name: 'projectTrainLog',
        component: () => {
          return import('@/views/project/ProjectTrainLog.vue');
        },
        meta: {
          index: 5,
        },
      },
      {
        path: 'tree/:contents*',
        name: 'projectFile',
        component: () => {
          return import('@/views/project/ProjectFile.vue');
        },
        meta: {
          index: 2,
        },
      },
      // 文件详情页
      {
        path: 'blob/:contents*',
        name: 'projectFileBlob',
        component: () => {
          return import('@/views/project/ProjectFileBlob.vue');
        },
        meta: {
          index: 1,
        },
      },
      // 新建文件页
      {
        path: 'new/:contents*',
        name: 'projectFileNew',
        component: () => {
          return import('@/views/project/ProjectFileNew.vue');
        },
        meta: {
          index: 1,
          isPrivate: true,
        },
      },
      // 编辑页面
      {
        path: 'edit/:contents*',
        name: 'projectFileEditor',
        component: () => {
          return import('@/views/project/ProjectFileEditor.vue');
        },
        meta: {
          index: 1,
          isPrivate: true,
        },
      },
      // 上传页
      {
        path: 'upload/:contents*',
        name: 'projectFileUpload',
        component: () => {
          return import('@/views/project/ProFileUpload.vue');
        },
        meta: {
          index: 1,
          isPrivate: true,
        },
      },
    ],
  },
  // 404页面
  {
    path: '/notfound',
    name: 'notfound',
    component: () => {
      return import('@/views/TheNotfound.vue');
    },
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

router.beforeEach(async (to, from) => {
  // 设置语言
  const langStore = useLangStore();
  langStore.lang = to.fullPath.includes('en') ? 'en' : 'zh';

  const loginStore = useLoginStore();
  const userInfo = useUserInfoStore();

  // 如已登录，直接进入
  if (loginStore.isLogined) {
    return true;
  }

  // 如已退出返回首页
  if (
    to.name === 'home' &&
    (loginStore.isLoginNot || loginStore.isLoginFailed) &&
    from.path !== '/'
  ) {
    return true;
  }
  // 白名单中路由可直接进入
  const whiteList = ['home', 'models', 'datasets', 'projects', 'search'];
  if (whiteList.indexOf(to.name) !== -1) {
    doLogin();
    return true;
  }

  // 其他情况等待登录结果
  await doLogin();

  // 私人页面等待登录结果后进入
  if (to.meta.isPrivate) {
    if (userInfo.userName === to.params.user) {
      return true;
    } else {
      return { name: 'notfound' };
    }
  }
  return true;
});
