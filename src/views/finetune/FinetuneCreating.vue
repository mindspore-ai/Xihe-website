<script setup>
import { ref, reactive } from 'vue';
// import { useRoute, useRouter } from 'vue-router';
import IconNecessary from '~icons/app/necessary.svg';
// import IconAddBlue from '~icons/app/add-blue';

import { ElMessage } from 'element-plus';
import { ArrowRight } from '@element-plus/icons-vue';

// import { createTrainProject } from '@/api/api-project';

// import { useUserInfoStore } from '@/stores';
import OButton from '@/components/OButton.vue';

// const userInfoStore = useUserInfoStore();

// const route = useRoute();
// const router = useRouter();
const tips = ref(false); //控制创建训练弹窗
const queryRef = ref(null);
const dataset = ref(''); //输入数据集输入框
const model = ref(''); //预训练模型输入框

const form = reactive({
  name: '', //任务名称
  taskType: '', //任务类型
  jobType: '微调', //任务类型
  code_dir: '',
  boot_file: '',
  datasets: [],
  hyperparameter: [],
  env: [],
  models: [],
  desc: '',
});

// 任务类型
const options = reactive([
  {
    value: '以图生文',
    label: '以图生文',
  },
]);
// 超参选项
const hyperParams = reactive([
  { label: 'epochs =', value: '' },
  { label: 'start learning_rate =', value: '' },
  { label: 'end learning_rate =', value: '' },
]);

// 按顺序校验表单数据是否校验通过
function verify(node, code, message) {
  return new Promise((resolve, reject) => {
    node.validateField(code, (valid) => {
      if (!valid) {
        ElMessage({
          type: 'error',
          message,
          duration: 4000,
          center: true,
        });
        reject('未通过');
      } else {
        resolve();
      }
    });
  });
}

const checkBootfile = (rule, value, callback) => {
  if (value === '') {
    callback();
  } else {
    // 判断数组的第一个元素只含有数字，字母，下划线
    let arr = value.split('.');
    if (arr[0].match(/^[a-zA-Z0-9_/]+$/) && arr[1] === 'py') {
      callback();
    } else {
      callback(
        new Error('启动文件名只能包含数字，字母，下划线，斜杠，且为.py文件')
      );
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
      pattern: /^[a-zA-Z0-9_]{5,50}$/,
      message: '请输入一个5-50位且只包含大小写字母、数字、下划线的名称',
      trigger: 'blur',
    },
  ],
  SDK: [
    {
      required: true,
      message: '必填项',
      trigger: 'blur',
    },
  ],
  code_dir: [
    {
      required: true,
      message: '必填项',
      trigger: 'blur',
    },
    { pattern: /\/$/, message: '请输入以 / 结尾的路径格式', trigger: 'blur' },
  ],
  boot_file: [
    {
      required: true,
      message: '必填项',
      trigger: 'blur',
    },
    { validator: checkBootfile, trigger: 'blur' },
  ],
});

// 多选超参
function selectHyperParams(value) {
  console.log('value: ', value);
}

function changeTasktype(val) {
  console.log('val: ', val);
  if (val === '以图生文') {
    (dataset.value = '以图生文数据集'), (model.value = '以图生文预训练模型');
  }
}
</script>
<template>
  <div class="createtune">
    <div class="createtune-wrap">
      <div class="tune-bread">
        <el-breadcrumb :separator-icon="ArrowRight">
          <el-breadcrumb-item :to="{ path: '/finetune' }"
            >大模型微调</el-breadcrumb-item
          >
          <el-breadcrumb-item>创建微调任务</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="createtune-content">
        <div class="createtune-content-title">创建微调任务</div>
        <div class="createtune-content-tip">
          TODO~~~~~
          <!-- <a
            href="https://xihe-docs.mindspore.cn/zh/tutorial/train/"
            target="_blank"
            style="color: #0d8dff"
            >表单方式-创建训练实例</a
          > -->
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
            <div class="createtune-form-item">
              <div class="item-title">
                <o-icon><icon-necessary></icon-necessary></o-icon>
              </div>
              <el-form-item prop="SDK" label="任务类型">
                <el-select
                  v-model="form.taskType"
                  placeholder="请选择"
                  @change="changeTasktype"
                >
                  <!-- <el-option label="ModelArts" value="ModelArts" /> -->
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
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
                <el-select
                  v-model="form.jobType"
                  placeholder="请选择"
                  class="job-type"
                >
                  <el-option label="微调" value="ModelArts" />
                </el-select>
              </el-form-item>
            </div>
            <div class="createtune-form-item">
              <div class="item-title">
                <o-icon><icon-necessary></icon-necessary></o-icon>
              </div>
              <el-form-item label="训练服务">
                <div class="service">
                  1*Ascend 910（32GB）｜ARM： 96核 360GB
                </div>
              </el-form-item>
            </div>
            <div class="createtune-form-item">
              <el-form-item label="超参">
                <el-checkbox
                  v-for="item in hyperParams"
                  :key="item.value"
                  :label="item.label"
                  @change="selectHyperParams(item.value)"
                >
                  <span>
                    {{ item.label }}
                  </span>
                  <el-input v-model="item.value" />
                </el-checkbox>
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
            @click="tips = true"
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
    padding: 50px 90px 64px;
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
      padding: 16px 32px;
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
          position: relative;
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
        }
      }
      &-action {
        display: flex;
        justify-content: center;
        margin-top: 48px;
        margin-bottom: 32px;
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
    margin-bottom: 26px;
    margin-left: 10px;
    .service {
      line-height: 17px;
      font-size: 14px;
      color: #555555;
    }
    .el-form-item__content {
      // width: 100%;
      width: 546px;
      max-width: 546px;
      margin-left: 27px;
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
    .el-form-item__label::before {
      width: 18px;
      height: 18px;
    }
  }
}
:deep(.el-checkbox) {
  width: 100%;
  margin-bottom: 16px;
  // background-color: #bfa;
  margin-right: 0px;
  .el-checkbox__label {
    width: 100%;
    color: #555;
    padding-left: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .el-input {
      width: 60% !important;
    }
  }
}
</style>
