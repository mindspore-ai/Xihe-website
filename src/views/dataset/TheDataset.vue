<script setup>
import { ref, reactive, watch, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import OIcon from '@/components/OIcon.vue';
import OEmpty from '@/components/OEmpty.vue';

import { Search } from '@element-plus/icons-vue';
import IconX from '~icons/app/x';
import IconClear from '~icons/app/clear';
import IconBack from '~icons/app/back';
import emptyImg from '@/assets/imgs/dataset-empty.png';
import { useUserInfoStore } from '@/stores';

import { getTags } from '@/api/api-dataset';
import { getDatasetData } from '@/api/api-dataset';
import { goAuthorize } from '@/shared/login';
import { debounce } from 'lodash/function';
import { ElMessage } from 'element-plus';

const userInfoStore = useUserInfoStore();

const route = useRoute();
const router = useRouter();
const layout = ref('sizes, prev, pager, next, jumper');

let i18n = {
  head: {
    title: '数据集',
    count: '总数',
    introduce:
      '在数据集仓库中，你既可以下载公开的数据集，也可以上传合规的数据集，更详细的数据集介绍请',
    reference: '参考文档',
    btn: '新建数据集',
  },
  back: '返回上一级',
  tagPlacholder: '请输入tag名称',
  taskSort: '应用分类',
  more: '查看全部',
  clear: '清除',
  sortCondition: [
    { text: '最多下载', value: 'download' },
    { text: '最新更新', value: '-update_time' },
    { text: '首字母', value: 'name' },
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
  name: null, // 项目名
  tags: null, // 标签
  tag_kinds: null, // 标签类型(应用分类)
  level: null, // 仓库级别
  count_per_page: 10, // 每页数量
  page_num: 1, // 分页
  sort_by: null, // 排序规则
});

function getDataset() {
  getDatasetData(query).then((res) => {
    modelCount.value = res.data.total;
    if (modelCount.value / query.count_per_page < 8) {
      layout.value = 'sizes, prev, pager, next';
    } else {
      layout.value = 'sizes, prev, pager, next, jumper';
    }
    modelData.value = res.data;
  });
}

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

// 查询
function goSearch(render) {
  let time1 = 0;
  let time2 = 0;
  query.page_num = 1;
  let tagList = []; // 标签
  let tag_kinds = []; // 标签类型
  render.forEach((item) => {
    time1 = 0;
    time2 = 0;
    // 应用分类
    if (item.title.key === 0) {
      item.condition.forEach((value) => {
        if (value.isActive) {
          tag_kinds.push(value.kind);
          if (tag_kinds.length < 6) {
            query.tag_kinds = tag_kinds.join(',');
          } else {
            ElMessage({
              message: '最多支持刷选5个标签 !',
              type: 'warning',
            });
            return;
          }
        } else {
          time1 += 1;
        }
      });
      if (time1 === item.condition.length) {
        item.haveActive = false;
        if (item.title.key === 0) {
          query.tag_kinds = null;
        }
      }
      // 协议(单选)
    } else {
      item.condition.forEach((value) => {
        value.items.forEach((val) => {
          if (val.isActive) {
            tagList.push(val.name);
            query.tags = tagList.join(',');
          } else {
            time2 += 1;
          }
        });
      });
      if (time2 === item.condition[0].items.length) {
        item.haveActive = false;
        if (item.title.key === 1) {
          query.tags = null;
        }
      }
    }
  });
}

// 应用分类--多选
function sortsClick(index, index2) {
  renderSorts.value[index].haveActive = true;
  // 高亮
  renderSorts.value[index].condition[index2].isActive =
    !renderSorts.value[index].condition[index2].isActive;
  goSearch(renderSorts.value);
}
// 清除所有的一级应用分类
function clearItem1(index) {
  renderSorts.value[index].haveActive = false;
  renderSorts.value[index].condition.forEach((item) => {
    item.isActive = false;
  });
  query.tag_kinds = null;
}

// 数据集/其他（多选）--协议单选
function conditionClick(index, index2) {
  renderCondition.value[index].haveActive = true;
  // 协议
  if (renderCondition.value[index].title.key === 1) {
    renderCondition.value[index].condition[index].items.forEach((item) => {
      item.isSelected = true;
    });
    renderCondition.value[index].condition[index].items[
      index2
    ].isSelected = false;
    if (
      renderCondition.value[index].condition[index].items[index2].isActive ===
      true
    ) {
      renderCondition.value[index].condition[index].items[index2].isActive =
        !renderCondition.value[index].condition[index].items[index2].isActive;
      renderCondition.value[index].condition[index].items.forEach((item) => {
        item.isSelected = false;
      });
      renderCondition.value[index].haveActive = false;
    } else {
      renderCondition.value[index].condition[index].items.forEach((single) => {
        single.isActive = false;
        renderCondition.value[index].condition[index].items[
          index2
        ].isActive = true;
      });
    }
  } else {
    renderCondition.value[index].condition[0].items[index2].isActive =
      !renderCondition.value[index].condition[0].items[index2].isActive;
    let bool = renderCondition.value[index].condition[0].items.every(
      (item) => item.isActive === false
    );
    if (bool) {
      renderCondition.value[index].haveActive = false;
    }
  }
  goSearch(renderCondition.value);
}

function clearItem(index) {
  renderCondition.value[index].haveActive = false;
  renderCondition.value[index].condition[0].items.map((item) => {
    item.isActive = false;
    item.isSelected = false;
    return item;
  });
  query.tags = null;
}
// 查看全部标签
let radioItem = ref({});
function checkAllClick(item, index) {
  showCondition.value = false;
  item.showTagsAll = true;
  showTags.value = true;
  radioItem.value = renderCondition.value[index];
  radioList.value = renderCondition.value[index].condition[0];
}
// 二级协议点击
function radioClick(detail, list) {
  // 协议
  if (list.title.key === 1) {
    if (detail.isActive === true) {
      detail.isActive = false;
      list.haveActive = false;
      renderCondition.value[list.num].condition[0].items.forEach((item) => {
        item.isSelected = false;
      });
    } else {
      renderCondition.value[list.num].condition[0].items.forEach((item) => {
        item.isActive = false;
        item.isSelected = true;
      });
      detail.isSelected = false;
      detail.isActive = true;
      list.haveActive = true;
    }
  } else {
    detail.isActive = !detail.isActive;
    let bool = renderCondition.value[list.num].condition[0].items.every(
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

// 二级标签查询
function handleTagSearch(date) {
  let tagList = [];
  date.forEach((item) => {
    item.items.forEach((val) => {
      if (val.isActive === true) {
        tagList.push(val.name);
      }
    });
  });
  if (tagList.length > 0) {
    if (tagList.length < 6) {
      query.tags = tagList.join(',');
    } else {
      ElMessage({
        message: '最多支持刷选5个标签 !',
        type: 'warning',
      });
      return;
    }
  } else {
    query.tags = null;
  }
}

// 应用分类二级标签
function sortTagClick(index, index2) {
  moreSortTags.value[index].haveActive = true;
  moreSortTags.value[index].items.forEach((item) => {
    item.isSelected = true;
  });
  moreSortTags.value[index].items[index2].isSelected = false;
  if (moreSortTags.value[index].items[index2].isActive === true) {
    moreSortTags.value[index].items[index2].isActive =
      !moreSortTags.value[index].items[index2].isActive;
    moreSortTags.value[index].haveActive = false;
    moreSortTags.value[index].items.forEach((item) => {
      item.isSelected = false;
    });
  } else {
    moreSortTags.value[index].items.forEach((single) => {
      single.isActive = false;
      moreSortTags.value[index].items[index2].isActive = true;
    });
  }
  handleTagSearch(moreSortTags.value);
}
// 清除应用分类二级的所有标签
function clearSortItem(index) {
  moreSortTags.value[index].haveActive = false;
  moreSortTags.value[index].items.forEach((item) => {
    item.isActive = false;
    item.isSelected = false;
  });
  handleTagSearch(moreSortTags.value);
}

const sortValue = ref('');
function getSortData(item) {
  sortValue.value = item.text;
  if (item.value === 'download') {
    query.sort_by = 'download_count';
  } else if (item.value === 'name') {
    query.sort_by = 'first_letter';
  } else if (item.value === '-update_time') {
    query.sort_by = 'update_time';
  }
}

function getModelTag() {
  getTags('global_dataset').then((res) => {
    i18n.screenCondition = res.data.map((item, index) => {
      return {
        title: {
          text: item.domain,
          key: index,
        },
        haveActive: false,
        condition: [],
      };
    });
    i18n.screenCondition.forEach((item) => {
      res.data[item.title.key].items.forEach((it) => {
        if (
          window.history.state.tag_kinds === 'CV' &&
          (it.kind === 'CV' || it.items[0] === 'electricity')
        ) {
          it.isActive = true;
          it.isSelected = true;
        } else if (
          window.history.state.tag_kinds === 'NLP' &&
          (it.kind === 'NLP' || it.items[0] === 'electricity')
        ) {
          it.isActive = true;
          it.isSelected = true;
        } else {
          it.isActive = false;
          it.isSelected = false;
        }
        item.condition.push(it);
      });
    });
    let ind;
    res.data.forEach((item, index) => {
      if (item.domain === '应用分类') ind = index;
    });
    renderSorts.value = i18n.screenCondition.splice(ind, 1);

    renderCondition.value = i18n.screenCondition;
    renderCondition.value.forEach((item, index) => {
      item.showTagsAll = false;
      item.condition[0].items = item.condition[0].items.map((it) => {
        return {
          name: it,
          isSelected: false,
        };
      });
      item.condition.forEach((it) => {
        // 电力跳转过来标签高亮
        if (window.history.state.tags && it.items[0].name === 'electricity') {
          it.items[0].isActive = true;
          it.items[0].isSelected = false;
        }
      });
      item.num = index;
    });

    // 应用分类二级菜单查看全部
    moreSortTags.value = renderSorts.value[0].condition;

    moreSortTags.value.forEach((sort) => {
      sort.haveActive = false;
      sort.items = sort.items.map((tag) => {
        return {
          name: tag,
          isActive: false,
          isSelected: false,
        };
      });
    });
  });
}
getModelTag();

function goDetail(user, name) {
  // 点击在新页签打开
  let routerData = router.resolve({
    path: `/datasets/${user}/${name}`,
  });
  window.open(routerData.href, '_blank');
}

function handleSizeChange(val) {
  if (modelCount.value / val < 8) {
    layout.value = 'sizes, prev, pager, next';
  } else {
    layout.value = 'sizes, prev, pager, next, jumper';
  }
  query.count_per_page = val;
}

function toTop() {
  document.documentElement.scrollTop = 0;
}
function handleCurrentChange(val) {
  query.page_num = val;
  toTop();
}

function goNewModel() {
  if (userInfoStore.id) {
    router.push('/new/datasets');
  } else {
    goAuthorize();
  }
}
function getKeyWord() {
  query.page_num = 1;
  query.name = keyWord.value;
}

// 二次点击数据集，跳转刷新数据集页面数据
watch(
  () => route.query.search,
  () => {
    query.name = route.query.search;
    keyWord.value = query.name;
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

watch(
  () => window.history.state.tags,
  () => {
    query.tag_kinds = window.history.state.tag_kinds;
    query.tags = window.history.state.tags;
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
          <div class="introduce">
            {{ i18n.head.introduce }}
            <a
              class="reference"
              href="https://xihe-docs.mindspore.cn/zh/basics/dataset_ui/"
              target="_blank"
              rel="noopener noreferrer"
              >{{ i18n.head.reference }}</a
            >
          </div>
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
        <div
          v-for="(item, index) in moreSortTags"
          :key="item.id"
          class="condition-item"
        >
          <div class="condition-title">
            <span>{{ item.kind }}</span>
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
            <!-- 点击应用分类二级 -->
            <div
              v-for="(detail, index2) in item.items"
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
        <div class="condition-radio">
          <div
            v-for="detail in radioList.items"
            :key="detail"
            class="condition-detail"
            :class="{
              'condition-active1': detail.isActive === true,
              'condition-active': detail.isSelected === true,
            }"
            @click="radioClick(detail, radioItem)"
          >
            {{ detail.name }}
            <o-icon class="icon-x">
              <icon-x></icon-x>
            </o-icon>
          </div>
        </div>
      </div>

      <div v-show="showCondition" class="condition">
        <!-- 应用分类一级标签 -->
        <div
          v-for="(item, index) in renderSorts"
          :key="item.title"
          class="condition-item"
        >
          <div class="condition-title">
            <span>{{ item.title.text }}</span>
            <!-- 清除所有的应用分类 -->
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
              {{ tag.kind }}
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
        <!-- 协议一级标签 -->
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
              v-for="(detail, index2) in item.condition[0].items"
              :key="detail"
              class="condition-detail"
              :class="{
                'condition-active1': detail.isActive === true,
                'condition-active':
                  detail.isSelected === true && item.title.key === 1,
              }"
              @click="conditionClick(index, index2, detail.id)"
            >
              {{ detail.name === 'electricity' ? '电力' : detail.name }}
              <o-icon class="icon-x">
                <icon-x></icon-x>
              </o-icon>
            </div>
          </div>
          <div
            v-if="renderCondition[index].condition[0].items.length > 7"
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
              {{ i18n.head.count }} <span>{{ modelCount }}</span>
            </div>
            <div class="moderl-head-right">
              <el-input
                v-model="keyWord"
                :prefix-icon="Search"
                class="w-50 m-2"
                placeholder="请输入数据集名称"
                @change="getKeyWord"
              />
              <div class="sort-select">
                <el-select
                  v-model="sortValue"
                  placeholder="排序"
                  @change="getSortData"
                >
                  <el-option
                    v-for="item in i18n.sortCondition"
                    :key="item.id"
                    :label="item.text"
                    :value="item"
                  />
                </el-select>
              </div>
            </div>
          </div>
          <div v-if="modelData.projects" class="card-list">
            <app-card
              v-for="item in modelData.projects"
              :key="item.id"
              :card-data="item"
              :avatar-img="item.avatar_id"
              card-type="dataset"
              @click="goDetail(item.owner, item.name)"
            ></app-card>
            <div v-if="modelCount > 10" class="pagination">
              <div class="total">
                <span> 共 </span>
                <span>{{ modelCount }}</span>
                <span> 条数据 </span>
              </div>
              <el-pagination
                :page-sizes="[10, 20, 50]"
                :current-page="query.page_num"
                :page-size="query.count_per_page"
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
  padding: 40px 16px 136px 16px;
  max-width: 1448px;
}
.model-page {
  background-color: #f5f6f8;
  .model-head {
    padding-top: 80px;
    background-size: cover;
    background-image: url('@/assets/imgs/banner-dataset.png');
    .wrap {
      display: flex;
      justify-content: space-between;
      padding: 42px 16px;
      color: #000;
      .title {
        padding-bottom: 8px;
        font-size: 36px;
      }
      .introduce {
        font-size: 18px;
        .reference {
          color: #000;
          text-decoration: underline;
          &:hover {
            color: #0d8dff;
          }
        }
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
      max-width: 424px;
      min-height: calc(100vh - 300px);
      margin: 0 40px 0 0;
      padding: 24px;
      background-color: #fff;
      border-radius: 16px;
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
          bottom: 14px;
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
        bottom: 14px;
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
          border-radius: 14px;
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
          border-radius: 14px;
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
          border-radius: 14px;
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
        padding: 18px 24px;
        width: 100%;
        background-color: #fff;
        border-radius: 16px;
        .model-number {
          font-size: 14px;
          line-height: 22px;
          span {
            color: #555;
            margin-left: 8px;
          }
        }
        .moderl-head-right {
          display: flex;
          align-items: center;
          .o-icon {
            cursor: pointer;
            margin-left: 24px;
            font-size: 24px;
          }
          .el-input {
            width: 320px;
          }

          .sort-select {
            margin-left: 8px;
            .el-select {
              width: 114px;
            }
          }
        }
      }
      .card-list {
        position: relative;
        display: grid;
        grid-template-columns: repeat(2, minmax(200px, 1fr));
        column-gap: 24px;
        row-gap: 24px;
        margin-top: 24px;
        .pagination {
          display: flex;
          justify-content: center;
          margin-top: 40px;
          position: absolute;
          bottom: -76px;
          left: 50%;
          transform: translateX(-50%);

          .total {
            line-height: 36px;
            font-size: 14px;
            font-weight: 400;
            color: rgba(0, 0, 0, 0.8);
            margin-right: 8px;
            white-space: nowrap;
          }
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
