<script setup>
import { ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import ONav from '@/components/ONav.vue';

import IconArrow from '~icons/app/arrow-blue';
import { ArrowRight } from '@element-plus/icons-vue';

const route = useRoute();
const router = useRouter();

const activeNavItem = ref('');
const navItems = [
  {
    id: 'luojiaIntroduce',
    label: '介绍',
    href: '/modelzoo/luojia/introduce',
  },
  {
    id: 'luojiaExperience',
    label: '在线体验',
    href: '/modelzoo/luojia',
  },
];

function knowMore() {
  window.open('https://github.com/WHULuoJiaTeam/luojianet');
}
function enterLuoJiaNet() {
  window.open('http://58.48.42.237/luojiaNet/user/login');
}
function enterLuoJiaSet() {
  window.open('http://58.48.42.237/luojiaSet/user/login?redirect=%2F');
}

// 点击导航
function handleNavClick(item) {
  router.push({ path: item.href });
}

watch(
  () => {
    return route.name;
  },
  (val) => {
    if (/^luojiaExperience|luojiaIntroduce/g.test(val)) {
      activeNavItem.value = val;
    } else {
      activeNavItem.value = '';
    }
  },
  { immediate: true }
);
</script>
<template>
  <div class="luojia">
    <div class="luojia-main">
      <div class="bread">
        <el-breadcrumb :separator-icon="ArrowRight">
          <el-breadcrumb-item :to="{ path: '/modelzoo' }"
            >大模型</el-breadcrumb-item
          >
          <el-breadcrumb-item>武汉.LuoJia</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="luojia-title">
        <img src="@/assets/imgs/home/modelzoo2.jpg" alt="" />
        <div class="luojia-title-intro">
          <p class="headline">武汉.Luojia</p>
          <p class="text">
            由武汉大学与华为昇腾AI团队联合研发，是遥感领域首个国产化自主可控的遥感专用机器学习框架，针对遥感数据像幅尺寸大、数据通道多、尺度变化大等特性，
            具备内存可扩展、尺度通道灵活创建、数据通道自主优选、框架与数据协同处理的特点。可兼容已有深度学习框架，
            并提供用户友好的、可拖拽的交互式网络结构搭建界面的方法。能屏蔽不同硬件设备间差异，同时管理多样化的遥感影像样本库LuoJiaSET，
            实现遥多源感影像样本的高效存储管理。
          </p>
          <div class="entrance">
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

      <div class="nav-tab">
        <o-nav
          :nav-items="navItems"
          :active-item="activeNavItem"
          @nav-click="handleNavClick"
        ></o-nav>
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
  .bread {
    margin: 40px 0;
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

  .luojia-title {
    padding: 75px 80px 75px 40px;
    display: flex;
    justify-content: space-between;
    background-color: #fff;
    margin-bottom: 24px;
    img {
      width: 392px;
      height: 220px;
      margin-right: 105px;
    }
    &-intro {
      flex: 1;
      padding: 5px 0;
      .headline {
        font-size: 36px;
        font-weight: 300;
        color: #000000;
        line-height: 48px;
      }
      .text {
        font-size: 14px;
        color: #555555;
        line-height: 22px;
        margin: 15px 0 37px 0;
      }
      .entrance {
        display: flex;
        &-item {
          margin-right: 49px;
          display: flex;
          cursor: pointer;
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
  .tab-content {
    background: #fff;
  }
}
</style>
