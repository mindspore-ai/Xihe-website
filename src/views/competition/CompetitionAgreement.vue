<script setup>
import agreement from '@/assets/statement/competition_agreement.md?raw';
import MdStatement from '@/components/MdStatement.vue';

import { onUpdated } from 'vue';

const TypeSet = async function (elements) {
  if (!window.MathJax) {
    return;
  }
  window.MathJax.startup.promise = window.MathJax.startup.promise
    .then(() => {
      return window.MathJax.typesetPromise(elements);
    })
    .catch((err) => console.log('Typeset failed: ' + err.message));
  return window.MathJax.startup.promise;
};
onUpdated(() => {
  const a = document.querySelectorAll('p');
  TypeSet(a);
});
</script>
<template>
  <div class="agreement">
    <MdStatement :statement="agreement"></MdStatement>
  </div>
</template>

<style lang="scss" scoped>
.agreement {
  padding: 0 48px;
}
:deep(.statement) {
  padding-top: 0 !important;
}
</style>
