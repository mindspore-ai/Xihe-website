<script setup>
import { ref, watch, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import OButton from '@/components/OButton.vue';
import RelateCard from '@/components/train/RelateCard.vue';
import ProjectRelateCard from '@/components/train/ProjectRelateCard.vue';
import NoRelate from '@/components/train/NoRelate.vue';

import IconPlus from '~icons/app/plus';
import IconAddFile from '~icons/app/add-file';
import IconFile from '~icons/app/model-card-empty';
import { ElDialog } from 'element-plus';

import { addDataset, deleteDataset, getReadmeInfo } from '@/api/api-model';
import { getGitlabFileRaw, getGitlabTree } from '@/api/api-gitlab';
import { useFileData, useUserInfoStore } from '@/stores';
import { handleMarkdown } from '@/shared/markdown';

const userInfo = useUserInfoStore();
const router = useRouter();
const route = useRoute();
let routerParams = router.currentRoute.value.params;
route.hash ? getReadMeFile() : '';
const mkit = handleMarkdown();

const codeString = ref('');
const result = ref();
// let README = '';

const isShow = ref(false);
const addSearch = ref('');
// const isShow1 = ref(false);

const detailData = computed(() => {
  return useFileData().fileStoreData;
});
const emit = defineEmits(['on-click']);

const pushParams = {
  user: routerParams.user,
  name: routerParams.name,
  contents: routerParams.contents,
};

const i18n = {
  recentDownload: '近期下载量',
  dataset: '相关数据集',
  addDataset: '添加相关数据集',
  addProject: '添加相关项目',
  download: '下载量',
  uploadTime: '上传时间',
  relatedItem: '相关项目',
  editor: '编辑',
  uploadReadMe: [
    '当前无模型卡片，点击',
    '新建README.md文件',
    '或',
    '上传README.md文件',
  ],
  emptyVisited: '无模型卡片',
};

// 判断是否含有readme文件
// getReadmeInfo(detailData.value.owner, detailData.value.name).then((res) => {
//   console.log(res);
//   if (res.data.has_readme) {
//     //
//   }
// });

// 获取README文件
function getReadMeFile() {
  try {
    getReadmeInfo(
      detailData.value.owner,
      detailData.value.name
      //   {
      //   type: 'model',
      //   user: routerParams.user,
      //   path: '',
      //   id: detailData.value.id,
      //   name: routerParams.name,
      // }
    )
      .then((tree) => {
        if (tree.data.has_readme) {
          getGitlabFileRaw({
            type: 'model',
            user: routerParams.user,
            path: 'README.md',
            id: detailData.value.id,
            name: routerParams.name,
          }).then((res) => {
            res ? (codeString.value = res) : '';
            result.value = mkit.render(codeString.value);
          });
        }
        // README = tree?.data?.filter((item) => {
        //   return item.name === 'README.md';
        // });
        // if (README && README.length) {
        //   getGitlabFileRaw({
        //     type: 'model',
        //     user: routerParams.user,
        //     path: 'README.md',
        //     id: detailData.value.id,
        //     name: routerParams.name,
        //   }).then((res) => {
        //     res ? (codeString.value = res) : '';
        //     result.value = mkit.render(codeString.value);
        //   });
        // } else {
        //   codeString.value = '';
        // }
      })
      .catch((err) => {
        console.error(err);
      });
  } catch (error) {
    console.error(error);
  }
}
function addRelateClick() {
  isShow.value = true;
}

function confirmAdd() {
  // 如果填写为空,提示-->return
  if (addSearch.value === '') return;
  let params = {};
  let paramsArr = addSearch.value.split('/');
  params.owner = paramsArr[0];
  params.name = paramsArr[1];
  // 训练数据集添加
  addDataset(params, detailData.value.owner, detailData.value.id)
    .then((res) => {
      if (res.data.length === 0) {
        ElMessage({
          type: 'error',
          message: '没有查询到数据！',
        });
        return;
      } else {
        ElMessage({
          type: 'success',
          message: '添加成功',
        });
        emit('on-click');
      }
    })
    .catch(() => {
      addSearch.value = '';
      ElMessage({
        type: 'error',
        message: '未查询到数据',
      });
    });
  isShow.value = false;
}

// 删除数据集
function deleteClick(item) {
  console.log(item);
  if (item.type === 'dataset') {
    deleteDataset(
      { id: item.id, owner: item.owner.name },
      detailData.value.owner,
      detailData.value.id
    ).then(() => {
      ElMessage({
        type: 'success',
        message: '删除成功！你可再次添加相关数据集。',
      });
      emit('on-click');
    });
  }
}

function goEditor() {
  pushParams.contents = ['README.md'];
  router.push({
    name: 'modelFileEditor',
    params: pushParams,
  });
}
function emptyClick(ind) {
  if (ind === 1) {
    router.push({
      name: 'modelFileNew',
      params: pushParams,
    });
  } else if (ind === 3) {
    router.push({
      name: 'modelFileUpload',
      params: pushParams,
    });
  }
}
function goDetailClick(val) {
  router.push(`/datasets/${val.owner.name}/${val.name}`);
}
function goProjectClick(val) {
  router.push(`/projects/${val.owner.name}/${val.name}`);
}
// 文本监听
watch(
  () => codeString.value,
  (val) => {
    if (typeof val === 'number') {
      val = val.toString();
    }
    typeof val === 'string' ? '' : (val = '');
    codeString.value = val;
    result.value = mkit.render(codeString.value);
  }
);
// 路由监听
watch(
  () => route,
  () => {
    if (route.name === 'modelCard' && !route.hash) {
      codeString.value = '';
      getReadMeFile();
    }
  },
  {
    deep: true,
    immediate: true,
  }
);
</script>
<template>
  <div v-if="detailData.id" class="model-card">
    <div v-if="codeString" class="markdown-body">
      <div v-highlight v-dompurify-html="result" class="markdown-file"></div>
      <o-button
        v-if="detailData.owner === userInfo.userName"
        @click="goEditor"
        >{{ i18n.editor }}</o-button
      >
    </div>
    <div
      v-else-if="detailData.owner === userInfo.userName"
      class="upload-readme markdown-body"
    >
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
    <div v-else class="upload-readme markdown-body">
      <div class="upload-readme-img">
        <o-icon> <icon-file></icon-file> </o-icon>
      </div>
      <div class="upload-readme-tip">
        <p>
          {{ i18n.emptyVisited }}
        </p>
      </div>
    </div>
    <div class="right-data">
      <div class="download-data">
        <div class="download-title">{{ i18n.recentDownload }}</div>
        <span class="download-count">{{ detailData.download_count }}</span>
      </div>
      <!-- 添加数据集 -->
      <div class="dataset-data">
        <div class="add-title">
          <div class="title">{{ i18n.dataset }}</div>
          <p
            v-if="userInfo.userName === detailData.owner"
            class="add"
            @click="addRelateClick"
          >
            {{ i18n.addDataset }} <o-icon><icon-plus></icon-plus></o-icon>
          </p>
        </div>
        <div class="dataset-box">
          <relate-card
            v-if="detailData.related_datasets"
            :detail-data="detailData"
            :name="'related_datasets'"
            @delete="deleteClick"
            @jump="goDetailClick"
          ></relate-card>
          <no-relate v-else relate-name="dataset"></no-relate>
        </div>
      </div>
      <!-- 项目 -->
      <div class="related-project">
        <div class="add-title">
          <div class="title">{{ i18n.relatedItem }}</div>
        </div>
        <project-relate-card
          v-if="detailData.related_projects"
          :detail-data="detailData"
          :name="'related_projects'"
          @delete="deleteClick"
          @jump="goProjectClick"
        ></project-relate-card
        ><no-relate v-else relate-name="project"></no-relate>
      </div>
    </div>

    <!-- 添加数据集 -->
    <el-dialog
      v-model="isShow"
      width="640px"
      :show-close="false"
      center
      align-center
      destroy-on-close
    >
      <template #header="{ titleId, title }">
        <div :id="titleId" :class="title">
          {{ i18n.addDataset }}
        </div>
      </template>
      <el-form>
        <el-form-item label="拥有者/数据集名称">
          <el-input
            v-model="addSearch"
            placeholder="你可以直接复制拥有者/数据集名称进行输入"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <o-button style="margin-right: 16px" @click="isShow = false"
            >取消</o-button
          >
          <o-button type="primary" @click="confirmAdd">确定</o-button>
        </span>
      </template>
    </el-dialog>
    <!-- 无添加项目 -->
    <!-- <el-dialog
      v-model="isShow1"
      width="640px"
      :show-close="false"
      center
      align-center
      destroy-on-close
    >
      <template #header="{ titleId, title }">
        <div :id="titleId" :class="title">
          {{ i18n.addProject }}
        </div>
      </template>
      <el-form>
        <el-form-item label="拥有者/项目名称">
          <el-input
            v-model="addSearch"
            placeholder="你可以直接复制拥有者/项目名称进行输入"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <o-button style="margin-right: 38px" @click="isShow1 = false"
            >取消</o-button
          >
          <o-button type="primary" @click="confirmClick">确定</o-button>
        </span>
      </template>
    </el-dialog> -->
  </div>
</template>

<style lang="scss" scoped>
.model-card {
  display: flex;
  padding-bottom: 40px;
  min-height: calc(100vh - 340px);
  background-color: #f5f6f8;
  .markdown-body {
    position: relative;
    margin-right: 24px;
    width: 100%;
    // border-right: 1px solid #d8d8d8;
    .markdown-file {
      // max-width: 800px;
      // padding-right: 40px;
      padding: 24px;
      background: #fff;
      border-radius: 16px;
    }
    .o-button {
      position: absolute;
      top: 24px;
      right: 24px;
    }
  }
  .upload-readme {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 14px;
    max-height: 700px;
    .upload-readme-img {
      margin-top: 205px;
      .o-icon {
        display: block;
      }
      font-size: 48px;
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
  .right-data {
    flex-shrink: 0;
    max-width: 463px;
    width: 100%;
    color: #000;
    background: #fff;
    padding: 40px 24px;
    border-radius: 16px;

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      margin-top: 0;
      margin-bottom: 0.5em;
      font-weight: 500;
    }
    .download-data {
      .download-title {
        margin-bottom: 8px;
        font-size: 16px;
        color: #555;
      }
      .download-count {
        font-size: 18px;
        color: #000;
      }
    }
    .card-top {
      display: flex;
      padding-bottom: 14px;

      .portrait {
        width: 24px;
        height: 24px;
        border-radius: 100%;
        background-color: #33ffcc;
        margin-right: 8px;
      }
    }

    .no-data-box {
      width: 100%;
      height: 104px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      color: #999;
      .o-icon {
        margin-right: 8px;
        font-size: 32px;
      }
    }
    .dataset-data {
      .dataset-box {
        cursor: pointer;
        display: grid;
        grid-template-columns: repeat(1, minmax(200px, 1fr));
        column-gap: 24px;
        row-gap: 24px;
        .dataset-item {
          width: 100%;
          padding: 24px;
          background-color: #fff;
          box-shadow: 0px 1px 5px 0px rgba(45, 47, 51, 0.1);
          position: relative;
          &:hover {
            box-shadow: 0px 6px 18px 0px rgba(13, 141, 255, 0.14);
            .remove-item {
              display: block;
            }
          }
          .remove-item {
            position: absolute;
            right: 8px;
            top: 8px;
            display: none;
          }
          .dataset-top {
            margin-bottom: 14px;
          }
          .dataset-bottom {
            display: flex;
            justify-content: start;
            align-items: center;
            & > div {
              display: flex;
              align-items: center;
              margin-right: 24px;
              span {
                font-size: 20px;
                padding-right: 4px;
              }
            }
          }
        }
      }
    }
    .add-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .title {
      margin: 40px 0 24px;
      font-size: 18px;
      line-height: 24px;
    }
    .add {
      margin: 48px 0 24px;
      font-size: 12px;
      line-height: 24px;
      color: #0d8dff;
      display: flex;
      align-items: center;
      cursor: pointer;
      .o-icon {
        margin-left: 4px;
      }
    }
    .related-project {
      :deep(.remove-item) {
        display: none;
      }
    }
  }
}
:deep(.el-form) {
  .el-form-item {
    margin-bottom: 0px;
    color: #555;
    .el-form-item__label {
      padding-right: 40px;
      color: #555;
    }
  }
}
</style>
