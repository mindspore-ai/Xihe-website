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
  <div class="o-livecard o-model-hover">
    <div class="card-top">
      <div class="model-name">{{ cardData.name }}</div>
    </div>
    <div class="label-box">
      <div
        v-for="label in cardData.task_list"
        :key="label.id"
        class="label-item"
      >
        {{ label.name }}
      </div>
    </div>
    <p class="model-introduce">
      {{ cardData.description }}
    </p>
    <div class="card-bottom">
      <div class="card-bottom-left">
        <div class="user-avatar">
          <img :src="cardData.owner.avatar" alt="" />
        </div>
        <div v-if="cardData.owner.name" class="nickname">
          {{ cardData.owner.name }}
        </div>
      </div>
      <div class="card-bottom-right">
        <div v-if="cardData.time" class="update-time" :title="i18n.uploadTime">
          <o-icon> <icon-time></icon-time></o-icon>
          <span class="time">{{ cardData.time.substring(0, 10) }}</span>
        </div>
        <div class="download likes" :title="i18n.likesNumber">
          <o-icon><icon-heart></icon-heart></o-icon>
          <span>
            {{ cardData.digg_count }}
          </span>
        </div>
        <div class="download" :title="i18n.downloadTime">
          <o-icon><icon-download></icon-download></o-icon>
          <span>
            {{ cardData.download_count }}
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
  box-shadow: 0px 1px 5px 0px rgba(45, 47, 51, 0.1);
  cursor: pointer;
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
.o-model-hover {
  position: relative;
  .card-bg {
    width: 84px;
    height: 84px;
    position: absolute;
    right: 24px;
    bottom: 24px;
    border: none;
    background: url(@/assets/model-card-bg.png) no-repeat;
    display: none;
  }
  &:hover {
    color: #ccc;
    background-color: #4d66ca;
    box-shadow: 0px 6px 18px 0px rgba(13, 141, 255, 0.14);
    .time {
      color: #ccc;
    }
    .o-icon {
      color: #ccc;
    }
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
    .nickname {
      color: #fff;
    }
    svg {
      fill: #ccc;
      color: #ccc;
    }
  }
}
</style>
