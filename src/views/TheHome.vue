<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
// import BScroll from '@better-scroll/core';
// import Slide from '@better-scroll/slide';
// import MouseWheel from '@better-scroll/mouse-wheel';

import OButton from '@/components/OButton.vue';

import IconArrowRight from '~icons/app/arrow-right.svg';
import { useLoginStore, useUserInfoStore } from '@/stores';
import { goAuthorize, LOGIN_STATUS } from '@/shared/login';

// BScroll.use(Slide);
// BScroll.use(MouseWheel);

const router = useRouter();

const homeIns = ref(null);
const homeTitle = '羲和AI开发平台';
const homeDesc = 'You think MindSpore is hard ? Try this !';
const quickStartLabel = '快速开始';

const loginStore = useLoginStore();
const userInfo = useUserInfoStore();

// let scroller = ref(null);

function handleBtnClick() {
  const status = loginStore.loginStatus;
  if (status === LOGIN_STATUS.DOING) {
    return;
  } else if (status === LOGIN_STATUS.FAILED || status === LOGIN_STATUS.NOT) {
    goAuthorize();
  } else {
    router.push(`/${userInfo.userName}`);
  }
}

onMounted(() => {
  // scroller.value = new BScroll(homeIns.value, {
  //   scrollX: false,
  //   scrollY: true,
  //   slide: {
  //     threshold: 0.1,
  //     autoplay: false,
  //     loop: false,
  //     easing: 'ease',
  //     speed: 800,
  //   },
  //   mouseWheel: { discreteTime: 100 },
  //   momentum: false,
  //   bounce: false,
  //   stopPropagation: true,
  // });
});

onUnmounted(() => {
  // scroller.value && scroller.value.destroy();
});
</script>

<template>
  <div ref="homeIns" class="home">
    <!-- <div class="home-content"> -->
    <!-- <div class="home-slide"> -->
    <p class="home-desc">{{ homeDesc }}</p>
    <p class="home-title">{{ homeTitle }}</p>
    <OButton type="primary" animation class="home-btn" @click="handleBtnClick">
      {{ quickStartLabel }}
      <template #suffix>
        <OIcon><IconArrowRight /></OIcon>
      </template>
    </OButton>
    <!-- </div> -->
    <!-- <div class="home-slide">2</div> -->
    <!-- <div class="home-slide">3</div> -->
    <!-- </div> -->
  </div>
</template>

<style lang="scss" scoped>
.home {
  overflow-y: hidden;
  height: 100vh;
  background-color: #0f1927;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 80px;
  color: #ffffff;
  background-image: url(../assets/home.png);
  background-size: cover;
  background-repeat: no-repeat;

  .home-desc {
    font-size: 44px;
    font-weight: bold;
    color: #ffffff;
    line-height: 52px;
  }

  .home-title {
    height: 45px;
    font-size: 32px;
    font-weight: 400;
    color: #ffffff;
    line-height: 45px;
    margin-top: 20px;
  }

  .home-btn {
    margin-top: 45px;
  }

  // &-content {
  //   height: 100%;
  // }
  // &-slide {
  //   display: flex;
  //   flex-direction: column;
  //   justify-content: center;
  //   align-items: center;
  //   font-size: 80px;
  //   color: #ffffff;
  //   height: 100%;
  //   background-image: url(../assets/home.png);
  //   background-size: cover;
  //   background-repeat: no-repeat;
  // }
}
</style>
