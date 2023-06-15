<script setup>
// import introImg from '@/assets/imgs/estate/electricity/intelligentsystem/system-intro.png';
</script>
<template>
  <div class="project-explain">
    <div class="explain-title">项目说明</div>
    <div class="case-background">
      <div class="title">案例背景</div>
      <div class="description">
        <div>
          合同作为所有经济活动的起点，是企业遵循市场经济规律的重要体现。合同签订流程涉及到大量的审核工作，需要丰富的法律经验。为了实现对合同全生命周期的管控，利用自然语言处理技术（NLP）进行合同文本分析，通过建立判示模型，对合同文件中的问题进行自动判别，能更加精准地把握合同签订全流程中存在的风险，有助于建立健全风险信息预警机制，提高企业合同风险管理工作水平和效率。
        </div>
      </div>
    </div>
    <div class="case-intro">
      <div class="title">案例简介</div>
      <div class="description">
        <div>
          目前大部分电力公司的合同风险审查工作主要依靠人工完成，审核过程可能存在缺乏客观性，同时，审核工作具有大量重复性、体力性的日常工作。此外，合同流程涉及业务部分的交叉较多，但是前期却难以直接深入了解，导致前期风险排查不及时，后期容易产生纠纷或不利后果。
        </div>
        <div>
          华为公司设计开发了基于NLP技术的合同风险评估与管理系统，利用大数据技术、NLP自然语言理解、智能规则引擎技术，实现合同签约风险诊断风险预警，将合同风险管理从业务员单一经验判断转变到与知识库融合解决的形式，把业务人员从重复性的业务工作中解放出来，投入到风险数据库建设中，杜绝已出现的合同风险重复性出现的顽疾，真正实现合同风险从事后处理向事前防范和事中控制转变。
        </div>
        <!-- <div class="case-img">
          <img :src="introImg" alt="" />
        </div> -->
      </div>
    </div>
    <div class="case-advantage">
      <div class="title">案例优势</div>
      <div class="description">
        <p>
          基于NLP技术的合同评估管理系统有效支持电力公司合同风险管控工作的开展，提高合同风险管控工作效率，降低相关风险造成纠纷的概率及损失，合同风险诊断系统也必将为大渡河公司带来更大的价值。
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
        padding: 24px 0;
        background: #f5f9fb;
        display: flex;
        flex-direction: column;
        align-items: center;
        img {
          width: 50%;
        }
        .solution-img {
          margin-top: 24px;
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
    .case-background,
    .case-intro,
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
