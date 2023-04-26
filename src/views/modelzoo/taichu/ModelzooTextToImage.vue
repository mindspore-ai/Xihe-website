<script setup>
import { ref, reactive, computed, onUnmounted } from 'vue';

import { useLoginStore } from '@/stores';
import { goAuthorize } from '@/shared/login';

import OButton from '@/components/OButton.vue';

import IconDownload from '~icons/app/download';
import IconRefresh from '~icons/app/refresh-taichu';

import { getSinglePicture, getMultiplePicture } from '@/api/api-modelzoo';

const form = reactive({
  type: [],
});

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
  { name: '一只狗在骑摩托车', isSelected: false },
  { name: '宇宙中扭曲的空间与黑洞', isSelected: false },
  { name: '赛博朋克的汽车在飞', isSelected: false },
  { name: '清晨的湖面倒映着天空', isSelected: false },
  { name: '两个女生在沙滩上', isSelected: false },
  { name: '小孩踢足球', isSelected: false },
  { name: '夜晚的星空', isSelected: false },
  { name: '梵高的星空', isSelected: false },
  { name: '蓝天白云', isSelected: false },
  { name: '一只可爱的猫坐在草坪上', isSelected: false },
  { name: '摩天大楼', isSelected: false },
  { name: '一架飞机', isSelected: false },
  { name: '日落湖边', isSelected: false },
  { name: '汉堡和薯条', isSelected: false },
  { name: '一只橘猫在阳台跳舞', isSelected: false },
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

const exampleList = ref([
  { name: '蓝天白云', isSelected: false },
  { name: '一只狗在骑摩托车', isSelected: false },
  { name: '两个女生在沙滩上', isSelected: false },
  { name: '日落湖边', isSelected: false },
  { name: '一辆火车行驶在铁路上日落湖边', isSelected: false },
  { name: '小孩踢足球', isSelected: false },
]);
const loading1 = ref(false);
const inferenceText = ref('');
const inputValue = ref(null);

function resetInferText() {
  inferenceText.value = '';
  exampleList.value.forEach((item) => {
    item.isSelected = false;
  });
  inputValue.value.focus();
}

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
        inferUrlList.value.push(res.data.picture + '?' + new Date());
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
      message: '请输入中文描述',
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
      message: '请输入中文描述',
    });
  }
}

function startRatiocnate1() {
  if (!isLogined.value) {
    goAuthorize();
  } else {
    if (
      /^[\u4e00-\u9fa5\s\·\~\！\@\#\￥\%\……\&\*\（\）\——\-\+\=\【\】\{\}\、\|\；\‘\’\：\“\”\《\》\？\，\。\、]+$/.test(
        inferenceText.value
      )
    ) {
      if (form.type.length) {
        getMultiplePicture({
          desc: inferenceText.value,
        }).then((res) => {
          if (res.data) {
            inferUrlList.value = res.data.pictures;
          } else {
            if (res.code === 'bigmodel_sensitive_info') {
              ElMessage({
                type: 'error',
                message: '内容审核不通过，请重新输入',
              });
            }
          }
        });
      } else {
        getSinglePicture({
          desc: inferenceText.value,
        }).then((res) => {
          inferUrlList.value = [];
          if (res.data) {
            inferUrlList.value.push(res.data.picture + '?' + new Date());
          } else {
            if (res.code === 'bigmodel_sensitive_info') {
              ElMessage({
                type: 'error',
                message: '内容审核不通过，请重新输入',
              });
            }
          }
        });
      }
    } else {
      ElMessage({
        type: 'warning',
        message: '请输入中文描述',
      });
    }
  }
}

function downLoadPictures() {
  inferUrlList.value.forEach((item) => {
    let x = new XMLHttpRequest();
    x.open('GET', item, true);
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
  });
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
  exampleList.value = getRandom(lists, 6);
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
        <p class="text-title">以文生图（Text-To-Image）</p>
        <p class="experience-text">
          以文生图任务是条件图像生成任务中重要的任务之一，要求模型理解输入文本的语义信息并生成与输入文本描述内容一致的逼真图像。
        </p>
        <div class="content">
          <div class="content-left">
            <p class="content-left-title">输入描述</p>

            <el-input
              ref="inputValue"
              v-model="inferenceText"
              type="textarea"
              maxlength="30"
              :show-word-limit="true"
              placeholder="请输入简体中文或选择下方样例"
              class="text-area"
              @input="handleTextChange"
            >
            </el-input>

            <div class="example">
              <div class="example-top">
                <p class="title">选择样例</p>
                <div class="refresh-btn" @click="refreshTags">
                  <o-icon><icon-refresh></icon-refresh></o-icon>
                  <p>换一批</p>
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

            <div class="btn-box">
              <o-button size="small" @click="resetInferText">重新输入</o-button>
              <o-button
                size="small"
                type="primary"
                class="infer-button"
                :disabled="loading1"
                @click="startRatiocnate1"
                >开始推理</o-button
              >
            </div>

            <div class="more-pictures">
              <el-form>
                <el-form-item v-model="form">
                  <el-checkbox-group v-model="form.type">
                    <el-checkbox label="生成3张" name="type" />
                  </el-checkbox-group>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <div class="content-right">
            <p class="content-right-title">图片结果</p>
            <div class="result">
              <img
                v-for="item in inferUrlList"
                :key="item"
                :src="item + '?' + new Date()"
                class="result-img"
                :draggable="false"
              />

              <div class="download" @click="downLoadPictures">
                <o-icon><icon-download></icon-download> </o-icon>
                <span class="download-text">下载</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mobile">
        <p class="model-name">以文生图（Text-To-Image）</p>
        <div class="model-desc">
          以文生图任务是条件图像生成任务中重要的任务之一，要求模型理解输入文本的语义信息并生成与输入文本描述内容一致的逼真图像。
        </div>
        <p class="input-desc">描述</p>
        <el-input
          ref="inputValue"
          v-model="inferenceText"
          class="mobile-input"
          type="textarea"
          maxlength="30"
          :show-word-limit="true"
          placeholder="请输入简体中文或选择下方样例"
          @input="handleTextChange"
        >
        </el-input>
        <div class="example">
          <div class="example-top">
            <p class="title">选择样例</p>
            <div class="refresh-btn" @click="refreshTags">
              <OIcon><icon-refresh></icon-refresh></OIcon>
              <p>换一批</p>
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
        <p class="result">图片结果</p>
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
          <o-button size="mini" @click="startRatiocnateMo">生成三张</o-button>
          <o-button
            size="mini"
            type="primary"
            :disabled="loading1"
            @click="startRatiocnate"
            >生成一张</o-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-textarea) {
  width: 100% !important;
}
.mobile {
  margin: 16px 16px 0px;
  background-color: #fff;
  padding: 16px 16px 24px;
  display: none;
  @media screen and (max-width: 820px) {
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
    :deep(.el-textarea__inner) {
      height: 96px !important;
      width: calc(100vw - 64px);
      font-size: 12px;
      line-height: 22px;
      color: #999999;
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

.analyse-result {
  width: 100%;
  height: 120px;
  border: 1px solid #a0d2ff;
  padding: 16px;
  margin-bottom: 16px;
}
.img-list {
  padding: 20px 40px;
  display: flex;
  background-color: #fff;
  justify-content: space-between;
  align-items: center;
  // @media screen and (max-width: 768px) {
  //   padding: 8px 0 24px;
  // }
  .active {
    border: 1px solid #a0d2ff;
    .modal {
      display: block;
    }
  }
  .custom {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #0d8dff;
    background-color: #e7f4ff;
    // @media screen and (max-width: 768px) {
    //   .o-icon {
    //     font-size: 24px;
    //   }
    // }
    p {
      font-size: 14px;
      font-weight: 400;
      line-height: 20px;
      margin-top: 8px;
      // @media screen and (max-width: 768px) {
      //   font-size: 9px;
      //   line-height: 13px;
      // }
    }
  }
  .img-list-item {
    width: 106px;
    height: 106px;
    position: relative;
    cursor: pointer;
    // @media screen and (max-width: 768px) {
    //   width: 54px;
    //   height: 54px;
    //   margin-right: 6px;
    // }
    img {
      width: 100%;
      height: 100%;
      // @media screen and (max-width: 768px) {
      //   width: 54px;
      //   height: 54px;
      // }
    }
    .modal {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      display: none;
      background: rgba(165, 213, 255, 0.5);
    }
    &:hover {
      border: 1px solid #a0d2ff;
      .modal {
        display: block;
      }
    }
  }
}
.empty-status {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .o-icon {
    color: #ccc;
    // @media screen and (max-width: 768px) {
    //   font-size: 32px;
    // }
  }
  .upload-tip {
    font-size: 14px;
    color: #ccc;
    line-height: 22px;
    margin-top: 8px;
    // @media screen and (max-width: 768px) {
    //   font-size: 12px;
    // }
    span {
      color: #0d8dff;
    }
  }
}
:deep(.el-upload) {
  width: 100%;
  .el-upload-dragger {
    width: 100%;
    height: 414px;
    border: none;
    border-radius: 0;
    padding: 24px 40px 24px 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    // @media screen and (max-width: 768px) {
    //   height: 196px;
    //   border: 1px solid #acacac;
    // }
    img {
      border: 1px solid #a0d2ff;
      max-height: 100%;
      max-width: 100%;
      object-fit: fill;
    }
  }
}
.text-to-img {
  padding-top: 40px;
  @media screen and (max-width: 820px) {
    display: none;
  }
  .text-title {
    color: #000000;
    display: flex;
    align-items: center;
    text-align: center;
    // background-color: red;
    margin-bottom: 10px;
    font-size: 20px;
    line-height: 28px;
  }
  .experience-text {
    margin-bottom: 20px;
    margin-top: 10px;
    font-size: 18px;
    font-weight: 300;
    font-size: 14px;
    font-weight: 400;
    color: #555555;
    line-height: 22px;
    text-align: center;
    background-color: red;
  }
  .content {
    margin-top: 16px;
    display: flex;
    &-left {
      width: 464px;
      background: #ffffff;
      margin-right: 25px;
      padding: 24px 24px 40px;
      display: flex;
      flex-direction: column;
      &-title {
        font-size: 18px;
        font-weight: 400;
        color: #000000;
        line-height: 25px;
      }
      .text-area {
        height: 150px;
        margin-top: 24px;
        :deep(.el-input__count) {
          right: -5px;
        }
        :deep(.el-textarea__inner) {
          height: 100%;
          width: 416px;
        }
      }
      .example {
        flex: 1;
        padding: 24px 0 40px 0;
        &-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .refresh-btn {
            display: flex;
            align-items: center;
            cursor: pointer;
            p {
              font-size: 12px;
              font-weight: 400;
              color: #0d8dff;
              line-height: 17px;
            }
            .o-icon {
              font-size: 12px;
              margin-right: 4px;
            }
          }
        }
        .title {
          font-size: 14px;
          font-weight: 400;
          color: #555555;
          line-height: 20px;
          margin-bottom: 0;
        }
        .tags-box {
          display: flex;
          flex-wrap: wrap;
          // min-height: 68px;
          p {
            padding: 7px 12px;
            border-radius: 8px;
            border: 1px solid #dbedff;
            box-sizing: border-box;
            background-color: #f3f9ff;
            margin-top: 16px;
            font-size: 14px;
            color: #555;
            margin-right: 16px;
            cursor: pointer;
            &:hover {
              color: #0d8dff;
            }
          }
          .active {
            color: #0d8dff;
          }
        }
      }
      .more-pictures {
        height: 22px;
        display: flex;
        justify-content: end;
        margin-top: 8px;
      }
      .btn-box {
        width: 100%;
        display: flex;
        justify-content: flex-end;
        .infer-button {
          margin-left: 16px;
        }
      }
    }
    &-right {
      flex: 1;
      background: #ffffff;
      padding: 24px;
      display: flex;
      flex-direction: column;
      &-title {
        font-size: 18px;
        font-weight: 400;
        color: #000000;
        line-height: 25px;
      }
      .result {
        flex: 1;
        margin-top: 16px;
        border: 2px solid #a0d2ff;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 16px;
        height: 370px;
        &-img {
          height: 274px;
          &:nth-child(2) {
            margin: 0 16px;
          }
        }
        .download {
          position: absolute;
          bottom: 16px;
          right: 16px;
          color: #ccc;
          display: flex;
          cursor: pointer;
          &-text {
            font-size: 12px;
            line-height: 24px;
            height: 24px;
          }
          .o-icon {
            font-size: 24px;
          }
          &:hover {
            transform: translateY(-3px);
            color: #0d8dff;
          }
        }
      }
    }
  }
}

.experience-title {
  font-size: 20px;
  color: #000000;
  line-height: 28px;
  margin-bottom: 10px;
}
.experience-text {
  font-size: 14px;
  font-weight: 400;
  color: #555555;
  line-height: 22px;
}
.model-page {
  background-image: url(../../../assets/imgs/taichu/vqa-background-image.png);
  background-position: 0% 0%;
  background-size: 100%;
  width: 100%;
  padding-bottom: 64px;
  @media screen and (max-width: 820px) {
    padding-bottom: 40px;
  }
  .model-wrap {
    margin: 0 auto;
    max-width: 1440px;
  }
}
</style>
