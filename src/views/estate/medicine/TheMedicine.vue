<script setup>
import { useRouter } from 'vue-router';

import cancerImg from '@/assets/imgs/estate/medicine/endometrial-cancer.png';
import surgeryImg from '@/assets/imgs/estate/medicine/surgery.png';
import diagnosticImg from '@/assets/imgs/estate/medicine/diagnostic-system.png';
// import estateBanner from '@/assets/imgs/estate/estate-banner.png';

import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const cases = [
  {
    id: 0,
    type: t('medicine.CASES[0].TYPE'),
    name: t('medicine.CASES[0].DESC'),
    image: cancerImg,
    url: '/medicine/metrocarcinoma',
  },
  {
    id: 1,
    type: t('medicine.CASES[1].TYPE'),
    name: t('medicine.CASES[1].DESC'),
    image: surgeryImg,
    url: '/medicine/truesight',
  },
  {
    id: 2,
    type: t('medicine.CASES[2].TYPE'),
    name: t('medicine.CASES[2].DESC'),
    image: diagnosticImg,
    url: '/medicine/diagnosis',
  },
];

const router = useRouter();

function goCasePath(item) {
  router.push(item.url);
}
</script>
<template>
  <div class="medicine">
    <div class="medicine-head">
      <!-- <img :src="estateBanner" alt="" /> -->
      <div class="estate-banner">
        <div class="banner-title">{{ t('medicine.TITLE') }}</div>
        <div class="banner-desc">
          {{ t('medicine.DESCRIPTION') }}
        </div>
      </div>
    </div>
    <div class="medicine-wrapper">
      <p class="application-cases">{{ t('medicine.APPLICATION_CASE') }}</p>

      <div class="case-cards">
        <div
          v-for="item in cases"
          :key="item.name"
          class="case-item"
          @click="goCasePath(item)"
        >
          <img :src="item.image" alt="" />

          <div class="case-info">
            <p class="case-type">{{ item.type }}</p>
            <p class="case-name">{{ item.name }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.medicine {
  background-color: #f5f6f8;
  padding-bottom: 64px;
  @media screen and (max-width: 820px) {
    padding-bottom: 40px;
  }
  .medicine-head {
    padding-top: 80px;
    position: relative;
    background-image: url('@/assets/imgs/estate/estate-banner.jpg');
    background-size: cover;
    background-position: 50% 50%;
    @media screen and (max-width: 820px) {
      padding-top: 48px;
      background-image: url('@/assets/imgs/estate/mobile-banner.png');
    }
    img {
      width: 100%;
      height: 100%;
    }
    .estate-banner {
      max-width: 1472px;
      margin: 0 auto;
      padding: 160px 16px;
      position: relative;
      top: -55%;
      @media screen and (max-width: 820px) {
        padding: 44px 24px 24px;
      }
      .banner-title {
        line-height: 48px;
        font-size: 36px;
        font-weight: 400;
        color: #000000;
        margin-bottom: 10px;
        @media screen and (max-width: 820px) {
          font-size: 20px;
          line-height: 28px;
        }
      }
      .banner-desc {
        line-height: 24px;
        font-size: 18px;
        font-weight: 400;
        color: #000000;
        @media screen and (max-width: 820px) {
          font-size: 12px;
          line-height: 18px;
          max-width: 200px;
        }
      }
    }
  }
  .medicine-wrapper {
    margin: 0 auto;
    max-width: 1472px;
    .application-cases {
      margin-top: 40px;
      font-size: 36px;
      line-height: 48px;
      color: #000000;
      text-align: center;
      @media screen and (max-width: 820px) {
        margin-top: 24px;
        font-size: 16px;
        line-height: 24px;
      }
    }
    .case-cards {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-gap: 24px;
      grid-template-rows: 320px;
      margin: 40px 0 64px;
      padding: 0px 16px;
      @media screen and (max-width: 820px) {
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: unset;
        margin: 24px 0 0;
        grid-gap: 16px;
      }
      @media screen and (max-width: 767px) {
        grid-template-columns: repeat(1, 1fr);
      }
      .case-item {
        cursor: pointer;
        border-radius: 16px;
        position: relative;
        &:hover {
          box-shadow: 0 6px 18px #0d8dff24;
        }
        .case-info {
          color: #fff;
          margin: 0 24px;
          position: absolute;
          top: 206px;
          @media screen and (max-width: 820px) {
            top: 146px;
          }
          .case-type {
            font-size: 24px;
            line-height: 26px;
            font-weight: 500;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: '...';
            @media screen and (max-width: 820px) {
              font-size: 16px;
              line-height: 24px;
            }
          }
          .case-name {
            font-size: 16px;
            line-height: 22px;
            font-weight: 400;
            margin-top: 16px;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: '...';
            @media screen and (max-width: 820px) {
              font-size: 12px;
              line-height: 18px;
              margin-top: 8px;
            }
          }
        }
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style>
