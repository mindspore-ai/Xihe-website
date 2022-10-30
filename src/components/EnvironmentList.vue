<script setup>
import IconNecessary from '~icons/app/necessary.svg';
import { reactive, defineExpose } from 'vue';
const environmentData = reactive({
  key: '',
  value: '',
});
defineExpose({ environmentData });
</script>
<template>
  <div class="hyper-params">
    <el-input v-model="environmentData.key" placeholder="请输入用户名" />
    <span>=</span>
    <el-input v-model="environmentData.value" placeholder="请输入用户名" />
  </div>
</template>
<style lang="scss" scoped>
.hyper-params {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  span {
    margin-left: 8px;
    margin-right: 8px;
  }
}
</style>
