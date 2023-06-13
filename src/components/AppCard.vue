<script setup>
import IconTime from '~icons/app/time';
import IconDownload from '~icons/app/download';
import IconHeart from '~icons/app/heart';
import { ref } from 'vue';

const props = defineProps({
  cardData: {
    type: Object,
    default: () => {
      return {};
    },
  },
  cardType: {
    type: String,
    default: () => {
      return 'model';
    },
  },
  showName: {
    type: Boolean,
    default: true,
  },
});

const labelList = ref([]);
const i18n = {
  downloadTitle: '下载量',
  uploadTime: '上传时间',
  likesNumber: '点赞数',
};
const tagList = JSON.stringify(props.cardData);

if (props.cardType === 'model') {
  const { tags } = JSON.parse(tagList);
  labelList.value = tags;
} else if (props.cardType === 'dataset') {
  const { tags } = JSON.parse(tagList);
  labelList.value = tags;
} else {
  const { tags } = JSON.parse(tagList);
  labelList.value = tags;
}
</script>
<template>
  <div
    class="app-card"
    :class="[
      { 'o-model-hover': cardType === 'model' },
      { 'o-dataset-hover': cardType === 'dataset' },
    ]"
  >
    <div class="card-top">
      <div class="owner-info">
        <div v-if="cardData.title" class="model-name">{{ cardData.title }}</div>
        <div v-else class="model-name">{{ cardData.name }}</div>
      </div>
    </div>
    <div class="label-box">
      <div v-for="label in labelList" :key="label.index" class="label-item">
        {{ label === 'electricity' ? '电力' : label }}
      </div>
    </div>
    <p class="model-introduce">
      {{ cardData.desc }}
    </p>

    <div class="card-bottom">
      <div class="card-bottom-left">
        <div class="portrait">
          <img :src="cardData.avatar_id" alt="" />
        </div>
        <div class="model-name">{{ cardData.name }}</div>
      </div>
      <div class="card-bottom-right">
        <div v-if="cardData.updated_at" class="update-time">
          <o-icon> <icon-time></icon-time></o-icon>
          <span class="text">{{ cardData.updated_at }}</span>
        </div>

        <div class="download likes" :title="i18n.likesNumber">
          <o-icon><icon-heart></icon-heart></o-icon>{{ cardData.like_count }}
        </div>
        <div class="download" :title="i18n.downloadTitle">
          <o-icon><icon-download></icon-download></o-icon
          >{{ cardData.download_count }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.app-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 16px;
  padding: 24px;
  color: #555;
  background-color: #fff;
  transition: box-shadow 0.3s;
  overflow: hidden;
  cursor: pointer;
  border-radius: 16px;
  @media screen and (max-width: 820px) {
    padding: 16px;
  }
  .o-icon {
    margin-right: 4px;
    font-size: 16px;
    color: #555;
    @media screen and (max-width: 820px) {
      font-size: 13px;
    }
  }
  .card-top {
    display: flex;
    align-items: center;
    padding-bottom: 8px;
    color: #000;
    font-size: 18px;
    line-height: 24px;
    border-bottom: 1px solid #def1e8;
    position: relative;
    @media screen and (max-width: 820px) {
      font-size: 14px;
      line-height: 22px;
      padding-bottom: 0px;
      border-bottom: none;
    }
    .owner-info {
      display: flex;
    }
  }
  .label-box {
    display: flex;
    height: 18px;
    flex-wrap: wrap;
    margin: 8px 0 24px;
    font-size: 12px;
    overflow: hidden;
    position: relative;
    @media screen and (max-width: 820px) {
      margin: 4px 0 12px;
    }
    .label-item {
      padding: 2px 8px;
      line-height: 14px;
      white-space: nowrap;
      text-overflow: ellipsis;
      margin-right: 8px;
      background-color: #efefef;
      border-radius: 10px;
    }
  }
  .model-introduce {
    margin-bottom: 24px;
    font-size: 14px;
    line-height: 22px;
    overflow: hidden;
    word-wrap: break-word;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    position: relative;
    @media screen and (max-width: 820px) {
      font-size: 12px;
      line-height: 18px;
      min-height: 36px;
      margin-bottom: 12px;
    }
  }
  .card-bottom {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    position: relative;
    .portrait {
      margin-right: 8px;
      width: 24px;
      // min-width: 24px;
      height: 24px;
      border-radius: 50%;
      overflow: hidden;
      border: 1px solid #b7ddff;
      @media screen and (max-width: 820px) {
        width: 16px;
        height: 16px;
      }
      img {
        width: 100%;
      }
    }
    .update-time,
    .download {
      display: flex;
      align-items: center;
      text-align: center;
      .text {
        line-height: 16px;
        white-space: nowrap;
      }
    }
    .card-bottom-left {
      display: flex;
      align-items: center;
      .model-name {
        font-size: 14px;
        color: #000000;
        line-height: 22px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
    .card-bottom-right {
      display: flex;
      .download {
        margin-left: 20px;
      }
    }
  }
}
.o-model-hover,
.o-dataset-hover {
  position: relative;
  &:hover {
    box-shadow: 0px 1px 30px 0px rgba(0, 0, 0, 0.05);
  }
}
.o-dataset-hover {
  position: relative;
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url(@/assets/imgs/dataset-bg.png);
    background-size: 100% 100%;
    transition: opacity 0.3s;
    opacity: 0;
  }
  &:hover::before {
    opacity: 1;
  }
}
.o-model-hover {
  position: relative;
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url(@/assets/imgs/model-bg.png);
    background-size: 100% 100%;
    transition: opacity 0.3s;
    opacity: 0;
  }
  &:hover::before {
    opacity: 1;
  }
}
</style>
