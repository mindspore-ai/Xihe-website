import { LOGIN_STATUS } from '@/shared/login';
import { useLoginStore } from '@/stores';
import { getStatistics } from '@/api/api-modelzoo.js';
import { ElMessage } from 'element-plus';

export default [
  // 大模型体验
  {
    path: '/modelzoo',
    name: 'modelzoo',
    component: () => {
      return import('@/views/modelzoo/TheModelzoo.vue');
    },
  },
  // 紫东.太初
  {
    path: '/modelzoo/taichu/introduce',
    name: 'taichuIntroduction',
    component: () => {
      return import('@/views/modelzoo/taichu/ModelzooTaichuIntro.vue');
    },
  },
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
        // name: 'taichuTest',
        redirect: '/modelzoo/taichu',
      },
    ],
  },
  // CodeGeex
  /*   {
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
      },

      {
        path: 'introduce',
        name: 'codegeexIntroduce',
        component: () => {
          return import('@/views/modelzoo/code-geex/TheCodeGeexIntroduce.vue');
        },
      },

      {
        path: 'experience',
        redirect: '/modelzoo/codegeex',
      },
    ],
  }, */
  // 武大.Luojia
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
        // name: 'luojiaTest',
        redirect: '/modelzoo/luojia',
      },
    ],
  },
  // AI文本检测器
  {
    path: '/modelzoo/text-detector',
    name: 'textDetector',
    component: () => {
      return import('@/views/modelzoo/text-detector/TheTextDetector.vue');
    },
    children: [
      {
        path: '',
        name: 'textDetectorExperience',
        component: () => {
          return import(
            '@/views/modelzoo/text-detector/TheTextDetectorExperience.vue'
          );
        },
      },
      {
        path: 'introduce',
        name: 'textDetectorIntroduce',
        component: () => {
          return import(
            '@/views/modelzoo/text-detector/TheTextDetectorIntroduce.vue'
          );
        },
      },
      {
        path: 'experience',
        redirect: '/modelzoo/text-detector',
      },
    ],
  },
  // 鹏程.神农
  {
    path: '/modelzoo/shennong/introduce',
    name: 'shennong',
    component: () => {
      return import('@/views/modelzoo/shengnong/ModelzooShennong.vue');
    },
  },
  // 新视觉改版后-悟空路由
  {
    path: '/modelzoo/wukong/introduce',
    name: 'wukongIntroduce',
    component: () => {
      return import('@/views/modelzoo/wukong/TheWukongIntroduce.vue');
    },
  },
  {
    path: '/modelzoo/wukong',
    name: 'wukongExperience',
    component: () => {
      return import('@/views/modelzoo/wukong/TheWukongExperience.vue');
    },
    beforeEnter: async (to, from, next) => {
      if (to.query.search) {
        getStatistics({ name: to.query.search })
          .then((res) => {
            return res;
          })
          .catch(() => {
            ElMessage({
              type: 'error',
              message: 'error',
            });
          });
        to.fullPath = '/modelzoo/wukong';
        to.query = {};
      }
      next();
    },
  },

  {
    path: '/modelzoo/wukong/admin',
    name: 'paintingManage',
    component: () => {
      return import('@/views/modelzoo/wukong/ThePaintingManagement.vue');
    },
    redirect: '/modelzoo/wukong/admin/collection',
    beforeEnter: async (to, from, next) => {
      const logingStore = useLoginStore();
      if (logingStore.loginStatus === LOGIN_STATUS.DONE) {
        next();
      } else {
        next('/modelzoo/wukong');
      }
    },
    children: [
      {
        path: 'collection',
        name: 'wukongCollection',
        component: () => {
          return import('@/views/modelzoo/wukong/TheCollection.vue');
        },
      },
      {
        path: 'public',
        name: 'wukongPublic',
        component: () => {
          return import('@/views/modelzoo/wukong/ThePublic.vue');
        },
      },
    ],
  },
  {
    path: '/modelzoo/wukong/album',
    name: 'AIAlbum',
    component: () => {
      return import('@/views/modelzoo/wukong/WukongAlbum.vue');
    },
  },
];
