<script setup>
import { ref, onMounted, watch } from 'vue';

import AOS from 'aos';
import 'aos/dist/aos.css';

// import mobile from '@/assets/imgs/home1/mobile-banner1.png';

import project from '@/assets/imgs/home1/project.png';
import project1 from '@/assets/imgs/home1/project1.png';
import project2 from '@/assets/imgs/home1/project2.png';
import project3 from '@/assets/imgs/home1/project3.png';
import project4 from '@/assets/imgs/home1/project4.png';
import project5 from '@/assets/imgs/home1/project5.png';
import project6 from '@/assets/imgs/home1/project6.png';
import logo1 from '@/assets/imgs/home1/logo/logo1.png';
import logo2 from '@/assets/imgs/home1/logo/logo2.png';
import logo3 from '@/assets/imgs/home1/logo/logo3.png';
import logo4 from '@/assets/imgs/home1/logo/logo4.png';
import logo5 from '@/assets/imgs/home1/logo/logo5.png';
import logo6 from '@/assets/imgs/home1/logo/logo6.png';
import logo7 from '@/assets/imgs/home1/logo/logo7.png';
import logo8 from '@/assets/imgs/home1/logo/logo8.png';
import logo9 from '@/assets/imgs/home1/logo/logo9.png';
import logo10 from '@/assets/imgs/home1/logo/logo10.png';
import logo11 from '@/assets/imgs/home1/logo/logo11.png';
import logo12 from '@/assets/imgs/home1/logo/logo12.png';
import logo13 from '@/assets/imgs/home1/logo/logo13.png';
import logo14 from '@/assets/imgs/home1/logo/logo14.png';
import logo15 from '@/assets/imgs/home1/logo/logo15.png';
import logo16 from '@/assets/imgs/home1/logo/logo16.png';
import logo17 from '@/assets/imgs/home1/logo/logo17.png';
import logo18 from '@/assets/imgs/home1/logo/logo18.png';
import logo19 from '@/assets/imgs/home1/logo/logo19.png';
import logo20 from '@/assets/imgs/home1/logo/logo20.png';
import logo21 from '@/assets/imgs/home1/logo/logo21.png';
import logo22 from '@/assets/imgs/home1/logo/logo22.png';
import logo23 from '@/assets/imgs/home1/logo/logo23.png';
import logo24 from '@/assets/imgs/home1/logo/logo24.png';
import logo25 from '@/assets/imgs/home1/logo/logo25.png';
import logo26 from '@/assets/imgs/home1/logo/logo26.png';
import logo27 from '@/assets/imgs/home1/logo/logo27.png';

import IconUser from '~icons/app/user';
import IconArrowRight from '~icons/app/arrow-right.svg';
import OButton from '@/components/OButton.vue';
import AppFooter from '@/components/AppFooter.vue';
import useWindowResize from '@/shared/hooks/useWindowResize.js';

import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination, Autoplay, FreeMode } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/free-mode';
import { useRoute, useRouter } from 'vue-router';

import { getHomeInfo } from '@/api/api-shared';

import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n();

AOS.init();

const modules = [Pagination, Autoplay];
const galleryModules = [Autoplay, FreeMode];
const logoModules = [FreeMode, Autoplay];
function renderBullet(index, className) {
  let text = '';
  switch (index) {
    case 0:
      text = t('home.BANNER_BUTTON_1');
      break;
    // case 1:
    //   text = t('home.BANNER_BUTTON_3');
    //   break;
    case 1:
      text = t('home.BANNER_BUTTON_2');
      break;
  }
  return '<span class="' + className + '">' + text + '</span>';
}
// function goDetail() {
//   window.open('https://mp.weixin.qq.com/s/NGDfY-2vuDi33HZc1-Y2sw', '_blank');
// }

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
  if (screenWidth.value > 820) {
    let a = (screenWidth.value - 32) / 1440;
    swiperGally.value.children[2].style.zoom = a;
  }
});
watch(
  () => screenWidth.value,
  () => {
    if (screenWidth.value > 820) {
      let a = (screenWidth.value - 32) / 1440;
      swiperGally.value.children[2].style.zoom = a;
    }
  }
);
const picDialog = ref(false);
const picSrc = ref({
  img: 'https://big-model-deploy.obs.cn-central-221.ovaijisuan.com/wukong-huahua/AI-gallery/featured-gallery/星河欲坠时-00.jpg',
  desc: '星河欲坠时',
});
function taggleDialog(pic) {
  picDialog.value = true;
  picSrc.value = pic;
}
function toIndusty(path) {
  if (path === '/') {
    return;
  } else {
    router.push(path);
  }
}

const route = useRoute();
const router = useRouter();

const homeInfo = ref([
  [{ count: 0 }, { count: 0 }, { count: 0 }],
  [
    { count: 0, id: 'ai_painter' },
    { count: 0, id: '3' },
    { count: 0, id: '2' },
  ],
  [{ count: 320 }, { count: 320 }, { count: 320 }],
]);
getHomeInfo().then((res) => {
  res.data.comp.forEach((item) => {
    if (item.id === 'ai_painter') {
      homeInfo.value[1][0].count = item.count;
    } else if (item.id === '3') {
      homeInfo.value[1][1].count = item.count;
    } else if (item.id === '2') {
      homeInfo.value[1][2].count = item.count;
    }
  });
  res.data.course.forEach((item) => {
    if (item.id === 'c001') {
      homeInfo.value[0][0].count = item.count;
    } else if (item.id === 'c002') {
      homeInfo.value[0][1].count = item.count;
    } else if (item.id === 'c003') {
      homeInfo.value[0][2].count = item.count;
    }
  });
});

let io = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    open.value = true;
  } else {
    open.value = false;
  }
});
const open = ref(false);
onMounted(() => {
  let more = document.querySelectorAll('.more')[0];
  io.observe(more);
});
const logoPic = [
  logo1,
  logo2,
  logo3,
  logo4,
  logo5,
  logo6,
  logo7,
  logo8,
  logo9,
  logo10,
  logo11,
  logo12,
  logo13,
  logo14,
  logo15,
  logo16,
  logo17,
  logo18,
  logo19,
  logo20,
  logo21,
  logo22,
  logo23,
  logo24,
  logo25,
  logo26,
  logo27,
];
</script>
<template>
  <div class="wrapper">
    <div class="home-portal">
      <swiper
        :modules="modules"
        :pagination="{ clickable: true, renderBullet: renderBullet }"
        :autoplay="{ disableOnInteraction: false, autoplay: true }"
        class="swiper-portal"
      >
        <swiper-slide class="slide1">
          <div class="info">
            <p class="title">{{ t('home.SWIPER[0].TITLE') }}</p>
            <p class="introduce">{{ t('home.SWIPER[0].INTRODUCE') }}</p>
          </div>
          <div class="mask" :class="{ hidden: locale === 'en' }"></div>
        </swiper-slide>
        <!-- <swiper-slide
          class="slide3"
          :class="{ hidden: locale === 'en' }"
          @click="goDetail"
        >
        </swiper-slide> -->
        <swiper-slide
          class="slide2"
          :class="{ hidden: locale === 'en' }"
          @click="router.push('/competition/ai_painter/0/introduction')"
        >
          <div class="mask"></div>
        </swiper-slide>
      </swiper>
    </div>

    <div class="home-project">
      <div class="project-wrapper">
        <p class="title">{{ t('home.AI_LAB.TITLE') }}</p>
        <p class="introduce">{{ t('home.AI_LAB.INTRODUCE') }}</p>
        <div class="center-img">
          <img :src="project" alt="" />
          <div class="video">
            <video
              src="@/assets/videos/project.mp4"
              autoplay
              loop
              muted
              controlslist="nodownload nofullscreen"
              x5-playsinline="true"
              playsinline="true"
              webkit-playsinline="true"
            ></video>
          </div>
        </div>
        <div class="top-img">
          <div
            class="project-card"
            data-aos="slide-right"
            :data-aos-duration="500"
            data-aos-offset="200"
            @click="router.push(t('home.AI_LAB.CARDS[0].PATH'))"
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
            @click="router.push(t('home.AI_LAB.CARDS[1].PATH'))"
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
            @click="router.push(t('home.AI_LAB.CARDS[2].PATH'))"
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
            @click="router.push(t('home.AI_LAB.CARDS[3].PATH'))"
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
            @click="router.push(t('home.AI_LAB.CARDS[4].PATH'))"
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
            @click="router.push(t('home.AI_LAB.CARDS[5].PATH'))"
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
            v-for="(item, index) in 3"
            :key="item"
            class="item"
            data-aos="slide-up"
            :data-aos-duration="200 + (index === 1 ? 0 : 2) * 100"
            data-aos-offset="200"
          >
            <div class="img">
              <img :src="t(`home.MODELZOO.CARDS[${index}].IMAGE`)" alt="" />
            </div>
            <div class="modelzoo-name">
              {{ t(`home.MODELZOO.CARDS[${index}].MODELZOO_NAME`) }}
            </div>
            <div class="modelzoo-introduce">
              {{ t(`home.MODELZOO.CARDS[${index}].MODELZOO_DESC`) }}
            </div>
            <div class="btn-box">
              <OButton
                size="mini"
                @click="router.push(t(`home.MODELZOO.CARDS[${index}].INTRO`))"
              >
                {{ t('home.MODELZOO.INTRODUCTION') }}
              </OButton>
              <OButton
                size="mini"
                type="primary"
                @click="router.push(t(`home.MODELZOO.CARDS[${index}].PATH`))"
              >
                {{ t('home.MODELZOO.EXPERENCE') }}
              </OButton>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 模型 -->
    <div class="home-model">
      <p class="title">
        {{ t(`home.MODEL.TITLE`) }}
      </p>
      <p class="introduce">{{ t(`home.MODEL.INTRODUCE`) }}</p>
      <div class="model-contant">
        <div v-for="(item, index) in 4" :key="item" class="item">
          <router-link :to="{ name: 'models', params: { modelType: item } }">
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
          </router-link>
        </div>
      </div>
    </div>
    <div ref="swiperGally" class="gallery">
      <p class="title">{{ t(`home.GALLARY.TITLE`) }}</p>
      <p class="introduce introduce1">{{ t(`home.GALLARY.INTRODUCE`) }}</p>
      <swiper
        watch-slides-progress
        slides-per-view="auto"
        :free-mode="true"
        :modules="galleryModules"
        :speed="5000"
        :autoplay="{
          delay: 0,
          disableOnInteraction: false,
          autoplay: true,
          pauseOnMouseEnter: true,
          stopOnLastSlide: false,
        }"
        loop
        :looped-slides="5"
        class="swiper-gallery"
        @progress="progress"
        @set-transition="setTransition"
      >
        <swiper-slide v-for="item in galleryPic" :key="item">
          <img :src="item.img" @click="taggleDialog(item)" />
        </swiper-slide>
      </swiper>
      <div class="button-box">
        <OButton
          animation
          class="gallery-entry"
          @click="router.push(t(`home.GALLARY.PATH1`))"
        >
          {{ t(`home.GALLARY.PAINTINGS_BUTTON`) }}
          <template #suffix>
            <OIcon><IconArrowRight /></OIcon>
          </template>
        </OButton>
        <OButton
          animation
          type="primary"
          class="gallery-entry"
          @click="router.push(t(`home.GALLARY.PATH`))"
        >
          {{ t(`home.GALLARY.GALLARY_BUTTON`) }}
          <template #suffix>
            <OIcon><IconArrowRight /></OIcon>
          </template>
        </OButton>
      </div>
      <div class="unopen" :class="{ open: open }">
        <p class="title title1">{{ t(`home.SHENGSI_JOURNEY.TITLE`) }}</p>
        <p class="introduce introduce2">
          {{ t(`home.SHENGSI_JOURNEY.INTRODUCE`) }}
        </p>
      </div>
      <!-- 图片弹窗 -->
      <el-dialog v-model="picDialog" fullscreen>
        <img :src="picSrc.img" alt="" />
        <OButton
          animation
          class="gallery-entry"
          @click="router.push(t(`home.GALLARY.PATH`))"
        >
          {{ t(`home.GALLARY.GALLARY_BUTTON`) }}
          <template #suffix>
            <OIcon><IconArrowRight /></OIcon>
          </template>
        </OButton>
      </el-dialog>
    </div>

    <div class="more" :class="{ open: open }">
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
              <!-- <span class="tag">{{
                t(`home.SHENGSI_JOURNEY.TABLISTS[${index}].CARDS[${i}].TYPE`)
              }}</span> -->
            </div>
            <div class="card-introduce">
              {{
                t(`home.SHENGSI_JOURNEY.TABLISTS[${index}].CARDS[${i}].DESC`)
              }}
            </div>
            <div class="detail">
              <span>
                <o-icon><icon-user></icon-user></o-icon
                ><span class="num">{{ homeInfo[index][i].count }}</span>
              </span>
              <span
                class="details"
                @click="
                  router.push(
                    t(
                      `home.SHENGSI_JOURNEY.TABLISTS[${index}].CARDS[${i}].PATH`
                    )
                  )
                "
                >{{
                  t(
                    `home.SHENGSI_JOURNEY.TABLISTS[${index}].CARDS[${i}].DETAIL`
                  )
                }}</span
              >
            </div>
            <div class="img-mask"></div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="industy">
      <p class="title">{{ t(`home.INDUSTRY.TITLE`) }}</p>
      <p class="introduce introduce1">{{ t(`home.INDUSTRY.INTRODUCE`) }}</p>
      <div class="item-box">
        <div
          v-for="(item, index) in 4"
          :key="item"
          class="item"
          @click="toIndusty(t(`home.INDUSTRY.CARDS[${index}].PATH`))"
        >
          <div class="name">
            <img :src="t(`home.INDUSTRY.CARDS[${index}].IMAGE`)" alt="" />{{
              t(`home.INDUSTRY.CARDS[${index}].NAME`)
            }}
            <span v-if="index > 1">{{
              t(`home.INDUSTRY.CARDS[${index}].STATUS`)
            }}</span>
          </div>
          <div class="intro">
            {{ t(`home.INDUSTRY.CARDS[${index}].DESC`) }}
          </div>
        </div>
      </div>
    </div>
    <div class="logo">
      <p class="title">{{ t(`home.PARTNER.TITLE`) }}</p>
      <swiper
        :speed="8000"
        :free-mode="true"
        :modules="logoModules"
        slides-per-view="auto"
        :autoplay="{ autoplay: true, delay: 0 }"
        loop
        :no-swiping="true"
        class="logo-swiper"
      >
        <swiper-slide
          v-for="item in logoPic.slice(0, 9)"
          :key="item"
          class="swiper-no-swiping"
        >
          <img :src="item" />
        </swiper-slide>
      </swiper>
      <swiper
        :speed="8000"
        :free-mode="true"
        slides-per-view="auto"
        :modules="logoModules"
        :autoplay="{ autoplay: true, delay: 0, reverseDirection: true }"
        loop
        :no-swiping="true"
        class="logo-swiper"
      >
        <swiper-slide
          v-for="item in logoPic.slice(9, 18)"
          :key="item"
          class="swiper-no-swiping"
        >
          <img :src="item" />
        </swiper-slide>
      </swiper>
      <swiper
        :speed="8000"
        :free-mode="true"
        :modules="logoModules"
        slides-per-view="auto"
        :autoplay="{ autoplay: true, delay: 0 }"
        loop
        :looped-slides="5"
        :no-swiping="true"
        class="logo-swiper"
      >
        <swiper-slide
          v-for="item in logoPic.slice(18, -1)"
          :key="item"
          class="swiper-no-swiping"
        >
          <img :src="item" />
        </swiper-slide>
      </swiper>
    </div>
  </div>

  <footer v-if="route.path === '/'" class="app-footer">
    <app-footer></app-footer>
  </footer>
</template>
<style lang="scss" scoped>
.wrapper {
  background-color: #f5f7fb;
}
.home-portal {
  position: relative;
  :deep(.swiper-portal) {
    .swiper-slide {
      height: 100vh;
      display: flex;
      align-items: center;
      .info {
        max-width: 1440px;
        padding: 0 16px;
        margin: 0 auto;
        width: 100%;
      }
      .title {
        font-size: 74px;
        line-height: 76px;
        text-align: left;
        // margin-left: 150px;
        width: 600px;
        font-weight: bold;
        @media screen and (max-width: 820px) {
          font-size: 20px;
          line-height: 28px;
          margin-left: 0;
          text-align: center;
          width: auto;
        }
      }
      .introduce {
        margin: 40px 0;
        text-align: left;
        // margin-left: 150px;
        width: 600px;

        color: #001848;
        @media screen and (max-width: 820px) {
          margin: 6px 24px;
          text-align: center;
        }
      }
      @media screen and (max-width: 820px) {
        height: 300px;
        margin-top: 48px;
      }
      background: url(@/assets/imgs/home1/home-banner1.jpg);
      background-size: cover;
      background-position: 50%;
      @media screen and (max-width: 820px) {
        background: url(@/assets/imgs/home1/mobile-banner1.png);
        background-size: cover;
        background-position: 50%;
      }
      .mask {
        height: 180px;
        width: 100%;
        background: linear-gradient(
          180deg,
          rgba(245, 247, 251, 0) 0%,
          #f5f7fb 56%,
          #f5f7fb 100%
        );
        position: absolute;
        bottom: 0;
        z-index: 1;
        @media screen and (max-width: 820px) {
          display: none;
        }
      }
    }
    .slide2 {
      background: url(@/assets/imgs/home1/home-banner2.jpg);
      background-size: cover;
      background-position: 50%;
      @media screen and (max-width: 820px) {
        background: url(@/assets/imgs/home1/mobile-banner2.jpg);
        background-size: cover;
        background-position: 50%;
      }
    }
    .slide3 {
      background: url(@/assets/imgs/home1/home-banner3.jpg);
      background-size: cover;
      background-position: 50%;
      @media screen and (max-width: 820px) {
        background: url(@/assets/imgs/home1/mobile-banner3.jpg);
        background-size: cover;
        background-position: 50%;
      }
    }
    .swiper-pagination {
      bottom: 50px;
      @media screen and (max-width: 820px) {
        bottom: 8px;
      }
    }
    .swiper-pagination-bullet {
      display: inline-block;
      width: 160px;
      height: 48px;
      line-height: 48px;
      background: rgba(255, 255, 255, 0.7);
      border-radius: 42px;
      backdrop-filter: blur(10px);
      margin: 0 8px;
      font-size: 18px;
      opacity: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      padding: 0 17px;
      // &:first-child {
      //   width: 220px;
      // }
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
  position: relative;
  z-index: 20;
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
  position: relative;
  z-index: 20;
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
  opacity: 1;
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
    transition: all 0.3s ease;
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
      @media screen and (max-width: 820px) {
        font-size: 12px;
        line-height: 14px;
      }
    }
    .frame {
      background-color: #e9edfb;
      width: 80px;
      margin: 0 3px;
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
  .top-img {
    .project-card:first-child {
      .frame:first-child {
        width: 68px;
      }
      .frame:nth-child(3) {
        width: 96px;
      }
      .frame:last-child {
        width: 48px;
      }
    }
    .project-card:last-child {
      .frame:first-child {
        width: 68px;
      }
      .frame:nth-child(3) {
        width: 96px;
      }
      .frame:last-child {
        width: 86px;
      }
    }
  }
  .bottom-img {
    .project-card:first-child {
      .frame:first-child {
        width: 43px;
      }
      .frame:nth-child(3) {
        width: 96px;
      }
      .frame:last-child {
        width: 48px;
      }
    }
    .project-card:last-child {
      .frame:first-child {
        width: 68px;
      }
      .frame:nth-child(3) {
        width: 96px;
      }
      .frame:last-child {
        width: 46px;
      }
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
    .project-card:first-child {
      .frame:first-child {
        width: 114px;
      }
      .frame:nth-child(2) {
        width: 49px;
      }
      .frame:nth-child(3) {
        width: 96px;
      }
      .frame:last-child {
        width: 48px;
      }
    }
    .project-card:last-child {
      .frame:first-child {
        width: 96px;
      }
      .frame:nth-child(3) {
        width: 96px;
      }
      .frame:last-child {
        width: 46px;
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
    top: 0;
    @media screen and (max-width: 820px) {
      position: unset;
    }
    .video {
      width: 100%;
      padding-bottom: 30%;
      margin-top: 80px;
      @media screen and (max-width: 820px) {
        display: none;
      }
    }
    video {
      width: 100%;
      height: 100%;
    }
    img {
      width: 100%;
      display: none;
      @media screen and (max-width: 820px) {
        display: block;
      }
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
    .btn-box {
      text-align: right;
      margin: 12px 0;
      padding-top: 12px;
      .o-button + .o-button {
        margin-left: 16px;
      }
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
      transition: all 0.3s ease;
      cursor: pointer;
      @media screen and (max-width: 820px) {
        padding: 6px;
        border-radius: 16px;
      }
      box-shadow: 0px 1px 5px 0px rgba(45, 47, 51, 0.1);
      &:hover {
        box-shadow: 0px 6px 18px 0px rgba(13, 141, 255, 0.14);
        img {
          transform: scale(1.1);
          transition: all 0.3s ease;
        }
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
        color: #555555;
        @media screen and (max-width: 820px) {
          font-size: 12px;
          margin-left: 10px;
          margin-bottom: 3px;
        }
      }
    }
    .img {
      width: 100%;
      border-radius: 8px;
      overflow: hidden;
      img {
        width: 100%;
        @media screen and (max-width: 820px) {
          border-radius: 16px;
        }
        @media screen and (max-width: 767px) {
          border-radius: 16px;
        }
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
      transition: all 0.3s ease;
      @media screen and (max-width: 820px) {
        padding: 16px;
      }
      box-shadow: 0px 1px 5px 0px rgba(45, 47, 51, 0.1);
      cursor: pointer;
      &:hover {
        box-shadow: 0px 6px 18px 0px rgba(13, 141, 255, 0.14);
      }
      &:nth-child(3) {
        .models-tag {
          color: #8071de;
          background-color: #edefff;
        }
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
      color: #000;
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
  overflow: hidden;
  @media screen and (max-width: 820px) {
    padding: 40px 0;
  }
  .button-box {
    text-align: center;
  }
  .o-button {
    display: inline-block;
    margin-top: -20px;
    margin-left: 12px;
    margin-right: 12px;
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
      width: 980px;
      // transform: translateX(-160px);
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
        cursor: pointer;
      }
    }
  }
  :deep(.el-dialog__header) {
    height: auto;
  }
  :deep(.el-dialog__body) {
    margin-top: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: calc(100% - 80px);
    @media screen and (max-width: 820px) {
      height: calc(100% - 100px);
    }
    @media screen and (max-width: 167px) {
      height: calc(100% - 200px);
    }

    img {
      height: calc(100% - 80px);
      @media screen and (max-width: 820px) {
        width: 100%;
        height: auto;
      }
    }
    .o-button {
      margin-top: 24px;
      color: #fff;
      border: 1px solid #fff;
      &:hover {
        color: #fff;
        border: 1px solid #fff;
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
  .unopen {
    position: relative;
    transition: all 0.5s linear;
    bottom: -100px;
    @media screen and (max-width: 820px) {
      bottom: 0;
    }
  }
  .open {
    bottom: 0;
  }
}

.more {
  max-width: 1472px;
  margin: 0 auto;
  padding: 0 16px;
  position: relative;
  bottom: -100px;
  @media screen and (max-width: 820px) {
    bottom: 0;
  }
  transition: all 0.5s linear;
  :deep(.el-tabs) {
    .el-tabs__header {
      margin: 0px;
      position: absolute;
      max-width: 1440px;
      width: calc(100% - 32px);
      top: -50px;
      z-index: 99;
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
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(2px);
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
      border-radius: 20px;
      position: relative;
      margin-bottom: 64px;
      transition: all 0.3s ease;
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
        z-index: 2;
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
        color: #555;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        @media screen and (max-width: 820px) {
          font-size: 12px;
          line-height: 18px;
          margin: 16px 10px;
        }
      }
      img {
        width: 100%;
        height: 149px;
        border-radius: 16px;
        @media screen and (max-width: 820px) {
          height: 109px;
        }
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
        .num {
          font-size: 14px;
          color: #2c2c2c;
          margin-left: 8px;
        }
      }
      .o-icon {
        color: #2c2c2c;
        font-size: 14px;
        line-height: 22px;
        svg {
          vertical-align: text-top;
        }
        // &::after {
        //   content: '2k+';
        //   margin-left: 8px;
        //   font-size: 14px;
        // }
      }
      .img-mask {
        width: calc(100% - 24px);
        height: 149px;
        border-radius: 16px;
        background: linear-gradient(
          175deg,
          rgba(143, 244, 255, 0) 0%,
          #61adff 100%
        );
        position: absolute;
        top: 12px;
        @media screen and (max-width: 820px) {
          width: calc(100% - 12px);
          height: 109px;
          top: 6px;
        }
      }
    }
  }
}
.open {
  bottom: 0;
  height: auto;
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
    max-width: 900px;
    @media screen and (max-width: 820px) {
      margin-bottom: 16px;
    }
  }
  .item-box {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 24px;
    row-gap: 24px;
    @media screen and (max-width: 820px) {
      grid-template-columns: 1fr;
      row-gap: 16px;
    }
    .item {
      padding: 34px 40px 40px;
      background: url(@/assets/imgs/home1/industry-card-bg.png);
      // background-position: 50%;
      background-color: #fff;
      border-radius: 16px;
      background-size: cover;
      transition: all 0.3s ease;
      transition-property: box-shadow;
      @media screen and (max-width: 820px) {
        padding: 16px;
      }
      &:first-child {
        cursor: pointer;
        box-shadow: 0px 1px 5px 0px rgba(45, 47, 51, 0.1);
        .intro {
          color: #555;
        }
        .name {
          color: #000;
        }
        &:hover {
          box-shadow: 0px 6px 18px 0px rgba(13, 141, 255, 0.14);
          background: url(@/assets/imgs/home1/industy/hover-bg1.png);
          background-size: cover;
          background-position: 50%;
          .name {
            color: #ffffff;
          }
          .intro {
            color: #ffffff;
          }
        }
      }
      &:nth-child(2) {
        box-shadow: 0px 1px 5px 0px rgba(45, 47, 51, 0.1);
        cursor: pointer;
        .intro {
          color: #555;
        }
        .name {
          color: #000;
        }
        &:hover {
          box-shadow: 0px 6px 18px 0px rgba(13, 141, 255, 0.14);
          background: url(@/assets/imgs/home1/industy/hover-bg2.png);
          background-size: cover;
          background-position: 50%;
          .name {
            color: #ffffff;
          }
          .intro {
            color: #ffffff;
          }
        }
      }
      &:nth-child(3) {
        box-shadow: 0px 1px 5px 0px rgba(45, 47, 51, 0.1);
        cursor: pointer;
        .intro {
          color: #555;
        }
        .name {
          color: #000;
        }
        &:hover {
          background: url(@/assets/imgs/home1/industy/hover-bg3.png);
          background-size: cover;
          box-shadow: 0px 6px 18px 0px rgba(13, 141, 255, 0.14);
          .name,
          .intro {
            color: #ffffff;
          }
        }
      }
      &:last-child {
        box-shadow: 0px 1px 5px 0px rgba(45, 47, 51, 0.1);
        cursor: pointer;
        .intro {
          color: #555;
        }
        .name {
          color: #000;
        }
        &:hover {
          background: url(@/assets/imgs/home1/industy/hover-bg4.png);
          background-size: cover;
          box-shadow: 0px 6px 18px 0px rgba(13, 141, 255, 0.14);
          .name,
          .intro {
            color: #ffffff;
          }
        }
      }
    }
    .name {
      font-size: 24px;
      margin-bottom: 8px;
      line-height: 48px;
      position: relative;
      color: #555555;
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
      color: #999999;
      margin-left: 64px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      @media screen and (max-width: 820px) {
        font-size: 12px;
        margin-left: 32px;
      }
    }
  }
}
.logo {
  padding: 0 0 52px;
  @media screen and (max-width: 820px) {
    padding: 0 0 36px;
  }
  .title {
    margin-bottom: 26px;
    @media screen and (max-width: 820px) {
      margin-bottom: 12px;
    }
  }
  :deep(.logo-swiper) {
    .swiper-slide {
      height: 120px;
      width: auto !important;
      background-color: #fff;
      margin: 12px 12px;
      border-radius: 16px;
      @media screen and (max-width: 820px) {
        height: 60px;
        margin: 4px 4px;
        border-radius: 10px;
      }
    }
    img {
      height: 120px;
      @media screen and (max-width: 820px) {
        height: 60px;
      }
    }
  }
}
:deep(.swiper) {
  .hidden {
    display: none !important;
  }
}
:deep(.swiper-free-mode) {
  .swiper-wrapper {
    -webkit-transition-timing-function: linear; /*之前是ease-out*/
    -moz-transition-timing-function: linear;
    -ms-transition-timing-function: linear;
    -o-transition-timing-function: linear;
    transition-timing-function: linear;
    margin: 0 auto;
  }
}
</style>
