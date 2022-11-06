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
  <div class="digg-content">
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
      <div v-else>
        <o-icon v-show="isDigged === false"><icon-heart></icon-heart></o-icon>
        <o-icon v-show="isDigged === true"><icon-digged></icon-digged></o-icon>
      </div>
      <span>{{ props.digCount }}</span>
    </div>
  </div>
</template>
<style lang="scss">
.digg-content {
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
    color: rgba(13, 141, 255, 1);
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
</style>
