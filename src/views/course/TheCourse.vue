<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';

// import IconSearch from '~icons/app/course-search';
import IconArrowRight from '~icons/app/arrow-right.svg';
import IconTime from '~icons/app/time';
// import IconSelected from '~icons/app/selected';

import emptyImg from '@/assets/imgs/live-empty.png';
import { getCourseList } from '@/api/api-course';

const router = useRouter();

// const courseName = ref('second');
const activeName = ref('all');

// 当前页显示的课程
const currentAllCourse = ref([]);
const currentDoingCourse = ref([]);
const currentPreparingCourse = ref([]);
const currentOverCourse = ref([]);

const allCourse = ref([]); //所有的课程
const doingCourse = ref([]); //进行中的课程
const preparingCourse = ref([]); // 即将开始的课程
const overCourse = ref([]); // 已结束的课程

let allCoursePager = reactive({
  page: 1,
  size: 5,
});
let doingCoursePager = reactive({
  page: 1,
  size: 5,
});
let preparingCoursePager = reactive({
  page: 1,
  size: 5,
});
let overCoursePager = reactive({
  page: 1,
  size: 5,
});

let i18n = {
  head: {
    title: '课程',
    introduce: '从入门到精通，深入浅出玩转昇思MindSpore',
    reference: '参考文档',
    btn: '新建模型',
    count: '总数',
  },
  back: '返回上一级',
  taskSort: '应用分类',
  tagPlacholder: '请输入tag名称',
  more: '更多',
  clear: '清除',
};

// 获取所有的课程
function getAllCourse() {
  getCourseList().then((res) => {
    if (res.data.data) {
      allCourse.value = res.data.data;
      currentAllCourse.value = res.data.data.slice(0, allCoursePager.size);
    }
  });
}
getAllCourse();

// 获得进行中，即将开始，已结束的课程
function handleClick(tab) {
  allCoursePager.page = 1;
  doingCoursePager.page = 1;
  preparingCoursePager.page = 1;
  overCoursePager.page = 1;
  if (tab.props.name !== 'first') {
    getCourse(tab.props.name);
  }
}
function getCourse(tabName) {
  if (tabName === 'inProgress') {
    let params = { status: 'in-progress' };
    getCourseList(params).then((res) => {
      if (res.data.data) {
        doingCourse.value = res.data.data;
        currentDoingCourse.value = res.data.data.slice(
          0,
          doingCoursePager.size
        );
      }
    });
  } else if (tabName === 'preparing') {
    let params = { status: 'preparing' };
    getCourseList(params).then((res) => {
      if (res.data.data) {
        preparingCourse.value = res.data.data;
        currentPreparingCourse.value = res.data.data.slice(
          0,
          preparingCoursePager.size
        );
      }
    });
  } else if (tabName === 'over') {
    let params = { status: 'over' };
    getCourseList(params).then((res) => {
      if (res.data.data) {
        overCourse.value = res.data.data;
        currentOverCourse.value = res.data.data.slice(0, overCoursePager.size);
      }
    });
  }
}

const layout = ref('prev, pager, next');
// 全部课程分页器
function handleAllCurrentPage(val) {
  allCoursePager.page = val;
  currentAllCourse.value = allCourse.value.slice(
    allCoursePager.page * allCoursePager.size - allCoursePager.size,
    allCoursePager.page * allCoursePager.size
  );
  toTop();
}
// 进行中课程分页器
function handleDoingCurrentPage(val) {
  doingCoursePager.page = val;
  currentDoingCourse.value = doingCourse.value.slice(
    doingCoursePager.page * doingCoursePager.size - doingCoursePager.size,
    doingCoursePager.page * doingCoursePager.size
  );
  toTop();
}
// 即将开始课程分页器
function handlePreparingCurrentPage(val) {
  preparingCoursePager.page = val;
  currentPreparingCourse.value = preparingCourse.value.slice(
    preparingCoursePager.page * preparingCoursePager.size -
      preparingCoursePager.size,
    preparingCoursePager.page * preparingCoursePager.size
  );
  toTop();
}
// 已结束课程分页器
function handleDoneCurrentPage(val) {
  overCoursePager.page = val;
  currentOverCourse.value = overCourse.value.slice(
    overCoursePager.page * overCoursePager.size - overCoursePager.size,
    overCoursePager.page * overCoursePager.size
  );
  toTop();
}
function toTop() {
  document.documentElement.scrollTop = 0;
}

function goCompetitionDetail(id) {
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
      <!-- @tab-click="handleClick" -->

      <!-- <el-tabs v-model="courseName" type="card" class="category-tabs demo-tabs">
        <el-tab-pane label="课程分类" name="first" disabled> </el-tab-pane>
        <el-tab-pane label="全部" name="second">
          <template #label>
            <div class="category-tabs-label">
              <span>全部</span>
              <o-icon>
                <icon-selected></icon-selected>
              </o-icon>
            </div>
          </template>
        </el-tab-pane>
        <el-tab-pane label="新手入门" name="third">
          <template #label>
            <div class="category-tabs-label">
              <span>新手入门</span>
              <o-icon>
                <icon-selected></icon-selected>
              </o-icon>
            </div>
          </template>
        </el-tab-pane>
        <el-tab-pane label="名师课程" name="fourth">
          <template #label>
            <div class="category-tabs-label">
              <span>名师课程</span>
              <o-icon>
                <icon-selected></icon-selected>
              </o-icon>
            </div>
          </template>
        </el-tab-pane>
        <el-tab-pane label="大模型" name="six">
          <template #label>
            <div class="category-tabs-label">
              <span>大模型</span>
              <o-icon>
                <icon-selected></icon-selected>
              </o-icon>
            </div>
          </template>
        </el-tab-pane>
      </el-tabs> -->
      <!-- <el-divider /> -->
      <el-tabs
        v-model="activeName"
        type="card"
        class="demo-tabs"
        @tab-click="handleClick"
      >
        <el-tab-pane label="课程状态" name="status" disabled></el-tab-pane>
        <el-tab-pane label="全部" name="all">
          <div v-if="allCourse.length">
            <div
              v-for="item in currentAllCourse"
              :key="item.id"
              class="course-box"
              @click="goCompetitionDetail(item.id)"
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
                      <div
                        v-else-if="item.status === 'preparing'"
                        class="course-state will-do"
                      >
                        未开始
                      </div>
                      <div v-else class="course-state done">已结束</div>
                    </div>
                    <div class="card-desc">
                      {{ item.desc }}
                    </div>
                  </div>

                  <div class="card-footer">
                    <div class="host">
                      <span> 主办方：{{ item.host }} </span>
                      &nbsp;|&nbsp;
                      <span>{{ item.hours }}课节</span>
                      &nbsp;|&nbsp;
                      <span>免费课程</span>
                    </div>
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
                      @click="goCompetitionDetail(item.id)"
                    >
                      立即前往
                      <template #suffix>
                        <OIcon><IconArrowRight /></OIcon>
                      </template>
                    </OButton>
                    <div class="number">报名人数：{{ item.count }}</div>
                  </div>
                  <div
                    v-else-if="item.status === 'preparing'"
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
            <div class="pagination">
              <el-pagination
                hide-on-single-page
                :current-page="allCoursePager.page"
                :page-size="allCoursePager.size"
                :total="allCourse.length"
                :layout="layout"
                @current-change="handleAllCurrentPage"
              ></el-pagination>
            </div>
          </div>
          <div v-else class="empty">
            <img :src="emptyImg" alt="" />
            <p>暂无课程</p>
          </div>
        </el-tab-pane>
        <el-tab-pane label="进行中" name="inProgress">
          <div v-if="doingCourse.length">
            <div
              v-for="item in currentDoingCourse"
              :key="item.id"
              class="course-box"
              @click="goCompetitionDetail(item.id)"
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
                    </div>
                    <div class="card-desc">
                      {{ item.desc }}
                    </div>
                  </div>

                  <div class="card-footer">
                    <div class="host">
                      <span> 主办方：{{ item.host }} </span>
                      &nbsp;|&nbsp;
                      <span>{{ item.hours }}课节</span>
                      &nbsp;|&nbsp;
                      <span>免费课程</span>
                    </div>
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
                      @click="goCompetitionDetail(item.id)"
                    >
                      立即前往
                      <template #suffix>
                        <OIcon><IconArrowRight /></OIcon>
                      </template>
                    </OButton>
                    <div class="number">报名人数：{{ item.count }}</div>
                  </div>
                  <div
                    v-else-if="item.status === 'preparing'"
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
            <div class="pagination">
              <el-pagination
                hide-on-single-page
                :current-page="doingCoursePager.page"
                :page-size="doingCoursePager.size"
                :total="doingCourse.length"
                :layout="layout"
                @current-change="handleDoingCurrentPage"
              ></el-pagination>
            </div>
          </div>
          <div v-else class="empty">
            <img :src="emptyImg" alt="" />
            <p>暂无进行中的课程</p>
          </div>
        </el-tab-pane>
        <el-tab-pane label="即将开始" name="preparing">
          <div v-if="preparingCourse.length">
            <div
              v-for="item in currentPreparingCourse"
              :key="item.id"
              class="course-box"
              @click="goCompetitionDetail(item.id)"
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
                      @click="goCompetitionDetail(item.id)"
                    >
                      立即前往
                      <template #suffix>
                        <OIcon><IconArrowRight /></OIcon>
                      </template>
                    </OButton>
                    <div class="number">报名人数：{{ item.count }}</div>
                  </div>
                  <div
                    v-else-if="item.status === 'preparing'"
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
            <div class="pagination">
              <el-pagination
                hide-on-single-page
                :current-page="preparingCoursePager.page"
                :page-size="preparingCoursePager.size"
                :total="preparingCourse.length"
                :layout="layout"
                @current-change="handlePreparingCurrentPage"
              ></el-pagination>
            </div>
          </div>
          <div v-else class="empty">
            <img :src="emptyImg" alt="" />
            <p>敬请期待</p>
          </div>
        </el-tab-pane>
        <el-tab-pane label="已结束" name="over">
          <div v-if="overCourse.length">
            <div
              v-for="item in currentOverCourse"
              :key="item.id"
              class="course-box"
              @click="goCompetitionDetail(item.id)"
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
                        v-if="item.status === 'over'"
                        class="course-state done"
                      >
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
                  <div v-if="item.status === 'in-progress'" class="right-wrap">
                    <OButton
                      type="primary"
                      animation
                      @click="goCompetitionDetail(item.id)"
                    >
                      立即前往
                      <template #suffix>
                        <OIcon><IconArrowRight /></OIcon>
                      </template>
                    </OButton>
                    <div class="number">报名人数：{{ item.count }}</div>
                  </div>
                  <div
                    v-else-if="item.status === 'preparing'"
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
            <div class="pagination">
              <el-pagination
                hide-on-single-page
                :current-page="overCoursePager.page"
                :page-size="doingCoursePager.size"
                :total="overCourse.length"
                :layout="layout"
                @current-change="handleDoneCurrentPage"
              ></el-pagination>
            </div>
          </div>
          <div v-else class="empty">
            <img :src="emptyImg" alt="" />
            <p>暂无已结束课程</p>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$theme: #0d8dff;
.wrap {
  margin: 0 auto;
  padding: 50px 16px 64px;
  max-width: 1472px;
}
.course-page {
  background-color: #f5f6f8;
  min-height: calc(100vh - 200px);
  .course-head {
    padding-top: 80px;
    background-size: cover;
    background-image: url('@/assets/imgs/banner-head.png');
    .wrap {
      display: flex;
      justify-content: space-between;
      padding: 42px 16px;
      color: #fff;
      .title {
        padding-bottom: 8px;
        font-size: 36px;
      }
      .introduce {
        padding-right: 24px;
        font-size: 18px;
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
      width: 100%;
      .el-tabs__header {
        border: none;
        height: inherit;
        margin-bottom: 40px;
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
      .el-tabs__content {
        .el-tab-pane {
          .course-box {
            min-height: 216px;
            font-size: 14px;
            color: #555555;
            background-color: #ffffff;
            margin-bottom: 24px;
            display: flex;
            justify-content: space-between;
            box-shadow: 0px 1px 5px 0px rgba(45, 47, 51, 0.1);
            &:hover {
              box-shadow: 0 6px 18px #0d8dff24;
              cursor: pointer;
            }
            .box-left {
              width: 100%;
              margin: 24px;
              margin-right: 64px;
              display: flex;
              .course-cover {
                img {
                  width: 300px;
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

        .pagination {
          margin-top: 40px;
          display: flex;
          justify-content: center;
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
  }
}
</style>
