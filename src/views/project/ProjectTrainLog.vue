<script setup>
import { ref, reactive, computed, onUnmounted, onMounted } from 'vue';
import { useRoute } from 'vue-router';

import { useFileData } from '@/stores';
import { getTrainLog } from '@/api/api-project';

const route = useRoute();
//训练日志js
const form = reactive({
  name: '',
  desc: '',
});

// 当前项目的详情数据
const detailData = computed(() => {
  return useFileData().fileStoreData;
});
// const i18n = {
//   recentDownload: '',
// };

// 训练日志详情数据
const trainDetail = ref({});

console.log(route.params);

var timer = null;
// 获得训练日志页面数据
function getTrainLogData() {
  const trainLogParams = {
    projectId: detailData.value.id,
    trainId: route.params.trainId,
  };
  getTrainLog(trainLogParams).then((res) => {
    if (res.status === 200) {
      console.log(res.data.data);
      trainDetail.value = res.data.data;
      form.desc = res.data.data.log.content;
      form.name = res.data.data.insance_name;
      console.log(trainDetail.value);
      // if (trainDetail.value.status === 'Running') {
      //   timer = setInterval(() => {
      //     socket.send(JSON.stringify({ pk: detailData.value.id, train_id: route.params.trainId }));
      //   }, 15000);
      // }
    }
  });
}

getTrainLogData();

const socket = new WebSocket('ws://xihebackend.test.osinfra.cn/train_task');
// 创建好连接之后自动触发（ 服务端执行self.accept() )
socket.onopen = function (event) {
  console.log('连接成功');
  socket.send(
    JSON.stringify({ pk: detailData.value.id, train_id: route.params.trainId })
  );
};

// 当websocket接收到服务端发来的消息时，自动会触发这个函数。
socket.onmessage = function (event) {
  console.log(JSON.parse(event.data));

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

// 自动评估
function autoEvaluate() {
  console.log(2222);
}
// 保存设置
function saveSetting() {
  console.log(1111);
}
</script>
<template>
  <div class="train-log">
    <div class="train-log-form">
      <div class="train-log-name">
        <span>训练日志</span>
        <el-input
          v-model="form.name"
          disabled
          placeholder="please select your zone"
        >
          <!-- <el-option label="Zone one" value="shanghai" />
          <el-option label="Zone two" value="beijing" /> -->
        </el-input>
      </div>
      <div class="train-log-desc">
        <el-input v-model="form.desc" type="textarea" />
      </div>
      <div>
        <o-button type="primary" @click="autoEvaluate">自动评估</o-button>
      </div>
    </div>
    <div class="train-log-detail">
      <div class="train-log-detail-title">训练详情</div>
      <ul class="train-log-detail-info">
        <li class="info-list">
          <div class="info-list-title">创建时间</div>
          <div class="info-list-detail">{{ trainDetail.create_time }}</div>
        </li>
        <li class="info-list">
          <div class="info-list-title">运行状态</div>
          <div class="info-list-detail">{{ trainDetail.status }}</div>
        </li>
        <li class="info-list">
          <div class="info-list-title">运行时长</div>
          <div class="info-list-detail">{{ trainDetail.runtime }}</div>
        </li>
        <li class="info-list">
          <div class="info-list-title">AI引擎</div>
          <div class="info-list-detail">{{ trainDetail.engine_name }}</div>
        </li>
        <li class="info-list">
          <div class="info-list-title">计算节点个数</div>
          <div class="info-list-detail">{{ trainDetail.node_count }}</div>
        </li>
        <li class="info-list">
          <div class="info-list-title">规格</div>
          <div class="info-list-detail">{{ trainDetail.flavor_type }}</div>
        </li>
        <li class="info-list">
          <div class="info-list-title">输入参数文件</div>
          <div class="info-list-detail">{{ trainDetail.config_path }}</div>
        </li>
        <li class="info-list">
          <div class="info-list-title">日志文件</div>
          <div class="info-list-detail">{{ trainDetail.log_file }}</div>
        </li>
        <li class="info-list">
          <div class="info-list-title">超参数</div>
          <div class="info-list-detail">
            <!-- v-model="form.desc" -->
            <el-input type="textarea" />
          </div>
        </li>
        <div class="info-btn">
          <o-button type="primary" @click="saveSetting">保存设置</o-button>
        </div>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.train-log {
  max-width: 1440px;
  margin: 0 auto;
  display: flex;
  // padding-bottom: 40px;
  padding: 40px 24px 48px;
  min-height: calc(100vh - 340px);
  background-color: #fff;
  &-form {
    width: 55%;
    .train-log-name {
      span {
        margin-right: 8px;
        font-size: 18px;
        color: #000;
      }
    }
    .train-log-desc {
      width: 100%;

      .el-textarea {
        width: 100% !important;
        height: 525px;
        margin-top: 24px;
        margin-bottom: 30px;
        :deep .el-textarea__inner {
          min-height: 560px;
          height: 100%;
        }
      }
    }
  }
  &-detail {
    width: 45%;
    padding-left: 5%;
    // background-color: #bfa;
    &-title {
      height: 24px;
      line-height: 24px;
      font-size: 18px;
      color: #000000;
      margin-top: 6px;
    }
    &-info {
      .info-list {
        margin-top: 24px;
        color: #555;
        display: flex;
        align-items: center;
        &-title {
          width: 110px;
          font-size: 16px;
        }
        &-detail {
          font-size: 14px;
          margin-left: 30px;
        }
      }
      .info-btn {
        margin-left: 140px;
        margin-top: 25px;
      }
    }
  }
}
</style>
