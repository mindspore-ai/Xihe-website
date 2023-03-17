export default [
  {
    path: '/estate',
    name: 'estate',
    component: () => {
      return import('@/views/estate/TheEstate.vue');
    },
    redirect: '/estate/industrial-zone',
    // 四个专区
    children: [
      {
        path: 'electric',
        name: 'electricPower',
        component: () => {
          return import('@/views/estate/industry/TheIndustry.vue');
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
        path: 'medical',
        name: 'medicalTreatment',
        component: () => {
          return import('@/views/estate/medicine/TheMedicalTreatment.vue');
        },
      },
      {
        path: 'industrial-zone',
        name: 'industrialZone',
        component: () => {
          // return import('@/views/estate/medicine/TheMedicalTreatment.vue');
          return import('@/views/estate/electricity/TheEletricity.vue');
        },
      },
    ],
  },
  // 电力专区--案例1
  {
    path: '/estate/electric/case-1',
    name: 'estateCase',
    component: () => {
      return import('@/views/estate/electricity/cases/case-1/TheCase1.vue');
    },
    redirect: '/estate/electric/case-1/project-explain',
    children: [
      // 项目说明
      {
        path: 'project-explain',
        name: 'projectExplain',
        component: () => {
          return import(
            '@/views/estate/electricity/cases/case-1/ElectricityExplain.vue'
          );
        },
      },
      // 数据准备
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
      },
    ],
  },

  // {
  //   path: '/estate/electricity/:id',
  //   name: 'electricityDetail',
  //   component: () => {
  //     return import('@/views/estate/electricity/ElectricityDetail.vue');
  //   },
  //   redirect: { name: 'projectExplain' },
  //   children: [
  //     // 项目说明
  //     {
  //       path: 'project-explain',
  //       name: 'projectExplain',
  //       component: () => {
  //         return import('@/views/estate/electricity/ElectricityExplain.vue');
  //       },
  //     },
  //     // 数据准备
  //     {
  //       path: 'data-prepare',
  //       name: 'dataPrepare',
  //       component: () => {
  //         return import(
  //           '@/views/estate/electricity/ElectricityDataPrepare.vue'
  //         );
  //       },
  //     },
  //     // 模型训练
  //     {
  //       path: 'model-train',
  //       name: 'modelTrain',
  //       component: () => {
  //         return import('@/views/estate/electricity/ElectricityModelTrain.vue');
  //       },
  //     },
  //   ],
  // },
];
