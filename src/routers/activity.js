export default [
  //活动
  {
    path: '/activity',
    name: 'activity',
    component: () => {
      return import('@/views/activity/TheActivity.vue');
    },
  },
  {
    path: '/activity-1',
    name: 'activityTest',
    component: () => {
      return import('@/views/activity/TheActivityTest.vue');
    },
  },
  {
    path: '/activity-result',
    name: 'activityResult',
    component: () => {
      return import('@/views/activity/TheActivityResult.vue');
    },
    beforeEnter: (to, from, next) => {
      if (to.path && from.path === '/activity-1') {
        next();
      } else {
        next('/activity');
      }
    },
  },
];
