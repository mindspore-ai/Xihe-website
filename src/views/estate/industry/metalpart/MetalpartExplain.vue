<script setup>
// import advantageImg from '@/assets/imgs/estate/electricity/substationops/ops-advantage.png';
</script>
<template>
  <div class="project-explain">
    <div class="explain-title">项目说明</div>
    <div class="case-background">
      <div class="title">案例背景</div>
      <div class="description">
        <div>
          金属零部件作为系统的关键连接件，由于生产技术的落后，在工业流水线加工和装配的过程中，其表面常常会出现划痕，污渍，裂纹等不同缺陷影响产品的美观，使用及安全，因此，对存在瑕疵的零部件需被准确并高效地检出，不可流入市场销售。
        </div>
      </div>
    </div>
    <div class="case-painspot">
      <div class="title">案例痛点</div>
      <div class="description">
        <div>
          金属零部件成品中存在多种多样的缺陷类型，目前各零件厂商仍普遍采用传统的人工目检方式。该方式工作量大，质检人员长时间重复作业容易产生疲劳发生错检、漏检的现象，直接影响产品质量及交付效率。
        </div>
      </div>
    </div>
    <div class="case-solution">
      <div class="title">解决方案</div>
      <div class="description">
        <div>
          由于人工质检的种种不足以及近年来人工智能技术的快速发展，华为提供了完整的视觉质检解决方案，基于机器视觉算法实现的零部件自动化质检已逐步取代传统的人工质检方式。操作人员不需要有算法背景即可通过AI开发与部署平台快速完成模型训练，得到高召回率的AI模型并投入实际业务应用中，基于该智能质检方案，企业能够在质检人力降低50%的情况下，实现99%以上的缺陷检出率，高速不间断地完成大批量零件缺陷检测。
        </div>
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
  .case-painspot,
  .case-painspot,
  .case-solution {
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
        margin-top: 24px;
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
  .case-solution {
    margin-bottom: 0px;
  }
}
</style>
