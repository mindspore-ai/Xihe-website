<script setup>
import IconTime from '~icons/app/time';
import IconHeart from '~icons/app/heart';

const props = defineProps({
  cardData: {
    type: Object,
    default: () => {
      return {};
    },
  },
});
// console.log('cardData: ', props.cardData);
const i18n = {
  downloadTitle: '下载量',
  uploadTime: '上传时间',
  likesNumber: '点赞数',
};
</script>
<template>
  <div class="project-card">
    <div class="card-top">
      <img
        :src="`https://obs-xihe-beijing4.obs.cn-north-4.myhuaweicloud.com/xihe-img/project-img/long_proimg${cardData.cover_id}.png`"
        alt=""
      />
      <p class="title">{{ cardData.name }}</p>
      <div class="dig">
        <o-icon> <icon-heart></icon-heart> </o-icon>
        <span>{{ cardData.like_count }}</span>
      </div>
    </div>

    <div class="card-bottom">
      <div class="info">
        <div class="info-avatar">
          <img :src="cardData.avatar_id" alt="" />
        </div>
        <div class="info-name">{{ cardData.owner }}</div>
      </div>
      <div class="time" :title="i18n.uploadTime">
        <o-icon>
          <icon-time></icon-time>
        </o-icon>
        <span>{{ cardData.update_at }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.project-card {
  cursor: pointer;
  box-shadow: 0px 1px 5px 0px rgba(45, 47, 51, 0.1);
  .o-icon {
    margin-right: 2px;
  }
  .card-top {
    height: 140px;
    position: relative;
    color: #fff;
    img {
      width: 100%;
      height: 100%;
      overflow: hidden;
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
    height: 62px;
    padding: 16px 24px 24px 24px;
    display: flex;
    justify-content: space-between;
    line-height: 22px;
    background-color: #fff;
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
