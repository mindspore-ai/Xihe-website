<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import { ArrowRight } from '@element-plus/icons-vue';

const route = useRoute();

const currentPage = computed(() => {
  return route.name === 'textDetectorIntroduce'
    ? 'AI文本检测器'
    : 'AI文本检测器在线体验';
});
</script>
<template>
  <div class="text-detector">
    <div class="bread">
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/modelzoo' }"
          >大模型</el-breadcrumb-item
        >
        <el-breadcrumb-item>{{ currentPage }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <router-view></router-view>
  </div>
</template>
<style lang="scss" scoped>
.text-detector {
  max-width: 1416px;
  margin: 0 auto;
  padding: 80px 0 64px 0;
  @media screen and (max-width: 820px) {
    padding: 48px 16px 32px 16px;
  }
}
.bread {
  margin: 40px 0;
  @media screen and (max-width: 820px) {
    margin: 16px 0;
  }
}
</style>
