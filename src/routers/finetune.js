import { getFinetuneList } from '@/api/api-finetune';
import { useFinetuneData, useLoginStore } from '@/stores';

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
    path: '/finetune/new',
    name: 'createFinetune',
    component: () => {
      return import('@/views/finetune/FinetuneCreating.vue');
    },
    beforeEnter: async () => {
      const userFinetune = useFinetuneData();
      const isLogined = useLoginStore().isLogined;
      if (!isLogined) {
        return {
          name: '404',
        };
      } else {
        if (userFinetune.isAllowed) {
          return true;
        } else {
          try {
            const res = await getFinetuneList();
            userFinetune.setFinetuneData(res.data.datas);
            userFinetune.setFinetuneWhiteList(true);
            return true;
          } catch (error) {
            if (error.code === 'finetune_no_permission') {
              userFinetune.$reset();
              return {
                name: '404',
              };
            }
          }
        }
      }
    },
  },
  // 微调任务日志
  {
    path: '/finetunelog/:finetuneId',
    name: 'finetuneLog',
    component: () => {
      return import('@/views/finetune/FinetuneLog.vue');
    },
    beforeEnter: async () => {
      const userFinetune = useFinetuneData();
      const isLogined = useLoginStore().isLogined;
      if (!isLogined) {
        return {
          name: '404',
        };
      } else {
        if (userFinetune.isAllowed) {
          return true;
        } else {
          try {
            const res = await getFinetuneList();
            userFinetune.setFinetuneData(res.data.datas);
            userFinetune.setFinetuneWhiteList(true);
            return true;
          } catch (error) {
            if (error.code === 'finetune_no_permission') {
              userFinetune.$reset();
              return {
                name: '404',
              };
            }
          }
        }
      }
    },
  },
];
