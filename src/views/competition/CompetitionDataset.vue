<script setup>
import { ref, computed } from 'vue';

import OButton from '@/components/OButton.vue';
import { handleMarkdown } from '@/shared/markdown';

import { downloadDataset } from '@/api/api-obs';
import { getGuide } from '@/api/api-competition';
import { useCompetitionData } from '@/stores';

const comInfo = computed(() => {
  return useCompetitionData().competitionData;
});

const mkit = handleMarkdown();
const codeString = ref('');
const result = ref();
let README = '';
getGuide(comInfo.value.datasets_description)
  .then((tree) => {
    README = tree.data;
    codeString.value = README;
    result.value = mkit.render(codeString.value);
  })
  .catch((err) => {
    console.error(err);
  });
</script>
<template>
  <div class="dataset-page">
    <div class="header">
      <o-button size="small" @click="downloadDataset(comInfo.datasets_link)"
        >下载数据集</o-button
      >
    </div>
    <div class="markdown-file" v-html="result"></div>
  </div>
</template>

<style lang="scss" scoped>
.dataset-page {
  .header {
    margin-top: 36px;
    font-size: 36px;
    line-height: 48px;
    // display: flex;
    // justify-content: space-between;
    margin: 0 24px;
    .o-button {
      margin-top: 8px;
      float: right;
    }
  }
}
.markdown-file {
  padding: 48px;
}
</style>
