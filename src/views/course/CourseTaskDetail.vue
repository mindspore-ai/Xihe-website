<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ArrowRight } from '@element-plus/icons-vue';

import { handleMarkdown } from '@/shared/markdown';
import { getTaskDetail } from '@/api/api-course';
import { getGuide } from '@/api/api-competition';

const route = useRoute();
console.log('route: ', route.params);
const router = useRouter();
const taskData = ref({});

const mkit = handleMarkdown();
const codeString = ref('');
const result = ref();
let README = '';
async function getTask() {
  try {
    const res = await getTaskDetail(route.params.courseId, route.params.taskId);
    taskData.value = res.data;
    console.log('taskData.value: ', taskData.value);
    const tree = await getGuide(taskData.value.desc);
    README = tree.data;
    codeString.value = README;
    result.value = mkit.render(codeString.value);
  } catch (err) {
    console.error(err);
  }
}
getTask();
</script>
<template>
  <div class="task-detail">
    <div class="task-detail-wrap">
      <div class="task-bread">
        <el-breadcrumb :separator-icon="ArrowRight">
          <el-breadcrumb-item :to="{ path: '/course' }">
            课程
          </el-breadcrumb-item>
          <el-breadcrumb-item
            :to="{ path: `/course/${route.params.courseId}` }"
          >
            {{ taskData.course_name }}
          </el-breadcrumb-item>
          <el-breadcrumb-item>
            {{ taskData.asg_name }}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="task-content">
        <div class="task-name">{{ taskData.asg_name }}</div>
        <div class="task-introduce" v-html="result"></div>
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
        padding: 40px;
        background: #ffffff;
        box-shadow: 0px 1px 5px 0px rgba(45, 47, 51, 0.1);
      }
    }
  }
}
</style>
