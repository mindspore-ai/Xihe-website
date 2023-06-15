import { queryUserInfo } from '@/api/api-user';
import { LOGIN_STATUS } from '@/shared/login';
import { useLoginStore, useUserInfoStore, useVisitorInfoStore } from '@/stores';

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
          if (res.data) {
            const visitorInfo = res.data;
            const {
              id,
              account: userName,
              bio: description,
              avatar_id: avatar,
              email,
              follower_count: fansCount,
              following_count: followingCount,
              is_follower: isFollower,
            } = visitorInfo;

            const visitorInfoStore = useVisitorInfoStore();
            visitorInfoStore.id = id;
            visitorInfoStore.userName = userName;
            visitorInfoStore.description = description;
            visitorInfoStore.avatar = avatar;
            visitorInfoStore.email = email;
            visitorInfoStore.fansCount = fansCount;
            visitorInfoStore.followingCount = followingCount;
            visitorInfoStore.isFollower = isFollower;
          } else {
            return {
              name: '404',
            };
          }
          return true;
        } catch (err) {
          console.error('获取用户信息失败：', err);
          return {
            name: '404',
          };
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
        // 带查询参数userName时重定向
        beforeEnter: (to, from, next) => {
          if (Object.keys(to.query).length) {
            const changeFullpath = function (str) {
              return str.replace(/\?userName=[a-zA-Z0-9]+/g, '');
            };

            to.fullPath = changeFullpath(to.fullPath);
          }
          next();
        },
      },
      {
        path: 'models',
        name: 'userModels',
        component: () => {
          return import('@/views/user/UserModel.vue');
        },
        // 带查询参数userName时重定向
        beforeEnter: (to, from, next) => {
          if (Object.keys(to.query).length) {
            const changeFullpath = function (str) {
              return str.replace(/\?userName=[a-zA-Z0-9]+/g, '');
            };
            to.fullPath = changeFullpath(to.fullPath);
          }
          next();
        },
      },
      {
        path: 'datasets',
        name: 'userDatasets',
        component: () => {
          return import('@/views/user/UserDataset.vue');
        },
        beforeEnter: (to, from, next) => {
          if (Object.keys(to.query).length) {
            const changeFullpath = function (str) {
              return str.replace(/\?userName=[a-zA-Z0-9]+/g, '');
            };
            to.fullPath = changeFullpath(to.fullPath);
          }
          next();
        },
      },
      {
        path: 'projects',
        name: 'userProjects',
        component: () => {
          return import('@/views/user/UserProject.vue');
        },
        beforeEnter: (to, from, next) => {
          if (Object.keys(to.query).length) {
            const changeFullpath = function (str) {
              return str.replace(/\?userName=[a-zA-Z0-9]+/g, '');
            };
            to.fullPath = changeFullpath(to.fullPath);
          }
          next();
        },
      },
      {
        path: 'collections',
        name: 'userCollections',
        component: () => {
          return import('@/views/user/UserCollection.vue');
        },
        beforeEnter: (to, from, next) => {
          if (Object.keys(to.query).length) {
            const changeFullpath = function (str) {
              return str.replace(/\?userName=[a-zA-Z0-9]+/g, '');
            };
            to.fullPath = changeFullpath(to.fullPath);
          }
          next();
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
          name: '404',
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
      {
        path: 'course',
        name: 'settingsCourse',
        component: () => {
          return import('@/views/setting/SeetingCourse.vue');
        },
      },
      {
        path: 'competition',
        name: 'settingsCompetition',
        component: () => {
          return import('@/views/setting/SettingCompetition.vue');
        },
      },
      // {
      //   path: 'invitation',
      //   name: 'settingsInvitation',
      //   component: () => {
      //     return import('@/views/setting/SettingInvitation.vue');
      //   },
      // },
      {
        path: 'clouddev',
        name: 'developEnvironment',
        component: () => {
          return import('@/views/setting/MyDevelopEnvironment.vue');
        },
      },
    ],
  },
];
