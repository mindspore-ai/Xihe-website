<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';

import privacy from '@/assets/statement/privacy.md?raw';
import competitionPrivacy from '@/assets/statement/competition_privacy.md?raw';
import finetunePrivacy from '@/assets/statement/finetune_privacy.md?raw';
import MdStatement from '@/components/MdStatement.vue';
import { router } from '@/routers';

const route = useRoute();
const activeName = ref('');
function getPrivacyType() {
  if (route.query.type) {
    activeName.value = route.query.type;
  } else {
    activeName.value = '';
  }
}
getPrivacyType();
function handleClick(tab) {
  let query = {};
  if (tab.index === '2') {
    query = { type: 'finetune' };
  } else if (tab.index === '1') {
    query = { type: 'competition' };
  }
  router.push({ path: '/privacy', query });
}
</script>

<template>
  <div class="privacy">
    <div class="privacy-header">
      <div class="wrap">隐私政策</div>
    </div>
    <div class="privacy-content">
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="平台相关隐私政策" name="">
          <MdStatement :statement="privacy"></MdStatement>
        </el-tab-pane>
        <el-tab-pane label="比赛和课程相关隐私政策" name="competition">
          <MdStatement :statement="competitionPrivacy"></MdStatement>
        </el-tab-pane>
        <el-tab-pane label="微调相关隐私政策" name="finetune">
          <MdStatement :statement="finetunePrivacy"></MdStatement>
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
      max-width: 1448px;
      margin: 0 auto;
      padding: 42px 16px 70px;
      color: #000;
      font-size: 36px;
    }
  }
  &-content {
    max-width: 1448px;
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
