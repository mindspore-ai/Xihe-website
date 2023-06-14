export default [
  {
    path: '/electricity',
    name: 'electricity',
    component: () => {
      return import('@/views/estate/electricity/TheElectricity.vue');
    },
  },
  {
    path: '/industry',
    name: 'industry',
    component: () => {
      return import('@/views/estate/industry/TheIndustry.vue');
    },
  },
  {
    path: '/humanity',
    name: 'humanity',
    component: () => {
      return import('@/views/estate/humanity/TheHumanity.vue');
    },
  },
  {
    path: '/medicine',
    name: 'medicine',
    component: () => {
      return import('@/views/estate/medicine/TheMedicine.vue');
    },
  },
  // 电力--变电站AI分析主机
  {
    path: '/electricity/substation-host',
    name: 'substationhost',
    component: () => {
      return import(
        '@/views/estate/electricity/computerVision/substationhost/SubstationhostDetail.vue'
      );
    },
    children: [
      // 项目说明
      {
        path: '',
        name: 'substationhostExplain',
        component: () => {
          return import(
            '@/views/estate/electricity/computerVision/substationhost/SubstationhostExplain.vue'
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
    path: '/electricity/substation-ops',
    name: 'substationops',
    component: () => {
      return import(
        '@/views/estate/electricity/computerVision/substationops/SubstationopsDetail.vue'
      );
    },
    children: [
      // 项目说明
      {
        path: '',
        name: 'substationopsExplain',
        component: () => {
          return import(
            '@/views/estate/electricity/computerVision/substationops/SubstationopsExplain.vue'
          );
        },
      },
    ],
  },
  // 电力--智能在线决策系统
  {
    path: '/electricity/intelligent-system',
    name: 'intelligentsystem',
    component: () => {
      return import(
        '@/views/estate/electricity/computerVision/intelligentsystem/IntelligentsystemDetail.vue'
      );
    },
    children: [
      // 项目说明
      {
        path: '',
        name: 'intelligentsystemExplain',
        component: () => {
          return import(
            '@/views/estate/electricity/computerVision/intelligentsystem/IntelligentsystemExplain.vue'
          );
        },
      },
    ],
  },

  // 电力NLP
  {
    path: '/electricity/laborcontract',
    name: 'laborcontract',
    component: () => {
      return import(
        '@/views/estate/electricity/naturalLanguage/labor-contract/LaborcontractDetail.vue'
      );
    },
    children: [
      // 项目说明
      {
        path: '',
        name: 'laborcontractExplain',
        component: () => {
          return import(
            '@/views/estate/electricity/computerVision/intelligentsystem/IntelligentsystemExplain.vue'
          );
        },
      },
    ],
  },

  // 医疗--子宫内膜癌
  {
    path: '/medicine/metrocarcinoma',
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
    path: '/medicine/truesight',
    name: 'truesight',
    component: () => {
      return import('@/views/estate/medicine/truesight/TheTrueSight.vue');
    },
  },

  // 医疗--智慧病理诊断系统
  {
    path: '/medicine/diagnosis',
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

  // 工业--金属零部件
  {
    path: '/industry/metal-part',
    name: 'metalPart',
    component: () => {
      return import('@/views/estate/industry/metalpart/MetalpartDetail.vue');
    },
    children: [
      // 项目说明
      {
        path: '',
        name: 'industryExplain',
        component: () => {
          return import(
            '@/views/estate/industry/metalpart/MetalpartExplain.vue'
          );
        },
      },
    ],
  },
  // 工业--工业AI算法库READ
  {
    path: '/industry/algorithm',
    name: 'algorithm',
    component: () => {
      return import('@/views/estate/industry/algorithm/AlgorithmDetail.vue');
    },
    children: [
      // 项目说明
      {
        path: '',
        name: 'algorithmExplain',
        component: () => {
          return import(
            '@/views/estate/industry/algorithm/AlgorithmExplain.vue'
          );
        },
      },
    ],
  },
  // 工业--低码智能视频使能平台
  {
    path: '/industry/intelligence',
    name: 'IntelligenceExplain',
    component: () => {
      return import(
        '@/views/estate/industry/intelligence/intelligenceDetail.vue'
      );
    },
    children: [
      // 项目说明
      {
        path: '',
        name: 'intelligenceExplain',
        component: () => {
          return import(
            '@/views/estate/industry/intelligence/intelligenceExplain.vue'
          );
        },
      },
    ],
  },

  // 人文--AIGC生态系统
  {
    path: '/humanity/AIGC',
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
    path: '/humanity/yuzhi',
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
    path: '/humanity/sign-language',
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
