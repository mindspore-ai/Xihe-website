<script setup>
import { ref, watch, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import ONav from '@/components/ONav.vue';

import wukongBanner1 from '@/assets/imgs/wukong/wukong-banner1.png';
import wukongBanner2 from '@/assets/imgs/wukong/wukong-banner2.png';
import background from '@/assets/imgs/wukong/wukong-bg.jpg';
import mobileBackground from '@/assets/imgs/wukong/wukong-bg-mobile.png';

import IconAlbum from '~icons/app/wukong-album';
import IconPainting from '~icons/app/painting';
import IconArrowRight from '~icons/app/arrow-right.svg';

import { ArrowRight } from '@element-plus/icons-vue';

import { goAuthorize } from '@/shared/login';
import { useLoginStore } from '@/stores';
import useWindowResize from '@/shared/hooks/useWindowResize.js';

const screenWidth = useWindowResize();

const isLogined = computed(() => useLoginStore().isLogined);

const route = useRoute();
const router = useRouter();
const activeNavItem = ref('');

const isToggle = ref(false);

const navItems = [
  {
    id: 'wukongIntroduce',
    label: '介绍',
    href: '/modelzoo/wukong/introduce',
  },
  {
    id: 'wukongExperience',
    label: '在线体验',
    href: '/modelzoo/wukong',
  },
];
// 点击导航
function handleNavClick(item) {
  router.push({ path: item.href });
}
// 画作管理
function toggleCollectionDlg() {
  if (!isLogined.value) {
    goAuthorize();
  } else {
    router.push('/modelzoo/wukong/admin');
  }
}

const showAlbum = ref(false);
// AI画集
function toggleAlbum() {
  showAlbum.value = true;
  router.push('/modelzoo/wukong/album');
}

function learnWukongMore() {
  window.open(
    'https://github.com/mindspore-lab/minddiffusion/tree/main/vision/wukong-huahua'
  );
}

const routeList = [
  {
    name: 'AI画集',
    path: '/modelzoo/wukong/album',
    icon: IconAlbum,
  },
  {
    name: '画作管理',
    path: '/modelzoo/wukong/admin',
    icon: IconPainting,
  },
];

function goPath(val) {
  router.push(val);
}

function goAiAlblum() {
  router.push('/modelzoo/wukong/album');
}

watch(
  () => activeNavItem.value,
  () => {
    isToggle.value = activeNavItem.value === 'wukongIntroduce' ? false : true;
  }
);
watch(
  () => {
    return route.name;
  },
  (val) => {
    if (/^wukongIntroduce|wukongExperience/g.test(val)) {
      activeNavItem.value = val;
    } else {
      activeNavItem.value = '';
    }
  },
  { immediate: true }
);
</script>
<template>
  <div :class="isToggle ? 'wukong-bg2' : 'wukong-bg1'">
    <img
      v-if="isToggle && screenWidth > 820"
      class="bg2-image"
      :src="background"
      alt=""
    />
    <img
      v-if="isToggle && screenWidth <= 820"
      class="bg2-image-mobile"
      :src="mobileBackground"
      alt=""
    />

    <div class="wukong">
      <div class="wukong-bread">
        <el-breadcrumb :separator-icon="ArrowRight">
          <el-breadcrumb-item :to="{ path: '/modelzoo' }"
            >大模型</el-breadcrumb-item
          >
          <el-breadcrumb-item>悟空画画</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <div class="wukong-head">
        <div class="wukong-left">
          <img
            v-if="route.name === 'wukongIntroduce'"
            draggable="false"
            :src="wukongBanner1"
            alt=""
          />
          <img v-else draggable="false" :src="wukongBanner2" alt="" />
        </div>

        <div class="wukong-right">
          <div class="wukong-right-top">
            <div class="wukong-right-title">悟空.画画</div>
            <div class="wukong-right-content">
              借助目前最大的中文开源多模态数据集悟空数据集进行训练，悟空-画画模型拥有优秀的中文文本-图像生成能力。模型能够识别各类场景描述与绘画风格，给用户带来良好的使用体验。
            </div>
          </div>

          <div class="right-button">
            <OButton
              type="primary"
              :size="screenWidth < 820 ? 'mini' : 'medium'"
              animation
              @click="learnWukongMore"
            >
              了解更多
              <template #suffix>
                <OIcon><IconArrowRight /></OIcon>
              </template>
            </OButton>

            <OButton
              type="outline"
              :size="screenWidth < 820 ? 'mini' : 'medium'"
              animation
              @click="goAiAlblum()"
            >
              AI画集
              <template #suffix>
                <OIcon><IconArrowRight /></OIcon>
              </template>
            </OButton>
          </div>
        </div>
      </div>

      <div class="wukong-main">
        <div class="nav-tab">
          <o-nav
            :nav-items="navItems"
            :active-item="activeNavItem"
            @nav-click="handleNavClick"
          ></o-nav>
        </div>
        <div class="tab-content">
          <router-view></router-view>
        </div>

        <div
          v-if="route.name === 'wukongExperience'"
          class="mobile-sider-content"
        >
          <div
            v-for="item in routeList"
            :key="item.path"
            class="jump-item"
            @click="goPath(item.path)"
          >
            <div class="left">
              <OIcon><component :is="item.icon"></component></OIcon>
              <span>{{ item.name }}</span>
            </div>
            <div class="right">
              <o-icon><icon-arrowRight></icon-arrowRight></o-icon>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="route.name === 'wukongExperience'" class="sider-content">
      <div class="nav-item" @click="toggleAlbum(true)">
        <p class="nav-item-img">
          <o-icon><icon-album></icon-album></o-icon>
        </p>
        <p class="nav-item-text">AI画集</p>
      </div>
      <div class="nav-item" @click="toggleCollectionDlg()">
        <p class="nav-item-img">
          <o-icon><icon-painting></icon-painting></o-icon>
        </p>
        <p class="nav-item-text">画作管理</p>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
:deep(.el-dialog) {
  --el-dialog-bg-color: rgba(0, 0, 0, 0.85) !important;
  .el-dialog__header {
    padding: 15px 0 15px;
    position: sticky;
    top: 0;
    background: #000;
    z-index: 200;
    span {
      color: #fff;
      font-size: 24px;
    }
  }
  .el-dialog__body {
    padding-top: 0;
  }
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background-color: #d8d8d8;
    background-clip: content-box;
  }
  &::-webkit-scrollbar-track {
    border-radius: 3px;
    box-shadow: inset 0 0 2px rgba($color: #000000, $alpha: 0.2);
    background: #ffffff;
  }
  .el-dialog__headerbtn {
    position: fixed;
    top: 6px;
    right: 15px;
    z-index: 201;
    .el-dialog__close {
      color: #fff;
      font-size: 40px;
    }
  }
}

.wukong-bg1 {
  background: #f5f6f8;

  .wukong-bread {
    @media screen and (max-width: 820px) {
      display: none;
    }
  }
}

.wukong-bg2 {
  min-height: calc(100vh - 200px);
  background-color: #000;
  position: relative;
  overflow: hidden;
  @media screen and (max-width: 820px) {
    min-height: calc(100vh - 170px);
  }

  .bg2-image {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }
  .bg2-image-mobile {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    @media screen and (max-width: 820px) {
      display: none;
    }
  }
  .wukong {
    background-image: url('@/assets/imgs/wukong/wukong-bg-mobile.png');
    background-repeat: no-repeat;
    background-size: cover;
    min-height: calc(100vh - 170px);
  }
  .wukong-bread {
    margin-bottom: 40px;
    @media screen and (max-width: 820px) {
      display: none;
    }
    .el-breadcrumb {
      :deep(.el-breadcrumb__item:last-child .el-breadcrumb__inner) {
        color: #fff !important;
        z-index: 99;
      }
      :deep(.el-breadcrumb__item:first-child .el-breadcrumb__inner) {
        color: #b2b2b2 !important;
        z-index: 99;
      }
    }
  }
  .wukong-head {
    background: rgba(7, 12, 22, 0.6) !important;
    box-shadow: 0px 1px 5px 0px rgba(45, 47, 51, 0.1);
    backdrop-filter: blur(5px);
    .wukong-right {
      .wukong-right-top {
        .wukong-right-title {
          font-size: 36px;
          color: #fff !important;
          line-height: 48px;
        }
        .wukong-right-content {
          font-size: 14px;
          color: #b2b2b2 !important;
          line-height: 22px;
        }
      }
      .right-button {
        .o-button:first-child {
          margin-right: 16px;
          @media screen and (max-width: 820px) {
            margin-right: 12px;
          }
        }
      }
    }
  }
  .wukong-main {
    .nav-tab {
      margin-top: 16px;
      height: 48px;
      @media screen and (max-width: 820px) {
        background: none !important;
      }
      .o-nav {
        background: rgba(7, 12, 22, 0.6) !important;
        box-shadow: 0px 1px 5px 0px rgba(45, 47, 51, 0.1);
        backdrop-filter: blur(5px);
        @media screen and (max-width: 820px) {
          background-color: rgba(0, 0, 0, 0.2);
        }
        :deep(.nav-item:first-child) {
          color: #fff !important;
        }
      }
    }
    .tab-content {
      padding: 40px 80px;
      background: rgba(7, 12, 22, 0.6) !important;
      box-shadow: 0px 1px 30px 0px rgba(0, 0, 0, 0.05);
      backdrop-filter: blur(5px);
      position: relative;
    }
    .mobile-sider-content {
      display: none;

      @media screen and (max-width: 820px) {
        position: relative;
        display: flex;
        justify-content: space-between;
        padding: 24px 16px 0;
        font-size: 18px;
        line-height: 24px;
        font-weight: 400;
        color: #ffffff;
      }
      @media screen and (max-width: 767px) {
        font-size: 12px;
        padding: 16px 16px 0;
      }
      .jump-item {
        flex: 1;
        background: rgba(255, 255, 255, 0.1);
        box-shadow: 0px 1px 30px 0px rgba(0, 0, 0, 0.05);
        display: flex;
        justify-content: space-between;
        align-items: center;
        @media screen and (max-width: 820px) {
          padding: 24px;
        }
        @media screen and (max-width: 767px) {
          padding: 12px;
        }
        &:first-child {
          margin-right: 16px;
        }
        .left {
          display: flex;
          align-items: center;
          .o-icon {
            font-size: 24px;
            margin-right: 12px;
          }
        }
        .right {
          font-size: 24px;
          height: 24px;
          @media screen and (max-width: 767px) {
            font-size: 12px;
            height: 12px;
          }
        }
      }
    }
  }
}

.wukong {
  padding: 120px 16px 64px;
  margin: 0 auto;
  max-width: 1448px;
  height: 100%;
  @media screen and (max-width: 820px) {
    padding: 48px 0px 40px;
  }
  .wukong-bread {
    margin-bottom: 40px;
    .el-breadcrumb {
      height: 21px;
      line-height: 21px;
      .el-breadcrumb__item {
        :deep(.el-breadcrumb__inner.is-link) {
          color: #555;
          font-weight: 400;
          &:hover {
            color: #0d8dff;
          }
        }
        :deep(.el-breadcrumb__separator.el-icon) {
          color: #555;
        }
      }
      :deep(.el-breadcrumb__item:last-child .el-breadcrumb__inner) {
        color: #000;
      }
    }
  }

  .wukong-head {
    padding: 80px;
    background-color: #fff;
    box-shadow: 0px 1px 5px 0px rgba(45, 47, 51, 0.1);
    display: flex;
    margin-top: 40px;
    @media screen and (max-width: 820px) {
      padding: 16px;
      margin: 16px;
    }
    .wukong-left {
      margin-right: 40px;
      @media screen and (max-width: 820px) {
        display: none;
      }
      img {
        width: 416px;
      }
    }
    .wukong-right {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .wukong-right-top {
        .wukong-right-title {
          line-height: 48px;
          font-size: 36px;
          color: #000000;
          margin-bottom: 16px;
          @media screen and (max-width: 820px) {
            font-size: 20px;
            line-height: 32px;
            font-weight: 300;
            margin-bottom: 16px;
          }
          @media screen and (max-width: 768px) {
            font-size: 16px;
            line-height: 24px;
            font-weight: 300;
            margin-bottom: 8px;
          }
        }
        .wukong-right-content {
          font-size: 14px;
          color: #555555;
          line-height: 22px;
          @media screen and (max-width: 820px) {
            margin-bottom: 24px;
            font-size: 14px;
            line-height: 18px;
            font-weight: 400;
          }
          @media screen and (max-width: 768px) {
            margin-bottom: 16px;
            font-size: 12px;
            line-height: 18px;
            font-weight: 400;
          }
        }
      }
    }
  }

  .wukong-main {
    margin-top: 16px;
    .nav-tab {
      height: 48px;
      background: #ffffff;
      @media screen and (max-width: 820px) {
        height: 34px;
      }
      .o-nav {
        background-color: rgba(251, 251, 251, 0.85);
        box-shadow: 0px -1px 30px 0px rgba(0, 0, 0, 0.05);
      }
      :deep(.o-nav) {
        width: 100%;
        display: flex;
        justify-content: center;
        margin: 0 auto;
        .nav-item {
          color: #555;
          @media screen and (max-width: 820px) {
            font-size: 14px;
            font-weight: 400;
            line-height: 22px;
          }
        }
      }
    }
    .tab-content {
      padding: 40px 80px;
      background: #fff;
      @media screen and (max-width: 820px) {
        padding: 24px 16px;
        margin: 16px 16px 0;
      }
    }
  }
}
.sider-content {
  position: fixed;
  top: 50%;
  right: 60px;
  transform: translateY(-50%);
  color: #fff;
  @media screen and (max-width: 820px) {
    display: none;
  }
  .nav-item {
    margin-bottom: 16px;
    text-align: center;
    cursor: pointer;
    .nav-item-img {
      width: 80px;
      height: 80px;
      background: rgba(255, 255, 255, 0.1);
      box-shadow: 0px 1px 30px 0px rgba(0, 0, 0, 0.05);
      font-size: 48px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .nav-item-text {
      font-size: 14px;
      font-weight: 400;
      color: #b2b2b2;
      line-height: 20px;
      margin-top: 8px;
    }
  }
}
</style>
