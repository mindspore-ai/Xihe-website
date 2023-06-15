<script setup>
import { ref, watch } from 'vue';

import IconCV from '~icons/app/CV';
import IconNLP from '~icons/app/NLP';
import IconAudio from '~icons/app/Audio';
import IconGNN from '~icons/app/GNN';

import computerVision from '@/views/estate/electricity/computerVision/TheComputerVision.vue';
import naturalLanguage from '@/views/estate/electricity/naturalLanguage/TheNaturalLanguage.vue';
import voice from '@/views/estate/electricity/voice/TheVoice.vue';
import neuralNetwork from '@/views/estate/electricity/neuralNetwork/neuralNetwork.vue';

import { ElMessage } from 'element-plus';
import { getElectricitydata } from '@/api/api-estate';

import useWindowResize from '@/shared/hooks/useWindowResize.js';

import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay, FreeMode } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/free-mode';
// 合作伙伴图片
import logo1 from '@/assets/imgs/estate/logo/logo1.png';
import logo2 from '@/assets/imgs/estate/logo/logo2.png';
import logo3 from '@/assets/imgs/estate/logo/logo3.png';
import logo4 from '@/assets/imgs/estate/logo/logo4.png';
import logo5 from '@/assets/imgs/estate/logo/logo5.png';
import logo6 from '@/assets/imgs/estate/logo/logo6.png';
import logo7 from '@/assets/imgs/estate/logo/logo7.png';
import logo8 from '@/assets/imgs/estate/logo/logo8.png';
import logo9 from '@/assets/imgs/estate/logo/logo9.png';
import logo10 from '@/assets/imgs/estate/logo/logo10.png';
import logo11 from '@/assets/imgs/estate/logo/logo11.png';
import logo12 from '@/assets/imgs/estate/logo/logo12.png';
import logo13 from '@/assets/imgs/estate/logo/logo13.png';
import logo14 from '@/assets/imgs/estate/logo/logo14.png';
import logo15 from '@/assets/imgs/estate/logo/logo15.png';
import logo16 from '@/assets/imgs/estate/logo/logo16.png';
import logo17 from '@/assets/imgs/estate/logo/logo17.png';
import logo18 from '@/assets/imgs/estate/logo/logo18.png';
import logo19 from '@/assets/imgs/estate/logo/logo19.png';
import logo20 from '@/assets/imgs/estate/logo/logo20.png';
import logo21 from '@/assets/imgs/estate/logo/logo21.png';
import logo22 from '@/assets/imgs/estate/logo/logo22.png';
import logo23 from '@/assets/imgs/estate/logo/logo23.png';
import logo24 from '@/assets/imgs/estate/logo/logo24.png';
import logo25 from '@/assets/imgs/estate/logo/logo25.png';
import logo26 from '@/assets/imgs/estate/logo/logo26.png';
import logo27 from '@/assets/imgs/estate/logo/logo27.png';
import logo28 from '@/assets/imgs/estate/logo/logo28.png';
import logo29 from '@/assets/imgs/estate/logo/logo29.png';
import logo30 from '@/assets/imgs/estate/logo/logo30.png';
import logo31 from '@/assets/imgs/estate/logo/logo31.png';
import logo32 from '@/assets/imgs/estate/logo/logo32.png';

const logoModules = [FreeMode, Autoplay];
const activeName = ref('计算机视觉CV');
const modelData = ref([]); // 应用模型
const datasetData = ref([]); // 应用数据集
const tagKinds = ref('CV');
const screenWidth = useWindowResize();

const electricityClassify = [
  {
    id: 1,
    name: '计算机视觉CV',
    mobileName: 'CV',
    path: '/estate/electricity',
    currentComponent: computerVision,
    icon: IconCV,
  },
  {
    id: 2,
    name: '自然语言处理NLP',
    mobileName: 'NLP',
    path: '/estate/medicine',
    currentComponent: naturalLanguage,
    icon: IconNLP,
  },
  {
    id: 3,
    name: '语音Audio',
    mobileName: 'Audio',
    path: '/estate/industry',
    currentComponent: voice,
    icon: IconAudio,
  },
  {
    id: 4,
    name: '图神经网络GNN',
    mobileName: 'GNN',
    path: '/estate/humanity',
    currentComponent: neuralNetwork,
    icon: IconGNN,
  },
];

const handleClick = (tab) => {
  if (tab.paneName === '计算机视觉CV') {
    tagKinds.value = 'CV';
  }
};

const beforeLeave = (activeTab) => {
  if (
    activeTab === '语音Audio' ||
    activeTab === '图神经网络GNN' ||
    activeTab === '自然语言处理NLP'
  ) {
    ElMessage({
      type: 'warning',
      message: '暂未开放，敬请期待！',
      duration: 3000,
      offset: 64,
      center: true,
    });
    return false;
  }
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
  logo32,
  logo12,
  logo13,
  logo14,
  logo15,
  logo16,
  logo17,
  logo18,
  logo19,
  logo20,
  logo21,
  logo22,
  logo23,
  logo24,
  logo25,
  logo26,
  logo27,
  logo28,
  logo29,
  logo30,
  logo31,
];
// 获取电力主页数据

async function getElectricityInfor(kinds) {
  const res = await getElectricitydata(kinds);
  res.data.model.projects
    ? (modelData.value = res.data.model.projects)
    : (modelData.value = []);
  res.data.dataset.projects
    ? (datasetData.value = res.data.dataset.projects)
    : (datasetData.value = []);
}
getElectricityInfor(tagKinds.value);
watch(tagKinds, (newValue) => {
  getElectricityInfor(newValue);
});
</script>
<template>
  <div v-if="modelData.length" class="electricity">
    <div class="electricity-head">
      <div class="electricity-banner">
        <div class="banner-title">电力人工智能专区</div>
        <div class="banner-desc">
          汇集大量电力行业案例，开放特色电力数据集与模型，发布学习实践课程，比赛与活动，用
          “ AI ” 电亮未来，为 “ 电力 ” 插上数智化双翼。
        </div>
      </div>
    </div>
    <div class="electricity-wrap">
      <el-tabs
        v-model="activeName"
        class="estate-tabs"
        :before-leave="beforeLeave"
        @tab-click="handleClick"
      >
        <el-tab-pane
          v-for="item in electricityClassify"
          :key="item.id"
          :name="item.name"
        >
          <template v-if="screenWidth > 820" #label>
            <span class="estate-tabs-title">
              <o-icon><component :is="item.icon"></component></o-icon>
              <span class="region-name">{{ item.name }}</span>
            </span>
          </template>
          <template v-else #label>
            <span class="estate-tabs-title">
              <span class="region-name">{{ item.mobileName }}</span>
            </span>
          </template>
          <div
            v-if="modelData.length || datasetData.length"
            class="electricity-content"
          >
            <component
              :is="item.currentComponent"
              :model-data="modelData"
              :dataset-data="datasetData"
            ></component>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="logo">
      <p class="title">合作伙伴</p>
      <!-- <div class="logo-img">
        <div v-for="(item, index) in logoPic" :key="index" class="img">
          <img :src="item" alt="" />
        </div>
      </div> -->
      <swiper
        :speed="8000"
        :free-mode="true"
        :modules="logoModules"
        slides-per-view="auto"
        loop
        :autoplay="{ autoplay: true, delay: 0 }"
        :no-swiping="true"
        class="logo-swiper"
      >
        <swiper-slide
          v-for="item in logoPic.slice(0, 11)"
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
          v-for="item in logoPic.slice(11, 32)"
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
  background-image: url('@/assets/imgs/estate/electricity/electric-travel.jpg');
  background-repeat: no-repeat;
  background-size: 100% 664px;
  background-position: 0 1984px;
  @media screen and (max-width: 820px) {
    background-image: none;
    // background-image: url('@/assets/imgs/estate/electricity-mobile.jpg');
    // background-repeat: no-repeat;
    // background-size: 100% 664px;TODO:
    // background-position: 0 1984px;
  }
  .electricity-head {
    padding-top: 80px;
    position: relative;
    background-image: url('@/assets/imgs/estate/electricity-banner.png');
    background-size: cover;
    background-position: 50% 50%;
    @media screen and (max-width: 820px) {
      padding-top: 48px;
      background-image: url('@/assets/imgs/estate/electricity-mobile.jpg');
      background-size: cover;
      background-position: center;
    }
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
      @media screen and (max-width: 820px) {
        padding: 44px 24px;
      }
      .banner-title {
        line-height: 48px;
        font-size: 36px;
        font-weight: 400;
        color: #000000;
        margin-bottom: 10px;
        @media screen and (max-width: 820px) {
          height: 28px;
          font-size: 20px;
          line-height: 28px;
        }
      }
      .banner-desc {
        max-width: 58%;
        line-height: 24px;
        font-size: 18px;
        font-weight: 400;
        color: #000000;
        @media screen and (max-width: 820px) {
          max-width: 80%;
          line-height: 18px;
          font-size: 12px;
        }
      }
    }
  }
  .electricity-wrap {
    margin: 0 auto;
    max-width: 1472px;
    position: relative;
    top: -64px;
    @media screen and (max-width: 820px) {
      top: 0;
    }
    .electricity-content {
      margin-top: 40px;
      @media screen and (max-width: 820px) {
        margin-top: 24px;
      }
    }
  }
  .logo {
    padding: 0 0 52px;
    @media screen and (max-width: 820px) {
      padding: 0 0 36px;
      margin-top: 40px;
    }
    .title {
      height: 48px;
      line-height: 48px;
      font-size: 36px;
      color: #000000;
      margin-bottom: 26px;
      text-align: center;
      @media screen and (max-width: 820px) {
        height: 24px;
        font-size: 16px;
        line-height: 24px;
        margin-bottom: 12px;
      }
    }
    :deep(.logo-swiper) {
      .swiper-slide {
        width: 354px;
        height: 120px;
        background-color: #fff;
        margin: 12px 12px;
        border-radius: 16px;
        @media screen and (max-width: 820px) {
          width: 142px;
          height: 60px;
          margin: 4px 4px;
          border-radius: 10px;
        }
      }
      img {
        width: 100%;
        height: 120px;
        border-radius: 16px;
        @media screen and (max-width: 820px) {
          height: 60px;
        }
      }
    }
  }
}
:deep(.estate-tabs) {
  .el-tabs__header {
    margin: 0px;
    padding: 0px 16px;

    @media screen and (max-width: 820px) {
      padding: 0px;
    }
    .el-tabs__nav-wrap {
      border-radius: 16px;
      backdrop-filter: blur(10px);
      background: rgba(255, 255, 255, 0.75);
      margin: 0 auto;
      @media screen and (max-width: 820px) {
        border-radius: 0px;
        display: flex;
        justify-content: center;
      }
      .el-tabs__nav {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        @media screen and (max-width: 820px) {
          display: flex;
        }
        .el-tabs__active-bar {
          display: none;
        }
        .el-tabs__item {
          height: 128px;
          font-size: 24px;
          color: #555;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0;

          @media screen and (max-width: 820px) {
            box-sizing: border-box;
            height: 35px;
            font-size: 14px;
            padding: 0px 6px;
            margin: 0px 8px;
          }
          &:nth-child(2) {
            @media screen and (max-width: 820px) {
              margin-left: 0px;
            }
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
            @media screen and (max-width: 820px) {
              height: 34px;
              line-height: 34px;
              border-left: none;
            }
            .o-icon {
              font-size: 48px;
            }
            .region-name {
              height: 100%;
              margin-left: 24px;
              @media screen and (max-width: 820px) {
                margin-left: 0px;
              }
            }
          }
        }
        .is-active {
          background: rgba(13, 141, 255, 0.65);
          color: #ffffff;
          @media screen and (max-width: 820px) {
            background: transparent;
            color: #0d8dff;
            border-bottom: 1px solid #0d8dff;
            border-radius: 0px;
          }
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
:deep(.swiper-free-mode) {
  .swiper-wrapper {
    -webkit-transition-timing-function: linear; /*之前是ease-out*/
    -moz-transition-timing-function: linear;
    -ms-transition-timing-function: linear;
    -o-transition-timing-function: linear;
    transition-timing-function: linear;
    margin: 0 auto;
  }
}
</style>
