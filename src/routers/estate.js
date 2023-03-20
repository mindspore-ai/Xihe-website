export default [
  {
    path: '/estate',
    name: 'estate',
    component: () => {
      return import('@/views/estate/TheEstate.vue');
    },
    redirect: '/estate/industry',
    // 四个专区
    children: [
      {
        path: 'industry',
        name: 'industry',
        component: () => {
          return import('@/views/estate/industry/TheIndustry.vue');
        },
      },
      {
        path: 'electricity',
        name: 'electricity',
        component: () => {
          return import('@/views/estate/electricity/TheElectricity.vue');
        },
      },
      {
        path: 'finance',
        name: 'finance',
        component: () => {
          return import('@/views/estate/finance/TheFinance.vue');
        },
      },
      {
        path: 'medicine',
        name: 'medicine',
        component: () => {
          return import('@/views/estate/medicine/TheMedicine.vue');
        },
      },
    ],
  },
  // 工业专区--案例1
  {
    path: '/estate/industry/:id',
    name: 'industryCase',
    component: () => {
      return import('@/views/estate/industry/IndustryDetail.vue');
    },
    redirect: {
      name: 'projectExplain',
    },
    children: [
      // 项目说明
      {
        path: 'project-explain',
        name: 'projectExplain',
        component: () => {
          return import('@/views/estate/industry/IndustryExplain.vue');
        },
      },
      /*  // 数据准备
      {
        path: 'data-prepare',
        name: 'dataPrepare',
        component: () => {
          return import(
            '@/views/estate/electricity/cases/case-1/ElectricityDataPrepare.vue'
          );
        },
      },
      // 模型训练
      {
        path: 'model-train',
        name: 'modelTrain',
        component: () => {
          return import(
            '@/views/estate/electricity/cases/case-1/ElectricityModelTrain.vue'
          );
        },
      }, */
    ],
  },
];
