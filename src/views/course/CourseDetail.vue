<script setup>
import { ref, onUpdated } from 'vue';
import { useRoute, onBeforeRouteLeave } from 'vue-router';

import OButton from '@/components/OButton.vue';
import { ArrowRight } from '@element-plus/icons-vue';
import IconTime from '~icons/app/time';
import IconArrowRight from '~icons/app/arrow-right.svg';

import CourseOption from '@/views/course/CourseOption.vue';
import CompetitionApplication from '@/views/competition/CompetitionApplication.vue';

import { goAuthorize } from '@/shared/login';
import { useLoginStore, useCourseData } from '@/stores';
import { getCourseData } from '@/api/api-course';

const route = useRoute();

const isLogined = useLoginStore().isLogined;
const userCourseData = useCourseData();

const currentCourseData = ref({});
const fixed = ref(false);
const showApplication = ref(false);
const showCourse = ref('course');
const showDetail = ref(false);

function getDetailData() {
  getCourseData(route.params.courseId).then((res) => {
    currentCourseData.value = res.data;
    console.log('currentCourseData.value: ', currentCourseData.value);
    userCourseData.setCourseData(currentCourseData.value);
    showDetail.value = true;
  });
}
getDetailData();

// 点击报名
function goApplication() {
  if (!isLogined) {
    goAuthorize();
  } else {
    showApplication.value = true;
    // userCourseData.courseData.is_apply = true;
  }
}
//隐藏报名表单
function hideForm(val, type) {
  showApplication.value = val;
  if (!type) {
    userCourseData.courseData.is_apply = true;
    getDetailData();
  }
}

onUpdated(() => {
  let card = document.querySelector('.course-card');
  let box = document.querySelector('.course-info');
  let top1 = card.offsetTop + 30;
  window.addEventListener('scroll', function () {
    if (
      window.pageYOffset > top1 &&
      (route.name === 'courseIntroduction' ||
        route.name === 'courseChapter' ||
        route.name === 'courseTask' ||
        route.name === 'courseTeacher' ||
        route.name === 'courseCertificate')
    ) {
      box.style.display = 'flex';
      fixed.value = true;
    }
    if (window.pageYOffset < top1) {
      box.style.display = 'none';
      fixed.value = false;
    }
  });
});

onBeforeRouteLeave(() => {
  userCourseData.$reset();
});
</script>

<template>
  <div v-if="showDetail" class="course-detail">
    <div class="course-wrap">
      <div class="bread-wrap">
        <div class="course-bread">
          <el-breadcrumb :separator-icon="ArrowRight">
            <el-breadcrumb-item :to="{ path: '/course' }"
              >课程</el-breadcrumb-item
            >
            <el-breadcrumb-item class="breadcrumb-item">
              {{ currentCourseData.name }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>
      <div class="course-content">
        <!-- 正常展示的课程信息 -->
        <div class="course-box course-card">
          <div class="box-left">
            <div class="course-cover">
              <img :src="currentCourseData.poster" alt="" />
            </div>
            <div class="course-data">
              <div class="card-header">
                <div class="card-title">
                  <div class="course-title">{{ currentCourseData.name }}</div>
                  <div
                    v-if="currentCourseData.status === 'in-progress'"
                    class="course-state doing"
                  >
                    火热进行中
                  </div>
                  <div
                    v-if="currentCourseData.status === 'preparing'"
                    class="course-state will-do"
                  >
                    未开始
                  </div>
                  <div
                    v-if="currentCourseData.status === 'over'"
                    class="course-state done"
                  >
                    已结束
                  </div>
                </div>
                <div class="card-desc">
                  {{ currentCourseData.desc }}
                </div>
              </div>

              <div class="card-footer">
                <div class="host">
                  <span> 主办方：{{ currentCourseData.host }} </span>
                  &nbsp;|&nbsp;
                  <span> {{ currentCourseData.hours }}课节 </span>
                  &nbsp;|&nbsp;
                  <span>免费课程</span>
                </div>
                <div class="duration">
                  <o-icon>
                    <icon-time></icon-time>
                  </o-icon>
                  <span>
                    {{ currentCourseData.duration }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div v-if="!currentCourseData.is_apply" class="box-right">
            <div class="right-immediate">
              <div
                v-if="currentCourseData.status === 'in-progress'"
                class="right-wrap"
              >
                <OButton type="primary" animation @click="goApplication">
                  立即报名
                  <template #suffix>
                    <OIcon><IconArrowRight /></OIcon>
                  </template>
                </OButton>
                <!-- TODO:暂时隐藏 -->
                <!-- <div class="number">
                  报名人数：{{ currentCourseData.count }}
                </div> -->
              </div>
              <div
                v-else-if="currentCourseData.status === 'preparing'"
                class="right-wrap"
              >
                <div class="not-started">报名未开始</div>
              </div>
              <div v-else class="right-wrap">
                <div class="not-started">报名已截止</div>
              </div>
            </div>
          </div>
        </div>
        <!-- 下滑后展示的课程信息 -->
        <div class="course-box course-info">
          <div class="left">
            <div class="card-header">
              <div class="course-title">
                {{ currentCourseData.name }}
              </div>
              <div
                v-if="currentCourseData.status === 'in-progress'"
                class="course-state doing"
              >
                火热进行中
              </div>
              <div
                v-if="currentCourseData.status === 'preparing'"
                class="course-state preparing"
              >
                未开始
              </div>
              <div
                v-if="currentCourseData.status === 'over'"
                class="course-state finished"
              >
                已结束
              </div>
            </div>
          </div>
          <div v-if="!currentCourseData.is_apply" class="right1">
            <div class="right-immediate">
              <div class="right-wrap">
                <div v-if="currentCourseData.status === 'in-progress'">
                  <OButton type="primary" animation @click="goApplication">
                    立即报名
                  </OButton>
                </div>
                <div v-if="currentCourseData.status === 'preparing'">
                  <div class="course-state">报名未开始</div>
                </div>
                <div v-if="currentCourseData.status === 'over'">
                  <div class="course-state">课程已结束</div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="right2">
            <div class="right2-bonus">
              <div class="time">日期: {{ currentCourseData.duration }}</div>
            </div>
          </div>
        </div>
        <div v-if="userCourseData.courseData" class="course-desc">
          <CourseOption :fixed="fixed"></CourseOption>
        </div>
      </div>
    </div>
  </div>
  <!-- 报名弹窗 -->
  <div v-if="showApplication" class="application-dlg">
    <el-dialog
      v-model="showApplication"
      destroy-on-close
      :show-close="false"
      align-center
      width="800"
    >
      <CompetitionApplication
        :show-application="showCourse"
        :course-id="currentCourseData.id"
        @hide-form="hideForm"
      ></CompetitionApplication>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.course-detail {
  background-color: #f5f6f8;
  padding-top: 80px;
  min-height: calc(100vh - 200px);

  .course-wrap {
    padding: 0px 16px 64px;
    margin: 0 auto;
    max-width: 1472px;
    overflow: hidden;
    .bread-wrap {
      height: 94px;
      padding-top: 40px;
      padding-bottom: 40px;
      background-color: #f5f6f8;
      .course-bread {
        width: 100%;
        overflow-y: auto;
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
          :deep(.el-breadcrumb__item:nth-child(2) .el-breadcrumb__inner) {
            cursor: pointer;
          }
        }
      }
    }
    .course-content {
      scroll-behavior: smooth;
      .course-box {
        // min-height: 216px;
        font-size: 14px;
        color: #555555;
        background-color: #ffffff;
        display: flex;
        justify-content: space-between;
        box-shadow: 0px 1px 5px 0px rgba(45, 47, 51, 0.1);
        .box-left {
          width: 100%;
          margin: 24px;
          margin-right: 64px;
          display: flex;
          .course-cover {
            width: 300px;
            img {
              width: 100%;
              height: 100%;
            }
          }
          .course-data {
            width: calc(100% - 325px);
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            margin-left: 25px;
            .card-header {
              .card-title {
                display: flex;
                align-items: center;
                .course-title {
                  font-size: 24px;
                  color: #000;
                }
                .course-state {
                  font-size: 12px;
                  height: 20px;
                  line-height: 20px;
                  margin-left: 15px;
                  padding: 0 8px;
                }
                .will-do {
                  color: #ffffff;
                  background-color: #6189ff;
                }
                .doing {
                  color: #ffffff;
                  background-color: #ff7f0d;
                }
                .done {
                  color: #555555;
                  background-color: #efefef;
                }
              }
              .card-desc {
                margin-top: 16px;
                line-height: 22px;
              }
            }
            .card-footer {
              margin-top: 16px;
              display: flex;
              justify-content: space-between;
              .duration {
                text-align: center;
                .o-icon {
                  margin-right: 4px;
                  svg {
                    position: relative;
                    top: 1px;
                  }
                }
              }
            }
          }
        }
        .box-right {
          display: flex;
          .right-immediate {
            border-left: 1px solid #e4e5e7;
            .right-wrap {
              height: 100%;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              margin: 0px 48px;
              .number {
                margin-top: 16px;
              }
              .not-started {
                white-space: nowrap;
                color: #cccccc;
                margin: 0 32px;
              }
            }
          }
        }
      }
      .course-info {
        display: none;
        position: fixed;
        scroll-behavior: smooth;
        z-index: 10;
        width: 100%;
        max-width: 1440px;
        height: 128px;
        top: 80px;
        overflow: hidden;
        padding: 0 40px;
        vertical-align: middle;
        .left {
          display: flex;
          align-items: center;
          .card-header {
            display: flex;
            align-items: center;
            .course-title {
              font-size: 24px;
              color: #000;
            }
            .course-state {
              font-size: 12px;
              height: 20px;
              line-height: 20px;
              margin-left: 15px;
              padding: 0 8px;
            }
            .preparing {
              color: #ffffff;
              background-color: #6189ff;
            }
            .doing {
              color: #ffffff;
              background-color: #ff7f0d;
            }
            .finished {
              color: #555555;
              background-color: #efefef;
            }
          }
        }
        .right1 {
          display: flex;
          align-items: center;
          .right-immediate {
            border-left: 0px;
            .right-wrap {
              .course-state {
                font-size: 16px;
                color: #cccccc;
                line-height: 22px;
              }
            }
          }
        }
        .right2 {
          display: flex;
          align-items: center;
          .time {
            line-height: 24px;
            padding: 12px 40px;
            color: #555555;
            background-color: #f4faff;
            margin-top: 0px;
          }
        }
      }
    }
    .course-desc {
      margin-top: 24px;
      background-color: #fff;
    }
  }
}
.application-dlg {
  :deep(.el-dialog) {
    .el-dialog__header {
      display: none;
    }
    .el-dialog__body {
      padding-bottom: 40px !important;
      .application {
        padding: 0px;
        .application-title {
          border: none;
          padding-bottom: 0px;
          display: flex;
          flex-direction: column;
          .text {
            margin-bottom: 24px;
            text-align: center;
            line-height: 32px;
          }
          .tips {
            width: 100%;
          }
        }
        .application-form {
          display: flex;
          justify-content: flex-start;
          padding-left: 50px;
          .el-form {
            .el-form-item {
              .requirement {
                span {
                  margin-left: 4px;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
