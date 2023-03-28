<script setup>
import { ref, reactive } from 'vue';

import { ArrowRightBold } from '@element-plus/icons-vue';

import taskcard from '@/views/course/CourseTaskCard.vue';
import OButton from '@/components/OButton.vue';

const taskInput = ref('');
const activeName = ref('all');

const taskList = reactive([
  {
    id: '1',
    name: 'DCGAN_demo',
    like_count: 1,
    update_at: '2022-11-23',
    owner: 'yyj',
    avatar_id:
      'https://obs-xihe-beijing4.obs.cn-north-4.myhuaweicloud.com/xihe-img/default_avatar/catimg_07.png',
    cover_id: '1',
  },
  {
    id: '2',
    name: 'fdssds',
    like_count: 12222,
    update_at: '2023-11-13',
    owner: 'fdsfs',
    avatar_id:
      'https://obs-xihe-beijing4.obs.cn-north-1.myhuaweicloud.com/xihe-img/default_avatar/catimg_07.png',
    cover_id: '2',
  },
]);
function handleClick(val) {
  console.log(val);
}
</script>
<template>
  <div class="task-content">
    <el-tabs class="task-tabs">
      <el-tab-pane label="作业列表" class="task-list">
        <div class="task-list-tabs">
          <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane label="竞赛状态" name="" disabled> </el-tab-pane>
            <el-tab-pane label="全部" name="all">
              <div class="task-info">
                <div class="task-title">
                  <div class="title">
                    <span class="task-done">已完成</span>
                    <span class="task-doning">未完成</span>
                    <span class="task-name"> 作业名称 </span>
                  </div>
                  <div class="arrows">
                    <el-icon><ArrowRightBold /></el-icon>
                  </div>
                </div>
                <div class="task-result">
                  <span class="grade">分数：99</span>
                  <span>提交截止时间：2023年2月4日</span>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="未完成" name="doing">aaa </el-tab-pane>
            <el-tab-pane label="已完成" name="done">ddd </el-tab-pane>
          </el-tabs>
        </div>
      </el-tab-pane>
      <el-tab-pane label="作业提交" class="task-submission">
        <div class="title">作业提交</div>
        <div class="task-explain">
          <span>请先</span>
          <router-link class="creat-project" to="/new/projects" target="_blank">
            点击此处
          </router-link>
          <span>
            创建Private项目，然后在此输入”用户名/项目名“进行关联，关联项目用于提交该课程相关作业。
          </span>
        </div>
        <div v-for="item in taskList" :key="item.id" class="task-card">
          <taskcard
            :card-data="item"
            class="card-list-item-content"
            @click="goDetail(item)"
          ></taskcard>
        </div>
        <div class="task-input">
          <el-input v-model="taskInput" placeholder="请输入用户名/项目名" />
        </div>
        <div class="task-btn">
          <OButton
            size="small"
            type="primary"
            @click="relateProject(taskInput)"
          >
            关联项目
          </OButton>
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
      padding: 24px 0px;
      border-top: 1px solid #d8d8d8;
      border-bottom: 1px solid #d8d8d8;
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
    .el-tab-pane {
    }
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
          margin-right: 34px;
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
