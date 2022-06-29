<script setup>
import privacy from '@/assets/statement/privacy.md?raw';
import MdStatement from '@/components/MdStatement.vue';
</script>

<template>
  <MdStatement :statement="privacy"></MdStatement>
</template>
