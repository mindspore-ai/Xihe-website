<script setup>
import { ref, reactive, watch } from 'vue';

import warningImg from '@/assets/icons/warning.png';

const deleteCondition = reactive({
  title: '删除项目',
  describe1: '确认是否将此训练实例删除，注意此操作不可逆。',
  describe2: '确认是否将此微调任务删除，注意此操作不可逆。',
  btnText: '删除',
  cancel: '取消',
  confirm: '确认',
});

const prop = defineProps({
  showDel: {
    type: Boolean,
    default: false,
  },
  listId: {
    type: String,
    default: '',
  },
  displayType: {
    type: String,
    default: '',
  },
});

const id = ref(null);
const isShow = ref(false);
const emit = defineEmits(['click']);

function confirmDel() {
  emit('click', id.value);
}
function cancelClick() {
  emit('click', 2);
}

watch(
  () => prop.showDel,
  (oldValue) => {
    isShow.value = oldValue;
  }
);
watch(
  () => prop.listId,
  (newValue) => {
    id.value = newValue;
  }
);
</script>
<template>
  <o-dialog :show="isShow" :close="false">
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
        <o-button type="primary" @click="confirmDel">
          {{ deleteCondition.confirm }}
        </o-button>
      </div>
    </template>
  </o-dialog>
</template>
<style lang="scss" scoped></style>
