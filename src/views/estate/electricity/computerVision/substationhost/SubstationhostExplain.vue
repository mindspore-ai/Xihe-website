<script setup>
import backgroundImg from '@/assets/imgs/estate/electricity/substationhost/host-background.png';
import backgroundImg2 from '@/assets/imgs/estate/electricity/substationhost/host-background2.png';
import introImg from '@/assets/imgs/estate/electricity/substationhost/host-intro.png';
import introImg2 from '@/assets/imgs/estate/electricity/substationhost/host-intro2.png';
import painspotImg from '@/assets/imgs/estate/electricity/substationhost/host-painspot.png';

import useWindowResize from '@/shared/hooks/useWindowResize.js';
const screenWidth = useWindowResize();
</script>
<template>
  <div class="project-explain">
    <div class="explain-title">项目说明</div>
    <div class="case-background">
      <div class="title">案例背景</div>
      <div class="description">
        <div>
          为提升变电站智能化巡检水平，提高巡检工作效率，针对现存视频巡检、机器人巡视、无人机巡检等方式存在相对独立，巡视点位覆盖率较低，巡视结果汇聚工作量大，海量缺陷判别依靠人工经验等问题，电力公司围绕生产业务创新以及“国产化”要求，制定巡检智能化标准，要求建设以图像识别为核心的变电站远程巡视系统。
        </div>
        <div class="case-img">
          <img v-if="screenWidth > 820" :src="backgroundImg" alt="" />
          <img v-else class="background-img" :src="backgroundImg2" alt="" />
        </div>
      </div>
    </div>
    <div class="case-intro">
      <div class="title">案例简介</div>
      <div class="subtitle">华为&江苏润和变电站AI分析主机联合解决方案</div>
      <div class="description">
        <div class="case-img">
          <img
            v-if="screenWidth > 820"
            class="intro-img"
            :src="introImg"
            alt=""
          />
          <img v-else class="intro-img" :src="introImg2" alt="" />
        </div>
        <div>
          变电站AI分析主机内置设备缺陷识别、设备状态判别、安全管控、环境状态感知等多类模型，可以对变电站内设备、环境状态、作业安全进行自动诊断和预警，实现“智能巡检”。变电站AI分析主机产品应用能够大幅降低运维人员日常工作，有力提升变电站巡视效率和监控强度，提升缺陷的应急响应速度，缩短缺陷的处理时间。数据显示，应用变电电站AI分析主机对某220kV变电站4000+点位巡检，单次巡检只要30+分钟，小于巡检规范要求的2小时，效能提升70%，利用AI分析主机能够提升巡检频次，在节约成本的同时确保缺陷及时发现、及时处理，保障电网安全稳定运行。
        </div>
      </div>
    </div>
    <div class="case-painspot">
      <div class="title">案例痛点</div>
      <div class="description">
        <p>
          变电站环境复杂、设备多样、AI应用场景丰富多变，如果还是按照传统“项目制”赋能方式，每个模型都需要重复投入人力、物力、财力开发，研发流程难以复用，AI应用成本高，难以形成生产力。
        </p>
      </div>
    </div>
    <div class="case-advantage">
      <div class="title">案例优势</div>
      <div class="description">
        <p>
          变电站AI分析主机应用昇腾AI基础软硬件平台打造标准化、流程化的模型生产和应用流程，实现“数据-场景-算法”闭环快速迭代，支撑变电站智能巡检定制化需求快速落地。
        </p>
        <div class="case-img">
          <img class="painspot-img" :src="painspotImg" alt="" />
        </div>
        <p>
          该方案借助于昇思MindSpore完整的YOLOV3算法训练和部署流程，整个算法模型的开发周期比以前缩短3倍，大大降低算法开发难度和对算力资源的要求。
        </p>
      </div>
    </div>
    <div class="tips">
      温馨提示：当前仅开放体验版模型，未做调优，不可直接部署生产使用
    </div>
  </div>
</template>

<style lang="scss" scoped>
.project-explain {
  .explain-title {
    line-height: 22px;
    font-size: 24px;
    color: #000;
    margin-bottom: 24px;
  }
  .tips {
    font-size: 14px;
    color: #555;
    margin-top: 24px;
  }
  .case-background,
  .case-intro,
  .case-painspot,
  .case-advantage {
    margin-bottom: 40px;
    .title {
      line-height: 22px;
      font-size: 18px;
      color: #000;
      margin-bottom: 16px;
    }
    .subtitle {
      line-height: 22px;
      font-size: 16px;
      color: #000;
      margin-bottom: 16px;
    }
    .description {
      font-size: 14px;
      color: #555;
      line-height: 22px;
      .case-img {
        margin: 24px auto;
        background: #f5f9fb;
        display: flex;
        flex-direction: column;
        align-items: center;
        img {
          width: 100%;
        }
        .background-img {
          height: 423px;
        }
        .intro-img {
          height: 275px;
        }
      }
      .summary {
        margin-top: 24px;
      }
    }
  }
  .case-advantage {
    margin-bottom: 0px;
  }
  @media screen and (max-width: 820px) {
    .explain-title {
      font-size: 16px;
      line-height: 24px;
      margin-bottom: 16px;
    }
    .tips {
      font-size: 12px;
      margin-top: 16px;
    }
    .case-background,
    .case-intro,
    .case-painspot,
    .case-advantage {
      margin-bottom: 24px;
      .title {
        font-size: 14px;
        line-height: 22px;
        margin-bottom: 8px;
      }
      .subtitle {
        font-size: 12px;
        line-height: 18px;
        margin-bottom: 8px;
      }
      .description {
        font-size: 12px;
        line-height: 18px;
        .case-img {
          margin-top: 8px;
          margin-bottom: 8px;
          .painspot-img {
            background-color: red;
            width: 100%;
          }
        }
      }
    }
    .case-advantage {
      margin-bottom: 0px;
    }
  }
}
</style>
