<script setup>
import agreement from '@/assets/statement/competition_agreement.md?raw';
import MdStatement from '@/components/MdStatement.vue';
</script>
<template>
  <div class="agreement">
    <MdStatement :statement="agreement"></MdStatement>
  </div>
</template>

<style lang="scss" scoped>
.agreement {
  padding: 0 48px;
}
:deep(.statement) {
  padding-top: 0;
}
</style>
