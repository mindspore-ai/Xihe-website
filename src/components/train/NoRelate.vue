<script setup>
import IconEmpty from '~icons/app/model-card-empty';
import IconDataset from '~icons/app/dataset';
import IconProject from '~icons/app/project';

const prop = defineProps({
  relateName: {
    type: String,
    default: '',
  },
});

const data = {
  model: {
    name: '模型',
    icon: IconEmpty,
  },
  project: {
    name: '项目',
    icon: IconProject,
  },
  dataset: {
    name: '数据集',
    icon: IconDataset,
  },
};
</script>
<template>
  <div class="no-data-box">
    <o-icon
      ><component :is="data[`${prop.relateName}`].icon"></component
    ></o-icon>

    暂无相关{{ data[`${prop.relateName}`].name }}
  </div>
</template>
<style lang="scss" scoped>
.no-data-box {
  width: 100%;
  height: 104px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  color: #999;
  .o-icon {
    margin-right: 8px;
    font-size: 32px;
  }
}
</style>
