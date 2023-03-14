<script setup>
import { ref, onUnmounted, reactive, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';

import { Search } from '@element-plus/icons-vue';
import IconMenu from '~icons/app/menu';
import IconX from '~icons/app/x';
import IconTime from '~icons/app/time';
import IconHeart from '~icons/app/heart';
import IconClear from '~icons/app/clear';
import IconBack from '~icons/app/back';
import OEmpty from '@/components/OEmpty.vue';
import emptyImg from '@/assets/imgs/model-empty.png';

import OIcon from '@/components/OIcon.vue';
import OButton from '@/components/OButton.vue';

import { debounce } from 'lodash/function';

import { goAuthorize } from '@/shared/login';

import { getProjectData, getTags } from '@/api/api-project';

import { useLoginStore } from '@/stores';
import { ElMessage } from 'element-plus';

const loginStore = useLoginStore();

const route = useRoute();
const router = useRouter();

let i18n = {
  head: {
    title: '项目',
    introduce:
      '覆盖多领域任务，体验全流程开发，支持用户在线训练和推理可视化，可创建自己的项目空间，详情请点击',
    reference: '参考文档',
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

const projectType = reactive([
  { type: '精选', isActive: false, num: 3 },
  { type: '官方', isActive: false, num: 2 },
]);

const projectCount = ref(0);
const projectData = ref([]);
const renderCondition = ref([]);
const renderSorts = ref([]); //应用分类标签
const otherCondition = ref([]); //训练平台、协议、项目类型标签
const showDetail = ref(false);
const moreSortTags = ref([]);
const showCondition = ref(true);
const showTags = ref(false);
const radioList = ref({});
const keyWord = ref('');

const queryData = reactive({
  name: null, //项目名
  tags: null, //标签
  tag_kinds: null, //标签类型(应用分类)
  level: null,
  count_per_page: 12, //每页数量
  page_num: 1, //分页
  sort_by: null, //排序规则
});

const debounceSearch = debounce(getProject, 500, {
  trailing: true,
});

function projectTypeClick(val) {
  if (val.isActive) {
    val.isActive = !val.isActive;
    delete queryData['level'];
  } else {
    projectType.forEach((item) => {
      item.isActive = false;
    });
    val.isActive = true;
    if (val.type === '官方') {
      queryData.level = 'official';
    } else {
      queryData.level = 'good';
    }
  }
}

// 应用分类查看全部
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
//清除应用分类所有的标签
function clearItem1(index) {
  renderSorts.value[index].haveActive = false;
  renderSorts.value[index].condition.forEach((item) => {
    item.isActive = false;
  });
  queryData.tag_kinds = null;
}

// 单选(sdk,状态，协议)
function conditionClick(index, index2) {
  renderCondition.value[index].haveActive = true;
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
  } else {
    renderCondition.value[index].condition[0].items.forEach((single) => {
      single.isActive = false;
      renderCondition.value[index].condition[0].items[index2].isActive = true;
    });
  }
  goSearch(renderCondition.value);
}
function clearItem(index) {
  renderCondition.value[index].haveActive = false;
  renderCondition.value[index].condition[0].items.forEach((item) => {
    item.isActive = false;
    item.isSelected = false;
  });
  goSearch(renderCondition.value);
}

// 查看全部标签(sdk,状态，协议)
let radioItem = ref({});
function checkAllClick(item, index) {
  showCondition.value = false;
  item.showTagsAll = true;
  showTags.value = true;
  radioList.value = renderCondition.value[index].condition[0].items;
  radioItem.value = renderCondition.value[index];
}

function radioClick(detail, list) {
  list.condition[0].items.forEach((item) => {
    item.isSelected = true;
  });
  detail.isSelected = false;

  if (detail.isActive === true) {
    detail.isActive = !detail.isActive;
    renderCondition.value[list.title.key].haveActive = false;

    queryData[list.title.key] = null;
    list.condition[0].items.forEach((item) => {
      item.isSelected = false;
    });
  } else {
    list.condition[0].items.forEach((item) => {
      item.isActive = false;
    });
    detail.isActive = !detail.isActive;
    renderCondition.value[list.title.key].haveActive = true;
  }
  goSearch(renderCondition.value);
}

// 分类二级标签
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
  searchTags(moreSortTags.value);
}
// 二级目录的清除
function clearSortItem(index) {
  moreSortTags.value[index].haveActive = false;
  moreSortTags.value[index].items.forEach((item) => {
    item.isActive = false;
    item.isSelected = false;
  });
  searchTags(moreSortTags.value);
}
// 二级标签查询
function searchTags(date) {
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
      queryData.tags = tagList.join(',');
    } else {
      ElMessage({
        message: '最多支持刷选5个标签 !',
        type: 'warning',
      });
      return;
    }
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

function dropdownClick(item) {
  if (item.value === 'download') {
    queryData.sort_by = 'download_count';
  } else if (item.value === 'name') {
    queryData.sort_by = 'first_letter';
  } else if (item.value === '-update_time') {
    queryData.sort_by = 'update_time';
  }
}

function getProject() {
  getProjectData(queryData).then((res) => {
    if (res.status === 200) {
      projectCount.value = res.data.data.total;
      if (projectCount.value / 10 < 8) {
        layout.value = layout.value.split(',').splice(0, 4).join(',');
      }
      projectData.value = res.data.data;
    }
  });
}

function getModelTag() {
  getTags('global_project').then((res) => {
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
        item.condition.push(it);
      });
    });
    renderCondition.value = i18n.screenCondition.splice(1, 3); //训练平台、协议、项目类型的一级标签
    let ind;
    res.data.forEach((item, index) => {
      if (item.domain === '应用分类') ind = index;
    });
    renderSorts.value = i18n.screenCondition.splice(ind, 1); //应用分类的一级标签
    otherCondition.value = i18n.screenCondition;
    moreSortTags.value = renderSorts.value[0].condition; //应用分类的二级标签
    otherCondition.value.forEach((item, index) => {
      item.showTagsAll = false;
      item.condition[0].items = item.condition[0].items.map((it) => {
        return {
          name: it,
          isSelected: false,
        };
      });
      item.num = index;
    });
  });
}
getModelTag();

function goDetail(user, name) {
  // 点击在新页签打开
  let routerData = router.resolve({
    path: `/projects/${user}/${name}`,
  });
  window.open(routerData.href, '_blank');
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
  queryData.count_per_page = val;
}

function handleCurrentChange(val) {
  queryData.page_num = val;
  toTop();
}

function toTop() {
  document.documentElement.scrollTop = 0;
}
function getKeyWord() {
  queryData.page_num = 1;
  queryData.name = keyWord.value;
}
//打开jupyter useLoginStore
function openJupyter() {
  if (loginStore.isLogined) {
    router.push('/settings/clouddev', '_blank');
  } else {
    goAuthorize();
  }
}

// 二次点击数据集，跳转刷新数据集页面数据
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
              href="https://xihe-docs.mindspore.cn/zh/basics/project_ui/"
              target="_blank"
              >{{ i18n.head.reference }}</a
            >
          </div>
        </div>
        <div class="banner-right">
          <o-button
            type="primary"
            style="margin-right: 16px"
            @click="openJupyter"
            >打开jupyter</o-button
          >

          <o-button type="primary" @click="goSetNew">{{
            i18n.head.btn
          }}</o-button>
        </div>
      </div>
    </div>
    <div class="model-body wrap">
      <div></div>
      <!-- 二级标签页面(全部) -->
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
            <!-- 二级标签的清除 -->
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
      <!-- 单选的显示全部-二级标签 -->
      <div v-show="showTags" class="condition">
        <p class="getback" @click="backCondition">
          <o-icon><icon-back></icon-back></o-icon>{{ i18n.back }}
        </p>
        <p class="sort-title">协议</p>
        <div class="condition-radio">
          <div
            v-for="detail in radioList"
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
        <div class="condition-item">
          <p class="condition-title">项目类型</p>
          <div class="condition-box">
            <div
              v-for="item in projectType"
              :key="item.num"
              class="condition-detail"
              :class="[{ 'condition-active1': item.isActive }]"
              @click="projectTypeClick(item)"
            >
              {{ item.type }}
              <o-icon class="icon-x">
                <icon-x></icon-x>
              </o-icon>
            </div>
          </div>
        </div>
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
              <!-- 清除应用分类所有的标签 -->
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
          </div>
          <div class="check-all">
            <div class="check-all-modal"></div>
            <span @click="moreClick">查看全部</span>
          </div>
        </div>
        <!-- sdk status 训练平台、协议、项目类型 -->
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
            v-if="renderCondition[index].condition[0].items.length > 7"
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

          <div v-if="projectData.projects" class="card-list">
            <div
              v-for="item in projectData.projects"
              :key="item.id"
              class="pro-card"
              @click="goDetail(item.owner, item.name)"
            >
              <div class="card-top">
                <div
                  v-if="item.level === 'official' || item.level === 'good'"
                  :class="item.level === 'good' ? 'mark-tag' : 'mark-tag1'"
                >
                  {{ item.level === 'official' ? '官方' : '精选' }}
                </div>

                <div class="description">
                  <p>{{ item.desc }}</p>
                </div>

                <img
                  :src="`https://obs-xihe-beijing4.obs.cn-north-4.myhuaweicloud.com/xihe-img/project-img/proimg${item.cover_id}.png`"
                  alt=""
                />
                <p class="title">{{ item.name }}</p>
                <div class="dig">
                  <o-icon> <icon-heart></icon-heart> </o-icon
                  >{{ item.like_count }}
                </div>
                <div class="card-modal"></div>
              </div>

              <div class="card-bottom">
                <div class="info">
                  <div class="info-avata">
                    <img :src="item.avatar_id" alt="" />
                  </div>
                  <div class="info-name">
                    {{ item.owner }}
                  </div>
                </div>
                <div class="time">
                  <o-icon>
                    <icon-time></icon-time>
                  </o-icon>
                  {{ item.updated_at }}
                </div>
              </div>
            </div>

            <!-- 分页 -->
            <div v-if="projectCount > 10" class="pagination">
              <el-pagination
                :page-sizes="[12, 24, 60]"
                :current-page="queryData.page_num"
                :page-size="queryData.count_per_page"
                :total="projectCount"
                :layout="layout"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              ></el-pagination>
            </div>
          </div>
          <!-- 无项目显示 -->
          <o-empty
            v-if="projectCount === 0"
            :img="emptyImg"
            describe="无匹配项目"
            class="empty-status"
          ></o-empty>
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
        padding: 110px 0 150px 0;
      }
      .card-list {
        display: grid;
        grid-template-columns: repeat(3, minmax(200px, 1fr));
        column-gap: 24px;
        row-gap: 24px;
        margin-top: 40px;
        position: relative;
        .pro-card {
          position: relative;
          .mark-tag {
            position: absolute;
            top: 0;
            left: 16px;
            padding: 3px 8px;
            background: linear-gradient(326deg, #fba727 0%, #ffe1b3 100%);
            z-index: 10;
            font-size: 12px;
            color: #ffffff;
          }
          .mark-tag1 {
            position: absolute;
            top: 0;
            left: 16px;
            padding: 3px 8px;
            background: linear-gradient(326deg, #0d8dff 0%, #a5d4ff 100%);
            z-index: 10;
            font-size: 12px;
            color: #ffffff;
          }
        }
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
            &:hover {
              .description {
                display: block;
              }
            }
            img {
              width: 100%;
              height: 100%;
            }
            .description {
              display: none;
              position: absolute;
              left: 50%;
              bottom: 0;
              transform: translateX(-50%);
              width: 100%;
              padding: 0 16px;
              z-index: 1;
              font-size: 12px;
              color: #ffffff;
              background: linear-gradient(
                180deg,
                rgba(0, 0, 0, 0) 0%,
                #000000 100%
              );

              p {
                line-height: 17px;
                display: -webkit-box;
                overflow: hidden;
                text-overflow: ellipsis;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                margin-bottom: 16px;
              }
            }
            .title {
              display: flex;
              align-items: center;
              justify-content: center;
              width: 84%;
              // margin: 0 auto;
              font-size: 18px;
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              z-index: 1;
              span {
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
              }
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
                color: #000;
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
