<script setup>
import case1 from '@/assets/imgs/estate/humanity/case-aigc.png';
import case2 from '@/assets/imgs/estate/humanity/case-yuzhi.png';
import case3 from '@/assets/imgs/estate/humanity/case-shouyu.png';
import estateBanner from '@/assets/imgs/estate/estate-banner.jpg';

import { useRouter } from 'vue-router';
const router = useRouter();
const cases = [
  {
    id: 1,
    type: '国潮AIGC生态系统',
    name: '湖南禾福文化科技有限公司“薪火芳华”团队基于全场景AI框架昇思MindSpore，自行研发基于知识图谱和大模型…',
    image: case1,
    url: '/humanity/AIGC',
  },
  {
    id: 2,
    type: '玉知-悟空图文理解大模型',
    name: '作为国内专业从事游戏与泛娱乐AI研究和应用的顶尖机构，网易伏羲于2021年起着力打造“玉知”多模态理解大…',
    image: case2,
    url: '/humanity/yuzhi',
  },
  {
    id: 3,
    type: '手语教考一体机',
    name: 'AI破解手语难题，用科技连接孤岛，拨亮人文关怀的灯盏',
    image: case3,
    url: '/humanity/sign-language',
  },
];

function goCasePath(item) {
  router.push(item.url);
}
</script>
<template>
  <div class="humanity">
    <div class="humanity-head">
      <!-- <img :src="estateBanner" alt="" /> -->
      <div class="humanity-banner">
        <div class="banner-title">昇思大模型平台助力产业发展</div>
        <div class="banner-desc">
          昇思MindSpore广泛应用在互联网、零售、电力、工业、医疗、安防监控、物流等行业场景中
        </div>
      </div>
    </div>
    <div class="humanity-wrapper">
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
.humanity {
  background-color: #f5f6f8;
  padding-bottom: 64px;
  .humanity-head {
    padding-top: 80px;
    position: relative;
    background-image: url('@/assets/imgs/estate/estate-banner.jpg');
    background-size: cover;
    background-position: 50% 50%;
    img {
      width: 100%;
      height: 100%;
    }
    .humanity-banner {
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
  .humanity-wrapper {
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
