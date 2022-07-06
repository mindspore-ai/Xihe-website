<script setup>
import { ref, reactive, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import IconBack from '~icons/app/back.svg';
import { ElMessage } from 'element-plus';

// import { useFileData } from '@/stores';

import { createTrainProject, getProjectData } from '@/api/api-project';
// import { fileVerify } from '@/api/api-obs.js';
import { useUserInfoStore } from '@/stores';

import { findFile, downloadFileObs, getDownLoadToken } from '@/api/api-obs';

const route = useRoute();
const router = useRouter();
const routerParams = route.params;
const userInfoStore = useUserInfoStore();

const filePath = ref('');
const isShow = ref(false);
const codeString = ref('');
const detailData = ref({});

// 是否是访客
const isAuthentic = computed(() => {
  return route.params.user === userInfoStore.userName;
});

// 判断是否是自己的项目，不是则返回首页
function beforeEnter() {
  if (!isAuthentic.value) {
    router.push('/');
  }
}
beforeEnter();
// 返回训练页面
function goTrain() {
  router.push({
    name: 'projectTrain',
  });
}
// 确认创建训练实例
function confirmCreating() {
  // let params = { config_path: filePath.value };
  let params = codeString.value;
  createTrainProject(params, route.query.id).then((res) => {
    // console.log(res);
    if (res.status === 200) {
      ElMessage({
        type: 'success',
        message: '创建训练实例成功',
        center: true,
      });
      setTimeout(() => {
        router.push({
          name: 'projectTrainList',
        });
      }, 500);
    } else {
      ElMessage({
        type: 'error',
        message: res.msg,
        center: true,
      });
    }
  });
}
// const describe = ref('');
let fileData = reactive({});
let reopt = {
  method: 'get',
  url: null,
  withCredentials: false,
  headers: null,
  validateStatus: function (status) {
    return status >= 200;
  },
  maxRedirects: 0,
  responseType: 'blob',
  data: null,
};

function downLoad(objkey) {
  let params = {
    objkey: objkey,
  };
  getDownLoadToken(params).then((res) => {
    reopt.url = res.data.signedUrl;
    downloadFileObs(reopt).then((res) => {
      let reader = new FileReader();
      reader.readAsText(res, 'utf-8');
      reader.onload = function () {
        codeString.value = reader.result;
        isShow.value = true;
      };
    });
  });
}

// 读取文件到输入框
function findFileByPath() {
  if (!filePath.value.endsWith('.json')) {
    ElMessage({
      type: 'error',
      message: '请输入json文件路径',
    });
  } else {
    let path = `xihe-obj/projects/${route.params.user}/${routerParams.name}/${filePath.value}`;
    findFile(path).then((res) => {
      if (res.status === 200 && res.data.children && res.data.children.length) {
        fileData = res.data.children[0];
        downLoad(fileData.path);
      } else {
        ElMessage({
          type: 'error',
          message: '找不到该json文件,请确认路径是否输入正确',
        });
      }
    });
  }
}
//跳转到配置文件创建训练实例页2
function goCreateFile() {
  router.push({
    path: `/projects/${detailData.value.owner_name.name}/${detailData.value.name}/createfile`,
    query: {
      id: detailData.value.id,
    },
  });
}
// 获得项目详情数据
function getDetailData() {
  try {
    getProjectData({
      name: route.params.name,
      owner_name: route.params.user,
    }).then((res) => {
      if (res.results.status === 200) {
        detailData.value = res.results.data[0];
      }
    });
  } catch (error) {
    console.error(error);
  }
}
getDetailData();
</script>
<template>
  <div class="selectfile">
    <div class="selectfile-wrap">
      <div class="selectfile-back" @click="goTrain">
        <o-icon class="right-icon"><icon-back /> </o-icon>
        <span> 返回训练 </span>
      </div>
      <div class="selectfile-content">
        <div class="selectfile-content-title">
          <div class="selectfile-content-title-left">创建训练实例</div>
          <div class="selectfile-content-title-right">
            <div class="selectfile-option">选择配置文件</div>
            <div class="createfile-option" @click="goCreateFile">
              创建配置文件
            </div>
          </div>
        </div>
        <div class="selectfile-content-tip">
          若你已有配置文件，你可以输入配置文件模版路径（json文件）进行创建，文本框中可对json文件进行修改，注意json文件的字段为双引号。详情请参考
          <a href="#" style="color: #0d8dff">配置模版方式-创建训练实例</a>
        </div>
        <div class="selectfile-content-path">
          <el-input
            v-model="filePath"
            class="file-select-int"
            placeholder="直接输入json文件名读取"
          >
          </el-input>
          <o-button class="file-select-btn" @click="findFileByPath"
            >确认</o-button
          >
        </div>
        <div class="selectfile-content-textarea">
          <o-editor
            v-if="isShow"
            v-model="codeString"
            lang="json"
            :model-value="codeString"
          ></o-editor>
          <el-input v-else class="file-select-textarea-int" type="textarea" />
        </div>
        <div class="selectfile-content-action">
          <o-button
            v-if="codeString"
            class="confim"
            type="primary"
            @click="confirmCreating"
            >创建</o-button
          >
          <o-button v-else class="confim" type="secondary">创建</o-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.selectfile {
  max-width: 100%;
  // height: 100%;
  min-height: calc(100vh - 200px);
  margin-top: 80px;
  // margin-bottom: 49px;
  background-color: #f5f6f8;
  &-wrap {
    max-width: 1440px;
    height: 100%;
    padding: 50px 130px 64px;
    margin: 0 auto;
    .selectfile-back {
      font-size: 16px;
      color: #555;
      margin-bottom: 49px;
      display: flex;
      align-items: center;
      .right-icon {
        margin-right: 4px;
        cursor: pointer;
      }
      span {
        cursor: pointer;
      }
    }
    .selectfile-content {
      padding: 16px 32px;
      background-color: #fff;
      .selectfile-content-path {
        display: flex;
        .el-input {
          flex: 1;
          margin-right: 16px;
        }
      }
      &-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 48px;
        line-height: 48px;
        margin-bottom: 16px;
        &-left {
          font-size: 18px;
          color: #000;
          cursor: pointer;
        }
        &-right {
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #555;
          font-size: 16px;
          cursor: pointer;
          .selectfile-option {
            color: #0d8dff;
            border-bottom: 1px solid #0d8dff;
          }
          .createfile-option {
            margin-left: 40px;
            border-bottom: 1px solid transparent;
          }
        }
      }
      &-tip {
        height: 22px;
        line-height: 22px;
        font-size: 14px;
        color: #999;
      }
      &-path {
        margin: 24px 0;
        // margin-bottom: 24px;
        display: flex;
        justify-content: space-between;
        .file-select-int {
          max-width: 1200px;
          width: 87%;
        }
        .file-select-btn {
          height: 45px;
        }
      }
      &-textarea {
        .file-select-textarea-int {
          width: 100% !important;
          :deep .el-textarea__inner {
            height: 560px;
          }
        }
      }
      &-action {
        display: flex;
        justify-content: center;
        margin-top: 48px;
        margin-bottom: 32px;
      }
    }
  }
}
</style>
