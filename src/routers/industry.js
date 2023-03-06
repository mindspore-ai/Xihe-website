export default [
  {
    path: '/industry',
    name: 'industry',
    component: () => {
      return import('@/views/industry/TheIndustry.vue');
    },
  },
];
