<script setup>
import OButton from '@/components/OButton.vue';
import ODialog from '@/components/ODialog.vue';
import IconNecessary from '~icons/app/necessary.svg';
import { reactive, ref } from 'vue';
import { useUserInfoStore } from '@/stores';
import {
  getUserEmail,
  sendCode,
  bindUserEmail,
  changeUserEmail,
} from '@/api/api-user';
import { ElMessage } from 'element-plus';
import IconActivation from '~icons/app/activation.svg';

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
const scene = ref('change_email');
const time = ref(60);
const time2 = ref(60);
const isDisposed = ref(false);
const isDisposed2 = ref(false);
const regular = ref(true);
const ruleFormRef = ref(null);
const ruleForm = reactive({
  email: '',
  email_code: '',
  email_code2: '',
});

getUserEmail(userInfoStore.id).then((res) => {
  // if (res.data[0].email) {
  //   userInfoStore.email = res.data[0].email;
  //   userInfoStore.emailStatus = res.data[0].is_active;
  //   scene.value = 'change_email';
  // }
});

function setEmail(formEl) {
  if (!formEl) return;
  formEl.validateField('email', (vaild) => {
    if (vaild) {
      verify.value.show();
    }
  });
}
function verifySuccess(data) {
  sendCode({ email: ruleForm.email, capt: data.captchaVerification }).then(
    () => {
      isDisposed.value = true;
      handleTimeChange();
      regular.value = false;
    }
  );
}

function keepEmail(formEl) {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      if (userInfoStore.email) {
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
            }
          });
      }
    } else {
      console.error('error submit!');
      return false;
    }
  });
}
//倒计时
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

//更换邮箱
function togglePhoneDlg(flag) {
  if (flag === undefined) {
    showPhoneDlg.value = !showPhoneDlg.value;
  } else {
    showPhoneDlg.value = flag;
  }
}
const showPhoneDlg = ref(false);
const reRuleForm = reactive({
  email: '',
  code: '',
});
const reRuleFormRef = ref(null);
let qureyData = reactive({
  old_email: '',
  old_email_code: '',
  new_email: '',
  new_email_code: '',
});
function resetForm(formEl) {
  if (!formEl) return;
  formEl.resetFields();
  time.value = 0;
  qureyData.old_email = '';
  togglePhoneDlg(false);
}
function reSetEmail(formEl) {
  if (!formEl) return;
  formEl.validateField('email', (vaild) => {
    if (vaild) {
      sendCode({ email: reRuleForm.email, scene }).then(() => {
        isDisposed.value = true;
        handleTimeChange();
        // regular.value = false;
      });
    }
  });
}
function reKeepEmail(formEl) {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      if (!qureyData.old_email) {
        qureyData.old_email = reRuleForm.email;
        qureyData.old_email_code = reRuleForm.code;
        reRuleForm.email = '';
        reRuleForm.code = '';
        // isDisposed.value = false;
        time.value = time.value < 60 ? 0 : 60;
      } else {
        qureyData.new_email = reRuleForm.email;
        qureyData.new_email_code = reRuleForm.code;
        changeUserEmail(qureyData)
          .then((res) => {
            if (res.status === 200) {
              togglePhoneDlg(false);
              ElMessage({
                type: 'success',
                message: '修改成功',
              });

              userInfoStore.email = res.data.mobile;
            } else {
              togglePhoneDlg(false);
              ElMessage({
                type: 'error',
                message: res.msg,
              });
            }
          })
          .catch((err) => {
            ElMessage({ type: 'error', message: err.msg });
          });
      }
    }
  });
}
</script>

<template>
  <div v-if="userInfoStore.email" class="email-admin">
    <div class="current-email">{{ userInfoStore.email }}</div>
    <p class="email-tip">
      此邮箱为用户名登录账户，此邮箱将会接收账号相关的通知以及在密码重置中使用
    </p>
  </div>
  <!-- 邮箱激活 -->
  <!-- <div
    v-if="userInfoStore.email && !userInfoStore.emailStatus"
    class="setting-box add"
  >
    <div class="activation-tip">
      <o-icon><icon-activation></icon-activation></o-icon>
      <span class="font">该邮箱还未激活，点击获取验证码激活</span>
    </div>
    <el-form ref="FormRef" :model="Form" class="setting-content">
      <el-form-item
        class="email_code"
        prop="email_code"
        :rules="[
          { required: true, message: '必填项', trigger: 'blur' },
          {
            pattern: /^\d{4}$/,
            message: '验证码有误',
            trigger: 'blur',
          },
        ]"
      >
        <el-input
          v-model="Form.email_code"
          class="input"
          placeholder="请输入邮件中的验证码"
        ></el-input
        ><OButton class="setting-btn" size="small" @click="setEmail2">{{
          isDisposed2 ? `${time2}s` : '获取验证码'
        }}</OButton>
      </el-form-item>
      <OButton class="setting-btn" @click="keepEmail2(FormRef)">激活</OButton>
    </el-form>
  </div> -->
  <!-- 邮箱添加 -->
  <div v-if="!userInfoStore.email" class="setting-box add">
    <p class="setting-title">添加主要电子邮件地址</p>

    <el-form ref="ruleFormRef" class="setting-content" :model="ruleForm">
      <!-- 换绑邮箱新增 -->
      <!-- <el-form-item
        v-if="userInfoStore.emailStatus && userInfoStore.email"
        prop="email_code2"
        :rules="[
          { required: true, message: '必填项', trigger: 'blur' },
          {
            pattern: /^\d{4}$/,
            message: '验证码有误',
            trigger: 'blur',
          },
        ]"
      >
        <div>
          <div class="item item-text">当前邮箱认证</div>
          <div class="item">
            <el-input
              v-model="ruleForm.email_code2"
              placeholder="请输入当前邮箱中的验证码"
            ></el-input
            ><o-button
              size="small"
              :disabled="isDisposed2"
              @click="setEmail2"
              >{{ isDisposed2 ? `${time2}s` : '获取验证码' }}</o-button
            >
          </div>
          <div class="item item-text">新邮箱认证</div>
        </div>
      </el-form-item> -->
      <!-- 添加邮箱 -->
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
  <!-- 邮箱更换 -->
  <!-- <div
    v-if="userInfoStore.email && userInfoStore.emailStatus"
    class="setting-box"
  >
    <o-button class="setting-btn" @click="togglePhoneDlg(true)"
      >更换邮箱</o-button
    >
    <el-dialog
      v-model="showPhoneDlg"
      width="640px"
      :show-close="false"
      center
      align-center
    >
      <template #header="{ titleId, title }">
        <div :id="titleId" :class="title">更换邮箱地址</div>
      </template>
      <el-form ref="reRuleFormRef" :model="reRuleForm">
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
          <div class="requirement">
            <icon-necessary></icon-necessary><span>邮箱地址</span>
          </div>
          <el-input
            v-model="reRuleForm.email"
            :placeholder="
              !qureyData.old_email ? '请输入当前邮箱' : '请输入新邮箱'
            "
          ></el-input>
        </el-form-item>
        <el-form-item
          prop="code"
          :rules="[
            { required: true, message: '必填项', trigger: 'blur' },
            {
              pattern: /^\d{4}$/,
              message: '验证码有误',
              trigger: 'blur',
            },
          ]"
        >
          <div class="requirement">
            <icon-necessary></icon-necessary><span>验证码</span>
          </div>
          <div class="code">
            <el-input
              v-model="reRuleForm.code"
              placeholder="请输入邮箱验证码"
            ></el-input
            ><o-button
              :disabled="isDisposed"
              size="small"
              @click="reSetEmail(reRuleFormRef)"
              >{{ isDisposed ? `${time}s` : '获取验证码' }}</o-button
            >
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="btn-box" style="display: flex; justify-content: center">
          <o-button @click="resetForm(reRuleFormRef)">取消</o-button>
          <o-button type="primary" @click="reKeepEmail(reRuleFormRef)">
            {{ !qureyData.old_email ? `下一步` : '确认' }}
          </o-button>
        </div>
      </template>
    </el-dialog>
  </div> -->
  <Verify
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
/* .el-dialog {
  :deep(.el-form) {
    margin: 0 30px;
  }
  &-head {
    .dlg-title {
      text-align: center;
      font-size: 24px;
    }
  }
  .btn {
    display: flex;
    justify-content: center;
    .o-button {
      margin: 30px 12px 0;
    }
  }
} */

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
  // &:last-child {
  // margin-top: 94px;
  // }

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
:deep .el-form {
  .el-form-item {
    .el-form-item__content {
      .el-form-item__error {
        left: 435px;
      }
    }
  }
}
</style>
