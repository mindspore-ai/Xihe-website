<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import IconArrow from '~icons/app/arrow-blue';
import { ArrowRight } from '@element-plus/icons-vue';

const route = useRoute();
const router = useRouter();

function goToExperience() {
  router.push('/modelzoo/luojia');
}

function knowMore() {
  window.open('https://github.com/WHULuoJiaTeam/luojianet');
}
function enterLuoJiaNet() {
  window.open('http://58.48.42.237/luojiaNet/user/login');
}
function enterLuoJiaSet() {
  window.open('http://58.48.42.237/luojiaSet/user/login?redirect=%2F');
}

const currentPage = computed(() => {
  return route.name === 'luojiaIntroduce'
    ? '武汉.LuoJia'
    : '武汉.LuoJia在线体验';
});
</script>
<template>
  <div class="luojia">
    <div class="luojia-main">
      <div class="bread">
        <el-breadcrumb :separator-icon="ArrowRight">
          <el-breadcrumb-item :to="{ path: '/modelzoo' }"
            >大模型</el-breadcrumb-item
          >
          <el-breadcrumb-item>{{ currentPage }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div v-if="route.name === 'luojiaIntroduce'" class="luojia-title">
        <img src="@/assets/imgs/modelzoo/Luojia.png" alt="" />
        <div class="luojia-title-intro">
          <div class="intro-top">
            <p class="headline">武汉.LuoJia</p>
            <p class="text">
              由武汉大学与华为昇腾AI团队联合研发，是遥感领域首个国产化自主可控的遥感专用机器学习框架，针对遥感数据像幅尺寸大、数据通道多、尺度变化大等特性，
              具备内存可扩展、尺度通道灵活创建、数据通道自主优选、框架与数据协同处理的特点。可兼容已有深度学习框架，
              并提供用户友好的、可拖拽的交互式网络结构搭建界面的方法。能屏蔽不同硬件设备间差异，同时管理多样化的遥感影像样本库LuoJiaSET，
              实现遥多源感影像样本的高效存储管理。
            </p>
          </div>
          <div class="entrance">
            <p class="entrance-item" @click="goToExperience">
              <span class="entrance-item-title">在线体验</span>
              <o-icon><icon-arrow></icon-arrow></o-icon>
            </p>
            <p class="entrance-item" @click="enterLuoJiaSet">
              <span class="entrance-item-title">LuoJiaSET入口</span>
              <o-icon><icon-arrow></icon-arrow></o-icon>
            </p>
            <p class="entrance-item" @click="enterLuoJiaNet">
              <span class="entrance-item-title">LuoJiaNET入口</span>
              <o-icon><icon-arrow></icon-arrow></o-icon>
            </p>
            <div class="entrance-item" @click="knowMore">
              <span class="entrance-item-title">了解更多</span>
              <o-icon><icon-arrow></icon-arrow></o-icon>
            </div>
          </div>
        </div>
      </div>
      <div class="tab-content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.luojia {
  width: 100%;
  height: 100%;
  background-color: #f5f6f8;
}
.luojia-main {
  max-width: 1472px;
  margin: 0 auto;
  padding: 80px 0 64px 0;
  @media screen and (max-width: 820px) {
    padding: 64px 0 40px;
  }
  @media screen and (max-width: 768px) {
    padding: 64px 0 40px;
  }

  .bread {
    margin: 40px 0;
    @media screen and (max-width: 768px) {
      display: none;
    }
    @media screen and (max-width: 820px) {
      display: none;
    }
  }

  .luojia-title {
    padding: 40px;
    display: flex;
    justify-content: space-between;
    background-color: #fff;
    border-radius: 16px;
    @media screen and (max-width: 820px) {
      padding: 16px;
      margin: 0 16px;
      img {
        display: none;
      }
    }
    @media screen and (max-width: 768px) {
      padding: 16px;
      margin: 0 16px;
      img {
        display: none;
      }
    }
    img {
      width: 392px;
      height: 220px;
      margin-right: 40px;
    }
    .luojia-title-intro {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      @media screen and (max-width: 768px) {
        padding: 0;
      }
      .headline {
        font-size: 36px;
        font-weight: 300;
        color: #000000;
        line-height: 48px;
        @media screen and (max-width: 768px) {
          font-size: 16px;
          line-height: 24px;
          height: 24px;
          margin-bottom: 8px;
        }
      }
      .text {
        font-size: 14px;
        color: #555555;
        line-height: 22px;
        margin-top: 15px;
        @media screen and (max-width: 768px) {
          font-size: 12px;
          line-height: 18px;
          margin: 0;
        }
      }
      .entrance {
        display: flex;
        @media screen and (max-width: 768px) {
          flex-direction: column;
        }
        &-item {
          margin-right: 49px;
          display: flex;
          cursor: pointer;
          @media screen and (max-width: 768px) {
            width: max-content;
            margin-top: 16px;
            padding: 5px 16px;
            border: 1px solid #0d8dff;
            font-size: 14px;
            color: #0d8dff;
          }
          .o-icon {
            transform: translate(0px);
            transition: all 0.2s linear;
          }
          &:hover {
            .o-icon {
              transform: translate(3px);
              transition: all 0.2s linear;
            }
          }
          &-title {
            margin-right: 8px;
          }
        }
      }
    }
  }

  .nav-tab {
    margin-top: 16px;
    .o-nav {
      background-color: rgba(251, 251, 251, 0.85);
      box-shadow: 0px -1px 30px 0px rgba(0, 0, 0, 0.05);
    }
    height: 48px;
    background-color: #fbfbfb;
    @media screen and (max-width: 768px) {
      height: 34px;
    }
    :deep(.o-nav) {
      width: 100%;
      display: flex;
      justify-content: center;
      margin: 0 auto;
      .nav-item {
        color: #555;
      }
      @media screen and (max-width: 768px) {
        .nav-item {
          font-size: 14px;
        }
      }
    }
  }
  .tab-content {
    background: #fff;
    border-radius: 16px;
    margin-top: 40px;
    @media screen and (max-width: 768px) {
      margin: 16px 16px 0;
    }
  }
}
</style>
