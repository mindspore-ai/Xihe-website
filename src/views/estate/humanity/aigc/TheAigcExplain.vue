<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>
<template>
  <div class="explain">
    <p class="explain-title">{{ t('aigc.EXPLAIN') }}</p>
    <div class="case-background">
      <p class="title">{{ t('aigc.EXPLAIN') }}</p>
      <p class="description">
        {{ t('aigc.BACKGROUND_DESC') }}<br />
        {{ t('aigc.BACKGROUND_DESC1') }}<br />
        {{ t('aigc.BACKGROUND_DESC2') }}
      </p>
    </div>
    <div class="case-intro">
      <p class="title">{{ t('aigc.RESUME') }}</p>
      <p class="description">
        {{ t('aigc.RESUME_DESC') }}
      </p>
    </div>
    <div class="case-solution">
      <p class="title">{{ t('aigc.SOLUTION') }}</p>
      <div class="description">
        <p>
          {{ t('aigc.SOLUTION_DESC') }}
        </p>
        <div class="img-container">
          <img
            class="img-method"
            src="@/assets/imgs/estate/humanity/aigc/solve-method.png"
            alt=""
          />
          <p class="img-intro">{{ t('aigc.SOLUTION_DESC1') }}</p>
        </div>
      </div>
    </div>
    <div class="case-advantage">
      <p class="title">{{ t('aigc.ADVANTAGE') }}</p>
      <div class="description">
        <p>
          {{ t('aigc.ADVANTAGE_DESC') }}
        </p>
        <div class="img-container">
          <img
            class="img-advantage1"
            src="@/assets/imgs/estate/humanity/aigc/advantage-1.png"
            alt=""
          />
          <p class="img-intro">{{ t('aigc.ADVANTAGE_DESC1') }}</p>
        </div>
        <p class="text">
          {{ t('aigc.ADVANTAGE_DESC2') }}
        </p>
        <div class="img-container">
          <img
            class="img-advantage2"
            src="@/assets/imgs/estate/humanity/aigc/advantage-2.png"
            alt=""
          />
          <p class="img-intro">{{ t('aigc.ADVANTAGE_DESC3') }}</p>
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
      .img-container {
        padding: 24px 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        background: #f5f9fb;
        margin-top: 24px;
        margin-bottom: 24px;
        &:last-child {
          margin-bottom: 0px;
        }
        .img-intro {
          font-size: 14px;
          font-weight: 400;
          color: #555555;
          line-height: 22px;
          text-align: center;
          margin-top: 16px;
        }

        img {
          height: 440px;
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
        .img-container {
          padding: 8px;
          margin-top: 8px;
          margin-bottom: 8px;
          img {
            width: 100%;
            height: 180px;
          }
          .img-intro {
            font-size: 12px;
            margin-top: 8px;
          }
        }
      }
    }
    .case-advantage {
      margin-bottom: 0px;
    }
  }
}
</style>
