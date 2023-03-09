export default [
  {
    path: '/estate',
    name: 'estate',
    component: () => {
      return import('@/views/estate/TheEstate.vue');
    },
    // redirect: '/estate/electric',
    children: [
      {
        path: 'electric',
        name: 'electricPower',
        component: () => {
          return import('@/views/estate/eletric/TheEletric.vue');
        },
        children: [
          {
            path: 'case-1',
            name: 'case-1',
            component: () => {
              return import('@/views/estate/eletric/cases/TheCase.vue');
            },
          },
        ],
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
          return import('@/views/estate/medical/TheMedicalTreatment.vue');
        },
      },
      {
        path: 'industrial-zone',
        name: 'industrialZone',
        component: () => {
          return import('@/views/estate/industrialZoo/TheIndustrialZone.vue');
        },
      },
    ],
  },
];
