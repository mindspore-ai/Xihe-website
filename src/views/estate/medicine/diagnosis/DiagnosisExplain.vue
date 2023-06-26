<script setup>
import conceptImg from '@/assets/imgs/estate/medicine/diagnosis/diagnostic-concept.png';
import advantageImg from '@/assets/imgs/estate/medicine/diagnosis/advantage.png';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>
<template>
  <div class="project-explain">
    <div class="explain-title">{{ t('diagnosis.EXPLAIN') }}</div>
    <div class="case-background">
      <div class="title">{{ t('diagnosis.BACKGROUND') }}</div>
      <div class="description">
        <div>
          {{ t('diagnosis.BACKGROUND_DESC') }}
        </div>
        <div>
          {{ t('diagnosis.BACKGROUND_DESC1') }}
        </div>
      </div>
    </div>
    <div class="case-intro">
      <div class="title">{{ t('diagnosis.RESUME') }}</div>
      <div class="description">
        <div>
          {{ t('diagnosis.RESUME_DESC') }}
        </div>
        <div class="case-img">
          <img :src="conceptImg" alt="" />
          <p class="concept-title">{{ t('diagnosis.RESUME_DESC1') }}</p>
        </div>
      </div>
    </div>
    <div class="case-advantage">
      <div class="title">{{ t('diagnosis.ADVANTAGE') }}</div>
      <div class="description">
        <div>
          {{ t('diagnosis.ADVANTAGE_DESC') }}
        </div>
        <div>
          {{ t('diagnosis.ADVANTAGE_DESC1') }}
        </div>
        <div>
          {{ t('diagnosis.ADVANTAGE_DESC2') }}
        </div>
        <div>
          {{ t('diagnosis.ADVANTAGE_DESC3') }}
        </div>
        <div class="case-img advantage-img">
          <img :src="advantageImg" alt="" />
          <p class="concept-title">
            {{ t('diagnosis.ADVANTAGE_DESC4') }}
          </p>
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
          width: 64%;
        }
        .concept-title {
          margin-top: 16px;
        }
      }
      .advantage-img {
        margin-bottom: 0;
        img {
          width: 58%;
        }
      }
    }
  }
  .case-advantage {
    margin-bottom: 0;
  }
  @media screen and (max-width: 820px) {
    .explain-title {
      font-size: 16px;
      line-height: 24px;
      margin-bottom: 16px;
    }
    .case-background,
    .case-intro,
    .case-painspot,
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
          // background-color: red;
          margin-top: 8px;
          margin-bottom: 8px;
          padding: 8px;
          img {
            width: 100%;
          }
          .concept-title {
            width: 80%;
            text-align: center;
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
