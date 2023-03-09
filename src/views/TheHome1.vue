<script setup>
import { ref, onMounted } from 'vue';

import AOS from 'aos';
import 'aos/dist/aos.css';

import project from '@/assets/imgs/home1/project.png';
import project1 from '@/assets/imgs/home1/project1.png';
import project2 from '@/assets/imgs/home1/project2.png';
import project3 from '@/assets/imgs/home1/project3.png';
import project4 from '@/assets/imgs/home1/project4.png';
import project5 from '@/assets/imgs/home1/project5.png';
import project6 from '@/assets/imgs/home1/project6.png';

import IconUser from '~icons/app/user';
import IconArrowRight from '~icons/app/arrow-right.svg';
import OButton from '@/components/OButton.vue';
import AppFooter from '@/components/AppFooter.vue';
import useWindowResize from '@/shared/hooks/useWindowResize.js';

import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination, Autoplay, Navigation } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { useI18n } from 'vue-i18n';

const { t } = useI18n();

AOS.init();

const modules = [Pagination];
const galleryModules = [Autoplay];
function renderBullet(index, className) {
  let text = '';
  switch (index) {
    case 0:
      text = t('home.BANNER_BUTTON_1');
      break;
    case 1:
      text = t('home.BANNER_BUTTON_2');
      break;
  }
  return '<span class="' + className + '">' + text + '</span>';
}

const screenWidth = useWindowResize();

let slideW = 300;
let radius = (slideW * 0.5) / Math.sin(Math.PI / 20);
function progress(swiper) {
  for (let i = 0; i < swiper.slides.length; i++) {
    let slide = swiper.slides.eq(i);
    let slideProgress = swiper.slides[i].progress;
    let translateX =
      (slideProgress + 1.5) *
        (slideW / 3 -
          (Math.cos((slideProgress + 1.5) * 0.125 * Math.PI) * slideW * 1.1) /
            3.1) -
      10 +
      'px'; //调整图片间距，根据图片宽度改变数值实现自适应
    let rotateY = (slideProgress + 1.5) * 18.5; //图片角度
    let translateZ =
      radius -
      Math.cos((slideProgress + 1.5) * 0.128 * Math.PI) * radius -
      900 +
      'px'; //调整图片远近，刚好4个在画框内
    slide.transform(
      'translateX(' +
        translateX +
        ') translateZ(' +
        translateZ +
        ') rotateY(' +
        rotateY +
        'deg)'
    );
  }
}
function setTransition(swiper, transition) {
  for (let i = 0; i < swiper.slides.length; i++) {
    let slide = swiper.slides.eq(i);
    slide.transition(transition);
  }
}
const swiperGally = ref();
onMounted(() => {
  let a = (screenWidth.value - 32) / 1440;
  swiperGally.value.children[2].style.zoom = a;
});
</script>
<template>
  <div class="wrapper">
    <div class="home-portal">
      <swiper
        :modules="modules"
        :pagination="{ clickable: true, renderBullet: renderBullet }"
        :autoplay="{ disableOnInteraction: false, autoplay: true }"
        loop
        class="swiper-portal"
      >
        <swiper-slide> </swiper-slide>
        <swiper-slide> </swiper-slide>
      </swiper>
    </div>

    <div class="home-project">
      <div class="project-wrapper">
        <p class="title">{{ t('home.AI_LAB.TITLE') }}</p>
        <p class="introduce">{{ t('home.AI_LAB.INTRODUCE') }}</p>
        <div class="top-img">
          <div
            class="project-card"
            data-aos="slide-right"
            :data-aos-duration="500"
            data-aos-offset="200"
          >
            <div class="img-box">
              <img :src="project1" alt="" />
            </div>
            <div class="card-right">
              <p>{{ t('home.AI_LAB.CARDS[0].NAME') }}</p>
              <span>CV</span>
              <div>
                <span class="frame"></span>
                <span class="frame"></span>
                <span class="frame"></span>
                <span class="frame"></span>
              </div>
            </div>
          </div>
          <div
            class="project-card"
            data-aos="slide-left"
            :data-aos-duration="500"
            data-aos-offset="200"
          >
            <div class="img-box">
              <img :src="project2" alt="" />
            </div>
            <div class="card-right">
              <p>{{ t('home.AI_LAB.CARDS[1].NAME') }}</p>
              <span>CV</span>
              <div>
                <span class="frame"></span>
                <span class="frame"></span>
                <span class="frame"></span>
                <span class="frame"></span>
              </div>
            </div>
          </div>
        </div>
        <div class="middle-img">
          <div
            class="project-card"
            data-aos="slide-right"
            :data-aos-duration="550"
            data-aos-offset="200"
          >
            <div class="img-box">
              <img :src="project3" alt="" />
            </div>
            <div class="card-right">
              <p>{{ t('home.AI_LAB.CARDS[2].NAME') }}</p>
              <span>CV</span>
              <div>
                <span class="frame"></span>
                <span class="frame"></span>
                <span class="frame"></span>
                <span class="frame"></span>
              </div>
            </div>
          </div>
          <div
            class="project-card"
            data-aos="slide-left"
            :data-aos-duration="550"
            data-aos-offset="200"
          >
            <div class="img-box">
              <img :src="project4" alt="" />
            </div>
            <div class="card-right">
              <p>{{ t('home.AI_LAB.CARDS[3].NAME') }}</p>
              <span>NLP</span>
              <div>
                <span class="frame"></span>
                <span class="frame"></span>
                <span class="frame"></span>
                <span class="frame"></span>
              </div>
            </div>
          </div>
        </div>
        <div class="bottom-img">
          <div
            class="project-card"
            data-aos="slide-right"
            :data-aos-duration="600"
            data-aos-offset="200"
          >
            <div class="img-box">
              <img :src="project5" alt="" />
            </div>
            <div class="card-right">
              <p>{{ t('home.AI_LAB.CARDS[4].NAME') }}</p>
              <span>NLP</span>
              <div>
                <span class="frame"></span>
                <span class="frame"></span>
                <span class="frame"></span>
                <span class="frame"></span>
              </div>
            </div>
          </div>
          <div
            class="project-card"
            data-aos="slide-left"
            :data-aos-duration="600"
            data-aos-offset="200"
          >
            <div class="img-box">
              <img :src="project6" alt="" />
            </div>
            <div class="card-right">
              <p>{{ t('home.AI_LAB.CARDS[5].NAME') }}</p>
              <span>NLP</span>
              <div>
                <span class="frame"></span>
                <span class="frame"></span>
                <span class="frame"></span>
                <span class="frame"></span>
              </div>
            </div>
          </div>
        </div>
        <div class="center-img">
          <img :src="project" alt="" />
        </div>
      </div>
    </div>
    <div class="home-modelzoo">
      <div class="modelzoo-wrapper">
        <p class="title">{{ t('home.MODELZOO.TITLE') }}</p>
        <p class="introduce">{{ t('home.MODELZOO.INTRODUCE') }}</p>
        <div class="modelzoo-contant">
          <div
            v-for="(item, index) in 4"
            :key="item"
            class="item"
            data-aos="slide-up"
            :data-aos-duration="
              200 + (index === 1 || index === 2 ? 0 : 2) * 100
            "
            data-aos-offset="200"
          >
            <img :src="t(`home.MODELZOO.CARDS[${index}].IMAGE`)" alt="" />
            <div class="modelzoo-name">
              {{ t(`home.MODELZOO.CARDS[${index}].MODELZOO_NAME`) }}
            </div>
            <div class="modelzoo-introduce">
              {{ t(`home.MODELZOO.CARDS[${index}].MODELZOO_DESC`) }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="home-model">
      <p class="title">
        {{ t(`home.MODEL.TITLE`) }}
      </p>
      <p class="introduce">{{ t(`home.MODEL.INTRODUCE`) }}</p>
      <div class="model-contant">
        <div v-for="(item, index) in 4" :key="item" class="item">
          <img :src="t(`home.MODEL.CARDS[${index}].IMAGE`)" alt="" />
          <div class="models-type">
            {{ t(`home.MODEL.CARDS[${index}].MODEL_NAME`) }}
          </div>
          <div class="models-name">
            {{ t(`home.MODEL.CARDS[${index}].CATAGORIES`) }}
          </div>
          <div class="models-tag">
            {{ t(`home.MODEL.CARDS[${index}].TYPE`) }}
          </div>
        </div>
      </div>
    </div>
    <div ref="swiperGally" class="gallery">
      <p class="title">{{ t(`home.GALLARY.TITLE`) }}</p>
      <p class="introduce introduce1">{{ t(`home.GALLARY.INTRODUCE`) }}</p>
      <swiper
        watch-slides-progress
        slides-per-view="auto"
        :modules="galleryModules"
        :autoplay="{
          disableOnInteraction: false,
          autoplay: true,
          pauseOnMouseEnter: true,
        }"
        loop
        :looped-slides="5"
        class="swiper-gallery"
        @progress="progress"
        @set-transition="setTransition"
      >
        <swiper-slide v-for="item in 9" :key="item">
          <img
            src="https://xihe2.test.osinfra.cn/obs-big-model/wukong-huahua/AI-gallery/gallery/MindSpore/1677053755/%E5%86%99%E5%AE%9E/%E6%B7%B1%E6%B8%8A%20%E9%A3%8E%E6%99%AF%20%E7%BB%98%E7%94%BB%20%E5%86%99%E5%AE%9E-00.png"
            alt=""
          />
        </swiper-slide>
      </swiper>
      <OButton animation type="primary" class="gallery-entry">
        {{ t(`home.GALLARY.GALLARY_BUTTON`) }}
        <template #suffix>
          <OIcon><IconArrowRight /></OIcon>
        </template>
      </OButton>
      <p class="title title1">{{ t(`home.SHENGSI_JOURNEY.TITLE`) }}</p>
      <p class="introduce introduce2">
        {{ t(`home.SHENGSI_JOURNEY.INTRODUCE`) }}
      </p>
    </div>

    <div class="more">
      <el-tabs class="more-tabs">
        <el-tab-pane v-for="(item, index) in 3" :key="item">
          <template #label>
            <span class="tabs-title">
              <img
                :src="t(`home.SHENGSI_JOURNEY.TABLISTS[${index}].IMAGE`)"
                alt=""
              />
              <span class="tab">{{
                t(`home.SHENGSI_JOURNEY.TABLISTS[${index}].TAB_TITLE`)
              }}</span>
            </span>
          </template>
          <!-- t(`home.SHENGSI_JOURNEY.TABLISTS[${index}].CARDS`) -->
          <div v-for="(card, i) in 3" :key="card" class="tabs-card">
            <img
              :src="
                t(`home.SHENGSI_JOURNEY.TABLISTS[${index}].CARDS[${i}].IMAGE`)
              "
              alt=""
            />
            <div class="card-name">
              {{
                t(`home.SHENGSI_JOURNEY.TABLISTS[${index}].CARDS[${i}].NAME`)
              }}
              <span class="tag">{{
                t(`home.SHENGSI_JOURNEY.TABLISTS[${index}].CARDS[${i}].TYPE`)
              }}</span>
            </div>
            <div class="card-introduce">
              {{
                t(`home.SHENGSI_JOURNEY.TABLISTS[${index}].CARDS[${i}].DESC`)
              }}
            </div>
            <div class="detail">
              <o-icon><icon-user></icon-user></o-icon>
              <span class="details">{{
                t(`home.SHENGSI_JOURNEY.TABLISTS[${index}].CARDS[${i}].DETAIL`)
              }}</span>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="industy">
      <p class="title">{{ t(`home.INDUSTRY.TITLE`) }}</p>
      <p class="introduce introduce1">{{ t(`home.INDUSTRY.INTRODUCE`) }}</p>
      <div class="item-box">
        <div v-for="(item, index) in 4" :key="item" class="item">
          <div class="name">
            <img :src="t(`home.INDUSTRY.CARDS[${index}].IMAGE`)" alt="" />{{
              t(`home.INDUSTRY.CARDS[${index}].NAME`)
            }}
            <span>{{ item.status }}</span>
          </div>
          <div class="intro">{{ t(`home.INDUSTRY.CARDS[${index}].DESC`) }}</div>
        </div>
      </div>
    </div>
  </div>
  <footer class="app-footer">
    <app-footer></app-footer>
  </footer>
</template>
<style lang="scss" scoped>
:deep(body) {
  overflow-x: hidden;
}
.wrapper {
  background-color: #f5f7fc;
}
.home-portal {
  :deep(.swiper-portal) {
    .swiper-slide {
      height: 100vh;
      background: url(@/assets/imgs/home1/home-banner1.jpg);
      background-size: cover;
      background-position: 50%;
    }
    .swiper-pagination {
      bottom: 50px;
    }
    .swiper-pagination-bullet {
      width: 160px;
      height: 48px;
      line-height: 48px;
      background: rgba(255, 255, 255, 0.75);
      border-radius: 42px;
      backdrop-filter: blur(10px);
      margin: 0 8px;
      font-size: 18px;
      opacity: 1;
    }
    .swiper-pagination-bullet-active {
      background: rgba(13, 141, 255, 0.7);
      color: #fff;
    }
  }
}
p {
  text-align: center;
}
.title {
  font-size: 54px;
  line-height: 76px;
}
.introduce {
  font-size: 18px;
  line-height: 24px;
  color: #555555;
  margin: 24px auto 40px;
}
.home-project {
  background-color: #f8f9fd;
  overflow: hidden;
}
.project-wrapper {
  max-width: 1472px;
  margin: 0 auto;
  padding: 41px 16px 86px;
  position: relative;
  .project-card {
    background-color: #fff;
    display: flex;
    padding: 12px;
    border-radius: 16px;
    max-width: 412px;
    box-shadow: 0px 1px 5px 0px rgba(45, 47, 51, 0.1);
    cursor: pointer;
    &:hover {
      box-shadow: 0px 6px 18px 0px rgba(13, 141, 255, 0.14);
    }
  }
  .img-box {
    padding: 24px;
    background-color: #f2f7fb;
    border-radius: 10px;
    img {
      width: 124px;
    }
  }
  .card-right {
    margin-left: 16px;
    p {
      margin-top: 12px;
      font-size: 20px;
      line-height: 28px;
      text-align: left;
    }
    span {
      display: inline-block;
      margin-top: 12px;
      padding: 3px 8px;
      color: #0d8dff;
      background-color: #e5f3ff;
      border-radius: 10px;
    }
    .frame {
      background-color: #e9edfb;
      width: 80px;
    }
  }

  .introduce {
    margin-bottom: 94px;
  }
  .top-img,
  .middle-img,
  .bottom-img {
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
  }
  .top-img,
  .bottom-img {
    width: 1415px;
  }
  .middle-img {
    width: 1255px;
    padding: 40px 0;
    .project-card:last-child {
      span {
        color: #8071de;
        background-color: #edefff;
      }
    }
  }
  .bottom-img {
    span {
      color: #8071de;
      background-color: #edefff;
    }
  }
  .center-img {
    text-align: center;
    position: absolute;
    transform: translate(-50%, -10%);
    left: 50%;
    top: 50%;
    img {
      width: 332px;
    }
  }
}
.home-modelzoo {
  background: url(@/assets/imgs/home1/modelzoo-bg.png);
  background-size: cover;
  background-position: 50%;
  padding: 80px 16px;
  // background-attachment: fixed;
  // background-size: cover;
  // background-position: center center;
  .introduce {
    width: 909px;
  }
  .modelzoo-contant {
    display: flex;
    max-width: 1440px;
    margin: 0 auto;
    .item + .item {
      margin-left: 24px;
    }
    .item {
      width: 100%;
      background: #fff;
      background-size: cover;
      // background-position: 50%;
      padding: 12px;
      position: relative;
      border-radius: 20px;
      cursor: pointer;
      box-shadow: 0px 1px 5px 0px rgba(45, 47, 51, 0.1);
      &:hover {
        box-shadow: 0px 6px 18px 0px rgba(13, 141, 255, 0.14);
      }
      &:last-child {
        .models-tag {
          color: #e79732;
          background-color: #fcf4ef;
        }
      }
      .modelzoo-name {
        font-size: 20px;
        line-height: 28px;
        margin: 24px 0 12px 12px;
      }
      .modelzoo-introduce {
        font-size: 14px;
        margin-left: 12px;
        margin-bottom: 12px;
      }
    }
    img {
      width: 100%;
      border-radius: 20px;
    }
  }
}
.home-model {
  max-width: 1472px;
  margin: 0 auto;
  padding: 64px 16px 0;
  .introduce {
    width: 909px;
    margin-bottom: 80px;
  }
  .model-contant {
    display: flex;
    margin-bottom: 64px;
    .item + .item {
      margin-left: 24px;
      transform: translateY(-40px);
    }
    .item {
      width: 100%;
      background: url(@/assets/imgs/home1/models-bg.png);
      background-size: cover;
      // background-position: 50%;
      padding: 40px;
      position: relative;
      border-radius: 20px;
      box-shadow: 0px 1px 5px 0px rgba(45, 47, 51, 0.1);
      cursor: pointer;
      &:hover {
        box-shadow: 0px 6px 18px 0px rgba(13, 141, 255, 0.14);
      }
      &:last-child {
        transform: none;
        .models-tag {
          color: #e79732;
          background-color: #fcf4ef;
        }
      }
    }
    img {
      width: 48px;
      height: 48px;
    }
    .models-type {
      font-size: 20px;
      line-height: 28px;
      margin: 16px 0 24px;
    }
    .models-name {
      color: #555555;
      margin-bottom: 52px;
    }
    .models-tag {
      display: inline-block;
      font-size: 12px;
      line-height: 14px;
      margin: 28px 0 3px;
      padding: 3px 8px;
      color: #0d8dff;
      background-color: #e5f3ff;
      border-radius: 10px;
      position: absolute;
      bottom: 40px;
    }
  }
}
.gallery {
  padding: 64px 0;
  background: url(@/assets/imgs/home1/gallery-bg.png);
  background-size: cover;
  background-position: 50%;
  .o-button {
    display: block;
    margin: 0 auto;
    margin-top: -20px;
    border-radius: 24px;
  }
  .introduce1 {
    margin-bottom: 0;
  }
  :deep(.swiper-gallery) {
    perspective: 1200px;
    max-width: 1440px;
    // position: relative;
    // z-index: 1000;
    // zoom: 1.75;
    .swiper-wrapper {
      transform-style: preserve-3d;
    }
    .swiper-slide {
      width: 365px;
      img {
        width: 100%;
      }
    }
  }
  .title1 {
    padding-top: 64px;
  }
  .introduce2 {
    margin-bottom: 64px;
  }
}
.more {
  max-width: 1472px;
  margin: 0 auto;
  padding: 0 16px;
  :deep(.el-tabs) {
    .el-tabs__header {
      margin: 0px;
      position: relative;
      top: -64px;
      .el-tabs__nav-wrap {
        border-radius: 16px;
        backdrop-filter: blur(10px);
        .el-tabs__nav {
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          .el-tabs__active-bar {
            display: none;
          }
          .el-tabs__item {
            height: 80px;
            font-size: 24px;
            line-height: 33px;
            color: #555;
            background: rgba(255, 255, 255, 0.75);
            display: flex;
            justify-content: center;
            align-items: center;
            .tabs-title {
              display: flex;
              align-items: center;
              height: 48px;
              img {
                width: 48px;
              }
              .o-icon {
                font-size: 48px;
              }
              .tab {
                margin-left: 24px;
              }
            }
          }
          .is-active {
            background: rgba(13, 141, 255, 0.65);
            color: #ffffff;
          }
        }
        &::after {
          display: none;
        }
      }
    }
    .el-tab-pane {
      display: flex;
    }
    .tabs-card + .tabs-card {
      margin-left: 24px;
    }
    .tabs-card {
      width: 100%;
      background: #fff;
      background-size: cover;
      // background-position: 50%;
      padding: 12px;
      border-radius: 5%;
      position: relative;
      margin-bottom: 64px;
      box-shadow: 0px 1px 5px 0px rgba(45, 47, 51, 0.1);
      &:hover {
        box-shadow: 0px 6px 18px 0px rgba(13, 141, 255, 0.14);
      }
      .card-name {
        font-size: 24px;
        line-height: 28px;
        margin: 12px 12px;
        position: absolute;
        top: 51px;

        display: flex;
        .tag {
          font-size: 12px;
          line-height: 22px;
          display: inline-block;
          padding: 1px 12px;
          color: #2c2c2c;
          background-color: #ffffff;
          border-radius: 12px;
          margin: 3px 16px;
        }
      }
      .card-introduce {
        font-size: 14px;
        margin: 24px 12px;
      }
      img {
        width: 100%;
      }
      .detail {
        margin: 0 12px 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .details {
          font-size: 14px;
          line-height: 22px;
          padding: 4px 15px;
          color: #0d8dff;
          border: 1px solid #0d8dff;
          border-radius: 16px;
          cursor: pointer;
        }
      }
      .o-icon {
        color: #2c2c2c;
        font-size: 14px;
        line-height: 22px;
        svg {
          vertical-align: text-top;
        }
        &::after {
          content: '2k+';
          margin-left: 8px;
          font-size: 14px;
        }
      }
    }
  }
}
.industy {
  max-width: 1472px;
  margin: 0 auto;
  padding: 0 16px 64px;
  .introduce1 {
    margin-bottom: 40px;
  }
  .item-box {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 24px;
    row-gap: 24px;
    .item {
      padding: 34px 40px 40px;
      background: url(@/assets/imgs/home1/industry-card-bg.png);
      background-color: #fff;
      border-radius: 16px;
      background-size: cover;
      &:first-child {
        box-shadow: 0px 1px 5px 0px rgba(45, 47, 51, 0.1);
        &:hover {
          cursor: pointer;
          box-shadow: 0px 6px 18px 0px rgba(13, 141, 255, 0.14);
          background: url(@/assets/imgs/home1/industy/hover-bg2.png);
          background-size: cover;
        }
        // &:nth-child(2) {
        //   background: url(@/assets/imgs/home1/industy/hover-bg1.png);
        //   background-size: cover;
        // }
        // &:nth-child(3) {
        //   background: url(@/assets/imgs/home1/industy/hover-bg3.png);
        //   background-size: cover;
        // }
        // &:last-child {
        //   background: url(@/assets/imgs/home1/industy/hover-bg4.png);
        //   background-size: cover;
        // }
      }
    }
    .name {
      font-size: 24px;
      margin-bottom: 8px;
      line-height: 48px;
      position: relative;
      span {
        position: absolute;
        right: 0;
        font-size: 14px;
        color: #999999;
      }
    }
    img {
      width: 48px;
      height: 48px;
      margin-right: 16px;
    }
    .intro {
      line-height: 24px;
      color: #555555;
      margin-left: 64px;
    }
  }
}
</style>
