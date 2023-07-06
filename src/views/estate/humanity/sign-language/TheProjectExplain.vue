<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>
<template>
  <div class="explain">
    <p class="explain-title">{{ t('sign.EXPLAIN') }}</p>
    <div class="case-background">
      <p class="title">{{ t('sign.BACKGROUND') }}</p>
      <div class="description">
        <p>
          {{ t('sign.BACKGROUND_DESC') }}
          <br />
          {{ t('sign.BACKGROUND_DESC1') }}
          <br />
          {{ t('sign.BACKGROUND_DESC2') }}
        </p>
        <div class="img-container">
          <img
            class="img-background"
            src="@/assets/imgs/estate/humanity/sign-language/background.png"
            alt=""
          />
        </div>
        <p class="text">
          {{ t('sign.BACKGROUND_DESC3') }}
        </p>
      </div>
    </div>
    <div class="case-intro">
      <p class="title">{{ t('sign.RESUME') }}</p>
      <div class="description">
        <p>
          {{ t('sign.RESUME_DESC') }}
          <br />
          {{ t('sign.RESUME_DESC1') }}
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
      <p class="title">{{ t('sign.ADVANTAGE') }}</p>
      <div class="description">
        <p>
          {{ t('sign.ADVANTAGE_DESC') }}
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
