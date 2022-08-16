<script setup>
import OButton from '@/components/OButton.vue';

import IconUpload from '~icons/app/submit';

const tableData = [
  {
    date: '1',
    name: 'Tom',
    address: 'No. 189',
  },
  {
    date: '2',
    name: 'Tom',
    address: 'No. 189',
  },
  {
    date: '3',
    name: 'Tomnnnnnnnnnnnnnnnnnn',
    address: 'No. 189',
  },
];
</script>
<template>
  <div class="submit-page">
    <div class="left">
      <div class="header">
        <div class="header-title">提交结果</div>
        <div class="header-button">
          <span>每日限提交1次（限制条件待更新）</span>
          <OButton type="primary" size="small">提交结果</OButton>
        </div>
      </div>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="name">
          <template #header>
            <o-icon><icon-upload></icon-upload> </o-icon
            >提交的最新结果（显示最近3条）
          </template>
        </el-table-column>
        <el-table-column prop="address" label="提交时间" width="171" />
        <el-table-column prop="address" label="我的分数" width="104" />
      </el-table>
    </div>
    <div class="right">
      <div class="header">关联项目</div>
      <div class="guide">
        请先在昇思大模型体验平台创建项目，上传代码，后关联项目
      </div>
      <el-input></el-input>
      <div class="submit">
        <div></div>
        <OButton type="primary" size="small">提交</OButton>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.submit-page {
  max-width: 1472px;
  padding: 36px 40px 40px;
  min-height: 319px;
  display: flex;
  justify-content: space-between;
  .left {
    padding-top: 24px;
    padding-bottom: 24px;
    width: 100%;
    padding-right: 56px;
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      color: #555555;
      &-title {
        font-size: 24px;
        color: #000000;
        line-height: 32px;
      }
      .o-button {
        margin-left: 8px;
      }
    }
    .el-table {
      margin-top: 24px;
      --el-table-header-bg-color: #e5e8f0;
      --el-table-header-text-color: #555;
    }
    :deep(.el-table__inner-wrapper) {
      .el-table__cell {
        padding: 0;
        .cell {
          display: flex;
          .o-icon {
            font-size: 24px;
            line-height: 24px;
            margin-right: 6px;
          }
        }
      }
      .el-table__header {
        color: #000000;
        .cell {
          padding: 13px 24px;
        }
      }
      .el-table__body {
        .cell {
          padding: 16px 24px;
        }
      }
    }
  }
  .right {
    padding-top: 24px;
    padding-left: 56px;
    border-left: 2px solid #d8d8d8;
    .header {
      font-size: 24px;
    }
    .guide {
      font-size: 14px;
      color: #555555;
      margin: 8px 0 24px;
    }
    .submit {
      margin-top: 16px;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
