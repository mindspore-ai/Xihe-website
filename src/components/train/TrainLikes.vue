<script setup>
// import { watch } from 'vue';
import IconHeart from '~icons/app/heart';
import IconDigged from '~icons/app/digged';
import { useUserInfoStore } from '@/stores';

const props = defineProps({
  isDigged: {
    type: Boolean,
    default: false,
  },
  digCount: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(['click']);
const userInfoStore = useUserInfoStore();

function onClick(e) {
  emit('click', e);
}
</script>
<template>
  <div class="digg">
    <div
      :class="[
        { 'un-digged': isDigged === false },
        { 'is-digged': isDigged === true },
      ]"
      @click="onClick"
    >
      <div v-if="!userInfoStore.id">
        <o-icon><icon-heart></icon-heart></o-icon>
      </div>
      <div v-else class="digg-content">
        <o-icon v-show="isDigged === false"><icon-heart></icon-heart></o-icon>
        <o-icon v-show="isDigged === true"><icon-digged></icon-digged></o-icon>
        <span>Like</span>

        <div class="digg-counts">
          {{ props.digCount }}
        </div>
      </div>
      <!-- <span>{{ props.digCount }}</span> -->
    </div>
  </div>
</template>
<style lang="scss">
.digg {
  cursor: pointer;
  .un-digged {
    display: flex;
    align-items: center;
    line-height: 24px;
    &:hover {
      svg {
        fill: rgba(13, 141, 255, 1);
      }
      color: rgba(13, 141, 255, 1);
    }
    .o-icon {
      margin-right: 8px;
      font-size: 20px;
    }
    span {
      font-size: 18px;
    }
  }
  .is-digged {
    display: flex;
    align-items: center;
    line-height: 24px;
    // color: rgba(13, 141, 255, 1);
    color: #555;
    svg {
      fill: rgba(13, 141, 255, 1);
    }
    &:hover {
      svg {
        fill: rgba(51, 179, 255, 1);
      }
      color: rgba(51, 179, 255, 1);
    }
    .o-icon {
      margin-right: 8px;
      font-size: 20px;
    }
    span {
      font-size: 18px;
    }
  }
}
.digg-content {
  display: flex;
  align-items: center;
  padding: 6px 20px;
  border: 1px solid #000000;
  border-radius: 19px;
  position: relative;
  color: #555550;
  &:hover {
    .digg-counts {
      opacity: 1;
      transition: all 0.5s;
    }
  }
}
.digg-counts {
  font-size: 12px;
  color: #555555;
  line-height: 20px;
  position: absolute;
  padding: 16px 20px;
  background: #fff;
  border-radius: 8px;
  bottom: -64px;
  left: 50%;
  transform: translateX(-50%);
  box-shadow: 0px -10px 32px 0px rgba(45, 47, 51, 0.18);
  opacity: 0;
  &::before {
    content: '';
    width: 0px;
    height: 0px;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 8px solid #fff;
    position: absolute;
    top: -6px;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
