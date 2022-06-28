<script setup>
import { ref, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import OButton from '@/components/OButton.vue';
import OSelect from '@/components/OSelect.vue';
import ODialog from '@/components/ODialog.vue';

import { useUserInfoStore, useFileData } from '@/stores';
import { modifyModel, deleteModel, getModelData } from '@/api/api-model';
import { fileRename } from '@/api/api-obs';

import IconPoppver from '~icons/app/popover.svg';
import warningImg from '@/assets/icons/warning.png';
import successImg from '@/assets/icons/success.png';

let detailData = reactive(useFileData().fileStoreData);

const router = useRouter();
const route = useRoute();
let routerParams = router.currentRoute.value.params;

const userInfoStore = useUserInfoStore();
const organizationAdminList = reactive(userInfoStore.organizationAdminList);
const fileData = useFileData();

const i18n = {
  visible: {
    title: '仓库属性',
    options: [
      {
        value: 'Private',
        label: 'Private',
        id: 1,
        describe:
          '其他用户将无法搜索、查看你的模型，仅你及你的团队成员可查看和编辑此模型仓库。',
      },
      {
        value: 'Public',
        label: 'Public',
        id: 2,
        describe:
          '其他用户可浏览、收藏、下载你的模型，但仅有你及你的团队成员才可编辑此模型仓库。',
      },
    ],
    btnText: '保存更改',
  },
  rename: {
    title: '重命名和转移',
    newOwn: '新拥有者',
    newName: '新模型名',
    placeholder: '请输入模型名',
    describe: '你可重命名模型，并转移你的模型仓库至组织。',
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
const visibleValue = ref('');
const newOwn = ref('');
const visibleIndex = ref(0);
const showDel = ref(false);
const showConfirm = ref(false); // 控制删除成功跳转个人主页弹窗
const queryRef = ref(null);

let query = reactive({
  name: '',
});

detailData.is_private ? (visibleIndex.value = 0) : (visibleIndex.value = 1);

function getIndex(value) {
  visibleIndex.value = value;
}
function getOwnSelect(value) {
  newOwn.value = value;
}
function getVisiableSelect(value) {
  value === 'Private'
    ? (visibleValue.value = true)
    : (visibleValue.value = false);
}

async function confirmRename(formEl) {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      try {
        let pathQuery = {
          new_path: `xihe-obj/models/${route.params.user}/${query.name}/`,
          old_path: `xihe-obj/models/${route.params.user}/${routerParams.name}/`,
        };
        fileRename(pathQuery).then((res) => {
          if (res.status === 200) {
            // 改名成功更新pinia数据
            getModelData({ name: query.name }).then((res) => {
              if (res.results.data.length) {
                let storeData = res.results.data[0];
                storeData['is_owner'] =
                  userInfoStore.userName === storeData.owner_name.name;
                fileData.setFileData(storeData);
              }
              ElMessage({
                type: 'success',
                message: '仓库信息更新成功',
              });
              router.push({
                name: 'modelSet',
                params: {
                  user: routerParams.user,
                  name: query.name,
                },
              });
            });
          } else {
            ElMessage({
              type: 'error',
              message: res.msg,
            });
          }
        });
      } catch (error) {
        ElMessage({
          type: 'error',
          message: error,
        });
      }
    } else {
      console.log('error submit!');
      return false;
    }
  });
}
function confirmPrivate() {
  let query = {
    is_private: visibleValue.value,
    id: detailData.id,
  };
  modifyModel(query).then((res) => {
    if (res.status === 200) {
      ElMessage({
        type: 'success',
        message: res.msg,
      });
    } else {
      ElMessage({
        type: 'error',
        message: res.msg,
      });
    }
  });
}
function confirmDel() {
  deleteModel(detailData.id).then((res) => {
    if (res.status === 200) {
      showDel.value = false;
      showConfirm.value = true;
    } else {
      ElMessage({
        type: 'error',
        message: res.msg,
      });
    }
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
  <div class="setting-warp">
    <div class="setting-inner">
      <div class="setting-main">
        <div class="setting-title">{{ i18n.visible.title }}</div>
        <o-select
          :select-data="visibleOptions"
          keys="value"
          value="value"
          :default-value="i18n.visible.options[visibleIndex].value"
          @click="getIndex"
          @change="getVisiableSelect"
        ></o-select>
        <p class="setting-tip">
          {{ i18n.visible.options[visibleIndex].describe }}
        </p>
        <o-button @click="confirmPrivate">{{ i18n.visible.btnText }}</o-button>
        <div class="setting-title">{{ i18n.rename.title }}</div>
        <p class="setting-tip">{{ i18n.rename.newOwn }}</p>
        <o-select
          :select-data="organizationAdminList"
          :placeholder="detailData.owner_name.name"
          keys="id"
          value="name"
          @change="getOwnSelect"
        ></o-select>
        <el-form
          ref="queryRef"
          class="creating-box"
          :model="query"
          prop="region"
        >
          <p class="setting-tip">{{ i18n.rename.newName }}</p>
          <el-form-item
            class="item"
            prop="name"
            :rules="[
              {
                pattern: /^[^\u4e00-\u9fa5]{3,1000}$/g,
                message: '暂不支持中文字符，且长度需大于3个字符',
                trigger: 'blur',
              },
              {
                pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9!@#$^&().']+$/,
                message: '格式不正确',
                trigger: 'blur',
              },
              {
                pattern: /^[^.]*[^.]$/,
                message: '格式不正确',
                trigger: 'blur',
              },
            ]"
          >
            <el-input
              v-model="query.name"
              :placeholder="i18n.rename.placeholder"
            >
            </el-input>
            <el-popover
              placement="bottom-start"
              :width="372"
              trigger="hover"
              :teleported="false"
            >
              <template #reference>
                <o-icon><icon-poppver></icon-poppver></o-icon>
              </template>
              <template #>
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
              </template>
            </el-popover>
          </el-form-item>
        </el-form>
        <p class="setting-tip">{{ i18n.rename.describe }}</p>
        <o-button @click="confirmRename(queryRef)">{{
          i18n.rename.btnText
        }}</o-button>
        <h4 class="setting-title">{{ i18n.delete.title }}</h4>
        <p class="setting-tip">{{ i18n.delete.describe }}</p>
        <o-button
          class="delete-btn"
          :style="{
            color: '##F3524DFF',
            borderColor: '##F3524DFF',
          }"
          @click="showDel = true"
          >{{ i18n.delete.btnText }}</o-button
        >
      </div>
      <o-dialog
        :show="showDel"
        :close="false"
        @close-click="toggleDelDlg(false)"
      >
        <template #head>
          <div
            class="dlg-title"
            :style="{ textAlign: 'center', paddingTop: '40px' }"
          >
            <img :src="warningImg" alt="" />
          </div>
        </template>
        <div
          class="dlg-body"
          :style="{
            padding: '8px 0 30px',
            fontSize: '18px',
            textAlign: 'center',
            width: '640px',
          }"
        >
          {{ i18n.delete.describe1 }}
        </div>
        <template #foot>
          <div
            class="dlg-actions"
            :style="{
              display: 'flex',
              justifyContent: 'center',
              paddingBottom: '56px',
            }"
          >
            <o-button
              :style="{ marginRight: '24px' }"
              @click="toggleDelDlg(false)"
              >{{ i18n.delete.cancel }}</o-button
            >
            <o-button type="primary" @click="confirmDel">{{
              i18n.delete.confirm
            }}</o-button>
          </div>
        </template>
      </o-dialog>
      <o-dialog
        :show="showConfirm"
        :close="false"
        @close-click="toggleDelDlg(false)"
      >
        <template #head>
          <div
            class="dlg-title"
            :style="{ textAlign: 'center', paddingTop: '40px' }"
          >
            <img :src="successImg" alt="" />
          </div>
        </template>
        <div
          class="dlg-body"
          :style="{
            fontSize: '18px',
            textAlign: 'center',
            width: '640px',
          }"
        >
          {{ i18n.delete.describe2 }}
        </div>
        <template #foot>
          <div
            class="dlg-actions"
            :style="{
              display: 'flex',
              justifyContent: 'center',
              paddingBottom: '56px',
            }"
          >
            <router-link :to="{ path: `/${userInfoStore.userName}` }">
              <o-button type="primary">{{ i18n.delete.confirm }}</o-button>
            </router-link>
          </div>
        </template>
      </o-dialog>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.setting-inner {
  display: flex;
  justify-content: center;
  background-color: #fff;
  .setting-main {
    max-width: 600px;
    margin-bottom: 40px;
    width: 100%;
    .el-form-item {
      display: flex;
      flex-direction: column;
      margin: 0;
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
      margin-top: 24px;
      width: 400px;
      display: flex;
      :deep(.el-form-item__content) {
        display: flex;
        // flex-direction: column;
        justify-content: start;
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
    .setting-title {
      margin: 40px 0 16px;
      font-size: 18px;
      font-family: FZLTHJW--GB1-0, FZLTHJW--GB1;
      color: #000000;
      line-height: 24px;
    }
    .setting-tip {
      margin: 8px 0 16px;
      color: #999999;
    }
    .delete-btn {
      color: #f3524dff;
      border-color: #f3524dff;
      &:hover {
        color: #b4110cff;
        border-color: #b4110cff;
      }
    }
  }
}
</style>
