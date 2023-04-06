<script setup>
import { ref, computed, onUpdated, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ArrowRight } from '@element-plus/icons-vue';

import { getCourseData, getViewCounts } from '@/api/api-course';

const route = useRoute();
const router = useRouter();
const currentCourseData = ref(null); //当前课程信息
const sectionData = ref([]);
const videoRef = ref(null);
const isFirst = ref(true);
const currentTime = ref(0);
const videoDuration = ref(null);

onUpdated(() => {
  // 获取当前视频播放进度
  if (videaData1.value.points) {
    const videoTime = localStorage.getItem(`videoTime-${videaData2.value.id}`); // 获取保存的时间
    if (videoTime) {
      videoRef.value.currentTime = videoTime;
    }
  } else {
    const videoTime = localStorage.getItem(`videoTime-${videaData1.value.id}`); // 获取保存的时间
    if (videoTime) {
      videoRef.value.currentTime = videoTime;
    }
  }
  // 用户第一次点击播放视频
  videoRef.value.addEventListener('play', () => {
    if (videoRef.value.currentTime === 0 && isFirst.value) {
      let pointId = '';
      if (videaData1.value.points) {
        pointId = videaData2.value.id;
      }
      const params = {
        section_id: chapterData.value.id,
        lesson_id: videaData1.value.id,
        point_id: pointId,
        play_count: 1,
        finish_count: 0,
      };
      getViewCounts(params, currentCourseData.value.id);
      isFirst.value = false;
    }
  });
});

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

// 视频时长处理
function handleTimeUpdate() {
  if (videoRef.value) {
    currentTime.value = videoRef.value.currentTime;
    videoDuration.value = videoRef.value.duration;
    if (videaData1.value.points) {
      localStorage.setItem(
        `videoTime-${videaData2.value.id}`,
        currentTime.value
      );
    } else {
      localStorage.setItem(
        `videoTime-${videaData1.value.id}`,
        currentTime.value
      );
    }
    if (currentTime.value === videoDuration.value) {
      let pointId = '';
      if (videaData1.value.points) {
        pointId = videaData2.value.id;
        localStorage.removeItem(`videoTime-${videaData2.value.id}`);
      } else {
        localStorage.removeItem(`videoTime-${videaData1.value.id}`);
      }
      const params = {
        section_id: chapterData.value.id,
        lesson_id: videaData1.value.id,
        point_id: pointId,
        play_count: 0,
        finish_count: 1,
      };
      getViewCounts(params, currentCourseData.value.id);
    }
  }
}

// 移除timeupdate事件
onUnmounted(() => {
  if (videoRef.value) {
    videoRef.value.removeEventListener('timeupdate', handleTimeUpdate);
  }
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
            ref="videoRef"
            controls="controls"
            controlslist="nodownload"
            disablepictureinpicture
            preload="auto"
            height="720"
            :src="videaData1.video"
            class="video-detail"
            @timeupdate="handleTimeUpdate"
          ></video>
        </div>
      </div>
      <div v-else class="course-node">
        <div class="course-name">{{ videaData2.name }}</div>
        <div class="course-videa">
          <video
            ref="videoRef"
            controls="controls"
            controlslist="nodownload"
            disablepictureinpicture
            preload="auto"
            height="720"
            :src="videaData2.video"
            class="video-detail"
            @timeupdate="handleTimeUpdate"
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
          outline: none;
        }
      }
    }
  }
}
</style>
