<script setup>
import { computed, ref, reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import OButton from '@/components/OButton.vue';
// import ONav from '@/components/ONav.vue';

// import IconMenu from '~icons/app/menu';
// import IconPlus from '~icons/app/plus';
import IconGitee from '~icons/app/gitee';
import IconGithub from '~icons/app/github';
import IconEmail from '~icons/app/email';
import IconHome from '~icons/app/home1';
import IconCourse from '~icons/app/my-course';
// import { Search } from '@element-plus/icons-vue';

import { useUserInfoStore } from '@/stores';
import { goAuthorize } from '@/shared/login';
import { getFollowing, cancelFollowing } from '@/api/api-user';

import IconDialog from '~icons/app/dialog';
import IconLock from '~icons/app/lock';
// import IconEmail from '~icons/app/email';
import IconTrophy from '~icons/app/trophy';
// import IconInvitation from '~icons/app/invitation';
import IconCloud from '~icons/app/cloud';
const userInfoStore = useUserInfoStore();
const settingItems = [
  {
    id: userInfoStore.userName,
    label: '个人主页',
    icon: IconHome,
  },
  {
    id: 'profile',
    label: '公开资料',
    icon: IconDialog,
  },
  {
    id: 'security',
    label: '账户安全',
    icon: IconLock,
  },
  // {
  //   id: 'email',
  //   label: '邮件',
  //   icon: IconEmail,
  // },
  {
    id: 'course',
    label: '我的课程',
    icon: IconCourse,
  },
  {
    id: 'competition',
    label: '我的比赛',
    icon: IconTrophy,
  },
  // {
  //   id: 'invitation',
  //   label: '我的邀请',
  //   icon: IconInvitation,
  // },
  {
    id: 'clouddev',
    label: '我的开发环境',
    icon: IconCloud,
  },
];
const detailTitle = computed(() => {
  let activeItem, item;
  for (let i = 0, len = settingItems.length; i < len; i++) {
    item = settingItems[i];
    if (item.id === activeId.value) {
      activeItem = item;
      break;
    }
  }
  return activeItem.label || 'profile';
});

const activeId = ref('profile');
const route = useRoute();
watch(
  () => {
    return route.path.split('/')[2];
  },
  (val) => {
    activeId.value = val || 'profile';
  },
  { immediate: true }
);

const router = useRouter();

// 是否是访客
const isAuthentic = true;

// 当前用户信息
const userInfo = userInfoStore;
const activeNavItem = ref('');

// 路由变化动态改变下外边距
const marginBottom = ref('');

// 动态显示banner标题
const banner = ref('');

watch(
  () => {
    return route.name;
  },
  (val) => {
    marginBottom.value = 0;
    banner.value = val;
    if (val && /^user/g.test(val)) {
      const name = val.substring(4) || 'lives';
      activeNavItem.value = name.toLowerCase();
    } else {
      activeNavItem.value = '';
    }
  },
  { immediate: true }
);
// 解决头部搜索二次进入个人主页页面不刷新
// watch(
//   () => {
//     return route.path;
//   },
//   (newVal, oldVal) => {
//     if (
//       route.name === 'userLives' &&
//       oldVal === '/' + userInfo.value.userName
//     ) {
//       router.go();
//     }
//   }
// );

function goSetting(item) {
  if (item.id === userInfoStore.userName)
    router.push(`/${userInfoStore.userName}`);
  else router.push(`/settings/${item.id}`);
}
// 粉丝页
function goFollow() {
  router.push({ path: `/${userInfoStore.userName}/follows` });
}
// 关注页
function goWatched() {
  router.push({ path: `/${userInfoStore.userName}/watched` });
}

// 当前用户粉丝列表
const currentFansList = ref([]);

// 登录用户的信息
let loginUserInfo = reactive({
  account: userInfoStore.userName,
  avatar_id: userInfoStore.avatar,
  bio: userInfoStore.description,
  is_follower: false,
});

// 关注用户or点赞
function getFollow(name) {
  // 如果用户没有登录，则跳转到登录页面
  if (!userInfoStore.id) {
    goAuthorize();
  } else {
    try {
      let params = { account: name };
      getFollowing(params).then(() => {
        userInfo.value.isFollower = true;
        userInfo.value.fansCount++;
        currentFansList.value.unshift(loginUserInfo);
        userInfoStore.followingCount++;
      });
    } catch (error) {
      console.error(error);
    }
  }
}

// 取消关注用户
function cancelFollow(name) {
  try {
    let params = { account: name };
    cancelFollowing(params).then(() => {
      currentFansList.value.splice(0, 1);
      userInfo.value.isFollower = false;
      userInfo.value.fansCount--;
      userInfoStore.followingCount--;
    });
  } catch (error) {
    console.error(error);
  }
}
</script>

<template>
  <div class="user-banner">
    <div class="wrap">
      <span>个人中心</span>
    </div>
  </div>
  <div class="user-content">
    <div class="wrap">
      <!-- sidebar -->
      <div
        class="content-sidebar"
        :style="{ marginBottom: marginBottom + 'px' }"
      >
        <div class="user-info-basic">
          <div class="user-avatar">
            <el-avatar :size="160" :src="userInfo.avatar" fit="fill" />
          </div>
          <p class="user-name">{{ userInfo.userName }}</p>
          <div class="user-social">
            <p class="user-social-item" @click="goFollow()">
              <span>粉丝</span>
              <span class="social-item-fans">{{
                userInfo.fansCount > 10000
                  ? (userInfo.fansCount - (userInfo.fansCount % 1000)) / 10000 +
                    'W'
                  : userInfo.fansCount
              }}</span>
              <!-- <span class="social-item-fans">{{ userInfo.fansCount }}</span> -->
            </p>
            <p class="user-social-item" @click="goWatched()">
              <span>关注</span>
              <span class="social-item-follow">
                {{
                  userInfo.followingCount > 10000
                    ? (userInfo.followingCount -
                        (userInfo.followingCount % 1000)) /
                        10000 +
                      'W'
                    : userInfo.followingCount
                }}
              </span>
            </p>
          </div>

          <!-- <OButton
            v-if="isAuthentic"
            :style="{ marginTop: '24px' }"
            @click="goSetting"
            >设置个人资料</OButton
          > -->
          <div v-if="!isAuthentic" :style="{ marginTop: '24px' }">
            <OButton
              v-if="userInfo.isFollower"
              type="secondary"
              class="item-btn"
              @click="cancelFollow(userInfo.userName)"
            >
              取消关注
            </OButton>
            <OButton v-else type="primary" @click="getFollow(userInfo.userName)"
              >关注TA</OButton
            >
          </div>
        </div>
        <div v-if="!isAuthentic" class="user-info-extends">
          <div class="info-extends-box">
            <p class="info-extends-title">个人介绍</p>
            <div class="info-extends-detail gray">
              {{ userInfo.description || '这个人很懒，啥都没留下' }}
            </div>
          </div>
          <div class="info-extends-box">
            <p class="info-extends-title">个人邮箱</p>
            <div class="info-extends-detail gray">
              <OIcon size="medium"><IconEmail /></OIcon>
              <span style="margin-left: 8px">{{
                userInfo.email ? userInfo.email : '暂未留下邮箱地址'
              }}</span>
            </div>
          </div>
          <div
            v-if="userInfo.github || userInfo.gitee"
            class="info-extends-box"
          >
            <p class="info-extends-title">详细信息</p>
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
        <ul v-else class="setting-menu-list">
          <li
            v-for="item in settingItems"
            :key="item.id"
            :class="{ active: activeId === item.id }"
            @click="goSetting(item)"
          >
            <OIcon size="medium"><component :is="item.icon"></component></OIcon>
            {{ item.label }}
          </li>
        </ul>
      </div>

      <!-- content -->
      <div class="content-detail">
        <!-- 具体内容 -->
        <div class="setting-detail">
          <div class="detail-title">
            <h2>{{ detailTitle }}</h2>
          </div>
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.setting-menu-list {
  width: 100%;
  margin-top: 56px;

  li {
    position: relative;
    height: 56px;
    font-size: 18px;
    font-weight: normal;
    color: #555555;
    line-height: 56px;
    padding: 0 48px;
    cursor: pointer;
    display: flex;
    align-items: center;

    .o-icon {
      margin-right: 12px;
    }

    &:hover {
      color: #000000;
    }

    &::after {
      content: '';
      position: absolute;
      right: 0;
      width: 2px;
      height: 100%;
      background: transparent;
    }

    &.active {
      color: #000000;
      background-color: #f7f8fa;
    }

    &.active::after {
      background-color: #3d8df7;
    }
  }
}

.user-banner {
  width: 100%;
  padding-top: 80px;
  background-color: #f5f6f8;
  color: #000;
  background-image: url('@/assets/imgs/banner-head.png');
  background-size: cover;
  background-repeat: no-repeat;

  .wrap {
    max-width: 1472px;
    margin: 0 auto;
    // height: 100%;
    height: 177px;
    padding: 0px 16px;
    font-size: 36px;
    font-weight: normal;
    line-height: 177px;
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
    min-height: calc(100vh - 450px);
    padding: 40px 16px 64px 16px;

    .content-sidebar {
      width: 25%;
      background: #ffffff;
      padding: 40px 0 64px;
      // margin-bottom: 36px;
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
        margin-left: 40px;
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
            display: flex;
            align-items: center;
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
      background-color: #ffffff;

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

      &-tool + .content-detail-info {
        // position: relative;
        margin-top: 30px;
      }
      .detail-title {
        position: relative;
        display: flex;
        align-items: center;
        margin-bottom: 48px;

        h2 {
          position: relative;
          height: 48px;
          font-size: 36px;
          font-weight: 300;
          color: #000000;
          line-height: 48px;
        }

        &::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -24px;
          width: 100%;
          height: 1px;
          background-color: #d8d8d8;
        }
      }
      .setting-detail {
        padding: 48px 40px 0;
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
