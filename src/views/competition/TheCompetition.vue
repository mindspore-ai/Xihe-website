<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';

import comBanner1 from '@/assets/imgs/competition/artist-banner.jpg';
import comBanner2 from '@/assets/imgs/competition/book-banner.png';
import comBanner3 from '@/assets/imgs/competition/insect-banner.png';
import emptyImg from '@/assets/imgs/live-empty.png';

import OButton from '@/components/OButton.vue';
import IconArrowRight from '~icons/app/arrow-right.svg';
import IconSelected from '~icons/app/selected';

import { getCompetitionList } from '@/api/api-competition';

const router = useRouter();
const allCompetition = ref([]); // 当前所有比赛
const currentCompetition = ref([]); // 当前页显示的比赛
const competitionName = ref('allClassify');
const activeName = ref('allStatus');
const competitionPager = reactive({
  page: 1,
  size: 5,
});

// 获取所有的比赛
async function getAllCompetition() {
  try {
    const res = await getCompetitionList();
    if (res.data) {
      allCompetition.value = res.data.reverse();
      currentCompetition.value = res.data.slice(0, competitionPager.size);
    }
  } catch (err) {
    console.error(err);
  }
}
getAllCompetition();

// 获得进行中，即将开始，已结束的比赛(刷选竞赛分类和比赛状态)
const params = {};
async function handleClick(query, tab) {
  if (query === 'type') {
    if (tab.props.name === 'allClassify') {
      params.tag = undefined;
    } else {
      params.tag = tab.props.name;
    }
  } else {
    if (tab.props.name === 'allStatus') {
      params.status = undefined;
    } else {
      params.status = tab.props.name;
    }
  }
  const res = await getCompetitionList(params);
  if (res.data) {
    allCompetition.value = res.data.reverse();
    currentCompetition.value = res.data.slice(0, competitionPager.size);
  } else {
    currentCompetition.value = [];
  }
  competitionPager.page = 1;
}

// 奖池超过百万，以单位万结尾显示
function formatBonus(bonus) {
  if (bonus >= 1000000) {
    return `${(bonus / 10000).toFixed(0)}+万`;
  } else {
    return `${bonus}`;
  }
}

// 跳转到比赛详情页
function goDetail(competitionId) {
  let competitionList = allCompetition.value.filter((item) => {
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
// 比赛分页器
function handleCurrentPage(val) {
  competitionPager.page = val;
  currentCompetition.value = allCompetition.value.slice(
    competitionPager.page * competitionPager.size - competitionPager.size,
    competitionPager.page * competitionPager.size
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
        v-model="competitionName"
        type="card"
        class="category-tabs demo-tabs"
        @tab-click="handleClick('type', $event)"
      >
        <el-tab-pane label="竞赛分类" name="classify" disabled> </el-tab-pane>
        <el-tab-pane label="全部" name="allClassify">
          <template #label>
            <div class="category-tabs-label">
              <span>全部</span>
              <o-icon>
                <icon-selected></icon-selected>
              </o-icon>
            </div>
          </template>
        </el-tab-pane>
        <el-tab-pane label="AI挑战赛" name="challenge">
          <template #label>
            <div class="category-tabs-label">
              <span>AI挑战赛</span>
              <o-icon>
                <icon-selected></icon-selected>
              </o-icon>
            </div>
          </template>
        </el-tab-pane>
        <el-tab-pane label="AI学习赛" name="learn">
          <template #label>
            <div class="category-tabs-label">
              <span>AI学习赛</span>
              <o-icon>
                <icon-selected></icon-selected>
              </o-icon>
            </div>
          </template>
        </el-tab-pane>
        <el-tab-pane label="电力" name="electricity">
          <template #label>
            <div class="category-tabs-label">
              <span>电力</span>
              <o-icon>
                <icon-selected></icon-selected>
              </o-icon>
            </div>
          </template>
        </el-tab-pane>
      </el-tabs>
      <el-divider />
      <el-tabs
        v-model="activeName"
        type="card"
        class="demo-tabs"
        @tab-click="handleClick('status', $event)"
      >
        <el-tab-pane label="竞赛状态" name="status" disabled></el-tab-pane>
        <el-tab-pane label="全部" name="allStatus"> </el-tab-pane>
        <el-tab-pane label="进行中" name="in-progress"> </el-tab-pane>
        <el-tab-pane label="即将开始" name="preparing"> </el-tab-pane>
        <el-tab-pane label="已结束" name="over"> </el-tab-pane>
      </el-tabs>
      <div v-if="currentCompetition.length" class="competition-box">
        <div
          v-for="item in currentCompetition"
          :key="item.id"
          class="competition-card"
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
            <div class="card-body">
              {{ item.desc }}
            </div>
            <div class="card-footer">举办方：{{ item.host }}</div>
          </div>
          <div class="right1">
            <div class="right1-bonus">
              <div class="number">
                奖池：{{
                  item.bonus ? `￥${formatBonus(item.bonus)}` : '特别礼品'
                }}
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
              <div v-else-if="item.status === 'preparing'" class="right-wrap">
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
            :current-page="competitionPager.page"
            :page-size="competitionPager.size"
            :total="allCompetition.length"
            :layout="layout"
            @current-change="handleCurrentPage"
          ></el-pagination>
        </div>
      </div>
      <div
        v-if="activeName === 'allStatus' && !currentCompetition.length"
        class="empty"
      >
        <img :src="emptyImg" alt="" />
        <p>暂无相关比赛</p>
      </div>
      <div
        v-if="activeName === 'over' && !currentCompetition.length"
        class="empty"
      >
        <img :src="emptyImg" alt="" />
        <p>暂无已结束比赛</p>
      </div>
      <div
        v-if="activeName === 'preparing' && !currentCompetition.length"
        class="empty"
      >
        <img :src="emptyImg" alt="" />
        <p>敬请期待</p>
      </div>
      <div
        v-if="activeName === 'in-progress' && !currentCompetition.length"
        class="empty"
      >
        <img :src="emptyImg" alt="" />
        <p>暂无进行中比赛</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.wrap {
  margin: 0 auto;
  padding: 40px 16px 64px;
  max-width: 1448px;
}
.competition-page {
  background-color: #f5f6f8;
  .competition-head {
    background-color: #ffffff;
    padding-top: 80 + 40px;
    .el-carousel {
      img {
        width: 100%;
        height: 100%;
        box-shadow: 0px 2px 50px 0px rgba(16, 99, 0, 0.1);
        border-radius: 16px;
      }
      .is-active {
        width: 776px;
      }
    }
  }
  .competition-body {
    display: flex;
    flex-direction: column;
    :deep(.el-tabs) {
      .el-tabs__header {
        border: none;
        height: inherit;
        margin: 0px;
        border-radius: 0 0 16px 16px;
        .el-tabs__nav-scroll {
          .el-tabs__nav {
            .el-tabs__item {
              border: 1px solid transparent;
              &:first-child {
                color: #000000;
                font-weight: 550;
                margin-left: 12px;
              }
            }
            .is-active {
              border: 1px solid #0d8dff;
              .o-icon {
                display: block;
              }
            }
          }
        }
      }
    }
    :deep(.category-tabs) {
      .el-tabs__header {
        border-radius: 16px 16px 0 0;
        .el-tabs__item {
          position: relative;
          .category-tabs-label {
            .o-icon {
              position: absolute;
              bottom: 0;
              right: 0px;
              display: none;
            }
          }
        }
      }
    }
    .el-divider {
      width: 96.5%;
      margin: 0 auto;
      color: #e5e5e5;
    }
    .competition-box {
      margin-top: 40px;
      .competition-card {
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
              // max-width: 700px;
              font-size: 24px;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 1;
              -webkit-box-orient: vertical;
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
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
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
            margin: 40px 48px 24px;
            display: flex;
            flex-direction: column;
            justify-content: center;
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
    .empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 80px 0 56px;
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
}
</style>
