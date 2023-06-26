<script setup>
import { ref, reactive, watch, defineProps, defineEmits } from 'vue';

import warningImg from '@/assets/icons/warning.png';

const deleteCondition = reactive({
  title: '删除项目',
  describe1: '确认是否将此训练实例终止，终止后将无法复原。',
  describe2: '确认是否将此微调任务终止，终止后将无法复原。',
  btnText: '删除',
  cancel: '取消',
  confirm: '确认',
});

const prop = defineProps({
  showStop: {
    type: Boolean,
    default: false,
  },
  trainId: {
    type: String,
    default: '',
  },
  displayType: {
    type: String,
    default: '',
  },
});

const stopShow = ref(false);
const emit = defineEmits(['click']);

function confirmStop() {
  stopShow.value = false;
  emit('click', prop.trainId);
}

function cancelClick() {
  emit('click', 1);
}

watch(
  () => prop.showStop,
  (newValue) => {
    stopShow.value = newValue;
  }
);
</script>
<template>
  <o-dialog :show="stopShow" :close="false">
    <template #head>
      <div class="dlg-title" :style="{ textAlign: 'center' }">
        <img :src="warningImg" alt="" />
      </div>
    </template>
    <div
      class="dlg-body"
      :style="{
        fontSize: '18px',
        textAlign: 'center',
        width: '100%',
      }"
    >
      <span v-if="displayType === 'train'">
        {{ deleteCondition.describe1 }}
      </span>
      <span v-if="displayType === 'finetune'">
        {{ deleteCondition.describe2 }}
      </span>
    </div>
    <template #foot>
      <div
        class="dlg-actions"
        :style="{
          display: 'flex',
          justifyContent: 'center',
          paddingBottom: '16px',
        }"
      >
        <o-button :style="{ marginRight: '16px' }" @click="cancelClick">
          {{ deleteCondition.cancel }}
        </o-button>
        <o-button type="primary" @click="confirmStop">
          {{ deleteCondition.confirm }}
        </o-button>
      </div>
    </template>
  </o-dialog>
</template>
<style lang="scss" scoped></style>
