<script setup>
import { useRouter } from 'vue-router';

import IconForward from '~icons/app/forward';
import OIcon from '@/components/OIcon.vue';

const router = useRouter();

const prop = defineProps({
  title: {
    type: String,
    default: '',
  },
  introduce: {
    type: String,
    default: '',
  },
  url: {
    type: String,
    default: '',
  },
  path: {
    type: String,
    default: '',
  },
  openness: {
    type: Boolean,
    default: false,
  },
});
function jumpDetail() {
  router.push(`${prop.path}`);
}
</script>
<template>
  <div :class="openness ? 'card' : 'card-closed'" @click="jumpDetail">
    <div class="card-top">
      <img draggable class="cover" :src="prop.url" alt="" />
    </div>
    <div class="card-bottom">
      <div class="card-bottom-title">
        <p>{{ prop.title }}</p>
        <o-icon v-if="prop.openness"><icon-forward></icon-forward></o-icon>
        <p v-else class="closed">敬请期待</p>
      </div>
      <div class="card-bottom-text">{{ prop.introduce }}</div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.card {
  max-width: 464px;
  box-shadow: 0px 1px 5px 0px rgba(45, 47, 51, 0.1);
  cursor: pointer;
  .o-icon {
    transform: translate(0);
    transition: all 0.2s linear;
  }
  .card-top {
    width: 100%;
    height: 270px;
    overflow: hidden;
    .cover {
      width: 100%;
      height: 100%;
      transform: scale(1);
      transition: all 0.2s linear;
    }
  }
  .card-bottom {
    width: 100%;
    height: 156px;
    padding: 0 40px;
    background-color: rgba(255, 255, 255, 0.95);
    &-title {
      font-size: 24px;
      font-weight: normal;
      color: #000000;
      line-height: 36px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px 0;
      border-bottom: 1px solid #ccc;
      .closed {
        font-size: 16px;
        color: #999999;
        line-height: 24px;
      }
    }
    &-text {
      padding: 24px 0;
      font-size: 16px;
      color: #555555;
      line-height: 24px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  &:hover {
    box-shadow: 0px 6px 18px 0px rgb(13 141 255 / 14%);
    .o-icon {
      transform: translate(3px);
      transition: all 0.2s linear;
    }
    .cover {
      transform: scale(1.05);
      transition: all 0.2s linear;
    }
  }
}
.card-closed {
  max-width: 464px;
  box-shadow: 0px 1px 5px 0px rgba(45, 47, 51, 0.1);
  cursor: pointer;
  .o-icon {
    transform: translate(0);
    transition: all 0.2s linear;
  }
  .card-top {
    width: 100%;
    height: 270px;
    overflow: hidden;
    .cover {
      width: 100%;
      height: 100%;
      transform: scale(1);
      transition: all 0.2s linear;
    }
  }
  .card-bottom {
    width: 100%;
    height: 156px;
    padding: 0 40px;
    background-color: rgba(255, 255, 255, 0.95);
    &-title {
      font-size: 24px;
      font-weight: normal;
      color: #000000;
      line-height: 36px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px 0;
      border-bottom: 1px solid #ccc;
      .closed {
        font-size: 16px;
        color: #999999;
        line-height: 24px;
      }
    }
    &-text {
      padding: 24px 0;
      font-size: 16px;
      color: #555555;
      line-height: 24px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
