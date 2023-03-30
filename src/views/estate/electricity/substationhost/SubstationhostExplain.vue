<script setup>
import backgroundImg from '@/assets/imgs/estate/electricity/substationhost/host-background.png';
import introImg from '@/assets/imgs/estate/electricity/substationhost/host-intro.png';
import painspotImg from '@/assets/imgs/estate/electricity/substationhost/host-painspot.png';
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
          <img :src="backgroundImg" alt="" />
        </div>
        <div>
          早期子宫内膜在筛查的研究主要集中在微创的组织病理学和细胞病理学方向。
          子宫内膜细胞学检查(ECT)已在许多国家开展，包括意大利、美国和日本。
          子宫内膜细胞学检查（ECT）于1987年被列入日本《老年人保健法》。
          日本高危妇女的子宫内膜癌（EC）死亡率从1950年的20%下降到1999年的8%。
          近20年来，不同地区的学者提出了对子宫内膜采样器的发明和改进，并提出了子宫内膜细胞病理学诊断系统。大量子宫内膜细胞病理切片需要诊断，从而暴露出病理学家的匮乏。
        </div>
        <div>
          随着医学成像技术的发展，医学图像数量正在以指数增加。医学图像的诊断与分析在过去通常由医学专业人员执行，专业人员数量的匮乏以及他们有限的精力与不可避免的主观性，限制了临床诊断和后续治疗的效率深度学习算法，特别是卷积神经网络（CNN），已迅速成为分析医学图像的首选方法。
        </div>
      </div>
    </div>
    <div class="case-intro">
      <div class="title">案例简介</div>
      <div class="subtitle">华为&江苏润和变电站AI分析主机联合解决方案</div>
      <div class="description">
        <div class="case-img">
          <img :src="introImg" alt="" />
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
        <div class="case-img">
          <img :src="painspotImg" alt="" />
        </div>
        <p>
          该方案借助于昇思MindSpore完整的YOLOV3算法训练和部署流程，整个算法模型的开发周期比以前缩短3倍，大大降低算法开发难度和对算力资源的要求。
        </p>
      </div>
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

  .case-background,
  .case-intro,
  .case-painspot {
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
        // padding: 24px 0;
        background: #f5f9fb;
        display: flex;
        flex-direction: column;
        align-items: center;
        img {
          width: 100%;
        }
        .solution-img {
          margin-top: 24px;
        }
      }
      .summary {
        margin-top: 24px;
      }
    }
  }
}
</style>
