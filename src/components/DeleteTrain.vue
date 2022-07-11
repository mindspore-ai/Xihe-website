<script setup>
import { ref, reactive, watch } from 'vue';

import warningImg from '@/assets/icons/warning.png';

const deleteCondition = reactive({
  title: '删除项目',
  describe: '确认是否将此训练实例删除，注意此操作不可逆。',
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
});
const id = ref();
const isShow = ref();
const emit = defineEmits(['click']);

function confirmDel() {
  emit('click', id.value);
}
function cancelClick() {
  emit('click', 2);
}

watch(
  () => prop.showDel,
  (oldValue, newValue) => {
    isShow.value = oldValue;
  }
);
watch(
  () => prop.listId,
  (newValue, oldValue) => {
    id.value = newValue;
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
        <o-button :style="{ marginRight: '24px' }" @click="cancelClick">{{
          deleteCondition.cancel
        }}</o-button>
        <o-button type="primary" @click="confirmDel">{{
          deleteCondition.confirm
        }}</o-button>
      </div>
    </template>
  </o-dialog>

  <!-- <div> -->
  <!-- <o-dialog :show="true">
      <template #head>
        <div
          class="dlg-title"
          :style="{ textAlign: 'center', paddingTop: '40px' }"
        >
          <img :src="successImg" alt="" />
        </div>
      </template>
      <div
        class="dlg-body"
        :style="{
          fontSize: '18px',
          textAlign: 'center',
          width: '640px',
        }"
      >
        {{ deleteCondition.describe2 }}
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
          <router-link :to="{ path: `/${userInfoStore.userName}` }">
            <o-button primary>{{ deleteCondition.confirm }}</o-button>
          </router-link>
        </div>
      </template>
    </o-dialog> -->
  <!-- </div> -->
</template>
<style lang="scss" scoped>
</style>
