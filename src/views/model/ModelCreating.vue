<script setup>
import { reactive, ref } from 'vue';
import { useUserInfoStore } from '@/stores';

import IconPoppver from '~icons/app/popover.svg';
import IconPlus from '~icons/app/plus.svg';
import IconX from '~icons/app/x';
import IconClear from '~icons/app/clear';

import OTag from '@/components/OTag.vue';

import OButton from '@/components/OButton.vue';
import OIcon from '@/components/OIcon.vue';
import { ArrowRight } from '@element-plus/icons-vue';

import protocol from '../../../config/protocol';
import { createModelStore, checkNames, getTags } from '@/api/api-model';
import { useRouter } from 'vue-router';

const router = useRouter();
const userInfo = useUserInfoStore();

const i18n = {
  homePage: '个人主页',
  createPlaceholder: '新建模型',
  datasetOwner: '拥有者',
  datasetName: '模型',
  datasetDescribe: '描述',
  license: '协议',
  visualization: '仓库属性',
  preserve: '确定',
  public: '其他用户可浏览、使用和下载此模型，仅限你可下载与更新此模型',
  public_some: '其他用户可在线使用但不可下载此模型，仅限你可下载与更新此模型',
  private: '其他用户无法浏览、使用和下载此模型，仅限你可下载与更新此模型',
  placeholder: {
    warehouse_name: '仓库真实存储名称，具有唯一性',
    model_name: '请填写模型中文名称',
    describe: '请输入内容',
  },
};
const owner = ref([]);

const isTagShow = ref(false);
const headTags = ref([]);
const selectedTags = ref([]);

let renderList = ref([]);
const tabPosition = ref('left');

let queryRef = ref(null);

let query = reactive({
  owner: userInfo.userName,
  name: '',
  title: '',
  desc: '',
  protocol: protocol[0].name,
  repo_type: 'public',
  tags: [],
});

try {
  owner.value = useUserInfoStore().owner;
} catch (error) {
  console.error(error);
}

function createModel(formEl) {
  if (!formEl) return;

  headTags.value.forEach((item) => {
    query.tags.push(item.name);
  });

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
  }, 500);
}

let dialogList = {
  head: {
    title: '已选标签',
    delete: '清除全部',
  },
  tags: [],

  menuList: [
    { tab: '应用分类', key: 'task' },
    { tab: '处理器', key: 'device_target' },
    { tab: '文件格式', key: 'model_format' },
    { tab: '框架', key: 'libraries' },
    { tab: '协议', key: 'licenses' },
    { tab: '其他', key: 'tags' },
  ],
};
// 获取标签
function getModelTags(type) {
  try {
    getTags(type).then((res) => {
      renderList.value = res.data;

      renderList.value.forEach((value1, index1) => {
        renderList.value[index1].items.forEach((value2, index2) => {
          renderList.value[index1].items[index2].items.forEach(
            (value3, index3) => {
              renderList.value[index1].items[index2].items[index3] = {
                name: value3,
                isActive: false,
              };
            }
          );
        });
      });
    });
  } catch (e) {
    console.error(re);
  }
}
getModelTags('model');

// 添加按钮
function addModelTags() {
  isTagShow.value = true;
}
// 确认
function confirmBtn() {
  isTagShow.value = false;
  headTags.value = [];
  renderList.value.forEach((value1, index1) => {
    renderList.value[index1].items.forEach((value2, index2) => {
      renderList.value[index1].items[index2].items.forEach((value3) => {
        if (value3.isActive) {
          headTags.value.push(value3);
        }
      });
    });
  });
}
// 取消
function cancelBtn() {
  isTagShow.value = false;
}
// 选择要添加的标签
function selectTags(it) {
  it.isActive = !it.isActive;

  if (it.isActive) {
    selectedTags.value.push(it);
  } else {
    selectedTags.value.forEach((item, index) => {
      if (item.name === it.name) {
        selectedTags.value.splice(index, 1);
      }
    });
  }
}
// 删除头部标签
function deleteTag(val) {
  let index = selectedTags.value.indexOf(val);
  selectedTags.value.splice(index, 1);

  renderList.value.forEach((value1, index1) => {
    renderList.value[index1].items.forEach((value2, index2) => {
      renderList.value[index1].items[index2].items.forEach((value3) => {
        if (val === value3) {
          value3.isActive = false;
        }
      });
    });
  });
}
// 删除所有标签
function deleteAllTags() {
  selectedTags.value = [];
  renderList.value.forEach((value1, index1) => {
    renderList.value[index1].items.forEach((value2, index2) => {
      renderList.value[index1].items[index2].items.forEach((value3) => {
        value3.isActive = false;
      });
    });
  });
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
                  ]"
                >
                  <el-input
                    v-model="query.name"
                    :placeholder="i18n.placeholder.warehouse_name"
                  ></el-input>
                  <o-popper></o-popper>
                </el-form-item>
              </div>
            </div>
            <!-- 模型标题 -->
            <div class="create-item">
              <div class="create-title-unnecessary">模型标题</div>
              <div class="create-item-right">
                <el-form-item
                  class="item"
                  prop="title"
                  :rules="[
                    {
                      validator: (rule, value, callback) => {
                        if (value && (value.length < 3 || value.length > 35)) {
                          callback('模型中文名称长度为3-35个字符');
                        } else {
                          callback();
                        }
                      },
                      trigger: 'blur',
                    },
                  ]"
                >
                  <el-input
                    v-model="query.title"
                    :placeholder="i18n.placeholder.model_name"
                  ></el-input>
                  <el-popover
                    placement="bottom-start"
                    :width="320"
                    trigger="hover"
                    :teleported="false"
                  >
                    <template #reference>
                      <o-icon><icon-poppver></icon-poppver></o-icon>
                    </template>
                    <div>- 模型标题支持中文或者英文</div>
                    <div>- 长度为 <span class="remind">3-35个字符</span></div>
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
            <div class="create-item create-item-tag">
              <div
                class="create-title-unnecessary create-title-2 create-title-tag"
              >
                标签
              </div>

              <div class="create-item-right">
                <div class="tags-contain">
                  <OTag
                    v-for="item in headTags"
                    :key="item.name"
                    class="tag-item"
                    round
                    >{{ item.name }}</OTag
                  >

                  <OTag round class="add-tags" @click="addModelTags">
                    <OIcon class="add-icon"><icon-plus></icon-plus></OIcon>
                    <span class="add-text">添加标签</span>
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
                      label="public"
                      size="large"
                      >完全公开</el-radio
                    >
                    <div class="explain">{{ i18n.public }}</div>
                    <el-radio
                      v-model="query.repo_type"
                      label="online"
                      size="large"
                      >部分公开</el-radio
                    >
                    <div class="explain">{{ i18n.public_some }}</div>
                    <el-radio
                      v-model="query.repo_type"
                      label="private"
                      size="large"
                      >私有</el-radio
                    >
                    <div class="explain">{{ i18n.private }}</div>
                  </div>
                </el-form-item>
              </div>
            </div>

            <div class="create-button">
              <o-button type="primary" @click="createModel(queryRef)">{{
                i18n.preserve
              }}</o-button>
            </div>
          </el-form>
        </div>
      </div>

      <!-- 标签管理 -->
      <div class="tags-box">
        <el-dialog
          v-model="isTagShow"
          width="800px"
          align-center
          :show-close="false"
          destroy-on-close
        >
          <template #header="{ titleId, title }">
            <div :id="titleId" :class="title">
              <div class="dialog-head">
                <div class="dialog-head-top">
                  <div class="head-title">{{ dialogList.head.title }}</div>
                  <div class="head-delete" @click="deleteAllTags">
                    <o-icon><icon-clear></icon-clear></o-icon>
                    {{ dialogList.head.delete }}
                  </div>
                </div>

                <div class="head-tags">
                  <div
                    v-for="it in selectedTags"
                    :key="it"
                    class="dlg-condition-detail"
                  >
                    {{ it.name }}
                    <o-icon class="icon-x" @click="deleteTag(it)"
                      ><icon-x></icon-x
                    ></o-icon>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <div class="dialog-body">
            <el-tabs :tab-position="tabPosition" style="height: 100%">
              <el-tab-pane
                v-for="(menu, index) in renderList"
                :key="menu.Name"
                :label="menu.domain"
              >
                <div class="body-right-container">
                  <div
                    v-for="item in renderList[index].items"
                    :key="item.kind"
                    class="detail-box"
                  >
                    <div>
                      <p class="tan-title">
                        {{ item.kind }}
                      </p>
                      <div class="tag-box">
                        <div
                          v-for="it in item.items"
                          :key="it"
                          class="condition-detail"
                          :class="{ 'condition-active': it.isActive }"
                          @click="selectTags(it)"
                        >
                          {{ it.name === 'electricity' ? '电力' : it.name }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
          <template #footer>
            <div class="btn-box" style="display: flex; justify-content: center">
              <o-button style="margin-right: 16px" @click="cancelBtn"
                >取消</o-button
              >
              <o-button type="primary" @click="confirmBtn">确定</o-button>
            </div>
          </template>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$theme: #0d8dff;
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
    right: -32px;
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
    font-size: 14px;
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
.create-item-tag {
  margin-top: 16px;
}
.create-title-1 {
  align-self: flex-start;
  margin-top: 8px;
}
.create-title-2 {
  align-self: flex-start;
}
.create-title-tag {
  margin-top: 8px;
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
  margin-top: 8px;
}
.add-tags {
  display: flex;
  align-items: center;
  margin-top: 8px;
  border: 1px dashed #0d8dff;
  cursor: pointer;
  .add-text {
    line-height: 16px;
  }
}
.add-icon {
  font-size: 16px;
  margin-right: 4px;
}
.create-button {
  margin-top: 40px;
  display: flex;
  justify-content: center;
}
.dialog-head {
  display: flex;
  flex-direction: column;
  .dialog-head-top {
    width: 720px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .head-title {
      margin-right: 16px;
      font-size: 18px;
      line-height: 24px;
      min-width: 72px;
    }
    .head-delete {
      font-size: 12px;
      line-height: 18px;
      color: #555;
      display: flex;
      align-items: center;
      cursor: pointer;
      .o-icon {
        font-size: 16px;
        margin-right: 6px;
        align-self: center;
      }
    }
  }

  .icon-x {
    margin-left: 4px;
  }
  .head-tags {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    margin-top: 6px;
    .dlg-condition-detail {
      cursor: pointer;
      display: flex;
      align-items: center;
      padding: 0px 10px 0 12px;
      margin: 10px 16px 0 0;
      height: 24px;
      font-size: 14px;
      color: $theme;
      user-select: none;
      background-color: #f3f9ff;
      border-radius: 14px;
      border: 1px solid #e5e5e5;
      .icon-x {
        padding: 2px;
        font-size: 20px;
      }
    }
    .condition-active {
      color: $theme;
    }
  }
}
.dialog-body {
  text-align: left;
  border-top: 1px solid #d8d8d8;
  :deep(.el-tabs__item) {
    width: 188px;
    height: 56px;
    text-align: left;
    line-height: 56px;
    font-size: 18px;
    padding-left: 24px;
  }
  :deep(.el-tabs .el-tabs__header) {
    box-shadow: none;
    min-height: 320px;
    background: #f7f8fa;
  }
  :deep(.el-tabs__nav) {
    background: #f7f8fa;
  }

  .el-tabs--left,
  .el-tabs--right {
    border-bottom: 1px solid #d8d8d8;
  }
  :deep .el-tabs__item.is-active {
    background: #fff;
  }
  .tan-title {
    margin: 14px 0;
  }
  .noTask-box {
    display: flex;
    flex-wrap: wrap;
  }
  .detail-box {
    .tag-box {
      display: flex;
      flex-wrap: wrap;
    }
  }
  .condition-detail {
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 0 12px;
    margin: 0 16px 16px 0;
    height: 28px;
    font-size: 14px;
    color: #555;
    user-select: none;
    background-color: #f3f9ff;
    border-radius: 14px;
    border: 1px solid #e5e5e5;
  }
  .condition-active {
    color: $theme;
  }
  .condition-single {
    color: #ccc;
  }
  .body-right-container {
    padding-left: 24px;
    height: 320px;
    overflow-y: scroll;
    .noTask-box {
      display: flex;
    }
    .body-right {
      .tan-title {
        font-size: 16px;
        line-height: 24px;
      }
      .el-tag {
        margin: 13px 16px 29px 0;
      }
    }
  }
  .body-right-container::-webkit-scrollbar {
    width: 10px;
  }
  .body-right-container::-webkit-scrollbar-thumb {
    background: #bfbfbf;
    border-radius: 10px;
  }
}
</style>
