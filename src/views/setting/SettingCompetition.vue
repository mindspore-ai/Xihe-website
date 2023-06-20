<script setup>
import { ref, reactive } from 'vue';
import { getUserCompetition } from '@/api/api-user';
import emptyImg from '@/assets/imgs/competition-empty.png';
import { useRouter } from 'vue-router';
import { useUserInfoStore, usePersonalInfoStore } from '@/stores';

const userInfoStore = useUserInfoStore();
const activeName = ref('all');
const router = useRouter();
const allCompetition = ref([]); // 所有的比赛
const inprogressCompetition = ref([]); // 进行中的比赛
const overCompetition = ref([]); // 已结束的比赛
const perPageAllData = ref([]); // 所有比赛的每页数据
const perPageInprogressData = ref([]); // 进行中比赛的每页数据
const perPageOverData = ref([]); // 已结束比赛的每页数据

let allPager = reactive({
  page: 1,
  size: 5,
});
let inProgressPager = reactive({
  page: 1,
  size: 5,
});
let overPager = reactive({
  page: 1,
  size: 5,
});

// 获取用户参加的所有比赛
const personalData = usePersonalInfoStore();
function getCompetitons() {
  allCompetition.value = personalData.competition?.reverse();
  perPageAllData.value = allCompetition.value?.slice(0, allPager.size);
}
getCompetitons();
// 获取用户进行中和已结束的比赛
const handleClick = (tab) => {
  if (tab.props.name === 'doing') {
    getUserCompetition({
      mine: userInfoStore.userName,
      status: 'in-progress',
    }).then((res) => {
      inprogressCompetition.value = res.data.data?.reverse();
      perPageInprogressData.value = inprogressCompetition.value?.slice(
        0,
        inProgressPager.size
      );
    });
  } else if (tab.props.name === 'done') {
    getUserCompetition({
      mine: userInfoStore.userName,
      status: 'over',
    }).then((res) => {
      overCompetition.value = res.data.data?.reverse();
      perPageOverData.value = overCompetition.value?.slice(0, overPager.size);
    });
  }
};

function goCompetition() {
  router.push({ name: 'competition' });
}
// 跳转到比赛详情页
function goDetail(id) {
  router.push({
    name: 'competitionDetail',
    params: { id: id },
  });
}
// 分页器
const layout = ref('prev, pager, next');
function handleAllPager(val) {
  allPager.page = val;
  perPageAllData.value = allCompetition.value?.slice(
    allPager.page * allPager.size - allPager.size,
    allPager.page * allPager.size
  );
  toTop();
}

function handleInprogressPager(val) {
  inProgressPager.page = val;
  perPageInprogressData.value = inprogressCompetition.value?.slice(
    inProgressPager.page * inProgressPager.size - inProgressPager.size,
    inProgressPager.page * inProgressPager.size
  );
  toTop();
}
function handleOverPager(val) {
  overPager.page = val;
  perPageOverData.value = overCompetition.value?.slice(
    overPager.page * overPager.size - overPager.size,
    overPager.page * overPager.size
  );
  toTop();
}
function toTop() {
  document.documentElement.scrollTop = 0;
}
</script>
<template>
  <!-- 我的比赛 -->
  <div class="competition">
    <div
      v-if="allCompetition && allCompetition.length"
      class="competition-list"
    >
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
              v-for="item in perPageAllData"
              :key="item.id"
              class="competition-card"
              @click="goDetail(item.id)"
            >
              <div class="left">
                <div class="title">
                  <span> {{ item.name }} </span>
                  <span v-if="item.status === 'in-progress'" class="state doing"
                    >火热进行中</span
                  >
                  <span v-else class="state finished">已结束</span>
                </div>
                <div class="information">
                  <div class="host">举办方：{{ item.host }}</div>
                </div>
              </div>
              <div class="right">
                <div class="bonus">奖池：￥{{ item.bonus }}</div>
                <div class="time">赛期:{{ item.duration }}</div>
              </div>
            </div>
            <!-- 全部比赛页的分页器 -->
            <div class="pagination">
              <el-pagination
                hide-on-single-page
                :current-page="allPager.page"
                :page-size="allPager.size"
                :total="allCompetition.length"
                :layout="layout"
                @current-change="handleAllPager"
              ></el-pagination>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="进行中" name="doing">
          <div v-if="inprogressCompetition">
            <div
              v-for="item in perPageInprogressData"
              :key="item.id"
              class="competition-card"
              @click="goDetail(item.id)"
            >
              <div class="left">
                <div class="title">
                  <span> {{ item.name }} </span>
                  <span v-if="item.status === 'in-progress'" class="state doing"
                    >火热进行中</span
                  >
                </div>
                <div class="information">
                  <div class="host">举办方：{{ item.host }}</div>
                </div>
              </div>
              <div class="right">
                <div class="bonus">奖池：￥{{ item.bonus }}</div>
                <div class="time">赛期:{{ item.duration }}</div>
              </div>
            </div>
            <!-- 进行中比赛页的分页器 -->
            <div class="pagination">
              <el-pagination
                hide-on-single-page
                :current-page="inProgressPager.page"
                :page-size="inProgressPager.size"
                :total="inprogressCompetition.length"
                :layout="layout"
                @current-change="handleInprogressPager"
              ></el-pagination>
            </div>
          </div>
          <div v-else class="empty2">
            <img class="empty-img" :src="emptyImg" />
            <div class="empty-text">
              <span>暂无进行中比赛</span>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="已结束" name="done">
          <div v-if="overCompetition">
            <div
              v-for="item in perPageOverData"
              :key="item.id"
              class="competition-card"
              @click="goDetail(item.id)"
            >
              <div class="left">
                <div class="title">
                  <span> {{ item.name }} </span>
                  <span v-if="item.status === 'over'" class="state finished"
                    >已结束</span
                  >
                </div>
                <div class="information">
                  <div class="host">举办方：{{ item.host }}</div>
                </div>
              </div>
              <div class="right">
                <div class="bonus">奖池：￥{{ item.bonus }}</div>
                <div class="time">赛期:{{ item.duration }}</div>
              </div>
            </div>
            <!-- 已结束比赛页的分页器 -->
            <div class="pagination">
              <el-pagination
                hide-on-single-page
                :current-page="overPager.page"
                :page-size="overPager.size"
                :total="overCompetition.length"
                :layout="layout"
                @current-change="handleOverPager"
              ></el-pagination>
            </div>
          </div>
          <div v-else class="empty3">
            <img class="empty-img" :src="emptyImg" />
            <div class="empty-text">
              <span>暂无已结束比赛</span>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div v-else class="empty">
      <img class="empty-img" :src="emptyImg" />
      <div class="empty-text">
        <span>暂未参加比赛,</span>
        <span class="link" @click="goCompetition">点击参加比赛</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.competition {
  min-height: 500px;
  height: 100%;
  // background-color: red;
  position: relative;
  left: 0;
  top: 0;
  .competition-list {
    .competition-tabs {
      .el-tab-pane {
        .competition-card {
          border: 1px solid #d8d8d8;
          border-radius: 16px;
          padding: 22px 52px 22px 40px;
          margin: 1px;
          margin-bottom: 24px;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          transition: all 0.3s ease;
          &:hover {
            box-shadow: 0px 1px 30px 0px rgba(0, 0, 0, 0.05);
          }
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
                white-space: nowrap;
                border-radius: 100px;
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
              white-space: nowrap;
              border-radius: 24px;
            }
          }
        }
        .pagination {
          margin-top: 40px;
          display: flex;
          justify-content: center;
          margin-bottom: 36px;
        }
        .empty2 {
          display: inline-block;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 40px;
          .empty-text {
            line-height: 28px;
            margin-top: 24px;
            font-size: 18px;
            color: #555555;
          }
        }
        .empty3 {
          display: inline-block;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 40px;
          .empty-text {
            line-height: 28px;
            margin-top: 24px;
            font-size: 18px;
            color: #555555;
          }
        }
      }
    }
  }
  .empty {
    position: absolute;
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
      // box-shadow: 0px 1px 5px 0px rgba(45, 47, 51, 0.1);

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
        // box-shadow: 0 0 0 1px #0d8dff inset;
        color: #0d8dff;
      }
    }
    // .el-tabs__nav-wrap {
    //   box-shadow: 0px 1px 5px 0px rgba(45, 47, 51, 0.1);
    // }
  }
}
:deep(.el-pagination) {
  .el-pager {
    li {
      background-color: #fff;
    }
  }
  .btn-next,
  .btn-prev {
    background-color: #fff;
  }
}
</style>
