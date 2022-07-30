<script setup>
import { request } from '@/shared/axios';
import { ref } from 'vue';
import IconUpload from '~icons/app/modelzoo-upload';
import { uploadModelzooPic } from '@/api/api-modelzoo';
import { ElMessage } from 'element-plus';

// import { ElMessage } from 'element-plus';

const imageUrl = ref('');
const fileList = ref([]);
const imgLists = [
  {
    id: 0,
    url: '/imgs/taichu-example-1.png',
  },
  {
    id: 1,
    url: '/imgs/taichu-example-2.png',
  },
  {
    id: 2,
    url: '/imgs/taichu-example-3.png',
  },
  {
    id: 3,
    url: '/imgs/taichu-example-4.png',
  },
  {
    id: 4,
    url: '/imgs/taichu-example-5.png',
  },
  {
    id: 5,
    url: '/imgs/taichu-example-6.png',
  },
  {
    id: 6,
    url: '/imgs/taichu-example-7.png',
  },
];

const activeIndex = ref(-1);
const analysis = ref('');
const loading = ref(false);

let formData = new FormData();

function submitUpload() {
  analysis.value = '';
  loading.value = true;

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

function handleChange(val) {
  if (val.size > 204800) {
    return ElMessage({
      type: 'warning',
      message: '图片大小超出限制',
    });
  } else {
    formData.delete('file');
    formData = new FormData();
    fileList.value.length > 1 ? fileList.value.splice(0, 1) : '';
    activeIndex.value = -1;
    imageUrl.value = URL.createObjectURL(val.raw);
  }
}

function selectImage(item) {
  formData.delete('file');
  formData = new FormData();
  imageUrl.value = item;
  request
    .get(item, {
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
</script>
<template>
  <div class="model-page">
    <!-- Image Caption -->
    <div class="caption-top">
      <div>
        <p class="experience-title">Image Caption</p>
        <p class="experience-text">
          顾名思义，即让算法根据输入的一幅图自动生成对应的描述性的文字，是图像理解中非常重要的基础任务。
        </p>
      </div>
      <div class="experience-btn">
        <o-button v-if="!loading" type="primary" @click="submitUpload"
          >开始推理</o-button
        >
        <o-button v-else type="primary" disabled @click="submitUpload"
          >开始推理</o-button
        >
      </div>
    </div>
    <div class="caption-bottom">
      <div class="caption-bottom-left">
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
              拖拽图片(jpg/jepg/png)到此处上传,且大小不超过200KB
            </p>
          </div>
        </el-upload>
        <div class="img-list">
          <div
            v-for="(item, index) in imgLists"
            :key="item"
            class="img-list-item"
            :class="item.id === activeIndex ? 'active' : ''"
            @click="selectImage(item.url, index)"
          >
            <!-- <div class="modal"></div> -->
            <img draggable="false" :src="item.url" />
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
.caption-top {
  display: flex;
  justify-content: space-between;
  padding: 36px 0 20px 0;
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
  .experience-btn {
    align-self: flex-end;
  }
}
.model-page {
  background-color: #f5f6f8;
  min-width: 1440px;
  .caption-bottom {
    height: 560px;
    display: flex;
    .caption-bottom-left {
      background-color: #f5f6f8;
      flex: 1;
      width: 952px;
      margin-right: 24px;
      :deep(.el-upload) {
        width: 100%;
        .el-upload-dragger {
          width: 100%;
          height: 414px;
          border: none;
          border-radius: 0;
          padding: 24px 40px 0 40px;
          img {
            border: 1px solid #a0d2ff;
            height: 100%;
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
        .upload-tip {
          font-size: 14px;
          color: #999999;
          line-height: 22px;
          margin-top: 8px;
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
      width: 464px;
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
