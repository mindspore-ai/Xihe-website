<script setup>
import Markdown from 'markdown-it';
import { defineProps } from 'vue';
const props = defineProps({
  statement: {
    type: String,
    default: '',
  },
});
const mkit = new Markdown({ html: true });

const statementHtml = mkit.render(props.statement);
</script>

<template>
  <div class="statement markdown-file">
    <div v-dompurify-html="statementHtml"></div>
  </div>
</template>

<style lang="scss" scoped>
.statement {
  max-width: 1448px;
  margin: 0 auto;
  padding-top: 80px;
  padding-left: 16px;
  padding-right: 16px;
}
</style>
