<script setup>
import mobile from '@/views/modelzoo/wukong/MoblieExperence.vue';
import pc from '@/views/modelzoo/wukong/PcExperence.vue';
import useWindowResize from '@/shared/hooks/useWindowResize.js';

const screenWidth = useWindowResize();
</script>
<template>
  <mobile v-if="screenWidth <= 820" />
  <pc v-else />
</template>
<style lang="scss" scoped></style>
