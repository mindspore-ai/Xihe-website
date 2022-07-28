<script setup>
import { ref } from 'vue';
import IconUpload from '~icons/app/modelzoo-upload';
import { uploadModelzooPic } from '@/api/api-modelzoo';

const imageUrl = ref('');
const fileList = ref([]);
const imgLists = [
  {
    id: 0,
    url: 'https://t7.baidu.com/it/u=1517419723,1472324058&fm=193&f=GIF',
  },
  {
    id: 1,
    url: 'https://t7.baidu.com/it/u=1517419723,1472324058&fm=193&f=GIF',
  },
  {
    id: 2,
    url: 'https://t7.baidu.com/it/u=1517419723,1472324058&fm=193&f=GIF',
  },
  {
    id: 3,
    url: 'https://t7.baidu.com/it/u=1517419723,1472324058&fm=193&f=GIF',
  },
  {
    id: 4,
    url: 'https://t7.baidu.com/it/u=1517419723,1472324058&fm=193&f=GIF',
  },
  {
    id: 5,
    url: 'https://t7.baidu.com/it/u=1517419723,1472324058&fm=193&f=GIF',
  },
  { id: 6, url: 'https://t7.baidu.com/it/u=877418396,3745118611&fm=193&f=GIF' },
];

const activeIndex = ref(-1);

function submitUpload() {
  // console.log(fileList.value);
  uploadModelzooPic({ file: fileList.value[0].raw });
}
function handleChange(val) {
  activeIndex.value = -1;
  // console.log(val);
  // console.log(URL.createObjectURL(val.raw));
  imageUrl.value = URL.createObjectURL(val.raw);
}
function selectImage(val, i) {
  activeIndex.value = i;
  imageUrl.value = val;
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
          list-type="picture"
          :file-list="fileList"
          :auto-upload="false"
          :show-file-list="false"
          :on-change="handleChange"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <div v-else class="empty-status">
            <o-icon><icon-upload></icon-upload></o-icon>
            <p class="upload-tip">拖拽图片到此处上传</p>
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
            <div class="modal"></div>
            <img :src="item.url" />
          </div>
        </div>
      </div>
      <div class="caption-bottom-right">
        <p class="result">分析结果</p>
        <p class="result-text">
          是一只小小小鸟是一只小小小鸟是一只小小小鸟是一只小小小鸟是一只小小小鸟是一只小小小鸟是一只小小小鸟是一只小小小鸟是一只小小小鸟是一只小小小鸟是一只小小小鸟是一只小小小鸟
        </p>
      </div>
    </div>
    <!-- 视觉回答 -->
    <div class="caption-top">
      <div>
        <p class="experience-title">视觉问答</p>
        <p class="experience-text">
          视觉问答是给定一幅图片和一个相关的问题，算法输出相应的答案，是多模态理解中的基础任务之一。
        </p>
      </div>
      <div class="experience-btn">
        <o-button type="primary" @click="submitUpload">开始推理</o-button>
      </div>
    </div>
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

  .caption-bottom {
    height: 560px;
    display: flex;
    .caption-bottom-left {
      background-color: #f5f6f8;
      flex: 1;
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
        font-size: 14px;
        font-weight: 400;
        color: #000000;
        line-height: 20px;
        margin-bottom: 24px;
      }
      .result-text {
        font-size: 14px;
        font-weight: 400;
        color: #555555;
        line-height: 20px;
      }
    }
  }
}
</style>
