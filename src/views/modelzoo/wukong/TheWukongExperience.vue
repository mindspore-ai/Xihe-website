<script setup>
import { ref } from 'vue';

import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination, FreeMode, Navigation } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';

import one from '@/assets/imgs/wukong/style-bg-1.png';
import two from '@/assets/imgs/wukong/style-bg-2.png';
import three from '@/assets/imgs/wukong/style-bg-3.png';
import four from '@/assets/imgs/wukong/style-bg-4.png';
import five from '@/assets/imgs/wukong/style-bg-5.png';

import generate from '@/assets/imgs/wukong/ceshi3.jpg';

import IconRefresh from '~icons/app/refresh-taichu';
import IconAlbum from '~icons/app/wukong-album';
import IconCollection from '~icons/app/wukong-collection';
import IconDownload from '~icons/app/wukong-download';
import IconLike from '~icons/app/wukong-like';
import IconHeart from '~icons/app/collected';

import WukongAlbum from '@/views/modelzoo/wukong/WukongAlbum.vue';
import gallery from '@/assets/imgs/wukong/ceshi1.png';

const text = ref('');
const styleIndex = ref(0);

const showCollection = ref(false);
const isInferred = ref(false);
const showAlbum = ref(false);

const styleBackgrounds = ref([one, two, three, four, five]);
const styleBackground = ref([generate, generate, generate, generate]);

const styleData = ref([
  {
    style: '动漫',
    options: [
      { tag: '宫崎骏', isSelected: false },
      { tag: '新海城', isSelected: false },
    ],
  },
  {
    style: '经典',
    options: [
      { tag: '达芬奇', isSelected: false },
      { tag: '毕加索', isSelected: false },
      { tag: '梵高', isSelected: false },
      { tag: '莫奈', isSelected: false },
      { tag: '温斯洛.霍默', isSelected: false },
      { tag: '莫里茨.科内利斯.埃舍尔', isSelected: false },
    ],
  },
  {
    style: '幻想艺术',
    options: [
      { tag: '韦恩.巴洛', isSelected: false },
      { tag: '格雷格.鲁特科夫斯基', isSelected: false },
    ],
  },
  {
    style: '更多风格',
    options: [
      { tag: '动漫', isSelected: false },
      { tag: '国风', isSelected: false },
      { tag: '田园', isSelected: false },
      { tag: '涂鸦', isSelected: false },
      { tag: '立体', isSelected: false },
      { tag: '浮雕', isSelected: false },
      { tag: '水彩', isSelected: false },
      { tag: '油画', isSelected: false },
      { tag: '暗黑', isSelected: false },
      { tag: '写实', isSelected: false },
      { tag: '高清', isSelected: false },
      { tag: '蜡笔画', isSelected: false },
      { tag: '专业CG艺术', isSelected: false },
      { tag: '彩色国风水墨', isSelected: false },
      { tag: '生动色彩', isSelected: false },
      { tag: '星际漫游', isSelected: false },
      { tag: '赛博朋克', isSelected: false },
      { tag: '印象主义', isSelected: false },
      { tag: '现代主义', isSelected: false },
      { tag: '巴洛克风格', isSelected: false },
      { tag: '像素风格', isSelected: false },
      { tag: '浮世绘', isSelected: false },
      { tag: '蒸汽波', isSelected: false },
    ],
  },
  {
    style: '随机风格',
    options: [],
  },
]);

const randomList = ref([
  { tag: '宫崎骏', isSelected: false },
  { tag: '新海城', isSelected: false },
  { tag: '达芬奇', isSelected: false },
  { tag: '毕加索', isSelected: false },
  { tag: '梵高', isSelected: false },
  { tag: '莫奈', isSelected: false },
  { tag: '温斯洛.霍默', isSelected: false },
  { tag: '莫里茨.科内利斯.埃舍尔', isSelected: false },
  { tag: '韦恩.巴洛', isSelected: false },
  { tag: '格雷格.鲁特科夫斯基', isSelected: false },
  { tag: '动漫', isSelected: false },
  { tag: '国风', isSelected: false },
  { tag: '田园', isSelected: false },
  { tag: '涂鸦', isSelected: false },
  { tag: '立体', isSelected: false },
  { tag: '浮雕', isSelected: false },
  { tag: '水彩', isSelected: false },
  { tag: '油画', isSelected: false },
  { tag: '暗黑', isSelected: false },
  { tag: '写实', isSelected: false },
  { tag: '高清', isSelected: false },
  { tag: '蜡笔画', isSelected: false },
  { tag: '专业CG艺术', isSelected: false },
  { tag: '彩色国风水墨', isSelected: false },
  { tag: '生动色彩', isSelected: false },
  { tag: '星际漫游', isSelected: false },
  { tag: '赛博朋克', isSelected: false },
  { tag: '印象主义', isSelected: false },
  { tag: '现代主义', isSelected: false },
  { tag: '巴洛克风格', isSelected: false },
  { tag: '像素风格', isSelected: false },
  { tag: '浮世绘', isSelected: false },
  { tag: '蒸汽波', isSelected: false },
]);

const exampleData = ref([
  { text: '空山新雨后', isSelected: false },
  { text: '北国风光', isSelected: false },
  { text: '星河欲坠时', isSelected: false },
  { text: '西湖 烟雨', isSelected: false },
  { text: '落日 莫奈', isSelected: false },
  { text: '星空 梵高', isSelected: false },
]);

const newExampleData = ref([
  { text: '样例1', isSelected: false },
  { text: '样例2', isSelected: false },
  { text: '样例3', isSelected: false },
  { text: '样例4', isSelected: false },
  { text: '样例5', isSelected: false },
  { text: '样例6', isSelected: false },
]);

function cancelCollect() {
  styleBackground.value.splice(3, 1);
}

function exampleSelectHandler(item) {
  exampleData.value.forEach((item) => {
    item.isSelected = false;
  });
  item.isSelected = true;
  text.value = item.text;
}

function handleInput() {
  exampleData.value.forEach((item) => {
    if (item.text === text.value) {
      item.isSelected = true;
    } else {
      item.isSelected = false;
    }
  });
}

function choseStyleSort(val) {
  styleIndex.value = val;
}

function choseSortTag(val) {
  console.log(val);
  styleData.value.forEach((item) => {
    item.options.forEach((tag) => {
      tag.isSelected = false;
    });
  });
  val.isSelected = true;
}

function getRandomStyle(index) {
  if (index === 4) {
    const i = Math.floor(Math.random() * randomList.value.length);
    styleData.value[index].options = [randomList.value[i]];
  } else {
    return;
  }
}

const showInferDlg = ref(false);
function handleInfer() {
  showInferDlg.value = true;

  setTimeout(() => {
    isInferred.value = true;
  }, 3000);
}

function refreshTags() {
  exampleData.value = newExampleData.value;
}

function toggleCollectionDlg(val) {
  showCollection.value = val;
}

// AI画集
function toggleAlbum() {
  showAlbum.value = true;
}
</script>
<template>
  <div class="wk-experience">
    <el-input
      v-model="text"
      maxlength="75"
      placeholder="请输入简体中文或选择下方样例"
      show-word-limit
      type="text"
      clearable
      @input="handleInput"
    />

    <div class="wk-experience-examples">
      <p class="title">选择样例</p>
      <div class="example-items">
        <p
          v-for="item in exampleData"
          :key="item.text"
          :class="item.isSelected ? 'active' : ''"
          @click="exampleSelectHandler(item)"
        >
          {{ item.text }}
        </p>
      </div>
      <div class="refresh" @click="refreshTags">
        <o-icon><icon-refresh></icon-refresh></o-icon>
        <p>换一批</p>
      </div>
    </div>

    <div class="wk-experience-styles">
      <p class="title">选择风格</p>
      <div class="content">
        <div class="style-tag">
          <div
            v-for="(item, index) in styleData"
            :key="item.style"
            class="style-item"
            :class="styleIndex === index ? 'active-1' : ''"
            @click="choseStyleSort(index)"
          >
            <img :src="styleBackgrounds[index]" alt="" />

            <div class="style-item-name" @click="getRandomStyle(index)">
              {{ item.style }}
            </div>
          </div>
        </div>

        <div class="sort-tag">
          <div
            v-for="item in styleData[styleIndex].options"
            :key="item"
            class="sort-item"
            :class="item.isSelected ? 'active' : ' '"
            @click="choseSortTag(item)"
          >
            {{ item.tag }}
          </div>

          <div :class="`triangle${styleIndex}`"></div>
        </div>
      </div>
    </div>

    <div class="wk-experience-btn" @click="handleInfer">立即生成</div>

    <div class="sider-content">
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
    <!-- 推理dialog -->
    <el-dialog
      v-model="showInferDlg"
      :fullscreen="true"
      :append-to-body="true"
      class="infer-dlg"
    >
      <template #header="{ titleClass }">
        <div class="infer-dlg-head">
          <span class="title" :class="titleClass"
            >来自深渊 风景 绘画 写实风格</span
          >
        </div>
      </template>

      <div v-if="!isInferred" class="infer-dlg-loading">
        <img src="@/assets/gifs/loading.gif" alt="" />
        <p>正在创作中，请耐心等待</p>
      </div>

      <div v-else class="infer-dlg-result">
        <div v-for="item in styleBackground" :key="item" class="result-item">
          <img :src="item" alt="" />
          <div class="handles">
            <div class="handles-contain">
              <p>
                <o-icon><icon-download></icon-download></o-icon>
              </p>
              <p>
                <o-icon><icon-like></icon-like></o-icon>
              </p>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 我的收藏dialog -->
    <el-dialog
      v-model="showCollection"
      :fullscreen="true"
      :append-to-body="true"
      center
      class="collection-dlg"
    >
      <swiper
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
        <swiper-slide v-for="item in 5" :key="item"
          ><img :src="gallery" alt="" />
          <p>来自深渊 风景 绘画 写实风格</p>

          <div class="handler">
            <p>
              <o-icon><icon-download></icon-download></o-icon>
            </p>
            <p class="heart">
              <o-icon><icon-heart></icon-heart></o-icon>
            </p>
          </div>
        </swiper-slide>

        <div class="collect-title">我的收藏</div>
      </swiper>
    </el-dialog>

    <!-- AI画集 -->
    <el-dialog
      v-model="showAlbum"
      :fullscreen="true"
      :append-to-body="true"
      class="album-dlg"
    >
      <WukongAlbum></WukongAlbum>
    </el-dialog>
  </div>
</template>
<style lang="scss">
.infer-dlg {
  background: none;
  &-head {
    .title {
      color: #fff;
    }
  }

  &-result {
    display: flex;
    justify-content: space-between;
    width: 100%;

    .result-item {
      position: relative;
      margin-right: 24px;
      width: 23vw;
      height: 23vw;

      &:last-child {
        margin-right: 0;
      }

      &:hover {
        .handles {
          display: block;
        }
      }

      img {
        height: 100%;
        width: 100%;
      }

      .handles {
        position: absolute;
        bottom: 24px;
        right: 24px;
        @media screen and (max-width: 1450px) {
          bottom: 10px;
          right: 10px;
        }
        &-contain {
          display: flex;
          p {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.1);
            font-size: 24px;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            @media screen and (max-width: 1080px) {
              width: 24px;
              height: 24px;
              .o-icon {
                font-size: 16px;
              }
            }
            &:first-child {
              margin-right: 16px;
              @media screen and (max-width: 1450px) {
                margin-right: 8px;
              }
            }
            &:hover {
              background: rgba(255, 255, 255, 0.3);
            }
          }
        }
      }
    }
  }

  &-loading {
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    img {
      width: 56px;
      align-self: center;
    }
    p {
      font-size: 18px;
      font-weight: 400;
      color: #ffffff;
      line-height: 25px;
      text-align: center;
    }
  }

  .el-dialog__header {
    height: 80px;
    padding: 0;
    text-align: center;
    line-height: 80px;
    background: #000;
    margin-right: 0;
  }

  .el-dialog__body {
    padding-left: 64px;
    padding-right: 64px;
    padding-bottom: 120px;
    height: calc(100vh - 80px);
    display: flex;
    align-items: center;
    background: rgba(0, 0, 0, 0.85);
  }

  .el-dialog__headerbtn {
    top: 16px;
    right: 24px;
    .el-dialog__close {
      color: #fff;
      font-size: 40px;
    }
  }
}
.my-swiper2 {
  --swiper-navigation-size: 24px;
  --swiper-navigation-color: #fff;

  .handler {
    position: absolute;
    bottom: 64px;
    right: 24px;
    display: flex;
    p {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      &:hover {
        background: rgba(255, 255, 255, 0.3);
      }
      &:first-child {
        margin-right: 16px;
      }
    }
  }

  .collect-title {
    position: fixed;
    top: 22px;
    left: -40px;
    font-size: 24px;
    color: #ffffff;
    line-height: 24px;
    text-align: center;
    width: 100%;
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
    top: 22px;
    left: 50px;
    bottom: unset;
  }
}

.collection-dlg {
  background: rgba(0, 0, 0, 0.85);
  .el-dialog__headerbtn {
    right: 10px;
    z-index: 2010;
    .el-dialog__close {
      color: #fff;
      font-size: 40px;
    }
  }
}

.album-dlg {
  padding-left: 6%;
  padding-right: 6%;
  background: rgb(0, 0, 0);
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

  .el-dialog__body {
    background: rgba(0, 0, 0, 0.85);
  }

  .el-dialog__headerbtn {
    right: 10px;
    .el-dialog__close {
      color: #fff;
      font-size: 40px;
    }
  }
}
</style>
<style lang="scss" scoped>
.wk-experience {
  position: relative;

  .sider-content {
    position: absolute;
    bottom: 220px;
    right: -231px;
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

  :deep(.el-input) {
    max-width: 1416px;
    width: 100%;
    .el-input__wrapper {
      box-shadow: none;
      height: 56px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      backdrop-filter: blur(5px);
      padding: 8px 24px;

      .el-input__inner {
        font-size: 14px;
        color: #fff;
      }

      .el-input__count .el-input__count-inner {
        background: none;
      }
    }
  }

  .title {
    font-size: 18px;
    font-weight: 400;
    color: #ffffff;
    line-height: 25px;
    margin-right: 40px;
  }
  .active {
    color: #fff !important;
    background: #008eff !important;
  }
  .active-1 {
    border: 1px solid #008eff;
  }

  &-examples {
    display: flex;
    margin-top: 48px;
    align-items: center;

    .example-items {
      flex: 1;
      display: flex;
      flex-wrap: wrap;
      p {
        color: #b2b2b2;
        border: 1px solid #0d8dff;
        margin-right: 16px;
        border-radius: 8px;
        background: rgba(13, 141, 255, 0.3);
        padding: 7px 12px;
        font-size: 14px;
        font-size: 14px;
        cursor: pointer;
      }
    }
    .refresh {
      font-size: 12px;
      font-weight: 400;
      color: #0d8dff;
      cursor: pointer;
      display: flex;
      align-items: center;
      .o-icon {
        margin-right: 4px;
      }
    }
  }

  &-styles {
    margin-top: 48px;
    display: flex;
    .content {
      flex: 1;
      .style-tag {
        display: flex;
        cursor: pointer;
      }
      .sort-tag {
        display: flex;
        flex-wrap: wrap;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(5px);
        border-radius: 8px;
        margin-top: 16px;
        padding: 8px 24px 24px;
        width: 100%;
        min-height: 93px;
        position: relative;
        .triangle0 {
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-bottom: 10px solid rgba(85, 85, 85, 0.3);
          position: absolute;
          top: -10px;
          left: 62px;
        }
        .triangle1 {
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-bottom: 10px solid rgba(85, 85, 85, 0.3);
          position: absolute;
          left: 202px;
          top: -10px;
        }
        .triangle2 {
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-bottom: 10px solid rgba(85, 85, 85, 0.3);
          position: absolute;
          left: 358px;
          top: -10px;
        }
        .triangle3 {
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-bottom: 10px solid rgba(85, 85, 85, 0.3);
          position: absolute;
          left: 498px;
          top: -10px;
        }
        .triangle4 {
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-bottom: 10px solid rgba(85, 85, 85, 0.3);
          position: absolute;
          left: 638px;
          top: -10px;
        }

        .sort-item {
          background: rgba(13, 141, 255, 0.3);
          border-radius: 8px;
          border: 1px solid #0d8dff;
          padding: 12px 16px;
          margin-right: 16px;
          margin-top: 16px;
          font-size: 18px;
          font-weight: 400;
          color: #b2b2b2;
          cursor: pointer;
        }
      }
    }
    .style-item {
      display: flex;
      justify-content: center;
      width: 129px;
      height: 80px;
      background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 100%);
      margin-right: 16px;
      border-radius: 5px;
      color: #fff;
      position: relative;
      overflow: hidden;
      img {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
      }
      &-name {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        padding: 40px 0 16px;
        text-align: center;
        background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 100%);
      }
    }
  }

  &-btn {
    background-image: url('@/assets/imgs/wukong/button-bg.png');
    background-repeat: no-repeat;
    background-size: cover;
    width: 130px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    color: #fff;
    font-size: 14px;
    font-weight: 500;
    margin: 48px auto 0px;
    cursor: pointer;
  }
}
</style>
