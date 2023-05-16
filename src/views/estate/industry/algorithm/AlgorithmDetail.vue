<!-- 智慧病理诊断系统 -->
<script setup>
import metalpartCover from '@/assets/imgs/estate/industry/algorithm/algorithm-cover.png';

import IconArrowRight from '~icons/app/arrow-right.svg';
import { ArrowRight } from '@element-plus/icons-vue';

// 点击导航
/* function handleNavClick(item) {
  router.push(`/estate/electric/case-1/${item.href}`);
} */
</script>

<template>
  <div class="industry-detail">
    <div class="industry-wrap">
      <div class="bread-wrap">
        <el-breadcrumb :separator-icon="ArrowRight">
          <el-breadcrumb-item :to="{ path: '/industry' }">
            工业专区
          </el-breadcrumb-item>
          <el-breadcrumb-item class="breadcrumb-item">
            工业AI算法库READ
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="industry-content">
        <div class="industry-content-banner">
          <div class="banner-left">
            <img draggable="false" :src="metalpartCover" alt="" />
          </div>
          <div class="banner-right">
            <div class="banner-content">
              <div class="banner-title">工业AI算法库READ</div>
              <div class="banner-desc">
                READ专注于研发与集成基于无监督监督学习的大规模异常检测算法和模型，重点解决工业质检中小样本和数据长尾问题，通过针对不同行业的业务和数据特点，研发可在无异常（无缺陷）图像上进行自学习和自训练的异常检测技术。
              </div>
            </div>
            <div class="banner-btn">
              <OButton disabled type="primary" animation class="home-btn">
                运行模型
                <template #suffix>
                  <OIcon><IconArrowRight /></OIcon>
                </template>
              </OButton>
            </div>
          </div>
        </div>
        <div class="industry-content-desc">
          <!-- TODO: -->
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
.industry-detail {
  background-color: #f5f6f8;
  padding-top: 80px;
  min-height: calc(100vh - 200px);

  .industry-wrap {
    padding: 0px 16px 64px;
    margin: 0 auto;
    max-width: 1472px;
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
    .industry-content {
      .industry-content-banner {
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
      .industry-content-desc {
        background: #fff;
        border-radius: 16px;
        // .o-nav {
        //   background: #fff;
        // }
        .industry-tab {
          max-width: 1440px;
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
