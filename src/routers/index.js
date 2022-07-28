import { createRouter, createWebHistory } from 'vue-router';

import { doLogin } from '@/shared/login';
import { useLangStore, useLoginStore, useUserInfoStore } from '@/stores';

import user from './user';
import model from './model';
import modelzoo from './modelzoo';
import dataset from './dataset';
import project from './project';

export const routes = [
  // 主页
  {
    path: '/',
    alias: '/home',
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
  // 设置语言
  const langStore = useLangStore();
  langStore.lang = to.fullPath.includes('en') ? 'en' : 'zh';

  const loginStore = useLoginStore();
  const userInfoStore = useUserInfoStore();

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
