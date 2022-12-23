<script setup>
import { ref, computed } from 'vue';

import comic from '@/assets/imgs/wukong/style-bg-1.png';
import classic from '@/assets/imgs/wukong/style-bg-2.png';
import fantasy from '@/assets/imgs/wukong/style-bg-3.png';
import more from '@/assets/imgs/wukong/style-bg-4.png';
import random from '@/assets/imgs/wukong/style-bg-5.png';

import IconRefresh from '~icons/app/refresh-taichu';
import IconDownload from '~icons/app/wukong-download';
import IconLike from '~icons/app/wukong-like';
import IconX from '~icons/app/x';
import IconHeart from '~icons/app/collected';

import { goAuthorize } from '@/shared/login';
import { useLoginStore } from '@/stores';

import {
  wuKongInfer,
  addLikePicture,
  cancelLikePicture,
} from '@/api/api-modelzoo.js';

const isLogined = computed(() => useLoginStore().isLogined);

const inputText = ref('');
const sortTag = ref('');
const styleIndex = ref(0);

const showInferDlg = ref(false);
const isInferred = ref(false);

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
// 初始化推理数据
function initData() {
  inputText.value = '';
  sortTag.value = '';

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
        setTimeout(() => {
          showInferDlg.value = false;
        }, 1500);

        initData();
      }
    } else if (!inputText.value) {
      ElMessage({
        type: 'warning',
        message: '请输入样例描述',
      });
    }
  }
}

const isCollected = ref(false);
// 收藏
async function handleCollecte(key) {
  try {
    const res = await addLikePicture({ obspath: key });
    if (res.data.data === 'success') {
      ElMessage({
        type: 'success',
        message: '收藏成功，可在我的收藏中查看',
      });
      isCollected.value = true;
    }
  } catch (e) {
    ElMessage({
      type: 'success',
      message: e.msg,
    });
  }

  // addLikePicture({ obspath: key }).then((res) => {
  //   if (res.data.data === 'success') {
  //     ElMessage({
  //       type: 'success',
  //       message: '收藏成功，可在我的收藏中查看',
  //     });
  //   }
  // });
}

// 取消收藏
function handleCancelCollecte(key) {
  cancelLikePicture(key).then((res) => {
    if (res.status === 204) {
      isCollected.value = false;
      ElMessage({
        type: 'success',
        message: '取消收藏成功',
      });
    }
  });
}

// 下载图片
function downloadImage(item) {
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
// 推理dlg关闭-触发
function handleDlgClose() {
  showInferDlg.value = false;

  isInferred.value = false;

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
      :fullscreen="true"
      :append-to-body="true"
      class="infer-dlg"
      @close="handleDlgClose"
    >
      <template #header="{ titleClass }">
        <div class="infer-dlg-head">
          <span class="title" :class="titleClass"
            >{{ inputText }}&nbsp;&nbsp;{{ sortTag }}</span
          >
        </div>
      </template>

      <div v-if="!isInferred" class="infer-dlg-loading">
        <img src="@/assets/gifs/loading.gif" alt="" />
        <p>正在创作中，请耐心等待</p>
      </div>

      <div v-else class="infer-dlg-result">
        <div
          v-for="(value, key) in styleBackground"
          :key="key"
          class="result-item"
        >
          <img :src="value" alt="" />
          <div class="handles">
            <div class="handles-contain">
              <p @click="downloadImage(value)">
                <o-icon><icon-download></icon-download></o-icon>
              </p>
              <p v-if="!isCollected" @click="handleCollecte(key)">
                <o-icon><icon-like></icon-like></o-icon>
              </p>
              <p v-if="isCollected" class="liked">
                <o-icon><icon-heart></icon-heart></o-icon>
              </p>
              <!-- <p v-if="isCollected" class="liked" @click="handleCancelCollecte(key)">
                <o-icon><icon-heart></icon-heart></o-icon>
              </p> -->
            </div>
          </div>
          <div class="mask"></div>
        </div>
      </div>
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
      &:hover {
        .handles,
        .mask {
          display: block;
        }
      }

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

      .mask {
        position: absolute;
        bottom: 0;
        background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 100%);
        width: 100%;
        height: 16vh;
        display: none;
      }

      .handles {
        position: absolute;
        bottom: 24px;
        right: 24px;
        z-index: 20;
        display: none;
        @media screen and (max-width: 1450px) {
          bottom: 10px;
          right: 10px;
        }
        &-contain {
          display: flex;
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
</style>
<style lang="scss" scoped>
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
