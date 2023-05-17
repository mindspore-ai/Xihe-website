<script setup>
import { ref } from 'vue';

import privacy from '@/assets/statement/privacy.md?raw';
import competitionPrivacy from '@/assets/statement/competition_privacy.md?raw';
import MdStatement from '@/components/MdStatement.vue';

const activeName = ref('first');
</script>

<template>
  <div class="privacy">
    <div class="privacy-header">
      <div class="wrap">隐私政策</div>
    </div>
    <div class="privacy-content">
      <el-tabs v-model="activeName" class="demo-tabs">
        <el-tab-pane label="平台相关隐私政策" name="first">
          <MdStatement :statement="privacy"></MdStatement>
        </el-tab-pane>
        <el-tab-pane label="比赛相关隐私政策" name="second">
          <MdStatement :statement="competitionPrivacy"></MdStatement>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.privacy {
  background: #f5f6f8;
  &-header {
    padding-top: 80px;
    background-size: cover;
    background-image: url('@/assets/imgs/banner-head.png');
    .wrap {
      max-width: 1472px;
      margin: 0 auto;
      padding: 42px 16px 70px;
      color: #000;
      font-size: 36px;
    }
  }
  &-content {
    // background-color: red;
    max-width: 1472px;
    margin: 0 auto;
    padding-left: 16px;
    padding-right: 16px;
  }
}
:deep(.el-tabs) {
  .el-tabs__header {
    background: #ffffff;
    .el-tabs__nav-wrap::after {
      position: static !important;
    }
    .el-tabs__nav-scroll {
      line-height: 48px;
      width: 50%;
      margin: 0 auto;
      display: flex;
      justify-content: center;
      .el-tabs__item {
        font-size: 16px;
        color: #000000;
      }
      .el-tabs__item.is-active {
        color: #0d8dff;
      }
      .el-tabs__active-bar {
        display: none;
      }
    }
  }
  .el-tabs__content {
    .statement,
    .markdown-file {
      padding-top: 0px;
    }
  }
}
</style>
