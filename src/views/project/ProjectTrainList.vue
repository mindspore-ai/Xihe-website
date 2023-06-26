<script setup>
import { ref, computed, onUnmounted, onMounted } from 'vue';

import { useRouter, useRoute } from 'vue-router';
import { useFileData, useUserInfoStore } from '@/stores';
import { LOGIN_KEYS } from '@/shared/login';
import { formatSeconds } from '@/shared/utils';

import OButton from '@/components/OButton.vue';
import OIcon from '@/components/OIcon.vue';

import IconRebuild from '~icons/app/rebuild';
import IconStop from '~icons/app/stop';
import IconRemove from '~icons/app/remove';
import IconFinished from '~icons/app/finished';
import IconStopped from '~icons/app/stopped';
import IconRunning from '~icons/app/running';
import IconFailed from '~icons/app/failed';
import IconWaiting from '~icons/app/waiting';
import IconStopping from '~icons/app/stopping';
import IconCreating from '~icons/app/creating';
import IconAbnormal from '~icons/app/abnormal';

import IconInstance from '~icons/app/train-instance';

import warningImg from '@/assets/icons/warning.png';

import { ElMessage } from 'element-plus';
import { ElDialog } from 'element-plus';

import {
  trainList,
  deleteTainList,
  stopTrain,
  rebuildTrain,
} from '@/api/api-project';

const DOMAIN = import.meta.env.VITE_DOMAIN;

// 当前项目的详情数据

const route = useRoute();
const router = useRouter();
const userInfoStore = useUserInfoStore();

const trainData = ref([]);
const trainId = ref('');
const tips = ref(false);
const btnShow = ref(false);
const description = ref('');
let socket;

const i18n = {
  description1:
    '已有正在训练中的实例，暂不能创建新的训练实例。你可等待训练完成或终止当前训练来创建新的训练实例。',
  description2:
    '一个用户一个仓库最多只能创建5个训练实例，若需再创建，请删除之前的训练实例后再创建。',
  rebuildDesc:
    '确认是否重建此训练实例，此操作会在原来的配置基础上再创建一份训练实例。',
  deleteDesc: '确认是否将此训练实例删除，注意此操作不可逆',
  terminateDesc: '确认是否将此训练实例终止，终止后将无法复原。',
  confirm: '确定',
  cancel: '取消',
};

const detailData = computed(() => {
  return useFileData().fileStoreData;
});
const projectId = detailData.value.id;

const isAuthentic = computed(() => {
  return route.params.user === userInfoStore.userName;
});

function getHeaderConfig() {
  const headersConfig = localStorage.getItem(LOGIN_KEYS.USER_TOKEN)
    ? {
        headers: {
          'csrf-token': localStorage.getItem(LOGIN_KEYS.USER_TOKEN),
        },
      }
    : {};
  return headersConfig;
}

// 进入页面判断是否是自己的项目，不是则返回首页
function goHome() {
  if (!isAuthentic.value) {
    router.push('/');
  }
}
goHome();

// 跳转到选择文件创建训练实例页
function goSelectFile() {
  let routerData = router.resolve({
    path: `/projects/${detailData.value.owner}/${detailData.value.name}/createfile`,
  });
  window.open(routerData.href, '_blank');
}

function setWebsocket(url) {
  const socket = new WebSocket(url, [getHeaderConfig().headers['csrf-token']]);

  // 当websocket接收到服务端发来的消息时，自动会触发这个函数。
  socket.onmessage = function (event) {
    try {
      trainData.value = JSON.parse(event.data).data;
      if (trainData.value) {
        let bool = trainData.value.some(
          (item) => item.status === 'scheduling' || item.status === 'Running'
        );

        if (bool || trainData.value.length >= 5) {
          btnShow.value = true;
        } else {
          btnShow.value = false;
        }

        if (trainData.value[trainData.value.length - 1].error) {
          btnShow.value = false;
          ElMessage({
            type: 'error',
            message: trainData.value[trainData.value.length - 1].error,
          });
        }
      }
    } catch (e) {
      return e;
    }
  };
  return socket;
}

function getTrainList() {
  try {
    trainList(projectId).then((res) => {
      trainData.value = res.data.data;
      // 列表为空可以创建实例
      if (!trainData.value) {
        btnShow.value = false;
      } else {
        let bool = trainData.value.some(
          (item) => item.status === 'scheduling' || item.status === 'Running'
        );

        if (trainData.value.length < 5 && !bool) {
          btnShow.value = false;
        } else if (bool) {
          btnShow.value = true;
          socket = setWebsocket(
            `wss://${DOMAIN}/server/train/project/${projectId}/training/ws`
          );
        } else if (trainData.value.length >= 5 && !bool) {
          btnShow.value = true;
        }
      }
    });
  } catch (e) {
    return e;
  }
}
getTrainList();

// 删除训练
const showDel = ref(false);
function showDelClick(val) {
  trainId.value = val;
  showDel.value = true;
}
function delClick() {
  deleteTainList(projectId, trainId.value).then((res) => {
    if (res.status === 204) {
      getTrainList();
      showDel.value = false;
    }
  });
}

// 终止训练
const showStop = ref(false);
function quitClick() {
  stopTrain(projectId, trainId.value).then((res) => {
    if (res.status === 202) {
      getTrainList();
      showStop.value = false;
    }
  });
}
function showStopClick(val, id) {
  trainId.value = id;
  if (val === 'Terminated') {
    ElMessage({
      type: 'error',
      message: '该训练已停止',
      offset: 64,
    });
    return;
  } else {
    showStop.value = true;
  }
}

// 重建训练
const showReset = ref(false);
function showResetClick(val) {
  let bool = trainData.value.some(
    (item) =>
      item.status === 'scheduling' ||
      item.status === 'Running' ||
      item.status === 'Pending' ||
      item.status === 'Running' ||
      item.status === 'Creating'
  );
  if (bool) {
    ElMessage({
      type: 'warning',
      message: '只能有一个运行中的训练',
      offset: 64,
    });
  } else if (trainData.value.length >= 5) {
    ElMessage({
      type: 'warning',
      message: '最多可创建5条训练',
      offset: 64,
    });
  } else {
    trainId.value = val;
    showReset.value = true;
  }
}
function resetClick() {
  rebuildTrain(projectId, trainId.value).then((res) => {
    if (res.status === 201) {
      showReset.value = false;
      getTrainList();
    }
  });
}

function goTrainLog(trainId) {
  router.push({
    name: 'projectTrainLog',
    params: {
      trainId: trainId,
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
  <div class="train-list">
    <div class="list-top">
      <div class="table-title">
        <p class="title">训练列表</p>
        <div class="list-tip">
          （&nbsp;温馨提示：最多可创建5条训练，且只有一个运行中。）
        </div>
      </div>

      <o-button type="primary" :disabled="btnShow" @click="goSelectFile">
        <span>创建训练实例</span>
      </o-button>
    </div>
    <el-table
      v-if="trainData && trainData.length"
      :data="trainData"
      style="width: 100%"
    >
      <el-table-column label="训练名称/ID" width="220">
        <template #default="scope">
          <div>
            <span class="train-name" @click="goTrainLog(scope.row.id)">{{
              scope.row.name
            }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="178">
        <template #default="scope">
          <div class="status-box">
            <div v-if="scope.row.status === 'Completed'" class="status-item">
              <o-icon><icon-finished></icon-finished></o-icon>
              <span>已完成</span>
            </div>

            <div v-if="scope.row.status === 'Terminated'" class="status-item">
              <o-icon><icon-stopped></icon-stopped></o-icon>
              <span>已停止</span>
            </div>

            <div v-if="scope.row.status === 'Terminating'" class="status-item">
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

            <div v-if="scope.row.status === 'scheduling'" class="status-item">
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

      <el-table-column label="运行时长" width="178">
        <template #default="scope">
          <div>
            {{ formatSeconds(scope.row.duration) }}
          </div>
        </template>
      </el-table-column>

      <el-table-column label="描述" width="617">
        <template #default="scope">
          <div class="description">
            <div class="description-content">
              {{ scope.row.desc }}
            </div>
            <div class="hide-box">
              <div class="tools-box">
                <div
                  v-if="scope.row.status === 'Running'"
                  class="tools"
                  @click="showStopClick(scope.row.status, scope.row.id)"
                >
                  <o-icon><icon-stop></icon-stop></o-icon>
                  <p>终止</p>
                </div>
                <div class="tools" @click="showResetClick(scope.row.id)">
                  <o-icon><icon-rebuild></icon-rebuild></o-icon>
                  <p>重建</p>
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

      <el-table-column label="更新时间" prop="created_at" width="214">
      </el-table-column>
    </el-table>
    <div v-else class="instance-box">
      <o-icon><icon-instance></icon-instance></o-icon>
      <p>暂无训练实例</p>
    </div>

    <!-- 如已有正在训练中的实例，弹窗提示 -->
    <el-dialog
      v-model="tips"
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
        class="dlg-body"
        style="
          color: #555;
          font-size: 18px;
          text-align: center;
          line-height: 28px;
        "
      >
        {{ description }}
      </div>
      <template #footer>
        <div class="dlg-actions" style="display: flex; justify-content: center">
          <o-button type="primary" @click="tips = false">
            {{ i18n.confirm }}
          </o-button>
        </div>
      </template>
    </el-dialog>

    <!-- 重建训练任务弹窗 -->
    <el-dialog
      v-model="showReset"
      width="640px"
      center
      align-center
      class="apply-dlg"
      :show-close="false"
      append-to-body
    >
      <template #header="{ titleId, title }">
        <div :id="titleId" :class="title">
          <img :src="warningImg" alt="" />
        </div>
      </template>
      <div
        class="dlg-body"
        style="
          color: #555;
          font-size: 18px;
          text-align: center;
          line-height: 28px;
        "
      >
        {{ i18n.rebuildDesc }}
      </div>
      <template #footer>
        <div class="dlg-btn">
          <o-button
            size="small"
            style="margin-right: 16px"
            @click="showReset = false"
          >
            {{ i18n.cancel }}
          </o-button>
          <o-button size="small" type="primary" @click="resetClick">
            {{ i18n.confirm }}
          </o-button>
        </div>
      </template>
    </el-dialog>
    <!-- 删除训练任务弹窗 -->
    <el-dialog
      v-model="showDel"
      width="640px"
      center
      align-center
      class="apply-dlg"
      :show-close="false"
      append-to-body
    >
      <template #header="{ titleId, title }">
        <div :id="titleId" :class="title">
          <img :src="warningImg" alt="" />
        </div>
      </template>
      <div
        class="dlg-body"
        style="
          color: #555;
          font-size: 18px;
          text-align: center;
          line-height: 28px;
        "
      >
        {{ i18n.deleteDesc }}
      </div>
      <template #footer>
        <div class="dlg-btn">
          <o-button
            size="small"
            style="margin-right: 16px"
            @click="showDel = false"
          >
            {{ i18n.cancel }}
          </o-button>
          <o-button size="small" type="primary" @click="delClick">
            {{ i18n.confirm }}
          </o-button>
        </div>
      </template>
    </el-dialog>
    <!-- 终止训练任务弹窗 -->
    <el-dialog
      v-model="showStop"
      width="640px"
      center
      align-center
      class="apply-dlg"
      :show-close="false"
      append-to-body
    >
      <template #header="{ titleId, title }">
        <div :id="titleId" :class="title">
          <img :src="warningImg" alt="" />
        </div>
      </template>
      <div
        class="dlg-body"
        style="
          color: #555;
          font-size: 18px;
          text-align: center;
          line-height: 28px;
        "
      >
        {{ i18n.terminateDesc }}
      </div>
      <template #footer>
        <div class="dlg-btn">
          <o-button
            size="small"
            style="margin-right: 16px"
            @click="showStop = false"
          >
            {{ i18n.cancel }}
          </o-button>
          <o-button size="small" type="primary" @click="quitClick">
            {{ i18n.confirm }}
          </o-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.train-list {
  // min-height: calc(100vh - 400px);
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  .list-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .table-title {
      display: flex;
      align-items: center;
      .list-tip {
        font-size: 12px;
        font-weight: 400;
        color: #555;
        line-height: 26px;
      }
    }
    .title {
      font-size: 18px;
      font-weight: 400;
      color: #000000;
      line-height: 24px;
      margin-right: 4px;
    }
  }
  .instance-box {
    width: 100%;
    min-height: 297px;
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

  .el-table {
    margin-top: 22px;
    .el-table__row {
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
}
:deep(.el-scrollbar__bar) {
  display: none;
}
</style>
