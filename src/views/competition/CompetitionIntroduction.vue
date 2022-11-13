<script setup>
import { ref, computed } from 'vue';
// import { useRoute } from 'vue-router';

import { handleMarkdown } from '@/shared/markdown';

import { useCompetitionData } from '@/stores';

import { getGuide } from '@/api/api-competition';

const comInfo = computed(() => {
  return useCompetitionData().competitionData;
});
// console.log(comInfo);

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
    console.error(err);
  });
</script>
<template>
  <div class="markdown-file" v-html="result"></div>
</template>

<style lang="scss" scoped>
.markdown-file {
  padding: 48px;
}
</style>
