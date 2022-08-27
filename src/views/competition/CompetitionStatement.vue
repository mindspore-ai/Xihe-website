<script setup>
import { ref } from 'vue';
import OButton from '@/components/OButton.vue';

const textarea = ref('');
const agree = ref(false);
// const active = ref(1);
const i18n = {
  statement: '比赛协议',
  agree: '已阅读并同意该声明',
  next: '下一步',
};

const emit = defineEmits(['handleStep']);
function goNextStep() {
  emit('handleStep');
}
</script>
<template>
  <!-- 法律声明 -->
  <div class="statement">
    <div class="statement-title">{{ i18n.statement }}</div>
    <el-input id="txt" v-model="textarea" type="textarea" readonly />
    <div class="nextBtn">
      <o-button v-if="!agree" disabled type="secondary">{{
        i18n.next
      }}</o-button>
      <o-button v-else type="primary" @click="goNextStep">{{
        i18n.next
      }}</o-button>
    </div>
    <div class="isAgree">
      <input v-model="agree" type="checkbox" />
      <span @click="agree = !agree">{{ i18n.agree }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// 法律声明
.statement {
  &-title {
    height: 32px;
    line-height: 32px;
    font-size: 24px;
    color: #000000;
    margin: 48px 0 24px;
  }
  :deep(.el-textarea) {
    width: 100% !important;
    height: 100%;
    .el-textarea__inner {
      min-height: 500px !important;
      // min-height: 865px !important;
      height: 100%;
    }
  }
  .isAgree {
    line-height: 22px;
    display: flex;
    justify-content: center;
    align-items: center;
    input {
      width: 16px;
      height: 16px;
    }
    span {
      font-size: 14px;
      margin-left: 8px;
      color: #000;
      cursor: pointer;
    }
  }
  .nextBtn {
    margin-top: 40px;
    margin-bottom: 17px;
    display: flex;
    justify-content: center;
  }
}
</style>
