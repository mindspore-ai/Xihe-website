// import { computed } from 'vue';
// import { useLoginStore } from '@/stores';
// import { getActivityDetail } from '@/api/api-activity';
// import { goAuthorize } from '@/shared/login';

// const isLogined = computed(() => useLoginStore().isLogined);
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
    // beforeEnter: async (to, from, next) => {
    //   try {
    //     if (isLogined.value) {
    //       const res = await getActivityDetail();
    //       if (res.is_competitor) {
    //         next();
    //       } else {
    //         next('/activity');
    //       }
    //     } else {
    //       goAuthorize();
    //     }
    //   } catch (e) {
    //     console.error(e);
    //   }
    // },
  },
  {
    path: '/activity-result',
    name: 'activityResult',
    component: () => {
      return import('@/views/activity/TheActivityResult.vue');
    },
    beforeEnter: (to, from, next) => {
      if (to.query) {
        next();
      } else {
        next('/activity');
      }
    },
  },
];
