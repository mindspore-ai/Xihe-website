<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ArrowRight } from '@element-plus/icons-vue';

import { getTaskDetail } from '@/api/api-course';

const route = useRoute();
console.log('route: ', route.params);
// console.log('route: ', route.params.chapterId);
const router = useRouter();
function getTask() {
  getTaskDetail(route.params.courseId, route.params.taskId).then((res) => {
    console.log('res: ', res);
  });
}
// getTask();
</script>
<template>
  <div class="task-detail">
    <div class="task-detail-wrap">
      <div class="task-bread">
        <el-breadcrumb :separator-icon="ArrowRight">
          <el-breadcrumb-item :to="{ path: '/course' }">
            课程
          </el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: `/` }">
            AI大模型公开课
          </el-breadcrumb-item>
          <el-breadcrumb-item> chapterData.name </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="task-content">
        <div class="task-name">dfs</div>
        <div class="task-introduce">dfds</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.task-detail {
  max-width: 100%;
  min-height: calc(100vh - 200px);
  margin-top: 80px;
  background-color: #f5f6f8;
  .task-detail-wrap {
    max-width: 1440px;
    height: 100%;
    padding: 40px 0px 64px;
    margin: 0 auto;
    .task-bread {
      .el-breadcrumb {
        height: 21px;
        line-height: 21px;
        font-size: 12px;
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
    .task-content {
      .task-name {
        line-height: 48px;
        font-size: 36px;
        color: #000000;
        margin: 40px 0;
      }
      .task-introduce {
        height: 865px;
        padding: 40px;
        background: #ffffff;
        box-shadow: 0px 1px 5px 0px rgba(45, 47, 51, 0.1);
      }
    }
  }
}
</style>
