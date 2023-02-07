<script setup>
import { ref, reactive, watch } from 'vue';

import warningImg from '@/assets/icons/warning.png';

const deleteCondition = reactive({
  title: '删除项目',
  describe: '确认删除相关数据集？删除后你可通过点击“添加相关数据集"再次添加。',
  describe1: '确认删除相关模型？删除后你可通过点击“添加相关模型"再次添加。',
  btnText: '删除',
  cancel: '取消',
  confirm: '确认',
});

const prop = defineProps({
  delRelate: {
    type: Boolean,
    default: false,
  },
  //   trainId: {
  //     type: String,
  //     default: '',
  //   },
});

const isShow = ref(false);
const emit = defineEmits(['confirm', 'cancel']);

function confirmDel() {
  emit('confirm');
}
function cancelClick() {
  emit('cancel');
}

watch(
  () => prop.delRelate,
  (newValue) => {
    isShow.value = newValue;
  }
);
</script>
<template>
  <el-dialog
    v-model="isShow"
    width="640px"
    :show-close="false"
    center
    align-center
  >
    <template #header="{ titleId, title }">
      <div :id="titleId" :class="title">
        <img :src="warningImg" alt="" />
      </div>
    </template>
    <div
      class="dlg-body"
      style="
        color: #555;
        font-size: 18px;
        text-align: center;
        line-height: 28px;
      "
    >
      {{ deleteCondition.describe }}
    </div>
    <template #foot>
      <div class="dlg-actions" style="display: flex; justify-content: center">
        <o-button style="margin-right: 16px" @click="cancelClick">
          {{ deleteCondition.cancel }}
        </o-button>
        <o-button type="primary" @click="confirmDel">
          {{ deleteCondition.confirm }}
        </o-button>
      </div>
    </template>
  </el-dialog>
</template>
<style lang="scss" scoped></style>
