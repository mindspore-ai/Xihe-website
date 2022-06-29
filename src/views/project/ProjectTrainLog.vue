<script setup>
import { ref, reactive, computed, onUnmounted, onMounted } from 'vue';
import { useRoute } from 'vue-router';

import { useFileData } from '@/stores';
import { getTrainLog } from '@/api/api-project';

import IconFinished from '~icons/app/finished';
import IconStopped from '~icons/app/stopped';
import IconRuning from '~icons/app/runing';
import IconFailed from '~icons/app/failed';

const i18n = {
  title: '自动评估',
  desc: '自动评估aaaaaaaaaaaa',
  learning: {
    name: 'learning_rate',
    placeholder: '请输入例如[0.01, 0.02, 0.03]的字段',
  },
  momentum: { name: 'momentum', placeholder: '请输入例如[0.9,0.99]的字段' },
  batch: { name: 'batch_size', placeholder: '请输入例如 [32, 64]的字段' },
};

const query = {
  learning: '',
  momentum: '',
  batch: '',
};

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

var timer = null;
var timer1 = null;
// 获得训练日志页面数据
function getTrainLogData() {
  const trainLogParams = {
    projectId: detailData.value.id,
    trainId: route.params.trainId,
  };
  getTrainLog(trainLogParams).then((res) => {
    if (res.status === 200) {
      trainDetail.value = res.data.data;
      form.desc = res.data.data.log.content;
      form.name = res.data.data.insance_name;
      if (trainDetail.value.status === 'Running') {
        timer = setInterval(() => {
          socket.send(
            JSON.stringify({
              pk: detailData.value.id,
              train_id: route.params.trainId,
              is_log: false,
            })
          );
        }, 1000);
        timer1 = setInterval(() => {
          socket.send(
            JSON.stringify({
              pk: detailData.value.id,
              train_id: route.params.trainId,
              is_log: true,
            })
          );
        }, 10000);
      }
    }
  });
}

getTrainLogData();

const socket = new WebSocket('wss://xihebackend.test.osinfra.cn/train_task');
// // 创建好连接之后自动触发（ 服务端执行self.accept() )
socket.onopen = function (event) {
  // console.log('连接成功');
  socket.send(
    JSON.stringify({
      pk: detailData.value.id,
      train_id: route.params.trainId,
      is_log: true,
    })
  );
  socket.send(
    JSON.stringify({
      pk: detailData.value.id,
      train_id: route.params.trainId,
      is_log: false,
    })
  );
};

// 当websocket接收到服务端发来的消息时，自动会触发这个函数。
socket.onmessage = function (event) {
  if (event.data.substring(0, 3) === 'log') {
    form.desc = event.data.substring(4);
  } else {
    trainDetail.value = JSON.parse(event.data).data;
    // console.log(trainDetail.value );
    if (trainDetail.value.status !== 'Running') {
      // socket.send(
      //   JSON.stringify({
      //     pk: detailData.value.id,
      //     train_id: route.params.trainId,
      //     is_log: true,
      //   })
      // );
      clearInterval(timer);
      setTimeout(closeConn(), 15000);
      setTimeout(clearInterval(timer1), 15000);
      // closeConn();

      // clearInterval(timer1);
    }
  }
};

// // 服务端主动断开连接时，这个方法也被触发。
// socket.onclose = function (event) {
//   // console.log('服务器主动断开连接');
// };

// function sendMessage() {
//   console.log('发送消息');
// }

function closeConn() {
  socket.close(); // 向服务端发送断开连接的请求
}

// // 页面刷新
function reloadPage() {
  // console.log('页面刷新了');
  closeConn();
}

onMounted(() => {
  window.addEventListener('beforeunload', (e) => reloadPage());
});

onUnmounted(() => {
  closeConn();
  clearInterval(timer);
  clearInterval(timer1);
});

// 自动评估
function autoEvaluate() {
  // console.log(2222);
}
// 保存设置
function saveSetting() {
  // console.log(1111);
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
        </el-input>
      </div>
      <div class="train-log-desc">
        <el-input v-model="form.desc" type="textarea" />
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
          <div class="info-list-detail">
            <o-icon v-if="trainDetail.status === 'Completed'"
              ><icon-finished></icon-finished
            ></o-icon>
            <o-icon v-if="trainDetail.status === 'Terminated'"
              ><icon-stopped></icon-stopped
            ></o-icon>
            <o-icon v-if="trainDetail.status === 'Running'"
              ><icon-runing></icon-runing
            ></o-icon>
            <o-icon v-if="trainDetail.status === 'Failed'"
              ><icon-failed></icon-failed
            ></o-icon>

            {{ trainDetail.status }}
          </div>
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
          <div class="info-list-detail document">
            {{ trainDetail.config_path }}
          </div>
        </li>
        <li class="info-list">
          <div class="info-list-title">日志文件</div>
          &nbsp;
          <div class="info-list-detail document">
            {{ trainDetail.log_file }}
          </div>
        </li>
        <li class="assess-box">
          <p class="assess-title">{{ i18n.title }}</p>
          <p class="assess-desc">
            {{ i18n.desc }}
          </p>
          <div class="button-box">
            <el-form>
              <el-form-item :label="i18n.learning.name">
                <el-input
                  v-model="query.learning"
                  :placeholder="i18n.learning.placeholder"
                ></el-input>
              </el-form-item>
              <el-form-item :label="i18n.momentum.name">
                <el-input
                  v-model="query.momentum"
                  :placeholder="i18n.momentum.placeholder"
                ></el-input>
              </el-form-item>
              <el-form-item :label="i18n.batch.name">
                <el-input
                  v-model="query.batch"
                  :placeholder="i18n.batch.placeholder"
                ></el-input>
              </el-form-item>
            </el-form>
            <div class="info-btn">
              <o-button type="primary" @click="saveSetting">自动评估</o-button>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.train-log {
  max-width: 1440px;
  margin: 0 auto;
  display: flex;
  padding: 40px 24px 48px !important;
  min-height: calc(100vh - 400px);
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
        height: 640px;
        margin-top: 24px;
        // margin-bottom: 30px;
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
    &-title {
      height: 24px;
      line-height: 24px;
      font-size: 18px;
      color: #000000;
      margin-top: 6px;
    }
    &-info {
      .assess-box {
        margin-top: 48px;
        .button-box {
          display: flex;
          flex-direction: column;
          .info-btn {
            align-self: end;
            margin-top: 37px;
            padding-right: 50px;
          }
        }
        .assess-title {
          font-size: 18px;
          color: #000;
          line-height: 24px;
          font-weight: normal;
        }
        .assess-desc {
          margin-top: 16px;
          font-size: 14px;
          color: #999;
          line-height: 22px;
          font-weight: normal;
        }
        :deep .el-form-item {
          margin-top: 16px;
          .el-form-item__label {
            width: 110px;
            text-align: left;
          }
        }
      }
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
        .document {
          color: #0d8dff;
          border-bottom: 1px solid #0d8dff;
          margin-left: 32px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      // .info-btn {
      //   margin-left: 140px;
      //   margin-top: 25px;
      // }
    }
  }
}
</style>
