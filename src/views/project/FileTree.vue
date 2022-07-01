<script setup>
import { ref, computed, watch, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import IconProject from '~icons/app/project-tree';
import IconFolder from '~icons/app/folder';
import IconFile from '~icons/app/file';
import IconDownload from '~icons/app/download';
import IconAddFile from '~icons/app/add-file';
import IconFileVisited from '~icons/app/other-file';
import IconCircleCheck from '~icons/app/circle-check';
import IconCircleClose from '~icons/app/circle-close';

import { downloadFile, findFile, createFolder } from '@/api/api-obs';
import { changeByte } from '@/shared/utils';

import { useUserInfoStore, useFileData } from '@/stores';

const detailData = computed(() => {
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

let routerParams = router.currentRoute.value.params;
let contents = routerParams.contents;
const pushParams = {
  user: routerParams.user,
  name: routerParams.name,
  contents: routerParams.contents,
};
const filesList = ref([]);

const i18n = {
  uploadTime: '更新时间',
  download: '下载',
  uploadReadMe: ['当前无文件，点击', '新建文件', '或', '上传文件'],
  emptyVisited: '该用户还未上传任何文件',
};

let queryRef = ref(null);
const rules = reactive({
  folderName: [
    { required: true, message: '禁止为空', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9\u4e00-\u9fa5 -._]{1,120}$/,
      message: '格式不正确',
      trigger: 'blur',
    },
  ],
});

let query = reactive({
  folderName: '',
  description: '',
  textValue: '',
});
function getDetailData(path) {
  try {
    findFile(path).then((tree) => {
      if (
        tree.status === 200 &&
        tree.data.children &&
        tree.data.children.length
      ) {
        filesList.value = tree.data.children;
        useFileData().fileStoreData['is_empty'] = false;
        filesList.value.sort((a, b) => {
          return b.is_folder - a.is_folder;
        });
      } else if (route.params.contents && route.params.contents.length) {
        filesList.value = [];
        useFileData().fileStoreData['is_empty'] = false;
      } else {
        useFileData().fileStoreData['is_empty'] = true;
      }
    });
  } catch (error) {
    console.error(error);
  }
}

function getFilesByPath() {
  routerParams = router.currentRoute.value.params;
  contents = routerParams.contents;
  if (contents && contents.length) {
    getDetailData(
      `xihe-obj/projects/${route.params.user}/${
        routerParams.name
      }/${contents.join('/')}/`
    );
  } else {
    // 根目录下
    getDetailData(
      `xihe-obj/projects/${route.params.user}/${routerParams.name}/`
    );
  }
}
function emptyClick(ind) {
  if (ind === 1) {
    router.push({
      name: 'projectFileNew',
      params: pushParams,
    });
  } else if (ind === 3) {
    router.push({
      name: 'projectFileUpload',
      params: pushParams,
    });
  }
}
function goBlob(item) {
  let contents = [...routerParams.contents, decodeURI(item.name)];
  if (!item.is_folder) {
    router.push({
      name: 'projectFileBlob',
      params: {
        user: routerParams.user,
        name: routerParams.name,
        contents,
      },
    });
  } else {
    router.push({
      name: 'projectFile',
      params: {
        user: routerParams.user,
        name: routerParams.name,
        contents,
      },
    });
  }
}
function creatFolter(formEl) {
  if (!formEl) return;
  let path = '';
  if (contents && contents.length) {
    path = `xihe-obj/projects/${route.params.user}/${
      routerParams.name
    }/${contents.join('/')}/${query.folderName}/.keep`;
  } else {
    // 根目录下
    path = `xihe-obj/projects/${route.params.user}/${routerParams.name}/${query.folderName}/.keep`;
  }

  formEl.validate((valid) => {
    if (valid) {
      createFolder(
        {
          folderName: query.folderName,
          path,
        },
        function () {
          useFileData().setShowFolder(false);
          getFilesByPath();
          query.folderName = '';
          ElMessage({
            type: 'success',
            message: '新建成功！',
          });
        }
      );
    } else {
      console.error('error submit!');
      return false;
    }
  });
}
function cancelCreat() {
  useFileData().setShowFolder(false);
  query.folderName = '';
}
watch(
  () => route.fullPath,
  () => {
    if (router.currentRoute.value.name === 'projectFile') {
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
  <div v-if="!detailData.is_empty" class="tree">
    <table class="tree-table">
      <col width="330px" />
      <col width="120px" />
      <col width="670px" />
      <col width="200px" />
      <tbody>
        <tr class="tree-head">
          <td class="tree-head-left">
            <div class="inner-box">
              <o-icon><icon-project></icon-project> </o-icon>
              <span class="tree-head-left-describe" title="模型描述">{{
                detailData.description
              }}</span>
            </div>
          </td>
          <td></td>
          <td></td>
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
              >
                <el-form-item class="form-item" prop="folderName">
                  <div class="model-name tip-text">
                    <el-input
                      v-model="query.folderName"
                      class="name-input"
                      placeholder="新建文件夹"
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
              <o-icon @click="cancelCreat">
                <icon-circle-close></icon-circle-close>
              </o-icon>
            </div>
          </td>
          <td>
            <div class="tip">
              提示: 暂不不支持空文件夾，创建文件夹后会生成空的 .keep 文件
            </div>
          </td>
          <td class="tree-head-right"></td>
        </tr>
        <template v-if="filesList.length">
          <tr
            v-for="item in filesList"
            :key="item.download_path"
            class="tree-table-item"
          >
            <td class="tree-table-item-name" @click="goBlob(item)">
              <div class="inner-box">
                <o-icon v-if="!item.is_folder"><icon-file></icon-file> </o-icon>
                <o-icon v-else><icon-folder></icon-folder> </o-icon>
                <span>{{ item.name }}</span>
              </div>
            </td>
            <td
              class="tree-table-item-download"
              width="10%"
              @click="downloadFile(item.path, item.name, detailData.id)"
            >
              <div v-if="item.size" class="inner-box">
                <o-icon><icon-download></icon-download></o-icon>
                <span class="size">{{ changeByte(item.size) }}</span>
              </div>
            </td>
            <td class="tree-table-item-from">
              <div class="inner-box">
                <span>{{ item.description }}</span>
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
        left: calc(100% + 123px);
        background-color: #fff;
      }
    }
  }
}
.tree {
  min-height: calc(100vh - 400px);
  &-head {
    // display: block;
    padding: 12px 24px;
    width: 100%;
    font-size: 14px;
    background-color: #e5e8f0;
    &-left {
      display: flex;
      align-items: center;
      height: 56px;
      &-describe {
        padding-left: 6px;
        color: #555;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    &-right {
      padding-right: 70px;
    }
  }
  &-table {
    padding: 0 24px;
    width: 100%;
    border: 1px solid #e5e5e5;
    background-color: #fff;
    table-layout: fixed;
    word-break: break-all;
    border-collapse: collapse;
    @media screen and (max-width: 1280px) {
      width: inherit;
    }
    tr {
      height: 56px;
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
        justify-content: space-between;
        padding: 0 30px;
        span {
          cursor: pointer;
        }
      }
      td {
        overflow: hidden;
        word-wrap: break-word;
        border-bottom: 1px solid #e5e5e5;
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
        span:nth-child(1) {
          flex-shrink: 0;
        }
      }
    }
    &-item {
      &-name {
        cursor: pointer;
        &:hover {
          color: #33b3ff;
          text-decoration: underline;
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
      // display: flex;
      // align-items: center;
      // justify-content: space-between;
      padding: 16px 0;
      border-bottom: 1px solid #e5e5e5;
      & > div {
        display: flex;
        align-items: center;
      }
    }
  }
  .empyt-folder {
    display: flex;
    padding: 30px 0;
    justify-content: center;
    align-items: center;
    // border: 1px solid ;
    border: 1px solid #e5e5e5;
  }
}
.empty-own {
  min-height: calc(100vh - 400px);
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
