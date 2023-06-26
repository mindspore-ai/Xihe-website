<!-- 智慧病理诊断系统 -->
<script setup>
import { useRouter } from 'vue-router';
import systemCover from '@/assets/imgs/estate/electricity/intelligentsystem/system-cover.png';

import IconArrowRight from '~icons/app/arrow-right.svg';
import { ArrowRight } from '@element-plus/icons-vue';

import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const router = useRouter();
// 点击导航
/* function handleNavClick(item) {
  router.push(`/estate/electric/case-1/${item.href}`);
} */
function goDetail() {
  router.push('/projects/yyj/intelligent-system');
}
</script>

<template>
  <div class="medicine-detail">
    <div class="medicine-wrap">
      <div class="bread-wrap">
        <el-breadcrumb :separator-icon="ArrowRight">
          <el-breadcrumb-item :to="{ path: '/electricity' }">
            {{ t('intelligent.ELETRIC') }}
          </el-breadcrumb-item>
          <el-breadcrumb-item class="breadcrumb-item">
            {{ t('intelligent.TITLE') }}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="medicine-content">
        <div class="medicine-content-banner">
          <div class="banner-left">
            <img draggable="false" :src="systemCover" alt="" />
          </div>
          <div class="banner-right">
            <div class="banner-content">
              <div class="banner-title">{{ t('intelligent.TITLE') }}</div>
              <div class="banner-desc">
                {{ t('intelligent.DESCRIPTION') }}
              </div>
            </div>
            <div class="banner-btn" @click="goDetail">
              <OButton animation type="primary" class="home-btn">
                {{ t('intelligent.RUN_MODEL') }}
                <template #suffix>
                  <OIcon><IconArrowRight /></OIcon>
                </template>
              </OButton>
            </div>
          </div>
        </div>
        <div class="medicine-content-desc">
          <!-- <div class="industry-tab">
            <o-nav
              :nav-items="navItems"
              :active-item="activeNavItem"
              @nav-click="handleNavClick"
            ></o-nav>
          </div> -->
          <div class="industry-info">
            <router-view />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.medicine-detail {
  background-color: #f5f6f8;
  padding-top: 80px;
  min-height: calc(100vh - 200px);

  .medicine-wrap {
    padding: 0px 16px 64px;
    margin: 0 auto;
    max-width: 1448px;
    overflow: hidden;
    .bread-wrap {
      padding: 40px 0;
      .el-breadcrumb {
        font-size: 12px;
        line-height: 18px;
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
    .medicine-content {
      .medicine-content-banner {
        padding: 40px;
        background-color: #fff;
        display: flex;
        border-radius: 16px;
        margin-bottom: 37px;
        .banner-left {
          width: 416px;
          margin-right: 40px;
          img {
            width: 100%;
            height: 100%;
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
            margin-top: 16px;
            .o-button {
              border-radius: 24px;
            }
          }
        }
      }
      .medicine-content-desc {
        background: #fff;
        border-radius: 16px;
        // .o-nav {
        //   background: #fff;
        // }
        .industry-tab {
          max-width: 1416px;
          margin: 0 auto;
          height: 48px;
          box-shadow: 0px 1px 5px 0px rgb(45 47 51 / 10%);
          border-radius: 16px 16px 0 0;
          // background-color: #fbfbfb;
          :deep(.o-nav) {
            width: 100%;
            display: flex;
            justify-content: center;
            margin: 0 auto;
            border-radius: 16px 16px 0 0;
            .nav-item {
              color: #555;
            }
          }
        }
        .industry-info {
          // background-color: #f5f6f8;
          padding: 40px 80px;
        }
      }
    }
  }
}
</style>
