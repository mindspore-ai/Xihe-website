<script setup>
import { reactive, defineExpose } from 'vue';
const environmentData = reactive({
  key: '',
  value: '',
});
defineExpose({ environmentData });
</script>
<template>
  <div class="environment-params">
    <el-input v-model="environmentData.key" placeholder="key" />
    <span>=</span>
    <el-input v-model="environmentData.value" placeholder="value" />
  </div>
</template>
<style lang="scss" scoped>
.environment-params {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  span {
    margin-left: 8px;
    margin-right: 8px;
  }
}
</style>
