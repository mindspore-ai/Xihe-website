<script setup>
import { ref, defineEmits } from 'vue';
import OButton from '@/components/OButton.vue';
import agreement from '@/assets/statement/competition_agreement.md?raw';
import MdStatement from '@/components/MdStatement.vue';

const agree = ref(false);
const i18n = {
  statement: '比赛协议',
  agree: '已阅读并同意该声明',
  next: '下一步',
};

const emit = defineEmits(['go-next-step']);
function goNextStep() {
  emit('go-next-step');
}
</script>
<template>
  <!-- 比赛协议 -->
  <div class="statement">
    <div class="statement-title">{{ i18n.statement }}</div>
    <div class="statement-detail">
      <MdStatement :statement="agreement"></MdStatement>
    </div>
    <div class="nextBtn">
      <o-button v-if="!agree" size="small" disabled type="secondary">
        {{ i18n.next }}
      </o-button>
      <o-button v-else type="primary" size="small" @click="goNextStep">
        {{ i18n.next }}
      </o-button>
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
  &-detail {
    height: 520px;
    padding: 10px;
    overflow-x: auto;
    border: 1px solid #999;
    .statement,
    .markdown-file {
      padding-top: 0px;
    }
  }
  :deep(.statement-detail) {
    border-radius: 16px;
    &::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 3px;
      background-color: #d8d8d8;
      background-clip: content-box;
    }

    &::-webkit-scrollbar-track {
      border-radius: 16px;
      box-shadow: inset 0 0 2px rgba($color: #000000, $alpha: 0.2);
      background: #ffffff;
      margin: 8px 0px;
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
