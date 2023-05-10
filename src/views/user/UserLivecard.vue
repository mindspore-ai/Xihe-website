<script setup>
import IconTime from '~icons/app/time';
import IconDownload from '~icons/app/download';
import IconHeart from '~icons/app/heart';

defineProps({
  cardData: {
    type: Object,
    default: () => {
      return {};
    },
  },
  cardType: {
    type: Object,
    default: () => {
      return {};
    },
  },
});
const i18n = {
  downloadTitle: '下载量',
  uploadTime: '上传时间',
  likesNumber: '点赞数',
};
</script>
<template>
  <div class="o-livecard o-live-hover">
    <div class="card-top">
      <div class="model-name">{{ cardData.resource.name }}</div>
    </div>
    <div class="label-box"></div>
    <p class="model-introduce">
      {{ cardData.resource.description }}
    </p>
    <div class="card-bottom">
      <div class="card-bottom-left">
        <div class="user-avatar">
          <img :src="cardData.resource.owner.avatar_id" alt="" />
        </div>
        <div class="nickname">
          {{ cardData.resource.owner.name }}
        </div>
      </div>
      <div class="card-bottom-right">
        <div class="update-time" :title="i18n.uploadTime">
          <o-icon> <icon-time></icon-time></o-icon>
          <span class="time">{{ cardData.time }}</span>
        </div>
        <div class="download likes" :title="i18n.likesNumber">
          <o-icon><icon-heart></icon-heart></o-icon>
          <span>
            {{ cardData.resource.like_count }}
          </span>
        </div>
        <div class="download" :title="i18n.downloadTitle">
          <o-icon><icon-download></icon-download></o-icon>
          <span>
            {{ cardData.resource.download_count }}
          </span>
        </div>
      </div>
    </div>
    <div class="card-bg"></div>
  </div>
</template>

<style lang="scss" scoped>
.o-livecard {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 24px;
  color: #555;
  background-color: #fff;
  transition: all 0.3s;
  overflow: hidden;
  cursor: pointer;
  border-radius: 16px;
  .o-icon {
    margin-right: 4px;
  }
  .card-top {
    display: flex;
    padding-bottom: 8px;
    font-size: 18px;
    color: #000;
    line-height: 24px;
    border-bottom: 1px solid #def1e8;
  }
  .label-box {
    display: flex;
    margin: 8px 0 16px;
    font-size: 12px;
    .label-item {
      padding: 3px 8px;
      margin-right: 8px;
      white-space: nowrap;
      text-overflow: ellipsis;
      background-color: #efefef;
    }
  }
  .model-introduce {
    height: 22px;
    line-height: 22px;
    overflow: hidden;
    word-wrap: break-word;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
  .card-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 12px;
    .card-bottom-left {
      display: flex;
      align-items: center;
      color: #000;
      .user-avatar {
        width: 18px;
        margin-right: 8px;
        display: flex;
        align-items: center;
        img {
          width: 100%;
          font-size: 20px;
          border-radius: 50%;
        }
      }
    }
    .update-time {
      display: flex;
      align-items: center;
    }
    .download {
      display: flex;
      align-items: center;
    }
    .card-bottom-right {
      display: flex;
      .update-time {
        color: #555;
        .o-icon {
          font-size: 16px;
          // margin-right: 4px;
          color: #555;
        }
        span {
          font-size: 12px;
        }
      }
      .download {
        margin-left: 20px;
        .o-icon {
          font-size: 16px;
          color: #555;
        }
        span {
          font-size: 12px;
        }
      }
    }
  }
}
.o-live-hover {
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
}
</style>
