<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
// import BScroll from '@better-scroll/core';
// import Slide from '@better-scroll/slide';
// import MouseWheel from '@better-scroll/mouse-wheel';

import OButton from '@/components/OButton.vue';
import AppFooter from '@/components/AppFooter.vue';

import IconArrowRight from '~icons/app/arrow-right.svg';
import homePageImg from '@/assets/imgs/home-page.png';
import digitRecognition from '@/assets/imgs/digit-recognition.png';
import imageRcognition from '@/assets/imgs/image-rcognition.png';
import emtionalNalysis from '@/assets/imgs/emtional-nalysis.png';
import models1 from '@/assets/imgs/models1.png';
import models2 from '@/assets/imgs/models2.png';
import models3 from '@/assets/imgs/models3.png';
import models4 from '@/assets/imgs/models4.png';
import datasetPageImg from '@/assets/imgs/dataset-page.png';
import slideImg from '@/assets/imgs/slide.png';

import { useLoginStore, useUserInfoStore } from '@/stores';
import { goAuthorize, LOGIN_STATUS } from '@/shared/login';

// BScroll.use(Slide);
// BScroll.use(MouseWheel);

const DOMAIN = import.meta.env.VITE_DOMAIN;

const router = useRouter();
const hoemVideo =
  'https://obs-xihe-beijing4.obs.cn-north-4.myhuaweicloud.com/xihe-img/video/mindSpore%20AI%20%E5%BC%80%E5%8F%91%E5%B9%B3%E5%8F%B0%E9%A6%96%E9%A1%B5banner.mp4';

const homeIns = ref(null);
const homeTitle = '昇思羲和AI开发平台';
const homeDesc = 'The Best AI Platform For MindSpore';
const quickStartLabel = '快速开始';
const i18n = {
  mouse: '滑动鼠标探索更多',
  home: {
    title: '个人主页',
    introduce: '在个人主页开启探索、创建、收藏羲和项目、模型、数据集之旅。',
  },
  project: {
    title: '项目',
    introduce:
      '覆盖多领域任务，体验全流程开发，支持用户在线训练和推理可视化，可创建自己的项目空间，详情请点击参考文档。',
    gradio1: '手写数字识别',
    gradio2: '图像识别',
    gradio3: '情感分析',
    more: '探索更多项目',
  },
  model: {
    title: '模型',
    introduce:
      '覆盖全领域主流模型，可体验MindSpore大模型推理API，用户既可下载公开的预训练模型，也可以上传自行训练的模型文件，详情请点击参考文档。',
    models1: '图像分类',
    models2: '目标检测',
    models3: '自然语言处理',
    models4: '推荐',
    more: '探索更多模型',
  },
  dataset: {
    title: '数据集',
    introduce: '包含主流数据集，用户也可上传合规数据集，详情请点击参考文档。',
    quickStartLabel: '更多数据集',
  },
};

const loginStore = useLoginStore();
const userInfo = useUserInfoStore();

// let scroller = ref(null);

function handleBtnClick() {
  const status = loginStore.loginStatus;
  if (status === LOGIN_STATUS.DOING) {
    return;
  } else if (status === LOGIN_STATUS.FAILED || status === LOGIN_STATUS.NOT) {
    goAuthorize();
  } else {
    router.push(`/${userInfo.userName}`);
  }
}
function handleBtnClick2() {
  router.push(`https://${DOMAIN}/datasets`);
}

onMounted(() => {
  // scroller.value = new BScroll(homeIns.value, {
  //   scrollX: false,
  //   scrollY: true,
  //   slide: {
  //     threshold: 0.1,
  //     autoplay: false,
  //     loop: false,
  //     easing: 'ease',
  //     speed: 800,
  //   },
  //   mouseWheel: { discreteTime: 100 },
  //   momentum: false,
  //   bounce: false,
  //   stopPropagation: true,
  // });
});

onUnmounted(() => {
  // scroller.value && scroller.value.destroy();
});
</script>

<template>
  <div ref="homeIns" class="home">
    <video
      muted
      autoplay
      loop
      playsinline
      :src="hoemVideo"
      class="home-video"
    ></video>
    <div class="home-mask"></div>

    <div class="home-content">
      <p class="home-desc">{{ homeDesc }}</p>
      <p class="home-title">{{ homeTitle }}</p>
      <OButton
        type="primary"
        animation
        class="home-btn"
        @click="handleBtnClick"
      >
        {{ quickStartLabel }}
        <template #suffix>
          <OIcon><IconArrowRight /></OIcon>
        </template>
      </OButton>
    </div>
    <!-- <div class="home-content"> -->
    <!-- <div class="home-slide"> -->

    <!-- </div> -->
    <!-- <div class="home-slide">2</div> -->
    <!-- <div class="home-slide">3</div> -->
    <!-- </div> -->
    <div class="home-extend">
      <div class="mouse">
        <img :src="slideImg" alt="" />
        <p>{{ i18n.mouse }}</p>
      </div>
      <div class="home-extend-box">
        <div class="home-extend-home">
          <div class="left">
            <p class="home-title title">{{ i18n.home.title }}</p>
            <p class="home-introduce">{{ i18n.home.introduce }}</p>
            <OButton animation class="home-btn" @click="handleBtnClick">
              {{ quickStartLabel }}
              <template #suffix>
                <OIcon><IconArrowRight /></OIcon>
              </template>
            </OButton>
          </div>
          <img class="right" :src="homePageImg" alt="" />
        </div>
        <div class="home-extend-project">
          <a
            class="gradio card"
            :href="`https://${DOMAIN}/projects/wesley/lenet5_demo`"
          >
            <div class="gradio-header">
              <img :src="digitRecognition" alt="" />
            </div>
            <div class="gradio-body title">
              <p>{{ i18n.project.gradio1 }}</p>
              <p class="arrow">
                <OIcon><IconArrowRight /></OIcon>
              </p>
            </div>
            <div class="gradio-footer">
              <div class="task">Mnist</div>
            </div>
          </a>
          <a
            class="gradio card"
            :href="`https://${DOMAIN}/projects/drizzlezyk/ResNet50`"
          >
            <div class="gradio-header">
              <img :src="imageRcognition" alt="" />
            </div>
            <div class="gradio-body title">
              <p>{{ i18n.project.gradio2 }}</p>
              <p class="arrow">
                <OIcon><IconArrowRight /></OIcon>
              </p>
            </div>
            <div class="gradio-footer">
              <div class="task">CV</div>
            </div>
          </a>
          <a
            class="gradio card"
            :href="`https://${DOMAIN}/projects/wesley/lstm_demo`"
          >
            <div class="gradio-header">
              <img :src="emtionalNalysis" alt="" />
            </div>
            <div class="gradio-body title">
              <p>{{ i18n.project.gradio3 }}</p>
              <p class="arrow">
                <OIcon><IconArrowRight /></OIcon>
              </p>
            </div>
            <div class="gradio-footer">
              <div class="task">NLP</div>
            </div>
          </a>
          <a class="more card" :href="`https://${DOMAIN}/projects`">
            <p class="more-title title">{{ i18n.project.title }}</p>
            <p class="more-introduce">{{ i18n.project.introduce }}</p>
            <p class="more-footer">
              {{ i18n.project.more }}<OIcon><IconArrowRight /></OIcon>
            </p>
          </a>
        </div>
        <div class="home-extend-model">
          <a class="more card" :href="`https://${DOMAIN}/models`">
            <p class="more-title title">{{ i18n.model.title }}</p>
            <p class="more-introduce">{{ i18n.model.introduce }}</p>
            <p class="more-footer">
              {{ i18n.model.more }}<OIcon><IconArrowRight /></OIcon>
            </p>
          </a>
          <div class="models card">
            <img :src="models1" alt="" />
            <p class="models-type title">
              {{ i18n.model.models1 }}<OIcon><IconArrowRight /></OIcon>
            </p>
            <p class="models-label">VGG16｜ResNet-101｜InceptionV4 …</p>
            <div class="models-footer">
              <div class="task">CV</div>
            </div>
          </div>
          <div class="models card">
            <img :src="models2" alt="" />
            <p class="models-type title">
              {{ i18n.model.models2 }}<OIcon><IconArrowRight /></OIcon>
            </p>
            <p class="models-label">YOLOv5｜SSD ｜MobileNet …</p>
            <div class="models-footer">
              <div class="task">CV</div>
            </div>
          </div>
          <div class="models card">
            <img :src="models3" alt="" />
            <p class="models-type title">
              {{ i18n.model.models3 }}<OIcon><IconArrowRight /></OIcon>
            </p>
            <p class="models-label">BERT｜GRU｜Transformer …</p>
            <div class="models-footer">
              <div class="task">NLP</div>
            </div>
          </div>
          <div class="models card">
            <img :src="models4" alt="" />
            <p class="models-type title">
              {{ i18n.model.models4 }}<OIcon><IconArrowRight /></OIcon>
            </p>
            <p class="models-label">DeepFM｜Wide&Deep｜NCF …</p>
            <div class="models-footer">
              <div class="task">Recommendation</div>
            </div>
          </div>
        </div>
        <div class="home-extend-dataset">
          <img class="left" :src="datasetPageImg" alt="" />
          <div class="right">
            <p class="home-title title">{{ i18n.dataset.title }}</p>
            <p class="home-introduce">{{ i18n.dataset.introduce }}</p>
            <OButton animation class="home-btn" @click="handleBtnClick2">
              {{ i18n.dataset.quickStartLabel }}
              <template #suffix>
                <OIcon><IconArrowRight /></OIcon>
              </template>
            </OButton>
          </div>
        </div>
      </div>
    </div>
    <footer class="app-footer">
      <app-footer></app-footer>
    </footer>
  </div>
</template>

<style lang="scss" scoped>
a {
  color: #555555;
}
.title {
  color: #000000;
}
.home-extend {
  color: #555555;
  background-color: #f5f6f8;
  position: relative;
  .mouse {
    position: absolute;
    top: -141px;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    img {
      width: 44px;
    }
    p {
      color: #ffffff;
      margin-top: 13px;
    }
  }
}
.home {
  position: relative;
  width: 100%;
  height: 100vh;
  background-color: #0f1927;

  &-video {
    position: absolute;
    z-index: 0;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    object-fit: cover;
    height: 100vh;
    pointer-events: none;
  }

  .home-mask {
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: rgba($color: #000000, $alpha: 0.35);
    pointer-events: none;
  }

  &-content {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 80px;
    color: #ffffff;
    overflow-y: hidden;
    z-index: 2;

    .home-desc {
      font-size: 44px;
      font-weight: bold;
      color: #ffffff;
      line-height: 52px;
    }

    .home-title {
      height: 45px;
      font-size: 32px;
      font-weight: 400;
      color: #ffffff;
      line-height: 45px;
      margin-top: 20px;
    }

    .home-btn {
      margin-top: 45px;
    }
  }
  &-extend {
    display: flex;
    justify-content: center;
    padding: 0 16px;
    &-box {
      max-width: 1440px;
      width: 100%;
      .more {
        background-color: #ffffff;
        width: 537px;
        &-title {
          margin: 40px 16px 16px 40px;
          font-size: 54px;
        }
        &-introduce {
          margin: 0 40px;
          font-size: 16px;
        }
        &-footer {
          margin: 114px 40px 40px;
          display: flex;
          align-items: center;
          .o-icon {
            margin-left: 8px;
            color: #5eb3ff;
            font-weight: 500;
          }
        }
      }
    }
    &-home {
      margin: 128px auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left {
        .home-title {
          font-size: 54px;
        }
        .home-introduce {
          font-size: 16px;
          margin-bottom: 48px;
        }
      }
      .right {
        width: 879px;
      }
    }
    &-project {
      display: flex;
      .gradio {
        background-color: #ffffff;
        margin-right: 24px;
        &-header {
          background-color: #2e3959;
          img {
            width: 277px;
          }
        }
        &-body {
          margin: 24px 28px 0 24px;
          padding-bottom: 16px;
          font-size: 24px;
          display: flex;
          justify-content: space-between;
          .arrow {
            display: flex;
            align-items: center;
          }
          border-bottom: 0.5px solid #555555;
        }
        &-footer {
          margin: 15px 15px 24px 24px;
          display: flex;
          .task {
            padding: 3px 8px;
            background: #efefef;
          }
        }
      }
    }
    &-model {
      margin-top: 64px;
      display: flex;
      .more {
        width: 448px;
        &-footer {
          margin-top: 50px;
        }
      }
      .models {
        margin-left: 24px;
        background-color: #ffffff;
        img {
          width: 80px;
          margin: 48px 72px 24px;
        }
        &-type {
          margin: 0 28px 0 23px;
          padding-bottom: 16px;
          border-bottom: 0.5px solid #555555;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 20px;
        }
        &-label {
          margin: 15px 24px 16px;
          width: 176px;
          color: #555555;
        }
        &-footer {
          margin: 15px 15px 24px 24px;
          display: flex;
          .task {
            padding: 3px 8px;
            background: #efefef;
          }
        }
      }
    }
    &-dataset {
      margin: 128px auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left {
        width: 879px;
      }
      .right {
        .home-title {
          font-size: 54px;
        }
        .home-introduce {
          font-size: 16px;
          margin-bottom: 48px;
        }
      }
    }
    .card {
      box-shadow: 0px 1px 5px 0px rgba(45, 47, 51, 0.1);
      .o-icon {
        transition: all 0.2s linear;
      }
      &:hover {
        cursor: pointer;
        box-shadow: 0px 6px 18px 0px rgba(13, 141, 255, 0.14);
        .o-icon {
          transform: translate(3px);
        }
      }
    }
  }
  // &-content {
  //   height: 100%;
  // }
  // &-slide {
  //   display: flex;
  //   flex-direction: column;
  //   justify-content: center;
  //   align-items: center;
  //   font-size: 80px;
  //   color: #ffffff;
  //   height: 100%;
  //   background-image: url(../assets/home.png);
  //   background-size: cover;
  //   background-repeat: no-repeat;
  // }
}
</style>
