<script setup>
import { ref } from 'vue';
const activeName = ref('first');

const handleClick = (tab, event) => {
  //   console.log(tab, event);
};
</script>
<template>
  <!-- 我的比赛 -->
  <div class="competition">
    <el-tabs
      v-model="activeName"
      type="card"
      class="competition-tabs"
      @tab-click="handleClick"
    >
      <el-tab-pane label="竞赛状态" name="" disabled></el-tab-pane>
      <el-tab-pane label="全部" name="first">
        <div class="competition-card">
          <div class="left">
            <div class="title">
              <span> 第三届全国高校绿色计算创新大赛 </span>
              <span class="doing">火热进行中</span>
            </div>
            <div class="information">
              <div class="competition-time">参赛时间：2022.08.20</div>
              <div class="competition-form">参赛形式：啊对对对队</div>
            </div>
          </div>
          <div class="right">
            <div class="bonus">奖金：800,000</div>
            <div class="time">赛期:2020/6/15-2020/9/11</div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="进行中" name="second">进行的比赛</el-tab-pane>
      <el-tab-pane label="已结束" name="third">已结束的比赛</el-tab-pane>
    </el-tabs>
  </div>
</template>

<style lang="scss" scoped>
.competition {
  &-tabs {
    .el-tab-pane {
      .competition-card {
        box-shadow: 0px 1px 5px 0px rgba(45, 47, 51, 0.1);
        padding: 22px 52px 22px 40px;
        margin: 1px;
        margin-bottom: 24px;
        display: flex;
        justify-content: space-between;
        .left {
          .title {
            margin-bottom: 36px;
            color: #000;
            font-size: 24px;
            font-weight: 400;
            line-height: 32px;
            display: flex;
            align-items: center;
            .doing {
              display: inline-block;
              padding-left: 8px;
              padding-right: 8px;
              line-height: 20px;
              font-size: 12px;
              margin-left: 6px;
              background-color: #ff7f0d;
            }
          }
          .information {
            display: flex;
            line-height: 22px;
            font-size: 14px;
            font-weight: 400;
            color: #555555;
            .competition-time {
              margin-right: 24px;
            }
          }
        }
        .right {
          display: flex;
          flex-direction: column;
          align-items: center;
          .bonus {
            line-height: 28px;
            font-size: 24px;
            font-weight: 500;
            color: #6189ff;
          }
          .time {
            padding: 12px 40px;
            color: #555555;
            margin-top: 24px;
            background-color: #f4faff;
          }
        }
      }
    }
  }
  :deep(.el-tabs) {
    .el-tabs__header {
      border: none;
      margin-top: 40px;
      margin-bottom: 24px;
      box-shadow: 0px 1px 5px 0px rgba(45, 47, 51, 0.1);

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
  }
}
</style>
