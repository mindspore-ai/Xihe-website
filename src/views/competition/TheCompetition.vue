<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';

import OButton from '@/components/OButton.vue';

import comBanner1 from '@/assets/imgs/competition/artist-banner.jpg';
import comBanner2 from '@/assets/imgs/competition/book-banner.png';
import comBanner3 from '@/assets/imgs/competition/insect-banner.png';
// import comBanner4 from '@/assets/imgs/competition/com-banner4.png';

import emptyImg from '@/assets/imgs/live-empty.png';

import IconArrowRight from '~icons/app/arrow-right.svg';

import { getAllCompetition } from '@/api/api-competition';

const router = useRouter();

const activeName = ref('first');

const allData = ref(null);
const preparingData = ref(null);
const overData = ref(null);
const inProgressData = ref(null);

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

const handleClick = (tab) => {
  if (tab.props.name !== 'first') {
    getCompetitions1(tab.props.name);
  }
};
// 获取进行中、已结束、未开始的比赛
const perPageInprogressData = ref(null); //进行中比赛的每页数据
function getCompetitions1(tab) {
  if (tab === '1') {
    getAllCompetition({ status: 'preparing' }).then((res) => {
      if (res.status === 200) {
        preparingData.value = res.data.data;
      }
    });
  } else if (tab === '2') {
    getAllCompetition({ status: 'over' }).then((res) => {
      if (res.status === 200 && res.data.data) {
        overData.value = res.data.data.reverse();
        perPageOverData.value = overData.value.slice(0, overPager.size);
      }
    });
  } else if (tab === '3') {
    getAllCompetition({ status: 'in-progress' }).then((res) => {
      if (res.status === 200 && res.data.data) {
        inProgressData.value = res.data.data.reverse();
        perPageInprogressData.value = inProgressData.value.slice(
          0,
          inProgressPager.size
        );
      }
    });
  }
}
// 获取所有的比赛
function getCompetitions2() {
  getAllCompetition()
    .then((res) => {
      if (res.status === 200 && res.data.data) {
        allData.value = res.data.data.reverse();
        perPageAllData.value = allData.value.slice(0, allPager.size);
      }
    })
    .catch((err) => {
      console.error(err);
    });
}
getCompetitions2();
// 跳转到比赛详情页
function goDetail(competitionId) {
  let competitionList = allData.value.filter((item) => {
    return item.id === competitionId;
  });
  router.push({
    name: 'competitionDetail',
    params: { id: competitionList[0].id },
  });
}
function goCompetitionDetail(id) {
  router.push({
    name: 'competitionDetail',
    params: { id: id },
  });
}
// 分页器
const layout = ref('prev, pager, next');
const perPageAllData = ref(null); //所有比赛的每页数据
const perPageOverData = ref(null); //已结束比赛的每页数据
function handleAllPager(val) {
  allPager.page = val;
  perPageAllData.value = allData.value.slice(
    allPager.page * allPager.size - allPager.size,
    allPager.page * allPager.size
  );
  toTop();
}
function handleInprogressPager(val) {
  inProgressPager.page = val;
  perPageInprogressData.value = inProgressData.value.slice(
    inProgressPager.page * inProgressPager.size - inProgressPager.size,
    inProgressPager.page * inProgressPager.size
  );
  toTop();
}
function handleOverPager(val) {
  overPager.page = val;
  perPageOverData.value = overData.value.slice(
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
  <div class="competition-page">
    <div class="competition-head">
      <div class="wrap">
        <el-carousel :interval="4000" type="card" height="300px">
          <el-carousel-item
            ><img :src="comBanner1" alt="" @click="goDetail('ai_painter')" />
          </el-carousel-item>
          <el-carousel-item
            ><img :src="comBanner2" alt="" @click="goDetail('learn23-text')" />
          </el-carousel-item>
          <el-carousel-item
            ><img :src="comBanner3" alt="" @click="goDetail('learn23-img')" />
          </el-carousel-item>
          <!-- <el-carousel-item
            ><img
              :src="comBanner4"
              alt=""
              @click="goDetail('第四届MindCon-外卖评论文本分类')"
            />
          </el-carousel-item> -->
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
          <div v-if="allData">
            <div
              v-for="item in perPageAllData"
              :key="item.id"
              class="competition-box"
              @click="goCompetitionDetail(item.id)"
            >
              <div class="left">
                <div class="card-head">
                  <div class="card-head-title">
                    {{ item.name }}
                  </div>
                  <div
                    v-if="item.status === 'in-progress'"
                    class="card-head-state doing"
                  >
                    火热进行中
                  </div>
                  <div
                    v-else-if="item.status === 'preparing'"
                    class="card-head-state will-do"
                  >
                    未开始
                  </div>
                  <div v-else class="card-head-state done">已结束</div>
                </div>
                <!-- <div class="card-body">{{ item.description }}</div> -->
                <div class="card-body">
                  {{ item.desc }}
                </div>
                <div class="card-footer">举办方：{{ item.host }}</div>
              </div>
              <div class="right1">
                <div class="right1-bonus">
                  <div class="number">
                    奖池：{{ item.bonus ? `￥${item.bonus}` : '特别礼品' }}
                  </div>
                  <div class="time">赛期：{{ item.duration }}</div>
                </div>
                <div class="right-immediate">
                  <div v-if="item.status === 'in-progress'" class="right-wrap">
                    <OButton
                      type="primary"
                      animation
                      @click="goCompetitionDetail(item.id)"
                    >
                      立即前往
                      <template #suffix>
                        <OIcon><IconArrowRight /></OIcon>
                      </template>
                    </OButton>
                    <div class="number">报名人数：{{ item.count }}</div>
                  </div>
                  <div
                    v-else-if="item.status === 'preparing'"
                    class="right-wrap"
                  >
                    <div class="not-started">报名未开始</div>
                  </div>
                  <div v-else class="right-wrap">
                    <div class="not-started">报名已截止</div>
                  </div>
                </div>
              </div>
            </div>
            <!-- 全部比赛页的分页器 -->
            <div class="pagination">
              <el-pagination
                hide-on-single-page
                :current-page="allPager.page"
                :page-size="allPager.size"
                :total="allData.length"
                :layout="layout"
                @current-change="handleAllPager"
              ></el-pagination>
            </div>
          </div>
          <div v-else class="empty">
            <img :src="emptyImg" alt="" />
            <p>敬请期待</p>
          </div>
        </el-tab-pane>
        <el-tab-pane label="进行中" name="3">
          <div v-if="perPageInprogressData">
            <div
              v-for="item in perPageInprogressData"
              :key="item.id"
              class="competition-box"
              @click="goCompetitionDetail(item.id)"
            >
              <div class="left">
                <div class="card-head">
                  <div class="card-head-title">
                    {{ item.name }}
                  </div>
                  <div
                    v-if="item.status === 'in-progress'"
                    class="card-head-state doing"
                  >
                    火热进行中
                  </div>
                </div>
                <!-- <div class="card-body">{{ item.description }}</div> -->
                <div class="card-body">
                  {{ item.desc }}
                </div>
                <div class="card-footer">举办方：{{ item.host }}</div>
              </div>
              <div class="right1">
                <div class="right1-bonus">
                  <div class="number">
                    奖池：{{ item.bonus ? `￥${item.bonus}` : '特别礼品' }}
                  </div>
                  <div class="time">赛期：{{ item.duration }}</div>
                </div>
                <div class="right-immediate">
                  <div v-if="item.status === 'in-progress'" class="right-wrap">
                    <OButton
                      type="primary"
                      animation
                      @click="goCompetitionDetail(item.id)"
                    >
                      立即前往
                      <template #suffix>
                        <OIcon><IconArrowRight /></OIcon>
                      </template>
                    </OButton>
                    <div class="number">报名人数：{{ item.count }}</div>
                  </div>
                  <div
                    v-else-if="item.status === 'preparing'"
                    class="right-wrap"
                  >
                    <div class="not-started">报名未开始</div>
                  </div>
                  <div v-else class="right-wrap">
                    <div class="not-started">报名已截止</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="pagination">
              <el-pagination
                hide-on-single-page
                :current-page="inProgressPager.page"
                :page-size="inProgressPager.size"
                :total="inProgressData.length"
                :layout="layout"
                @current-change="handleInprogressPager"
              ></el-pagination>
            </div>
          </div>
          <div v-else class="empty">
            <img :src="emptyImg" alt="" />
            <p>敬请期待</p>
          </div>
        </el-tab-pane>
        <el-tab-pane label="已结束" name="2">
          <div v-if="perPageOverData">
            <div
              v-for="item in perPageOverData"
              :key="item.id"
              class="competition-box"
              @click="goCompetitionDetail(item.id)"
            >
              <div class="left">
                <div class="card-head">
                  <div class="card-head-title">
                    {{ item.name }}
                  </div>
                  <div
                    v-if="item.status === 'over'"
                    class="card-head-state done"
                  >
                    已结束
                  </div>
                </div>
                <div class="card-body">
                  {{ item.desc }}
                </div>
                <div class="card-footer">举办方：{{ item.host }}</div>
              </div>
              <div class="right1">
                <div class="right1-bonus">
                  <div class="number">
                    奖池：{{ item.bonus ? `￥${item.bonus}` : '特别礼品' }}
                  </div>
                  <div class="time">赛期：{{ item.duration }}</div>
                </div>
                <div class="right-immediate">
                  <div v-if="item.status === 'in-progress'" class="right-wrap">
                    <OButton
                      type="primary"
                      animation
                      @click="goCompetitionDetail(item.id)"
                    >
                      立即前往
                      <template #suffix>
                        <OIcon><IconArrowRight /></OIcon>
                      </template>
                    </OButton>
                    <div class="number">报名人数：{{ item.count }}</div>
                  </div>
                  <div
                    v-else-if="item.status === 'preparing'"
                    class="right-wrap"
                  >
                    <div class="not-started">报名未开始</div>
                  </div>
                  <div v-else class="right-wrap">
                    <div class="not-started">报名已截止</div>
                  </div>
                </div>
              </div>
            </div>
            <!-- 已结束比赛页的分页器 -->
            <div class="pagination">
              <el-pagination
                hide-on-single-page
                :current-page="overPager.page"
                :page-size="overPager.size"
                :total="overData.length"
                :layout="layout"
                @current-change="handleOverPager"
              ></el-pagination>
            </div>
          </div>
          <div v-else class="empty">
            <img :src="emptyImg" alt="" />
            <p>暂无已结束比赛</p>
          </div>
        </el-tab-pane>
        <el-tab-pane label="未开始" name="1">
          <div v-if="preparingData">
            <div
              v-for="item in preparingData"
              :key="item.id"
              class="competition-box"
              @click="goCompetitionDetail(item.id)"
            >
              <div class="left">
                <div class="card-head">
                  <div class="card-head-title">
                    {{ item.name }}
                  </div>
                  <div
                    v-if="item.status === 'preparing'"
                    class="card-head-state will-do"
                  >
                    未开始
                  </div>
                </div>
                <!-- <div class="card-body">{{ item.description }}</div> -->
                <div class="card-body">
                  {{ item.desc }}
                </div>
                <div class="card-footer">举办方：{{ item.host }}</div>
              </div>
              <div class="right1">
                <div class="right1-bonus">
                  <div class="number">
                    奖池：{{ item.bonus ? `￥${item.bonus}` : '特别礼品' }}
                  </div>
                  <div class="time">赛期：{{ item.duration }}</div>
                </div>
                <div class="right-immediate">
                  <div v-if="item.status === 'in-progress'" class="right-wrap">
                    <OButton
                      type="primary"
                      animation
                      @click="goCompetitionDetail(item.id)"
                    >
                      立即前往
                      <template #suffix>
                        <OIcon><IconArrowRight /></OIcon>
                      </template>
                    </OButton>
                    <div class="number">报名人数：{{ item.count }}</div>
                  </div>
                  <div
                    v-else-if="item.status === 'preparing'"
                    class="right-wrap"
                  >
                    <div class="not-started">报名未开始</div>
                  </div>
                  <div v-else class="right-wrap">
                    <div class="not-started">报名已截止</div>
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
  padding-bottom: 40px;
  .empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 116px 0 76px 0;
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
        box-shadow: 0px 2px 50px 0px rgba(16, 99, 0, 0.1);
        border-radius: 16px;
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
        margin: 40px 0px 0px;
        height: 100%;
        .el-tabs__item {
          &:first-child {
            color: #000000;
            font-weight: 550;
            margin-left: 12px;
            margin-right: 22px;
          }
        }
      }
      .el-tabs__content {
        margin-top: 24px;
        .competition-box {
          font-size: 14px;
          background-color: #ffffff;
          margin-bottom: 24px;
          border-radius: 16px;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          &:hover {
            box-shadow: 0px 1px 16px 0px rgba(0, 0, 0, 0.05);
            transition: all 0.2s linear;
          }
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
                border-radius: 16px;
              }
              .will-do {
                color: #ffffff;
                background-color: #6189ff;
              }
              .doing {
                color: #ffffff;
                background-color: #ff7f0d;
                min-width: 76px;
              }
              .done {
                color: #555555;
                background-color: #efefef;
                min-width: 52px;
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
                border-radius: 24px;
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
        .pagination {
          margin-top: 40px;
          display: flex;
          justify-content: center;
        }
      }
    }
  }
}
</style>
