export default [
  // 活动
  {
    path: '/activity',
    name: 'activity',
    component: () => {
      return import('@/views/mindcon/TheMindCon.vue');
    },
  },
  // mindCon
  {
    path: '/activity-1',
    name: 'activityTest',
    component: () => {
      return import('@/views/mindcon/TheMindConTest.vue');
    },
    beforeEnter: (to, from, next) => {
      if (from.path === '/activity') {
        next();
      } else {
        next('/activity');
      }
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
