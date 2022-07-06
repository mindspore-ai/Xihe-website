import { useLoginStore } from '@/stores';

export default [
  // 项目
  {
    path: '/projects',
    name: 'projects',
    component: () => {
      return import('@/views/project/TheProject.vue');
    },
  },
  {
    path: '/projects/:user/:name/selectfile',
    name: 'projectsSelectFile',
    component: () => {
      return import('@/views/project/ProjectSelectFile.vue');
    },
    beforeEnter: async () => {
      const logingStore = useLoginStore();
      if (!logingStore.isLogined) {
        return {
          name: 'home',
        };
      }
    },
  },
  {
    path: '/projects/:user/:name/createfile',
    name: 'projectsCreateFile',
    component: () => {
      return import('@/views/project/ProjectCreateFile.vue');
    },
    beforeEnter: async () => {
      const logingStore = useLoginStore();
      if (!logingStore.isLogined) {
        return {
          name: 'home',
        };
      }
    },
  },
  // {
  //   path: '/projects/:user/:name/projectAim',
  //   name: 'projectsAim',
  //   component: () => {
  //     return import('@/views/project/ProjectAim.vue');
  //   },
  //   beforeEnter: async () => {
  //     const logingStore = useLoginStore();
  //     if (!logingStore.isLogined) {
  //       return {
  //         name: 'home',
  //       };
  //     }
  //   },
  // },
  {
    path: '/projects/:user/:name',
    name: 'project-detail',
    component: () => {
      return import('@/views/project/ProjectDetail.vue');
    },
    children: [
      {
        path: '',
        name: 'projectCard',
        component: () => {
          return import('@/views/project/ProjectCard.vue');
        },
        meta: {
          index: 0,
        },
      },
      {
        path: 'train',
        name: 'projectTrain',
        component: () => {
          return import('@/views/project/ProjectTrain.vue');
        },
        meta: {
          index: 1,
        },
      },
      {
        path: 'settings',
        name: 'projectSet',
        component: () => {
          return import('@/views/project/ProjectSet.vue');
        },
        meta: {
          index: 3,
          isPrivate: true,
        },
      },
      {
        path: 'trainlist',
        name: 'projectTrainList',
        component: () => {
          return import('@/views/project/ProjectTrainList.vue');
        },
        meta: {
          index: 1,
        },
        beforeEnter: async () => {
          const logingStore = useLoginStore();
          if (!logingStore.isLogined) {
            return {
              name: 'home',
            };
          }
        },
      },
      {
        path: 'trainlog/:trainId',
        name: 'projectTrainLog',
        component: () => {
          return import('@/views/project/ProjectTrainLog.vue');
        },
        meta: {
          index: 1,
        },
        beforeEnter: async () => {
          const logingStore = useLoginStore();
          if (!logingStore.isLogined) {
            return {
              name: 'home',
            };
          }
        },
      },
      {
        path: 'tree/:contents*',
        name: 'projectFile',
        component: () => {
          return import('@/views/project/ProjectFile.vue');
        },
        meta: {
          index: 2,
        },
      },
      // 文件详情页
      {
        path: 'blob/:contents*',
        name: 'projectFileBlob',
        component: () => {
          return import('@/views/project/ProjectFileBlob.vue');
        },
        meta: {
          index: 1,
        },
      },
      // 新建文件页
      {
        path: 'new/:contents*',
        name: 'projectFileNew',
        component: () => {
          return import('@/views/project/ProjectFileNew.vue');
        },
        meta: {
          index: 1,
          isPrivate: true,
        },
      },
      // 编辑页面
      {
        path: 'edit/:contents*',
        name: 'projectFileEditor',
        component: () => {
          return import('@/views/project/ProjectFileEditor.vue');
        },
        meta: {
          index: 1,
          isPrivate: true,
        },
      },
      // 上传页
      {
        path: 'upload/:contents*',
        name: 'projectFileUpload',
        component: () => {
          return import('@/views/project/ProFileUpload.vue');
        },
        meta: {
          index: 1,
          isPrivate: true,
        },
      },
    ],
  },
];
