<script setup>
import { ref } from 'vue';

import IconDownload from '~icons/app/download';

import OButton from '@/components/OButton.vue';
import { handleMarkdown } from '@/shared/markdown';

import { getGuide } from '@/api/api-competition';
import { useCompetitionData } from '@/stores';
import { ElMessage } from 'element-plus';

const userComData = useCompetitionData().competitionData;

const mkit = handleMarkdown();
const codeString = ref('');
const result = ref();
let README = '';
getGuide(userComData.dataset_doc)
  .then((tree) => {
    README = tree.data;
    codeString.value = README;
    result.value = mkit.render(codeString.value);
  })
  .catch(() => {
    ElMessage({
      type: 'error',
      message: 'error',
    });
  });

function downloadDataset() {
  window.open(userComData.dataset_url, '_black');
}
</script>
<template>
  <div class="dataset-page">
    <div class="header">
      <o-button
        v-if="userComData.is_competitor"
        :disabled="userComData.id === 'ai_painter'"
        size="small"
        @click="downloadDataset()"
        >下载数据集
        <template #suffix>
          <o-icon><icon-download></icon-download></o-icon> </template
      ></o-button>
    </div>
    <div v-dompurify-html="result" class="markdown-file"></div>
  </div>
</template>

<style lang="scss" scoped>
.dataset-page {
  .header {
    margin-top: 36px;
    font-size: 36px;
    line-height: 48px;
    display: flex;
    justify-content: flex-end;
    margin: 0 24px;
    .o-button {
      margin-top: 48px;
      margin-right: 23px;
    }
  }
}
.markdown-file {
  padding: 40px 48px 48px;
}
</style>
