<!-- 课节页 -->
<script setup>
import { computed, inject } from 'vue';
import { useRouter } from 'vue-router';
import IconPlay from '~icons/app/play';
import { ArrowRightBold } from '@element-plus/icons-vue';
import { useCourseData } from '@/stores';
import { useLoginStore } from '@/stores';
import { goAuthorize, LOGIN_STATUS } from '@/shared/login';

const router = useRouter();
const loginStore = useLoginStore();
const userCourseData = useCourseData();
const goApplication = inject('goApplication');
// 课节信息
const corseSections = computed(() => {
  return userCourseData.courseData.sections;
});

// 把points属性名修改为lessons名
const sectionsResult = computed(() => {
  return corseSections.value.map(({ lessons, ...rest }) => ({
    lessons: lessons.map(({ points, ...rest }) => ({
      ...rest,
      lessons: points,
    })),
    ...rest,
  }));
});

const defaultProps = {
  label: 'name',
  children: 'lessons',
};
function handleNodeClick(node, data) {
  const status = loginStore.loginStatus;
  if (status === LOGIN_STATUS.FAILED || status === LOGIN_STATUS.NOT) {
    goAuthorize();
  } else if (data.video) {
    let routerData = router.resolve({
      path: `/course/lessonvideo/${userCourseData.courseData.id}/${data.id}`,
    });
    window.open(routerData.href, '_blank');
  } else if (!userCourseData.courseData.is_apply && !data.lessons) {
    goApplication();
  }
}
</script>
<template>
  <div class="course-content">
    <el-tree
      :data="sectionsResult"
      :props="defaultProps"
      accordion
      :icon="ArrowRightBold"
    >
      <template #default="{ node, data }">
        <div class="course-tree-node" @click="handleNodeClick(node, data)">
          <!-- <span>已学习</span> -->
          <div class="course-node-left">
            <!-- <span v-if="!data.children" class="learn-status">未学习</span> -->
            <o-icon v-if="!data.lessons" class="course-icon">
              <icon-play></icon-play>
            </o-icon>
            <span class="course-name">{{ node.label }}</span>
          </div>
          <!-- <span v-if="data.children && data.children.length > 0">fdds</span> -->
          <div
            v-if="!data.lessons && userCourseData.courseData.is_apply"
            class="course-node-right"
          >
            开始学习
          </div>
        </div>
      </template>
    </el-tree>
  </div>
</template>

<style lang="scss" scoped>
.course-content {
  padding: 10px 160px 0px;
}
:deep(.el-tree) {
  .el-tree-node {
    line-height: 70px;
    font-size: 18px;
    color: #000;
    border-bottom: 1px solid #d8d8d8;
    .el-tree-node__content {
      background-color: #fff;
      height: 100%;
      &:hover {
        background-color: transparent;
      }
      .el-tree-node__expand-icon {
        font-size: 14px;
        position: absolute;
        right: 0;
        color: #000;
      }
      .el-tree-node__expand-icon.is-leaf {
        color: transparent;
        display: none;
      }
    }
    // 第二级节点
    .el-tree-node__children {
      .el-tree-node {
        line-height: 40px;
        color: #b2b2b2;
        font-size: 14px;
        border: none;
        &:hover {
          background-color: #f7f8fa;
          color: #0d8dff;
          border-radius: 21px;
        }
        .course-tree-node {
          &:hover .course-name {
            color: #0d8dff !important;
          }
          &:hover .course-node-right {
            color: #4dcdff !important;
          }
        }

        .el-tree-node__content {
          padding: 0px 8px !important;
          .course-tree-node {
            width: 100%;
            display: flex;
            justify-content: space-between;
            .course-node-left {
              display: inline-block;
              margin-left: 56px;
              .learn-status {
                display: inline-block;
                width: 58px;
                line-height: 26px;
                text-align: center;
                border-radius: 8px;
                border: 1px solid #e5e5e5;
                background-color: #f7f8fa;
                margin-right: 8px;
              }
              .o-icon svg {
                vertical-align: middle;
                margin-right: 8px;
                font-size: 16px;
                position: relative;
                top: -1px;
              }
              .course-name {
                color: #555;
              }
            }
            .course-node-right {
              font-size: 14px;
              color: #0d8dff;
            }
          }
        }
        // 第三级节点
        .el-tree-node__children {
          .course-tree-node {
            .course-node-left {
              margin-left: 78px;
            }
          }
        }
      }
    }
  }
}
</style>
