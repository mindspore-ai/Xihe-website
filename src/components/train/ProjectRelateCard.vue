<script setup>
import { defineEmits } from 'vue';

import IconTime from '~icons/app/time';
import IconDownload from '~icons/app/download';
import IconRemove from '~icons/app/remove';
import IconHeart from '~icons/app/heart';

import { useUserInfoStore } from '@/stores';

const userInfo = useUserInfoStore();

// const i18n = {
//   download: '下载量',
//   uploadTime: '上传时间',
// };

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

function viewRelateProject(item) {
  emit('jump', item);
}
</script>
<template>
  <div v-if="detailData[name].length">
    <div
      v-for="item in detailData[name]"
      :key="item"
      class="project-item"
      @click="viewRelateProject(item)"
    >
      <div class="card-top">
        <div class="card-top-left">
          <img class="avatar" :src="item.owner.avatar_id" alt="" />
        </div>

        <div class="card-top-right">
          {{ item.owner.name }}
          /
          {{ item.name }}
        </div>
      </div>

      <div class="card-bottom">
        <div class="update-time">
          <o-icon> <icon-time></icon-time></o-icon> {{ item.update_at }}
        </div>
        <div class="likes">
          <o-icon><icon-heart></icon-heart></o-icon> {{ item.like_count }}
        </div>
        <div class="downloads">
          <o-icon><icon-download></icon-download></o-icon>
          {{ item.download_count }}
        </div>
      </div>

      <o-icon
        v-if="userInfo.userName === detailData.owner"
        class="remove-item"
        @click.stop="removeItemClick(item)"
        ><icon-remove></icon-remove
      ></o-icon>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.project-item {
  cursor: pointer;
  width: 100%;
  padding: 24px;
  background-image: url('@/assets/imgs/relate-project-card-bg.png');
  background-repeat: no-repeat;
  background-size: cover;
  margin-bottom: 16px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  border: 1px solid #e5e5e5;
  &:hover {
    transition: all 0.5s;
    box-shadow: 0px 1px 16px 0px rgba(0, 0, 0, 0.05);
    .remove-item {
      display: block;
      color: #0d8dff;
    }
  }
  .card-top {
    display: flex;
    align-items: center;
    .card-top-left {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      overflow: hidden;
      margin-right: 8px;
      .avatar {
        width: 100%;
        height: 100%;
      }
    }
    .card-top-right {
      flex: 1;
      font-size: 18px;
      line-height: 24px;
      font-weight: 400;
      color: #000000;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .card-bottom {
    margin-top: 12px;
    display: flex;
    align-items: center;
    font-size: 12px;
    color: #555;
    line-height: 14px;
    .update-time,
    .likes {
      margin-right: 16px;
    }
    .o-icon {
      margin-right: 6px;
    }
  }

  .remove-item {
    position: absolute;
    right: 8px;
    top: 8px;
    display: none;
  }
}
</style>
