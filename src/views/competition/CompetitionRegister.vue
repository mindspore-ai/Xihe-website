<script setup>
import { ref, reactive } from 'vue';
import OButton from '@/components/OButton.vue';
import IconNecessary from '~icons/app/necessary.svg';
import IconTips from '~icons/app/tips.svg';

const i18n = {
  declaration: '法律声明',
  agree: '已阅读并同意该声明',
  next: '下一步',
  application: '报名表',
  name: '姓名',
  usename: '用户名',
  location: '所在地',
  email: '邮箱',
  phone: '手机号',
  identity: '身份',
  schoolname: '学校名称',
  specialty: '专业',
  student: '学生',
  teacher: '教师',
  developer: '开发者',
  other: '其他',
  industry: '所属行业',
  company: '公司',
  description: '描述',
  save: '保存',
};
const active = ref(1);
const textarea = ref('');
const agree = ref(false);
const input = ref('');
const stepData = ref([
  { title: '登录/注册' },
  { title: '法律声明' },
  { title: '填写报名表' },
  { title: '报名成功' },
]);

const queryRef = ref(null);
const radio = ref(3);
const role = ref(1);
const query = reactive({
  name: '',
  usename: '',
  location: '',
  email: '',
  phone: '',
  identity: [
    {
      schoolname: '',
      specialty: '',
      industry: '',
      company: '',
      description: '',
    },
  ],
});
const rules = reactive({
  name: [
    {
      required: true,
      message: '必填项',
      trigger: 'blur',
    },
  ],
  usename: [
    {
      required: true,
      message: '必填项',
      trigger: 'blur',
    },
  ],
  location: [
    {
      required: true,
      message: '必填项',
      trigger: 'blur',
    },
  ],
  email: [
    {
      required: true,
      message: '必填项',
      trigger: 'blur',
    },
  ],
  phone: [
    {
      required: true,
      message: '必填项',
      trigger: 'blur',
    },
  ],
  identity: [
    {
      required: true,
      message: '必填项',
      trigger: 'blur',
    },
  ],
});
function goNext() {
  active.value++;
}
// 切换身份
function changeRole(item) {
  role.value = item;
}
// 保存报名
function save(formEl) {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      // TODO:提交报名表

    } else {
      console.error('error submit!');
      return false;
    }
  });
}
</script>
<template>
  <div class="application-page">
    <el-steps :active="active" align-center>
      <el-step
        v-for="item in stepData"
        :key="item.title"
        :title="item.title"
      ></el-step>
    </el-steps>
    <!-- 法律声明 -->
    <div v-if="active === 1" class="declaration">
      <div class="declaration-title">{{ i18n.declaration }}</div>
      <el-input id="txt" v-model="textarea" type="textarea" readonly />
      <div class="isAgree">
        <input v-model="agree" type="checkbox" />
        <span @click="agree = !agree">{{ i18n.agree }}</span>
      </div>
      <div class="nextBtn">
        <o-button v-if="!agree" disabled type="secondary">{{
          i18n.next
        }}</o-button>
        <o-button v-else type="primary" @click="goNext">{{
          i18n.next
        }}</o-button>
      </div>
    </div>
    <!-- 报名表 -->
    <div v-if="active === 2" class="application">
      <div class="application-title">
        <!-- 报名表页面刷新有问题 -->
        <div class="text">{{ i18n.application }}</div>
        <el-input
          v-model="input"
          readonly
          placeholder="请确保录入信息真实有效，以确保填写成功后我们能联系到您"
        />
        <div class="tipsIcon">
          <icon-tips></icon-tips>
        </div>
      </div>
      <div class="application-form">
        <el-form ref="queryRef" :model="query" :rules="rules">
          <el-form-item prop="name">
            <div class="requirement">
              <icon-necessary></icon-necessary><span>{{ i18n.name }}</span>
            </div>
            <el-input v-model="query.name" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item prop="usename">
            <div class="requirement">
              <icon-necessary></icon-necessary><span>{{ i18n.usename }}</span>
            </div>
            <el-input
              v-model="query.usename"
              placeholder="请输入用户名"
            ></el-input>
          </el-form-item>
          <el-form-item prop="location">
            <div class="requirement">
              <icon-necessary></icon-necessary><span>{{ i18n.location }}</span>
            </div>
            <el-input v-model="query.location" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item prop="email">
            <div class="requirement">
              <icon-necessary></icon-necessary><span>{{ i18n.email }}</span>
            </div>
            <el-input
              v-model="query.email"
              placeholder="请输入常用邮箱"
            ></el-input>
          </el-form-item>
          <el-form-item prop="phone">
            <div class="requirement">
              <icon-necessary></icon-necessary><span>{{ i18n.phone }}</span>
            </div>
            <el-input
              v-model="query.phone"
              placeholder="方便和您联系"
            ></el-input>
          </el-form-item>
          <el-form-item prop="identity">
            <div class="requirement">
              <icon-necessary></icon-necessary><span>{{ i18n.identity }}</span>
            </div>
            <div class="identity-option">
              <el-radio-group v-model="radio">
                <el-radio :label="3" @click="changeRole(1)">{{
                  i18n.student
                }}</el-radio>
                <el-radio :label="6" @click="changeRole(2)">{{
                  i18n.teacher
                }}</el-radio>
                <el-radio :label="9" @click="changeRole(3)">{{
                  i18n.developer
                }}</el-radio>
                <el-radio :label="12" @click="changeRole(4)">{{
                  i18n.other
                }}</el-radio>
              </el-radio-group>
              <div v-show="role === 1" class="student">
                <div class="organization">
                  <span class="requirement">
                    <icon-necessary></icon-necessary
                    ><span>{{ i18n.schoolname }}</span>
                  </span>
                  <el-input
                    v-model="query.identity.schoolname"
                    placeholder="请输入所在学校名称"
                  ></el-input>
                </div>
                <div class="specialty">
                  <span class="requirement">
                    <icon-necessary></icon-necessary
                    ><span>{{ i18n.specialty }}</span>
                  </span>
                  <el-input
                    v-model="query.identity.specialty"
                    placeholder="请输入所属专业"
                  ></el-input>
                </div>
              </div>
              <div v-show="role === 2" class="teacher">
                <div class="organization">
                  <span class="requirement">
                    <icon-necessary></icon-necessary
                    ><span>{{ i18n.schoolname }}</span>
                  </span>
                  <el-input
                    v-model="query.identity.schoolname"
                    placeholder="请输入所在学校名称"
                  ></el-input>
                </div>
                <div class="specialty">
                  <span class="requirement">
                    <icon-necessary></icon-necessary
                    ><span>{{ i18n.specialty }}</span>
                  </span>
                  <el-input
                    v-model="query.identity.specialty"
                    placeholder="请输入所属专业"
                  ></el-input>
                </div>
              </div>
              <div v-show="role === 3" class="developer">
                <div class="organization">
                  <span class="requirement">
                    <icon-necessary></icon-necessary
                    ><span>{{ i18n.industry }}</span>
                  </span>
                  <el-input
                    v-model="query.identity.industry"
                    placeholder="请输入所属行业"
                  ></el-input>
                </div>
                <div class="specialty">
                  <span class="requirement">
                    <icon-necessary></icon-necessary
                    ><span>{{ i18n.company }}</span>
                  </span>
                  <el-input
                    v-model="query.identity.company"
                    placeholder="请输入公司名称"
                  ></el-input>
                </div>
              </div>
              <div v-show="role === 4" class="other">
                <div class="desc">
                  <span class="requirement">
                    <icon-necessary></icon-necessary
                    ><span>{{ i18n.description }}</span>
                  </span>
                  <el-input
                    v-model="query.identity.description"
                    placeholder="请描述您的身份"
                  ></el-input>
                </div>
              </div>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div class="nextBtn">
        <o-button type="primary" @click="save(queryRef)">{{
          i18n.save
        }}</o-button>
      </div>
    </div>
    <!-- 报名成功 -->
    <div v-if="active === 3" class="declaration">333</div>
  </div>
</template>

<style lang="scss" scoped>
.application-page {
  padding: 48px 40px 40px;
  .declaration {
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
      margin: 25px 0 40px;
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
      display: flex;
      justify-content: center;
    }
  }
  .application {
    padding-top: 67px;
    // padding-bottom: 40px;
    &-title {
      font-size: 24px;
      color: #000000;
      margin-left: 11%;
      margin-right: 11%;
      padding-bottom: 24px;
      margin-bottom: 24px;
      border-bottom: 1px solid #d8d8d8;
      position: relative;
      display: flex;
      align-items: center;
      .text {
        width: 124px;
      }
      :deep(.el-input) {
        width: 100% !important;
        width: 1000px !important;
        // margin-left: 45px;
        .el-input__wrapper {
          padding-left: 40px;
        }
      }
      .tipsIcon {
        display: inline-block;
        position: absolute;
        top: 6%;
        left: 13%;
      }
    }
    .el-divider .el-divider--horizontal {
      // padding-left: 11%;
      width: 80%;
      margin-left: 138px !important;
    }
    &-form {
      display: flex;
      justify-content: center;
      :deep(.el-form) {
        font-size: 14px;
        color: #555;
        .el-form-item {
          margin-bottom: 24px;
          .el-form-item__content {
            .requirement {
              width: 90px;
              margin-right: 18px;
            }
            .el-form-item__error {
              left: calc(100% + -142px);
            }
          }
          // 最后一个元素
          &:last-child {
            .el-form-item__content {
              align-items: flex-start;
            }
            .student,
            .teacher,
            .developer,
            .other {
              height: 137px;
              background: #f5f6f8;
              margin-top: 25px;
              padding: 24px;
              .organization {
                margin-bottom: 17px;
                display: flex;
                justify-content: space-between;
              }
              .specialty {
                display: flex;
                justify-content: space-between;
              }
            }
            .other {
              display: flex;
              align-items: center;
              .desc {
                margin-bottom: 0px;
                .requirement {
                  display: inline-block;
                  width: 90px;
                  margin-right: 18px;
                }
              }
            }
          }
        }
      }
    }
    .nextBtn {
      display: flex;
      justify-content: center;
      margin-top: 12px;
    }
  }
}
:deep(.el-steps) {
  padding-right: 80px;
  .is-center {
    // .el-step__line {
    //   border-top: 2px dashed #ccd1de;
    //   height: 0;
    //   background-color: transparent;
    // }
    &:nth-child(3) {
      .el-step__head {
        .el-step__line {
          position: absolute;
          left: 90%;
          right: -40%;
        }
      }
    }
    .el-step__head {
      // background-color: red !important;
      // .is-finish {
      // }
      .el-step__line {
        border-top: 2px dashed #ccd1de;
        height: 0;
        background-color: transparent;
        position: absolute;
        left: 84%;
        right: -40%;
        .el-step__line-inner {
          border-width: 0px;
        }
      }
    }
    .el-step__main {
      .el-step__title {
        position: absolute;
        left: 56%;
        top: -40%;
        font-size: 18px;
      }
      .el-step__title.is-process {
        color: #0d8dff;
        font-weight: 400;
      }
    }
    .el-step__head.is-finish {
      .el-step__icon.is-text {
        background-color: #0d8dff;
        color: #fff;
        border-color: #0d8dff;
      }
    }
    .el-step__head.is-process {
      .el-step__icon.is-text {
        background-color: #0d8dff !important;
        color: #fff;
        border-color: #0d8dff;
      }
    }
  }
}
</style>
