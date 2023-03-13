<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ArrowRight } from '@element-plus/icons-vue';

import { getCourseData } from '@/api/api-course';

const route = useRoute();
// console.log('route: ', route.params.chapterId);
const router = useRouter();
const currentCourseData = ref(null); //当前课程信息
const sectionData = ref([]);

function getDetailData() {
  getCourseData(route.params.courseId).then((res) => {
    currentCourseData.value = res.data;
    sectionData.value = res.data.sections;
    if (!currentCourseData.value.is_apply) {
      router.push('404');
    }
  });
}
getDetailData();

// 当前的课节信息（含课节视频）
const chapterData = computed(() => {
  const data = sectionData.value.find((item) => {
    return item.lessons.find((val) => {
      return (
        val.id === route.params.chapterId ||
        (val.points &&
          val.points.find((child) => child.id === route.params.chapterId))
      );
    });
  });
  if (!data) {
    router.replace({ name: '404' });
    return;
  }
  return data;
});

// 没有points字段的视频信息
const videaData1 = computed(() => {
  return chapterData.value.lessons.find((val) => {
    return (
      val.id === route.params.chapterId ||
      (val.points &&
        val.points.find((child) => child.id === route.params.chapterId))
    );
  });
});
// 有points字段的视频信息
const videaData2 = computed(() => {
  return videaData1.value?.points
    ? videaData1.value.points.find((item) => {
        return item.id === route.params.chapterId;
      })
    : videaData1.value;
});
</script>
<template>
  <div v-if="currentCourseData && chapterData" class="course-content">
    <div class="course-content-wrap">
      <div class="course-bread">
        <el-breadcrumb :separator-icon="ArrowRight">
          <el-breadcrumb-item :to="{ path: '/course' }">
            课程
          </el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: `/course/${currentCourseData.id}` }">
            {{ currentCourseData.name }}
          </el-breadcrumb-item>
          <el-breadcrumb-item>
            {{ chapterData.name }}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div v-if="!videaData1.points" class="course-node">
        <div class="course-name">
          {{ videaData1.name }}
        </div>
        <div class="course-videa">
          <video
            controls="controls"
            height="720"
            :src="videaData1.video"
            class="video-detail"
          ></video>
        </div>
      </div>
      <div v-else class="course-node">
        <div class="course-name">{{ videaData2.name }}</div>
        <div class="course-videa">
          <video
            controls="controls"
            height="720"
            :src="videaData2.video"
            class="video-detail"
          ></video>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.course-content {
  max-width: 100%;
  min-height: calc(100vh - 200px);
  margin-top: 80px;
  background-color: #f5f6f8;
  .course-content-wrap {
    max-width: 1440px;
    height: 100%;
    padding: 40px 0px 64px;
    margin: 0 auto;
    .course-bread {
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
    .course-node {
      .course-name {
        line-height: 48px;
        font-size: 36px;
        color: #000000;
        margin: 40px 0;
      }
      .course-videa {
        height: 865px;
        padding: 80px;
        background: #ffffff;
        box-shadow: 0px 1px 5px 0px rgba(45, 47, 51, 0.1);
        .video-detail {
          width: 100%;
          margin: 0 auto;
        }
      }
    }
  }
}
</style>
