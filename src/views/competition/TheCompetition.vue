<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import OButton from '@/components/OButton.vue';

import paintings from '@/assets/imgs/paintings1.png';
import imageClassify from '@/assets/imgs/imageClassify.jpg';
import textClassification from '@/assets/imgs/textClassification2.jpg';
import emptyImg from '@/assets/imgs/dataset-empty.png';

import IconArrowRight from '~icons/app/arrow-right.svg';

import { getCompetition, getAllCompetition } from '@/api/api-competition';

const router = useRouter();

const activeName = ref('first');
const state = ref('doing'); //比赛状态：will-do，doing，done

const handleClick = (tab) => {
  if (tab.props.name !== 'first') {
    getCompetitions1(tab.props.name);
  }
};
const tableData = ref();
const tableData1 = ref([]);
const tableData2 = ref([]);
const tableData3 = ref([]);
function getCompetitions() {
  getCompetition()
    .then((res) => {
      tableData.value = res.data;
    })
    .catch((err) => {
      console.error(err);
    });
}
function getCompetitions1(tab) {
  getAllCompetition(tab)
    .then((res) => {
      if (tab === '1') {
        tableData1.value = res.data;
      } else if (tab === '2') {
        tableData2.value = res.data;
      } else if (tab === '3') {
        tableData3.value = res.data;
      }
    })
    .catch((err) => {
      console.error(err);
    });
}
getCompetitions();
// 跳转到比赛详情页
function goDetail(id) {
  router.push({
    name: 'competitionDetail',
    params: { id: id },
  });
  // router.push(`/competition/${id}`)
}
function change(pre, next) {
  // console.log(pre, next);
}
</script>
<template>
  <div class="competition-page">
    <div class="competition-head">
      <div class="wrap">
        <el-carousel
          :interval="4000"
          type="card"
          height="300px"
          @change="
            (pre, next) => {
              change(pre, next);
            }
          "
        >
          <el-carousel-item><img :src="paintings" alt="" /> </el-carousel-item>
          <el-carousel-item
            ><img :src="imageClassify" alt="" />
          </el-carousel-item>
          <el-carousel-item
            ><img :src="textClassification" alt="" />
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
        <el-tab-pane label="全部" name="first"
          ><div v-if="tableData">
            <div
              v-for="item in tableData"
              :key="item.id"
              class="competition-box"
              @click="goDetail(item.id)"
            >
              <div class="left">
                <div class="card-head">
                  <div class="card-head-title">
                    {{ item.name }}
                  </div>
                  <div
                    v-if="item.status_name === '进行中'"
                    class="card-head-state"
                    :class="state"
                  >
                    火热进行中
                  </div>
                </div>
                <!-- <div class="card-body">{{ item.description }}</div> -->
                <div class="card-body">
                  {{ item.description }}
                </div>
                <div class="card-footer">举办方：{{ item.host }}</div>
              </div>
              <div class="right1">
                <div class="right1-bonus">
                  <div class="number">奖池：￥{{ item.bonus }}</div>
                  <div class="time">赛期：{{ item.during }}</div>
                </div>
                <div class="right-immediate">
                  <div v-if="item.status_name === '进行中'" class="right-wrap">
                    <OButton
                      type="primary"
                      animation
                      @click="goDetail(item.id)"
                    >
                      立即前往
                      <template #suffix>
                        <OIcon><IconArrowRight /></OIcon>
                      </template>
                    </OButton>
                    <div class="number">报名人数：{{ item.user_count }}</div>
                  </div>
                  <div v-else class="right-wrap">
                    <div class="not-started">报名未开始</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="empty">
            <img :src="emptyImg" alt="" />
            <p>敬请期待</p>
          </div>
        </el-tab-pane>
        <el-tab-pane label="进行中" name="3">
          <div v-if="tableData3.length">
            <div
              v-for="item in tableData3"
              :key="item.id"
              class="competition-box"
              @click="goDetail(item.id)"
            >
              <div class="left">
                <div class="card-head">
                  <div class="card-head-title">
                    {{ item.name }}
                  </div>
                  <div
                    v-if="item.status_name === '进行中'"
                    class="card-head-state"
                    :class="state"
                  >
                    火热进行中
                  </div>
                </div>
                <!-- <div class="card-body">{{ item.description }}</div> -->
                <div class="card-body">
                  {{ item.description }}
                </div>
                <div class="card-footer">举办方：{{ item.host }}</div>
              </div>
              <div class="right1">
                <div class="right1-bonus">
                  <div class="number">奖池：￥{{ item.bonus }}</div>
                  <div class="time">赛期：{{ item.during }}</div>
                </div>
                <div class="right-immediate">
                  <div class="right-wrap">
                    <OButton
                      type="primary"
                      animation
                      @click="goDetail(item.id)"
                    >
                      立即前往
                      <template #suffix>
                        <OIcon><IconArrowRight /></OIcon>
                      </template>
                    </OButton>
                    <div class="number">报名人数：{{ item.user_count }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="empty">
            <img :src="emptyImg" alt="" />
            <p>敬请期待</p>
          </div>
        </el-tab-pane>
        <el-tab-pane label="已结束" name="2">
          <div v-if="tableData2.length">
            <div
              v-for="item in tableData2"
              :key="item.id"
              class="competition-box"
              @click="goDetail(item.id)"
            >
              <div class="left">
                <div class="card-head">
                  <div class="card-head-title">
                    {{ item.name }}
                  </div>
                  <div
                    v-if="item.status_name === '进行中'"
                    class="card-head-state"
                    :class="state"
                  >
                    火热进行中
                  </div>
                </div>
                <!-- <div class="card-body">{{ item.description }}</div> -->
                <div class="card-body">
                  {{ item.description }}
                </div>
                <div class="card-footer">举办方：{{ item.host }}</div>
              </div>
              <div class="right1">
                <div class="right1-bonus">
                  <div class="number">奖池：￥{{ item.bonus }}</div>
                  <div class="time">赛期：{{ item.during }}</div>
                </div>
                <div class="right-immediate">
                  <div v-if="item.status_name === '进行中'" class="right-wrap">
                    <OButton
                      type="primary"
                      animation
                      @click="goDetail(item.id)"
                    >
                      立即前往
                      <template #suffix>
                        <OIcon><IconArrowRight /></OIcon>
                      </template>
                    </OButton>
                    <div class="number">报名人数：{{ item.user_count }}</div>
                  </div>
                  <div v-else class="right-wrap">
                    <div class="not-started">报名未开始</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="empty">
            <img :src="emptyImg" alt="" />
            <p>暂无已结束比赛</p>
          </div>
        </el-tab-pane>
        <el-tab-pane label="未开始" name="1">
          <div v-if="tableData1.length">
            <div
              v-for="item in tableData1"
              :key="item.id"
              class="competition-box"
              @click="goDetail(item.id)"
            >
              <div class="left">
                <div class="card-head">
                  <div class="card-head-title">
                    {{ item.name }}
                  </div>
                  <div
                    v-if="item.status_name === '进行中'"
                    class="card-head-state"
                    :class="state"
                  >
                    火热进行中
                  </div>
                </div>
                <!-- <div class="card-body">{{ item.description }}</div> -->
                <div class="card-body">
                  {{ item.description }}
                </div>
                <div class="card-footer">举办方：{{ item.host }}</div>
              </div>
              <div class="right1">
                <div class="right1-bonus">
                  <div class="number">奖池：￥{{ item.bonus }}</div>
                  <div class="time">赛期：{{ item.during }}</div>
                </div>
                <div class="right-immediate">
                  <div v-if="item.status_name === '进行中'" class="right-wrap">
                    <OButton
                      type="primary"
                      animation
                      @click="goDetail(item.id)"
                    >
                      立即前往
                      <template #suffix>
                        <OIcon><IconArrowRight /></OIcon>
                      </template>
                    </OButton>
                    <div class="number">报名人数：{{ item.user_count }}</div>
                  </div>
                  <div v-else class="right-wrap">
                    <div class="not-started">报名未开始</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="empty">
            <img :src="emptyImg" alt="" />
            <p>敬请期待</p>
          </div>
        </el-tab-pane>
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
.el-tab-pane {
  min-height: calc(100vh - 785px);
  .empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 116px 0;
    img {
      width: 280px;
    }
    p {
      color: #555555;
      margin-top: 24px;
      font-size: 18px;
    }
  }
}
.competition-page {
  background-color: #f5f6f8;
  .competition-head {
    background-color: #ffffff;
    padding-top: 80 + 40px;
    .el-carousel {
      img {
        width: 100%;
      }

      .is-active {
        width: 776px;
      }
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
        .competition-box {
          font-size: 14px;
          // padding: 40px 48px 24px 40px;
          background-color: #ffffff;
          margin-bottom: 24px;
          display: flex;
          justify-content: space-between;
          box-shadow: 0px 1px 5px 0px rgba(45, 47, 51, 0.1);
          &:hover {
            box-shadow: 0 6px 18px #0d8dff24;
            cursor: pointer;
          }
          .left {
            padding: 40px 0px 24px 40px;
            // background-color: red;
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
          .right1 {
            // background-color: blue;
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
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                margin-left: 48px;
                .number {
                  color: #555555;
                  margin-top: 16px;
                }
                .not-started {
                  white-space: nowrap;
                  color: #cccccc;
                  margin: 0 32px;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
