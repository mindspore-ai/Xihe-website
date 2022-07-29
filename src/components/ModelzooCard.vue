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
});
function jumpDetail() {
  router.push(`${prop.path}`);
}
</script>
<template>
  <div class="card" @click="jumpDetail">
    <div class="card-top">
      <img :src="prop.url" alt="" />
    </div>
    <div class="card-bottom">
      <div class="card-bottom-title">
        <p>{{ prop.title }}</p>
        <o-icon><icon-forward></icon-forward></o-icon>
      </div>
      <div class="card-bottom-text">{{ prop.introduce }}</div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.card {
  max-width: 464px;
  cursor: pointer;
  .card-top {
    width: 100%;
    height: 270px;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      &:hover {
        transform: scale(1.05);
        transition: all 0.2s linear;
      }
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
    .o-icon {
      &:hover {
        transform: translate(3px);
        transition: all 0.2s linear;
      }
    }
  }
}
</style>
