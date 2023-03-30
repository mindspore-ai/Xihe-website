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
  // 电力--变电站AI分析主机
  {
    path: '/estate/electricity/substation-host',
    name: 'substationhost',
    component: () => {
      return import(
        '@/views/estate/electricity/substationhost/SubstationhostDetail.vue'
      );
    },
    children: [
      // 项目说明
      {
        path: '',
        name: 'substationhostExplain',
        component: () => {
          return import(
            '@/views/estate/electricity/substationhost/SubstationhostExplain.vue'
          );
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
  // 电力--变电站运维图像识别分析解决方案
  {
    path: '/estate/electricity/substation-ops',
    name: 'substationops',
    component: () => {
      return import(
        '@/views/estate/electricity/substationops/SubstationopsDetail.vue'
      );
    },
    children: [
      // 项目说明
      {
        path: '',
        name: 'substationopsExplain',
        component: () => {
          return import(
            '@/views/estate/electricity/substationops/SubstationopsExplain.vue'
          );
        },
      },
    ],
  },
  // 电力--变电站运维图像识别分析解决方案
  {
    path: '/estate/electricity/substation-ops',
    name: 'substationops',
    component: () => {
      return import(
        '@/views/estate/electricity/substationops/SubstationopsDetail.vue'
      );
    },
    children: [
      // 项目说明
      {
        path: '',
        name: 'substationopsExplain',
        component: () => {
          return import(
            '@/views/estate/electricity/substationops/SubstationopsExplain.vue'
          );
        },
      },
    ],
  },
  // 电力--智能在线决策系统
  {
    path: '/estate/electricity/intelligent-system',
    name: 'intelligentsystem',
    component: () => {
      return import(
        '@/views/estate/electricity/intelligentsystem/IntelligentsystemDetail.vue'
      );
    },
    children: [
      // 项目说明
      {
        path: '',
        name: 'intelligentsystemExplain',
        component: () => {
          return import(
            '@/views/estate/electricity/intelligentsystem/IntelligentsystemExplain.vue'
          );
        },
      },
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
  // 医疗--临床外科手术
  {
    path: '/estate/medicine/truesight',
    name: 'truesight',
    component: () => {
      return import('@/views/estate/medicine/truesight/TheTrueSight.vue');
    },
  },

  // 医疗--智慧病理诊断系统
  {
    path: '/estate/medicine/diagnosis',
    name: 'pathologicalDiagnosis',
    component: () => {
      return import('@/views/estate/medicine/diagnosis/DiagnosisDetail.vue');
    },
    children: [
      // 项目说明
      {
        path: '',
        name: 'diagnosisExplain',
        component: () => {
          return import(
            '@/views/estate/medicine/diagnosis/DiagnosisExplain.vue'
          );
        },
      },
    ],
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
  // 人文--手语教考一体机
  {
    path: '/estate/humanity/sign-language',
    name: 'signLanguage',
    component: () => {
      return import(
        '@/views/estate/humanity/sign-language/TheSignLanguage.vue'
      );
    },
    children: [
      // 项目说明
      {
        path: '',
        name: 'languageExplain',
        component: () => {
          return import(
            '@/views/estate/humanity/sign-language/TheProjectExplain.vue'
          );
        },
      },
    ],
  },
];
