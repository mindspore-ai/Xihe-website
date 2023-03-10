<script setup>
import { ref, reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import electricityBanner from '@/assets/imgs/estate/electricity-banner.png';

import IconArrowRight from '~icons/app/arrow-right.svg';
import { ArrowRight } from '@element-plus/icons-vue';

const route = useRoute();
const router = useRouter();

const activeNavItem = ref('');

const navItems = reactive([
  {
    id: 'projectExplain',
    label: '项目说明',
    href: 'project-explain',
    isIndividual: true,
  },
  {
    id: 'dataPrepare',
    label: '数据准备',
    href: 'data-prepare',
    isIndividual: true,
  },
  {
    id: 'modelTrain',
    label: '模型训练',
    href: 'model-train',
    isIndividual: false,
  },
]);

watch(
  () => {
    return route.name;
  },
  (val) => {
    if (/^projectExplain|dataPrepare|modelTrain/g.test(val)) {
      activeNavItem.value = val;
    } else {
      activeNavItem.value = '';
    }
    console.log('activeNavItem.value: ', activeNavItem.value);
  },
  { immediate: true }
);

// 点击导航
function handleNavClick(item) {
  router.push(`/estate/electricity/1/${item.href}`);
}
</script>

<template>
  <div class="electricity-detail">
    <div class="electricity-wrap">
      <div class="bread-wrap">
        <el-breadcrumb :separator-icon="ArrowRight">
          <el-breadcrumb-item :to="{ path: '/electricity' }">
            电力专区
          </el-breadcrumb-item>
          <el-breadcrumb-item class="breadcrumb-item">
            工业零件划痕自动识别
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="electricity-content">
        <div class="electricity-content-banner">
          <div class="banner-left">
            <img draggable="false" :src="electricityBanner" alt="" />
          </div>
          <div class="banner-right">
            <div class="banner-content">
              <div class="banner-title">工业零件划痕自动识别</div>
              <div class="banner-desc">
                通过训练物体检测定制化AI模型，实现对于“工业零件划痕”的智能识别，广泛应用于工业质检、智能制造等领域。
              </div>
            </div>
            <div class="banner-btn">
              <OButton type="primary" animation class="home-btn">
                运行模型
                <template #suffix>
                  <OIcon><IconArrowRight /></OIcon>
                </template>
              </OButton>
            </div>
          </div>
        </div>
        <div class="electricity-content-desc">
          <div class="electricity-tab">
            <o-nav
              :nav-items="navItems"
              :active-item="activeNavItem"
              @nav-click="handleNavClick"
            ></o-nav>
          </div>
          <div class="electricity-info">
            <router-view />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.electricity-detail {
  background-color: #f5f6f8;
  padding-top: 80px;
  min-height: calc(100vh - 200px);

  .electricity-wrap {
    padding: 0px 16px 64px;
    margin: 0 auto;
    max-width: 1472px;
    overflow: hidden;
    .bread-wrap {
      height: 94px;
      padding-top: 40px;
      padding-bottom: 40px;
      background-color: #f5f6f8;
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
        :deep(.el-breadcrumb__item:nth-child(2) .el-breadcrumb__inner) {
          cursor: pointer;
        }
      }
    }
    .electricity-content {
      .electricity-content-banner {
        padding: 40px;
        background-color: #fff;
        box-shadow: 0px 1px 5px 0px rgba(45, 47, 51, 0.1);
        display: flex;
        border-radius: 16px;
        margin-bottom: 37px;
        .banner-left {
          width: 416px;
          margin-right: 40px;
          img {
            width: 100%;
          }
        }
        .banner-right {
          width: calc(100% - 416px);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          .banner-content {
            .banner-title {
              line-height: 48px;
              font-size: 36px;
              color: #000000;
              margin-bottom: 16px;
            }
            .banner-desc {
              font-size: 14px;
              color: #555555;
              line-height: 22px;
            }
          }
          .banner-btn {
            .o-button {
              border-radius: 24px;
            }
          }
        }
      }
      .electricity-content-desc {
        .o-nav {
          background: #fff;
        }
      }
      .electricity-content-desc {
        .o-nav {
          background: #fff;
        }
        .electricity-tab {
          max-width: 1440px;
          margin: 0 auto;
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
          .electricity-info {
            background-color: #f5f6f8;
          }
        }
      }
    }
  }
}
</style>
