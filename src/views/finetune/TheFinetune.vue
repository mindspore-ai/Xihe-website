<script setup>
import { ref, reactive, onUnmounted, onMounted } from 'vue';
import { useRouter } from 'vue-router';

import { formatSeconds } from '@/shared/utils';
import moment from 'moment';
import { ElDialog } from 'element-plus';

import IconStop from '~icons/app/stop';
import IconRemove from '~icons/app/remove';
import IconFinished from '~icons/app/finished';
import IconStopped from '~icons/app/stopped';
import IconRunning from '~icons/app/running';
import IconFailed from '~icons/app/failed';
import IconFile from '~icons/app/project';
import IconStopping from '~icons/app/stopping';
import IconWaiting from '~icons/app/waiting';
import IconCreating from '~icons/app/creating';
import IconAbnormal from '~icons/app/abnormal';
import IconArrowRight from '~icons/app/arrow-right';

import step1 from '@/assets/imgs/finetune/step1.png';
import step2 from '@/assets/imgs/finetune/step2.png';
import step3 from '@/assets/imgs/finetune/step3.png';
import step4 from '@/assets/imgs/finetune/step4.png';
import arrows from '@/assets/imgs/finetune/arrows.png';
import warningImg from '@/assets/icons/warning.png';

import OIcon from '@/components/OIcon.vue';
import OButton from '@/components/OButton.vue';
import DeleteTask from '@/components/TaskDelete.vue';
import StopTask from '@/components/TaskStop.vue';

import { useLoginStore, useFinetuneData } from '@/stores';
import { getHeaderConfig } from '@/shared/login';
import { ElMessage } from 'element-plus';

import {
  getFinetuneList,
  deleteFinetune,
  terminateFinetune,
} from '@/api/api-finetune';

const router = useRouter();
const DOMAIN = import.meta.env.VITE_DOMAIN;

const listId = ref(null);
const finetuneId = ref(null);
const showStep = ref(false);
const showTip = ref(false);
const showtable = ref(false);
const showFinetune = ref(false);
const expiry = ref(''); // 体验截止时间
const displayType = ref('finetune');
const describe = ref(''); // 已有运行中的任务或已有5个任务提示

const isLogined = useLoginStore().isLogined;
const userFinetune = useFinetuneData();

let i18n = {
  tips: '温馨提示：最多可创建5个微调任务，且只有一个运行中',
  createFinetune: '创建微调任务',
  confirm: '确认',
  describe1:
    '已有正在运行中的任务，暂不能创建新的微调任务。你可等待运行完成或终止当前任务来创建新的微调任务。',
  describe2:
    '最多只能创建5个微调任务，若需再创建，请删除之前的微调任务后再创建。',
  head: {
    title: '大模型微调',
    introduce:
      '基于大模型微调套件，内置多种预训练大模型，包含丰富的下游任务，提供便捷高效的微调/评估/推理能力',
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

function setWebsocket(url) {
  const socket = new WebSocket(url, [getHeaderConfig().headers['csrf-token']]);

  // 当websocket接收到服务端发来的消息时，自动会触发这个函数。
  socket.onmessage = function (event) {
    try {
      userFinetune.setFinetuneData(JSON.parse(event.data).data);
    } catch (e) {
      return e;
    }
  };
  return socket;
}
// 获取微调任务列表
let socket;
function getFinetune() {
  if (isLogined) {
    try {
      getFinetuneList()
        .then((res) => {
          showFinetune.value = true;
          showtable.value = true;
          expiry.value = res.data.expiry;
          userFinetune.setFinetuneData(res.data.datas);
          userFinetune.setFinetuneWhiteList(true);
          if (userFinetune.finetuneListData) {
            let bool = userFinetune.finetuneListData.some((item) => {
              return item.is_done === false;
            });
            if (bool) {
              socket = setWebsocket(`wss://${DOMAIN}/server/finetune/ws`);
            }
          }
        })
        .catch((res) => {
          if (res.code === 'finetune_no_permission') {
            userFinetune.$reset();
            showFinetune.value = true;
            showtable.value = false;
          }
        });
    } catch (error) {
      return error;
    }
  } else {
    showFinetune.value = true;
    showtable.value = false;
  }
}
getFinetune();

// 毫秒级时间戳换算成日期
function getFullTime(val) {
  const stamp = new Date(val);
  const time = moment(stamp).format('YYYY-MM-DD HH:mm:ss');
  return time;
}

// 切换申请步骤弹窗
function toggleApplication() {
  showStep.value = false;
}

// 跳转创建微调任务页面
function goCreateTune() {
  if (
    userFinetune.finetuneListData !== null &&
    userFinetune.finetuneListData.length === 5
  ) {
    describe.value = i18n.describe2;
    showTip.value = true;
  } else if (
    userFinetune.finetuneListData !== null &&
    userFinetune.finetuneListData.some(
      (item) =>
        item.status === 'scheduling' ||
        item.status === 'Pending' ||
        item.status === 'Creating' ||
        item.status === 'Running'
    )
  ) {
    describe.value = i18n.describe1;
    showTip.value = true;
  } else {
    router.push({ path: '/finetune/new' });
  }
}

const isDelDialogVisible = ref(false);
function showDelClick(val) {
  listId.value = val;
  isDelDialogVisible.value = true;
}

// 删除微调任务
function delClick(val) {
  if (val === 2) {
    isDelDialogVisible.value = false;
  } else {
    deleteFinetune(val).then(() => {
      isDelDialogVisible.value = false;
      getFinetune();
    });
  }
}

// 终止微调任务
const isStopDialogVisible = ref(false);
function showStopClick(val, id) {
  finetuneId.value = id;
  if (val === 'Terminated') {
    ElMessage({
      type: 'error',
      message: '该微调任务已停止',
    });
    return;
  } else {
    isStopDialogVisible.value = true;
  }
}
function quitClick(val) {
  if (val === 1) {
    isStopDialogVisible.value = false;
  } else {
    terminateFinetune(finetuneId.value).then(() => {
      isStopDialogVisible.value = false;
      getFinetune();
    });
  }
}

function goFinetuneLog(finetuneId) {
  router.push({
    name: 'finetuneLog',
    params: {
      finetuneId: finetuneId,
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
              <div class="list-tip">&nbsp;&nbsp;{{ i18n.tips }}</div>
            </span>
          </div>
          <div class="remain-time">
            <span>
              {{ i18n.table.remainTime }}
            </span>
            <span>{{ getFullTime(expiry * 1000) }}</span>
          </div>
        </div>
        <el-table :data="userFinetune.finetuneListData" style="width: 100%">
          <el-table-column label="任务名称/ID" width="180">
            <template #default="scope">
              <div>
                <span class="train-name" @click="goFinetuneLog(scope.row.id)">{{
                  scope.row.name
                }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="128">
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

                <div
                  v-if="scope.row.status === 'Terminating'"
                  class="status-item"
                >
                  <o-icon><icon-stopping></icon-stopping></o-icon>
                  <span>停止中</span>
                </div>

                <div v-if="scope.row.status === 'Pending'" class="status-item">
                  <o-icon><icon-waiting></icon-waiting></o-icon>
                  <span>等待中</span>
                </div>

                <div v-if="scope.row.status === 'Creating'" class="status-item">
                  <o-icon><icon-creating></icon-creating></o-icon>
                  <span>创建中</span>
                </div>

                <div
                  v-if="scope.row.status === 'scheduling'"
                  class="status-item"
                >
                  <o-icon><icon-running></icon-running></o-icon>
                  <span> 启动中</span>
                </div>

                <div v-if="scope.row.status === 'Running'" class="status-item">
                  <o-icon><icon-running></icon-running></o-icon>
                  <span>运行中</span>
                </div>

                <div
                  v-if="scope.row.status === 'schedule_failed'"
                  class="status-item"
                >
                  <o-icon><icon-failed></icon-failed></o-icon>
                  <span> 启动失败 </span>
                </div>

                <div v-if="scope.row.status === 'Failed'" class="status-item">
                  <o-icon><icon-failed></icon-failed></o-icon>
                  <span>训练失败</span>
                </div>

                <div v-if="scope.row.status === 'Abnormal'" class="status-item">
                  <o-icon><icon-abnormal></icon-abnormal></o-icon>
                  <span>异常</span>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="运行时长" width="146">
            <template #default="scope">
              <div>
                {{ formatSeconds(scope.row.duration) }}
              </div>
            </template>
          </el-table-column>

          <el-table-column label="任务框架" width="176">
            <div>
              <span class="task-frame">mindspore</span>
            </div>
          </el-table-column>
          <el-table-column label="作业类型" width="410">
            <template #default="scope">
              <DeleteTask
                :list-id="listId"
                :show-del="isDelDialogVisible"
                :display-type="displayType"
                @click="delClick"
              />

              <StopTask
                :train-id="finetuneId"
                :show-stop="isStopDialogVisible"
                :display-type="displayType"
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
                        scope.row.status === 'Running' ||
                        scope.row.status === 'Creating'
                      "
                      class="termination"
                      @click="showStopClick(scope.row.status, scope.row.id)"
                    >
                      <o-icon><icon-stop></icon-stop></o-icon>
                      <p>终止</p>
                    </div>
                    <div class="delete" @click="showDelClick(scope.row.id)">
                      <o-icon><icon-remove></icon-remove></o-icon>
                      <p>删除</p>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="计算资源" prop="resource" width="250">
            1*Ascend 910(32G)|ARM:24核 96GB
          </el-table-column>
          <el-table-column label="创建时间" prop="created_at" width="150">
          </el-table-column>
          <template #empty>
            <div class="instance-box">
              <o-icon> <icon-file></icon-file> </o-icon>
              <p>暂未创建微调任务</p>
            </div>
          </template>
        </el-table>
        <div class="create-btn">
          <o-button
            v-if="Math.round(new Date() / 1000) >= expiry"
            disabled
            type="secondary"
          >
            {{ i18n.createFinetune }}
          </o-button>
          <o-button v-else type="primary" @click="goCreateTune">
            {{ i18n.createFinetune }}
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
    <!-- 申请微调资格弹窗 -->
    <el-dialog
      v-model="showStep"
      width="640px"
      center
      align-center
      class="apply-dlg"
      :show-close="false"
    >
      <template #header="{ titleId, title }">
        <div :id="titleId" :class="title">申请步骤</div>
      </template>
      <div
        class="dlg-body"
        style="
          color: #555;
          font-size: 14px;
          line-height: 24px;
          text-align: start;
        "
      >
        <div>
          <span> 1. 点击 </span>
          <a
            href="https://obs-xihe-beijing4.obs.cn-north-4.myhuaweicloud.com/xihe-img/finetune/%E7%94%B3%E8%AF%B7%E8%A1%A8%20.xlsx"
            style="color: #0d8dff"
          >
            大模型微调公测申请表
          </a>
          <span> 获取申请表，填写必要信息。 </span>
        </div>
        <div class="send-email">
          <span> 2. 附上申请表发送申请信息至官方邮箱：</span>
          <span style="color: #0d8dff" class="email">
            public@xihe-contact.mindspore.cn
          </span>
          <span>。</span>
        </div>
        <div>3. 管理员会审核相关信息，并将审核状态发送到申请邮箱中。</div>
      </div>
      <template #footer>
        <div class="dlg-btn">
          <OButton type="primary" size="small" @click="toggleApplication">
            我知道啦
          </OButton>
        </div>
      </template>
    </el-dialog>
    <!-- 如已有正在运行中的微调任务或者微调任务已有5个，弹窗提示 -->
    <el-dialog
      v-model="showTip"
      :show-close="false"
      center
      width="640px"
      align-center
    >
      <template #header="{ titleId, titleTitle }">
        <div :id="titleId" :class="titleTitle">
          <img :src="warningImg" alt="" />
        </div>
      </template>
      <div
        class="dlg-body"
        style="
          color: #000;
          font-size: 18px;
          text-align: center;
          line-height: 30px;
        "
      >
        {{ describe }}
      </div>
      <template #footer>
        <div class="dlg-actions" style="display: flex; justify-content: center">
          <o-button type="primary" @click="showTip = false">
            {{ i18n.confirm }}
          </o-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
$theme: #0d8dff;
.wrap {
  margin: 0 auto;
  padding: 48px 16px 120px;
  max-width: 1448px;
}
.modelzoo-tune {
  background-color: #f5f6f8;
  .modelzoo-head {
    padding-top: 80px;
    background-size: cover;
    background-image: url('@/assets/imgs/banner-head.png');
    .wrap {
      display: flex;
      justify-content: space-between;
      padding: 42px 16px;
      color: #000;
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
          font-size: 12px;
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
    max-width: 1448px;
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
        .step-item {
          display: flex;
          align-items: center;
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
    height: 48px;
    background: #e5e8f0;
    .el-table__cell {
      .cell {
        padding: 0px;
      }
      &:first-child {
        padding: 0 24px;
      }
      &:last-child {
        padding: 0 24px;
      }
    }
  }
  .el-table__row {
    height: 56px;
    .el-table__cell {
      .cell {
        padding: 0px;
      }
      &:first-child {
        padding: 0 24px;
      }
      &:last-child {
        padding: 0 24px;
      }
    }
    .description {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .description-content {
        flex: 1;
      }
      .hide-box {
        display: none;
        // width: 150px;
      }
      .tools-box {
        display: flex;
        align-items: center;
        margin-right: 68px;
        color: rgba(13, 141, 255, 1);
        .termination,
        .delete {
          cursor: pointer;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;

          p {
            font-size: 12px;
            line-height: 14px;
            margin-top: 5px;
          }
        }
        .termination {
          margin-right: 20px;
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
<style lang="scss">
/* .apply-dlg {
  .el-dialog__body {
    padding: 0px 64px !important;
  }
} */
</style>
