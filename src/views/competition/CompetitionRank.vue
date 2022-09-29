<!-- eslint-disable prettier/prettier -->
<script setup>
import { ref } from 'vue';

// import IconArrowDown from '~icons/app/arrow-down.svg';

import emptyImg from '@/assets/imgs/dataset-empty.png';
import firstImg from '@/assets/imgs/first.png';
import secondImg from '@/assets/imgs/second.png';
import thirdImg from '@/assets/imgs/third.png';

import { useRoute } from 'vue-router';

import { getRank } from '@/api/api-competition';

const route = useRoute();

const tableData = ref([]);
getRank(route.path.split('/')[2]).then((res) => {
  tableData.value = res.data;
  tableData.value.forEach((element) => {
    element.create_time = element.create_time.split('T')[0];
  });
  // console.log(tableData.value)hli
});
</script>
<template>
  <div v-if="tableData.length" class="rank-page">
    <div class="rank-header">排行榜</div>
    <div class="rank-body">
      <el-table :data="tableData">
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
        <el-table-column prop="group_name" label="参赛团队" />
        <el-table-column label="分数">
          <template #default="scope">
            <div class="score">{{ tableData[scope.$index].score }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="提交时间" width="210" />
        <!-- <template v-if="tableData" #append>
          查看全部<OIcon><IconArrowDown /></OIcon>
        </template> -->
      </el-table>
    </div>
  </div>
  <div v-else class="empty">
    <img :src="emptyImg" alt="" />
    <p>当前为选拔阶段，暂无排行榜</p>
  </div>
</template>

<style lang="scss" scoped>
.rank-page {
  max-width: 1472px;
  img {
    width: 59px;
  }
  .rank-header {
    margin: 40px 80px 0;
    background-image: url(@/assets/imgs/rank-bg.png);
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
  background-color: #f5f6f8;
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
