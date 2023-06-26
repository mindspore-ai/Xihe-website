<script setup>
import introImg from '@/assets/imgs/estate/electricity/intelligentsystem/system-intro.png';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
</script>
<template>
  <div class="project-explain">
    <div class="explain-title">{{ t('intelligent.EXPLAIN') }}</div>
    <div class="case-background">
      <div class="title">{{ t('intelligent.BACKGROUND') }}</div>
      <div class="description">
        <div>
          {{ t('intelligent.BACKGROUND_DESC') }}
        </div>
      </div>
    </div>
    <div class="case-intro">
      <div class="title">{{ t('intelligent.RESUME') }}</div>
      <div class="description">
        <div>
          {{ t('intelligent.RESUME_DESC') }}
        </div>
        <div>
          {{ t('intelligent.RESUME_DESC1') }}
        </div>
        <div class="case-img">
          <img :src="introImg" alt="" />
        </div>
      </div>
    </div>
    <div class="case-advantage">
      <div class="title">{{ t('intelligent.ADVANTAGE') }}</div>
      <div class="description">
        <p>
          {{ t('intelligent.ADVANTAGE_DESC') }}
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
}
</style>
