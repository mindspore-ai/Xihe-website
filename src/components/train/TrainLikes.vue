<script setup>
import { defineProps, defineEmits } from 'vue';
import IconHeart from '~icons/app/heart';
import IconDigged from '~icons/app/digged';

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
      <div class="digg-content">
        <o-icon v-show="isDigged === false"><icon-heart></icon-heart></o-icon>
        <o-icon v-show="isDigged === true"><icon-digged></icon-digged></o-icon>
        <span>Like</span>

        <div class="digg-counts">共有&nbsp;{{ props.digCount }}&nbsp;喜欢</div>
      </div>
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
      font-size: 16px;
    }
    span {
      font-size: 14px;
    }
  }
  .is-digged {
    display: flex;
    align-items: center;
    line-height: 24px;
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
      font-size: 16px;
    }
    span {
      font-size: 14px;
    }
  }
}
.digg-content {
  height: 32px;
  display: flex;
  align-items: center;
  padding: 6px 16px;
  background: #fff;
  border-radius: 16px;
  position: relative;
  color: #555550;
  &:hover {
    .digg-counts {
      display: block;
    }
  }
}
.digg-counts {
  font-size: 12px;
  color: #555555;
  line-height: 20px;
  white-space: nowrap;
  position: absolute;
  padding: 16px;
  background: #fff;
  border-radius: 4px;
  bottom: -64px;
  left: 50%;
  transform: translateX(-50%);
  box-shadow: 0px 10px 40px 0px rgba(18, 20, 23, 0.08);
  z-index: 2;
  display: none;
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
