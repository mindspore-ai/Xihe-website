<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>
<template>
  <div class="project-explain">
    <div class="explain-title">{{ t('metalpart.EXPLAIN') }}</div>
    <div class="case-background">
      <div class="title">{{ t('metalpart.BACKGROUND') }}</div>
      <div class="description">
        <div>
          {{ t('metalpart.BACKGROUND_DESC') }}
        </div>
      </div>
    </div>
    <div class="case-painspot">
      <div class="title">{{ t('metalpart.PAIN') }}</div>
      <div class="description">
        <div>
          {{ t('metalpart.PAIN_DESC') }}
        </div>
      </div>
    </div>
    <div class="case-solution">
      <div class="title">{{ t('metalpart.SOLUTION') }}</div>
      <div class="description">
        <div>
          {{ t('metalpart.SOLUTION_DESC') }}
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
  .case-painspot,
  .case-painspot,
  .case-solution {
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
        margin-top: 24px;
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
  .case-solution {
    margin-bottom: 0px;
  }
  @media screen and (max-width: 820px) {
    .explain-title {
      font-size: 16px;
      line-height: 24px;
      margin-bottom: 16px;
    }
    .case-background,
    .case-painspot,
    .case-painspot,
    .case-solution {
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
    .case-solution {
      margin-bottom: 0px;
    }
  }
}
</style>
