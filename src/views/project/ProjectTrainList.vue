<script setup>
import { ref, computed, onUnmounted, onMounted } from 'vue';

import OButton from '@/components/OButton.vue';
import OIcon from '@/components/OIcon.vue';
// import IconPlus from '~icons/app/plus';
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

import { useRouter, useRoute } from 'vue-router';
import { useFileData, useUserInfoStore } from '@/stores';
import {
  trainList,
  deleteTainList,
  stopTrain,
  rebuildTrain,
} from '@/api/api-project';

const route = useRoute();
const router = useRouter();
const userInfoStore = useUserInfoStore();

// 当前项目的详情数据
const detailData = computed(() => {
  return useFileData().fileStoreData;
});
const projectId = detailData.value.id;
const trainData = ref([]);
const listId = ref(null);
const trainId = ref(null);
const resetedId = ref(null);
const tips = ref(false);
const description = ref('');
const i18n = {
  description1:
    '已有正在训练中的实例，暂不能创建新的训练实例。你可等待训练完成或终止当前训练来创建新的训练实例。',
  description2:
    '一个用户一个仓库最多只能创建5个训练实例，若需再创建，请删除之前的训练实例后再创建。',
  confirm: '确定',
};

// 是否是访客
const isAuthentic = computed(() => {
  return route.params.user === userInfoStore.userName;
});
// 进入页面判断是否是自己的项目，不是则返回首页
function goHome() {
  if (!isAuthentic.value) {
    router.push('/');
  }
}
goHome();

let timer = null;
// 获取训练列表
function getTrainList() {
  trainList(projectId).then((res) => {
    trainData.value = res.data.data;
    if (trainData.value.findIndex((item) => item.status === 'Running') !== -1) {
      timer = setInterval(() => {
        socket.send(JSON.stringify({ pk: detailData.value.id }));
      }, 1000);
    } else {
    }
  });
}
getTrainList();

//跳转到选择文件创建训练实例页
function goSelectFile() {
  if (trainData.value.length === 5) {
    description.value = i18n.description2;
    tips.value = true;
    // 判断每一项的status是否为Running,如果有，则不能创建训练实例
  } else if (trainData.value.some((item) => item.status === 'Running')) {
    description.value = i18n.description1;
    tips.value = true;
  } else {
    router.push({
      path: `/projects/${detailData.value.owner_name.name}/${detailData.value.name}/selectfile`,
      query: {
        id: detailData.value.id,
      },
    });
  }
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
    if (res.status === 200) {
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
    if (res.status === 200) {
      getTrainList();
      clearInterval(timer);
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
  resetedId.value = val;
  showReset.value = true;
}

function resetClick(val) {
  if (val === 1) {
    showReset.value = false;
  } else {
    rebuildTrain(projectId, val).then((res) => {
      if (res.status === 200) {
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

// 参数文件详情跳转
// function goDateDetail(path) {
//   router.push(
//     `/projects/${detailData.value.owner_name.name}/${detailData.value.name}/blob/${path}`
//   );
// }

// wss://xihe.test.osinfra.cn/wss/train_task
const socket = new WebSocket(
  'wss://xihebackend.test.osinfra.cn/wss/train_task'
);
// 创建好连接之后自动触发（ 服务端执行self.accept() )
socket.onopen = function () {
  // console.log('服务器已连接');
  socket.send(JSON.stringify({ pk: detailData.value.id }));
};

// 当websocket接收到服务端发来的消息时，自动会触发这个函数。
socket.onmessage = function (event) {
  // console.log('收到服务器的消息');
  trainData.value = JSON.parse(event.data).data;

  if (trainData.value.findIndex((item) => item.status === 'Running') === -1) {
    clearInterval(timer);
  }
};

// 服务端主动断开连接时，这个方法也被触发。
// socket.onclose = function () {
//   console.log('服务器主动断开');
// };

// function closeConn() {
//   socket.close(); // 向服务端发送断开连接的请求
// }

// 页面刷新
function reloadPage() {
  socket.close();
}

onMounted(() => {
  window.addEventListener('beforeunload', () => reloadPage());
});

onUnmounted(() => {
  socket.close();
  clearInterval(timer);
});
</script>
<template>
  <div class="train-list">
    <div class="list-top">
      <p class="title">训练列表</p>
      <o-button type="primary" @click="goSelectFile">
        <span>创建训练实例</span>
      </o-button>
    </div>
    <el-table v-if="trainData.length" :data="trainData" style="width: 100%">
      <el-table-column label="训练名称/ID" width="220">
        <template #default="scope">
          <div>
            <span class="train-name" @click="goTrainLog(scope.row.train_id)">{{
              scope.row.instance_name
            }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="178">
        <template #default="scope">
          <div class="status-box">
            <o-icon v-if="scope.row.status === 'Completed'"
              ><icon-finished></icon-finished
            ></o-icon>
            <o-icon v-if="scope.row.status === 'Terminated'"
              ><icon-stopped></icon-stopped
            ></o-icon>
            <o-icon v-if="scope.row.status === 'Running'"
              ><icon-runing></icon-runing
            ></o-icon>
            <o-icon v-if="scope.row.status === 'Failed'"
              ><icon-failed></icon-failed
            ></o-icon>
            {{ scope.row.status }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="运行时长" width="178" prop="runtime">
      </el-table-column>
      <el-table-column label="描述" width="618">
        <template #default="scope">
          <!-- 删除 -->
          <delete-train
            :list-id="listId"
            :show-del="showDel"
            @click="delClick"
          ></delete-train>
          <!-- 终止 -->
          <stop-train
            :train-id="trainId"
            :show-stop="showStop"
            @click="quitClick"
          ></stop-train>
          <!-- 重建 -->
          <reset-train
            :reset-id="resetedId"
            :show-reset="showReset"
            @click="resetClick"
          ></reset-train>
          <div class="description">
            {{ scope.row.description }}
            <div class="hide-box">
              <div class="tools-box">
                <div
                  v-if="scope.row.status !== 'Completed'"
                  class="tools"
                  @click="showStopClick(scope.row.status, scope.row.train_id)"
                >
                  <o-icon><icon-stop></icon-stop></o-icon>
                  <p>终止</p>
                </div>
                <div class="tools" @click="showResetClick(scope.row.train_id)">
                  <o-icon><icon-rebuild></icon-rebuild></o-icon>
                  <p>重建</p>
                </div>
                <div class="tools" @click="showDelClick(scope.row.train_id)">
                  <o-icon><icon-remove></icon-remove></o-icon>
                  <p>删除</p>
                </div>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column label="参数文件" width="203">
        <template #default="scope">
          <div>
            <span class="date" @click="goDateDetail(scope.row.config_path)">
              {{ scope.row.config_path }}</span
            >
          </div>
        </template>
      </el-table-column> -->
      <el-table-column label="更新时间" prop="create_time" width="214">
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
    .title {
      line-height: 24px;
      font-size: 18px;
      font-weight: 400;
      color: #000000;
      line-height: 24px;
    }
    // .o-button {
    //   padding: 12px !important;
    // }
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
        .hide-box {
          display: none;
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
        display: flex;
        align-items: center;
        .o-icon {
          margin-right: 8px;
        }
      }
    }
  }
}
</style>
