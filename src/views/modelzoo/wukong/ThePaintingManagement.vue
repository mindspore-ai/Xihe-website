<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import IconArrow from '~icons/app/arrow-top';
import IconLike from '~icons/app/like';

import { useUserInfoStore } from '@/stores';

const router = useRouter();
const userInfoStore = useUserInfoStore();

const navItems = ref([
  { tag: '我的收藏', icon: '1', path: '/modelzoo/wukong/admin/collection' },
  // { tag: '我的公开', icon: '2', path: '/modelzoo/wukong/admin/public' },
]);
const currentNav = ref('1');

function handleNavClick(item) {
  currentNav.value = item.icon;
  router.push(item.path);
}

function goToBigmodel() {
  router.push('/modelzoo');
}
function goToWukong() {
  router.push('/modelzoo/wukong');
}
</script>
<template>
  <div class="wrapper">
    <div class="painting-management">
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
              :class="currentNav === item.icon ? 'active' : ''"
              @click="handleNavClick(item)"
            >
              <o-icon v-if="item.icon === '1'">
                <icon-like></icon-like>
              </o-icon>
              <o-icon v-else>
                <icon-arrow></icon-arrow>
              </o-icon>
              <p>{{ item.tag }}</p>
            </div>
          </div>
        </div>
        <div class="content">
          <router-view></router-view>
        </div>
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
  height: 100%;
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
      width: 436px;
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
</style>
