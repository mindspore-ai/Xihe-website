<script setup>
import { defineEmits, ref, watch } from 'vue';

import IconTime from '~icons/app/time';
import IconRemove from '~icons/app/remove';
import IconDownload from '~icons/app/download';
import IconHeart from '~icons/app/heart';

import { useUserInfoStore } from '@/stores';

const userInfo = useUserInfoStore();

const i18n = {
  download: '下载量',
  uploadTime: '上传时间',
};

const props = defineProps({
  // 数据集、模型的详情信息
  detailData: {
    type: Object,
    default: null,
  },
  name: {
    type: String,
    default: '',
  },
  deleteRelate: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(['delete', 'jump', 'cancel']);

function removeItemClick(item) {
  emit('delete', item);
}

function goDetailClick(item) {
  emit('jump', item);
}

const delRelate = ref(null);

watch(
  () => props.deleteRelate,
  (newValue) => {
    delRelate.value = newValue;
  }
);
</script>
<template>
  <div v-if="detailData[name].length">
    <div
      v-for="item in detailData[name]"
      :key="item"
      class="dataset-item"
      @click="goDetailClick(item)"
    >
      <o-icon
        v-if="userInfo.userName === detailData.owner"
        class="remove-item"
        @click.stop="removeItemClick(item)"
        ><icon-remove></icon-remove
      ></o-icon>
      <div class="card-top">
        <div class="avatar">
          <img :src="item.owner.avatar_id" />
        </div>

        <p class="nick-name">{{ item.owner.name }}/{{ item.name }}</p>
      </div>
      <div class="dataset-bottom">
        <div class="update-time">
          <o-icon> <icon-time></icon-time></o-icon>
          {{ item.update_at }}
        </div>
        <div class="heart">
          <o-icon><icon-heart></icon-heart></o-icon>
          {{ item.like_count }}
        </div>
        <div class="download">
          <o-icon><icon-download></icon-download></o-icon>
          {{ item.download_count }}
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.dataset-item {
  cursor: pointer;
  width: 100%;
  padding: 24px;
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #e5e5e5;
  position: relative;
  margin-bottom: 16px;
  &:hover {
    box-shadow: 0px 1px 16px 0px rgba(0, 0, 0, 0.05);
    transition: all 0.2s linear;
    .remove-item {
      display: block;
      color: #0d8dffff;
    }
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
    font-size: 18px;

    .avatar {
      width: 24px;
      min-width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 1px solid #b7ddff;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .nick-name {
      font-size: 18px;
      line-height: 24px;
      color: #000;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-left: 8px;
    }
  }
  .dataset-bottom {
    display: flex;
    justify-content: start;
    align-items: center;
    color: #555;
    font-size: 12px;
    line-height: 16px;
    margin-top: 16px;

    & > div {
      display: flex;
      align-items: center;
      margin-right: 24px;
      .o-icon {
        font-size: 16px;
        margin-right: 4px;
        fill: #555;
      }
    }
  }
}
</style>
