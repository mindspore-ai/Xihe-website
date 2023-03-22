<script setup>
import { useRouter } from 'vue-router';

import defectDetecting from '@/assets/imgs/estate/defect-detecting.png';
import anomalyDetection from '@/assets/imgs/estate/anomaly-detection.png';

const cases = [
  {
    id: 1,
    type: '变电站AI分析主机',
    // name: 'PatchCore异常检测',
    image: anomalyDetection,
    url: '/estate/electricity/substation',
  },
  {
    id: 2,
    type: '敬请期待',
    // name: 'PatchCore异常检测',
    image: defectDetecting,
    url: '',
  },
];

const router = useRouter();

function goCasePath(item) {
  if (item.type !== '敬请期待') {
    router.push(item.url);
  }
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
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 24px;
  margin-top: 40px;
  .case-item {
    width: 100%;
    cursor: pointer;
    position: relative;
    &:last-child {
      cursor: not-allowed;
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
    }
  }
}
</style>
