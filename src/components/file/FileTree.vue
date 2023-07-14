<script setup>
import { ref, computed, watch, reactive, defineProps } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import IconModel from '~icons/app/model-blue';
import IconDataset from '~icons/app/dataset-blue';
import IconProject from '~icons/app/project-tree';
import IconFolder from '~icons/app/folder';
import IconFile from '~icons/app/file';
import IconDownload from '~icons/app/download';
import IconAddFile from '~icons/app/add-file';
import IconFileVisited from '~icons/app/other-file';
import IconCircleCheck from '~icons/app/circle-check';
import IconCircleClose from '~icons/app/circle-close';
import IconRemove from '~icons/app/remove';

import warningImg from '@/assets/icons/warning.png';
import LfsImg from '@/assets/icons/lfs.png';

import {
  getGitlabTree,
  deleteFile,
  uploadFileGitlab,
  downloadFile,
  deleteFolder,
} from '@/api/api-gitlab';

// import { changeByte } from '@/shared/utils';

import { useUserInfoStore, useFileData } from '@/stores';
import { ElMessage } from 'element-plus';
import { ElDialog } from 'element-plus';

const repoDetailData = computed(() => {
  return useFileData().fileStoreData;
});
const showFolder = computed(() => {
  return useFileData().showCreateFolder;
});
const router = useRouter();
const route = useRoute();

const userInfoStore = useUserInfoStore();

const isAuthentic = computed(() => {
  return route.params.user === userInfoStore.userName;
});

const routerParams = computed(() => {
  return router.currentRoute.value.params;
});

const contents = computed(() => {
  return routerParams.value.contents;
});

const showDel = ref(false);
const pushParams = {
  user: routerParams.value.user,
  name: routerParams.value.name,
  contents: contents.value,
};
const filesList = ref([]);
const prop = defineProps({
  moduleName: {
    type: String,
    default: '',
  },
});
const i18n = {
  uploadTime: '更新时间',
  download: '下载',
  uploadReadMe: ['当前无文件，点击', '新建文件', '或', '上传文件'],
  emptyVisited: '该用户还未上传任何文件',
  delete: {
    title: '删除模型',
    description: '此操作不可逆，确定删除',
    btnText: '删除',
    cancel: '取消',
    confirm: '确认',
  },
};
const fileName = ref('');
const isFolder = ref(false);
let queryRef = ref(null);
const isHandleDel = ref(false);
const rules = reactive({
  folderName: [
    { required: true, message: '禁止为空', trigger: 'blur' },
    {
      pattern: /^[^\u4e00-\u9fa5]+$/,
      message: '不支持中文文件名',
      trigger: 'blur',
    },
    {
      pattern: /^[^%#]+$/,
      message: '禁止特殊字符',
      trigger: 'blur',
    },
    {
      pattern: /^[a-zA-Z0-9 -._%]{1,120}$/,
      message:
        '禁止包含以下字符：“?”、“、”、“╲”、“/”、“*”、““”、“”“、“<”、“>”、“|”、“%”',
      trigger: 'blur',
    },
  ],
});

let query = reactive({
  folderName: '',
  description: '',
  textValue: '',
});
async function getDetailData(path) {
  try {
    // gitlab
    await getGitlabTree({
      type: prop.moduleName,
      user: routerParams.value.user,
      path: path,
      id: repoDetailData.value.id,
      name: routerParams.value.name,
    })
      .then((res) => {
        if (res?.data) {
          useFileData().fileStoreData['is_empty'] = false;
          filesList.value = res.data;
        } else if (!contents.value?.length) {
          useFileData().fileStoreData['is_empty'] = true;
          filesList.value = [];
        } else if (isHandleDel.value) {
          // 手动删除文件时，树为空返回上一层
          useFileData().fileStoreData['is_empty'] = false;
          const fatherRouter = contents.value.splice(
            0,
            contents.value.length - 1
          );
          router.push({
            name: `${prop.moduleName}File`,
            params: {
              user: routerParams.value.user,
              name: routerParams.value.name,
              contents: fatherRouter,
            },
          });
        } else {
          router.push('/404');
        }
      })
      .catch(() => {
        contents.value.pop();
        getDetailData(`${contents.value.join('/')}/`);
      });
  } catch (error) {
    ElMessage({
      type: 'error',
      message: 'error',
    });
  }
}
function toggleDelDlg(flag, itemFileName, itemIsFolder) {
  if (flag === undefined) {
    showDel.value = !showDel.value;
  } else if (flag) {
    showDel.value = true;
    fileName.value = itemFileName;
    isFolder.value = itemIsFolder;
  } else {
    showDel.value = false;
    fileName.value = '';
    isFolder.value = false;
  }
}

// 区分手动删除文件后目录为空 与 url进入目录为空
function getFilesByPath() {
  contents.value?.length
    ? getDetailData(`${contents.value.join('/')}/`)
    : getDetailData('');
}
function emptyClick(ind) {
  if (ind === 1) {
    router.push({
      name: `${prop.moduleName}FileNew`,
      params: pushParams,
    });
  } else if (ind === 3) {
    router.push({
      name: `${prop.moduleName}FileUpload`,
      params: pushParams,
    });
  }
}
function goBlob(item) {
  let targetRoute = null;
  if (!item.is_dir) {
    targetRoute = `${prop.moduleName}FileBlob`;
  } else {
    targetRoute = `${prop.moduleName}File`;
  }
  return {
    name: targetRoute,
    params: {
      user: routerParams.value.user,
      name: routerParams.value.name,
      contents: [...routerParams.value.contents, decodeURI(item.name)],
    },
  };
}
function creatFolter(formEl) {
  if (!formEl) return;
  let path = `${query.folderName}/.keep`;
  // 非根目录下
  if (contents.value.length) {
    path = `${contents.value.join('/')}/${query.folderName}/.keep`;
  }
  formEl.validate((valid) => {
    if (valid) {
      uploadFileGitlab(
        {
          type: prop.moduleName,
          name: routerParams.value.name,
          id: repoDetailData.value.id,
          content: '',
          commit_message: `created ${query.folderName}`,
        },
        path
      ).then(() => {
        useFileData().setShowFolder(false);
        getFilesByPath();
        query.folderName = '';
        ElMessage({
          type: 'success',
          message: '新建成功！',
        });
      });
    } else {
      return false;
    }
  });
}
function cancelCreate() {
  useFileData().setShowFolder(false);
  query.folderName = '';
}

function deleteFolderClick(folderName) {
  let path = folderName;
  if (contents.value.length) {
    path = `${contents.value.join('/')}/${folderName}`;
  }
  // 删除文件夹
  if (isFolder.value) {
    deleteFolder({
      type: prop.moduleName,
      name: routerParams.value.name,
      path: path,
      id: repoDetailData.value.id,
    }).then(() => {
      isHandleDel.value = true;
      getFilesByPath();
      ElMessage({
        type: 'success',
        message: '删除成功',
      });
    });
  } else {
    deleteFile({
      type: prop.moduleName,
      name: routerParams.value.name,
      path: path,
      id: repoDetailData.value.id,
    }).then(() => {
      isHandleDel.value = true;
      getFilesByPath();
      ElMessage({
        type: 'success',
        message: '删除成功',
      });
    });
  }
  showDel.value = false;
}
watch(
  () => route.fullPath,
  () => {
    if (router.currentRoute.value.name === `${prop.moduleName}File`) {
      getFilesByPath();
    }
  },
  {
    immediate: true,
    deep: true,
  }
);
</script>
<template>
  <div v-if="!repoDetailData.is_empty" class="tree">
    <table
      class="tree-table"
      :class="filesList.length ? 'has-data' : 'no-data'"
    >
      <col width="350px" />
      <col width="282px" />
      <col width="564px" />
      <col width="202px" />
      <tbody style="100%">
        <tr class="tree-head">
          <td colspan="3">
            <div class="inner-box">
              <o-icon>
                <icon-model v-if="moduleName === 'model'"></icon-model>
                <icon-dataset
                  v-else-if="moduleName === 'dataset'"
                ></icon-dataset>
                <icon-project
                  v-else-if="moduleName === 'project'"
                ></icon-project>
              </o-icon>
              <span
                class="tree-head-left-describe"
                :title="repoDetailData.desc"
                >{{ repoDetailData.desc }}</span
              >
            </div>
          </td>
          <td class="tree-head-right">
            <div class="inner-box">
              {{ i18n.uploadTime }}
            </div>
          </td>
        </tr>
        <tr v-if="showFolder" class="tree-table-item create-file">
          <td class="tree-head-left">
            <div class="inner-box">
              <o-icon><icon-folder></icon-folder> </o-icon>
              <el-form
                ref="queryRef"
                :rules="rules"
                :model="query"
                prop="region"
                @submit.prevent
              >
                <el-form-item class="form-item" prop="folderName">
                  <div class="model-name tip-text">
                    <el-input
                      v-model.trim="query.folderName"
                      placeholder="新建文件夹"
                      class="name-input"
                      @keyup.enter="creatFolter(queryRef)"
                    ></el-input>
                  </div>
                </el-form-item>
              </el-form>
            </div>
          </td>
          <td>
            <div class="check-name">
              <o-icon @click="creatFolter(queryRef)">
                <icon-circle-check></icon-circle-check>
              </o-icon>
              <o-icon @click="cancelCreate">
                <icon-circle-close></icon-circle-close>
              </o-icon>
            </div>
          </td>
          <td></td>
          <td class="tree-head-right"></td>
        </tr>
        <template v-if="filesList.length">
          <tr
            v-for="item in filesList"
            v-show="!/.*[\u4e00-\u9fa5]+.*$/.test(item.name)"
            :key="item.download_path"
            :class="{ 'folder-item': !item.is_dir }"
            class="tree-table-item"
          >
            <td class="tree-table-item-name" :title="item.name">
              <router-link :to="goBlob(item)" class="inner-box">
                <o-icon v-if="!item.is_dir"><icon-file></icon-file> </o-icon>
                <o-icon v-else><icon-folder></icon-folder> </o-icon>
                <span>{{ item.name }}</span>
              </router-link>
            </td>
            <td
              class="tree-table-item-download"
              width="25%"
              @click="
                !item.is_dir &&
                  downloadFile({
                    type: moduleName,
                    path: item.path,
                    id: repoDetailData.id,
                    name: routerParams.name,
                    user: routerParams.user,
                  })
              "
            >
              <div v-show="!item.is_dir" class="inner-box">
                <o-icon><icon-download></icon-download></o-icon>
                <!-- <span class="size">{{ changeByte(item.size) }}</span> -->
                <span class="size">下载</span>
                <img
                  v-if="item.is_lfs_file"
                  :src="LfsImg"
                  alt=""
                  class="is-lfs"
                />
              </div>
            </td>
            <td class="tree-table-item-from" :title="item.commit_title_html">
              <div class="inner-box">
                <div
                  class="delete-folder"
                  :class="{ 'is-visitor': !repoDetailData.is_owner }"
                  @click="toggleDelDlg(true, item.name, item.is_dir)"
                >
                  <o-icon @click="creatFolter(queryRef)">
                    <icon-remove></icon-remove>
                  </o-icon>
                  <span>删除</span>
                </div>
              </div>
            </td>
            <td class="tree-table-item-time">
              <div class="inner-box">
                {{ item.time_pass }}
              </div>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
    <p v-show="filesList.length === 100" class="over-limit-tip">
      可能存在部分文件未完全展示，请克隆至本地查看。
    </p>
    <div v-if="!filesList.length" class="empyt-folder">空文件夹</div>
  </div>
  <div v-else-if="isAuthentic" class="empty-own">
    <div class="upload-readme-img">
      <o-icon> <icon-add-file></icon-add-file> </o-icon>
    </div>
    <div class="upload-readme-tip">
      <p
        v-for="(item, index) in i18n.uploadReadMe"
        :key="item"
        :class="{ 'link-style': index === 1 || index === 3 }"
        @click="emptyClick(index)"
      >
        {{ item }}
      </p>
    </div>
  </div>
  <div v-else class="empty-visited empty-own">
    <div class="upload-readme-img">
      <o-icon> <icon-file-visited></icon-file-visited> </o-icon>
    </div>
    <div class="upload-readme-tip">
      <p>
        {{ i18n.emptyVisited }}
      </p>
    </div>
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
      {{ i18n.delete.description }} {{ fileName }} 吗？
    </div>
    <template #footer>
      <div class="dlg-actions" style="display: flex; justify-content: center">
        <o-button style="margin-right: 16px" @click="toggleDelDlg(false)">
          {{ i18n.delete.cancel }}
        </o-button>
        <o-button
          type="primary"
          @click="deleteFolderClick(fileName, repoDetailData.repo_id)"
        >
          {{ i18n.delete.confirm }}
        </o-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.o-icon {
  margin-right: 6px;
  font-size: 24px;
}
:deep(.el-form) {
  .el-form-item {
    .el-form-item__content {
      .el-form-item__error {
        white-space: nowrap;
        padding-right: 400px;
        bottom: 0;
        left: calc(100% + 150px);
      }
    }
  }
}
.has-data {
  border-radius: 16px;
}
.no-data {
  border-radius: 16px 16px 0 0;
}
.tree {
  border-radius: 16px;
  border: 1px solid #e5e5e5;
  .tree-head {
    padding: 12px 24px;
    width: 100%;
    font-size: 14px;
    background-color: #e5e8f0 !important;
    .tree-head-left {
      display: flex;
      align-items: center;
      height: 56px;
      .tree-head-left-describe {
        padding-left: 6px;
        color: #555;
        line-height: 20px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    .tree-head-right {
      padding-right: 70px;
      height: 56px;
    }
  }
  .tree-table {
    padding: 0 24px;
    width: 100%;
    background-color: #fff;
    table-layout: fixed;
    word-break: break-all;
    border-collapse: collapse;
    overflow: hidden;
    @media screen and (max-width: 1280px) {
      width: inherit;
    }

    tr {
      height: 56px;
      transition: all 0.3s;

      &:hover {
        background: #f7f8fa;
        .delete-folder {
          display: flex;
        }
        .is-visitor {
          display: none;
        }
      }
      .el-form {
        display: flex;
        justify-content: center;
        .form-item {
          margin: 0;
          width: 260px;
          .el-input {
            width: 260px;
            box-shadow: none;
            .el-input__wrapper {
              box-shadow: 0 0 0 1px #e5e5e5ff inset;
            }
          }
        }
      }
      .check-name {
        display: flex;
        justify-content: flex-start;
        padding: 0 30px;
        span {
          margin: 0;
          cursor: pointer;
        }
        span:nth-child(1) {
          margin-right: 16px;
        }
        .o-icon:nth-child(2) {
          color: #ccc;
        }
      }
      td {
        overflow: hidden;
        flex-shrink: 0;
        word-wrap: break-word;
        .inner-box {
          display: flex;
          align-items: center;
          padding-right: 8px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          span {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
      td:first-child {
        padding-left: 36px;
        padding-right: 36px;
        span:nth-child(1) {
          flex-shrink: 0;
        }
      }
    }
    &-item {
      position: relative;
      &:not(:last-child)::after {
        content: '';
        width: calc(100% - 72px);
        height: 1px;
        background-color: #e5e5e5;
        position: absolute;
        left: 36px;
        bottom: 0px;
      }

      &-name {
        cursor: pointer;
        .inner-box {
          color: #555;
          &:hover {
            color: #33b3ff;
            text-decoration: underline;
          }
        }
      }
      &-from {
        position: relative;
        color: #555;
        .inner-box {
          justify-content: space-between;
          .delete-folder {
            position: absolute;
            right: 0;
            display: none;
            cursor: pointer;
            padding-right: 50px;
            flex-direction: column;
            color: #33b3ff;
            justify-content: center;
            align-items: center;
            .o-icon {
              font-size: 16px;
            }
            span {
              padding-top: 5px;
              font-size: 12px;
            }
          }
        }
      }
      &-time {
        padding-right: 50px;
      }
      &-download {
        cursor: pointer;
        font-size: 12px;
        color: #999;
        .inner-box {
          padding: 0 24px;
          .is-lfs {
            margin-left: 8px;
            width: 64px;
          }
        }
        span {
          line-height: 18px;
        }
        .o-icon {
          font-size: 16px;
        }
      }
    }
    .create-file {
      td {
        overflow: visible;
        .inner-box {
          overflow: visible;
          .el-form-item__error {
            left: calc(100% + 120px);
          }
        }
      }
    }
    &-item-inner {
      padding: 16px 0;
      border-bottom: 1px solid #e5e5e5;
      & > div {
        display: flex;
        align-items: center;
      }
    }
  }
  .over-limit-tip {
    margin-top: 12px;
  }
  .empyt-folder {
    display: flex;
    padding: 30px 0;
    justify-content: center;
    align-items: center;
    border: 1px solid #e5e5e5;
    border-radius: 0 0 16px 16px;
  }
}
.empty-own {
  min-height: calc(100vh - 618px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  .upload-readme-img {
    .o-icon {
      display: block;
      font-size: 48px;
    }
  }
  .upload-readme-tip {
    display: flex;
    margin-top: 24px;
    line-height: 17px;
    color: #999;
    .link-style {
      cursor: pointer;
      color: #33b3ff;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>
