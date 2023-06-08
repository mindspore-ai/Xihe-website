<script setup>
import TextDetector from '@/assets/imgs/modelzoo/text-detector.png';
import { useRouter } from 'vue-router';

import useWindowResize from '@/shared/hooks/useWindowResize.js';

const i18n = {
  TITLE: '简述',
  TEXT_1:
    '随着大语言模型的生成效果越发逼真，各行各业迫切需要一款可靠的AI生成文本检测器。然而，不同行业对检测语料的要求不同，例如在学术界，普遍需要对大段完整的学术文本进行检测；在社交平台上，则需要对相对简短而较为支离破碎的假消息进行检测。然而，既有检测器往往无法兼顾各式需求。例如，主流的一些AI文本检测器对较短的语料预测能力普遍较差。',
  TEXT_2:
    '对于不同长度语料的不同检测效果，我们观察到较短的AI生成文本可能存在着一部分归属上的“不确定性”；或者更直白地说，由于一些AI生成短句同时也常常被人类使用，我们很难界定AI生成的短文本是否来自于人或AI。这里我们列举了几个人和AI分别对同一问题做出回答的例子：',
  TEXT_3:
    '由这些例子可见，我们很难对AI生成的简短回答进行识别：这类语料与人的区别过小，很难严格判断其真实属性。虽然在实际应用中对这一类极短语料的检测没有意义，但是我们合理地推测较短的语料也具有部分的“不确定性”属性。因此在训练过程中，直接以较短文本的标注为准按照传统人类/AI的二分类问题进行文本检测是不合适的。针对这个问题，本研究将人类/AI的二分类检测部分转化为了一个PU（Positive-Unlabeled）学习问题，通过对训练过程进行改进，可观地提升了检测器在各式语料上的分类效果。',
  TEXT_4:
    ' 具体实施上，首先本研究参考了传统的PU学习方法，在训练过程中引入PU损失函数；然后基于不同长短语料的属性变化，对PU损失函数进行改进，提出了对语料长度较为敏感的MPU损失函数，增强了PU学习的效果。最后，为了充分发挥MPU损失的潜力，本研究提出了“文本多尺度化”模块，使训练语料长度更加多样化。',
  TEXT_5: '更多相关细节可以参考',
  REFERENCE_LINK: 'https://arxiv.org/abs/2305.18149',
};

const screenWidth = useWindowResize();
const router = useRouter();

function goOnlineExperience() {
  router.push('/modelzoo/text-detector');
}
function learnMore() {
  window.open('https://arxiv.org/abs/2305.18149', 'blank');
}
</script>
<template>
  <div class="introduce">
    <div class="introduce-banner">
      <div class="banner-left">
        <img draggable="false" :src="TextDetector" alt="" />
      </div>
      <div class="banner-right">
        <div class="banner-title">AI文本检测器</div>
        <div class="banner-content">
          根据长短文本的不同特性，华为诺亚方舟实验室提出了一种基于PU学习的多尺度AI生成文本检测器MPU，能够在各种场景下识别由AI生成的文字。
        </div>
        <div class="banner-btn">
          <OButton
            type="primary"
            :size="screenWidth < 820 ? 'mini' : 'small'"
            animation
            @click="goOnlineExperience"
          >
            在线体验
          </OButton>
          <OButton
            :size="screenWidth < 820 ? 'mini' : 'small'"
            animation
            @click="learnMore"
          >
            了解更多
          </OButton>
        </div>
      </div>
    </div>

    <div class="introduce-main">
      <p class="main-title">{{ i18n.TITLE }}</p>
      <p class="main-text">{{ i18n.TEXT_1 }}</p>
      <p class="main-text">{{ i18n.TEXT_2 }}</p>

      <div class="container">
        <img src="@/assets/imgs/modelzoo/text-detector-intro.png" alt="" />
      </div>
      <p class="main-text">{{ i18n.TEXT_3 }}</p>
      <p class="main-text">{{ i18n.TEXT_4 }}</p>

      <p class="main-text">
        {{ i18n.TEXT_5 }}
        <a class="reference_link" :href="i18n.REFERENCE_LINK" target="blank">{{
          i18n.REFERENCE_LINK
        }}</a>
      </p>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.introduce-banner {
  padding: 40px;
  background-color: #fff;
  display: flex;
  border-radius: 16px;
  @media screen and (max-width: 1080px) {
    padding: 16px;
    margin: 0 16px;
  }
  .banner-left {
    margin-right: 40px;
    @media screen and (max-width: 1080px) {
      display: none;
    }
    img {
      width: 416px;
      height: 100%;
      border-radius: 16px;
    }
  }
  .banner-right {
    .banner-title {
      line-height: 48px;
      font-size: 36px;
      color: #000000;
      margin-bottom: 16px;
      @media screen and (max-width: 820px) {
        font-size: 16px;
        line-height: 24px;
        font-weight: 300;
        margin-bottom: 16px;
      }
      @media screen and (max-width: 768px) {
        margin-bottom: 8px;
      }
    }

    .banner-content {
      font-size: 14px;
      color: #555555;
      line-height: 22px;
      margin-bottom: 54px;
      @media screen and (max-width: 820px) {
        margin-bottom: 16px;
        font-size: 12px;
        line-height: 18px;
        font-weight: 400;
      }
    }
    .banner-btn {
      .o-button {
        &:first-child {
          margin-right: 24px;
        }
      }
    }
  }
}
.introduce-main {
  padding: 40px;
  border-radius: 16px;
  background: #ffffff;
  margin-top: 24px;
}
.main-title {
  font-size: 24px;
  line-height: 32px;
  font-weight: 500;
  color: #000000;
}
.main-text {
  font-size: 14px;
  line-height: 22px;
  color: #555555;
  margin-top: 24px;
}
.container {
  background: #f5f9fb;
  margin-top: 24px;
  img {
    width: 100%;
    height: 100%;
  }
}
.reference_link {
  color: #0d8dff;
  cursor: pointer;
}
</style>
