<script setup>
import introImg1 from '@/assets/imgs/estate/industry/intelligence/intelligence-intro1.png';
import introImg2 from '@/assets/imgs/estate/industry/intelligence/intelligence-intro2.png';
import introImg3 from '@/assets/imgs/estate/industry/intelligence/intelligence-intro3.png';
import advantageImg from '@/assets/imgs/estate/industry/intelligence/intelligence-advantage.png';
</script>
<template>
  <div class="project-explain">
    <div class="explain-title">项目说明</div>
    <div class="case-background">
      <div class="title">案例背景</div>
      <div class="description">
        <div>
          人工智能作为新一轮科技革命和产业变革的重要驱动力，近年来得到快速发展，在智转数改的浪潮中，正日益成为产业智能化升级的强力助推器。
        </div>
        <div>
          伴随数字化转型升级的不断深入，对视频+AI
          的强烈渴求正呈爆发式增长，与之相对的也产生了巨大的市场潜力待挖掘。
        </div>
      </div>
    </div>
    <div class="case-intro">
      <div class="title">案例简介</div>
      <div class="description">
        <div>
          奥看科技与华为携手，推出行业首个低码智能视频使能平台，并聚焦全场景“大安全”打造了城市治理“一网统管”、工业安全生产等多个AI解决方案，帮助客户解决在复杂视频资源中的管理及使用难题，用人工智能技术全面释放视频新价值。
        </div>
        <div class="case-img">
          <img :src="introImg1" alt="" />
        </div>
        <div>
          奥看科技基于AI应用场景，打造“广东移动千里眼平台平台”、“某头部能源企业灯塔工厂项目”、“常德城市视频云平台”、“新余钢铁智慧工厂”、等智慧解决方案，赋能工业安全生产等多场景下的创新应用。
        </div>
        <div>
          炬瞳安全生产AI应用平台是奥看科技面向工业安全生产场景打造的行业级轻量化应用平台，它围绕工业安全生产领域内业务层的各场景痛点需求，基于昇腾Atlas全栈算力，形成通用AI能力引擎，将场景化AI算法与华为AI计算框架的全场景适配，云边端深度融合，支持不同规模的项目部署。
        </div>
        <div class="case-img">
          <img :src="introImg2" alt="" />
        </div>
        <div>
          奥看科技基于昇思MindSpore全场景AI框架打造“智慧安全生产管控平台”，从企业安全的角度出发，融合智能生产AI模型，提升安全管理效能，实现企业安全生产一体化管控。从工业安全生产的痛点场景切入，基于昇腾AI，聚焦全场景“大安全”，已在新余钢铁、蜂巢能源等多个工业场景中打造出了安全生产解决方案，并联合客户形成行业推广，全面护航工业制造和业务环境的稳定运行，赋能工业安全数字化转型。
        </div>
        <div class="case-img">
          <img :src="introImg3" alt="" />
        </div>
      </div>
    </div>
    <div class="case-advantage">
      <div class="title">案例优势</div>
      <div class="description">
        <div>
          针对工业企业的安全现状，基于昇腾AI，公司携手华为打造了从算法到算力再到数据的全栈协同的云边一体化解决方案，能够满足工业制造的多种场景，同时AIBOX的算法也能覆盖工业制造企业安全管控的一些通用场景。同时，奥看科技携手昇思MindSpore持续优化升级炬瞳安全生产AI应用平台，发挥工业场景中的海量视频资源，以AI技术为核心，赋能工业安全生产全流程，助力实现智防、精治、联管的工业安全生产管理体系。
        </div>
        <div class="case-img">
          <img :src="advantageImg" alt="" />
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
    }
  }
  .case-advantage {
    margin-bottom: 0px;
    .description {
      .case-img {
        margin-bottom: 0px;
      }
    }
  }
  @media screen and (max-width: 820px) {
    .explain-title {
      font-size: 16px;
      line-height: 24px;
      margin-bottom: 16px;
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
        }
      }
    }
    .case-advantage {
      margin-bottom: 0px;
    }
  }
}
</style>
