<script setup>
import backgroundImg from '@/assets/imgs/estate/industry/algorithm/algorithm-background.png';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>
<template>
  <div class="project-explain">
    <div class="explain-title">{{ t('algorithm.EXPLAIN') }}</div>
    <div class="case-background">
      <div class="title">{{ t('algorithm.BACKGROUND') }}</div>
      <div class="description">
        <div>
          {{ t('algorithm.BACKGROUND_DESC') }}
        </div>
        <div class="case-img">
          <img :src="backgroundImg" alt="" />
        </div>
        <div>
          {{ t('algorithm.BACKGROUND_DESC1') }}
        </div>
      </div>
    </div>
    <div class="case-intro">
      <div class="title">{{ t('algorithm.RESUME') }}</div>
      <div class="description">
        <div>
          {{ t('algorithm.RESUME_DESC') }}
        </div>
        <div class="case-desc">
          {{ t('algorithm.RESUME_DESC1') }}
        </div>
        <div>
          {{ t('algorithm.RESUME_DESC2') }}<br />
          {{ t('algorithm.RESUME_DESC3') }}
        </div>
      </div>
    </div>
    <div class="case-difficulty">
      <div class="title">{{ t('algorithm.DIFFICULT') }}</div>
      <div class="description">
        <div>
          {{ t('algorithm.DIFFICULT_DESC') }}
        </div>
        <div class="case-desc">
          {{ t('algorithm.DIFFICULT_DESC1') }}
        </div>
        <div>
          {{ t('algorithm.DIFFICULT_DESC2') }}
        </div>
      </div>
    </div>
    <div class="case-advantage">
      <div class="title">{{ t('algorithm.ADVANTAGE') }}</div>
      <div class="description">
        <div>
          {{ t('algorithm.ADVANTAGE_DESC') }}
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
  .case-difficulty,
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
      .case-desc {
        margin: 16px 0;
      }
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
    .case-difficulty,
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
        .case-desc {
          margin: 8px 0;
        }
      }
    }
    .case-advantage {
      margin-bottom: 0px;
    }
  }
}
</style>
