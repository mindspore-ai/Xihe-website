<script setup>
import { useRouter } from 'vue-router';

import substationImg from '@/assets/imgs/estate/electricity-substation.png';

const cases = [
  {
    id: 1,
    type: '变电站AI分析主机',
    name: '变电站AI分析主机内置设备缺陷识别、设备状态判别、安全管控、环境状态感知等多类模型，可以对变电站内设备、环境状态、作业安全进行自动诊断和预警，实现“智能巡检”。',
    image: substationImg,
    url: '/estate/electricity/substation',
  },
];

const router = useRouter();

function goCasePath(item) {
  router.push(item.url);
}
</script>
<template>
  <div class="electric">
    <p class="application-cases">应用案例</p>

    <div class="case-cards">
      <div
        v-for="item in cases"
        :key="item.name"
        class="case-item"
        @click="goCasePath(item)"
      >
        <img :src="item.image" alt="" />

        <div class="case-info">
          <p class="case-type">{{ item.type }}</p>
          <p class="case-name">{{ item.name }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.application-cases {
  margin-top: 40px;
  font-size: 36px;
  line-height: 48px;
  color: #000000;
  text-align: center;
}
.case-cards {
  // display: grid;
  // grid-template-columns: repeat(2, 1fr);
  // grid-gap: 24px;
  height: 240px;
  margin-top: 40px;
  .case-item {
    height: 100%;
    cursor: pointer;
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0px 8px 32px 0px rgba(0, 0, 0, 0.2);
    border-radius: 16px;
    position: relative;
    &:hover {
      box-shadow: 0px 8px 32px 0px rgba(0, 0, 0, 0.2);
    }
    .case-info {
      position: absolute;
      left: 40px;
      bottom: 40px;
      color: #ffffff;
      .case-type {
        font-size: 24px;
        line-height: 26px;
        font-weight: 500;
      }
      .case-name {
        font-size: 16px;
        line-height: 22px;
        font-weight: 400;
        margin-top: 16px;
      }
    }
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
