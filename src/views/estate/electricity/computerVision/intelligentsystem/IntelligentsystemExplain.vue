<script setup>
import introImg from '@/assets/imgs/estate/electricity/intelligentsystem/system-intro.png';
import introImg2 from '@/assets/imgs/estate/electricity/intelligentsystem/system-intro2.png';
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
          电力安全隐患是指电力设备在运行中可能出现的安全问题，这些问题可能会造成严重的经济或社会影响。为了强化电力安全隐患排查治理和监督管理有关工作，有效防范遏制电力事故事件发生。
        </div>
      </div>
    </div>
    <div class="case-intro">
      <div class="title">案例简介</div>
      <div class="description">
        <div>
          电力隐患检测是指对电力设备进行定期检查或试验，以发现运行中电力设备的隐患、预防发生事故或电力设备损坏。这些检查或试验需要按照规定的试验条件（如规定的试验设备、环境条件、试验方法和试验电压等）、试验项目、试验周期进行。
        </div>
        <div class="case-img">
          <img v-if="screenWidth > 820" :src="introImg" alt="" />
          <img v-else class="intro-img" :src="introImg2" alt="" />
        </div>
      </div>
    </div>
    <div class="case-solution">
      <div class="title">解决方案</div>
      <div class="description">
        <p>
          采用无人机电力巡检对关键线路进行安全隐患检测，无人机电力检测是指使用无人机对电网设施和环境进行自动化、精细化巡检，以降低工作出错率与风险，大幅提升效率。无人机可以搭载多种传感器的任务设备，主要完成激光点云以及可见光、红外、紫外影像数据的获取。这样可以迅速定位故障，及时排除故障，大大降低工作出错率与风险，大幅度提升电网巡检效率。
        </p>
      </div>
    </div>
    <div class="case-advantage">
      <div class="title">案例优势</div>
      <div class="description">
        <p>
          无人机电力巡检有很多优势。它能够快速准确地了解故障情况，有效提高应急时间内的效率，为紧急抢修电塔、电线争取有效时间，进而降低因为高额停电所造成的损失。此外，无人机电力巡检可以防止意外发生，减少工作人员以身涉险的状况。
        </p>
      </div>
    </div>
    <div class="tips">
      友情提示：当前仅开放体验版模型，未做调优，不可直接部署生产使用
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
  .case-solution,
  .case-advantage {
    margin-bottom: 40px;
    .title {
      line-height: 22px;
      font-size: 18px;
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
        .intro-img {
          height: 176px;
        }
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
    .case-solution,
    .case-advantage {
      margin-bottom: 24px;
      .title {
        font-size: 14px;
        line-height: 22px;
        margin-bottom: 8px;
      }
      .description {
        font-size: 12px;
        line-height: 18px;
        .case-img {
          margin-top: 8px;
          margin-bottom: 8px;
        }
      }
    }
    .case-advantage {
      margin-bottom: 0px;
    }
  }
}
</style>
