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
  avatarImg: {
    type: String,
    default: () => {
      return '';
    },
  },
});
const labelList = ref([]);
const i18n = {
  downloadTitle: '下载量',
  uploadTime: '上传时间',
  likesNumber: '点赞数',
};
const tagList = JSON.stringify(props.cardData);

/* if (props.cardType === 'model') {
  const {
    licenses_list,
    libraries_list,
    task_list,
    tags_list,
    device_target_list,
    files_list,
  } = JSON.parse(tagList);

  labelList.value = [
    ...licenses_list,
    ...task_list,
    ...tags_list,
    ...libraries_list,
    ...device_target_list,
    ...files_list,
  ];
} else if (props.cardType === 'dataset') {
  const { licenses_list, task_list, files_list } = JSON.parse(tagList);
  labelList.value = [...licenses_list, ...task_list, ...files_list];
} */
</script>
<template>
  <div
    class="o-card"
    :class="[
      { 'o-model-hover': cardType === 'model' },
      { 'o-dataset-hover': cardType === 'dataset' },
    ]"
  >
    <div class="card-top">
      <div class="portrait">
        <img :src="avatarImg" alt="" />
      </div>
      <div v-if="cardData.owner" class="nickname">
        {{ cardData.owner }}
      </div>
      <div class="model-name">/{{ cardData.name }}</div>
    </div>
    <!-- TODO: 标签-->
    <div class="label-box">
      <div v-for="label in labelList" :key="label.id" class="label-item">
        {{ label.name }}
      </div>
    </div>
    <p class="model-introduce">
      {{ cardData.desc }}
    </p>
    <div class="card-bottom">
      <div class="card-bottom-left">
        <div
          v-if="cardData.updated_at"
          class="update-time"
          :title="i18n.uploadTime"
        >
          <o-icon> <icon-time></icon-time></o-icon>
          <span class="text">{{ cardData.updated_at }}</span>
        </div>
      </div>
      <div class="card-bottom-right">
        <div class="download likes" :title="i18n.likesNumber">
          <o-icon><icon-heart></icon-heart></o-icon>{{ cardData.like_count }}
        </div>
        <div class="download" :title="i18n.downloadTitle">
          <o-icon><icon-download></icon-download></o-icon
          >{{ cardData.download_count }}
        </div>
      </div>
    </div>
    <div class="card-bg"></div>
  </div>
</template>

<style lang="scss" scoped>
.o-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 24px;
  color: #555;
  background-color: #fff;
  transition: all 0.3s;
  overflow: hidden;
  box-shadow: 0px 1px 5px 0px rgba(45, 47, 51, 0.1);
  cursor: pointer;
  .o-icon {
    margin-right: 4px;
    font-size: 16px;
    color: #555;
  }
  .card-top {
    display: flex;
    padding-bottom: 8px;
    color: #000;
    font-size: 18px;
    line-height: 24px;
    border-bottom: 1px solid #def1e8;
    .portrait {
      margin-right: 8px;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      overflow: hidden;
      border: 1px solid #b7ddff;
      img {
        width: 100%;
      }
    }
  }
  .label-box {
    display: flex;
    height: 20px;
    flex-wrap: wrap;
    margin: 8px 0 16px;
    font-size: 12px;
    overflow: hidden;
    .label-item {
      padding: 3px 8px;
      line-height: 14px;
      white-space: nowrap;
      text-overflow: ellipsis;
      margin-right: 8px;
      background-color: #efefef;
    }
  }
  .model-introduce {
    min-height: 44px;
    margin-bottom: 24px;
    line-height: 22px;
    overflow: hidden;
    word-wrap: break-word;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .card-bottom {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    .update-time,
    .download {
      display: flex;
      align-items: center;
      text-align: center;
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
  .card-bg {
    width: 84px;
    height: 84px;
    position: absolute;
    right: 24px;
    bottom: 24px;
    border: none;
    background: url(@/assets/imgs/model-card-bg.png) no-repeat;
    display: none;
  }
  &:hover {
    color: #ccc;
    background-color: #4d66ca;
    box-shadow: 0px 6px 18px 0px rgba(13, 141, 255, 0.14);
    .card-bg {
      display: block;
    }
    .card-top {
      color: #fff;
    }
    .label-box {
      .label-item {
        color: #555;
      }
    }
    .o-icon {
      color: #ccc;
    }
  }
}
.o-dataset-hover {
  .card-bg {
    background: url(@/assets/imgs/dataset-card-bg.png) no-repeat;
  }
  &:hover {
    background: #7f78c3;
  }
}
</style>
