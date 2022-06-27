<script setup>
import { ref, computed, onUnmounted, onMounted } from 'vue';

import OButton from '@/components/OButton.vue';
import OIcon from '@/components/OIcon.vue';
import IconPlus from '~icons/app/plus';
import IconRebuild from '~icons/app/rebuild';
import IconStop from '~icons/app/stop';
import IconRemove from '~icons/app/remove';

import IconFinished from '~icons/app/finished';
import IconStopped from '~icons/app/stopped';
import IconRuning from '~icons/app/runing';
import IconFailed from '~icons/app/failed';

import { useFileData } from '@/stores';

import DeleteTrain from '@/components/DeleteTrain.vue';
import StopTrain from '@/components/StopTrain.vue';
import ResetTrain from '@/components/ResetTrain.vue';

import { useRoute, useRouter } from 'vue-router';

import { trainList, deleteTainList, stopTrain } from '@/api/api-project';
import { ElMessageBox } from 'element-plus';

const route = useRoute();
const router = useRouter();
// 当前项目的详情数据
const detailData = computed(() => {
  return useFileData().fileStoreData;
});

console.log(detailData.value.id);

let projectId = detailData.value.id;
const trainData = ref([]);

var timer = null;

// 获取训练列表
function getTrainList() {
  trainList(projectId).then((res) => {
    trainData.value = res.data.data;
    console.log(trainData.value);
    trainData.value.forEach((item) => {
      // if (item.status === 'Running') {
      //   timer = setInterval(() => {
      //     socket.send(JSON.stringify({ pk: detailData.value.id }));
      //   }, 1000);
      // }
    });
  });
}
getTrainList();

//跳转到选择文件创建训练实例页
function goSelectFile() {
  router.push({
    path: `/projects/${detailData.value.owner_name.name}/${detailData.value.name}/selectfile`,
    query: {
      projectId: detailData.value.id,
    },
  });
}
const showDel = ref(false);
function showDelClick() {
  showDel.value = true;
}
// 删除
function deleteClick(id) {
  deleteTainList(projectId, id).then((res) => {
    if (res.status === 200) {
      getTrainList();
      showDel.value = false;
    }
  });
}

function onClick(val) {
  console.log(val);
  if (val === 2) {
    showDel.value = false;
  } else {
    deleteClick(val);
  }
}

// 终止训练
const showStop = ref(false);
function stopClick(id) {
  console.log(id);
  stopTrain(projectId, id).then((res) => {
    console.log(res);
    if (res.status === 200) {
      getTrainList();
      closeConn();
      clearInterval(timer);
    }
  });
}

function quitClick(val) {
  console.log(val);
  if (val === 1) {
    showStop.value = false;
  } else {
    stopClick(val);
    console.log(val);
  }
}

function showStopClick(val) {
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
function showResetClick() {
  showReset.value = true;
}

function resetClick(val) {
  if (val === 1) {
    showReset.value = false;
  }
}

function goTrainLog(trainId) {
  console.log(trainId);
  router.push({
    name: 'projectTrainLog',
    params: {
      trainId: trainId,
    },
  });
}

// 参数文件详情跳转
function goDateDetail(path) {
  console.log(path);
  router.push(
    `/projects/${detailData.value.owner_name.name}/${detailData.value.name}/blob/${path}`
  );
}

const socket = new WebSocket('ws://xihebackend.test.osinfra.cn/train_task');
// 创建好连接之后自动触发（ 服务端执行self.accept() )
socket.onopen = function (event) {
  console.log('连接成功');
  socket.send(JSON.stringify({ pk: detailData.value.id }));
};

// 当websocket接收到服务端发来的消息时，自动会触发这个函数。
socket.onmessage = function (event) {
  console.log(JSON.parse(event.data).data);
  trainData.value = JSON.parse(event.data).data;
  trainData.value.forEach((item) => {
    if (item.status === 'Running') {
      return;
    } else {
      clearInterval(timer);
      closeConn();
    }
  });
  console.log('收到服务器消息');
};

// 服务端主动断开连接时，这个方法也被触发。
socket.onclose = function (event) {
  console.log('服务器主动断开连接');
};

function sendMessage() {
  console.log('发送消息');
}

function closeConn() {
  socket.close(); // 向服务端发送断开连接的请求
}

// 页面刷新
function reloadPage() {
  console.log('页面刷新了');
  closeConn();
}

onMounted(() => {
  window.addEventListener('beforeunload', (e) => reloadPage());
});

onUnmounted(() => {
  closeConn();
  clearInterval(timer);
});
</script>
<template>
  <div class="train-list">
    <div class="list-top">
      <p class="title">训练列表</p>
      <o-button type="primary" @click="goSelectFile">
        <div class="btn-content">
          <o-icon><icon-plus></icon-plus></o-icon>
          <span>创建训练实例</span>
        </div>
      </o-button>
    </div>
    <el-table :data="trainData" style="width: 100%">
      <el-table-column label="训练名称/ID" width="180">
        <template #default="scope">
          <div>
            <span class="train-name" @click="goTrainLog(scope.row.train_id)">{{
              scope.row.instance_name
            }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="128">
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
      <el-table-column label="运行时长" width="125" prop="runtime">
      </el-table-column>
      <el-table-column label="描述" width="618">
        <template #default="scope">
          <!-- 删除 -->
          <delete-train
            :train-id="scope.row.train_id"
            :show-del="showDel"
            @on-click="onClick"
          ></delete-train>
          <!-- 终止 -->
          <stop-train
            :train-id="scope.row.train_id"
            :show-stop="showStop"
            @on-click="quitClick"
          ></stop-train>
          <!-- 重建 -->
          <reset-train
            :show-reset="showReset"
            @on-click="resetClick"
          ></reset-train>
          <div class="describe">
            {{ scope.row.description }}
            <div class="hide-box">
              <div class="tools-box">
                <div
                  v-if="scope.row.status !== 'Completed'"
                  class="tools"
                  @click="showStopClick(scope.row.status)"
                >
                  <o-icon><icon-stop></icon-stop></o-icon>
                  <p>终止</p>
                </div>
                <div class="tools" @click="showResetClick">
                  <o-icon><icon-rebuild></icon-rebuild></o-icon>
                  <p>重建</p>
                </div>
                <div class="tools" @click="showDelClick">
                  <o-icon><icon-remove></icon-remove></o-icon>
                  <p>删除</p>
                </div>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="参数文件" width="203">
        <template #default="scope">
          <div>
            <span class="date" @click="goDateDetail(scope.row.config_path)">
              {{ scope.row.config_path }}</span
            >
          </div>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" prop="create_time" width="154">
      </el-table-column>
    </el-table>
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
    .o-button {
      padding: 12px !important;
    }
    .btn-content {
      display: flex;
      align-items: center;
      .o-icon {
        margin-right: 12px;
      }
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

      .describe {
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
