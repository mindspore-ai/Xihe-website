<script setup>
import { ref } from 'vue';

import emptyImg from '@/assets/imgs/dataset-empty.png';
import firstImg from '@/assets/imgs/first.png';
import secondImg from '@/assets/imgs/second.png';
import thirdImg from '@/assets/imgs/third.png';

import { getRank } from '@/api/api-competition';

import { useCompetitionData } from '@/stores';

const comInfo = useCompetitionData().competitionData; // 比赛详情

const preliminaryData = ref([]); // 初赛排行榜数据
const finalData = ref([]); // 决赛排行榜数据
getRank({ id: comInfo.id }).then((res) => {
  if (res.status === 200) {
    if (res.data.data) {
      preliminaryData.value = res.data.data.preliminary;
    } else {
      preliminaryData.value = [];
    }
  }
});

function changeTab(index) {
  if (index === '1') {
    let params = { id: comInfo.id, phase: 'final' };
    getRank(params).then((res) => {
      if (res.status === 200) {
        if (res.data.data) {
          finalData.value = res.data.data.final;
        } else {
          finalData.value = [];
        }
      }
    });
  }
}
</script>
<template>
  <div v-if="comInfo.type === 'challenge'">
    <div v-if="preliminaryData && preliminaryData.length" class="rank-page">
      <div class="rank-header">排行榜</div>
      <div class="rank-body">
        <el-table :data="preliminaryData">
          <el-table-column prop="date" label="排名">
            <template #default="scope">
              <img v-if="scope.$index === 0" :src="firstImg" alt="" />
              <img v-else-if="scope.$index === 1" :src="secondImg" alt="" />
              <img v-else-if="scope.$index === 2" :src="thirdImg" alt="" />
              <div v-else-if="scope.$index < 9" class="num">
                {{ '0' + (scope.$index + 1) }}
              </div>
              <div v-else class="num">{{ scope.$index + 1 }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="team_name" label="参赛团队" />
          <el-table-column label="分数">
            <template #default="scope">
              <div class="score">
                {{ preliminaryData[scope.$index].score }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="submit_at" label="提交时间" width="210" />
        </el-table>
      </div>
    </div>
    <div v-else class="empty">
      <img :src="emptyImg" alt="" />
      <p>当前为选拔阶段，暂无排行榜</p>
    </div>
  </div>
  <el-tabs
    v-else
    type="border-card"
    tab-position="left"
    class="tab-left tab-of-left"
    @tab-change="changeTab"
  >
    <el-tab-pane>
      <template #label>
        <div class="tabs-item tabs-left">初赛排行榜</div>
      </template>
      <div v-if="preliminaryData && preliminaryData.length" class="rank-page">
        <!-- <div class="rank-header">排行榜</div> -->
        <div class="rank-body">
          <el-table :data="preliminaryData">
            <el-table-column prop="date" label="排名">
              <template #default="scope">
                <img v-if="scope.$index === 0" :src="firstImg" alt="" />
                <img v-else-if="scope.$index === 1" :src="secondImg" alt="" />
                <img v-else-if="scope.$index === 2" :src="thirdImg" alt="" />
                <div v-else-if="scope.$index < 9" class="num">
                  {{ '0' + (scope.$index + 1) }}
                </div>
                <div v-else class="num">{{ scope.$index + 1 }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="team_name" label="参赛团队" />
            <el-table-column label="分数">
              <template #default="scope">
                <div class="score">
                  {{ preliminaryData[scope.$index].score }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="submit_at" label="提交时间" width="210" />
            <!-- <template v-if="preliminaryData" #append>
          查看全部<OIcon><IconArrowDown /></OIcon>
        </template> -->
          </el-table>
        </div>
      </div>
      <div v-else class="empty">
        <img :src="emptyImg" alt="" />
        <p>当前为选拔阶段，暂无排行榜</p>
      </div>
    </el-tab-pane>
    <el-tab-pane>
      <template #label>
        <div class="tabs-item">决赛排行榜</div>
      </template>
      <div v-if="finalData && finalData.length" class="rank-page">
        <!-- <div class="rank-header">排行榜</div> -->
        <div class="rank-body">
          <el-table :data="finalData">
            <el-table-column prop="date" label="排名">
              <template #default="scope">
                <img v-if="scope.$index === 0" :src="firstImg" alt="" />
                <img v-else-if="scope.$index === 1" :src="secondImg" alt="" />
                <img v-else-if="scope.$index === 2" :src="thirdImg" alt="" />
                <div v-else-if="scope.$index < 9" class="num">
                  {{ '0' + (scope.$index + 1) }}
                </div>
                <div v-else class="num">{{ scope.$index + 1 }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="team_name" label="参赛团队" />
            <el-table-column label="分数">
              <template #default="scope">
                <div class="score">{{ finalData[scope.$index].score }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="submit_at" label="提交时间" width="210" />
            <!-- <template v-if="preliminaryData" #append>
          查看全部<OIcon><IconArrowDown /></OIcon>
        </template> -->
          </el-table>
        </div>
      </div>
      <div v-else class="empty">
        <img :src="emptyImg" alt="" />
        <p>暂无决赛排行榜</p>
      </div>
    </el-tab-pane>
    <el-tab-pane
      v-if="comInfo.winners"
      :label="comInfo.status === 'in-progress' ? '晋级决赛名单' : '获奖名单'"
    >
      <div class="final-list">
        <img :src="comInfo.winners" alt="" />
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<style lang="scss" scoped>
:deep(.el-tabs__content) {
  padding: 0;
  margin-top: 52px;
  .final-list {
    margin: 40px 0;
    display: flex;
    justify-content: center;
    img {
      width: 50%;
    }
  }
}
:deep(.el-tabs__nav-wrap) {
  margin: 30px 80px 0;
  border-radius: 32px 32px 0 0;
}

// :deep(.el-tabs--left.el-tabs--border-card) {
//   .el-tabs__header.is-left {
//     border: 0;
//   }
// }
.el-tabs.tab-left.tab-of-left {
  border: 0;
  :deep(.el-tabs__header.is-left) {
    background-color: #fff;
    border: 0;
    .el-tabs__nav-prev,
    .el-tabs__nav-next {
      display: none;
    }
    .el-tabs__nav-wrap {
      margin-left: 40px;
    }
    .el-tabs__nav {
      width: 100%;
      background: #fff;

      .el-tabs__item {
        width: 188px;
        //   padding: 0 !important;
        //   margin: 0 !important;
        border: 0;
        text-align: left;
        font-size: 18px;
        line-height: 56px;
        height: 56px;
        //   color: #ffffff;
        //   height: 80px;
        //   font-size: 24px;

        //   .tabs-item {
        //     background-color: #e5e5e5;
        //     height: 100%;
        //     text-align: center;
        //     line-height: 80px;
        //   }
        //   .tabs-left {
        //     background-image: url(@/assets/imgs/rank-bg.png);
        //     background-position: 100%;
        //     background-size: cover;
        //     border-radius: 0 0 0 -21px;
        //     box-shadow: 1px 3px 10px rgba(0, 0, 0, 100%);
        //   }
        //   .tabs-right {
        //     background-image: url(@/assets/imgs/rank-bg1.png);
        //     background-position: 0;
        //     background-size: cover;
        //     // box-shadow: 1px 3px 10px rgba(0, 0, 0, 20%);
        //   }
        //   &:not(.is-disabled):hover {
        //     color: #ffffff;
        //   }
      }
      .el-tabs__item.is-active {
        color: #000000;
        border: 0;
        border-right: 2px solid #0d8dff;
        background: #f7f8fa;
        // background-image: url(@/assets/imgs/rank-bg.png);
        // background-position: 100%;
        // background-size: cover;
      }
    }
  }
}
.rank-page {
  max-width: 1448px;
  img {
    width: 59px;
  }
  .rank-header {
    margin: 40px 80px 0;
    background-image: url(@/assets/imgs/rank-bg2.png);
    color: #ffffff;
    font-size: 24px;
    line-height: 32px;
    text-align: center;
    padding: 24px;
  }
  .rank-body {
    margin: 0 80px;
    padding-bottom: 40px;
    :deep(.el-table--fit) {
      --el-table-fixed-box-shadow: none;
    }
    // margin-left: 40px;
    :deep(.el-table__inner-wrapper) {
      th {
        color: #000000;
      }
      color: #555555;
      .el-table__header {
        font-size: 18px;
        line-height: 26px;
        border: 0;
        .cell {
          margin: 24px 40px;
        }
        tr {
          --el-table-fixed-box-shadow: none;
        }
      }
      .el-table__cell {
        padding: 0;
        .cell {
          padding: 0;
        }
      }
      // .el-table_1_column_1 {
      //   padding-left: 40px !important;
      // }
      .el-table__body {
        font-size: 16px;
        line-height: 24px;
        // .el-table_1_column_1 {
        //   font-size: 28px;
        // }
        // .el-table_1_column_3 {
        //   color: #ff7f0d;
        // }
        .el-table__row:first-child {
          background: linear-gradient(to right, #fff, #fffbef);
          border: none;
          box-shadow: none;
        }
        .el-table__row:nth-child(2) {
          background: linear-gradient(to right, #fff, #fafcfc);
        }
        .el-table__row:nth-child(3) {
          background: linear-gradient(to right, #fff, #fffaf6);
        }
      }
      .cell {
        margin: 8px 40px;
        .num {
          margin: 22px 12px;
          // margin-left: 12px;
          font-size: 28px;
        }
        .score {
          color: #ff7f0d;
          font-size: 24px;
        }
      }
      .el-table__append-wrapper {
        // text-align: center;
        margin-top: 27px;
        margin-bottom: 40px;
        margin-right: 40px;
        font-size: 14px;
        color: #40c4ff;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        .o-icon {
          font-size: 24px;
          color: #0d8dff;
          margin-left: 8px;
        }
      }
    }
  }
}
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120px 16px;
  background-color: #fff;
  img {
    width: 280px;
  }
  p {
    margin-top: 24px;
    color: #555555;
    font-size: 18px;
  }
}
</style>
