<script setup>
import { ref, watch, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Markdown from 'markdown-it';

import Files from '~icons/app/files';
import IconCheck from '~icons/app/check';
import IconCopy from '~icons/app/copy';
import IconEditing from '~icons/app/editing';
import IconDelete from '~icons/app/delete';
import IconDownload from '~icons/app/download';

import {
  getDownLoadToken,
  downloadFileObs,
  getDelToken,
  delFileObs,
  findFile,
  downloadFile,
} from '@/api/api-obs';
import { ElMessage } from 'element-plus';
import { useFileData } from '@/stores';

let detailData = reactive(useFileData().fileStoreData);
const fileData = ref();

const mkit = new Markdown({ html: true });
const codeString = ref('');
const result = ref(mkit.render(codeString.value));
const rawData = ref('');
const router = useRouter();
const route = useRoute();
let routerParams = router.currentRoute.value.params;
const path = `xihe-obj/datasets/${route.params.user}/${
  routerParams.name
}/${routerParams.contents.join('/')}`;

const i18n = {
  text1: '查看源代码',
  text2: '复制',
  text3: '编辑',
  text4: '删除',
  text5: '下载',
};
const showBlob = ref(false);
const suffix = ref('');
const inputDom = ref();
const rawBlob = ref();
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

function preview(objkey) {
  getDownLoadToken({ objkey }).then((res) => {
    console.log(res);
    reopt.url = res.data.signedUrl;
    reopt.responseType = 'blob';
    console.log(reopt);
    downloadFileObs(reopt).then((res) => {
      rawBlob.value = res;
      let reader = new FileReader();
      reader.readAsText(res, 'utf-8');
      reader.onload = function () {
        rawData.value = reader.result;
        suffix.value === 'md'
          ? (codeString.value = reader.result)
          : (codeString.value =
              '```' + suffix.value + ' \n' + reader.result + '\n```');
      };
    });
  });
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
    name: 'datasetFileEditor',
    params: {
      user: routerParams.user,
      name: routerParams.name,
      contents: routerParams.contents,
    },
  });
}
watch(
  () => codeString.value,
  (val) => {
    result.value = mkit.render(val);
  }
);

findFile(path).then((res) => {
  if (res.status === 200 && res.data.children.length) {
    fileData.value = res.data.children[0];
    fileData.value.name.match(/[^.]+$/)
      ? (suffix.value = fileData.value.name.match(/[^.]+$/)[0])
      : (suffix.value = 'py');
    if (fileData.value.size < 524288) {
      showBlob.value = true;
      preview(fileData.value.path);
    }
  }
});

function goRaw(blob) {
  const blobs = new Blob([blob]);
  let href = window.URL.createObjectURL(blobs);
  window.open(href);
}
function copyText(value) {
  inputDom.value.value = value;
  inputDom.value.select();
  document.execCommand('Copy'); // 执行浏览器复制命令
  ElMessage({
    type: 'success',
    message: '复制成功',
    center: true,
  });
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
      name: 'datasetFile',
      params: {
        user: route.params.user,
        name: route.params.name,
        contents,
      },
    });
  }
}
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
        <div>
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
            ><span class="text">{{ i18n.text1 }}</span>
          </div>
          <div
            v-if="showBlob"
            class="file-operation-item"
            @click="copyText(rawData)"
          >
            <o-icon><icon-copy></icon-copy></o-icon
            ><span class="text">{{ i18n.text2 }}</span>
          </div>
          <div
            v-if="detailData.is_owner && showBlob"
            class="file-operation-item"
            @click="goEditor"
          >
            <o-icon><icon-editing></icon-editing></o-icon
            ><span class="text">{{ i18n.text3 }}</span>
          </div>
          <div
            v-if="detailData.is_owner"
            class="file-operation-item"
            @click="headleDelFile(fileData.path)"
          >
            <o-icon><icon-delete></icon-delete></o-icon
            ><span class="text">{{ i18n.text4 }}</span>
          </div>
          <div
            class="file-operation-item"
            @click="downloadFile(fileData.path, fileData.name, detailData.id)"
          >
            <o-icon><icon-download></icon-download></o-icon
            ><span class="text">{{ i18n.text5 }}</span>
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
        文件太大不支持展示但你仍然可以<span
          class="download"
          @click="downloadFile(fileData.path, fileData.name, detailData.id)"
          >下载</span
        >
      </div>
    </div>
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
      justify-content: space-between;
      background-color: #e5e8f0;
      .file-operation {
        display: flex;
        &-item {
          cursor: pointer;
          &:hover {
            text-decoration: underline;
          }
        }
      }
      .text {
        padding-right: 12px;
        font-size: 14px;
      }
      .o-icon {
        display: inline-block;
        padding: 12px;
      }
    }
    .blank {
      overflow: auto;
      padding: 16px;
      min-height: calc(100vh - 400px);
      background-color: #ffffff;
      pre {
        height: 100%;
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
