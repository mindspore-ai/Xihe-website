<script setup>
import { ref, computed, onUnmounted } from 'vue';

import { useLoginStore } from '@/stores';
import { goAuthorize } from '@/shared/login';

import OButton from '@/components/OButton.vue';

import IconDownload from '~icons/app/download';
import IconRefresh from '~icons/app/refresh-taichu';

import { getSinglePicture, getMultiplePicture } from '@/api/api-modelzoo';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const isLogined = computed(() => useLoginStore().isLogined);

const screenWidth = ref(
  window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth
);

const onResize = () => {
  screenWidth.value =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
};
window.addEventListener('resize', onResize);

const inferUrlList = ref([]);

const lists = [
  { name: t('taichu.IMG_GENERATE.LISTS[0]'), isSelected: false },
  { name: t('taichu.IMG_GENERATE.LISTS[1]'), isSelected: false },
  { name: t('taichu.IMG_GENERATE.LISTS[2]'), isSelected: false },
  { name: t('taichu.IMG_GENERATE.LISTS[3]'), isSelected: false },
  { name: t('taichu.IMG_GENERATE.LISTS[4]'), isSelected: false },
  { name: t('taichu.IMG_GENERATE.LISTS[5]'), isSelected: false },
  { name: t('taichu.IMG_GENERATE.LISTS[6]'), isSelected: false },
  { name: t('taichu.IMG_GENERATE.LISTS[7]'), isSelected: false },
  { name: t('taichu.IMG_GENERATE.LISTS[8]'), isSelected: false },
  { name: t('taichu.IMG_GENERATE.LISTS[9]'), isSelected: false },
  { name: t('taichu.IMG_GENERATE.LISTS[10]'), isSelected: false },
  { name: t('taichu.IMG_GENERATE.LISTS[11]'), isSelected: false },
  { name: t('taichu.IMG_GENERATE.LISTS[12]'), isSelected: false },
  { name: t('taichu.IMG_GENERATE.LISTS[13]'), isSelected: false },
  { name: t('taichu.IMG_GENERATE.LISTS[14]'), isSelected: false },
];

// 随机选取五个样例
function getRandom(arr, count) {
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
// 给生成图片加文字水印
function addWatermark(imgUrl, index, font, arr) {
  const img = new Image();
  img.crossOrigin = 'Anonymous';
  img.src = imgUrl;

  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, img.width, img.height);

    ctx.font = font + 'px 微软雅黑';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(t('wukong.BY_AI'), img.width - arr[0], img.height - arr[1]);

    inferUrlList.value[index] = canvas.toDataURL('image/png');

    return inferUrlList.value[index];
  };
}
const exampleList = ref([
  { name: t('taichu.IMG_GENERATE.LISTS[8]'), isSelected: false },
  { name: t('taichu.IMG_GENERATE.LISTS[0]'), isSelected: false },
  { name: t('taichu.IMG_GENERATE.LISTS[4]'), isSelected: false },
  { name: t('taichu.IMG_GENERATE.LISTS[12]'), isSelected: false },
  { name: t('taichu.IMG_GENERATE.LISTS[9]'), isSelected: false },
]);
const loading1 = ref(false);
const inferenceText = ref('');
const inputValue = ref(null);

// 生成一张图片
function startRatiocnate() {
  if (
    /^[\u4e00-\u9fa5\s\·\~\！\@\#\￥\%\……\&\*\（\）\——\-\+\=\【\】\{\}\、\|\；\‘\’\：\“\”\《\》\？\，\。\、]+$/.test(
      inferenceText.value
    )
  ) {
    loading1.value = true;
    getSinglePicture({
      desc: inferenceText.value,
    }).then((res) => {
      inferUrlList.value = [];
      if (res.data) {
        inferUrlList.value.push(res.data.picture);
        loading1.value = false;
      } else {
        loading1.value = false;
        ElMessage({
          type: 'error',
          message: res.msg,
        });
      }
    });
  } else {
    ElMessage({
      type: 'warning',
      message: t('taichu.INPUT_CHINESE'),
    });
  }
}

function startRatiocnateMo() {
  if (
    /^[\u4e00-\u9fa5\s\·\~\！\@\#\￥\%\……\&\*\（\）\——\-\+\=\【\】\{\}\、\|\；\‘\’\：\“\”\《\》\？\，\。\、]+$/.test(
      inferenceText.value
    )
  ) {
    getMultiplePicture({
      desc: inferenceText.value,
    }).then((res) => {
      if (res.data) {
        inferUrlList.value = res.data.pictures;
      } else {
        ElMessage({
          type: 'error',
          message: res.msg,
        });
      }
    });
  } else {
    ElMessage({
      type: 'warning',
      message: t('taichu.INPUT_CHINESE'),
    });
  }
}

function startRatiocnate1(num) {
  if (!isLogined.value) {
    goAuthorize();
  } else {
    if (
      /^[\u4e00-\u9fa5\s\·\~\！\@\#\￥\%\……\&\*\（\）\——\-\+\=\【\】\{\}\、\|\；\‘\’\：\“\”\《\》\？\，\。\、]+$/.test(
        inferenceText.value
      )
    ) {
      if (num === 'three') {
        getMultiplePicture({
          desc: inferenceText.value,
        }).then((res) => {
          if (res.data) {
            res.data.pictures.forEach((item, index) => {
              addWatermark(item, index, 14, [100, 16]);
            });
          } else {
            if (res.code === 'bigmodel_sensitive_info') {
              ElMessage({
                type: 'error',
                message: t('taichu.INVALID_TEXT'),
              });
            }
          }
          inferenceText.value = '';
        });
      } else {
        getSinglePicture({
          desc: inferenceText.value,
        })
          .then((res) => {
            inferUrlList.value = [];
            if (res.data) {
              addWatermark(res.data.picture, 0, 48, [324, 48]);
            } else {
              if (res.code === 'bigmodel_sensitive_info') {
                ElMessage({
                  type: 'error',
                  message: t('taichu.INVALID_TEXT'),
                });
              }
            }
          })
          .catch((err) => {
            console.error('err: ', err);
          });
      }
    } else {
      ElMessage({
        type: 'warning',
        message: t('taichu.INPUT_CHINESE'),
      });
    }
  }
}

function downLoadPictures(index) {
  let x = new XMLHttpRequest();
  x.open('GET', inferUrlList.value[index], true);
  x.responseType = 'blob';
  x.onload = function () {
    const blobs = new Blob([x.response], { type: 'image/jpg' });
    let url = window.URL.createObjectURL(blobs);
    let a = document.createElement('a');
    a.href = url;
    a.download = 'infer.jpg';
    a.click();
  };
  x.send();
}

function selectTag(val) {
  val.isSelected = !val.isSelected;
  exampleList.value.forEach((item) => {
    item.isSelected = false;
    val.isSelected = true;
    inferenceText.value = val.name;
  });
}

function handleTextChange() {
  exampleList.value.forEach((item) => {
    if (item.name === inferenceText.value) {
      item.isSelected = true;
    } else {
      item.isSelected = false;
    }
  });
}

function refreshTags() {
  exampleList.value = getRandom(lists, 5);
}

onUnmounted(() => {
  window.removeEventListener('resize', onResize);
});
</script>
<template>
  <div class="model-page">
    <div class="model-wrap">
      <!-- 以文生图 -->
      <div class="text-to-img">
        <p class="text-title">{{ t('taichu.IMG_GENERATE.TITLE') }}</p>
        <p class="experience-text">
          {{ t('taichu.IMG_GENERATE.MODEL_DESC') }}
        </p>
        <span>由AI模型生成</span>
        <div class="content">
          <div class="content-top">
            <el-input
              ref="inputValue"
              v-model="inferenceText"
              maxlength="30"
              :show-word-limit="true"
              :placeholder="t('taichu.IMG_GENERATE.PLACEHOLDER')"
              class="text-input"
              @input="handleTextChange"
            >
            </el-input>

            <div class="example">
              <div class="title">{{ t('taichu.IMG_GENERATE.SAMPLES') }}</div>
              <div class="tags-box">
                <p
                  v-for="item in exampleList"
                  :key="item.name"
                  :class="item.isSelected ? 'active' : ''"
                  @click="selectTag(item)"
                >
                  {{ item.name }}
                </p>
                <div class="refresh-btn" @click="refreshTags">
                  <o-icon><icon-refresh></icon-refresh></o-icon>
                  <span>{{ t('taichu.IMG_GENERATE.CHANGE') }}</span>
                </div>
              </div>
              <div class="btn-box">
                <o-button size="small" @click="startRatiocnate1">{{
                  t('taichu.IMG_GENERATE.GENERATE_ONE')
                }}</o-button>
                <o-button
                  size="small"
                  type="primary"
                  class="infer-button"
                  :disabled="loading1"
                  @click="startRatiocnate1('three')"
                  >{{ t('taichu.IMG_GENERATE.GENERATE_THREE1') }}</o-button
                >
              </div>
            </div>
          </div>
          <div class="content-bottom">
            <p class="content-bottom-title">
              {{ t('taichu.IMG_GENERATE.IMG_RESULT') }}
            </p>
            <div class="result">
              <div
                v-for="(item, index) in inferUrlList"
                :key="item"
                class="img-item"
              >
                <img :src="item" class="result-img" :draggable="false" />
                <div class="download" @click="downLoadPictures(index)">
                  <div class="icon-item">
                    <o-icon><icon-download></icon-download> </o-icon>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mobile">
        <p class="model-name">{{ t('taichu.IMG_GENERATE.TITLE') }}</p>
        <div class="model-desc">
          {{ t('taichu.IMG_GENERATE.MODEL_DESC') }}
        </div>
        <p class="input-desc">{{ t('taichu.IMG_GENERATE.INPUT_1') }}</p>
        <el-input
          ref="inputValue"
          v-model="inferenceText"
          class="mobile-input"
          type="textarea"
          maxlength="30"
          :show-word-limit="true"
          :placeholder="t('taichu.IMG_GENERATE.PLACEHOLDER')"
          @input="handleTextChange"
        >
        </el-input>
        <div class="example">
          <div class="example-top">
            <p class="title">{{ t('taichu.IMG_GENERATE.SAMPLES') }}</p>
            <div class="refresh-btn" @click="refreshTags">
              <OIcon><icon-refresh></icon-refresh></OIcon>
              <p>{{ t('taichu.IMG_GENERATE.CHANGE') }}</p>
            </div>
          </div>
          <div class="tags-box">
            <p
              v-for="item in exampleList"
              :key="item.name"
              :class="item.isSelected ? 'active' : ''"
              @click="selectTag(item)"
            >
              {{ item.name }}
            </p>
          </div>
        </div>
        <p class="result">{{ t('taichu.IMG_GENERATE.IMG_RESULT') }}</p>
        <div v-if="inferUrlList.length > 1" class="result-image">
          <el-image
            class="image-modal"
            :src="inferUrlList[0]"
            :preview-src-list="inferUrlList"
            :initial-index="0"
            fit="cover"
            :hide-on-click-modal="true"
          />
          <el-image
            class="image-modal"
            :src="inferUrlList[1]"
            :preview-src-list="inferUrlList"
            :initial-index="1"
            fit="cover"
            :hide-on-click-modal="true"
          />
          <el-image
            class="image-modal"
            :src="inferUrlList[2]"
            :preview-src-list="inferUrlList"
            :initial-index="2"
            fit="cover"
            :hide-on-click-modal="true"
          />
        </div>
        <div
          v-if="inferUrlList.length === 1 || inferUrlList.length === 0"
          class="result-image"
        >
          <img
            v-for="item in inferUrlList"
            :key="item"
            class="result-img-single"
            :src="item"
          />
        </div>

        <div class="mobile-button">
          <o-button size="mini" :disabled="loading1" @click="startRatiocnate">{{
            t('taichu.IMG_GENERATE.GENERATE_ONE')
          }}</o-button>
          <o-button type="primary" size="mini" @click="startRatiocnateMo">{{
            t('taichu.IMG_GENERATE.GENERATE_THREE1')
          }}</o-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.mobile {
  background-color: #fff;
  padding: 16px 16px 24px;
  display: none;
  border-radius: 16px;
  @media screen and (max-width: 821px) {
    display: block;
  }
  .model-name {
    font-size: 14px;
    line-height: 28px;
    color: #000000;
  }
  .model-desc {
    font-size: 12px;
    line-height: 18px;
    font-weight: 400;
    color: #555555;
    padding: 16px 0;
    @media screen and (max-width: 820px) {
      border-bottom: 1px solid #dbdbdb;
      padding: 8px 0 16px;
    }
  }
  .input-desc {
    font-size: 14px;
    line-height: 20px;
    font-weight: 400;
    color: #000000;
    margin-top: 16px;
  }
  .mobile-input {
    margin-top: 8px;
    width: calc(100vw - 64px) !important;
    :deep(.el-textarea__inner) {
      height: 96px;
      font-size: 12px;
      line-height: 22px;
      color: #999999;
      border-radius: 8px;
    }
  }
  .example {
    margin-top: 12px;
    .example-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      line-height: 18px;
      font-weight: 400;
      color: #555555;
      .refresh-btn {
        display: flex;
        align-items: center;
        cursor: pointer;
        font-size: 10px;
        font-weight: 400;
        color: #0d8dff;
        line-height: 14px;
        .o-icon {
          font-size: 10px;
          margin-right: 2px;
          margin-top: 2px;
        }
      }
    }
    .tags-box {
      display: flex;
      flex-wrap: wrap;
      p {
        padding: 0px 7px;
        border-radius: 6px;
        border: 1px solid #dbedff;
        box-sizing: border-box;
        background-color: #f3f9ff;
        margin-top: 8px;
        margin-right: 8px;
        color: #555;
        cursor: pointer;
        font-size: 12px;
        line-height: 8px;
        height: 26px;
        line-height: 26px;
        &:hover {
          color: #0d8dff;
        }
      }
      .active {
        color: #0d8dff;
      }
    }
  }
  .result {
    font-size: 14px;
    line-height: 20px;
    font-weight: 400;
    color: #000000;
    margin-top: 24px;
  }
  .result-image {
    margin-top: 10px;
    padding: 16px;
    border: 1px solid #a0d2ff;
    height: 254px;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 16px;
    .image-modal {
      width: 83px;
      height: 83px;
      &:nth-child(2) {
        margin: 0 8px;
      }
    }
    :deep(.el-image) {
      .el-image-viewer__prev {
        left: 6px;
        background-color: transparent;
      }
      .el-image-viewer__next {
        right: 6px;
        background-color: transparent;
      }
      .el-image-viewer__wrapper {
        z-index: 9999 !important;
      }
      .el-image-viewer__close {
        display: none;
      }
      .el-image-viewer__actions {
        display: none;
      }
    }
    .result-img-single {
      height: 100%;
    }
  }
  .mobile-button {
    display: flex;
    justify-content: center;
    margin-top: 16px;
    .o-button:first-child {
      margin-right: 8px;
    }
  }
}

.model-page {
  width: 100%;
  padding-bottom: 64px;
  @media screen and (max-width: 820px) {
    padding-bottom: 0px;
  }
  .model-wrap {
    margin: 0 auto;
    max-width: 1416px;
    .text-to-img {
      padding-top: 40px;
      @media screen and (max-width: 1080px) {
        display: none;
      }
      .text-title {
        font-weight: 300;
        color: #000000;
        font-size: 36px;
        line-height: 48px;
        text-align: center;
      }
      .experience-text {
        margin-bottom: 20px;
        margin-top: 10px;
        margin: 16px 0 46px;
        font-size: 18px;
        line-height: 24px;
        color: #555555;
        text-align: center;
      }
      .content {
        margin-top: 16px;
        .content-top {
          background: #ffffff;
          padding: 32px 40px 40px;
          border-radius: 16px;

          &-title {
            font-size: 18px;
            font-weight: 400;
            color: #000000;
            line-height: 25px;
          }
          :deep(.el-input) {
            width: 100%;
            .el-input__wrapper {
              box-shadow: none;
              border-bottom: 1px solid #cdebff;
              padding: 8px 0;
              .el-input__inner {
                font-size: 20px;
                height: 33px;
                line-height: 33px;
              }
              &:hover {
                box-shadow: none;
              }
            }
            .el-input__wrapper.is-focus {
              box-shadow: none;
            }
          }
          .example {
            margin-top: 32px;
            display: flex;
            align-items: center;
            .title {
              min-width: 72px;
              font-size: 18px;
              color: #000;
              line-height: 25px;
              margin-right: 40px;
            }
            .tags-box {
              flex-grow: 1;
              display: flex;
              p {
                padding: 7px 12px;
                border-radius: 8px;
                border: 1px solid #dbedff;
                box-sizing: border-box;
                background-color: #f3f9ff;
                font-size: 14px;
                color: #555;
                margin-right: 16px;
                cursor: pointer;
                white-space: nowrap;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                &:hover {
                  color: #0d8dff;
                }
              }
              .active {
                color: #0d8dff;
              }
              .refresh-btn {
                font-size: 12px;
                color: #0d8dff;
                min-width: 52px;
                display: flex;
                align-items: center;
                cursor: pointer;
                .o-icon {
                  font-size: 12px;
                  margin-right: 4px;
                }
              }
            }
            .btn-box {
              display: flex;
              justify-content: flex-end;
              margin-left: 20px;
              .o-button {
                font-size: 14px;
              }
              .infer-button {
                margin-left: 16px;
              }
            }
          }
          .more-pictures {
            height: 22px;
            display: flex;
            justify-content: end;
            margin-top: 8px;
          }
        }
        .content-bottom {
          background: #ffffff;
          padding: 40px 40px 106px;
          margin-top: 24px;
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          &-title {
            font-size: 18px;
            color: #000000;
            line-height: 25px;
            margin-bottom: 40px;
          }
          .result {
            border: 2px solid #a0d2ff;
            padding: 16px;
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 429px;
            .img-item {
              height: 100%;
              cursor: pointer;
              border-radius: 16px;
              overflow: hidden;
              img {
                height: 100%;
                border-radius: 16px;
              }
              .download {
                opacity: 0;
                width: 100%;
                height: 112px;
                background: linear-gradient(
                  180deg,
                  rgba(0, 0, 0, 0) 0%,
                  #000000 100%
                );
                position: relative;
                bottom: 112px;
                color: #ccc;
                display: flex;
                cursor: pointer;
                .icon-item {
                  width: 40px;
                  height: 40px;
                  background: rgba(255, 255, 255, 0.1);
                  border-radius: 50%;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  position: absolute;
                  right: 24px;
                  bottom: 24px;
                  &:hover {
                    background: rgba(255, 255, 255, 0.3);
                  }
                }
                .o-icon {
                  font-size: 24px;
                }
              }
              &:nth-child(2) {
                margin: 0 24px;
              }
              &:hover {
                .download {
                  opacity: 1;
                  transform: translate(0px);
                  transition: all 0.2s linear;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
