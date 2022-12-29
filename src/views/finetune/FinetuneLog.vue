<script setup>
import { ref, reactive } from 'vue';
// import { useRoute, useRouter } from 'vue-router';
// import IconAddBlue from '~icons/app/add-blue';

import { ArrowRight } from '@element-plus/icons-vue';

// import { createTrainProject } from '@/api/api-project';

// import { useUserInfoStore } from '@/stores';
import OButton from '@/components/OButton.vue';

// const userInfoStore = useUserInfoStore();

// const route = useRoute();
// const router = useRouter();

const finetuneLog = ref('');
</script>
<template>
  <div class="finetune-log">
    <div class="finetune-log-wrap">
      <div class="finetune-bread">
        <el-breadcrumb :separator-icon="ArrowRight">
          <el-breadcrumb-item :to="{ path: '/finetune' }"
            >大模型微调</el-breadcrumb-item
          >
          <el-breadcrumb-item>任务日志</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="finetune-log-content">
        <div class="finetune-log-title">任务名</div>
        <div class="finetune-log-detail">
          <el-input id="txt" v-model="finetuneLog" type="textarea" readonly />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.finetune-log {
  max-width: 100%;
  min-height: calc(100vh - 200px);
  margin-top: 80px;
  background-color: #f5f6f8;
  .finetune-log-wrap {
    max-width: 1440px;
    height: 100%;
    padding: 50px 90px 64px;
    margin: 0 auto;
    .finetune-bread {
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
    .finetune-log-content {
      padding: 24px 40px 64px;
      background-color: #fff;

      .finetune-log-title {
        line-height: 32px;
        margin-bottom: 24px;
        font-size: 18px;
        color: #000;
      }
      .finetune-log-detail {
        width: 100%;
        height: 710px;
        position: relative;
        /* img {
          width: 60px;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        } */
        .el-textarea {
          width: 100% !important;
          height: 100%;
          //margin-top: 24px;
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
  }
}
</style>
