<script setup>
import { ref } from 'vue';
import IconEmpty from '~icons/app/model-card-empty';
import IconDataset from '~icons/app/dataset';
import IconProject from '~icons/app/project';

const prop = defineProps({
  relateName: {
    type: String,
    default: '',
  },
});
const relName = ref('');
const isShow1 = ref(false);
const isShow2 = ref(false);
const isShow3 = ref(false);

switch (prop.relateName) {
  case 'model':
    relName.value = '模型';
    isShow1.value = true;
    break;
  case 'project':
    relName.value = '项目';
    isShow2.value = true;
    break;
  case 'dataset':
    relName.value = '数据集';
    isShow3.value = true;
    break;
}
</script>
<template>
  <div class="no-data-box">
    <o-icon v-if="isShow1"><icon-empty></icon-empty></o-icon>
    <o-icon v-if="isShow3"><icon-dataset></icon-dataset></o-icon>
    <o-icon v-if="isShow2"><icon-project></icon-project></o-icon>
    暂未添加相关{{ relName }}
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