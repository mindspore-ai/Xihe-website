<script setup>
import Markdown from 'markdown-it';
import MarkdownItSanitizer from 'markdown-it-sanitizer';

const props = defineProps({
  statement: {
    type: String,
    default: '',
  },
});
const mkit = new Markdown({ html: true });
// mkit.use(MarkdownItSanitizer);

const statementHtml = mkit.render(props.statement);
</script>

<template>
  <div class="statement markdown-file">
    <div v-dompurify-html="statementHtml"></div>
  </div>
</template>

<style lang="scss" scoped>
.statement {
  max-width: 1472px;
  margin: 0 auto;
  padding-top: 80px;
  padding-left: 16px;
  padding-right: 16px;
}
</style>
