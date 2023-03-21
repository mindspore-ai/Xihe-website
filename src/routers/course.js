import { useLoginStore } from '@/stores';
import { LOGIN_STATUS } from '@/shared/login';

export default [
  // 课程
  {
    path: '/course',
    name: 'course',
    component: () => {
      return import('@/views/course/TheCourse.vue');
    },
  },
  // 课程详情
  {
    path: '/course/:courseId',
    name: 'courseDetail',
    component: () => {
      return import('@/views/course/CourseDetail.vue');
    },
    redirect: { name: 'courseIntroduction' },
    children: [
      // 课程介绍
      {
        path: 'introduction',
        name: 'courseIntroduction',
        component: () => {
          return import('@/views/course/CourseIntroduction.vue');
        },
      },
      // 课节
      {
        path: 'chapter',
        name: 'courseChapter',
        component: () => {
          return import('@/views/course/CourseChapter.vue');
        },
      },
      // 作业
      {
        path: 'task',
        name: 'courseTask',
        component: () => {
          return import('@/views/course/CourseTask.vue');
        },
      },
      // 教师介绍
      {
        path: 'teacher',
        name: 'courseTeacher',
        component: () => {
          return import('@/views/course/CourseTeacher.vue');
        },
      },
      // 结课证书
      {
        path: 'certificate',
        name: 'courseCertificate',
        component: () => {
          return import('@/views/course/CourseCertificate.vue');
        },
      },
    ],
  },
  // 课程视频页
  {
    path: '/course/lessonvideo/:courseId/:chapterId',
    name: 'courseVideo',
    component: () => {
      return import('@/views/course/CourseVideo.vue');
    },
    beforeEnter: async () => {
      const logingStore = useLoginStore();
      if (logingStore.loginStatus !== LOGIN_STATUS.DONE) {
        return {
          name: '404',
        };
      }
    },
  },
];
