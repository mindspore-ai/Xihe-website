<script setup>
import { ref, computed, onUnmounted } from 'vue';

import { request } from '@/shared/axios';
import { goAuthorize } from '@/shared/login';
import { useLoginStore } from '@/stores';

import OButton from '@/components/OButton.vue';

import IconUpload from '~icons/app/modelzoo-upload';

import { uploadModelzooPic } from '@/api/api-modelzoo';

const isLogined = computed(() => useLoginStore().isLogined);

const imageUrl = ref('');
const fileList = ref([]);

const imgLists = [
  {
    id: 0,
    url: 'taichu-example-1',
  },
  {
    id: 1,
    url: 'taichu-example-2',
  },
  {
    id: 2,
    url: 'taichu-example-3',
  },
  {
    id: 3,
    url: 'taichu-example-4',
  },
  {
    id: 4,
    url: 'taichu-example-5',
  },
  {
    id: 5,
    url: 'taichu-example-6',
  },
];

const mobileImgLists = [
  {
    id: 0,
    url: 'taichu-example-1',
  },
  {
    id: 1,
    url: 'taichu-example-2',
  },
  {
    id: 2,
    url: 'taichu-example-3',
  },
  {
    id: 3,
    url: 'taichu-example-4',
  },
];

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

const activeIndex = ref(-1);
const analysis = ref('');
const loading = ref(false);

const getImage = (name) => {
  return new URL(
    `../../../assets/imgs/taichu/taichu-test/${name}.jpg`,
    import.meta.url
  ).href;
};

let formData = new FormData();

function submitUpload() {
  if (!isLogined.value) {
    goAuthorize();
  } else {
    if (fileList.value.length === 1) {
      analysis.value = '';
      loading.value = true;

      formData.delete('picture');
      formData = new FormData();

      formData.append('picture', fileList.value[fileList.value.length - 1].raw);

      try {
        uploadModelzooPic(formData).then((res) => {
          if (res.data) {
            analysis.value = res.data.desc;
            loading.value = false;
          } else {
            loading.value = false;
          }
        });
      } catch (e) {
        console.error(e);
      }
    }
  }
}

function handleChange(val) {
  if (val.size > 2097152) {
    // fileList.value.pop();
    return ElMessage({
      type: 'warning',
      message: '图片大小不应超过2M',
    });
  } else {
    analysis.value = '';
    formData.delete('picture');
    formData = new FormData();
    // fileList.value.length > 1 ? fileList.value.splice(0, 1) : '';
    fileList.value = [];
    fileList.value[0] = { raw: val.raw };

    activeIndex.value = -1;
    imageUrl.value = URL.createObjectURL(val.raw);
  }
}

function selectImage(item, index) {
  activeIndex.value = index;
  if (imageUrl.value !== getImage(item)) {
    analysis.value = '';
    formData.delete('picture');
    formData = new FormData();
    imageUrl.value = getImage(item);

    request
      .get(getImage(item), {
        responseType: 'blob',
      })
      .then((res) => {
        let file = new File([res.data], 'img', {
          type: 'image/png',
          lastModified: Date.now(),
        });
        fileList.value = [];
        fileList.value[0] = { raw: file }; // formData.append('blob', file);
      });
  }
}

function customUpload() {
  document.querySelector('.caption-bottom-left .el-upload__input').click();
}

const activeNames1 = ref(['1']);

onUnmounted(() => {
  window.removeEventListener('resize', onResize);
});
</script>
<template>
  <div class="model-page">
    <div class="model-wrap">
      <div class="image-caption">
        <div class="caption-top">
          <div>
            <p class="experience-title">以图生文（Image Caption）</p>
            <p class="experience-text">
              顾名思义，即让算法根据输入的一幅图自动生成对应的描述性的文字，是图像理解中非常重要的基础任务。
            </p>
          </div>
          <div class="experience-btn">
            <o-button
              v-if="!loading"
              type="primary"
              :disabled="loading"
              @click="submitUpload"
              >开始推理</o-button
            >
          </div>
        </div>
        <div class="caption-bottom">
          <div class="caption-bottom-left">
            <div>
              <el-upload
                drag
                action=""
                :multiple="false"
                accept=".png,.jpeg,.jpg"
                list-type="picture"
                :file-list="fileList"
                :auto-upload="false"
                :show-file-list="false"
                :on-change="handleChange"
              >
                <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                <div v-else class="empty-status">
                  <o-icon><icon-upload></icon-upload></o-icon>
                  <p class="upload-tip">
                    拖拽图片(jpg/jepg/png)到此处上传,且<span
                      >大小不超过200KB</span
                    >
                  </p>
                </div>
              </el-upload>
            </div>

            <div class="img-list">
              <div
                v-for="(item, index) in imgLists"
                :key="item"
                class="img-list-item"
                :class="item.id === activeIndex ? 'active' : ''"
                @click="selectImage(item.url, index)"
              >
                <img draggable="false" :src="getImage(item.url)" />
              </div>
              <div class="img-list-item custom" @click="customUpload">
                <o-icon><icon-upload></icon-upload></o-icon>
                <p>自定义图片</p>
              </div>
            </div>
          </div>

          <div class="caption-bottom-right">
            <p class="result">分析结果</p>
            <div v-if="analysis" class="result-text">
              <span class="head">Caption:</span>
              <span class="main">&nbsp;{{ analysis }}</span>
            </div>
            <img v-if="loading" src="@/assets/gifs/loading.gif" alt="" />
            <!-- <p><span>Caption:</span>{{ analysis }}</p> -->
          </div>
        </div>
      </div>

      <div class="mobile">
        <el-collapse v-model="activeNames1">
          <el-collapse-item title="以图生文（Image Caption）" name="1">
            <div class="description">
              顾名思义，即让算法根据输入的一幅图自动生成对应的描述性的文字，是图像理解中非常重要的基础任务。
            </div>
            <el-divider />
            <el-upload
              drag
              action=""
              :multiple="false"
              accept=".png,.jpeg,.jpg"
              list-type="picture"
              :file-list="fileList"
              :auto-upload="false"
              :show-file-list="false"
              :on-change="handleChange"
            >
              <img v-if="imageUrl" :src="imageUrl" class="avatar" />
              <div v-else class="empty-status">
                <o-icon><icon-upload></icon-upload></o-icon>
                <p class="upload-tip">
                  点击上传图片(jpg/jpeg/png)<br /><span>大小不超过200KB</span>
                </p>
              </div>
            </el-upload>
            <div class="img-list">
              <div
                v-for="(item, index) in mobileImgLists"
                :key="item"
                class="img-list-item"
                :class="item.id === activeIndex ? 'active' : ''"
                @click="selectImage(item.url, index)"
              >
                <img draggable="false" :src="getImage(item.url)" />
              </div>

              <div class="img-list-item custom" @click="customUpload">
                <o-icon><icon-upload></icon-upload></o-icon>
                <p>自定义</p>
              </div>
            </div>
            <p class="experience-title">分析结果</p>
            <div class="analyse-result">
              <div v-if="analysis" class="result-text">
                <span class="head">Caption:</span>
                <span class="main">&nbsp;{{ analysis }}</span>
              </div>
              <!-- <img v-if="loading" src="@/assets/gifs/loading.gif" alt="" /> -->
            </div>
            <div class="btn-box-mobile">
              <o-button
                type="primary"
                size="small"
                :disabled="loading"
                @click="submitUpload"
                >开始推理</o-button
              >
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.mobile-input {
  margin-bottom: 12px;

  :deep(.el-textarea__inner) {
    height: 96px !important;
    width: calc(100vw - 64px);
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
      @media screen and (max-width: 768px) {
        font-size: 9px;
        line-height: 13px;
      }
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
.divider {
  :deep(.el-divider) {
    border: 1px solid #dbdbdb;
  }
  // @media screen and (max-width: 768px) {
  //   display: none;
  // }
}

:deep(.el-collapse) {
  .el-collapse-item__header {
    padding: 16px 16px 8px;
  }
  .el-collapse-item .el-collapse-item__content {
    padding: 0 16px 16px;
    .el-divider--horizontal {
      margin: 16px 0;
    }
    .description {
      font-size: 12px;
      font-weight: 400;
      color: #555555;
      line-height: 18px;
    }
    .experience-title {
      font-size: 14px;
      font-weight: 400;
      color: #000000;
      line-height: 20px;
      margin-bottom: 8px;
    }
    .example {
      flex: 1;
      margin-bottom: 24px;
      &-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .refresh-btn {
          display: flex;
          align-items: center;
          cursor: pointer;
          p {
            font-size: 10px;
            font-weight: 400;
            color: #0d8dff;
            line-height: 14px;
          }
          .o-icon {
            font-size: 10px;
            margin-right: 2px;
          }
        }
      }
      .title {
        margin-bottom: 0;
        font-size: 12px;
        font-weight: 400;
        color: #555555;
        line-height: 17px;
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
      flex: 1;
      border: 1px solid #a0d2ff;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 16px;
      height: 254px;
      margin-bottom: 16px;
      &-img {
        height: 85px;
        height: 85px;
        &:nth-child(2) {
          margin: 0 8px;
        }
      }
      &-img-single {
        height: 100%;
      }
    }

    .btn-box-mobile {
      display: none;

      // @media screen and (max-width: 768px) {
      //   display: block;
      //   display: flex;
      //   justify-content: center;
      //   .infer-button-mobile {
      //     margin-left: 8px;
      //   }
      // }
    }

    :deep(.el-upload) {
      .el-upload-dragger {
        width: 100%;
        height: 196px;
      }
    }
  }
}
.mobile {
  // padding: 16px 16px 0;
  display: none;
  :deep(.el-image) {
    .el-image__preview {
      width: calc((100vw - 108px) / 3);
      height: calc((100vw - 108px) / 3);
    }
  }
  .image-modal {
    display: block;
    &:nth-child(2) {
      margin: 0 8px;
    }
    :deep(.el-image-viewer__wrapper) {
      margin-top: 48px;

      .el-image-viewer__canvas {
        img {
          width: 76% !important;
          height: 76vw;
        }
      }
      .el-image-viewer__close {
        display: none;
      }
      .el-image-viewer__prev {
        left: 4px;
        background: none;
      }
      .el-image-viewer__next {
        background: none;
        right: 4px;
      }
      .el-image-viewer__actions {
        display: none;
      }
    }
  }
  // @media screen and (max-width: 768px) {
  //   display: block;
  // }
}

.image-caption {
  // @media screen and (max-width: 768px) {
  //   display: none;
  // }
}
.caption-top {
  display: flex;
  justify-content: space-between;
  padding: 40px 0 20px 0;
  .experience-btn {
    align-self: flex-end;
  }
  .experience-title {
    font-weight: 300;
    color: #000000;
    font-size: 20px;
    line-height: 28px;
  }
  .experience-text {
    margin-top: 10px;
    font-size: 14px;
    font-weight: 400;
    color: #555555;
    line-height: 22px;
  }
}
.model-page {
  background-color: #f5f6f8;
  // max-width: 1440px;
  width: 100%;
  padding-bottom: 64px;
  @media screen and (max-width: 768px) {
    padding: 16px 16px 40px;
  }
  .model-wrap {
    margin: 0 auto;
    max-width: 1440px;
  }
}
.caption-bottom {
  height: 560px;
  display: flex;
  .caption-bottom-left {
    background-color: #f5f6f8;
    flex: 1;
    width: 70%;
    margin-right: 24px;

    .o-icon {
      font-size: 48px;
    }
  }
  .caption-bottom-right {
    width: calc(30% - 24px);
    padding: 16px 24px;
    background-color: #fff;
    position: relative;
    .result {
      font-size: 18px;
      font-weight: 400;
      color: #000000;
      line-height: 25px;
      margin-bottom: 24px;
    }

    img {
      width: 60px;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }

    .result-text {
      font-size: 14px;
      font-weight: 400;
      color: #555555;
      line-height: 20px;
      .head {
        font-size: 16px;
        font-weight: 500;
        color: #0d8dff;
        line-height: 24px;
        margin-bottom: 8px;
      }
      .main {
        font-size: 14px;
        font-weight: 400;
        color: #555555;
        line-height: 20px;
      }
    }
  }
}
</style>
