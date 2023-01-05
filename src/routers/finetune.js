// import { useLoginStore } from '@/stores';
export default [
  // 大模型微调
  {
    path: '/finetune',
    name: 'finetune',
    component: () => {
      return import('@/views/finetune/TheFinetune.vue');
    },
  },
  // 创建大模型微调任务
  {
    path: '/finetune-creating/:user',
    name: 'finetuneCreating',
    component: () => {
      return import('@/views/finetune/FinetuneCreating.vue');
    },
    meta: {
      isPrivate: true,
    },
    /* beforeEnter: async () => {
      const loginStore = useLoginStore();
      if (!loginStore.loginStatus) {
        return {
          name: '404',
        };
      }
    }, */
  },
  {
    path: '/finetune-log/:finetuneId',
    name: 'finetuneLog',
    component: () => {
      return import('@/views/finetune/FinetuneLog.vue');
    },
  },
];
