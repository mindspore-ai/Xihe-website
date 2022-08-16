<script setup>
import { request } from '@/shared/axios';
import { ref, onMounted } from 'vue';

import IconUpload from '~icons/app/modelzoo-upload';
import IconDownload from '~icons/app/download';
import OButton from '@/components/OButton.vue';

import { uploadModelzooPic } from '@/api/api-modelzoo';
import { ElMessage } from 'element-plus';

// import { ElMessage } from 'element-plus';

const inferUrl = ref(
  'https://text2img.obs.cn-central-221.ovaijisuan.com/wesley/result.jpg'
);

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
  // {
  //   id: 6,
  //   url: '/imgs/taichu-example-7.png',
  // },
];
const activeIndex = ref(-1);
const analysis = ref('');
const loading = ref(false);
const loading1 = ref(false);
const inferenceText = ref('');
const inputValue = ref(null);

const getImage = (name) => {
  return new URL(`../../assets/imgs/taichu-test/${name}.jpg`, import.meta.url)
    .href;
};

let formData = new FormData();

function submitUpload() {
  if (fileList.value.length === 1) {
    analysis.value = '';
    loading.value = true;

    formData.delete('file');
    formData = new FormData();
    formData.append('file', fileList.value[fileList.value.length - 1].raw);
    try {
      uploadModelzooPic(formData).then((res) => {
        if (res.data) {
          analysis.value = res.data.inference_result.instances.image[0];
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

function handleChange(val) {
  if (val.size > 204800) {
    fileList.value.pop();
    return ElMessage({
      type: 'warning',
      message: '图片大小不应超过200K',
    });
  } else {
    analysis.value = '';
    formData.delete('file');
    formData = new FormData();
    fileList.value.length > 1 ? fileList.value.splice(0, 1) : '';
    activeIndex.value = -1;
    imageUrl.value = URL.createObjectURL(val.raw);
  }
}

function selectImage(item, index) {
  activeIndex.value = index;
  if (imageUrl.value !== getImage(item)) {
    analysis.value = '';
    formData.delete('file');
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

function resetInferText() {
  inferenceText.value = '';
  inputValue.value.focus();
}

function startRatiocnate() {
  if (/^[\u4E00-\u9FA5]+$/.test(inferenceText.value)) {
    console.log('中文');
  } else {
    ElMessage({
      type: 'warning',
      message: '请输入中文描述',
    });
  }
}

function downLoadPicture() {
  let x = new XMLHttpRequest();
  x.open(
    'GET',
    'https://text2img.obs.cn-central-221.ovaijisuan.com/wesley/result.jpg',
    true
  );
  x.responseType = 'blob';
  x.onload = function () {
    console.log(x.response);
    const blobs = new Blob([x.response], { type: 'image/jpg' });
    let url = window.URL.createObjectURL(blobs);
    let a = document.createElement('a');
    a.href = url;
    a.download = 'infer.jpg';
    a.click();
  };
  x.send();
}

onMounted(() => {});
</script>
<template>
  <div class="model-page">
    <!-- 以文生图 -->
    <div class="text-to-img">
      <div class="title">
        <span> 以文生图（Text-To-Image）</span><span class="new-tag">new</span>
      </div>
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
            placeholder="请用中文输入描述内容"
            class="text-area"
          >
          </el-input>
          <div class="btn-box">
            <o-button @click="resetInferText">重新输入</o-button>
            <o-button
              type="primary"
              class="infer-button"
              @click="startRatiocnate"
              >开始推理</o-button
            >
          </div>
        </div>
        <div class="content-right">
          <p class="content-right-title">分析结果</p>
          <div class="result">
            <img
              v-if="loading1"
              class="loading-img"
              src="@/assets/gifs/loading.gif"
              alt=""
            />
            <img class="result-img" :src="inferUrl" />
            <a @click="downLoadPicture">
              <o-icon><icon-download></icon-download></o-icon
            ></a>
          </div>
        </div>
      </div>
    </div>
    <!-- Image Caption -->
    <div class="caption-top">
      <div>
        <p class="experience-title">Image Caption</p>
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
                拖拽图片(jpg/jepg/png)到此处上传,且<span>大小不超过200KB</span>
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
            <!-- <div class="modal"></div> -->
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

    <!-- 视觉回答 -->
    <!-- <div class="caption-top">
      <div>
        <p class="experience-title">视觉问答</p>
        <p class="experience-text">
          视觉问答是给定一幅图片和一个相关的问题，算法输出相应的答案，是多模态理解中的基础任务之一。
        </p>
      </div>
      <div class="experience-btn">
        <o-button type="primary" @click="submitUpload">开始推理</o-button>
      </div>
    </div> -->
  </div>
</template>

<style lang="scss" scoped>
.text-to-img {
  padding-top: 36px;
  .title {
    font-size: 20px;
    color: #000000;
    line-height: 28px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    .new-tag {
      display: inline-block;
      width: 44px;
      line-height: 20px;
      background: #ff7f0d;
      text-align: center;
      color: #fff;
      font-size: 12px;
    }
  }
  .content {
    margin-top: 16px;
    display: flex;
    &-left {
      width: 464px;
      height: 467px;
      background: #ffffff;
      margin-right: 25px;
      padding: 24px 24px 32px;
      display: flex;
      flex-direction: column;
      &-title {
        font-size: 18px;
        font-weight: 400;
        color: #000000;
        line-height: 25px;
      }
      .text-area {
        flex: 1;
        margin: 28px 0;
        :deep(.el-input__count) {
          right: -5px;
        }
        :deep(.el-textarea__inner) {
          height: 100%;
          width: 416px;
        }
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
      height: 467px;
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
          height: 100%;
        }
        .o-icon {
          position: absolute;
          bottom: 16px;
          right: 16px;
          color: #ccc;
          font-size: 24px;
          cursor: pointer;
          &:hover {
            transform: translateY(-3px);
            color: #0d8dff;
          }
        }
        .loading-img {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 80px;
        }
      }
    }
  }
}
.caption-top {
  display: flex;
  justify-content: space-between;
  padding: 36px 0 20px 0;

  .experience-btn {
    align-self: flex-end;
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
  background-color: #f5f6f8;
  max-width: 1440px;
  .caption-bottom {
    height: 560px;
    display: flex;
    .caption-bottom-left {
      background-color: #f5f6f8;
      flex: 1;
      width: 70%;
      margin-right: 24px;
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
          img {
            border: 1px solid #a0d2ff;
            max-height: 100%;
            max-width: 100%;
            object-fit: fill;
          }
        }
      }
      .o-icon {
        font-size: 48px;
      }
      .empty-status {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .o-icon {
          color: #ccc;
        }
        .upload-tip {
          font-size: 14px;
          color: #ccc;
          line-height: 22px;
          margin-top: 8px;
          span {
            color: #0d8dff;
          }
        }
      }
      .img-list {
        padding: 20px 40px;
        display: flex;
        background-color: #fff;
        justify-content: space-between;
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
          p {
            font-size: 14px;
            font-weight: 400;
            line-height: 20px;
            margin-top: 8px;
          }
        }
        &-item {
          width: 106px;
          height: 106px;
          position: relative;
          cursor: pointer;
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
</style>
