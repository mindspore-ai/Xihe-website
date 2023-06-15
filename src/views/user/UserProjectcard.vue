<script setup>
import IconTime from '~icons/app/time';
import IconHeart from '~icons/app/heart';
import IconDownload from '~icons/app/download';
import IconFork from '~icons/app/fork-gray';

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
  avatarId: {
    type: String,
    default: () => {
      return '';
    },
  },
  owner: {
    type: String,
    default: () => {
      return '';
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
  <div class="project-card">
    <!-- <div
      v-if="cardData.level === 'official' || cardData.level === 'good'"
      :class="cardData.level === 'good' ? 'mark-tag' : 'mark-tag1'"
    >
      {{ cardData.level === 'official' ? '官方' : '精选' }}
    </div> -->

    <div class="card-top">
      <div class="img-box">
        <img
          :src="`https://obs-xihe-beijing4.obs.cn-north-4.myhuaweicloud.com/xihe-img/project-img/coverimg${cardData.cover_id}.png`"
          alt=""
          class="cover"
        />
      </div>
    </div>

    <div class="card-bottom">
      <div class="introduce">
        <p class="title">
          {{ cardData.title ? cardData.title : cardData.name }}
        </p>
        <p class="description">{{ cardData.description || cardData.desc }}</p>
        <div class="tag-list">
          <span
            v-for="(val, index) in cardData.tags"
            :key="index"
            :style="{ display: index < 4 ? 'inline-block' : 'none' }"
            class="tag"
          >
            {{ val === 'electricity' ? '电力' : val }}
          </span>
        </div>
      </div>

      <div class="detail">
        <div class="info">
          <div class="info-avatar">
            <img :src="cardData.owner?.avatar_id || avatarId" alt="" />
          </div>
          <div class="info-name">{{ cardData.owner?.name || owner }}</div>
        </div>

        <div class="card-bottom-right">
          <div class="update-time" :title="i18n.uploadTime">
            <o-icon> <icon-time></icon-time></o-icon>
            <span class="time">{{
              cardData.update_at || cardData.updated_at
            }}</span>
          </div>
          <div class="download likes" :title="i18n.likesNumber">
            <o-icon><icon-heart></icon-heart></o-icon>
            <span>
              {{ cardData.like_count }}
            </span>
          </div>
          <div class="download" :title="i18n.downloadTitle">
            <o-icon><icon-download></icon-download></o-icon>
            <span>
              {{ cardData.download_count }}
            </span>
          </div>
          <div class="download fork" :title="i18n.downloadTitle">
            <o-icon><icon-fork></icon-fork></o-icon>
            <span>
              {{ cardData.fork_count }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.project-card {
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  background: #ffffff;
  position: relative;
  &:hover {
    box-shadow: 0px 1px 5px 0px rgba(45, 47, 51, 0.1);
  }
  .mark-tag {
    position: absolute;
    top: 8px;
    right: 8px;
    padding: 3px 8px;
    z-index: 10;
    background: linear-gradient(45deg, #ffd866 0%, #ff7f0d 100%);
    font-size: 12px;
    color: #ffffff;
    border-radius: 10px;
  }
  .mark-tag1 {
    position: absolute;
    top: 8px;
    right: 8px;
    padding: 3px 8px;
    background: linear-gradient(326deg, #0d8dff 0%, #a5d4ff 100%);
    z-index: 10;
    font-size: 12px;
    color: #ffffff;
    border-radius: 8px;
  }
  .o-icon {
    margin-right: 2px;
  }
  .card-top {
    height: 198px;
    width: 268px;
    position: relative;
    color: #fff;
    padding: 8px;
    overflow: hidden;
    .img-box {
      width: 100%;
      height: 100%;
      overflow: hidden;
      border-radius: 8px;
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      overflow: hidden;
      border-radius: 8px;
      transition: all 0.3s ease;
    }
    .title {
      font-size: 18px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    .dig {
      position: absolute;
      right: 16px;
      top: 17px;
      font-size: 12px;
      display: flex;
      align-items: center;
      .o-icon {
        font-size: 16px;
        margin-right: 4px;
        svg {
          fill: #fff;
        }
      }
    }
  }
  .card-bottom {
    // height: 62px;
    padding: 24px 24px 24px 24px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    line-height: 22px;
    background-color: #fff;
    width: calc(100% - 268px);
    border-radius: 16px;
    .title {
      font-size: 20px;
      line-height: 28px;
      margin-bottom: 8px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      overflow: hidden;
      -webkit-line-clamp: 1;
      word-wrap: break-word;
    }
    .description {
      font-size: 14px;
      line-height: 22px;
      color: #555555;
      margin-bottom: 16px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      overflow: hidden;
      -webkit-line-clamp: 2;
      word-wrap: break-word;
    }
    .tag-list {
      line-height: 18px;
      font-size: 12px;
      font-weight: 400;
      color: #0d8dff;
      .tag {
        display: inline-block;
        background: rgba(13, 141, 255, 0.15);
        border-radius: 12px;
        padding: 3px 12px;
        margin-right: 4px;
        margin-bottom: 8px;
      }
    }
    .detail {
      display: flex;
      justify-content: space-between;
    }
    .card-bottom-right {
      display: flex;
      .update-time {
        color: #555;
        .o-icon {
          font-size: 16px;
          color: #555;
        }
        span {
          font-size: 12px;
          line-height: 16px;
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
          line-height: 16px;
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
    .info {
      display: flex;
      .info-avatar {
        margin-right: 8px;
        display: flex;
        align-items: center;
        img {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          color: #555;
        }
      }
      .info-name {
        height: 22px;
        font-size: 14px;
      }
    }
    .time {
      color: #555;
      display: flex;
      align-items: center;
      .o-icon {
        font-size: 16px;
        color: #555;
        margin-right: 4px;
      }
      span {
        font-size: 12px;
      }
    }
  }
}
</style>
