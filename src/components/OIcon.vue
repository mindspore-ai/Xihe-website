<script setup>
defineProps({
  size: {
    validator(value) {
      return ['large', 'medium', 'small', 'mini', ''].includes(value);
    },
    default: '',
  },
});
</script>

<template>
  <span class="o-icon" :class="[size]">
    <slot></slot>
  </span>
</template>
<style lang="scss">
.o-icon {
  line-height: 1;

  &.large {
    font-size: 32px;
  }

  &.medium {
    font-size: 24px;
  }

  &.small {
    font-size: 16px;
  }

  &.mini {
    font-size: 12px;
  }

  svg {
    width: 1em;
    height: 1em;
    color: currentColor;
    vertical-align: top;
  }
}
</style>
