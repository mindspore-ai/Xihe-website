<script setup>
import { ref, reactive, watch } from 'vue';
import { useRouter } from 'vue-router';

import IconWarning from '~icons/app/activity-warning';
import activityBanner from '@/assets/imgs/activity/activity-banner.png';
import activityBanner2 from '@/assets/imgs/activity/activity-banner2.png';
import qrCode from '@/assets/imgs/activity/qr-code.png';
import scoreImg from '@/assets/imgs/activity/score.png';
import applicationImg from '@/assets/imgs/activity/application.png';
import introductionImg from '@/assets/imgs/activity/introduction.png';
import awardsImg from '@/assets/imgs/activity/awards.png';
import annularImg from '@/assets/imgs/activity/annular.png';
import firstPrize from '@/assets/imgs/activity/first-prize.png';
import secondPrize from '@/assets/imgs/activity/second-prize.png';
import thirdPrize from '@/assets/imgs/activity/third-prize.png';
import otherPrize from '@/assets/imgs/activity/other-prize.png';
import challengeImg from '@/assets/imgs/activity/challenge.png';
import prizeImg from '@/assets/imgs/activity/prize.png';
import shareImg from '@/assets/imgs/activity/share.png';
import experienceImg from '@/assets/imgs/activity/experience.png';
import taskImg from '@/assets/imgs/activity/task.png';
import firstImg from '@/assets/imgs/activity/first-task.png';
import secondImg from '@/assets/imgs/activity/second-task.png';
import thirdImg from '@/assets/imgs/activity/third-task.png';
import challengeBtn from '@/assets/imgs/activity/challenge-btn.png';
import ruleBtn from '@/assets/imgs/activity/rule-btn.png';
// import challengeBtn2 from '@/assets/imgs/activity/challenge-btn2.png';
// import ruleBtn2 from '@/assets/imgs/activity/rule-btn2.png';
import timeImg from '@/assets/imgs/activity/time.png';
import timelineImg from '@/assets/imgs/activity/timeline.png';
import rankImg from '@/assets/imgs/activity/rank.png';
import CompetitionApplication from '@/views/competition/CompetitionApplication.vue';

import { getActivityDetail } from '@/api/api-activity';
import { GetRankingList } from '@/api/api-activity';

import { useLoginStore, useUserInfoStore } from '@/stores';
import { goAuthorize } from '@/shared/login';

const router = useRouter();

const isShow = ref(false);
const showApplication = ref(false);
const agree = ref(false);
const applicationData = ref(null);
const showBtn = ref(false);
const activityDetail = ref('');

const isLogined = useLoginStore().isLogined;
const userInfo = useUserInfoStore();
// console.log('userInfo: ', userInfo);

// 活动介绍
const introdution = reactive([
  {
    imgUrl: challengeImg,
    title: '实时挑战',
    text: '多领域多级别应用场景挑战任务，探索AI开源趣味世界',
  },
  {
    imgUrl: prizeImg,
    title: '活动激励',
    text: '丰厚挑战赛礼品与昇思官方证书，惊喜满满',
  },
  {
    imgUrl: shareImg,
    title: '大咖分享',
    text: '各领域大咖分享前沿技术，感受前沿AI技术',
  },
  {
    imgUrl: experienceImg,
    title: '体验开源',
    text: '体验特别学习小组（SIG）运作，与志同道合的开发者共同交流',
  },
]);

// 任务列表
const taskListImg = reactive([
  {
    baseImg: firstImg,
    rule: ruleBtn,
    challenge: challengeBtn,
  },
  {
    baseImg: secondImg,
    rule: ruleBtn,
    challenge: challengeBtn,
  },
  {
    baseImg: thirdImg,
    rule: ruleBtn,
    // rule2: ruleBtn2,
    challenge: challengeBtn,
    // challenge2: challengeBtn2,
  },
]);

// 获取活动分数
function getActivity() {
  getActivityDetail().then((res) => {
    activityDetail.value = res.data;
    showBtn.value = true;
    // console.log('activityDetail.value: ', activityDetail.value.is_competitor);
  });
}
getActivity();

function handleClick(index) {
  if (!isLogined) {
    goAuthorize();
  } else {
    // 如果已报名
    if (activityDetail.value.is_competitor) {
      if (index === 0) {
        isShow.value = true;
      } else if (index === 1) {
        // 跳转到比赛列表
        let routerData = router.resolve({
          path: '/competition',
        });
        window.open(routerData.href, '_blank');
      } else {
        window.open(
          'https://www.hiascend.com/forum/thread-0226105249356182016-1-1.html',
          '_black'
        );
      }
    } else {
      showApplication.value = true;
    }
  }
}

function toggleClick() {
  isShow.value = false;
}

//隐藏报名表单
function hideForm(val) {
  showApplication.value = val;
}

// 开始答题
function handleStartAnswer() {
  router.push('/activity-1');
}
// 排行榜
const currentPage = ref(1);
const leftDisabled = ref(true);
const rightDisabled = ref(false);
function pageChange(params) {
  currentPage.value = params;
}
function prevPage() {
  currentPage.value = currentPage.value - 1;
}
function nextPage() {
  currentPage.value = currentPage.value + 1;
}
const perPageData = ref([]);
watch(
  () => currentPage.value,
  (newValue) => {
    if (newValue > rankingData.value.length / 10) {
      if (currentPage.value !== Math.ceil(rankingData.value.length / 10)) {
        currentPage.value = Math.ceil(rankingData.value.length / 10);
      }
      rightDisabled.value = true;
      leftDisabled.value = false;
      //TODO:最后一页数据
      perPageData.value = rankingData.value.slice(
        newValue * 10 - 10,
        newValue * 10
      );
    } else if (newValue > 1) {
      leftDisabled.value = false;
      rightDisabled.value = false;
      perPageData.value = rankingData.value.slice(
        newValue * 10 - 10,
        newValue * 10
      );
    } else {
      leftDisabled.value = true;
      rightDisabled.value = false;
      if (currentPage.value !== 1) currentPage.value = 1;
      perPageData.value = rankingData.value.slice(0, 10);
    }
  }
);
const rankingData = ref([]);
GetRankingList().then((res) => {
  rankingData.value = res.data;
  // rankingData.value = [1, 2, 3, 4, 5, 6];
  perPageData.value = rankingData.value.slice(0, 10);
});
watch(
  () => perPageData.value,
  (n) => {
    if (n.length < 10) {
      for (let i = 0; i < 10; i++) {
        if (!perPageData.value[i]) {
          perPageData.value[i] = { score: '--', competitor: '---' };
        }
      }
    }
  }
);
function goUser(val) {
  if (val !== '---') {
    router.push({ path: `/${val}` });
  }
}

function showDialog2() {
  if (!isLogined) {
    goAuthorize();
  } else {
    showApplication.value = true;
  }
}
function goRule() {
  window.open(
    'https://www.hiascend.com/forum/thread-0226105249356182016-1-1.html',
    '_black'
  );
}
</script>
<template>
  <div v-if="showBtn" class="activity">
    <!-- 已经报名 -->
    <div v-if="activityDetail.is_competitor" class="activity-banner">
      <!-- <img :src="activityBanner" alt="" /> -->
      <div class="user-info">
        <img :src="scoreImg" alt="" />
        <div class="info-list">
          <div class="userName">
            <img :src="userInfo.avatar" alt="" />
            <span> {{ userInfo.userName }} </span>
          </div>
          <div class="score">
            <div>{{ activityDetail.score }}</div>
            <span>我的积分</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 没有报名 -->
    <div v-else class="activity-banner2" @click="showDialog2"></div>
    <div class="wrap">
      <!-- 活动介绍 -->
      <div class="activity-intro">
        <div class="title">
          <img :src="introductionImg" alt="" />
        </div>
        <div class="tips">
          MindCon极客周是昇思MindSpore每半年举办一次的开发者狂欢盛会
        </div>
        <div class="intro-list">
          <div v-for="item in introdution" :key="item.title" class="intro-item">
            <div class="item-img">
              <img :src="item.imgUrl" alt="" />
            </div>
            <div class="challenge-title">{{ item.title }}</div>
            <div class="challenge-text">
              {{ item.text }}
            </div>
          </div>
        </div>
      </div>
      <!-- 活动奖项 -->
      <div class="activity-awards">
        <div class="title">
          <img :src="awardsImg" alt="" />
        </div>
        <div class="awards">
          <div class="annular">
            <img :src="annularImg" alt="" />
          </div>
          <div class="awards-list">
            <div class="first-award">
              <img :src="firstPrize" alt="" />
            </div>
            <div class="other-award">
              <img :src="secondPrize" alt="" />
              <img :src="thirdPrize" alt="" />
              <img :src="otherPrize" alt="" />
            </div>
          </div>
        </div>
      </div>
      <!-- 比赛任务 -->
      <div class="activity-task">
        <div class="title">
          <img :src="taskImg" alt="" />
        </div>
        <div class="task-item">
          <div
            v-for="(item, index) in taskListImg"
            :key="index"
            class="task-list"
          >
            <img :src="item.baseImg" alt="" />
            <div class="task-btn">
              <img :src="item.rule" alt="" class="rule-btn" @click="goRule" />
              <!-- <img :src="item.rule2" alt="" class="rule-btn2" /> -->
              <img
                :src="item.challenge"
                alt=""
                class="challenge-btn"
                @click="handleClick(index)"
              />
            </div>
          </div>
        </div>
      </div>
      <!-- 活动时间线 -->
      <div class="activity-time">
        <div class="title">
          <img :src="timeImg" alt="" />
        </div>
        <div class="timeline">
          <img :src="timelineImg" alt="" />
        </div>
      </div>
      <div v-if="rankingData.length" class="activity-rank">
        <div class="title">
          <img :src="rankImg" alt="" />
        </div>
        <!-- 排行榜 -->
        <div class="rank">
          <div v-if="currentPage === 1" class="rank-top">
            <div class="rank-top-three">
              <div class="second" @click="goUser(perPageData[1].competitor)">
                <p class="seniority">02</p>
                <p class="name">{{ perPageData[1].competitor }}</p>
                <p class="integral">
                  {{ perPageData[1].score }}<span>积分</span>
                </p>
                <img src="@/assets/imgs/activity/rank-top.png" alt="" />
              </div>
              <div class="first" @click="goUser(perPageData[0].competitor)">
                <p class="seniority">01</p>
                <p class="name">{{ perPageData[0].competitor }}</p>
                <p class="integral">
                  {{ perPageData[0].score }}<span>积分</span>
                </p>
                <img src="@/assets/imgs/activity/rank-top.png" alt="" />
              </div>
              <div class="third" @click="goUser(perPageData[2].competitor)">
                <p class="seniority">03</p>
                <p class="name">{{ perPageData[2].competitor }}</p>
                <p class="integral">
                  {{ perPageData[2].score }}<span>积分</span>
                </p>
                <img src="@/assets/imgs/activity/rank-top.png" alt="" />
              </div>
            </div>
            <div class="rank-top-others">
              <div
                v-for="item in 7"
                :key="item"
                class="items"
                @click="goUser(perPageData[item + 2].competitor)"
              >
                <p class="left">
                  {{ item + 3 === 10 ? 10 : '0' + (item + 3)
                  }}<span>{{ perPageData[item + 2].competitor }}</span>
                </p>
                <p class="right">
                  {{ perPageData[item + 2].score }}<span>积分</span>
                </p>
              </div>
            </div>
          </div>
          <div v-else class="rank-others">
            <div class="rank-others-box">
              <div
                v-for="item in 10"
                :key="item"
                class="items"
                @click="goUser(perPageData[item - 1].competitor)"
              >
                <p class="left">
                  {{ (currentPage - 1) * 10 + item }}
                  <span> {{ perPageData[item - 1].competitor }}</span>
                </p>
                <p class="right">
                  {{ perPageData[item - 1].score }}<span>积分</span>
                </p>
              </div>
            </div>
          </div>
          <el-pagination
            hide-on-single-page
            layout="prev,slot,next"
            :total="rankingData.length"
            :current-page="currentPage"
            @current-change="pageChange"
          >
            <div
              class="leftwards"
              :class="{ disabled: leftDisabled }"
              @click="prevPage"
            >
              上一页
            </div>
            <div
              class="rightwards"
              :class="{ disabled: rightDisabled }"
              @click="nextPage"
            >
              下一页
            </div>
          </el-pagination>
        </div>
      </div>
      <div class="explain">本活动最终解释权归昇思MindSpore开源社区所有</div>
    </div>

    <o-dialog
      class="start-challenge"
      :show="isShow"
      @close-click="toggleClick()"
      ><template #head>
        <div class="test-title">知识挑战赛</div>
        <div class="tip">
          <o-icon>
            <icon-warning></icon-warning>
          </o-icon>
          <span
            >每日有3次挑战机会，跳出本页面、未答完退出都算作1次挑战机会。</span
          >
        </div>
      </template>

      <div class="dlg-body">
        挑战10道随机人工智能领域题（含选择题和填空题），让知识卷起来！
      </div>

      <template #foot>
        <div class="dlg-foot">
          <o-button type="primary" size="small" @click="handleStartAnswer"
            >开始答题</o-button
          >
        </div>
      </template>
    </o-dialog>
    <!-- 报名弹窗 -->
    <el-dialog v-model="showApplication" destroy-on-close :show-close="false">
      <CompetitionApplication
        ref="applicationData"
        :show-application="showApplication"
        @hide-form="hideForm"
        @get-activity="getActivity"
      ></CompetitionApplication>
    </el-dialog>
  </div>
  <div class="qr-code">
    <img :src="qrCode" alt="" />
  </div>
</template>

<style lang="scss" scoped>
.activity {
  background-color: #f5f6f8;
  margin-top: 80px;
  // 已经报名banner
  .activity-banner {
    background-image: url('@/assets/imgs/activity/activity-banner.png');
    background-size: cover;
    position: relative;
    width: 100%;
    height: 480px;
    background-position: 50%;
    margin-bottom: 42px;

    img {
      width: 100%;
      height: 100%;
    }
    .user-info {
      width: 366px;
      height: 176px;
      position: absolute;
      bottom: -44px;
      left: 50%;
      transform: translateX(-50%);
      img {
        width: 100%;
        height: 100%;
      }
      .info-list {
        width: 100%;
        height: 100%;

        display: flex;
        justify-content: space-around;
        align-items: center;
        position: absolute;
        top: 0;
        left: 0;
        .userName {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          img {
            width: 64px;
            height: 64px;
            margin-bottom: 14px;
            border-radius: 50%;
          }
          span {
            font-size: 18px;
            color: #000000;
          }
        }
        .score {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          div {
            line-height: 40px;
            font-size: 28px;
            font-weight: 600;
            color: #ffb33a;
            margin-bottom: 14px;
          }
          span {
            line-height: 20px;
            font-size: 14px;
            color: #000000;
          }
        }
      }
    }
  }
  // 没有报名banner
  .activity-banner2 {
    background-image: url('@/assets/imgs/activity/activity-banner2.png');
    background-size: cover;
    position: relative;
    width: 100%;
    height: 480px;
    background-position: 50%;
    cursor: pointer;
  }
  .wrap {
    // padding: 0px 16px 136px 16px;
    max-width: 1472px;
    margin: 0 auto;
    overflow: hidden;
    .activity-intro {
      margin-top: 64px;
      .title {
        width: 210px;
        height: 70px;
        margin: 0 auto 10px;
        img {
          width: 100%;
        }
      }
      .tips {
        line-height: 24px;
        font-size: 18px;
        color: #555555;
        text-align: center;
      }
      .intro-list {
        margin-top: 40px;
        display: flex;
        justify-content: space-between;
        .intro-item {
          // width: 336px;
          width: 24%;
          height: 370px;
          // background-color: #bfa;
          background: linear-gradient(to top, #f5f6f8, #b4cbfd);
          padding: 40px 30px;
          .item-img {
            width: 160px;
            margin: 0 auto;
            img {
              width: 100%;
            }
          }
          .challenge-title {
            line-height: 33px;
            font-size: 24px;
            color: #000000;
            margin-top: 24px;
            margin-bottom: 16px;
            text-align: center;
          }
          .challenge-text {
            height: 40px;
            line-height: 20px;
            font-size: 14px;
            color: #555555;
            text-align: center;
          }
        }
      }
    }
    .activity-awards {
      margin-top: 64px;
      .title {
        width: 210px;
        height: 70px;
        margin: 0 auto;
        margin-bottom: 40px;
        img {
          width: 100%;
        }
      }
      .awards {
        padding-top: 52px;
        padding-bottom: 80px;
        position: relative;
        .annular {
          width: 100%;
          // margin-top: 52px;
          img {
            width: 100%;
          }
        }
        .awards-list {
          width: 68%;
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          .first-award {
            width: 30%;
            margin: 0 auto;
            margin-bottom: 77px;
            img {
              width: 100%;
            }
          }
          .other-award {
            display: flex;
            justify-content: space-between;
            img {
              width: 30%;
            }
          }
        }
      }
    }
    .activity-task {
      margin-top: 64px;
      .title {
        width: 210px;
        height: 70px;
        margin: 0 auto;
        margin-bottom: 40px;
        img {
          width: 100%;
        }
      }
      .task-item {
        width: 100%;
        display: flex;
        justify-content: space-between;
        .task-list {
          width: 32%;
          height: 305px;
          position: relative;
          img {
            width: 100%;
            height: 100%;
          }
          .task-btn {
            position: absolute;
            bottom: 14px;
            right: 20px;
            .rule-btn {
              width: 85px;
              height: 32px;
              margin-left: 7px;
              cursor: pointer;
              /* &:hover {
                background-color: red;
                color: red;
              } */
            }
            .challenge-btn {
              width: 85px;
              height: 32px;
              margin-left: 7px;
              cursor: pointer;
            }
          }
        }
        .second-task {
          width: 32%;
          height: 305px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .third-task {
          width: 32%;
          height: 305px;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
    .activity-time {
      margin-top: 64px;
      margin-bottom: 64px;
      .title {
        width: 210px;
        height: 70px;
        margin: 0 auto;
        margin-bottom: 40px;
        img {
          width: 100%;
        }
      }
      .timeline {
        img {
          width: 100%;
        }
      }
    }
    .activity-rank {
      // margin-top: 64px;
      .title {
        width: 174px;
        height: 70px;
        margin: 0 auto;
        margin-bottom: 40px;
        img {
          width: 100%;
        }
      }
      .rank {
        background-image: url(@/assets/imgs/activity/rank-bg.png);
        background-size: cover;
        color: #30ecff;
        height: 1019px;
        &-top {
          height: 810px;
          display: flex;
          flex-direction: column;
          align-items: center;
          &-three {
            width: 45%;
            display: flex;
            justify-content: space-around;
            p {
              text-align: center;
              span {
                color: #ffffff;
                margin-left: 10px;
                font-size: 14px;
              }
            }
            .seniority {
              font-size: 24px;
            }
            .name {
              color: #ffffff;
              margin: 16px 0 10px;
              font-size: 14px;
            }
            .integral {
              font-size: 18px;
            }
            img {
              width: 140px;
              margin-top: 15px;
            }
            .first {
              margin-top: 160px;
              cursor: pointer;
            }
            .second {
              margin-top: 185px;
              cursor: pointer;
            }
            .third {
              margin-top: 208px;
              cursor: pointer;
            }
          }
          &-others {
            width: 50%;
            margin-top: 24px;
            .items {
              display: flex;
              justify-content: space-between;
              font-size: 24px;
              padding: 16px 0;
              border-bottom: 1px dashed #005ec2;
              cursor: pointer;
              .right {
                font-size: 18px;
                height: 28px;
                line-height: 28px;
              }
              span {
                color: #fff;
                font-size: 14px;
                margin-left: 20px;
              }
            }
          }
        }
        &-others {
          height: 810px;
          display: flex;
          flex-direction: column;
          align-items: center;
          &-box {
            width: 50%;
            margin-top: 24px;
            margin-top: 200px;
          }
          .items {
            display: flex;
            justify-content: space-between;
            font-size: 24px;
            padding: 16px 0;
            border-bottom: 1px dashed #005ec2;
            cursor: pointer;
            .right {
              font-size: 18px;
              height: 28px;
              line-height: 28px;
            }
            span {
              color: #fff;
              font-size: 14px;
              margin-left: 20px;
            }
          }
        }

        .el-pagination {
          margin: 0 auto;
          margin-top: 14px;
          padding-bottom: 160px;
          width: 10%;
          color: #0d8dff;
          font-size: 14px;
          :deep(.btn-next) {
            border: 0;
            color: #0d8dff;
          }
          :deep(.btn-prev) {
            border: 0;
            color: #0d8dff;
          }
          :deep(button:disabled) {
            border: 0;
            background-color: #1b1c24 !important;
          }
          --el-pagination-button-disabled-bg-color: #135c9e;
          --el-pagination-bg-color: #1b1c24 !important;
          .leftwards {
            margin-right: 40px;
            cursor: pointer;
          }
          .rightwards {
            cursor: pointer;
          }
          .disabled {
            color: #135c9e;
          }
        }
        margin-bottom: 64px;
      }
    }
    .explain {
      height: 20px;
      line-height: 20px;
      font-size: 14px;
      color: #555555;
      margin-bottom: 64px;
      text-align: center;
    }
  }
}
.start-challenge {
  .test-title {
    text-align: center;
  }
  .tip {
    width: 100%;
    background: rgba(13, 141, 255, 0.03);
    border: 1px solid #d8d8d8;
    padding: 8px 16px;
    padding-left: 48px;
    margin-top: 24px;
    line-height: 22px;
    position: relative;
    .o-icon {
      font-size: 16px;
      position: absolute;
      left: 16px;
      top: 14px;
    }
    span {
      font-size: 14px;
      color: #555555;
      // line-height: 22px;
    }
  }

  .dlg-body {
    font-size: 14px;
    color: #555555;
    line-height: 22px;
    padding-top: 0px;
  }

  .dlg-foot {
    display: flex;
    justify-content: center;
  }
}
:deep(.el-dialog) {
  width: 900px;
  // position: fixed;
  // left: 0;
  // right: 0;
  // // top: 0;
  // bottom: 0;
  // width: 100%;
  .el-dialog__header {
    display: none;
  }
  .el-dialog__body {
    padding: 40px;
    .application {
      padding: 0px;
      .application-title {
        // background-color: red;
        border: none;
        padding-bottom: 0px;
        display: flex;
        flex-direction: column;
        .text {
          margin-bottom: 16px;
          text-align: center;
        }
        .tips {
          width: 100%;
        }
      }
      .application-form {
        display: flex;
        justify-content: flex-start;
        padding-left: 50px;
      }
    }
  }
}
.qr-code {
  width: 86px;
  height: 127px;
  position: fixed;
  z-index: 1;
  bottom: 30vh;
  right: 40px;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
