<script setup>
import OButton from '@/components/OButton.vue';
</script>
<template>
  <div class="dataset-page">
    <div class="header">
      <div>datasetname</div>
      <o-button size="small">下载数据集</o-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dataset-page {
  .header {
    margin-top: 36px;
    font-size: 36px;
    line-height: 48px;
    display: flex;
    justify-content: space-between;
    .o-button {
      margin-top: 8px;
    }
  }
}
</style>
