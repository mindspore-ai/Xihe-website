<script setup>
import { ref } from 'vue';

import { handleMarkdown } from '@/shared/markdown';

import { getGuide } from '@/api/api-competition';

const mkit = handleMarkdown();
const codeString = ref('');
const result = ref();
let README = '';
getGuide()
  .then((tree) => {
    README = tree.data;
    codeString.value = README;
    result.value = mkit.render(codeString.value);
  })
  .catch((err) => {
    console.log(err);
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
