<script setup>
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

import protocol from '../../../config/protocol';
import { trainSdk, inferSdk, projectPhoto } from '../../../config/protocol';
import { setNewProject, checkNames } from '@/api/api-project.js';

import { useUserInfoStore } from '@/stores';

import IconNecessary from '~icons/app/necessary.svg';
import { ElMessage } from 'element-plus';
import { ArrowRight } from '@element-plus/icons-vue';

const userInfo = useUserInfoStore();
const router = useRouter();
const i18n = {
  create: '新建项目',
  owner: '拥有者',

  storage_name: '仓库名称',
  pro_name: '项目名称',
  input_proName1: '请填写项目英文名称',
  input_proName2: '请填写项目中文名称',
  pro_img: '项目封面',
  desc: '描述',
  input_text: '请输入内容',
  licenses: '协议',
  train_sdk: '训练平台',
  infer_sdk: '项目类型',
  view: '仓库属性',
  submit: '提交',
};

// 表单信息
const proList = reactive({
  owner: '',
  cover_id: '1',
  englishName: '',
  chineseName: '',
  desc: '',
  protocol: '',
  training: '',
  type: '',
  repo_type: '',
});

const ruleFormRef = ref(null);
const rules = reactive({
  name: [
    { required: true, message: '必填项', trigger: 'blur' },
    {
      pattern: /^[^\u4e00-\u9fa5]{3,35}$/g,
      message: '暂不支持中文字符，且长度为3-35个字符',
      trigger: 'blur',
    },
    {
      pattern: /^[^\*/?\\<>|:;]*$/g,
      message: '不能含有:/\\*;?<>|等特殊字符',
      trigger: 'blur',
    },
    {
      pattern: /^[^.].*[^.]$/,
      message: '不能以.开头或结尾',
      trigger: 'blur',
    },
    {
      pattern: /^(?!.*(-)\1+).*$/,
      message: '不能连续两个及以上中划线',
      trigger: 'blur',
    },
    {
      pattern: /^(?!.*(_)\1+).*$/,
      message: '不能连续两个及以上下划线',
      trigger: 'blur',
    },
    { validator: checkName, trigger: 'change' },
  ],
  desc: [{ min: 1, max: 200, message: '内容不能为空', trigger: 'blur' }],
});
let time = null;
function checkName(rule, value, callback) {
  if (time !== null) {
    clearTimeout(time);
  }
  time = setTimeout(() => {
    checkNames({ name: value, owner: userInfo.userName }).then((res) => {
      if (res.data.can_apply) {
        callback();
      } else {
        callback(new Error('该名称已存在'));
      }
    });
  }, 2000);
}

const nameList = ref([]);
const projectPhotos = ref(projectPhoto);

nameList.value.push(userInfo.userName);
proList.owner = nameList.value[0];

const submitClick = async () => {
  ruleFormRef.value.validate((valid) => {
    if (valid) {
      setProject();
    } else {
      ElMessage({
        type: 'error',
        message: '请按要求填写信息',
        center: true,
      });
      return;
    }
  });
};

function selectImgClick(item) {
  proList.cover_id = item.id.toString();
  projectPhotos.value.forEach((single) => {
    single.is_active = false;
  });
  item.is_active = true;
}

// 新建项目
function setProject() {
  let newList = JSON.parse(JSON.stringify(proList));
  if (newList.repo_type === 'Public') {
    newList.repo_type = 'public';
  } else {
    newList.repo_type = 'private';
  }
  setNewProject(newList)
    .then((res) => {
      ElMessage({
        type: 'success',
        message: '创建成功',
      });
      router.push(`/projects/${userInfo.userName}/${res.data.name}`);
    })
    .catch((err) => {
      if (err.msg === 'unsupported protocol') {
        ElMessage({
          type: 'error',
          message: '暂不支持该协议',
        });
      }
    });
}
// 项目封面，项目类型以及训练平台的数据
projectPhotos.value[0].is_active = true;

proList.type = inferSdk[0].name;
proList.training = trainSdk[0].name;
proList.protocol = protocol[0].name;
proList.repo_type = 'Public';
onMounted(() => {});
</script>

<template>
  <div class="create">
    <div class="link">
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: `/${userInfo.userName}` }"
          >个人主页</el-breadcrumb-item
        >
        <!-- <el-breadcrumb-item
          :to="{
            path: `/${
              fromPath === '/projects' ? 'projects' : userInfo.userName
            }`,
          }"
          >{{ option }}</el-breadcrumb-item
        > -->
        <el-breadcrumb-item class="set-new">新建项目</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="newpro-body">
      <el-form
        ref="ruleFormRef"
        :model="proList"
        :rules="rules"
        label-position="left"
        label-width="120px"
        hide-required-asterisk
      >
        <!-- 拥有者 -->
        <div class="form-item">
          <div class="warning">
            <o-icon><icon-necessary></icon-necessary></o-icon>
          </div>

          <el-form-item :label="i18n.owner" prop="owner">
            <el-select v-model="proList.owner">
              <el-option v-for="item in nameList" :key="item" :value="item">{{
                item
              }}</el-option>
            </el-select>
          </el-form-item>
        </div>
        <!-- 仓库名称 -->
        <div class="form-item">
          <div class="warning">
            <o-icon><icon-necessary></icon-necessary></o-icon>
          </div>
          <el-form-item class="pro-name" :label="i18n.storage_name" prop="name">
            <el-input
              v-model="proList.englishName"
              :placeholder="i18n.input_proName1"
            ></el-input>
            <o-popper></o-popper>
          </el-form-item>
        </div>
        <!-- 项目名称 -->
        <div class="form-item">
          <el-form-item class="project-name" :label="i18n.pro_name">
            <el-input
              v-model="proList.chineseName"
              :placeholder="i18n.input_proName2"
            ></el-input>
          </el-form-item>
        </div>
        <!-- 项目封面 -->
        <div class="form-item">
          <div class="img-warning">
            <o-icon><icon-necessary></icon-necessary></o-icon>
          </div>
          <el-form-item :label="i18n.pro_img" class="item-img">
            <div v-for="item in projectPhotos" :key="item.id" class="image">
              <div
                class="img-modal"
                :class="item.is_active ? 'select_active' : ''"
                @click="selectImgClick(item)"
              ></div>
              <el-image :src="item.url"> </el-image>
            </div>
          </el-form-item>
        </div>
        <!-- 项目描述 -->
        <div class="form-item">
          <div class="warning">
            <!-- <o-icon><icon-necessary></icon-necessary></o-icon> -->
          </div>
          <el-form-item :label="i18n.desc" prop="desc" class="item-desc">
            <el-input
              v-model="proList.desc"
              type="textarea"
              :placeholder="i18n.input_text"
              rows="5"
              maxlength="200"
              show-word-limit
            ></el-input>
          </el-form-item>
        </div>
        <!-- 协议 -->
        <div class="form-item">
          <div class="warning">
            <o-icon><icon-necessary></icon-necessary></o-icon>
          </div>
          <el-form-item :label="i18n.licenses">
            <el-select v-model="proList.protocol">
              <el-option
                v-for="item in protocol"
                :key="item.id"
                :value="item.name"
                :label="item.name"
              />
            </el-select>
          </el-form-item>
        </div>
        <!-- 项目类型 -->
        <div class="form-item">
          <div class="warning infer-item">
            <o-icon><icon-necessary></icon-necessary></o-icon>
          </div>
          <el-form-item :label="i18n.infer_sdk">
            <el-select v-model="proList.type">
              <el-option
                v-for="item in inferSdk"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              />
            </el-select>
          </el-form-item>
        </div>
        <!-- 训练平台 -->
        <div class="form-item">
          <div class="warning">
            <o-icon><icon-necessary></icon-necessary></o-icon>
          </div>
          <el-form-item :label="i18n.train_sdk">
            <el-select v-model="proList.training">
              <el-option
                v-for="item in trainSdk"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              />
            </el-select>
          </el-form-item>
        </div>
        <!-- 仓库属性 -->
        <div class="form-item">
          <div class="warning store-item">
            <o-icon><icon-necessary></icon-necessary></o-icon>
          </div>
          <el-form-item class="view" :label="i18n.view">
            <div class="visual">
              <el-radio-group v-model="proList.repo_type">
                <el-radio label="完全公开" />
              </el-radio-group>
              <div class="visual-desc">
                其他用户可浏览、收藏、下载你的项目，但仅有你及你的团队成员才可编辑此项目
              </div>
              <el-radio-group v-model="proList.repo_type">
                <el-radio label="部分公开" />
              </el-radio-group>
              <div class="visual-desc">
                其他用户可浏览、收藏你的项目，但仅有你及你的团队可以下载文件和编辑项目
              </div>
              <el-radio-group v-model="proList.repo_type">
                <el-radio label="私有" />
              </el-radio-group>
              <div class="visual-desc">
                其他用户将无法搜索、查看你的项目，仅你及你的团队成员可查看和编辑此项目
              </div>
            </div>
          </el-form-item>
        </div>
        <div class="save-btn">
          <o-button type="primary" @click="submitClick">保存</o-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.create {
  background: #f5f6f8;
  padding: 0 16px;
  padding-bottom: 64px;
}
.link {
  padding: 24px 0;
  font-size: 12px;
  margin: 0 auto;
  max-width: 1416px;
  :deep .el-breadcrumb {
    font-size: 12px;
    color: #555555;
    .el-breadcrumb__inner.is-link {
      font-weight: normal;
      color: #555;
    }
    .set-new span {
      color: #000;
      font-weight: 400;
    }
  }
}

.select_active {
  display: block !important;
  background-color: rgba(165, 213, 255, 0.5);
}
.newpro-body {
  position: relative;
  margin: 0 auto;
  max-width: 1416px;
  min-height: 1165px;
  background: #ffffff;
  box-shadow: 0px 12px 32px 0px rgba(190, 196, 204, 0.2);
  padding-top: 48px;
  padding-bottom: 40px;
  // height: calc(100vh - 558px);

  .el-form {
    width: 520px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    :deep .el-form-item__label {
      padding-right: 22px;
      line-height: 22px;
      height: 22px;
      margin-left: 4px;
    }

    .form-item {
      display: flex;
      align-items: center;
      .o-icon.normal {
        font-size: 8px;
      }
      .img-warning {
        font-size: 8px;
        margin-bottom: 3px;
      }
      .warning {
        margin-bottom: 20px;
        font-size: 8px;
      }
      .infer-item {
        align-self: flex-start;
        padding-top: 14px;
      }
      .store-item {
        align-self: start;
        padding-top: 14px;
      }
      .el-form-item {
        display: flex;
        align-items: center;
      }
      :deep(.item-desc) {
        .el-form-item__label {
          margin-right: 8px;
        }
      }
      :deep(.project-name) {
        .el-form-item__label {
          margin-right: 8px;
        }
      }
    }
    .item-img {
      cursor: pointer;
      margin-bottom: 8px !important;
      .image {
        position: relative;
        .el-image {
          margin-right: 16px;
          width: 152px;
          height: 85px;
          cursor: pointer;
          border-radius: 16px;
        }
        .img-modal {
          position: absolute;
          left: -2px;
          top: -2px;
          width: 157px;
          height: 90px;
          z-index: 100;
          border-radius: 16px;
          background-color: rgba(165, 213, 255, 0.5);
          display: none;
        }
        &:hover {
          .img-modal {
            display: block;
          }
        }
      }
    }

    .pro-name {
      position: relative;
      :deep(.el-popover.el-popper) {
        padding: 24px 16px 16px 16px;
        font-size: 12px;
        line-height: 16px;
        color: #656565;
        .remind {
          color: #f13b35;
        }
      }
      .o-icon {
        position: absolute;
        right: -40px;
        font-size: 24px;
      }
    }

    .el-form-item {
      margin-bottom: 24px;
      .el-select {
        width: 400px;
      }
    }

    .save-btn {
      display: flex;
      justify-content: center;
      margin-top: 40px;
    }
    .view.el-form-item {
      display: flex;
      align-items: flex-start;
      margin-bottom: 0px;
      :deep .el-form-item__label {
        height: 128px !important;
        padding-top: 6px;
      }
    }
    .visual {
      display: flex;
      align-self: flex-start !important;
      flex-direction: column;
      .visual-desc {
        padding-left: 22px;
        color: #999999;
        font-size: 14px;
        line-height: 22px;
      }
      .el-radio-group {
        margin-bottom: 5px;
        .el-radio {
          line-height: 22px;
          margin-right: 12px;
          width: 72px;
          color: #000000;
          font-weight: 400;
        }
        &:not(:first-child) {
          margin-top: 17px;
        }
      }
    }
  }
}
</style>
