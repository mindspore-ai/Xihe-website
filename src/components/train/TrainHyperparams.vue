<script setup>
import { reactive, defineExpose } from 'vue';
const hyperparamsData = reactive({
  key: '',
  value: '',
});
defineExpose({ hyperparamsData });
</script>
<template>
  <div class="hyper-params">
    <el-input v-model="hyperparamsData.key" placeholder="key" />
    <span>=</span>
    <el-input v-model="hyperparamsData.value" placeholder="value" />
  </div>
</template>
<style lang="scss" scoped>
.hyper-params {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  span {
    margin-left: 8px;
    margin-right: 8px;
  }
}
</style>
