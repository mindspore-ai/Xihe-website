<script setup>
import { computed } from 'vue';

import OButton from '@/components/OButton.vue';

import { downloadDataset } from '@/api/api-obs';
// import { getTeamInfoById } from '@/api/api-competition';
import { useCompetitionData } from '@/stores';

const comInfo = computed(() => {
  return useCompetitionData().competitionData;
});

console.log(comInfo);
</script>
<template>
  <div class="dataset-page">
    <div class="header">
      <div>datasetname</div>
      <o-button size="small" @click="downloadDataset(comInfo.datasets_link)"
        >下载数据集</o-button
      >
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
