<script setup>
import { ref } from 'vue';

import writeToClipboard from '@/shared/hooks/writeToClipboard.js';
import { useUserInfoStore } from '@/stores';

import successIcon from '@/assets/icons/success.png';

const DOMAIN = import.meta.env.VITE_DOMAIN;
const userInfoStore = useUserInfoStore();

const invitationUrl = ref(
  `https://${DOMAIN}/?invited=${userInfoStore.userName}`
);

const invitationInput = ref(null);
const showDlg = ref(false);
const invitedNum = parseInt(userInfoStore.bonus / 10);
const toggleDlg = (flag) => {
  showDlg.value = flag;
};

const handleCopy = async () => {
  try {
    await writeToClipboard(invitationUrl.value);
    toggleDlg(true);
  } catch (e) {
    return e;
  }
};
</script>

<template>
  <div class="setting-box">
    <p class="settin-title">我的专属邀请链接</p>
    <div class="setting-content">
      <el-input
        ref="invitationInput"
        v-model="invitationUrl"
        disabled
      ></el-input>
      <OButton type="text" size="small" class="copy-btn" @click="handleCopy"
        >复制</OButton
      >
    </div>
  </div>
  <div class="setting-box">
    <p class="settin-title">
      成功邀请：<span class="setting-title-tip"
        >被邀请用户成功注册后计入邀请成功人数</span
      >
    </p>
    <div class="setting-content">
      <span class="invited-num">{{ invitedNum }}</span>
      <span class="invited-unit">人</span>
    </div>
  </div>

  <ODialog :show="showDlg" :close="false">
    <div class="dlg-body">
      <img
        :src="successIcon"
        :style="{ width: '48px', height: '48px', marginBottom: '32px' }"
      />
      <p class="tip-content">
        复制成功，分享链接给好友并成功注册，即有机会赢取万元京东卡
      </p>

      <OButton type="primary" size="small" @click="toggleDlg(fasle)"
        >确定</OButton
      >
    </div>
  </ODialog>
</template>

<style lang="scss" scoped>
.setting-box {
  margin-top: 24px;

  .setting-title {
    height: 24px;
    font-size: 18px;
    font-weight: normal;
    color: #000000;
    line-height: 24px;

    &-tip {
      height: 24px;
      font-size: 14px;
      font-weight: normal;
      color: #555555;
      line-height: 24px;
    }
  }

  .setting-content {
    margin-top: 16px;
    .invited-num {
      height: 48px;
      font-size: 36px;
      font-weight: normal;
      color: #000000;
      line-height: 48px;
    }

    .invited-unit {
      height: 48px;
      font-size: 14px;
      font-weight: normal;
      color: #555555;
      line-height: 48px;
    }
  }

  .copy-btn {
    margin-left: 8px;
  }
}

.dlg-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .tip-content {
    height: 28px;
    font-size: 18px;
    font-weight: normal;
    color: #555555;
    line-height: 28px;
    margin-bottom: 60px;
  }
}
</style>
