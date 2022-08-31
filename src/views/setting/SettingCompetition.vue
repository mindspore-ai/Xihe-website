<script setup>
import { ref } from 'vue';
import { getCompetition, getAllCompetition } from '@/api/api-user';
import emptyImg from '@/assets/imgs/competition-empty.png';
import { useRouter } from 'vue-router';

const activeName = ref('all');
const router = useRouter();
const competitionDatas = ref([]); //所有的比赛
const competitionDatas2 = ref([]); //进行中的比赛
const competitionDatas3 = ref([]); //已结束的比赛

// 获取用户参加的所以比赛
function getCompetitons() {
  getAllCompetition().then((res) => {
    // console.log('用户参加的所有比赛: ', res.data);
    competitionDatas.value = res.data;
  });
}
getCompetitons();

// 获取用户进行中和已结束的比赛
const handleClick = (tab) => {
  if (tab.props.name === 'doing') {
    getCompetition(3).then((res) => {
      competitionDatas2.value = res.data;
      // console.log('进行中的比赛: ', competitionDatas2.value);
    });
  } else if (tab.props.name === 'done') {
    getCompetition(2).then((res) => {
      competitionDatas3.value = res.data;
      // console.log('已结束的比赛: ', competitionDatas3.value);
    });
  }
};

function goCompetition() {
  router.push({ name: 'competition' });
}
</script>
<template>
  <!-- 我的比赛 -->
  <div class="competition">
    <div v-if="competitionDatas.length !== 0" class="competition-list">
      <el-tabs
        v-model="activeName"
        type="card"
        class="competition-tabs"
        @tab-click="handleClick"
      >
        <el-tab-pane label="竞赛状态" name="" disabled></el-tab-pane>
        <el-tab-pane label="全部" name="all">
          <div>
            <div
              v-for="item in competitionDatas"
              :key="item.id"
              class="competition-card"
            >
              <div class="left">
                <div class="title">
                  <span> {{ item.name }} </span>
                  <span v-if="item.status_name === '进行中'" class="state doing"
                    >火热进行中</span
                  >
                  <span v-else class="state finished">已结束</span>
                </div>
                <div class="information">
                  <div class="host">举办方：{{ item.host }}</div>
                  <!-- <div class="competition-time">参赛时间：{{ item.during }}</div>TODO:参赛时间和形式暂没有字段 -->
                  <!-- <div class="competition-form">参赛形式：啊对对对队</div> -->
                </div>
              </div>
              <div class="right">
                <div class="bonus">奖金：{{ item.bonus }}</div>
                <div class="time">赛期:{{ item.during }}</div>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="进行中" name="doing">
          <div>
            <div
              v-for="item in competitionDatas2"
              :key="item.id"
              class="competition-card"
            >
              <div class="left">
                <div class="title">
                  <span> {{ item.name }} </span>
                  <span v-if="item.status_name === '进行中'" class="state doing"
                    >火热进行中</span
                  >
                </div>
                <div class="information">
                  <div class="host">举办方：{{ item.host }}</div>
                  <!-- <div class="competition-time">参赛时间：{{ item.during }}</div>TODO:参赛时间和形式暂没有字段 -->
                  <!-- <div class="competition-form">参赛形式：啊对对对队</div> -->
                </div>
              </div>
              <div class="right">
                <div class="bonus">奖金：{{ item.bonus }}</div>
                <div class="time">赛期:{{ item.during }}</div>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="已结束" name="done">
          <!-- <div v-if="competitionDatas3.length !== 0"> -->
          <div
            v-for="item in competitionDatas3"
            :key="item.id"
            class="competition-card"
          >
            <div class="left">
              <div class="title">
                <span> {{ item.name }} </span>
                <span class="state finished">已结束</span>
              </div>
              <div class="information">
                <div class="host">举办方：{{ item.host }}</div>
                <!-- <div class="competition-time">参赛时间：{{ item.during }}</div>TODO:参赛时间和形式暂没有字段 -->
                <!-- <div class="competition-form">参赛形式：啊对对对队</div> -->
              </div>
            </div>
            <div class="right">
              <div class="bonus">奖金：{{ item.bonus }}</div>
              <div class="time">赛期:{{ item.during }}</div>
            </div>
          </div>
          <!-- </div> -->
          <!-- <div v-else class="empty2">
            <img class="empty-img" :src="emptyImg" />
            <div class="empty-text">
              <span>暂未参加比赛，</span>
            </div>
          </div> -->
        </el-tab-pane>
      </el-tabs>
    </div>
    <div v-else class="empty">
      <img class="empty-img" :src="emptyImg" />
      <div class="empty-text">
        <span>暂未参加比赛，</span>
        <span class="link" @click="goCompetition">点击参加比赛</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.competition {
  height: 100%;
  position: relative;
  left: 0;
  top: 0;
  .competition-list {
    .competition-tabs {
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
              .state {
                display: inline-block;
                padding-left: 8px;
                padding-right: 8px;
                line-height: 20px;
                font-size: 12px;
                margin-left: 6px;
              }
              .doing {
                color: #ffffff;
                background-color: #ff7f0d;
              }
              .finished {
                color: #555555;
                background-color: #efefef;
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
  }
  .empty {
    position: absolute;
    // top: calc(50% + 48px);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .empty-img {
      width: 280px;
      height: 206px;
    }
    .empty-text {
      line-height: 28px;
      margin-top: 24px;
      font-size: 18px;
      color: #555555;
      .link {
        color: #0d8dff;
        cursor: pointer;
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
