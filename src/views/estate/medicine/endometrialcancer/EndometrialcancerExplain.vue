<script setup>
import backgroundImg from '@/assets/imgs/estate/medicine/cancer/background.png';
import solutionImg1 from '@/assets/imgs/estate/medicine/cancer/solution-img1.png';
import solutionImg2 from '@/assets/imgs/estate/medicine/cancer/solution-img2.png';
import solutionImg3 from '@/assets/imgs/estate/medicine/cancer/solution-img3.png';
import useWindowResize from '@/shared/hooks/useWindowResize.js';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const screenWidth = useWindowResize();
</script>
<template>
  <div class="project-explain">
    <div class="explain-title">{{ t('cancer.EXPLAIN') }}</div>
    <div class="case-background">
      <div class="title">{{ t('cancer.BACKGROUND') }}</div>
      <div class="description">
        <div>
          {{ t('cancer.BACKGROUND_DESC') }}
        </div>
        <div>
          {{ t('cancer.BACKGROUND_DESC1') }}
        </div>
        <div class="case-img">
          <img :src="backgroundImg" alt="" class="background-img" />
        </div>
        <div>
          {{ t('cancer.BACKGROUND_DESC2') }}
        </div>
        <div>
          {{ t('cancer.BACKGROUND_DESC3') }}
        </div>
      </div>
    </div>
    <div class="case-intro">
      <div class="title">{{ t('cancer.RESUME') }}</div>
      <div class="subtitle">
        {{ t('cancer.RESUME_DESC') }}
      </div>
      <div class="description">
        <div>
          {{ t('cancer.RESUME_DESC1') }}
        </div>
      </div>
    </div>
    <div class="case-difficulty">
      <div class="title">{{ t('cancer.DIFFICULT') }}</div>
      <div class="description">
        <p>
          {{ t('cancer.DIFFICULT_DESC') }}
        </p>
        <p>
          {{ t('cancer.DIFFICULT_DESC1') }}
        </p>
      </div>
    </div>
    <div class="case-solution">
      <div class="title">{{ t('cancer.SOLUTION') }}</div>
      <div class="description">
        <p>
          {{ t('cancer.SOLUTION_DESC') }}
        </p>
        <div v-if="screenWidth > 820" class="case-img">
          <img :src="solutionImg1" alt="" />
          <img :src="solutionImg2" alt="" class="solution-img" />
        </div>
        <div v-else class="case-img2">
          <img :src="solutionImg3" alt="" class="solution-img" />
        </div>
        <p>
          {{ t('cancer.SOLUTION_DESC1') }}
        </p>
      </div>
    </div>
    <div class="case-advantage">
      <div class="title">{{ t('cancer.ADVANTAGE') }}</div>
      <div class="description">
        <p>
          {{ t('cancer.ADVANTAGE_DESC') }}
        </p>
        <p class="summary">
          {{ t('cancer.ADVANTAGE_DESC1') }}
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
  .case-difficulty,
  .case-solution,
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
      .case-img2 {
        margin: 8px 0;
        img {
          width: 100%;
          height: 322px;
        }
      }
      .summary {
        margin-top: 24px;
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
    .case-difficulty,
    .case-solution,
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
          padding: 8px;
          .background-img {
            width: 100%;
          }
        }
        .summary {
          margin-top: 16px;
        }
      }
    }
    .case-advantage {
      margin-bottom: 0px;
    }
  }
}
</style>
