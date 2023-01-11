import { useLoginStore, useUserInfoStore } from '@/stores';

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
  },
  {
    path: '/finetune-log/:user/:finetuneId',
    name: 'finetuneLog',
    component: () => {
      return import('@/views/finetune/FinetuneLog.vue');
    },
    meta: {
      isPrivate: true,
    },
  },
];
