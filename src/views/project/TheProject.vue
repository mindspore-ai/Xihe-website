<script setup>
import { ref, onMounted, reactive, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';

import { Search } from '@element-plus/icons-vue';
import IconMenu from '~icons/app/menu';
import IconX from '~icons/app/x';
import IconTime from '~icons/app/time';
import IconHeart from '~icons/app/heart';
import IconClear from '~icons/app/clear';
import IconBack from '~icons/app/back';

import OIcon from '@/components/OIcon.vue';
import OButton from '@/components/OButton.vue';

import { debounce } from 'lodash/function';

import { goAuthorize } from '@/shared/login';

import { getProjectData, getModelTags } from '@/api/api-project';

import { useLoginStore, useUserInfoStore } from '@/stores';

const loginStore = useLoginStore();
// import { useUserInfoStore, useFileData } from '@/stores';
// const fileData = useFileData();
// const detailData = computed(() => {
//   return useFileData().fileStoreData;
// });

const debounceSearch = debounce(getProject, 500, {
  leading: true,
  trailing: false,
});

const route = useRoute();
const router = useRouter();

let i18n = {
  head: {
    title: '项目',
    introduce: '简单介绍',
    btn: '新建项目',
    count: '总数',
  },
  back: '返回上一级',
  taskSort: '应用分类',
  tagPlacholder: '请输入tag名称',
  more: '更多',
  clear: '清除',
  sortCondition: [
    { text: '按照下载量排序', value: 'download' },
    { text: '按照首字母排序', value: 'name' },
    { text: '按照更新时间排序', value: 'update_time' },
  ],
  screenCondition: [
    {
      title: {
        text: '应用分类',
        key: 'task',
      },
      haveActive: false,
      condition: [],
    },
    {
      title: {
        text: '项目类型',
        key: 'infer_sdk',
      },
      haveActive: false,
      condition: [],
    },
    {
      title: {
        text: '训练平台',
        key: 'train_sdk',
      },
      haveActive: false,
      condition: [],
    },
    {
      title: {
        text: '协议',
        key: 'licenses',
      },
      haveActive: false,
      condition: [],
    },
    {
      title: {
        text: '其他',
        key: 'tags',
      },
      haveActive: false,
      condition: [],
    },
  ],
};

const projectCount = ref(0);
const projectData = ref([]);
const renderCondition = ref([]);
const renderSorts = ref([]);
const otherCondition = ref([]);
const showDetail = ref(false);
const moreSortTags = ref([]);
const showCondition = ref(true);
const showTags = ref(false);
const radioList = ref({});
const keyWord = ref('');

// const paginationShow = ref(true);

const queryData = reactive({
  page: 1,
  size: 12,
  search: null,
  tags: null,
  task_cate: null,
  task: null,
  licenses: null,
  train_sdk: null,
  infer_sdk: null,
});
queryData.search = route.query.search;

function moreClick() {
  showDetail.value = true;
  showCondition.value = false;
}

function backCondition() {
  showDetail.value = false;
  showCondition.value = true;
  showTags.value = false;
}

// 多选(应用分类，其他)
function sortsClick(index, index2) {
  renderSorts.value[index].haveActive = true;
  // 高亮
  renderSorts.value[index].condition[index2].isActive =
    !renderSorts.value[index].condition[index2].isActive;
  goSearch(renderSorts.value);
}
function clearItem1(index) {
  renderSorts.value[index].haveActive = false;
  renderSorts.value[index].condition.forEach((item) => {
    item.isActive = false;
  });
  queryData['task_cate'] = null;
}

function othersClick(index, index2) {
  otherCondition.value[index].haveActive = true;
  // 高亮
  otherCondition.value[index].condition[index2].isActive =
    !otherCondition.value[index].condition[index2].isActive;
  goSearch(otherCondition.value);
}
function clearItem3(index) {
  otherCondition.value[index].haveActive = false;
  otherCondition.value[index].condition.forEach((item) => {
    item.isActive = false;
  });
  queryData[otherCondition.value[index].title.key] = null;
}

// 单选(sdk,状态，协议)
function conditionClick(index, index2) {
  renderCondition.value[index].haveActive = true;
  renderCondition.value[index].condition.forEach((item) => {
    item.isSelected = true;
  });
  renderCondition.value[index].condition[index2].isSelected = false;

  if (renderCondition.value[index].condition[index2].isActive === true) {
    renderCondition.value[index].condition[index2].isActive =
      !renderCondition.value[index].condition[index2].isActive;
    renderCondition.value[index].condition.forEach((item) => {
      item.isSelected = false;
    });
  } else {
    renderCondition.value[index].condition.forEach((single) => {
      single.isActive = false;
      renderCondition.value[index].condition[index2].isActive = true;
    });
  }
  goSearch(renderCondition.value);
}
function clearItem(index) {
  renderCondition.value[index].haveActive = false;
  renderCondition.value[index].condition.forEach((item) => {
    item.isActive = false;
    item.isSelected = false;
  });
  queryData[renderCondition.value[index].title.key] = null;
}

// 查看全部标签(sdk,状态，协议)
function checkAllClick(item, index) {
  showCondition.value = false;
  item.showTagsAll = true;
  showTags.value = true;
  radioList.value = renderCondition.value[index];
}

function radioClick(detail, list) {
  list.condition.forEach((item) => {
    item.isSelected = true;
  });
  detail.isSelected = false;

  if (detail.isActive === true) {
    detail.isActive = !detail.isActive;
    renderCondition.value[list.num].haveActive = false;

    queryData[list.title.key] = null;
    list.condition.forEach((item) => {
      item.isSelected = false;
    });
  } else {
    list.condition.forEach((item) => {
      item.isActive = false;
    });
    detail.isActive = !detail.isActive;
    renderCondition.value[list.num].haveActive = true;
    queryData[list.title.key] = detail.id;
  }
}

// 分类二级标签
function sortTagClick(index, index2) {
  moreSortTags.value[index].haveActive = true;
  moreSortTags.value[index].task_list.forEach((item) => {
    item.isSelected = true;
  });
  moreSortTags.value[index].task_list[index2].isSelected = false;
  if (moreSortTags.value[index].task_list[index2].isActive === true) {
    moreSortTags.value[index].task_list[index2].isActive =
      !moreSortTags.value[index].task_list[index2].isActive;
    moreSortTags.value[index].haveActive = false;
    moreSortTags.value[index].task_list.forEach((item) => {
      item.isSelected = false;
    });
  } else {
    moreSortTags.value[index].task_list.forEach((single) => {
      single.isActive = false;
      moreSortTags.value[index].task_list[index2].isActive = true;
    });
  }
  tagsSearch(moreSortTags.value);
}
function clearSortItem(index) {
  moreSortTags.value[index].haveActive = false;
  moreSortTags.value[index].task_list.forEach((item) => {
    item.isActive = false;
    item.isSelected = false;
  });
  tagsSearch(moreSortTags.value);
}
// 二级标签查询
function tagsSearch(date) {
  let taskId = [];
  date.forEach((item) => {
    item.task_list.forEach((it) => {
      if (it.isActive === true) {
        taskId.push(it.id);
      }
    });
  });
  if (taskId.length > 0) {
    queryData.task = taskId.join(',');
  } else {
    queryData.task = null;
  }
}

//查询
function goSearch(render) {
  let time = 0;
  queryData.page = 1;
  let taskCate = [];
  let tagLists = [];
  render.forEach((item) => {
    time = 0;
    item.condition.forEach((value) => {
      if (value.isActive) {
        if (item.title.key == 'task') {
          taskCate.push(value.id);
          queryData.task_cate = taskCate.join(',');
        } else if (item.title.key == 'tags') {
          tagLists.push(value.id);
          queryData.tags = tagLists.join(',');
        } else {
          queryData[item.title.key] = value.id;
        }
      } else {
        time += 1;
      }
    });
    if (time === item.condition.length) {
      queryData[item.title.key] = null; // 所有都未选不传
      item.haveActive = false;
      if (item.title.key == 'task') {
        queryData['task_cate'] = null;
      }
    }
  });
}

function dropdownClick(item) {
  queryData.order = item.value;
}

function getProject() {
  getProjectData(queryData).then((res) => {
    projectCount.value = res.count;
    if (projectCount.value / 10 < 8) {
      layout.value = layout.value.split(',').splice(0, 4).join(',');
    }
    projectData.value = res.results.data;
  });
}

function getModelTag() {
  getModelTags(queryData).then((res) => {
    i18n.screenCondition.forEach((item) => {
      res.data[item.title.key].forEach((it) => {
        it.isActive = false;
        item.condition.push(it);
      });
    });
    renderCondition.value = i18n.screenCondition.splice(1, 3);
    renderCondition.value.forEach((item, index) => {
      item.showTagsAll = false;
      item.condition.forEach((it) => {
        it.isSelected = false;
      });
      item.num = index;
    });
    renderSorts.value = i18n.screenCondition.splice(0, 1);
    otherCondition.value = i18n.screenCondition;
    moreSortTags.value = renderSorts.value[0].condition;

    moreSortTags.value.forEach((sort) => {
      sort.haveActive = false;
      sort.task_list.forEach((tag) => {
        tag.isActive = false;
        tag.isSelected = false;
      });
    });
  });
}
getModelTag();

function goDetail(user, name) {
  router.push({
    path: `/projects/${user}/${name}`,
  });
}

function goSetNew() {
  if (loginStore.isLogined) {
    router.push('/new/projects');
  } else {
    goAuthorize();
  }
}
const layout = ref('sizes, prev, pager, next, jumper');
function handleSizeChange(val) {
  if (projectCount.value / val < 8) {
    layout.value = layout.value.split(',').splice(0, 4).join(',');
  }
  queryData.size = val;
}

function handleCurrentChange(val) {
  queryData.page = val;
  toTop();
}

function toTop() {
  document.documentElement.scrollTop = 0;
}
function getKeyWord() {
  queryData.page = 1;
  queryData.search = keyWord.value;
}

watch(
  queryData,
  () => {
    debounceSearch();
  },
  {
    immediate: true,
  }
);

onMounted(() => {
  debounceSearch.cancel();
});
</script>

<template>
  <div class="model-page">
    <div class="model-head">
      <div class="warp">
        <div class="banner-left">
          <div class="title">{{ i18n.head.title }}</div>
          <div class="introduce">{{ i18n.head.introduce }}</div>
        </div>
        <div class="banner-right">
          <o-button type="primary" @click="goSetNew">{{
            i18n.head.btn
          }}</o-button>
        </div>
      </div>
    </div>
    <div class="model-body warp">
      <div></div>
      <!-- 标签二级(全部) -->
      <div v-show="showDetail" class="condition">
        <p class="getback" @click="backCondition">
          <o-icon><icon-back></icon-back></o-icon>{{ i18n.back }}
        </p>
        <p class="sort-title">{{ i18n.taskSort }}</p>
        <!-- <el-input
          v-model="queryData.search"
          :prefix-icon="Search"
          class="w-50 m-2"
          placeholder="请输入tag名称"
        /> -->
        <div
          v-for="(item, index) in moreSortTags"
          :key="item.id"
          class="condition-item"
        >
          <div class="condition-title">
            <span>{{ item.name }}</span>
            <div
              v-if="item.haveActive"
              class="clear"
              @click="clearSortItem(index)"
            >
              <o-icon class="icon-x"><icon-clear></icon-clear></o-icon>
              <span>{{ i18n.clear }}</span>
            </div>
          </div>
          <div class="condition-box-all">
            <div
              v-for="(detail, index2) in item.task_list"
              :key="detail"
              class="condition-detail"
              :class="{
                'condition-active1': detail.isActive === true,
                'condition-active': detail.isSelected === true,
              }"
              @click="sortTagClick(index, index2)"
            >
              {{ detail.name }}
              <o-icon class="icon-x">
                <icon-x></icon-x>
              </o-icon>
            </div>
          </div>
        </div>
      </div>
      <!-- 单选的显示全部 -->
      <div v-show="showTags" class="condition">
        <p class="getback" @click="backCondition">
          <o-icon><icon-back></icon-back></o-icon>{{ i18n.back }}
        </p>
        <p class="sort-title">协议</p>
        <!-- <el-input
          v-model="queryData.search"
          :prefix-icon="Search"
          class="w-50 m-2"
          placeholder="请输入tag名称"
        /> -->
        <div class="condition-radio">
          <div
            v-for="detail in radioList.condition"
            :key="detail"
            class="condition-detail"
            :class="{
              'condition-active1': detail.isActive === true,
              'condition-active': detail.isSelected === true,
            }"
            @click="radioClick(detail, radioList)"
          >
            {{ detail.name }}
            <o-icon class="icon-x">
              <icon-x></icon-x>
            </o-icon>
          </div>
        </div>
      </div>

      <div v-show="showCondition" class="condition">
        <!-- 应用分类 -->
        <div
          v-for="(item, index) in renderSorts"
          :key="item.title"
          class="condition-item"
        >
          <div class="condition-title">
            <span>{{ item.title.text }}</span>
            <div
              v-if="item.haveActive"
              class="clear"
              @click="clearItem1(index)"
            >
              <o-icon class="icon-x"><icon-clear></icon-clear></o-icon>
              <span>{{ i18n.clear }}</span>
            </div>
          </div>

          <div class="condition-box">
            <div
              v-for="(tag, index2) in item.condition"
              :key="tag"
              class="condition-detail"
              :class="[{ 'condition-active1': tag.isActive }]"
              @click="sortsClick(index, index2)"
            >
              {{ tag.name }}
              <o-icon class="icon-x"><icon-x></icon-x></o-icon>
            </div>
          </div>
          <div class="check-all">
            <div class="check-all-modal"></div>
            <span @click="moreClick">查看全部</span>
          </div>
        </div>
        <!-- sdk status 协议 -->
        <div
          v-for="(item, index) in renderCondition"
          :key="item"
          class="condition-item"
        >
          <div class="condition-title">
            <span>{{ item.title.text }}</span>
            <div v-if="item.haveActive" class="clear" @click="clearItem(index)">
              <o-icon class="icon-x"><icon-clear></icon-clear></o-icon>
              <span>{{ i18n.clear }}</span>
            </div>
          </div>
          <div class="condition-box">
            <div
              v-for="(detail, index2) in item.condition"
              :key="detail"
              class="condition-detail"
              :class="{
                'condition-active1': detail.isActive === true,
                'condition-active': detail.isSelected === true,
              }"
              @click="conditionClick(index, index2, detail.id)"
            >
              {{ detail.name }}
              <o-icon class="icon-x">
                <icon-x></icon-x>
              </o-icon>
            </div>
          </div>
          <div
            v-if="renderCondition[index].condition.length > 7"
            class="radio-all"
          >
            <div class="check-all-modal"></div>
            <span @click="checkAllClick(item, index)">查看全部</span>
          </div>
        </div>
        <!-- 其他 -->
        <div
          v-for="(item, index) in otherCondition"
          :key="item.title"
          class="condition-item"
        >
          <div class="condition-title">
            <span>{{ item.title.text }}</span>
            <div
              v-if="item.haveActive"
              class="clear"
              @click="clearItem3(index)"
            >
              <o-icon class="icon-x"><icon-clear></icon-clear></o-icon>
              <span>{{ i18n.clear }}</span>
            </div>
          </div>
          <div class="condition-box">
            <div
              v-for="(tag, index2) in item.condition"
              :key="tag"
              class="condition-detail"
              :class="[{ 'condition-active1': tag.isActive }]"
              @click="othersClick(index, index2)"
            >
              {{ tag.name }}
              <o-icon class="icon-x"><icon-x></icon-x></o-icon>
            </div>
          </div>
        </div>
      </div>

      <div class="card-box">
        <div class="card-box-top">
          <div class="card-head">
            <div class="model-number">
              {{ i18n.head.count }} {{ projectCount }}
            </div>
            <div class="moderl-head-right">
              <el-input
                v-model="keyWord"
                :prefix-icon="Search"
                class="w-50 m-2"
                placeholder="请输入项目名称"
                @change="getKeyWord"
              />
              <el-dropdown popper-class="filter">
                <span class="el-dropdown-link">
                  <o-icon>
                    <icon-menu></icon-menu>
                  </o-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      v-for="item in i18n.sortCondition"
                      :key="item"
                      @click="dropdownClick(item)"
                      >{{ item.text }}</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>

          <div v-if="projectData" class="card-list">
            <div
              v-for="item in projectData"
              :key="item.id"
              class="pro-card"
              @click="goDetail(item.owner_name.name, item.name)"
            >
              <div class="card-top">
                <img :src="item.photo_url" alt="" />
                <p class="title">{{ item.name }}</p>
                <div class="dig">
                  <o-icon> <icon-heart></icon-heart> </o-icon
                  >{{ item.digg_count }}
                </div>
                <div class="card-modal"></div>
              </div>

              <div class="card-bottom">
                <div class="info">
                  <div class="info-avata">
                    <img :src="item.owner_name.avatar_url" alt="" />
                  </div>
                  <div class="info-name">
                    {{ item.owner_name.name }}
                  </div>
                </div>
                <div class="time">
                  <o-icon>
                    <icon-time></icon-time>
                  </o-icon>
                  {{ item.update_date_time.split(' ')[0] }}
                </div>
              </div>
            </div>
            <!-- 分页 -->
            <div v-if="projectCount > 10" class="pagination">
              <el-pagination
                :page-sizes="[12, 24, 60]"
                :current-page="queryData.page"
                :page-size="queryData.size"
                :total="projectCount"
                :layout="layout"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              ></el-pagination>
            </div>
          </div>

          <!-- 无项目显示 -->
          <div v-if="projectCount == 0" class="empty-status">
            <img src="@/assets/imgs/project-empty.png" alt="" />
            <p @click="setNewClick">未搜索到相关项目</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$theme: #0d8dff;
.warp {
  margin: 0 auto;
  padding: 50px 16px 136px 16px;
  max-width: 1472px;
}

.model-page {
  background-color: #f5f6f8;
  .model-head {
    padding-top: 80px;
    background-size: cover;
    background-image: url('@/assets/imgs/banner-head.png');
    .warp {
      display: flex;
      justify-content: space-between;
      padding: 42px 16px;
      color: #fff;
      .title {
        padding-bottom: 8px;
        font-size: 36px;
      }
      .introduce {
        font-size: 18px;
      }
      .banner-right {
        display: flex;
        align-items: center;
      }
    }
  }
  .model-body {
    display: flex;
    // padding: 50px 0 100px 0;
    .condition {
      position: relative;
      width: 100%;
      max-width: 464px;
      min-height: calc(100vh - 300px);
      margin: 0 24px 0 0;
      padding: 40px;
      background-color: #fff;
      .getback {
        font-size: 16px;
        color: #555;
        margin-bottom: 25px;
        display: flex;
        align-items: center;
        cursor: pointer;
        .o-icon {
          margin-right: 8px;
        }
      }
      .sort-title {
        font-size: 24px;
        line-height: 32px;
        margin-bottom: 25px;
      }
      .el-input {
        margin: 24px 0 40px 0;
        height: 56px;
      }
      &-title {
        display: flex;
        justify-content: space-between;
        margin-bottom: 24px;
        line-height: 32px;
        font-size: 18px;

        .clear {
          cursor: pointer;
          font-size: 14px;
          display: flex;
          align-items: center;
          .o-icon {
            margin-right: 6px;
          }
        }
      }
      &-item {
        position: relative;
        .check-all {
          font-size: 14px;
          color: #555;
          height: 28px;
          line-height: 28px;
          cursor: pointer;
          position: absolute;
          right: 0px;
          bottom: 6px;
          display: flex;
          &:hover {
            color: #0d8dff;
          }
          span {
            background-color: #fff;
          }
        }
      }
      .check-all-modal {
        width: 75px;
        height: 28px;
        background: linear-gradient(
          90deg,
          rgba(255, 255, 255, 0) 0%,
          #ffffff 100%
        );
      }
      .radio-all {
        font-size: 14px;
        color: #555;
        height: 28px;
        line-height: 28px;
        position: absolute;
        right: 0px;
        bottom: 6px;
        display: flex;
        cursor: pointer;
        span {
          background-color: #fff;
        }
        &:hover {
          color: #0d8dff;
        }
      }
      &-box-all {
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 24px;
      }
      .condition-detail {
        cursor: pointer;
        display: flex;
        align-items: center;
        padding: 0 12px;
        margin: 0 16px 16px 0;
        height: 28px;
        font-size: 14px;
        color: #555;
        user-select: none;
        background-color: #f3f9ff;
        border-radius: 8px;
        border: 1px solid #e5e5e5;

        .icon-x {
          display: none;
        }
      }

      .condition-active1 {
        color: $theme;
        .icon-x {
          display: block;
          padding: 2px;
          font-size: 20px;
        }
      }

      .condition-active {
        color: #ccc;
      }
      &-box {
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 24px;
        max-height: 78px;
        overflow: hidden;
      }
      &-radio {
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 24px;
        .condition-detail {
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 0 12px;
          margin: 0 16px 16px 0;
          height: 28px;
          font-size: 14px;
          color: #555;
          user-select: none;
          background-color: #f3f9ff;
          border-radius: 8px;
          border: 1px solid #e5e5e5;

          .icon-x {
            display: none;
          }
        }

        .condition-active1 {
          color: $theme;
          .icon-x {
            display: block;
            padding: 2px;
            font-size: 20px;
          }
        }

        .condition-active {
          color: #ccc;
        }
      }
    }

    .card-box {
      width: 100%;
      display: flex;
      flex-direction: column;
      position: relative;
      .card-box-top {
        flex: 1;
      }
      .card-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 24px;
        width: 100%;
        background-color: #fff;

        .moderl-head-right {
          display: flex;
          align-items: center;

          .o-icon {
            cursor: pointer;
            margin-left: 24px;
            font-size: 24px;
          }
        }
      }

      .empty-status {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        img {
          width: 280px;
          height: 206px;
        }
        p {
          font-size: 18px;
          color: rgba(85, 85, 85, 1);
          margin-top: 24px;
        }
      }

      .card-list {
        display: grid;
        grid-template-columns: repeat(3, minmax(200px, 1fr));
        column-gap: 24px;
        row-gap: 24px;
        margin-top: 40px;
        position: relative;
        .pagination {
          display: flex;
          justify-content: center;
          // margin-top: 40px;
          position: absolute;
          bottom: -76px;
          left: 50%;
          transform: translateX(-50%);
        }
        .pro-card {
          cursor: pointer;
          box-shadow: 0px 1px 5px 0px rgba(45, 47, 51, 0.1);
          &:hover {
            box-shadow: 0px 6px 18px 0px rgba(13, 141, 255, 0.14);
          }
          .o-icon {
            margin-right: 2px;
          }
          .card-top {
            height: 169px;
            position: relative;
            color: #fff;
            img {
              width: 100%;
              height: 100%;
            }
            .title {
              font-size: 18px;
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              z-index: 1;
            }
            .dig {
              position: absolute;
              right: 16px;
              top: 17px;
              font-size: 12px;
              display: flex;
              align-items: center;
              z-index: 1;
              .o-icon {
                font-size: 16px;
                svg {
                  fill: #fff;
                }
              }
            }
            .card-modal {
              width: 100%;
              height: 100%;
              background: rgba(0, 0, 0, 0.3);
              position: absolute;
              top: 0;
              left: 0;
            }
          }
          .card-bottom {
            height: 62px;
            padding: 16px 24px 24px 24px;
            display: flex;
            justify-content: space-between;
            line-height: 22px;
            background-color: #fff;
            .info {
              flex: 1;
              display: flex;
              .info-avata img {
                width: 22px;
                height: 22px;
                border-radius: 50%;
                margin-right: 8px;
              }
              .info-name {
                flex: 1;
                height: 22px;
                font-size: 14px;
              }
            }
            .time {
              min-width: 76px;
              font-size: 12px;
              display: flex;
              align-items: center;
              color: #555;
              .o-icon {
                font-size: 16px;
                margin-right: 4px;
                svg {
                  fill: #555;
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
