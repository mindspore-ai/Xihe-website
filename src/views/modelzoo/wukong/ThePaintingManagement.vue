<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import IconOpen from '~icons/app/eye-open';
import IconLike from '~icons/app/like';
import { ArrowRight } from '@element-plus/icons-vue';

import { useUserInfoStore } from '@/stores';

const router = useRouter();
const route = useRoute();
const userInfoStore = useUserInfoStore();

const navItems = [
  {
    id: 1,
    icon: IconLike,
    tag: '我的收藏',
    path: '/modelzoo/wukong/admin/collection',
  },
  {
    id: 2,
    icon: IconOpen,
    tag: '我的公开',
    path: '/modelzoo/wukong/admin/public',
  },
];
const currentNav = ref(1);
currentNav.value = route.path === '/modelzoo/wukong/admin/collection' ? 1 : 2;

function handleNavClick(item) {
  currentNav.value = item.id;
  router.push(item.path);
}

const screenWidth = ref(
  window.innerWiscreenWidthdth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth
);

const onResize = () => {
  screenWidth.value =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
};

watch(
  () => screenWidth.value,
  (newValue) => {
    screenWidth.value = newValue;
  }
);

onMounted(() => {
  window.addEventListener('resize', onResize);
});
// 跳转粉丝页
function goFollow() {
  router.push({ path: `/${userInfoStore.userName}/follows` });
}
// 跳转关注页
function goWatched() {
  router.push({ path: `/${userInfoStore.userName}/watched` });
}
</script>
<template>
  <div class="wrapper">
    <div class="painting-management">
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/modelzoo' }"
          >大模型</el-breadcrumb-item
        >
        <el-breadcrumb-item
          :to="{ path: '/modelzoo/wukong' }"
          class="breadcrumb-item"
          >悟空</el-breadcrumb-item
        >
        <el-breadcrumb-item>画作管理</el-breadcrumb-item>
      </el-breadcrumb>

      <div v-if="screenWidth > 820" class="painting-management-main">
        <div class="left">
          <div class="user-info">
            <img :src="userInfoStore.avatar" alt="" />
            <p>{{ userInfoStore.userName }}</p>
            <div class="user-social">
              <p class="user-social-item" @click="goFollow()">
                <span>粉丝</span>
                <span class="social-item-fans">{{
                  userInfoStore.fansCount > 10000
                    ? (userInfoStore.fansCount -
                        (userInfoStore.fansCount % 1000)) /
                        10000 +
                      'W'
                    : userInfoStore.fansCount
                }}</span>
              </p>
              <p class="user-social-item" @click="goWatched()">
                <span>关注</span>
                <span class="social-item-follow">
                  {{
                    userInfoStore.followingCount > 10000
                      ? (userInfoStore.followingCount -
                          (userInfoStore.followingCount % 1000)) /
                          10000 +
                        'W'
                      : userInfoStore.followingCount
                  }}
                </span>
              </p>
            </div>
          </div>

          <div class="nav">
            <div
              v-for="item in navItems"
              :key="item.tag"
              class="nav-item"
              :class="currentNav === item.id ? 'active' : ''"
              @click="handleNavClick(item)"
            >
              <OIcon><component :is="item.icon"></component></OIcon>
              <p>{{ item.tag }}</p>
            </div>
          </div>
        </div>
        <div class="content"><router-view></router-view></div>
      </div>
      <div v-else class="mobile-management">
        <div class="user-info">
          <div class="avatar">
            <img :src="userInfoStore.avatar" alt="" />
          </div>
          <div class="user-name">{{ userInfoStore.userName }}</div>
        </div>

        <div class="manage-tabs">
          <div
            v-for="item in navItems"
            :key="item.id"
            class="tab-item"
            :class="currentNav === item.id ? 'active-mo' : ''"
            @click="handleNavClick(item)"
          >
            {{ item.tag }}
          </div>
        </div>
        <div class="mobile-content">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.wrapper {
  background-color: #f5f6f8;
  background-image: url(@/assets/imgs/wukong/wukong-banner.png);
  background-size: 100% 246px;
  background-repeat: no-repeat;
  @media screen and (max-width: 821px) {
    background-image: unset;
    .painting-management {
      padding-top: 64px;
    }
    .mobile-management {
      padding-top: 0px;
    }
  }
}
.painting-management {
  padding: 120px 16px 64px;
  margin: 0 auto;
  max-width: 1448px;
  .painting-management-main {
    margin-top: 146px;
    display: flex;
    .left {
      min-width: 438px;
      margin-right: 24px;
      border-radius: 16px;
      padding-bottom: 64px;
      // min-height: calc(100vh - 442px);
      background-color: #fff;
      .user-info {
        margin-top: 48px;
        display: flex;
        flex-direction: column;
        align-items: center;
        img {
          width: 160px;
          height: 160px;
          border-radius: 50%;
        }
        p {
          font-size: 24px;
          color: #000000;
          line-height: 24px;
          margin-top: 16px;
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
      .nav {
        margin-top: 48px;
        padding: 0 24px;
        font-size: 18px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .nav-item {
          width: 100%;
          height: 56px;
          color: #555;
          background: #fff;
          display: flex;
          padding-left: 24px;
          align-items: center;
          cursor: pointer;
          border-radius: 28px;
          backdrop-filter: blur(0px);
          .o-icon {
            margin-right: 12px;
            font-size: 24px;
          }
        }
        .active {
          color: #000;
          background: #f7f8fa;
          backdrop-filter: blur(0px);
        }
      }
    }
    .content {
      flex: 1;
      .collection {
        width: 100%;
        height: 100%;
      }
    }
  }
}

.mobile-management {
  padding-top: 48px;
  height: 100%;
  display: flex;
  flex-direction: column;
  .user-info {
    margin-top: 16px;
    padding: 16px 12px;
    background-color: #fff;
    border-radius: 16px;
    box-shadow: 0px 1px 5px 0px rgba(45, 47, 51, 0.1);
    display: flex;
    align-items: center;
    .avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      border: 1px solid #b7ddff;
      margin-right: 20px;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
    .user-info {
      font-size: 16px;
      font-weight: 300;
      color: #000000;
      line-height: 24px;
    }
  }
  .manage-tabs {
    margin-top: 16px;
    height: 34px;
    background: #fff;
    display: flex;
    justify-content: center;
    .tab-item {
      font-size: 14px;
      line-height: 34px;
      font-weight: 400;
      color: #000000;
      &:first-child {
        margin-right: 16px;
      }
    }
    .active-mo {
      color: #0d8dff;
      border-bottom: 2px solid #0d8dff;
    }
  }
  .mobile-content {
    min-height: calc(100vh - 372px);
  }
}
</style>
