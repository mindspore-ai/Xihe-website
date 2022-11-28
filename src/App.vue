<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import AppHeader from '@/components/AppHeader.vue';
import AppFooter from '@/components/AppFooter.vue';

import tipImg from '@/assets/imgs/home/tip.png';
import tipCloseImg from '@/assets/imgs/home/close.png';

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
      <img class="tip-btn" :src="tipCloseImg" @click="toggleTip(false)" />
    </div>

    <o-dialog :show="dialogVisible" :close="false">
      <template #head>
        <p class="dlg-title">新后台上线公告</p>
      </template>

      <div class="dlg-body">
        <p class="dlg-content">
          致所有用户：<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;为了优化平台的性能和功能，提高平台可扩展性和稳定性，平台重构了后台架构，在本次更新中，平台做了几大调整：<br /><br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          1.支持通过git对仓库文件进行版本控制、批量上传和gitlfs上传大文件等操作。<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2.为适配后续版本的迭代，平台设定了一些规则对原有的数据进行迁移，可能会导致部分数据存放的位置和命名的方式与原来不一致。目前最新的迁移时间是2022/11/27
          17:00。<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3.具体数据迁移规则和优化详情请阅读
          <a href="https://xihe-docs.mindspore.cn/zh/release/"
            >平台更新说明文档</a
          >
          。<br /><br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;在上线前，我们对平台进行了测试、修复BUG，但可能无法保证做到百分百排除所有问题。如大家在使用过程中遇到BUG，可以添加官方助手小猫子（
          <span>微信号：mindspore0328</span>
          ），您也可以联系我们的邮箱
          <span>contact@mindspore.cn</span>
          ，我们会及时回复。还请大家给予一些耐心与理解，我们会全力解决各类问题，优化大家的平台体验。<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;感谢大家一直以来的支持！期待昇思大模型平台能让您零距离感受AI大模型，更加轻松体验模型的训练与推理！
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
    position: relative;
    margin-right: 16px;
    .tip-img {
      max-width: 200px;
      object-fit: fill;
      cursor: pointer;
    }
    .tip-btn {
      position: absolute;
      right: 2px;
      top: 50px;
      max-width: 17px;
      cursor: pointer;
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
  a {
    color: #0d8dff;
  }
  span {
    font-weight: 600;
  }
}

.dlg-btn {
  display: flex;
  margin-top: 24px;
  margin-bottom: 16px;
  justify-content: center;
}
</style>
