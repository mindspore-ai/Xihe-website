<script setup>
import legal from '@/assets/statement/legal.md?raw';
import MdStatement from '@/components/MdStatement.vue';
</script>

<template>
  <MdStatement :statement="legal"></MdStatement>
</template>
