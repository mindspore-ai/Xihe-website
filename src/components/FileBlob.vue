<script setup>
import { ref, watch, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import { handleMarkdown } from '@/shared/markdown';

import Files from '~icons/app/files';
import IconCheck from '~icons/app/check';
import IconCopy from '~icons/app/copy';
import IconEditing from '~icons/app/editing';
import IconDelete from '~icons/app/delete';
import IconDownload from '~icons/app/download';

import { changeByte } from '@/shared/utils';

import warningImg from '@/assets/icons/warning.png';

import { useLoadingState } from '@/stores/index';
import {
  getGitlabFileRaw,
  downloadFile,
  deleteFile,
  getGitlabTree,
} from '@/api/api-gitlab';
import { ElMessage } from 'element-plus';
import { useFileData } from '@/stores';

const prop = defineProps({
  moduleName: {
    type: String,
    default: '',
  },
});

const repoDetailData = computed(() => {
  return useFileData().fileStoreData;
});
const loadingStateData = computed(() => {
  return useLoadingState().loadingState;
});

const fileData = ref();
const mkit = handleMarkdown();
const codeString = ref('');
const result = ref(mkit.render(codeString.value));
const rawData = ref('');
const router = useRouter();
const route = useRoute();

let routerParams = router.currentRoute.value.params;
const path = ref(`${routerParams.contents.join('/')}`);

const i18n = {
  viewRawCode: '查看源代码',
  copy: '复制',
  edit: '编辑',
  deleteIt: '删除',
  download: '下载',
  delete: {
    title: '删除模型',
    description: '此操作不可逆，确定删除',
    btnText: '删除',
    cancel: '取消',
    confirm: '确认',
  },
};
const showBlob = ref(false);
const suffix = ref('');
const inputDom = ref(null);
const showDel = ref(false);

function previewFile() {
  path.value.match(/[^.]+$/)
    ? (suffix.value = path.value.match(/[^.]+$/)[0])
    : (suffix.value = 'py');
  getGitlabFileRaw({
    type: prop.moduleName,
    user: routerParams.user,
    path: path.value,
    id: repoDetailData.value.id,
    name: routerParams.name,
  }).then((res) => {
    if (typeof res === 'object') {
      rawData.value = JSON.stringify(res, null, '\t');
      codeString.value = '```json \n' + rawData.value + '\n```';
      showBlob.value = true;
    } else if (
      suffix.value === 'md' ||
      suffix.value === 'json' ||
      suffix.value === 'py' ||
      suffix.value === 'txt' ||
      suffix.value === 'log' ||
      !res.includes('�')
    ) {
      rawData.value = res;
      // md文件不需加```
      if (suffix.value === 'md') {
        codeString.value = res;
      } else {
        codeString.value =
          '```' + suffix.value + ' \n' + rawData.value + '\n```';
      }
      showBlob.value = true;
    } else {
      showBlob.value = false;
    }
  });
}
function verifyFile() {
  const parentDirectory = path.value.includes('/')
    ? path.value
        .split('/')
        .splice(0, path.value.split('/').length - 1)
        .join('/')
    : '';
  try {
    getGitlabTree({
      type: prop.moduleName,
      user: routerParams.user,
      path: parentDirectory,
      id: repoDetailData.value.id,
      name: routerParams.name,
    }).then((tree) => {
      const treeItem = tree?.data?.filter((item) => {
        return item.path === path.value;
      });
      if (treeItem?.length && !treeItem[0].is_lfs_file) {
        previewFile();
      } else if (treeItem?.length && treeItem[0].is_lfs_file) {
        showBlob.value = false;
      } else {
        router.push('/notfound');
      }
    });
  } catch (error) {
    console.error(error);
  }
}
verifyFile();

async function headleDelFile(path) {
  deleteFile({
    type: prop.moduleName,
    name: routerParams.name,
    path: path,
    id: repoDetailData.value.id,
  }).then(() => {
    ElMessage({
      type: 'success',
      message: '删除成功',
    });
    showDel.value = false;
    pathClick(route.params.contents.length - 1);
  });
}

function goEditor() {
  router.push({
    name: `${prop.moduleName}FileEditor`,
    params: {
      user: routerParams.user,
      name: routerParams.name,
      contents: routerParams.contents,
    },
  });
}

function goRaw(blob) {
  const blobs = new Blob([blob], { type: 'text/plain;charset=utf-8' });
  let href = window.URL.createObjectURL(blobs);
  window.open(href);
}

function copyText(textValue) {
  inputDom.value.value = textValue;
  inputDom.value.select();
  document.execCommand('Copy'); // 执行浏览器复制命令
  ElMessage({
    type: 'success',
    message: '复制成功',
    center: true,
  });
}
function toggleDelDlg(flag) {
  if (flag === undefined) {
    showDel.value = !showDel.value;
  } else {
    showDel.value = flag;
  }
}
function pathClick(index) {
  if (route.params.contents.length === index) {
    return false;
  } else {
    let contents = route.params.contents.splice(0, index);
    router.push({
      name: `${prop.moduleName}File`,
      params: {
        user: route.params.user,
        name: route.params.name,
        contents,
      },
    });
  }
}
watch(
  () => codeString.value,
  (val) => {
    result.value = mkit.render(val);
  }
);
</script>

<template>
  <div class="file-editing">
    <textarea ref="inputDom" class="input-dom"></textarea>
    <div class="file-path">
      <div class="item-path" @click="pathClick(null)">
        {{ routerParams.name }}
      </div>
      <div
        v-for="(item, index) in routerParams.contents"
        :key="item"
        class="item-path"
        @click="pathClick(index + 1)"
      >
        /{{ item }}
      </div>
    </div>
    <div class="editing-card">
      <div class="file">
        <div class="file-operation">
          <o-icon><files></files></o-icon>
          <span class="text">{{ repoDetailData.desc }}</span>
        </div>
        <div class="file-operation">
          <div
            v-if="showBlob"
            class="file-operation-item"
            @click="goRaw(rawData)"
          >
            <o-icon><icon-check></icon-check></o-icon
            ><span class="text">{{ i18n.viewRawCode }}</span>
          </div>
          <div
            v-if="showBlob"
            class="file-operation-item"
            @click="copyText(rawData)"
          >
            <o-icon><icon-copy></icon-copy></o-icon
            ><span class="text">{{ i18n.copy }}</span>
          </div>
          <div
            v-if="repoDetailData.is_owner && showBlob"
            class="file-operation-item"
            @click="goEditor"
          >
            <o-icon><icon-editing></icon-editing></o-icon
            ><span class="text">{{ i18n.edit }}</span>
          </div>
          <div
            v-if="repoDetailData.is_owner"
            class="file-operation-item"
            @click="toggleDelDlg(true)"
          >
            <o-icon><icon-delete></icon-delete></o-icon
            ><span class="text">{{ i18n.deleteIt }}</span>
          </div>
          <div
            class="file-operation-item"
            @click="
              downloadFile({
                type: moduleName,
                user: routerParams.user,
                path: path,
                id: repoDetailData.id,
                name: routerParams.name,
              })
            "
          >
            <o-icon><icon-download></icon-download></o-icon
            ><span class="text">{{ i18n.download }}</span>
          </div>
        </div>
      </div>
      <div
        v-loading="loadingStateData"
        background="#fff"
        class="loading-template"
      >
        <div
          v-if="showBlob"
          v-highlight
          class="blank markdown-file"
          v-html="result"
        ></div>
        <div v-else class="big-file">
          文件太大或格式不支持展示但你仍然可以<span
            class="download"
            @click="
              downloadFile({
                type: moduleName,
                user: routerParams.user,
                path: path,
                id: repoDetailData.id,
                name: routerParams.name,
              })
            "
            >下载 </span
          ><span v-if="fileData"> ({{ changeByte(fileData.size) }}) </span>
        </div>
      </div>
    </div>
    <o-dialog :show="showDel" :close="false" @close-click="toggleDelDlg(false)">
      <template #head>
        <div class="dlg-title" :style="{ textAlign: 'center' }">
          <img :src="warningImg" alt="" />
        </div>
      </template>
      <div
        class="dlg-body"
        :style="{
          padding: '8px 0 12px',
          fontSize: '18px',
          textAlign: 'center',
          width: '640px',
        }"
      >
        {{ i18n.delete.description }} {{ path }} 吗？
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
          <o-button
            type="primary"
            @click="headleDelFile(path, repoDetailData.repo_id)"
            >{{ i18n.delete.confirm }}</o-button
          >
        </div>
      </template>
    </o-dialog>
  </div>
</template>

<style lang="scss" scoped>
.loading-template {
  :deep(.el-loading-mask) {
    .el-loading-spinner {
      display: none;
    }
  }
}
.file-editing {
  background-color: #f5f6f8;
  max-width: 1472px;
  // padding: 27px 185px;
  .input-dom {
    position: absolute;
    width: 0;
    height: 0;
    opacity: 0;
  }
  .file-path {
    display: flex;
    font-size: 18px;
    margin-bottom: 12px;
    .item-path {
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }
  }
  .editing-card {
    margin: 0 auto;
    background-color: #ffffff;
    .file {
      display: flex;
      padding: 0 12px;
      justify-content: space-between;
      background-color: #e5e8f0;
      .file-operation {
        display: flex;
        align-items: center;
        &-item {
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          &:hover {
            text-decoration: underline;
          }
        }
      }
      .text {
        padding-right: 12px;
        font-size: 14px;
        line-height: 20px;
      }
      .o-icon {
        color: #555;
        display: inline-block;
        padding: 12px;
        font-size: 24px;
      }
    }
    :deep(.blank) {
      padding: 16px 20px 40px;
      overflow: auto;
      min-height: calc(100vh - 400px);
      background-color: #ffffff;
      pre {
        height: 100%;
        background-color: #ffffff;
      }
    }
    .big-file {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 30px 0;
      min-height: calc(100vh - 420px);
      font-size: 20px;
      .download {
        cursor: pointer;
        color: #3d8df7;
        &:hover {
          text-decoration: underline;
        }
      }
    }
    .loading-template {
      min-height: calc(100vh - 420px);
    }
  }
}
</style>
