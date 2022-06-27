<script setup>
import { computed, ref, reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import OButton from '@/components/OButton.vue';
import ONav from '@/components/ONav.vue';
import UserLive from './UserLive.vue';

import IconMenu from '~icons/app/menu';
import IconPlus from '~icons/app/plus';
// import IconLocation from '~icons/app/location';
import IconGitee from '~icons/app/gitee';
import IconGithub from '~icons/app/github';
import IconHome from '~icons/app/home';
import { Search } from '@element-plus/icons-vue';

import { useUserInfoStore, useVistorInfoStore } from '@/stores';
import { getUserDig } from '@/api/api-user';
import { goAuthorize } from '@/shared/login';

const router = useRouter();
const userInfoStore = useUserInfoStore();
const vistorInfoStore = useVistorInfoStore();
const route = useRoute();

// 是否是访客
const isAuthentic = computed(() => {
  return route.params.user === userInfoStore.userName;
});

// 当前用户信息
const userInfo = computed(() => {
  return isAuthentic.value ? userInfoStore : vistorInfoStore;
});
const activeNavItem = ref('');
// 导航
const navItems = [
  {
    id: 'lives',
    label: '动态',
    creative: false,
    // isPrivate: true,
  },
  {
    id: 'projects',
    label: '项目',
    creative: true,
    isPrivate: false,
    action: () => {
      router.push('/new/project');
    },
  },
  {
    id: 'models',
    label: '模型',
    creative: true,
    isPrivate: false,
    action: () => {
      router.push('/new/model');
    },
  },
  {
    id: 'datasets',
    label: '数据集',
    creative: true,
    isPrivate: false,
    action: () => {
      router.push('/new/dataset');
    },
  },
  {
    id: 'collections',
    label: '收藏',
    creative: false,
    isPrivate: true,
  },
];
//
let i18n = {
  head: {
    title: '模型',
    introduce: '简单介绍',
    btn: '新建模型',
  },
  placeholder: {
    models: '请输入模型名',
    datasets: '请输入数据集名',
    projects: '请输入项目名',
  },
  sortCondition: [
    { text: '按照下载量排序', value: 'download' },
    { text: '按照首字母排序', value: 'name' },
    { text: '按照更新时间排序', value: 'update_time' },
  ],
};
// 登录用户关注列表
const followList = computed(() => {
  return userInfoStore.followList;
});

// 登录用户关注id列表
let followIdList = followList.value.map((val) => {
  return val.id;
});
// 拼接登陆用户信息与关注列表的信息一致
let currentUserInfo = reactive({
  avatar: userInfoStore.avatar,
  description: userInfoStore.description,
  id: userInfoStore.id,
  name: userInfoStore.nickName,
});
// 拼接当前用户信息与关注列表的信息一致
let jointUserInfo = reactive({
  avatar: userInfo.value.avatar,
  description: userInfo.value.description,
  id: userInfo.value.id,
  name: userInfo.value.nickName,
});
// 判断用户关注id列表是否含有该粉丝id
if (followIdList.indexOf(jointUserInfo.id) !== -1) {
  jointUserInfo.isFollow = true;
} else {
  jointUserInfo.isFollow = false;
}
const holder = computed(() => {
  return route.path.split('/')[2];
});
// 头部标题
const headTitle = {
  user: '主页',
  follows: '粉丝',
  watched: '关注',
};
const label = computed(() => {
  return route.path.split('/')[2];
});
// 可被创建的导航模块
const creativeItems = computed(() => {
  return navItems.filter((item) => {
    return item.creative;
  });
});
// 渲染的nav数据 (区分访客和用户)
const renderNav = computed(() => {
  // isAuthentic ? return navItems:
  return isAuthentic.value
    ? navItems
    : navItems.filter((item) => {
      return !item.isPrivate;
    });
});

watch(
  () => {
    return route.name;
  },
  (val) => {
    const name = val.substring(4) || 'lives';
    activeNavItem.value = name.toLowerCase();
  },
  { immediate: true }
);

// 是否显示用户动态组件
const showLives = computed(() => {
  return route.name === 'user';
});
// 是否显示工具栏
// 用户关注和用户粉丝列表不显示
const showTool = computed(() => {
  return route.name !== 'userFollows' && route.name !== 'userWatched';
});

function handleNavClick(item) {
  router.push(
    item.id === 'lives'
      ? `/${userInfo.value.userName}`
      : `/${userInfo.value.userName}/${item.id}`
  );
}

const orderValue = ref('123');
function dropdownClick(item) {
  orderValue.value = item.value;
  // console.log(orderValue.value);
}

function createNew(item) {
  router.push(`/new/${item.id}`);
}

function goSetting() {
  router.push(`/settings`);
}
// 粉丝页
function goFollow() {
  router.push({ path: `/${userInfo.value.userName}/follows` });
}
// 关注页
function goWatched() {
  router.push({ path: `/${userInfo.value.userName}/watched` });
}

// 关注用户or点赞
function getFollow(userId, fans) {
  // 如果用户没有登录，则跳转到登录页面
  if (!userInfoStore.id) {
    return goAuthorize();
  } else {
    try {
      getUserDig({ userId, fans }).then((res) => {
        if (res.status === 200) {
          if (followIdList.indexOf(fans.id) !== -1) {
            let index = followIdList.indexOf(fans.id);
            followList.value.splice(index, 1);
          } else {
            followList.value.push(fans);
          }
          if (jointUserInfo.isFollow) {
            // 删除粉丝列表中的粉丝信息
            let index = userInfo.value.fansList.indexOf(currentUserInfo);
            userInfo.value.fansList.splice(index, 1);
          } else {
            userInfo.value.fansList.push(currentUserInfo);
          }
        }
        jointUserInfo.isFollow = !jointUserInfo.isFollow;
      });
    } catch (error) {
      console.log(error);
    }
  }
}
</script>

<template>
  <div class="user-banner">
    <div class="wrap">
      {{ isAuthentic ? '我' : userInfo.userName }}的{{
        headTitle[label] ? headTitle[label] : headTitle.user
      }}
    </div>
  </div>
  <div class="user-content">
    <div class="wrap">
      <!-- sidebar -->
      <div class="content-sidebar">
        <div class="user-info-basic">
          <div class="user-avatar">
            <el-avatar :size="160" :src="userInfo.avatar" fit="fill" />
          </div>
          <p class="user-name">{{ userInfo.userName }}</p>
          <div class="user-social">
            <p class="user-social-item" @click="goFollow()">
              <span>粉丝</span>
              <span class="social-item-fans">{{ userInfo.fansCount }}</span>
            </p>
            <p class="user-social-item" @click="goWatched()">
              <span>关注</span>
              <span class="social-item-follow">{{ userInfo.followCount }}</span>
            </p>
          </div>

          <OButton
            v-if="isAuthentic"
            :style="{ marginTop: '24px' }"
            @click="goSetting"
            >设置个人资料</OButton
          >
          <div
            v-else
            :style="{ marginTop: '24px' }"
            @click="getFollow(userInfoStore.id, jointUserInfo)"
          >
            <OButton
              v-if="jointUserInfo.isFollow"
              type="secondary"
              class="item-btn"
            >
              取消关注
            </OButton>
            <OButton v-else type="primary">关注TA</OButton>
          </div>
        </div>
        <div class="user-info-extends">
          <div class="info-extends-box">
            <p class="info-extends-title">个人介绍</p>
            <div class="info-extends-detail gray">
              <span>{{
                userInfo.description || '这个人很懒，啥都没留下'
              }}</span>
            </div>
          </div>
          <div class="info-extends-box">
            <p class="info-extends-title">详细信息</p>
            <div v-if="userInfo.description" class="info-extends-detail">
              <p class="extends-detail-item">
                <OIcon size="medium"><IconHome /></OIcon>
                <span>主页地址</span>
                <span>{{ userInfo.link }}</span>
              </p>
            </div>
            <div v-if="userInfo.github" class="info-extends-detail">
              <p class="extends-detail-item">
                <OIcon size="medium"><IconGithub /></OIcon>
                <span>github地址</span>
                <span>{{ userInfo.github }}</span>
              </p>
            </div>
            <div v-if="userInfo.github" class="info-extends-detail">
              <p class="extends-detail-item">
                <OIcon size="medium"><IconGitee /></OIcon>
                <span>gitee地址</span>
                <span>{{ userInfo.gitee }}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- content -->
      <div class="content-detail">
        <!-- 工具栏 -->
        <div v-if="showTool" class="content-detail-tool">
          <div class="content-nav">
            <ONav
              class="tool-nav"
              :nav-items="renderNav"
              :active-item="activeNavItem"
              @nav-click="handleNavClick"
            ></ONav>
            <!-- <div v-if="i18n.placeholder[holder]" class="moderl-head-right">
              <el-input
                size="large"
                :prefix-icon="Search"
                :placeholder="i18n.placeholder[holder]"
              />
              <el-dropdown popper-class="filter">
                <span class="el-dropdown-link">
                  <OIcon><IconMenu /></OIcon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      v-for="item in i18n.sortCondition"
                      :key="item.text"
                      @click="dropdownClick(item)"
                      >{{ item.text }}</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div> -->
          </div>

          <el-dropdown
            v-if="isAuthentic"
            class="detail-creating"
            popper-class="nav"
          >
            <OButton type="primary">
              新建
              <template #prefix>
                <OIcon><IconPlus /></OIcon
              ></template>
            </OButton>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="item in creativeItems"
                  :key="item.id"
                  @click="createNew(item)"
                  >{{ item.label }}</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <!-- 具体内容 -->
        <div class="content-detail-info">
          <!-- 默认显示动态 -->
          <UserLive v-if="showLives" />
          <router-view
            :key="$route.fullPath"
            :order-value="orderValue"
          ></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.user-banner {
  width: 100%;
  padding-top: 80px;
  background-color: #0f1927;
  color: #ffffff;
  background-image: url(../../assets/banner-head.png);
  background-size: cover;
  background-repeat: no-repeat;

  .wrap {
    max-width: 1472px;
    margin: 0 auto;
    // height: 100%;
    height: 177px;
    padding: 42px 16px;
    font-size: 36px;
    font-weight: normal;
    line-height: 48px;
  }
}

.user-content {
  width: 100%;
  height: 100%;
  background-color: #f5f6f8;

  .wrap {
    display: flex;
    max-width: 1472px;
    margin: 0 auto;
    min-height: calc(100vh - 296px);
    padding: 40px 16px 64px 16px;

    .content-sidebar {
      width: 25%;
      background: #ffffff;
      padding: 40px;
      margin-bottom: 36px;
      .user-info-basic {
        display: flex;
        flex-direction: column;
        align-items: center;
        .user-avatar {
          border-radius: 50%;
          border: 3px solid #bfddff;
          .el-avatar {
            display: block;
          }
        }
        .user-name {
          height: 24px;
          font-size: 24px;
          font-weight: normal;
          color: #000000;
          margin-top: 16px;
          line-height: 24px;
        }

        .user-social {
          margin-top: 16px;
          display: grid;
          grid-gap: 20px 20px;
          grid-template-columns: 1fr 1fr;

          &-item {
            display: flex;
            justify-content: center;
            font-size: 14px;
            font-weight: normal;
            color: #000000;
            line-height: 22px;
            color: #555555;
            cursor: pointer;
            &:hover {
              color: #0d8dff;
              .social-item-fans {
                color: #0d8dff;
              }
              .social-item-follow {
                color: #0d8dff;
              }
            }

            span:nth-child(2) {
              color: #000000;
              margin-left: 8px;
            }
          }
        }
      }

      .user-info-extends {
        display: flex;
        flex-direction: column;
        margin-top: 40px;

        .info-extends-box {
          & + .info-extends-box {
            margin-top: 40px;
          }

          .info-extends-title {
            font-size: 24px;
            font-weight: normal;
            color: #000000;
            line-height: 32px;
          }

          .info-extends-detail {
            margin-top: 16px;
            font-size: 18px;
            font-weight: normal;
            line-height: 22px;

            .extends-detail-item {
              display: flex;
              align-items: center;
              & + .extends-detail-item {
                margin-top: 16px;
              }

              .o-icon {
                margin-right: 12px;
              }
            }
          }
        }
      }
    }
    .content-detail {
      position: relative;
      margin-left: 24px;
      width: calc(75% - 24px);

      &-tool {
        display: flex;
        height: 48px;
        justify-content: space-between;
        .content-nav {
          display: flex;
          width: 100%;
          justify-content: space-between;
          padding: 0 40px;
          background: #ffffff;
          // box-shadow: 0px 1px 3px 0px rgba(190, 196, 204, 0.2);
          .moderl-head-right {
            .el-input {
              width: 200px;
            }
            display: flex;
            align-items: center;
            .o-icon {
              cursor: pointer;
              margin-left: 24px;
              font-size: 24px;
            }
          }
        }
        .detail-creating {
          margin-left: 24px;
        }
      }

      &-info {
        width: 100%;
        height: 100%;
      }

      &-tool + .content-detail-info {
        margin-top: 30px;
        height: calc(100% - 88px);
      }
    }
  }
}

.gray {
  color: #555555;
}

:deep(.o-nav) {
  .nav-item {
    font-size: 16px;
    color: #555555;
    &:after {
      height: 1px;
    }

    &:hover {
      color: #0d8dff;
    }

    &.active {
      color: #0d8dff !important;
      &:after {
        background: #0d8dff;
      }
    }
  }
}
</style>
