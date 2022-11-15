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
import IconRuning from '~icons/app/runing';
import IconFailed from '~icons/app/failed';
import IconInstance from '~icons/app/train-instance';
import warningImg from '@/assets/icons/warning.png';

import DeleteTrain from '@/components/DeleteTrain.vue';
import StopTrain from '@/components/StopTrain.vue';
import ResetTrain from '@/components/ResetTrain.vue';

import {
  trainList,
  deleteTainList,
  stopTrain,
  rebuildTrain,
} from '@/api/api-project';

const DOMAIN = import.meta.env.VITE_DOMAIN;

// 当前项目的详情数据
const detailData = computed(() => {
  return useFileData().fileStoreData;
});

const isAuthentic = computed(() => {
  return route.params.user === userInfoStore.userName;
});

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

const route = useRoute();
const router = useRouter();
const userInfoStore = useUserInfoStore();

const projectId = detailData.value.id;
const trainData = ref([]);
const listId = ref(null);
const trainId = ref(null);
const resetedId = ref(null);
const tips = ref(false);
const btnShow = ref(false);
const description = ref('');

const i18n = {
  description1:
    '已有正在训练中的实例，暂不能创建新的训练实例。你可等待训练完成或终止当前训练来创建新的训练实例。',
  description2:
    '一个用户一个仓库最多只能创建5个训练实例，若需再创建，请删除之前的训练实例后再创建。',
  confirm: '确定',
};

// 进入页面判断是否是自己的项目，不是则返回首页
function goHome() {
  if (!isAuthentic.value) {
    router.push('/');
  }
}
goHome();

//跳转到选择文件创建训练实例页
function goSelectFile() {
  let routerData = router.resolve({
    path: `/projects/${detailData.value.owner}/${detailData.value.name}/createfile`,
    query: {
      id: detailData.value.id,
    },
  });
  window.open(routerData.href, '_blank');
}

function toggleDelDlg(flag) {
  if (flag === undefined) {
    tips.value = !tips.value;
  } else {
    tips.value = flag;
  }
}

const showDel = ref(false);
function showDelClick(val) {
  listId.value = val;
  showDel.value = true;
}

// 删除
function deleteTrainList(id) {
  deleteTainList(projectId, id).then((res) => {
    if (res.status === 204) {
      getTrainList();
      showDel.value = false;
    }
  });
}

function delClick(val) {
  if (val === 2) {
    showDel.value = false;
  } else {
    deleteTrainList(val);
  }
}

// 终止训练
const showStop = ref(false);
function stopTrainList(id) {
  stopTrain(projectId, id).then((res) => {
    if (res.status === 202) {
      getTrainList();
      showStop.value = false;
    }
  });
}

function quitClick(val) {
  if (val === 1) {
    showStop.value = false;
  } else {
    stopTrainList(trainId.value);
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

// 重建
const showReset = ref(false);
function showResetClick(val) {
  let bool = trainData.value.some(
    (item) => item.status === 'scheduling' || item.status === 'Running'
  );
  if (bool) {
    ElMessage({
      type: 'warning',
      message: '只能有一个运行中的训练',
    });
  } else if (trainData.value.length >= 5) {
    ElMessage({
      type: 'warning',
      message: '最多创建5条训练',
    });
  } else {
    resetedId.value = val;
    showReset.value = true;
  }
}

function resetClick(val) {
  if (val === 1) {
    showReset.value = false;
  } else {
    rebuildTrain(projectId, val).then((res) => {
      if (res.status === 201) {
        showReset.value = false;
        getTrainList();
      }
    });
  }
}

function goTrainLog(trainId) {
  router.push({
    name: 'projectTrainLog',
    params: {
      trainId: trainId,
    },
  });
}

let socket;
function getTrainList() {
  trainList(projectId).then((res) => {
    trainData.value = res.data.data;
    // 列表为空可以创建实例
    if (!trainData.value) {
      btnShow.value = false;
    } else {
      let bool = trainData.value.some(
        (item) => item.status === 'scheduling' || item.status === 'Running'
      );
      if (bool || trainData.value.length >= 5) {
        btnShow.value = true;
      } else {
        btnShow.value = false;
      }
      socket = setWebsocket(
        `wss://${DOMAIN}/server/train/project/${projectId}/training/ws`
      );
    }
  });
}

function setWebsocket(url) {
  const socket = new WebSocket(url, [
    getHeaderConfig().headers['private-token'],
  ]);

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
      }
    } catch (e) {
      console.error(e);
    }
  };
  return socket;
}

socket = setWebsocket(
  `wss://${DOMAIN}/server/train/project/${projectId}/training/ws`
);

// 页面刷新
onMounted(() => {
  window.addEventListener('beforeunload', () => socket.close());
});

onUnmounted(() => {
  socket && socket.close();
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

            <div v-if="scope.row.status === 'Running'" class="status-item">
              <o-icon><icon-runing></icon-runing></o-icon>
              <span>运行中</span>
            </div>

            <div v-if="scope.row.status === 'scheduling'" class="status-item">
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

      <el-table-column label="运行时长" width="178">
        <template #default="scope">
          <div>
            {{ formatSeconds(scope.row.duration) }}
          </div>
        </template>
      </el-table-column>

      <el-table-column label="描述" width="618">
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

          <ResetTrain
            :reset-id="resetedId"
            :show-reset="showReset"
            @click="resetClick"
          />
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
    <o-dialog :show="tips" @close-click="toggleDelDlg(false)">
      <template #head>
        <div
          class="dlg-title"
          :style="{ textAlign: 'center', paddingTop: '40px' }"
        >
          <img :src="warningImg" alt="" />
        </div>
      </template>
      <div
        class="dlg-body"
        :style="{
          padding: '8px 0 30px',
          fontSize: '18px',
          textAlign: 'center',
          width: '640px',
        }"
      >
        {{ description }}
      </div>
      <template #foot>
        <div
          class="dlg-actions"
          :style="{
            display: 'flex',
            justifyContent: 'center',
            paddingBottom: '46px',
          }"
        >
          <o-button type="primary" @click="tips = false">{{
            i18n.confirm
          }}</o-button>
        </div>
      </template>
    </o-dialog>
  </div>
</template>

<style lang="scss" scoped>
.train-list {
  min-height: calc(100vh - 400px);
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
    min-height: calc(100vh - 450px);
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

  :deep .el-table {
    margin-top: 16px;
    --el-table-header-bg-color: #e5e8f0;
    --el-table-header-text-color: #555;
    .el-table__header {
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
}
</style>
