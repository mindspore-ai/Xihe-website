<script setup>
import { defineEmits } from 'vue';

import IconTime from '~icons/app/time';

import IconHeart from '~icons/app/heart';

const i18n = {
  download: '下载量',
  uploadTime: '上传时间',
};

defineProps({
  // 相关项目的详情信息
  detailData: {
    type: Object,
    default: () => {
      return {};
    },
  },
  name: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['delete', 'jump']);

function goDetailClick(item) {
  emit('jump', item);
}
</script>
<template>
  <div v-if="detailData[name].length">
    <div
      v-for="item in detailData[name]"
      :key="item"
      class="project-item"
      @click="goDetailClick(item)"
    >
      <!-- <o-icon
        v-if="userInfo.userName === detailData.owner_name.name"
        class="remove-item"
        @click.stop="removeItemClick(item)"
        ><icon-remove></icon-remove
      ></o-icon> -->
      <div
        class="card-top"
        :style="{
          backgroundImage:
            'url(' +
            `https://obs-xihe-beijing4.obs.cn-north-4.myhuaweicloud.com/xihe-img/project-img/proimg${item.cover_id}.png` +
            ')',
        }"
      >
        {{ item.name }}
      </div>
      <div class="project-bottom">
        <div class="project-bottom-left">
          <div v-if="item.owner" class="avatar">
            <img :src="item.owner.avatar_id" />
          </div>

          <p v-if="item.owner" class="nick-name">
            {{ item.owner.name }}
          </p>
        </div>
        <div class="project-bottom-right">
          <o-icon><icon-heart></icon-heart></o-icon>
          {{ item.like_count }}

          <div class="update-time" :title="i18n.uploadTime">
            <o-icon> <icon-time></icon-time></o-icon>
            {{ item.update_at }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.project-item {
  cursor: pointer;
  width: 100%;
  background-color: #fff;
  box-shadow: 0px 1px 5px 0px rgba(45, 47, 51, 0.1);
  position: relative;
  margin-bottom: 16px;
  border-radius: 16px;
  &:hover {
    box-shadow: 0px 6px 18px 0px rgba(13, 141, 255, 0.14);
    .remove-item {
      display: block;
      color: #fff;
    }
  }
  .nick-name {
    font-size: 14px;
    line-height: 22px;
    color: #000;
  }

  .remove-item {
    position: absolute;
    right: 8px;
    top: 8px;
    display: none;
  }
  .o-icon.normal {
    font-size: 16px;
  }
  .card-top {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    height: 87px;
    word-break: break-all;
    overflow: hidden;
    padding: 8px 24px;
    font-size: 18px;
    background-position: center;
    object-fit: scale-down;
    background-size: 100% 100%;
    // background-repeat: no-repeat;
  }

  .project-bottom {
    display: flex;
    font-size: 12px;
    padding: 16px 24px 24px;
    justify-content: space-between;
    align-items: center;
    .avatar {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      margin-right: 8px;
      border: 1px solid #b7ddff;
      img {
        width: 100%;
      }
    }
    &-left,
    &-right {
      display: flex;
      align-items: center;
      vertical-align: bottom;
      line-height: 18px;
      color: #555;
      .o-icon {
        font-size: 16px;
        margin-right: 4px;
        color: #555;
      }
    }
    .update-time {
      display: flex;
      align-items: center;
      margin-left: 16px;
    }
  }
}
</style>
