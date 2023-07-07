<script setup>
import { ref, reactive, watch } from 'vue';
import { useRouter } from 'vue-router';

import IconWarning from '~icons/app/activity-warning';
import qrCode from '@/assets/imgs/activity/qr-code.png';
import scoreImg from '@/assets/imgs/activity/score.png';
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
import challengeBtn2 from '@/assets/imgs/activity/challenge-btn2.png';
import ruleBtn2 from '@/assets/imgs/activity/rule-btn2.png';
import timeImg from '@/assets/imgs/activity/time.png';
import timelineImg from '@/assets/imgs/activity/timeline.png';
import rankImg from '@/assets/imgs/activity/rank.png';
import CompetitionApplication from '@/views/competition/CompetitionApplication.vue';

import { getActivityDetail } from '@/api/api-activity';
import { GetRankingList } from '@/api/api-activity';

import { useLoginStore, useUserInfoStore } from '@/stores';
import { goAuthorize } from '@/shared/login';
import { ElMessage } from 'element-plus';
import { ElDialog } from 'element-plus';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const router = useRouter();

const isInProgress = ref(false);

const isShow = ref(false);
const showApplication = ref(false); // 显示报名弹窗
const showMindcon = ref('MindCon'); // 区别mindcon/比赛弹窗
const applicationData = ref(null);
const showBtn = ref(false);
const activityDetail = ref('');

const isLogined = useLoginStore().isLogined;
const userInfo = useUserInfoStore();

// 活动介绍
const introdution = reactive([
  {
    imgUrl: challengeImg,
    title: t('mindcon.NAVS[0].TITLE'),
    text: t('mindcon.NAVS[0].DESC'),
  },
  {
    imgUrl: prizeImg,
    title: t('mindcon.NAVS[1].TITLE'),
    text: t('mindcon.NAVS[1].DESC'),
  },
  {
    imgUrl: shareImg,
    title: t('mindcon.NAVS[2].TITLE'),
    text: t('mindcon.NAVS[2].DESC'),
  },
  {
    imgUrl: experienceImg,
    title: t('mindcon.NAVS[3].TITLE'),
    text: t('mindcon.NAVS[3].DESC'),
  },
]);

// 任务列表
const taskListImg = reactive([
  {
    baseImg: firstImg,
    rule: ruleBtn,
    rule2: ruleBtn2,
    challenge: challengeBtn,
    challenge2: challengeBtn2,
  },
  {
    baseImg: secondImg,
    rule: ruleBtn,
    rule2: ruleBtn2,
    challenge: challengeBtn,
    challenge2: challengeBtn2,
  },
  {
    baseImg: thirdImg,
    rule: ruleBtn,
    rule2: ruleBtn2,
    challenge: challengeBtn,
    challenge2: challengeBtn2,
  },
]);

// 获取活动分数
function getActivity() {
  getActivityDetail().then((res) => {
    activityDetail.value = res.data;
    showBtn.value = true;
  });
}
getActivity();

const isOver = ref(true);
function goChallenge(index) {
  if (isOver.value) {
    ElMessage({
      type: 'warning',
      message: t('mindcon.END_TIP'),
    });
  }

  if (!isLogined) {
    goAuthorize();
  }

  // 如果已报名
  if (activityDetail.value.is_competitor) {
    if (index === 0) {
      getActivity();

      if (activityDetail.value.ai_question.remaining_times > 0) {
        if (activityDetail.value.ai_question.in_progress) {
          isShow.value = true;
          isInProgress.value = true;
        } else {
          isShow.value = true;
        }
      } else {
        ElMessage({
          type: 'warning',
          message: t('mindcon.OVER_TIMES'),
        });
      }
    } else if (index === 1) {
      // 跳转到比赛列表
      let routerData = router.resolve({
        path: '/competition',
      });
      window.open(routerData.href, '_blank');
    } else {
      window.open(
        'https://www.hiascend.com/forum/thread-0226105249356182016-1-1.html',
        '_blank'
      );
    }
  } else {
    showApplication.value = true;
    window.open(
      'https://www.hiascend.com/forum/thread-0226105249356182016-1-1.html',
      '_blank'
    );
  }
}

// 隐藏报名表单
function hideForm(val) {
  showApplication.value = val;
}

// 开始答题
function handleStartAnswer() {
  router.push('/activity-1');
}
// 排行榜
const rankingData = ref([]);
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
    if (newValue >= rankingData.value.length / 10) {
      if (currentPage.value !== Math.ceil(rankingData.value.length / 10)) {
        currentPage.value = Math.ceil(rankingData.value.length / 10);
      }
      rightDisabled.value = true;
      leftDisabled.value = false;
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

GetRankingList().then((res) => {
  rankingData.value = res.data;
  rankingData.value.forEach((item, index) => {
    if (index === 0) {
      rankingData.value[index].number = 1;
    } else if (
      rankingData.value[index].score === rankingData.value[index - 1].score
    ) {
      rankingData.value[index].number = rankingData.value[index - 1].number;
    } else {
      rankingData.value[index].number = index + 1;
    }
    if (
      rankingData.value[index].number < 10 &&
      typeof rankingData.value[index].number !== 'string'
    ) {
      rankingData.value[index].number = '0' + rankingData.value[index].number;
    }
  });
  perPageData.value = rankingData.value.slice(0, 10);
});
watch(
  () => perPageData.value,
  (n) => {
    if (n.length < 10) {
      for (let i = 0; i < 10; i++) {
        if (!perPageData.value[i]) {
          perPageData.value[i] = {
            score: '--',
            competitor: '---',
            number: '--',
          };
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
    if (isOver.value) {
      ElMessage({
        type: 'warning',
        message: t('mindcon.END_TIP'),
      });
    } else {
      showApplication.value = true;
    }
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
            <span>{{ t('mindcon.MY_INTEGRAL') }}</span>
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
          {{ t('mindcon.INTRODUCE') }}
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
              <div class="rule-btn">
                <img :src="item.rule" alt="" />
                <img
                  :src="item.rule2"
                  alt=""
                  class="rule-img"
                  @click="goRule"
                />
              </div>
              <div class="challenge-btn">
                <img :src="item.challenge" alt="" />
                <img
                  :src="item.challenge2"
                  alt=""
                  class="challenge-img"
                  @click="goChallenge(index)"
                />
              </div>
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
                <p class="seniority">{{ perPageData[1].number }}</p>
                <p class="name">{{ perPageData[1].competitor }}</p>
                <p class="integral">
                  {{ perPageData[1].score }}<span>积分</span>
                </p>
                <img src="@/assets/imgs/activity/rank-top.png" alt="" />
              </div>
              <div class="first" @click="goUser(perPageData[0].competitor)">
                <p class="seniority">{{ perPageData[0].number }}</p>
                <p class="name">{{ perPageData[0].competitor }}</p>
                <p class="integral">
                  {{ perPageData[0].score }}<span>积分</span>
                </p>
                <img src="@/assets/imgs/activity/rank-top.png" alt="" />
              </div>
              <div class="third" @click="goUser(perPageData[2].competitor)">
                <p class="seniority">{{ perPageData[2].number }}</p>
                <p class="name">{{ perPageData[2].competitor }}</p>
                <p class="integral">
                  {{ perPageData[2].score
                  }}<span>{{ t('mindcon.INTEGRAL') }}</span>
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
                  {{ perPageData[item + 2].number
                  }}<span>{{ perPageData[item + 2].competitor }}</span>
                </p>
                <p class="right">
                  {{ perPageData[item + 2].score
                  }}<span>{{ t('mindcon.INTEGRAL') }}</span>
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
                  {{ perPageData[item - 1].number }}
                  <span> {{ perPageData[item - 1].competitor }}</span>
                </p>
                <p class="right">
                  {{ perPageData[item - 1].score
                  }}<span>{{ t('mindcon.INTEGRAL') }}</span>
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
              {{ t('mindcon.PREVIOUS') }}
            </div>
            <div
              class="rightwards"
              :class="{ disabled: rightDisabled }"
              @click="nextPage"
            >
              {{ t('mindcon.NEXT') }}
            </div>
          </el-pagination>
        </div>
      </div>
      <div class="explain">{{ t('mindcon.EXPLAIN') }}</div>
    </div>

    <div v-if="isShow" class="activity-dlg">
      <el-dialog
        v-model="isShow"
        width="640px"
        center
        :close-on-click-modal="false"
        :close-on-press-escape="false"
      >
        <template #header="{ titleId, title }">
          <div :id="titleId" :class="title">知识挑战赛</div>
        </template>
        <div class="tip">
          <o-icon>
            <icon-warning></icon-warning>
          </o-icon>
          <span
            >每日有3次挑战机会，跳出本页面、未答完退出都算作1次挑战机会。</span
          >
        </div>

        <div class="dlg-body">
          挑战10道随机人工智能领域题（含选择题和填空题），让知识卷起来！
        </div>

        <p v-if="isInProgress" class="progress_tip">
          （提示：您有其他页面正在答题中，如果继续点击开始答题将结束上次答题）
        </p>
        <template #footer>
          <div class="dlg-foot">
            <o-button type="primary" size="small" @click="handleStartAnswer"
              >开始答题</o-button
            >
          </div>
        </template>
      </el-dialog>
    </div>

    <!-- 报名弹窗 -->
    <div v-if="showApplication" class="application-dlg">
      <el-dialog
        v-model="showApplication"
        width="800px"
        :show-close="false"
        align-center
        destroy-on-close
      >
        <CompetitionApplication
          ref="applicationData"
          :show-application="showMindcon"
          @hide-form="hideForm"
          @get-activity="getActivity"
        ></CompetitionApplication>
      </el-dialog>
    </div>
  </div>
  <div class="qr-code">
    <img :src="qrCode" alt="" />
  </div>
</template>

<style lang="scss" scoped>
.activity-dlg {
  :deep(.el-dialog) {
    --el-dialog-margin-top: 32vh;
    .el-dialog__body {
      padding: 0px 40px 40px;
    }
    .el-dialog__headerbtn {
      top: 0;
    }

    .tip {
      width: 100%;
      background: rgba(13, 141, 255, 0.03);
      border: 1px solid #d8d8d8;
      padding: 8px 16px;
      padding-left: 48px;
      line-height: 22px;
      position: relative;
      .o-icon {
        font-size: 16px;
        position: absolute;
        left: 16px;
        top: 11px;
      }
      span {
        font-size: 14px;
        color: #555555;
      }
    }

    .dlg-body {
      font-size: 14px;
      color: #555555;
      line-height: 22px;
      padding-top: 0px;
      margin-top: 16px;
    }

    .progress_tip {
      margin-top: 16px;
      font-size: 14px;
      color: #555555;
      line-height: 22px;
    }

    .dlg-foot {
      display: flex;
      justify-content: center;
    }
  }
}

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
    max-width: 1448px;
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
            display: flex;
            .rule-btn {
              width: 85px;
              height: 32px;
              margin-left: 7px;
              cursor: pointer;
              &:hover > .rule-img {
                display: block;
              }
              img {
                width: 100%;
                height: 100%;
              }
              .rule-img {
                display: none;
                width: 85px;
                height: 32px;
                margin-left: 7px;
                cursor: pointer;
                position: absolute;
                top: 0;
                left: 0;
              }
            }
            .challenge-btn {
              width: 85px;
              height: 32px;
              margin-left: 7px;
              cursor: pointer;
              &:hover > .challenge-img {
                display: block;
              }
              .challenge-img {
                display: none;
                width: 85px;
                height: 32px;
                margin-left: 7px;
                cursor: pointer;
                position: absolute;
                top: 0;
                right: 0;
              }
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
        background-position: 50%;
        color: #30ecff;
        height: 1012px;
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
              .left {
                display: flex;
                align-items: center;
              }
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
            .left {
              display: flex;
              align-items: center;
            }
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

.application-dlg {
  :deep(.el-dialog) {
    .el-dialog__header {
      height: 40px;
      padding: 0;
    }
    .el-dialog__body {
      padding-bottom: 40px !important;
      .application {
        padding: 0px;
        .application-title {
          border: none;
          padding-bottom: 0px;
          display: flex;
          flex-direction: column;
          .text {
            margin-bottom: 24px;
            text-align: center;
            line-height: 32px;
          }
          .tips {
            width: 100%;
          }
        }
        .application-form {
          display: flex;
          justify-content: flex-start;
          padding-left: 50px;
          .el-form {
            .el-form-item {
              .requirement {
                span {
                  margin-left: 4px;
                }
              }
            }
          }
        }
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
