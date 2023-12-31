<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';

import IconArrowRight from '~icons/app/arrow-right.svg';
import IconTime from '~icons/app/time';
import IconSelected from '~icons/app/selected';

import emptyImg from '@/assets/imgs/live-empty.png';
import { getMyCourseList } from '@/api/api-course';
import { usePersonalInfoStore } from '@/stores';

const router = useRouter();
const layout = ref('prev, pager, next');

const courseName = ref('allClassify');
const activeName = ref('allStatus');

const allCourse = ref([]); // 当前所有课程
const currentCourse = ref([]); // 当前页显示的课程

const coursePager = reactive({
  page: 1,
  size: 5,
});

// 获取所有的课程
const params = { mine: true };
const personalData = usePersonalInfoStore();
function getAllCourse() {
  allCourse.value = personalData.course;
  currentCourse.value = allCourse.value?.slice(0, coursePager.size);
}
getAllCourse();

// 获得进行中，即将开始，已结束的课程(刷选课程分类和课程状态)

function handleClick(query, tab) {
  if (query === 'type') {
    if (tab.props.name === 'allClassify') {
      params.type = undefined;
    } else {
      params.type = tab.props.name;
    }
  } else {
    if (tab.props.name === 'allStatus') {
      params.status = undefined;
    } else {
      params.status = tab.props.name;
    }
  }
  getMyCourseList(params).then((res) => {
    if (res.data) {
      allCourse.value = res.data;
      currentCourse.value = res.data.slice(0, coursePager.size);
    } else {
      currentCourse.value = [];
    }
  });
  coursePager.page = 1;
}

function toTop() {
  document.documentElement.scrollTop = 0;
}
// 课程分页器
function handleCurrentPage(val) {
  coursePager.page = val;
  currentCourse.value = allCourse.value.slice(
    coursePager.page * coursePager.size - coursePager.size,
    coursePager.page * coursePager.size
  );
  toTop();
}

function goCourseDetail(id) {
  router.push(`/course/${id}`);
}
</script>

<template>
  <div
    v-if="
      currentCourse?.length ||
      activeName !== 'allStatus' ||
      courseName !== 'allClassify'
    "
    class="course-page"
  >
    <div class="course-body wrap">
      <el-tabs
        v-model="courseName"
        type="card"
        class="category-tabs demo-tabs"
        @tab-click="handleClick('type', $event)"
      >
        <el-tab-pane label="课程分类" name="classify" disabled> </el-tab-pane>
        <el-tab-pane label="全部" name="allClassify">
          <template #label>
            <div class="category-tabs-label">
              <span>全部</span>
              <o-icon>
                <icon-selected></icon-selected>
              </o-icon>
            </div>
          </template>
        </el-tab-pane>
        <el-tab-pane label="深度学习入门" name="start">
          <template #label>
            <div class="category-tabs-label">
              <span>深度学习入门</span>
              <o-icon>
                <icon-selected></icon-selected>
              </o-icon>
            </div>
          </template>
        </el-tab-pane>
        <el-tab-pane label="计算机视觉" name="cv">
          <template #label>
            <div class="category-tabs-label">
              <span>计算机视觉</span>
              <o-icon>
                <icon-selected></icon-selected>
              </o-icon>
            </div>
          </template>
        </el-tab-pane>
        <el-tab-pane label="大模型" name="foundation">
          <template #label>
            <div class="category-tabs-label">
              <span>大模型</span>
              <o-icon>
                <icon-selected></icon-selected>
              </o-icon>
            </div>
          </template>
        </el-tab-pane>
        <el-tab-pane label="AI框架" name="framework">
          <template #label>
            <div class="category-tabs-label">
              <span>AI框架</span>
              <o-icon>
                <icon-selected></icon-selected>
              </o-icon>
            </div>
          </template>
        </el-tab-pane>
      </el-tabs>
      <el-divider />
      <el-tabs
        v-model="activeName"
        type="card"
        class="demo-tabs"
        @tab-click="handleClick('status', $event)"
      >
        <el-tab-pane label="课程状态" name="status" disabled></el-tab-pane>
        <el-tab-pane label="全部" name="allStatus"> </el-tab-pane>
        <el-tab-pane label="进行中" name="in-progress"> </el-tab-pane>
        <el-tab-pane label="即将开始" name="preparing"> </el-tab-pane>
        <el-tab-pane label="已结束" name="over"> </el-tab-pane>
      </el-tabs>
      <div v-if="currentCourse.length" class="course-box">
        <div
          v-for="item in currentCourse"
          :key="item.id"
          class="course-card"
          @click="goCourseDetail(item.id)"
        >
          <div class="box-left">
            <div class="course-info">
              <div class="card-header">
                <div class="card-title">
                  <div class="course-title">{{ item.name }}</div>
                  <div v-if="item.status === 'over'" class="course-state done">
                    已结束
                  </div>
                </div>
                <div class="card-desc">
                  {{ item.desc }}
                </div>
              </div>

              <div class="card-footer">
                <div class="host">主办方：{{ item.host }}</div>
                <div class="duration">
                  <o-icon>
                    <icon-time></icon-time>
                  </o-icon>
                  <span>
                    {{ item.duration }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="box-right">
            <div class="right-immediate">
              <div class="right-wrap">
                <OButton
                  type="primary"
                  animation
                  @click="goCourseDetail(item.id)"
                >
                  前往学习
                  <template #suffix>
                    <OIcon><IconArrowRight /></OIcon>
                  </template>
                </OButton>
              </div>
            </div>
          </div>
        </div>
        <div class="pagination">
          <el-pagination
            hide-on-single-page
            :current-page="coursePager.page"
            :page-size="coursePager.size"
            :total="allCourse.length"
            :layout="layout"
            @current-change="handleCurrentPage"
          ></el-pagination>
        </div>
      </div>
      <div
        v-if="(activeName === 'allStatus') & !currentCourse.length"
        class="empty"
      >
        <img :src="emptyImg" alt="" />
        <p>暂未参加课程</p>
      </div>
      <div v-if="(activeName === 'over') & !currentCourse.length" class="empty">
        <img :src="emptyImg" alt="" />
        <p>暂无已结束课程</p>
      </div>
      <div
        v-if="(activeName === 'preparing') & !currentCourse.length"
        class="empty"
      >
        <img :src="emptyImg" alt="" />
        <p>敬请期待</p>
      </div>
      <div
        v-if="(activeName === 'in-progress') & !currentCourse.length"
        class="empty"
      >
        <img :src="emptyImg" alt="" />
        <p>暂无进行中课程</p>
      </div>
    </div>
  </div>
  <div v-else class="empty1">
    <img :src="emptyImg" alt="" />
    <p>
      暂未参加课程，<a href="/course" rel="noopener noreferrer">点击报名课程</a>
    </p>
  </div>
</template>

<style lang="scss" scoped>
$theme: #0d8dff;
.wrap {
  margin: 0 auto;
  padding: 0;
  max-width: 1448px;
}
.course-page {
  //   background-color: #f5f6f8;
  background-color: #fff;
  // min-height: calc(100vh - 650px);

  .course-body {
    display: flex;
    flex-direction: column;
    :deep(.el-tabs) {
      width: 100%;
      .el-tabs__header {
        border: none;
        height: inherit;
        margin: 0px;
        .el-tabs__nav-scroll {
          background-color: #ffffff;
          .el-tabs__nav {
            border: none;
            .el-tabs__item {
              border: none;
              line-height: 28px;
              height: 28px;
              padding: 0 12px;
              margin: 14px 12px 14px 0px;
              color: #555555;
              &:first-child {
                color: #000000;
                font-weight: 550;
                margin-left: 12px;
              }
            }
            .is-active {
              box-shadow: 0 0 0 1px #0d8dff inset;
              color: #0d8dff;
              .o-icon {
                display: block;
              }
            }
          }
        }
      }
    }
    :deep(.category-tabs) {
      .el-tabs__header {
        padding: 0px;
        margin: 0px;
        .el-tabs__item {
          position: relative;
          .category-tabs-label {
            .o-icon {
              position: absolute;
              bottom: 0;
              right: 0px;
              display: none;
            }
          }
        }
      }
    }
    .el-divider {
      width: 96.5%;
      margin: 0 auto;
      color: #e5e5e5;
    }
    .course-box {
      margin-top: 26px;
      background-color: #ffffff;
      .course-card {
        font-size: 14px;
        color: #555555;
        background-color: #ffffff;
        margin-bottom: 24px;
        display: flex;
        justify-content: space-between;
        border: 1px solid #d8d8d8;
        border-radius: 16px;
        transition: all 0.3s ease;
        &:hover {
          box-shadow: 0px 1px 30px 0px rgba(0, 0, 0, 0.05);
          cursor: pointer;
        }
        .box-left {
          width: 100%;
          margin: 24px;
          margin-right: 64px;
          display: flex;

          .course-info {
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
            // border-left: 1px solid #e4e5e7;
            .right-wrap {
              height: 100%;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              margin: 0px 48px;
              .o-button {
                color: #0d8dff;
                border-color: #ffffff;
                background-color: #ffffff;
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
      .pagination {
        margin-top: 40px;
        display: flex;
        justify-content: center;
      }
    }
    .empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 80px 0 56px;
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
}
.empty1 {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 180px 0 56px;
  img {
    width: 280px;
  }
  p {
    color: #555555;
    margin-top: 24px;
    font-size: 18px;
  }
  a {
    color: #0d8dff;
  }
}
</style>
