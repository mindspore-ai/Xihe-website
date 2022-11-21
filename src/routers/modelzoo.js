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
        path: 'vision',
        name: 'taichuVision',
        component: () => {
          return import('@/views/modelzoo/taichu/ModelzooTaichuVision.vue');
        },
      },
      /* {
        path: 'experience',
        name: 'taichuExperience',
        component: () => {
          return import('@/views/modelzoo/taichu/ModelzooTaichuExperience.vue');
        },
      }, */
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
        path: '',
        name: 'imageCaption',
        component: () => {
          return import('@/views/modelzoo/taichu/ModelzooImageCaption.vue');
        },
      },
      {
        path: 'image',
        name: 'taichuTest',
        redirect: '/modelzoo/taichu',
      },
    ],
  },
  // CodeGeex
  {
    path: '/modelzoo/codegeex',
    name: 'codegeex',
    component: () => {
      return import('@/views/modelzoo/code-geex/TheCodeGeex.vue');
    },
    children: [
      {
        path: '',
        name: 'codegeexExperience',
        component: () => {
          return import('@/views/modelzoo/code-geex/TheCodeGeexExperience.vue');
        },
        redirect: '/',
      },
      // {
      //   path: 'introduce',
      //   name: 'codegeexIntroduce',
      //   component: () => {
      //     return import('@/views/modelzoo/code-geex/TheCodeGeexIntroduce.vue');
      //   },
      // },
      {
        path: 'introduce',
        name: 'codegeexIntroduce',
        component: () => {
          return import('@/views/modelzoo/code-geex/TheCodeGeexIntroduce.vue');
        },
        redirect: '/',
      },
      // {
      //   path: 'test',
      //   name: 'codegeexTest',
      //   redirect: '/modelzoo/codegeex',
      // },
      {
        path: 'test',
        name: 'codegeexTest',
        redirect: '/modelzoo/codegeex',
      },
    ],
  },
  // 武大.LuoJia
  {
    path: '/modelzoo/luojia',
    name: 'luojia',
    component: () => {
      return import('@/views/modelzoo/luojia/TheLuoJia.vue');
    },
    children: [
      {
        path: '',
        name: 'luojiaExperience',
        component: () => {
          return import('@/views/modelzoo/luojia/TheLuojiaExperience.vue');
        },
      },
      {
        path: 'introduce',
        name: 'luojiaIntroduce',
        component: () => {
          return import('@/views/modelzoo/luojia/TheLuojiaIntroduce.vue');
        },
      },
      {
        path: 'experience',
        name: 'luojiaTest',
        redirect: '/modelzoo/luojia',
      },
    ],
  },
  // 鹏程.盘古
  {
    path: '/modelzoo/pangu',
    name: 'pangu',
    component: () => {
      return import('@/views/modelzoo/pangu/ThePangu.vue');
    },
    children: [
      {
        path: '',
        name: 'panguExperience',
        component: () => {
          return import('@/views/modelzoo/pangu/ThePanguExperience.vue');
        },
      },
      {
        path: 'introduce',
        name: 'panguIntroduce',
        component: () => {
          return import('@/views/modelzoo/pangu/ThePanguIntroduce.vue');
        },
      },
      {
        path: 'experience',
        name: 'panguTest',
        redirect: '/modelzoo/pangu',
      },
    ],
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
