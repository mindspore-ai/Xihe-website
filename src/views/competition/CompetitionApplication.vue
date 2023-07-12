<script setup>
import {
  ref,
  reactive,
  defineExpose,
  computed,
  defineProps,
  defineEmits,
} from 'vue';

import { applyCompetition } from '@/api/api-competition';
import { getAreaData } from '@/api/api-competition';
import { applyActivity } from '@/api/api-activity';
import { applyCourse } from '@/api/api-course';

import IconNecessary from '~icons/app/necessary.svg';
import IconTips from '~icons/app/tips.svg';
import { ElMessage } from 'element-plus';

import { useUserInfoStore, useCompetitionData } from '@/stores';

const userInfoStore = useUserInfoStore();
const userComData = useCompetitionData();

const queryRef = ref(null);
const areaData = ref([]);
const agree = ref(false);
let province = ref([]);
let citys = ref([]);

const props = defineProps({
  showApplication: {
    type: String,
    default: '',
  },
  courseId: {
    type: String,
    default: '',
  },
  userReginfo: {
    type: Object,
    default: () => {
      return {};
    },
  },
});

const i18n = {
  application: '报名表',
  tips: '请确保录入信息真实有效，以确保填写成功后我们能联系到您',
  name: '姓名',
  userName: '用户名',
  location: '所在地',
  email: '邮箱',
  phone: '手机号',
  identity: '身份',
  schoolName: '学校名称',
  specialty: '专业',
  student: '学生',
  teacher: '教师',
  developer: '开发者',
  other: '其他',
  industry: '所属行业',
  company: '公司',
  description: '描述',
  save: '保存',
  agree: '已阅读并同意',
  statement: '《比赛和课程相关隐私政策》',
};
const query = reactive({
  name: props.userReginfo.Name,
  userName: userInfoStore.userName,
  loc_province: props.userReginfo.Province,
  loc_city: props.userReginfo.City,
  email: props.userReginfo.Email,
  phone: props.userReginfo.Phone,
  identity_type: props.userReginfo.Identity
    ? props.userReginfo.Identity
    : 'student',
  // identity_type: 'student',
  schoolName1:
    props.userReginfo.Identity === 'student'
      ? props.userReginfo.Detail.detail1
      : '',
  major1:
    props.userReginfo.Identity === 'student'
      ? props.userReginfo.Detail.detail2
      : '',
  schoolName2:
    props.userReginfo.Identity === 'teacher'
      ? props.userReginfo.Detail.detail1
      : '',
  major2:
    props.userReginfo.Identity === 'teacher'
      ? props.userReginfo.Detail.detail2
      : '',
  industry:
    props.userReginfo.Identity === 'developer'
      ? props.userReginfo.Detail.detail1
      : '',
  company:
    props.userReginfo.Identity === 'developer'
      ? props.userReginfo.Detail.detail2
      : '',
  description:
    props.userReginfo.Identity === '' ? props.userReginfo.Detail.detail1 : '',
});
const role = ref(query.identity_type);

defineExpose({ query });

const rules = reactive({
  name: [
    {
      required: true,
      message: '必填项',
      trigger: 'blur',
    },
  ],
  userName: [
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
  loc_city: [
    {
      required: true,
      message: '必填项',
      trigger: 'blur',
    },
  ],
});
const combinedRules = computed(() => {
  return [{ required: true, message: '必填项', trigger: 'change' }];
});
// 获取城市数据
function getArea() {
  getAreaData().then((res) => {
    areaData.value = res.data;
    // 获得省份数据
    Object.keys(areaData.value['86']).forEach((item) => {
      province.value.push({
        label: areaData.value['86'][item],
        value: item,
      });
    });
  });
}
getArea();
function handleProvince(num) {
  citys.value = [];
  Object.keys(areaData.value[num]).forEach((item) => {
    citys.value.push(areaData.value[num][item]);
  });
  // 获取具体省份
  province.value.some((val) => {
    if (val.value === query.loc_province) {
      query.loc_province = val.label;
      return true;
    }
    return false;
  });
  query.loc_city = citys.value[0].label;
}
// 切换身份
function changeRole(item) {
  role.value = item;
  query.identity_type = item;
  query.schoolName1 = '';
  query.major1 = '';
  query.schoolName2 = '';
  query.major2 = '';
  query.industry = '';
  query.company = '';
  query.description = '';
}

const emit = defineEmits(['go-next-step', 'hide-form', 'get-activity']);

function cancelApplication() {
  emit('hide-form', false, 'course');
}

// 保存报名
function saveInfo(formEl) {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      // 提交报名表
      let params = {
        city: query.loc_city,
        detail: {
          detail1:
            query.schoolName1 ||
            query.schoolName2 ||
            query.industry ||
            query.description,
          detail2: query.major1 || query.major2 || query.company,
        },
        email: query.email,
        identity: query.identity_type,
        name: query.name,
        phone: query.phone,
        province: query.loc_province,
      };
      // 报名MindCon
      if (props.showApplication === 'MindCon') {
        applyActivity(params).then(() => {
          ElMessage({
            message: '报名成功',
            type: 'success',
            duration: 4000,
          });
          emit('get-activity');
          emit('hide-form', false);
        });
      } else if (props.showApplication === 'course') {
        // 报名课程
        applyCourse(props.courseId, params).then(() => {
          emit('hide-form', false);
          ElMessage({
            message: '报名成功',
            type: 'success',
            duration: 4000,
          });
        });
      } else {
        // 报名比赛
        applyCompetition(userComData.competitionData.id, params).then(() => {
          emit('go-next-step');
          userComData.competitionData.is_competitor = true;
          ElMessage({
            message: '报名成功',
            type: 'success',
            duration: 4000,
          });
        });
      }
    } else {
      return false;
    }
  });
}
// 跳转到隐私政策
function goPrivacy() {
  sessionStorage.setItem('privacyType', 'competition');
  window.open('/privacy');
}
</script>
<template>
  <!-- 报名表 -->
  <div class="application">
    <div class="application-title">
      <span class="text">{{ i18n.application }}</span>
      <div class="tips">
        <icon-tips class="tips-icon"></icon-tips>
        <div class="tips-text">{{ i18n.tips }}</div>
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
        <el-form-item prop="userName" :rules="rules.userName">
          <div class="requirement">
            <icon-necessary></icon-necessary><span>{{ i18n.userName }}</span>
          </div>
          <el-input
            v-model="query.userName"
            placeholder="请输入用户名"
            readonly
          ></el-input>
        </el-form-item>
        <!-- 选择城市-->
        <el-form-item class="city" required>
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
          <el-form-item class="location" prop="loc_city" :rules="combinedRules">
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
              <el-radio :label="'student'" @click="changeRole('student')">{{
                i18n.student
              }}</el-radio>
              <el-radio :label="'teacher'" @click="changeRole('teacher')">{{
                i18n.teacher
              }}</el-radio>
              <el-radio :label="'developer'" @click="changeRole('developer')">{{
                i18n.developer
              }}</el-radio>
              <el-radio :label="''" @click="changeRole('')">{{
                i18n.other
              }}</el-radio>
            </el-radio-group>
            <!-- 学生 -->
            <div v-show="role === 'student'" class="student">
              <el-form-item prop="schoolName1">
                <div class="organization">
                  <span class="requirement">
                    <icon-necessary></icon-necessary>
                    <span>{{ i18n.schoolName }}</span>
                  </span>
                  <el-input
                    v-model="query.schoolName1"
                    placeholder="请输入所在学校名称"
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
            <div v-show="role === 'teacher'" class="teacher">
              <el-form-item prop="schoolName2">
                <div class="organization">
                  <span class="requirement">
                    <icon-necessary></icon-necessary>
                    <span>{{ i18n.schoolName }}</span>
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
            <div v-show="role === 'developer'" class="developer">
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
            <div v-show="role === ''" class="other">
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
    <div v-if="showApplication" class="next-btn">
      <o-button size="small" @click="cancelApplication">暂不报名</o-button>
      <o-button v-if="!agree" size="small" disabled type="secondary">
        立即报名
      </o-button>
      <o-button v-else size="small" type="primary" @click="saveInfo(queryRef)">
        立即报名
      </o-button>
    </div>
    <div v-else class="next-btn">
      <o-button v-if="!agree" size="small" disabled type="secondary">
        {{ i18n.save }}
      </o-button>
      <o-button
        v-if="agree"
        size="small"
        type="primary"
        @click="saveInfo(queryRef)"
      >
        {{ i18n.save }}
      </o-button>
    </div>
    <div class="agree">
      <div class="agree-text" @click="agree = !agree">
        <input v-model="agree" type="checkbox" class="input" />
        <span>{{ i18n.agree }}</span>
      </div>
      <div class="statement">
        <div class="privacy" @click="goPrivacy">
          {{ i18n.statement }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
//报名表
.application {
  padding-top: 67px;
  padding: 67px 144px 0;
  &-title {
    line-height: 38px;
    padding-bottom: 22px;
    margin-bottom: 22px;
    border-bottom: 1px solid #d8d8d8;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .text {
      font-size: 24px;
      color: #000000;
      margin-right: 4%;
    }
    .tips {
      display: flex;
      align-items: center;
      width: 87%;
      position: relative;
      background: rgba(13, 141, 255, 0.03);
      border: 1px solid #d8d8d8;
      border-radius: 19px;
      .tips-icon {
        position: absolute;
        left: 18px;
      }
      .tips-text {
        line-height: 38px;
        color: #555555;
        font-size: 14px;
        padding-left: 48px;
      }
    }
  }
  .el-divider .el-divider--horizontal {
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
            span {
              margin-left: 4px;
            }
          }
          .el-form-item__error {
            left: calc(100% - 142px);
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
            background: #f5f6f8;
            margin-top: 10px;
            padding: 24px;
            border-radius: 8px;
            .el-form-item {
              margin-bottom: 0px;
              .organization {
                margin-bottom: 16px;
                display: flex;
                justify-content: space-between;
              }
              .specialty {
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
            .el-form-item__error {
              left: calc(100% + 6px);
            }
          }
        }
      }
    }
  }
  .next-btn {
    display: flex;
    justify-content: center;
    margin-top: 12px;
    .o-button {
      &:first-child {
        margin-right: 20px;
      }
    }
  }
  .agree {
    font-size: 14px;
    color: #000;
    margin-top: 16px;
    display: flex;
    justify-content: center;
    .agree-text {
      display: flex;
      align-items: center;
      span {
        margin-left: 8px;
        cursor: pointer;
      }
    }
    .statement {
      .privacy {
        color: #0d8dff;
        cursor: pointer;
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
