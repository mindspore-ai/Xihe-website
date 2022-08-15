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
    // path: '/competitiondetail',
    path: '/competition/:id',
    name: 'competitionDetail',
    component: () => {
      return import('@/views/competition/CompetitionDetail.vue');
    },
    // redirect: '/competition/222/0/introduction',
    children: [
      {
        path: '0',
        name: 'introduction0',
        component: () => {
          return import('@/views/competition/CompetitionOption.vue');
        },
        // redirect: '/competition/222/0/introduction',
        children: [
          // 介绍
          {
            path: 'introduction',
            name: 'introduction1',
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
          },
          // 排行榜
          {
            path: 'leaderboard',
            name: 'leaderboard',
            component: () => {
              return import('@/views/competition/ComRank.vue');
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
      {
        path: '1',
        name: 'introduction2',
        component: () => {
          return import('@/views/competition/CompetitionRegister.vue');
        },
        redirect: '/competition/222/1/introduction',
        children: [
          // 介绍
          {
            path: 'introduction',
            name: 'introduction3',
            component: () => {
              return import('@/views/competition/CompetitionRegister.vue');
            },
          },
        ],
      },
    ],
  },
];
