<script setup>
import { ref, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import { formatSeconds } from '@/shared/utils';

import IconRebuild from '~icons/app/rebuild';
import IconStop from '~icons/app/stop';
import IconRemove from '~icons/app/remove';
import IconFinished from '~icons/app/finished';
import IconStopped from '~icons/app/stopped';
import IconRuning from '~icons/app/runing';
import IconFailed from '~icons/app/failed';
import IconFile from '~icons/app/project';
import IconArrowRight from '~icons/app/arrow-right';

import step1 from '@/assets/imgs/finetune/step1.png';
import step2 from '@/assets/imgs/finetune/step2.png';
import step3 from '@/assets/imgs/finetune/step3.png';
import step4 from '@/assets/imgs/finetune/step4.png';
import arrows from '@/assets/imgs/finetune/arrows.png';

import OIcon from '@/components/OIcon.vue';
import OButton from '@/components/OButton.vue';
import DeleteTrain from '@/components/DeleteTrain.vue';
import StopTrain from '@/components/StopTrain.vue';
import ResetTrain from '@/components/ResetTrain.vue';

let i18n = {
  head: {
    title: '大模型微调',
    introduce:
      '基于平台内置的自动太初跨模态预训练大模型，提供多种典型下游任务模板；极简模式、零代码开发、仅需少量配置即可快速启动训练',
  },
  table: {
    title: '任务列表',
    remainTime: '剩余体验时间：',
  },
};

// const route = useRoute();
const router = useRouter();
// const userInfoStore = useUserInfoStore();

// const projectId = detailData.value.id;
const listId = ref(null);
const trainId = ref(null);
const resetedId = ref(null);
const showStep = ref(false);
const showtable = ref(false);

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
    // stepArrows: arrows,
  },
]);

// 训练数据TODO:
// const trainData = [];
const trainData = [
  {
    created_at: '2022-11-28',
    desc: '',
    duration: 150,
    error: '',
    id: '63847c0f61d98bcc9bc7db51',
    is_done: true,
    name: 'aaaaaaaa',
    status: 'Completed',
    frame: 'mindspore',
    type: '微调',
    resource: '1*Ascend 910D备份 4',
  },
  {
    created_at: '2022-11-28',
    desc: '',
    duration: 150,
    error: '',
    id: '63847c0f61d98bcc9bc7db51',
    is_done: true,
    name: 'aaaaaaaa',
    status: 'Completed',
    frame: 'mindspore',
    type: '微调',
    resource: '1*Ascend 910D备份 4',
  },
];

// 切换申请步骤弹窗
function toggleApplication() {
  showtable.value = true;
  showStep.value = false;
}

function goCreateTune() {
  router.push('/finetune-creating');
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
</script>

<template>
  <div class="modelzoo-tune">
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
            {{ i18n.table.title }}
          </div>
          <div class="remain-time">
            {{ i18n.table.remainTime }}
          </div>
        </div>
        <el-table :data="trainData" style="width: 100%">
          <el-table-column label="任务名称/ID" width="180">
            <template #default="scope">
              <div>
                <span class="train-name" @click="goTrainLog(scope.row.id)">{{
                  scope.row.name
                }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="130">
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

                <div v-if="scope.row.status === 'Running'" class="status-item">
                  <o-icon><icon-runing></icon-runing></o-icon>
                  <span>运行中</span>
                </div>

                <div
                  v-if="scope.row.status === 'scheduling'"
                  class="status-item"
                >
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

          <el-table-column label="运行时长" width="148">
            <template #default="scope">
              <div>
                {{ formatSeconds(scope.row.duration) }}
              </div>
            </template>
          </el-table-column>

          <el-table-column label="任务框架" width="180">
            <template #default="scope">
              <div>
                <span class="task-frame" @click="goTrainLog(scope.row.id)">{{
                  scope.row.frame
                }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="作业类型" width="460">
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
                  {{ scope.row.type }}
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

          <el-table-column label="资源占用" prop="resource" width="190">
          </el-table-column>
          <el-table-column label="更新时间" prop="created_at" width="152">
          </el-table-column>
          <template #empty>
            <div class="instance-box">
              <o-icon> <icon-file></icon-file> </o-icon>
              <p>暂未创建微调任务</p>
            </div>
          </template>
        </el-table>
        <div class="create-btn">
          <o-button type="primary" @click="goCreateTune">
            创建训练实例
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
            <!-- <div v-if="item.stepImg !== step4" class="step-arrows">
              <img :src="item.stepArrows" alt="" />
            </div> -->
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
  </div>
  <o-dialog :show="showStep" :close="false">
    <template #head>
      <p class="dlg-title">申请步骤</p>
    </template>

    <div class="dlg-body">
      申请说明文字申请说明文字申请说明文字申请说明文字申请说明文字申请说明文字申请说明文字申请说明文字申请说明文字申请说明文字申请说明文字申请说明文字申请说明文字申请说明文字申请说明文字
    </div>

    <template #foot>
      <div class="dlg-btn">
        <OButton type="primary" size="small" @click="toggleApplication"
          >我知道啦</OButton
        >
      </div>
    </template>
  </o-dialog>
</template>

<style lang="scss" scoped>
$theme: #0d8dff;
.wrap {
  margin: 0 auto;
  padding: 48px 16px 120px;
  max-width: 1472px;
}
.modelzoo-tune {
  background-color: #f5f6f8;
  // height: calc(100vh - 434px);
  .modelzoo-head {
    padding-top: 80px;
    background-size: cover;
    background-image: url('@/assets/imgs/banner-head.png');
    .wrap {
      display: flex;
      justify-content: space-between;
      padding: 42px 16px;
      color: #fff;
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
    max-width: 1472px;
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
        // background-color: blue;
        // display: grid;
        // grid-template-columns: repeat(4, 25%);
        // column-gap: 7%;
        .step-item {
          // width: 25%;
          display: flex;
          align-items: center;
          // float: left;
          // justify-content: space-between;
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
            // margin: 0 73px;
            // @media screen and (max-width: 1280px) {
            //   margin: 0 50px;
            // }
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
    // width: 100% !important;
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
</style>
