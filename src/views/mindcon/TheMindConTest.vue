<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useRouter, onBeforeRouteLeave } from 'vue-router';

import { getQuestions, submitPapers } from '@/api/api-activity';

import { formatSeconds } from '@/shared/utils';

import IconWarning from '~icons/app/activity-warning';
import warningImg from '@/assets/icons/warning.png';
import { ElDialog, ElMessage } from 'element-plus';

const router = useRouter();

let timer;
const testTime = ref(6000);
const subjectIndex = ref(0);
const isFirst = ref(true);
const isShow = ref(false);
const isShow1 = ref(false);

const routePath = ref('');
const isAllowed = ref(false);
const queryData = ref({
  answer: '',
  result: [],
  times: 0,
});

const isAnswering = ref(false);

const activityQuestions = ref([
  {
    desc: '',
    options: [],
    right: '',
    isFinished: false,
    isSelected: false,
    type: 'selection',
  },
  {
    desc: '',
    options: [],
    right: '',
    isFinished: false,
    isSelected: false,
    type: 'selection',
  },
  {
    desc: '',
    options: [],
    right: '',
    isFinished: false,
    isSelected: false,
    type: 'selection',
  },
  {
    desc: '',
    options: [],
    right: '',
    isFinished: false,
    isSelected: false,
    type: 'selection',
  },
  {
    desc: '',
    options: [],
    right: '',
    isFinished: false,
    isSelected: false,
    type: 'selection',
  },
  {
    desc: '',
    options: [],
    right: '',
    isFinished: false,
    isSelected: false,
    type: 'selection',
  },
  {
    desc: '',
    options: [],
    right: '',
    isFinished: false,
    isSelected: false,
    type: 'selection',
  },
  {
    desc: '',
    info: '',
    right: '',
    isFinished: false,
    isSelected: false,
    type: '"completion"',
  },
  {
    desc: '',
    info: '',
    right: '',
    isFinished: false,
    isSelected: false,
    type: '"completion"',
  },
  {
    desc: '',
    info: '',
    right: '',
    isFinished: false,
    isSelected: false,
    type: '"completion"',
  },
]);

function handleSelectClick(val, i) {
  subjectIndex.value = i;
  activityQuestions.value.forEach((item) => {
    item.isSelected = false;
  });
  val.isSelected = true;
}

function handleInputChange() {
  if (activityQuestions.value[subjectIndex.value].right.trim()) {
    activityQuestions.value[subjectIndex.value].isFinished = true;
  } else {
    activityQuestions.value[subjectIndex.value].isFinished = false;
  }
}

function handleAnswerChange() {
  activityQuestions.value.forEach((item) => {
    if (item.right) {
      item.isFinished = true;
    }
  });
}

function handlePreClick() {
  subjectIndex.value -= 1;
}

function handleNextClick() {
  subjectIndex.value += 1;
}

function toggleDialog(val) {
  isShow.value = val;
}

function submitPaperFn() {
  activityQuestions.value.forEach((item, index) => {
    if (index < 7) {
      if (item.right) {
        queryData.value.result.push(item.right.substring(0, 1));
      } else {
        queryData.value.result.push(item.right);
      }
    } else {
      queryData.value.result.push(item.right);
    }
  });

  return submitPapers(queryData.value).then((res) => {
    if (res.data) {
      isShow.value = false;
      isAllowed.value = true;

      clearInterval(timer);
      return res.data;
    }
  });
}

function confirmSubmitpaper() {
  isAnswering.value = false;
  submitPaperFn().then((res) => {
    router.push({
      path: '/activity-result',
      query: { times: 3 - queryData.value.times, score: res.score },
    });
  });
}

function cancelSubmit() {
  isShow.value = false;
}

function backToMindCon() {
  router.push('/activity');
}

function cancelBack() {
  isShow1.value = false;
}

function confirmBack() {
  clearInterval(timer);
  isShow1.value = false;
  isAllowed.value = true;
  // 交卷 跳转MindCon
  router.push(routePath.value);
}

async function getData() {
  try {
    const res = await getQuestions();

    timer = setInterval(() => {
      testTime.value--;
    }, 1000);

    queryData.value.answer = res.data.answer;
    queryData.value.times = res.data.times;

    res.data.choices.forEach((item, index) => {
      activityQuestions.value[index].desc = item.desc;
      activityQuestions.value[index].options = item.options;
    });

    res.data.completions.forEach((item, index) => {
      activityQuestions.value[index + 7].desc = item.desc;
      activityQuestions.value[index + 7].info = item.info;
    });

    isAnswering.value = true;
  } catch (e) {
    if (e.msg === 'it is in-progress') {
      ElMessage({
        type: 'warning',
        message: '您有其他页面正在答题中，请稍后重试',
      });
    } else {
      ElMessage({
        type: 'warning',
        message: '挑战次数已用完，请明日再来',
      });
    }

    isShow1.value = false;
    isAllowed.value = true;

    setTimeout(() => {
      router.push('/activity');
    }, 1500);
  }
}
getData();

// 离开当前的组件，触发
onBeforeRouteLeave((to, from, next) => {
  routePath.value = to.path;

  if (isAllowed.value) {
    clearInterval(timer);
    next();
  } else {
    isShow1.value = true;
  }
});

watch(
  () => subjectIndex.value,
  () => {
    isFirst.value = subjectIndex.value === 0 ? true : false;
  }
);

watch(
  () => testTime.value,
  () => {
    if (testTime.value === 0) {
      submitPaperFn().then((res) => {
        isAnswering.value = false;
        isAllowed.value = true;
        router.push({
          path: '/activity-result',
          query: { times: 3 - queryData.value.times, score: res.score },
        });
      });
    }
  }
);

function beforeunloadHandler() {
  if (isAnswering.value) {
    isAnswering.value = false;
    submitPaperFn();
  }
}

onMounted(() => {
  // 刷新提交
  window.addEventListener('beforeunload', beforeunloadHandler);
  window.addEventListener('pagehide', beforeunloadHandler);
});

onUnmounted(() => {
  window.removeEventListener('beforeunload', beforeunloadHandler);
  window.removeEventListener('pagehide', beforeunloadHandler);
  // 离开页面提交试卷
  if (isAnswering.value) {
    isAnswering.value = false;
    submitPaperFn();
  }
});
</script>
<template>
  <div class="wrap">
    <div class="mindcon">
      <div class="mindcon-back">
        <span class="history" @click="backToMindCon">MindCon&nbsp;></span>
        <span class="current">&nbsp;超级知识卷</span>
      </div>

      <div id="height" class="mindcon-main">
        <div class="container">
          <div class="container-title">知识挑战赛</div>

          <div class="tip">
            <o-icon>
              <icon-warning></icon-warning>
            </o-icon>
            <span
              >每日有3次挑战机会，跳出本页面、未答完退出都算作1次挑战机会。</span
            >
          </div>

          <div class="container-body">
            <div class="container-body-top">
              <div class="container-body-top-left">
                <p class="title">题目序号：</p>
                <div v-for="(item, index) in activityQuestions" :key="item">
                  <p
                    class="item"
                    :class="[
                      index === subjectIndex ? 'active' : '',
                      item.isFinished ? 'finished' : '',
                    ]"
                    @click="handleSelectClick(item, index)"
                  >
                    {{ index + 1 }}
                  </p>
                </div>
              </div>
              <div class="container-body-top-right">
                <div class="challenge">
                  <span>今日挑战剩余次数：</span
                  ><span class="counts">{{ 3 - queryData.times }}</span>
                </div>
                <p>{{ formatSeconds(testTime) }}</p>
              </div>
            </div>

            <div class="container-body-bottom">
              <div class="subject">
                {{ activityQuestions[subjectIndex].desc }}
              </div>

              <div
                v-if="activityQuestions[subjectIndex].type === 'selection'"
                class="answers"
              >
                <el-radio-group
                  v-model="activityQuestions[subjectIndex].right"
                  @change="handleAnswerChange"
                >
                  <el-radio
                    v-for="item in activityQuestions[subjectIndex].options"
                    :key="item"
                    :label="item"
                    >{{ item }}</el-radio
                  >
                </el-radio-group>
              </div>

              <div v-else class="answers">
                <div class="answers-box">
                  <div class="mask"></div>
                  <el-input
                    v-model="activityQuestions[subjectIndex].info"
                    type="textarea"
                    autosize
                    readonly
                    style="height: 100%; width: 100%"
                  ></el-input>
                </div>

                <div class="answer-inp">
                  <span>请输入正确答案：</span>
                  <el-input
                    v-model="activityQuestions[subjectIndex].right"
                    @input="handleInputChange"
                  ></el-input>
                </div>
              </div>
            </div>

            <div
              class="button-box"
              :style="{ 'margin-top': subjectIndex > 6 ? '40px' : '124px' }"
            >
              <o-button
                :disabled="isFirst"
                size="small"
                style="margin-right: 16px"
                @click="handlePreClick"
                >上一题</o-button
              >
              <o-button
                v-if="subjectIndex !== 9"
                type="primary"
                size="small"
                @click="handleNextClick"
                >下一题</o-button
              >
              <o-button
                v-else
                type="primary"
                size="small"
                @click="toggleDialog(true)"
                >交卷</o-button
              >
            </div>
          </div>
        </div>
      </div>

      <!-- 交卷弹窗 -->
      <el-dialog
        v-model="isShow"
        width="640px"
        :show-close="false"
        center
        align-center
      >
        <template #header="{ titleId, title }">
          <div :id="titleId" :class="title">
            <img :src="warningImg" alt="" />
          </div>
        </template>
        <div
          class="tip-text"
          style="
            color: #555;
            font-size: 18px;
            text-align: center;
            line-height: 28px;
          "
        >
          请先确认是否答完所有题目，如已确认请点击继续交卷
        </div>
        <template #footer>
          <div class="tip-btn">
            <o-button
              type="primary"
              style="margin-right: 16px"
              @click="cancelSubmit"
              >取消</o-button
            >
            <o-button @click="confirmSubmitpaper">继续交卷</o-button>
          </div>
        </template>
      </el-dialog>
      <!-- 离开弹窗 -->
      <el-dialog
        v-model="isShow1"
        width="640px"
        :show-close="false"
        center
        align-center
      >
        <template #header="{ titleId, title }">
          <div :id="titleId" :class="title">
            <img :src="warningImg" alt="" />
          </div>
        </template>
        <div
          class="tip-text"
          style="
            color: #555;
            font-size: 18px;
            text-align: center;
            line-height: 28px;
          "
        >
          返回将结束本次答题，确认返回请点击继续按钮
        </div>
        <template #footer>
          <div class="tip-btn">
            <o-button
              type="primary"
              style="margin-right: 16px"
              @click="cancelBack"
              >取消</o-button
            >
            <o-button @click="confirmBack">继续</o-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </div>
</template>
<style lang="scss" scoped>
:deep(.el-radio-group) {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  .el-radio {
    height: 38px;
  }
}
.wrap {
  min-height: calc(100vh - 200px);
  background-color: #f5f6f8;
}
.mindcon {
  margin: 0 auto;
  padding: 120px 16px 64px 16px;
  max-width: 1448px;
  &-back {
    font-size: 12px;
    color: #555555;
    line-height: 18px;
    .history {
      cursor: pointer;
    }
    .current {
      font-weight: bold;
    }
  }

  &-main {
    background-color: #fff;
    display: flex;
    justify-content: center;
    margin-top: 40px;
    .grade {
      padding: 86px 0 48px 0 !important;
      width: 100% !important;
      position: relative;
      overflow: hidden;
      &-background {
        position: absolute;
        left: 0;
        top: 0;
        height: 353px;
        width: 100%;
      }
      .congratuation {
        font-size: 36px;
        line-height: 48px;
        color: #000000;
        text-align: center;
        z-index: 2;
      }
      .middle {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 100px;
        img {
          width: 64px;
          height: 119px;
          border-radius: 50%;
        }
        p {
          width: 140px;
          height: 93px;
          color: #0d8dff;
          line-height: 93px;
          font-size: 24px;
          margin: 0 21px;
          span {
            font-size: 100px;
          }
        }
      }
      .btn-box {
        display: flex;
        justify-content: center;
        margin-top: 152px;
      }
      .challenge-counts {
        margin-top: 16px;
        font-size: 14px;
        color: #555555;
        line-height: 22px;
        text-align: center;
        span {
          color: #0d8dff;
        }
      }
    }
    .container {
      width: 817px;
      padding: 40px 0;
      display: flex;
      flex-direction: column;
      &-title {
        text-align: center;
        font-size: 24px;
        color: #000000;
        line-height: 32px;
      }

      .tip {
        width: 100%;
        background: rgba(13, 141, 255, 0.03);
        border: 1px solid #d8d8d8;
        height: 40px;
        padding-left: 40px;
        margin-top: 24px;
        position: relative;
        .o-icon {
          font-size: 16px;
          line-height: 22px;
          position: absolute;
          left: 14px;
          top: 12px;
        }
        span {
          font-size: 14px;
          color: #555555;
          line-height: 40px;
        }
      }

      &-body {
        &-top {
          display: flex;
          justify-content: space-between;
          margin-top: 40px;
          &-left {
            display: flex;
            align-items: center;
            .title {
              margin-right: 4px;
              font-size: 14px;
              color: #555555;
            }
            .item {
              width: 24px;
              font-size: 12px;
              color: #b2b2b2;
              height: 24px;
              line-height: 24px;
              border: 1px solid #b2b2b2;
              text-align: center;
              margin-right: 8px;
              cursor: pointer;
            }
            .active {
              background: rgba(13, 141, 255, 0.1);
              border: 1px solid #0d8dff;
              color: #0d8dff;
            }
            .finished {
              color: #0d8dff;
              border: 1px solid #0d8dff;
            }
          }
          &-right {
            display: flex;
            align-items: center;
            font-size: 14px;
            color: #555555;
            line-height: 22px;
            .challenge {
              margin-right: 32px;
              .counts {
                color: #0d8dff;
              }
            }
          }
        }

        &-bottom {
          margin-top: 40px;
          .subject {
            font-size: 14px;
            color: #555555;
            line-height: 22px;
            user-select: none;
          }
          .answers {
            margin-top: 24px;
            &-box {
              width: 100%;
              height: 100%;
              position: relative;
              .mask {
                width: 100%;
                height: 100%;
                position: absolute;
                left: 0;
                top: 0;
                background-color: rgba(0, 0, 0, 0);
                z-index: 8;
              }
            }

            .el-textarea {
              width: 100% !important;
            }
          }
        }
      }

      .answer-inp {
        margin-top: 24px;
        span {
          font-size: 14px;
          color: #555555;
          line-height: 22px;
        }
      }

      .button-box {
        margin-top: 124px;
        display: flex;
        justify-content: center;
      }
    }
  }
}
</style>
