<!-- 智慧病理诊断系统 -->
<script setup>
import { useRouter } from 'vue-router';

import metalpartCover from '@/assets/imgs/estate/industry/algorithm/algorithm-cover.png';

import IconArrowRight from '~icons/app/arrow-right.svg';
import IconLeft from '~icons/app/left.svg';
import { ArrowRight } from '@element-plus/icons-vue';
import useWindowResize from '@/shared/hooks/useWindowResize.js';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const screenWidth = useWindowResize();
const router = useRouter();

function goBack() {
  router.push('/industry');
}
</script>

<template>
  <div class="industry-detail">
    <div v-if="screenWidth < 820" class="navigation">
      <o-icon class="turn" @click="goBack"><icon-left></icon-left></o-icon>
      <span class="title">{{ t('algorithm.TITLE') }}</span>
    </div>
    <div class="industry-wrap">
      <div class="bread-wrap">
        <el-breadcrumb :separator-icon="ArrowRight">
          <el-breadcrumb-item :to="{ path: '/industry' }">
            {{ t('algorithm.BACK_PAGE') }}
          </el-breadcrumb-item>
          <el-breadcrumb-item class="breadcrumb-item">
            {{ t('algorithm.TITLE') }}
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
              <div class="banner-title">{{ t('algorithm.TITLE') }}</div>
              <div class="banner-desc">
                {{ t('algorithm.DESCRIPTION') }}
              </div>
            </div>
            <div class="banner-btn">
              <OButton
                :size="screenWidth < 820 ? 'mini' : 'small'"
                disabled
                type="primary"
                class="home-btn"
              >
                {{ t('algorithm.RUN_MODEL') }}
                <template #suffix>
                  <OIcon><IconArrowRight /></OIcon>
                </template>
              </OButton>
            </div>
          </div>
        </div>
        <div class="industry-content-desc">
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
  .industry-wrap {
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
    .industry-content {
      .industry-content-banner {
        padding: 40px;
        background-color: #fff;
        display: flex;
        border-radius: 16px;
        margin-bottom: 37px;
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
      .industry-content-desc {
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
