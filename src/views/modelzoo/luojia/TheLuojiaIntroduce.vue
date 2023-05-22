<script setup>
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
</script>
<template>
  <div class="sketch">
    <p class="sketch-title">{{ t('luojia.INTRODUCTION.RESUME') }}</p>
    <p class="sketch-content">
      {{ t('luojia.INTRODUCTION.DESC_1') }}
    </p>
    <p class="sketch-content">
      {{ t('luojia.INTRODUCTION.DESC_2') }}
    </p>
    <h4 class="center">{{ t('luojia.INTRODUCTION.CONSTRUCTION') }}</h4>
    <img
      class="architecture-img"
      src="@/assets/imgs/luojia/luojia-1.png"
      alt=""
    />
    <h4 class="left">{{ t('luojia.INTRODUCTION.SUPPORT_1') }}</h4>
    <p class="text-class">
      {{ t('luojia.INTRODUCTION.SUPPORT_1_DESC') }}
    </p>
    <img class="img-class img2" src="@/assets/imgs/luojia/luojia-2.png" />
    <img class="img-class img2-1" src="@/assets/imgs/luojia/luojia-2-1.png" />
    <img class="img-class" src="@/assets/imgs/luojia/luojia-3.png" />
    <h4 class="left">{{ t('luojia.INTRODUCTION.SUPPORT_2') }}</h4>
    <p class="text-class">
      {{ t('luojia.INTRODUCTION.SUPPORT_2_DESC') }}
    </p>
    <div class="guide-box">
      <img
        class="img-class guide-left"
        src="@/assets/imgs/luojia/luojia-4.png"
      />
      <!-- <div class="scroll"> -->
      <img
        class="img-class guide-right"
        src="@/assets/imgs/luojia/luojia-5.png"
      />
      <!-- </div> -->
    </div>
    <h4 class="left">{{ t('luojia.INTRODUCTION.SUPPORT_3') }}</h4>
    <p class="text-class">
      {{ t('luojia.INTRODUCTION.SUPPORT_3_DESC') }}
    </p>
    <img class="img-class img6" src="@/assets/imgs/luojia/luojia-6.png" />
    <img class="img-class img6-1" src="@/assets/imgs/luojia/luojia-6-1.png" />
    <img class="img-class" src="@/assets/imgs/luojia/luojia-7.png" />
    <h4 class="left">{{ t('luojia.INTRODUCTION.SUPPORT_4') }}</h4>
    <div class="luojia-set">
      <div class="general-situation">
        <p>
          <span class="circle"></span
          >{{ t('luojia.INTRODUCTION.SUPPORT_4_INFO_1') }}
        </p>
        <p>
          <span class="circle"></span
          >{{ t('luojia.INTRODUCTION.SUPPORT_4_INFO_2') }}
        </p>
        <p>
          <span class="circle"></span
          >{{ t('luojia.INTRODUCTION.SUPPORT_4_INFO_3') }}
        </p>
        <p>
          <span class="circle"></span
          >{{ t('luojia.INTRODUCTION.SUPPORT_4_INFO_4') }}
        </p>
        <p>
          <span class="circle"></span
          >{{ t('luojia.INTRODUCTION.SUPPORT_4_INFO_5') }}
        </p>
        <p>
          <span class="circle"></span
          >{{ t('luojia.INTRODUCTION.SUPPORT_4_INFO_6') }}
        </p>
      </div>
      <div class="date-situation">
        <img class="img-class img8" src="@/assets/imgs/luojia/luojia-8.png" />
        <img
          class="img-class img8-1"
          src="@/assets/imgs/luojia/luojia-8-1.png"
        />
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.sketch {
  background-color: #fff;
  padding: 40px 80px;
  border-radius: 16px;
  .img2-1,
  .img6-1,
  .img8-1 {
    display: none;
  }
  @media screen and (max-width: 767px) {
    padding: 16px;
    .img2,
    .img6,
    .img8 {
      display: none;
    }
    .img2-1,
    .img6-1,
    .img8-1 {
      display: block;
    }
  }
  &-title {
    font-size: 24px;
    font-weight: 500;
    color: #000000;
    line-height: 32px;
    margin-bottom: 24px;
    @media screen and (max-width: 768px) {
      font-size: 14px;
      height: 22px;
      line-height: 22px;
      margin: 0 0 8px;
    }
  }
  &-content {
    margin-bottom: 24px;
    font-size: 14px;
    font-weight: 400;
    color: #555555;
    line-height: 22px;
    @media screen and (max-width: 768px) {
      height: auto;
      font-size: 12px;
      line-height: 18px;
      margin-bottom: 8px;
    }
  }
  .center {
    font-size: 24px;
    color: #000000;
    line-height: 32px;
    margin-bottom: 24px;
    text-align: center;
    @media screen and (max-width: 768px) {
      font-size: 14px;
      height: 22px;
      line-height: 22px;
      margin: 16px 0 8px;
      text-align: left;
      font-weight: unset;
    }
  }
  .architecture-img {
    width: 100%;
  }
  .left {
    font-size: 24px;
    color: #000000;
    line-height: 32px;
    margin: 39px 0 16px 0;
    @media screen and (max-width: 768px) {
      font-size: 14px;
      height: 22px;
      line-height: 22px;
      margin: 24px 0 8px;
      text-align: left;
      font-weight: unset;
    }
  }
  .text-class {
    font-size: 14px;
    font-weight: 400;
    color: #555555;
    line-height: 22px;
    @media screen and (max-width: 768px) {
      height: auto;
      font-size: 12px;
      line-height: 18px;
    }
  }
  .img-class {
    width: 100%;
    margin-top: 24px;
    @media screen and (max-width: 768px) {
      margin-top: 8px;
    }
  }
  .guide-box {
    // display: flex;
    .scroll {
      display: inline-block;
    }
    .guide-left {
      width: 434px;
      height: 523px;
      margin-right: 15px;
    }
    .guide-right {
      width: 808px;
      height: 523px;
    }
    @media screen and (max-width: 768px) {
      .guide-left,
      .guide-right {
        width: 100%;
        height: auto;
        margin: 8px 0 0;
      }
    }
  }
  .luojia-set {
    display: flex;
    align-items: center;
    @media screen and (max-width: 768px) {
      flex-direction: column;
    }

    .general-situation {
      width: 260px;
      font-size: 14px;
      font-weight: 400;
      color: #555555;
      line-height: 22px;
      p {
        display: flex;
        align-items: center;
      }
      @media screen and (max-width: 768px) {
        height: auto;
        font-size: 12px;
        line-height: 18px;
      }
      .circle {
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background-color: #555;
        margin-right: 14px;
      }
    }
    .date-situation {
      flex: 1;
    }
  }
}
</style>
