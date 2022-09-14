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
      return import('@/views/modelzoo/taichu/ModelzooTaichu.vue');
    },

    children: [
      {
        path: '',
        name: 'taichuVision',
        component: () => {
          return import('@/views/modelzoo/taichu/ModelzooTaichuVision.vue');
        },
      },

      {
        path: 'experience',
        name: 'taichuExperience',
        component: () => {
          return import('@/views/modelzoo/taichu/ModelzooTaichuExperience.vue');
        },
      },
      {
        path: 'introduce',
        name: 'taichuIntroduction',
        component: () => {
          return import('@/views/modelzoo/taichu/ModelzooTaichuIntro.vue');
        },
      },
      {
        path: 'text',
        name: 'textToImage',
        component: () => {
          return import('@/views/modelzoo/taichu/ModelzooTextToImage.vue');
        },
      },
      {
        path: 'image',
        name: 'imageCaption',
        component: () => {
          return import('@/views/modelzoo/taichu/ModelzooImageCaption.vue');
        },
      },
      {
        path: 'test',
        name: 'taichuTest',
        redirect: '/modelzoo/taichu',
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
  // 鹏程.盘古
  {
    path: '/modelzoo/pangu',
    name: 'pangu',
    component: () => {
      return import('@/views/modelzoo/ModelzooPangu.vue');
    },
  },
  // 鹏程.神农
  {
    path: '/modelzoo/shennong',
    name: 'shennong',
    component: () => {
      return import('@/views/modelzoo/ModelzooShennong.vue');
    },
  },
];
