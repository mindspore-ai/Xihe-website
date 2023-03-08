export default [
  {
    path: '/industry',
    name: 'industry',
    component: () => {
      return import('@/views/industry/TheIndustry.vue');
    },
    redirect: '/industry/electric',
    children: [
      {
        path: 'electric',
        name: 'electricPower',
        component: () => {
          return import('@/views/industry/eletric/TheEletric.vue');
        },
        children: [
          {
            path: 'case-1',
            name: 'case-1',
            component: () => {
              return import('@/views/industry/eletric/cases/TheCase.vue');
            },
          },
        ],
      },
      {
        path: 'finance',
        name: 'finance',
        component: () => {
          return import('@/views/industry/finance/TheFinance.vue');
        },
      },
      {
        path: 'medical',
        name: 'medicalTreatment',
        component: () => {
          return import('@/views/industry/medical/TheMedicalTreatment.vue');
        },
      },
      {
        path: 'industrial-zone',
        name: 'industrialZone',
        component: () => {
          return import('@/views/industry/industrialZoo/TheIndustrialZone.vue');
        },
      },
    ],
  },
];
