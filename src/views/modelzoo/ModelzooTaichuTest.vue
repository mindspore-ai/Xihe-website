<script setup>
import { ref } from 'vue';
import IconUpload from '~icons/app/modelzoo-upload';
import { uploadModelzooPic } from '@/api/api-modelzoo';

import img1 from '@/assets/imgs/taichu/example-1.png';
import img2 from '@/assets/imgs/taichu/example-2.png';
import img3 from '@/assets/imgs/taichu/example-3.png';
import img4 from '@/assets/imgs/taichu/example-4.png';
import img5 from '@/assets/imgs/taichu/example-5.png';
import img6 from '@/assets/imgs/taichu/example-6.png';
import img7 from '@/assets/imgs/taichu/example-7.png';

import { ElMessage } from 'element-plus';

const imageUrl = ref('');
const fileList = ref([]);
const imgLists = [
  {
    id: 0,
    url: img1,
  },
  {
    id: 1,
    url: img2,
  },
  {
    id: 2,
    url: img3,
  },
  {
    id: 3,
    url: img4,
  },
  {
    id: 4,
    url: img5,
  },
  {
    id: 5,
    url: img6,
  },
  {
    id: 6,
    url: img7,
  },
];

const activeIndex = ref(-1);
const analysis = ref('');
const formData = new FormData();

function submitUpload() {
  analysis.value = '';
  console.log(fileList.value);
  if (fileList.value[fileList.value.length - 1].raw) {
    formData.append('file', fileList.value[fileList.value.length - 1].raw);
  } else {
    formData.append('file', fileList.value[fileList.value.length - 1]);
  }

  uploadModelzooPic(formData).then((res) => {
    console.log(res);
    if (res.data) {
      analysis.value = res.data.inference_result.instances.image[0];
    } else {
    }
  });
}

function handleChange(val) {
  console.log(val);
  activeIndex.value = -1;
  imageUrl.value = URL.createObjectURL(val.raw);
  console.log(fileList.value);
}

function selectImage() {
  ElMessage({
    type: 'warning',
    message: '请将示例图片拖拽到上方区域',
  });
  // console.log(val);
  // activeIndex.value = i;
  // imageUrl.value = val.url;
  // fileList.value.push(val);
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
        <o-button type="primary" @click="submitUpload">开始推理</o-button>
      </div>
    </div>
    <div class="caption-bottom">
      <div class="caption-bottom-left">
        <el-upload
          drag
          :multiple="false"
          action="#"
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
              拖拽图片到此处上传(图片格式仅为png/jepg/jpg)
            </p>
          </div>
        </el-upload>
        <div class="img-list">
          <div
            v-for="(item, index) in imgLists"
            :key="item"
            class="img-list-item"
            :class="item.id === activeIndex ? 'active' : ''"
            @click="selectImage(item, index)"
          >
            <!-- <div class="modal"></div> -->
            <img :src="item.url" />
          </div>
        </div>
      </div>
      <div class="caption-bottom-right">
        <p class="result">分析结果</p>
        <div v-if="analysis" class="result-text">
          <span class="head">Caption:</span>
          <span class="main">&nbsp;{{ analysis }}</span>
        </div>
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
            // width: 100%;
            border: 1px solid #a0d2ff;
            height: 100%;
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
      .result {
        font-size: 18px;
        font-weight: 400;
        color: #000000;
        line-height: 25px;
        margin-bottom: 24px;
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
