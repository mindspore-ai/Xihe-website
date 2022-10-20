<script setup>
import { ref, reactive, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import OInput from '@/components/OInput.vue';
import OButton from '@/components/OButton.vue';
import OIcon from '@/components/OIcon.vue';
import OEditor from '@/components/OEditor.vue';

import IconPlus2 from '~icons/app/plus-square';
import IconDescribe from '~icons/app/describe';
import IconEdit from '~icons/app/edit-file';

import {
  getGitlabFileDetail,
  getGitlabFileRaw,
  editorFileGitlab,
} from '@/api/api-gitlab';

import { useUserInfoStore, useFileData } from '@/stores';

const userInfoStore = useUserInfoStore();
const repoDetailData = computed(() => {
  return useFileData().fileStoreData;
});
const isShowEditor = ref(false);
const router = useRouter();
const route = useRoute();
const suffix = ref('');
let routerParams = route.params;
let path = routerParams.contents.join('/');

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
const prop = defineProps({
  moduleName: {
    type: String,
    default: '',
  },
});
let fileData = reactive({});
const description = ref('');

const codeString = ref('');
function previewFile() {
  getGitlabFileRaw({
    user: routerParams.user,
    path: fileData.file_path,
    id: repoDetailData.value.id,
    name: routerParams.name,
  }).then((res) => {
    suffix.value === 'json'
      ? (codeString.value = JSON.stringify(res, null, '\t'))
      : (codeString.value = res);
    isShowEditor.value = true;
  });
  // getDownLoadToken(params).then((res) => {
  //   reopt.url = res.data.signedUrl;
  //   downloadFileObs(reopt).then((res) => {
  //     let reader = new FileReader();
  //     reader.readAsText(res, 'utf-8');
  //     reader.onload = function () {
  //       codeString.value = reader.result;
  //       isShow.value = true;
  //     };
  //   });
  // });
}

async function uploadGitlab() {
  await editorFileGitlab(
    {
      name: routerParams.name,
      content: codeString.value,
      path: path,
      id: repoDetailData.value.id,
      commit_message: description.value || `edit ${fileData.file_name}`,
    },
    path
  ).then(() => {
    ElMessage({
      type: 'success',
      message: '保存成功！你可点击“文件-编辑”再次编辑该文件。',
    });
  });
  // await handleUpload(
  //   {
  //     file,
  //     path,
  //     isEdit: true,
  //     description: description.value || `edit ${fileData.name}`,
  //   },
  //   null,
  //   function () {
  //     ElMessage({
  //       type: 'success',
  //       message: '保存成功！你可点击“文件-编辑”再次编辑该文件。',
  //     });
  //   }
  // );
  pathClick(route.params.contents.length);
}

// findFile(path).then((res) => {
//   if (res.status && res.data && res.data.children.length) {
//     fileData = res.data.children[0];
//     description.value = `edit ${fileData.name}`;
//     downLoad(fileData.path);
//   }
// });
getGitlabFileDetail(path, repoDetailData.value.repo_id).then((res) => {
  fileData = res;
  suffix.value = fileData.file_name.match(/[^.]+$/)[0];
  description.value = `edit ${fileData.file_name}`;
  if (fileData.size < 524288) {
    previewFile(fileData.file_path, repoDetailData.value.repo_id);
  }
});
function pathClick(index) {
  let routerName = '';
  route.params.contents.length === index
    ? (routerName = `${prop.moduleName}FileBlob`)
    : (routerName = `${prop.moduleName}File`);
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
          v-if="isShowEditor"
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
        v-model="description"
        size="fill"
        :placeholder="i18n.modelUpload.placeholder"
      ></o-input>
      <div class="upload-bottom">
        <o-button
          class="cancel-btn"
          @click="pathClick(route.params.contents.length)"
          >{{ i18n.modelUpload.cancel }}</o-button
        >
        <o-button type="primary" @click="uploadGitlab">{{
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
