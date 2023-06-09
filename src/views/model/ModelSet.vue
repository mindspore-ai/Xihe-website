<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import OButton from '@/components/OButton.vue';
import OSelect from '@/components/OSelect.vue';

import { ElMessage } from 'element-plus';
import { ElDialog } from 'element-plus';

import { useUserInfoStore, useFileData } from '@/stores';
import { modifyModel, deleteModel } from '@/api/api-model';

import IconPoppver from '~icons/app/popover.svg';
import warningImg from '@/assets/icons/warning.png';
import successImg from '@/assets/icons/success.png';

let detailData = useFileData().fileStoreData;

const router = useRouter();
let routerParams = router.currentRoute.value.params;

const userInfoStore = useUserInfoStore();
const organizationAdminList = userInfoStore.organizationAdminList;

const i18n = {
  new_model_name: {
    title: '新模型标题',
    placeholder: '请输入新项模型标题',
  },
  visible: {
    title: '仓库属性',
    description: '更改描述',
    tip: '其他用户将无法搜索、查看你的项目，仅你及你的团队成员可查看和编辑此项目仓库',
    options: [
      {
        value: 'Private',
        label: '私有',
        id: 1,
        describe:
          '其他用户将无法搜索、查看你的模型，仅你及你的团队成员可查看和编辑此模型仓库。',
      },
      {
        value: 'Online',
        label: '部分公开',
        id: 2,
        describe:
          '其他用户可浏览、收藏、下载你的模型，但仅有你及你的团队成员才可编辑此模型仓库。',
      },
      {
        value: 'Public',
        label: '全部公开',
        id: 3,
        describe:
          '其他用户可浏览、收藏、下载你的模型，但仅有你及你的团队成员才可编辑此模型仓库。',
      },
    ],
    btnText: '确定',
  },
  rename: {
    title: '重命名和转移',
    newOwn: '新拥有者',
    newName: '新仓库名',
    placeholder: '请输入仓库名',
    describe: '你可重命名模型仓库，并转移你的模型仓库至组织。',
    btnText: '确定',
  },
  delete: {
    title: '删除模型',
    describe:
      '此操作将会删除与模型相关的所有资源，且此操作不可逆，请谨慎确认是否要删除此模型。',
    describe1: '此删除不可逆，确认删除吗？',
    describe2: '删除成功，你可再次创建新模型，点击确定回到个人主页。',
    btnText: '删除',
    cancel: '取消',
    confirm: '确认',
  },
};

const visibleOptions = reactive(i18n.visible.options);
const visibleValue = ref(detailData.repo_type);
const description = ref(detailData.desc);
const modelTitle = ref(detailData.title);

const newOwn = ref('');
const visibleIndex = ref(0);
const showDel = ref(false);
const showConfirm = ref(false); // 控制删除成功跳转个人主页弹窗
const queryRef = ref(null);

let query = reactive({
  name: detailData.name,
});

if (detailData.repo_type === 'private') visibleIndex.value = 0;
else if (detailData.repo_type === 'online') visibleIndex.value = 1;
else visibleIndex.value = 2;

function getIndex(value) {
  visibleIndex.value = value;
}
function getOwnSelect(value) {
  newOwn.value = value;
}
function getVisiableSelect(value) {
  console.log(value);
  if (value === 'Private') {
    visibleValue.value = 'private';
  } else if (value === 'Public') {
    visibleValue.value = 'public';
  } else {
    visibleValue.value = 'online';
  }
}

async function confirmRename(formEl) {
  if (!formEl) return;
  if (!query.name.trim()) {
    return false;
  }
  formEl.validate((valid) => {
    if (valid) {
      try {
        modifyModel(query, detailData.owner, detailData.id).then((res) => {
          // 改名成功更新pinia数据
          detailData.name = res.data.name;
          ElMessage({
            type: 'success',
            message: '仓库信息更新成功',
          });
          router.push({
            name: 'modelSet',
            params: {
              user: routerParams.user,
              name: detailData.name,
            },
          });
          detailData.name = query.name;
        });
      } catch (error) {
        ElMessage({
          type: 'error',
          message: error,
        });
      }
    } else {
      console.error('error submit!');
      return false;
    }
  });
}
function confirmPrivate() {
  let query = {
    type: visibleValue.value,
    desc: description.value,
    title: modelTitle.value,
  };
  modifyModel(query, detailData.owner, detailData.id)
    .then((res) => {
      detailData.desc = res.data.desc;
      detailData.repo_type = res.data.repo_type;
      detailData.title = res.data.title;
      ElMessage({
        type: 'success',
        message: '修改成功',
      });
    })
    .catch(() => {
      ElMessage({
        type: 'error',
        message: '修改失败，请待会重试',
      });
    });
}
function confirmDel() {
  deleteModel(detailData.owner, detailData.name)
    .then(() => {
      showDel.value = false;
      showConfirm.value = true;
    })
    .catch(() => {
      ElMessage({
        type: 'error',
        message: '删除失败',
      });
    });
}
function toggleDelDlg(flag) {
  if (flag === undefined) {
    showDel.value = !showDel.value;
  } else {
    showDel.value = flag;
  }
}
</script>
<template>
  <div class="model-set">
    <div class="model-set-top">
      <div class="wrap">
        <!-- 新模型名 -->
        <div class="set-item">
          <div class="set-title">
            {{ i18n.new_model_name.title }}
          </div>

          <el-form ref="queryRef" :model="query" prop="region" @submit.prevent>
            <el-form-item
              class="item"
              prop="name"
              :rules="[
                { required: true, message: '必填项', trigger: 'blur' },
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
              ]"
            >
              <el-input
                v-model="modelTitle"
                :placeholder="i18n.new_model_name.placeholder"
              >
              </el-input>
            </el-form-item>
          </el-form>
        </div>
        <!-- 仓库属性 -->
        <div class="set-item">
          <div class="set-title set-title-1">{{ i18n.visible.title }}</div>

          <div class="set-item-right">
            <o-select
              :select-data="visibleOptions"
              keys="value"
              value="value"
              :default-value="i18n.visible.options[visibleIndex].value"
              @click="getIndex"
              @change="getVisiableSelect"
            ></o-select>

            <div class="set-tip">{{ i18n.visible.tip }}</div>
          </div>
        </div>
        <!-- 更改描述 -->
        <div class="set-item">
          <div class="set-title set-title-1">
            {{ i18n.visible.description }}
          </div>

          <div class="set-item-right">
            <el-input
              v-model="description"
              :rows="2"
              type="textarea"
              maxlength="100"
              show-word-limit
            />
          </div>
        </div>
        <div class="confirm-box">
          <o-button size="small" @click="confirmPrivate">{{
            i18n.visible.btnText
          }}</o-button>
        </div>
      </div>
    </div>

    <div class="model-set-middle">
      <div class="wrap">
        <p class="middle-title">{{ i18n.rename.title }}</p>
        <!-- 新拥有者 -->
        <div class="set-item">
          <div class="set-title">{{ i18n.rename.newOwn }}</div>

          <div class="set-item-right">
            <o-select
              :select-data="organizationAdminList"
              :placeholder="detailData.owner"
              keys="id"
              value="name"
              @change="getOwnSelect"
            ></o-select>
          </div>
        </div>
        <!-- 新仓库名 -->
        <div class="set-item">
          <div class="set-title set-title-1">{{ i18n.rename.newName }}</div>

          <div class="set-item-right">
            <el-form
              ref="queryRef"
              :model="query"
              prop="region"
              @submit.prevent
            >
              <el-form-item
                class="item"
                prop="name"
                :rules="[
                  { required: true, message: '必填项', trigger: 'blur' },
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
                ]"
              >
                <el-input
                  v-model="query.name"
                  :placeholder="i18n.rename.placeholder"
                >
                </el-input>
              </el-form-item>
            </el-form>

            <el-popover
              class="popover-tip"
              placement="bottom-start"
              :width="372"
              trigger="hover"
              :teleported="false"
            >
              <template #reference>
                <o-icon><icon-poppver></icon-poppver></o-icon>
              </template>
              <div>- 仓库名目前只支持英文</div>
              <div>
                - 仓库名名称不能以英文句号(<span class="remind">.</span
                >)开头或结尾，且不能包含以下字符<span class="remind"
                  >>&nbsp;:&nbsp;/&nbsp;\:*?'&lt;&gt;|</span
                >
              </div>
              <div>
                -&nbsp;仓库名建议简短，仓库下的文件或文件夹绝对路径长度<span
                  class="remind"
                  >不能超过1000字符</span
                >，例如：仓库下的文件file_name，文件名长度是按照project_name/folder_name/file_name的字符计算的
              </div>
            </el-popover>

            <div class="set-tip">{{ i18n.rename.describe }}</div>
          </div>
        </div>
        <div class="confirm-box">
          <o-button size="small" @click="confirmRename(queryRef)">{{
            i18n.rename.btnText
          }}</o-button>
        </div>
      </div>
    </div>
    <div class="model-set-bottom">
      <div class="wrap">
        <div class="set-item">
          <div class="set-title">{{ i18n.delete.title }}</div>

          <div class="set-content">{{ i18n.delete.describe }}</div>
        </div>
        <div class="confirm-box">
          <o-button size="small" status="error" @click="showDel = true">{{
            i18n.delete.btnText
          }}</o-button>
        </div>
      </div>
    </div>

    <el-dialog
      v-model="showDel"
      :show-close="false"
      center
      width="640px"
      align-center
    >
      <template #header="{ titleId, title }">
        <div :id="titleId" :class="title">
          <img :src="warningImg" alt="" />
        </div>
      </template>
      <div
        class="dlg-body"
        style="
          color: #555;
          font-size: 18px;
          text-align: center;
          line-height: 28px;
        "
      >
        {{ i18n.delete.describe1 }}
      </div>
      <template #footer>
        <div class="dlg-actions" style="display: flex; justify-content: center">
          <o-button style="margin-right: 16px" @click="toggleDelDlg(false)">
            {{ i18n.delete.cancel }}
          </o-button>
          <o-button type="primary" @click="confirmDel">
            {{ i18n.delete.confirm }}
          </o-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog
      v-model="showConfirm"
      :show-close="false"
      center
      width="640px"
      align-center
    >
      <template #header="{ titleId, title }">
        <div :id="titleId" :class="title">
          <img :src="successImg" alt="" />
        </div>
      </template>
      <div
        class="dlg-body"
        style="
          color: #555;
          font-size: 18px;
          text-align: center;
          line-height: 28px;
        "
      >
        {{ i18n.delete.describe2 }}
      </div>
      <template #footer>
        <div class="dlg-actions" style="display: flex; justify-content: center">
          <router-link :to="{ path: `/${userInfoStore.userName}` }">
            <o-button type="primary">{{ i18n.delete.confirm }}</o-button>
          </router-link>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.el-input,
.el-textarea {
  width: 580px;
}

:deep(.el-select) {
  width: 580px !important;
}
.el-form-item {
  margin-bottom: 0;
}

.wrap {
  max-width: 688px;
  margin: 0 auto;
}
.model-set {
  background: #fff;
  border-radius: 16px;
  max-width: 1416px;
  padding: 16px 40px 40px 40px;
}
.model-set-top {
  border-bottom: 1px solid #e5e5e5;
  padding-bottom: 40px;
}
.set-item {
  display: flex;
  align-items: center;
  margin-top: 24px;
}
.set-title {
  width: 80px;
  font-size: 16px;
  line-height: 24px;
  color: #000000;
  margin-right: 28px;
}
.set-title-1 {
  align-self: start;
  margin-top: 6px;
}
.set-item-right {
  position: relative;
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
.el-tooltip__trigger {
  cursor: pointer;
  position: absolute;
  right: -32px;
  top: 5px;
  font-size: 24px;
}
.set-tip {
  font-size: 14px;
  font-weight: 400;
  color: #999999;
  line-height: 22px;
  margin-top: 8px;
}
.confirm-box {
  padding-left: 108px;
  margin-top: 24px;
}
.model-set-middle {
  padding: 40px 0;
  border-bottom: 1px solid #e5e5e5;
}
.middle-title {
  font-size: 18px;
  color: #000000;
  line-height: 24px;
}
.set-content {
  font-size: 14px;
  font-weight: 400;
  color: #555555;
  line-height: 22px;
}
</style>
