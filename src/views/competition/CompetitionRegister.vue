<script setup>
import { ref, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserInfoStore } from '@/stores';

import { goCompetition } from '@/api/api-competition';
import { getAreaData } from '@/api/api-competition';
import { createTeam } from '@/api/api-competition';

// import { request } from '@/shared/axios';

import OButton from '@/components/OButton.vue';
import IconNecessary from '~icons/app/necessary.svg';
import IconTips from '~icons/app/tips.svg';

import { ElMessage } from 'element-plus';

const route = useRoute();
const router = useRouter();
const userInfoStore = useUserInfoStore();

const i18n = {
  declaration: '法律声明',
  agree: '已阅读并同意该声明',
  next: '下一步',
  application: '报名表',
  name: '姓名',
  username: '用户名',
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
  success: '报名成功，祝贺您取得好成绩！',
  joinTeam:
    '您还未加入团队，您可以选择建立团队或加入团队，您也可以选择个人参赛。',
  personal: '个人参赛',
  team: '团队参赛',
};
const active = ref(1);
const textarea = ref('');
const agree = ref(false);
const input = ref('');
const is_individual = ref(true)
const stepData = ref([
  { title: '登录/注册' },
  { title: '法律声明' },
  { title: '填写报名表' },
  { title: '报名成功' },
]);

const queryRef = ref(null);
const role = ref(1);
const areaData = ref([]);
let province = [];
let citys = [];
const query = reactive({
  name: '',
  username: userInfoStore.userName,
  loc_province: '',
  loc_city: '',
  email: '',
  phone: '',
  identity_type: 1,
  identityDetail1: '',
  identityDetail2: '',
});
const rules = reactive({
  name: [
    {
      required: true,
      message: '必填项',
      trigger: 'blur',
    },
  ],
  username: [
    {
      required: true,
      message: '必填项',
      trigger: 'blur',
    },
  ],
  // location: [
  //   {
  //     required: true,
  //     message: '必填项',
  //     trigger: 'blur',
  //   },
  // ],
  email: [
    {
      required: true,
      message: '必填项',
      trigger: 'blur',
    },
    // {
    //   pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
    //   message: '请输入正确的邮箱',
    //   trigger: 'blur',
    // },
  ],
  phone: [
    {
      required: true,
      message: '必填项',
      trigger: 'blur',
    },
    // {
    //   // 请输入正确的手机号
    //   pattern: /^1[3456789]\d{9}$/,
    //   message: '请输入正确的手机号',
    //   trigger: 'blur',
    // },
  ],
  // identity: [
  //   {
  //     required: true,
  //     message: '必填项',
  //     trigger: 'blur',
  //   },
  // ],
  identityDetail1: [
    {
      required: true,
      message: '必填项',
      trigger: 'blur',
    },
  ],
});
// 获取城市数据
function getArea() {
  getAreaData().then((res) => {
    areaData.value = res.data;
  });
}

function goNext() {
  active.value++;
  getArea();
}
// 切换身份
function changeRole(item) {
  role.value = item;
  query.identity_type = item;
}
// 保存报名
function saveInfo(formEl) {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      // TODO:提交报名表
      // 表单的数据
      let params1 = {
        name: query.name,
        loc_province: query.loc_province,
        email: query.email,
        phone: query.phone,
        identity_type: query.identity_type,
        detail1: query.identityDetail1,
        detail2: query.identityDetail2,
      };
      let params2 = {
        name: query.username,
        relate_competition: route.params.id,
        is_individual: true,
      };
      goCompetition(params1).then((res) => {
        // console.log('res: ', res);
      });
      createTeam(params2).then((res) => {
        // console.log('res222: ', res);
        is_individual.value = res.data.is_individual;
      });
      // console.log('params: ', params);
      active.value++;
      // ElMessage({
      //   type: 'success',
      //   message: '报名成功！',
      // });
    } else {
      console.error('error submit!');
      return false;
    }
  });
}
// 点击个人参赛进入比赛介绍页
function goCompetitionIntro() {
  router.push({
    name: 'introduction',
    params: {
      id: route.params.id,
    },
  });
}
// 团队tab页
function goTeam() {
  router.push({
    name: 'team',
    params: {
      id: route.params.id,
    },
  });
}

// 获得省份数据
for (let key in areaData.value['86']) {
  province.push({
    label: areaData.value['86'][key],
    value: key,
  });
  console.log(province);
}

function handleProvince(province) {
  // 440000
  for (let city in areaData[province]) {
    citys.push({
      label: areaData[province][city],
      value: city,
    });
  }
  return citys;
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
        <el-form ref="queryRef" :model="query">
          <el-form-item prop="name" :rules="rules.name">
            <div class="requirement">
              <icon-necessary></icon-necessary><span>{{ i18n.name }}</span>
            </div>
            <el-input v-model="query.name" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item prop="username" :rules="rules.username">
            <div class="requirement">
              <icon-necessary></icon-necessary><span>{{ i18n.username }}</span>
            </div>
            <el-input
              v-model="query.username"
              placeholder="请输入用户名"
              disabled
            ></el-input>
          </el-form-item>
          <!-- 选择城市TODO: :rules="-->
          <el-form-item class="city">
            <div class="requirement">
              <icon-necessary></icon-necessary><span>{{ i18n.location }}</span>
            </div>
            <el-form-item class="location">
              <el-select
                v-model="query.loc_province"
                placeholder="请选择省份"
                @change="handleProvince($event)"
              >
                <el-option
                  v-for="(item, index) in province"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="location">
              <el-select
                v-model="query.loc_city"
                placeholder="请选择城市"
                @change="getCity($event)"
              >
                <el-option
                  v-for="(item, index) in citys"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-form-item>
          <!-- 邮箱 -->
          <el-form-item prop="email" :rules="rules.email">
            <div class="requirement">
              <icon-necessary></icon-necessary><span>{{ i18n.email }}</span>
            </div>
            <el-input
              v-model="query.email"
              placeholder="请输入常用邮箱"
            ></el-input>
          </el-form-item>
          <!-- 手机号 -->
          <el-form-item prop="phone" :rules="rules.phone">
            <div class="requirement">
              <icon-necessary></icon-necessary><span>{{ i18n.phone }}</span>
            </div>
            <el-input
              v-model="query.phone"
              placeholder="方便和您联系"
            ></el-input>
          </el-form-item>
          <!-- 身份 -->
          <el-form-item>
            <div class="requirement">
              <icon-necessary></icon-necessary><span>{{ i18n.identity }}</span>
            </div>
            <div class="identity-option">
              <el-radio-group v-model="query.identity_type" class="ml-4">
                <el-radio :label="1" @click="changeRole(1)">{{
                  i18n.student
                }}</el-radio>
                <el-radio :label="2" @click="changeRole(2)">{{
                  i18n.teacher
                }}</el-radio>
                <el-radio :label="3" @click="changeRole(3)">{{
                  i18n.developer
                }}</el-radio>
                <el-radio :label="4" @click="changeRole(4)">{{
                  i18n.other
                }}</el-radio>
              </el-radio-group>
              <!-- 学生 -->
              <div v-show="role === 1" class="student">
                <!-- TODO::rules所有的 -->
                <el-form-item
                  prop="identityDetail1"
                  :rules="rules.identityDetail1"
                >
                  <div class="organization">
                    <span class="requirement">
                      <icon-necessary></icon-necessary
                      ><span>{{ i18n.schoolname }}</span>
                    </span>
                    <el-input
                      v-model="query.identityDetail1"
                      placeholder="请输入所在学校名称"
                      required="required"
                    ></el-input>
                  </div>
                </el-form-item>
                <el-form-item prop="identityDetail2">
                  <div class="specialty">
                    <span class="requirement">
                      <icon-necessary></icon-necessary
                      ><span>{{ i18n.specialty }}</span>
                    </span>
                    <el-input
                      v-model="query.identityDetail2"
                      placeholder="请输入所属专业"
                    ></el-input>
                  </div>
                </el-form-item>
              </div>
              <!-- 教师 -->
              <div v-show="role === 2" class="teacher">
                <el-form-item prop="identityDetail1">
                  <div class="organization">
                    <span class="requirement">
                      <icon-necessary></icon-necessary
                      ><span>{{ i18n.schoolname }}</span>
                    </span>
                    <el-input
                      v-model="query.identityDetail1"
                      placeholder="请输入所在学校名称"
                    ></el-input>
                  </div>
                </el-form-item>
                <el-form-item prop="identityDetail2">
                  <div class="specialty">
                    <span class="requirement">
                      <icon-necessary></icon-necessary
                      ><span>{{ i18n.specialty }}</span>
                    </span>
                    <el-input
                      v-model="query.identityDetail2"
                      placeholder="请输入所属专业"
                    ></el-input>
                  </div>
                </el-form-item>
              </div>
              <!-- 开发者 -->
              <div v-show="role === 3" class="developer">
                <el-form-item prop="identityDetail1">
                  <div class="organization">
                    <span class="requirement">
                      <icon-necessary></icon-necessary
                      ><span>{{ i18n.industry }}</span>
                    </span>
                    <el-input
                      v-model="query.identityDetail1"
                      placeholder="请输入所属行业"
                    ></el-input>
                  </div>
                </el-form-item>
                <el-form-item prop="identityDetail2">
                  <div class="specialty">
                    <span class="requirement">
                      <icon-necessary></icon-necessary
                      ><span>{{ i18n.company }}</span>
                    </span>
                    <el-input
                      v-model="query.identityDetail2"
                      placeholder="请输入公司名称"
                    ></el-input>
                  </div>
                </el-form-item>
              </div>
              <!-- 其他 -->
              <div v-show="role === 4" class="other">
                <el-form-item prop="identityDetail1">
                  <div class="desc">
                    <span class="requirement">
                      <icon-necessary></icon-necessary
                      ><span>{{ i18n.description }}</span>
                    </span>
                    <el-input
                      v-model="query.identityDetail1"
                      placeholder="请描述您的身份"
                    ></el-input>
                  </div>
                </el-form-item>
              </div>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div class="nextBtn">
        <o-button type="primary" @click="saveInfo(queryRef)">{{
          i18n.save
        }}</o-button>
      </div>
    </div>
    <!-- 报名成功页 -->
    <div v-if="active === 3" class="application-result">
      <div class="title">
        {{ i18n.success }}
      </div>
      <div class="tips">{{ i18n.joinTeam }}</div>
      <div class="btn">
        <o-button type="primary" @click="goCompetitionIntro">{{
          i18n.personal
        }}</o-button>
        <o-button type="primary" @click="goTeam">{{ i18n.team }}</o-button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.application-page {
  padding: 48px 40px 40px;
  // 法律声明
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
  //报名表
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
          // 身份item
          &:last-child {
            .el-form-item__content {
              align-items: flex-start;
              .el-input__wrapper {
                background-color: #fff;
              }
            }
            .student,
            .teacher,
            .developer,
            .other {
              height: 137px;
              background: #f5f6f8;
              margin-top: 25px;
              padding: 24px;
              .el-form-item {
                margin-bottom: 0px;
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
        // 所在地二级联动样式
        .city {
          .location {
            margin-bottom: 0px;
            .el-form-item__content {
              .el-select {
                width: 196px;
                margin-right: 8px;
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
  // 报名成功
  .application-result {
    margin: 80px 300px 40px;
    text-align: center;
    .title {
      height: 32px;
      line-height: 32px;
      font-size: 24px;
      color: #000000;
    }
    .tips {
      line-height: 32px;
      font-size: 14px;
      color: #555;
      margin: 16px 0 40px;
    }
    .btn {
      .o-button {
        margin-right: 24px;
      }
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
// 单选按钮样式
:deep(.el-radio__inner) {
  width: 18px;
  height: 18px;
  background: transparent !important;
  box-sizing: border-box;
  border: 2px solid #999;
}
:deep(.el-radio__inner::after) {
  background: #0d8dff;
  width: 10px;
  height: 10px;
}
</style>
