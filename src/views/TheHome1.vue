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

const galleryPic = [
  {
    img: 'https://big-model-deploy.obs.cn-central-221.ovaijisuan.com/wukong-huahua/AI-gallery/featured-gallery/上海陆家嘴 未来城市 科幻风格-00.png',
    desc: '上海陆家嘴 未来城市 科幻风格',
  },
  {
    img: 'https://big-model-deploy.obs.cn-central-221.ovaijisuan.com/wukong-huahua/AI-gallery/featured-gallery/华为 大厦 晴朗 写实-00.png',
    desc: '华为 大厦 晴朗 写实',
  },
  {
    img: 'https://big-model-deploy.obs.cn-central-221.ovaijisuan.com/wukong-huahua/AI-gallery/featured-gallery/西湖 美景-00.jpg',
    desc: '西湖 美景',
  },
  {
    img: 'https://big-model-deploy.obs.cn-central-221.ovaijisuan.com/wukong-huahua/AI-gallery/featured-gallery/星河欲坠时-00.jpg',
    desc: '星河欲坠时',
  },
  {
    img: 'https://big-model-deploy.obs.cn-central-221.ovaijisuan.com/wukong-huahua/AI-gallery/featured-gallery/水彩 山水-00.jpg',
    desc: '水彩 山水',
  },
  {
    img: 'https://big-model-deploy.obs.cn-central-221.ovaijisuan.com/wukong-huahua/AI-gallery/gallery/莫奈 撑阳伞的女人 月亮 梦幻-00.png',
    desc: '莫奈 撑阳伞的女人 月亮 梦幻',
  },
  {
    img: 'https://big-model-deploy.obs.cn-central-221.ovaijisuan.com/wukong-huahua/AI-gallery/featured-gallery/极地 极光-00.jpg',
    desc: '极地 极光',
  },
  {
    img: 'https://big-model-deploy.obs.cn-central-221.ovaijisuan.com/wukong-huahua/AI-gallery/featured-gallery/来自深渊 风景 绘画 写实风格-01.png',
    desc: '来自深渊 风景 绘画 写实风格',
  },
  {
    img: 'https://big-model-deploy.obs.cn-central-221.ovaijisuan.com/wukong-huahua/AI-gallery/featured-gallery/孤舟 江景-00.jpg',
    desc: '孤舟 江景',
  },
  {
    img: 'https://big-model-deploy.obs.cn-central-221.ovaijisuan.com/wukong-huahua/AI-gallery/featured-gallery/街道 新海诚-00.png',
    desc: '街道 新海诚',
  },
];
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
  // if (screenWidth.value > 1440) {
  let a = (screenWidth.value - 32) / 1440;
  swiperGally.value.children[2].style.zoom = a;
  // }
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
        <div class="center-img">
          <img :src="project" alt="" />
        </div>
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
        <swiper-slide v-for="item in galleryPic" :key="item">
          <img :src="item.img" />
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
      @media screen and (max-width: 820px) {
        height: 300px;
      }
    }
    .swiper-pagination {
      bottom: 50px;
      @media screen and (max-width: 820px) {
        bottom: 8px;
      }
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
      @media screen and (max-width: 820px) {
        width: 24px;
        height: 2px;
        overflow: hidden;
        margin: 0 4px;
      }
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
  @media screen and (max-width: 820px) {
    font-size: 14px;
    line-height: 22px;
  }
}
.introduce {
  font-size: 18px;
  line-height: 24px;
  color: #555555;
  margin: 24px auto 40px;
  @media screen and (max-width: 820px) {
    width: auto !important;
    font-size: 12px;
    line-height: 18px;
    color: #000;
    margin: 4px auto 16px;
  }
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
  @media screen and (max-width: 820px) {
    padding-bottom: 40px;
  }
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
    @media screen and (max-width: 820px) {
      flex-direction: column;
    }
  }
  .img-box {
    padding: 24px;
    background-color: #f2f7fb;
    border-radius: 10px;
    img {
      width: 124px;
    }
    @media screen and (max-width: 820px) {
      padding: 18px;
      img {
        width: 100%;
      }
    }
  }
  .card-right {
    margin-left: 16px;
    @media screen and (max-width: 820px) {
      margin-left: 4px;
    }
    p {
      margin-top: 12px;
      font-size: 20px;
      line-height: 28px;
      text-align: left;
      @media screen and (max-width: 820px) {
        font-size: 14px;
      }
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
      @media screen and (max-width: 820px) {
        display: none;
      }
    }
  }
  .introduce {
    margin-bottom: 94px;
    @media screen and (max-width: 820px) {
      margin-bottom: 16px;
    }
  }
  .top-img,
  .middle-img,
  .bottom-img {
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    @media screen and (max-width: 820px) {
      gap: 8px;
    }
  }
  .top-img,
  .bottom-img {
    width: 1415px;
    @media screen and (max-width: 820px) {
      width: auto;
    }
  }
  .middle-img {
    width: 1255px;
    padding: 40px 0;
    @media screen and (max-width: 820px) {
      width: auto;
      padding: 8px 0;
    }
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
    @media screen and (max-width: 820px) {
      position: unset;
      transform: none;
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
  @media screen and (max-width: 820px) {
    background: url(@/assets/imgs/home1/mobile-modelzoo.png);
    background-size: cover;
    background-position: 50%;
    padding: 40px 16px;
  }
  .introduce {
    width: 909px;
  }
  .modelzoo-contant {
    display: flex;
    max-width: 1440px;
    margin: 0 auto;
    @media screen and (max-width: 820px) {
      // flex-direction: column;
      flex-wrap: wrap;
    }
    .item + .item {
      margin-left: 24px;
      @media screen and (max-width: 820px) {
        margin-left: 0;
        margin-top: 16px;
      }
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
      @media screen and (max-width: 820px) {
        padding: 6px;
        border-radius: 16px;
      }
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
        @media screen and (max-width: 820px) {
          font-size: 14px;
          line-height: 22px;
          margin: 16px 10px 8px;
        }
      }
      .modelzoo-introduce {
        font-size: 14px;
        margin-left: 12px;
        margin-bottom: 12px;
        @media screen and (max-width: 820px) {
          font-size: 12px;
          color: #555555;
          margin-left: 10px;
          margin-bottom: 3px;
        }
      }
    }
    img {
      width: 100%;
      border-radius: 20px;
      @media screen and (max-width: 820px) {
        border-radius: 16px;
      }
      @media screen and (max-width: 767px) {
        border-radius: 16px;
      }
    }
  }
}
.home-model {
  max-width: 1472px;
  margin: 0 auto;
  padding: 64px 16px 0;
  @media screen and (max-width: 820px) {
    padding-top: 40px;
  }
  .introduce {
    width: 909px;
    margin-bottom: 80px;
    @media screen and (max-width: 820px) {
      margin-bottom: 16px;
    }
  }
  .model-contant {
    display: flex;
    margin-bottom: 64px;
    @media screen and (max-width: 820px) {
      flex-direction: column;
      margin-bottom: 40px;
    }
    .item + .item {
      margin-left: 24px;
      transform: translateY(-40px);
      @media screen and (max-width: 820px) {
        margin-left: 0;
        margin-top: 16px;
        transform: none;
      }
    }
    .item {
      width: 100%;
      background: url(@/assets/imgs/home1/models-bg.png);
      background-size: cover;
      // background-position: 50%;
      padding: 40px;
      position: relative;
      border-radius: 20px;
      @media screen and (max-width: 820px) {
        padding: 16px;
      }
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
      @media screen and (max-width: 820px) {
        font-size: 14px;
        line-height: 22px;
        margin: 16px 0 8px;
      }
    }
    .models-name {
      color: #555555;
      margin-bottom: 52px;
      @media screen and (max-width: 820px) {
        margin-bottom: 36px;
        font-size: 12px;
        line-height: 18px;
      }
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
      @media screen and (max-width: 820px) {
        bottom: 16px;
      }
    }
  }
}
.gallery {
  padding: 64px 0;
  background: url(@/assets/imgs/home1/gallery-bg.png);
  background-size: cover;
  background-position: 50%;
  @media screen and (max-width: 820px) {
    padding: 40px 0;
  }
  .o-button {
    display: block;
    margin: 0 auto;
    margin-top: -20px;
    border-radius: 24px;
    @media screen and (max-width: 820px) {
      margin-top: 16px;
      font-size: 12px;
      padding: 3px;
    }
  }
  .introduce1 {
    margin-bottom: 0;
  }
  :deep(.swiper-gallery) {
    perspective: 1200px;
    max-width: 1440px;
    @media screen and (max-width: 820px) {
      width: 100%;
    }
    .swiper-wrapper {
      transform-style: preserve-3d;
    }
    .swiper-slide {
      width: 365px;
      // @media screen and (max-width: 820px) {
      //   width: 280px;
      // }
      img {
        width: 100%;
      }
    }
  }
  .title1 {
    padding-top: 64px;
    @media screen and (max-width: 820px) {
      padding-top: 40px;
    }
  }
  .introduce2 {
    margin-bottom: 64px;
    @media screen and (max-width: 820px) {
      margin-bottom: 0;
    }
  }
}
.more {
  max-width: 1472px;
  margin: 0 auto;
  padding: 0 16px;
  position: relative;
  :deep(.el-tabs) {
    .el-tabs__header {
      margin: 0px;
      position: absolute;
      max-width: 1440px;
      width: 100%;
      top: -50px;
      z-index: 100;
      @media screen and (max-width: 820px) {
        width: calc(100% - 32px);
        top: -20px;
      }
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
            @media screen and (max-width: 820px) {
              height: 40px;
              font-size: 14px;
              line-height: 22px;
              padding: 0;
            }
            .tabs-title {
              display: flex;
              align-items: center;
              height: 48px;
              img {
                width: 48px;
                @media screen and (max-width: 820px) {
                  width: 24px;
                }
              }
              .o-icon {
                font-size: 48px;
              }
              .tab {
                margin-left: 24px;
                @media screen and (max-width: 820px) {
                  margin-left: 8px;
                }
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
      margin-top: 64px;
      @media screen and (max-width: 820px) {
        flex-direction: column;
        margin-top: 36px;
      }
    }
    .tabs-card + .tabs-card {
      margin-left: 24px;
      @media screen and (max-width: 820px) {
        margin-left: 0;
        margin-top: 16px;
      }
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
      @media screen and (max-width: 820px) {
        margin-bottom: 0;
        padding: 6px;
      }
      .card-name {
        font-size: 24px;
        line-height: 28px;
        margin: 12px 12px;
        position: absolute;
        top: 51px;
        display: flex;
        @media screen and (max-width: 820px) {
          font-size: 18px;
          line-height: 26px;
          height: 26px;
        }
        .tag {
          font-size: 12px;
          line-height: 22px;
          display: inline-block;
          padding: 1px 12px;
          color: #2c2c2c;
          background-color: #ffffff;
          border-radius: 12px;
          margin: 3px 16px;
          @media screen and (max-width: 820px) {
            border-radius: 6px;
          }
        }
      }
      .card-introduce {
        font-size: 14px;
        margin: 24px 12px;
        line-height: 22px;
        height: 44px;
        overflow: hidden;
        @media screen and (max-width: 820px) {
          font-size: 12px;
          line-height: 18px;
          height: 36px;
          margin: 16px 10px;
          overflow: hidden;
          text-overflow: ellipsis;
        }
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
          @media screen and (max-width: 820px) {
            font-size: 12px;
            line-height: 18px;
            padding: 3px 12px;
          }
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
  @media screen and (max-width: 820px) {
    padding: 40px 16px;
  }
  .introduce1 {
    margin-bottom: 40px;
    @media screen and (max-width: 820px) {
    }
  }
  .item-box {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 24px;
    row-gap: 24px;
    @media screen and (max-width: 820px) {
      grid-template-columns: 1fr;
    }
    .item {
      padding: 34px 40px 40px;
      background: url(@/assets/imgs/home1/industry-card-bg.png);
      background-color: #fff;
      border-radius: 16px;
      background-size: cover;
      @media screen and (max-width: 820px) {
        padding: 16px;
      }
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
      @media screen and (max-width: 820px) {
        font-size: 14px;
        line-height: 22px;
      }
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
      @media screen and (max-width: 820px) {
        width: 24px;
        height: 24px;
      }
    }
    .intro {
      line-height: 24px;
      color: #555555;
      margin-left: 64px;
      @media screen and (max-width: 820px) {
        font-size: 12px;
        margin-left: 32px;
      }
    }
  }
}
</style>
