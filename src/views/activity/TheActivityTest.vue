
<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useRouter, onBeforeRouteLeave } from 'vue-router';

import { getQuestions, getActivityDetail } from '@/api/api-activity';

import { formatSeconds } from '@/shared/utils';

import IconWarning from '~icons/app/activity-warning';
import warningImg from '@/assets/icons/warning.png';

const router = useRouter();

let timer;
const testTime = ref(6000);
const subjectIndex = ref(0);
const isFirst = ref(true);
const isShow = ref(false);
const isShow1 = ref(false);

const isAllowed = ref(false);

const routePath = ref('');
// 拉取的题库数据
// const activeQuestions = ref({});

const questionData = ref([
  {
    type: 'selection',
    question: '1111当前题目题目题目题目题目题目题目题目题目题目业的权利。',
    answer: [
      { code: 'A', text: '选项A' },
      { code: 'B', text: '选项B' },
      { code: 'C', text: '选项C' },
      { code: 'D', text: '选项D' },
    ],
    isSelected: false,
    isFinished: false,
    right: '',
  },
  {
    type: 'selection',
    question:
      '2222当前题目题目题目题目题目题目题目题目题目题目题目题目题目题目题目题目题目题目题目',
    answer: [
      { code: 'A', text: '选项A' },
      { code: 'B', text: '选项B' },
      { code: 'C', text: '选项C' },
      { code: 'D', text: '选项D' },
    ],
    isSelected: false,
    isFinished: false,
    right: '',
  },
  {
    type: 'selection',
    question:
      '3333当前题目题目题目题目题目题目题目题目题目题目题目题目题目题目题目题目题目题目题目',
    answer: [
      { code: 'A', text: '选项A' },
      { code: 'B', text: '选项B' },
      { code: 'C', text: '选项C' },
      { code: 'D', text: '选项D' },
    ],
    isSelected: false,
    isFinished: false,
    right: '',
  },
  {
    type: 'selection',
    question:
      '4444当前题目题目题目题目题目题目题目题目题目题目题目题目题目题目题目题目题目题目题目',
    answer: [
      { code: 'A', text: '选项A' },
      { code: 'B', text: '选项B' },
      { code: 'C', text: '选项C' },
      { code: 'D', text: '选项D' },
    ],
    isSelected: false,
    isFinished: false,
    right: '',
  },
  {
    type: 'selection',
    question:
      '5555当前题目题目题目题目题目题目题目题目题目题目题目题目题目题目题目题目题目题目题目',
    answer: [
      { code: 'A', text: '选项A' },
      { code: 'B', text: '选项B' },
      { code: 'C', text: '选项C' },
      { code: 'D', text: '选项D' },
    ],
    isSelected: false,
    isFinished: false,
    right: '',
  },
  {
    type: 'selection',
    question:
      '6666当前题目题目题目题目题目题目题目题目题目题目题目题目题目题目题目题目题目题目题目',
    answer: [
      { code: 'A', text: '选项A' },
      { code: 'B', text: '选项B' },
      { code: 'C', text: '选项C' },
      { code: 'D', text: '选项D' },
    ],
    isSelected: false,
    isFinished: false,
    right: '',
  },
  {
    type: 'selection',
    question:
      '7777当前题目题目题目题目题目题目题目题目题目题目题目题目题目题目题目题目题目题目题目',
    answer: [
      { code: 'A', text: '选项A' },
      { code: 'B', text: '选项B' },
      { code: 'C', text: '选项C' },
      { code: 'D', text: '选项D' },
    ],
    isSelected: false,
    isFinished: false,
    right: '',
  },
  {
    type: 'completion',
    question: '8888下列程序的执行结果是',
    code: 'int d = 1;\nfun(int p) \n{   \n\tint d = 5;\n\td += p++;\n\tpritnf(“%d “, d);\n}\nmain()\n{   \n\tint a = 3;   \n\tfun(a); \n\td += a++;\n\tprintf(“%d\n”, d);\n}\n',
    isSelected: false,
    isFinished: false,
    right: '',
  },
  {
    type: 'completion',
    question: '9.在线面横线填写正确的答案',
    code: '\n编程代码：\nclass Solution:\n    def Print(self , pRoot: TreeNode) -> List[List[int]]:\n        res = []\n        if pRoot is None:\n            #如果是空，则直接返回空数组\n            return res\n        #队列存储，进行层次遍历\n\t______请输入代码块_____\n        q = [pRoot]\n        while q:\n            #记录二叉树的某一行\n            row = [] \n            n = len(q)\n            #因先进入的是根节点，故每层节点多少，队列大小就是多少\n            for i in range(n):\n                #取出队首\n                node = q.pop(0)\n                row.append(node.val)\n                #若是左右孩子存在，则存入左右孩子作为下一个层次\n                if node.left:\n                    #加入队尾\n                    q.append(node.left)\n                if node.right:\n                    q.append(node.right)\n            res.append(row)\n        return res',
    isSelected: false,
    isFinished: false,
    right: '',
  },
  {
    type: 'completion',
    question: '10 10 10 下列程序的执行结果是',
    code: 'int d = 1;\nfun(int p) \n{   \n\tint d = 5;\n\td += p++;\n\tpritnf(“%d “, d);\n}\nmain()\n{   \n\tint a = 3;   \n\tfun(a); \n\td += a++;\n\tprintf(“%d\\n”, d);\n}\n',
    isSelected: false,
    isFinished: false,
    right: '',
  },
]);

function handleSelectClick(val, i) {
  subjectIndex.value = i;
  questionData.value.forEach((item) => {
    item.isSelected = false;
  });
  val.isSelected = true;
}

function handleAnswerChange() {
  questionData.value.forEach((item) => {
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

// 交卷
function handleSubmitPaper() {
  isShow.value = true;
  console.log(questionData.value);
}

// 确认交卷
function handleConfirmSubmit() {
  clearInterval(timer);
  isShow.value = false;
  // 交卷带结果跳转得分页面
  isAllowed.value = true;
  router.push('/activity-result');
}

// 取消交卷
function handleConcelSubmit() {
  isShow.value = false;
}

// 返回MindIcon（提交答案，跳转）
function handleBackPage() {
  isShow1.value = true;
  router.push('/activity');
}

function handleConcelBack() {
  isShow1.value = false;
}

function handleConfirmBack() {
  clearInterval(timer);
  isShow1.value = false;
  isAllowed.value = true;
  // 交卷 跳转MindCon
  router.push(routePath.value);
}

onBeforeRouteLeave((to, from, next) => {
  //离开当前的组件，触发
  routePath.value = to.path;

  if (isAllowed.value) {
    clearInterval(timer);
    next();
  } else {
    isShow1.value = true;
  }
});

// window.onbeforeunload = function () {
//   return '系统不会保存你所做的更改！';
// };

watch(
  () => questionData.value[subjectIndex.value].right.trim(),
  () => {
    questionData.value[subjectIndex.value].isFinished = questionData.value[
      subjectIndex.value
    ].right
      ? true
      : false;
  }
);

watch(
  () => subjectIndex.value,
  () => (isFirst.value = subjectIndex.value === 0 ? true : false)
);

watch(
  () => testTime.value,
  () => {
    if (testTime.value === 0) {
      clearInterval(timer);
      // 发请求交卷; 切到分数页面
    }
  }
);

onMounted(() => {
  timer = setInterval(() => {
    testTime.value--;
    console.log('考试中');
  }, 1000);

  // 处理获取到的题目数据

  getQuestions().then((res) => {
    console.log(res);
  });

  getActivityDetail().then((res) => {
    console.log(res);
  });

  // const selectionData = res.choices.forEach((item) => {
  //   item.isFinished = false;
  //   item.isSelected = false;
  //   item.right = '';
  //   item.type = 'selection';
  // });

  // const competionData = res.completions.forEach((item) => {
  //   item.isFinished = false;
  //   item.isSelected = false;
  //   item.right = '';
  //   item.type = 'completion';
  // });

  // activeQuestions.value = [...selectionData, ...competionData];
});

onUnmounted(() => {
  // 离开页面提交试卷信息，清除计时器,
  clearInterval(timer);
});
</script>
<template>
  <div class="wrap">
    <div class="test">
      <div class="test-back">
        <span class="history" @click="handleBackPage">MindCon&nbsp;></span>
        <span class="current">&nbsp;超级知识卷</span>
      </div>

      <div class="test-main">
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
                <div v-for="(item, index) in questionData" :key="item">
                  <p
                    class="item"
                    :class="[
                      index === subjectIndex ? 'active' : '',
                      item.isFinished ? 'finished' : '',
                    ]"
                    @click="handleSelectClick(item, index)"
                  >
                    <!-- {{ item.index }} -->
                    {{ index + 1 }}
                  </p>
                </div>
              </div>
              <div class="container-body-top-right">
                <div class="challenge">
                  <span>今日挑战剩余次数：</span><span class="counts">2</span>
                </div>
                <p>{{ formatSeconds(testTime) }}</p>
              </div>
            </div>

            <div class="container-body-bottom">
              <div class="subject">
                {{ questionData[subjectIndex].question }}
              </div>
              <!-- 选择题 -->
              <div
                v-if="questionData[subjectIndex].type === 'selection'"
                class="answers"
              >
                <el-radio-group
                  v-model="questionData[subjectIndex].right"
                  @change="handleAnswerChange"
                >
                  <el-radio
                    v-for="item in questionData[subjectIndex].answer"
                    :key="item"
                    :label="item.code"
                    >{{ item.text }}</el-radio
                  >
                </el-radio-group>
              </div>
              <!-- 填空题 -->
              <div v-else class="answers">
                <el-input
                  v-model="questionData[subjectIndex].code"
                  type="textarea"
                  autosize
                  readonly
                  style="height: 100%; width: 100%"
                ></el-input>

                <div class="answer-inp">
                  <span>请输入正确答案：</span>
                  <el-input
                    v-model="questionData[subjectIndex].right"
                  ></el-input>
                </div>
              </div>
            </div>

            <div
              class="button-box"
              style="display: flex; justify-content: center"
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
                @click="handleSubmitPaper"
                >交卷</o-button
              >
            </div>
          </div>
        </div>
      </div>

      <!-- 弹窗 -->
      <o-dialog class="warning-tip" :show="isShow" :close="false">
        <template #head>
          <div class="tip-icon">
            <img :src="warningImg" alt="" />
          </div>
        </template>

        <div class="tip-text">
          请先确认是否答完所有题目，如已确认请点击继续交卷
        </div>

        <template #foot>
          <div class="tip-btn">
            <o-button
              type="primary"
              style="margin-right: 16px"
              @click="handleConcelSubmit"
              >取消</o-button
            >
            <o-button @click="handleConfirmSubmit">继续交卷</o-button>
          </div>
        </template>
      </o-dialog>

      <o-dialog class="warning-tip" :show="isShow1" :close="false">
        <template #head>
          <div class="tip-icon">
            <img :src="warningImg" alt="" />
          </div>
        </template>

        <div class="tip-text">返回将结束本次答题，确认返回请点击继续按钮</div>

        <template #foot>
          <div class="tip-btn">
            <o-button
              type="primary"
              style="margin-right: 16px"
              @click="handleConcelBack"
              >取消</o-button
            >
            <o-button @click="handleConfirmBack">继续</o-button>
          </div>
        </template>
      </o-dialog>
    </div>
  </div>
</template>
  
  <style lang="scss" scoped>
:deep(.el-radio-group) {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.warning-tip {
  .tip-icon {
    text-align: center;
  }
  .tip-text {
    font-size: 18px;
    color: #555555;
    line-height: 28px;
    text-align: center;
  }
  .tip-btn {
    padding-bottom: 16px;
    display: flex;
    justify-content: center;
  }
}
.wrap {
  min-height: calc(100vh - 200px);
  background-color: #f5f6f8;
}
.test {
  margin: 0 auto;
  padding: 170px 16px 136px 16px;
  max-width: 1472px;
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
        padding: 12px 16px;
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
          }
          .answers {
            margin-top: 24px;
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
      }
    }
  }
}
</style>
  