export default [
  //活动
  {
    path: '/activity',
    name: 'activity',
    component: () => {
      return import('@/views/mindcon/TheMIndCon.vue');
    },
  },
  {
    path: '/activity-1',
    name: 'activityTest',
    component: () => {
      return import('@/views/mindcon/TheMIndCoinTest.vue');
    },
  },
  {
    path: '/activity-result',
    name: 'activityResult',
    component: () => {
      return import('@/views/mindcon/TheMindConResult.vue');
    },
    beforeEnter: (to, from, next) => {
      if (to.query && from.path === '/activity-1') {
        next();
      } else {
        next('/activity');
      }
    },
  },
];
