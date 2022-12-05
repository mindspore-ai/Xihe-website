<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const scores = ref(80);
const times = route.query.times;

scores.value = route.query.score;

function handleBackMincon() {
  router.push('/activity');
}

function handleBackPage() {
  router.push('/activity');
}

function handleContinueChallenge() {
  if (times <= 0) {
    ElMessage({
      type: 'warning',
      message: '挑战次数已用尽，请明日再来',
    });
    setTimeout(() => {
      router.push('/activity');
    }, 2000);
  } else {
    router.push('/activity-1');
  }
}
</script>

<template>
  <div class="wrap">
    <div class="container">
      <div class="test-back">
        <span class="history" @click="handleBackPage">MindCon&nbsp;></span>
        <span class="current">&nbsp;超级知识卷</span>
      </div>

      <div class="grade">
        <img
          class="grade-background"
          src="@/assets/imgs/mindcon/mindcon-grade-bg.png"
          alt=""
        />

        <p class="congratuation">恭喜获得</p>

        <div class="middle">
          <img src="@/assets/imgs/mindcon/mindcon-leaf-1.png" alt="" />
          <p>
            <span>{{ scores }}</span
            >分
          </p>
          <img src="@/assets/imgs/mindcon/mindcon-leaf-2.png" alt="" />
        </div>

        <div class="btn-box">
          <o-button
            size="small"
            style="margin-right: 16px"
            @click="handleBackMincon"
            >返回MindCon</o-button
          >
          <o-button type="primary" size="small" @click="handleContinueChallenge"
            >继续挑战</o-button
          >
        </div>

        <p class="challenge-counts">
          今日剩余挑战次数：<span>{{ times }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.wrap {
  min-height: calc(100vh - 200px);
  background-color: #f5f6f8;
}

.container {
  max-width: 1472px;
  margin: 0 auto;
  overflow: hidden;
  .test-back {
    font-size: 12px;
    color: #555555;
    line-height: 18px;
    margin-top: 120px;
    .history {
      cursor: pointer;
    }
    .current {
      font-weight: bold;
    }
  }
}

.grade {
  position: relative;
  overflow: hidden;
  padding-bottom: 40px;
  margin-top: 40px;
  background-color: #fff;
  &-background {
    position: absolute;
    left: 0;
    top: 0;
    height: 353px;
    width: 100%;
  }
  .congratuation {
    font-size: 36px;
    line-height: 48px;
    color: #000000;
    text-align: center;
    margin-top: 86px;
    z-index: 2;
  }
  .middle {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 119px;
    img {
      width: 64px;
      height: 119px;
      border-radius: 50%;
    }
    p {
      width: 140px;
      height: 93px;
      color: #0d8dff;
      line-height: 93px;
      font-size: 24px;
      margin: 0 21px;
      text-align: center;
      span {
        font-size: 100px;
      }
    }
  }
  .btn-box {
    display: flex;
    justify-content: center;
    margin-top: 152px;
  }
  .challenge-counts {
    margin-top: 24px;
    font-size: 14px;
    color: #555555;
    line-height: 22px;
    text-align: center;
    span {
      color: #0d8dff;
    }
  }
}
</style>
