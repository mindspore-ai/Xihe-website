<script setup>
import { ref, watch, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ONav from '@/components/ONav.vue';
import { useCourseData } from '@/stores';

const route = useRoute();
const router = useRouter();
const activeNavItem = ref('');
// const is_apply = ref(false);

const courseInfo = useCourseData().courseData;

const navItems = reactive([
  {
    id: 'courseIntroduction',
    label: '课程介绍',
    href: 'introduction',
    isIndividual: false,
    showTask: true,
  },
  {
    id: 'courseChapter',
    label: '课节',
    href: 'chapter',
    isIndividual: false,
    showTask: true,
  },
  {
    id: 'courseTask',
    label: '作业',
    href: 'task',
    isIndividual: true,
    showTask: courseInfo.id === 'c001' ? true : false,
  },
  /* {
    id: 'discussion',
    label: '讨论',
    // href: courseInfo.forum,
    href: 'https://xihe.mindspore.cn/',
    windowOpen: true,
    isIndividual: false,
    showTask: true,
  }, */
  {
    id: 'courseTeacher',
    label: '教师介绍',
    href: 'teacher',
    isIndividual: false,
    showTask: true,
  },
  {
    id: 'courseCertificate',
    label: '结课证书',
    href: 'certificate',
    isIndividual: true,
    showTask: true,
  },
]);

const renderNav = ref();
// 渲染的nav数据 (区分是否报名)
watch(
  () => courseInfo.is_apply,
  (newValue) => {
    // 如果已经报名
    if (newValue) {
      renderNav.value = navItems.filter((item) => {
        return item.showTask;
      });
    } else {
      renderNav.value = navItems.filter((item) => {
        return !item.isIndividual;
      });
    }
  },
  { immediate: true }
);

watch(
  () => {
    return route.name;
  },
  (val) => {
    if (
      /^courseIntroduction|courseChapter|courseTask|courseTeacher|courseCertificate/g.test(
        val
      )
    ) {
      activeNavItem.value = val;
    } else {
      activeNavItem.value = '';
    }
  },
  { immediate: true }
);
// 点击导航
function handleNavClick(item) {
  if (item.windowOpen) {
    // TODO:链接无效
    window.open(courseInfo.forum);
  } else {
    router.push(`/course/${route.params.courseId}/${item.href}`);
  }
}

const props = defineProps({
  fixed: {
    type: Boolean,
    default: () => {
      return {};
    },
  },
});
watch(
  () => {
    return props.fixed;
  },
  (newVal) => {
    let tab = document.querySelector('.course-desc-tab');
    let box = document.querySelector('.course-desc-info');
    if (newVal) {
      tab.classList.add('fixed');
      box.style.paddingTop = '30px';
    } else {
      if (tab && Array.from(tab.classList).indexOf('fixed')) {
        tab.classList.remove('fixed');
        box.style.paddingTop = '0px';
      }
    }
  },
  { immediate: true }
);
</script>
<template>
  <div class="course-desc">
    <div class="course-desc-tab">
      <o-nav
        :nav-items="renderNav"
        :active-item="activeNavItem"
        @nav-click="handleNavClick"
      ></o-nav>
    </div>
    <div class="course-desc-info">
      <router-view />
    </div>
  </div>
</template>

<style lang="scss">
.course-desc {
  border-radius: 16px;
  &-tab {
    font-size: 90px;
    height: 69px;
    background-color: #fbfbfb;
    display: flex;
    justify-content: center;
    border-radius: 16px 16px 0 0;

    .o-nav {
      width: 100%;
      display: flex;
      justify-content: center;
      margin: 0 auto;
      .nav-item {
        color: #555;
      }
    }
  }
  .fixed {
    position: fixed;
    transition: all 1s linear;
    z-index: 100;
    top: 208px;
    display: flex;
    justify-content: center;
    width: 100%;
    max-width: 1440px;
  }
}
</style>
