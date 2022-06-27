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
console.log(prop.delRelate);
// let id = prop.trainId;
// // console.log(id);

const isShow = ref();
const emit = defineEmits(['comfirm', 'concel']);

function confirmDel() {
  emit('comfirm');
  console.log(123);
}
function concelClick() {
  emit('concel');
}

watch(
  () => prop.delRelate,
  (newValue, oldValue) => {
    isShow.value = newValue;
  }
);
</script>
<template>
  <o-dialog :show="isShow" :close="false">
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
        <o-button type="primary" @click="confirmDel">{{
          deleteCondition.confirm
        }}</o-button>
      </div>
    </template>
  </o-dialog>
</template>
<style lang="scss" scoped></style>
