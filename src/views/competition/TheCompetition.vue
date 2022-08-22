<script setup>
import { ref } from 'vue';

import OButton from '@/components/OButton.vue';

import IconArrowRight from '~icons/app/arrow-right.svg';

import { getCompetition } from '@/api/api-competition';

const activeName = ref('first');
const state = ref('doing'); //比赛状态：will-do，doing，done

const handleClick = (tab, event) => {
  console.log(tab, event);
};
const tableData = ref();
function getCompetitions() {
  getCompetition()
    .then((res) => {
      console.log(res);
      tableData.value = res.data;
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
}
getCompetitions();
function goDetail(id) {
  console.log(id);
}
</script>
<template>
  <div class="competition-page">
    <div class="competition-head">
      <div class="wrap">
        <el-carousel :interval="4000" type="card" height="200px">
          <el-carousel-item v-for="item in 4" :key="item">
            <h3 text="2xl" justify="center">{{ item }}</h3>
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>
    <div class="competition-body wrap">
      <el-tabs
        v-model="activeName"
        type="card"
        class="demo-tabs"
        @tab-click="handleClick"
      >
        <el-tab-pane label="竞赛状态" name="" disabled></el-tab-pane>
        <el-tab-pane label="全部" name="first">
          <div
            v-for="item in tableData"
            :key="item.id"
            class="competition-card"
          >
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
            <div class="right-immediate">
              <OButton type="primary" animation @click="goDetail(item.id)">
                立即报名
                <template #suffix>
                  <OIcon><IconArrowRight /></OIcon>
                </template>
              </OButton>
              <div class="number">报名人数：302</div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="进行中" name="second">Config</el-tab-pane>
        <el-tab-pane label="已结束" name="third">Role</el-tab-pane>
        <el-tab-pane label="未开始" name="fourth">Task</el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<style scoped lang="scss">
.wrap {
  margin: 0 auto;
  padding: 0 16px;
  max-width: 1472px;
}
.competition-page {
  background-color: #f5f6f8;
  .competition-head {
    background-color: #ffffff;
    padding-top: 80 + 40px;
    .el-carousel__item h3 {
      color: #475669;
      opacity: 0.75;
      line-height: 200px;
      margin: 0;
      text-align: center;
    }
    .el-carousel__item:nth-child(2n + 1) {
      background-color: #d41b2d;
    }
  }
  .competition-body {
    :deep(.demo-tabs) {
      .el-tabs__header {
        border: none;
        margin-top: 40px;
        margin-bottom: 24px;

        .el-tabs__nav {
          border: none;
        }
        .el-tabs__nav-scroll {
          background-color: #ffffff;
        }
        .el-tabs__item {
          border: none;
          line-height: 28px;
          height: 28px;
          margin: 14px 6px;
          padding: 0 12px;
          color: #555555;
          &:first-child {
            color: #000000;
            font-weight: 550;
            margin-left: 12px;
            margin-right: 22px;
          }
          &:last-child {
            padding-right: 12px;
          }
        }
        .is-active {
          box-shadow: 0 0 0 1px #0d8dff inset;
          color: #0d8dff;
        }
      }
      .el-tabs__content {
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
      }
    }
  }
}
</style>
