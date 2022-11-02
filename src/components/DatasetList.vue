<script setup>
import IconNecessary from '~icons/app/necessary.svg';
import { reactive, defineExpose } from 'vue';

const datasetData = reactive({
  key: '',
  owner: '',
  name: '',
  File: '',
});
defineExpose({ datasetData });
</script>
<template>
  <div class="dataset-params">
    <div class="params-key">
      <div class="key-icon">
        <o-icon><icon-necessary></icon-necessary></o-icon>
        <span>引用参数</span>
      </div>
      <el-input v-model="datasetData.key" placeholder="请输入引用参数" />
    </div>
    <div class="params-value">
      <div class="value-icon">
        <o-icon><icon-necessary></icon-necessary></o-icon>
        <span>参数值（数据集名以dataset-开头）</span>
      </div>
      <div class="value-input">
        <div class="user-name">
          <el-input
            v-model="datasetData.owner"
            placeholder="请输入用户名"
          /><span>/</span>
        </div>
        <div class="dataset-name">
          <el-input
            v-model="datasetData.name"
            placeholder="请输入数据集名称"
          /><span>/</span>
        </div>
        <div class="file-path">
          <el-input
            v-model="datasetData.File"
            placeholder="请输入文件路径（非必填）"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.dataset-params {
  padding: 16px;
  margin-bottom: 20px;
  background-color: #f5f6f8;
  position: relative;

  .params-key {
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
      display: flex;
      align-items: center;
      span {
        margin-left: 4px;
        margin-right: 4px;
      }
      .user-name {
        display: flex;
        width: 30%;
        span {
          margin-left: 4px;
          margin-right: 4px;
        }
      }
      .dataset-name {
        display: flex;
        width: 40%;
        span {
          margin-left: 4px;
          margin-right: 4px;
        }
      }
      .file-path {
        display: flex;
        width: 50%;
        span {
          margin-left: 4px;
          margin-right: 4px;
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
</style>
