<script setup>
import { ref, computed } from 'vue';

import html2canvas from 'html2canvas';

import comic from '@/assets/imgs/wukong/style-bg-1.png';
import classic from '@/assets/imgs/wukong/style-bg-2.png';
import fantasy from '@/assets/imgs/wukong/style-bg-3.png';
import more from '@/assets/imgs/wukong/style-bg-4.png';
import random from '@/assets/imgs/wukong/style-bg-5.png';
import loading from '@/assets/gifs/loading.gif';

import IconRefresh from '~icons/app/refresh-taichu';
import IconDownload from '~icons/app/wukong-download';
import IconLike from '~icons/app/wukong-like';
import IconX from '~icons/app/x';
import IconHeart from '~icons/app/collected';
import IconCancel from '~icons/app/cancel-public';
import IconArrow from '~icons/app/arrow-top';
import IconShare from '~icons/app/share';
import IconCopy from '~icons/app/copy-nickname';
import IconWarning from '~icons/app/warning1';
import IconRight from '~icons/app/arrow-right';

import { goAuthorize } from '@/shared/login';
import { useLoginStore, useUserInfoStore } from '@/stores';

import {
  wuKongInfer,
  addLikePicture,
  cancelLikePicture,
  temporaryLink,
} from '@/api/api-modelzoo.js';
import { ElMessage } from 'element-plus';

const isLogined = computed(() => useLoginStore().isLogined);
const userInfoStore = useUserInfoStore();

const inputText = ref('');
const sortTag = ref('');
const styleIndex = ref(0);

const showInferDlg = ref(false);
const isInferred = ref(false);
const isError = ref(false);

const styleBackgrounds = ref([comic, classic, fantasy, more, random]);
const styleBackground = ref([]);

const styleData = ref([
  {
    style: '动漫',
    options: [
      { tag: '宫崎骏', isSelected: false },
      { tag: '新海诚', isSelected: false },
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
  { tag: '新海诚', isSelected: false },
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
  { text: '秋水共长天一色', isSelected: false },
  { text: '城市夜景', isSelected: false },
  { text: '悬崖 美景 壮观 高清', isSelected: false },
  { text: '西湖 烟雨', isSelected: false },
  { text: '海滩 美景 高清', isSelected: false },
]);

const lists = ref([
  { text: '城市夜景 油画', isSelected: false },
  { text: '星空 梵高', isSelected: false },
  { text: '落日 莫奈', isSelected: false },
  { text: '抽烟的女人 毕加索', isSelected: false },
  { text: '教堂 巴洛克风格', isSelected: false },
  { text: '程序员 头像 像素风格', isSelected: false },
  { text: '城市夜景 赛博朋克 格雷格.鲁特科夫斯基', isSelected: false },
  { text: '都市 天际线 日出', isSelected: false },
  { text: '天气播报 背景 云', isSelected: false },
  { text: '海滩 美景 高清', isSelected: false },
  { text: '沙漠 美景 高清', isSelected: false },
  { text: '森林 落叶 美景 高清', isSelected: false },
  { text: '悬崖 美景 壮观 高清', isSelected: false },
  { text: '时空 黑洞 辐射', isSelected: false },
  { text: '西湖 烟雨', isSelected: false },
  { text: '山水 水墨 写意', isSelected: false },
  { text: '温馨的森林木屋', isSelected: false },
  { text: '空山新雨后', isSelected: false },
  { text: '小桥流水人家', isSelected: false },
  { text: '飞流直下三千尺，疑是银河落九天', isSelected: false },
  { text: '永无夜晚铜锣湾', isSelected: false },
  { text: '上海陆家嘴 未来城市 科幻风格', isSelected: false },
  { text: '梅花香自苦寒来', isSelected: false },
  { text: '北极圈极夜前的最后一次日落', isSelected: false },
  { text: '星河欲坠时', isSelected: false },
  { text: '北国风光', isSelected: false },
  { text: '花海 城堡 卡通', isSelected: false },
  { text: '猫咪 可爱', isSelected: false },
  { text: '有山有水有点田', isSelected: false },
  { text: '星空 高清', isSelected: false },
  { text: '重峦叠嶂 山水画', isSelected: false },
]);

const count = ref(0);
// 公开图片
function publicImage() {
  count.value++;

  if (count.value <= 1) {
    ElMessage({
      type: 'success',
      message: '公开成功，可在画作管理中查看',
    });
  } else {
    ElMessage({
      type: 'warning',
      message: '重复操作',
    });
  }
}
const posterDlg = ref(false);
const posterLink = ref('');
const posterInfo = ref('');
const userAvatar = ref('');
const inputDom = ref();
userAvatar.value = userInfoStore.avatar.replace(
  'https://obs-xihe-beijing4.obs.cn-north-4.myhuaweicloud.com/',
  '/obs-xihe-avatar/'
);
// 分享图片
function shareImage(url) {
  posterDlg.value = true;
  posterLink.value = url.replace(
    'https://big-model-deploy.obs.cn-central-221.ovaijisuan.com:443/',
    '/obs-big-model/'
  );
  posterInfo.value = inputText.value + '  ' + sortTag.value;
}
// 下载海报截图
function downloadPoster() {
  const poster = document.querySelector('#screenshot');

  html2canvas(poster, {
    useCORS: true,
  }).then((canvas) => {
    let url = canvas.toDataURL('image/png');

    let aLink = document.createElement('a');
    aLink.style.display = 'none';
    aLink.href = url;
    aLink.download = 'poster.png';
    aLink.click();
    aLink.remove();
  });
}
// 复制用户名
function copyText(textValue) {
  inputDom.value.value = textValue;
  inputDom.value.select();
  if (document.execCommand('Copy'))
    ElMessage({
      type: 'success',
      message: '复制成功',
      center: true,
    });
}

// 选择样例
function exampleSelectHandler(item) {
  exampleData.value.forEach((item) => {
    item.isSelected = false;
  });
  item.isSelected = true;
  inputText.value = item.text;
}
// 清除输入样例
function clearInputText() {
  inputText.value = '';

  exampleData.value.forEach((item) => {
    item.isSelected = false;
  });
}
function handleInput() {
  exampleData.value.forEach((item) => {
    if (item.text === inputText.value) {
      item.isSelected = true;
    } else {
      item.isSelected = false;
    }
  });
}
// 选择风格类别
function choseStyleSort(val) {
  styleIndex.value = val;
}
// 选择风格标签
function choseSortTag(val) {
  val.isSelected = !val.isSelected;

  // if (val.tag === sortTag.value) {
  //   val.isSelected = !val.isSelected;
  //   if (val.isSelected) {
  //     sortTag.value = val.tag;
  //   } else {
  //     sortTag.value = '';
  //   }
  // } else {
  //   styleData.value.forEach((item) => {
  //     item.options.forEach((tag) => {
  //       tag.isSelected = false;
  //     });
  //   });

  //   val.isSelected = !val.isSelected;
  //   sortTag.value = val.tag;
  // }
}
// 随机风格
function getRandomStyle(index) {
  if (index === 4) {
    const i = Math.floor(Math.random() * randomList.value.length);
    styleData.value[index].options = [randomList.value[i]];
  } else {
    return;
  }
}
// 重新输入描述
function reenterDesc() {
  showInferDlg.value = false;
  isError.value = false;
  initData();
}
// 初始化推理数据
function initData() {
  inputText.value = '';
  sortTag.value = '';

  styleBackground.value = [];

  styleData.value.forEach((item) => {
    item.options.forEach((tag) => {
      tag.isSelected = false;
    });
  });

  exampleData.value.forEach((item) => {
    item.isSelected = false;
  });
}
// wk推理
async function handleInfer() {
  if (!isLogined.value) {
    goAuthorize();
  } else {
    if (inputText.value) {
      showInferDlg.value = true;

      let count = 0;
      styleData.value.forEach((item) => {
        item.options.forEach((style) => {
          if (style.isSelected) {
            count++;
            if (count <= 1) {
              sortTag.value = style.tag;
            } else {
              sortTag.value = sortTag.value + ' ' + style.tag;
            }
          }
        });
      });

      try {
        const res = await wuKongInfer({
          desc: inputText.value,
          style: sortTag.value,
        });

        isInferred.value = true;

        styleBackground.value = res.data.data.pictures;
      } catch (err) {
        // setTimeout(() => {
        //   showInferDlg.value = false;
        // }, 1500);
        isError.value = true;
        // initData();
      }
    } else if (!inputText.value) {
      ElMessage({
        type: 'warning',
        message: '请输入样例描述',
      });
    }
  }
}
const inferList = ref([
  { isCollected: false, id: '' },
  { isCollected: false, id: '' },
  { isCollected: false, id: '' },
  { isCollected: false, id: '' },
]);
// 收藏
function handleCollecte(key, index) {
  addLikePicture({ obspath: key }).then((res) => {
    if (res.data.data) {
      inferList.value[index].isCollected = true;
      inferList.value[index].id = res.data.data.id;
      ElMessage({
        type: 'success',
        message: '收藏成功，可在画作管理中查看',
      });
    }
  });
}
// 取消收藏
function handleCancelCollecte(index) {
  cancelLikePicture(inferList.value[index].id).then((res) => {
    if (res.status === 204) {
      inferList.value[index].isCollected = false;
      inferList.value[index].id = '';
      ElMessage({
        type: 'success',
        message: '取消收藏成功',
      });
    }
  });
}
// 下载图片
function requestImg(item) {
  let x = new XMLHttpRequest();
  x.open('GET', item, true);
  x.responseType = 'blob';
  x.onload = function () {
    const blobs = new Blob([x.response], { type: 'image/png' });
    let url = window.URL.createObjectURL(blobs);
    let a = document.createElement('a');
    a.href = url;
    a.download = 'infer.png';
    a.click();
  };
  x.send();
}
// 临时url小于1min重新获取下载
function downloadImage(item) {
  const index1 = item.indexOf('=');
  const index2 = item.indexOf('=', index1 + 1);

  const i1 = item.indexOf('&');
  const i2 = item.indexOf('&', i1 + 1);

  const deadTime = item.substring(index2 + 1, i2);
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
// 推理dlg关闭-触发
function handleDlgClose() {
  showInferDlg.value = false;

  isInferred.value = false;
  isError.value = false;
  posterLink.value = '';

  inferList.value.forEach((item) => {
    item.isCollected = false;
    item.id = '';
  });

  initData();
}
// 随机选取五个样例
function getDescExamples(arr, count) {
  let shuffled = arr.slice(0),
    i = arr.length,
    min = i - count,
    temp,
    index;
  while (i-- > min) {
    index = Math.floor((i + 1) * Math.random());
    temp = shuffled[index];
    shuffled[index] = shuffled[i];
    shuffled[i] = temp;
  }
  return shuffled.slice(min);
}
// 换一批
function refreshTags() {
  exampleData.value = getDescExamples(lists.value, 5);
}
</script>
<template>
  <div class="wk-experience">
    <el-input
      v-model="inputText"
      maxlength="75"
      placeholder="请输入简体中文或选择下方样例"
      show-word-limit
      type="text"
      @input="handleInput"
    >
      <template #suffix
        ><o-icon v-if="inputText" class="clear-input" @click="clearInputText"
          ><icon-x></icon-x></o-icon
      ></template>
    </el-input>
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

          <div class="triangle" :class="`triangle${styleIndex}`"></div>
        </div>
      </div>
    </div>
    <div class="wk-experience-btn" @click="handleInfer">立即生成</div>
    <!-- 推理dialog -->
    <el-dialog
      v-model="showInferDlg"
      class="infer-dlg"
      :fullscreen="true"
      :append-to-body="true"
      @close="handleDlgClose"
    >
      <template #header="{ titleClass }">
        <div class="infer-dlg-head">
          <span class="title" :class="titleClass"
            >{{ inputText }}&nbsp;&nbsp;{{ sortTag }}</span
          >
        </div>
      </template>
      <!-- 推理中 -->
      <div v-if="!isInferred" class="infer-dlg-loading">
        <img :src="loading" alt="" />
        <p>正在创作中，请耐心等待</p>
      </div>
      <!-- 推理完成 -->
      <div v-if="isInferred && !isError" class="infer-dlg-result">
        <div
          v-for="(value, key, index) in styleBackground"
          :key="key"
          class="result-item"
        >
          <img :src="value" alt="" />
          <div class="handles">
            <!-- 公开 -->
            <div class="public">
              <p @click="publicImage">
                <o-icon><icon-arrow></icon-arrow></o-icon>
              </p>
              <!-- <p v-else class="cancel-public" @click="publicImage">
                <o-icon><icon-cancel></icon-cancel></o-icon>
              </p> -->
            </div>
            <!-- 下载收藏 -->
            <div class="handles-contain">
              <p @click="downloadImage(value)">
                <o-icon><icon-download></icon-download></o-icon>
              </p>
              <p @click="shareImage(value)">
                <o-icon><icon-share></icon-share></o-icon>
              </p>
              <p
                v-if="!inferList[index].isCollected"
                @click="handleCollecte(key, index)"
              >
                <o-icon><icon-like></icon-like></o-icon>
              </p>

              <p
                v-if="inferList[index].isCollected"
                class="liked"
                @click="handleCancelCollecte(index)"
              >
                <o-icon><icon-heart></icon-heart></o-icon>
              </p>
            </div>
          </div>

          <div class="mask"></div>
        </div>
      </div>
      <!-- 内容不合规 -->
      <div v-if="isError" class="infer-dlg-error">
        <p>
          <o-icon><icon-warning></icon-warning></o-icon>
        </p>

        <p>内容不合规，请重新输入描述词</p>

        <p @click="reenterDesc">
          <span>重新输入</span>
          <o-icon><icon-right></icon-right></o-icon>
        </p>
      </div>
    </el-dialog>
    <!-- 海报弹窗 -->
    <el-dialog
      v-model="posterDlg"
      :fullscreen="true"
      :append-to-body="true"
      center
      class="poster-dlg-wk"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="poster">
        <div id="screenshot" class="poster-image">
          <img draggable="false" :src="posterLink" alt="" />

          <img
            class="qr-code"
            draggable="false"
            src="@/assets/imgs/wukong/qr-code.png"
            alt=""
          />
          <img
            class="logo"
            draggable="false"
            src="@/assets/imgs/logo.png"
            alt=""
          />

          <div class="info">
            <p class="desc">{{ posterInfo }}</p>
            <div class="user-info">
              <img :src="userAvatar" alt="" />
              <p>{{ userInfoStore.userName }}</p>
            </div>
          </div>
        </div>
        <div class="poster-download">
          <div class="link">
            <p>https://xihe.mindspore.cn/modelzoo/wukong</p>
            <o-icon @click="copyText(`https://xihe.mindspore.cn/modelzoo/wukong`)"
              ><icon-copy></icon-copy
            ></o-icon>
          </div>
          <div class="button" @click="downloadPoster">下载海报</div>
        </div>
      </div>
    </el-dialog>
    <textarea ref="inputDom" class="input-dom"></textarea>
  </div>
</template>
<style lang="scss">
.infer-dlg,
.poster-dlg-wk {
  background: none;
  .poster {
    width: 434px;
    height: 566px;
    background: #ffffff;
    padding: 16px;
    margin: 0 auto;
    margin-top: calc(50vh - 630px);
    &-image {
      width: 402px;
      height: 457px;
      position: relative;
      .qr-code {
        width: 78px;
        height: 78px;
        position: absolute;
        right: 16px;
        bottom: 72px;
      }
      .logo {
        position: absolute;
        left: 16px;
        bottom: 78px;
        width: 64px;
        height: 21px;
      }
      img {
        width: 100%;
      }
      .info {
        width: 100%;
        height: 56px;
        background: #f5f6f8;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 16px;
        .desc {
          font-size: 14px;
          font-weight: 400;
          color: #000000;
          line-height: 24px;
        }
        .user-info {
          display: flex;
          align-items: center;

          img {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            margin-right: 8px;
          }
          p {
            font-size: 14px;
            font-weight: 400;
            color: #555555;
            line-height: 24px;
          }
        }
      }
    }
    &-download {
      margin-top: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .link {
        flex: 1;
        height: 36px;
        line-height: 36px;
        background: #ffffff;
        border: 1px solid #999999;
        padding-left: 16px;
        padding-right: 10px;
        margin-right: 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        p {
          font-size: 12px;
        }
        .o-icon {
          cursor: pointer;
          &:hover {
            color: #40adff;
          }
        }
      }
      .button {
        width: 112px;
        height: 36px;
        border: 1px solid #40adff;
        color: #40adff;
        text-align: center;
        line-height: 36px;
        cursor: pointer;
      }
    }
  }
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
      &:hover {
        .handles,
        .mask {
          opacity: 1;
        }
      }
      &:last-child {
        margin-right: 0;
      }
      img {
        height: 100%;
        width: 100%;
      }
      .mask {
        position: absolute;
        bottom: 0;
        background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 100%);
        width: 100%;
        height: 16vh;
        opacity: 0;
      }
      .handles {
        width: 100%;
        position: absolute;
        bottom: 0;
        z-index: 20;
        opacity: 0;
        display: flex;
        justify-content: space-between;
        padding: 18px 24px;
        @media screen and (max-width: 1450px) {
          bottom: 10px;
        }
        &-contain,
        .public {
          display: flex;
          .cancel-public {
            .o-icon {
              font-size: 18px;
            }
          }
          .o-icon {
            color: #fff;
          }

          .liked {
            .o-icon {
              font-size: 20px;
            }
          }
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
            &:nth-child(2) {
              margin: 0 16px;
              @media screen and (max-width: 1450px) {
                margin: 0 8px;
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

  &-error {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    color: #fff;

    p {
      align-self: center;
      &:first-child {
        .o-icon {
          font-size: 48px;
        }
      }
      &:nth-child(2) {
        font-size: 18px;
        font-weight: 400;
        line-height: 25px;
        margin-top: 40px;
      }
      &:nth-child(3) {
        border: 1px solid #fff;
        padding: 12px 60px 12px 28px;
        font-size: 16px;
        line-height: 24px;
        margin-top: 48px;
        cursor: pointer;
        position: relative;
        &:hover {
          color: #0d8dff;
          border: 1px solid #0d8dff;
          .o-icon {
            right: 16px;
          }
        }
        .o-icon {
          margin-left: 16px;
          font-size: 24px;
          position: absolute;
          right: 20px;
          transition: all 0.2s linear;
        }
      }
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
</style>
<style lang="scss" scoped>
.input-dom {
  position: fixed;
  top: -700px;
}
.wk-experience {
  .clear-input {
    cursor: pointer;
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
        .triangle {
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-bottom: 10px solid rgba(85, 85, 85, 0.3);
          position: absolute;
          top: -10px;
        }
        .triangle0 {
          left: 62px;
        }
        .triangle1 {
          left: 202px;
        }
        .triangle2 {
          left: 358px;
        }
        .triangle3 {
          left: 498px;
        }
        .triangle4 {
          left: 638px;
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
