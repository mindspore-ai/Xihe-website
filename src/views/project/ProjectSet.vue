<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import OButton from '@/components/OButton.vue';
import OSelect from '@/components/OSelect.vue';

import { ElMessage } from 'element-plus';
import { ElDialog } from 'element-plus';

import { useUserInfoStore, useFileData } from '@/stores';
import { modifyProject, deleteProject } from '@/api/api-project';

import IconPoppver from '~icons/app/popover.svg';
import warningImg from '@/assets/icons/warning.png';
import successImg from '@/assets/icons/success.png';

let detailData = useFileData().fileStoreData;

const router = useRouter();
let routerParams = router.currentRoute.value.params;

const userInfoStore = useUserInfoStore();
const organizationAdminList = userInfoStore.organizationAdminList;

const i18n = {
  newName: {
    title: '新项目标题',
  },
  visible: {
    title: '仓库属性',
    description: '更改描述',
    options: [
      {
        value: 'public',
        label: '完全公开',
        id: 1,
        describe:
          '其他用户可浏览、使用和下载此AI实验室项目，仅限你可下载与更新此AI实验室项目',
      },

      {
        value: 'online',
        label: '部分公开',
        id: 2,
        describe:
          '其他用户可在线使用但不可下载此AI实验室项目，仅限你可下载与更新此AI实验室项目',
      },
      {
        value: 'private',
        label: '私有',
        id: 3,
        describe:
          '其他用户无法浏览、使用和下载此AI实验室项目，仅限你可下载与更新此AI实验室项目',
      },
    ],
    btnText: '确定',
  },
  rename: {
    title: '重命名和转移',
    newOwn: '新拥有者',
    newName: '新仓库名',
    placeholder: '请输入项目名',
    placeholder2: '请输入新项目标题',
    describe: '你可重命名项目仓库，并转移你的项目仓库至组织。',
    btnText: '确定',
  },
  covers: {
    title: '项目封面',
  },
  delete: {
    title: '删除项目',
    describe:
      '此操作将会删除与项目相关的所有资源，且此操作不可逆，请谨慎确认是否要删除此项目。',
    describe1: '此删除不可逆，确认删除吗？',
    describe2: '删除成功，你可再次创建新项目，点击确定回到个人主页。',
    btnText: '删除',
    cancel: '取消',
    confirm: '确认',
  },
};

const visibleOptions = reactive(i18n.visible.options);
const visibleValue = ref(detailData.repo_type);
const description = ref(detailData.desc);
const modelTitle = ref(detailData.title);

const visibleIndex = ref(0);
const showDel = ref(false);
const showConfirm = ref(false); // 控制删除成功跳转个人主页弹窗
const queryRef = ref(null);
const photos = reactive([
  {
    id: '1',
    url: 'https://obs-xihe-beijing4.obs.cn-north-4.myhuaweicloud.com/xihe-img/project-img/proimg1.png',
  },
  {
    id: '2',
    url: 'https://obs-xihe-beijing4.obs.cn-north-4.myhuaweicloud.com/xihe-img/project-img/proimg2.png',
  },
  {
    id: '3',
    url: 'https://obs-xihe-beijing4.obs.cn-north-4.myhuaweicloud.com/xihe-img/project-img/proimg3.png',
  },
  {
    id: '4',
    url: 'https://obs-xihe-beijing4.obs.cn-north-4.myhuaweicloud.com/xihe-img/project-img/proimg4.png',
  },
]);
const photoId = ref(0);
let query = reactive({
  name: detailData.name,
});

if (detailData.repo_type === 'private') visibleIndex.value = 2;
else if (detailData.repo_type === 'online') visibleIndex.value = 1;
else visibleIndex.value = 0;

function getIndex(value) {
  visibleIndex.value = value;
}
function getOwnSelect(value) {
  newOwn.value = value;
}

visibleValue.value = detailData.repo_type;
function getVisiableSelect(value) {
  visibleValue.value = value;
}
photos.forEach((item) => {
  item.is_active = false;
  if (item.id === detailData.cover_id) {
    photoId.value = item.id;
    item.is_active = true;
  }
});

function selectImgClick(item) {
  photoId.value = item.id;
  photos.forEach((single) => {
    single.is_active = false;
  });
  item.is_active = true;
}

function confirmPrivate() {
  let query = {
    type: visibleValue.value,
    cover_id: `${photoId.value}`,
    desc: description.value,
    title: modelTitle.value,
  };
  modifyProject(query, userInfoStore.userName, detailData.id)
    .then((res) => {
      detailData.desc = res.data.desc;
      detailData.repo_type = res.data.repo_type;
      detailData.title = res.data.title;
      ElMessage({
        type: 'success',
        message: '项目信息更改成功',
      });
    })
    .catch(() => {
      ElMessage({
        type: 'error',
        message: '修改失败，请待会重试',
      });
    });
}

async function confirmRename(formEl) {
  if (!formEl) return;
  if (!query.name.trim()) {
    return false;
  }
  formEl.validate((valid) => {
    if (valid) {
      try {
        modifyProject(query, userInfoStore.userName, detailData.id).then(() => {
          ElMessage({
            type: 'success',
            message: '仓库信息更新成功',
          });
          router.push({
            name: 'projectSet',
            params: {
              user: routerParams.user,
              name: query.name,
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
      return false;
    }
  });
}
// 删除成功，你可再次创建新模型，点击确定回到个人主页。
function confirmDel() {
  deleteProject(detailData.owner, detailData.name)
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
  <div class="setting-wrap">
    <div class="setting-inner">
      <div class="setting-main">
        <!-- 新项目名 -->
        <div class="setting-item">
          <div class="setting-title">{{ i18n.newName.title }}</div>
          <div class="attribute-option">
            <el-input
              v-model="modelTitle"
              :placeholder="i18n.rename.placeholder2"
            >
            </el-input>
          </div>
        </div>
        <!-- 仓库属性 -->
        <div class="setting-item">
          <div class="setting-title repo-attributes">
            {{ i18n.visible.title }}
          </div>
          <div class="attribute-option">
            <o-select
              :select-data="visibleOptions"
              keys="value"
              value="value"
              :default-value="detailData.repo_type"
              @click="getIndex"
              @change="getVisiableSelect"
            ></o-select>
            <div class="setting-tip">
              {{ i18n.visible.options[visibleIndex].describe }}
            </div>
          </div>
        </div>
        <!-- 新增更改描述 -->
        <div class="setting-item">
          <div class="setting-title description">
            {{ i18n.visible.description }}
          </div>
          <el-input
            v-model="description"
            :rows="2"
            type="textarea"
            maxlength="100"
            show-word-limit
          />
        </div>

        <!-- 封面 -->
        <div class="setting-item">
          <h4 class="setting-title cover">{{ i18n.covers.title }}</h4>
          <div class="photo_container">
            <div v-for="item in photos" :key="item.id" class="container-single">
              <div
                class="img-modal"
                :class="item.is_active ? 'select_active' : ''"
                @click="selectImgClick(item)"
              ></div>
              <img :src="item.url" alt="" />
            </div>
          </div>
        </div>
        <o-button style="margin-left: 112px" @click="confirmPrivate">
          {{ i18n.visible.btnText }}
        </o-button>
      </div>
      <el-divider />
      <div class="setting-main">
        <div class="rename-title">
          {{ i18n.rename.title }}
        </div>
        <div class="setting-item">
          <p class="setting-title">{{ i18n.rename.newOwn }}</p>
          <o-select
            :select-data="organizationAdminList"
            :placeholder="detailData.owner"
            keys="id"
            value="detailData.name"
            @change="getOwnSelect"
          ></o-select>
        </div>
        <el-form
          ref="queryRef"
          class="setting-item"
          :model="query"
          prop="region"
          @submit.prevent
        >
          <p class="setting-title">{{ i18n.rename.newName }}</p>
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
            <el-popover
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
          </el-form-item>
        </el-form>
        <p class="setting-tip new-project">{{ i18n.rename.describe }}</p>
        <o-button style="margin-left: 112px" @click="confirmRename(queryRef)">
          {{ i18n.rename.btnText }}
        </o-button>
      </div>
      <el-divider />
      <div class="setting-main">
        <div class="delete-project">
          <span class="setting-title">
            {{ i18n.delete.title }}
          </span>
          <span class="describe">{{ i18n.delete.describe }}</span>
        </div>
        <o-button
          style="margin-left: 112px"
          status="error"
          class="delete-btn"
          @click="showDel = true"
          >{{ i18n.delete.btnText }}</o-button
        >
      </div>
      <el-dialog
        v-model="showDel"
        width="640px"
        :show-close="false"
        center
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
          <div
            class="dlg-actions"
            style="display: flex; justify-content: center"
          >
            <o-button style="margin-right: 16px" @click="toggleDelDlg(false)">{{
              i18n.delete.cancel
            }}</o-button>
            <o-button type="primary" @click="confirmDel">{{
              i18n.delete.confirm
            }}</o-button>
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
          <div
            class="dlg-actions"
            style="display: flex; justify-content: center"
          >
            <router-link :to="{ path: `/${userInfoStore.userName}` }">
              <o-button type="primary">{{ i18n.delete.confirm }}</o-button>
            </router-link>
          </div>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.select_active {
  display: block !important;
  background-color: rgba(165, 213, 255, 0.5);
}
.setting-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  min-height: calc(100vh - 554px);
  border-radius: 16px;
  .setting-main {
    max-width: 756px;
    padding: 40px 0px;
    width: 100%;
    .rename-title {
      line-height: 24px;
      font-size: 18px;
      font-weight: 500;
      color: #000000;
      margin-bottom: 24px;
    }
    .photo_container {
      display: grid;
      grid-template-columns: repeat(2, 152px);
      grid-template-rows: repeat(2, 86px);
      grid-gap: 17px;
      .container-single {
        position: relative;
        img {
          width: 152px;
          height: 86px;
          border-radius: 16px;
        }
        .img-modal {
          position: absolute;
          left: -2px;
          top: -2px;
          width: 157px;
          height: 90px;
          z-index: 5;
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

    .setting-item {
      display: flex;
      align-items: center;
      margin-bottom: 24px;
      .el-input,
      .el-textarea {
        width: 580px;
      }
      .o-select {
        :deep(.el-select) {
          width: 580px;
        }
      }
      .repo-attributes,
      .description,
      .cover {
        align-self: flex-start;
      }
      .repo-attributes {
        margin-top: 6px;
      }
    }
    .el-form {
      margin-bottom: 0px;
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
        // margin-top: 24px;
        width: 580px;
        display: flex;
        :deep(.el-form-item__content) {
          display: flex;
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
    }
    .setting-title {
      min-width: 80px;
      margin-right: 32px;
      font-size: 16px;
      font-weight: normal;
      color: #000000;
      line-height: 24px;
      position: relative;
    }
    .delete-project {
      margin-bottom: 24px;
      .setting-title {
        display: inline-block;
        min-width: 80px;
      }
      .describe {
        line-height: 22px;
        font-size: 14px;
        font-weight: 400;
        color: #555555;
      }
    }
    .attribute-option {
      width: 580px;
      .setting-tip {
        margin-bottom: 0px;
      }
    }
    .el-textarea {
      display: block;
      width: 400px;
      :deep(.el-textarea__inner) {
        height: 89px;
      }
    }
    .setting-tip {
      font-size: 14px;
      margin-top: 8px;
      margin-bottom: 24px;
      color: #999;
    }
    .new-project {
      margin-left: 112px;
    }
    .describe {
      color: #555;
    }
  }
}
.el-divider {
  width: 94%;
  margin: 0;
}
</style>
