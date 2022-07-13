<script setup>
import { ref, reactive, watch, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import OIcon from '@/components/OIcon.vue';
import OEmpty from '@/components/OEmpty.vue';

import { Search } from '@element-plus/icons-vue';
import IconMenu from '~icons/app/menu';
import IconX from '~icons/app/x';
// import IconTime from '~icons/app/time';
// import IconHeart from '~icons/app/heart';
import IconClear from '~icons/app/clear';
import IconBack from '~icons/app/back';
import emptyImg from '@/assets/imgs/dataset-empty.png';
import { useUserInfoStore } from '@/stores';

import { getModelTags } from '@/api/api-model';
import { getDatasetData } from '@/api/api-dataset';
import { goAuthorize } from '@/shared/login';
import { debounce } from 'lodash/function';

const userInfoStore = useUserInfoStore();

const route = useRoute();
const router = useRouter();
let i18n = {
  head: {
    title: '数据集',
    count: '总数',
    introduce:
      '在数据集仓库中，你既可以下载公开的数据集，也可以上传合规的数据集，更详细的数据集介绍请参考文档。',
    btn: '新建数据集',
  },
  back: '返回上一级',
  tagPlacholder: '请输入tag名称',
  taskSort: '应用分类',
  more: '查看全部',
  clear: '清除',
  sortCondition: [
    { text: '按照下载量排序', value: 'download' },
    { text: '按照首字母排序', value: 'name' },
    { text: '按照更新时间排序', value: '-update_time' },
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
    // {
    //   title: {
    //     text: '数据集大小',
    //     key: 'relate_datasets',
    //   },
    //   haveActive: false,
    //   condition: [],
    // },
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
const modelCount = ref(0);
const modelData = ref([]);
const renderCondition = ref([]);
const renderSorts = ref([]);
const showDetail = ref(false);
const moreSortTags = ref([]);
const showCondition = ref(true);
const showTags = ref(false);
const radioList = ref({});
const keyWord = ref('');

let query = reactive({
  search: null,
  page: 1,
  size: 10,
  task: null, //应用分类
  task_cate: null /* 一级分类 */,
  libraries: null,
  licenses: null, //协议
  model_format: null,
  device_target: null,
  relate_datasets: null,
  order: null,
  tags: null, //其他
});

// query.search = route.query.search;
const debounceSearch = debounce(getDataset, 500, {
  trailing: true,
});

function moreClick() {
  showDetail.value = true;
  showCondition.value = false;
}

function backCondition() {
  showDetail.value = false;
  showCondition.value = true;
  showTags.value = false;
}

// 应用分类--多选
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
  query['task_cate'] = null;
}

//数据集/其他（多选）--协议单选
function conditionClick(index, index2) {
  renderCondition.value[index].haveActive = true;
  if (renderCondition.value[index].title.key === 'licenses') {
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
      renderCondition.value[index].haveActive = false;
    } else {
      renderCondition.value[index].condition.forEach((single) => {
        single.isActive = false;
        renderCondition.value[index].condition[index2].isActive = true;
      });
    }
  } else {
    renderCondition.value[index].condition[index2].isActive =
      !renderCondition.value[index].condition[index2].isActive;
    let bool = renderCondition.value[index].condition.every(
      (item) => item.isActive === false
    );
    if (bool) {
      renderCondition.value[index].haveActive = false;
    }
  }
  goSearch(renderCondition.value);
}

//查询
function goSearch(render) {
  let time = 0;
  let taskCate = [];
  let tagLists = [];
  query.page = 1;
  render.forEach((item) => {
    time = 0;
    item.condition.forEach((value) => {
      if (value.isActive) {
        if (item.title.key === 'task') {
          taskCate.push(value.id);
          query.task_cate = taskCate.join(',');
        } else if (item.title.key === 'tags') {
          tagLists.push(value.id);
          query.tags = tagLists.join(',');
        } else {
          query[item.title.key] = value.id;
        }
      } else {
        time += 1;
      }
    });
    if (time === item.condition.length) {
      query[item.title.key] = null; // 所有都未选不传
      item.haveActive = false;
      if (item.title.key === 'task') {
        query['task_cate'] = null;
      }
    }
  });
}

function clearItem(index) {
  renderCondition.value[index].haveActive = false;
  renderCondition.value[index].condition.map((item) => {
    item.isActive = false;
    item.isSelected = false;
    return item;
  });
  query[renderCondition.value[index].title.key] = null;
}
//查看全部标签
function checkAllClick(item, index) {
  showCondition.value = false;
  item.showTagsAll = true;
  showTags.value = true;
  radioList.value = renderCondition.value[index];
}
function radioClick(detail, list) {
  if (list.title.key === 'licenses') {
    if (detail.isActive === true) {
      detail.isActive = false;
      list.haveActive = false;
      renderCondition.value[list.num].condition.forEach((item) => {
        item.isSelected = false;
      });
    } else {
      renderCondition.value[list.num].condition.forEach((item) => {
        item.isActive = false;
        item.isSelected = true;
      });
      detail.isSelected = false;
      detail.isActive = true;
      list.haveActive = true;
    }
  } else {
    detail.isActive = !detail.isActive;
    let bool = renderCondition.value[list.num].condition.every(
      (item) => item.isActive === false
    );
    if (bool) {
      list.haveActive = false;
    } else {
      list.haveActive = true;
    }
  }
  goSearch(renderCondition.value);
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
  handleTagSearch(moreSortTags.value);
}
function clearSortItem(index) {
  moreSortTags.value[index].haveActive = false;
  moreSortTags.value[index].task_list.forEach((item) => {
    item.isActive = false;
    item.isSelected = false;
  });
  handleTagSearch(moreSortTags.value);
}

// 二级标签查询
function handleTagSearch(date) {
  let taskId = [];
  date.forEach((item) => {
    item.task_list.forEach((it) => {
      if (it.isActive === true) {
        taskId.push(it.id);
      }
    });
  });
  if (taskId.length > 0) {
    query.task = taskId.join(',');
  } else {
    query.task = null;
  }
}

function dropdownClick(item) {
  query.order = item.value;
}

function getDataset() {
  getDatasetData(query).then((res) => {
    modelCount.value = res.count;
    if (modelCount.value / query.size < 8) {
      layout.value = layout.value.split(',').splice(0, 4).join(',');
    }
    modelData.value = res.results.data;
  });
}
function getModelTag() {
  getModelTags(query).then((res) => {
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

    //应用分类二级菜单查看全部
    moreSortTags.value = renderSorts.value[0].condition;

    moreSortTags.value.forEach((sort) => {
      sort.haveActive = false;
      sort.task_list.forEach((tag) => {
        tag.isActive = false;
        tag.isSelected = false;
      });
      // sort.condition = sort.task_list;
    });
  });
}
getModelTag();

function goDetail(user, name) {
  router.push({
    path: `/datasets/${user}/${name}`,
  });
}

const layout = ref('sizes, prev, pager, next, jumper');
function handleSizeChange(val) {
  if (modelCount.value / val < 8) {
    layout.value = layout.value.split(',').splice(0, 4).join(',');
  }
  query.size = val;
}

function handleCurrentChange(val) {
  query.page = val;
  toTop();
}
function toTop() {
  document.documentElement.scrollTop = 0;
}
function goNewModel() {
  if (userInfoStore.id) {
    router.push('/new/datasets');
  } else {
    goAuthorize();
  }
}
function getKeyWord() {
  query.page = 1;
  query.search = keyWord.value;
}

// 二次点击数据集，跳转刷新数据集页面数据
watch(
  () => route.query.search,
  () => {
    query.search = route.query.search;
    keyWord.value = query.search;
    debounceSearch();
  },
  {
    immediate: true,
  }
);
watch(
  query,
  () => {
    debounceSearch();
  },
  {
    immediate: true,
  }
);
onUnmounted(() => {
  debounceSearch.cancel();
});
</script>

<template>
  <div class="model-page">
    <div class="model-head">
      <div class="wrap">
        <div class="banner-left">
          <div class="title">{{ i18n.head.title }}</div>
          <div class="introduce">{{ i18n.head.introduce }}</div>
        </div>
        <div class="banner-right">
          <o-button type="primary" @click="goNewModel">{{
            i18n.head.btn
          }}</o-button>
        </div>
      </div>
    </div>

    <div class="model-body wrap">
      <!-- 标签二级(全部) -->
      <div v-show="showDetail" class="condition">
        <p class="getback" @click="backCondition">
          <o-icon><icon-back></icon-back></o-icon>{{ i18n.back }}
        </p>
        <p class="sort-title">{{ i18n.taskSort }}</p>
        <!-- <el-input
          v-model="query.search"
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
      <!-- 协议其他显示全部 -->
      <div v-show="showTags" class="condition">
        <p class="getback" @click="backCondition">
          <o-icon><icon-back></icon-back></o-icon>{{ i18n.back }}
        </p>
        <p class="sort-title">协议</p>
        <!-- <el-input
          v-model="query.search"
          :prefix-icon="Search"
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
            <!-- <p class="check-all" @click="moreClick">查看全部</p> -->
          </div>
          <div class="check-all" @click="moreClick">
            <div class="check-all-modal"></div>
            <span>查看全部</span>
          </div>
        </div>

        <!-- 数据集大小 licenses（单选） 其它 -->
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
                'condition-active':
                  detail.isSelected === true && item.title.key === 'licenses',
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
            @click="checkAllClick(item, index)"
          >
            <div class="check-all-modal"></div>
            <span>查看全部</span>
          </div>
        </div>
      </div>

      <div class="card-box">
        <div class="card-box-top">
          <div class="card-head">
            <div class="model-number">
              {{ i18n.head.count }} {{ modelCount }}
            </div>
            <div class="moderl-head-right">
              <el-input
                v-model="keyWord"
                :prefix-icon="Search"
                class="w-50 m-2"
                placeholder="请输入数据集名称"
                @change="getKeyWord"
              />
              <el-dropdown popper-class="filter">
                <span class="el-dropdown-link">
                  <o-icon><icon-menu></icon-menu></o-icon>
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
          <div v-if="modelData.length" class="card-list">
            <o-card
              v-for="item in modelData"
              :key="item.id"
              :card-data="item"
              card-type="dataset"
              @click="goDetail(item.owner_name.name, item.name)"
            ></o-card>
            <div v-if="modelCount > 10" class="pagination">
              <el-pagination
                :page-sizes="[10, 20, 50]"
                :current-page="query.page"
                :page-size="query.size"
                :total="modelCount"
                :layout="layout"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              ></el-pagination>
            </div>
          </div>
          <o-empty v-else :img="emptyImg" describe="无匹配数据集"></o-empty>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$theme: #0d8dff;
.wrap {
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
        margin-bottom: 25px;
        font-size: 24px;
        line-height: 32px;
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
      &-box {
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 24px;
        max-height: 130px !important;
        overflow: hidden;
      }
      .condition-radio {
        display: flex;
        flex-wrap: wrap;
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

      &-title {
        display: flex;
        justify-content: space-between;
        margin-bottom: 24px;
        line-height: 32px;
        font-size: 18px;
        .clear {
          display: flex;
          cursor: pointer;
          font-size: 14px;
          align-items: center;
          .o-icon {
            margin-right: 6px;
            font-size: 16px;
          }
        }
      }
      &-box {
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 24px;
        max-height: 78px;
        overflow: hidden;
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
      &-box-all {
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
      position: relative;
      width: 100%;
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
      .card-list {
        position: relative;
        display: grid;
        grid-template-columns: repeat(2, minmax(200px, 1fr));
        column-gap: 24px;
        row-gap: 24px;
        margin-top: 40px;
        .pagination {
          display: flex;
          justify-content: center;
          margin-top: 40px;
          position: absolute;
          bottom: -76px;
          left: 50%;
          transform: translateX(-50%);
        }
      }
      :deep(.o-empty) {
        .empty-img {
          img {
            width: 280px;
          }
        }
      }
    }
  }
}
</style>
