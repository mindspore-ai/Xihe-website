<script setup>
import { reactive, ref } from 'vue';
import { useUserInfoStore } from '@/stores';

import IconNecessary from '~icons/app/necessary.svg';
import IconPlus from '~icons/app/plus.svg';
import IconX from '~icons/app/x';
import IconClear from '~icons/app/clear2';
import IconPoppver from '~icons/app/popover.svg';

import { ArrowRight } from '@element-plus/icons-vue';
import OButton from '@/components/OButton.vue';

import protocol from '../../shared/config/protocol';
import { createDataset, checkNames, getTags } from '@/api/api-dataset';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
const router = useRouter();
const userInfo = useUserInfoStore();
const i18n = {
  homePage: '个人主页',
  createPlaceholder: '新建数据集',
  datasetOwner: '拥有者',
  repoName: '仓库名称',
  title: '数据集标题',
  datasetDescribe: '描述',
  tag: '标签',
  license: '协议',
  visualization: '仓库属性',
  preserve: '保存',
  public: '其他用户可浏览、使用和下载此数据集，仅限你可下载与更新此数据集。',
  online: '其他用户可在线使用但不可下载此数据集，仅限你可下载与更新此数据集。',
  private: '其他用户无法浏览、使用和下载此数据集，仅限你可下载与更新此数据集。',
  placeholder: {
    repo: '仓库真实存储名称，具有唯一性',
    name: '请填写数据集中文名称',
    describe: '请输入内容',
  },
};

let queryRef = ref(null);

let query = reactive({
  owner: userInfo.userName,
  name: '',
  title: '',
  repo_type: 'public',
  desc: '',
  protocol: protocol[0].name,
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

function create(formEl) {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      headTags.value.forEach((item) => {
        query.tags.push(item.name);
      });

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
    ElMessage({
      type: 'error',
      message: 'error',
    });
  }
}
getModelTags('dataset');

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
            v-for="item in userInfo.owner"
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
        <div class="requirement">
          <icon-necessary></icon-necessary><span>{{ i18n.repoName }}</span>
        </div>
        <el-input
          v-model="query.name"
          :placeholder="i18n.placeholder.repo"
          size=""
        ></el-input>
        <o-popper></o-popper>
      </el-form-item>
      <el-form-item
        class="des item"
        prop="title"
        :rules="[
          {
            validator: (rule, value, callback) => {
              if (value && (value.length < 3 || value.length > 35)) {
                callback('数据集标题长度为3-35个字符');
              } else {
                callback();
              }
            },
            trigger: 'blur',
          },
        ]"
      >
        <div>
          <span>{{ i18n.title }}</span>
        </div>
        <el-input
          v-model="query.title"
          :placeholder="i18n.placeholder.name"
          size=""
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
          <div>- 数据集标题支持中文或者英文</div>
          <div>- 长度为 <span class="remind">3-35个字符</span></div>
        </el-popover>
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
      <el-form-item class="des item">
        <div>
          <span>{{ i18n.tag }}</span>
        </div>
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
            >完全公开</el-radio
          >
          <div class="explain">{{ i18n.public }}</div>
          <el-radio v-model="query.repo_type" label="online" size="large"
            >部分公开</el-radio
          >
          <div class="explain">{{ i18n.online }}</div>
          <el-radio v-model="query.repo_type" label="private" size="large"
            >私有</el-radio
          >
          <div class="explain">{{ i18n.private }}</div>
        </div>
      </el-form-item>
      <o-button type="primary" @click="create(queryRef)">{{
        i18n.preserve
      }}</o-button>
    </el-form>
  </div>

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

  .creating-box {
    padding-top: 16px;
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
        right: -32px;
        top: 5px;
        font-size: 24px;
      }
      .requirement {
        line-height: 34px;
      }
      margin-top: 24px;
      width: 700px;
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
          height: 24px;
        }

        .explain {
          color: #999999;
          font-size: 14px;
          padding-left: 22px;
          white-space: pre;
        }
        .explain {
          color: #999999;
          font-size: 14px;
          padding-left: 22px;
        }
      }
    }
    .el-form-item {
      .el-form-item__content {
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
      width: 700px;
      display: flex;
      :deep(.el-form-item__content) {
        justify-content: space-between;
        font-size: 16px;
      }
      justify-content: space-between;
      :deep(.el-select__popper) {
        top: 390px;
      }
      .text {
        // height: 40px;
        line-height: 24px;
      }
      .radio {
        width: 580px;
        display: flex;
        flex-direction: column;
        .explain {
          color: #999999;
          font-size: 14px;
          margin-bottom: 8px;
        }
      }
      .el-input {
        width: 580px;
      }
      .el-textarea {
        width: 580px;
      }
      .el-select {
        width: 580px;
      }
      .tags-contain {
        width: 580px;
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
        cursor: pointer;
        border: 1px dashed #0d8dff;
        .add-text {
          line-height: 16px;
        }
      }
      .add-icon {
        font-size: 16px;
        margin-right: 4px;
      }
    }
  }
  .o-button {
    margin-top: 48px;
  }
}
$theme: #0d8dff;
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
