<script setup>
import { useRouter } from 'vue-router';

import metalImg from '@/assets/imgs/estate/industry-metal.png';

const cases = [
  {
    id: 1,
    type: '金属零部件缺陷检测',
    name: '金属零部件作为系统的关键连接件，需对存在瑕疵的零部件需被准确并高效地检出，不可流入市场销售',
    image: metalImg,
    url: '/estate/industry/metal-part',
  },
];

const router = useRouter();

// TODO:
function goCasePath(item) {
  router.push(item.url);
}
</script>
<template>
  <div class="industry">
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
.industry {
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
}
</style>
