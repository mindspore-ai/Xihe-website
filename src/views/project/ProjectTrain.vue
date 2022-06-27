<script setup>
import { ref, reactive, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Markdown from 'markdown-it';

import OButton from '@/components/OButton.vue';
import OIcon from '@/components/OIcon.vue';
import IconAddFile from '~icons/app/add-file';
import IconFile from '~icons/app/other-file';
import IconPlus from '~icons/app/plus';
import NoRelate from '@/components/NoRelate.vue';
import RelateCard from '@/components/RelateCard.vue';
import { ElMessage } from 'element-plus';

// import ODialog from '@/components/ODialog.vue';

import { useUserInfoStore, useFileData } from '@/stores';
import { downloadObs, findFile } from '@/api/api-obs';
import { trainList } from '@/api/api-project';

import {
  addDataset,
  modifyProjectAdd,
  addModel,
  modifyModelAdd,
} from '@/api/api-project';

const route = useRoute();
const router = useRouter();
// const fileData = useFileData();

// 登录用户信息
const userInfo = useUserInfoStore();
// 当前项目的详情数据
const detailData = computed(() => {
  return useFileData().fileStoreData;
});
console.log(detailData.value);
// const filePath = ref('');
// const textarea = ref('');
const isShow = ref(false);
const isShow1 = ref(false);
const addSearch = ref('');

// 左侧显示文件内容
const result = ref();
const codeString = ref('');
const mkit = new Markdown({ html: true });
let routerParams = router.currentRoute.value.params;
let README = '';
const pushParams = {
  user: routerParams.user,
  name: routerParams.name,
  contents: ['train'],
};

const i18n = {
  createTrain: '创建训练实例',
  recentDownload: '近期下载量',
  dataset: '相关数据集',
  addDataset: '添加相关数据集',
  download: '下载量',
  uploadTime: '上传时间',
  relatedItem: '相关模型',
  addModel: '添加相关模型',
  editor: '编辑',
  uploadReadMe: ['当前无文件，点击', '新建文件', '或', '上传文件'],
  emptyVisited: '该用户还未上传模型卡片',
};
/*
const activeName = ref('first');
const handleClick = (tab, event) => {
  console.log(tab, event);
};
const form = reactive({
  name: '',
  SDK: '',
  codeCatalog: '',
  launchFile: '',
  frame: '',
  rule: '',
  logPath: '',
  input: '',
  output: '',
  parameter: '',
  description: '',
  variate: '',
});
*/

const trainListData = ref([]);
// 获取训练列表数据
function getTrainList() {
  trainList(detailData.value.id).then((res) => {
    trainListData.value = res.data.data;
    console.log(trainListData.value);
  });
}
getTrainList();

//跳转到选择文件创建训练实例页
function goSelectFile() {
  // 判断每一项的status是否为Running,如果有，则不能创建训练实例
  if (trainListData.value.some((item) => item.status === 'Running')) {
    ElMessage.error(
      '已有正在训练中的实例，暂不能创建新的训练实例。你可等待训练完成或终止当前训练来创建新的训练实例。'
    );
    return;
  } else {
    router.push({
      path: `/projects/${detailData.value.owner_name.name}/${detailData.value.name}/selectfile`,
      query: {
        projectId: detailData.value.id,
      },
    });
  }
}

// 点击新增数据集
function addRelateClick() {
  isShow.value = true;
}
const emit = defineEmits(['on-click']);

// 训练数据集添加
function confirmAdd() {
  // 如果填写为空,提示
  if (addSearch.value === '') {
    ElMessage({
      type: 'error',
      message: '请输入拥有者/数据集',
    });
    return;
  }
  let params = {};
  let paramsArr = addSearch.value.split('/');

  if (addSearch.value.split('').indexOf('/') == -1 || addSearch.value == '/') {
    ElMessage({
      type: 'error',
      message: '请按照(拥有者/模型名)格式输入',
    });
    return;
  } else if (paramsArr[0] == '') {
    ElMessage({
      type: 'error',
      message: '请输入用户名',
    });
    return;
  } else if (paramsArr[1] == '') {
    ElMessage({
      type: 'error',
      message: '请输入数据集名',
    });
    return;
  } else {
    params.owner_name = paramsArr[0];
    params.name = paramsArr[1];

    addDataset(params).then((res) => {
      if (res.results.data.length === 0) {
        ElMessage({
          type: 'error',
          message: '没有查询到数据！',
        });
        return;
      } else {
        let modifyParams = {
          relate_infer_datasets: [],
        };
        detailData.value.relate_infer_datasets_list.forEach((item) => {
          modifyParams.relate_infer_datasets.push(item.id);
        });
        let projectId = detailData.value.id;
        modifyParams.relate_infer_datasets.push(res.results.data[0].id);
        modifyProjectAdd(modifyParams, projectId).then((res) => {
          if (res.status === 200) {
            ElMessage({
              type: 'success',
              message: '添加成功',
            });
            emit('on-click');
            isShow.value = false;
            addSearch.value = '';
          }
        });
      }
    });
  }
}

// 模型添加
function confirmClick() {
  if (addSearch.value === '') {
    ElMessage({
      type: 'error',
      message: '请输入拥有者/模型名',
    });
    return;
  }
  let params = {};
  let paramsArr = addSearch.value.split('/');
  if (addSearch.value.split('').indexOf('/') == -1 || addSearch.value == '/') {
    ElMessage({
      type: 'error',
      message: '请按照(拥有者/模型名)格式输入',
    });
    return;
  } else if (paramsArr[0] == '') {
    ElMessage({
      type: 'error',
      message: '请输入用户名',
    });
    return;
  } else if (paramsArr[1] == '') {
    ElMessage({
      type: 'error',
      message: '请输入模型名',
    });
    return;
  } else {
    params.owner_name = paramsArr[0];
    params.name = paramsArr[1];
    addModel(params).then((res) => {
      console.log(res);
      let modifyParams = {
        relate_infer_models: [],
      };

      detailData.value.relate_infer_models_list.forEach((item) => {
        modifyParams.relate_infer_models.push(item.id);
      });

      let projectId = detailData.value.id;
      modifyParams.relate_infer_models.push(res.results.data[0].id);

      modifyModelAdd(modifyParams, projectId).then((res) => {
        console.log(res);
        if (res.status === 100) {
          isShow1.value = false;
          addSearch.value = '';
        }
      });
    });
  }
}

// 删除数据集
function deleteClick(item) {
  let projectId = detailData.value.id;
  let modifyParams = {
    relate_infer_datasets: [],
  };
  let modelParams = {
    relate_infer_models: [],
  };
  if (item[1] === 'relate_infer_datasets_list') {
    detailData.value.relate_infer_datasets_list.forEach((child) => {
      if (item[0].id !== child.id) {
        modifyParams.relate_infer_datasets.push(child.id);
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
  } else if (item[1] === 'relate_infer_models_list') {
    detailData.value.relate_infer_models_list.forEach((child) => {
      if (item[0].id !== child.id) {
        modelParams.relate_infer_models.push(child.id);
      }
    });
    modifyProjectAdd(modelParams, projectId).then((res) => {
      if (res.status === 200) {
        ElMessage({
          type: 'success',
          message: '删除成功！你可再次添加相关模型。',
        });
        emit('on-click');
      }
    });
  }
}

function addModeClick() {
  isShow1.value = true;
}

// 获取README文件
function getReadMeFile() {
  try {
    findFile(
      `xihe-obj/projects/${route.params.user}/${routerParams.name}/train/`
    ).then((tree) => {
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
          console.log(codeString.value);
        } else {
          codeString.value = '';
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
}
// 路由监听
watch(
  () => route,
  () => {
    if (route.name === 'projectTrain') {
      codeString.value = '';
      getReadMeFile();
    }
  },
  {
    deep: true,
    immediate: true,
  }
);

function goEditor() {
  router.push({
    name: 'projectFileEditor',
    params: pushParams,
  });
}

function emptyClick(ind) {
  console.log(route.params.contents);
  if (ind === 1) {
    router.push({
      name: 'projectFileNew',
      params: pushParams,
    });
  } else if (ind === 3) {
    router.push({
      name: 'projectFileUpload',
      params: pushParams,
    });
  }
}

function goDetailClick(val) {
  router.push(`/models/${val.owner_name.name}/${val.name}`);
}

function goDetasetClick(val) {
  router.push(`/datasets/${val.owner_name.name}/${val.name}`);
}

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
</script>
<template>
  <div class="project-train">
    <div class="project-train-file">
      <div
        v-if="userInfo.userName === detailData.owner_name.name"
        class="createtrain-btn"
      >
        <o-button
          type="primary"
          style="height: 48px; width: ; padding: 11px 4px"
          @click="goSelectFile"
        >
          {{ i18n.createTrain }}</o-button
        >
      </div>
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
              !detailData.relate_infer_datasets_list ||
              detailData.relate_infer_datasets_list.length === 0
            "
            :relate-name="'dataset'"
          ></no-relate>
          <relate-card
            :detail-data="detailData"
            :name="'relate_infer_datasets_list'"
            @delete="deleteClick"
            @jump="goDetasetClick"
          ></relate-card>
        </div>
      </div>
      <!-- 添加模型 -->
      <div class="related-project">
        <div class="add-title">
          <h4 class="title">{{ i18n.relatedItem }}</h4>
          <p
            v-if="userInfo.userName === detailData.owner_name.name"
            class="add"
            @click="addModeClick"
          >
            {{ i18n.addModel }} <o-icon><icon-plus></icon-plus></o-icon>
          </p>
        </div>
        <no-relate
          v-if="
            !detailData.relate_infer_models_list ||
            detailData.relate_infer_models_list.length === 0
          "
          :relate-name="'model'"
        ></no-relate>
        <relate-card
          :detail-data="detailData"
          :name="'relate_infer_models_list'"
          @delete="deleteClick"
          @jump="goDetailClick"
        ></relate-card>
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
        <el-form-item label="拥有者/模型名称">
          <el-input
            v-model="addSearch"
            placeholder="你可以直接复制拥有者/模型名称进行输入"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer" style="padding-bottom: 48">
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
.project-train {
  display: flex;
  padding-bottom: 40px;
  min-height: calc(100vh - 340px);
  background-color: #f5f6f8;
  &-file {
    font-size: 14px;
    margin-right: 40px;
    width: 100%;
    border-right: 1px solid #d8d8d8;
    display: flex;
    flex-direction: row-reverse;
    position: relative;
    .createtrain-btn {
      position: absolute;
      right: 184px;
      z-index: 1;
    }
    .markdown-body {
      position: relative;
      // margin-right: 40px;
      width: 100%;
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
      justify-content: center;
      font-size: 14px;
      .upload-readme-img {
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
  }
  .right-data {
    max-width: 425px;
    width: 100%;
    color: #000;
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
        font-size: 12px;
      }
    }
  }
}
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
:deep .el-dialog {
  max-width: 800px;
  width: 800px;
  // height: 915px;
  .el-dialog__header {
    padding-top: 30px;
    .el-dialog__title {
      font-size: 24px;
      color: #000;
    }
  }
  .el-dialog__body {
    padding-top: 0;
    .el-tabs {
      .el-tabs__nav-scroll {
        display: flex;
        justify-content: center;
        .el-tabs__nav {
          width: 50%;
          display: flex;
          justify-content: space-between;
        }
      }
      .config-file-creating {
        margin-top: 17px;
        &-tip {
          height: 22px;
          font-size: 14px;
          font-weight: normal;
          color: #999999;
          line-height: 22px;
          margin-bottom: 28px;
        }
        .train-card-form1 {
          .train-card-launch-file {
            padding-left: 15px;
          }
          .el-form-item {
            display: flex;
            align-items: center;
            .el-form-item__content {
              width: 270px;
              .el-input {
                width: 270px;
              }
            }
          }
        }
        .train-card-form2 {
          .el-form-item {
            display: flex;
            align-items: center;
            .el-form-item__content {
              .el-input {
                width: 100%;
              }
              .el-select {
                width: 100%;
              }
              .el-textarea {
                width: 100% !important;
              }
            }
          }
        }
      }
      .config-file-select {
        &-tip {
          width: 724px;
          height: 22px;
          font-size: 14px;
          font-weight: normal;
          color: #999999;
          line-height: 22px;
          margin-top: 17px;
          margin-bottom: 28px;
        }
        &-path {
          margin-bottom: 24px;
          display: flex;
          justify-content: space-between;
          .file-select-int {
            width: 82%;
          }
          .file-select-btn {
            height: 36px;
            padding: 0;
            // width: 10%;
            // margin-left: 8px;
          }
        }
        &-textarea {
          width: 100%;
          .file-select-textarea-int {
            width: 100% !important;
            // height: 500px;
            .el-textarea__inner {
              // height: 71.4%;
              height: 570px;
            }
          }
        }
      }
    }
  }
  .el-dialog__footer {
    padding-bottom: 30px;
    .o-button {
      margin-right: 38px;
    }
  }
}
</style>
