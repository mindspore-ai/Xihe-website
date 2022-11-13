<script setup>
import IconNecessary from '~icons/app/necessary.svg';
import { reactive, defineExpose } from 'vue';

const modelData = reactive({
  key: '',
  owner: '',
  name: '',
  File: '',
});
const rules = reactive({
  key: [
    {
      required: true,
      message: '必填项',
      trigger: 'blur',
    },
  ],
  owner: [
    {
      required: true,
      message: '必填项',
      trigger: 'blur',
    },
  ],
  name: [
    {
      required: true,
      message: '必填项',
      trigger: 'blur',
    },
    // {
    //   pattern: /^[a-zA-Z0-9_]{5,50}$/,
    //   message: '请输入一个5-50位且只包含大小写字母、数字、下划线的名称',
    //   trigger: 'blur',
    // },
  ],
});
async function checkParams(formEl) {
  if (!formEl) return;
  await formEl.validate((valid) => {
    if (valid) {
      return true;
    } else {
      return false;
    }
  });
}
defineExpose({ modelData, checkParams });
</script>
<template>
  <div class="model-params">
    <el-form ref="queryRef" :model="modelData" :rules="rules">
      <div class="params-key">
        <el-form-item prop="key" class="key-item">
          <div class="key-icon">
            <o-icon><icon-necessary></icon-necessary></o-icon>
            <span>引用参数</span>
          </div>
          <el-input v-model="modelData.key" placeholder="请输入引用参数" />
        </el-form-item>
      </div>
      <div class="params-value">
        <div class="value-icon">
          <o-icon><icon-necessary></icon-necessary></o-icon>
          <span>参数值</span>
        </div>

        <div class="value-input">
          <el-form-item prop="owner" class="user-item">
            <div class="user-name">
              <el-input
                v-model="modelData.owner"
                placeholder="请输入用户名"
              /><span>/</span>
            </div>
          </el-form-item>
          <el-form-item prop="name" class="dataset-item">
            <div class="dataset-name">
              <el-input
                v-model="modelData.name"
                placeholder="请输入模型名称"
              /><span>/</span>
            </div>
          </el-form-item>
          <el-form-item class="file-item">
            <div class="file-path">
              <el-input
                v-model="modelData.File"
                placeholder="请输入文件路径（非必填）"
              />
            </div>
          </el-form-item>
        </div>
      </div>
    </el-form>
  </div>
</template>
<style lang="scss" scoped>
.model-params {
  padding: 16px 16px 25px;
  margin-bottom: 20px;
  background-color: #f5f6f8;
  position: relative;

  .params-key {
    margin-bottom: 20px;
    .key-item {
      margin-bottom: 16px;
      .o-icon {
        font-size: 8px !important;
        position: relative;
        top: 3px;
      }
      .key-icon {
        display: flex;
        align-items: center;
      }
    }
  }
  .params-value {
    .o-icon {
      font-size: 8px !important;
      position: relative;
      top: 3px;
    }
    .value-icon {
      display: flex;
      align-items: center;
    }
    .value-input {
      width: 100%;
      display: flex;
      align-items: center;
      .el-form-item {
        margin-bottom: 0px;
      }
      span {
        margin-left: 4px;
        margin-right: 4px;
      }
      .user-item {
        width: 25%;
        .user-name {
          display: flex;
          // width: 30%;
          span {
            margin-left: 4px;
            margin-right: 4px;
          }
        }
      }
      .dataset-item {
        width: 35%;
        .dataset-name {
          display: flex;
          span {
            margin-left: 4px;
            margin-right: 4px;
          }
        }
      }
      .file-item {
        width: 40%;
        .file-path {
          width: 100%;
          display: flex;
          span {
            margin-left: 4px;
            margin-right: 4px;
          }
        }
      }
    }
  }
  .deleteBtn {
    position: absolute;
    top: 50%;
    right: -26px;
    cursor: pointer;
    .o-icon {
      font-size: 22px !important;
    }
  }
}
:deep(.el-form) {
  width: 100%;
  .el-form-item {
    margin-left: 0px !important;
    // margin-bottom: 16px;
    .el-form-item__content {
      margin-left: 0px !important;
    }
  }
}
</style>
