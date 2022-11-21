<script setup>
import { ref, watch, computed, onUpdated } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { getCompetition } from '@/api/api-competition';
import { getGroupid } from '@/api/api-competition';

import { goAuthorize } from '@/shared/login';
import { useUserInfoStore, useCompetitionData } from '@/stores';

import OButton from '@/components/OButton.vue';

import { ArrowRight } from '@element-plus/icons-vue';

const userInfoStore = useUserInfoStore();
const route = useRoute();
const router = useRouter();

const userComData = useCompetitionData();
// const detailData = computed(() => {
//   return userComData.competitionData;
// });
// 用户团队id
const teamId = computed(() => {
  return useCompetitionData().teamId;
});

const competitionData = ref([]);
const show = ref(true);
const showBread = ref(false);
const showDetail = ref(false);
const fixed = ref(false);

// 立即报名
function goApplication() {
  // 如果用户没有登录，则跳转到登录页面, 如果用户已经登录，则跳转到报名页面
  if (!userInfoStore.id) {
    goAuthorize();
  } else {
    // show.value = false;
    router.push({
      path: `/competition/${competitionData.value.id}/1/statement`,
    });
  }
}
watch(
  () => route.name,
  () => {
    if (
      route.name === 'statement' ||
      route.name === 'application' ||
      route.name === 'success'
    ) {
      show.value = false;
      showBread.value = true;
    } else if (route.name === 'introduction') {
      showBread.value = false;
      show.value = true;
    }
  },
  {
    immediate: true,
  }
);
onUpdated(() => {
  let card = document.querySelector('.competition-card');
  let box = document.querySelector('.competition-info');
  let top1 = card.offsetTop + 30;
  // let top2 = parent.offsetTop;
  window.addEventListener('scroll', function () {
    if (
      window.pageYOffset > top1 &&
      (route.name === 'introduction' ||
        route.name === 'leaderboard' ||
        route.name === 'dataset' ||
        route.name === 'result' ||
        route.name === 'team' ||
        route.name === 'agreement')
    ) {
      box.style.display = 'flex';
      fixed.value = true;
    }
    if (window.pageYOffset < top1) {
      box.style.display = 'none';
      // card.classList.remove('fixed');
      fixed.value = false;
    }
  });
});

// 获取比赛信息、判断是否报名
async function getDetailData() {
  try {
    // 获取比赛信息
    let res = await getCompetition({ id: route.params.id });
    if (res.status === 200 && res.data.name) {
      competitionData.value = res.data;
      userComData.setCompetitionData(res.data);
    } else {
      router.push('/competition');
    }
    // 获取团队id
    let params = { id: route.params.id };
    let res2 = await getGroupid(params.id);
    if (res2.status === 200) {
      // teamId.value = res2.group_id;
      userComData.setTeamId(res2.group_id);
    }
    showDetail.value = true;
  } catch (error) {
    console.error(error);
  }
}
getDetailData();
</script>

<template>
  <div v-if="showDetail">
    <div class="competition-detail">
      <div class="competition-wrap">
        <div class="bread-wrap">
          <div class="competition-bread">
            <el-breadcrumb :separator-icon="ArrowRight">
              <el-breadcrumb-item :to="{ path: '/competition' }"
                >比赛</el-breadcrumb-item
              >
              <el-breadcrumb-item
                :to="{ path: `/competition/${competitionData.id}` }"
                class="breadcrumb-item"
                >{{ competitionData.name }}</el-breadcrumb-item
              >
              <el-breadcrumb-item v-if="showBread">报名</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
        </div>
        <div class="competition-content">
          <div class="competition-box competition-card">
            <div class="left">
              <div class="card-head">
                <div class="card-head-title">
                  {{ competitionData.name }}
                </div>
                <div
                  v-if="competitionData.status_name === '进行中'"
                  class="card-head-state doing"
                >
                  火热进行中
                </div>
                <div
                  v-if="competitionData.status_name === '未开始'"
                  class="card-head-state noStarted"
                >
                  未开始
                </div>
                <div
                  v-if="competitionData.status_name === '已结束'"
                  class="card-head-state finished"
                >
                  已结束
                </div>
              </div>
              <!-- <div class="card-body">{{ competitionData.description }}</div> -->
              <div class="card-body">
                {{ competitionData.description }}
              </div>
              <div class="card-footer">举办方:{{ competitionData.host }}</div>
            </div>
            <div v-if="teamId === null && show" class="right1">
              <div class="right1-bonus">
                <div class="number">奖池：￥{{ competitionData.bonus }}</div>
                <div class="time">赛期:{{ competitionData.during }}</div>
              </div>
              <div class="right-immediate">
                <div class="right-wrap">
                  <div v-if="competitionData.status_name === '进行中'">
                    <OButton
                      :disabled="competitionData.competition_period === '决赛'"
                      type="primary"
                      animation
                      @click="goApplication"
                    >
                      立即报名
                    </OButton>
                  </div>
                  <div v-if="competitionData.status_name === '未开始'">
                    <div class="competitionState">报名未开始</div>
                  </div>
                  <div v-if="competitionData.status_name === '已结束'">
                    <div class="competitionState">比赛已结束</div>
                  </div>
                  <div class="number">
                    报名人数：{{ competitionData.user_count }}
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="right2">
              <div class="right2-bonus">
                <div class="number">奖池：￥{{ competitionData.bonus }}</div>
                <div class="time">赛期:{{ competitionData.during }}</div>
              </div>
            </div>
          </div>
          <div class="competition-box competition-info">
            <div class="left">
              <div class="card-head">
                <div class="card-head-title">
                  {{ competitionData.name }}
                </div>
                <div
                  v-if="competitionData.status_name === '进行中'"
                  class="card-head-state doing"
                >
                  火热进行中
                </div>
                <div
                  v-if="competitionData.status_name === '未开始'"
                  class="card-head-state noStarted"
                >
                  未开始
                </div>
                <div
                  v-if="competitionData.status_name === '已结束'"
                  class="card-head-state finished"
                >
                  已结束
                </div>
              </div>
            </div>
            <div v-if="teamId === null && show" class="right1">
              <div v-if="teamId !== null" class="right1-bonus">
                <div class="time">赛期:{{ competitionData.during }}</div>
              </div>
              <div class="right-immediate">
                <div class="right-wrap">
                  <div v-if="competitionData.status_name === '进行中'">
                    <OButton
                      :disabled="competitionData.competition_period === '决赛'"
                      type="primary"
                      animation
                      @click="goApplication"
                    >
                      立即报名
                    </OButton>
                  </div>
                  <div v-if="competitionData.status_name === '未开始'">
                    <div class="competitionState">报名未开始</div>
                  </div>
                  <div v-if="competitionData.status_name === '已结束'">
                    <div class="competitionState">比赛已结束</div>
                  </div>
                  <!-- <div class="number">
                    报名人数：{{ competitionData.user_count }}
                  </div> -->
                </div>
              </div>
            </div>
            <div v-else class="right2">
              <div class="right2-bonus">
                <div class="time">赛期:{{ competitionData.during }}</div>
              </div>
            </div>
          </div>
          <div class="competition-desc">
            <router-view :fixed="fixed"></router-view>
          </div>
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
    padding: 0px 16px 64px;
    margin: 0 auto;
    max-width: 1472px;
    overflow: hidden;
    .bread-wrap {
      height: 94px;
      // position: fixed;
      // z-index: 10;
      // min-width: 100%;
      // max-width: 100%;
      padding-top: 40px;
      padding-bottom: 40px;
      background-color: #f5f6f8;
      .competition-bread {
        width: 100%;
        overflow-y: auto;
        // background-color: #f5f6f8;
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
          :deep(.el-breadcrumb__item:nth-child(2) .el-breadcrumb__inner) {
            cursor: pointer;
          }
        }
      }
    }
    .competition-content {
      // margin-top: 94px;
      scroll-behavior: smooth;
      /*  .fixed {
        position: fixed;
        height: 128px;
        z-index: 100;
        top: 174px;
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
      } */
      // .competition-card {
      //   background-color: #ffffff;
      //   display: flex;
      //   align-items: center;
      //   font-size: 14px;
      //   margin-bottom: 24px;

      .competition-box {
        font-size: 14px;
        // padding: 40px 48px 24px 40px;
        background-color: #ffffff;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0px 1px 5px 0px rgba(45, 47, 51, 0.1);
        .left {
          padding: 40px 0px 24px 40px;

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
            .doing {
              color: #ffffff;
              background-color: #ff7f0d;
            }
            .noStarted {
              color: #ffffff;
              background-color: #6189ff;
            }
            .finished {
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
        .right1 {
          display: flex;
          padding-right: 48px;
          &-bonus {
            margin: 40px 90px 24px 88px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            // align-items: center;
            white-space: nowrap;
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
          .right-immediate {
            border-left: 1px solid #e4e5e7;
            .right-wrap {
              width: 144px;
              height: 100%;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              margin-left: 48px;
              .competitionState {
                font-size: 16px;
                color: #cccccc;
                line-height: 22px;
              }
              .number {
                color: #555555;
                margin-top: 16px;
              }
            }
            //
            //   margin-right: 48px;
            //   .number {
            //
            //     line-height: 22px;
            //     text-align: center;
            //
            //   }
          }
        }
        .right2 {
          padding-right: 93px;
          &-bonus {
            margin-left: 80px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            height: 100%;
            white-space: nowrap;
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
      .competition-info {
        display: none;
        position: fixed;
        scroll-behavior: smooth;
        z-index: 10;
        width: 100%;
        top: 80px;
        overflow: hidden;
        max-width: 1440px;
        height: 128px;
        .left {
          padding: 0 0 0 40px;
        }
        .right1 {
          padding-right: 80px;
          .right-immediate {
            border-left: 0px;
            .right1-bonus {
              margin: 0px 90px 0px 88px;
              .time {
                margin-top: 0px;
              }
            }
          }
        }
        .right2 {
          .time {
            margin-top: 0px;
          }
        }
      }
    }
    .competition-desc {
      margin-top: 24px;
      background-color: #fff;
      /* &-tab {
          height: 48px;
          background-color: #fbfbfb;
          :deep(.o-nav) {
            .nav-item {
              margin-left: 40px;
            }
            width: 100%;
            display: flex;
            justify-content: center;
            margin: 0 auto;
            .nav-item {
              color: #555;
            }
          }
        } */
    }
  }
}
</style>
