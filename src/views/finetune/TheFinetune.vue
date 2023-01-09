<script setup>
import { ref, reactive, onUnmounted, onMounted } from 'vue';
import { useRouter } from 'vue-router';

import { formatSeconds } from '@/shared/utils';

import IconStop from '~icons/app/stop';
import IconRemove from '~icons/app/remove';
import IconFinished from '~icons/app/finished';
import IconStopped from '~icons/app/stopped';
import IconRuning from '~icons/app/running';
import IconFailed from '~icons/app/failed';
import IconFile from '~icons/app/project';
import IconArrowRight from '~icons/app/arrow-right';

import step1 from '@/assets/imgs/finetune/step1.png';
import step2 from '@/assets/imgs/finetune/step2.png';
import step3 from '@/assets/imgs/finetune/step3.png';
import step4 from '@/assets/imgs/finetune/step4.png';
import arrows from '@/assets/imgs/finetune/arrows.png';

import OIcon from '@/components/OIcon.vue';
import OButton from '@/components/OButton.vue';
import DeleteTrain from '@/components/DeleteTrain.vue';
import StopTrain from '@/components/StopTrain.vue';

import { useLoginStore, useUserInfoStore } from '@/stores';
import { LOGIN_KEYS } from '@/shared/login';

import {
  getFinetune,
  deleteFinetune,
  terminateFinetune,
} from '@/api/api-finetune';

function getHeaderConfig() {
  const headersConfig = localStorage.getItem(LOGIN_KEYS.USER_TOKEN)
    ? {
        headers: {
          'private-token': localStorage.getItem(LOGIN_KEYS.USER_TOKEN),
        },
      }
    : {};
  return headersConfig;
}

const router = useRouter();

const DOMAIN = import.meta.env.VITE_DOMAIN;

const listId = ref(null);
const trainId = ref(null);
const showStep = ref(false);
const showtable = ref(false);
const showFinetune = ref(false);
const finetuneData = ref([]);
const showBtn = ref(false);
const expiry = ref(''); //体验截止时间

const isLogined = useLoginStore().isLogined;
const userInfo = useUserInfoStore();

let i18n = {
  head: {
    title: '大模型微调',
    introduce:
      '基于平台内置的自动太初跨模态预训练大模型，提供多种典型下游任务模板；极简模式、零代码开发、仅需少量配置即可快速启动训练',
  },
  table: {
    title: '任务列表',
    remainTime: '体验截止时间：',
  },
};
const applySteps = reactive([
  {
    stepImg: step1,
    stepTitle: '01  申请公测资格',
    stepArrows: arrows,
  },
  {
    stepImg: step2,
    stepTitle: '02  创建微调任务',
    stepArrows: arrows,
  },
  {
    stepImg: step3,
    stepTitle: '03  查看微调日志',
    stepArrows: arrows,
  },
  {
    stepImg: step4,
    stepTitle: '04  完成微调任务',
  },
]);

// 获取微调任务列表
let socket;
function getFinetuneList() {
  if (isLogined) {
    try {
      getFinetune()
        .then((res) => {
          showFinetune.value = true;
          showtable.value = true;
          expiry.value = res.data.expiry;
          finetuneData.value = res.data.datas;
          console.log('微调任务: ', finetuneData.value);
          if (!finetuneData.value) {
            console.log('微调列表为空');
            showBtn.value = false;
          } else {
            let bool = finetuneData.value.some((item) => {
              return item.is_done === false;
            });
            if (finetuneData.value.length < 5) {
              if (bool) {
                console.log('任务少于5个，有运行中');
                showBtn.value = true;
                socket = setWebsocket(`wss://${DOMAIN}/server/finetune/ws`);
              } else {
                console.log('任务少于5个，没有运行中任务');
                return;
              }
            } else if (finetuneData.value.length === 5) {
              showBtn.value = true;
              if (bool) {
                console.log('任务等于5个，有运行中');
                socket = setWebsocket(`wss://${DOMAIN}/server/finetune/ws`);
              } else {
                console.log('任务等于5个，没有运行中任务');
                return;
              }
            }
          }
        })
        .catch((res) => {
          if (res.code === 'finetune_no_permission') {
            showFinetune.value = true;
            showtable.value = false;
          }
        });
    } catch (error) {
      console.log(error);
    }
  } else {
    showFinetune.value = true;
    showtable.value = false;
  }
}
getFinetuneList();

function setWebsocket(url) {
  const socket = new WebSocket(url, [
    getHeaderConfig().headers['private-token'],
  ]);

  // 当websocket接收到服务端发来的消息时，自动会触发这个函数。
  socket.onmessage = function (event) {
    // console.log('微调列表页event: ', event);
    try {
      finetuneData.value = JSON.parse(event.data).data;
      console.log('ws返回的信息: ', finetuneData.value);
    } catch (e) {
      console.error(e);
    }
  };
  return socket;
}

// 切换申请步骤弹窗
function toggleApplication() {
  showtable.value = true;
  showStep.value = false;
}

function goCreateTune() {
  router.push({ path: `/finetune-creating/${userInfo.userName}` });
}

const showDel = ref(false);
function showDelClick(val) {
  listId.value = val;
  showDel.value = true;
}

// 删除微调任务
function delClick(val) {
  if (val === 2) {
    showDel.value = false;
  } else {
    deleteFinetune(val).then(() => {
      getFinetuneList();
      showDel.value = false;
      showBtn.value = false;
    });
  }
}

// 终止训练
const showStop = ref(false);
function stopTrainList(id) {
  terminateFinetune(id).then(() => {
    getTrainList();
    showStop.value = false;
  });
}

function quitClick(val) {
  if (val === 1) {
    showStop.value = false;
  } else {
    stopTrainList(trainId.value);
    showBtn.value = false;
  }
}

function showStopClick(val, id) {
  trainId.value = id;
  if (val === 'Terminated') {
    ElMessage({
      type: 'error',
      message: '该训练已停止',
    });
    return;
  } else {
    showStop.value = true;
  }
}

function goTrainLog(trainId) {
  router.push({
    name: 'finetuneLog',
    params: {
      finetuneId: trainId,
    },
  });
}

const closeSocket = () => {
  socket.close();
};

// 页面刷新
onMounted(() => {
  window.addEventListener('beforeunload', closeSocket);
});

onUnmounted(() => {
  socket && socket.close();
  window.removeEventListener('beforeunload', closeSocket);
});
</script>

<template>
  <div v-if="showFinetune" class="modelzoo-tune">
    <div class="modelzoo-head">
      <div class="wrap">
        <div class="banner-left">
          <div class="title">{{ i18n.head.title }}</div>
          <div class="introduce">
            {{ i18n.head.introduce }}
          </div>
        </div>
      </div>
    </div>
    <div v-if="showtable" class="modelzoo-body wrap">
      <div class="modelzoo-table">
        <div class="table-title">
          <div class="title">
            <span>
              {{ i18n.table.title }}
            </span>
            <span>
              <div class="list-tip">
                （&nbsp;温馨提示：最多可创建5个微调任务，且只有一个运行中。）
              </div>
            </span>
          </div>
          <div class="remain-time">
            <span>
              {{ i18n.table.remainTime }}
            </span>
            <span>{{ expiry }}</span>
          </div>
        </div>
        <el-table :data="finetuneData" style="width: 100%">
          <el-table-column label="任务名称/ID" width="180">
            <template #default="scope">
              <div>
                <span class="train-name" @click="goTrainLog(scope.row.id)">{{
                  scope.row.name
                }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="130">
            <template #default="scope">
              <div class="status-box">
                <div
                  v-if="scope.row.status === 'Completed'"
                  class="status-item"
                >
                  <o-icon><icon-finished></icon-finished></o-icon>
                  <span>已完成</span>
                </div>

                <div
                  v-if="scope.row.status === 'Terminated'"
                  class="status-item"
                >
                  <o-icon><icon-stopped></icon-stopped></o-icon>
                  <span>已停止</span>
                </div>

                <div v-if="scope.row.status === 'Pending'" class="status-item">
                  <o-icon><icon-runing></icon-runing></o-icon>
                  <span> 等待中</span>
                </div>

                <div v-if="scope.row.status === 'Creating'" class="status-item">
                  <o-icon><icon-runing></icon-runing></o-icon>
                  <span> 创建中</span>
                </div>

                <div v-if="scope.row.status === 'Running'" class="status-item">
                  <o-icon><icon-runing></icon-runing></o-icon>
                  <span>运行中</span>
                </div>

                <div
                  v-if="scope.row.status === 'scheduling'"
                  class="status-item"
                >
                  <o-icon><icon-runing></icon-runing></o-icon>
                  <span> 启动中</span>
                </div>

                <div v-if="scope.row.status === 'Failed'" class="status-item">
                  <o-icon><icon-failed></icon-failed></o-icon>
                  <span>训练失败</span>
                </div>

                <div
                  v-if="scope.row.status === 'schedule_failed'"
                  class="status-item"
                >
                  <o-icon><icon-failed></icon-failed></o-icon>
                  <span> 启动失败 </span>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="运行时长" width="148">
            <template #default="scope">
              <div>
                {{ formatSeconds(scope.row.duration) }}
              </div>
            </template>
          </el-table-column>

          <el-table-column label="任务框架" width="180">
            <!-- <template> -->
            <div>
              <span class="task-frame">mindspore</span>
            </div>
            <!-- </template> -->
          </el-table-column>
          <el-table-column label="作业类型" width="450">
            <template #default="scope">
              <DeleteTrain
                :list-id="listId"
                :show-del="showDel"
                @click="delClick"
              />

              <StopTrain
                :train-id="trainId"
                :show-stop="showStop"
                @click="quitClick"
              />
              <div class="description">
                <div class="description-content">finetune</div>
                <div class="hide-box">
                  <div class="tools-box">
                    <div
                      v-if="
                        scope.row.status === 'Pending' ||
                        scope.row.status === 'Creating' ||
                        scope.row.status === 'Running'
                      "
                      class="tools"
                      @click="showStopClick(scope.row.status, scope.row.id)"
                    >
                      <o-icon><icon-stop></icon-stop></o-icon>
                      <p>终止</p>
                    </div>
                    <div class="tools" @click="showDelClick(scope.row.id)">
                      <o-icon><icon-remove></icon-remove></o-icon>
                      <p>删除</p>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="资源占用" prop="resource" width="200">
            1*Ascend 910(32G)|ARM:24核 96GB
          </el-table-column>
          <el-table-column label="创建时间" prop="created_at" width="152">
          </el-table-column>
          <template #empty>
            <div class="instance-box">
              <o-icon> <icon-file></icon-file> </o-icon>
              <p>暂未创建微调任务</p>
            </div>
          </template>
        </el-table>
        <div class="create-btn">
          <o-button :disabled="showBtn" type="primary" @click="goCreateTune">
            创建微调任务
          </o-button>
        </div>
      </div>
    </div>
    <div v-else class="apply-page">
      <div class="apply-wrap">
        <div class="apply-title">公测流程</div>
        <div class="apply-step">
          <div
            v-for="item in applySteps"
            :key="item.stepTitle"
            class="step-item"
          >
            <div class="step-desc">
              <div class="step-img">
                <img :src="item.stepImg" alt="" />
              </div>
              <div class="step-text">{{ item.stepTitle }}</div>
            </div>
            <span v-if="item.stepImg !== step4" class="step-arrows">
              <img :src="arrows" alt="" />
            </span>
            <!-- <div v-if="item.stepImg !== step4" class="step-arrows">
              <img :src="item.stepArrows" alt="" />
            </div> -->
          </div>
        </div>
        <div class="apply-btn" @click="showStep = true">
          <OButton type="primary" animation class="home-btn">
            立即申请
            <template #suffix>
              <OIcon><IconArrowRight /></OIcon>
            </template>
          </OButton>
        </div>
        <div class="contact">
          <span> 如果您有任何疑问,可以发邮件至: </span>
          <span class="email"> contact@mindspore.cn </span>
        </div>
      </div>
    </div>
  </div>
  <o-dialog :show="showStep" :close="false">
    <template #head>
      <p class="dlg-title">申请步骤</p>
    </template>

    <div class="dlg-body">
      申请说明文字申请说明文字申请说明文字申请说明文字申请说明文字申请说明文字申请说明文字申请说明文字申请说明文字申请说明文字申请说明文字申请说明文字申请说明文字申请说明文字申请说明文字
    </div>

    <template #foot>
      <div class="dlg-btn">
        <OButton type="primary" size="small" @click="toggleApplication"
          >我知道啦</OButton
        >
      </div>
    </template>
  </o-dialog>
</template>

<style lang="scss" scoped>
$theme: #0d8dff;
.wrap {
  margin: 0 auto;
  padding: 48px 16px 120px;
  max-width: 1472px;
}
.modelzoo-tune {
  background-color: #f5f6f8;
  // height: calc(100vh - 434px);
  .modelzoo-head {
    padding-top: 80px;
    background-size: cover;
    background-image: url('@/assets/imgs/banner-head.png');
    .wrap {
      display: flex;
      justify-content: space-between;
      padding: 42px 16px;
      color: #fff;
      .title {
        padding-bottom: 8px;
        font-size: 36px;
      }
      .introduce {
        padding-right: 24px;
        font-size: 18px;
        .reference {
          color: #4dcdff;
        }
      }
      .banner-right {
        display: flex;
        align-items: center;
      }
    }
  }
  .modelzoo-body {
    min-height: calc(100vh - 434px);
    .table-title {
      display: flex;
      justify-content: space-between;
      margin-bottom: 28px;
      .title {
        line-height: 24px;
        font-size: 18px;
        color: #000000;
        display: flex;
        align-items: center;
        .list-tip {
          font-size: 14px;
          font-weight: 400;
          color: #555;
          line-height: 26px;
        }
      }
      .remain-time {
        line-height: 24px;
        font-size: 14px;
        color: #555555;
      }
    }
    .instance-box {
      width: 100%;
      background: #ffffff;
      margin-top: 95px;
      margin-bottom: 95px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      p {
        font-size: 14px;
        color: #999;
      }
      .o-icon {
        font-size: 48px;
        margin-bottom: 16px;
      }
    }
    .create-btn {
      display: flex;
      justify-content: center;
    }
  }
  .apply-page {
    min-height: calc(100vh - 434px);
    max-width: 1472px;
    margin: 0 auto;
    .apply-wrap {
      width: 90%;
      padding: 64px 16px 120px;
      margin: 0 auto;

      .apply-title {
        line-height: 48px;
        font-size: 36px;
        color: #000000;
        margin-bottom: 40px;
        text-align: center;
      }
      .apply-step {
        display: flex;
        justify-content: space-between;
        margin-bottom: 48px;
        // background-color: blue;
        // display: grid;
        // grid-template-columns: repeat(4, 25%);
        // column-gap: 7%;
        .step-item {
          // width: 25%;
          display: flex;
          align-items: center;
          // float: left;
          // justify-content: space-between;
          .step-desc {
            width: 200px;
            .step-img {
              width: 100%;
              img {
                width: 100%;
              }
            }
            .step-text {
              line-height: 24px;
              font-size: 18px;
              margin-top: 10px;
              text-align: center;
            }
          }
          .step-arrows {
            width: 18px;
            position: relative;
            top: -14px;
            margin-left: 73px;
            // margin: 0 73px;
            // @media screen and (max-width: 1280px) {
            //   margin: 0 50px;
            // }
            img {
              width: 100%;
            }
          }
        }
      }
      .apply-btn {
        display: flex;
        justify-content: center;
        margin-bottom: 24px;
      }
      .contact {
        line-height: 22px;
        font-size: 14px;
        color: #555;
        text-align: center;
        .email {
          color: #000;
        }
      }
    }
  }
}
:deep(.el-table) {
  margin-top: 16px;
  margin-bottom: 48px;
  --el-table-header-bg-color: #e5e8f0;
  --el-table-header-text-color: #555;
  .el-table__header {
    // width: 100% !important;
    height: 48px;
    background: #e5e8f0;
  }
  .el-table__row {
    height: 56px;

    .description {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .description-content {
        flex: 1;
      }
      .hide-box {
        display: none;
        width: 150px;
      }
      .tools-box {
        display: flex;
        align-items: center;
        margin-right: 29px;
        color: rgba(13, 141, 255, 1);
        .tools {
          cursor: pointer;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          margin-right: 16px;
          p {
            font-size: 12px;
            line-height: 14px;
            margin-top: 5px;
          }
        }
      }
    }
    .train-name {
      color: #555;
      cursor: pointer;
      &:hover {
        color: rgba(13, 141, 255, 1);
        border-bottom: 1px solid rgba(13, 141, 255, 1);
      }
    }
    &:hover {
      .hide-box {
        display: block;
      }
      .train-name {
        color: rgba(13, 141, 255, 1);
      }
      .date {
        cursor: pointer;
        color: rgba(13, 141, 255, 1);
        &:hover {
          color: rgba(13, 141, 255, 1);
          border-bottom: 1px solid rgba(13, 141, 255, 1);
        }
      }
    }
    .status-box {
      .status-item {
        display: flex;
        align-items: center;
        line-height: 23px;
      }

      .o-icon {
        margin-right: 8px;
      }
    }
  }
}
</style>
