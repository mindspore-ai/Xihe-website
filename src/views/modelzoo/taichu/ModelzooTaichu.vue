<script setup>
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import OButton from '@/components/OButton.vue';
import ONav from '@/components/ONav.vue';
import IconArrowRight from '~icons/app/arrow-right.svg';

import { ArrowRight } from '@element-plus/icons-vue';
import taichuBanner from '@/assets/imgs/taichu/taichu-banner.png';
import useWindowResize from '@/shared/hooks/useWindowResize.js';

const screenWidth = useWindowResize();
const router = useRouter();
const route = useRoute();

const activeNavItem = ref('');
const navItems = [
  {
    id: 'taichuIntroduction',
    label: '介绍',
    href: '/modelzoo/taichu/introduce',
  },
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
function goTaichuMore() {
  window.open('https://gitee.com/mindspore/omni-perception-pretrainer');
}
</script>

<template>
  <div class="taichu">
    <div class="taichu-wrap">
      <div class="taichu-bread">
        <el-breadcrumb :separator-icon="ArrowRight">
          <el-breadcrumb-item :to="{ path: '/modelzoo' }"
            >大模型</el-breadcrumb-item
          >
          <el-breadcrumb-item>紫东.太初</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="taichu-content">
        <div class="taichu-content-banner">
          <div class="content-banner-left">
            <img draggable="false" :src="taichuBanner" alt="" />
          </div>
          <div class="content-banner-right">
            <div class="content-banner-right-title">紫东.太初</div>
            <div class="content-banner-right-content">
              OPT（Omni-Perception
              Pre-Trainer）是全场景感知预训练模型的简称，是中科院自动化和华为在探索通用人工智能道路上的重要成果，并在2021年9月发布了全球首个图文音三模态千亿大模型，中文名字叫紫东.太初；支持文本、视觉、语音不同模态间的高效协同，可支撑影视创作、工业质检、智能驾驶等产业应用。
            </div>
            <div class="content-banner-right-btn">
              <OButton
                type="primary"
                :size="screenWidth < 820 ? 'mini' : 'medium'"
                animation
                @click="goTaichuMore"
              >
                了解更多
                <template #suffix>
                  <OIcon><IconArrowRight /></OIcon>
                </template>
              </OButton>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="taichu-content-desc">
      <div class="taichu-tab">
        <o-nav
          :nav-items="navItems"
          :active-item="activeNavItem"
          @nav-click="handleNavClick"
        ></o-nav>
      </div>
      <div class="taichu-info">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.taichu {
  min-height: calc(100vh - 200px);
  background-color: #f5f6f8;
  @media screen and (max-width: 1080px) {
    padding-top: 80px;
    padding-top: 0;
  }
  .taichu-wrap {
    padding: 120px 16px 0px;
    margin: 0 auto;
    max-width: 1472px;
    @media screen and (max-width: 1080px) {
      padding: 0;
    }
    .taichu-bread {
      margin-bottom: 40px;
      @media screen and (max-width: 1080px) {
        display: none;
      }
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
    .taichu-content {
      @media screen and (max-width: 1080px) {
        padding-top: 62px;
      }
      .taichu-content-banner {
        padding: 80px;
        background-color: #fff;
        box-shadow: 0px 1px 5px 0px rgba(45, 47, 51, 0.1);
        display: flex;
        @media screen and (max-width: 1080px) {
          padding: 16px;
          margin: 0 16px;
        }
        .content-banner-left {
          margin-right: 40px;
          @media screen and (max-width: 1080px) {
            display: none;
          }
          img {
            width: 416px;
            height: 100%;
          }
        }
        .content-banner-right {
          &-title {
            line-height: 48px;
            font-size: 36px;
            color: #000000;
            margin-bottom: 16px;
            @media screen and (max-width: 820px) {
              font-size: 16px;
              line-height: 24px;
              font-weight: 300;
              margin-bottom: 16px;
            }
            @media screen and (max-width: 768px) {
              margin-bottom: 8px;
            }
          }

          &-content {
            font-size: 14px;
            color: #555555;
            line-height: 22px;
            margin-bottom: 54px;
            @media screen and (max-width: 820px) {
              margin-bottom: 16px;
              font-size: 12px;
              line-height: 18px;
              font-weight: 400;
            }
          }
        }
      }
    }
  }
  .taichu-content-desc {
    margin-top: 40px;
    @media screen and (max-width: 820px) {
      margin-top: 16px;
    }
    .o-nav {
      background: #fff;
    }
    .taichu-tab {
      max-width: 1440px;
      margin: 0 auto;
      height: 48px;
      background-color: #fbfbfb;
      @media screen and (max-width: 1080px) {
        height: 34px;
      }
      :deep(.o-nav) {
        width: 100%;
        display: flex;
        justify-content: center;
        margin: 0 auto;
        .nav-item {
          color: #555;
          @media screen and (max-width: 1080px) {
            font-size: 14px;
            font-weight: 400;
            color: #000000;
            line-height: 22px;
          }
        }
      }
      .taichu-info {
        background-color: #f5f6f8;
      }
    }
  }
}
</style>
