<script setup>
import { useRouter } from 'vue-router';

import cancerImg from '@/assets/imgs/estate/medicine/endometrial-cancer.png';
import surgeryImg from '@/assets/imgs/estate/medicine/surgery.png';
import diagnosticImg from '@/assets/imgs/estate/medicine/diagnostic-system.png';

// import substationImg from '@/assets/imgs/estate/electricity-substation.png';

const cases = [
  {
    id: 0,
    type: '子宫内膜癌筛查联合方案',
    name: '西安美佳家医疗科技有限责任公司基于昇思MindSpore AI框架在华为昇腾910处理器中成功构建了一套人工智能…',
    image: cancerImg,
    url: '/estate/medicine/endometrial-cancer',
  },
  {
    id: 1,
    type: 'TrueSight人工智能临床外科手术决策支持系统',
    name: '本案例是一项由清华大学附属清华长庚医院肝胆胰中心与清华大学精密仪器系骨干成员共同组成申请的创新型医…',
    image: surgeryImg,
    url: '/estate/medicine/truesight', //TODO
  },
  {
    id: 2,
    type: '智慧病理诊断系统',
    name: '智慧病理诊断系统，实现了病理诊断全流程标准化、数字化和智能化，为病理诊断领域发展注入强劲动力。',
    image: diagnosticImg,
    url: '/estate/medicine/diagnosis',
  },
];

const router = useRouter();

function goCasePath(item) {
  router.push(item.url);
}
</script>
<template>
  <div class="medicine">
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
.medicine {
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
    // height: 240px;
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
</style>
