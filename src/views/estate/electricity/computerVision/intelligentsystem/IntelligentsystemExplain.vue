<script setup>
import introImg from '@/assets/imgs/estate/electricity/intelligentsystem/system-intro.png';
import introImg2 from '@/assets/imgs/estate/electricity/intelligentsystem/system-intro2.png';
import useWindowResize from '@/shared/hooks/useWindowResize.js';

import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const screenWidth = useWindowResize();
</script>
<template>
  <div class="project-explain">
    <div class="explain-title">{{ t('system.EXPLAIN') }}</div>
    <div class="case-background">
      <div class="title">{{ t('system.BACKGROUND') }}</div>
      <div class="description">
        <div>
          {{ t('system.BACKGROUND_DESC') }}
        </div>
      </div>
    </div>
    <div class="case-intro">
      <div class="title">{{ t('system.RESUME') }}</div>
      <div class="description">
        <div>
          {{ t('system.RESUME_DESC') }}
        </div>
        <div class="case-img">
          <img v-if="screenWidth > 820" :src="introImg" alt="" />
          <img v-else class="intro-img" :src="introImg2" alt="" />
        </div>
      </div>
    </div>
    <div class="case-solution">
      <div class="title">{{ t('system.SOLUTION') }}</div>
      <div class="description">
        <p>
          {{ t('system.SOLUTION_DESC') }}
        </p>
      </div>
    </div>
    <div class="case-advantage">
      <div class="title">{{ t('system.CASE') }}</div>
      <div class="description">
        <p>
          {{ t('system.CASE_DESC') }}
        </p>
      </div>
    </div>
    <div class="tips">
      {{ t('system.FRIENDLY_TIP') }}
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
  .case-solution,
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
        .intro-img {
          height: 176px;
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
    .case-solution,
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
