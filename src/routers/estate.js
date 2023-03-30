export default [
  {
    path: '/estate',
    name: 'estate',
    component: () => {
      return import('@/views/estate/TheEstate.vue');
    },
    redirect: '/estate/electricity',
    // 四个专区
    children: [
      {
        path: 'electricity',
        name: 'electricity',
        component: () => {
          return import('@/views/estate/electricity/TheElectricity.vue');
        },
      },
      {
        path: 'industry',
        name: 'industry',
        component: () => {
          return import('@/views/estate/industry/TheIndustry.vue');
        },
      },
      {
        path: 'humanity',
        name: 'humanity',
        component: () => {
          return import('@/views/estate/humanity/TheHumanity.vue');
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
  // 电力专区--案例
  {
    path: '/estate/electricity/:id',
    name: 'electricityCase',
    component: () => {
      return import('@/views/estate/electricity/ElectricityDetail.vue');
    },
    redirect: {
      name: 'electricityExplain',
    },
    children: [
      // 项目说明
      {
        path: 'project-explain',
        name: 'electricityExplain',
        component: () => {
          return import('@/views/estate/electricity/ElectricityExplain.vue');
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
  // 工业专区--案例
  {
    path: '/estate/industry/:id',
    name: 'industryCase',
    component: () => {
      return import('@/views/estate/industry/IndustryDetail.vue');
    },
    redirect: {
      name: 'industryExplain',
    },
    children: [
      // 项目说明
      {
        path: 'project-explain',
        name: 'industryExplain',
        component: () => {
          return import('@/views/estate/industry/IndustryExplain.vue');
        },
      },
    ],
  },
  // 医疗--子宫内膜癌
  {
    path: '/estate/medicine/endometrial-cancer',
    name: 'endometrialCancer',
    component: () => {
      return import(
        '@/views/estate/medicine/endometrialcancer/EndometrialcancerDetail.vue'
      );
    },
    children: [
      // 项目说明
      {
        path: '',
        name: 'endometrialcancerExplain',
        component: () => {
          return import(
            '@/views/estate/medicine/endometrialcancer/EndometrialcancerExplain.vue'
          );
        },
      },
    ],
  },
  // 医疗--子宫内膜癌
  {
    path: '/estate/medicine/truesight',
    name: 'truesight',
    component: () => {
      return import('@/views/estate/medicine/truesight/TheTrueSight.vue');
    },
  },

  // 人文--AIGC生态系统
  {
    path: '/estate/humanity/AIGC',
    name: 'aigcEcosystem',
    component: () => {
      return import('@/views/estate/humanity/aigc/TheAigcEcosystem.vue');
    },
    children: [
      // 项目说明
      {
        path: '',
        name: 'aigcExplain',
        component: () => {
          return import('@/views/estate/humanity/aigc/TheAigcExplain.vue');
        },
      },
    ],
  },
  // 人文--玉知多模态大模型
  {
    path: '/estate/humanity/yuzhi',
    name: 'yuzhi',
    component: () => {
      return import('@/views/estate/humanity/yuzhi/TheYuzhiModelzoo.vue');
    },
    children: [
      // 项目说明
      {
        path: '',
        name: 'yuzhiExplain',
        component: () => {
          return import('@/views/estate/humanity/yuzhi/TheYuzhiExplain.vue');
        },
      },
    ],
  },
];
