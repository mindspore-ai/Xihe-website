<script setup>
import { ref, watch, reactive } from 'vue';
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

import {
  getDownLoadToken,
  downloadFileObs,
  getDelToken,
  delFileObs,
  findFile,
  downloadFile,
} from '@/api/api-obs';

import { getGitlabFileDetail, getGitlabFileRaw } from '@/api/api-gitlab';
import { ElMessage } from 'element-plus';
import { useFileData } from '@/stores';

const prop = defineProps({
  moduleName: {
    type: String,
    default: '',
  },
});

let detailData = reactive(useFileData().fileStoreData);
const fileData = ref();
const mkit = handleMarkdown();
const codeString = ref('');
const result = ref(mkit.render(codeString.value));
const rawData = ref('');
const router = useRouter();
const route = useRoute();

let routerParams = router.currentRoute.value.params;
const path = `${routerParams.contents.join('/')}`;

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
const rawBlob = ref('');
const showDel = ref(false);

let reopt = {
  method: 'get',
  url: null,
  withCredentials: false,
  headers: null,
  validateStatus: function (status) {
    return status >= 200;
  },
  maxRedirects: 0,
  responseType: 'blob',
  data: null,
};

function previewFile(file_path) {
  getGitlabFileRaw(file_path).then((res) => {
    if (
      suffix.value === 'md' ||
      suffix.value === 'json' ||
      suffix.value === 'py' ||
      suffix.value === 'txt' ||
      suffix.value === 'log' ||
      !res.includes('�')
    ) {
      rawData.value = res;
      // md文件不需加```
      suffix.value === 'md'
        ? (codeString.value = res)
        : (codeString.value = '```' + suffix.value + ' \n' + res + '\n```');
    } else {
      showBlob.value = false;
    }
  });
  // getDownLoadToken({ objkey }).then((res) => {
  //   reopt.url = res.data.signedUrl;
  //   reopt.responseType = 'blob';
  //   downloadFileObs(reopt).then((res) => {
  //     rawBlob.value = res;
  //     let reader = new FileReader();
  //     reader.readAsText(res, 'utf-8');
  //     reader.onload = function () {
  //       if (
  //         suffix.value === 'md' ||
  //         suffix.value === 'json' ||
  //         suffix.value === 'py' ||
  //         suffix.value === 'txt' ||
  //         suffix.value === 'log' ||
  //         !reader.result.includes('�')
  //       ) {
  //         rawData.value = reader.result;
  //         // md文件不需加```
  //         suffix.value === 'md'
  //           ? (codeString.value = reader.result)
  //           : (codeString.value =
  //               '```' + suffix.value + ' \n' + reader.result + '\n```');
  //       } else {
  //         showBlob.value = false;
  //       }
  //     };
  //   });
  // });
}

async function headleDelFile(objkey) {
  try {
    await getDelToken({ objkey }).then((res) => {
      reopt.method = 'DELETE';
      reopt.url = res.data.signedUrl;
      reopt.responseType = 'text';
    });
    await delFileObs(reopt).then(() => {
      ElMessage({
        type: 'success',
        message: '删除成功',
      });
      // 删除完成跳转至被删除文件目录下
      pathClick(route.params.contents.length - 1);
    });
  } catch (error) {
    ElMessage({
      type: 'error',
      message: error,
    });
  }
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
getGitlabFileDetail(path).then((res) => {
  fileData.value = res;
  fileData.value.file_name.match(/[^.]+$/)
    ? (suffix.value = fileData.value.file_name.match(/[^.]+$/)[0])
    : (suffix.value = 'py');
  if (fileData.value.size < 524288) {
    showBlob.value = true;
    previewFile(fileData.value.file_path);
  }
});

// findFile(path).then((res) => {
//   if (res.status === 200 && res.data.children.length) {
//     fileData.value = res.data.children[0];
//   }
// });

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
  // let routeParams = route.params.contents;
  // !!! 此处填写各自模块的组件！！！
  // 路径最后一项为文件，跳转至文件详情
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
      <div v-if="fileData" class="file">
        <div class="file-operation">
          <o-icon><files></files></o-icon
          ><span class="text">{{ fileData.description }}</span>
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
            v-if="detailData.is_owner && showBlob"
            class="file-operation-item"
            @click="goEditor"
          >
            <o-icon><icon-editing></icon-editing></o-icon
            ><span class="text">{{ i18n.edit }}</span>
          </div>
          <div
            v-if="detailData.is_owner"
            class="file-operation-item"
            @click="toggleDelDlg(true)"
          >
            <o-icon><icon-delete></icon-delete></o-icon
            ><span class="text">{{ i18n.deleteIt }}</span>
          </div>
          <div
            class="file-operation-item"
            @click="downloadFile(fileData.path, fileData.name, detailData.id)"
          >
            <o-icon><icon-download></icon-download></o-icon
            ><span class="text">{{ i18n.download }}</span>
          </div>
        </div>
      </div>
      <div
        v-if="showBlob"
        v-highlight
        class="blank markdown-file"
        v-html="result"
      ></div>
      <div v-else class="big-file">
        文件太大或格式不支持展示但你仍然可以<span
          class="download"
          @click="downloadFile(fileData.path, fileData.name, detailData.id)"
          >下载 </span
        ><span v-if="fileData"> ({{ changeByte(fileData.size) }}) </span>
      </div>
    </div>
    <o-dialog
      v-if="fileData"
      :show="showDel"
      :close="false"
      @close-click="toggleDelDlg(false)"
    >
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
        {{ i18n.delete.description }} {{ fileData.name }} 吗？
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
          <o-button type="primary" @click="headleDelFile(fileData.path)">{{
            i18n.delete.confirm
          }}</o-button>
        </div>
      </template>
    </o-dialog>
  </div>
</template>

<style lang="scss" scoped>
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
  }
}
</style>
