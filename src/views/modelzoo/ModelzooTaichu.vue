<script setup>
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import OButton from '@/components/OButton.vue';
import ONav from '@/components/ONav.vue';
import IconArrowRight from '~icons/app/arrow-right.svg';

import { ArrowRight } from '@element-plus/icons-vue';
import taichuBanner from '@/assets/imgs/taichu/taichu-banner.png';

// const screenWidth = ref(
//   window.innerWidth ||
//     document.documentElement.clientWidth ||
//     document.body.clientWidth
// );

const router = useRouter();
const route = useRoute();

const activeNavItem = ref('');
const navItems = [
  {
    id: 'taichuTest',
    label: '在线体验',
    href: '/modelzoo/taichu/test',
  },
  {
    id: 'taichuIntroduction',
    label: '介绍',
    href: '/modelzoo/taichu',
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
  // if (item.label === '在线体验') {
  //   ElMessage({
  //     type: 'warning',
  //     message:
  //       '亲爱的用户，很抱歉，暂时无法进行在线体验。因市政要求，计算机中心于8月22日开始强制限电断电，大模型推理相关资源不可用，预计8月26日恢复。',
  //   });
  // } else {
  //   router.push({ path: item.href });
  // }
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
  @media screen and (max-width: 768px) {
    padding-top: 80px;
    padding-top: 0;
  }
  .taichu-wrap {
    padding: 120px 16px 64px;
    margin: 0 auto;
    max-width: 1472px;
    @media screen and (max-width: 768px) {
      padding: 0;
    }
    .taichu-bread {
      margin-bottom: 40px;
      @media screen and (max-width: 768px) {
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
      @media screen and (max-width: 768px) {
        padding-top: 62px;
        padding-bottom: 40px;
        min-height: calc(100vh - 190px);
      }
      .taichu-content-banner {
        padding: 80px;
        background-color: #fff;
        box-shadow: 0px 1px 5px 0px rgba(45, 47, 51, 0.1);
        display: flex;
        @media screen and (max-width: 768px) {
          padding: 16px;
          margin: 0 16px;
        }
        .content-banner-left {
          margin-right: 40px;
          @media screen and (max-width: 768px) {
            display: none;
          }
          img {
            width: 416px;
          }
        }
        .content-banner-right {
          &-title {
            // height: 48px;
            line-height: 48px;
            font-size: 36px;
            color: #000000;
            margin-bottom: 16px;
            @media screen and (max-width: 768px) {
              font-size: 16px;
              font-weight: 300;
              color: #000000;
              line-height: 24px;
              height: 24px;
            }
          }
          .home-btn {
            @media screen and (max-width: 768px) {
              line-height: 22px;
              padding: 6px !important;
              font-size: 14px;
            }
          }
          &-content {
            // height: 44px;
            font-size: 14px;
            color: #555555;
            line-height: 22px;
            margin-bottom: 54px;
            @media screen and (max-width: 768px) {
              font-size: 12px;
              font-weight: 400;
              color: #000000;
              line-height: 18px;
              margin-bottom: 16px;
            }
          }
        }
      }
      .taichu-content-desc {
        margin-top: 24px;
        background-color: #fff;
        .o-nav {
          background: #fff;
        }
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
              @media screen and (max-width: 768px) {
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
  }
}
</style>
