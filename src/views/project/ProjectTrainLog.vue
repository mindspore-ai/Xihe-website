<script setup>
import { ref, reactive, computed, onUnmounted, onMounted } from 'vue';
import { useRoute } from 'vue-router';

import { useFileData } from '@/stores';
import { getTrainLog, autoEvaluate } from '@/api/api-project';

import IconFinished from '~icons/app/finished';
import IconStopped from '~icons/app/stopped';
import IconRuning from '~icons/app/runing';
import IconFailed from '~icons/app/failed';

const ruleRef = ref();
const i18n = {
  title: '自动评估',
  desc: '训练日志可视化，请按顺序输入超参数范围，详细参考文档',
  learning: {
    name: 'learning_rate',
    placeholder: '请输入例如[0.01, 0.02, 0.03]的字段',
  },
  momentum: { name: 'momentum', placeholder: '请输入例如[0.9,0.99]的字段' },
  batch: { name: 'batch_size', placeholder: '请输入例如 [32, 64]的字段' },
};

const query = reactive({
  learning: '',
  momentum: '',
  batch: '',
});
const rules = reactive({
  learning: [
    { required: true, message: '必填项', trigger: 'blur' },
    {
      pattern: /^\[([1-9]\d*|0\.[1-9]\d*)+\,+[1-9]\d*\.\d*|0\.\d*\]$/,
      message: '格式不正确',
      trigger: 'blur',
    },
  ],
  momentum: [
    { required: true, message: '必填项', trigger: 'blur' },
    // {
    //   pattern: /^\[([1-9]\d*|0\.[1-9]\d*)+\,+[1-9]\d*\.\d*|0\.\d*\]$/,
    //   message: '格式不正确',
    //   trigger: 'blur',
    // },
  ],
  batch: [
    { required: true, message: '必填项', trigger: 'blur' },
    // {
    //   pattern: /^\[(\d+\,)+\d+\]$/,
    //   message: '格式不正确',
    //   trigger: 'blur',
    // },
  ],
});
//  pattern: /^\[([1-9]\d*|0\.[1-9]\d*)+\,+[1-9]\d*\.\d*|0\.\d*\]$/,
//  attern: /^\[(\d+\,)+\d+\]$/,

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
    console.log(res.data.data);
    if (res.status === 200) {
      form.desc = res.data.data.log.content;
      form.name = res.data.data.insance_name;
      trainDetail.value = res.data.data;
      console.log(trainDetail.value);
      if (trainDetail.value.metrics) {
        query.learning = JSON.parse(trainDetail.value.metrics).learning_rate;
        query.momentum = JSON.parse(trainDetail.value.metrics).momentum;
        query.batch = JSON.parse(trainDetail.value.metrics).batch_size;
        console.log(query);
      } else {
        return;
      }

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
      } else {
      }
    }
  });
}
getTrainLogData();

const socket = new WebSocket('wss://xihe.test.osinfra.cn/wss/train_task');
// // 创建好连接之后自动触发（ 服务端执行self.accept() )

socket.onopen = function (event) {
  console.log('链接成功');
  console.log(detailData.value);
  socket.send(
    JSON.stringify({
      pk: detailData.value.id,
      train_id: route.params.trainId,
      is_log: false,
    })
  );
  // socket.send(
  //   JSON.stringify({
  //     pk: detailData.value.id,
  //     train_id: route.params.trainId,
  //     is_log: true,
  //   })
  // );
};

// 当websocket接收到服务端发来的消息时，自动会触发这个函数。
socket.onmessage = function (event) {
  if (event.data.substring(0, 3) === 'log') {
    form.desc = event.data.substring(4);
  } else {
    console.log(JSON.parse(event.data).data);
    trainDetail.value = JSON.parse(event.data).data;
    if (trainDetail.value.status !== 'Running') {
      clearInterval(timer);
      setTimeout(closeConn(), 15000);
      setTimeout(clearInterval(timer1), 15000);
    }
  }
};

// // 服务端主动断开连接时，这个方法也被触发。
// socket.onclose = function (event) {
// };

// function sendMessage() {
// }

function closeConn() {
  socket.close(); // 向服务端发送断开连接的请求
}

// // 页面刷新
function reloadPage() {
  closeConn();
}

const ws = new WebSocket('wss://xihe.test.osinfra.cn/wss/logvisual');
ws.onopen = function (event) {
  console.log('评估已连接');
};

ws.onmessage = function (event) {
  console.log('收到服务器消息');
  console.log(event.data);
  console.log(JSON.parse(event.data).data.url);
  showAnaButton.value = false;
  showGoButton.value = true;
  evaluateUrl.value = JSON.parse(event.data).data.url;
  console.log(evaluateUrl.value);
};

// 跳到评估页面
function goToPage() {
  window.location = `${evaluateUrl.value}`;
}

const showEvaBtn = ref(true);
const showAnaButton = ref(false);
const showGoButton = ref(false);
const evaluateUrl = ref();
// 自动评估
function saveSetting() {
  let params = {
    learning_rate: [0.01],
    momentum: [],
    batch_size: [],
  };

  // ruleRef.value.validate((valid) => {
  // console.log(valid);
  // if (valid) {
  console.log(query);
  autoEvaluate(params, detailData.value.id, route.params.trainId).then(
    (res) => {
      console.log(res);
      if (res.status === 200) {
        showEvaBtn.value = false;
        showAnaButton.value = true;
        setTimeout(() => {
          ws.send(JSON.stringify({ pk: detailData.value.id }));
        }, 10000);
      }
    }
  );
  // } else {
  //   console.log('验证不过');
  // }
  // });
}

onMounted(() => {
  window.addEventListener('beforeunload', (e) => reloadPage());
});

onUnmounted(() => {
  closeConn();
  clearInterval(timer);
  clearInterval(timer1);
});
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
      <div>
        <div class="train-log-detail-title" style="margin-top: 6px">
          训练详情
        </div>
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
              <el-form
                :model="query"
                ref="ruleRef"
                :rules="rules"
                hide-required-asterisk
              >
                <el-form-item :label="i18n.learning.name" prop="learning">
                  <el-input
                    v-model="query.learning"
                    :placeholder="i18n.learning.placeholder"
                  ></el-input>
                </el-form-item>
                <el-form-item :label="i18n.momentum.name" prop="momentum">
                  <el-input
                    v-model="query.momentum"
                    :placeholder="i18n.momentum.placeholder"
                  ></el-input>
                </el-form-item>
                <el-form-item :label="i18n.batch.name" prop="batch">
                  <el-input
                    v-model="query.batch"
                    :placeholder="i18n.batch.placeholder"
                  ></el-input>
                </el-form-item>
              </el-form>
            </div>
          </li>
        </ul>
      </div>

      <div class="info-btn">
        <o-button v-if="showEvaBtn" type="primary" @click="saveSetting"
          >自动评估</o-button
        >
        <o-button
          disabled
          v-if="showAnaButton"
          type="primary"
          @click="saveSetting"
          >解析中</o-button
        >
        <o-button v-if="showGoButton" type="primary" @click="goToPage"
          >前往</o-button
        >
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.train-log-detail {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .info-btn {
    align-self: end;
    margin-top: 37px;
    padding-right: 50px;
  }
}
.train-log {
  max-width: 1440px;
  margin: 0 auto;
  display: flex;
  padding: 40px 24px 48px !important;
  min-height: calc(100vh - 400px);
  background-color: #fff;
  &-form {
    width: 55%;
    padding-bottom: 55px;
    .train-log-name {
      span {
        margin-right: 8px;
        font-size: 18px;
        color: #000;
      }
    }
    .train-log-desc {
      width: 100%;
      height: 100%;
      .el-textarea {
        width: 100% !important;
        height: 100%;
        margin-top: 24px;
        // margin-bottom: 30px;
        :deep .el-textarea__inner {
          min-height: 560px !important;
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
          :deep .el-form-item__error {
            color: var(--el-color-danger);
            font-size: 12px;
            line-height: 1;
            padding-top: 2px;
            position: absolute;
            white-space: nowrap;
            transform: translateY(-50%);
            top: 50%;
            left: calc(100% + -40px);
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
