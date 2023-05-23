<script setup>
import { reactive, ref } from 'vue';
import { useUserInfoStore } from '@/stores';

import IconNecessary from '~icons/app/necessary.svg';
import { ArrowRight } from '@element-plus/icons-vue';
import OButton from '@/components/OButton.vue';

import protocol from '../../../config/protocol';
import { createDataset, checkNames } from '@/api/api-dataset';
import { useRouter } from 'vue-router';
const router = useRouter();
const userInfo = useUserInfoStore();
const i18n = {
  homePage: '个人主页',
  createPlaceholder: '新建数据集',
  datasetOwner: '拥有者',
  datasetName: '数据集名称',
  datasetDescribe: '描述',
  license: '协议',
  visualization: '仓库属性',
  preserve: '保存',
  public: '所有人可见',
  private: '仅自己可见',
  placeholder: {
    name: '请输入数据集名称',
    describe: '请输入内容',
  },
};
const owner = ref([]);
// const protocol = ref([]);

let queryRef = ref(null);

let query = reactive({
  owner: userInfo.userName,
  name: '',
  repo_type: 'public',
  desc: '',
  protocol: protocol[0].name,
});

try {
  owner.value = useUserInfoStore().owner;
} catch (error) {
  console.error(error);
}
function create(formEl) {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      createDataset(query)
        .then((res) => {
          router.push(`/datasets/${userInfo.userName}/${res.data.name}`);
          ElMessage({
            type: 'success',
            message: '创建成功',
          });
        })
        .catch((err) => {
          if (err.msg === 'unsupported protocol') {
            ElMessage({
              type: 'error',
              message: '暂不支持该协议',
            });
          }
        });
    } else {
      console.error('error submit!');
      return false;
    }
  });
}
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
</script>

<template>
  <div class="creating-body">
    <div class="link">
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: `/${userInfo.userName}` }"
          >个人主页</el-breadcrumb-item
        >
        <el-breadcrumb-item class="set-new">新建数据集</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <el-form ref="queryRef" class="creating-box" :model="query" prop="region">
      <el-form-item
        class="item"
        prop="owner"
        :rules="{ required: true, message: '必填项', trigger: 'change' }"
      >
        <div class="requirement">
          <icon-necessary></icon-necessary><span>{{ i18n.datasetOwner }}</span>
        </div>

        <el-select
          v-model="query.owner"
          class="m-2"
          placeholder="Select"
          size="large"
        >
          <el-option
            v-for="item in owner"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        class="item"
        prop="name"
        :rules="[
          { required: true, message: '必填项', trigger: 'blur' },
          {
            pattern: /^[^\u4e00-\u9fa5]{3,35}$/g,
            message: '暂不支持中文字符，且长度为3-35个字符',
            trigger: 'change',
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
        ]"
      >
        <div class="requirement">
          <icon-necessary></icon-necessary><span>{{ i18n.datasetName }}</span>
        </div>
        <el-input
          v-model="query.name"
          :placeholder="i18n.placeholder.name"
          size=""
        ></el-input>
        <o-popper></o-popper>
      </el-form-item>
      <el-form-item class="des item" prop="desc">
        <div>
          <span>{{ i18n.datasetDescribe }}</span>
        </div>
        <el-input
          v-model="query.desc"
          :rows="2"
          type="textarea"
          :placeholder="i18n.placeholder.describe"
          maxlength="200"
          show-word-limit
        />
      </el-form-item>
      <el-form-item
        class="item"
        prop="protocol"
        :rules="{ required: true, message: '必填项', trigger: 'change' }"
      >
        <div class="requirement">
          <icon-necessary></icon-necessary><span>{{ i18n.license }}</span>
        </div>
        <el-select
          v-model="query.protocol"
          class="m-2"
          placeholder="Select"
          size="large"
        >
          <el-option
            v-for="item in protocol"
            :key="item.id"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item class="item visualization">
        <div class="requirement text">
          <icon-necessary></icon-necessary><span>{{ i18n.visualization }}</span>
        </div>
        <div></div>
        <div class="radio">
          <el-radio v-model="query.repo_type" label="public" size="large"
            >Public</el-radio
          >
          <div class="explain1">{{ i18n.public }}</div>
          <el-radio v-model="query.repo_type" label="private" size="large"
            >Private</el-radio
          >
          <div class="explain2">{{ i18n.private }}</div>
        </div>
      </el-form-item>
      <o-button type="primary" @click="create(queryRef)">{{
        i18n.preserve
      }}</o-button>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
.creating-body {
  min-height: calc(100vh - 460px);
  height: 100%;
  width: 100%;
  padding: 0 16px;
  background: #f5f6f8;
  padding-bottom: 64px;
  opacity: 1;

  .link {
    padding: 24px 0;
    font-size: 12px;
    margin: 0 auto;
    max-width: 1416px;
    color: #555555;
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

  .creating-box {
    padding-top: 48px;
    margin: 0 auto;
    max-width: 1416px;
    background: #ffffff;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 48px;
    min-height: calc(100vh - 558px);
    border-radius: 16px;
    .des {
      align-items: center;
      padding-left: 12px;
    }
    .item {
      :deep(.el-popover.el-popper) {
        // box-shadow: 0px -10px 32px 0px rgba(45, 47, 51, 0.18);
        padding: 16px 16px 16px 16px;
        font-size: 12px;
        line-height: 16px;
        color: #656565;
        .remind {
          color: #f13b35;
        }
      }
      position: relative;
      .el-tooltip__trigger {
        cursor: pointer;
        position: absolute;
        right: -40px;
        top: 5px;
        font-size: 24px;
      }
      .requirement {
        line-height: 34px;
      }
      margin-top: 24px;
      width: 520px;
      display: flex;
      justify-content: space-between;
      :deep(.el-select__popper) {
        top: 390px;
      }
      .text {
        height: 40px;
        line-height: 40px;
        position: absolute;
        top: 1px;
      }
      .radio {
        width: 400px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .el-radio.el-radio--large {
          height: 32px;
        }

        .explain1 {
          color: #999999;
          font-size: 14px;
          padding-left: 22px;
        }
        .explain2 {
          color: #999999;
          font-size: 14px;
          padding-left: 22px;
        }
      }
    }
    .el-form-item {
      .el-form-item__cotent {
        .el-form-item__error {
          right: 0;
        }
      }
      margin: 0;
      .requirement {
        line-height: 34px;
        span {
          margin-left: 4px;
        }
      }
      margin-top: 24px;
      width: 520px;
      display: flex;
      :deep(.el-form-item__content) {
        justify-content: space-between;
      }
      justify-content: space-between;
      :deep(.el-select__popper) {
        top: 390px;
      }
      .text {
        height: 40px;
        line-height: 40px;
      }
      .radio {
        width: 400px;
        display: flex;
        flex-direction: column;
        .explain {
          color: #999999;
          font-size: 14px;
        }
      }
    }
  }
  .o-button {
    margin-top: 48px;
  }
}
</style>
