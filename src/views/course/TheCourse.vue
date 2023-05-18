<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';

// import IconSearch from '~icons/app/course-search';
import IconArrowRight from '~icons/app/arrow-right.svg';
import IconTime from '~icons/app/time';
import IconSelected from '~icons/app/selected';

import emptyImg from '@/assets/imgs/live-empty.png';
import { getCourseList } from '@/api/api-course';

const router = useRouter();

const courseName = ref('allClassify');
const activeName = ref('allStatus');

const allCourse = ref([]); //当前所有课程
const currentCourse = ref([]); // 当前页显示的课程

const coursePager = reactive({
  page: 1,
  size: 5,
});

let i18n = {
  head: {
    title: '课程',
    introduce: '从入门到精通，深入浅出玩转昇思MindSpore',
  },
};

// 获取所有的课程
function getAllCourse() {
  getCourseList().then((res) => {
    if (res.data) {
      allCourse.value = res.data;
      currentCourse.value = res.data.slice(0, coursePager.size);
    }
  });
}
getAllCourse();

// 获得进行中，即将开始，已结束的课程(刷选课程分类和课程状态)
const params = {};
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
  getCourseList(params).then((res) => {
    if (res.data) {
      allCourse.value = res.data;
      currentCourse.value = res.data.slice(0, coursePager.size);
    } else {
      currentCourse.value = [];
    }
  });
  coursePager.page = 1;
}

const layout = ref('prev, pager, next');
// 课程分页器
function handleCurrentPage(val) {
  coursePager.page = val;
  currentCourse.value = allCourse.value.slice(
    coursePager.page * coursePager.size - coursePager.size,
    coursePager.page * coursePager.size
  );
  toTop();
}
function toTop() {
  document.documentElement.scrollTop = 0;
}

function goCourseDetail(id) {
  router.push(`/course/${id}`);
}
</script>

<template>
  <div class="course-page">
    <div class="course-head">
      <div class="wrap">
        <div class="banner-left">
          <div class="title">{{ i18n.head.title }}</div>
          <div class="introduce">
            {{ i18n.head.introduce }}
          </div>
        </div>
        <!-- <div class="banner-right">
          <div class="header-search">
            <o-icon class="search-icon"><icon-search></icon-search></o-icon>
            <o-input
              style="border: none"
              placeholder="搜索MindSpore的模型"
              class="header-input"
            />
          </div>
        </div> -->
      </div>
    </div>
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
            <div class="course-cover">
              <img :src="item.poster" alt="" />
            </div>
            <div class="course-info">
              <div class="card-header">
                <div class="card-title">
                  <div class="course-title">{{ item.name }}</div>
                  <div
                    v-if="item.status === 'in-progress'"
                    class="course-state doing"
                  >
                    火热进行中
                  </div>
                  <div v-if="item.status === 'over'" class="course-state done">
                    已结束
                  </div>
                  <div
                    v-if="item.status === 'preparing'"
                    class="course-state will-do"
                  >
                    未开始
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
              <div v-if="item.status === 'in-progress'" class="right-wrap">
                <OButton
                  type="primary"
                  animation
                  @click="goCourseDetail(item.id)"
                >
                  立即前往
                  <template #suffix>
                    <OIcon><IconArrowRight /></OIcon>
                  </template>
                </OButton>
                <div class="number">报名人数：{{ item.count }}</div>
              </div>
              <div v-else-if="item.status === 'preparing'" class="right-wrap">
                <div class="not-started">报名未开始</div>
              </div>
              <div v-else class="right-wrap">
                <div class="not-started">报名已截止</div>
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
</template>

<style lang="scss" scoped>
$theme: #0d8dff;
.wrap {
  margin: 0 auto;
  padding: 50px 16px 64px;
  max-width: 1448px;
}
.course-page {
  background-color: #f5f6f8;
  min-height: calc(100vh - 200px);
  .course-head {
    padding-top: 80px;
    background-size: cover;
    background-image: url('@/assets/imgs/user-banner-head.png');
    .wrap {
      display: flex;
      justify-content: space-between;
      padding: 42px 16px;
      color: #000;
      .title {
        padding-bottom: 8px;
        font-size: 36px;
        line-height: 48px;
      }
      .introduce {
        padding-right: 24px;
        font-size: 18px;
        line-height: 24px;
        .reference {
          color: #4dcdff;
        }
      }
      .banner-right {
        display: flex;
        align-items: center;
        .header-search {
          position: relative;
          background: rgba(255, 255, 255, 0.9);
          width: 320px;
          height: 56px;

          .search-icon {
            width: 24px;
            height: 24px;
            font-size: 24px;
            color: #979797;
            position: absolute;
            top: 50%;
            left: 16px;
            transform: translateY(-50%);
          }

          .header-input {
            height: 100%;
            font-size: 14px;
            color: #999;
            background: rgba(255, 255, 255, 0.9);
            padding-left: 48px;
          }
        }
      }
    }
  }
  .course-body {
    display: flex;
    flex-direction: column;
    :deep(.el-tabs) {
      .el-tabs__header {
        border: none;
        height: inherit;
        margin: 0px;
        border-radius: 0 0 16px 16px;
        .el-tabs__nav-scroll {
          .el-tabs__nav {
            .el-tabs__item {
              &:first-child {
                color: #000000;
                font-weight: 550;
                margin-left: 12px;
              }
            }
            .is-active {
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
        border-radius: 16px 16px 0 0;
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
      margin-top: 40px;
      .course-card {
        min-height: 216px;
        font-size: 14px;
        color: #555555;
        background-color: #ffffff;
        margin-bottom: 24px;
        display: flex;
        justify-content: space-between;
        cursor: pointer;
        border-radius: 16px;
        &:hover {
          box-shadow: 0px 1px 16px 0px rgba(0, 0, 0, 0.05);
          transition: all 0.2s linear;
        }
        .box-left {
          width: 100%;
          margin: 24px;
          margin-right: 64px;
          display: flex;
          .course-cover {
            img {
              width: 300px;
              border-radius: 8px;
            }
          }
          .course-info {
            width: calc(100% - 300px);
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
                  border-radius: 16px;
                }
                .will-do {
                  color: #ffffff;
                  background-color: #6189ff;
                }
                .doing {
                  color: #ffffff;
                  background-color: #ff7f0d;
                  min-width: 76px;
                }
                .done {
                  color: #555555;
                  background-color: #efefef;
                  min-width: 52px;
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
</style>
