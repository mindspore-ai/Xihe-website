<script setup>
import { ref, reactive, watch, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import OIcon from '@/components/OIcon.vue';
import OButton from '@/components/OButton.vue';
import OEmpty from '@/components/OEmpty.vue';

import IconMenu from '~icons/app/menu';
import IconX from '~icons/app/x';
import IconClear from '~icons/app/clear';
import IconBack from '~icons/app/back';
import emptyImg from '@/assets/imgs/model-empty.png';

import { Search } from '@element-plus/icons-vue';
import { useUserInfoStore } from '@/stores';
import { goAuthorize } from '@/shared/login';
import { debounce } from 'lodash/function';

import { getModelData, getTags } from '@/api/api-model';

const userInfoStore = useUserInfoStore();

const router = useRouter();
const route = useRoute();
let i18n = {
  head: {
    title: '模型',
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
const radioList = ref({});
const modalName = ref('');
const keyWord = ref('');

let queryData = reactive({
  search: null,
  page: 1,
  size: 10,
  task: null,
  task_cate: null,
  libraries: null,
  licenses: null,
  model_format: null,
  device_target: null,
  relate_datasets: null,
  order: null,
});

// queryData.search = route.query.search;
// keyWord.value = queryData.search;

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
    if (detail.isActive === true) {
      detail.isActive = !detail.isActive;
      console.log(renderCondition.value[index].condition);
      renderCondition.value[index].condition.forEach((item) => {
        item.isSelected = false;
        item.items.forEach((it) => {
          it.isSelected = false;
          it.isActive = false;
        });
      });
    } else {
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
  } else if (renderCondition.value[index].title.key === 'licenses') {
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
  renderCondition.value[index].condition.forEach((item) => {
    item.isActive = false;
    item.isSelected = false;
    if (renderCondition.value[index].title.key === 'task') {
      item.task_list.forEach((item) => {
        item.isActive = false;
        item.isSelected = false;
      });
      handleTagSearch(renderCondition.value[index].condition);
    }
  });
  goSearch(renderCondition.value);
}

// 查看全部标签
function checkAllClick(item, index) {
  if (item.title.text === '应用分类') {
    showDetail.value = true;
  } else {
    showTags.value = true;
  }
  showCondition.value = false;
  radioList.value = renderCondition.value[index];
  modalName.value = renderCondition.value[index].title.text;
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
  let taskCate = [];
  queryData.page = 1;
  render.forEach((item) => {
    time = 0;
    item.condition.forEach((value) => {
      if (value.isActive) {
        if (item.title.key === 'task') {
          queryData.task_cate = value.id;
        } else if (item.title.key === 'licenses') {
          queryData[item.title.key] = value.id;
        } else {
          taskCate.push(value.id);
          queryData[item.title.key] = taskCate.join(',');
        }
      } else {
        time += 1;
      }
    });
    if (time === item.condition.length) {
      queryData[item.title.key] = null; // 所有都未选不传
      item.haveActive = false;
      if (item.title.key === 'task') {
        queryData['task_cate'] = null;
      }
    }
  });
}

function dropdownClick(item) {
  queryData.order = item.value;
}
function getModel() {
  getModelData(queryData).then((res) => {
    modelCount.value = res.count;
    if (modelCount.value / queryData.size < 8) {
      layout.value = layout.value.split(',').splice(0, 4).join(',');
    }
    modelData.value = res.results.data;
  });
}

function getModelTag() {
  // i18n.screenCondition.forEach((item) => {
  //   filterData[item.title.key].forEach((it) => {
  //     if (item.title.key === 'task') {
  //       it.isActive = false;
  //       it.isSelected = false;
  //       it.task_list.forEach((child) => {
  //         child.isSelected = false;
  //         child.isActive = false;
  //       });
  //     } else {
  //       it.isActive = false;
  //       it.isSelected = false;
  //     }
  //     item.condition.push(it);
  //   });
  // });
  // renderCondition.value = i18n.screenCondition;
  // renderCondition.value.forEach((item, index) => {
  //   item.showTagsAll = false;
  //   item.condition.forEach((it) => {
  //     it.isSelected = false;
  //   });
  //   item.num = index;
  // });
  getTags().then((res) => {
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
          // child.isSelected = false;
          // child.isActive = false;
          return {
            name: child,
            isSelected: false,
            isActive: false,
          };
        });
        // } else {
        //   it.isActive = false;
        //   it.isSelected = false;
        // }
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
getModelTag();

const layout = ref('sizes, prev, pager, next, jumper');
function handleSizeChange(val) {
  if (modelCount.value / val < 8) {
    layout.value = layout.value.split(',').splice(0, 4).join(',');
  }
  queryData.size = val;
}

function handleCurrentChange(val) {
  queryData.page = val;
  document.documentElement.scrollTop = 0;
}
function goDetail(user, name) {
  // router.push({
  //   path: `/models/${user}/${name}`,
  // });
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
  queryData.page = 1;
  queryData.search = keyWord.value;
}

// watch(
//   useFilterData(),
//   (val) => {
//     if (val.filterData) {
//       getModelTag(val.filterData);
//     }
//   }
// );

// 二次点击模型，跳转刷新模型页面数据
watch(
  () => route.query.search,
  () => {
    queryData.search = route.query.search;
    keyWord.value = queryData.search;
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
    <div class="model-body wrap">
      <!-- 应用分类查看全部-->
      <div v-show="showDetail" class="condition">
        <p class="getback" @click="backCondition">
          <o-icon><icon-back></icon-back></o-icon>{{ i18n.back }}
        </p>
        <p class="sort-title">{{ i18n.taskSort }}</p>
        <!-- <el-input
          v-model="queryData.search"
          :prefix-icon="Search"
          placeholder="请输入tag名称"
        /> -->

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
      <!-- 处理器-文件格式...显示全部 -->
      <div v-show="showTags" class="condition">
        <p class="getback" @click="backCondition">
          <o-icon><icon-back></icon-back></o-icon>{{ i18n.back }}
        </p>
        <p class="sort-title">{{ modalName }}</p>
        <!-- <el-input
          v-model="queryData.search"
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
      <!-- 一级标签 -->
      <div v-show="showCondition" class="condition">
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
          <!-- 其他标签 -->
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
            v-if="renderCondition[index].condition.length >= 5"
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
              {{ i18n.head.count }} {{ modelCount }}
            </div>
            <div class="moderl-head-right">
              <el-input
                v-model="keyWord"
                :prefix-icon="Search"
                class="w-50 m-2"
                placeholder="请输入模型名称"
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

          <div v-if="modelData.length" class="card-list">
            <o-card
              v-for="item in modelData"
              :key="item.id"
              :card-data="item"
              @click="goDetail(item.owner_name.name, item.name)"
            ></o-card>
            <div v-if="modelCount > 10" class="pagination">
              <el-pagination
                :page-sizes="[10, 20, 50]"
                :current-page="queryData.page"
                :page-size="queryData.size"
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
        padding-right: 24px;
        font-size: 18px;
        .reference {
          color: #4dcdff;
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
          position: absolute;
          bottom: -76px;
          left: 50%;
          transform: translateX(-50%);
        }
      }
    }
  }
}
</style>
