<script setup>
import { ref, reactive } from 'vue';

import { goCompetition } from '@/api/api-competition';
import { getAreaData } from '@/api/api-competition';
import { createTeam } from '@/api/api-competition';

import IconNecessary from '~icons/app/necessary.svg';
import IconTips from '~icons/app/tips.svg';
import { ElMessage } from 'element-plus';
import { useRoute } from 'vue-router';

import { useUserInfoStore } from '@/stores';

const route = useRoute();
const userInfoStore = useUserInfoStore();

const input = ref('');
const teamData = ref([]);
const queryRef = ref(null);
const role = ref(1);
const areaData = ref([]);
let province = ref([]);
let citys = ref([]);

const i18n = {
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
};
const query = reactive({
  name: '',
  username: userInfoStore.userName,
  loc_province: '',
  loc_city: '',
  email: '',
  phone: '',
  identity_type: 1,
  schoolName1: '',
  major1: '',
  schoolName2: '',
  major2: '',
  industry: '',
  company: '',
  description: '',
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
    {
      pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
      message: '请输入正确的邮箱',
      trigger: 'blur',
    },
  ],
  phone: [
    {
      required: true,
      message: '必填项',
      trigger: 'blur',
    },
    {
      // 请输入正确的手机号
      pattern: /^1[3456789]\d{9}$/,
      message: '请输入正确的手机号',
      trigger: 'blur',
    },
  ],
  // identity: [
  //   {
  //     required: true,
  //     message: '必填项',
  //     trigger: 'blur',
  //   },
  // ],
  // identityDetail1: [
  //   {
  //     required: true,
  //     message: '必填项',
  //     trigger: 'blur',
  //   },
  // ],
  // identityDetail2: [
  //   {
  //     required: true,
  //     message: '必填项',
  //     trigger: 'blur',
  //   },
  // ],
});
// 获取城市数据
function getArea() {
  getAreaData().then((res) => {
    areaData.value = res.data;
    // 获得省份数据
    Object.keys(areaData.value['86']).forEach((city) => {
      // citys.value.push({
      //   label: areaData.value[province][city],
      //   value: city,
      // });
      province.value.push({
        label: areaData.value['86'][city],
        value: city,
      });
    });
    // for (let key in areaData.value['86']) {
    //   province.value.push({
    //     label: areaData.value['86'][key],
    //     value: key,
    //   });
    // }
    // console.log('province.value: ', province.value);
  });
}
getArea();
// 切换身份
function changeRole(item) {
  role.value = item;
  query.identity_type = item;
}

const emit = defineEmits(['handleStep']);
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
        loc_city: query.loc_city,
        email: query.email,
        phone: query.phone,
        identity_type: query.identity_type,
        detail1:
          query.schoolName1 ||
          query.schoolName2 ||
          query.industry ||
          query.description,
        detail2: query.major1 || query.major2 || query.company,
      };
      let params2 = {
        name: query.username,
        relate_competition: route.params.id,
        is_individual: true,
      };
      createTeam(params2)
        .then((res) => {
          // console.log('新建团队信息（个人）: ', res);
          if (res.status === 200) {
            teamData.value = res.data;
            // is_individual.value = res.data.is_individual;
          }
        })
        .finally(() => {
          // console.log('province: ', province.value);
          province.value.some((val) => {
            if (val.value === params1.loc_province) {
              params1.loc_province = val.label;
              return true;
            }
          });
          // console.log('表单数据: ', params1);
          goCompetition(params1).then((res) => {
            if (res.status === 200) {
              emit('handleStep');
              ElMessage({
                type: 'success',
                message: '报名成功！',
              });
            }
          });
        });
    } else {
      console.error('error submit!');
      return false;
    }
  });
}
function handleProvince(province) {
  citys.value = [];
  Object.keys(areaData.value[province]).forEach((city) => {
    citys.value.push(areaData.value[province][city]);
  });
  query.loc_city = citys.value[0].label;
  // let obj = areaData.value[province];
  // for (let k in obj) {
  //   citys.value.push(obj[k]);
  // }

  // console.log('citys城市信息: ', citys);
  // if (citys.value.length === 1) {
  // } else {
  //   query.loc_city = ''
  // }
}
</script>
<template>
  <!-- 报名表 -->
  <div class="application">
    <div class="application-title">
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
            readonly
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
              @change="handleProvince"
            >
              <el-option
                v-for="item in province"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="location">
            <el-select v-model="query.loc_city" placeholder="请选择城市">
              <el-option
                v-for="item in citys"
                :key="item"
                :label="item"
                :value="item"
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
          <el-input v-model="query.phone" placeholder="方便和您联系"></el-input>
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
              <el-form-item prop="schoolName1">
                <div class="organization">
                  <span class="requirement">
                    <icon-necessary></icon-necessary
                    ><span>{{ i18n.schoolname }}</span>
                  </span>
                  <el-input
                    v-model="query.schoolName1"
                    placeholder="请输入所在学校名称"
                    required="required"
                  ></el-input>
                </div>
              </el-form-item>
              <el-form-item prop="major1">
                <div class="specialty">
                  <span class="requirement">
                    <icon-necessary></icon-necessary
                    ><span>{{ i18n.specialty }}</span>
                  </span>
                  <el-input
                    v-model="query.major1"
                    placeholder="请输入所属专业"
                  ></el-input>
                </div>
              </el-form-item>
            </div>
            <!-- 教师 -->
            <div v-show="role === 2" class="teacher">
              <el-form-item prop="schoolName2">
                <div class="organization">
                  <span class="requirement">
                    <icon-necessary></icon-necessary
                    ><span>{{ i18n.schoolname }}</span>
                  </span>
                  <el-input
                    v-model="query.schoolName2"
                    placeholder="请输入所在学校名称"
                  ></el-input>
                </div>
              </el-form-item>
              <el-form-item prop="major2">
                <div class="specialty">
                  <span class="requirement">
                    <icon-necessary></icon-necessary
                    ><span>{{ i18n.specialty }}</span>
                  </span>
                  <el-input
                    v-model="query.major2"
                    placeholder="请输入所属专业"
                  ></el-input>
                </div>
              </el-form-item>
            </div>
            <!-- 开发者 -->
            <div v-show="role === 3" class="developer">
              <el-form-item prop="industry">
                <div class="organization">
                  <span class="requirement">
                    <icon-necessary></icon-necessary
                    ><span>{{ i18n.industry }}</span>
                  </span>
                  <el-input
                    v-model="query.industry"
                    placeholder="请输入所属行业"
                  ></el-input>
                </div>
              </el-form-item>
              <el-form-item prop="company">
                <div class="specialty">
                  <span class="requirement">
                    <icon-necessary></icon-necessary
                    ><span>{{ i18n.company }}</span>
                  </span>
                  <el-input
                    v-model="query.company"
                    placeholder="请输入公司名称"
                  ></el-input>
                </div>
              </el-form-item>
            </div>
            <!-- 其他 -->
            <div v-show="role === 4" class="other">
              <el-form-item prop="description">
                <div class="desc">
                  <span class="requirement">
                    <icon-necessary></icon-necessary
                    ><span>{{ i18n.description }}</span>
                  </span>
                  <el-input
                    v-model="query.description"
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
</template>

<style lang="scss" scoped>
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
            // height: 137px;
            background: #f5f6f8;
            margin-top: 25px;
            padding: 24px;
            .el-form-item {
              margin-bottom: 0px;
              .organization {
                margin-bottom: 28px;
                display: flex;
                justify-content: space-between;
              }
              .specialty {
                margin-bottom: 20px;
                display: flex;
                justify-content: space-between;
              }
              .el-form-item__error {
                position: absolute;
                left: calc(100% - 380px);
                top: 46px;
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
