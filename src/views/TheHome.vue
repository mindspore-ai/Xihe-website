<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AOS from 'aos';
import 'aos/dist/aos.css';

import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination, Autoplay } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';

import OButton from '@/components/OButton.vue';
import AppFooter from '@/components/AppFooter.vue';

import IconArrowRight from '~icons/app/arrow-right.svg';
// import homeBanner2 from '@/assets/imgs/home-banner2.png';
// import homeBanner3 from '@/assets/imgs/home-banner3.png';
import homePageImg from '@/assets/imgs/home/home-page.png';
import digitRecognition from '@/assets/imgs/home/digit-recognition.png';
import imageRcognition from '@/assets/imgs/home/image-rcognition.png';
import emtionalNalysis from '@/assets/imgs/home/emtional-nalysis.png';
import models1 from '@/assets/imgs/home/models1.png';
import models2 from '@/assets/imgs/home/models2.png';
import models3 from '@/assets/imgs/home/models3.png';
import models4 from '@/assets/imgs/home/models4.png';
import modelzoo1 from '@/assets/imgs/home/modelzoo1.png';
import modelzoo2 from '@/assets/imgs/home/modelzoo2.png';
import modelzoo3 from '@/assets/imgs/home/modelzoo4.png';
import datasetPageImg from '@/assets/imgs/home/dataset-page.png';
// import slideImg from '@/assets/gifs/slide.gif';

import { useLoginStore, useUserInfoStore } from '@/stores';
import { goAuthorize, LOGIN_STATUS } from '@/shared/login';
import tipImg from '@/assets/imgs/home/tip.png';
import tipCloseImg from '@/assets/imgs/home/close.png';

AOS.init();

const dialogVisible = ref(false);
const toggleDlg = (val) => {
  dialogVisible.value = val;
};

const tipVisible = ref(true);
const toggleTip = (val) => {
  tipVisible.value = val;
};

const modules = [Pagination, Autoplay];

const DOMAIN = import.meta.env.VITE_DOMAIN;

const router = useRouter();
// const hoemVideo =
//   'https://obs-xihe-beijing4.obs.cn-north-4.myhuaweicloud.com/xihe-img/video/mindSpore%20AI%20%E5%BC%80%E5%8F%91%E5%B9%B3%E5%8F%B0%E9%A6%96%E9%A1%B5banner.mp4';

const homeIns = ref(null);
// const homeTitle = '昇思大模型平台';
// const homeDesc = 'The Best AI Platform For MindSpore';
const quickStartLabel = '快速开始';
const i18n = {
  mouse: '滑动鼠标探索更多',
  page: {
    title: '个人主页',
    introduce: '在个人主页开启探索、创建、收藏MindSpore项目、模型、数据集之旅',
  },
  project: {
    title: '项目',
    introduce:
      '覆盖多领域任务，体验全流程开发，支持用户在线训练和推理可视化，可创建自己的项目空间',
    gradio1: '手写数字识别',
    gradio2: '图像识别',
    gradio3: '情感分析',
    more: '探索更多项目',
  },
  modelzoo: {
    title: '大模型体验',
    introduce: '在线体验预训练超大模型任务',
    quickStartLabel: '立即体验',
    modelzoo1: '紫东.太初',
    introduce1: '全球首个三模态千亿参数大模型',
    modelzoo2: '武大.Luojia',
    introduce2: '全球首个遥感专用框架及最大遥感样本库',
    modelzoo3: 'CodeGeeX',
    introduce3: '一个具有130亿参数的多编程语言代码生成预训练模型',
  },
  model: {
    title: '模型',
    introduce:
      '覆盖全领域主流模型，可体验MindSpore大模型推理API，用户既可下载公开的预训练模型，也可以上传自行训练的模型文件',
    models1: '图像分类',
    models2: '目标检测',
    models3: '自然语言处理',
    models4: '推荐',
    more: '探索更多模型',
  },
  dataset: {
    title: '数据集',
    introduce: '包含主流数据集，用户也可上传合规数据集，详情请点击文档',
    quickStartLabel: '更多数据集',
  },
};

const loginStore = useLoginStore();
const userInfo = useUserInfoStore();

// const photosHeight = ref();
// const photo = ref();
// onMounted(() => {
//   setTimeout(() => {
//     photosHeight.value = photo.value.clientHeight + 'px';
//   }, 50);
// });

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
function goInvited() {
  const status = loginStore.loginStatus;
  if (status === LOGIN_STATUS.DOING) {
    return;
  } else if (status === LOGIN_STATUS.FAILED || status === LOGIN_STATUS.NOT) {
    goAuthorize();
  } else {
    router.push(`/settings/invitation`);
  }
}
function handleBtnClick2() {
  router.push(`https://${DOMAIN}/datasets`);
}
function handleBtnClick3() {
  router.push(`https://${DOMAIN}/modelzoo`);
}
function goDetail(id) {
  router.push({
    name: 'competitionDetail',
    params: { id: id },
  });
}
function goCode() {
  router.push({ path: '/modelzoo/codegeex' });
}
function goActivity() {
  router.push({ path: '/activity' });
}
</script>

<template>
  <div v-if="tipVisible" class="app-tip">
    <div class="tip-content">
      <img class="tip-img" :src="tipImg" @click="toggleDlg(true)" />
      <img class="tip-btn" :src="tipCloseImg" @click="toggleTip(false)" />
    </div>

    <o-dialog :show="dialogVisible" :close="false">
      <template #head>
        <p class="dlg-title">新后台上线公告</p>
      </template>

      <div class="dlg-body">
        <p class="dlg-content">
          致所有用户：<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;为了优化平台的性能和功能，提高平台可扩展性和稳定性，平台重构了后台架构，在本次更新中，平台做了几大调整：<br /><br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1.出于平台和用户安全考虑，新后台需要用户绑定邮箱进行登录。对于部分原来未提供邮箱的用户，在登录时需要您补充邮箱进行验证登陆，邮箱验证登陆成功后方可正常访问平台。<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          2.支持通过git对仓库文件进行版本控制、批量上传和git&nbsp;lfs上传大文件等操作。<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3.为适配后续版本的迭代，平台设定了一些规则对原有的数据进行迁移，可能会导致部分数据存放的位置和命名的方式与原来不一致。目前最新的迁移时间是2022/11/27
          17:00。<br />

          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4.具体数据迁移规则和优化详情请阅读
          <a href="https://xihe-docs.mindspore.cn/zh/release/"
            >平台更新说明文档</a
          >
          。<br /><br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;在上线前，我们对平台进行了测试、修复BUG，但可能无法保证做到百分百排除所有问题。如大家在使用过程中遇到BUG，可以添加官方助手小猫子（
          <span>微信号：mindspore0328</span>
          ），您也可以联系我们的邮箱
          <span>contact@mindspore.cn</span>
          ，我们会及时回复。还请大家给予一些耐心与理解，我们会全力解决各类问题，优化大家的平台体验。<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;感谢大家一直以来的支持！期待昇思大模型平台能让您零距离感受AI大模型，更加轻松体验模型的训练与推理！
        </p>
      </div>

      <template #foot>
        <div class="dlg-btn">
          <OButton type="primary" size="small" @click="toggleDlg(fasle)"
            >我知道啦</OButton
          >
        </div>
      </template>
    </o-dialog>
  </div>
  <div ref="homeIns" class="home">
    <!-- 首屏-->
    <!-- <div class="home-portal">
      <video
        :poster="homeBanner"
        :src="hoemVideo"
        class="home-portal-video"
        autoplay
        loop
        muted
        controlslist="nodownload nofullscreen"
        x5-playsinline="true"
        playsinline="true"
        webkit-playsinline="true"
      ></video>
      <div class="home-portal-mask"></div>

      <div class="home-portal-content">
        <p
          class="portal-content-desc"
          data-aos="slide-up"
          data-aos-duration="800"
          data-aos-once="false"
        >
          {{ homeDesc }}
        </p>
        <p
          class="portal-content-title"
          data-aos="slide-up"
          data-aos-duration="1200"
          data-aos-once="false"
        >
          {{ homeTitle }}
        </p>
        <OButton
          type="primary"
          animation
          class="portal-content-btn"
          data-aos="slide-up"
          data-aos-offset="200"
          data-aos-duration="1600"
          data-aos-once="false"
          @click="handleBtnClick"
        >
          {{ quickStartLabel }}
          <template #suffix>
            <OIcon><IconArrowRight /></OIcon>
          </template>
        </OButton>
        <div class="watching-more">
          <img :src="slideImg" alt="" />
          <p>{{ i18n.mouse }}</p>
        </div>
      </div>
    </div> -->
    <!-- 轮播图 -->
    <swiper
      :modules="modules"
      :pagination="{ clickable: true }"
      :autoplay="{ disableOnInteraction: false, autoplay: true }"
      loop
    >
      <swiper-slide>
        <div class="photo7 cursor" @click="goActivity()"></div>
      </swiper-slide>
      <swiper-slide>
        <div class="photo6 cursor" @click="goCode()"></div>
      </swiper-slide>
      <!-- <swiper-slide>
        <div class="photo1 cursor" @click="goInvited"></div>
      </swiper-slide> -->
      <!-- <swiper-slide>
        <div class="photo2"></div>
      </swiper-slide> -->
      <swiper-slide>
        <div class="photo3 cursor" @click="goDetail(3)"></div>
      </swiper-slide>
      <swiper-slide>
        <div class="photo4 cursor" @click="goDetail(2)"></div>
      </swiper-slide>
      <swiper-slide>
        <div class="photo5 cursor" @click="goDetail(1)"></div>
      </swiper-slide>
    </swiper>

    <div class="home-content">
      <div class="wrapper">
        <!-- 个人主页 -->
        <div
          class="content-page"
          data-aos="slide-up"
          data-aos-duration="1200"
          data-aos-offset="-121"
          data-aos-once="true"
        >
          <div class="page-left">
            <p class="page-title">{{ i18n.page.title }}</p>
            <p class="page-desc">{{ i18n.page.introduce }}</p>
            <OButton
              animation
              class="page-entry"
              data-aos="slide-up"
              data-aos-offset="200"
              data-aos-duration="1600"
              @click="handleBtnClick"
            >
              {{ quickStartLabel }}
              <template #suffix>
                <OIcon><IconArrowRight /></OIcon>
              </template>
            </OButton>
          </div>
          <img class="page-right" :src="homePageImg" alt="" />
        </div>
        <!-- 项目-->
        <div class="content-project">
          <a
            class="project-card"
            :href="`https://${DOMAIN}/projects/wesley/lenet5_demo`"
          >
            <div class="card-header">
              <img :src="digitRecognition" alt="" />
            </div>
            <div class="card-body">
              <div class="project-title">
                <p>{{ i18n.project.gradio1 }}</p>
                <OIcon><IconArrowRight /></OIcon>
              </div>
              <div class="project-tag">Mnist</div>
            </div>
          </a>
          <a
            class="project-card"
            :href="`https://${DOMAIN}/projects/drizzlezyk/ResNet50`"
          >
            <div class="card-header">
              <img :src="imageRcognition" alt="" />
            </div>
            <div class="card-body">
              <div class="project-title">
                <p>{{ i18n.project.gradio2 }}</p>
                <OIcon><IconArrowRight /></OIcon>
              </div>
              <div class="project-tag">CV</div>
            </div>
          </a>
          <a
            class="project-card"
            :href="`https://${DOMAIN}/projects/drizzlezyk/LSTM`"
          >
            <div class="card-header">
              <img :src="emtionalNalysis" alt="" />
            </div>
            <div class="card-body">
              <div class="project-title">
                <p>{{ i18n.project.gradio3 }}</p>
                <OIcon><IconArrowRight /></OIcon>
              </div>
              <div class="project-tag">NLP</div>
            </div>
          </a>
          <a class="project-entry" :href="`https://${DOMAIN}/projects`">
            <div class="entry-header">
              <p class="entry-title">{{ i18n.project.title }}</p>
              <p class="entry-desc">{{ i18n.project.introduce }}</p>
            </div>
            <p class="entry-body">
              {{ i18n.project.more }}<OIcon><IconArrowRight /></OIcon>
            </p>
          </a>
        </div>

        <!-- modelzoo -->
        <div
          class="content-modelzoo"
          data-aos-duration="1200"
          data-aos-offset="200"
          data-aos-once="true"
        >
          <div class="modelzoo-entry">
            <div class="entry-left">
              <p class="entry-title">{{ i18n.modelzoo.title }}</p>
              <p class="entry-desc">{{ i18n.modelzoo.introduce }}</p>
            </div>
            <OButton
              animation
              class="right"
              data-aos="slide-up"
              data-aos-offset="200"
              data-aos-duration="1600"
              @click="handleBtnClick3"
            >
              {{ i18n.modelzoo.quickStartLabel }}
              <template #suffix>
                <OIcon><IconArrowRight /></OIcon>
              </template>
            </OButton>
          </div>
          <div class="modelzoo-card-list">
            <a
              class="modelzoo-card"
              :href="`https://${DOMAIN}/modelzoo/codegeex`"
            >
              <div class="card-header">
                <img :src="modelzoo3" alt="" />
              </div>
              <div class="card-body">
                <div class="modelzoo-title">
                  <p>{{ i18n.modelzoo.modelzoo3 }}</p>
                  <OIcon><IconArrowRight /></OIcon>
                </div>
                <div class="modelzoo-desc">{{ i18n.modelzoo.introduce3 }}</div>
              </div>
            </a>
            <a
              class="modelzoo-card"
              :href="`https://${DOMAIN}/modelzoo/taichu`"
            >
              <div class="card-header">
                <img :src="modelzoo1" alt="" />
              </div>
              <div class="card-body">
                <div class="modelzoo-title">
                  <p>{{ i18n.modelzoo.modelzoo1 }}</p>
                  <OIcon><IconArrowRight /></OIcon>
                </div>
                <div class="modelzoo-desc">{{ i18n.modelzoo.introduce1 }}</div>
              </div>
            </a>
            <a
              class="modelzoo-card"
              :href="`https://${DOMAIN}/modelzoo/luojia`"
            >
              <div class="card-header">
                <img :src="modelzoo2" alt="" />
              </div>
              <div class="card-body">
                <div class="modelzoo-title">
                  <p>{{ i18n.modelzoo.modelzoo2 }}</p>
                  <OIcon><IconArrowRight /></OIcon>
                </div>
                <div class="modelzoo-desc">{{ i18n.modelzoo.introduce2 }}</div>
              </div>
            </a>
            <!-- <a class="modelzoo-card" :href="`https://${DOMAIN}/modelzoo/pangu`">
              <div class="card-header">
                <img :src="modelzoo3" alt="" />
              </div>
              <div class="card-body">
                <div class="modelzoo-title">
                  <p>{{ i18n.modelzoo.modelzoo3 }}</p>
                  <OIcon><IconArrowRight /></OIcon>
                </div>
                <div class="modelzoo-desc">{{ i18n.modelzoo.introduce3 }}</div>
              </div>
            </a> -->
          </div>
        </div>

        <!-- 模型 -->
        <div
          class="content-model"
          data-aos-duration="1200"
          data-aos-offset="-121"
          data-aos-once="true"
        >
          <a
            class="model-card"
            href="https://xihe.mindspore.cn/models/MindSpore/vgg16_cifar10"
          >
            <div class="card-header">
              <img :src="models1" alt="" />
            </div>
            <div class="card-body">
              <div class="model-title">
                <p>{{ i18n.model.models1 }}</p>
                <OIcon><IconArrowRight /></OIcon>
              </div>
              <p class="model-label">VGG16｜ResNet-101｜InceptionV4 …</p>
              <div class="model-tag">CV</div>
            </div>
          </a>
          <a
            class="model-card"
            href="https://xihe.mindspore.cn/models/MindSpore/yolov5shape640"
          >
            <div class="card-header">
              <img :src="models2" alt="" />
            </div>
            <div class="card-body">
              <div class="model-title">
                <p>{{ i18n.model.models2 }}</p>
                <OIcon><IconArrowRight /></OIcon>
              </div>
              <p class="model-label">YOLOv5｜SSD ｜MobileNet …</p>
              <div class="model-tag">CV</div>
            </div>
          </a>
          <a
            class="model-card"
            href="https://xihe.mindspore.cn/models/MindSpore/bertbase_cnnews128"
          >
            <div class="card-header">
              <img :src="models3" alt="" />
            </div>
            <div class="card-body">
              <div class="model-title">
                <p>{{ i18n.model.models3 }}</p>
                <OIcon><IconArrowRight /></OIcon>
              </div>
              <p class="model-label">BERT｜GRU｜Transformer …</p>
              <div class="model-tag">NLP</div>
            </div>
          </a>
          <a
            class="model-card"
            href="https://xihe.mindspore.cn/models/MindSpore/deepfm_criteo"
          >
            <div class="card-header">
              <img :src="models4" alt="" />
            </div>
            <div class="card-body">
              <div class="model-title">
                <p>{{ i18n.model.models4 }}</p>
                <OIcon><IconArrowRight /></OIcon>
              </div>
              <p class="model-label">DeepFM｜Wide&Deep｜NCF …</p>
              <div class="model-tag">Recommendation</div>
            </div>
          </a>
          <a class="model-entry" :href="`https://${DOMAIN}/models`">
            <div class="entry-header">
              <p class="entry-title">{{ i18n.model.title }}</p>
              <p class="entry-desc">{{ i18n.model.introduce }}</p>
            </div>
            <p class="entry-body">
              {{ i18n.model.more }}<OIcon><IconArrowRight /></OIcon>
            </p>
          </a>
        </div>

        <!-- 数据集 -->
        <div
          class="content-dataset"
          data-aos="slide-up"
          data-aos-duration="800"
          data-aos-offset="-800"
          data-aos-once="true"
        >
          <div class="dataset-right">
            <p class="dataset-title">{{ i18n.dataset.title }}</p>
            <p class="dataset-desc">{{ i18n.dataset.introduce }}</p>
            <OButton
              animation
              class="dataset-entry"
              data-aos="slide-up"
              data-aos-offset="200"
              data-aos-duration="1600"
              @click="handleBtnClick2"
            >
              {{ i18n.dataset.quickStartLabel }}
              <template #suffix>
                <OIcon><IconArrowRight /></OIcon>
              </template>
            </OButton>
          </div>
          <img class="dataset-left" :src="datasetPageImg" alt="" />
        </div>
      </div>
    </div>
    <footer class="app-footer">
      <app-footer></app-footer>
    </footer>
  </div>
</template>

<style lang="scss" scoped>
.app-tip {
  position: fixed;
  z-index: 100;
  bottom: 30vh;
  right: 0;
  .tip-content {
    position: relative;
    margin-right: 16px;
    .tip-img {
      max-width: 200px;
      object-fit: fill;
      cursor: pointer;
    }
    .tip-btn {
      position: absolute;
      right: 2px;
      top: 50px;
      max-width: 17px;
      cursor: pointer;
    }
  }
}
.o-icon {
  transition: all 0.2s linear;
}
.home {
  position: relative;
  width: 100%;
  // .home-portal {
  //   height: 100vh;
  //   background-color: #0f1927;

  //   &-video {
  //     position: absolute;
  //     z-index: 1;
  //     top: 0;
  //     left: 0;
  //     right: 0;
  //     width: 100%;
  //     object-fit: cover;
  //     height: 100vh;
  //     pointer-events: none;
  //   }

  //   &-banner {
  //     position: absolute;
  //     z-index: 0;
  //     top: 0;
  //     left: 0;
  //     right: 0;
  //     width: 100%;
  //     object-fit: cover;
  //     height: 100vh;
  //     pointer-events: none;
  //   }

  //   &-mask {
  //     position: absolute;
  //     z-index: 2;
  //     top: 0;
  //     left: 0;
  //     width: 100%;
  //     height: 100vh;
  //     background-color: rgba($color: #000000, $alpha: 0.35);
  //     pointer-events: none;
  //   }

  //   &-content {
  //     width: 100%;
  //     height: 100%;
  //     position: relative;
  //     display: flex;
  //     flex-direction: column;
  //     justify-content: center;
  //     align-items: center;
  //     font-size: 80px;
  //     color: #ffffff;
  //     overflow-y: hidden;
  //     z-index: 3;

  //     .portal-content-desc {
  //       font-size: 44px;
  //       font-weight: bold;
  //       color: #ffffff;
  //       line-height: 52px;
  //     }

  //     .portal-content-title {
  //       height: 45px;
  //       font-size: 32px;
  //       font-weight: 400;
  //       color: #ffffff;
  //       line-height: 45px;
  //       margin-top: 20px;
  //     }

  //     .portal-content-btn {
  //       margin-top: 45px;
  //     }

  //     .watching-more {
  //       position: absolute;
  //       bottom: 62px;
  //       z-index: 2;
  //       display: flex;
  //       flex-direction: column;
  //       align-items: center;
  //       img {
  //         height: 40px;
  //         object-fit: fill;
  //       }
  //       p {
  //         color: #ffffff;
  //         margin-top: 13px;
  //         font-size: 14px;
  //         font-weight: 400;
  //         line-height: 22px;
  //       }
  //     }
  //   }
  // }
  .swiper {
    margin-top: 80px;
    @media screen and (max-width: 1920px) {
      img {
        height: 480px;
      }
    }
    @media screen and (min-width: 1920px) {
      img {
        width: 100%;
      }
    }
    // .photo {
    //   display: flex;
    //   justify-content: center;
    // }
    // .photo {
    //   // display: flex;
    //   // justify-content: center;
    //   width: 100%;
    //   height: 480px;
    //   background-size: cover;
    //   background-position: 50%;
    // }
    // .photo1 {
    //   background: url(@/assets/imgs/home-banner3.png);
    //   width: 100%;
    //   height: 480px;
    //   background-size: cover;
    //   background-position: 50%;
    // }
    // .photo2 {
    //   background: url(@/assets/imgs/home-banner2.png);
    //   width: 100%;
    //   height: 480px;
    //   background-size: cover;
    //   background-position: 50%;
    // }
    .photo3 {
      background: url(@/assets/imgs/home/home-banner4.jpg);
      width: 100%;
      height: 480px;
      background-size: cover;
      background-position: 50%;
    }
    .photo4 {
      background: url(@/assets/imgs/home/home-banner5.jpg);
      width: 100%;
      height: 480px;
      background-size: cover;
      background-position: 50%;
    }
    .photo5 {
      background: url(@/assets/imgs/home/home-banner6.png);
      width: 100%;
      height: 480px;
      background-size: cover;
      background-position: 50%;
    }
    .photo6 {
      background: url(@/assets/imgs/home/home-banner1.png);
      width: 100%;
      height: 480px;
      background-size: cover;
      background-position: 50%;
    }
    .photo7 {
      background: url(@/assets/imgs/home/home-banner2.png);
      width: 100%;
      height: 480px;
      background-size: cover;
      background-position: 50%;
    }
    .cursor {
      cursor: pointer;
    }
  }

  .home-content {
    width: 100%;
    background-color: #f5f6f8;
    .wrapper {
      max-width: 1472px;
      margin: 0 auto;
      padding: 60px 16px 128px;

      .content-page {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .page-left {
          .page-title {
            font-size: 54px;
            font-weight: 400;
            color: #000000;
            line-height: 76px;
          }
          .page-desc {
            font-size: 16px;
            font-weight: normal;
            color: #555555;
            line-height: 24px;
            margin-top: 16px;
          }

          .page-entry {
            margin-top: 48px;
          }
        }
        .page-right {
          max-width: 784px;
          margin-left: 50px;
        }
      }

      .content-project {
        display: flex;
        margin-top: 120px;
        .project-card {
          max-width: 277px;
          flex-basis: 277px;
          background: rgba(255, 255, 255, 0.95);
          box-shadow: 0px 1px 5px 0px rgba(45, 47, 51, 0.1);
          margin-right: 24px;
          cursor: pointer;

          &:hover {
            box-shadow: 0 6px 18px #0d8dff24;
            .card-header {
              img {
                transform: scale(1.1);
              }
            }
            .o-icon {
              transform: translate(4px);
            }
          }
          .card-header {
            width: 100%;
            overflow: hidden;

            img {
              transition: all 0.2s linear;
              width: 100%;
            }
          }

          .card-body {
            padding: 24px 28px 24px 24px;
            .project-title {
              position: relative;
              font-size: 24px;
              color: #000000;
              line-height: 36px;
              display: flex;
              justify-content: space-between;
              align-items: center;

              &::after {
                position: absolute;
                content: '';
                bottom: -16px;
                height: 1px;
                width: 100%;
                background-color: #555555;
              }
            }

            .project-tag {
              display: inline-block;
              margin-top: 32px;
              height: 20px;
              background: #efefef;
              padding: 3px 8px;
              font-size: 12px;
              font-weight: normal;
              color: #555555;
              line-height: 14px;
            }
          }
        }

        .project-entry {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 40px;
          flex-shrink: 3;
          min-height: 356px;
          background: rgba(255, 255, 255, 0.95);
          box-shadow: 0px 1px 5px 0px rgba(45, 47, 51, 0.1);
          &:hover {
            box-shadow: 0 6px 18px #0d8dff24;
            .o-icon {
              transform: translate(4px);
            }
          }

          .entry-header {
            .entry-title {
              font-size: 54px;
              font-weight: 400;
              color: #000000;
              line-height: 76px;
            }
            .entry-desc {
              height: 48px;
              font-size: 16px;
              font-weight: 400;
              color: #555555;
              line-height: 24px;
            }
          }

          .entry-body {
            display: flex;
            font-size: 14px;
            font-weight: 400;
            color: #000000;
            line-height: 22px;
            align-items: center;

            .o-icon {
              font-size: 16px;
              margin-left: 8px;
              color: #3d8df7;
            }
          }
        }
      }

      .content-modelzoo {
        margin-top: 64px;
        .modelzoo-entry {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 40px;
          background: #ffffff;
          box-shadow: 0px 1px 5px 0px rgba(45, 47, 51, 0.1);

          &:hover {
            box-shadow: 0 6px 18px #0d8dff24;

            .o-icon {
              transform: translate(4px);
            }
          }
          .entry-title {
            font-size: 54px;
            font-weight: 400;
            color: #000000;
            line-height: 76px;
          }

          .entry-desc {
            margin-top: 16px;
            font-size: 16px;
            font-weight: 400;
            color: #555555;
            line-height: 24px;
          }
        }

        .modelzoo-card-list {
          margin-top: 24px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          column-gap: 24px;

          .modelzoo-card {
            background: rgba(255, 255, 255, 0.95);
            box-shadow: 0px 1px 5px 0px rgba(45, 47, 51, 0.1);
            width: 100%;
            cursor: pointer;

            &:hover {
              box-shadow: 0 6px 18px #0d8dff24;
              .card-header {
                overflow: hidden;
                img {
                  transform: scale(1.1);
                }
              }
              .o-icon {
                transform: translate(4px);
              }
            }
            .card-header {
              overflow: hidden;

              img {
                transition: all 0.2s linear;
                width: 100%;
              }
            }

            .card-body {
              padding: 24px 28px 24px 24px;
              .modelzoo-title {
                position: relative;
                font-size: 24px;
                color: #000000;
                line-height: 36px;
                display: flex;
                justify-content: space-between;
                align-items: center;

                &::after {
                  position: absolute;
                  content: '';
                  bottom: -16px;
                  height: 1px;
                  width: 100%;
                  background-color: #555555;
                }
              }

              .modelzoo-desc {
                display: inline-block;
                margin-top: 48px;
                font-size: 16px;
                font-weight: normal;
                color: #555555;
                line-height: 24px;
              }
            }
          }
        }
      }

      .content-model {
        margin-top: 64px;
        // display: grid;
        // grid-template-columns: repeat(6, 1fr);
        // column-gap: 24px;
        display: flex;
        .model-card {
          flex-basis: 224px;
          margin-right: 24px;
          padding: 24px 28px 24px 24px;
          background: rgba(255, 255, 255, 0.95);
          box-shadow: 0px 1px 5px 0px rgba(45, 47, 51, 0.1);
          cursor: pointer;

          &:hover {
            box-shadow: 0 6px 18px #0d8dff24;

            .o-icon {
              transform: translate(4px);
            }
          }
          .card-header {
            display: flex;
            justify-content: center;
            img {
              max-width: 80px;
            }
          }
          .card-body {
            margin-top: 50px;
            .model-title {
              position: relative;
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-size: 20px;
              font-weight: normal;
              color: #000000;
              line-height: 28px;

              &::after {
                position: absolute;
                content: '';
                bottom: -16px;
                height: 1px;
                width: 100%;
                background-color: #555555;
              }
            }

            .model-label {
              margin-top: 32px;
              font-size: 14px;
              font-weight: normal;
              color: #555555;
              line-height: 22px;
            }

            .model-tag {
              display: inline-block;
              margin-top: 16px;
              height: 20px;
              background: #efefef;
              padding: 3px 8px;
              font-size: 12px;
              font-weight: normal;
              color: #555555;
              line-height: 14px;
            }
          }
        }

        .model-entry {
          // grid-column: 5 / 7;
          background: rgba(255, 255, 255, 0.95);
          box-shadow: 0px 1px 5px 0px rgba(45, 47, 51, 0.1);
          max-width: 448px;
          display: flex;
          flex-shrink: 4;
          flex-direction: column;
          justify-content: space-between;
          padding: 40px;
          &:hover {
            box-shadow: 0 6px 18px #0d8dff24;

            .o-icon {
              transform: translate(4px);
            }
          }

          .entry-header {
            .entry-title {
              font-size: 54px;
              font-weight: 400;
              color: #000000;
              line-height: 76px;
            }
            .entry-desc {
              font-size: 16px;
              font-weight: 400;
              color: #555555;
              line-height: 24px;
            }
          }

          .entry-body {
            display: flex;
            font-size: 14px;
            font-weight: 400;
            color: #000000;
            line-height: 22px;
            align-items: center;

            .o-icon {
              font-size: 16px;
              margin-left: 8px;
              color: #3d8df7;
            }
          }
        }
      }

      .content-dataset {
        margin-top: 128px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .dataset-left {
          max-width: 791px;
        }
        .dataset-right {
          margin-left: 50px;
          .dataset-title {
            font-size: 54px;
            font-weight: 400;
            color: #000000;
            line-height: 76px;
          }
          .dataset-desc {
            font-size: 16px;
            font-weight: normal;
            color: #555555;
            line-height: 24px;
            margin-top: 16px;
          }

          .dataset-entry {
            margin-top: 48px;
          }
        }
      }
    }
  }
}
</style>
