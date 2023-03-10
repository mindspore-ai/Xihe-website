export default [
  {
    path: '/estate',
    name: 'estate',
    component: () => {
      return import('@/views/estate/TheEstate.vue');
    },
  },
  {
    path: '/estate/electricity/:id',
    name: 'electricityDetail',
    component: () => {
      return import('@/views/estate/electricity/ElectricityDetail.vue');
    },
    redirect: { name: 'projectExplain' },
    children: [
      // 项目说明
      {
        path: 'project-explain',
        name: 'projectExplain',
        component: () => {
          return import('@/views/estate/electricity/ElectricityExplain.vue');
        },
      },
      // 数据准备
      {
        path: 'data-prepare',
        name: 'dataPrepare',
        component: () => {
          return import(
            '@/views/estate/electricity/ElectricityDataPrepare.vue'
          );
        },
      },
      // 模型训练
      {
        path: 'model-train',
        name: 'modelTrain',
        component: () => {
          return import('@/views/estate/electricity/ElectricityModelTrain.vue');
        },
      },
    ],
  },
];
