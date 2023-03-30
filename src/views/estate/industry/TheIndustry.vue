<script setup>
import { useRouter } from 'vue-router';

import hostImg from '@/assets/imgs/estate/industry/metal-part.png';
import opsImg from '@/assets/imgs/estate/industry/algorithm.png';
import decisionImg from '@/assets/imgs/estate/industry/code-intelligence.png';

const cases = [
  {
    id: 0,
    type: '金属零部件缺陷检测',
    name: '金属零部件作为系统的关键连接件，需对存在瑕疵的零部件需被准确并高效地检出，不可流入市场销售。',
    image: hostImg,
    url: '/estate/industry/metal-part',
  },
  /* {
    id: 1,
    type: '变电站运维图像识别分析解决方案',
    name: '智能运维的“第三只眼”，变电站运维图像识别分析解决方案，推动变电站运维工作的无人化、智能化、信息化转…',
    image: opsImg,
    url: '/estate/electricity/substation-ops',
  },
  {
    id: 2,
    type: '智能在线决策系统',
    name: '智能在线决策系统有效应对复杂实时电力调度',
    image: decisionImg,
    url: '/estate/electricity/intelligent-system',
  }, */
];

const router = useRouter();

function goCasePath(item) {
  router.push(item.url);
}
</script>
<template>
  <div class="electricity">
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
.electricity {
  .application-cases {
    margin-top: 40px;
    font-size: 36px;
    line-height: 48px;
    color: #000000;
    text-align: center;
  }
  .case-cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 24px;
    grid-template-rows: 320px;
    margin: 40px 0 64px;
    padding: 0px 16px;
    .case-item {
      cursor: pointer;
      border-radius: 16px;
      position: relative;
      &:hover {
        box-shadow: 0 6px 18px #0d8dff24;
      }
      .case-info {
        color: #fff;
        margin: 0 24px;
        position: absolute;
        bottom: 24px;

        .case-type {
          font-size: 24px;
          line-height: 26px;
          font-weight: 500;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: '...';
        }
        .case-name {
          font-size: 16px;
          line-height: 22px;
          font-weight: 400;
          margin-top: 16px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: '...';
        }
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
