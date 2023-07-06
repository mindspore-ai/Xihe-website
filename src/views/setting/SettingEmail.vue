<script setup>
import OButton from '@/components/OButton.vue';

import { reactive, ref } from 'vue';
import { useUserInfoStore } from '@/stores';
import { sendCode, bindUserEmail } from '@/api/api-user';
import { ElMessage } from 'element-plus';

import IconCancel from '~icons/app/eye-close';
import IconArrow from '~icons/app/eye-open';

import Verify from '@/shared/verifition/Verify.vue';
const verify = ref();
function getVerifyImgSize() {
  let width = 400;
  const height = 200;
  const innerWidth = window.innerWidth;
  if (innerWidth - 28 < 400) {
    width = innerWidth - 30;
  }
  return {
    width: width + 'px',
    height: height + 'px',
  };
}

const userInfoStore = useUserInfoStore();

const time = ref(60);

const isDisposed = ref(false);

const regular = ref(true);
const ruleFormRef = ref(null);
const ruleForm = reactive({
  email: '',
  email_code: '',
  email_code2: '',
});

function setEmail(formEl) {
  if (!formEl) return;
  formEl.validateField('email', (vaild) => {
    if (vaild) {
      verify.value.show();
    } else {
      return false;
    }
  });
}
// 倒计时
const handleTimeChange = () => {
  if (time.value <= 0) {
    isDisposed.value = false;
    time.value = 60;
  } else {
    setTimeout(() => {
      time.value--;
      handleTimeChange();
    }, 1000);
  }
};
function verifySuccess(data) {
  sendCode({ email: ruleForm.email, capt: data.captchaVerification })
    .then(() => {
      isDisposed.value = true;
      handleTimeChange();
      regular.value = false;
    })
    .catch((err) => {
      if (err.code === 'email_email_duplicate_send') {
        ElMessage({
          type: 'error',
          message: '该邮箱1分钟内已收到过验证码，请稍后再试',
        });
      } else if (err.code === 'email_user_duplicate_send') {
        ElMessage({
          type: 'error',
          message: '您1分钟内已发送过验证码，请耐心等待',
        });
      }
    });
}

function keepEmail(formEl) {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      let qurey = {
        email: ruleForm.email,
        code: ruleForm.email_code,
      };
      bindUserEmail(qurey)
        .then(() => {
          ElMessage({
            type: 'success',
            message: '绑定成功',
          });
          userInfoStore.email = ruleForm.email;
        })
        .catch((err) => {
          if (err?.response?.data?.code === 'user_no_userid') {
            ElMessage({
              type: 'error',
              message: '绑定失败，请重新登录后再试',
            });
          } else if (
            err?.response?.data?.code === 'email_email_duplicate_bind'
          ) {
            ElMessage({
              type: 'error',
              message: '该邮箱已被绑定，请换一个邮箱重试',
            });
          } else if (err?.response?.data?.code === 'email_code_error') {
            ElMessage({
              type: 'error',
              message: '验证码错误',
            });
          } else if (
            err?.response?.data?.code === 'email_user_duplicate_bind'
          ) {
            ElMessage({
              type: 'error',
              message: '您已绑定过邮箱',
            });
          }
        });
    } else {
      return false;
    }
  });
}

const isVisibel = ref(false);
function toggleVisible(val) {
  isVisibel.value = val;
}
</script>

<template>
  <div v-if="userInfoStore.email" class="email-admin">
    <div class="current-email" :class="{ invisible: !isVisibel }">
      {{ isVisibel ? userInfoStore.email : '··········' }}
      <o-icon v-if="isVisibel" @click="toggleVisible(false)"
        ><icon-arrow></icon-arrow
      ></o-icon>
      <o-icon v-else @click="toggleVisible(true)"
        ><icon-cancel></icon-cancel
      ></o-icon>
    </div>
    <div class="email-tip">
      此邮箱为用户名登录账户，此邮箱将会接收账号相关的通知以及在密码重置中使用
    </div>
  </div>
  <div v-if="!userInfoStore.email" class="setting-box add">
    <p class="setting-title">添加主要电子邮件地址</p>

    <el-form ref="ruleFormRef" class="setting-content" :model="ruleForm">
      <el-form-item
        prop="email"
        :rules="[
          {
            pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
            message: '请输入正确的邮箱',
            trigger: 'blur',
          },
          { required: true, message: '必填项', trigger: 'blur' },
        ]"
      >
        <el-input
          v-model="ruleForm.email"
          :placeholder="`请输入${userInfoStore.email ? '' : '新的'}邮箱地址`"
          class="setting-input"
        ></el-input>
      </el-form-item>
      <!-- <p class="setting-tip">可对主要电子邮箱地址进行更改，需在新邮箱</p> -->
      <el-form-item
        class="email_code"
        prop="email_code"
        :rules="[
          { required: true, message: '必填项', trigger: 'blur' },
          {
            pattern: /^\d{6}$/,
            message: '请输入6位验证码',
            trigger: 'blur',
          },
        ]"
      >
        <el-input
          v-model="ruleForm.email_code"
          placeholder="请输入邮件中的验证码"
        ></el-input>
        <OButton
          class="setting-btn"
          size="small"
          :disabled="isDisposed"
          @click="setEmail(ruleFormRef)"
          >{{ isDisposed ? `${time}s` : '获取验证码' }}</OButton
        >
      </el-form-item>
      <OButton class="setting-btn" @click="keepEmail(ruleFormRef)"
        >保存更改</OButton
      >
    </el-form>
  </div>
  <Verify
    v-if="!userInfoStore.email"
    ref="verify"
    mode="pop"
    captcha-type="blockPuzzle"
    :img-size="getVerifyImgSize()"
    @success="verifySuccess"
  ></Verify>
</template>

<style lang="scss" scoped>
.add {
  .el-form {
    width: 400px;
  }
}
.el-form {
  width: 520px;
  // margin: 0 50px;
  .el-form-item {
    :deep(.el-form-item__content) {
      justify-content: space-between;
      .code {
        width: 400px;
        .el-input {
          width: 240px;
        }
        .o-button {
          margin-left: 8px;
          min-width: 152px;
        }
      }
      .el-form-item__error {
        left: calc(100% + 15px);
      }
    }
  }
}

.email-admin {
  width: 800px;
  height: 108px;
  padding: 24px 0 24px 19px;
  background: rgba(13, 141, 255, 0.03);
  border: 1px solid #d8d8d8;
  border-radius: 16px;
  .current-email {
    height: 24px;
    line-height: 24px;
    font-size: 18px;
    color: #000000;
    margin-bottom: 16px;
    .o-icon {
      height: 20px;
      display: inline-block;
      color: #555;
      cursor: pointer;
    }
  }
  .invisible {
    font-weight: bolder;
  }
  .email-tip {
    height: 22px;
    line-height: 22px;
    font-size: 14px;
    color: #555555;
  }
}
.setting-box {
  .item + .item {
    margin-top: 16px;

    .el-input {
      width: 254px;
    }
    .o-button {
      margin-left: 8px;
      min-width: 138px;
    }
  }
  .item-text {
    font-size: 14px;
    color: #555555;
    line-height: 22px;
  }
  .activation-tip {
    display: flex;
    align-items: center;

    .o-icon {
      font-size: 24px;
    }
    .font {
      margin-left: 8px;
      font-size: 14px;
    }
  }

  margin-top: 24px;
  .setting-title {
    height: 24px;
    font-size: 18px;
    font-weight: normal;
    color: #000000;
    line-height: 24px;
  }
  .setting-content {
    margin-top: 16px;
    .email_code {
      .setting-btn {
        margin-left: 8px;
      }
      display: flex;
      margin-bottom: 18px;
      .el-input {
        width: 254px;
      }
      .o-button {
        margin-left: 8px;
        min-width: 138px;
      }
    }
    .setting-tip {
      margin-top: 8px;
      font-size: 14px;
      font-weight: normal;
      color: #999999;
      line-height: 22px;
    }
    .el-form-item {
      .setting-btn {
        margin-left: 8px;
      }
    }
  }
}
:deep(.el-form) {
  .el-form-item {
    .el-form-item__content {
      .el-form-item__error {
        left: 435px;
      }
    }
  }
}
</style>
