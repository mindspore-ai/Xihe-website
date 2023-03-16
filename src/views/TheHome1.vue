<script setup>
import AOS from 'aos';
import 'aos/dist/aos.css';

import models1 from '@/assets/imgs/home1/models1.png';
import models2 from '@/assets/imgs/home1/models2.png';
import models3 from '@/assets/imgs/home1/models3.png';
import models4 from '@/assets/imgs/home1/models4.png';
import modelzoo1 from '@/assets/imgs/home1/modelzoo1.jpg';
import modelzoo2 from '@/assets/imgs/home1/modelzoo2.jpg';
import modelzoo3 from '@/assets/imgs/home1/modelzoo3.jpg';
import modelzoo_pangu from '@/assets/imgs/home1/modelzoo_pangu.jpg';
// import modelzoo_bg from '@/assets/imgs/home/modelzoo-bg.png';
import project from '@/assets/imgs/home1/project.png';
import project1 from '@/assets/imgs/home1/project1.png';
import project2 from '@/assets/imgs/home1/project2.png';
import project3 from '@/assets/imgs/home1/project3.png';
import project4 from '@/assets/imgs/home1/project4.png';
import project5 from '@/assets/imgs/home1/project5.png';
import project6 from '@/assets/imgs/home1/project6.png';
import card1 from '@/assets/imgs/home1/more/more_card1.png';
import card2 from '@/assets/imgs/home1/more/more_card2.png';
import card3 from '@/assets/imgs/home1/more/more_card3.png';
import competition1 from '@/assets/imgs/home1/more/competition1.png';
import competition2 from '@/assets/imgs/home1/more/competition2.png';
import competition3 from '@/assets/imgs/home1/more/competition3.png';
import activity1 from '@/assets/imgs/home1/more/activity1.png';
import activity2 from '@/assets/imgs/home1/more/activity2.png';
import activity3 from '@/assets/imgs/home1/more/activity3.png';
import industy1 from '@/assets/imgs/home1/industy/industy1.png';
import industy2 from '@/assets/imgs/home1/industy/industy2.png';
import industy3 from '@/assets/imgs/home1/industy/industy3.png';
import industy4 from '@/assets/imgs/home1/industy/industy4.png';
import open1 from '@/assets/imgs/home1/open/open1.png';
import open2 from '@/assets/imgs/home1/open/open2.png';
import open3 from '@/assets/imgs/home1/open/open3.png';

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
import { ref, onMounted } from 'vue';

AOS.init();

const modules = [Pagination];
const galleryModules = [Autoplay];
function renderBullet(index, className) {
  let text = '';
  switch (index) {
    case 0:
      text = '昇思大模型平台';
      break;
    case 1:
      text = 'AI挑战赛';
      break;
  }
  return '<span class="' + className + '">' + text + '</span>';
}

const screenWidth = useWindowResize();

const i18n = {
  project: {
    title: 'AI实验室',
    introduce:
      '覆盖多领域任务，体验全流程开发，支持用户在线训练和推理可视化，感受用户的创新创意实践',
    item: [
      { name: '多类别图像分类', type: 'CV' },
      { name: '图像识别', type: 'CV', img: project1 },
      { name: '风格迁移', type: 'CV' },
      { name: '文本分类', type: 'CV' },
      { name: '序列标注', type: 'NLP' },
      { name: '文本翻译', type: 'NLP' },
    ],
  },
  modelzoo: {
    title: '大模型体验',
    introduce:
      '覆盖NLP和CV等场景。面向语言理解、语言生成，具有超强语言理解能力以及对话生成；可实现跨模态检索、图文生成、图片文档的信息提取等应用；可实现对遥感数据的目标检测等。',
    quickStartLabel: '立即体验',
    ex: [
      {
        modelzoo: '紫东.太初',
        introduce: '全球首个三模态千亿参数大模型',
        img: modelzoo1,
        // href: `https://${DOMAIN}/modelzoo/taichu`,
      },
      {
        modelzoo: '悟空画画',
        introduce: '业界首个基于扩散模型的中文文生图大模型',
        img: modelzoo2,
      },
      {
        modelzoo: '武大.Luojia',
        introduce: '全球首个遥感专用框架及最大遥感样本库',
        img: modelzoo3,
        // href: `https://${DOMAIN}/modelzoo/luojia`,
      },
      // {
      //   modelzoo: 'CodeGeeX',
      //   introduce: '一个具有130亿参数的多编程语言代码生成预训练模型',
      // },
      {
        modelzoo: '鹏程.盘古',
        introduce: '业界首个千亿级参数中文自然语言处理大模型',
        img: modelzoo_pangu,
        // href: `https://${DOMAIN}/modelzoo/pangu`,
      },
    ],
  },
  model: {
    title: '模型库',
    introduce:
      '覆盖全领域主流模型，可体验MindSpore大模型推理API，用户既可下载公开的预训练模型，也可以上传自行训练的模型文件，同时平台提供GITLAB一站式代码托管，支持文件批量上传，支持LFS大文件管理',
    more: '探索更多模型',
    ex: [
      {
        models: '图像分类',
        img: models1,
        name: 'VGG16｜ResNet-101｜InceptionV4 …',
        type: 'CV',
        herf: 'https://xihe.mindspore.cn/models/MindSpore/vgg16_cifar10',
      },
      {
        models: '目标检测',
        img: models2,
        name: 'YOLOv5｜SSD ｜MobileNet …',
        type: 'CV',
        herf: 'https://xihe.mindspore.cn/models/MindSpore/yolov5shape640',
      },
      {
        models: '自然语言处理',
        img: models3,
        name: 'BERT｜GRU｜Transformer …',
        type: 'NLP',
        herf: 'https://xihe.mindspore.cn/models/MindSpore/bertbase_cnnews128',
      },
      {
        models: '推荐',
        img: models4,
        name: 'DeepFM｜Wide&Deep｜NCF …',
        type: 'Recommendation',
        herf: 'https://xihe.mindspore.cn/models/MindSpore/deepfm_criteo',
      },
    ],
  },
  gallery: {
    title: '精选画廊',
    introduce:
      '进入精选画廊体验中文文图生成模型-悟空画画模型进行创作；您就可以通过文字生成多样风格的图片，带你寻找生活中的灵感。',
    quickStartLabel: '开始画画',
  },
  more: {
    title: '开启昇思之旅',
    introduce: '从入门到高阶，从理论到实践，助力开发者快',
    tabs: [
      {
        tab: '课程',
        img: open1,
        card: [
          {
            name: '大模型课程',
            intro:
              '昇思 MindSpore AI 框架原生支持大模型训练是发展大模型的关键，国内多个科研机构基于MindSpore打造了一系列大模型，…',
            img: card1,
            tag: '免费',
            detail: '了解详情',
          },
          {
            name: '视觉课程',
            intro:
              '计算机视觉（Computer Vision）作为人工智能的一个重要的领域，主要是开发赋予计算机视觉能力的技术。本课程基于昇思…',
            img: card2,
            tag: '免费',
            detail: '了解详情',
          },
          {
            name: '昇思入门课',
            intro:
              '本课程使用原理讲解加实战的方式学习神经网络模型，掌握算法调参和使用昇思MindSpore编程的能力。',
            img: card3,
            tag: '免费',
            detail: '了解详情',
          },
        ],
      },
      {
        tab: '比赛',
        img: open2,
        card: [
          {
            name: '',
            intro:
              '一封通往艺术殿堂的邀请函，万元奖金邀您参与AI艺术创作，象牙之塔-AI画家大赛于2023年3月正式开启，面向全球AI开发者，…',
            img: competition1,
            tag: '',
            detail: '了解详情',
          },
          {
            name: '',
            intro:
              '昇思MindSpore是一个全场景深度学习框架,旨在实现易开发、高效执行、全场景覆盖三大目标。 昇思AI挑战赛于2022年9月正…',
            img: competition2,
            tag: '',
            detail: '了解详情',
          },
          {
            name: '',
            intro:
              '昇思MindSpore是一个全场景深度学习框架,旨在实现易开发、高效执行、全场景覆盖三大目标。 昇思AI挑战赛于2022年9月正…',
            img: competition3,
            tag: '',
            detail: '了解详情',
          },
        ],
      },
      {
        tab: '活动',
        img: open3,
        card: [
          {
            name: '',
            intro:
              'MindCon极客周是昇思MindSpore每半年举办一次的开发者狂欢盛会，旨在引领兴趣者们走入AI探索的世界。第四届MindCon极…',
            img: activity1,
            tag: '',
            detail: '了解详情',
          },
          {
            name: '',
            intro:
              '昇思MindSpore是一个全场景深度学习框架,旨在实现易开发、高效执行、全场景覆盖三大目标。 昇思AI挑战赛于2022年9月正…',
            img: activity2,
            tag: '',
            detail: '了解详情',
          },
          {
            name: '',
            intro:
              '昇思MindSpore是一个全场景深度学习框架,旨在实现易开发、高效执行、全场景覆盖三大目标。 昇思AI挑战赛于2022年9月正…',
            img: activity3,
            tag: '',
            detail: '了解详情',
          },
        ],
      },
    ],
  },
  industry: {
    title: '产业',
    introduce:
      '涵盖了多领域落地的相关应用；包括对相关应用的问题定位、方案设计、数据处理、模型训练部署及思路的优化；提供了全流程零门槛入门的指导',
    item: [
      {
        name: '电力',
        intro:
          '通过训练电力数据构集构建AI模型，实现对电力数据的预测，可以预测电力波动，辅助企业能源管理、能源调度等',
        img: industy2,
        status: '',
      },
      {
        name: '工业',
        intro:
          '通过训练物体检测构建AI模型，实现对工业物体的智能识别，广泛应用于工业检测、智能制造等',
        img: industy1,
        status: '敬请期待',
      },
      {
        name: '医疗',
        intro:
          '通过对医疗数据的探索构建AI模型，实现对医疗大数据的分析，广泛应用于临床决策、医学研究等',
        img: industy3,
        status: '敬请期待',
      },
      {
        name: '金融',
        intro:
          '通过训练股票数据构建AI模型，广泛应用于股票、证券等公司，可以帮助企业合理降低成本、提高利润',
        img: industy4,
        status: '敬请期待',
      },
    ],
  },
};
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
        <p class="title">{{ i18n.project.title }}</p>
        <p class="introduce">{{ i18n.project.introduce }}</p>
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
              <p>多类别图像分类</p>
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
              <p>图像识别</p>
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
              <p>风格迁移</p>
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
              <p>文本分类</p>
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
              <p>序列标注</p>
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
              <p>文本翻译</p>
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
        <p class="title">{{ i18n.modelzoo.title }}</p>
        <p class="introduce">{{ i18n.modelzoo.introduce }}</p>
        <div class="modelzoo-contant">
          <div
            v-for="(item, index) in i18n.modelzoo.ex"
            :key="item"
            class="item"
            data-aos="slide-up"
            :data-aos-duration="
              200 + (index === 1 || index === 2 ? 0 : 2) * 100
            "
            data-aos-offset="200"
          >
            <img :src="item.img" alt="" />
            <div class="modelzoo-name">
              {{ item.modelzoo }}
            </div>
            <div class="modelzoo-introduce">{{ item.introduce }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="home-model">
      <p class="title">{{ i18n.model.title }}</p>
      <p class="introduce">{{ i18n.model.introduce }}</p>
      <div class="model-contant">
        <div v-for="item in i18n.model.ex" :key="item" class="item">
          <img :src="item.img" alt="" />
          <div class="models-type">{{ item.models }}</div>
          <div class="models-name">{{ item.name }}</div>
          <div class="models-tag">{{ item.type }}</div>
        </div>
      </div>
    </div>
    <div ref="swiperGally" class="gallery">
      <p class="title">{{ i18n.gallery.title }}</p>
      <p class="introduce introduce1">{{ i18n.gallery.introduce }}</p>
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
        {{ i18n.gallery.quickStartLabel }}
        <template #suffix>
          <OIcon><IconArrowRight /></OIcon>
        </template>
      </OButton>
      <p class="title title1">{{ i18n.more.title }}</p>
      <p class="introduce introduce2">{{ i18n.more.introduce }}</p>
    </div>
    <div class="more">
      <el-tabs class="more-tabs">
        <el-tab-pane v-for="item in i18n.more.tabs" :key="item">
          <template #label>
            <span class="tabs-title">
              <img :src="item.img" alt="" />
              <span class="tab">{{ item.tab }}</span>
            </span>
          </template>
          <div v-for="card in item.card" :key="card" class="tabs-card">
            <img :src="card.img" alt="" />
            <div class="card-name">
              {{ card.name }} <span class="tag">{{ card.tag }}</span>
            </div>
            <div class="card-introduce">{{ card.intro }}</div>
            <div class="detail">
              <o-icon><icon-user></icon-user></o-icon>
              <span class="details">{{ card.detail }}</span>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="industy">
      <p class="title">{{ i18n.industry.title }}</p>
      <p class="introduce introduce1">{{ i18n.industry.introduce }}</p>
      <div class="item-box">
        <div v-for="item in i18n.industry.item" :key="item" class="item">
          <div class="name">
            <img :src="item.img" alt="" />{{ item.name }}
            <span>{{ item.status }}</span>
          </div>
          <div class="intro">{{ item.intro }}</div>
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
