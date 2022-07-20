<script setup>
import { ref, watch, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Markdown from 'markdown-it';

import OButton from '@/components/OButton.vue';
import RelateCard from '@/components/RelateCard.vue';
import ProjectRelateCard from '@/components/ProjectRelateCard.vue';
import NoRelate from '@/components/NoRelate.vue';

// import IconTime from '~icons/app/time';
// import IconDownload from '~icons/app/download';
// import IconHeart from '~icons/app/heart';
import IconPlus from '~icons/app/plus';
import IconAddFile from '~icons/app/add-file';
import IconFile from '~icons/app/model-card-empty';
// import ImgModel from '@/assets/icons/model2.png';
import { addDataset, modifyProjectAdd } from '@/api/api-model';
import { downloadObs, findFile } from '@/api/api-obs';
import { useFileData, useUserInfoStore } from '@/stores';

const userInfo = useUserInfoStore();
const router = useRouter();
const route = useRoute();
let routerParams = router.currentRoute.value.params;

const mkit = new Markdown({ html: true });
const codeString = ref('');
const result = ref();
let README = '';

const isShow = ref(false);
const addSearch = ref('');
const isShow1 = ref(false);

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
  dataset: '训练数据集',
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
// 获取README文件
function getReadMeFile() {
  try {
    findFile(`xihe-obj/models/${route.params.user}/${route.params.name}/`).then(
      (tree) => {
        if (
          tree.status === 200 &&
          tree.data.children &&
          tree.data.children.length
        ) {
          README = tree.data.children.filter((item) => {
            return item.name === 'README.md';
          });
          if (README[0]) {
            downloadObs(README[0].path).then((res) => {
              res ? (codeString.value = res) : '';
            });
            result.value = mkit.render(codeString.value);
          } else {
            codeString.value = '';
          }
        }
      }
    );
  } catch (error) {
    console.error(error);
  }
}
function addRelateClick() {
  isShow.value = true;
}

function confirmAdd() {
  // 如果填写为空,提示-->return  TODO:提示
  if (addSearch.value === '') return;
  let params = {};
  let paramsArr = addSearch.value.split('/');
  params.owner_name = paramsArr[0];
  params.name = paramsArr[1];
  // 训练数据集添加
  addDataset(params).then((res) => {
    if (res.results.data.length === 0) {
      ElMessage({
        type: 'error',
        message: '没有查询到数据！',
      });
      return;
    } else {
      let modifyParams = {
        relate_datasets: [],
      };
      detailData.value.relate_datasets_list.forEach((item) => {
        modifyParams.relate_datasets.push(item.id);
      });
      let projectId = detailData.value.id;
      modifyParams.relate_datasets.push(res.results.data[0].id);
      modifyProjectAdd(modifyParams, projectId).then((res) => {
        if (res.status === 200) {
          ElMessage({
            type: 'success',
            message: '添加成功',
          });
          emit('on-click');
        }
      });
    }
  });
  isShow.value = false;
}

// 删除数据集
function deleteClick(item) {
  let projectId = detailData.value.id;
  if (item[1] === 'relate_datasets_list') {
    let modifyParams = {
      relate_datasets: [],
    };
    detailData.value.relate_datasets_list.forEach((child) => {
      if (item[0].id !== child.id) {
        modifyParams.relate_datasets_list.push(child.id);
      }
    });
    modifyProjectAdd(modifyParams, projectId).then((res) => {
      if (res.status === 200) {
        ElMessage({
          type: 'success',
          message: '删除成功！你可再次添加相关数据集。',
        });
        emit('on-click');
      }
    });
  } else {
    let modifyParams = {
      relate_projects: [],
    };
    detailData.value.relate_projects_list.forEach((child) => {
      if (item[0].id !== child.id) {
        modifyParams.relate_projects.push(child.id);
      }
    });
    modifyProjectAdd(modifyParams, projectId).then((res) => {
      if (res.status === 200) {
        ElMessage({
          type: 'success',
          message: '删除成功！你可再次添加相关模型。',
        });
        emit('on-click');
      }
    });
    return false;
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
// TODO:子组件传路径，统一跳转
function goDetailClick(val) {
  router.push(`/datasets/${val.owner_name.name}/${val.name}`);
}
function goProjectClick(val) {
  router.push(`/projects/${val.owner_name.name}/${val.name}`);
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
    if (route.name === 'modelCard') {
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
      <div v-highlight class="markdown-file" v-html="result"></div>
      <o-button v-if="detailData.is_owner" @click="goEditor">{{
        i18n.editor
      }}</o-button>
    </div>
    <div v-else-if="detailData.is_owner" class="upload-readme markdown-body">
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
        <h4 class="download-title">{{ i18n.recentDownload }}</h4>
        <span class="download-count">{{ detailData.download_count }}</span>
      </div>
      <!-- 添加数据集 -->
      <div class="dataset-data">
        <div class="add-title">
          <h4 class="title">{{ i18n.dataset }}</h4>
          <p
            v-if="userInfo.userName === detailData.owner_name.name"
            class="add"
            @click="addRelateClick"
          >
            {{ i18n.addDataset }} <o-icon><icon-plus></icon-plus></o-icon>
          </p>
        </div>
        <div class="dataset-box">
          <no-relate
            v-if="
              !detailData.relate_datasets_list ||
              detailData.relate_datasets_list.length === 0
            "
            relate-name="dataset"
          ></no-relate>
          <relate-card
            :detail-data="detailData"
            :name="'relate_datasets_list'"
            @delete="deleteClick"
            @jump="goDetailClick"
          ></relate-card>
        </div>
      </div>
      <!-- 项目 -->
      <div class="related-project">
        <div class="add-title">
          <h4 class="title">{{ i18n.relatedItem }}</h4>
        </div>
        <no-relate
          v-if="
            !detailData.relate_projects_list ||
            detailData.relate_projects_list.length === 0
          "
          relate-name="project"
        ></no-relate>
        <project-relate-card
          v-else
          :detail-data="detailData"
          :name="'relate_projects_list'"
          @delete="deleteClick"
          @jump="goProjectClick"
        ></project-relate-card>
      </div>
    </div>

    <!-- 添加数据集 -->
    <el-dialog
      v-model="isShow"
      :title="i18n.addDataset"
      width="30%"
      destroy-on-close
      center
    >
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
          <o-button style="margin-right: 38px" @click="isShow = false"
            >取消</o-button
          >
          <o-button type="primary" @click="confirmAdd">确定</o-button>
        </span>
      </template>
    </el-dialog>
    <!-- 添加模型 -->
    <el-dialog
      v-model="isShow1"
      :title="i18n.addModel"
      width="30%"
      destroy-on-close
      center
    >
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
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
:deep .el-overlay-dialog {
  top: 100px;
}
:deep .el-dialog {
  min-height: 292px !important;
  width: 800px;
  .el-dialog__header {
    padding-top: 40px !important;
    padding-bottom: 15px !important;
    .el-dialog__title {
      font-size: 24px;
      line-height: 32px;
    }
  }
  .el-dialog__body {
    display: flex;
    justify-content: center;
  }
}
.model-card {
  display: flex;
  padding-bottom: 40px;
  min-height: calc(100vh - 340px);
  background-color: #f5f6f8;
  .markdown-body {
    position: relative;
    margin-right: 40px;
    width: 100%;
    border-right: 1px solid #d8d8d8;
    .markdown-file {
      // max-width: 800px;
      padding-right: 40px;
    }
    .o-button {
      position: absolute;
      top: 0px;
      right: 40px;
    }
  }
  .upload-readme {
    display: flex;
    flex-direction: column;
    align-items: center;
    // justify-content: center;
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
    max-width: 425px;
    width: 100%;
    color: #000;
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
        // margin-top: 24px;
        .dataset-item {
          // max-width: 424px;
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
      margin: 48px 0 24px;
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
  }
}
</style>
