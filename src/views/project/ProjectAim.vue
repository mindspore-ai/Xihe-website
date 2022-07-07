<script setup>
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserInfoStore } from '@/stores';
import IconBack from '~icons/app/back.svg';

const route = useRoute();
const router = useRouter();
const userInfoStore = useUserInfoStore();
const aimUrl = ref('');
aimUrl.value = route.query.url;

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
function getBack() {
  router.push(`${router.options.history.state.back}`);
}
</script>
<template>
  <div class="projectAim">
    <div class="projectAim-wrap">
      <div class="projectAim-back" @click="getBack">
        <o-icon class="right-icon"><icon-back /> </o-icon>
        <span> 返回训练 </span>
      </div>
      <p class="report">评估报告</p>
      <iframe class="web-ui" :src="aimUrl" frameborder="0"></iframe>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.projectAim {
  max-width: 100%;
  min-height: calc(100vh - 200px);
  margin-top: 80px;
  // background-color: #f5f6f8;
  &-wrap {
    max-width: 1440px;
    height: 100%;
    padding: 50px 130px 64px;
    margin: 0 auto;
    .report {
      font-size: 18px;
      font-family: FZLTHJW--GB1-0, FZLTHJW--GB1;
      font-weight: normal;
      color: #000000;
      line-height: 32px;
      margin-bottom: 16px;
    }
    .web-ui {
      width: 100%;
      min-height: 1039px;
    }
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
