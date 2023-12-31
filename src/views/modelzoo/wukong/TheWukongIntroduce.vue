<script setup>
import { reactive } from 'vue';
import wukongModel from '@/assets/imgs/wukong/wukong-model.png';
import wukongDataset from '@/assets/imgs/wukong/wukong-dataset.png';
import abysmView from '@/assets/imgs/wukong/abysm-view.png';
import arkShip from '@/assets/imgs/wukong/ark-ship.png';
import blackHole from '@/assets/imgs/wukong/black-hole.png';
import cityView from '@/assets/imgs/wukong/city-view.png';
import seaRunner from '@/assets/imgs/wukong/sea-runner.png';
import umbrellaWomen from '@/assets/imgs/wukong/umbrella-women.png';
import wukongBanner1 from '@/assets/imgs/wukong/wukong-banner1.png';
import { ArrowRight } from '@element-plus/icons-vue';

import useWindowResize from '@/shared/hooks/useWindowResize.js';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const screenWidth = useWindowResize();

const effectImg = reactive([
  {
    imgUrl: cityView,
    title: t('wukong.WUKONG_INFO.DISPLAY_IMGS[0]'),
  },
  {
    imgUrl: umbrellaWomen,
    title: t('wukong.WUKONG_INFO.DISPLAY_IMGS[1]'),
  },
  {
    imgUrl: seaRunner,
    title: t('wukong.WUKONG_INFO.DISPLAY_IMGS[2]'),
  },
  {
    imgUrl: abysmView,
    title: t('wukong.WUKONG_INFO.DISPLAY_IMGS[3]'),
  },
  {
    imgUrl: arkShip,
    title: t('wukong.WUKONG_INFO.DISPLAY_IMGS[4]'),
  },
  {
    imgUrl: blackHole,
    title: t('wukong.WUKONG_INFO.DISPLAY_IMGS[5]'),
  },
]);

function goExperience() {
  window.open('/modelzoo/wukong');
}

// 了解更多
function learnWukongMore() {
  window.open(
    'https://github.com/mindspore-lab/minddiffusion/tree/main/vision/wukong-huahua'
  );
}

const githubLink1 = 'https://wukong-dataset.github.io/wukong-dataset/';
const githubLink2 =
  'https://github.com/christophschuhmann/improved-aesthetic-predictor';
</script>
<template>
  <div class="wukong-intro">
    <div class="wukong-bread">
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/modelzoo' }">{{
          t('wukong.BIG_MODEL')
        }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ t('wukong.TITLE') }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="intro-head">
      <div class="wukong-left">
        <img draggable="false" :src="wukongBanner1" alt="" />
      </div>

      <div class="wukong-right">
        <div class="wukong-right-top">
          <div class="wukong-right-title">{{ t('wukong.TITLE_1') }}</div>
          <div class="wukong-right-content">
            {{ t('wukong.DESC') }}
          </div>
        </div>

        <div class="right-button">
          <OButton
            type="primary"
            :size="screenWidth < 820 ? 'mini' : 'small'"
            animation
            @click="goExperience"
          >
            在线体验
          </OButton>
          <OButton
            type="outline"
            :size="screenWidth < 820 ? 'mini' : 'small'"
            animation
            @click="learnWukongMore"
          >
            {{ t('wukong.LEARN_MORE') }}
          </OButton>
        </div>
      </div>
    </div>
    <div class="intro-detail">
      <div class="intro">
        <div class="intro-title">{{ t('wukong.WUKONG_INFO.RESUME') }}</div>
        <div class="intro-concept">
          {{ t('wukong.WUKONG_INFO.DESC') }}
        </div>

        <div class="intro-concept new-vision">
          {{ t('wukong.WUKONG_INFO.NEW_DESC') }}
        </div>

        <div class="intro-concept">
          <p>
            {{ t('wukong.WUKONG_INFO.FEATURE_1') }}
          </p>
          <p>
            {{ t('wukong.WUKONG_INFO.FEATURE_2') }}
          </p>
          <p>{{ t('wukong.WUKONG_INFO.FEATURE_3') }}</p>
        </div>
      </div>
      <div class="model">
        <div class="model-title">{{ t('wukong.WUKONG_INFO.MODEL_TITLE') }}</div>
        <div class="model-img">
          <img :src="wukongModel" alt="" />
        </div>
        <div class="model-detail">
          {{ t('wukong.WUKONG_INFO.MODEL_DETAIL') }}
          <div class="train-method">
            <div class="first-method">
              {{ t('wukong.WUKONG_INFO.DETAIL_1') }}
            </div>
            <div class="seconde-method">
              {{ t('wukong.WUKONG_INFO.DETAIL_2') }}
            </div>
          </div>
        </div>
      </div>
      <div class="dataset">
        <div class="dataset-title">{{ t('wukong.WUKONG_INFO.DATASET') }}</div>
        <div class="dataset-img">
          <img :src="wukongDataset" alt="" />
        </div>
        <div class="dataset-detail">
          <div class="first-step">
            {{ t('wukong.WUKONG_INFO.ABOUT_DATASET') }}
          </div>
          <div class="second-step">
            <div>
              {{ t('wukong.WUKONG_INFO.STEP') }}
            </div>
            <ul class="content">
              <li>
                <span class="content-item">•</span>
                <span>
                  {{ t('wukong.WUKONG_INFO.STEP_1') }}
                </span>
              </li>
              <li>
                <span class="content-item">•</span>
                <span>
                  {{ t('wukong.WUKONG_INFO.STEP_2') }}
                </span>
              </li>
              <li>
                <span class="content-item">•</span>
                <span>
                  {{ t('wukong.WUKONG_INFO.STEP_3') }}
                </span>
              </li>
              <li>
                <span class="content-item">•</span>
                <span> {{ t('wukong.WUKONG_INFO.STEP_4') }}</span>
              </li>
            </ul>
            <div class="result">
              {{ t('wukong.WUKONG_INFO.STEP_5') }}
            </div>
          </div>
          <div class="final-sample">
            <div class="more-dataset">
              <div>
                <span>{{ t('wukong.WUKONG_INFO.RELATE_DETAIL_1') }}</span>
                <a
                  :href="githubLink1"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {{ githubLink1 }}
                </a>
                <span>。</span>
              </div>
              <div class="conclusion">
                <span>
                  {{ t('wukong.WUKONG_INFO.RELATE_DETAIL_2') }}
                </span>
                <a
                  :href="githubLink2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {{ githubLink2 }}
                </a>
                <span>
                  {{ t('wukong.WUKONG_INFO.RELATE_DETAIL_3') }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="generating-effect">
        <div class="title">{{ t('wukong.WUKONG_INFO.GENERATE_RESULT') }}</div>
        <div class="effect-list">
          <div v-for="item in effectImg" :key="item.title" class="effect-item">
            <div class="effect-img">
              <img :src="item.imgUrl" alt="" />
            </div>
            <div class="text">{{ item.title }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.wukong-intro {
  padding: 120px 16px 64px;
  margin: 0 auto;
  max-width: 1448px;
  height: 100%;
  @media screen and (max-width: 820px) {
    padding: 48px 0px 40px;
  }
  .wukong-bread {
    margin-bottom: 40px;
    @media screen and (max-width: 820px) {
      display: none;
    }
  }
  .intro-head {
    padding: 40px;
    background-color: #fff;
    display: flex;
    margin: 40px 0px;
    border-radius: 16px;
    @media screen and (max-width: 820px) {
      padding: 16px;
      margin: 16px;
    }
    .wukong-left {
      margin-right: 40px;
      @media screen and (max-width: 820px) {
        display: none;
      }
      img {
        width: 416px;
      }
    }
    .wukong-right {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .wukong-right-top {
        .wukong-right-title {
          line-height: 48px;
          font-size: 36px;
          color: #000000;
          margin-bottom: 16px;
          @media screen and (max-width: 820px) {
            font-size: 20px;
            line-height: 32px;
            font-weight: 300;
            margin-bottom: 16px;
          }
          @media screen and (max-width: 768px) {
            font-size: 16px;
            line-height: 24px;
            font-weight: 300;
            margin-bottom: 8px;
          }
        }
        .wukong-right-content {
          font-size: 14px;
          color: #555555;
          line-height: 22px;
          @media screen and (max-width: 820px) {
            margin-bottom: 24px;
            font-size: 14px;
            line-height: 18px;
            font-weight: 400;
          }
          @media screen and (max-width: 768px) {
            margin-bottom: 16px;
            font-size: 12px;
            line-height: 18px;
            font-weight: 400;
          }
        }
      }
      .right-button {
        .o-button:first-child {
          margin-right: 16px;
          @media screen and (max-width: 820px) {
            margin-right: 12px;
          }
        }
      }
    }
  }
  .intro-detail {
    background: #ffffff;
    border-radius: 16px;
    padding: 40px 80px;
    @media screen and (max-width: 820px) {
      padding: 24px 16px;
      margin: 16px 16px 0;
    }
    .intro {
      margin-bottom: 40px;
      @media screen and (max-width: 768px) {
        margin-bottom: 24px;
      }
      .intro-title {
        line-height: 32px;
        font-size: 24px;
        color: #000000;
        margin-bottom: 24px;
        @media screen and (max-width: 768px) {
          font-size: 14px;
          line-height: 22px;
          margin-bottom: 8px;
        }
      }
      .intro-concept {
        line-height: 22px;
        font-size: 14px;
        color: #555555;
        @media screen and (max-width: 768px) {
          font-size: 12px;
          line-height: 18px;
        }
      }
    }
    .model {
      margin-bottom: 40px;
      @media screen and (max-width: 768px) {
        margin-bottom: 24px;
      }
      .model-title {
        line-height: 32px;
        font-size: 20px;
        color: #000000;
        margin-bottom: 24px;
        @media screen and (max-width: 768px) {
          font-size: 14px;
          line-height: 22px;
          margin-bottom: 8px;
        }
      }
      .model-img {
        text-align: center;
        margin-bottom: 24px;
        @media screen and (max-width: 768px) {
          margin-bottom: 8px;
        }
        img {
          width: 100%;
        }
      }
      .model-detail {
        line-height: 22px;
        font-size: 14px;
        color: #555555;
        @media screen and (max-width: 768px) {
          font-size: 12px;
          line-height: 18px;
        }
        .train-method {
          text-indent: 10px;
        }
      }
    }
    .dataset {
      margin-bottom: 40px;
      @media screen and (max-width: 768px) {
        margin-bottom: 24px;
      }
      .dataset-title {
        line-height: 32px;
        font-size: 20px;
        color: #000000;
        margin-bottom: 24px;
        @media screen and (max-width: 768px) {
          font-size: 14px;
          line-height: 22px;
          margin-bottom: 8px;
        }
      }
      .dataset-img {
        text-align: center;
        margin-bottom: 24px;
        @media screen and (max-width: 768px) {
          margin-bottom: 8px;
        }
        img {
          width: 100%;
        }
      }
      .dataset-detail {
        line-height: 22px;
        font-size: 14px;
        color: #555555;
        @media screen and (max-width: 768px) {
          font-size: 12px;
          line-height: 18px;
        }
        .first-step {
          margin-bottom: 16px;
          @media screen and (max-width: 768px) {
            margin-bottom: 0px;
          }
        }
        .second-step {
          margin-bottom: 16px;
          @media screen and (max-width: 768px) {
            margin-bottom: 0px;
          }
          ul {
            li {
              text-indent: 10px;
              .content-item {
                display: inline-block;
                font-size: 18px;
                color: #555;
                margin-right: 4px;
              }
            }
          }
          .result {
            margin-bottom: 24px;
            @media screen and (max-width: 768px) {
              margin-bottom: 8px;
            }
          }
        }
        .final-sample {
          .sample-img {
            text-align: center;
            margin-bottom: 24px;
            img {
              width: 100%;
            }
          }
          .more-dataset {
            line-height: 22px;
            font-size: 14px;
            color: #555555;
            a {
              color: #0d8dff;
            }
          }
        }
      }
    }
    .generating-effect {
      .title {
        line-height: 32px;
        font-size: 20px;
        color: #000000;
        margin-bottom: 24px;
        @media screen and (max-width: 768px) {
          font-size: 14px;
          line-height: 22px;
          margin-bottom: 8px;
        }
      }
      .effect-list {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        .effect-item {
          width: 32%;
          margin-bottom: 24px;
          @media screen and (max-width: 768px) {
            margin-bottom: 8px;
          }
          .text {
            line-height: 22px;
            font-size: 14px;
            color: #555555;
            text-align: center;
            @media screen and (max-width: 768px) {
              line-height: 20px;
              font-size: 12px;
            }
          }
          .effect-img {
            margin-bottom: 10px;
            width: 100%;
            img {
              width: 100%;
            }
          }
        }
      }
    }
  }
}
</style>
