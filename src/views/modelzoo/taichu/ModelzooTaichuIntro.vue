<script setup>
import { ref, nextTick } from 'vue';

import taichuBanner from '@/assets/imgs/taichu/taichu-banner.png';
import taichuEfficient from '@/assets/imgs/taichu/taichu-efficient.png';
import taichuEfficient1 from '@/assets/imgs/taichu/taichu-efficient1.png';
import taichuEfficient2 from '@/assets/imgs/taichu/taichu-efficient2.png';
import taichuEfficient3 from '@/assets/imgs/taichu/taichu-efficient3.png';
import taichuLargeimg1 from '@/assets/imgs/taichu/taichu-largeimg1.png';
import taichuLargeimg1Mo from '@/assets/imgs/taichu/taichu-largeimg1-mobile.png';
import taichuLargeimg2 from '@/assets/imgs/taichu/taichu-largeimg2.png';
import taichuArrows from '@/assets/imgs/taichu/taichu-arrows.png';
import taichuVideo1 from '@/assets/imgs/taichu/taichu-video1.png';
import taichuVideo2 from '@/assets/imgs/taichu/taichu-video2.png';
import taichuVideo3 from '@/assets/imgs/taichu/taichu-video3.png';
import taichuVideo4 from '@/assets/imgs/taichu/taichu-video4.png';
import taichuVideo5 from '@/assets/imgs/taichu/taichuvideo5.png';
import taichuPlay from '@/assets/imgs/taichu/taichuplay.png';
import taichuClose from '@/assets/imgs/taichu/taichu-close.png';
import taichuCompanyImg from '@/assets/imgs/taichu/taichu-companyimg.png';
import taichuFixImg from '@/assets/imgs/taichu/taichuFixImage.png';

import OButton from '@/components/OButton.vue';
import { ArrowRight } from '@element-plus/icons-vue';
import useWindowResize from '@/shared/hooks/useWindowResize.js';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const screenWidth = useWindowResize();

const taichuvideo1 =
  'https://obs-9be7.obs.cn-east-2.myhuaweicloud.com/turing/newVideo/%E4%BB%A5%E5%9B%BE%E7%94%9F%E9%9F%B3%2001.mp4';
const taichuvideo2 =
  'https://obs-9be7.obs.cn-east-2.myhuaweicloud.com/turing/newVideo/%E4%BB%A5%E5%9B%BE%E7%94%9F%E9%9F%B3%2002.mp4';
const taichuvideo3 =
  'https://obs-9be7.obs.cn-east-2.myhuaweicloud.com/turing/newVideo/%E4%BB%A5%E9%9F%B3%E7%94%9F%E5%9B%BE%2001.mp4';
const taichuvideo4 =
  'https://obs-9be7.obs.cn-east-2.myhuaweicloud.com/turing/newVideo/%E4%BB%A5%E9%9F%B3%E7%94%9F%E5%9B%BE%2002.mp4';
const referencevideo =
  'https://obs-9be7.obs.cn-east-2.myhuaweicloud.com/turing/newVideo/%E7%B4%AB%E4%B8%9C%E5%A4%AA%E5%88%9D.mp4';
const instancevideo =
  'https://obs-9be7.obs.cn-east-2.myhuaweicloud.com/turing/newVideo/%E5%A4%9A%E6%A8%A1%E6%80%81%E5%BA%94%E7%94%A8%E8%A7%86%E9%A2%91%E8%B0%83%E8%89%B2%E7%89%88-0614.mp4';

const showVideo = ref(false);
const showReferenceVideo = ref(false);
const showInstanceVideo = ref(false);
// 图片数组
const videoImgArr1 = [
  {
    id: 1,
    src: taichuVideo1,
    videoUrl: taichuvideo1,
  },
  {
    id: 2,
    src: taichuVideo3,
    videoUrl: taichuvideo2,
  },
];
const videoImgArr2 = [
  {
    id: 1,
    src: taichuVideo2,
    videoUrl: taichuvideo3,
  },
  {
    id: 2,
    src: taichuVideo2,
    videoUrl: taichuvideo4,
  },
];
function playVideo(videoUrl) {
  showVideo.value = true;
  nextTick(() => {
    // 获得视频元素
    const video = document.getElementById('video');
    video.src = videoUrl;
    video.play();
  });
}
// 播放参考设计部分的视频
function playReferenceVideo() {
  showReferenceVideo.value = true;
  nextTick(() => {
    const referenceVideo = document.getElementById('referenceVideo');
    referenceVideo.play();
  });
}
// 结束参考设计部分的视频
function closeReferenceVideo() {
  const referenceVideo = document.getElementById('referenceVideo');
  referenceVideo.pause();
  referenceVideo.currentTime = 0;
  showReferenceVideo.value = false;
}
// 播放应用实例部分的视频
function playInstanceVideo() {
  showInstanceVideo.value = true;
  nextTick(() => {
    const instanceVideo = document.getElementById('instanceVideo');
    instanceVideo.play();
  });
}
// 结束应用实例部分的视频
function closeInstanceVideo() {
  const instanceVideo = document.getElementById('instanceVideo');
  instanceVideo.pause();
  instanceVideo.currentTime = 0;
  showInstanceVideo.value = false;
}
function goTaichuExperience() {
  window.open('/modelzoo/taichu');
}
function goTaichuMore() {
  window.open('https://gitee.com/mindspore/omni-perception-pretrainer');
}
</script>
<template>
  <div class="wrapper">
    <div class="taichu-wrap">
      <div class="taichu-bread">
        <el-breadcrumb :separator-icon="ArrowRight">
          <el-breadcrumb-item :to="{ path: '/modelzoo' }">{{
            t('taichu.BIG_MODEL')
          }}</el-breadcrumb-item>
          <el-breadcrumb-item>{{ t('taichu.TITLE') }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="taichu-banner">
        <div class="banner-left">
          <img draggable="false" :src="taichuBanner" alt="" />
        </div>
        <div class="banner-right">
          <div class="banner-title">{{ t('taichu.TITLE') }}</div>
          <div class="banner-content">
            {{ t('taichu.TAICHU_DESC') }}
          </div>
          <div class="banner-btn">
            <OButton
              type="primary"
              :size="screenWidth < 820 ? 'mini' : 'small'"
              animation
              @click="goTaichuExperience"
            >
              {{ t('taichu.EXPERIENCE_LIVE') }}
            </OButton>
            <OButton
              :size="screenWidth < 820 ? 'mini' : 'small'"
              animation
              @click="goTaichuMore"
            >
              {{ t('taichu.LEARN_MORE') }}
            </OButton>
          </div>
        </div>
      </div>
    </div>
    <div class="taichu-detail">
      <div class="taichu-detail-intro">
        <div class="intro-title">{{ t('taichu.INTRODUCTION.RESUME') }}</div>
        <p class="intro-info info1">
          {{ t('taichu.INTRODUCTION.RESUME_DESC1') }}
        </p>
        <p class="intro-info">
          {{ t('taichu.INTRODUCTION.RESUME_DESC2') }}
        </p>

        <div class="intro-body">
          <div class="intro-body-title">
            {{ t('taichu.INTRODUCTION.APPLICATION_TITLE') }}
          </div>
          <div class="intro-body-diagram">
            <img class="diagram-left" :src="taichuEfficient" alt="" />
            <div class="diagram-right">
              <div class="text">
                <img :src="taichuEfficient1" alt="" />
                <img :src="taichuEfficient2" alt="" />
                <img :src="taichuEfficient3" alt="" />
                <p>{{ t('taichu.INTRODUCTION.APPLICATION_1') }}</p>
              </div>
              <div class="diagram-video">
                <div
                  v-for="item in videoImgArr1"
                  :key="item.id"
                  class="diagram-video-img"
                  @click="playVideo(item.videoUrl)"
                >
                  <img class="video-img1" :src="item.src" alt="" />
                  <img class="video-img2" :src="taichuPlay" alt="" />
                </div>
                <p>{{ t('taichu.INTRODUCTION.APPLICATION_2') }}</p>
              </div>
              <div class="diagram-video">
                <div
                  v-for="item in videoImgArr2"
                  :key="item.id"
                  class="diagram-video-img"
                  @click="playVideo(item.videoUrl)"
                >
                  <img class="video-img1" :src="taichuVideo2" alt="" />
                  <img class="video-img2" :src="taichuPlay" alt="" />
                </div>
                <p>{{ t('taichu.INTRODUCTION.APPLICATION_3') }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="intro-img">
          <img :src="taichuLargeimg1" alt="" />
        </div>
        <div class="intro-img-mobile">
          <img :src="taichuLargeimg1Mo" alt="" />
        </div>
      </div>

      <div class="taichu-detail-reference">
        <div class="reference-title">
          {{ t('taichu.INTRODUCTION.XIAOCHU_TITLE') }}
        </div>
        <p class="reference-info">
          {{ t('taichu.INTRODUCTION.XIAOCHU_DESC') }}
        </p>
        <div class="reference-video">
          <img class="video-img1" :src="taichuVideo4" alt="" />
          <div class="video-img2">
            <img :src="taichuPlay" alt="" @click="playReferenceVideo" />
            <div>{{ t('taichu.TITLE') }}</div>
            <p>{{ t('taichu.INTRODUCTION.VIDEO_DESC') }}</p>
          </div>
          <div v-if="showReferenceVideo" class="video-content">
            <img
              class="close-btn"
              :src="taichuClose"
              alt=""
              @click="closeReferenceVideo"
            />
            <video
              id="referenceVideo"
              controls="controls"
              :src="referencevideo"
              class="reference-video"
            ></video>
          </div>
        </div>
      </div>

      <div class="taichu-detail-instance">
        <div class="instance-title">
          {{ t('taichu.INTRODUCTION.SIGN_LANGUAGE') }}
        </div>
        <p class="instance-info">
          {{ t('taichu.INTRODUCTION.LANGUAGE_DESC1') }}
          <br />
          {{ t('taichu.INTRODUCTION.LANGUAGE_DESC2') }}
        </p>
        <div class="instance-desc">
          <div class="instance-desc-title">
            {{ t('taichu.INTRODUCTION.LEARNING') }}
          </div>
          <div class="instance-desc-title2">
            {{ t('taichu.INTRODUCTION.CHALLENGES') }}
          </div>

          <ul class="challenges">
            <li class="challenges-item">
              <div class="challenges-item-left">
                <p class="challenges-item-left-num">1</p>
                <p class="challenges-item-left-title">
                  {{ t('taichu.INTRODUCTION.CHALLENGE1_TITLE') }}
                </p>
              </div>
              <div class="challenges-item-right">
                <div class="top">
                  <span class="top-strip strip"></span>
                  <div class="top-total">
                    <p class="title1">
                      {{ t('taichu.INTRODUCTION.CHALLENGE1_DESC') }}
                    </p>
                    <p class="title2">
                      {{ t('taichu.INTRODUCTION.CHALLENGE1_DESC_1') }}
                    </p>
                  </div>
                </div>
                <div class="bottom">
                  <span class="bottom-strip strip"></span>
                  <span class="bottom-title">{{
                    t('taichu.INTRODUCTION.CHALLENGE1_DESC_2')
                  }}</span>
                </div>
              </div>
            </li>
            <li class="challenges-item">
              <div class="challenges-item-left">
                <p class="challenges-item-left-num">2</p>
                <p class="challenges-item-left-title">
                  {{ t('taichu.INTRODUCTION.CHALLENGE2_TITLE') }}
                </p>
              </div>
              <div class="challenges-item-right">
                <div class="top">
                  <span class="top-strip strip"></span>
                  <div class="top-total">
                    <p class="title1">
                      {{ t('taichu.INTRODUCTION.CHALLENGE2_DESC') }}
                    </p>
                  </div>
                </div>
                <div class="bottom">
                  <span class="bottom-strip strip"></span>
                  <span class="bottom-title3">
                    {{ t('taichu.INTRODUCTION.CHALLENGE2_DESC_2') }}</span
                  >
                </div>
              </div>
            </li>
            <li class="challenges-item">
              <div class="challenges-item-left">
                <p class="challenges-item-left-num">3</p>
                <p class="challenges-item-left-title">
                  {{ t('taichu.INTRODUCTION.CHALLENGE3_TITLE') }}
                </p>
              </div>
              <div class="challenges-item-right">
                <ul class="difference-arr">
                  <li class="difference-item">
                    <span class="color-block"></span>
                    <span class="text-block">{{
                      t('taichu.INTRODUCTION.CHALLENGE3_DESC')
                    }}</span>
                  </li>
                  <li class="difference-item">
                    <span class="color-block"></span>
                    <span class="text-block">{{
                      t('taichu.INTRODUCTION.CHALLENGE3_DESC_1')
                    }}</span>
                  </li>
                  <li class="difference-item">
                    <span class="color-block"></span>
                    <span class="text-block">{{
                      t('taichu.INTRODUCTION.CHALLENGE3_DESC_2')
                    }}</span>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
          <div class="mobile-challenge">
            <img src="@/assets/imgs/taichu/taichu-challenge1.png" alt="" />
            <img src="@/assets/imgs/taichu/taichu-challenge2.png" alt="" />
            <img src="@/assets/imgs/taichu/taichu-challenge3.png" alt="" />
          </div>
        </div>
        <div class="instance-AIdesc">
          <div class="instance-AIdesc-title">
            {{ t('taichu.INTRODUCTION.AI_EMPOWERMENT') }}
          </div>
          <div class="instance-AIdesc-title1">
            {{ t('taichu.INTRODUCTION.THREE_CHALLENGES') }}
          </div>
          <ul class="instance-AIdesc-title2">
            <li>
              <span>{{ t('taichu.INTRODUCTION.CHALLENGE_1') }}</span>
              <img :src="taichuArrows" alt="" />
            </li>
            <li>
              <span>{{ t('taichu.INTRODUCTION.CHALLENGE_2') }}</span>
              <img :src="taichuArrows" alt="" />
            </li>
            <li>
              <span>{{ t('taichu.INTRODUCTION.CHALLENGE_3') }}</span>
            </li>
          </ul>

          <div class="instance-AIdesc-img">
            <img :src="taichuLargeimg2" alt="" />
          </div>
          <img
            class="instance-AIdesc-companyimg"
            :src="taichuCompanyImg"
            alt=""
          />
          <img class="instance-AIdesc-fixImage" :src="taichuFixImg" alt="" />

          <div class="instance-AIdesc-video">
            <img class="video-img1" :src="taichuVideo5" alt="" />
            <div class="video-img2">
              <img :src="taichuPlay" alt="" @click="playInstanceVideo" />
            </div>
            <div v-if="showInstanceVideo" class="video-content">
              <img
                class="close-btn"
                :src="taichuClose"
                alt=""
                @click="closeInstanceVideo"
              />
              <video
                id="instanceVideo"
                controls="controls"
                :src="instancevideo"
                class="instance-video"
              ></video>
            </div>
          </div>
        </div>
      </div>
      <el-dialog
        v-model="showVideo"
        width="640px"
        align-center
        class="video-dlg"
        destroy-on-close
      >
        <video
          id="video"
          height="500"
          controls="controls"
          :src="taichuvideo1"
          class="home-video"
        ></video>
      </el-dialog>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.wrapper {
  margin: 0 auto;
  max-width: 1416px;
  padding-bottom: 64px;
  @media screen and (max-width: 820px) {
    padding: 16px 16px 40px;
    background: #f5f6f8;
  }
}
.taichu-wrap {
  padding-top: 120px;
  margin: 0 auto;
  max-width: 1448px;
  @media screen and (max-width: 1080px) {
    padding: 0;
  }
  .taichu-bread {
    margin-bottom: 40px;
    @media screen and (max-width: 1080px) {
      display: none;
    }
    .el-breadcrumb {
      height: 21px;
      line-height: 21px;
      .el-breadcrumb__item {
        :deep(.el-breadcrumb__inner.is-link) {
          color: #555;
          font-weight: 400;
          &:hover {
            color: #0d8dff;
          }
        }
        :deep(.el-breadcrumb__separator.el-icon) {
          color: #555;
        }
      }
      :deep(.el-breadcrumb__item:last-child .el-breadcrumb__inner) {
        color: #000;
      }
    }
  }
  @media screen and (max-width: 1080px) {
    padding-top: 62px;
  }
  .taichu-banner {
    padding: 40px;
    background-color: #fff;
    display: flex;
    border-radius: 16px;
    @media screen and (max-width: 1080px) {
      padding: 16px;
    }
    .banner-left {
      margin-right: 40px;
      @media screen and (max-width: 1080px) {
        display: none;
      }
      img {
        width: 416px;
        height: 100%;
        border-radius: 16px;
      }
    }
    .banner-right {
      .banner-title {
        line-height: 48px;
        font-size: 36px;
        color: #000000;
        margin-bottom: 16px;
        @media screen and (max-width: 820px) {
          font-size: 16px;
          line-height: 24px;
          font-weight: 300;
          margin-bottom: 16px;
        }
        @media screen and (max-width: 768px) {
          margin-bottom: 8px;
        }
      }

      .banner-content {
        font-size: 14px;
        color: #555555;
        line-height: 22px;
        margin-bottom: 54px;
        @media screen and (max-width: 820px) {
          margin-bottom: 16px;
          font-size: 12px;
          line-height: 18px;
          font-weight: 400;
        }
      }
      .banner-btn {
        .o-button {
          &:first-child {
            margin-right: 24px;
          }
        }
      }
    }
  }
}
.taichu-detail {
  margin-top: 40px;
  padding: 40px 80px;
  background-color: #fff;
  border-radius: 16px;
  @media screen and (max-width: 820px) {
    padding: 16px 16px 24px;
  }
  .taichu-detail-intro {
    @media screen and (max-width: 767px) {
      margin-bottom: 24px;
    }
    .intro-title {
      height: 32px;
      font-size: 24px;
      font-weight: 500;
      color: #000000;
      line-height: 32px;
      margin-bottom: 24px;
      @media screen and (max-width: 767px) {
        font-size: 14px;
        color: #000000;
        line-height: 22px;
        height: 22px;
        margin-bottom: 8px;
      }
    }
    .intro-info {
      font-size: 14px;
      font-weight: normal;
      color: #555555;
      line-height: 22px;
      @media screen and (max-width: 767px) {
        font-size: 12px;
        font-weight: 400;
        color: #555555;
        line-height: 18px;
      }
    }
    .info1 {
      margin-bottom: 16px;
    }
    .intro-body {
      padding: 24px 128px;
      margin-top: 40px;
      margin-bottom: 24px;
      background-color: #f5f9f8;
      @media screen and (max-width: 767px) {
        padding: 0;
        margin-top: 16px;
      }
      &-title {
        line-height: 28px;
        font-size: 20px;
        color: #000000;
        margin-bottom: 24px;
        text-align: center;
        @media screen and (max-width: 767px) {
          font-size: 14px;
          color: #000000;
          line-height: 22px;
          padding: 24px 8px 0;
          margin-bottom: 16px;
        }
      }
      &-diagram {
        display: flex;
        justify-content: space-between;
        @media screen and (max-width: 820px) {
          flex-direction: column;
          align-items: center;
        }
        @media screen and (max-width: 767px) {
          flex-direction: column;
          margin-bottom: 34px;
        }
        .diagram-left {
          max-width: 213px;
          @media screen and (max-width: 767px) {
            height: 234px;
            margin: 0 auto 16px;
          }
        }
        .diagram-right {
          display: flex;
          @media screen and (max-width: 820px) {
            margin-top: 24px;
          }
          @media screen and (max-width: 767px) {
            flex-direction: column;
            margin-top: 16px;
          }
          .text {
            img {
              display: block;
              width: 177px;
              margin-bottom: 24px;
              @media screen and (max-width: 767px) {
                margin-bottom: 16px;
                width: 100%;
                height: 82px;
              }
            }
            p {
              height: 14px;
              line-height: 14px;
              font-size: 12px;
              color: #000000;
              text-align: center;
              @media screen and (max-width: 767px) {
                height: 14px;
                font-size: 12px;
                color: #000000;
                line-height: 14px;
                margin-bottom: 24px;
              }
            }
          }
          .diagram-video {
            width: 198px;
            height: 90px;
            margin-left: 24px;
            @media screen and (max-width: 767px) {
              height: 100%;
              width: 100%;
              margin: 0;
            }
            &-img {
              width: 100%;
              margin-bottom: 24px;
              position: relative;
              cursor: pointer;
              @media screen and (max-width: 767px) {
                margin-bottom: 16px;
                &:nth-child(2) {
                  margin-bottom: 8px;
                }
              }

              img {
                width: 100%;
              }
              .video-img1 {
                @media screen and (max-width: 767px) {
                  height: 127px;
                }
              }
              .video-img2 {
                width: 36px;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 1;
              }
            }
            p {
              height: 14px;
              line-height: 14px;
              font-size: 12px;
              color: #000000;
              text-align: center;
              @media screen and (max-width: 767px) {
                height: 14px;
                font-size: 12px;
                color: #000000;
                line-height: 14px;
                margin-bottom: 24px;
              }
            }
          }
        }
      }
    }
    .intro-img {
      @media screen and (max-width: 767px) {
        display: none;
      }
      img {
        width: 100%;
      }
    }
    .intro-img-mobile {
      display: none;
      width: 100%;
      img {
        width: 100%;
      }
      @media screen and (max-width: 767px) {
        display: block;
      }
    }
  }
  .taichu-detail-reference {
    .reference-title {
      height: 28px;
      line-height: 28px;
      font-size: 20px;
      color: #000000;
      margin-top: 40px;
      @media screen and (max-width: 767px) {
        margin: 0 0 8px;
        font-size: 14px;
        font-weight: 400;
        color: #000000;
        line-height: 22px;
        height: 22px;
      }
    }
    .reference-info {
      line-height: 22px;
      font-size: 14px;
      font-weight: 400;
      color: #555555;
      margin: 16px 0 24px;
      @media screen and (max-width: 767px) {
        height: 100%;
        font-size: 12px;
        font-weight: 400;
        color: #555555;
        line-height: 18px;
        margin: 0 0 16px;
      }
    }
    .reference-video {
      width: 100%;
      height: 707px;
      position: relative;
      margin-top: 16px;
      @media screen and (max-width: 1080px) {
        height: 100%;
        margin-bottom: 24px;
        margin-top: 16px;
      }
      @media screen and (max-width: 767px) {
        height: 167px;
      }
      .video-img1 {
        width: 100%;
        height: 100%;
      }
      .video-img2 {
        width: 100%;
        text-align: center;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 9;
        cursor: pointer;
        img {
          @media screen and (max-width: 767px) {
            height: 56px;
            width: 56px;
          }
        }
        div {
          height: 28px;
          font-size: 20px;
          color: #ffffff;
          line-height: 28px;
          margin-top: 16px;
          margin-bottom: 6px;
          @media screen and (max-width: 767px) {
            height: 22px;
            font-size: 14px;
            color: #ffffff;
            line-height: 22px;
          }
        }
        p {
          height: 22px;
          font-size: 14px;
          color: #ffffff;
          line-height: 22px;
          @media screen and (max-width: 767px) {
            height: 20px;
            font-size: 12px;
            font-family: FZLTHJW--GB1-0, FZLTHJW--GB1;
            font-weight: normal;
            color: #ffffff;
            line-height: 20px;
          }
        }
      }
      .video-content {
        width: 100%;
        height: 100%;
        position: relative;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 10;
        .close-btn {
          height: 100px;
          position: absolute;
          right: 16px;
          top: 16px;
          width: 22px;
          height: 22px;
          z-index: 99;
          color: #fff;
          cursor: pointer;
        }
        video {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  .taichu-detail-instance {
    .instance-title {
      height: 28px;
      line-height: 28px;
      font-size: 20px;
      font-weight: 400;
      color: #000000;
      margin: 40px 0 16px;
      @media screen and (max-width: 767px) {
        margin: 0 0 8px;
        height: 22px;
        font-size: 14px;
        font-weight: 400;
        color: #000000;
        line-height: 22px;
      }
    }
    .instance-info {
      line-height: 22px;
      font-size: 14px;
      font-weight: 400;
      color: #555555;
      @media screen and (max-width: 767px) {
        font-size: 12px;
        font-weight: 400;
        color: #555555;
        line-height: 18px;
        margin-bottom: 16px;
      }
    }
    .instance-desc {
      &-title {
        height: 28px;
        line-height: 28px;
        font-size: 20px;
        font-weight: 600;
        color: #000000;
        text-align: center;
        margin: 40px 0 6px;
        @media screen and (max-width: 767px) {
          height: 22px;
          font-size: 14px;
          font-family: FZLTZHJW--GB1-0, FZLTZHJW--GB1;
          font-weight: normal;
          color: #000000;
          line-height: 22px;
          margin: 0 0 8px;
        }
      }
      &-title2 {
        height: 22px;
        line-height: 22px;
        font-size: 14px;
        font-weight: 400;
        color: #555555;
        text-align: center;
        margin-bottom: 26px;
        @media screen and (max-width: 767px) {
          height: 18px;
          font-size: 12px;
          font-weight: 400;
          color: #555555;
          line-height: 18px;
          margin-bottom: 13px;
        }
      }
      .mobile-challenge {
        display: none;
        img {
          width: 100%;
          margin-bottom: 16px;
          &:nth-child(3) {
            margin-bottom: 26px;
          }
        }
        @media screen and (max-width: 767px) {
          display: block;
        }
      }
      .challenges {
        display: flex;
        justify-content: center;
        @media screen and (max-width: 820px) {
          flex-direction: column;
          margin-bottom: 26px;
          display: none;
        }
        &-item {
          height: 136px;
          padding: 17px 16px;
          align-items: center;
          background: #f5f9fb;
          margin-right: 16px;
          display: flex;
          @media screen and (max-width: 820px) {
            margin-right: 0;
            margin-bottom: 16px;
            &:last-child {
              margin-bottom: 0;
            }
          }
          &:last-child {
            margin-right: 0;
          }
          .challenges-item-left {
            text-align: center;
            padding-right: 16px;
            border-right: 1px solid #eee;
            &-num {
              height: 48px;
              line-height: 48px;
              font-size: 40px;
              font-weight: 600;
              color: #999999;
            }
            &-title {
              height: 24px;
              line-height: 24px;
              font-size: 14px;
              font-weight: 500;
              color: #000000;
            }
          }
          .challenges-item-right {
            padding-left: 16px;
            .top {
              display: flex;
              align-items: center;
              .top-strip {
                width: 90px;
                height: 24px;
                background: #0d8dff;
                margin-right: 10px;
              }
              .strip {
                width: 152px;
              }
              .top-total {
                .title1 {
                  height: 22px;
                  line-height: 22px;
                  font-size: 14px;
                  font-weight: 400;
                  color: #000000;
                }
                .title2 {
                  height: 18px;
                  line-height: 18px;
                  font-size: 12px;
                  font-weight: 400;
                  color: #555555;
                }
              }
            }
            .bottom {
              margin-top: 10px;
              display: flex;
              align-items: center;
              .bottom-strip {
                width: 21px;
                height: 24px;
                background: #ff7f0d;
                margin-right: 12px;
              }
              .strip {
                width: 15px;
              }
              .bottom-title {
                height: 22px;
                line-height: 22px;
                font-size: 14px;
                font-weight: 400;
                color: #000000;
              }
            }
            .difference-arr {
              display: flex;
              .difference-item {
                display: flex;
                align-items: center;
                margin-left: 20px;
                .color-block {
                  width: 12px;
                  height: 12px;
                  background: #0d8dff;
                  margin-right: 4px;
                }
                .text-block {
                  height: 22px;
                  line-height: 22px;
                  font-size: 12px;
                  font-weight: 400;
                  color: #000000;
                }
              }
            }
          }
        }
      }
    }
    .instance-AIdesc {
      &-title {
        height: 28px;
        line-height: 28px;
        font-size: 20px;
        font-weight: 600;
        color: #000000;
        text-align: center;
        margin: 40px 0 6px;
        @media screen and (max-width: 767px) {
          margin: 0 0 8px;
          height: 22px;
          font-weight: normal;
          font-size: 14px;
          color: #000000;
          line-height: 22px;
        }
      }
      &-title1 {
        height: 22px;
        line-height: 22px;
        font-size: 14px;
        font-weight: 400;
        color: #555555;
        margin-bottom: 26px;
        text-align: center;
        @media screen and (max-width: 767px) {
          height: 18px;
          font-size: 12px;
          font-weight: 400;
          color: #555555;
          line-height: 18px;
          margin-bottom: 16px;
        }
      }
      &-title2 {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 18px;
        @media screen and (max-width: 767px) {
          display: none;
        }
        li {
          display: flex;
          align-items: center;
          span {
            height: 22px;
            line-height: 22px;
            font-size: 14px;
            font-weight: 400;
            color: #555555;
          }
          img {
            width: 30px;
            margin: 0 16px;
          }
        }
      }
      &-img {
        img {
          width: 100%;
          padding-bottom: 26px;
          border-bottom: 1px solid #eee;
        }
        @media screen and (max-width: 767px) {
          display: none;
        }
      }
      &-companyimg {
        display: block;
        width: 421px;
        margin: 52px auto 64px;
        @media screen and (max-width: 767px) {
          display: none;
        }
      }
      &-fixImage {
        display: none;
        @media screen and (max-width: 767px) {
          display: block;
          width: 100%;
          margin-bottom: 23px;
        }
      }
      &-video {
        // width: 100%;
        height: 707px;
        background-color: #bfa;
        position: relative;
        @media screen and (max-width: 820px) {
          height: 100%;
        }
        @media screen and (max-width: 767px) {
          width: 100%;
          max-height: 30vh;
        }
        .video-img1 {
          width: 100%;
          height: 100%;
        }
        .video-img2 {
          width: 100%;
          text-align: center;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 9;
          cursor: pointer;
          @media screen and (max-width: 767px) {
            img {
              width: 56px;
              height: 56px;
            }
          }
        }
        .video-content {
          width: 100%;
          height: 100%;
          position: relative;
          position: absolute;
          z-index: 10;
          top: 0;
          left: 0;
          .close-btn {
            position: absolute;
            right: 16px;
            top: 16px;
            width: 22px;
            height: 22px;
            z-index: 99;
            color: #fff;
            cursor: pointer;
          }
          video {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
}
:deep(.el-dialog) {
  video {
    width: 100%;
    @media screen and (max-width: 767px) {
      width: 100%;
      height: 40vh;
    }
  }
}
</style>
