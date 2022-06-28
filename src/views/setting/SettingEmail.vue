<script setup>
import OButton from '@/components/OButton.vue';

import { reactive, ref } from 'vue';
import { useUserInfoStore } from '@/stores';
import {
  getUserEmail,
  setUserEmail,
  keepUserEmail,
  changeUserEmail,
} from '@/api/api-user';
import { ElMessage } from 'element-plus';
import IconActivation from '~icons/app/activation.svg';

const userInfoStore = useUserInfoStore();
// const email2 = ref();
const is_active = ref(true);
// const email = ref('');
// const email_code = ref('');
// const email_code2 = ref('');
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
try {
  getUserEmail(userInfoStore.id).then((res) => {
    console.log(res.data);
    if (res.data[0].email) {
      userInfoStore.email = res.data[0].email;
      console.log('2', userInfoStore.email);
      is_active.value = res.data[0].is_active;
      scene.value = is_active.value ? 'change_email' : 'change_email';
      console.log(scene);
    }
  });
} catch {}
function setEmail(formEl) {
  if (!formEl) return;
  console.log('formEl', formEl);
  formEl.validateField('email', (vaild) => {
    if (vaild) {
      console.log('ruleForm.email', ruleForm.email);
      setUserEmail({ email: ruleForm.email, scene }).then((res) => {
        console.log('获取验证码结果', res);
        isDisposed.value = true;
        handleTimeChange();
        regular.value = false;
      });
    }
  });
}
//激活邮箱
function setEmail2() {
  setUserEmail({ email: userInfoStore.email, scene }).then((res) => {
    console.log('获取验证码结果', res);
    isDisposed2.value = true;
    handleTimeChange2();
    regular.value = false;
  });
}
function keepEmail2() {
  let qurey = {
    email: userInfoStore.email,
    email_code: ruleForm.email_code2,
  };

  console.log('query', qurey);
  keepUserEmail(qurey)
    .then((res) => {
      if (res.status === 200) {
        ElMessage({
          type: 'success',
          message: '激活成功',
        });
      } else {
        ElMessage({
          type: 'error',
          message: '',
        });
      }
      console.log(res);
    })
    .catch((err) => {
      ElMessage({ type: 'error', message: err.msg });
    });
}
// function judge() {
//   console.log();
//   const reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
//   if (reg.test(email.value)) {
//     regular.value = false;
//   }
// }
function keepEmail(formEl) {
  console.log(formEl);
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      if (!userInfoStore.email) {
        let qurey = {
          email: ruleForm.email,
          email_code: ruleForm.email_code,
        };
        console.log('query', qurey);
        keepUserEmail(qurey)
          .then((res) => {
            if (res.status === 200) {
              ElMessage({
                type: 'success',
                message: '修改成功',
              });

              userInfoStore.email = res.data.mobile;
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
      } else {
        let qurey = {
          old_email: userInfoStore.email,
          old_email_code: ruleForm.email_code2,
          new_email: ruleForm.email,
          new_email_code: ruleForm.email_code,
        };
        console.log('query', qurey);
        changeUserEmail(qurey)
          .then((res) => {
            console.log('res', res);
            if (res.status === 200) {
              ElMessage({
                type: 'success',
                message: '修改成功',
              });

              userInfoStore.email = res.data.mobile;
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
      }
    } else {
      console.log('error submit!');
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
const handleTimeChange2 = () => {
  if (time2.value <= 0) {
    isDisposed2.value = false;
    time2.value = 60;
  } else {
    setTimeout(() => {
      time2.value--;
      handleTimeChange2();
    }, 1000);
  }
};
</script>

<template>
  <div v-if="userInfoStore.email" class="email-admin">
    <div class="current-email">{{ userInfoStore.email }}</div>
    <p class="email-tip">
      此邮箱为用户名登录账户，此邮箱将会接收账号相关的通知以及在密码重置中使用
    </p>
  </div>
  <div v-if="!is_active" class="setting-box">
    <div class="activation-tip">
      <o-icon><icon-activation></icon-activation></o-icon>
      <span class="font">该邮箱还未激活，点击获取验证码激活</span>
    </div>
    <div class="setting-content">
      <div class="email_code">
        <el-input
          v-model="ruleForm.email_code2"
          class="input"
          placeholder="请输入邮件中的验证码"
        ></el-input
        ><OButton class="setting-btn" size="small" @click="setEmail2">{{
          isDisposed2 ? `${time2}s后重新获取` : '获取验证码'
        }}</OButton>
      </div>
      <OButton class="setting-btn" @click="keepEmail2">保存更改</OButton>
    </div>
  </div>
  <div v-if="is_active" class="setting-box">
    <p class="setting-title">
      {{ userInfoStore.email ? '更改' : '添加' }}主要电子邮件地址
    </p>

    <el-form ref="ruleFormRef" class="setting-content" :model="ruleForm">
      <!-- 换绑邮箱新增 -->
      <el-form-item
        v-if="is_active && userInfoStore.email"
        prop="email_code2"
        :rules="{ required: true, message: '必填项', trigger: 'blur' }"
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
              >{{
                isDisposed2 ? `${time2}s后重新获取` : '获取验证码'
              }}</o-button
            >
          </div>
          <div class="item item-text">新邮箱认证</div>
        </div>
      </el-form-item>
      <!-- 添加邮箱 -->
      <el-form-item
        prop="email"
        :rules="[
          {
            pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
            message: '暂不支持中文字符',
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
        :rules="{ required: true, message: '必填项', trigger: 'blur' }"
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
          >{{ isDisposed ? `${time}s后重新获取` : '获取验证码' }}</OButton
        >
      </el-form-item>
      <OButton class="setting-btn" @click="keepEmail(ruleFormRef)"
        >保存更改</OButton
      >
    </el-form>
  </div>
  <!-- <div class="setting-box">
    <p class="setting-title">备份电子邮箱</p>
    <div class="setting-content">
      <o-input
        v-model="userInfoStore.userName"
        placeholder="zhw1711@163.com"
        class="setting-input"
      ></o-input>
      <p class="setting-tip">
        此邮箱为备份邮箱，将会额外用于账号安全相关的通知和密码重置中
      </p>
      <OButton class="setting-btn">新增</OButton>
    </div>
  </div> -->
</template>

<style lang="scss" scoped>
.email-admin {
  width: 800px;
  height: 108px;
  padding: 24px 0 24px 19px;
  background: rgba(13, 141, 255, 0.03);
  border: 1px solid #d8d8d8;
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
      width: 258px;
    }
    .o-button {
      margin-left: 8px;
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
  &:last-child {
    // margin-top: 94px;
  }

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
        width: 258px;
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
</style>
