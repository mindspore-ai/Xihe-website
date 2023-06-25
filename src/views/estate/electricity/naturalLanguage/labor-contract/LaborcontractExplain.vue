<script setup>
// import introImg from '@/assets/imgs/estate/electricity/intelligentsystem/system-intro.png';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>
<template>
  <div class="project-explain">
    <div class="explain-title">{{ t('laborcontract.EXPLAIN') }}</div>
    <div class="case-background">
      <div class="title">{{ t('laborcontract.BACKGROUND') }}</div>
      <div class="description">
        <div>
          {{ t('laborcontract.BACKGROUND_DESC') }}
        </div>
      </div>
    </div>
    <div class="case-intro">
      <div class="title">{{ t('laborcontract.RESUME') }}</div>
      <div class="description">
        <div>
          {{ t('laborcontract.RESUME_DESC') }}
        </div>
        <div>
          {{ t('laborcontract.RESUME_DESC1') }}
        </div>
        <!-- <div class="case-img">
          <img :src="introImg" alt="" />
        </div> -->
      </div>
    </div>
    <div class="case-advantage">
      <div class="title">{{ t('laborcontract.ADVANTAGE') }}</div>
      <div class="description">
        <p>
          {{ t('laborcontract.ADVANTAGE_DESC') }}
        </p>
      </div>
    </div>
    <div class="tips">
      {{ t('laborcontract.FRIENDLY_TIP') }}
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
    .tips {
      font-size: 12px;
      margin-top: 16px;
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
