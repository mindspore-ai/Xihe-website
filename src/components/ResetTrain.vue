<script setup>
import { ref, reactive, watch } from 'vue';

import warningImg from '@/assets/icons/warning.png';

const deleteCondition = reactive({
  title: '删除项目',
  describe:
    '确认是否重建此训练实例，此操作会在原来的配置基础上再创建一份训练实例。',
  btnText: '删除',
  cancel: '取消',
  confirm: '确认',
});

const prop = defineProps({
  showReset: {
    type: Boolean,
    default: false,
  },
  trainId: {
    type: String,
    default: '',
  },
});

const stopShow = ref();
const emit = defineEmits(['on-click']);

function confirmReset() {
  stopShow.value = false;
  emit('on-click', prop.trainId);
}

function concelClick() {
  emit('on-click', 1);
}

watch(
  () => prop.showReset,
  (newValue, oldValue) => {
    stopShow.value = newValue;
  }
);
</script>
<template>
  <o-dialog :show="stopShow" :close="false">
    <template #head>
      <div
        class="dlg-title"
        :style="{ textAlign: 'center', paddingTop: '40px' }"
      >
        <img :src="warningImg" alt="" />
      </div>
    </template>
    <div
      class="dlg-body"
      :style="{
        padding: '8px 0 30px',
        fontSize: '18px',
        textAlign: 'center',
        width: '640px',
      }"
    >
      {{ deleteCondition.describe }}
    </div>
    <template #foot>
      <div
        class="dlg-actions"
        :style="{
          display: 'flex',
          justifyContent: 'center',
          paddingBottom: '56px',
        }"
      >
        <o-button :style="{ marginRight: '24px' }" @click="concelClick">{{
          deleteCondition.cancel
        }}</o-button>
        <o-button type="primary" @click="confirmReset">{{
          deleteCondition.confirm
        }}</o-button>
      </div>
    </template>
  </o-dialog>
</template>
<style lang="scss" scoped></style>
