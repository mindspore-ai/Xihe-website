<script setup>
import { useAttrs } from 'vue';

defineProps({
  tagColor: {
    type: String,
    default: '',
  },
});

const attrs = useAttrs();
</script>
<template>
  <el-tag v-bind="attrs"><slot></slot></el-tag>
</template>
<style lang="scss">
.el-tag {
  --o-tag-font_size: 12px;
  --o-tag-line_height: 18px;
}
</style>
<style lang="scss">
.el-tag {
  border: none;
  --el-tag-hover-color: none;
  padding: 4px 12px;
  font-size: var(--o-tag-font_size);
  line-height: var(--o-tag-line_height);
}
.el-tag__content {
  color: v-bind(tagColor);
}
.el-tag .el-tag__close {
  color: v-bind(tagColor);
  &:hover {
    color: v-bind(tagColor);
    background-color: none;
  }
}
</style>
