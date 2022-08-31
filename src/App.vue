<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import AppHeader from '@/components/AppHeader.vue';
import AppFooter from '@/components/AppFooter.vue';

import IconLeft from '~icons/app/left';
const route = useRoute();
const router = useRouter();

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

onMounted(() => {
  window.addEventListener('scroll', setHeader);
});

// 紫东太初移动端适配
const isTaichuPage = computed(() => {
  return (
    route.name === 'taichu' ||
    route.name === 'taichuIntroduction' ||
    route.name === 'taichuTest'
  );
});

const screenWidth = ref(
  window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth
);

const onResize = () => {
  screenWidth.value =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
};
window.addEventListener('resize', onResize);

const goBack = () => {
  router.go(-1);
};

const winWidth =
  window.innerWidth ||
  document.documentElement.clientWidth ||
  document.body.clientWidth;
onUnmounted(() => {
  window.removeEventListener('scroll', setHeader);
  window.removeEventListener('resize', onResize);
});
</script>

<template>
  <header
    v-if="!isTaichuPage || screenWidth > 1080"
    ref="header"
    class="app-header"
    :class="{
      opaque: isHeaderTransparent,
      hide: winWidth < 1080,
    }"
  >
    <app-header></app-header>
  </header>

  <header v-else class="mobile-header">
    <div class="back" @click="goBack">
      <OIcon><IconLeft /></OIcon>
    </div>
    <span>大模型</span>
  </header>

  <div class="app-body">
    <router-view></router-view>
  </div>
  <footer v-if="showFooter" class="app-footer">
    <app-footer></app-footer>
  </footer>
</template>

<style lang="scss">
#app {
  min-width: 1280px;
}
// TODO:紫东太初移动端头部简单适配
.mobile-header {
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  padding: 0 16px;
  justify-content: center;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 3px 8px 0px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(5px);
  height: 24px;
  font-size: 16px;
  color: #000000;
  line-height: 24px;
  .back {
    position: absolute;
    height: 100%;
    cursor: pointer;
    display: flex;
    align-items: center;
    left: 16px;
    font-size: 24px;
  }
}

.hide {
  display: none;
}

// TODO:移动端适配内容
.mobile-fit {
  #app {
    min-width: auto;
    width: 100vw;
  }
}
// TODO:移动端适配内容
.mobile-header {
  width: 100%;
  height: 48px;
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

// TODO:移动端适配
.mobile-fit {
  .app-header {
    min-width: auto;
    width: 100vw;
  }
}

.opaque {
  z-index: 100;
  background-color: rgba(6, 11, 41, 1);
}

.app-body {
  min-width: 1280px;
  min-height: calc(100vh - 200px);
}

// TODO:移动端适配
.mobile-fit {
  .app-body {
    min-width: auto;
    width: 100vw;
  }
}

.app-footer {
  min-width: 1280px;
  background-color: #18191d;
  background-image: url(@/assets/imgs/footer-bg.png);
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

// TODO:移动端适配
.mobile-fit {
  .app-footer {
    min-width: auto;
    width: 100vw;
  }
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
