import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useLoginStore } from '@/stores';
import { getActivityDetail } from '@/api/api-activity';
import { goAuthorize } from '@/shared/login';
const isLogined = computed(() => useLoginStore().isLogined);
const router = useRouter();
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
      return import('@/views/activity/TheActivityTest.vue');
    },
    beforeEnter: async (to, from, next) => {
      try {
        const res = await getActivityDetail().then((res) => {
          console.log(res.data);
        });
        if (isLogined.value) {
          if (res.data.is_competitor) {
            next();
          } else {
            router.push('/activity');
          }
        } else {
          goAuthorize();
        }
      } catch (e) {
        console.error(e);
      }
    },
  },
  {
    path: '/activity-result',
    name: 'activityResult',
    component: () => {
      return import('@/views/activity/TheActivityResult.vue');
    },
  },
];
