<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import OIcon from '@/components/OIcon.vue';
import OInput from '@/components/OInput.vue';
import OButton from '@/components/OButton.vue';

import IconPlus2 from '~icons/app/plus-square';
import IconDescribe from '~icons/app/describe';
import IconUpload from '~icons/app/upload';

import { uploadFileGitlab } from '@/api/api-gitlab';

import { useUserInfoStore } from '@/stores';
import { fileToBase64 } from '@/shared/utils';

const router = useRouter();
const route = useRoute();
const userInfo = useUserInfoStore();

const routerParams = router.currentRoute.value.params;

const uploadRef = ref();
const description = ref('');
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
    limitText: '（最大不超过5GB）',
    addDescribe: '添加描述',
    placeholder: '请输入此次操作描述信息',
    cancel: '取消',
    confirm: '确认',
  },
};
const Progress = ref(0);

// 进度条
// function callback(transferredAmount, totalAmount) {
//   Progress.value = parseFloat(
//     ((transferredAmount * 100.0) / totalAmount).toFixed(2)
//   );
// }
// gitlab 上传
async function upLoad(param) {
  let path = `${param.file.name}`;
  //非根目录下
  if (routerParams.contents.length) {
    path = `${routerParams.contents.join('/')}/${param.file.name}`;
  }
  await fileToBase64(param.file, function (content) {
    uploadFileGitlab(
      {
        branch: 'main',
        encoding: 'base64',
        author_email: userInfo.email,
        author_name: userInfo.userName,
        content: content,
        commit_message: description.value || `upload ${param.file.name}`,
      },
      path
    ).then(() => {
      ElMessage({
        type: 'success',
        message: '上传成功！你可点击“文件-编辑”编辑文件。',
      });
      pathClick(route.params.contents.length);
      Progress.value = '';
      fileList.value = [];
    });
  });
}

const fileList = ref([]);

function onChange() {
  fileList.value.length > 1 ? fileList.value.splice(0, 1) : '';
  description.value = `upload ${fileList.value[0].name}`;
}
function beforeUpload(rawFile) {
  if (rawFile.size / 1024 / 1024 / 1024 > 5) {
    ElMessage.warning('文件过大，文件不得超过5GB，请重新选择文件。');
    return false;
  }
  return true;
}
const submitUpload = () => {
  uploadRef.value.submit();
};
function pathClick(index) {
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
onMounted(() => {
  // document.querySelector(
  //   '.upload-body .el-upload__input'
  // ).webkitdirectory = true;
});
</script>
<template>
  <div class="upload">
    <div class="upload-file">
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
