<script setup>
import { ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import ONav from '@/components/ONav.vue';

import wukongBanner from '@/assets/imgs/wukong/wukong-banner.png';
import IconArrowRight from '~icons/app/arrow-right.svg';

import { ArrowRight } from '@element-plus/icons-vue';

const route = useRoute();
const router = useRouter();
const activeNavItem = ref('');

const isToggle = ref(false);

const navItems = [
  {
    id: 'wukongIntroduce',
    label: '介绍',
    href: '/modelzoo/wukong/introduce',
  },
  {
    id: 'wukongExperience',
    label: '在线体验',
    href: '/modelzoo/wukong',
  },
];

// 点击导航
function handleNavClick(item) {
  router.push({ path: item.href });
}

function learnWukongMore() {
  window.open(
    'https://github.com/mindspore-lab/minddiffusion/tree/main/vision/wukong-huahua'
  );
}

watch(
  () => activeNavItem.value,
  () => {
    isToggle.value = activeNavItem.value === 'wukongIntroduce' ? false : true;
  }
);
watch(
  () => {
    return route.name;
  },
  (val) => {
    if (/^wukongIntroduce|wukongExperience/g.test(val)) {
      activeNavItem.value = val;
    } else {
      activeNavItem.value = '';
    }
  },
  { immediate: true }
);
</script>
<template>
  <div :class="isToggle ? 'wukong-bg2' : 'wukong-bg1'">
    <div class="wukong">
      <div class="wukong-bread">
        <el-breadcrumb :separator-icon="ArrowRight">
          <el-breadcrumb-item :to="{ path: '/modelzoo' }"
            >大模型</el-breadcrumb-item
          >
          <el-breadcrumb-item>悟空</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <div class="wukong-head">
        <div class="wukong-head-left">
          <img draggable="false" :src="wukongBanner" alt="" />
        </div>

        <div class="wukong-head-right">
          <div class="wukong-head-right-top">
            <div class="wukong-head-right-top-title">悟空</div>
            <div class="wukong-head-right-top-content">
              借助目前最大的中文开源多模态数据集悟空数据集进行训练，悟空-画画模型拥有优秀的中文文本-图像生成能力。模型能够识别各类场景描述与绘画风格，给用户带来良好的使用体验。
            </div>
          </div>

          <div class="wukong-head-right-btn">
            <OButton
              type="primary"
              animation
              class="home-btn"
              @click="learnWukongMore"
            >
              了解更多
              <template #suffix>
                <OIcon><IconArrowRight /></OIcon>
              </template>
            </OButton>
          </div>
        </div>
      </div>

      <div class="wukong-main">
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
.wukong-bg1 {
  background: #f5f6f8;
}
.wukong-bg2 {
  background-image: url('@/assets/imgs/wukong/wukong-bg.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  .wukong-bread {
    margin-bottom: 40px;
    .el-breadcrumb {
      :deep(.el-breadcrumb__item:last-child .el-breadcrumb__inner) {
        color: #fff;
      }
    }
  }
  .wukong-head {
    background: rgba(7, 12, 22, 0.6);
    box-shadow: 0px 1px 5px 0px rgba(45, 47, 51, 0.1);
    backdrop-filter: blur(5px);
    &-right {
      &-top {
        &-title {
          font-size: 36px;
          font-weight: 300;
          color: #fff;
          line-height: 48px;
        }

        &-content {
          font-size: 14px;
          color: #b2b2b2;
          line-height: 22px;
        }
      }
    }
  }

  .wukong-main {
    .nav-tab {
      margin-top: 16px;
      height: 48px;
      background-color: rgba(0, 0, 0, 0);
      .o-nav {
        background: rgba(7, 12, 22, 0.6);
        box-shadow: 0px 1px 30px 0px rgba(0, 0, 0, 0.05);
        backdrop-filter: blur(5px);
      }
    }
    .tab-content {
      padding: 48px 80px;
      background-color: rgba(0, 0, 0, 0);
      background: rgba(7, 12, 22, 0.6);
      box-shadow: 0px 1px 30px 0px rgba(0, 0, 0, 0.05);
      backdrop-filter: blur(5px);
      position: relative;
    }
  }
}
.wukong {
  padding: 120px 16px 64px;
  margin: 0 auto;
  max-width: 1472px;
  min-height: calc(100vh - 200px);

  &-bread {
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

  &-head {
    padding: 80px;
    background-color: #fff;
    box-shadow: 0px 1px 5px 0px rgba(45, 47, 51, 0.1);
    display: flex;
    margin-top: 40px;
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

  &-main {
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
      padding: 48px;
      background: #fff;
    }
  }
}
</style>
