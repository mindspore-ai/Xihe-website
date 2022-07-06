export default [
  // 数据集
  {
    path: '/datasets',
    name: 'datasets',
    component: () => {
      return import('@/views/dataset/TheDataset.vue');
    },
  },
  {
    path: '/datasets/:user/:name',
    name: 'dataset-detail',
    component: () => {
      return import('@/views/dataset/DatasetDetail.vue');
    },
    children: [
      {
        path: '',
        name: 'datasetCard',
        component: () => {
          return import('@/views/dataset/DatasetCard.vue');
        },
        meta: {
          index: 0,
        },
      },
      {
        path: 'tree/:contents*',
        name: 'datasetFile',
        component: () => {
          return import('@/views/dataset/DatasetFile.vue');
        },
        meta: {
          index: 1,
        },
      },
      // 文件详情页
      {
        path: 'blob/:contents*',
        name: 'datasetFileBlob',
        component: () => {
          return import('@/views/dataset/DatasetFileBlob.vue');
        },
        meta: {
          index: 1,
        },
      },
      // 新建文件页
      {
        path: 'new/:contents*',
        name: 'datasetFileNew',
        component: () => {
          return import('@/views/dataset/DatasetFileNew.vue');
        },
        meta: {
          index: 1,
          isPrivate: true,
        },
      },
      // 编辑页面
      {
        path: 'edit/:contents*',
        name: 'datasetFileEditor',
        component: () => {
          return import('@/views/dataset/DatasetFileEditor.vue');
        },
        meta: {
          index: 1,
          isPrivate: true,
        },
      },
      // 上传页
      {
        path: 'upload/:contents*',
        name: 'datasetFileUpload',
        component: () => {
          return import('@/views/dataset/DatasetFileUpload.vue');
        },
        meta: {
          index: 1,
          isPrivate: true,
        },
      },
      {
        path: 'settings',
        name: 'datasetSet',
        component: () => {
          return import('@/views/dataset/DatasetSet.vue');
        },
        meta: {
          index: 2,
          isPrivate: true,
        },
      },
    ],
  },
];
