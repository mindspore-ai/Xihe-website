<script setup>
import {
  ref,
  reactive,
  computed,
  onUnmounted,
  onMounted,
  watch,
  nextTick,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { useFileData, useUserInfoStore } from '@/stores';
import { getTrainLog, autoEvaluate } from '@/api/api-project';

import IconFinished from '~icons/app/finished';
import IconStopped from '~icons/app/stopped';
import IconRuning from '~icons/app/runing';
import IconFailed from '~icons/app/failed';
import IconWarning from '~icons/app/warning';

import { ElMessage } from 'element-plus';

const showEvaBtn = ref(true);
const isDisabled = ref(false);
const showAnaButton = ref(false);
const showGoButton = ref(false);

const showEvaBtn1 = ref(true);
const isDisabled1 = ref(false);
const showAnaButton1 = ref(false);
const showGoButton1 = ref(false);
const evaluateUrl = ref('');

const showContent = ref(true);
const showContent1 = ref(false);
const ruleRef = ref(null);

const trainDetail = ref({});
const repoContent = ref('');

let timer = null;
let timer1 = null;
let timer2 = null;
let timer3 = null;

const route = useRoute();
const router = useRouter();
const i18n = {
  title: '评估',
  desc: '训练日志可视化，请按顺序输入超参数范围，目前只支持LossMonitor, 详情请参考文档，更多的参数评估请选用自定义评估',
  learning: {
    name: 'learning_rate',
    placeholder: '请输入例如[0.01, 0.02, 0.03]的字段',
  },
  momentum: { name: 'momentum', placeholder: '请输入例如[0.9,0.99]的字段' },
  batch: { name: 'batch_size', placeholder: '请输入例如 [32, 64]的字段' },
};

const query = reactive({
  learning_rate: '',
  momentum: '',
  batch_size: '',
});

const rules = reactive({
  learning_rate: [
    { required: true, message: '必填项', trigger: 'blur' },
    // {
    //   pattern: /^\[([1-9]\d*|0\.[1-9]\d*)+\,+[1-9]\d*\.\d*|0\.\d*\]$/,
    //   message: '格式不正确',
    //   trigger: 'blur',
    // },
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
    // { required: true, message: '必填项', trigger: 'blur' },
    // {
    //   pattern: /^\[((\d+\,)+\d+)*\]$/,
    //   message: '格式不正确',
    //   trigger: 'blur',
    // },
  ],
});

//训练日志
const form = reactive({
  name: '',
  desc: '',
});
const userInfoStore = useUserInfoStore();

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

// 当前项目的详情数据
const detailData = computed(() => {
  return useFileData().fileStoreData;
});

// 获得训练日志页面数据
function getTrainLogData() {
  const trainLogParams = {
    projectId: detailData.value.id,
    trainId: route.params.trainId,
  };
  getTrainLog(trainLogParams).then((res) => {
    if (res.status === 200) {
      repoContent.value = res.data.data.db_path;
      form.desc = res.data.data.log.content;
      form.name = res.data.data.insance_name;
      trainDetail.value = res.data.data;
      if (trainDetail.value.metrics) {
        query.learning_rate = JSON.parse(
          trainDetail.value.metrics
        ).learning_rate;
        query.momentum = JSON.parse(trainDetail.value.metrics).momentum;
        query.batch_size = JSON.parse(trainDetail.value.metrics).batch_size;
      } else {
      }

      if (trainDetail.value.status === 'Running') {
        isDisabled.value = true;
        isDisabled1.value = true;
        showEvaBtn1.value = false;

        showEvaBtn.value = false;
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
socket.onopen = function () {
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
    if (trainDetail.value.status !== 'Running') {
      isDisabled.value = false;
      showEvaBtn.value = true;
      showEvaBtn1.value = true;
      clearInterval(timer);
      // setTimeout(closeConn(), 10000);
      setTimeout(clearInterval(timer1), 10000);
    }
  }
};

function closeConn() {
  socket.close(); // 向服务端发送断开连接的请求
}

// 页面刷新
function reloadPage() {
  closeConn();
}

const ws = new WebSocket('wss://xihe.test.osinfra.cn/wss/logvisual');
// ws.onopen = function () {
//   console.log('服务器已连接');
// };

ws.onclose = function () {
  clearInterval(timer2);
};

ws.onmessage = function (event) {
  console.log(event);
  if (
    JSON.parse(event.data).status === 200 &&
    JSON.parse(event.data).msg === '运行中'
  ) {
    ElMessage({
      type: 'success',
      message: '自动评估完成！点击查看报告查看。',
    });
    showAnaButton.value = false;
    showGoButton.value = true;

    showAnaButton1.value = false;
    showGoButton1.value = true;

    evaluateUrl.value = JSON.parse(event.data).data.url;

    clearInterval(timer2);
    clearInterval(timer3);
  } else {
    // showEvaBtn.value = true;
    // showAnaButton.value = false;
  }
};

// 自动评估
function saveSetting() {
  autoEvaluate(query, detailData.value.id, route.params.trainId).then((res) => {
    if (res.status === 200) {
      showEvaBtn.value = false;
      showAnaButton.value = true;
      timer3 = setInterval(() => {
        ws.send(JSON.stringify({ pk: detailData.value.id }));
      }, 10000);
    }
  });
}

// 自定义评估
function handleAssessment() {
  showEvaBtn1.value = false;
  isDisabled1.value = true;
  let params = {
    db_path: repoContent.value,
  };
  autoEvaluate(params, detailData.value.id, route.params.trainId).then(
    (res) => {
      if (res.status === 200) {
        isDisabled1.value = false;
        showAnaButton1.value = true;
        timer2 = setInterval(() => {
          ws.send(
            JSON.stringify({
              pk: detailData.value.id,
              train_id: route.params.trainId,
              is_cust: true,
            })
          );
        }, 10000);
      }
    }
  );
}

// 添加评估代码
function addAssessCode() {
  router.push();
}

// 跳转到Aim嵌入页面
function goAimPage() {
  router.push({
    path: `/projects/${detailData.value.owner_name.name}/${detailData.value.name}/projectAim`,
    query: {
      url: evaluateUrl.value,
    },
  });
}

// 跳到评估页面
function goToPage() {
  // window.open(`${evaluateUrl.value}`);
  router.push({
    path: `/projects/${detailData.value.owner_name.name}/${detailData.value.name}/projectAim`,
    query: {
      url: evaluateUrl.value,
    },
  });
}

// 日志详情
function goLogFile() {
  router.push(
    `/projects/${detailData.value.owner_name.name}/${detailData.value.name}/tree/train/log/`
  );
}

function handleChangeClick() {
  if (showContent.value) {
    return;
  } else {
    showContent.value = true;
    showContent1.value = false;
  }
}
function handleChangeClick1() {
  if (showContent1.value) {
    return;
  } else {
    showContent.value = false;
    showContent1.value = true;
  }
}

onMounted(() => {
  window.addEventListener('beforeunload', () => reloadPage());
});

onUnmounted(() => {
  closeConn();
  clearInterval(timer);
  clearInterval(timer1);
  clearInterval(timer2);
});

watch(
  () => form.desc,
  () => {
    const obj = document.querySelector('#txt');
    nextTick(() => {
      obj.scrollTop = obj.scrollHeight;
    });
  }
);
</script>
<template>
  <div class="train-log">
    <div class="train-log-form">
      <div class="train-log-name">
        <span>训练日志</span>
        <el-input v-model="form.name" disabled> </el-input>
      </div>
      <div class="train-log-desc">
        <el-input id="txt" v-model="form.desc" type="textarea" />
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
            <div class="info-list-detail">{{ trainDetail.flavor }}</div>
          </li>
          <!-- <li class="info-list">
            <div class="info-list-title">输入参数文件</div>
            <div
              class="info-list-detail document"
              @click="goJsonFile(trainDetail.config_path)"
            >
              {{ trainDetail.config_path }}
            </div>
          </li> -->
          <li class="info-list">
            <div class="info-list-title">日志文件</div>
            <div class="info-list-detail document" @click="goLogFile">
              {{ trainDetail.log_file }}
            </div>
          </li>

          <li class="assess-box">
            <div class="assess-head">
              <p class="assess-title">{{ i18n.title }}</p>
              <div class="tab-container">
                <span
                  :class="showContent ? 'active' : ''"
                  @click="handleChangeClick"
                  >自动评估</span
                >
                <p
                  :class="showContent1 ? 'active' : ''"
                  @click="handleChangeClick1"
                >
                  自定义评估
                </p>
              </div>
            </div>
            <!-- 自动评估 -->
            <div v-if="showContent">
              <p class="assess-desc">
                {{ i18n.desc }}
              </p>
              <div class="button-box">
                <el-form
                  ref="ruleRef"
                  :model="query"
                  :rules="rules"
                  hide-required-asterisk
                >
                  <el-form-item
                    :label="i18n.learning.name"
                    prop="learning_rate"
                  >
                    <el-input
                      v-model="query.learning_rate"
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
                      v-model="query.batch_size"
                      :placeholder="i18n.batch.placeholder"
                    ></el-input>
                  </el-form-item>
                </el-form>

                <div class="info-btn">
                  <o-button
                    v-if="showEvaBtn"
                    type="primary"
                    @click="saveSetting"
                    >开始评估</o-button
                  >
                  <o-button
                    v-if="isDisabled"
                    disabled
                    type="primary"
                    @click="saveSetting"
                    >开始评估</o-button
                  >
                  <o-button
                    v-if="showAnaButton"
                    disabled
                    type="primary"
                    @click="saveSetting"
                    >评估中...</o-button
                  >
                  <o-button v-if="showGoButton" type="primary" @click="goToPage"
                    >查看报告</o-button
                  >
                </div>
              </div>
            </div>
            <div v-if="showContent1">
              <!-- 无Aim代码 -->
              <div v-if="!trainDetail.db_path" class="no-aim">
                <p>
                  <o-icon><icon-warning></icon-warning></o-icon>
                </p>
                <p class="no-aim-middle">
                  当前暂时不能进行自定义评估，你需要在训练代码中添加Aim代码，详情请参考
                </p>
                <p class="no-aim-bottom" @click="addAssessCode">添加评估代码</p>
              </div>
              <!-- 有Aim代码 -->
              <div v-if="trainDetail.db_path" class="have-aim">
                <p>
                  该路径为系统自动读取的repo路径，请确认repo路径是否为Aim仓库路径，可进行修改
                </p>
                <el-form>
                  <el-form-item label="repo">
                    <el-input
                      v-model="repoContent"
                      placeholder="train/db/"
                    ></el-input>
                  </el-form-item>
                </el-form>
                <div class="info-btn">
                  <o-button
                    v-if="showEvaBtn1"
                    type="primary"
                    @click="handleAssessment"
                    >开始评估</o-button
                  >
                  <o-button v-if="isDisabled1" disabled type="primary"
                    >开始评估</o-button
                  >
                  <o-button v-if="showAnaButton1" disabled type="primary"
                    >评估中...</o-button
                  >
                  <o-button
                    v-if="showGoButton1"
                    type="primary"
                    @click="goAimPage"
                    >查看报告</o-button
                  >
                </div>
              </div>
            </div>
          </li>
        </ul>
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
    // padding-right: 50px;
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
      :deep #txt {
        &::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        &::-webkit-scrollbar-thumb {
          border-radius: 3px;
          background-color: #d8d8d8;
          background-clip: content-box;
        }

        &::-webkit-scrollbar-track {
          border-radius: 3px;
          box-shadow: inset 0 0 2px rgba($color: #000000, $alpha: 0.2);
          background: #ffffff;
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
        width: 510px;
        .no-aim {
          font-size: 14px;
          text-align: center;
          margin-top: 63px;
          &-middle {
            color: #999;
            margin: 16px 0;
          }
          &-bottom {
            color: #0d8dff;
            cursor: pointer;
          }
          .o-icon {
            font-size: 40px;
          }
        }
        .have-aim {
          margin-top: 16px;
          display: flex;
          flex-direction: column;
          p {
            color: #999;
            font-size: 14px;
          }
          .o-button {
            align-self: flex-end;
            margin-top: 48px;
          }
        }
        .assess-head {
          display: flex;
          justify-content: space-between;

          .tab-container {
            display: flex;
            font-size: 12px;
            color: #555;
            line-height: 38px;
            .active {
              color: #0d8dff;
              border-bottom: 1px solid #0d8dff;
            }
            p {
              cursor: pointer;
            }
            span {
              cursor: pointer;
              margin-right: 16px;
            }
          }
        }
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
          width: 510px;
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
        &-detail {
          display: flex;
          align-items: center;
          .o-icon {
            margin-right: 8px;
          }
        }
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
          cursor: pointer;
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
