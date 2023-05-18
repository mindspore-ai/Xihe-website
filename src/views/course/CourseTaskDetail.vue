<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ArrowRight } from '@element-plus/icons-vue';

import { handleMarkdown } from '@/shared/markdown';
import { getTaskDetail } from '@/api/api-course';
import { getGuide } from '@/api/api-competition';

const route = useRoute();
const router = useRouter();
const taskData = ref({});
const showDetail = ref(false);

const mkit = handleMarkdown();
const codeString = ref('');
const result = ref();
let README = '';
async function getTask() {
  try {
    const res = await getTaskDetail(route.params.courseId, route.params.taskId);
    taskData.value = res.data;
    const tree = await getGuide(taskData.value.desc);
    README = tree.data;
    codeString.value = README;
    result.value = mkit.render(codeString.value);
    showDetail.value = true;
  } catch (err) {
    router.push(`/course/${route.params.courseId}`);
  }
}
getTask();
</script>
<template>
  <div v-if="showDetail" class="task-detail">
    <div class="task-detail-wrap">
      <div class="task-bread">
        <el-breadcrumb :separator-icon="ArrowRight">
          <el-breadcrumb-item :to="{ path: '/course' }">
            课程
          </el-breadcrumb-item>
          <el-breadcrumb-item
            :to="{ path: `/course/${route.params.courseId}/task` }"
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
        <div v-dompurify-html="result" class="markdown-file"></div>
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
    max-width: 1416px;
    height: 100%;
    padding: 40px 0px 64px;
    margin: 0 auto;
    .task-content {
      .task-name {
        line-height: 48px;
        font-size: 36px;
        color: #000000;
        margin: 40px 0;
        font-weight: 300;
      }
      .markdown-file {
        padding: 40px;
        background: #ffffff;
        border-radius: 16px;
      }
    }
  }
}
</style>
