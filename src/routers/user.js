import { queryUserInfo } from '@/api/api-user';
import { LOGIN_STATUS } from '@/shared/login';
import { useLoginStore, useUserInfoStore, useVistorInfoStore } from '@/stores';

export default [
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
              user_email: { email, is_active },
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

            vistorInfoStore.email = email;
            vistorInfoStore.emailStatus = is_active;
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
];
