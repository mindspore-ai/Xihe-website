<script setup>
import { ref, reactive, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import OButton from '@/components/OButton.vue';
import OIcon from '@/components/OIcon.vue';
import AppEditor from '@/components/AppEditor.vue';

import IconPlus2 from '~icons/app/plus-square';
import IconDescribe from '~icons/app/describe';
import IconEdit from '~icons/app/edit-file';
import IconPoppver from '~icons/app/popover.svg';

import { uploadFileGitlab } from '@/api/api-gitlab';

import { useFileData } from '@/stores';
import { ElMessage } from 'element-plus';

const router = useRouter();
const route = useRoute();
const prop = defineProps({
  moduleName: {
    type: String,
    default: '',
  },
});
const repoDetailData = computed(() => {
  return useFileData().fileStoreData;
});
const routerParams = router.currentRoute.value.params;

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

let queryRef = ref(null);
const rules = reactive({
  fileName: [
    {
      required: true,
      message: '必填项',
      trigger: 'blur',
    },
    {
      pattern: /^[^\u4e00-\u9fa5]+$/,
      message: '不支持中文文件名',
      trigger: 'blur',
    },
    {
      pattern: /^[a-zA-Z0-9 -./_]{1,210}$/,
      message: '文件名中禁止特殊字符',
      trigger: 'blur',
    },
    {
      pattern: /^[^/]/,
      message: '开头结尾禁止 /',
      trigger: 'blur',
    },
    {
      pattern: /[^/]$/,
      message: '开头结尾禁止 /',
      trigger: 'blur',
    },
  ],
});

let query = reactive({
  fileName: '',
  description: '',
  textValue: '',
});

function getFileDescription() {
  query.description = `add ${query.fileName}`;
}
async function upLoadObs(formEl) {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      let path = query.fileName.trim();
      // 非根目录下
      if (routerParams.contents.length) {
        path = `${routerParams.contents.join('/')}/${path}`;
      }

      uploadFileGitlab(
        {
          type: prop.moduleName,
          name: routerParams.name,
          content: query.textValue,
          commit_message: `created ${query.folderName}`,
          id: repoDetailData.value.id,
        },
        path
      ).then(() => {
        ElMessage({
          type: 'success',
          message: '新建成功！你可点击“文件-编辑”编辑该文件。',
        });
        // 上传成功跳转详情页
        let contents = [...route.params.contents, ...query.fileName.split('/')];
        router.push({
          name: `${prop.moduleName}FileBlob`,
          params: {
            user: route.params.user,
            name: route.params.name,
            contents,
          },
        });
      });
    } else {
      console.error('error submit!');
      return false;
    }
  });
}
function handleClick() {
  let contents = null;
  if (route.params.contents) {
    contents = route.params.contents;
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
</script>

<template>
  <div class="new-file">
    <div class="upload-file">
      <el-form ref="queryRef" :rules="rules" :model="query" prop="region">
        <el-form-item class="item" prop="fileName">
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
            <el-input
              v-model.trim="query.fileName"
              class="name-input"
              :width="400"
              :placeholder="i18n.modelUpload.newFile"
              @change="getFileDescription"
            ></el-input>
          </div>
          <el-popover
            placement="bottom-start"
            :width="372"
            trigger="hover"
            :teleported="false"
          >
            <template #reference>
              <o-icon><icon-poppver></icon-poppver></o-icon>
            </template>
            <div>- 输入/可以将文件创建到新文件夹下</div>
            <div>
              - 文件名称不能以(<span class="remind">/</span
              >)开头或结尾，且不能包含以下字符<span class="remind"
                >>&nbsp;:&nbsp;:&nbsp;*?'&lt;&gt;|</span
              >
            </div>
          </el-popover>
        </el-form-item>
        <el-form-item class="fill">
          <div class="upload-title tip-text">
            <o-icon> <icon-edit></icon-edit> </o-icon>
            <span>{{ i18n.modelUpload.uploadTitle }}</span>
          </div>
        </el-form-item>
        <el-form-item class="fill" prop="textValue">
          <div class="upload-body">
            <app-editor
              v-model="query.textValue"
              :model-value="query.textValue"
            ></app-editor>
          </div>
        </el-form-item>
        <el-form-item v-if="false" class="fill" prop="description">
          <div class="add-describe tip-text">
            <o-icon> <icon-describe></icon-describe> </o-icon>
            <span>{{ i18n.modelUpload.addDescribe }}</span>
          </div>
        </el-form-item>
        <el-form-item v-if="false" class="fill" prop="description">
          <el-input
            v-model="query.description"
            :placeholder="i18n.modelUpload.placeholder"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="upload-bottom">
        <o-button
          class="cancel-btn"
          @click="handleClick(route.params.contents.length)"
          >{{ i18n.modelUpload.cancel }}</o-button
        >
        <o-button type="primary" @click="upLoadObs(queryRef)">{{
          i18n.modelUpload.confirm
        }}</o-button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.upload-file {
  padding: 30px 24px 50px;
  background-color: #fff;
  border-radius: 16px;
  .el-form-item {
    display: flex;
    flex-direction: column;
    margin-top: 0;
    width: fit-content;
    .el-popover.el-popper {
      padding: 24px 16px 16px 16px;
      font-size: 12px;
      line-height: 16px;
      color: #656565;
      .remind {
        color: #f13b35;
      }
    }
    position: relative;
    .el-tooltip__trigger {
      cursor: pointer;
      position: absolute;
      right: -32px;
      top: 5px;
      font-size: 24px;
    }
    .requirement {
      line-height: 34px;
    }
    :deep(.el-form-item__content) {
      display: flex;
      align-items: center;
      justify-content: start;
      width: auto;
    }
    justify-content: space-between;
    :deep(.el-select__popper) {
      top: 390px;
    }
    .text {
      height: 40px;
      line-height: 40px;
    }
    .radio {
      width: 400px;
      display: flex;
      flex-direction: column;
      .explain {
        color: #999999;
        font-size: 14px;
      }
    }
  }
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
  .fill {
    width: 100%;
    .el-input {
      max-width: 100%;
      width: 100%;
    }
  }
  .tip-text {
    display: flex;
    align-items: center;
    // margin-bottom: 16px;
    font-size: 18px;
    .o-icon {
      margin-right: 8px;
    }
  }
  .model-name {
    // margin-bottom: 36px;
    .name-input {
      margin: 0 16px;
      font-size: 14px;
      width: 400px;
    }
    .name-input-text {
      font-size: 14px;
    }
  }
  .upload-body {
    width: 100%;
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
</style>
