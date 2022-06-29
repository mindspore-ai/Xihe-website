<script setup>
import { ref, reactive, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Markdown from 'markdown-it';

import OButton from '@/components/OButton.vue';
import OIcon from '@/components/OIcon.vue';
import NoRelate from '@/components/NoRelate.vue';
import RelateCard from '@/components/RelateCard.vue';
import ODialog from '@/components/ODialog.vue';

import IconAddFile from '~icons/app/add-file';
// import IconFile from '~icons/app/other-file';
import IconPlus from '~icons/app/plus';
import DeleteRelate from '@/components/DeleteRelate.vue';
import IconInstance from '~icons/app/train-instance';

import { ElMessage } from 'element-plus';
import warningImg from '@/assets/icons/warning.png';

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

// 登录用户信息
const userInfo = useUserInfoStore();
// 当前项目的详情数据
const detailData = computed(() => {
  return useFileData().fileStoreData;
});
// const filePath = ref('');
// const textarea = ref('');
const isShow = ref(false);
const isShow1 = ref(false);
const addSearch = ref('');
const showTip = ref(false);

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
  // contents: routerParams.contents,
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
  emptyVisited: '暂未开始训练',
  describe1:
    '已有正在训练中的实例，暂不能创建新的训练实例。你可等待训练完成或终止当前训练来创建新的训练实例。',
  describe2:
    '一个用户一个仓库最多只能创建5个训练实例，若需再创建，请删除之前的训练实例后再创建。',
  confirm: '确认',
};
const describe = ref('');

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
  });
}
getTrainList();
//跳转到选择文件创建训练实例页
function goSelectFile() {
  if (trainListData.value.length === 5) {
    describe.value = i18n.describe2;
    showTip.value = true;
    // 判断每一项的status是否为Running,如果有，则不能创建训练实例
  } else if (trainListData.value.some((item) => item.status === 'Running')) {
    describe.value = i18n.describe1;
    showTip.value = true;
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
      let modifyParams = {
        relate_infer_models: [],
      };

      detailData.value.relate_infer_models_list.forEach((item) => {
        modifyParams.relate_infer_models.push(item.id);
      });

      let projectId = detailData.value.id;
      modifyParams.relate_infer_models.push(res.results.data[0].id);

      modifyModelAdd(modifyParams, projectId).then((res) => {
        if (res.status === 200) {
          emit('on-click');
          isShow1.value = false;
          addSearch.value = '';
        }
      });
    });
  }
}

const deleteRelate = ref(false);
function concelClick() {
  deleteRelate.value = false;
}

// 删除数据集
function deleteClick(item) {
  deleteRelate.value = true;
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
        } else {
          codeString.value = '';
        }
      }
    });
  } catch (error) {
    // console.log(error);
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
  pushParams.contents = [...pushParams.contents, 'README.md'];
  router.push({
    name: 'projectFileEditor',
    params: pushParams,
  });
}

function emptyClick(ind) {
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

function toggleDelDlg(flag) {
  if (flag === undefined) {
    showTip.value = !showTip.value;
  } else {
    showTip.value = flag;
  }
}
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
          style="height: 48px; padding: 11px 4px"
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
        <div class="instance-box">
          <o-icon><icon-instance></icon-instance></o-icon>
          <p>暂未开始训练，请先创建训练实例</p>
        </div>

        <!-- <div class="upload-readme-img">
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
        </div> -->
      </div>
      <div v-else class="upload-readme markdown-body">
        <div class="upload-readme-img">
          <o-icon> <icon-instance></icon-instance> </o-icon>
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
            :delete-relate="deleteRelate"
            :name="'relate_infer_datasets_list'"
            @delete="deleteClick"
            @jump="goDetasetClick"
            @concel="concelClick"
          ></relate-card>
        </div>
      </div>
      <!-- 删除相关弹框 -->
      <!-- <delete-relate
        :delete-relate="deleteRelate"
        @concel="concelClick"
      ></delete-relate> -->
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
      :showClose="false"
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
          <o-button
            size="small"
            style="margin-right: 38px"
            @click="isShow = false"
            >取消</o-button
          >
          <o-button size="small" type="primary" @click="confirmAdd"
            >确定</o-button
          >
        </span>
      </template>
    </el-dialog>
    <!-- 添加模型 -->
    <el-dialog
      v-model="isShow1"
      :title="i18n.addModel"
      :showClose="false"
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

    <!-- 如已有正在训练中的实例，弹窗提示 -->
    <o-dialog :show="showTip" @close-click="toggleDelDlg(false)">
      <template #head>
        <div
          class="dlg-title"
          :style="{ textAlign: 'center', paddingTop: '40px' }"
        >
          <img :src="warningImg" alt="" />
        </div>
      </template>
      <div
        class="dlg-body"
        :style="{
          padding: '8px 0 30px',
          fontSize: '18px',
          textAlign: 'center',
          width: '640px',
        }"
      >
        {{ describe }}
      </div>
      <template #foot>
        <div
          class="dlg-actions"
          :style="{
            display: 'flex',
            justifyContent: 'center',
            paddingBottom: '56px',
          }"
        >
          <o-button type="primary" @click="showTip = false">{{
            i18n.confirm
          }}</o-button>
        </div>
      </template>
    </o-dialog>
  </div>
</template>

<style lang="scss" scoped>
:deep .el-dialog {
  width: 800px;
  min-height: 284px;
  --el-dialog-margin-top: 35vh;
  .el-dialog__header {
    padding-top: 40px;
    padding-bottom: 40px;
    font-size: 24px;
    font-family: FZLTHJW--GB1-0, FZLTHJW--GB1;
    font-weight: normal;
    color: #000000;
    line-height: 32px;
  }
  .el-dialog__body {
    padding-top: 0;
    padding-bottom: 40px;
    display: flex;
    justify-content: center;
    .el-form-item__label {
      padding-right: 35px;
    }
    .el-form-item__content {
      width: 400px;
    }
  }
  .el-dialog__footer {
    padding-top: 0;
    padding-bottom: 48px;
  }
}
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
      width: 120px;
      height: 48px;
      position: absolute;
      right: 184px;
      z-index: 1;
    }
    .markdown-body {
      position: relative;
      margin-right: 40px;
      width: 100%;
      .o-button {
        position: absolute;
        top: 0px;
        right: 0px;
        z-index: 1;
      }
    }
    .upload-readme {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      .instance-box {
        width: 100%;
        // min-height: calc(100vh - 450px);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        p {
          font-size: 14px;
          color: #999;
        }
        .o-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }
      }
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
</style>
