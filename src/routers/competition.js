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
    children: [
      // 介绍
      {
        path: 'introduction',
        name: 'introduction',
        component: () => {
          return import('@/views/competition/CompetitionIntro.vue');
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
          return import('@/views/competition/CompetitionLeaderboard.vue');
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
];
