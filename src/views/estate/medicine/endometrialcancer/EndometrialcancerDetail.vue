<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import endometrialcancerCover from '@/assets/imgs/estate/medicine/cancer/cancer-cover.png';

import IconArrowRight from '~icons/app/arrow-right.svg';
import { ArrowRight } from '@element-plus/icons-vue';

const route = useRoute();

const activeNavItem = ref('');

// TODO:
/* const navItems = reactive([
  {
    id: 'projectExplain',
    label: '项目说明',
    href: 'project-explain',
    isIndividual: true,
  },
  {
    id: 'dataPrepare',
    label: '数据准备',
    href: 'data-prepare',
    isIndividual: true,
  },
  {
    id: 'modelTrain',
    label: '模型训练',
    href: 'model-train',
    isIndividual: false,
  },
]); */

watch(
  () => {
    return route.name;
  },
  (val) => {
    if (/^projectExplain|dataPrepare|modelTrain/g.test(val)) {
      activeNavItem.value = val;
    } else {
      activeNavItem.value = '';
    }
  },
  { immediate: true }
);

// 点击导航
/* function handleNavClick(item) {
  router.push(`/estate/electric/case-1/${item.href}`);
} */
</script>

<template>
  <div class="medicine-detail">
    <div class="medicine-wrap">
      <div class="bread-wrap">
        <el-breadcrumb :separator-icon="ArrowRight">
          <el-breadcrumb-item :to="{ path: '/medicine' }">
            医疗专区
          </el-breadcrumb-item>
          <el-breadcrumb-item class="breadcrumb-item">
            子宫内膜癌筛查联合方案
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="medicine-content">
        <div class="medicine-content-banner">
          <div class="banner-left">
            <img draggable="false" :src="endometrialcancerCover" alt="" />
          </div>
          <div class="banner-right">
            <div class="banner-content">
              <div class="banner-title">子宫内膜癌筛查联合方案</div>
              <div class="banner-desc">
                西安美佳家医疗科技有限责任公司基于昇思MindSpore
                AI框架在华为昇腾910处理器中成功构建了一套人工智能系统对恶性和良性ECCs进行分类，减少病理学家的工作量，提供决策帮助，促进子宫内膜癌筛查的发展。
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

  .medicine-wrap {
    padding: 0px 16px 64px;
    margin: 0 auto;
    max-width: 1472px;
    overflow: hidden;
    .bread-wrap {
      // height: 94px;
      // padding-top: 40px;
      // padding-bottom: 40px;
      padding: 40px 0;
      // background-color: #f5f6f8;
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
        // :deep(.el-breadcrumb__item:nth-child(2) .el-breadcrumb__inner) {
        //   cursor: pointer;
        // }
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
