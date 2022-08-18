<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { goAuthorize } from '@/shared/login';
import { useUserInfoStore } from '@/stores';

const userInfoStore = useUserInfoStore();
import OButton from '@/components/OButton.vue';
// import ONav from '@/components/ONav.vue';
// import IconArrowRight from '~icons/app/arrow-right.svg';

import { ArrowRight } from '@element-plus/icons-vue';
// const route = useRoute();
const router = useRouter();

// const activeNavItem = ref('');
const state = ref('doing'); //比赛状态：will-do，doing，done
const aaa = ref(false);
// 立即报名
function goApplication() {
  // 如果没有登录，先登录
  // if (!userInfoStore.id) {
  //   goAuthorize();
  // }
  // 如果用户没有登录，则跳转到登录页面, 如果用户已经登录，则跳转到报名页面
  if (!userInfoStore.id) {
    goAuthorize().then(() => {
      router.push({
        path: `/competition/222/1/introduction`,
      });
      console.log(11111);
    });
  } else {
    router.push({
      path: `/competition/222/1/introduction`,
    });
    console.log(22222222);
  }
}
onMounted(() => {
  let card = document.querySelector('.competition-card');
  let parent = document.querySelector('competition-bread');

  let top1 = card.offsetTop;
  // let top2 = parent.offsetTop;

  window.addEventListener('scroll', function () {
    // console.log(top1, window.pageYOffset);
    if (window.pageYOffset > top1) {
      card.classList.add('fixed');
    }
    if (
      window.pageYOffset < top1 &&
      Array.from(card.classList).indexOf('fixed') > -1
    ) {
      card.classList.remove('fixed');
    }
  });
});
</script>

<template>
  <div class="competition-detail">
    <div class="competition-wrap">
      <div class="competition-bread">
        <el-breadcrumb :separator-icon="ArrowRight">
          <el-breadcrumb-item :to="{ path: '/competition' }"
            >比赛</el-breadcrumb-item
          >
          <el-breadcrumb-item
            >第三届全国高校绿色计算创新大赛</el-breadcrumb-item
          >
        </el-breadcrumb>
      </div>
      <div class="competition-content">
        <div class="competition-card fixed">
          <div class="competition-box">
            <div class="left">
              <div class="card-head">
                <div class="card-head-title">
                  第三届全国高校绿色计算创新大赛
                </div>
                <div class="card-head-state" :class="state">火热进行中</div>
              </div>
              <div class="card-body">
                大赛以“AI赋能视界”为主题，分为“华为・昇腾杯”AI+行人重识别、“华为・昇腾杯”AI+遥感影像、AI+无线通信三个赛道，在8月-10月面向全球开放报名参赛。
                初赛和复赛期间，优秀队伍可获得华为云资源支持；在昇腾开发者社区可以获得相关样例模型、开发者文档、技术支持等资源；基于昇腾的算法模型，决赛成绩可获得加分。
                大赛立足于国际视野，营造人工智能创新创…
              </div>
              <div class="card-footer">举办方:绿色计算产业联盟</div>
            </div>
            <div class="right">
              <div class="right-bonus">
                <div class="number">奖金：800，000</div>
                <div class="time">赛期:2020/6/15-2020/9/11</div>
              </div>
            </div>
          </div>
          <div v-if="aaa" class="right-immediate">
            <OButton type="primary" animation @click="goApplication">
              立即报名
            </OButton>
            <div class="number">报名人数：302</div>
          </div>
        </div>
        <div class="competition-desc">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.competition-detail {
  background-color: #f5f6f8;
  padding-top: 80px;
  // margin-top: 80px;
  min-height: calc(100vh - 200px);

  .competition-wrap {
    padding: 42px 16px 64px;
    margin: 0 auto;
    max-width: 1472px;
    .competition-bread {
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
    .competition-content {
      scroll-behavior: smooth;
      .fixed {
        position: fixed;
        z-index: 1000;
        top: 80px;
        width: 100%;
        max-width: 1440px;
        .competition-box {
          justify-content: space-between;
          width: 100%;
        }
        .card-body {
          display: none;
        }
        .card-footer {
          display: none;
        }
        .number {
          display: none;
        }
        .time {
          margin: 0 !important;
        }
      }
      .competition-card {
        background-color: #ffffff;
        display: flex;
        align-items: center;
        font-size: 14px;
        margin-bottom: 24px;

        .competition-box {
          padding: 40px 0 24px 40px;
          display: flex;

          border-right: 1px solid #e4e5e7;
          .left {
            .card-head {
              display: flex;
              align-items: center;
              &-title {
                font-size: 24px;
              }
              &-state {
                font-size: 12px;
                height: 20px;
                line-height: 20px;
                margin-left: 15px;
                padding: 0 8px;
              }
              .will-do {
                color: #ffffff;
                background-color: #6189ff;
              }
              .doing {
                color: #ffffff;
                background-color: #ff7f0d;
              }
              .done {
                color: #555555;
                background-color: #efefef;
              }
            }
            .card-body {
              margin-top: 16px;
              color: #555555;
              line-height: 22px;
            }
            .card-footer {
              color: #555555;
              line-height: 22px;
              margin-top: 16px;
            }
          }
          .right {
            display: flex;
            align-items: center;

            &-bonus {
              white-space: nowrap;
              margin: 0 48px;
              .number {
                color: #6189ff;
                font-size: 24px;
                line-height: 28px;
                text-align: center;
              }
              .time {
                line-height: 24px;
                padding: 12px 40px;
                color: #555555;
                margin-top: 24px;
                background-color: #f4faff;
              }
            }
          }
        }
        .right-immediate {
          margin-left: 48px;
          margin-right: 48px;
          .number {
            color: #555555;
            line-height: 22px;
            text-align: center;
            margin-top: 16px;
          }
        }
      }
      .competition-desc {
        margin-top: 24px;
        background-color: #fff;

        // &-tab {

        //   height: 48px;
        //   background-color: #fbfbfb;
        //   :deep(.o-nav) {
        //     width: 100%;
        //     display: flex;
        //     justify-content: center;
        //     margin: 0 auto;
        //     .nav-item {
        //       color: #555;
        //     }
        //   }
        // }
      }
    }
  }
}
</style>
