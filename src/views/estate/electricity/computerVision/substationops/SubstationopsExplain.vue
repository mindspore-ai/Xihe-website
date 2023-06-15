<script setup>
import advantageImg from '@/assets/imgs/estate/electricity/substationops/ops-advantage.png';
import advantageImg2 from '@/assets/imgs/estate/electricity/substationops/ops-advantage2.png';
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
          变电站是电力系统中的重要基础设施。伴随着电网的快速发展，用电量逐渐增大，电力设备运行环境日趋复杂，同时，为了满足对偏远地区的供电需求，许多变电站都架设在相对偏僻的位置，增加了设备安全方面的风险，加大了运维管理工作的难度。
        </div>
        <div>
          传统的变电站运维管理工作由总控室的运维管理人员负责看管整个供电网络，当出现问题时，需要技术人员进入变电站现场进行技术检测和维护，不仅存在时间上的延误，也产生了诸多现场工作的安全风险。
          智能化，是解决当前变电运维问题的关键手段。
        </div>
      </div>
    </div>
    <div class="case-intro">
      <div class="title">案例简介</div>
      <div class="description">
        <div>
          基于对变电站智能运维场景的深刻洞察，许继软件携手华为推出业内领先的变电站运维图像识别分析解决方案，并完成与全场景AI框架昇思MindSpore的兼容性测试。
        </div>
        <div>
          当前，许继变电站运维图像识别分析解决方案已与超200座牵引变电站辅控系统集成，推动变电站运维工作的无人化、智能化、信息化转变。
        </div>
      </div>
    </div>
    <div class="case-advantage">
      <div class="title">案例优势</div>
      <div class="description">
        <p>
          该方案通过昇思MindSpore
          AI框架实现算法服务的开发与部署，以图像识别算法作为服务层，通过统一接口规范接入变电站监测系统，或将服务封装以sdk形式部署于变电站终端设备，实现对人员和设备的管理：
        </p>
        <p>
          1、变电站设备智能巡检：通过24小时不间断的视频智能监测代替传统人工巡视方式，可同时对多个设备、多个位置进行在线分析，以智能化的设备状态分析方法代替繁琐重复的人工经验性判断，运维人员只需对设备状态识别结果进行复核和重点审查，大大提升设备监测效率，降低运维管理成本。
        </p>
        <p>
          2、变电站现场安全智能管理：通过摄像头对变电站运检人员进行实时监测，可快速准确判断出现场作业人员是否存在违章行为，当出现未带安全帽、未穿工装、吸烟等行为时，系统能够对这些违章行为进行捕捉，并立即予以警告，同时生成违章日志文件自动记录，有效提升人员作业安全意识，降低安全风险。
        </p>
        <div class="case-img">
          <img v-if="screenWidth > 820" :src="advantageImg" alt="" />
          <img v-else class="advantage-img" :src="advantageImg2" alt="" />
        </div>
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
  .case-painspot,
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
        .advantage-img {
          height: 180px;
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
    .case-painspot,
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
