<script setup>
import backgroundImg from '@/assets/imgs/estate/electricity/substationhost/host-background.png';
import backgroundImg2 from '@/assets/imgs/estate/electricity/substationhost/host-background2.png';
import introImg from '@/assets/imgs/estate/electricity/substationhost/host-intro.png';
import introImg2 from '@/assets/imgs/estate/electricity/substationhost/host-intro2.png';
import painspotImg from '@/assets/imgs/estate/electricity/substationhost/host-painspot.png';

import useWindowResize from '@/shared/hooks/useWindowResize.js';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const screenWidth = useWindowResize();
</script>
<template>
  <div class="project-explain">
    <div class="explain-title">{{ t('substation.EXPLAIN') }}</div>
    <div class="case-background">
      <div class="title">{{ t('substation.BACKGROUND') }}</div>
      <div class="description">
        <div>
          {{ t('substation.BACKGROUND_DESC') }}
        </div>
        <div class="case-img">
          <img v-if="screenWidth > 820" :src="backgroundImg" alt="" />
          <img v-else class="background-img" :src="backgroundImg2" alt="" />
        </div>
      </div>
    </div>
    <div class="case-intro">
      <div class="title">{{ t('substation.RESUME') }}</div>
      <div class="subtitle">{{ t('substation.RESUME_DESC1') }}</div>
      <div class="description">
        <div class="case-img">
          <img
            v-if="screenWidth > 820"
            class="intro-img"
            :src="introImg"
            alt=""
          />
          <img v-else class="intro-img" :src="introImg2" alt="" />
        </div>
        <div>
          {{ t('substation.RESUME_DESC2') }}
        </div>
      </div>
    </div>
    <div class="case-painspot">
      <div class="title">{{ t('substation.PAIN') }}</div>
      <div class="description">
        <p>
          {{ t('substation.PAIN_DESC') }}
        </p>
      </div>
    </div>
    <div class="case-advantage">
      <div class="title">{{ t('substation.ADVANTAGE') }}</div>
      <div class="description">
        <p>
          {{ t('substation.ADVANTAGE_DESC') }}
        </p>
        <div class="case-img">
          <img class="painspot-img" :src="painspotImg" alt="" />
        </div>
        <p>
          {{ t('substation.ADVANTAGE_DESC1') }}
        </p>
      </div>
    </div>
    <div class="tips">
      {{ t('substation.FRIENDLY_TIP') }}
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
        background: #f5f9fb;
        display: flex;
        flex-direction: column;
        align-items: center;
        img {
          width: 100%;
        }
        .background-img {
          height: 423px;
        }
        .intro-img {
          height: 275px;
        }
      }
      .summary {
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
          .painspot-img {
            background-color: red;
            width: 100%;
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
