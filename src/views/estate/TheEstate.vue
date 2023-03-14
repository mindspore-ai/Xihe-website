<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import estateBanner from '@/assets/imgs/estate/estate-banner.png';
import defectDetecting from '@/assets/imgs/estate/defect-detecting.png';
import anomalyDetection from '@/assets/imgs/estate/anomaly-detection.png';

import IconElectricity from '~icons/app/electricity';
import IconFinance from '~icons/app/finance';
import IconMedicine from '~icons/app/medicine';
import IconIndustry from '~icons/app/industry';

const router = useRouter();

const sections = [
  {
    id: 0,
    name: '电力专区',
    path: '/estate/electric',
    routeName: 'electricPower',
    icon: IconElectricity,
  },
  {
    id: 1,
    name: '金融专区',
    path: '/estate/finance',
    routeName: 'finance',
    icon: IconFinance,
  },
  {
    id: 2,
    name: '医疗专区',
    path: '/estate/medical',
    routeName: 'medicalTreatment',
    icon: IconMedicine,
  },
  {
    id: 3,
    name: '工业专区',
    path: '/estate/industrial-zone',
    routeName: 'industrialZone',
    icon: IconIndustry,
  },
];
const handleClick = (tab) => {
  router.push(sections[tab.index].path);
};
</script>
<template>
  <div class="estate">
    <div class="estate-head">
      <img :src="estateBanner" alt="" />
      <div class="estate-banner"></div>
    </div>
    <div class="estate-wrap">
      <el-tabs class="estate-tabs" @tab-click="handleClick">
        <el-tab-pane v-for="item in sections" :key="item.id">
          <template #label>
            <span class="estate-tabs-title">
              <o-icon><component :is="item.icon"></component></o-icon>
              <span class="electricity">{{ item.name }}</span>
            </span>
          </template>
          <div class="electricity-wrap">
            <router-view></router-view>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$theme: #0d8dff;

.estate {
  min-height: calc(100vh - 200px);
  background-color: #f5f6f8;
  .estate-head {
    width: 100%;
    height: 560px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .estate-wrap {
    margin: 0 auto;
    padding: 0px 16px 0px 16px;
    max-width: 1472px;
    .electricity-wrap {
      // margin-top: -25px;
      .application-case {
        .case-title {
          height: 48px;
          line-height: 48px;
          font-size: 36px;
          color: #000;
          margin-bottom: 40px;
          text-align: center;
        }
        .case-content {
          display: flex;
          justify-content: space-between;
          .defect-detecting,
          .anomaly-detection {
            width: 696px;
            height: 400px;
            cursor: pointer;
            img {
              width: 100%;
            }
          }
        }
      }
    }
    .finance-wrap,
    .medicine-wrap,
    .industry-wrap {
      text-align: center;
      line-height: 48px;
      font-size: 36px;
      color: #000000;
    }
  }
}
:deep(.el-tabs) {
  width: 100%;
  position: relative;
  top: -64px;
  .el-tabs__header {
    margin: 0px;
    // position: relative;
    // top: -64px;
    .el-tabs__nav-wrap {
      border-radius: 16px;
      backdrop-filter: blur(10px);
      .el-tabs__nav {
        width: 100%;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
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
          // backdrop-filter: blur(10px);
          .estate-tabs-title {
            display: flex;
            align-items: center;
            height: 48px;
            .o-icon {
              font-size: 48px;
            }
            .electricity,
            .finance,
            .medicine,
            .industry {
              margin-left: 24px;
            }
          }
        }
        .is-active {
          background: rgba(13, 141, 255, 0.65);
          color: #ffffff;
        }
      }
      &::after {
        display: none;
      }
    }
  }
}
</style>
