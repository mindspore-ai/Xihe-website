<script setup>
import { ref, reactive, watch, computed, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { debounce } from 'lodash/function';

import logoImg from '@/assets/imgs/logo.png';
import { goAuthorize, logout } from '@/shared/login';
// import { escapeHtml } from '@/shared/utils';
import OInput from '@/components/OInput.vue';
import ONav from '@/components/ONav.vue';
import OIcon from '@/components/OIcon.vue';

import { useLoginStore, useUserInfoStore } from '@/stores';
import IconSearch from '~icons/app/search';
import IconUser from '~icons/app/user.svg';
import IconArrowRight from '~icons/app/arrow-right.svg';
import { Close } from '@element-plus/icons-vue';
import { getSearchData } from '@/api/api-search';

const router = useRouter();
const route = useRoute();

const loginStore = useLoginStore();
const userInfoStore = useUserInfoStore();

const show = ref(true);
const keyword = ref('');
const queryData = ref([]);
// 模糊搜索结果数据
const modelCount = ref();
const datasetCount = ref();
const projectCount = ref();
const modelData = ref([]);
const datasetData = ref([]);
const projectData = ref([]);
let query = reactive({
  name: '',
});

const navItems = [
  {
    id: 'projects',
    label: '项目',
    href: '/projects',
  },
  {
    id: 'models',
    label: '模型',
    href: '/models',
  },
  {
    id: 'datasets',
    label: '数据集',
    href: '/datasets',
  },
  // {
  //   id: 'teams',
  //   label: '团队',
  //   href: '/teams',
  // },
];
const loginedDropdownItems = [
  {
    id: 'user',
    label: '个人主页',
    action: () => {
      router.push(`/${userInfoStore.userName}`);
    },
  },
  {
    id: 'projects',
    label: '新建项目',
    action: () => {
      router.push('/new/projects');
    },
  },
  {
    id: 'models',
    label: '新建模型',
    action: () => {
      router.push('/new/models');
    },
  },
  {
    id: 'datasets',
    label: '新建数据集',
    action: () => {
      router.push('/new/datasets');
    },
  },
  // {
  //   id: 'teams',
  //   label: '新建团队',
  //   action: () => {
  //     router.push('/new/teams');
  //   },
  // },
  {
    id: 'settings',
    label: '设置',
    action: () => {
      router.push('/settings');
    },
  },
  {
    id: 'logout',
    label: '退出',
    action: () => {
      logout();
      router.push('/home');
    },
  },
];

const activeNavItem = ref('');
watch(
  () => {
    return route.name;
  },
  (val) => {
    if (/^models|datasets|projects|teams/g.test(val)) {
      activeNavItem.value = val;
    } else {
      activeNavItem.value = '';
    }
  },
  { immediate: true }
);

// 返回主页
function handleLogoClick() {
  emptyValue();
  activeNavItem.value = '';
  return router.push({ name: 'home' });
}

// 点击导航
function handleNavClick(item) {
  router.push({ path: item.href });
}

// 输入框自动获得焦点
function showInput() {
  show.value = false;
  nextTick(() => {
    document.querySelector('.search-input').focus();
  });
}
// 搜索防抖函数
const debounceSearch = debounce(getSearch, 500);
function getSearch() {
  query.name = keyword.value;
  try {
    getSearchData(query).then((res) => {
      if (res.status === 200) {
        queryData.value = res.data;
        // 模型、数据集、项目的搜索结果数量
        modelCount.value = res.data[0].count;
        datasetCount.value = res.data[1].count;
        projectCount.value = res.data[2].count;
        // 模型、数据集、项目的搜索结果
        modelData.value = res.data[0].data;
        datasetData.value = res.data[1].data;
        projectData.value = res.data[2].data;
      }
    });
  } catch (error) {
    console.error(error);
  }
}
// 监听输入框值变化
watch(
  keyword,
  () => {
    if (keyword.value) {
      debounceSearch();
    } else {
      modelData.value = [];
      datasetData.value = [];
      projectData.value = [];
    }
  },
  { immediate: true }
);
function emptyValue() {
  keyword.value = '';
  show.value = true;
}
// 关键词高亮
// function changeColor(modelName, keyword) {
//   let val = modelName + '';
//   if (val.indexOf(keyword) !== -1 && keyword) {
//     // 搜索数据结果含有输入框值的下标
//     let indexes = val.indexOf(keyword);
//     // 截取index前、后的字符串
//     let str = val.substring(0, indexes);
//     let str2 = val.substring(indexes + keyword.length);
//     // 转义匹配关键词前后的html标签
//     escapeHtml(str);
//     escapeHtml(str2);
//     const Reg = new RegExp(keyword, 'ig');
//     return (
//       escapeHtml(str) +
//       keyword.replace(
//         Reg,
//         '<span style="color:#000;font-weight:bold">' + keyword + '</span>'
//       ) +
//       escapeHtml(str2)
//     );
//   }
// }
// 关键词高亮
function changeColor(modelName, keyword) {
  let val = modelName + '';
  if (val.indexOf(keyword) !== -1 && keyword) {
    const Reg = new RegExp(keyword, 'ig');
    return val.replace(
      Reg,
      '<span style="color:#000;font-weight:bold">' + keyword + '</span>'
    );
  } else {
    return val;
  }
}

// 获得搜索结果第一条数据
const firstData = computed(() => {
  return modelData.value.length !== 0
    ? modelData.value[0]
    : datasetData.value.length !== 0
    ? datasetData.value[0]
    : projectData.value[0];
});
// 获得当回车时需要跳转的路径
const pathName = computed(() => {
  return modelData.value.length !== 0
    ? 'models'
    : datasetData.value.length !== 0
    ? 'datasets'
    : 'projects';
});
// 回车以第一条数据跳转页面
function goFirstResult() {
  if (!firstData.value) {
    return;
  } else {
    router.push({
      path: `/${pathName.value}/${firstData.value.owner_name.name}/${firstData.value.name}`,
    });
    emptyValue();
  }
}

// 跳转到搜索结果的模型页、数据集页、项目页
function getModel(keyword) {
  router.push({ path: '/models', query: { search: keyword } });
  emptyValue();
}
function getDataset(keyword) {
  router.push({ path: '/datasets', query: { search: keyword } });
  emptyValue();
}
function getProject(keyword) {
  router.push({ path: '/projects', query: { search: keyword } });
  emptyValue();
}

// 跳转到模型、数据集、项目的详情页
function goModelDetail(user, name) {
  router.push({
    path: `/models/${user}/${name}`,
  });
  emptyValue();
}
function goDatasetDetail(user, name) {
  router.push({
    path: `/datasets/${user}/${name}`,
  });
  emptyValue();
}
function goProjectDetail(user, name) {
  router.push({
    path: `/projects/${user}/${name}`,
  });
  emptyValue();
}
function hideInput() {
  if (!keyword.value) {
    emptyValue();
  }
}
</script>

<template>
  <div class="header">
    <div class="header-logo" @click="handleLogoClick">
      <img :src="logoImg" alt="" srcset="" />
    </div>
    <div class="header-content">
      <o-nav
        v-if="show"
        :nav-items="navItems"
        :active-item="activeNavItem"
        @nav-click="handleNavClick"
      ></o-nav>
      <div v-else class="header-center">
        <div class="header-input">
          <o-icon class="search-icon"><icon-search></icon-search></o-icon>
          <el-icon class="empty-icon" @click="emptyValue"><Close /></el-icon>
          <o-input
            id="search-input"
            v-model="keyword"
            placeholder="请输入关键词"
            class="search-input"
            @blur="hideInput"
            @keyup.enter="goFirstResult"
          ></o-input>
          <!-- <o-input
            v-else
            v-model="keyword"
            placeholder="请输入关键词"
            class="search-input"
          ></o-input> -->
        </div>
        <!-- 搜索结果展示 -->
        <div class="search-wrap">
          <div
            v-show="modelCount || datasetCount || projectCount"
            class="search-result"
          >
            <div v-show="modelData.length" class="search-result-items">
              <div class="result-items-title" @click="getModel(keyword)">
                <div class="items-title-name">模型</div>
                <div class="search-result-num">
                  <span class="related-result"
                    >查看{{ modelCount }}个相关模型</span
                  >
                  <o-icon class="right-icon"><icon-arrow-right /> </o-icon>
                </div>
              </div>
              <div class="result-items-item">
                <ul>
                  <li
                    v-for="(model, index) in modelData"
                    v-show="index < 3"
                    :key="model.id"
                    class="result-item-list"
                    :class="{ 'model-list': index == 0 }"
                    @click="goModelDetail(model.owner_name.name, model.name)"
                    v-html="changeColor(model.name, keyword)"
                  ></li>
                </ul>
              </div>
            </div>
            <div v-show="datasetData.length" class="search-result-items">
              <div class="result-items-title" @click="getDataset(keyword)">
                <div class="items-title-name">数据集</div>
                <div class="search-result-num">
                  <span class="related-result"
                    >查看{{ datasetCount }}个相关数据集</span
                  >
                  <o-icon class="right-icon"><icon-arrow-right /></o-icon>
                </div>
              </div>
              <div class="result-items-item">
                <ul ref="nodeList">
                  <li
                    v-for="(dataset, index) in datasetData"
                    v-show="index < 3"
                    :key="dataset.id"
                    class="result-item-list"
                    @click="
                      goDatasetDetail(dataset.owner_name.name, dataset.name)
                    "
                    v-html="changeColor(dataset.name, keyword)"
                  ></li>
                </ul>
              </div>
            </div>
            <div v-show="projectData.length" class="search-result-items">
              <div class="result-items-title" @click="getProject(keyword)">
                <div class="items-title-name">项目</div>
                <div class="search-result-num">
                  <span class="related-result"
                    >查看{{ projectCount }}个相关项目</span
                  >
                  <o-icon class="right-icon"><icon-arrow-right /></o-icon>
                </div>
              </div>
              <div class="result-items-item">
                <ul>
                  <li
                    v-for="(project, index) in projectData"
                    v-show="index < 3"
                    :key="project.id"
                    class="result-item-list"
                    @click="
                      goProjectDetail(project.owner_name.name, project.name)
                    "
                    v-html="changeColor(project.name, keyword)"
                  ></li>
                </ul>
              </div>
            </div>
          </div>
          <!-- 搜索无结果 -->
          <div
            v-show="modelCount == 0 && datasetCount == 0 && projectCount == 0"
          >
            <div class="no-result">找不到该关键词，请重新输入</div>
          </div>
        </div>
        <!-- </div> -->
      </div>
      <div v-show="show" class="header-right">
        <div class="header-search">
          <o-icon class="search-icon"><icon-search></icon-search></o-icon>
          <o-input
            style="border: none"
            placeholder="查询模型和数据集..."
            class="header-right-input"
            @click="showInput"
          />
        </div>
        <a class="header-doc" target="_blank" href="https://xihe-docs.mindspore.cn/"> 文档 </a>
        <div class="header-tool">
          <loading-arc
            v-if="loginStore.isLoggingIn"
            class="loading"
          ></loading-arc>
          <div v-else class="user">
            <el-dropdown
              v-if="!userInfoStore.id"
              class="user-login"
              popper-class="header-nav"
            >
              <icon-user class="user-login-icon"></icon-user>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="goAuthorize">登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <el-dropdown
              v-if="userInfoStore.id"
              class="user-info"
              popper-class="header-nav"
            >
              <el-avatar :size="40" :src="userInfoStore.avatar" fit="fill" />
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    v-for="item in loginedDropdownItems"
                    :key="item.id"
                    @click="item.action"
                    >{{ item.label }}</el-dropdown-item
                  >
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;
  max-width: 1472px;
  margin: 0 auto;
  height: 100%;
  padding: 0 16px;
  position: relative;

  &-logo {
    height: 32px;
    display: flex;
    align-items: center;
    cursor: pointer;
    img {
      vertical-align: top;
      height: 100%;
    }
  }

  &-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    width: 100%;
    margin-left: 96px;

    .header-center {
      width: 48%;
      // background-color: red;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      .header-input {
        width: 100%;
        position: relative;
        .search-icon {
          font-size: 24px;
          color: #979797;
          position: absolute;
          top: 6px;
        }
        .empty-icon {
          font-size: 24px;
          color: #979797;
          position: absolute;
          top: 6px;
          right: 0;
          cursor: pointer;
        }
        .search-input {
          max-width: 100%;
          color: #999;
          font-size: 14px;
          border: none;
          border-bottom: 1px solid #999;
          padding-left: 30px;
        }
      }
      .search-wrap {
        width: 100%;
        margin: 0 auto;
        position: absolute;
        top: 58px;
        box-shadow: 0px 3px 8px 0px rgba(0, 0, 0, 0.05);

        .search-result {
          width: 100%;
          overflow: hidden;
          box-sizing: border-box;
          background-color: #eaebed;
          opacity: 0.98;
          &-items {
            .result-items-title {
              font-size: 12px;
              color: #555;
              font-weight: 500;
              padding: 15px 32px 6px;
              border-bottom: 1px solid #e5e5e5;
              display: flex;
              justify-content: space-between;
              align-items: center;
              // &:hover {
              //   background-color: #e5e5e5;
              // }
              .search-result-num {
                display: flex;
                cursor: pointer;
                .right-icon {
                  font-size: 16px;
                  vertical-align: middle;
                  margin-left: 6px;
                  // cursor: pointer;
                }
              }
            }
            .result-items-item {
              // color: #555;
              &:hover {
                .model-list {
                  background-color: inherit;
                }
              }
              .result-item-list {
                height: 38px;
                line-height: 38px;
                font-size: 14px;
                color: #555;
                padding: 0 32px;
                cursor: pointer;

                &:hover {
                  background-color: #e5e5e5;
                }
              }
              .model-list {
                background-color: #e5e5e5;
              }
            }
          }
        }
        .no-result {
          width: 100%;
          font-size: 12px;
          font-weight: 900;
          color: #555;
          background-color: #fff;
          padding: 15px 32px;
          box-shadow: 0px 3px 8px 0px rgba(0, 0, 0, 0.05);
        }
      }
    }
    .header-right {
      width: 400px;
      display: flex;
      align-items: center;
      justify-content: flex-end;

      .header-search {
        position: relative;
        // margin-right: 30px;
        .search-icon {
          width: 24px;
          height: 24px;
          font-size: 24px;
          color: #979797;
          position: absolute;
          top: 6px;
          left: 16px;
        }

        .header-right-input {
          font-size: 14px;
          color: #999;
          border: 1px #999 solid !important;
          padding-left: 48px;
        }
      }
      .header-doc {
        padding: 0 20px;
        font-size: 12px;
        line-height: 24px;
        color: #ffffff;
      }
      .header-tool {
        height: 100%;
        display: flex;
        align-items: center;

        .loading {
          font-size: 18px;
          color: #ffffff;
          background-color: #0f1927;
        }

        .user {
          color: #ffffff;
          height: 100%;

          &-login {
            height: 100%;
            display: flex;
            align-items: center;
            cursor: pointer;

            &-icon {
              color: #ffffff;
              width: 24px;
              height: 24px;
            }
          }

          &-info {
            height: 100%;
            cursor: pointer;

            &-avatar {
              display: flex;
              align-items: center;
              height: 100%;
            }
          }
        }
      }
    }
  }
}
.vice-header {
  display: flex;
  align-items: center;
  max-width: 1472px;
  margin: 0 auto;
  height: 100%;
  padding: 0 16px;
  position: relative;

  .header-logo {
    height: 32px;
    display: flex;
    align-items: center;
    cursor: pointer;
    img {
      cursor: pointer;
      vertical-align: top;
      height: 100%;
      width: 100%;
    }
  }
  .search-header {
    // width: calc(100% - 86px);
    width: 48%;
    height: 100%;
    display: flex;
    margin: 0 auto;
    align-items: center;
    justify-content: center;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    .header-input {
      width: 100%;
      position: relative;
      .search-icon {
        font-size: 24px;
        color: #979797;
        position: absolute;
        top: 6px;
      }
      .empty-icon {
        font-size: 24px;
        color: #979797;
        position: absolute;
        top: 6px;
        right: 0;
        cursor: pointer;
      }
      .search-input {
        max-width: 100%;
        color: #999;
        font-size: 14px;
        border: none;
        border-bottom: 1px solid #999;
        padding-left: 30px;
      }
    }

    .search-wrap {
      width: 100%;
      margin: 0 auto;
      position: absolute;
      top: 80px;
      box-shadow: 0px 3px 8px 0px rgba(0, 0, 0, 0.05);

      .search-result {
        width: 100%;
        overflow: hidden;
        box-sizing: border-box;
        background-color: #eaebed;
        opacity: 0.98;
        &-items {
          .result-items-title {
            font-size: 12px;
            color: #555;
            font-weight: 500;
            padding: 15px 32px 6px;
            border-bottom: 1px solid #e5e5e5;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .search-result-num {
              display: flex;
              cursor: pointer;
              // align-items: center;
              .right-icon {
                font-size: 16px;
                vertical-align: middle;
                margin-left: 6px;
              }
            }
          }
          .result-items-item {
            // color: #555;
            &:hover {
              .model-list {
                background-color: inherit;
              }
            }
            .result-item-list {
              height: 38px;
              line-height: 38px;
              font-size: 14px;
              color: #555;
              padding: 0 32px;
              cursor: pointer;

              &:hover {
                background-color: #e5e5e5;
              }
            }
            .model-list {
              background-color: #e5e5e5;
            }
          }
        }
      }
      .no-result {
        width: 100%;
        font-size: 12px;
        font-weight: 900;
        color: #555;
        background-color: #fff;
        padding: 15px 32px;
        box-shadow: 0px 3px 8px 0px rgba(0, 0, 0, 0.05);
      }
    }
  }
}
</style>
