<script setup>
import { ref } from 'vue';
// import { useRouter } from 'vue-router';

import estateBanner from '@/assets/imgs/estate/estate-banner.png';

import IconCV from '~icons/app/CV';
import IconNLP from '~icons/app/NLP';
import IconAudio from '~icons/app/Audio';
import IconGNN from '~icons/app/GNN';

import computerVision from '@/views/estate/electricity/computerVision/TheComputerVision.vue';
import naturalLanguage from '@/views/estate/electricity/naturalLanguage/TheNaturalLanguage.vue';
import voice from '@/views/estate/electricity/voice/TheVoice.vue';
import neuralNetwork from '@/views/estate/electricity/neuralNetwork/neuralNetwork.vue';

import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination, Autoplay, FreeMode } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/free-mode';
// 合作伙伴图片
import logo1 from '@/assets/imgs/home1/logo/logo1.png';
import logo2 from '@/assets/imgs/home1/logo/logo2.png';
import logo3 from '@/assets/imgs/home1/logo/logo3.png';
import logo4 from '@/assets/imgs/home1/logo/logo4.png';
import logo5 from '@/assets/imgs/home1/logo/logo5.png';
import logo6 from '@/assets/imgs/home1/logo/logo6.png';
import logo7 from '@/assets/imgs/home1/logo/logo7.png';
import logo8 from '@/assets/imgs/home1/logo/logo8.png';
import logo9 from '@/assets/imgs/home1/logo/logo9.png';
import logo10 from '@/assets/imgs/home1/logo/logo10.png';
import logo11 from '@/assets/imgs/home1/logo/logo11.png';
import logo12 from '@/assets/imgs/home1/logo/logo12.png';
import logo13 from '@/assets/imgs/home1/logo/logo13.png';
import logo14 from '@/assets/imgs/home1/logo/logo14.png';
import logo15 from '@/assets/imgs/home1/logo/logo15.png';
import logo16 from '@/assets/imgs/home1/logo/logo16.png';
import logo17 from '@/assets/imgs/home1/logo/logo17.png';

const logoModules = [FreeMode, Autoplay];
const activeName = ref('计算机视觉CV');

const electricityClassify = [
  {
    id: 1,
    name: '计算机视觉CV',
    path: '/estate/electricity',
    // path: '/estate/industrial-zone',
    currentComponent: computerVision,
    icon: IconCV,
  },
  {
    id: 2,
    name: '自然语言处理NLP',
    path: '/estate/medicine',
    currentComponent: naturalLanguage,
    icon: IconNLP,
    disabled: true,
  },
  {
    id: 3,
    name: '语音Audio',
    path: '/estate/industry',
    currentComponent: voice,
    icon: IconAudio,
    disabled: true,
  },
  {
    id: 4,
    name: '图神经网络GNN',
    path: '/estate/humanity',
    currentComponent: neuralNetwork,
    icon: IconGNN,
    disabled: true,
  },
];

const handleClick = (tab) => {
  console.log('tab: ', tab);
  // activeName.value = tab.paneName;
  // router.push(electricityClassify[tab.index].path);
};

// 合作伙伴
const logoPic = [
  logo1,
  logo2,
  logo3,
  logo4,
  logo5,
  logo6,
  logo7,
  logo8,
  logo9,
  logo10,
  logo11,
  logo12,
  logo13,
  logo14,
  logo15,
  logo16,
  logo17,
];
</script>
<template>
  <div class="electricity">
    <div class="electricity-head">
      <!-- <img :src="estateBanner" alt="" /> -->
      <div class="electricity-banner">
        <div class="banner-title">AI+电力行业生产力平台</div>
        <div class="banner-desc">
          <span>
            昇思赋能电力行业，覆盖从AI生产（输出算法模型）到应用（实现算法工程化封装）各环节，有效解决AI+电力研发门槛高、成本高和效率低的问题。 </span
          ><br />
          <span>
            提供算法的训练、推理和部署能力；具备算力的共享、调度和分布式能力；拥有全面的数据处理、管理和安全能力。
          </span>
        </div>
      </div>
    </div>
    <div class="electricity-wrap">
      <el-tabs
        v-model="activeName"
        class="estate-tabs"
        @tab-click="handleClick"
      >
        <el-tab-pane
          v-for="item in electricityClassify"
          :key="item.id"
          :name="item.name"
          :disabled="item.disabled"
        >
          <template #label>
            <span class="estate-tabs-title">
              <o-icon><component :is="item.icon"></component></o-icon>
              <span class="region-name">{{ item.name }}</span>
            </span>
          </template>
          <div class="electricity-content">
            <component :is="item.currentComponent"></component>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="logo">
      <p class="title">合作伙伴</p>
      <swiper
        :speed="8000"
        :free-mode="true"
        :modules="logoModules"
        slides-per-view="auto"
        :autoplay="{ autoplay: true, delay: 0 }"
        loop
        :no-swiping="true"
        class="logo-swiper"
      >
        <swiper-slide
          v-for="item in logoPic.slice(0, 9)"
          :key="item"
          class="swiper-no-swiping"
        >
          <img :src="item" />
        </swiper-slide>
      </swiper>
      <swiper
        :speed="8000"
        :free-mode="true"
        slides-per-view="auto"
        :modules="logoModules"
        :autoplay="{ autoplay: true, delay: 0, reverseDirection: true }"
        loop
        :no-swiping="true"
        class="logo-swiper"
      >
        <swiper-slide
          v-for="item in logoPic.slice(9, 18)"
          :key="item"
          class="swiper-no-swiping"
        >
          <img :src="item" />
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.electricity {
  background-color: #f5f6f8;
  // padding-bottom: 64px;
  background-image: url('@/assets/imgs/estate/electricity/electric-travel.jpg');
  background-repeat: no-repeat;
  background-size: 100% 642px;
  background-position: 0 2288px;
  .electricity-head {
    padding-top: 80px;
    position: relative;
    background-image: url('@/assets/imgs/estate/estate-banner.png');
    background-size: cover;
    background-position: 50% 50%;
    img {
      width: 100%;
      height: 100%;
    }
    .electricity-banner {
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
        max-width: 58%;
        line-height: 24px;
        font-size: 18px;
        font-weight: 400;
        color: #000000;
      }
    }
  }
  .electricity-wrap {
    margin: 0 auto;
    max-width: 1472px;
    position: relative;
    top: -64px;
  }
  .logo {
    padding: 0 0 52px;
    @media screen and (max-width: 820px) {
      padding: 0 0 36px;
    }
    .title {
      height: 48px;
      line-height: 48px;
      font-size: 36px;
      color: #000000;
      margin-bottom: 26px;
      text-align: center;
      @media screen and (max-width: 820px) {
        margin-bottom: 12px;
      }
    }
    :deep(.logo-swiper) {
      .swiper-slide {
        height: 120px;
        width: auto !important;
        background-color: #fff;
        margin: 12px 12px;
        border-radius: 16px;
        @media screen and (max-width: 820px) {
          height: 60px;
          margin: 4px 4px;
          border-radius: 10px;
        }
      }
      img {
        height: 120px;
        @media screen and (max-width: 820px) {
          height: 60px;
        }
      }
    }
  }
}
:deep(.estate-tabs) {
  // position: relative;
  // top: -64px;
  .el-tabs__header {
    margin: 0px;
    padding: 0px 16px;
    .el-tabs__nav-wrap {
      border-radius: 16px;
      backdrop-filter: blur(10px);
      .el-tabs__nav {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        .el-tabs__active-bar {
          display: none;
        }
        .el-tabs__item {
          height: 128px;
          font-size: 24px;
          line-height: 33px;
          color: #555;
          background: rgba(255, 255, 255, 0.75);
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0;
          &:nth-child(2) {
            .estate-tabs-title {
              border-left: none;
            }
          }
          .estate-tabs-title {
            width: 100%;
            height: 48px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-left: 1px solid #e1e1e1;
            .o-icon {
              font-size: 48px;
            }
            .region-name {
              margin-left: 24px;
            }
          }
        }
        .is-active {
          background: rgba(13, 141, 255, 0.65);
          color: #ffffff;
          .estate-tabs-title {
            border-left: none;
          }
        }
      }
      &::after {
        display: none;
      }
    }
  }
}
</style>
