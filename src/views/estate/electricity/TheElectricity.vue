<script setup>
import { ref } from 'vue';
// import { useRouter } from 'vue-router';

import estateBanner from '@/assets/imgs/estate/estate-banner.jpg';

import IconElectricity from '~icons/app/electricity';
import IconHumanity from '~icons/app/humanity';
import IconMedicine from '~icons/app/medicine';
import IconIndustry from '~icons/app/industry';

import computerVision from '@/views/estate/electricity/computerVision/TheComputerVision.vue';
import naturalLanguage from '@/views/estate/electricity/naturalLanguage/TheNaturalLanguage.vue';
import voice from '@/views/estate/electricity/voice/TheVoice.vue';
import neuralNetwork from '@/views/estate/electricity/neuralNetwork/neuralNetwork.vue';

const activeName = ref('计算机视觉');

const electricityClassify = [
  {
    id: 0,
    name: '计算机视觉',
    path: '/estate/electricity',
    // path: '/estate/industrial-zone',
    currentComponent: computerVision,
    icon: IconElectricity,
  },
  {
    id: 1,
    name: '自然语言处理',
    path: '/estate/medicine',
    currentComponent: naturalLanguage,
    icon: IconMedicine,
  },
  {
    id: 2,
    name: '语音',
    path: '/estate/industry',
    currentComponent: voice,
    icon: IconIndustry,
  },
  {
    id: 3,
    name: '图神经网络',
    path: '/estate/humanity',
    currentComponent: neuralNetwork,
    icon: IconHumanity,
    disabled: false,
  },
];

const handleClick = (tab) => {
  console.log('tab: ', tab);
  // activeName.value = tab.paneName;
  // router.push(electricityClassify[tab.index].path);
};
</script>
<template>
  <div class="electricity">
    <div class="electricity-head">
      <img :src="estateBanner" alt="" />
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
  </div>
</template>
<style lang="scss" scoped>
.electricity {
  background-color: #f5f6f8;
  // padding-bottom: 64px;
  .electricity-head {
    width: 100%;
    height: 560px;
    position: relative;
    img {
      width: 100%;
      height: 100%;
    }
    .electricity-banner {
      max-width: 1472px;
      margin: 0 auto;
      padding: 0px 16px;
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
  }
}
:deep(.estate-tabs) {
  position: relative;
  top: -64px;
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
