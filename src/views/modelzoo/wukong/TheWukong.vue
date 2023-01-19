<script setup>
import { ref, watch, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination, FreeMode, Navigation } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';

import ONav from '@/components/ONav.vue';

import wukongBanner1 from '@/assets/imgs/wukong/wukong-banner1.png';
import wukongBanner2 from '@/assets/imgs/wukong/wukong-banner2.png';
import background from '@/assets/imgs/wukong/wukong-bg.jpg';

import IconAlbum from '~icons/app/wukong-album';
import IconCollection from '~icons/app/wukong-collection';
import IconArrowRight from '~icons/app/arrow-right.svg';
import IconDownload from '~icons/app/wukong-download';
import IconHeart from '~icons/app/collected';
import IconCollected from '~icons/app/wk-collecte';

import WukongAlbum from '@/views/modelzoo/wukong/WukongAlbum.vue';

import { ArrowRight } from '@element-plus/icons-vue';

import {
  collectedPictures,
  cancelLikePicture,
  temporaryLink,
} from '@/api/api-modelzoo.js';
import { ElMessage } from 'element-plus';

import { goAuthorize } from '@/shared/login';
import { useLoginStore } from '@/stores';

const isLogined = computed(() => useLoginStore().isLogined);

const route = useRoute();
const router = useRouter();
const activeNavItem = ref('');

const isToggle = ref(false);

const navItems = [
  {
    id: 'wukongIntroduce',
    label: '介绍',
    href: '/modelzoo/wukong/introduce',
  },
  {
    id: 'wukongExperience',
    label: '在线体验',
    href: '/modelzoo/wukong',
  },
];
// 点击导航
function handleNavClick(item) {
  router.push({ path: item.href });
}
// 我的收藏
const showCollection = ref(false);
function toggleCollectionDlg(val) {
  if (!isLogined.value) {
    goAuthorize();
  } else {
    showCollection.value = val;
    getCollectedPictures();
  }
}
const collectList = ref([]);
const haveCollections = ref(false);
//获取我的收藏图片
function getCollectedPictures() {
  collectedPictures().then((res) => {
    if (res.data.data) {
      collectList.value = res.data.data;
      if (collectList.value) {
        haveCollections.value = true;
      } else {
        haveCollections.value = false;
      }
    }
  });
}
// 取消收藏
function handleCancelLike(id, index) {
  cancelLikePicture(id).then((res) => {
    if (res.status === 204) {
      collectList.value.splice(index, 1);
      ElMessage({
        type: 'success',
        message: '取消收藏成功',
      });
    }
  });
}
const showAlbum = ref(false);
// AI画集
function toggleAlbum() {
  showAlbum.value = true;
}
// 下载图片
function requestImg(item) {
  const link = item.replace(
    'https://big-model-deploy.obs.cn-central-221.ovaijisuan.com:443/',
    '/obs-big-model/'
  );
  let x = new XMLHttpRequest();
  x.open('GET', link, true);
  x.responseType = 'blob';
  x.onload = function () {
    const blobs = new Blob([x.response], { type: 'image/png' });
    let url = window.URL.createObjectURL(blobs);
    let a = document.createElement('a');
    a.href = url;
    a.download = 'collection.png';
    a.click();
  };
  x.send();
}
function downloadImage(item) {
  const j1 = item.indexOf('=');
  const j2 = item.indexOf('=', j1 + 1);

  const i1 = item.indexOf('&');
  const i2 = item.indexOf('&', i1 + 1);

  const deadTime = item.substring(j2 + 1, i2);
  const currentTime = (new Date().getTime() + '').substring(0, 10);

  if ((deadTime - currentTime) / 60 < 1) {
    temporaryLink({ link: item }).then((res) => {
      if (res.data.data) {
        requestImg(res.data.data.link);
      }
    });
  } else {
    requestImg(item);
  }
}
function learnWukongMore() {
  window.open(
    'https://github.com/mindspore-lab/minddiffusion/tree/main/vision/wukong-huahua'
  );
}
watch(
  () => activeNavItem.value,
  () => {
    isToggle.value = activeNavItem.value === 'wukongIntroduce' ? false : true;
  }
);
watch(
  () => {
    return route.name;
  },
  (val) => {
    if (/^wukongIntroduce|wukongExperience/g.test(val)) {
      activeNavItem.value = val;
    } else {
      activeNavItem.value = '';
    }
  },
  { immediate: true }
);
</script>
<template>
  <div :class="isToggle ? 'wukong-bg2' : 'wukong-bg1'">
    <img v-if="isToggle" class="bg2-image" :src="background" alt="" />
    <div class="wukong">
      <div class="wukong-bread">
        <el-breadcrumb :separator-icon="ArrowRight">
          <el-breadcrumb-item :to="{ path: '/modelzoo' }"
            >大模型</el-breadcrumb-item
          >
          <el-breadcrumb-item>悟空画画</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <div class="wukong-head">
        <div class="wukong-head-left">
          <img
            v-if="route.name === 'wukongIntroduce'"
            draggable="false"
            :src="wukongBanner1"
            alt=""
          />
          <img v-else draggable="false" :src="wukongBanner2" alt="" />
        </div>

        <div class="wukong-head-right">
          <div class="wukong-head-right-top">
            <div class="wukong-head-right-top-title">悟空画画</div>
            <div class="wukong-head-right-top-content">
              借助目前最大的中文开源多模态数据集悟空数据集进行训练，悟空-画画模型拥有优秀的中文文本-图像生成能力。模型能够识别各类场景描述与绘画风格，给用户带来良好的使用体验。
            </div>
          </div>

          <div class="wukong-head-right-btn">
            <OButton
              type="primary"
              animation
              class="home-btn"
              @click="learnWukongMore"
            >
              了解更多
              <template #suffix>
                <OIcon><IconArrowRight /></OIcon>
              </template>
            </OButton>
          </div>
        </div>
      </div>

      <div class="wukong-main">
        <div class="nav-tab">
          <o-nav
            :nav-items="navItems"
            :active-item="activeNavItem"
            @nav-click="handleNavClick"
          ></o-nav>
        </div>
        <div class="tab-content">
          <router-view></router-view>
        </div>
      </div>
    </div>
    <div v-if="route.name === 'wukongExperience'" class="sider-content">
      <div class="nav-item" @click="toggleAlbum(true)">
        <p class="nav-item-img">
          <o-icon><icon-album></icon-album></o-icon>
        </p>
        <p class="nav-item-text">AI画集</p>
      </div>
      <div class="nav-item" @click="toggleCollectionDlg(true)">
        <p class="nav-item-img">
          <o-icon><icon-collection></icon-collection></o-icon>
        </p>
        <p class="nav-item-text">我的收藏</p>
      </div>
    </div>
    <!-- 我的收藏dialog -->
    <el-dialog v-model="showCollection" :fullscreen="true" center>
      <swiper
        v-if="collectList.length >= 3"
        :slides-per-view="3"
        :slides-per-group="1"
        :speed="500"
        :space-between="30"
        :free-mode="true"
        :navigation="true"
        :pagination="{
          type: 'fraction',
          clickableClass: 'my-pagination-clickable',
        }"
        :modules="[Pagination, FreeMode, Navigation]"
        loop
        class="my-swiper2"
      >
        <swiper-slide v-for="(item, index) in collectList" :key="item.id"
          ><img :src="item.link" alt="" />
          <p>{{ item.desc }}</p>

          <div class="handler">
            <span class="icon-btn" @click="downloadImage(item.link)">
              <o-icon><icon-download></icon-download></o-icon>
            </span>
            <span
              class="icon-btn heart"
              @click="handleCancelLike(item.id, index)"
            >
              <o-icon><icon-heart></icon-heart></o-icon>
            </span>
          </div>
          <div class="mask"></div>
        </swiper-slide>
      </swiper>

      <swiper
        v-else-if="collectList.length > 0"
        :slides-per-view="3"
        :slides-per-group="1"
        :speed="500"
        :space-between="30"
        :free-mode="true"
        :navigation="true"
        :pagination="{
          type: 'fraction',
          clickableClass: 'my-pagination-clickable',
        }"
        :modules="[Pagination, FreeMode, Navigation]"
        class="my-swiper2 special"
      >
        <swiper-slide v-for="(item, index) in collectList" :key="item.id"
          ><img :src="item.link" alt="" />
          <p>{{ item.desc }}</p>

          <div class="handler">
            <span class="icon-btn" @click="downloadImage(item.link)">
              <o-icon><icon-download></icon-download></o-icon>
            </span>
            <span
              class="icon-btn heart"
              @click="handleCancelLike(item.id, index)"
            >
              <o-icon><icon-heart></icon-heart></o-icon>
            </span>
          </div>
          <div class="mask"></div>
        </swiper-slide>
      </swiper>

      <div v-else class="no-collections">
        <o-icon><icon-collected></icon-collected></o-icon>
        <p>暂无收藏</p>
      </div>

      <div class="collect-title">我的收藏</div>
    </el-dialog>
    <!-- AI画集 -->
    <el-dialog
      v-model="showAlbum"
      title="AI 画集"
      :destroy-on-close="true"
      :fullscreen="true"
      lock-scroll
      center
    >
      <WukongAlbum></WukongAlbum>
    </el-dialog>
  </div>
</template>
<style lang="scss">
.no-collections {
  text-align: center;
  font-size: 20px;
  font-weight: 400;
  color: #ffffff;
  margin-top: calc(40vh - 56px);
  .o-icon {
    font-size: 48px;
  }
  p {
    font-size: 16px;
    color: #ffffff;
    line-height: 18px;
    margin-top: 16px;
  }
}
.collect-title {
  position: fixed;
  top: 22px;
  left: -4px;
  font-size: 24px;
  color: #ffffff;
  line-height: 24px;
  text-align: center;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  width: 97%;
  padding-left: 3%;
}
.special {
  .swiper-wrapper {
    justify-content: space-around;
  }
}
.my-swiper2 {
  --swiper-navigation-size: 24px;
  --swiper-navigation-color: #fff;
  .mask {
    position: absolute;
    bottom: 42px;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 100%);
    width: 100%;
    height: 60%;
    display: none;
  }
  .handler {
    position: absolute;
    bottom: 64px;
    right: 24px;
    z-index: 9;
    display: none;
    .icon-btn {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      cursor: pointer;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      .o-icon {
        font-size: 24px;
      }
      &:hover {
        background: rgba(255, 255, 255, 0.3);
      }
      &:first-child {
        margin-right: 16px;
      }
    }
    .heart {
      .o-icon {
        font-size: 20px;
      }
    }
  }
  .swiper-button-prev,
  .swiper-button-next {
    width: 40px;
    height: 40px;
    border: 1px solid #000000;
    background: #000;
    border-radius: 50%;
    font-weight: 600;
    top: 55%;
  }
  .swiper-slide {
    &:hover {
      .handler,
      .mask {
        display: block;
      }
    }
    img {
      width: 100%;
      height: auto;
      margin-top: 16%;
    }
    p {
      color: #ffffff;
      text-align: center;
      line-height: 26px;
      font-size: 18px;
      margin-top: 16px;
    }
  }
  .my-pagination-clickable {
    position: fixed;
  }

  .swiper-pagination-fraction {
    color: #fff;
    font-size: 16px;
    line-height: 26px;
    position: fixed;
    top: 24px;
    left: 80px;
    bottom: unset;
  }
}
</style>
<style lang="scss" scoped>
:deep(.el-dialog) {
  --el-dialog-bg-color: rgba(0, 0, 0, 0.85) !important;
  .el-dialog__header {
    padding: 15px 0 15px;
    position: sticky;
    top: 0;
    background: #000;
    z-index: 200;
    span {
      color: #fff;
      font-size: 24px;
    }
  }
  .el-dialog__body {
    padding-top: 0;
  }
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background-color: #d8d8d8;
    background-clip: content-box;
  }
  &::-webkit-scrollbar-track {
    border-radius: 3px;
    box-shadow: inset 0 0 2px rgba($color: #000000, $alpha: 0.2);
    background: #ffffff;
  }
  .el-dialog__headerbtn {
    position: fixed;
    top: 6px;
    right: 15px;
    z-index: 201;
    .el-dialog__close {
      color: #fff;
      font-size: 40px;
    }
  }
}

.wukong-bg1 {
  background: #f5f6f8;
}
.wukong-bg2 {
  min-height: calc(100vh - 200px);
  background-color: #000;
  position: relative;
  overflow: hidden;
  .bg2-image {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }
  .wukong-bread {
    margin-bottom: 40px;
    .el-breadcrumb {
      :deep(.el-breadcrumb__item:last-child .el-breadcrumb__inner) {
        color: #fff;
        z-index: 99;
      }
      :deep(.el-breadcrumb__item:first-child .el-breadcrumb__inner) {
        color: #b2b2b2;
        z-index: 99;
      }
    }
  }
  .wukong-head {
    background: rgba(7, 12, 22, 0.6);
    box-shadow: 0px 1px 5px 0px rgba(45, 47, 51, 0.1);
    backdrop-filter: blur(5px);
    &-right {
      &-top {
        &-title {
          font-size: 36px;
          color: #fff;
          line-height: 48px;
        }
        &-content {
          font-size: 14px;
          color: #b2b2b2;
          line-height: 22px;
        }
      }
    }
  }
  .wukong-main {
    .nav-tab {
      margin-top: 16px;
      height: 48px;
      background-color: rgba(0, 0, 0, 0);
      .o-nav {
        background: rgba(7, 12, 22, 0.6);
        box-shadow: 0px 1px 30px 0px rgba(0, 0, 0, 0.05);
        backdrop-filter: blur(5px);
        :deep(.nav-item:first-child) {
          color: #fff !important;
        }
      }
    }
    .tab-content {
      padding: 40px 80px;
      background-color: rgba(0, 0, 0, 0);
      background: rgba(7, 12, 22, 0.6);
      box-shadow: 0px 1px 30px 0px rgba(0, 0, 0, 0.05);
      backdrop-filter: blur(5px);
      position: relative;
    }
  }
}
.wukong {
  padding: 120px 16px 64px;
  margin: 0 auto;
  max-width: 1472px;
  height: 100%;

  &-bread {
    margin-bottom: 40px;
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
  &-head {
    padding: 80px;
    background-color: #fff;
    box-shadow: 0px 1px 5px 0px rgba(45, 47, 51, 0.1);
    display: flex;
    margin-top: 40px;
    &-left {
      margin-right: 40px;
    }
    img {
      width: 416px;
    }
    &-right {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      &-top {
        &-title {
          line-height: 48px;
          font-size: 36px;
          color: #000000;
          margin-bottom: 16px;
        }
        &-content {
          font-size: 14px;
          color: #555555;
          line-height: 22px;
        }
      }
    }
  }
  &-main {
    .nav-tab {
      margin-top: 16px;
      .o-nav {
        background-color: rgba(251, 251, 251, 0.85);
        box-shadow: 0px -1px 30px 0px rgba(0, 0, 0, 0.05);
      }
      height: 48px;
      background-color: #fbfbfb;
      :deep(.o-nav) {
        width: 100%;
        display: flex;
        justify-content: center;
        margin: 0 auto;
        .nav-item {
          color: #555;
        }
      }
    }
    .tab-content {
      padding: 40px 80px;
      background: #fff;
    }
  }
}
.sider-content {
  position: fixed;
  top: 50%;
  right: 60px;
  transform: translateY(-50%);
  color: #fff;
  .nav-item {
    margin-bottom: 16px;
    text-align: center;
    cursor: pointer;
    &-img {
      width: 80px;
      height: 80px;
      background: rgba(255, 255, 255, 0.1);
      box-shadow: 0px 1px 30px 0px rgba(0, 0, 0, 0.05);
      font-size: 48px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    &-text {
      font-size: 14px;
      font-weight: 400;
      color: #b2b2b2;
      line-height: 20px;
      margin-top: 8px;
    }
  }
}
</style>