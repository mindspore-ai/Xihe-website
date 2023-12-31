<script setup>
import { ref, computed, defineProps } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import OIcon from '@/components/OIcon.vue';
import OInput from '@/components/OInput.vue';
import OButton from '@/components/OButton.vue';

import IconPlus2 from '~icons/app/plus-square';
import IconDescribe from '~icons/app/describe';
import IconUpload from '~icons/app/upload';

import { uploadFileGitlab } from '@/api/api-gitlab';

import { useFileData } from '@/stores';
import { fileToBase64 } from '@/shared/utils';
import { ElMessage } from 'element-plus';

const router = useRouter();
const route = useRoute();

const routerParams = router.currentRoute.value.params;
const repoDetailData = computed(() => {
  return useFileData().fileStoreData;
});
const uploadRef = ref();
const description = ref('');
const fileList = ref([]);

const prop = defineProps({
  moduleName: {
    type: String,
    default: '',
  },
});
const i18n = {
  modelUpload: {
    uploadTitle: '上传文件',
    dragText: '拖拽文件到此处上传 或 ',
    clickText: '点击此处浏览本地文件并上传',
    limitText: '（最大不超过200kb）',
    addDescribe: '添加描述',
    placeholder: '请输入此次操作描述信息',
    cancel: '取消',
    confirm: '确认',
  },
};
const Progress = ref(0);
function handleClick(index) {
  let contents = '';
  if (route.params.contents) {
    contents = route.params.contents.splice(0, index);
  }
  router.push({
    name: `${prop.moduleName}File`,
    params: {
      user: route.params.user,
      name: route.params.name,
      contents,
    },
  });
}
// gitlab 上传
async function upLoad(param) {
  let path = `${param.file.name}`;
  // 非根目录下
  if (routerParams.contents.length) {
    path = `${routerParams.contents.join('/')}/${param.file.name}`;
  }
  await fileToBase64(param.file, function (content) {
    uploadFileGitlab(
      {
        type: prop.moduleName,
        base64_encoded: true,
        name: routerParams.name,
        content: content.split(',')[1],
        commit_message: description.value || `upload ${param.file.name}`,
        id: repoDetailData.value.id,
      },
      path
    ).then(() => {
      ElMessage({
        type: 'success',
        message: '上传成功！你可点击“文件-编辑”编辑文件。',
      });
      handleClick(route.params.contents.length);
      Progress.value = '';
      fileList.value = [];
    });
  });
}

function onChange() {
  fileList.value.length > 1 ? fileList.value.splice(0, 1) : '';
  description.value = `upload ${fileList.value[0].name}`;
}
function beforeUpload(rawFile) {
  if (!/^[^\u4e00-\u9fa5]+$/.test(rawFile.name)) {
    ElMessage.warning('不支持中文文件名');
    return false;
  }
  if (rawFile.size / 1024 > 200) {
    ElMessage.warning('web端暂只支持200kb以内文件上传，请使用git上传');
    return false;
  }
  return true;
}
const submitUpload = () => {
  uploadRef.value.submit();
};
</script>
<template>
  <div class="upload">
    <div class="upload-file">
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
        <o-icon> <icon-upload></icon-upload> </o-icon>
        <span>{{ i18n.modelUpload.uploadTitle }}</span>
      </div>
      <div class="upload-body">
        <el-upload
          ref="uploadRef"
          class="upload-demo"
          :http-request="upLoad"
          :on-change="onChange"
          :multiple="false"
          :auto-upload="false"
          :file-list="fileList"
          :before-upload="beforeUpload"
          action=""
          drag
        >
          <div class="el-upload__text">
            {{ i18n.modelUpload.dragText
            }}<em>{{ i18n.modelUpload.clickText }}</em>
            <span class="red">{{ i18n.modelUpload.limitText }}</span>
          </div>
        </el-upload>
        <el-progress v-if="Progress" :percentage="Progress" />
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
        <o-button type="primary" @click="submitUpload">{{
          i18n.modelUpload.confirm
        }}</o-button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.red {
  color: #ff4040ff;
}
.upload-file {
  padding: 30px 24px 50px;
  background-color: #fff;
  border-radius: 16px;
  .tip-text {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    font-size: 18px;
    .o-icon {
      margin-right: 8px;
    }
  }
  .model-name {
    margin-bottom: 36px;
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
  }
  .upload-body {
    margin-bottom: 24px;
    :deep(.el-upload) {
      width: 100%;
      .el-upload-dragger {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 275px;
        border-radius: 0;
        border: 1px solid #999;
        transition: all 0.3s;
        border-radius: 16px;
        &:hover {
          border-color: #0d8dff;
        }
        .el-icon--upload-success {
          display: none;
        }
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
</style>
