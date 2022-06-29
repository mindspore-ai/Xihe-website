<script setup>
import { ref, watch, computed, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Markdown from 'markdown-it';

import { useUserInfoStore } from '@/stores';

import IconPlus from '~icons/app/plus';
import IconAddFile from '~icons/app/add-file';
import IconFile from '~icons/app/project';

import RelateCard from '@/components/RelateCard.vue';
import NoRelate from '@/components/NoRelate.vue';

import { downloadObs, findFile } from '@/api/api-obs';
import {
  addDataset,
  modifyProjectAdd,
  addModel,
  modifyModelAdd,
  startInference,
  stopInference,
  getGuide,
} from '@/api/api-project';
import { useFileData } from '@/stores';
import { ElMessage } from 'element-plus';

const userInfo = useUserInfoStore();

const router = useRouter();
const route = useRoute();
let routerParams = router.currentRoute.value.params;

const mkit = new Markdown({ html: true });
const codeString = ref('');
const codeString2 = ref('');
const result = ref();
const result2 = ref();
let README = '';
const detailData = computed(() => {
  return useFileData().fileStoreData;
});
const pushParams = {
  user: routerParams.user,
  name: routerParams.name,
  contents: routerParams.contents,
};

const i18n = {
  recentDownload: '近期下载量',
  dataset: '相关数据集',
  addDataset: '添加相关数据集',
  download: '下载量',
  uploadTime: '上传时间',
  relatedItem: '相关模型',
  addModel: '添加相关模型',
  editor: '编辑',
  uploadReadMe: ['当前无文件，点击', '新建文件', '或', '上传文件'],
  emptyVisited: '无项目卡片',
  emptystart: '无启动项目',
};

const isShow = ref(false);
const isShow1 = ref(false);
const addSearch = ref('');

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
  // 如果填写为空,提示-->return  TODO:提示
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
      //console.log(res);
      let modifyParams = {
        relate_infer_models: [],
      };

      detailData.value.relate_infer_models_list.forEach((item) => {
        modifyParams.relate_infer_models.push(item.id);
      });

      let projectId = detailData.value.id;
      modifyParams.relate_infer_models.push(res.results.data[0].id);

      modifyModelAdd(modifyParams, projectId).then((res) => {
        //console.log(res);
        if (res.status === 200) {
          emit('on-click');
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
    // //console.log('detailData', detailData.value.sdk_name);
    if (detailData.value.sdk_name === 'Gradio') {
      getGuide().then((tree) => {
        //console.log('1', tree);
        README = tree.data;
        codeString2.value = README;
        result2.value = mkit.render(codeString2.value);
      });
    } else {
      findFile(
        `xihe-obj/projects/${route.params.user}/${routerParams.name}/`
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
    }
  } catch (error) {
    //console.log(error);
  }
}
// 路由监听
watch(
  () => route,
  () => {
    if (route.name === 'projectCard') {
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
  pushParams.contents = ['README.md'];
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
//判断是否有app.py
findFile(
  `xihe-obj/projects/${route.params.user}/${routerParams.name}/inference/app.py`
).then((res) => {
  if (res.status === 200) {
    // //console.log('inference/app.py', res);
    canStart.value = true;
  }
});
//判断显示哪一个页面
const canStart = ref(false);
const msg = ref('未启动');
const clientSrc = ref('');
let timer = null;
// 启动推理
function start() {
  startInference(detailData.value.id).then((res) => {
    //console.log('res', res);
    msg.value = '启动中';
    socket.send(JSON.stringify({ pk: detailData.value.id }));
    //console.log(socket.readyState);
  });
}
//停止推理
function stop() {
  stopInference(detailData.value.id).then((res) => {
    //console.log('res', res);
    socket.send(JSON.stringify({ pk: detailData.value.id }));
    // closeConn();
    // clearInterval(timer);
    msg.value = '';
  });
}
let socket = new WebSocket('wss://xihebackend.test.osinfra.cn/inference');
// //console.log(socket.readyState);
socket.onopen = function () {
  //console.log('连接成功', JSON.stringify({ pk: detailData.value.id }));
  socket.send(JSON.stringify({ pk: detailData.value.id }));
  timer = setInterval(() => {
    //console.log(JSON.stringify({ pk: detailData.value.id }));
    socket.send(JSON.stringify({ pk: detailData.value.id }));
  }, 5000);
};
socket.onmessage = function (event) {
  //console.log('收到服务器消息', JSON.parse(event.data));
  msg.value = JSON.parse(event.data).msg;
  if (!!JSON.parse(event.data).data) {
    clientSrc.value = JSON.parse(event.data).data.url;
  }
  if (detailData.value.is_owner) {
    if (
      JSON.parse(event.data).msg === '启动失败' ||
      JSON.parse(event.data).msg === '文件收集失败' ||
      JSON.parse(event.data).msg === '创建项目推理任务错误'
    ) {
      ElMessage({
        type: 'error',
        message: JSON.parse(event.data).msg,
      });
      stopInference(detailData.value.id).then((res) => {
        //console.log('1', res.data.msg);
      });
    }
  }
};
function closeConn() {
  //console.log('前端关闭了');
  socket.close(); // 向服务端发送断开连接的请求
}
onUnmounted(() => {
  closeConn();
  clearInterval(timer);
});
</script>
<template>
  <div v-if="detailData" class="model-card">
    <div v-if="detailData.sdk_name === 'Gradio'" class="left-data2">
      <div v-if="msg === '运行中'" class="markdown-body">
        <iframe
          :src="clientSrc"
          width="100%"
          height="100%"
          frameborder="0"
        ></iframe>
        <o-button v-if="detailData.is_owner" status="error" @click="stop"
          >停止</o-button
        >
      </div>
      <div v-else-if="msg === '启动中'" class="markdown-body">
        <div class="loading">
          <img src="@/assets/gifs/loading.gif" alt="" />
          <p>启动中,请耐心等待</p>
        </div>
        <o-button v-if="detailData.is_owner" status="error" @click="stop"
          >停止</o-button
        >
      </div>
      <div v-else-if="detailData.is_owner" class="markdown-body">
        <div v-highlight class="markdown-file" v-html="result2"></div>
        <o-button
          v-if="detailData.is_owner"
          type="primary"
          :disabled="!canStart"
          @click="start"
          >启动</o-button
        >
      </div>
      <div v-else class="upload-readme markdown-body">
        <div class="upload-readme-img">
          <o-icon> <icon-file></icon-file> </o-icon>
        </div>
        <div class="upload-readme-tip">
          <p>
            {{ i18n.emptystart }}
          </p>
        </div>
      </div>
    </div>
    <div v-else class="left-data1">
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
    iframe {
      padding-top: 25px;
    }
    .markdown-file {
      padding-right: 40px;
    }
    position: relative;
    // margin-right: 40px;
    // width: 100%;
    // border-right: 1px solid #d8d8d8;
    height: 100%;
    .o-button {
      position: absolute;
      top: 0px;
      right: 40px;
    }
    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      img {
        width: 56px;
      }
      p {
        font-size: 18px;
        color: #555555;
        margin-top: 19px;
      }
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
  .left-data1 {
    margin-right: 40px;
    width: 100%;
    border-right: 1px solid #d8d8d8;
  }
  .left-data2 {
    margin-right: 40px;
    width: 100%;
    border-right: 1px solid #d8d8d8;
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
