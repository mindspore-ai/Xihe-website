<script setup>
import { ref, reactive, computed, defineProps } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import OInput from '@/components/OInput.vue';
import OButton from '@/components/OButton.vue';
import OIcon from '@/components/OIcon.vue';
import AppEditor from '@/components/AppEditor.vue';

import IconPlus2 from '~icons/app/plus-square';
import IconDescribe from '~icons/app/describe';
import IconEdit from '~icons/app/edit-file';
import { ElMessage } from 'element-plus';

import {
  getGitlabTree,
  getGitlabFileRaw,
  editorFileGitlab,
} from '@/api/api-gitlab';

import { useFileData } from '@/stores';

const repoDetailData = computed(() => {
  return useFileData().fileStoreData;
});
const isShowEditor = ref(false);
const router = useRouter();
const route = useRoute();
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
    type: prop.moduleName,
    user: routerParams.user,
    path: path,
    id: repoDetailData.value.id,
    name: routerParams.name,
  }).then((res) => {
    typeof res === 'object'
      ? (codeString.value = JSON.stringify(res, null, '\t'))
      : (codeString.value = res.toString());
    isShowEditor.value = true;
  });
}

function handleClick(index) {
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

async function uploadGitlab() {
  await editorFileGitlab(
    {
      type: prop.moduleName,
      name: routerParams.name,
      content: codeString.value,
      path: path,
      id: repoDetailData.value.id,
      commit_message: description.value || `edit ${fileData.name}`,
    },
    path
  ).then(() => {
    ElMessage({
      type: 'success',
      message: '保存成功！你可点击“文件-编辑”再次编辑该文件。',
    });
  });

  handleClick(route.params.contents.length);
}
function verifyFile() {
  const parentDirectory = path.includes('/')
    ? path
        .split('/')
        .splice(0, path.split('/').length - 1)
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
        return item.path === path;
      });
      if (treeItem?.length && !treeItem[0].is_lfs_file) {
        fileData = treeItem[0];
        previewFile();
      } else {
        router.push('/404');
      }
    });
  } catch (error) {
    ElMessage({
      type: 'error',
      message: 'error',
    });
  }
}
verifyFile();
</script>
<template>
  <div class="upload-file">
    <div class="file-inner">
      <div class="model-name tip-text">
        <o-icon> <icon-plus2></icon-plus2> </o-icon>
        <div class="file-path">
          <div class="item-path" @click="handleClick(null)">
            {{ routerParams.name }}
          </div>
          <div
            v-for="(item, index) in routerParams.contents"
            :key="item"
            class="item-path"
            @click="handleClick(index + 1)"
          >
            /{{ item }}
          </div>
        </div>
      </div>
      <div class="upload-title tip-text">
        <o-icon> <icon-edit></icon-edit> </o-icon>
        <span>{{ i18n.modelUpload.uploadTitle }}</span>
      </div>
      <div class="upload-body" :class="isShowEditor ? '' : 'border'">
        <app-editor
          v-if="isShowEditor"
          v-model="codeString"
          :lang="lang"
          :model-value="codeString"
        ></app-editor>
      </div>
      <div v-if="false" class="add-describe tip-text">
        <o-icon> <icon-describe></icon-describe> </o-icon>
        <span>{{ i18n.modelUpload.addDescribe }}</span>
      </div>
      <o-input
        v-if="false"
        v-model="description"
        size="fill"
        :placeholder="i18n.modelUpload.placeholder"
      ></o-input>
      <div class="upload-bottom">
        <o-button
          class="cancel-btn"
          @click="handleClick(route.params.contents.length)"
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
    border-radius: 16px;
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
      min-height: 275px;
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
    .border {
      border: 1px solid #999;
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
