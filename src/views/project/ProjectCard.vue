<script setup>
import { ref, watch, computed, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import { handleMarkdown } from '@/shared/markdown';

import { useUserInfoStore } from '@/stores';

import IconPlus from '~icons/app/plus';
import IconAddFile from '~icons/app/add-file';
import IconFile from '~icons/app/project';
import { ElDialog } from 'element-plus';

import RelateCard from '@/components/train/RelateCard.vue';
import NoRelate from '@/components/train/NoRelate.vue';

import { getGitlabFileRaw, getGitlabTree } from '@/api/api-gitlab';
import { getAppInfo } from '@/api/api-project';
import {
  addDataset,
  deleteDataset,
  addModel,
  deleteModel,
  getGuide,
} from '@/api/api-project';
import { useFileData } from '@/stores';
import { ElMessage } from 'element-plus';
import { LOGIN_KEYS } from '@/shared/login';
function getHeaderConfig() {
  const headersConfig = localStorage.getItem(LOGIN_KEYS.USER_TOKEN)
    ? {
        headers: {
          'csrf-token': localStorage.getItem(LOGIN_KEYS.USER_TOKEN),
        },
      }
    : {};
  return headersConfig;
}

const DOMAIN = import.meta.env.VITE_DOMAIN;

const userInfo = useUserInfoStore();

const router = useRouter();
const route = useRoute();
let routerParams = router.currentRoute.value.params;

const mkit = handleMarkdown();
const rightDiv = ref(null);
const leftDiv = ref(null);
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
  fork: 'Fork量',
  uploadReadMe: [
    '当前无项目文件，点击',
    '新建README.md文件',
    '或',
    '上传README.md文件',
  ],
  emptyVisited: '无项目卡片',
  emptystart: '暂未启动项目',
};

const isShowDatasetDlg = ref(false);
const isShowModelDlg = ref(false);
const addSearch = ref('');

route.hash ? getReadMeFile() : '';

function addRelateClick() {
  isShowDatasetDlg.value = true;
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

  if (
    addSearch.value.split('').indexOf('/') === -1 ||
    addSearch.value === '/'
  ) {
    ElMessage({
      type: 'error',
      message: '请按照(拥有者/模型名)格式输入',
    });
    return;
  } else if (paramsArr[0] === '') {
    ElMessage({
      type: 'error',
      message: '请输入用户名',
    });
    return;
  } else if (paramsArr[1] === '') {
    ElMessage({
      type: 'error',
      message: '请输入数据集名',
    });
    return;
  } else {
    params.owner = paramsArr[0];
    params.name = paramsArr[1];

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
          isShowDatasetDlg.value = false;
          addSearch.value = '';
        }
      })
      .catch(() => {
        isShowDatasetDlg.value = false;
        addSearch.value = '';
        ElMessage({
          type: 'error',
          message: '未查询到数据',
        });
      });
  }
}
// 模型添加
function confirmClick() {
  // 如果填写为空,提示-->return
  if (addSearch.value === '') {
    ElMessage({
      type: 'error',
      message: '请输入拥有者/模型名',
    });
    return;
  }
  let params = {};
  let paramsArr = addSearch.value.split('/');
  if (
    addSearch.value.split('').indexOf('/') === -1 ||
    addSearch.value === '/'
  ) {
    ElMessage({
      type: 'error',
      message: '请按照(拥有者/模型名)格式输入',
    });
    return;
  } else if (paramsArr[0] === '') {
    ElMessage({
      type: 'error',
      message: '请输入用户名',
    });
    return;
  } else if (paramsArr[1] === '') {
    ElMessage({
      type: 'error',
      message: '请输入模型名',
    });
    return;
  } else {
    params.owner = paramsArr[0];
    params.name = paramsArr[1];
    addModel(params, detailData.value.owner, detailData.value.id)
      .then(() => {
        ElMessage({
          type: 'success',
          message: '添加成功',
        });
        emit('on-click');
        isShowModelDlg.value = false;
        addSearch.value = '';
      })
      .catch(() => {
        isShowModelDlg.value = false;
        addSearch.value = '';
        ElMessage({
          type: 'error',
          message: '未查询到数据',
        });
      });
  }
}

// 删除关联仓库
function deleteClick(item) {
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
  } else if (item.type === 'model') {
    deleteModel(
      { id: item.id, owner: item.owner.name },
      detailData.value.owner,
      detailData.value.id
    ).then(() => {
      ElMessage({
        type: 'success',
        message: '删除成功！你可再次添加相关模型。',
      });
      emit('on-click');
    });
  }
}

function addModeClick() {
  isShowModelDlg.value = true;
}
// 获取README文件
function getReadMeFile() {
  try {
    if (detailData.value.type === 'Gradio') {
      getGuide().then((tree) => {
        README = tree.data;
        codeString2.value = README;
        result2.value = mkit.render(codeString2.value);
      });
    } else {
      getGitlabTree({
        type: 'project',
        user: routerParams.user,
        path: '',
        id: detailData.value.id,
        name: routerParams.name,
      })
        .then((tree) => {
          README = tree?.data?.filter((item) => {
            return item.name === 'README.md';
          });
          if (README[0]) {
            getGitlabFileRaw({
              type: 'project',
              user: routerParams.user,
              path: 'README.md',
              id: detailData.value.repo_id,
              name: routerParams.name,
            }).then((res) => {
              res ? (codeString.value = res) : '';
              result.value = mkit.render(codeString.value);
            });
          } else {
            codeString.value = '';
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  } catch (error) {
    console.error(error);
  }
}
// 路由监听
watch(
  () => route,
  () => {
    if (route.name === 'projectCard' && !route.hash) {
      codeString.value = '';
      getReadMeFile();
    }
  },
  {
    deep: true,
    immediate: true,
  }
);
watch(
  () => route.path,
  () => {
    location.reload();
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
  router.push(`/models/${val.owner.name}/${val.name}`);
}

function goDetasetClick(val) {
  router.push(`/datasets/${val.owner.name}/${val.name}`);
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
const failLog = ref('');
const loading = ref(true);
// 判断显示哪一个页面
const canStart = ref(false);
const msg = ref('未启动');
const hasPrefix = computed(() => {
  return msg.value === '启动中' ? true : false;
});
const clientSrc = ref('');

// 拥有者启动推理
function handleStart() {
  if (detailData.value.owner === userInfo.userName) {
    socket.value = new WebSocket(
      `wss://${DOMAIN}/server/inference/project/${detailData.value.owner}/${detailData.value.id}`,
      [getHeaderConfig().headers['csrf-token']]
    );
    socket.value.onmessage = function (event) {
      try {
        if (
          JSON.parse(event.data).data &&
          JSON.parse(event.data).data.access_url
        ) {
          clientSrc.value = JSON.parse(event.data).data.access_url;
          msg.value = '运行中';
          closeConn();
        } else {
          failLog.value = JSON.parse(event.data).data.error.replace(
            /\n/g,
            '<br />'
          );
          failLog.value = `<span> ${failLog.value}</span>`;
          msg.value = '启动失败';
          closeConn();
        }
      } catch {
        msg.value = '';
      }
    };
    msg.value = '启动中';
  } else {
    socket.value = new WebSocket(
      `wss://${DOMAIN}/server/inference/project/${detailData.value.owner}/${detailData.value.id}`,
      [`visitor-${detailData.value.id}`]
    );

    socket.value.onmessage = function (event) {
      try {
        if (
          JSON.parse(event.data).data &&
          JSON.parse(event.data).data.access_url
        ) {
          clientSrc.value = JSON.parse(event.data).data.access_url;
          msg.value = '运行中';
          closeConn();
        } else {
          msg.value = '未启动';
          canStart.value = false;
          closeConn();
          ElMessage({
            type: 'error',
            message: '该项目暂不能成功启动',
          });
        }
      } catch {
        msg.value = '';
      }
    };
    msg.value = '启动中';
  }
}

// 停止推理
function handleStop() {
  closeConn();
  msg.value = '';
}
const socket = ref(null);

// 拥有者判断是否有app.py，非拥有者判断启动状态
getAppInfo(detailData.value.owner, detailData.value.name).then((res) => {
  if (res.data.has_file) {
    try {
      canStart.value = true;
    } catch {
      console.error('canStart', canStart.value);
    }
  }
});

function closeConn() {
  if (socket.value) {
    socket.value.close(); // 向服务端发送断开连接的请求
  }
}
onUnmounted(() => {
  closeConn();
});

onMounted(() => {
  const handleScroll = () => {
    if (leftDiv.value) {
      const intervalTop = leftDiv.value.getBoundingClientRect().top;
      if (rightDiv.value) {
        if (intervalTop <= 80) {
          rightDiv.value.style.position = 'sticky';
          rightDiv.value.style.top = '80px';
        } else {
          rightDiv.value.style.position = 'static';
        }
      }
    }
  };
  window.addEventListener('scroll', handleScroll);
});
</script>
<template>
  <div v-if="detailData" class="model-card">
    <div
      v-if="detailData.type === 'Gradio' && loading"
      ref="leftDiv"
      class="left-data2"
    >
      <div v-if="msg === '运行中'" class="markdown-body">
        <iframe
          :src="clientSrc"
          width="100%"
          height="100%"
          frameborder="0"
          :style="{ height: hasPrefix ? '100%' : '800px' }"
        ></iframe>
        <o-button status="error" @click="handleStop">停止</o-button>
      </div>
      <div v-else-if="msg === '启动中'" class="markdown-body">
        <div class="loading">
          <img src="@/assets/gifs/loading.gif" alt="" />
          <p>启动大约需要5分钟,请耐心等待</p>
        </div>
        <o-button status="error" @click="handleStop">停止</o-button>
      </div>
      <div
        v-else-if="
          (msg === '未启动' || '启动失败') &&
          failLog &&
          detailData.owner === userInfo.userName
        "
        class="markdown-body"
      >
        <div class="fail">
          <div class="fail-title">推理启动日志</div>
          <div class="fail-body">
            <div>
              启动失败，推理启动日志如下，你可以根据推理日志的提示更改gradio相关文件
            </div>
          </div>
          <div class="fail-log">
            <div v-dompurify-html="failLog"></div>
          </div>
        </div>
        <o-button
          v-if="detailData.owner === userInfo.userName"
          type="primary"
          @click="handleStart"
          >重新启动</o-button
        >
      </div>
      <div
        v-else-if="detailData.owner === userInfo.userName"
        class="markdown-body"
      >
        <div v-dompurify-html="result2" class="markdown-file"></div>
        <o-button type="primary" :disabled="!canStart" @click="handleStart"
          >启动</o-button
        >
      </div>
      <div v-else class="upload-readme markdown-body">
        <o-button type="primary" :disabled="!canStart" @click="handleStart"
          >启动</o-button
        >
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
    </div>
    <div v-if="loading" class="right-data">
      <div ref="rightDiv" class="relate-wrap">
        <div class="download-data">
          <div class="download-data-left">
            <h4 class="download-title">{{ i18n.recentDownload }}</h4>
            <span class="download-count">{{ detailData.download_count }}</span>
          </div>
          <div class="download-data-right">
            <h4 class="download-title">{{ i18n.fork }}</h4>
            <span class="download-count">{{ detailData.fork_count }}</span>
          </div>
        </div>
        <!-- 添加数据集 -->
        <div class="dataset-data">
          <div class="add-title">
            <h4 class="title">{{ i18n.dataset }}</h4>
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
              @jump="goDetasetClick"
            ></relate-card
            ><no-relate v-else :relate-name="'dataset'"></no-relate>
          </div>
        </div>
        <!-- 添加模型 -->
        <div class="related-project">
          <div class="add-title">
            <h4 class="title">{{ i18n.relatedItem }}</h4>
            <p
              v-if="userInfo.userName === detailData.owner"
              class="add"
              @click="addModeClick"
            >
              {{ i18n.addModel }} <o-icon><icon-plus></icon-plus></o-icon>
            </p>
          </div>
          <relate-card
            v-if="detailData.related_models"
            :detail-data="detailData"
            :name="'related_models'"
            @delete="deleteClick"
            @jump="goDetailClick"
          ></relate-card>
          <no-relate v-else :relate-name="'model'"></no-relate>
        </div>
      </div>
    </div>

    <!-- 添加数据集弹窗 -->
    <el-dialog
      v-model="isShowDatasetDlg"
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
          <o-button
            size="small"
            style="margin-right: 16px"
            @click="isShowDatasetDlg = false"
          >
            取消
          </o-button>
          <o-button size="small" type="primary" @click="confirmAdd">
            确定
          </o-button>
        </span>
      </template>
    </el-dialog>
    <!-- 添加模型 -->
    <el-dialog
      v-model="isShowModelDlg"
      width="640px"
      :show-close="false"
      center
      align-center
      destroy-on-close
    >
      <template #header="{ titleId, title }">
        <div :id="titleId" :class="title">
          {{ i18n.addModel }}
        </div>
      </template>
      <el-form>
        <el-form-item label="拥有者/模型名称">
          <el-input
            v-model="addSearch"
            placeholder="你可以直接复制拥有者/模型名称进行输入"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <o-button
            size="small"
            style="margin-right: 16px"
            @click="isShowModelDlg = false"
          >
            取消
          </o-button>
          <o-button size="small" type="primary" @click="confirmClick">
            确定
          </o-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.model-card {
  display: flex;
  background-color: #f5f6f8;
  .markdown-body {
    .fail {
      &-title {
        padding-top: 64px; //内容在按钮下16px
        font-size: 24px;
      }
      &-body {
        margin-top: 16px;
        display: flex;
        font-size: 14px;
        a {
          color: #0d8dff;
        }
      }
      &-log {
        max-width: 100%;
        margin-top: 16px;
        margin-right: 48px;
        padding: 24px;
        background-color: #e9f0f8;
        font-size: 14px;
        line-height: 22px;
        word-break: break-all;
      }
    }
    iframe {
      padding-top: 64px; //内容在按钮下16px
      height: 666px;
    }
    position: relative;
    height: 100%;
    .o-button {
      position: absolute;
      top: 0;
      right: 0;
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
  .left-data1 {
    width: 66%;
    margin-right: 24px;
    padding: 24px 24px 40px;
    border-radius: 16px;
  }
  .left-data2 {
    width: 66%;
    background-color: #fff;
    margin-right: 24px;
    padding: 24px 24px 40px;
    border-radius: 16px;
  }
  .right-data {
    color: #000;
    width: calc(34% - 24px);
    background: #ffffff;
    border-radius: 16px;
    padding: 0px 24px 40px;
    .relate-wrap {
      padding-top: 40px;
    }
    .download-data {
      display: flex;
      &-left {
        margin-right: 24px;
        width: 126px;
      }
      &-right {
        width: 126px;
      }
      .download-title {
        margin-bottom: 8px;
        font-size: 14px;
        color: #555555;
        line-height: 24px;
        font-weight: normal;
      }
      .download-count {
        font-size: 18px;
        color: #000000;
        line-height: 24px;
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
      font-weight: normal;
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
