<script setup></script>
<template>
  <div class="explain">
    <p class="explain-title">项目说明</p>
    <div class="case-background">
      <p class="title">案例背景</p>
      <div class="description">
        <p>
          全球约有2.5亿听障人群，其中大部分需要依靠手语。十六年前，第二次全国残疾人抽样调查结果显示，我国有约2780万名听力残疾者，占全国残疾人的30%以上。这一数量还在持续增长。
          听力障碍严重影响着这个特殊群体的生活、学习和社会交往，不仅时常制造各种尴尬与不便，而且使他们面临沟通难、就业难等一系列问题。
          <br />
          究其原因，主要是手语知识学习的挑战。
          <br />
          仅用手语手势交流的他们，在学习时，往往面临无法准确理解、手语词汇更新慢、看不懂其他地域的手语“方言”等难题。
        </p>
        <div class="img-container">
          <img
            class="img-background"
            src="@/assets/imgs/estate/humanity/sign-language/background.png"
            alt=""
          />
        </div>
        <p class="text">
          就像中英文之别，手语作为一种无声的语言，在不同地区有不同的"语法"，比如北京人打手语，海南人可能看不懂是什么意思。
        </p>
      </div>
    </div>
    <div class="case-intro">
      <p class="title">案例简介</p>
      <div class="description">
        <p>
          基于紫东太初开发的手语多模态模型，华为联合千博信息，实现了手语动作与示意图片和文字的联动，让初学者更加方便的理解手语。同时，基于手语多模态模型，千博信息打造了手语教考一体机，帮助学生随学随练随考，极大的推动手语标准的推广，帮助听障朋友以及手语爱好者更好的学习。
          <br />
          研发人员让“紫东太初”三模态大模型学习了1.2万个手语词汇、50多万语法、70多万语料，基于昇思MindSpore
          AI框架，开发手语多模态模型，开创性地实现手语动作与视频、图片示意和文字说明的联动，让初学者对手语语义理解更加深刻。而后，基于手语多模态模型，利用昇腾AI基础软硬件平台开发出手语教考一体机。
        </p>
        <div class="img-container">
          <img
            class="img-intro"
            src="@/assets/imgs/estate/humanity/sign-language/introduction.png"
            alt=""
          />
        </div>
      </div>
    </div>
    <div class="case-advantage">
      <p class="title">案例优势</p>
      <div class="description">
        <p>
          手语教考一体机实现文本到图像的自动生成，具备实时手语手势识别、表情及唇语识别等能力，并且还可实现新事物词汇的及时学习与更新，适用于特殊教育学校、开设手语教学师资培养的大专院校、通用手语推广教学点和全国残联基层培训点等。此外，基于手语多模态模型打造的AI手语助手功能可用于同传翻译、新闻主持、服务引导等场景。
        </p>
        <div class="img-container">
          <img
            class="img-advantage"
            src="@/assets/imgs/estate/humanity/sign-language/advantage.png"
            alt=""
          />
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.explain {
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
    .description {
      font-size: 14px;
      color: #555;
      line-height: 22px;
      .img-container {
        padding: 24px 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        background: #f5f9fb;
        margin-top: 24px;

        .img-background {
          height: 279px;
        }
        .img-intro {
          width: 80%;
          height: 270px;
        }
        .img-advantage {
          height: 276px;
        }
      }
      .text {
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
        .img-container {
          padding: 8px;
          margin-top: 8px;
          margin-bottom: 8px;
          img {
            width: 100%;
          }
          .img-background {
            height: 172px;
          }
          .img-intro {
            width: 100%;
            height: 102px;
          }
          .img-advantage {
            height: 200px;
          }
        }
        .text {
          margin-top: 8px;
        }
      }
    }
    .case-advantage {
      margin-bottom: 0px;
    }
  }
}
</style>
