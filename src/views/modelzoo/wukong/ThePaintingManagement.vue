<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import IconArrow from '~icons/app/arrow-top';
import IconLike from '~icons/app/like';

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
    icon: IconArrow,
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

function goToBigmodel() {
  router.push('/modelzoo');
}
function goToWukong() {
  router.push('/modelzoo/wukong');
}

const screenWidth = ref(
  window.innerWidth ||
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
</script>
<template>
  <div class="wrapper">
    <div v-if="screenWidth > 820" class="painting-management">
      <div class="painting-management-bread">
        <p @click="goToBigmodel">大模型</p>
        <span>></span>
        <p @click="goToWukong">悟空</p>
        <span>></span>
        <p class="current">画作管理</p>
      </div>

      <div class="painting-management-main">
        <div class="left">
          <div class="user-info">
            <img :src="userInfoStore.avatar" alt="" />
            <p>{{ userInfoStore.userName }}</p>
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
</template>
<style lang="scss" scoped>
.wrapper {
  background-color: #f5f6f8;
}
.painting-management {
  padding: 120px 16px 64px;
  margin: 0 auto;
  max-width: 1472px;
  .painting-management-bread {
    display: flex;
    height: 18px;
    p {
      font-size: 12px;
      line-height: 18px;
      color: #555550;
      font-weight: bold;
      cursor: pointer;
    }
    span {
      margin: 0 4px;
      color: #555550;
    }
    .current {
      color: #000;
      font-weight: bold;
      cursor: auto;
    }
  }
  .painting-management-main {
    margin-top: 40px;
    display: flex;
    .left {
      min-width: 438px;
      margin-right: 24px;
      min-height: calc(100vh - 442px);
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
      }
      .nav {
        margin-top: 48px;
        .nav-item {
          width: 100%;
          height: 56px;
          background: #fff;
          display: flex;
          padding-left: 48px;
          align-items: center;
          cursor: pointer;
          .o-icon {
            margin-right: 12px;
            font-size: 22px;
          }
        }
        .active {
          background: #f7f8fa;
          backdrop-filter: blur(0px);
          border-right: 2px solid #0d8dff;
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
    margin: 16px 16px 0;
    padding: 16px 12px;
    background-color: #fff;
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
