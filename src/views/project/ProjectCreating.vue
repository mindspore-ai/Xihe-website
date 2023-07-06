<script setup>
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

import protocol from '../../../config/protocol';
import { trainSdk, inferSdk, projectPhoto } from '../../../config/protocol';
import { setNewProject, checkNames, getTags } from '@/api/api-project.js';

import { useUserInfoStore } from '@/stores';

import OTag from '@/components/OTag.vue';
import OButton from '@/components/OButton.vue';
import OIcon from '@/components/OIcon.vue';
import IconX from '~icons/app/x';

import IconNecessary from '~icons/app/necessary.svg';
import IconPlus from '~icons/app/plus.svg';
import IconClear from '~icons/app/clear2';
import IconPoppver from '~icons/app/popover.svg';

import { ElMessage } from 'element-plus';
import { ArrowRight } from '@element-plus/icons-vue';

const userInfo = useUserInfoStore();
const router = useRouter();
const i18n = {
  create: '新建项目',
  owner: '拥有者',
  storage_name: '仓库名称',
  pro_name: '项目标题',
  input_proName1: '仓库真实存储名称，具有唯一性',
  input_proName2: '请填写项目中文名称',
  pro_img: '项目封面',
  desc: '描述',
  input_text: '请输入内容',
  licenses: '协议',
  tags: '标签',
  train_sdk: '训练平台',
  infer_sdk: '项目类型',
  view: '仓库属性',
  submit: '提交',
  public:
    '其他用户可浏览、使用和下载此AI实验室项目，仅限你可下载与更新此AI实验室项目',
  public_some:
    '其他用户可在线使用但不可下载此AI实验室项目，仅限你可下载与更新此AI实验室项目',
  private:
    '其他用户无法浏览、使用和下载此AI实验室项目，仅限你可下载与更新此AI实验室项目',
};

// 表单信息
const proList = reactive({
  owner: '',
  cover_id: '1',
  name: '',
  title: '',
  desc: '',
  protocol: protocol[0].name,
  training: '',
  type: '',
  repo_type: 'public',
  tags: [],
});

const isTagShow = ref(false);
const headTags = ref([]);
const selectedTags = ref([]);
let renderList = ref([]);
const tabPosition = ref('left');

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

const ruleFormRef = ref(null);
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
      pattern: /^(?!.*\.|^$).*[^.]$/,
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
  title: [
    {
      validator: (rule, value, callback) => {
        if (value && (value.length < 3 || value.length > 35)) {
          callback(new Error('项目中文名称长度为3-35个字符'));
        } else {
          callback();
        }
      },
      trigger: 'blur',
    },
  ],
  desc: [{ min: 1, max: 200, message: '内容不能为空', trigger: 'blur' }],
});

const nameList = ref([]);
const projectPhotos = ref(projectPhoto);

nameList.value.push(userInfo.userName);
proList.owner = nameList.value[0];

// 新建项目
function setProject() {
  headTags.value.forEach((item) => {
    proList.tags.push(item.name);
  });
  setNewProject(proList)
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

// 项目封面，项目类型以及训练平台的数据
projectPhotos.value[0].is_active = true;

proList.type = inferSdk[0].name;
proList.training = trainSdk[0].name;

onMounted(() => {});

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
  } catch (err) {
    return err;
  }
}
getModelTags('project');

// 添加按钮
function addProjectTags() {
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
              v-model="proList.name"
              :placeholder="i18n.input_proName1"
            ></el-input>
            <o-popper></o-popper>
          </el-form-item>
        </div>
        <!-- 项目中文名称 -->
        <div class="form-item">
          <el-form-item
            class="item-title name"
            :label="i18n.pro_name"
            prop="title"
          >
            <el-input
              v-model="proList.title"
              :placeholder="i18n.input_proName2"
            ></el-input>
            <el-popover
              placement="bottom-start"
              :width="320"
              trigger="hover"
              :teleported="false"
            >
              <template #reference>
                <o-icon class="tip-icon"><icon-poppver></icon-poppver></o-icon>
              </template>
              <div>- 项目标题支持中文或者英文</div>
              <div>- 长度为 <span class="remind">3-35个字符</span></div>
            </el-popover>
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
          <el-form-item :label="i18n.desc" prop="desc" class="item-title">
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
        <!-- 标签 -->
        <div class="form-item">
          <el-form-item :label="i18n.tags" class="item-title">
            <div class="create-item-right">
              <div class="tags-contain">
                <OTag
                  v-for="item in headTags"
                  :key="item.name"
                  class="tag-item"
                  round
                  >{{ item.name === 'electricity' ? '电力' : item.name }}</OTag
                >

                <OTag round class="add-tags" @click="addProjectTags">
                  <OIcon class="add-icon"><icon-plus></icon-plus></OIcon>
                  <span class="add-text">添加标签</span>
                </OTag>
              </div>
            </div>
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
              <el-radio v-model="proList.repo_type" label="public" size="large"
                >完全公开</el-radio
              >
              <div class="explain">{{ i18n.public }}</div>
              <el-radio v-model="proList.repo_type" label="online" size="large"
                >部分公开</el-radio
              >
              <div class="explain">{{ i18n.public_some }}</div>
              <el-radio v-model="proList.repo_type" label="private" size="large"
                >私有</el-radio
              >
              <div class="explain">{{ i18n.private }}</div>
            </div>
          </el-form-item>
        </div>
        <div class="save-btn">
          <o-button type="primary" @click="submitClick">确定</o-button>
        </div>
      </el-form>
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
                  <span>
                    {{ dialogList.head.delete }}
                  </span>
                </div>
              </div>

              <div class="head-tags">
                <div
                  v-for="it in selectedTags"
                  :key="it"
                  class="dlg-condition-detail"
                >
                  {{ it.name === 'electricity' ? '电力' : it.name }}
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
</template>

<style lang="scss" scoped>
$theme: #0d8dff;

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
  :deep(.el-breadcrumb) {
    font-size: 14px;
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
  min-height: 1186px;
  background: #ffffff;
  padding-top: 48px;
  padding-bottom: 40px;
  border-radius: 16px;

  .el-form {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    --el-form-label-font-size: 16px;
    :deep .el-form-item__label {
      padding-right: 22px;
      line-height: 22px;
      height: 22px;
      margin-left: 4px;
      color: #000;
    }

    .form-item {
      display: flex;
      align-items: center;
      .o-icon.normal {
        font-size: 8px;
      }
      .img-warning {
        font-size: 8px;
        margin-top: 6px;
        align-self: start;
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
        align-self: flex-start;
        padding-top: 6px;
      }
      .el-form-item {
        display: flex;
        align-items: center;
      }
      :deep(.item-title) {
        .el-form-item__label {
          margin-left: 12px;
        }
      }
      .create-item-right {
        // flex: 1;
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
      }
      .item-img {
        align-items: flex-start;
      }
    }
    .item-img {
      cursor: pointer;
      :deep(.el-form-item__content) {
        line-height: inherit;
        display: grid;
        grid-template-columns: repeat(2, 152px);
        grid-template-rows: repeat(2, 86px);
        grid-gap: 16px;
      }
      .image {
        position: relative;
        .el-image {
          // margin-right: 16px;
          width: 152px;
          height: 86px;
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
        .remind {
          color: #f13b35;
        }
      }
      .o-icon {
        position: absolute;
        right: -28px;
        font-size: 24px;
      }
    }
    .item-title {
      .remind {
        color: #f13b35;
      }
      .tip-icon {
        position: absolute;
        right: -32px;
        font-size: 24px;
      }
    }

    .el-form-item {
      margin-bottom: 24px;
      .el-select {
        width: 400px;
        width: 580px;
      }
      .el-input {
        width: 580px;
      }
      .el-textarea {
        width: 580px;
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
    }
    .visual {
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
}
.tags-box {
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
}
</style>
