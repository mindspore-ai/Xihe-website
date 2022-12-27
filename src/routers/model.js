export default [
  // 模型
  {
    path: '/models',
    name: 'models',
    component: () => {
      return import('@/views/model/TheModel.vue');
    },
  },
  {
    path: '/models/:user/:name',
    component: () => {
      return import('@/views/model/ModelDetail.vue');
    },
    children: [
      {
        path: '',
        name: 'modelCard',
        component: () => {
          return import('@/views/model/ModelCard.vue');
        },
        meta: {
          index: 0,
        },
      },
      {
        path: 'tree/:contents*',
        name: 'modelFile',
        component: () => {
          return import('@/views/model/ModelFile.vue');
        },
        meta: {
          index: 1,
        },
      },
      // 文件详情页
      {
        path: 'blob/:contents*',
        name: 'modelFileBlob',
        component: () => {
          return import('@/views/model/ModelFileBlob.vue');
        },
        meta: {
          index: 1,
        },
      },
      // 新建文件页
      {
        path: 'new/:contents*',
        name: 'modelFileNew',
        component: () => {
          return import('@/views/model/ModelFileNew.vue');
        },
        meta: {
          index: 1,
          isPrivate: true,
        },
      },
      // 编辑页面
      {
        path: 'edit/:contents*',
        name: 'modelFileEditor',
        component: () => {
          return import('@/views/model/ModelFileEditor.vue');
        },
        meta: {
          index: 1,
          isPrivate: true,
        },
      },
      // 上传页
      {
        path: 'upload/:contents*',
        name: 'modelFileUpload',
        component: () => {
          return import('@/views/model/ModelFileUpload.vue');
        },
        meta: {
          index: 1,
          isPrivate: true,
        },
      },
      // 仓库设置
      {
        path: 'settings',
        name: 'modelSet',
        component: () => {
          return import('@/views/model/ModelSet.vue');
        },
        meta: {
          index: 2,
          isPrivate: true,
        },
      },
    ],
  },
];
