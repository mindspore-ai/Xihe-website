<script setup>
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import OButton from '@/components/OButton.vue';
import ONav from '@/components/ONav.vue';
import IconArrowRight from '~icons/app/arrow-right.svg';

import { ArrowRight } from '@element-plus/icons-vue';
import taichuBanner from '@/assets/imgs/taichu/taichu-banner.png';
const router = useRouter();
const route = useRoute();

const activeNavItem = ref('');
const navItems = [
  {
    id: 'taichuIntroduction',
    label: '介绍',
    href: '/modelzoo/taichu',
  },
  {
    id: 'taichuTest',
    label: '在线体验',
    href: '/modelzoo/taichu/test',
  },
];
watch(
  () => {
    return route.name;
  },
  (val) => {
    if (/^taichuIntroduction|taichuTest/g.test(val)) {
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
            <img :src="taichuBanner" alt="" />
          </div>
          <div class="content-banner-right">
            <div class="content-banner-right-title">紫东.太初</div>
            <div class="content-banner-right-content">
              业界首个三模态千亿参数大模型，支持文本、视觉、语音不同模态间的高效协同，可支撑影视创作、工业质检、智能驾驶等产业应用。
            </div>
            <div class="content-banner-right-btn">
              <OButton
                type="primary"
                animation
                class="home-btn"
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
        <div class="taichu-content-desc">
          <div class="taichu-content-desc-tab">
            <o-nav
              :nav-items="navItems"
              :active-item="activeNavItem"
              @nav-click="handleNavClick"
            ></o-nav>
          </div>
          <div class="taichu-content-desc-info">
            <router-view></router-view>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.taichu {
  background-color: #f5f6f8;
  padding-top: 80px;
  // margin-top: 80px;
  .taichu-wrap {
    padding: 42px 16px 64px;
    margin: 0 auto;
    max-width: 1472px;
    .taichu-bread {
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
    .taichu-content {
      .taichu-content-banner {
        padding: 80px;
        background-color: #fff;
        display: flex;
        .content-banner-left {
          margin-right: 40px;
          img {
            width: 416px;
          }
        }
        .content-banner-right {
          &-title {
            height: 48px;
            line-height: 48px;
            font-size: 36px;
            color: #000000;
            margin-bottom: 16px;
          }
          &-content {
            height: 44px;
            font-size: 14px;
            color: #555555;
            line-height: 22px;
            margin-bottom: 54px;
          }
        }
      }
      .taichu-content-desc {
        margin-top: 24px;
        background-color: #fff;

        &-tab {
          height: 48px;
          background-color: #fbfbfb;
          :deep(.o-nav) {
            width: 100%;
            display: flex;
            justify-content: center;
            margin: 0 auto;
            .nav-item {
              color: #555;
            }
          }
        }
      }
    }
  }
}
</style>
