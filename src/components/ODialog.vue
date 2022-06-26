<script setup>
import { useAttrs } from 'vue';
import IconX from '~icons/app/x.svg';
defineProps({
  close: {
    type: Boolean,
    default: true,
  },
  show: {
    type: Boolean,
    default: false,
  },
});
const attrs = useAttrs();

const emit = defineEmits(['close-click']);

function onCloseClick() {
  emit('close-click');
}
</script>

<template>
  <teleport to="body">
    <div class="o-dialog" :class="{ show: show, hide: !show }" v-bind="attrs">
      <div class="o-dialog-mask"></div>
      <div class="o-dialog-wrap">
        <div v-if="close" class="o-dialog-close-btn" @click="onCloseClick">
          <OIcon><IconX /></OIcon>
        </div>
        <div class="o-dialog-head">
          <slot name="head"></slot>
        </div>
        <div class="o-dialog-body">
          <slot></slot>
        </div>
        <div class="o-dialog-foot">
          <slot name="foot"></slot>
        </div>
      </div>
    </div>
  </teleport>
</template>

<style lang="scss">
@keyframes o-dialog-show {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes o-dialog-wrap-show {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.o-dialog {
  visibility: hidden;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;

  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;

  &-mask {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 0;
    background-color: rgba($color: #000000, $alpha: 0.6);
  }

  &-wrap {
    position: relative;
    top: -10%;
    z-index: 2000;
    background-color: #fff;
    min-width: 550px;
    box-shadow: 0px 13px 33px 0px rgba(190, 196, 204, 0.2);
    @media screen and (max-width: 1023px) {
      min-width: auto;
      width: 90%;
    }
  }

  &-head {
    padding: 40px 80px 16px;
    font-size: 24px;
    line-height: 32px;
    text-align: left;
    @media screen and (max-width: 1023px) {
      padding: 30px 60px 12px;
      font-size: 18px;
    }
  }

  &-body {
    padding: 24px 80px;
    font-size: 14px;
    line-height: 22px;
    @media screen and (max-width: 1023px) {
      padding: 18px 60px;
    }
  }

  &-foot {
    padding: 24px 80px;
    font-size: 16px;
    line-height: 24px;
    @media screen and (max-width: 1023px) {
      padding: 18px 60px;
    }
  }

  &-close-btn {
    position: absolute;
    right: 0;
    top: 0;
    padding: 8px;
    cursor: pointer;
    z-index: 1;
    line-height: 1;
    font-size: 24px;
    &:hover {
      color: #3d8df7;
    }
  }

  &.show {
    opacity: 1;
    visibility: visible;
    animation: o-dialog-show 0.3s;

    .dialog-wrap {
      animation: o-dialog-wrap-show 0.3s ease-in-out;
    }
  }
}
</style>
