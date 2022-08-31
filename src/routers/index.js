import { createRouter, createWebHistory } from 'vue-router';

import { doLogin, goAuthorize } from '@/shared/login';
import { queryUserInfo } from '@/api/api-user';
import { useLangStore, useLoginStore, useUserInfoStore } from '@/stores';

import user from './user';
import model from './model';
import modelzoo from './modelzoo';
import dataset from './dataset';
import project from './project';
import competition from './competition';

export const routes = [
  // 主页
  {
    path: '/',
    alias: '/home',
    name: 'home',
    component: () => {
      return import('@/views/TheHome.vue');
    },
  },
  // 隐私政策
  {
    path: '/privacy',
    name: 'privacy',
    component: () => {
      return import('@/views/other/ThePrivacy.vue');
    },
  },
  // 法律声明
  {
    path: '/legal',
    name: 'legal',
    component: () => {
      return import('@/views/other/TheLegal.vue');
    },
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
  // 排行榜
  {
    path: '/leaderboard',
    name: 'leaderboard',
    component: () => {
      return import('@/views/TheLeaderboard.vue');
    },
  },
  // 用户
  ...user,
  // 模型
  ...model,
  // 大模型
  ...modelzoo,
  // 数据集
  ...dataset,
  // 项目
  ...project,
  // 比赛
  ...competition,
  // 404页面
  {
    path: '/404',
    name: '404',
    component: () => {
      return import('@/views/TheNotfound.vue');
    },
  },
  // 其他页面跳转至404
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
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
  const mobileFitWhiteList = ['taichu','taichuIntroduction', 'taichuTest'];
  if (mobileFitWhiteList.indexOf(to.name) !== -1) {
    document.body.classList.add('mobile-fit');
  } else {
    document.body.classList.remove('mobile-fit');
  }
  // 设置语言
  const langStore = useLangStore();
  langStore.lang = to.fullPath.includes('en') ? 'en' : 'zh';

  const loginStore = useLoginStore();
  const userInfoStore = useUserInfoStore();

  // 运营活动-用户邀请
  if (to.path === '/' && to.query && to.query.invited) {
    if (loginStore.isLogined) {
      window.history.replaceState({}, '', '/');
      to.query = {};
      to.fullPath = '/';
    } else {
      const userName = to.query.invited;
      const res = await queryUserInfo({ userName });
      if (res.status === 200) {
        window.history.replaceState({}, '', '/');
        to.query = {};
        to.fullPath = '/';
        localStorage.setItem('XIHE_INVITED', userName);
        goAuthorize();
      } else {
        window.history.replaceState({}, '', '/');
        to.query = {};
        to.fullPath = '/';
      }
    }
  }

  // 如已登录，直接进入
  if (loginStore.isLogined) {
    return true;
  }

  // 如已退出返回首页
  if (
    to.path === '/' &&
    (loginStore.isLoginNot || loginStore.isLoginFailed) &&
    from.path !== '/'
  ) {
    return true;
  }

  // 白名单中路由可直接进入
  const whiteList = [
    'models',
    'datasets',
    'projects',
    'modelzoo',
    'privacy',
    'legal',
    '404',
  ];
  if (to.path === '/' || whiteList.indexOf(to.name) !== -1) {
    doLogin();
    return true;
  }

  // 其他情况等待登录结果
  await doLogin();

  // 私人页面判断当前用户是否是登录用户
  if (to.meta.isPrivate) {
    if (userInfoStore.userName === to.params.user) {
      return true;
    } else {
      return { name: '404' };
    }
  }

  return true;
});
