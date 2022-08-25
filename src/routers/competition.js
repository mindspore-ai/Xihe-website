// import { useLoginStore } from '@/stores';
// import { LOGIN_STATUS } from '@/shared/login';

export default [
  // 比赛
  {
    path: '/competition',
    name: 'competition',
    component: () => {
      return import('@/views/competition/TheCompetition.vue');
    },
  },
  // 比赛详情
  {
    path: '/competition/:id',
    name: 'competitionDetail',
    component: () => {
      return import('@/views/competition/CompetitionDetail.vue');
    },
    redirect: { name: 'introduction' },
    children: [
      // 详情导航部分
      {
        path: '0',
        name: 'option',
        component: () => {
          return import('@/views/competition/CompetitionOption.vue');
        },
        redirect: { name: 'introduction' },
        children: [
          // 介绍
          {
            path: 'introduction',
            name: 'introduction',
            component: () => {
              return import('@/views/competition/CompetitionIntroduction.vue');
            },
          },
          // 数据集
          {
            path: 'dataset',
            name: 'dataset',
            component: () => {
              return import('@/views/competition/CompetitionDataset.vue');
            },
          },
          // 结果提交
          {
            path: 'result',
            name: 'result',
            component: () => {
              return import('@/views/competition/CompetitionResultSubmit.vue');
            },
          },
          // 我的团队
          {
            path: 'team',
            name: 'team',
            component: () => {
              return import('@/views/competition/CompetitionTeam.vue');
            },
            /* beforeEnter: async () => {
              const logingStore = useLoginStore();
              if (logingStore.loginStatus !== LOGIN_STATUS.DONE) {
                return {
                  name: '404',
                };
              }
            }, */
          },
          // 排行榜
          {
            path: 'leaderboard',
            name: 'leaderboard',
            component: () => {
              return import('@/views/competition/CompetitionRank.vue');
            },
          },
          // 讨论
          {
            path: 'discussion',
            name: 'discussion',
            component: () => {
              return import('@/views/competition/CompetitionDiscussion.vue');
            },
          },
          // 协议
          {
            path: 'agreement',
            name: 'agreement',
            component: () => {
              return import('@/views/competition/CompetitionAgreement.vue');
            },
          },
        ],
      },
      // 报名流程
      {
        path: '1',
        name: 'process',
        component: () => {
          return import('@/views/competition/CompetitionProcess.vue'); //待修改
        },
        redirect: { name: 'register' },
        children: [
          // 法律声明，报名表，报名成功
          {
            path: 'introduction',
            name: 'register',
            component: () => {
              return import('@/views/competition/CompetitionRegister.vue');
            },
          },
        ],
      },
    ],
  },
];
