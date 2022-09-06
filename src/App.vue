<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import AppHeader from '@/components/AppHeader.vue';
import AppFooter from '@/components/AppFooter.vue';

// import {
//   getGitlabToken,
//   creatModelRepo,
//   getModelById,
//   uploadFileGitlab,
//   getGitlabTree,
// } from '@/api/api-gitlab';

const route = useRoute();

const showFooter = computed(() => {
  return !(route.path === '/' || route.path === '/home');
});

const header = ref(null);
const isHeaderTransparent = ref(false);

const setHeader = () => {
  const scrollTop = document.documentElement.scrollTop;
  const scrollLeft = document.documentElement.scrollLeft;

  isHeaderTransparent.value = scrollTop > 0 ? true : false;
  header.value && (header.value.style.left = `-${scrollLeft}px`);
};

setTimeout(() => {
  // getGitlabToken().then((res) => {
  //   console.log(res.data.token);
  // });
  // getModelById().then((res) => {
  //   console.log(res);
  // });
  // getGitlabTree().then((res) => {
  //   console.log(res);
  // });
  // uploadFileGitlab().then((res) => {
  //   console.log(res);
  // });
}, 3000);
onMounted(() => {
  window.addEventListener('scroll', setHeader);
});

onUnmounted(() => {
  window.removeEventListener('scroll', setHeader);
});
</script>

<template>
  <header
    ref="header"
    class="app-header"
    :class="{ opaque: isHeaderTransparent }"
  >
    <app-header></app-header>
  </header>
  <main class="app-body">
    <router-view></router-view>
  </main>
  <footer v-if="showFooter" class="app-footer">
    <app-footer></app-footer>
  </footer>
</template>

<style lang="scss">
#app {
  min-width: 1280px;
}

.app-header {
  position: fixed;
  z-index: 1000;
  height: 80px;
  left: 0;
  top: 0;
  right: 0;
  background-color: rgba(6, 11, 41, 0.85);
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
  min-width: 1280px;
}

.opaque {
  z-index: 100;
  background-color: rgba(6, 11, 41, 1);
}

.app-body {
  min-width: 1280px;
  min-height: calc(100vh - 200px);
  // background: #f5f6f8;
}

.app-footer {
  min-width: 1280px;
  background-color: #18191d;
  background-image: url(@/assets/imgs/footer-bg.png);
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.5s cubic-bezier(0.5, 0.05, 0.5, 0.95);
}

.slide-enter-from {
  position: absolute;
  top: -100%;
}

.slide-enter-to {
  position: absolute;
  top: 0;
}

.slide-leave-from {
  position: absolute;
  top: 0;
}

.slide-leave-to {
  position: absolute;
  top: 100%;
}
</style>
