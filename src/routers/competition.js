export default [
  // 比赛
  {
    path: '/competition',
    name: 'competition',
    component: () => {
      return import('@/views/competition/TheCompetition.vue');
    },
  },
];
