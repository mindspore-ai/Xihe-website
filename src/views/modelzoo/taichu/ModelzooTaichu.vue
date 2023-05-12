<script setup>
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import OButton from '@/components/OButton.vue';
import ONav from '@/components/ONav.vue';

import { ArrowRight } from '@element-plus/icons-vue';
const router = useRouter();
const route = useRoute();

const activeNavItem = ref('');
const navItems = [
  {
    id: 'imageCaption',
    label: '以图生文',
    href: '/modelzoo/taichu',
  },
  {
    id: 'textToImage',
    label: '以文生图',
    href: '/modelzoo/taichu/text',
  },
  {
    id: 'taichuVision',
    label: '视觉问答',
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
</script>

<template>
  <div class="taichu">
    <div class="taichu-wrapper">
      <div class="taichu-bread">
        <el-breadcrumb :separator-icon="ArrowRight">
          <el-breadcrumb-item :to="{ path: '/modelzoo' }"
            >大模型</el-breadcrumb-item
          >
          <el-breadcrumb-item>紫东.太初</el-breadcrumb-item>
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
  background-color: #f5f6f8;
  background-image: url(@/assets/imgs/wukong/wukong-banner.png);
  background-size: 100% 254px;
  background-repeat: no-repeat;
  @media screen and (max-width: 1080px) {
    background-image: url(@/assets/imgs/taichu/taichu-mobile-banner.png);
    padding-top: 80px;
    padding-top: 0;
    background-size: 100% 108px;
    background-position: 0 48px;
    .taichu-wrapper {
      padding: 16px 16px 0px;
    }
    .taichu-info {
      padding: 16px 16px 40px;
    }
  }
  .taichu-wrapper {
    margin: 0 auto;
    max-width: 1440px;
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
    background-color: #f5f6f8;
    border-radius: 16px;
  }
}
</style>
