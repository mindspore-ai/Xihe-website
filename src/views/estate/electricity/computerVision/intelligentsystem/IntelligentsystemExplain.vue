<script setup>
import introImg from '@/assets/imgs/estate/electricity/intelligentsystem/system-intro.png';
</script>
<template>
  <div class="project-explain">
    <div class="explain-title">项目说明</div>
    <div class="case-background">
      <div class="title">案例背景</div>
      <div class="description">
        <div>
          新能源的可变性、间歇性、随机性、出力&用电高峰不匹配特点给电力供应安全性和可靠性带来极大的挑战。新能源电力供给地域性差异放大，导致跨区跨省的电力调度需求增加。传统的专家调度系统无法有效应对大规模新能源并网条件下的复杂实时调度挑战和各种突发事件。
        </div>
      </div>
    </div>
    <div class="case-intro">
      <div class="title">案例简介</div>
      <div class="description">
        <div>
          华为联合中科院自动化所推出基于全场景AI框架昇思MindSpore的智能在线决策系统，其在昇腾AI计算集群上进行训练，昇思MindSpore高效的分布式强化学习能力可以应用到业界多种多样的决策智能任务。
        </div>
        <div>
          该系统基于大量离线仿真数据构建AI决策模型，针对电网当前动态出力和负载状况，实时做出更加经济和安全的调度决策和编排计划。从当前的日前计划调度转变为分钟级甚至秒级的实时调度。可以更好地预测和评估在复杂出力和负载扰动下电网的运行状态，提升电网安全预警能力。
        </div>
        <div class="case-img">
          <img :src="introImg" alt="" />
        </div>
      </div>
    </div>
    <div class="case-advantage">
      <div class="title">案例优势</div>
      <div class="description">
        <p>
          目前该系统能够辅助调度员决策，降低人工调度压力，减少人为失误，提高电网对异常情况和事故的响应速度和处理效率，同时大幅提升调度安全性和经济型，降低碳排放。在南京人工智能计算中心已完成试验性部署。
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
