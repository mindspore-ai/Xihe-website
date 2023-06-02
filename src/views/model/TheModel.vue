<script setup>
import { ref, reactive, watch, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import OIcon from '@/components/OIcon.vue';
import OButton from '@/components/OButton.vue';
import OEmpty from '@/components/OEmpty.vue';

import IconX from '~icons/app/x';
import IconClear from '~icons/app/clear';
import IconBack from '~icons/app/back';
import emptyImg from '@/assets/imgs/model-empty.png';

import { Search } from '@element-plus/icons-vue';
import { useUserInfoStore } from '@/stores';
import { goAuthorize } from '@/shared/login';
import { debounce } from 'lodash/function';

import AppContent from '@/components/AppContent.vue';

import { getModelData, getTags } from '@/api/api-model';
import { ElMessage } from 'element-plus';

const userInfoStore = useUserInfoStore();

const router = useRouter();
const route = useRoute();
let i18n = {
  head: {
    title: '模型库',
    introduce:
      '覆盖全领域主流模型，可体验MindSpore大模型推理API，用户既可下载公开的预训练模型，也可以上传自行训练的模型文件，详情请点击',
    reference: '参考文档',
    btn: '新建模型',
    count: '总数',
  },
  back: '返回上一级',
  taskSort: '应用分类',
  tagPlacholder: '请输入tag名称',
  more: '更多',
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
    {
      title: {
        text: '处理器',
        key: 'device_target',
      },
      haveActive: false,
      condition: [],
    },
    {
      title: {
        text: '文件格式',
        key: 'model_format',
      },
      haveActive: false,
      condition: [],
    },
    {
      title: {
        text: '框架',
        key: 'libraries',
      },
      haveActive: false,
      condition: [],
    },
    {
      title: {
        text: '训练数据集',
        key: 'relate_datasets',
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

const modelCount = ref(0);
const modelData = ref([]);
const renderCondition = ref([]);
const showDetail = ref(false);
const moreSortTags = ref([]);
const showCondition = ref(true);
const showTags = ref(false);
const radioList = ref({}); //应用分类二级标签列表
const radioList2 = ref({});
const modalName = ref('');
const keyWord = ref('');

let queryData = reactive({
  name: null, //项目名
  tags: null, //标签
  tag_kinds: null, //标签类型(应用分类)
  level: null, //仓库级别
  count_per_page: 10, //每页数量
  page_num: 1, //分页
  sort_by: null, //排序规则
});

const debounceSearch = debounce(getModel, 500, {
  trailing: true,
});

function backCondition() {
  showDetail.value = false;
  showCondition.value = true;
  showTags.value = false;
}

// 多选-->处理器，文件格式，框架，训练数据集，其他;-->应用分类 ，协议单选
function conditionClick(index, index2, detail) {
  renderCondition.value[index].haveActive = true;
  if (renderCondition.value[index].title.text === '应用分类') {
    // 清除应用分类一级分类
    if (detail.isActive === true) {
      detail.isActive = !detail.isActive;
      renderCondition.value[index].condition.forEach((item) => {
        item.isSelected = false;
        item.items.forEach((it) => {
          it.isSelected = false;
          it.isActive = false;
        });
      });
    } else {
      // 点击应用分类一级标签
      renderCondition.value[index].condition.forEach((item) => {
        item.isActive = false;
        item.isSelected = true;
      });
      renderCondition.value[index].condition[index2].isSelected = false;
      renderCondition.value[index].condition[index2].isActive = true;
      // 一级二级联动
      renderCondition.value[index].condition.forEach((item, i) => {
        if (index2 === i) {
          item.items.forEach((it) => {
            it.isSelected = false;
          });
        } else {
          item.items.forEach((child) => {
            child.isSelected = true;
            child.isActive = false;
          });
        }
      });
    }
  } else if (renderCondition.value[index].title.text === '协议') {
    renderCondition.value[index].condition[0].items.forEach((item) => {
      item.isSelected = true;
    });
    renderCondition.value[index].condition[0].items[index2].isSelected = false;

    if (
      renderCondition.value[index].condition[0].items[index2].isActive === true
    ) {
      renderCondition.value[index].condition[0].items[index2].isActive =
        !renderCondition.value[index].condition[0].items[index2].isActive;
      renderCondition.value[index].condition[0].items.forEach((item) => {
        item.isSelected = false;
      });
      renderCondition.value[index].haveActive = false;
    } else {
      renderCondition.value[index].condition[0].items.forEach((single) => {
        single.isActive = false;
        renderCondition.value[index].condition[0].items[index2].isActive = true;
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
// 清除各个一级标签的所有标签
function clearItem(index) {
  renderCondition.value[index].haveActive = false;
  if (renderCondition.value[index].title.text === '应用分类') {
    renderCondition.value[index].condition.forEach((item) => {
      item.isActive = false;
      item.isSelected = false;
    });
    // handleTagSearch(renderCondition.value[index].condition);
  } else {
    renderCondition.value[index].condition[0].items.forEach((item) => {
      item.isActive = false;
      item.isSelected = false;
    });
    // queryData.tags = null;
  }
  goSearch(renderCondition.value);
}

// 查看全部标签
let radioItem = ref({});
function checkAllClick(item, index) {
  if (item.title.text === '应用分类') {
    showDetail.value = true;
    radioList.value = renderCondition.value[index];
  } else {
    showTags.value = true;
    radioList2.value = renderCondition.value[index].condition[0];
  }
  showCondition.value = false;
  radioItem.value = renderCondition.value[index];
  modalName.value = renderCondition.value[index].title.text;
}

function radioClick(detail, list) {
  if (list.title.text === '协议') {
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

// 分类二级标签
function sortTagClick(index, index2) {
  renderCondition.value[0].condition.forEach((item) => {
    item.items.forEach((it) => {
      it.isSelected = true;
    });
  });
  renderCondition.value[0].condition[index].items[index2].isSelected = false;
  if (
    renderCondition.value[0].condition[index].items[index2].isActive === true
  ) {
    renderCondition.value[0].condition[index].items[index2].isActive = false;
    renderCondition.value[0].condition.forEach((item) => {
      item.isActive = false;
      item.isSelected = false;
      item.items.forEach((it) => {
        it.isSelected = false;
      });
    });
  } else {
    renderCondition.value[0].haveActive = true;
    renderCondition.value[0].condition.forEach((item) => {
      item.items.forEach((it) => {
        it.isActive = false;
        it.isSelected = true;
      });
    });
    renderCondition.value[0].condition[index].items[index2].isActive = true;
    renderCondition.value[0].condition[index].items[index2].isSelected = false;
    renderCondition.value[0].condition.forEach((data) => {
      data.isActive = false;
      data.isSelected = true;
    });
    renderCondition.value[0].condition[index].isActive = true;
    renderCondition.value[0].condition[index].isSelected = false;
  }
  handleTagSearch(renderCondition.value[0].condition);
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
    item.items.forEach((it) => {
      if (it.isActive === true) {
        taskId.push(it.name);
      }
    });
  });
  if (taskId.length > 0) {
    queryData.tags = taskId.join(',');
  } else {
    queryData.tags = null;
  }
}

//查询
function goSearch(render) {
  let time1 = 0;
  let time2 = 0;
  queryData.page_num = 1;
  let tagList = []; //标签
  let tag_kinds = []; //标签类型
  render.forEach((item) => {
    time1 = 0;
    time2 = 0;
    // 应用分类
    if (item.title.text === '应用分类') {
      item.condition.forEach((value) => {
        if (value.isActive) {
          tag_kinds.push(value.kind);
          if (tag_kinds.length < 6) {
            queryData.tag_kinds = tag_kinds.join(',');
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
        // queryData[item.title.key] = null; // 所有都未选不传
        item.haveActive = false;
        if (item.title.key === 0) {
          queryData.tag_kinds = null;
        }
      }
      // 协议(单选)
    } else {
      item.condition.forEach((value) => {
        value.items.forEach((val) => {
          if (val.isActive) {
            tagList.push(val.name);
            if (tagList.length < 6) {
              queryData.tags = tagList.join(',');
            } else {
              ElMessage({
                message: '最多支持刷选5个标签 !',
                type: 'warning',
              });
              return;
            }
          } else {
            time2 += 1;
          }
        });
      });
      if (time2 === item.condition[0].items.length) {
        // queryData[item.title.key] = null; // 所有都未选不传
        item.haveActive = false;
        if (item.title.key === 1) {
          queryData.tags = null;
        }
      }
    }
  });
}

const sortValue = ref('');
// 排序
function getSortData(item) {
  sortValue.value = item.text;
  if (item.value === 'download') {
    queryData.sort_by = 'download_count';
  } else if (item.value === 'name') {
    queryData.sort_by = 'first_letter';
  } else if (item.value === '-update_time') {
    queryData.sort_by = 'update_time';
  }
}

function getModel() {
  getModelData(queryData).then((res) => {
    modelCount.value = res.data.total;
    if (modelCount.value / queryData.count_per_page < 8) {
      layout.value = 'total, sizes, prev, pager, next';
    } else {
      layout.value = 'total, sizes, prev, pager, next, jumper';
    }
    modelData.value = res.data;
  });
}

async function getModelTag() {
  await getTags('global_model').then((res) => {
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
        // if (item.title.text === '应用分类') {
        it.isActive = false;
        it.isSelected = false;
        it.items = it.items.map((child) => {
          return {
            name: child,
            isSelected: false,
            isActive: false,
          };
        });
        item.condition.push(it);
      });
    });
    renderCondition.value = i18n.screenCondition;
    renderCondition.value.forEach((item, index) => {
      item.showTagsAll = false;
      item.condition.forEach((it) => {
        it.isSelected = false;
      });
      item.num = index;
    });
  });
}

const layout = ref('total, sizes, prev, pager, next, jumper');

function handleSizeChange(val) {
  if (modelCount.value / val < 8) {
    layout.value = 'total, sizes, prev, pager, next';
  } else {
    layout.value = 'total, sizes, prev, pager, next, jumper';
  }

  queryData.count_per_page = val;
}

function handleCurrentChange(val) {
  queryData.page_num = val;
  document.documentElement.scrollTop = 0;
}
function goDetail(user, name) {
  console.log('user, name: ', user, name);
  // 点击在新页签打开
  let routerData = router.resolve({
    path: `/models/${user}/${name}`,
  });
  window.open(routerData.href, '_blank');
}
function goNewModel() {
  if (userInfoStore.id) {
    router.push('/new/models');
  } else {
    goAuthorize();
  }
}
function getKeyWord() {
  queryData.page_num = 1;
  queryData.name = keyWord.value;
}

// 二次点击模型，跳转刷新模型页面数据
watch(
  () => route.query.search,
  () => {
    queryData.name = route.query.search;
    keyWord.value = queryData.name;
    debounceSearch();
  },
  {
    immediate: true,
  }
);
watch(
  queryData,
  () => {
    debounceSearch();
  },
  {
    immediate: true,
  }
);
watch(
  () => route.params.modelType,
  () => {
    getModelTag().then(() => {
      if (route.params.modelType === '1') {
        conditionClick(0, 0, renderCondition.value[0].condition[0]);
      } else if (route.params.modelType === '2') {
        conditionClick(0, 0, renderCondition.value[0].condition[0]);
      } else if (route.params.modelType === '3') {
        conditionClick(0, 1, renderCondition.value[0].condition[1]);
      } else if (route.params.modelType === '4') {
        conditionClick(0, 3, renderCondition.value[0].condition[3]);
      }
    });
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
              href="https://xihe-docs.mindspore.cn/zh/basics/model_ui/"
              target="_blank"
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
    <AppContent :pc-top="40">
      <div class="model-body">
        <!-- 应用分类查看全部-->
        <div v-show="showDetail" class="condition">
          <p class="getback" @click="backCondition">
            <o-icon><icon-back></icon-back></o-icon>{{ i18n.back }}
          </p>
          <p class="sort-title">{{ i18n.taskSort }}</p>
          <div
            v-for="(item, index) in radioList.condition"
            :key="item.id"
            class="condition-item"
          >
            <div v-if="radioList.title.text === '应用分类'">
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
              <!-- 应用分类二级标签 -->
              <div class="condition-box-all">
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
        </div>
        <!-- 处理器-文件格式...二级标签 -->
        <div v-show="showTags" class="condition">
          <p class="getback" @click="backCondition">
            <o-icon><icon-back></icon-back></o-icon>{{ i18n.back }}
          </p>
          <p class="sort-title">{{ modalName }}</p>
          <div class="condition-radio">
            <div
              v-for="detail in radioList2.items"
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
        <!-- 一级标签 -->
        <div v-show="showCondition" class="condition">
          <div
            v-for="(item, index) in renderCondition"
            :key="item"
            class="condition-item"
          >
            <div class="condition-title">
              <span>{{ item.title.text }}</span>
              <div
                v-if="item.haveActive"
                class="clear"
                @click="clearItem(index)"
              >
                <o-icon class="icon-x"><icon-clear></icon-clear></o-icon>
                <span>{{ i18n.clear }}</span>
              </div>
            </div>
            <!-- 应用分类一级标签 -->
            <div v-if="item.title.text === '应用分类'" class="condition-box">
              <div
                v-for="(detail, index2) in item.condition"
                :key="detail"
                class="condition-detail"
                :class="{
                  'condition-active1': detail.isActive === true,
                  'condition-active': detail.isSelected === true,
                }"
                @click="conditionClick(index, index2, detail)"
              >
                {{ detail.kind }}
                <o-icon class="icon-x">
                  <icon-x></icon-x>
                </o-icon>
              </div>
            </div>
            <!-- 其他标签、协议一级标签 -->
            <div v-else class="condition-box">
              <div
                v-for="(detail, index2) in item.condition[0].items"
                :key="detail"
                class="condition-detail"
                :class="{
                  'condition-active1': detail.isActive === true,
                  'condition-active': detail.isSelected === true,
                }"
                @click="conditionClick(index, index2, detail)"
              >
                {{ detail.name }}
                <o-icon class="icon-x">
                  <icon-x></icon-x>
                </o-icon>
              </div>
            </div>
            <div
              v-if="renderCondition[index].condition[0].items.length >= 5"
              class="radio-all"
            >
              <div class="check-all-modal"></div>
              <span @click="checkAllClick(item, index)">查看全部</span>
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
                  placeholder="请输入模型名称"
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
                @click="goDetail(item.owner, item.name)"
              ></app-card>
              <div v-if="modelCount > 10" class="pagination">
                <el-pagination
                  :page-sizes="[10, 20, 50]"
                  :current-page="queryData.page_num"
                  :page-size="queryData.count_per_page"
                  :total="modelCount"
                  :layout="layout"
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                ></el-pagination>
              </div>
            </div>
            <o-empty v-else :img="emptyImg" describe="无匹配模型"></o-empty>
          </div>
        </div>
      </div>
    </AppContent>
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
    background-image: url('@/assets/imgs/banner-model.png');
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
        padding-right: 24px;
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
    padding-bottom: 72px;
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
      &-box {
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 24px;
        max-height: 130px;
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
          position: absolute;
          bottom: -72px;
          left: 50%;
          transform: translateX(-50%);
        }
      }
    }
  }
}
</style>
