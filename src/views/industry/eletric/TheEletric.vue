<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();

function goPath() {
  router.push('/industry/electric/case-1', 'blank');
}
</script>
<template>
  <div class="eletric">
    <p>电力专区</p>
    <br />
    <p @click="goPath">case-1</p>
  </div>
</template>

<style lang="scss" scoped>
$theme: #0d8dff;
.eletric {
  p {
    margin-top: 24px;
    font-size: 18px;
    cursor: pointer;
  }
}
</style>
