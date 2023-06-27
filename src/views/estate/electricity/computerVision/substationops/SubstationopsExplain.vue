<script setup>
import advantageImg from '@/assets/imgs/estate/electricity/substationops/ops-advantage.png';
import advantageImg2 from '@/assets/imgs/estate/electricity/substationops/ops-advantage2.png';
import useWindowResize from '@/shared/hooks/useWindowResize.js';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const screenWidth = useWindowResize();
</script>
<template>
  <div class="project-explain">
    <div class="explain-title">{{ t('substationops.EXPLAIN') }}</div>
    <div class="case-background">
      <div class="title">{{ t('substationops.BACKGROUND') }}</div>
      <div class="description">
        <div>
          {{ t('substationops.BACKGROUND_DESC') }}
        </div>
        <div>
          {{ t('substationops.BACKGROUND_DESC1') }}
        </div>
      </div>
    </div>
    <div class="case-intro">
      <div class="title">{{ t('substationops.RESUME') }}</div>
      <div class="description">
        <div>
          {{ t('substationops.RESUME_DESC') }}
        </div>
        <div>
          {{ t('substationops.RESUME_DESC1') }}
        </div>
      </div>
    </div>
    <div class="case-advantage">
      <div class="title">{{ t('substationops.ADVANTAGE') }}</div>
      <div class="description">
        <p>
          {{ t('substationops.ADVANTAGE_DESC') }}
        </p>
        <p>
          {{ t('substationops.ADVANTAGE_DESC1') }}
        </p>
        <p>
          {{ t('substationops.ADVANTAGE_DESC2') }}
        </p>
        <div class="case-img">
          <img v-if="screenWidth > 820" :src="advantageImg" alt="" />
          <img v-else class="advantage-img" :src="advantageImg2" alt="" />
        </div>
      </div>
    </div>
    <div class="tips">
      {{ t('substationops.FRIENDLY_TIP') }}
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
  .case-painspot,
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
        .advantage-img {
          height: 180px;
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
    .case-painspot,
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
