<script setup>
import { ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import ONav from '@/components/ONav.vue';

import codeGeexBanner from '@/assets/imgs/modelzoo/codegeex.png';

import IconArrowRight from '~icons/app/arrow-right.svg';

import { ArrowRight } from '@element-plus/icons-vue';

const route = useRoute();
const router = useRouter();

const activeNavItem = ref('');
const navItems = [
  {
    id: 'codegeexIntroduce',
    label: '介绍',
    href: '/modelzoo/codegeex/introduce',
  },
  {
    id: 'codegeexExperience',
    label: '在线体验',
    href: '/modelzoo/codegeex',
  },
];

function goCodeGeexMore() {
  window.open('https://models.aminer.cn/codegeex/');
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
    if (/^codegeexIntroduce|codegeexExperience/g.test(val)) {
      activeNavItem.value = val;
    } else {
      activeNavItem.value = '';
    }
  },
  { immediate: true }
);
</script>
<template>
  <div class="content">
    <div class="codegeex">
      <div class="bread">
        <el-breadcrumb :separator-icon="ArrowRight">
          <el-breadcrumb-item :to="{ path: '/modelzoo' }"
            >大模型</el-breadcrumb-item
          >
          <el-breadcrumb-item>CodeGeex</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <div class="codegeex-head">
        <div class="codegeex-head-left">
          <img draggable="false" :src="codeGeexBanner" alt="" />
        </div>

        <div class="codegeex-head-right">
          <div class="codegeex-head-right-top">
            <div class="codegeex-head-right-top-title">CodeGeeX</div>
            <div class="codegeex-head-right-top-content">
              CodeGeeX是一个具有130亿参数的多编程语言代码生成预训练模型，采用华为MindSpore框架实现，在鹏城实验室“鹏城云脑II”上使用1536个国产昇腾910
              AI处理器训练而成。CodeGeeX支持十多种主流编程语言的高精度代码生成、跨语言代码翻译等功能，同时开发自动编程插件，更好的辅助程序开发和相关研究。
            </div>
          </div>

          <div class="codegeex-head-right-btn">
            <OButton
              type="primary"
              animation
              class="home-btn"
              @click="goCodeGeexMore"
            >
              了解更多
              <template #suffix>
                <OIcon><IconArrowRight /></OIcon>
              </template>
            </OButton>
          </div>
        </div>
      </div>

      <div class="codegeex-main">
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
  </div>
</template>

<style lang="scss" scoped>
.content {
  background: #f5f6f8;
}
.codegeex {
  padding: 120px 16px 64px;
  margin: 0 auto;
  max-width: 1472px;

  .bread {
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

  .codegeex-head {
    padding: 80px;
    background-color: #fff;
    box-shadow: 0px 1px 5px 0px rgba(45, 47, 51, 0.1);
    display: flex;

    &-left {
      margin-right: 40px;
    }

    img {
      width: 416px;
    }

    &-right {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      &-top {
        &-title {
          line-height: 48px;
          font-size: 36px;
          color: #000000;
          margin-bottom: 16px;
        }

        &-content {
          font-size: 14px;
          color: #555555;
          line-height: 22px;
        }
      }
    }
  }
  .codegeex-main {
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
      padding: 40px;
      background: #fff;
    }
  }
}
</style>
