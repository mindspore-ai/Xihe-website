<script setup>
import { useRouter } from 'vue-router';
import hostImg from '@/assets/imgs/estate/electricity/substationhost/host-cover.png';

import IconArrowRight from '~icons/app/arrow-right.svg';
import IconLeft from '~icons/app/left.svg';
import { ArrowRight } from '@element-plus/icons-vue';
import useWindowResize from '@/shared/hooks/useWindowResize.js';

const screenWidth = useWindowResize();
const router = useRouter();

function goBack() {
  router.push('/electricity');
}
</script>

<template>
  <div class="medicine-detail">
    <div v-if="screenWidth < 820" class="navigation">
      <o-icon class="turn" @click="goBack"><icon-left></icon-left></o-icon>
      <span class="title">变电站AI分析主机</span>
    </div>
    <div class="medicine-wrap">
      <div class="bread-wrap">
        <el-breadcrumb :separator-icon="ArrowRight">
          <el-breadcrumb-item :to="{ path: '/electricity' }">
            电力专区
          </el-breadcrumb-item>
          <el-breadcrumb-item class="breadcrumb-item">
            变电站AI分析主机
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="medicine-content">
        <div class="medicine-content-banner">
          <div class="banner-left">
            <img draggable="false" :src="hostImg" alt="" />
          </div>
          <div class="banner-right">
            <div class="banner-content">
              <div class="banner-title">变电站AI分析主机</div>
              <div class="banner-desc">
                变电站AI分析主机内置设备缺陷识别、设备状态判别、安全管控、环境状态感知等多类模型，可以对变电站内设备、环境状态、作业安全进行自动诊断和预警，实现“智能巡检”。变电站AI分析主机产品应用能够大幅降低运维人员日常工作，有力提升变电站巡视效率和监控强度，提升缺陷的应急响应速度，缩短缺陷的处理时间。数据显示，应用变电电站AI分析主机对某220kV变电站4000+点位巡检，单次巡检只要30+分钟，小于巡检规范要求的2小时，效能提升70%，利用AI分析主机能够提升巡检频次，在节约成本的同时确保缺陷及时发现、及时处理，保障电网安全稳定运行。
              </div>
            </div>
            <div class="banner-btn">
              <a
                href="https://xihe2.test.osinfra.cn/projects/MindSpore/ai_studio_demo/"
              >
                <OButton
                  :size="screenWidth < 820 ? 'mini' : 'small'"
                  animation
                  type="primary"
                  class="home-btn"
                >
                  运行模型
                  <template #suffix>
                    <OIcon><IconArrowRight /></OIcon>
                  </template>
                </OButton>
              </a>
            </div>
          </div>
        </div>
        <div class="medicine-content-desc">
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
          padding: 40px 80px;
          @media screen and (max-width: 820px) {
            padding: 16px;
          }
        }
      }
    }
  }
}
</style>
