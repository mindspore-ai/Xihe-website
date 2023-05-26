<script setup>
import { useRouter } from 'vue-router';

import hostImg from '@/assets/imgs/estate/industry/metal-part.png';
import algorithmImg from '@/assets/imgs/estate/industry/algorithm.png';
import codeImg from '@/assets/imgs/estate/industry/code-intelligence.png';
import estateBanner from '@/assets/imgs/estate/estate-banner.png';

const router = useRouter();
const cases = [
  {
    id: 0,
    type: '低码智能视频使能平台',
    name: '行业首个低码智能视频使能平台，赋能工业安全数字化转型。',
    image: codeImg,
    url: '/industry/intelligence',
  },
  {
    id: 1,
    type: '工业AI算法库READ',
    name: 'READ专注于研发与集成基于无监督监督学习的大规模异常检测算法和模型，重点解决工业质检中小样本和数据…',
    image: algorithmImg,
    url: '/industry/algorithm',
  },
  {
    id: 2,
    type: '金属零部件缺陷检测',
    name: '金属零部件作为系统的关键连接件，需对存在瑕疵的零部件需被准确并高效地检出，不可流入市场销售。',
    image: hostImg,
    url: '/industry/metal-part',
  },
];

function goCasePath(item) {
  router.push(item.url);
}
</script>
<template>
  <div class="industry">
    <div class="industry-head">
      <!-- <img :src="estateBanner" alt="" /> -->
      <div class="industry-banner">
        <div class="banner-title">昇思大模型平台助力产业发展</div>
        <div class="banner-desc">
          昇思MindSpore广泛应用在互联网、零售、电力、工业、医疗、安防监控、物流等行业场景中
        </div>
      </div>
    </div>
    <div class="industry-wrapper">
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
  </div>
</template>
<style lang="scss" scoped>
.industry {
  background-color: #f5f6f8;
  padding-bottom: 64px;
  .industry-head {
    padding-top: 80px;
    position: relative;
    background-image: url('@/assets/imgs/estate/estate-banner.png');
    background-size: cover;
    background-position: 50% 50%;
    img {
      width: 100%;
      height: 100%;
    }
    .industry-banner {
      max-width: 1472px;
      margin: 0 auto;
      padding: 160px 16px;
      position: relative;
      top: -55%;
      .banner-title {
        line-height: 48px;
        font-size: 36px;
        font-weight: 400;
        color: #000000;
        margin-bottom: 10px;
      }
      .banner-desc {
        line-height: 24px;
        font-size: 18px;
        font-weight: 400;
        color: #000000;
      }
    }
  }
  .industry-wrapper {
    margin: 0 auto;
    max-width: 1472px;
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
          top: 206px;
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
}
</style>
