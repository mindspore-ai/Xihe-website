<!-- 智慧病理诊断系统 -->
<script setup>
import { useRouter } from 'vue-router';
import systemCover from '@/assets/imgs/estate/electricity/intelligentsystem/system-cover.png';

import IconArrowRight from '~icons/app/arrow-right.svg';
import IconLeft from '~icons/app/left.svg';
import { ArrowRight } from '@element-plus/icons-vue';
import useWindowResize from '@/shared/hooks/useWindowResize.js';

const screenWidth = useWindowResize();
const router = useRouter();
function goDetail() {
  router.push('/projects/MindSpore/yolov7-tch-projects');
}
function goBack() {
  router.push('/electricity');
}
</script>

<template>
  <div class="medicine-detail">
    <div v-if="screenWidth < 820" class="navigation">
      <o-icon class="turn" @click="goBack"><icon-left></icon-left></o-icon>
      <span class="title">智能在线决策系统</span>
    </div>
    <div class="medicine-wrap">
      <div class="bread-wrap">
        <el-breadcrumb :separator-icon="ArrowRight">
          <el-breadcrumb-item :to="{ path: '/electricity' }">
            电力专区
          </el-breadcrumb-item>
          <el-breadcrumb-item class="breadcrumb-item">
            智能在线决策系统
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
              <div class="banner-title">智能在线决策系统</div>
              <div class="banner-desc">
                华为联合中科院自动化所推出基于全场景AI框架昇思MindSpore的智能在线决策系统，其在昇腾AI计算集群上进行训练，昇思MindSpore高效的分布式强化学习能力可以应用到业界多种多样的决策智能任务。
              </div>
            </div>
            <div class="banner-btn">
              <OButton
                :size="screenWidth < 820 ? 'mini' : 'small'"
                animation
                type="primary"
                class="home-btn"
                @click="goDetail"
              >
                运行模型
                <template #suffix>
                  <OIcon><IconArrowRight /></OIcon>
                </template>
              </OButton>
            </div>
          </div>
        </div>
        <div class="medicine-content-desc">
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
  @media screen and (max-width: 820px) {
    padding: 48px 0px 40px;
  }
  .navigation {
    font-size: 16px;
    color: #000;
    line-height: 48px;
    padding: 0 16px;
    margin-bottom: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.0509803922);
    position: relative;
    .o-icon {
      position: absolute;
      left: 16px;
    }
  }
  .medicine-wrap {
    padding: 0px 16px 64px;
    margin: 0 auto;
    max-width: 1448px;
    overflow: hidden;
    @media screen and (max-width: 820px) {
      padding-bottom: 0px;
      .bread-wrap {
        @media screen and (max-width: 820px) {
          display: none;
        }
      }
    }
    .bread-wrap {
      padding: 40px 0;
    }
    .medicine-content {
      .medicine-content-banner {
        padding: 40px;
        background-color: #fff;
        display: flex;
        border-radius: 16px;
        margin-bottom: 40px;
        @media screen and (max-width: 820px) {
          padding: 16px;
          margin-bottom: 16px;
        }
        .banner-left {
          width: 416px;
          margin-right: 40px;
          @media screen and (max-width: 820px) {
            display: none;
          }
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
          @media screen and (max-width: 820px) {
            width: 100%;
            display: flex;
          }
          .banner-content {
            .banner-title {
              line-height: 48px;
              font-size: 36px;
              color: #000000;
              margin-bottom: 16px;
              @media screen and (max-width: 820px) {
                font-size: 16px;
                line-height: 24px;
                margin-bottom: 8px;
              }
            }
            .banner-desc {
              font-size: 14px;
              color: #555555;
              line-height: 22px;
              @media screen and (max-width: 820px) {
                font-size: 12px;
                line-height: 18px;
              }
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
          padding: 40px;
          @media screen and (max-width: 820px) {
            padding: 16px;
          }
        }
      }
    }
  }
}
</style>
