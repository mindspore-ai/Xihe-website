<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import IconNecessary from '~icons/app/necessary.svg';
import IconPoppver from '~icons/app/popover.svg';

import { ArrowRight } from '@element-plus/icons-vue';

import OButton from '@/components/OButton.vue';

import { createFinetune } from '@/api/api-finetune';

const router = useRouter();
const queryRef = ref(null);
const dataset = ref(''); //输入数据集输入框
const model = ref(''); //预训练模型输入框
const jobType = ref('微调');
const params1 = ref(false);
const params2 = ref(false);
const params3 = ref(false);
const epochsChecked = ref(true);
const startChecked = ref(true);
const endChecked = ref(true);
const taskType = ref(null);

const form = reactive({
  name: '', //任务名称
  taskType: '', //任务类型
  jobType: '', //作业类型
  epochs: '10',
  start_learning_rate: '1e-05',
  end_learning_rate: '1e-07',
});

// 任务类型
const options = reactive([
  {
    value: '以图生文',
    label: '以图生文',
  },
]);

// 作业类型
const jobTypeOptions = [
  {
    value: 'finetune',
    label: '微调',
  },
  {
    value: 'evaluate',
    label: '评估（ 敬请期待 ）',
    disabled: true,
  },
  {
    value: 'inference',
    label: '推理（ 敬请期待 ）',
    disabled: true,
  },
];

const checkStartRate = (rule, value, callback) => {
  if (value === '') {
    callback();
  } else {
    // 科学计数法
    const reg1 = /^([\+|-]?\d+(.{0}|.\d+))[Ee]{1}([\+|-]?\d+)$/g;
    // 正浮点数
    const reg2 = /^(?:[1-9][0-9]*\.[0-9]+|0\.(?!0+$)[0-9]+)$/;
    if (reg1.test(value) || reg2.test(value)) {
      callback();
    } else {
      callback(new Error('请输入一个正浮点数'));
    }
  }
};

const checkEndRate = (rule, value, callback) => {
  if (value === '') {
    callback();
  } else {
    // 科学计数法
    const reg1 = /^([\+|-]?\d+(.{0}|.\d+))[Ee]{1}([\+|-]?\d+)$/g;
    // 正浮点数
    const reg2 = /^(?:[1-9][0-9]*\.[0-9]+|0\.(?!0+$)[0-9]+)$/g;
    if (reg1.test(value) || reg2.test(value)) {
      // start参数也是科学计数法
      let bool =
        form.start_learning_rate.indexOf('E') !== -1 ||
        value.indexOf('e') !== -1;
      // 如果start和end都是科学计数法
      if ((value.indexOf('E') !== -1 || value.indexOf('e') !== -1) && bool) {
        let newStartRate = new Number(form.start_learning_rate);
        let newEndRate = new Number(value);
        if (newEndRate <= newStartRate) {
          callback();
        } else {
          callback(new Error('请输入一个小于或等于start_learning_rate的值'));
        }
      } else {
        if (value <= form.start_learning_rate) {
          callback();
        } else {
          callback(new Error('请输入一个小于或等于start_learning_rate的值'));
        }
      }
    }
  }
};

const rules = reactive({
  name: [
    {
      required: true,
      message: '必填项',
      trigger: 'blur',
    },
    {
      pattern: /^[a-zA-Z0-9_]{1,25}$/,
      message: '请输入一个1-25位且只包含大小写字母、数字、下划线的名称',
      trigger: 'blur',
    },
  ],
  taskType: [
    {
      required: true,
      message: '必填项',
      trigger: 'blur',
    },
  ],
  epochs: [
    {
      pattern: /^[+]{0,1}(\d+)$/,
      message: '请输入一个正整数',
      trigger: 'blur',
    },
  ],
  start_learning_rate: [
    /* {
      pattern: /^(?:[1-9][0-9]*\.[0-9]+|0\.(?!0+$)[0-9]+)$/,
      message: '请输入一个正浮点数',
      trigger: 'blur',
    }, */
    { validator: checkStartRate, trigger: 'blur' },
  ],
  end_learning_rate: [
    // {
    //   pattern: /^(?:[1-9][0-9]*\.[0-9]+|0\.(?!0+$)[0-9]+)$/,
    //   message: '请输入一个正浮点数,且需小于start_learning_rate的值',
    //   trigger: 'blur',
    // },
    { validator: checkEndRate, trigger: 'blur' },
  ],
});

function changeEpochs(val) {
  if (!val) {
    form.epochs = '10';
  }
  epochsChecked.value = !val;
}
function changeStart(val) {
  if (!val) {
    form.start_learning_rate = '1e-05';
  }
  startChecked.value = !val;
}
function changeEnd(val) {
  if (!val) {
    form.end_learning_rate = '1e-07';
  }
  endChecked.value = !val;
}

function changeTasktype(val) {
  taskType.value.style.marginBottom = '38px';
  if (val === '以图生文') {
    dataset.value = '以图生文数据集';
    model.value = '以图生文预训练模型';
  }
}

// 创建微调任务
function confirmCreating(formEl) {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      if (!params1.value) {
        form.epochs = '';
      }
      if (!params2.value) {
        form.start_learning_rate = '';
      }
      if (!params3.value) {
        form.end_learning_rate = '';
        console.log(3333);
      }
      let hyperparameter = [
        {
          key: 'epochs',
          value: form.epochs,
        },
        {
          key: 'start_learning_rate',
          value: form.start_learning_rate,
        },
        {
          key: 'end_learning_rate',
          value: form.end_learning_rate,
        },
      ];
      let params = {
        hyperparameter: hyperparameter,
        model: 'opt-caption',
        name: form.name,
        task: 'finetune',
      };
      console.log('params: ', params);
      createFinetune(params).then(() => {
        ElMessage({
          type: 'success',
          message: '创建微调任务成功',
          center: true,
        });
        setTimeout(() => {
          router.push({
            name: 'finetune',
          });
        }, 500);
      });
    } else {
      return false;
    }
  });
}
</script>
<template>
  <div class="createtune">
    <div class="createtune-wrap">
      <div class="tune-bread">
        <el-breadcrumb :separator-icon="ArrowRight">
          <el-breadcrumb-item :to="{ path: '/finetune' }">
            大模型微调
          </el-breadcrumb-item>
          <el-breadcrumb-item>创建微调任务</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="createtune-content">
        <div class="createtune-content-title">创建微调任务</div>
        <div class="createtune-content-tip">
          支持多种任务类型，提供微调/评估/推理能力，可自定义关键超参数，目前仅支持内置数据集体验。
        </div>
        <div class="createtune-form-wrap">
          <el-form
            ref="queryRef"
            :model="form"
            :rules="rules"
            label-width="100px"
            label-position="left"
            hide-required-asterisk
          >
            <div class="createtune-form-item">
              <div class="item-title">
                <o-icon><icon-necessary></icon-necessary></o-icon>
              </div>
              <el-form-item prop="name" label="任务名称">
                <el-input v-model="form.name" placeholder="请输入任务名称" />
              </el-form-item>
            </div>
            <div ref="taskType" class="createtune-form-item taskType">
              <div class="item-title">
                <o-icon><icon-necessary></icon-necessary></o-icon>
              </div>
              <el-form-item prop="taskType" label="任务类型">
                <el-select
                  v-model="form.taskType"
                  placeholder="请选择"
                  @change="changeTasktype"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <div v-if="form.taskType === '以图生文'" class="tasktype-tips">
                <span>
                  以图生文，即让算法根据输入的一幅图自动生成对应的描述性的文字，是图像理解中非常重要的基础任务。您可以
                </span>
                <a
                  href="https://xihe.mindspore.cn/modelzoo/taichu"
                  target="_blank"
                  >在线体验</a
                >
                <span> 以图生文。 </span>
              </div>
            </div>
            <div class="createtune-form-item">
              <div class="item-title">
                <o-icon><icon-necessary></icon-necessary></o-icon>
              </div>
              <el-form-item label="训练输入数据">
                <div class="option">
                  <el-input v-model="dataset" disabled />
                </div>
              </el-form-item>
            </div>
            <div class="createtune-form-item">
              <div class="item-title">
                <o-icon><icon-necessary></icon-necessary></o-icon>
              </div>
              <el-form-item label="预训练模型">
                <div class="option">
                  <el-input v-model="model" disabled />
                </div>
              </el-form-item>
            </div>
            <div class="createtune-form-item">
              <div class="item-title">
                <o-icon><icon-necessary></icon-necessary></o-icon>
              </div>
              <el-form-item label="作业类型">
                <el-select v-model="jobType" class="job-type">
                  <el-option
                    v-for="item in jobTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    :disabled="item.disabled"
                  />
                </el-select>
              </el-form-item>
            </div>
            <div class="createtune-form-item">
              <div class="item-title">
                <o-icon><icon-necessary></icon-necessary></o-icon>
              </div>
              <el-form-item label="计算资源">
                <div class="service">1*Ascend 910(32G)|ARM:24核 96GB</div>
              </el-form-item>
            </div>
            <div class="createtune-form-item hyperparameter">
              <div class="item-icon">
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
                  <div>
                    <span style="color: red">epochs: </span>
                    值为正整数<br />
                    <span style="color: red">start_learning_rate: </span>
                    值为正浮点数，比如：0.001、1e-03、1E-03<br />
                    <span style="color: red">end_learning_rate: </span>
                    值为正浮点数，且需小于start_learning_rate的值，比如：0.0001、1e-04、1E-04<br />
                  </div>
                </el-popover>
              </div>
              <el-form-item prop="epochs" label="超参">
                <el-checkbox
                  v-model="params1"
                  size="large"
                  @change="changeEpochs"
                >
                  <span class="itemLabel">epochs</span>
                  <span class="equal-sign">=</span>
                </el-checkbox>
                <el-input
                  v-model="form.epochs"
                  :disabled="epochsChecked"
                  class="paramsInt"
                />
              </el-form-item>
            </div>
            <div class="createtune-form-item hyperparameter">
              <el-form-item prop="start_learning_rate" label=" ">
                <el-checkbox
                  v-model="params2"
                  size="large"
                  @change="changeStart"
                >
                  <span class="itemLabel">start_learning_rate</span>
                  <span class="equal-sign">=</span>
                </el-checkbox>

                <el-input
                  v-model="form.start_learning_rate"
                  :disabled="startChecked"
                  class="paramsInt"
                />
              </el-form-item>
            </div>
            <div class="createtune-form-item hyperparameter">
              <el-form-item prop="end_learning_rate" label=" ">
                <el-checkbox v-model="params3" size="large" @change="changeEnd">
                  <span class="itemLabel">end_learning_rate</span>
                  <span class="equal-sign">=</span>
                </el-checkbox>
                <el-input
                  v-model="form.end_learning_rate"
                  :disabled="endChecked"
                  class="paramsInt"
                />
              </el-form-item>
            </div>
          </el-form>
        </div>

        <div class="createtune-content-action">
          <o-button
            v-if="form.name && form.taskType"
            class="confim"
            type="primary"
            loading
            @click="confirmCreating(queryRef)"
            >创建</o-button
          >
          <o-button v-else class="confim2" disabled>创建</o-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.createtune {
  max-width: 100%;
  min-height: calc(100vh - 200px);
  margin-top: 80px;
  background-color: #f5f6f8;
  .createtune-wrap {
    max-width: 1440px;
    height: 100%;
    padding: 40px 0px 64px;
    margin: 0 auto;
    .tune-bread {
      margin-bottom: 40px;
      .el-breadcrumb {
        height: 21px;
        line-height: 21px;
        .el-breadcrumb__item {
          :deep(.el-breadcrumb__inner.is-link) {
            color: #555;
            font-weight: 400;
            &:hover {
              color: #0d8dff;
            }
          }
          :deep(.el-breadcrumb__separator.el-icon) {
            color: #555;
          }
        }
        :deep(.el-breadcrumb__item:last-child .el-breadcrumb__inner) {
          color: #000;
        }
      }
    }
    .createtune-content {
      padding: 24px 40px 64px;
      background-color: #fff;

      &-title {
        line-height: 32px;
        margin-bottom: 24px;
        font-size: 18px;
        color: #000;
      }
      &-tip {
        line-height: 22px;
        font-size: 14px;
        color: #999;
        margin-bottom: 40px;
      }
      .createtune-form-wrap {
        .createtune-form-item {
          margin-bottom: 26px;
          position: relative;
          .item-icon {
            position: absolute;
            top: 5px;
            left: 50px;
          }
          .item-title {
            position: absolute;
            top: 50%;
            transform: translateY(-40%);
            font-size: 8px;
          }
          .option {
            width: 100%;
            height: 36px;
            display: flex;
            .o-button {
              min-width: 80px;
              padding: 5px 28px;
              margin-left: 8px;
            }
          }
          .tasktype-tips {
            // width: 75%;
            margin-right: 28%;
            font-size: 12px;
            position: absolute;
            bottom: -34px;
            left: 140px;
            a {
              color: #0d8dff;
            }
          }
        }
        .taskType {
          // margin-bottom: 40px;
          line-height: 15px;
        }
        .hyperparameter {
          :deep(.el-form-item) {
            .el-form-item__content {
              .el-form-item__error {
                white-space: nowrap;
                top: calc(100% + 12px);
                left: 220px;
              }
            }
          }
        }
      }
      &-action {
        display: flex;
        justify-content: center;
        margin-top: 48px;
        .confim2 {
          background: #cee8ff;
          color: #fff;
          border: none;
        }
      }
    }
  }
}

:deep(.el-form) {
  font-size: 14px;
  color: #555;
  width: 70%;
  margin: 0 auto;
  .el-form-item {
    margin-bottom: 0px;
    margin-left: 10px;
    .service {
      line-height: 17px;
      font-size: 14px;
      color: #555555;
    }
    .el-form-item__content {
      width: 546px;
      max-width: 546px;
      margin-left: 27px;
      display: flex;
      justify-content: space-between;
      .o-icon {
        font-size: 16px;
      }
      .el-form-item__error {
        white-space: nowrap;
        top: calc(100% + 12px);
        left: 0;
      }
      .el-input {
        width: 100%;
        .el-input__wrapper {
          box-shadow: 0 0 0 1px #999 inset;
        }
      }
      .el-input.is-disabled .el-input__wrapper {
        background-color: #eee !important;
        .el-input__inner {
          -webkit-text-fill-color: #999;
        }
      }
      .paramsInt {
        width: 60%;
      }
      .el-input.is-disabled .el-input__wrapper {
        background-color: var(--el-disabled-bg-color);
      }
      .el-select {
        width: 100%;
      }
      .el-select.job-type {
        width: 30%;
      }
      .el-textarea {
        width: 100% !important;
        height: 284px;
        .el-textarea__inner {
          height: 100%;
        }
      }
    }
    .el-form-item__label {
      color: #555;
    }
    // .el-form-item__label::before {
    //   width: 18px;
    //   height: 18px;
    // }
  }
}
:deep(.el-checkbox) {
  .el-checkbox__input {
    .el-checkbox__inner {
      width: 18px;
      height: 18px;
      border: 2px solid #999;
      &::after {
        position: absolute;
        left: 6px;
        top: 2px;
      }
    }
  }
  .el-checkbox__label {
    color: #555;
    padding-left: 16px;
    .equal-sign {
      margin-left: 20px;
    }
  }
  .el-checkbox__input.is-checked .el-checkbox__inner {
    border: 2px solid var(--el-checkbox-checked-bg-color);
  }
}
.el-select-dropdown {
  .el-select-dropdown__list {
    .el-select-dropdown__item.is-disabled {
      color: var(--el-text-color-placeholder) !important;
    }
  }
}
</style>
