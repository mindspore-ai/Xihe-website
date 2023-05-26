<script setup>
import { reactive, ref } from 'vue';
import { useUserInfoStore } from '@/stores';

import IconPoppver from '~icons/app/popover.svg';
import IconPlus from '~icons/app/plus.svg';

import OTag from '@/components/OTag.vue';

import OButton from '@/components/OButton.vue';
import OIcon from '@/components/OIcon.vue';
import { ArrowRight } from '@element-plus/icons-vue';

import protocol from '../../../config/protocol';
import { createModelStore, checkNames } from '@/api/api-model';
import { useRouter } from 'vue-router';

const router = useRouter();
const userInfo = useUserInfoStore();

const i18n = {
  homePage: '个人主页',
  createPlaceholder: '新建模型',
  datasetOwner: '拥有者',
  datasetName: '模型名称',
  datasetDescribe: '描述',
  license: '协议',
  visualization: '仓库属性',
  preserve: '确定',
  public:
    '其他用户可浏览、收藏、下载你的模型，但仅有你及你的团队成员才可编辑此模型',
  public_some:
    '其他用户可浏览、收藏你的目模型，但仅有你及你的团队可以下载文件和编辑模型',
  private:
    '其他用户将无法搜索、查看你的模型，仅你及你的团队成员可查看和编辑此模型',
  placeholder: {
    warehouse_name: '仓库真实存储名称，具有唯一性',
    model_name: '请填写模型中文名称',
    describe: '请输入内容',
  },
};
const owner = ref([]);
// const protocol = ref([]);

let queryRef = ref(null);

let query = reactive({
  owner: userInfo.userName,
  name: '',
  repo_type: '完全公开',
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
      createModelStore(query)
        .then((res) => {
          ElMessage({
            type: 'success',
            message: '创建成功',
          });
          router.push(`/models/${res.data.owner}/${res.data.name}/tree`);
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
  <div class="model-create">
    <div class="model-create-inner">
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: `/${userInfo.userName}` }"
          >个人主页</el-breadcrumb-item
        >
        <el-breadcrumb-item class="set-new">新建模型</el-breadcrumb-item>
      </el-breadcrumb>

      <div class="create-inner-main">
        <div class="main-contain">
          <el-form
            ref="queryRef"
            class="creating-box"
            :model="query"
            prop="region"
          >
            <!-- 拥有者 -->
            <div class="create-item">
              <div class="create-title">拥有者</div>

              <div class="create-item-right">
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
              </div>
            </div>
            <!-- 仓库名称 -->
            <div class="create-item">
              <div class="create-title">仓库名称</div>

              <div class="create-item-right">
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
                  <el-input
                    v-model="query.name"
                    :placeholder="i18n.placeholder.warehouse_name"
                    size=""
                  ></el-input>
                  <el-popover
                    placement="bottom-start"
                    :width="372"
                    trigger="hover"
                    content="this is content, this is content, this is content"
                    :teleported="false"
                  >
                    <template #reference>
                      <o-icon><icon-poppver></icon-poppver></o-icon>
                    </template>
                    <div>- 仓库名目前只支持英文</div>
                    <div>
                      - 仓库名不能以英文句号(<span class="remind">.</span
                      >)开头或结尾，且不能包含以下字符<span class="remind"
                        >>&nbsp;:&nbsp;/&nbsp;\:*?'&lt;&gt;|</span
                      >
                    </div>
                    <div>
                      - 仓库名不能连续两个及以上中划线（-）或下划线（_）
                    </div>
                    <div>
                      -&nbsp;仓库名建议简短<span class="remind"
                        >(3-35个字符)</span
                      >，仓库下的文件或文件夹绝对路径长度<span class="remind"
                        >不能超过1000字符</span
                      >，例如：仓库下的文件file_name，文件名长度是按照project_name/folder_name/file_name的字符计算
                    </div>
                  </el-popover>
                </el-form-item>
              </div>
            </div>
            <!-- 模型名称 -->
            <div class="create-item">
              <div class="create-title-unnecessary">模型名称</div>
              <div class="create-item-right">
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
                  <el-input
                    v-model="query.name"
                    :placeholder="i18n.placeholder.model_name"
                    size=""
                  ></el-input>
                  <el-popover
                    placement="bottom-start"
                    :width="372"
                    trigger="hover"
                    content="this is content, this is content, this is content"
                    :teleported="false"
                  >
                    <template #reference>
                      <o-icon><icon-poppver></icon-poppver></o-icon>
                    </template>
                    <div>- 仓库名目前只支持英文</div>
                    <div>
                      - 仓库名不能以英文句号(<span class="remind">.</span
                      >)开头或结尾，且不能包含以下字符<span class="remind"
                        >>&nbsp;:&nbsp;/&nbsp;\:*?'&lt;&gt;|</span
                      >
                    </div>
                    <div>
                      - 仓库名不能连续两个及以上中划线（-）或下划线（_）
                    </div>
                    <div>
                      -&nbsp;仓库名建议简短<span class="remind"
                        >(3-35个字符)</span
                      >，仓库下的文件或文件夹绝对路径长度<span class="remind"
                        >不能超过1000字符</span
                      >，例如：仓库下的文件file_name，文件名长度是按照project_name/folder_name/file_name的字符计算
                    </div>
                  </el-popover>
                </el-form-item>
              </div>
            </div>
            <!-- 描述 -->
            <div class="create-item">
              <div class="create-title create-title-1">描述</div>

              <div class="create-item-right">
                <el-form-item prop="desc">
                  <el-input
                    v-model="query.desc"
                    :rows="2"
                    type="textarea"
                    :placeholder="i18n.placeholder.describe"
                    maxlength="200"
                    show-word-limit
                  />
                </el-form-item>
              </div>
            </div>
            <!-- 标签 -->
            <div class="create-item">
              <div class="create-title-unnecessary">标签</div>

              <div class="create-item-right">
                <div class="tags-contain">
                  <OTag class="tag-item" round>标签1</OTag>
                  <OTag class="tag-item" round>标签2</OTag>
                  <OTag class="tag-item" round>标签3</OTag>

                  <OTag round>
                    <div class="add-tags">
                      <OIcon class="add-icon"><icon-plus></icon-plus></OIcon>
                      <span class="add-text">添加标签</span>
                    </div>
                  </OTag>
                </div>
              </div>
            </div>
            <!-- 协议 -->
            <div class="create-item">
              <div class="create-title">协议</div>

              <div class="create-item-right">
                <el-form-item
                  class="item"
                  prop="protocol"
                  :rules="{
                    required: true,
                    message: '必填项',
                    trigger: 'change',
                  }"
                >
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
              </div>
            </div>
            <!-- 仓库属性 -->
            <div class="create-item">
              <div class="create-title create-title-2">仓库属性</div>

              <div class="create-item-right">
                <el-form-item>
                  <div class="radio">
                    <el-radio
                      v-model="query.repo_type"
                      label="完全公开"
                      size="large"
                      >完全公开</el-radio
                    >
                    <div class="explain">{{ i18n.public }}</div>
                    <el-radio
                      v-model="query.repo_type"
                      label="部分公开"
                      size="large"
                      >部分公开</el-radio
                    >
                    <div class="explain">{{ i18n.public_some }}</div>
                    <el-radio
                      v-model="query.repo_type"
                      label="私有"
                      size="large"
                      >私有</el-radio
                    >
                    <div class="explain">{{ i18n.private }}</div>
                  </div>
                </el-form-item>
              </div>
            </div>

            <div class="create-button">
              <o-button type="primary" @click="create(queryRef)">{{
                i18n.preserve
              }}</o-button>
            </div>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.el-form-item {
  margin: 0;
  display: flex;
  .el-input,
  .el-textarea {
    width: 100%;
  }
  .el-popover.el-popper {
    padding: 24px 16px 16px 16px;
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

  :deep(.el-form-item__content) {
    justify-content: space-between;
  }
  :deep(.el-select__popper) {
    top: 390px;
  }
  .text {
    height: 40px;
    line-height: 40px;
  }
  .radio {
    display: flex;
    flex-direction: column;
    .explain {
      width: 580px;
      line-height: 22px;
      height: 22px;
      color: #999999;
      font-size: 14px;
      margin-top: 8px;
      margin-bottom: 16px;
      padding-left: 24px;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
.model-create {
  padding: 24px 0 64px;
}
.model-create-inner {
  max-width: 1416px;
  margin: 0 auto;
  :deep(.el-breadcrumb) {
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
.create-inner-main {
  margin-top: 24px;
  background: #fff;
  border-radius: 16px;
  padding: 40px;
}
.main-contain {
  max-width: 688px;
  margin: 0 auto;
}
.create-item {
  display: flex;
  align-items: center;
  margin-top: 24px;
  &:first-child {
    margin-top: 0;
  }
}
.create-title-1 {
  align-self: flex-start;
  margin-top: 8px;
}
.create-title-2 {
  align-self: flex-start;
}
.create-title {
  width: 108px;
  position: relative;
  font-size: 16px;
  line-height: 24px;
  color: #000000;
  &::before {
    content: '*';
    color: #e60012;
    font-size: 18px;
    position: absolute;
    left: -12px;
    top: 4px;
  }
}
.create-title-unnecessary {
  width: 108px;
  font-size: 16px;
  line-height: 24px;
  color: #000000;
}
.create-item-right {
  flex: 1;
  :deep(.el-select) {
    width: 100%;
  }
}
.tags-contain {
  display: flex;
  flex-wrap: wrap;
}
.tag-item {
  margin-right: 8px;
}
.add-tags {
  display: flex;
  align-items: center;
  cursor: pointer;
  .add-text {
    line-height: 18px;
  }
}
.add-icon {
  font-size: 14px;
  margin-right: 4px;
}
.create-button {
  margin-top: 40px;
  display: flex;
  justify-content: center;
}
</style>
