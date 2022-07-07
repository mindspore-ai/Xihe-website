<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import IconBack from '~icons/app/back.svg';

import { useUserInfoStore } from '@/stores';

const route = useRoute();
const router = useRouter();
const userInfoStore = useUserInfoStore();

// 是否是访客
const isAuthentic = computed(() => {
  return route.params.user === userInfoStore.userName;
});

// 判断是否是自己的项目，不是则返回首页
function beforeEnter() {
  if (!isAuthentic.value) {
    router.push('/');
  }
}
beforeEnter();
// 返回训练页面
function goTrain() {
  router.push({
    name: 'projectTrain',
  });
}
</script>
<template>
  <div class="projectAim">
    <div class="projectAim-wrap">
      <div class="projectAim-back" @click="goTrain">
        <o-icon class="right-icon"><icon-back /> </o-icon>
        <span> 返回训练 </span>
      </div>
      <div class="projectAim-content"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.projectAim {
  max-width: 100%;
  min-height: calc(100vh - 200px);
  margin-top: 80px;
  background-color: #f5f6f8;
  &-wrap {
    max-width: 1440px;
    height: 100%;
    padding: 50px 130px 64px;
    margin: 0 auto;
    .projectAim-back {
      font-size: 16px;
      color: #555;
      margin-bottom: 49px;
      display: flex;
      align-items: center;
      .right-icon {
        margin-right: 4px;
        cursor: pointer;
      }
      span {
        cursor: pointer;
      }
    }
    .projectAim-content {
      padding: 16px 32px;
      background-color: #fff;
    }
  }
}
</style>
