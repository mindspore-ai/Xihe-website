<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>
<template>
  <div class="explain">
    <p class="explain-title">{{ t('yuzhi.EXPLAIN') }}</p>
    <div class="case-background">
      <p class="title">{{ t('yuzhi.BACKGROUND') }}</p>
      <p class="description">
        {{ t('yuzhi.BACKGROUND_DESC') }}
      </p>
    </div>
    <div class="case-intro">
      <p class="title">{{ t('yuzhi.RESUME') }}</p>
      <div class="description">
        <p>
          {{ t('yuzhi.RESUME_DESC') }}
        </p>
        <div class="img-container">
          <img
            class="img-introduction"
            src="@/assets/imgs/estate/humanity/yuzhi/introduction-1.png"
            alt=""
          />
          <p class="img-intro">
            {{ t('yuzhi.RESUME_DESC1') }}
          </p>
        </div>
        <p>
          {{ t('yuzhi.RESUME_DESC2') }}
        </p>
        <div class="img-container">
          <img
            class="img-introduction2"
            src="@/assets/imgs/estate/humanity/yuzhi/introduction-2.png"
            alt=""
          />
        </div>
      </div>
    </div>
    <div class="case-solution">
      <p class="title">{{ t('yuzhi.SOLUTION') }}</p>
      <div class="description">
        <p>
          {{ t('yuzhi.SOLUTION_DESC') }}
          <br />{{ t('yuzhi.SOLUTION_DESC1') }}
          <br />
          <br />
          {{ t('yuzhi.SOLUTION_DESC2') }}
        </p>
        <div class="img-container">
          <img
            class="img-method"
            src="@/assets/imgs/estate/humanity/yuzhi/solve-method.png"
            alt=""
          />
        </div>
      </div>
    </div>
    <div class="case-advantage">
      <p class="title">{{ t('yuzhi.ADVANTAGE') }}</p>
      <div class="description">
        <p>
          {{ t('yuzhi.ADVANTAGE_DESC') }}
        </p>
        <div class="img-container">
          <img
            class="img-advantage"
            src="@/assets/imgs/estate/humanity/yuzhi/advantage.png"
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
          width: 50%;
        }
        .img-introduction {
          height: 174px;
        }
        .img-introduction2 {
          height: 209px;
        }
        .img-method {
          height: 201px;
        }
        .img-advantage {
          height: 275px;
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
        .case-img {
          margin-top: 8px;
          margin-bottom: 8px;
        }
        .img-container {
          padding: 8px;
          margin-top: 8px;
          margin-bottom: 8px;
          img {
            width: 100%;
          }
          .img-introduction,
          .img-introduction2,
          .img-method {
            height: 102px;
          }
          .img-advantage {
            height: 132px;
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
