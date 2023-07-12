<script setup>
import {
  ref,
  watch,
  computed,
  onUpdated,
  onMounted,
  onUnmounted,
  defineEmits,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { handleMarkdown } from '@/shared/markdown';

import OButton from '@/components/OButton.vue';
import OIcon from '@/components/OIcon.vue';
import NoRelate from '@/components//train/NoRelate.vue';
import RelateCard from '@/components/train/RelateCard.vue';

import IconAddFile from '~icons/app/add-file';
import IconPlus from '~icons/app/plus';
import IconInstance from '~icons/app/train-instance';

import { ElMessage } from 'element-plus';
import warningImg from '@/assets/icons/warning.png';

import { useUserInfoStore, useFileData } from '@/stores';
import { getGitlabFileRaw } from '@/api/api-gitlab';
import { getReadmeInfo } from '@/api/api-project';
import { trainList } from '@/api/api-project';

import {
  addDataset,
  deleteDataset,
  addModel,
  deleteModel,
} from '@/api/api-project';

const MATHJSX = import.meta.env.VITE_MATH_JSX;

const TypeSet = async function (elements) {
  if (!window.MathJax) {
    return;
  }
  window.MathJax.startup.promise = window.MathJax.startup.promise
    .then(() => {
      return window.MathJax.typesetPromise(elements);
    })
    .catch((err) => {
      return err;
    });
  return window.MathJax.startup.promise;
};
let head = document.head;
let script1 = document.createElement('script');
let script = document.createElement('script');
script.setAttribute('type', 'text/javascript');
script.setAttribute('id', 'MathJax-script');
script.setAttribute('async', '');
script.setAttribute('src', MATHJSX);
let code =
  'MathJax = {' +
  '  tex: {' +
  '    inlineMath: [["$", "$"], ["\\\\(", "\\\\)"]],' +
  '    displayMath: [["$$", "$$"], ["\\\\[", "\\\\]"]]' +
  '  },' +
  '  svg: {' +
  '    fontCache: "global"' +
  '  }' +
  '}';
script1.appendChild(document.createTextNode(code));
head.appendChild(script1);
head.appendChild(script);
onUpdated(() => {
  TypeSet(document.querySelectorAll('p'));
  TypeSet(document.querySelectorAll('li'));
});
onUnmounted(() => {
  head.removeChild(script);
  head.removeChild(script1);
});

const route = useRoute();
const router = useRouter();

// 登录用户信息
const userInfo = useUserInfoStore();
// 当前项目的详情数据
const detailData = computed(() => {
  return useFileData().fileStoreData;
});
const isShowDatasetDlg = ref(false);
const isShowModelDlg = ref(false);
const addSearch = ref('');
const showTip = ref(false);

// 左侧显示文件内容
const result = ref();
const codeString = ref('');
const rightDiv = ref(null);
const leftDiv = ref(null);

const mkit = handleMarkdown();

let routerParams = router.currentRoute.value.params;
const pushParams = {
  user: routerParams.user,
  name: routerParams.name,
  contents: [],
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
  fork: 'Fork量',
  uploadReadMe: [
    '当前无训练文件，点击',
    '新建README.md文件',
    '或',
    '上传README.md文件',
  ],
  emptyVisited: '无训练内容',
  describe1:
    '已有正在训练中的实例，暂不能创建新的训练实例。你可等待训练完成或终止当前训练来创建新的训练实例。',
  describe2:
    '一个仓库最多只能创建5个训练实例，若需再创建，请删除之前的训练实例后再创建。',
  confirm: '确认',
};
const describe = ref('');

const trainListData = ref([]);

// 获取README文件
function getReadMeFile() {
  try {
    getReadmeInfo(detailData.value.owner, detailData.value.name)
      .then((tree) => {
        if (tree.data.has_file) {
          getGitlabFileRaw({
            type: 'project',
            user: routerParams.user,
            path: 'README.md',
            id: detailData.value.id,
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
        return err;
      });
  } catch (error) {
    return error;
  }
}
route.hash ? getReadMeFile() : '';

// 获取训练列表数据
function getTrainList() {
  trainList(detailData.value.id).then((res) => {
    trainListData.value = res.data.data;
  });
}
if (userInfo.userName === detailData.value.owner) {
  getTrainList();
}
// 跳转到选择文件创建训练实例页
function goSelectFile() {
  if (trainListData.value !== null && trainListData.value.length === 5) {
    describe.value = i18n.describe2;
    showTip.value = true;
    // 判断每一项的status是否为Running,如果有，则不能创建训练实例
  } else if (
    trainListData.value !== null &&
    trainListData.value.some(
      (item) => item.status === 'scheduling' || item.status === 'Running'
    )
  ) {
    describe.value = i18n.describe1;
    showTip.value = true;
  } else {
    // 点击在新页签打开
    let routerData = router.resolve({
      path: `/projects/${detailData.value.owner}/${detailData.value.name}/createfile`,
    });
    window.open(routerData.href, '_blank');
  }
}

// 点击新增数据集
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
      message: '请输入拥有者/数据集名',
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
      message: '请按照(拥有者/数据集名)格式输入',
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

// 删除数据集、模型
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

// 路由监听
watch(
  () => route,
  () => {
    if (route.name === 'projectTrain' && !route.hash) {
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

// 下滑后固定右侧div
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
  <div class="project-train">
    <div ref="leftDiv" class="project-train-file">
      <div
        v-show="userInfo.userName === detailData.owner"
        class="createtrain-btn"
        :style="{
          right: codeString ? '160px' : '24px',
        }"
      >
        <o-button type="primary" loading @click="goSelectFile">
          {{ i18n.createTrain }}
        </o-button>
      </div>
      <div v-if="codeString" class="markdown-body">
        <div v-highlight v-dompurify-html="result" class="markdown-file"></div>
        <o-button v-show="detailData.is_owner" @click="goEditor">{{
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
            ></relate-card>
            <no-relate v-else :relate-name="'dataset'"></no-relate>
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
    <!-- 添加模型弹窗 -->
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
            >取消</o-button
          >
          <o-button size="small" type="primary" @click="confirmClick"
            >确定</o-button
          >
        </span>
      </template>
    </el-dialog>

    <!-- 如已有正在训练中的实例或者训练实例已有5个，弹窗提示 -->
    <el-dialog
      v-model="showTip"
      width="640px"
      :show-close="false"
      center
      align-center
    >
      <template #header="{ titleId, title }">
        <div :id="titleId" :class="title">
          <img :src="warningImg" alt="" />
        </div>
      </template>
      <div
        class="dlg-body"
        style="
          color: #555;
          font-size: 18px;
          text-align: center;
          line-height: 28px;
        "
      >
        {{ describe }}
      </div>
      <template #footer>
        <div class="dlg-actions" style="display: flex; justify-content: center">
          <o-button type="primary" @click="showTip = false">
            {{ i18n.confirm }}
          </o-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.fixed {
  position: absolute;
  top: 80px;
  right: 0;
}
.project-train {
  display: flex;
  // padding-bottom: 40px;
  // min-height: calc(100vh - 340px);
  background-color: #f5f6f8;
  &-file {
    font-size: 14px;
    margin-right: 24px;
    padding: 24px 24px 40px;
    width: 66%;
    position: relative;
    background: #ffffff;
    border-radius: 16px;
    .createtrain-btn {
      position: absolute;
      right: 192px;
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
      max-height: 700px;
      .instance-box {
        width: 100%;
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
  }
  .right-data {
    width: calc(34% - 24px);
    color: #000;
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
        font-weight: normal;
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
