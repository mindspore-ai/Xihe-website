<script setup>
import { ref, computed } from 'vue';

import { handleMarkdown } from '@/shared/markdown';

import { useCompetitionData } from '@/stores';

import { getGuide } from '@/api/api-competition';

const comInfo = computed(() => {
  return useCompetitionData().competitionData;
});

const mkit = handleMarkdown();
const codeString = ref('');
const result = ref();
let README = '';
getGuide(comInfo.value.doc)
  .then((tree) => {
    README = tree.data;
    codeString.value = README;
    result.value = mkit.render(codeString.value);
  })
  .catch((err) => {
    return err;
  });
</script>
<template>
  <div v-dompurify-html="result" class="markdown-file"></div>
</template>

<style lang="scss" scoped>
.markdown-file {
  padding: 48px;
}
</style>
