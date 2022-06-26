<script setup>
import IconMenu from '~icons/app/menu';

let i18n = {
  sortCondition: ['按照下载量排序', '按照首字母排序', '按照更新时间排序'],
};
const emit = defineEmits(['index']);
function onClick(index) {
  emit('index', index);
}
</script>

<template>
  <el-dropdown>
    <span class="el-dropdown-link">
      <o-icon><icon-menu></icon-menu></o-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="(item, index) in i18n.sortCondition"
          :key="item"
          @click="onClick(index)"
          >{{ item }}</el-dropdown-item
        >
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style lang="scss" scoped>
.o-icon {
  cursor: pointer;
  margin-left: 24px;
  font-size: 24px;
}
.el-dropdown-menu {
  border: 1px solid black;
  :deep(.el-dropdown-menu__item) {
    &:hover {
      background-color: #e5e8f0;
      color: black;
    }
  }
}
.el-dropdown__popper {
  :deep(.el-popper__arrow) {
    visibility: hidden !important;
  }
}
</style>
