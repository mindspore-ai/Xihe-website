<script setup>
import { ref, watch } from 'vue';

import { useRoute, useRouter } from 'vue-router';

import OButton from '@/components/OButton.vue';
import IconArrowRight from '~icons/app/arrow-right.svg';

import { ArrowRight } from '@element-plus/icons-vue';
import panguBanner from '@/assets/imgs/pangu/pangu-banner.png';

const router = useRouter();
const route = useRoute();

const activeNavItem = ref('');
const navItems = [
  {
    id: 'panguIntroduce',
    label: '介绍',
    href: '/modelzoo/pangu/introduce',
  },
  {
    id: 'panguExperience',
    label: '在线体验',
    href: '/modelzoo/pangu',
  },
];

function goPanguMore() {
  window.open('https://git.openi.org.cn/PCL-Platform.Intelligence/PanGu-Alpha');
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
    if (/^panguIntroduce|panguExperience/g.test(val)) {
      activeNavItem.value = val;
    } else {
      activeNavItem.value = '';
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="pangu">
    <div class="pangu-wrap">
      <div class="pangu-bread">
        <el-breadcrumb :separator-icon="ArrowRight">
          <el-breadcrumb-item :to="{ path: '/modelzoo' }"
            >大模型</el-breadcrumb-item
          >
          <el-breadcrumb-item>鹏程.盘古</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="pangu-content">
        <div class="pangu-banner">
          <div class="banner-left">
            <img :src="panguBanner" alt="" />
          </div>
          <div class="banner-right">
            <div class="banner-right-title">鹏程.盘古</div>
            <div class="banner-right-content">
              业界首个千亿级参数中文自然语言处理了大模型，可支持知识问答、知识检索、知识推理、阅读理解等丰富的下游应用。「鹏城.盘古」由以鹏城实验室为首的技术团队联合攻关，首次基于“鹏城云脑Ⅱ”和国产MindSpore框架的自动混合并行模式实现在2048卡算力集群上的大规模分布式训练，训练出业界首个2000亿参数以中文为核心的预训练生成语言模型。鹏程·盘古α预训练模型支持丰富的场景应用，在知识问答、知识检索、知识推理、阅读理解等文本生成领域表现突出，具备很强的小样本学习能力。
            </div>
            <div class="banner-right-btn">
              <OButton
                type="primary"
                animation
                class="home-btn"
                @click="goPanguMore"
              >
                了解更多
                <template #suffix>
                  <OIcon><IconArrowRight /></OIcon>
                </template>
              </OButton>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="taichu-content-desc">
      <div class="taichu-tab">
        <o-nav
          :nav-items="navItems"
          :active-item="activeNavItem"
          @nav-click="handleNavClick"
        ></o-nav>
      </div>
      <div class="taichu-info">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.pangu {
  background-color: #f5f6f8;
  padding-top: 80px;
  // margin-top: 80px;
  .pangu-wrap {
    padding: 0px 16px;
    margin: 40px auto 0;
    max-width: 1472px;
    .pangu-bread {
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
    .pangu-content {
      .pangu-banner {
        padding: 80px;
        background-color: #fff;
        display: flex;
        .banner-left {
          margin-right: 40px;
          img {
            width: 416px;
            height: 100%;
          }
        }
        .banner-right {
          &-title {
            height: 48px;
            line-height: 48px;
            font-size: 36px;
            color: #000000;
            margin-bottom: 16px;
          }
          &-content {
            // height: 44px;
            font-size: 14px;
            color: #555555;
            line-height: 22px;
            margin-bottom: 24px;
          }
        }
      }
    }
  }
  .taichu-content-desc {
    margin-top: 24px;
    // @media screen and (max-width: 768px) {
    //   margin-top: 16px;
    // }
    .o-nav {
      background: #fff;
    }
    .taichu-tab {
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
          // @media screen and (max-width: 1080px) {
          //   font-size: 14px;
          //   font-weight: 400;
          //   color: #000000;
          //   line-height: 22px;
          // }
        }
      }
      .taichu-info {
        background-color: #f5f6f8;
      }
    }
  }
}
</style>
