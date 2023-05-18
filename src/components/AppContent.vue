<script setup>
import { computed } from 'vue';
const props = defineProps({
  pcTop: {
    type: Number,
    default: 40,
  },
  mobileTop: {
    type: Number,
    default: 16,
  },
});

const pcPaddingTop = computed(() => {
  return props.pcTop + 'px';
});

const mobilePaddingTop = computed(() => {
  return props.mobileTop + 'px';
});
</script>
<template>
  <div class="app-content"><slot></slot></div>
</template>
<style lang="scss" scoped>
.app-content {
  padding-top: v-bind('pcPaddingTop');
  padding-bottom: 64px;
  padding-left: 16px;
  padding-right: 16px;
  max-width: 1448px;
  margin: 0 auto;
  @media (max-width: 1080px) {
    padding-top: v-bind('mobilePaddingTop');
    padding-bottom: 40px;
  }
}
</style>
