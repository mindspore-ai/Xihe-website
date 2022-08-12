<script setup>
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import IconDialog from '~icons/app/dialog';
import IconLock from '~icons/app/lock';
import IconEmail from '~icons/app/email';
import IconInvitation from '~icons/app/invitation';

import ringImg from '@/assets/icons/ring.png';

import { useUserInfoStore } from '@/stores';

const userInfoStore = useUserInfoStore();
const router = useRouter();
const route = useRoute();

const settingItems = [
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
  {
    id: 'email',
    label: '邮件',
    icon: IconEmail,
  },
  {
    id: 'invitation',
    label: '我的邀请',
    icon: IconInvitation,
  },
];

const activeId = ref(route.path.split('/')[2] || 'profile');

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

watch(
  () => {
    return route.path.split('/')[2];
  },
  (val) => {
    activeId.value = val || 'profile';
  },
  { immediate: true }
);

const showInvitationTip = computed(() => {
  return route.name === 'settingsInvitation';
});

function goSetting(item) {
  router.push(`/settings/${item.id}`);
}

function goUserPage() {
  if (userInfoStore.id) {
    router.push(`/${userInfoStore.userName}`);
  }
}
</script>

<template>
  <div class="setting">
    <div class="wrap">
      <div class="setting-menu">
        <div class="user-info" @click="goUserPage">
          <el-avatar :size="64" :src="userInfoStore.avatar" fit="fill" />
          <div class="user-name">
            <p>{{ userInfoStore.userName }}</p>
            <p>{{ userInfoStore.nickName || '--' }}</p>
          </div>
        </div>
        <ul class="setting-menu-list">
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
      <div class="setting-detail">
        <div class="detail-title">
          <h2>{{ detailTitle }}</h2>
          <div v-if="showInvitationTip" class="invatation-tip">
            <img :src="ringImg" />
            邀请好友注册，赢万元大奖
          </div>
        </div>
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.invatation-tip {
  display: flex;
  align-items: center;
  margin-left: 40px;
  padding: 8px 27px 8px 16px;
  background: rgba(13, 141, 255, 0.03);
  border: 1px solid #d8d8d8;
  font-size: 14px;
  font-weight: normal;
  color: #555555;
  line-height: 22px;
  img {
    width: 16px;
    height: 16px;
    margin-right: 16px;
  }
}
.setting {
  width: 100%;
  padding-top: 80px;
  min-height: calc(100vh - 200px);
  background-color: #ffffff;

  .wrap {
    display: flex;
    max-width: 1472px;
    margin: 0 auto;
    height: 100%;
    padding: 64px 16px;
    font-weight: normal;
    // line-height: 48px;

    .setting-menu {
      width: 25%;

      .user-info {
        display: flex;
        align-items: flex-start;
        cursor: pointer;

        .user-name {
          margin-left: 24px;

          p:nth-child(1) {
            font-size: 20px;
            font-weight: normal;
            color: #000000;
            line-height: 28px;
          }

          p:nth-child(2) {
            margin-top: 4px;
            font-size: 14px;
            font-weight: 400;
            color: #555555;
            line-height: 22px;
          }
        }
      }
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
    }

    .setting-detail {
      margin-left: 24px;
      width: calc(75% - 24px);

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
    }
  }
}
</style>
