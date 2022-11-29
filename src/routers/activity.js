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
    path: '/activity-test',
    name: 'activityTest',
    component: () => {
      return import('@/views/activity/TheTest.vue');
    },
    // beforeEnter: (to, from, next) => {
    //   if (from.path === '/activity') {
    //     next();
    //   } else {
    //     next('/activity');
    //   }
    // },
  },
  {
    path: '/activity-result',
    name: 'activityResult',
    component: () => {
      return import('@/views/activity/TheActivityResult.vue');
    },
  },
];
