<script setup>
import introImg1 from '@/assets/imgs/estate/industry/intelligence/intelligence-intro1.png';
import introImg2 from '@/assets/imgs/estate/industry/intelligence/intelligence-intro2.png';
import introImg3 from '@/assets/imgs/estate/industry/intelligence/intelligence-intro3.png';
import introImg4 from '@/assets/imgs/estate/industry/intelligence/intelligence-intro1-1.png';
import introImg5 from '@/assets/imgs/estate/industry/intelligence/intelligence-intro2-1.png';
import introImg6 from '@/assets/imgs/estate/industry/intelligence/intelligence-intro3-1.png';
import advantageImg from '@/assets/imgs/estate/industry/intelligence/intelligence-advantage.png';
import useWindowResize from '@/shared/hooks/useWindowResize.js';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const screenWidth = useWindowResize();
</script>
<template>
  <div class="project-explain">
    <div class="explain-title">{{ t('intelligence.EXPLAIN') }}</div>
    <div class="case-background">
      <div class="title">{{ t('intelligence.BACKGROUND') }}</div>
      <div class="description">
        <div>
          {{ t('intelligence.BACKGROUND_DESC') }}
        </div>
        <div>
          {{ t('intelligence.BACKGROUND_DESC1') }}
        </div>
      </div>
    </div>
    <div class="case-intro">
      <div class="title">{{ t('intelligence.RESUME') }}</div>
      <div class="description">
        <div>
          {{ t('intelligence.RESUME_DESC') }}
        </div>
        <div class="case-img">
          <img v-if="screenWidth > 820" :src="introImg1" alt="" />
          <img v-else :src="introImg4" alt="" />
        </div>
        <div>
          {{ t('intelligence.RESUME_DESC1') }}
        </div>
        <div>
          {{ t('intelligence.RESUME_DESC2') }}
        </div>
        <div class="case-img">
          <img v-if="screenWidth > 820" :src="introImg2" alt="" />
          <img v-else :src="introImg5" alt="" />
        </div>
        <div>
          {{ t('intelligence.RESUME_DESC3') }}
        </div>
        <div class="case-img">
          <img v-if="screenWidth > 820" :src="introImg3" alt="" />
          <img v-else :src="introImg6" alt="" />
        </div>
      </div>
    </div>
    <div class="case-advantage">
      <div class="title">{{ t('intelligence.ADVANTAGE') }}</div>
      <div class="description">
        <div>
          {{ t('intelligence.ADVANTAGE_DESC') }}
        </div>
        <div class="case-img">
          <img :src="advantageImg" alt="" />
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
  .case-painspot,
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
    }
  }
  .case-advantage {
    margin-bottom: 0px;
    .description {
      .case-img {
        margin-bottom: 0px;
      }
    }
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
