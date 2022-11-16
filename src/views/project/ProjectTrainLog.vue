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
import { formatSeconds } from '@/shared/utils';

import IconFinished from '~icons/app/finished';
import IconStopped from '~icons/app/stopped';
import IconRuning from '~icons/app/runing';
import IconFailed from '~icons/app/failed';
import IconPoppver from '~icons/app/popover.svg';

import { LOGIN_KEYS } from '@/shared/login';

const DOMAIN = import.meta.env.VITE_DOMAIN;

const evaluateUrl = ref('');

const ruleRef = ref(null);

const trainDetail = ref({});
const configurationInfo = ref({});

const route = useRoute();
const router = useRouter();

const logUrl = ref('');
const outputUrl = ref('');

// 当前项目的详情数据
const detailData = computed(() => {
  return useFileData().fileStoreData;
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

const i18n = {
  title: '评估',
  desc: '训练日志可视化，请按顺序输入超参数范围，目前只支持LossMonitor, 详情请参考文档，更多的参数评估请选用自定义评估',
  learning: {
    name: 'learning_rate',
    placeholder: '请输入例如0.01, 0.02, 0.03的字段',
  },
  momentum: { name: 'momentum', placeholder: '请输入例如0.9, 0.99的字段' },
  batch: { name: 'batch_size', placeholder: '请输入例如 32, 64的字段' },
};

const query = reactive({
  learning_rate_scope: '',
  momentum_scope: '',
  batch_size_scope: '',
  type: 'standard',
});

const rules = reactive({
  learning_rate_scope: [
    { required: true, message: '必填项', trigger: 'blur' },
    {
      pattern: /^[0-9]+([.]{1}[0-9]+){0,1}(,\s*[0-9]+([.]{1}[0-9]+){0,1})*$/,
      message: '请输入例如0.01, 0.02, 0.03的字段',
      trigger: 'blur',
    },
  ],
  momentum_scope: [
    { required: true, message: '必填项', trigger: 'blur' },
    {
      pattern: /^[0-9]+([.]{1}[0-9]+){0,1}(,\s*[0-9]+([.]{1}[0-9]+){0,1})*$/,
      message: '请输入例如0.9, 0.99的字段',
      trigger: 'blur',
    },
  ],
  batch_size_scope: [
    { required: true, message: '必填项', trigger: 'blur' },
    {
      pattern: /^[1-9]\d*(,[1-9]\d*)*$/,
      message: '请输入例如32, 64的字段',
      trigger: 'blur',
    },
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

const isDone = ref(false);

const btnContent = ref('开始评估');

const logName = ref('');
const outputName = ref('');

const isEvaluating = ref(false);
const isEvaluated = ref(false);

const isCusEvaluating = ref(false);
const isCusEvaluated = ref(false);

const requestData = ref({
  learning_rate_scope: [],
  batch_size_scope: [],
  momentum_scope: [],
  type: 'standard',
});

// 获取日志
function handleGetLog() {
  getTrainLog({
    projectId: detailData.value.id,
    trainId: route.params.trainId,
    type: 'log',
  }).then((res) => {
    if (res.status === 202 && res.data.data) {
      logUrl.value = res.data.data.log_url;

      logName.value = 'train.log';
    } else {
      logName.value = '';
    }
  });
}

// 获取输出
function handleGetOutput() {
  getTrainLog({
    projectId: detailData.value.id,
    trainId: route.params.trainId,
    type: 'output',
  }).then((res) => {
    if (res.status === 202 && res.data.data) {
      outputUrl.value = res.data.data.log_url;

      outputName.value = 'tar.gz';
    } else {
      outputName.value = '';
    }
  });
}

const isAim = ref(null);
// 日志
const socket = new WebSocket(
  `wss://${DOMAIN}/server/train/project/${detailData.value.id}/training/${route.params.trainId}`,
  [getHeaderConfig().headers['private-token']]
);

// 当websocket接收到服务端发来的消息时，自动会触发这个函数。
socket.onmessage = function (event) {
  nextTick(() => {
    try {
      trainDetail.value = JSON.parse(event.data).data;
      if (trainDetail.value) {
        form.name = trainDetail.value.name;
        form.desc = trainDetail.value.log;
        configurationInfo.value = trainDetail.value.compute;
        isDone.value = trainDetail.value.is_done;
        isAim.value = trainDetail.value.enable_aim;

        // 训练未完成 true ；自定义时 aim_path为空时 true
        if (trainDetail.value.status === 'Completed') {
          handleGetLog();
          handleGetOutput();
          isCusEvaluating.value = false;
          if (
            (trainDetail.value.enable_aim && trainDetail.value.aim_path) ||
            !trainDetail.value.enable_aim
          ) {
            isEvaluating.value = false;
            isCusEvaluated.value = true;
          } else {
            isEvaluating.value = true;
            isCusEvaluated.value = false;
          }
        } else {
          isEvaluating.value = true;
          isCusEvaluating.value = true;
        }
      }
    } catch (e) {
      console.error(e);
    }
  });
};

// 页面刷新
function reloadPage() {
  socket.close();
}

// 评估
function setEvaluateWebscoket(id, type, isReset) {
  const ws = new WebSocket(
    `wss://${DOMAIN}/server/evaluate/project/${detailData.value.id}/training/${route.params.trainId}/evaluate/${id}`,
    [getHeaderConfig().headers['private-token']]
  );

  ws.onmessage = function (event) {
    // 推理出url 断开websocket
    if (type === 'standard') {
      // 自动评估
      if (!isReset) {
        try {
          if (JSON.parse(event.data).data.access_url) {
            btnContent.value = '查看报告';
            resetContent.value = '重新评估';

            resetEvaluting.value = false;
            isEvaluating.value = false;
            isEvaluated.value = true;

            evaluateUrl.value = JSON.parse(event.data).data.access_url;
            ws.close();
          } else if (JSON.parse(event.data).data.error) {
            btnContent.value = '开始评估';
            isEvaluating.value = false;

            resetContent.value = '重新评估';
            resetEvaluting.value = false;
            ElMessage({
              type: 'error',
              message: JSON.parse(event.data).data.error,
            });
            ws.close();
          }
        } catch (e) {
          console.error(e);
        }
      } else {
        try {
          console.log(JSON.parse(event.data));
        } catch (e) {
          console.error(e);
        }
      }
    } else {
      try {
        // 自定义评估
        if (JSON.parse(event.data).data.access_url) {
          customContent.value = '查看报告';
          isCusEvaluating.value = false;
          isCusEvaluated.value = true;

          evaluateUrl.value = JSON.parse(event.data).data.access_url;

          ws.close();
        } else if (JSON.parse(event.data).data.error) {
          customContent.value = '开始评估';
          isCusEvaluating.value = false;

          ElMessage({
            type: 'error',
            message: JSON.parse(event.data).data.error,
          });

          ws.close();
        }
      } catch (e) {
        console.error(e);
      }
    }
  };
}
const resetContent = ref('重新评估');
const resetEvaluting = ref(false);
// 重新评估
function resetEvaluate() {
  requestData.value.learning_rate_scope = query.learning_rate_scope.split(',');
  requestData.value.batch_size_scope = query.batch_size_scope.split(',');
  requestData.value.momentum_scope = query.momentum_scope.split(',');

  ruleRef.value.validate((valid) => {
    if (valid) {
      resetEvaluting.value = true;
      resetContent.value = '评估中...';
      autoEvaluate(
        requestData.value,
        detailData.value.id,
        route.params.trainId
      ).then((res) => {
        if (res.status === 201) {
          if (res.data.data.error) {
            resetEvaluting.value = false;
            resetContent.value = '重新评估';
            ElMessage({
              type: 'error',
              message: res.data.data.error,
            });
          } else {
            setEvaluateWebscoket(res.data.data.evaluate_id, 'standard');
          }
        }

        requestData.value = {
          learning_rate_scope: [],
          batch_size_scope: [],
          momentum_scope: [],
        };
      });
    } else {
      ElMessage({
        type: 'error',
        message: '请按要求输入信息',
      });
    }
  });
}

// 自动评估
function saveSetting() {
  requestData.value.learning_rate_scope = query.learning_rate_scope.split(',');
  requestData.value.batch_size_scope = query.batch_size_scope.split(',');
  requestData.value.momentum_scope = query.momentum_scope.split(',');

  ruleRef.value.validate((valid) => {
    if (valid) {
      isEvaluating.value = true;
      btnContent.value = '评估中...';
      autoEvaluate(
        requestData.value,
        detailData.value.id,
        route.params.trainId
      ).then((res) => {
        if (res.status === 201) {
          if (res.data.data.error) {
            isEvaluating.value = false;
            btnContent.value = '开始评估';
            ElMessage({
              type: 'error',
              message: res.data.data.error,
            });
          } else if (res.data.data.access_url) {
            isEvaluated.value = true;
            isEvaluating.value = false;
            btnContent.value = '查看报告';
            evaluateUrl.value = res.data.data.access_url;
          } else {
            setEvaluateWebscoket(res.data.data.evaluate_id, 'standard');
          }
        } else {
          isEvaluating.value = false;
          btnContent.value = '开始评估';

          ElMessage({
            type: 'error',
            message: res.data.data.msg,
          });
        }

        requestData.value = {
          learning_rate_scope: [],
          batch_size_scope: [],
          momentum_scope: [],
          type: 'standard',
        };
      });
    } else {
      ElMessage({
        type: 'error',
        message: '请按要求输入信息',
      });
    }
  });
}
const customContent = ref('开始评估');

// 自定义评估
function handleAssessment() {
  isCusEvaluating.value = true;
  customContent.value = '评估中...';

  let params = {
    type: 'custom',
  };

  autoEvaluate(params, detailData.value.id, route.params.trainId).then(
    (res) => {
      if (res.status === 201) {
        if (res.data.data.access_url) {
          customContent.value = '查看报告';
          isCusEvaluating.value = false;
          isCusEvaluated.value = true;
          evaluateUrl.value = res.data.data.access_url;
        } else if (res.data.data.error) {
          customContent.value = '开始评估';
          isCusEvaluating.value = false;
          ElMessage({
            type: 'error',
            message: res.data.data.error,
          });
        } else {
          setEvaluateWebscoket(res.data.data.evaluate_id, 'custom');
        }
      } else {
        ElMessage({
          type: 'error',
          message: res.data.data.msg,
        });
      }
    }
  );
}

// 跳转到Aim嵌入页面
function goAimPage() {
  let routerData = router.resolve({
    path: `/projects/${detailData.value.owner}/${detailData.value.name}/projectAim`,
    query: {
      url: evaluateUrl.value,
      path: route.path,
    },
  });
  window.open(routerData.href, '_blank');
}

// 跳到评估页面
function goToPage() {
  let routerData = router.resolve({
    path: `/projects/${detailData.value.owner}/${detailData.value.name}/projectAim`,
    query: {
      url: evaluateUrl.value,
      path: route.path,
    },
  });
  window.open(routerData.href, '_blank');
}

const downloadBlob = (blob, fileName) => {
  try {
    const href = window.URL.createObjectURL(blob); //创建下载的链接
    if (window.navigator.msSaveBlob) {
      window.navigator.msSaveBlob(blob, fileName);
    } else {
      // 创建a标签 添加download属性下载
      const downloadElement = document.createElement('a');
      downloadElement.href = href;
      downloadElement.target = '_blank';
      downloadElement.download = fileName;
      document.body.appendChild(downloadElement);
      downloadElement.click(); // 点击下载
      document.body.removeChild(downloadElement); // 下载完成移除元素
      window.URL.revokeObjectURL(href); // 释放掉blob对象
    }
  } catch (e) {
    console.error(e);
  }
};

function handleNofileClick() {
  ElMessage({
    type: 'warning',
    message: '训练中,请训练完成后点击下载',
  });
}

async function downloadLogFile() {
  if (!logUrl.value) {
    ElMessage({
      type: 'warning',
      message: '训练中,请训练完成后点击下载',
    });
    return;
  }

  let url = logUrl.value;
  let data = await fetch(url)
    .then((response) => response.blob())
    .then((res) => {
      let blod = new Blob([res]);
      let name = 'train.log';
      downloadBlob(blod, name);
    });

  return data;
}

onMounted(() => {
  window.addEventListener('beforeunload', () => reloadPage());
});

onUnmounted(() => {
  socket.close();
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
        <span>训练名称</span>
        <el-input v-model="form.name" disabled> </el-input>
      </div>
      <div class="train-log-desc">
        <el-input id="txt" v-model="form.desc" type="textarea" readonly />
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
            <div class="info-list-detail">{{ trainDetail.created_at }}</div>
          </li>
          <li class="info-list">
            <div class="info-list-title">运行状态</div>
            <div class="info-list-detail">
              <div class="status-box">
                <div
                  v-if="trainDetail.status === 'Completed'"
                  class="status-item"
                >
                  <o-icon><icon-finished></icon-finished></o-icon>
                  <span>已完成</span>
                </div>

                <div
                  v-if="trainDetail.status === 'Terminated'"
                  class="status-item"
                >
                  <o-icon><icon-stopped></icon-stopped></o-icon>
                  <span>已终止</span>
                </div>

                <div
                  v-if="trainDetail.status === 'Running'"
                  class="status-item"
                >
                  <o-icon><icon-runing></icon-runing></o-icon>
                  <span>运行中</span>
                </div>

                <div
                  v-if="trainDetail.status === 'scheduling'"
                  class="status-item"
                >
                  <o-icon><icon-runing></icon-runing></o-icon>
                  <span> 启动中</span>
                </div>

                <div v-if="trainDetail.status === 'Failed'" class="status-item">
                  <o-icon><icon-failed></icon-failed></o-icon>
                  <span> 训练失败</span>
                </div>

                <div
                  v-if="trainDetail.status === 'schedule_failed'"
                  class="status-item"
                >
                  <o-icon><icon-failed></icon-failed></o-icon>
                  <span> 启动失败 </span>
                </div>
              </div>
            </div>
          </li>
          <li class="info-list">
            <div class="info-list-title">运行时长</div>
            <div class="info-list-detail">
              {{ formatSeconds(trainDetail.duration) }}
            </div>
          </li>
          <li class="info-list">
            <div class="info-list-title">AI引擎</div>
            <div class="info-list-detail">
              {{ configurationInfo.version }}
            </div>
          </li>
          <li class="info-list">
            <div class="info-list-title">计算节点个数</div>
            <div class="info-list-detail">1</div>
          </li>
          <li class="info-list">
            <div class="info-list-title">规格</div>
            <div class="info-list-detail">{{ configurationInfo.flavor }}</div>
          </li>
          <li class="info-list">
            <div class="info-list-title">日志文件</div>
            <div class="info-list-detail document" @click="downloadLogFile">
              {{ logUrl === '' ? '训练中' : logName }}
            </div>
          </li>
          <li class="info-list">
            <div class="info-list-title">
              <span class="train-output">训练输出</span>
              <el-popover
                placement="bottom-start"
                :width="372"
                trigger="hover"
                :teleported="true"
              >
                <template #reference>
                  <o-icon style="font-size: 20px"
                    ><icon-poppver></icon-poppver
                  ></o-icon>
                </template>
                <div class="icon-tip" style="font-size: 12px">
                  在解析参数output_path下生成的文件，一般为训练输出的权重文件或者是训练保存的图片。
                </div>
              </el-popover>
            </div>
            <div class="info-list-detail document">
              <a v-if="outputUrl" :href="outputUrl">{{ outputName }}</a>
              <p v-else><span @click="handleNofileClick">训练中</span></p>
            </div>
          </li>

          <li class="assess-box">
            <div class="assess-head">
              <p class="assess-title">{{ i18n.title }}</p>
            </div>
            <!-- 自动评估 -->
            <div v-if="!isAim">
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
                    prop="learning_rate_scope"
                  >
                    <el-input
                      v-model="query.learning_rate_scope"
                      :placeholder="i18n.learning.placeholder"
                    ></el-input>
                  </el-form-item>
                  <el-form-item
                    :label="i18n.momentum.name"
                    prop="momentum_scope"
                  >
                    <el-input
                      v-model="query.momentum_scope"
                      :placeholder="i18n.momentum.placeholder"
                    ></el-input>
                  </el-form-item>
                  <el-form-item
                    :label="i18n.batch.name"
                    prop="batch_size_scope"
                  >
                    <el-input
                      v-model="query.batch_size_scope"
                      :placeholder="i18n.batch.placeholder"
                    ></el-input>
                  </el-form-item>
                </el-form>

                <div class="info-btn">
                  <o-button
                    v-if="!isEvaluated"
                    :disabled="isEvaluating"
                    type="primary"
                    @click="saveSetting"
                    >{{ btnContent }}</o-button
                  >

                  <o-button
                    v-if="isEvaluated"
                    :disabled="resetEvaluting"
                    type="primary"
                    style="margin-right: 8px"
                    @click="resetEvaluate"
                    >{{ resetContent }}</o-button
                  >

                  <o-button
                    v-if="isEvaluated"
                    :disabled="resetEvaluting"
                    type="primary"
                    @click="goToPage"
                    >查看报告</o-button
                  >
                </div>
              </div>
            </div>
            <!-- 自定义评估 -->
            <div v-if="isAim">
              <div class="have-aim">
                <p>
                  请确保是否支持适配自定义评估代码，运行失败详情请参考添加评估代码
                </p>
                <div class="info-btn">
                  <o-button
                    v-if="!isCusEvaluated"
                    :disabled="isCusEvaluating"
                    type="primary"
                    @click="handleAssessment"
                    >{{ customContent }}</o-button
                  >

                  <a :href="`${evaluateUrl}`" onclick="return false">
                    <o-button type="primary" @click="goAimPage"
                      >查看报告</o-button
                    >
                  </a>
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
    margin-top: 30px;
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
    .train-log-name {
      span {
        margin-right: 8px;
        font-size: 18px;
        color: #000;
      }
    }
    .train-log-desc {
      width: 100%;
      height: 750px;
      position: relative;
      img {
        width: 60px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
      .el-textarea {
        width: 100% !important;
        height: 100%;
        margin-top: 24px;
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
            left: calc(100% + 10px);
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
          margin-top: 35px;
          &:first-child {
            margin-top: 16px;
          }
          .el-form-item__label {
            width: 110px;
            text-align: left;
          }
          .el-form-item__content {
            .el-form-item__error {
              top: 50px;
              left: 0;
            }
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
          flex: 1;
          align-items: center;
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
          .o-icon {
            margin-right: 8px;
          }
        }
        &-title {
          width: 110px;
          font-size: 16px;
          display: flex;
          align-items: center;
          .train-output {
            margin-right: 4px;
          }
          .icon-tip {
            padding: 24px 16px;
            font-size: 12px;
            color: #555555;
            line-height: 20px;
          }
        }
        &-detail {
          font-size: 14px;
          margin-left: 30px;
        }
        .document {
          color: #0d8dff;
          margin-left: 32px;
          overflow: hidden;
          text-overflow: ellipsis;
          cursor: pointer;
          a {
            color: #0d8dff;
          }
        }
      }
    }
  }
}
</style>
