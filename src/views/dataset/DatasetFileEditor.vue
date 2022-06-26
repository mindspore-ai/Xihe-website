<script setup>
import { ref, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import OInput from '@/components/OInput.vue';
import OButton from '@/components/OButton.vue';
import OIcon from '@/components/OIcon.vue';
import OEditor from '@/components/OEditor.vue';

import IconPlus2 from '~icons/app/plus-square';
import IconDescribe from '~icons/app/describe';
import IconEdit from '~icons/app/edit-file';

import {
  findFile,
  downloadFileObs,
  getDownLoadToken,
  handleUpload,
} from '@/api/api-obs';

const isShow = ref(false);
const router = useRouter();
const route = useRoute();
let routerParams = route.params;
let path = '';
routerParams.contents
  ? (path = `xihe-obj/datasets/${route.params.user}/${
      routerParams.name
    }/${routerParams.contents.join('/')}`)
  : '';

const lang = ref('');
const i18n = {
  modelUpload: {
    uploadTitle: '编辑文件',
    inputText: '输入/可以将文件创建到新文件夹下',
    addDescribe: '添加描述',
    newFile: '请创建文件名称',
    placeholder: '请输入此次操作描述信息',
    cancel: '取消',
    confirm: '确认',
  },
};

const describe = ref('');
let fileData = reactive({});
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

const codeString = ref('');
function downLoad(objkey) {
  let params = {
    objkey: objkey,
  };
  getDownLoadToken(params).then((res) => {
    reopt.url = res.data.signedUrl;
    downloadFileObs(reopt).then((res) => {
      let reader = new FileReader();
      reader.readAsText(res, 'utf-8');
      reader.onload = function () {
        codeString.value = reader.result;
        isShow.value = true;
      };
    });
  });
}
// SDK 上传
async function upLoadObs() {
  // 构造文件对象
  let blob = new Blob([codeString.value], {
    type: 'text/plain;charset=utf-8',
  });
  let file = new File([blob], fileData.name, {
    type: 'text/plain;charset=utf-8',
    lastModified: Date.now(),
  });
  await handleUpload(
    {
      file,
      path,
      isEdit: true,
      description: describe.value || `edit ${fileData.name}`,
    },
    null,
    function () {
      ElMessage({
        type: 'success',
        message: '保存成功！你可点击“文件-编辑”再次编辑该文件。',
      });
    }
  );
  pathClick(route.params.contents.length);
}

findFile(path).then((res) => {
  if (res.status && res.data && res.data.children.length) {
    fileData = res.data.children[0];
    downLoad(fileData.path);
  }
});
function pathClick(index) {
  // !!! 此处填写各自模块的组件名称！！！
  // 路径最后一项为文件，跳转至文件详情，其余项跳转至文件树页面
  let routerName = '';
  route.params.contents.length === index
    ? (routerName = 'datasetFileBlob')
    : (routerName = 'datasetFile');
  let contents = route.params.contents.splice(0, index);
  router.push({
    name: routerName,
    params: {
      user: route.params.user,
      name: route.params.name,
      contents,
    },
  });
}
</script>
<template>
  <div class="upload-file">
    <div class="file-inner">
      <div class="model-name tip-text">
        <o-icon> <icon-plus2></icon-plus2> </o-icon>
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
      </div>
      <div class="upload-title tip-text">
        <o-icon> <icon-edit></icon-edit> </o-icon>
        <span>{{ i18n.modelUpload.uploadTitle }}</span>
      </div>
      <div class="upload-body">
        <o-editor
          v-if="isShow"
          v-model="codeString"
          :lang="lang"
          :model-value="codeString"
        ></o-editor>
      </div>
      <div class="add-describe tip-text">
        <o-icon> <icon-describe></icon-describe> </o-icon>
        <span>{{ i18n.modelUpload.addDescribe }}</span>
      </div>
      <o-input
        v-model="describe"
        size="fill"
        :placeholder="i18n.modelUpload.placeholder"
      ></o-input>
      <div class="upload-bottom">
        <o-button
          class="cancel-btn"
          @click="pathClick(route.params.contents.length)"
          >{{ i18n.modelUpload.cancel }}</o-button
        >
        <o-button type="primary" @click="upLoadObs">{{
          i18n.modelUpload.confirm
        }}</o-button>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.upload-file {
  .file-inner {
    padding: 30px 24px 50px;
    background-color: #fff;
    .tip-text {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
      font-size: 18px;
      .file-path {
        display: flex;
        font-size: 18px;
        .item-path {
          cursor: pointer;
          &:hover {
            text-decoration: underline;
          }
        }
      }
      .o-icon {
        margin-right: 8px;
      }
    }
    .model-name {
      margin-bottom: 36px;
      .name-input {
        margin: 0 16px;
        font-size: 14px;
      }
      .name-input-text {
        font-size: 14px;
      }
    }
    .upload-body {
      margin-bottom: 24px;
      .main-editor {
        padding: 8px 10px;
        width: 100%;
        height: 275px;
        resize: none;
        outline: none;
        &:focus {
          border: 1px solid #3d8df7;
        }
      }
    }
    .upload-bottom {
      display: flex;
      justify-content: center;
      margin-top: 48px;
      .cancel-btn {
        margin-right: 24px;
      }
    }
  }
}
</style>
