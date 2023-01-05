<script setup>
import { ref, reactive } from 'vue';
// import { useRoute, useRouter } from 'vue-router';
import IconNecessary from '~icons/app/necessary.svg';
// import IconAddBlue from '~icons/app/add-blue';

import { ArrowRight } from '@element-plus/icons-vue';

import { createFinetune } from '@/api/api-finetune';

// import {  useUserInfoStore } from '@/stores';
import OButton from '@/components/OButton.vue';

// const userInfoStore = useUserInfoStore();

// const route = useRoute();
// const router = useRouter();
const queryRef = ref(null);
const dataset = ref(''); //输入数据集输入框
const model = ref(''); //预训练模型输入框
const jobType = ref('微调');
const taskType = ref('');
const tips = ref(null);

const form = reactive({
  name: '', //任务名称
  taskType: '', //任务类型
  jobType: '', //作业类型
  hyperparameter: [],
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
  { label: 'epochs', checked: false, val: '', tips: '' },
  { label: 'start_learning_rate', checked: false, val: '', tips: '' },
  { label: 'end_learning_rate', checked: false, val: '', tips: '' },
]);

// const checkList = ref([]);

function a(a) {
  console.log(a);
}
// 按顺序校验表单数据是否校验通过
/* function verify(node, code, message) {
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
} */

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
});

// 校验超参
function checkInt(item) {
  // console.log('item: ', item);
  console.log(tips.value);
  if (item.label === 'epochs') {
    const reg = /^[+]{0,1}(\d+)$/;
    // if (item.val) {
    if (item.val && !reg.test(item.val)) {
      console.log(11111);
      item.tips = '请输入一个正整数';
    } else {
      item.tips = '';
    }
    // } else {
    //   item.tips = '';
    // }
    console.log('epochs');
  } else if (item.label === 'start_learning_rate') {
    console.log('start_learning_rate');
  } else {
    console.log('inputValue: ', hyperParams[1].val);
    console.log('end_learning_rate');
  }
}

function changeTasktype(val) {
  if (val === '以图生文') {
    dataset.value = '以图生文数据集';
    model.value = '以图生文预训练模型';
  }
}

// 创建微调任务
function confirmCreating(formEl) {
  console.log('formEl: ', formEl);
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      let newParams = hyperParams.filter((item) => {
        return item.checked;
      });
      console.log('hyperParams: ', newParams);
      newParams.forEach((item) => {
        form.hyperparameter.push({ key: item.label, value: item.val });
      });
      let params = {
        hyperparameter: form.hyperparameter,
        model: 'opt-caption',
        name: form.name,
        task: 'finetune',
      };
      console.log(params);
      createFinetune(params).then((res) => {
        console.log('res: ', res);
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
        <div class="createtune-content-tip">TODO~~~~~</div>
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
              <el-form-item prop="taskType" label="任务类型">
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
                  v-model="jobType"
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
                  :key="item.label"
                  v-model="item.checked"
                  :label="item.label"
                >
                  <div class="paramsName">
                    <span>
                      {{ item.label }}
                    </span>
                    <span>=</span>
                  </div>
                  <el-input
                    v-model="item.val"
                    :disabled="!item.checked"
                    @blur="checkInt(item)"
                  />
                  <p ref="tips" class="tips">{{ item.tips }}</p>
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
  margin-bottom: 26px;
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
    .paramsName {
      span {
        &:first-child {
          margin-right: 16px;
        }
      }
    }
    .tips {
      font-size: 12px;
      position: absolute;
      color: var(--el-color-danger);
      left: 240px;
      bottom: -20px;
    }
  }
}
</style>
