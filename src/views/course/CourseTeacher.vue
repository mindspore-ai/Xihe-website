<script setup>
import { ref } from 'vue';
import { handleMarkdown } from '@/shared/markdown';
import { useCourseData } from '@/stores';
import { getGuide } from '@/api/api-competition';

const userCourseData = useCourseData();
const mkit = handleMarkdown();
const codeString = ref('');
const result = ref();
let README = '';
getGuide(userCourseData.courseData.teacher)
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
  <div v-dompurify-html="result" class="markdown-file"></div>
</template>

<style lang="scss" scoped>
.markdown-file {
  padding: 40px;
}
</style>
