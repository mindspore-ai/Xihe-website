<script setup>
import { ref, onUnmounted, reactive, watch, markRaw } from 'vue';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';

import { Search, ArrowDown } from '@element-plus/icons-vue';
import IconX from '~icons/app/x';
import IconTime from '~icons/app/time';
import IconHeart from '~icons/app/heart';
import IconClear from '~icons/app/clear2';
import IconDownload from '~icons/app/download';
import IconFork from '~icons/app/fork-gray';

import IconVoice from '~icons/app/voice';
import IconVision from '~icons/app/vision';
import IconCV from '~icons/app/project-cv';
import IconNLP from '~icons/app/project-nlp';
import recommendation from '~icons/app/recommendation';

import OEmpty from '@/components/OEmpty.vue';
import emptyImg from '@/assets/imgs/model-empty.png';
import OIcon from '@/components/OIcon.vue';
import OButton from '@/components/OButton.vue';

import { debounce } from 'lodash/function';
import { goAuthorize } from '@/shared/login';
import { ElMessage } from 'element-plus';

import { getProjectData, getTags } from '@/api/api-project';
import { useLoginStore } from '@/stores';
import { WEBSITE_DOCS_URL, OBS_NORTH4_URL } from '@/shared/config/website-url';

const loginStore = useLoginStore();

const route = useRoute();
const router = useRouter();

let i18n = {
  head: {
    title: 'AI实验室',
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
    { text: '最多下载', value: 'download' },
    { text: '最新更新', value: 'update_time' },
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
    {
      title: {
        text: '产业类型',
        key: 'industry',
      },
      haveActive: false,
      condition: [],
    },
  ],
};

const projectCount = ref(0);
const projectData = ref([]);
const renderCondition = ref([]);
const renderSorts = ref([]); // 应用分类标签
const otherCondition = ref([]); // 训练平台、协议、项目类型标签
const moreSortTags = ref([]);
const keyWord = ref('');
const activeNavItem = ref('all');
const selectValue = ref('最多下载');
const renderList = ref([]); // 含渲染的一级标签
const menuList = ref([]); // 左侧标签
const headTags = ref([]); // 标签弹窗头部标签
const outerTags = ref([]); // 外层的已选标签

const queryData = reactive({
  name: null, // 项目名
  tags: null, // 标签
  tag_kinds: null, // 标签类型(应用分类)
  level: null,
  count_per_page: 12, // 每页数量
  page_num: 1, // 分页
  sort_by: 'download_count', // 排序规则
});

// 头部tabs
const navItems = [
  {
    id: 'all',
    label: '全部项目',
  },
  {
    id: 'official',
    label: '官方项目',
  },
  {
    id: 'good',
    label: '精选项目',
  },
  {
    id: 'electricity',
    label: '电力专区',
  },
];

// 热门标签列表
const hotTagsList = ref([
  {
    id: 1,
    name: '计算机视觉',
    value: 'CV',
    active: false,
    icon: markRaw(IconCV),
  },
  {
    id: 2,
    name: '自然语言处理',
    value: 'NLP',
    active: false,
    icon: markRaw(IconNLP),
  },
  {
    id: 3,
    name: '语音',
    value: 'Audio',
    active: false,
    icon: markRaw(IconVoice),
  },
  {
    id: 4,
    name: '推荐',
    value: 'Recommendation',
    active: false,
    icon: markRaw(recommendation),
  },
  {
    id: 5,
    name: '图神经网络',
    value: 'GNN',
    active: false,
    icon: markRaw(IconVision),
  },
]);
// 标签文字
let dialogList = {
  head: {
    title: '已选标签',
    delete: '清除全部',
  },
  tags: [],
};
const layout = ref('sizes, prev, pager, next, jumper');

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

const debounceSearch = debounce(getProject, 500, {
  trailing: true,
});

// 点击导航
function handleNavClick(item) {
  headTags.value = [];
  renderList.value.forEach((val) => {
    val.items.forEach((item) => {
      item.items.forEach((a) => {
        a.isActive = false;
        a.isSelected = false;
      });
    });
  });
  const levelMap = {
    all: { level: null, tags: null },
    official: { level: 'official', tags: null },
    good: { level: 'good', tags: null },
    electricity: { level: null, tags: 'electricity' },
  };
  if (item.id in levelMap) {
    queryData.level = levelMap[item.id].level;
    queryData.tags = levelMap[item.id].tags;
  }
  if (/^all|official|good|electricity/g.test(item.id)) {
    activeNavItem.value = item.id;
  } else {
    activeNavItem.value = '';
  }
}

// 点击高亮热门标签
function highlightTag(tag) {
  if (tag.active) {
    tag.active = false;
    queryData.tag_kinds = null;
  } else {
    hotTagsList.value.forEach((item) => {
      item.active = false;
    });
    tag.active = true;
    queryData.tag_kinds = tag.value;
  }
}

function getModelTag() {
  getTags('global_project').then((res) => {
    renderList.value = res.data;
    menuList.value = res.data.map((item, index) => {
      return { tab: item.domain, key: index };
    });
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
          return {
            name: child,
            isSelected: false,
            isActive: false,
          };
        });
        item.condition.push(it);
      });
    });

    renderCondition.value = i18n.screenCondition.splice(1, 4); // 训练平台、协议、项目类型的一级标签
    let ind;
    res.data.forEach((item, index) => {
      if (item.domain === '应用分类') ind = index;
    });
    renderSorts.value = i18n.screenCondition.splice(ind, 1); // 应用分类的一级标签
    otherCondition.value = i18n.screenCondition;
    moreSortTags.value = renderSorts.value[0].condition; // 应用分类的二级标签
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

function handleSizeChange(val) {
  if (projectCount.value / val < 8) {
    layout.value = layout.value.split(',').splice(0, 4).join(',');
  }
  queryData.count_per_page = val;
}

function toTop() {
  document.documentElement.scrollTop = 0;
}

function handleCurrentChange(val) {
  queryData.page_num = val;
  toTop();
}
function getKeyWord() {
  queryData.page_num = 1;
  queryData.name = keyWord.value;
}
// 打开jupyter useLoginStore
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

// 电力跳转过来筛选标签
watch(
  () => window.history.state.tags,
  () => {
    queryData.tag_kinds = window.history.state.tag_kinds;
    queryData.tags = window.history.state.tags;
  },
  {
    immediate: true,
  }
);

onUnmounted(() => {
  debounceSearch.cancel();
});
// 点击标签
function tagClick(it, key, index) {
  if (headTags.value.length < 5) {
    if (key === '应用分类' || key === '协议') {
      renderList.value.forEach((a) => {
        if (a.domain === key) {
          if (it.isActive) {
            it.isActive = false;
            a.items[index].items.forEach((item) => {
              item.isSelected = false;
            });
            headTags.value.forEach((item, index) => {
              if (item.name === it.name) {
                headTags.value.splice(index, 1);
              }
            });
          } else {
            a.items[index].items.forEach((item) => {
              if (item.isActive) {
                headTags.value.forEach((tag, index) => {
                  if (item.name === tag.name) {
                    headTags.value.splice(index, 1);
                  }
                });
                item.isActive = false;
              }
              item.isSelected = true;
            });
            it.isActive = true;
            it.isSelected = false;
            headTags.value.push(it);
          }
        }
      });
    } else {
      it.isActive = !it.isActive;
      if (it.isActive) {
        if (!headTags.value[0]) headTags.value[0] = it;
        else headTags.value.push(it);
      } else {
        headTags.value.forEach((item, index) => {
          if (item.name === it.name) {
            headTags.value.splice(index, 1);
          }
        });
      }
    }
  } else {
    ElMessage({
      type: 'warning',
      message: '最多支持选择5个标签',
      offset: 64,
    });
  }
}
// 删除
function deleteClick(tag) {
  let i = headTags.value.indexOf(tag);
  headTags.value.splice(i, 1);

  let menu = menuList.value.map((item) => item.key);
  menu.forEach((key) => {
    renderList.value[key].items.forEach((item) => {
      item.items.forEach((it) => {
        if (it.name === tag.name) {
          it.isActive = false;
        }
      });
    });
  });
}
// 编辑标签头部标签删除全部已添加标签
function deleteModelTags() {
  headTags.value = [];
  let menu = menuList.value.map((item) => item.key);

  menu.forEach((menuitem) => {
    renderList.value[menuitem].items.forEach((it) => {
      it.items.forEach((item) => {
        item.isActive = false;
        item.isSelected = false;
      });
    });
  });
  hotTagsList.value.forEach((item) => {
    item.active = false;
  });
}

const dropdownRef = ref(null);
function confirmBtn() {
  outerTags.value = [...headTags.value];
  let tagsArray = headTags.value.map((item) => {
    return item.name;
  });
  if (tagsArray.length) {
    queryData.tags = tagsArray.join(',');
  } else {
    queryData.tags = null;
  }
  dropdownRef.value.handleClose();
}
function cancelBtn() {
  dropdownRef.value.handleClose();
}

const sortValue = ref('');
// 排序
function getSortData(item) {
  sortValue.value = item.text;
  if (item.value === 'download') {
    queryData.sort_by = 'download_count';
  } else if (item.value === 'name') {
    queryData.sort_by = 'first_letter';
  } else if (item.value === 'update_time') {
    queryData.sort_by = 'update_time';
  }
}

// 头部删除标签
async function deleteTag(tag) {
  try {
    deleteClick(tag);
    confirmBtn();
  } catch (error) {
    throw new Error(error);
  }
}
// 头部清除全部的标签
async function deleteAllTags() {
  try {
    deleteModelTags();
    confirmBtn();
  } catch (error) {
    throw new Error(error);
  }
}
</script>

<template>
  <div class="model-page">
    <div class="model-head">
      <div class="head-wrap">
        <div class="wrap-top">
          <div class="banner-left">
            <div class="title">
              {{ i18n.head.title }}
            </div>
            <div class="introduce">
              {{ i18n.head.introduce }}
              <a
                class="reference"
                :href="`${WEBSITE_DOCS_URL}/zh/basics/project_ui/`"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ i18n.head.reference }}
              </a>
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
        <div class="wrap-bottom">
          <o-nav
            :nav-items="navItems"
            :active-item="activeNavItem"
            @nav-click="handleNavClick"
          ></o-nav>
        </div>
      </div>
    </div>
    <div class="model-body wrap">
      <div class="card-box">
        <div class="card-box-top">
          <div class="card-head">
            <div class="head-option">
              <div class="project-tags">
                <el-dropdown
                  ref="dropdownRef"
                  trigger="click"
                  :hide-on-click="true"
                  placement="bottom-start"
                  popper-class="my-popper"
                  class="my-popper"
                >
                  <span class="link-text">
                    所有项目标签
                    <el-icon class="el-icon--right">
                      <arrow-down />
                    </el-icon>
                  </span>
                  <template #dropdown>
                    <div class="tags-wrap">
                      <!-- 头部 -->
                      <div class="dialog-head">
                        <div class="head-top">
                          <div class="head-title">
                            <span>
                              {{ dialogList.head.title }}
                            </span>
                            <span class="tags-limit">(最多可选择5个标签)</span>
                          </div>
                          <div class="head-delete" @click="deleteModelTags">
                            <o-icon><icon-clear></icon-clear></o-icon>
                            {{ dialogList.head.delete }}
                          </div>
                        </div>
                        <div class="head-tags">
                          <div
                            v-for="it in headTags"
                            :key="it"
                            class="condition-detail"
                          >
                            {{ it.name === 'electricity' ? '电力' : it.name }}
                            <o-icon class="icon-x" @click="deleteClick(it)"
                              ><icon-x></icon-x
                            ></o-icon>
                          </div>
                        </div>
                      </div>
                      <!-- 中部 -->
                      <div v-if="menuList" class="dialog-body">
                        <el-tabs tab-position="left" style="height: 100%">
                          <el-tab-pane
                            v-for="menu in menuList"
                            :key="menu.key"
                            :label="menu.tab"
                          >
                            <div class="body-right-container">
                              <div
                                v-if="renderList[menu.key]"
                                class="body-right"
                              >
                                <div
                                  v-for="(item, index) in renderList[menu.key]
                                    .items"
                                  :key="item"
                                  class="detail-box"
                                >
                                  <div>
                                    <p class="tan-title">
                                      {{ item.kind }}
                                    </p>
                                    <!-- 标签管理右侧标签 -->
                                    <div class="noTask-box">
                                      <div
                                        v-for="it in item.items"
                                        :key="it"
                                        class="condition-detail"
                                        :class="[
                                          { 'condition-active': it.isActive },
                                          {
                                            'condition-active1': it.isSelected,
                                          },
                                        ]"
                                        @click="tagClick(it, menu.tab, index)"
                                      >
                                        {{
                                          it.name === 'electricity'
                                            ? '电力'
                                            : it.name
                                        }}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </el-tab-pane>
                        </el-tabs>
                      </div>
                      <div class="btn-box">
                        <o-button style="margin-right: 16px" @click="cancelBtn"
                          >取消</o-button
                        >
                        <o-button type="primary" @click="confirmBtn"
                          >确定</o-button
                        >
                      </div>
                    </div>
                  </template>
                </el-dropdown>
                <div class="hot-tags">
                  <span
                    v-for="tag in hotTagsList"
                    :key="tag.id"
                    class="tag-item"
                    :class="{ 'tag-active': tag.active }"
                    @click="highlightTag(tag)"
                  >
                    <o-icon> <component :is="tag.icon"></component> </o-icon>
                    <span> {{ tag.name }} </span>
                  </span>
                </div>
              </div>
              <div class="project-search">
                <el-input
                  v-model="keyWord"
                  :prefix-icon="Search"
                  class="w-50 m-2"
                  placeholder="请输入项目名称"
                  @change="getKeyWord"
                />
                <div class="sort-select">
                  <el-select
                    v-model="selectValue"
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
            <el-divider v-if="outerTags.length" />
            <!-- 已选标签 -->
            <div v-if="outerTags.length" class="head-tags">
              <div class="head-title">
                <span class="title">
                  {{ dialogList.head.title }}
                </span>
                <div v-for="it in outerTags" :key="it" class="condition-detail">
                  {{ it.name === 'electricity' ? '电力' : it.name }}
                  <o-icon class="icon-x" @click="deleteTag(it)">
                    <icon-x></icon-x>
                  </o-icon>
                </div>
              </div>
              <div class="head-delete" @click="deleteAllTags">
                <o-icon><icon-clear></icon-clear></o-icon>
                {{ dialogList.head.delete }}
              </div>
            </div>
          </div>
          <div v-if="projectData.projects" class="card-list">
            <div
              v-for="item in projectData.projects"
              :key="item.id"
              class="pro-card"
              @click="goDetail(item.owner, item.name)"
            >
              <div>
                <div class="card-top">
                  <div class="img-wrap">
                    <div
                      v-if="item.level === 'official' || item.level === 'good'"
                      :class="item.level === 'good' ? 'mark-tag' : 'mark-tag1'"
                    >
                      {{ item.level === 'official' ? '官方' : '精选' }}
                    </div>
                    <img
                      class="cover"
                      :src="`${OBS_NORTH4_URL}/xihe-img/project-img/coverimg${item.cover_id}.png`"
                      alt=""
                    />
                  </div>
                </div>
                <div class="card-desc">
                  <p class="title">{{ item.title ? item.title : item.name }}</p>

                  <div class="description">
                    {{ item.desc }}
                  </div>
                  <div class="tag-list">
                    <span
                      v-for="(val, index) in item.tags"
                      :key="index"
                      :style="{ display: index < 4 ? 'inline-block' : 'none' }"
                      class="tag"
                    >
                      {{ val === 'electricity' ? '电力' : val }}
                    </span>
                  </div>
                </div>
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
                <div class="info-right">
                  <span class="time">
                    <o-icon>
                      <icon-time></icon-time>
                    </o-icon>
                    {{ item.updated_at }}
                  </span>
                  <span class="dig">
                    <o-icon> <icon-heart></icon-heart> </o-icon
                    >{{ item.like_count }}
                  </span>
                  <span class="download">
                    <o-icon><icon-download></icon-download></o-icon>
                    {{ item.download_count }}
                  </span>
                  <span class="fork">
                    <o-icon><icon-fork></icon-fork></o-icon>
                    {{ item.fork_count }}
                  </span>
                </div>
              </div>
            </div>

            <!-- 分页 -->
            <div v-if="projectCount > 10" class="pagination">
              <div class="total">
                <span> 共 </span>
                <span>{{ projectData.total }}</span>
                <span> 条数据 </span>
              </div>
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
.tags-wrap {
  width: 800px;
  padding: 40px;
  border-radius: 16px;
  .dialog-head {
    .head-top {
      display: flex;
      justify-content: space-between;
      .head-title {
        line-height: 24px;
        font-size: 18px;
        line-height: 24px;
        color: #000000;
        display: flex;
        align-items: center;
        .tags-limit {
          margin-left: 8px;
          font-size: 12px;
          color: #555;
        }
      }
      .head-delete {
        font-size: 12px;
        display: flex;
        align-items: center;
        cursor: pointer;
        .o-icon {
          margin-right: 6px;
          align-self: center;
          font-size: 16px;
        }
      }
    }
    .head-tags {
      flex: 1;
      display: flex;
      flex-wrap: wrap;
      padding: 4px 0 16px;
      .condition-detail {
        margin: 10px 16px 0 0;
        color: $theme;
        .icon-x {
          padding: 2px;
          font-size: 20px;
        }
      }
    }
  }
  .dialog-body {
    border-top: 1px solid #d8d8d8;
    :deep .el-tabs__item {
      width: 188px;
      height: 56px;
      text-align: left;
      line-height: 56px;
      font-size: 18px;
      padding-left: 24px;
    }
    :deep .el-tabs .el-tabs__header {
      box-shadow: none;
      background: #f7f8fa;
    }

    :deep(.el-tabs) {
      .el-tabs__header {
        box-shadow: none;
        background: #f7f8fa;
      }
      .el-tabs__nav-wrap::after {
        display: none;
      }
      .el-tabs__item.is-active {
        background: #fff;
      }
    }
    .el-tabs--left,
    .el-tabs--right {
      border-bottom: 1px solid #d8d8d8;
    }
    .tan-title {
      margin: 14px 0;
    }
    .detail-box {
      .noTask-box {
        display: flex;
        flex-wrap: wrap;
      }
    }
    .condition-detail {
      margin: 0 16px 16px 0;
      color: #555;
    }
    .condition-active {
      color: #0d8dff;
    }
    .condition-active1 {
      color: #ccc;
    }
    .body-right-container {
      padding-left: 24px;
      height: 280px;
      overflow-y: scroll;
      .noTask-box {
        display: flex;
      }
      .body-right {
        .tan-title {
          font-size: 16px;
          line-height: 24px;
        }
        .el-tag {
          margin: 13px 16px 29px 0;
        }
      }
    }
    .body-right-container::-webkit-scrollbar {
      width: 10px;
    }
    .body-right-container::-webkit-scrollbar-thumb {
      background: #bfbfbf;
      border-radius: 10px;
    }
  }
  .btn-box {
    display: flex;
    justify-content: center;
    padding-top: 40px;
  }
}
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
    background-image: url('@/assets/imgs/banner-project.jpg');
    .head-wrap {
      max-width: 1448px;
      margin: 0 auto;
      padding: 56px 16px 0px;
      color: #000;
      .wrap-top {
        display: flex;
        justify-content: space-between;
        margin-bottom: 58px;
        .title {
          padding-bottom: 8px;
          font-size: 36px;
          line-height: 48px;
        }
        .introduce {
          font-size: 18px;
          line-height: 24px;
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
      .wrap-bottom {
        height: 46px;
        :deep(.o-nav) {
          .nav-item {
            line-height: 28px;
            font-size: 20px;
            font-weight: 400;
            color: rgba(0, 0, 0, 0.8);
            align-items: flex-start;
          }
        }
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
        margin: 0 16px 16px 0;
        color: #555;
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
          margin: 0 16px 16px 0;
          color: #555;
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
        background-color: #fff;
        border-radius: 16px;
        padding: 18px 24px;
      }
      .head-option {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .project-tags {
          display: flex;
          align-items: center;
          .el-dropdown {
            .link-text {
              width: 142px;
              font-size: 14px;
              color: #000000;
              font-weight: 400;
              line-height: 22px;
              padding: 5px 16px;
              border: 1px solid #999999;
              border-radius: 18px;
              cursor: pointer;
            }
          }
          .hot-tags {
            margin-left: 24px;
            font-weight: 400;
            cursor: pointer;
            .title {
              font-size: 14px;
              color: #000000;
              line-height: 22px;
            }
            .tag-item {
              display: inline-block;
              font-size: 12px;
              color: #555555;
              line-height: 18px;
              background: #f4f5f7;
              border-radius: 16px;
              padding: 5px 12px;
              margin-left: 8px;
              border: 1px solid transparent;
              .o-icon {
                margin-right: 4px;
                color: #ccc;
                svg {
                  vertical-align: middle;
                  font-size: 16px;
                }
              }
              span {
                vertical-align: middle;
              }
            }
            .tag-active {
              color: #0d8dff;
              background: #ffffff;
              border: 1px solid #0d8dff;
              .o-icon {
                color: #0d8dff;
              }
            }
          }
        }
        .project-search {
          display: flex;
          align-items: center;

          .o-icon {
            cursor: pointer;
            margin-left: 24px;
            font-size: 24px;
          }
          .sort-select {
            .el-select {
              width: 114px;
              margin-left: 8px;
            }
          }
          .el-input {
            width: 320px;
          }
        }
      }
      .head-tags {
        display: flex;
        justify-content: space-between;
        align-items: center;
        min-height: 28px;
        line-height: 28px;
        .head-title {
          display: flex;
          align-items: center;
          .title {
            margin-right: 8px;
            font-size: 14px;
            color: #000;
            font-weight: 400;
            line-height: 22px;
          }
          .condition-detail {
            margin: 0px 16px 0 0;
            color: $theme;
            background-color: rgba(13, 141, 255, 0.15);
            .icon-x {
              padding: 2px;
              font-size: 20px;
            }
          }
        }
        .head-delete {
          font-size: 12px;
          color: #555555;
          line-height: 18px;
          display: flex;
          align-items: center;
          cursor: pointer;
          .o-icon {
            font-size: 16px;
            margin-right: 6px;
          }
        }
      }
      .empty-status {
        padding: 110px 0 150px 0;
      }
      .card-list {
        display: grid;
        grid-template-columns: repeat(3, 456px);
        column-gap: 24px;
        row-gap: 24px;
        margin-top: 24px;
        position: relative;
        .pro-card {
          background-color: #fff;
          position: relative;
          &:hover {
            box-shadow: 0px 1px 30px 0px rgba(0, 0, 0, 0.05);
            border-radius: 16px;
            transition: all 0.2s linear;
          }
          .mark-tag {
            position: absolute;
            top: 16px;
            right: 16px;
            padding: 3px 8px;
            z-index: 10;
            background: linear-gradient(45deg, #ffd866 0%, #ff7f0d 100%);
            font-size: 12px;
            color: #ffffff;
            border-radius: 10px;
          }
          .mark-tag1 {
            position: absolute;
            top: 16px;
            right: 16px;
            padding: 3px 8px;
            background: linear-gradient(326deg, #0d8dff 0%, #a5d4ff 100%);
            z-index: 10;
            font-size: 12px;
            color: #ffffff;
            border-radius: 10px;
          }
        }
        .pagination {
          display: flex;
          justify-content: center;
          position: absolute;
          bottom: -76px;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          .total {
            line-height: 36px;
            font-size: 14px;
            font-weight: 400;
            color: rgba(0, 0, 0, 0.8);
            margin-right: 8px;
          }
        }
        .pro-card {
          cursor: pointer;
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          &:hover {
            .cover {
              transform: scale(1.05);
              transition: all 0.2s linear;
            }
          }
          .o-icon {
            margin-right: 2px;
          }
          .card-top {
            height: 128px;
            position: relative;
            color: #fff;
            padding: 8px 8px 0px;
            .img-wrap {
              width: 100%;
              height: 100%;
              border-radius: 8px;
              overflow: hidden;
            }
            .cover {
              width: 100%;
              height: 100%;
              object-fit: cover;
              border-radius: 8px;
              transition: all 0.2s linear;
            }
          }
          .card-desc {
            padding: 24px 24px 16px;
            .title {
              height: 28px;
              line-height: 28px;
              font-size: 20px;
              font-weight: 500;
              color: #000000;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .description {
              min-height: 44px;
              line-height: 22px;
              font-size: 14px;
              font-weight: 400;
              color: #555555;
              margin: 8px 0 16px;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              overflow: hidden;
              -webkit-line-clamp: 2;
              word-wrap: break-word;
            }
            .tag-list {
              line-height: 18px;
              font-size: 12px;
              font-weight: 400;
              color: #0d8dff;
              .tag {
                display: inline-block;
                background: rgba(13, 141, 255, 0.15);
                border-radius: 12px;
                padding: 3px 12px;
                margin-right: 4px;
                margin-bottom: 8px;
              }
            }
          }
          .card-bottom {
            padding: 0px 24px 24px;
            display: flex;
            justify-content: space-between;
            line-height: 22px;
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
            .info-right {
              display: flex;
              align-items: center;
              font-size: 12px;
              color: #555;
              .time,
              .dig,
              .download,
              .fork {
                margin-right: 9px;
                .o-icon {
                  font-size: 13px;
                  margin-right: 4px;
                  svg {
                    fill: #555;
                    vertical-align: middle;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
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
}
.el-divider {
  margin: 16px auto;
  color: #e5e5e5;
}
</style>
