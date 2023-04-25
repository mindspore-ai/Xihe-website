<script setup>
import { ref, computed } from 'vue';

import { request } from '@/shared/axios';
import { goAuthorize } from '@/shared/login';
import { useLoginStore } from '@/stores';

import OButton from '@/components/OButton.vue';

import IconUpload from '~icons/app/modelzoo-upload';

import { uploadModelzooPic } from '@/api/api-modelzoo';

import useWindowResize from '@/shared/hooks/useWindowResize.js';

const screenWidth = useWindowResize();

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
                  <p class="upload-tip">拖拽图片(jpg/jepg/png)到此处上传</p>
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
        <p class="model-name">以图生文（Image Caption）</p>
        <div class="model-desc">
          顾名思义，即让算法根据输入的一幅图自动生成对应的描述性的文字，是图像理解中非常重要的基础任务。
        </div>
        <div class="image-upload">
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
              <p v-if="screenWidth > 820" class="upload-tip">
                拖拽图片(jpg/jepg/png)到此处上传
              </p>
              <p v-else class="upload-tip">选择图片(jpg/jepg/png)到此处上传</p>
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
            <p>自定义</p>
          </div>
        </div>
        <p class="analyse">分析结果</p>

        <div class="analyse-result">
          <img v-if="loading" src="@/assets/gifs/loading.gif" alt="" />
          <p v-else>{{ analysis }}</p>
        </div>
        <!-- <div class="analyse-result">
          <img v-if="loading" src="@/assets/gifs/loading.gif" alt="" />
        </div> -->

        <div class="mobile-btn">
          <o-button
            type="primary"
            size="mini"
            :disabled="loading"
            @click="submitUpload"
            >开始推理</o-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.empty-status {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .o-icon {
    color: #ccc;
    font-size: 48px;
    @media screen and (max-width: 820px) {
      font-size: 32px;
    }
  }
  .upload-tip {
    font-size: 14px;
    color: #ccc;
    line-height: 22px;
    margin-top: 8px;
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
    @media screen and (max-width: 820px) {
      height: 346px;
      border: 1px solid #acacac;
    }
    @media screen and (max-width: 767px) {
      height: 196px;
      border: 1px solid #acacac;
      padding: 8px;
    }
    img {
      border: 1px solid #a0d2ff;
      max-height: 100%;
      max-width: 100%;
      object-fit: fill;
    }
  }
}
.img-list {
  padding: 20px 40px;
  display: flex;
  background-color: #fff;
  justify-content: space-between;
  align-items: center;
  @media screen and (max-width: 820px) {
    padding: 0;
    margin-top: 16px;
  }
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
    .o-icon {
      @media screen and (max-width: 768px) {
        font-size: 24px;
      }
    }

    p {
      font-size: 14px;
      font-weight: 400;
      line-height: 20px;
      margin-top: 8px;
      @media screen and (max-width: 768px) {
        font-size: 9px;
        line-height: 13px;
        font-weight: 400;
        color: #0d8dff;
      }
    }
  }
  .img-list-item {
    width: 106px;
    height: 106px;
    position: relative;
    cursor: pointer;
    @media screen and (max-width: 820px) {
      width: 96px;
      height: 96px;
      border: 1px solid transparent;
    }
    @media screen and (max-width: 767px) {
      width: 62px;
      height: 62px;
      border: 1px solid transparent;
      &:nth-child(5),
      &:nth-child(6) {
        display: none;
      }
    }
    img {
      width: 100%;
      height: 100%;
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
.model-page {
  background-image: url(../../../assets/imgs/taichu/vqa-background-image.png);
  background-position: 0% 0%;
  background-size: 100%;
  width: 100%;
  padding-bottom: 64px;
  @media screen and (max-width: 820px) {
    padding: 16px 16px 40px;
  }
  .model-wrap {
    margin: 0 auto;
    max-width: 1440px;
    @media screen and (max-width: 820px) {
      background-color: #fff;
      padding: 16px 16px 24px;
    }
  }
  // PC
  .image-caption {
    @media screen and (max-width: 820px) {
      display: none;
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
  }
  // mobile
  .mobile {
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
      @media screen and (max-width: 820px) {
        border-bottom: 1px solid #dbdbdb;
        padding: 8px 0 16px;
      }
    }
    .image-upload {
      margin-top: 16px;
    }
    .analyse {
      font-size: 14px;
      line-height: 20px;
      font-weight: 400;
      color: #000000;
      margin-top: 24px;
    }
    .analyse-result {
      height: 120px;
      border: 1px solid #a0d2ff;
      margin-top: 12px;
      padding: 8px;
      font-size: 12px;
      position: relative;
      img {
        width: 50px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
    }
    .mobile-btn {
      margin-top: 16px;
      display: flex;
      justify-content: center;
    }
  }
}
</style>
