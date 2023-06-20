<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import IconProject from '~icons/app/project-tree';
import IconUpload from '~icons/app/submit';
import IconAddFile from '~icons/app/add-file';
import { ElDialog, ElMessage } from 'element-plus';

import OButton from '@/components/OButton.vue';

import { useCompetitionData } from '@/stores';
import { getSubmissions, submit, addProject } from '@/api/api-competition';

const detailData1 = useCompetitionData().competitionData;

const router = useRouter();
const tableData = ref();

const showPhoneDlg = ref(false);
const uploadRef = ref();

const date = new Date();
const year = date.getFullYear();
let month = date.getMonth() + 1;
let day = date.getDate();

if (month < 10) month = '0' + month;
if (day < 10) day = '0' + day;
const beforeUpload = (rawFile) => {
  if (
    detailData1.name === '昇思AI挑战赛-艺术家画作风格迁移' &&
    !(
      rawFile.type === 'application/x-zip-compressed' ||
      rawFile.type === 'application/zip'
    )
  ) {
    ElMessage.error('请上传.zip文件');
    return false;
  } else if (
    detailData1.name !== '昇思AI挑战赛-艺术家画作风格迁移' &&
    rawFile.type !== 'text/plain'
  ) {
    ElMessage.error('请上传.txt文件');
    return false;
  } else if (!/^\S*$/.test(rawFile.name)) {
    ElMessage.error('文件名不能包含空格');
    return false;
  } else {
    const formData = new FormData();
    formData.append('file', rawFile);
    upLoad(formData);
    return false;
  }
};

const Progress = ref(0);

async function upLoad(param) {
  togglePhoneDlg(false);
  submit(detailData1.id, param)
    .then(() => {
      getSubmissions(detailData1.id).then((res) => {
        tableData.value = res.data.details;
        if (tableData.value.length > 3) {
          tableData.value = tableData.value.slice(0, 3);
        }
      });
    })
    .catch((err) => {
      if (err.response.data?.msg === 'no permission to submit') {
        ElMessage({
          type: 'error',
          message: '您未进入决赛，无需提交！',
        });
      } else {
        ElMessage({
          type: 'error',
          message: '上传失败,请稍后重试！',
        });
      }
    });
}
const fileList = ref([]);
function onChange() {
  fileList.value.length > 1 ? fileList.value.splice(0, 1) : '';
}
const submitUpload = () => {
  uploadRef.value.submit();
};
function togglePhoneDlg(flag) {
  if (flag === undefined) {
    showPhoneDlg.value = !showPhoneDlg.value;
  } else {
    showPhoneDlg.value = flag;
  }
}
// 绑定关联项目
const relatedPro = ref('');
const newProject = ref('');
function confirmAdd(intValue) {
  if (intValue === '') return;
  let params = {};
  let paramsArr = intValue.split('/');
  params.owner = paramsArr[0];
  params.project_name = paramsArr[1];
  addProject(params, detailData1.id)
    .then(() => {
      ElMessage({
        type: 'success',
        message: '绑定成功~',
      });
      detailData.value.project = intValue;
    })
    .catch(() => {
      ElMessage({
        type: 'error',
        message: '绑定失败，请检查后重试~',
      });
    });
  newProject.value = '';
}

getSubmissions(detailData1.id).then((res) => {
  detailData.value = res.data;
  tableData.value = res.data.details;
  if (tableData.value && tableData.value.length > 3) {
    tableData.value = tableData.value.slice(0, 3);
  }
});

const detailData = ref();
function goProjectClick() {
  if (
    (detailData1.is_competitor && detailData1.team_id === '') ||
    detailData1.team_role === 'leader'
  ) {
    router.push(
      `/projects/${detailData.value.project.split('/')[0]}/${
        detailData.value.project.split('/')[1]
      }`
    );
  } else {
    ElMessage({
      type: 'error',
      message: '只有队长可以查看改项目~',
    });
  }
}

function handelSubmit() {
  if (
    tableData.value &&
    tableData.value[0] &&
    `${year}-${month}-${day}` === tableData.value[0].submit_at
  ) {
    ElMessage({
      type: 'error',
      message: '您今天已经提交过了哦~',
    });
  } else if (detailData1.status === 'over') {
    ElMessage({
      type: 'error',
      message: '该比赛已结束！',
    });
  } else if (detailData1.team_id && !detailData1.team_role) {
    ElMessage({
      type: 'warning',
      message: '仅队长可提交结果！',
    });
  } else {
    togglePhoneDlg(true);
  }
}
function handelCancel() {
  togglePhoneDlg(false);
  uploadRef.value.clearFiles();
}
</script>
<template>
  <div class="submit-page">
    <div class="right">
      <div class="header">关联项目</div>
      <div
        v-if="
          detailData &&
          !detailData.project &&
          detailData1.type === '' &&
          ((detailData1.is_competitor && detailData1.team_id === '') ||
            detailData1.team_role === 'leader')
        "
      >
        <div class="guide">
          上传结果前请创建Private项目，然后在此输入“用户名/项目名”进行关联，比赛和项目只能进行一次关联，后续只能对该项目内的文件进行改动
        </div>
        <el-input
          v-model="relatedPro"
          placeholder="请输入用户名/项目名"
        ></el-input>
        <div class="submit">
          <OButton
            v-if="relatedPro"
            type="primary"
            size="small"
            @click="confirmAdd(relatedPro)"
          >
            关联项目
          </OButton>
          <OButton v-else disabled type="primary" size="small">
            关联项目
          </OButton>
        </div>
      </div>
      <div v-else-if="detailData && detailData.project">
        <div
          v-if="
            (detailData1.is_competitor && detailData1.team_id === '') ||
            detailData1.team_role === 'leader'
          "
          class="guide"
        >
          你可对该项目内的文件进行改动
        </div>
        <!-- <project-relate-card
          :detail-data="detailData.project"
          :name="'project'"
          @jump="goProjectClick"
        ></project-relate-card> -->
        <div class="project" @click="goProjectClick">
          <o-icon><icon-project></icon-project></o-icon>
          {{ detailData.project.split('/')[1] }}
        </div>
        <el-input
          v-model="newProject"
          placeholder="请输入用户名/项目名"
        ></el-input>
        <div class="project-btn">
          <OButton
            v-if="newProject"
            type="primary"
            size="small"
            @click="confirmAdd(newProject)"
          >
            更新项目
          </OButton>
          <OButton v-else disabled type="primary" size="small">
            更新项目
          </OButton>
        </div>
      </div>
      <div v-else class="empty">
        <o-icon><icon-project></icon-project></o-icon>
        {{
          detailData1.type === '' ? '当前暂未关联项目' : '该比赛无需关联项目'
        }}
      </div>
    </div>
    <div class="left">
      <div class="header">
        <div class="header-title">结果列表</div>
        <div class="header-button">
          <span>每日限提交1次</span>
          <OButton
            :disabled="
              detailData1.id === 'mask_detection' ||
              detailData1.id === 'ai_painter'
            "
            type="primary"
            size="small"
            @click="handelSubmit"
          >
            提交结果
          </OButton>
        </div>
      </div>
      <div class="table">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="file_name" width="295">
            <template #header>
              <div class="align">
                <o-icon><icon-upload></icon-upload> </o-icon>
                <span> 提交的最新结果（显示最近3条） </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="submit_at" label="提交时间" />
          <el-table-column prop="status" label="状态" />
          <el-table-column prop="score" label="我的分数" />
        </el-table>
      </div>
    </div>
  </div>

  <el-dialog
    v-model="showPhoneDlg"
    width="640px"
    :show-close="false"
    center
    align-center
    destroy-on-close
  >
    <template #header="{ titleId, title }">
      <div :id="titleId" :class="title">上传结果</div>
    </template>
    <el-upload
      ref="uploadRef"
      class="upload-demo"
      :http-request="upLoad"
      :on-change="onChange"
      :multiple="false"
      :auto-upload="false"
      :file-list="fileList"
      action=""
      drag
      :before-upload="beforeUpload"
    >
      <el-icon class="el-icon--upload"><IconAddFile /></el-icon>
      <div class="el-upload__text">
        请拖拽<em>{{
          detailData1.name === '昇思AI挑战赛-艺术家画作风格迁移'
            ? '.zip'
            : '.txt'
        }}</em
        >文件到此处上传 或<em>点击此处</em>浏览本地文件
      </div>
    </el-upload>
    <el-progress v-if="Progress" :percentage="Progress" />
    <template #footer>
      <div class="dlg-foot">
        <o-button size="small" style="margin-right: 16px" @click="handelCancel">
          取消
        </o-button>
        <o-button size="small" type="primary" @click="submitUpload"
          >确定</o-button
        >
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.submit-page {
  max-width: 1448px;
  padding: 36px 40px 40px;
  min-height: 319px;
  display: flex;
  justify-content: space-between;
  .left {
    padding-top: 24px;
    padding-bottom: 24px;
    max-width: 916px;
    width: 65%;
    padding-left: 40px;
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      color: #555555;
      &-title {
        font-size: 24px;
        color: #000000;
        line-height: 32px;
      }
      .o-button {
        margin-left: 8px;
      }
    }
    .table {
      margin-top: 24px;
    }
    :deep(.el-table__inner-wrapper) {
      .el-table__cell {
        .cell {
          .o-icon {
            font-size: 24px;
            line-height: 24px;
            margin-right: 6px;
            position: relative;
            top: 4px;
          }
        }
      }
    }
  }
  .right {
    padding-top: 24px;
    padding-right: 56px;
    border-right: 1px solid #d8d8d8;
    max-width: 456px;
    width: 35%;
    .header {
      font-size: 24px;
    }
    .guide {
      max-width: 418px;
      font-size: 14px;
      line-height: 22px;
      color: #555555;
      margin: 8px 0 24px;
    }
    .el-input {
      width: 100%;
    }
    .submit {
      margin-top: 16px;
      display: flex;
      justify-content: flex-end;
    }
    .empty {
      color: #999999;
      font-size: 14px;
      max-width: 400px;
      text-align: center;
      margin: 100px 0;
      .o-icon {
        margin-right: 8px;
      }
    }
    .project {
      text-align: center;
      font-size: 18px;
      margin: 24px 0px;
      cursor: pointer;
      height: 100px;
      line-height: 100px;

      &:hover {
        box-shadow: 0px 6px 18px 0px rgb(13 141 255 / 14%);
        color: #0d8dff;
      }
      border: 1px solid #e5e5e5;
      .o-icon {
        margin-right: 36px;
        display: inline-block;
      }
    }
    .el-input {
      margin-bottom: 24px;
    }
    .project-btn {
      display: flex;
      justify-content: flex-end;
    }
  }
}
.upload-demo {
  :deep(.el-upload) {
    width: 100%;
    .el-upload-dragger {
      width: 100%;
      height: 210px;
      border: 1px solid #999;
      border-radius: 16px;
    }
  }
  .el-upload__text {
    color: #999;
  }
}
:deep(.el-input) {
  .el-input__wrapper {
    border-radius: 16px;
  }
}
</style>
