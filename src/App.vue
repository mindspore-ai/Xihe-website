<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import AppHeader from '@/components/AppHeader.vue';
import AppFooter from '@/components/AppFooter.vue';

import tipImg from '@/assets/imgs/home/tip.png';

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

const dialogVisible = ref(false);
const toggleDlg = (val) => {
  dialogVisible.value = val;
};

const tipVisible = ref(true);
const toggleTip = (val) => {
  tipVisible.value = val;
};

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

  <div v-if="tipVisible" class="app-tip">
    <div class="tip-content">
      <img class="tip-img" :src="tipImg" @click="toggleDlg(true)" />
      <!-- <img class="tip-btn" :src="tipCloseImg" @click="toggleTip(false)" /> -->
    </div>

    <o-dialog :show="dialogVisible" :close="false">
      <template #head>
        <p class="dlg-title">新后台上线公告</p>
      </template>

      <div class="dlg-body">
        <p class="dlg-content">
          tip图片的关闭icon单独切一下
          公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容
        </p>
      </div>

      <template #foot>
        <div class="dlg-btn">
          <OButton type="primary" size="small" @click="toggleDlg(fasle)"
            >我知道啦</OButton
          >
        </div>
      </template>
    </o-dialog>
  </div>
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
.app-tip {
  position: fixed;
  z-index: 1;
  bottom: 30vh;
  right: 0;
  .tip-content {
    .tip-img {
      max-width: 200px;
      object-fit: fill;
      cursor: pointer;
    }
    .tip-btn {
    }
  }
}
.dlg-title {
  text-align: center;
  font-size: 24px;
  font-weight: normal;
  color: #000000;
  line-height: 32px;
}

.dlg-content {
  font-size: 14px;
  font-weight: normal;
  color: #555555;
  line-height: 22px;
}

.dlg-btn {
  display: flex;
  margin-top: 24px;
  margin-bottom: 16px;
  justify-content: center;
}
</style>
