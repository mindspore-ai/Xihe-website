export default [
  // 大模型
  {
    path: '/modelzoo',
    name: 'modelzoo',
    component: () => {
      return import('@/views/modelzoo/TheModelzoo.vue');
    },
  },
  // 紫东.太初
  {
    path: '/modelzoo/taichu',
    name: 'taichu',
    component: () => {
      return import('@/views/modelzoo/ModelzooTaichu.vue');
    },
    children: [
      {
        path: '',
        name: 'taichuIntroduction',
        component: () => {
          return import('@/views/modelzoo/ModelzooTaichuIntro.vue');
        },
      },
      {
        path: 'test',
        name: 'taichuTest',
        component: () => {
          return import('@/views/modelzoo/ModelzooTaichuTest.vue');
        },
      },
    ],
  },
  // 武大.Luojia
  {
    path: '/modelzoo/luojia',
    name: 'luojia',
    component: () => {
      return import('@/views/modelzoo/ModelzooLuojia.vue');
    },
  },
];
