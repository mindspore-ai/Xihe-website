<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';

import { ArrowRightBold } from '@element-plus/icons-vue';

import taskCard from '@/views/course/CourseTaskCard.vue';
import OButton from '@/components/OButton.vue';
import emptyImg from '@/assets/imgs/model-empty.png';

import { getTaskList, getProject, increaseProject } from '@/api/api-course';
import { useCourseData } from '@/stores';

const router = useRouter();

const taskInput = ref('');
const activeName = ref('');
const taskData = ref([]);
const currentTaskData = ref([]); // 当前页显示的课程
const taskResult = ref({}); //作业提交结果（关联项目）
const showSubmission = ref(false);

const userCourseData = useCourseData();

const taskPager = reactive({
  page: 1,
  size: 6,
});

function getTask(id, status) {
  getTaskList(id, status).then((res) => {
    if (res.data) {
      taskData.value = res.data;
    } else {
      taskData.value = [];
    }
    currentTaskData.value = taskData.value.slice(0, taskPager.size);
  });
}
getTask(userCourseData.courseData.id, '');
function toggleTaskState(val) {
  getTask(userCourseData.courseData.id, val.props.name);
}

function handleClick(tab) {
  if (tab.props.label === '作业提交') {
    getProject(userCourseData.courseData.id).then((res) => {
      taskResult.value = res.data;
      showSubmission.value = true;
    });
  }
}

// 关联项目
async function relateProject() {
  const [owner, project_name] = taskInput.value.split('/');
  const params = { owner, project_name };
  try {
    await increaseProject(params, userCourseData.courseData.id);
    ElMessage({
      type: 'success',
      message: '关联项目成功！',
      duration: 4000,
    });
    const res = await getProject(userCourseData.courseData.id);
    taskResult.value = res.data;
    taskInput.value = '';
    // showSubmission.value = true;
  } catch (err) {
    if (err.response.data.msg === "name's length should be between 3 to 35") {
      ElMessage({
        type: 'warning',
        message: '关联项目失败，格式应为：用户名/项目名。',
        duration: 4000,
      });
    } else if (err.response.data.code === 'course_does_not_own_project') {
      ElMessage({
        type: 'warning',
        message: '关联项目失败，请关联自己的项目。',
        duration: 4000,
      });
    } else if (err.response.data.msg === "doc doesn't exist") {
      ElMessage({
        type: 'error',
        message: '关联项目失败,请检查后重试~',
        duration: 4000,
      });
    }
    taskInput.value = '';
  }
}

function goProjectDetail(item) {
  router.push(`/projects/${item[0].owner}/${item[0].name}`);
}

const layout = ref('prev, pager, next');
// 课程分页器
function handleCurrentPage(val) {
  taskPager.page = val;
  currentTaskData.value = taskData.value.slice(
    taskPager.page * taskPager.size - taskPager.size,
    taskPager.page * taskPager.size
  );
  toTop();
}
function toTop() {
  document.documentElement.scrollTop = 0;
}
</script>
<template>
  <div class="task-content">
    <el-tabs class="task-tabs" @tab-click="handleClick">
      <el-tab-pane label="作业列表" class="task-list">
        <div class="task-list-tabs">
          <el-tabs
            v-model="activeName"
            type="card"
            @tab-click="toggleTaskState"
          >
            <el-tab-pane label="竞赛状态" name="status" disabled> </el-tab-pane>
            <el-tab-pane label="全部" name=""></el-tab-pane>
            <el-tab-pane label="未完成" name="not-finish"></el-tab-pane>
            <el-tab-pane label="已完成" name="finish"></el-tab-pane>
          </el-tabs>
          <!-- 作业列表 -->
          <div v-if="taskData.length" class="task-info">
            <div
              v-for="item in currentTaskData"
              :key="item.id"
              class="task-box"
            >
              <div class="task-title">
                <div class="title">
                  <span v-if="item.status === 'finish'" class="task-done"
                    >已完成</span
                  >
                  <span v-else class="task-doning">未完成</span>
                  <span class="task-name"> {{ item.name }} </span>
                </div>
                <div class="arrows">
                  <el-icon><ArrowRightBold /></el-icon>
                </div>
              </div>
              <div class="task-result">
                <span class="grade">分数：{{ item.score }}</span>
                <span>提交截止时间：{{ item.deadline }}</span>
              </div>
            </div>
            <div class="pagination">
              <el-pagination
                hide-on-single-page
                :current-page="taskPager.page"
                :page-size="taskPager.size"
                :total="taskData.length"
                :layout="layout"
                @current-change="handleCurrentPage"
              ></el-pagination>
            </div>
          </div>
          <div v-if="activeName === '' && !taskData.length" class="empty">
            <img :src="emptyImg" alt="" />
            <p>暂无作业</p>
          </div>
          <div
            v-if="activeName === 'not-finish' && !taskData.length"
            class="empty"
          >
            <img :src="emptyImg" alt="" />
            <p>暂无未完成作业</p>
          </div>
          <div v-if="activeName === 'finish' && !taskData.length" class="empty">
            <img :src="emptyImg" alt="" />
            <p>暂无已完成作业</p>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="作业提交" class="task-submission">
        <div v-if="showSubmission">
          <div class="title">作业提交</div>
          <div class="task-explain">
            <span>请先</span>
            <router-link
              class="creat-project"
              to="/new/projects"
              target="_blank"
            >
              点击此处
            </router-link>
            <span>
              创建AI实验室仓库，然后在此输入”用户名/项目名“进行关联，关联项目用于提交该课程相关作业。
            </span>
          </div>
          <div v-if="taskResult.related_project">
            <taskCard
              :card-data="taskResult"
              class="task-card"
              @click="goProjectDetail(taskResult.related_project)"
            ></taskCard>
          </div>
          <div class="task-input">
            <el-input v-model="taskInput" placeholder="请输入用户名/项目名" />
          </div>
          <div class="task-btn">
            <OButton
              v-if="taskResult.related_project && taskInput"
              size="small"
              type="primary"
              @click="relateProject(taskInput)"
            >
              更新项目
            </OButton>
            <OButton
              v-if="taskResult.related_project && !taskInput"
              size="small"
              type="primary"
              disabled
            >
              更新项目
            </OButton>
            <OButton
              v-if="!taskResult.related_project && taskInput"
              size="small"
              type="primary"
              @click="relateProject(taskInput)"
            >
              关联项目
            </OButton>
            <OButton
              v-if="!taskResult.related_project && !taskInput"
              size="small"
              type="primary"
              disabled
            >
              关联项目
            </OButton>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style lang="scss" scoped>
.task-content {
  padding: 0px 160px 40px;
  .task-list {
    .task-info {
      margin-top: 24px;
      .task-box {
        padding: 24px 0px;
        border-top: 1px solid #d8d8d8;
        cursor: pointer;
        .task-title {
          line-height: 18px;
          margin-bottom: 28px;
          display: flex;
          justify-content: space-between;
          .title {
            .task-done,
            .task-doning {
              font-size: 12px;
              color: #999;
              padding: 6px 8px;
              background-color: #f7f8fa;
              border-radius: 8px;
              border: 1px solid #e5e5e5;
            }
            .task-doning {
              color: #0d8dff;
              border: 1px solid #dbedff;
            }
            .task-name {
              font-size: 16px;
              color: #000000;
              font-weight: 550;
              margin-left: 8px;
            }
          }
        }
        .task-result {
          line-height: 17px;
          font-size: 14px;
          color: #555555;
          .grade {
            margin-right: 64px;
          }
        }
      }
      .pagination {
        margin-top: 16px;
        display: flex;
        justify-content: center;
        .el-pagination {
          background-color: red !important;
        }
      }
    }
    .empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 56px 0;
      img {
        width: 280px;
      }
      p {
        color: #555555;
        margin-top: 24px;
        font-size: 18px;
      }
    }
  }
  .task-submission {
    margin-top: 8px;
    .title {
      line-height: 32px;
      font-size: 24px;
      color: #000000;
      // font-weight: 550;
      line-height: 40px;
      position: absolute;
      top: 0px;
      left: 0px;
    }
    .task-explain {
      height: 22px;
      line-height: 22px;
      font-size: 14px;
      color: #555;
      margin-bottom: 24px;
      .creat-project {
        color: #0d8dff;
        cursor: pointer;
      }
    }
    .task-card {
      margin-bottom: 24px;
    }
    .task-input {
      .el-input {
        max-width: 2000px;
        width: 100% !important;
        margin-bottom: 40px;
      }
    }
    .task-btn {
      display: flex;
      justify-content: center;
      .o-button {
        width: 112px;
        height: 40px;
      }
    }
  }
}
:deep(.el-tabs) {
  margin-top: 20px;
  position: relative;
  .el-tabs__header {
    display: flex;
    justify-content: flex-end;
    font-size: 16px;
    margin-bottom: 0px;
    .el-tabs__nav-wrap {
      .el-tabs__nav {
        line-height: 22px;
        .el-tabs__item {
          font-size: 16px;
          color: #555;
        }
      }
      &::after {
        display: none;
      }
    }
  }
  .el-tabs__content {
    position: static;
  }
}
.task-list-tabs {
  :deep(.el-tabs) {
    position: static;
    .el-tabs__header {
      display: flex;
      justify-content: flex-start;
      font-size: 14px;
      line-height: 48px;
      border-bottom: none;
      align-items: center;
      position: absolute;
      top: 0;
      .el-tabs__nav {
        border: none;
      }
      .el-tabs__item {
        border: none;
        line-height: 28px;
        height: 28px;
        margin: 14px 6px;
        padding: 0 12px;
        &:first-child {
          color: #000;
          font-weight: 550;
          margin-left: 0px;
          padding-left: 0px;
          margin-right: 28px;
        }
      }
      .is-active {
        box-shadow: 0 0 0 1px #0d8dff inset;
        color: #0d8dff !important;
      }
    }
  }
}
</style>
