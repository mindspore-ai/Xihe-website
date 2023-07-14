<script setup>
import { ref, reactive } from 'vue';
import { useUserInfoStore } from '@/stores';

import { setUserPhone, keepUserPhone, changeUserPhone } from '@/api/api-user';
import { getGitlabToken, refreshGitlabToken } from '@/api/api-gitlab';

import writeToClipboard from '@/shared/hooks/writeToClipboard.js';

import OButton from '@/components/OButton.vue';
import ODialog from '@/components/ODialog.vue';
import OIcon from '@/components/OIcon.vue';

import IconNecessary from '~icons/app/necessary.svg';
import IconCopy from '~icons/app/copy-nickname';
import { ElMessage } from 'element-plus';

const gitlabToken = ref('');
const isDisposed = ref(false);

// 绑定手机号
const showPhoneDlg = ref(false);
const ruleFormRef = ref(null);
const ruleForm = reactive({
  phone: '',
  code: '',
});

const handleCopy = async () => {
  try {
    await writeToClipboard(gitlabToken.value);
    ElMessage({
      type: 'success',
      message: '复制成功',
    });
  } catch (e) {
    return e;
  }
};

function togglePhoneDlg(flag) {
  if (flag === undefined) {
    showPhoneDlg.value = !showPhoneDlg.value;
  } else {
    showPhoneDlg.value = flag;
  }
}
getGitlabToken().then((res) => {
  gitlabToken.value = res?.data?.token;
});
// 获取手机号
const userInfoStore = useUserInfoStore();
const phoneExhibition = ref('');

// 倒计时
const time = ref(60);
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
// 获取验证码
function setPhone(formEl) {
  if (!formEl) return;
  formEl.validateField('phone', (vaild) => {
    if (vaild) {
      setUserPhone(ruleForm.phone).then(() => {
        isDisposed.value = true;
        handleTimeChange();
      });
    }
  });
}
// 确认绑定手机号码
const newQuery = reactive({
  old_mobile: '',
  old_mobile_code: '',
  new_mobile: '',
  new_mobile_code: '',
});
function keepPhone(formEl) {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      let query = { mobile: ruleForm.phone, sms_code: ruleForm.code };
      if (!userInfoStore.phone) {
        keepUserPhone(query)
          .then((res) => {
            if (res.status === 200) {
              ElMessage({
                type: 'success',
                message: res.msg,
              });
              togglePhoneDlg(false);
              userInfoStore.phone = res.data.mobile;
              phoneExhibition.value =
                res.data.slice(0, 3) + '****' + res.data.slice(7);
            } else {
              ElMessage({
                type: 'error',
                message: res.msg,
              });
            }
          })
          .catch((err) => {
            ElMessage({ type: 'error', message: err.msg });
          });
      } else if (!newQuery.old_mobile) {
        newQuery.old_mobile = ruleForm.phone;
        newQuery.old_mobile_code = ruleForm.code;
        ruleForm.phone = '';
        ruleForm.code = '';
        isDisposed.value = false;
        time.value = time.value < 60 ? 0 : 60;
      } else {
        newQuery.new_mobile = ruleForm.phone;
        newQuery.new_mobile_code = ruleForm.code;
        changeUserPhone(newQuery)
          .then((res) => {
            if (res.status === 200) {
              ElMessage({
                type: 'success',
                message: res.msg,
              });
              togglePhoneDlg(false);
              userInfoStore.phone = res.data.mobile;
              phoneExhibition.value =
                res.data.slice(0, 3) + '****' + res.data.slice(7);
            } else {
              ElMessage({
                type: 'error',
                message: res.msg,
              });
              togglePhoneDlg(false);
            }
          })
          .catch((err) => {
            ElMessage({ type: 'error', message: err.msg });
          });
      }
    } else {
      return false;
    }
  });
}
function resetForm(formEl) {
  if (!formEl) return;
  formEl.resetFields();
  time.value = 0;
  togglePhoneDlg(false);
}
// token框聚焦的时候失焦
const tokenInput = ref(null);
function disabled() {
  tokenInput.value.blur();
}
function refresh() {
  refreshGitlabToken().then((res) => {
    gitlabToken.value = res?.data?.token;
  });
}
</script>

<template>
  <div class="setting-box">
    <p class="setting-title">用户名</p>
    <div class="setting-content">
      <el-input
        v-model="userInfoStore.userName"
        disabled
        class="setting-input"
      ></el-input>
      <p class="setting-tip">用户名不可修改</p>
    </div>
  </div>
  <div class="setting-box">
    <p class="setting-title">TOKEN</p>
    <div class="setting-content">
      <div class="inline-content">
        <el-input
          ref="tokenInput"
          v-model="gitlabToken"
          type="password"
          show-password
          class="setting-input"
          @focus="disabled"
        ></el-input>
        <o-icon class="icon-copy" @click="handleCopy"
          ><icon-copy></icon-copy
        ></o-icon>
      </div>
    </div>
    <o-button size="small" @click="refresh">刷新TOKEN</o-button>
  </div>
  <div class="setting-box">
    <div v-if="userInfoStore.phone" class="setting-content">
      <el-input v-model="phoneExhibition" disabled></el-input>
    </div>
    <div class="setting-content">
      <ODialog
        :show="showPhoneDlg"
        :close="false"
        @close-click="togglePhoneDlg(false)"
      >
        <template #head>
          <p class="dlg-title">
            {{ userInfoStore.phone ? '更换' : '绑定' }}手机号码
          </p>
        </template>
        <div class="dlg-body">
          <el-form ref="ruleFormRef" :model="ruleForm">
            <el-form-item
              class="dlg-body-list"
              prop="phone"
              :rules="[
                { required: true, message: '必填项', trigger: 'blur' },
                {
                  pattern:
                    /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/,
                  message: '格式不正确',
                  trigger: 'blur',
                },
              ]"
            >
              <div class="requirement">
                <icon-necessary></icon-necessary><span>手机号码</span>
              </div>
              <el-input
                v-model="ruleForm.phone"
                :placeholder="
                  !userInfoStore.phone
                    ? '请输入手机号码'
                    : !newQuery.old_mobile
                    ? '请输入当前号码'
                    : '请输入新手机号码'
                "
                class="phoneBind-input"
              ></el-input>
            </el-form-item>
            <el-form-item
              class="dlg-body-list"
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
                <icon-necessary></icon-necessary><span>短信验证</span>
              </div>
              <div class="verify-note">
                <el-input
                  v-model="ruleForm.code"
                  placeholder="请输入短信验证码"
                  class="phoneBind-input"
                ></el-input>
                <o-button
                  class="captcha-btn"
                  :disabled="isDisposed"
                  @click="setPhone(ruleFormRef)"
                  >{{
                    isDisposed ? `${time}s后重新获取` : '获取验证码'
                  }}</o-button
                >
              </div>
            </el-form-item>
          </el-form>
          <div class="dlg-body-list note-btn">
            <div class="verify-note">
              <o-button class="cancel-btn" @click="resetForm(ruleFormRef)"
                >取消</o-button
              >
              <o-button class="comfilm-btn" @click="keepPhone(ruleFormRef)">{{
                !newQuery.old_mobile && userInfoStore.phone ? '下一步' : '确认'
              }}</o-button>
            </div>
          </div>
        </div>
      </ODialog>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.el-form {
  width: 520px;
  margin: 0 50px;
  :deep(.el-form-item__content) {
    display: flex;
    justify-content: space-between;
    .el-form-item__error {
      left: calc(100% + 15px);
    }
  }
}

.setting-box {
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
    .inline-content {
      display: flex;
      align-items: center;
      .icon-copy {
        cursor: pointer;
        margin-left: 16px;
        font-size: 24px;
        color: #555;
        &:hover {
          color: #0d8dff;
        }
      }
    }
    .dlg-body-list {
      :deep(.el-form-item__content) {
        display: flex;
        justify-content: space-between;
      }
    }

    .setting-tip {
      margin-top: 8px;
      font-size: 14px;
      font-weight: normal;
      color: #999999;
      line-height: 22px;
    }

    .setting-btn {
      width: 154px;
      display: block;
      color: #0d8dff;
      border: 1px solid #0d8dff;
      margin-top: 16px;
    }
  }
  .o-button {
    margin-top: 18px;
  }
}

.dlg-title {
  text-align: center;
  font-size: 24px;
  font-weight: normal;
  color: #000000;
  line-height: 32px;
}

.dlg-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  &-list {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    &:last-child {
      margin-top: 24px;
      margin-bottom: 0px;
      display: flex;
      .cancel-btn {
        color: #0d8dff;
        border: 1px solid #0d8dff;
      }
      .comfilm-btn {
        color: #fff;
        background-color: #0d8dff;
        border: 1px solid #0d8dff;
      }
    }

    .verify-note {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 400px;
      .el-input {
        width: 240px;
      }
      .captcha-btn {
        margin-left: 8px;
        min-width: 35%;
        font-size: 14px;
        padding: 5px 10px;
        color: #0d8dff;
        border: 1px solid #0d8dff;
      }
    }
  }
  .note-btn {
    margin-top: 48px;
    width: 264px;
  }
}
</style>
