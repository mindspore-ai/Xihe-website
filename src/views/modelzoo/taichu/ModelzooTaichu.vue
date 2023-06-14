<script setup>
import { ref, watch, nextTick, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import taichubg from '@/assets/imgs/taichu/taichu-bg.png';
import ONav from '@/components/ONav.vue';

import { ArrowRight } from '@element-plus/icons-vue';
import useWindowResize from '@/shared/hooks/useWindowResize.js';

import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const router = useRouter();
const route = useRoute();
const screenWidth = useWindowResize();

const activeNavItem = ref('');
const navItems = [
  {
    id: 'imageCaption',
    label: t('taichu.NAV_ITEMS[0]'),
    href: '/modelzoo/taichu',
  },
  {
    id: 'textToImage',
    label: t('taichu.NAV_ITEMS[1]'),
    href: '/modelzoo/taichu/text',
  },
  {
    id: 'taichuVision',
    label: t('taichu.NAV_ITEMS[2]'),
    href: '/modelzoo/taichu/vision',
  },
];

watch(
  () => {
    return route.name;
  },
  (val) => {
    if (
      /^taichuIntroduction|taichuVision|textToImage|imageCaption|taichuMobile/g.test(
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
  router.push({ path: item.href });
}

nextTick(() => {
  let bgImg = document.getElementById('app');
  bgImg.style.backgroundImage = `url(${taichubg})`;
  bgImg.style.backgroundSize = '100% 1200px';
  bgImg.style.backgroundPosition = '0px 254px';
  bgImg.children[1].style.background = 'unset';
  bgImg.children[2].style.backgroundColor = 'unset';
  if (screenWidth.value < 820) {
    bgImg.children[2].style.backgroundColor = '#F5F6F8';
  }
});
onUnmounted(() => {
  let bgImg = document.getElementById('app');
  bgImg.children[1].style.backgroundColor = '#F5F6F8';
  bgImg.children[2].style.backgroundColor = '#F5F6F8';
});
</script>

<template>
  <div class="taichu">
    <div class="taichu-wrapper">
      <div class="taichu-bread">
        <el-breadcrumb :separator-icon="ArrowRight">
          <el-breadcrumb-item :to="{ path: '/modelzoo' }">{{
            t('taichu.BIG_MODEL')
          }}</el-breadcrumb-item>
          <el-breadcrumb-item>{{ t('taichu.TITLE') }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="taichu-content-desc">
        <div class="taichu-tab">
          <o-nav
            :nav-items="navItems"
            :active-item="activeNavItem"
            @nav-click="handleNavClick"
          ></o-nav>
        </div>
      </div>
    </div>
    <div class="taichu-info">
      <router-view></router-view>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.taichu {
  min-height: calc(100vh - 200px);
  background-image: url(@/assets/imgs/wukong/wukong-banner.png);
  background-size: 100% 254px;
  background-repeat: no-repeat;
  @media screen and (max-width: 1080px) {
    background-image: url(@/assets/imgs/taichu/taichu-mobile-banner.png);
    padding-top: 80px;
    padding-top: 0;
    background-size: 100% 108px;
    background-position: 0 48px;
    background-color: #f5f6f8;
    .taichu-wrapper {
      padding: 16px 16px 0px;
    }
    .taichu-info {
      padding: 16px 16px 40px;
    }
  }
  .taichu-wrapper {
    margin: 0 auto;
    max-width: 1416px;
    .taichu-bread {
      padding-top: 120px;
      @media screen and (max-width: 1080px) {
        padding-top: 48px;
      }
    }
    .taichu-content-desc {
      margin-top: 68px;
      @media screen and (max-width: 1080px) {
        margin-top: 40px;
      }
      .taichu-tab {
        height: 48px;
        @media screen and (max-width: 1080px) {
          height: 34px;
        }
        :deep(.o-nav) {
          .nav-item {
            color: #555;
            font-size: 14px;
            @media screen and (max-width: 1080px) {
              font-size: 14px;
              font-weight: 400;
              color: #000000;
              line-height: 22px;
            }
          }
        }
      }
    }
  }
  .taichu-info {
    // background-color: #f5f6f8;
    border-radius: 16px;
  }
}
</style>
