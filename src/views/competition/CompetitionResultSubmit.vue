<script setup>
import { ref, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import IconProject from '~icons/app/project-tree';

import OButton from '@/components/OButton.vue';
import ODialog from '@/components/ODialog.vue';
import ProjectRelateCard from '@/components/ProjectRelateCard.vue';

import IconUpload from '~icons/app/submit';
import IconAddFile from '~icons/app/add-file';

import { handleUpload } from '@/api/api-obs';
import { useUserInfoStore, useCompetitionData } from '@/stores';
import {
  getTeamInfoById,
  addProject,
  revampTeam,
  handleSubmit,
  handleScoring,
  getScore,
} from '@/api/api-competition';

const detailData1 = computed(() => {
  return useCompetitionData().competitionData;
});
const teamId = computed(() => {
  return useCompetitionData().teamId;
});
const userInfo = useUserInfoStore();

const route = useRoute();
const router = useRouter();
const tableData = ref();

const showPhoneDlg = ref(false);
const uploadRef = ref();

const date = new Date();
const year = date.getFullYear();
let month = date.getMonth() + 1;
let day = date.getDate();
const hour = date.getHours();
const minute = date.getMinutes();
const second = date.getSeconds();
if (month < 10) month = '0' + month;
if (day < 10) day = '0' + day;
const beforeAvatarUpload = (rawFile) => {
  if (
    detailData1.value.name === '昇思AI挑战赛-艺术家画作风格迁移' &&
    !(
      rawFile.type === 'application/x-zip-compressed' ||
      rawFile.type === 'application/zip'
    )
  ) {
    ElMessage.error('请上传.zip文件');
    return false;
  } else if (
    detailData1.value.name !== '昇思AI挑战赛-艺术家画作风格迁移' &&
    rawFile.type !== 'text/plain'
  ) {
    ElMessage.error('请上传.txt文件');
    return false;
  } else {
    let fileName =
      rawFile.name.split('.')[0] +
      `-${year}-${month}-${day}-${hour}-${minute}-${second}.` +
      rawFile.name.split('.')[1];
    // rawFile.name = name.split('.')[0] + `${date.getTime()}.` + name.split('.')[1];TODO:无法直接修改文件名
    if (detailData1.value.name === '昇思AI挑战赛-艺术家画作风格迁移') {
      fileName = fileName.split('.')[0];
    }
    const copyFile = new File([rawFile], fileName);
    upLoad(copyFile);
    return false;
  }
  return true;
};

const Progress = ref(0);
// 进度条
function callback(transferredAmount, totalAmount) {
  Progress.value = parseFloat(
    ((transferredAmount * 100.0) / totalAmount).toFixed(2)
  );
}
async function upLoad(param) {
  let path = `xihe-obj/competitions/${detailData1.value.name}/submit_result/${
    detailData.value.name
  }_${detailData.value.is_individual ? 1 : 0}/${param.name}`;
  // 上传函数接收三个参数
  // 1.文件相关信息，编辑完成不需要验证文件名重复isEdit传true，其余传false。
  // 2.进度条回调函数
  // 3.上传成功的回调
  // TODO:是否统一封装失败情况
  await handleUpload(
    {
      file: param,
      path,
      isEdit: true,
    },
    callback,
    function () {
      // pathClick(route.params.contents.length);
      togglePhoneDlg(false);
      Progress.value = '';
      fileList.value = [];
      handleSubmit({ file_name: param.name }, route.path.split('/')[2]).then(
        (res) => {
          if (res.status === 200) {
            // ElMessage({
            //   type: 'success',
            //   message: '上传成功,正在自动评分中！',
            // });
            handleScoring({ file_name: param.name }, teamId.value).then(
              (res) => {
                if (res.status === 200) {
                  ElMessage({
                    type: 'success',
                    message: '上传成功,正在自动评分中！',
                  });
                  getIndividual(teamId.value);
                } else {
                  ElMessage({
                    type: 'error',
                    message: res.msg,
                  });
                  getIndividual(teamId.value);
                }
              }
            );
          } else {
            ElMessage({
              type: 'error',
              message: res.msg,
            });
          }
        }
      );
    }
  );
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
const relatedPro = ref();
function confirmAdd() {
  if (relatedPro.value === '') return;
  let params = {};
  let paramsArr = relatedPro.value.split('/');
  params.owner_name = paramsArr[0];
  params.name = paramsArr[1];
  addProject(params).then((res) => {
    if (res.results.data.length === 0) {
      ElMessage({
        type: 'error',
        message: '没有查询到数据！',
      });
      return;
    } else {
      let relate_project = res.results.data[0].id;
      revampTeam({ relate_project }, teamId.value).then((res) => {
        if (res.status === 200) {
          detailData.value = res.data;
          // TODO:更新时间
          detailData.value.update_date_time = res.data.project_name.update_time;
          detailData.value.project_name = [detailData.value.project_name];
          ElMessage({
            type: 'success',
            message: '绑定成功！',
          });
        } else {
          ElMessage({
            type: 'error',
            message: '只能绑定一个项目！',
          });
        }
      });
    }
  });
}

watch(
  () => {
    return teamId.value;
  },
  (newVal) => {
    if (newVal) {
      getIndividual(newVal);
    }
  },
  { immediate: true }
);
async function getIndividual(id) {
  // 通过团队id获得团队信息
  let res = await getTeamInfoById(id);
  if (res.status === 200) {
    // let fileName = res.data.score_list.reverse()[0].file_name;
    detailData.value = res.data;
    tableData.value = res.data.score_list;
    tableData.value.reverse();
    if (tableData.value.length > 3) {
      tableData.value = tableData.value.slice(0, 3);
    }

    let fileName = '';
    if (tableData.value[0]) {
      fileName = tableData.value[0].file_name;
    }

    tableData.value.forEach((item) => {
      item.create_time = item.create_time.split('T')[0];
      item.file_name = item.file_name.split('-')[0];
    });
    //艺术家画作风格迁移查分数
    if (
      detailData1.value.name === '昇思AI挑战赛-艺术家画作风格迁移' &&
      tableData.value[0] &&
      tableData.value[0].score === null
    ) {
      getScore(fileName, teamId.value).then((qwq) => {
        if (qwq.data || qwq.data === 0) {
          // console.log(qwq.data);
          tableData.value[0].status_info = qwq.msg;
          if (qwq.data) {
            tableData.value[0].score = qwq.data.toFixed(3);
          }
        }
      });
    }
    // TODO: 关联卡片时间
    if (res.data.project_name) {
      detailData.value.update_date_time = res.data.project_name.update_time;
      detailData.value.project_name = [detailData.value.project_name];
    }
  }
}
// let groupId = ref(null);
const detailData = ref();
/* async function getIndividual() {
  // 获得团队id，判断是否报名
  let params = { id: route.path.split('/')[2] };
  let res1 = await getGroupid(params.id);
  if (res1.status === 200) {
    groupId = res1.group_id;
  }
  // 通过团队id获得团队信息
  let res2 = await getTeamInfoById(groupId);
  if (res2.status === 200) {
    detailData.value = res2.data;
    // TODO:更新时间
    detailData.value.update_date_time = '2022-08-26 10:39:10';
    detailData.value.project_name = [detailData.value.project_name];
  }
}

getIndividual(); */
function goProjectClick(val) {
  if (detailData.value.leader_name.name === userInfo.userName) {
    router.push(`/projects/${val.owner_name.name}/${val.name}`);
  } else {
    ElMessage({
      type: 'error',
      message: '只有队长可查看改项目',
    });
  }
}
// togglePhoneDlg(true)
function handelSubmit() {
  if (
    tableData.value[0] &&
    `${year}-${month}-${day}` === tableData.value[0].create_time
  ) {
    ElMessage({
      type: 'error',
      message: '您今天已经提交过了哦~',
    });
  } else {
    // if (detailData1.value.name === '昇思AI挑战赛-艺术家画作风格迁移') {
    //   ElMessage({
    //     type: 'error',
    //     message: '提交结果通道火速开通中，请您耐心等待哦~',
    //   });
    // } else {
    togglePhoneDlg(true);
    // }
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
          !detailData.project_name &&
          detailData.leader_name.name === userInfo.userName
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
          <div></div>
          <OButton type="primary" size="small" @click="confirmAdd"
            >确定</OButton
          >
        </div>
      </div>
      <div v-else-if="detailData && detailData.project_name">
        <div
          v-if="detailData.leader_name.name === userInfo.userName"
          class="guide"
        >
          你可对该项目内的文件进行改动
        </div>
        <project-relate-card
          :detail-data="detailData"
          :name="'project_name'"
          @jump="goProjectClick"
        ></project-relate-card>
      </div>

      <div v-else class="empty">
        <o-icon><icon-project></icon-project></o-icon>
        当前暂未关联项目
      </div>
    </div>
    <div class="left">
      <div class="header">
        <div class="header-title">结果列表</div>
        <div
          v-if="detailData && detailData.leader_name.name === userInfo.userName"
          class="header-button"
        >
          <span>每日限提交1次</span>
          <OButton type="primary" size="small" @click="handelSubmit"
            >提交结果</OButton
          >
        </div>
      </div>
      <div class="table">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="file_name">
            <template #header>
              <o-icon><icon-upload></icon-upload> </o-icon
              >提交的最新结果（显示最近3条）
            </template>
          </el-table-column>
          <el-table-column prop="create_time" label="提交时间" width="125" />
          <el-table-column prop="status_info" label="状态" width="295" />
          <el-table-column prop="score" label="我的分数" width="105" />
        </el-table>
      </div>
    </div>
  </div>
  <o-dialog :show="showPhoneDlg" :close="false">
    <template #head> <p class="dlg-title">上传结果</p> </template>
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
      :before-upload="beforeAvatarUpload"
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
    <template #foot>
      <div class="dlg-foot">
        <o-button @click="handelCancel">取消</o-button>
        <o-button type="primary" @click="submitUpload">确定</o-button>
      </div>
    </template>
  </o-dialog>
</template>

<style lang="scss" scoped>
.submit-page {
  max-width: 1472px;
  padding: 36px 40px 40px;
  min-height: 319px;
  display: flex;
  justify-content: space-between;
  .left {
    padding-top: 24px;
    padding-bottom: 24px;
    width: 100%;
    padding-left: 56px;
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
      border: 1px solid #ebeef5;
      border-bottom: none;
      border-top: none;
      .el-table {
        // margin-top: 24px;
        --el-table-header-bg-color: #e5e8f0;
        --el-table-header-text-color: #555;
      }
    }
    :deep(.el-table__inner-wrapper) {
      .el-table__cell {
        padding: 0;
        .cell {
          display: flex;
          .o-icon {
            font-size: 24px;
            line-height: 24px;
            margin-right: 6px;
          }
        }
      }
      .el-table__header {
        color: #000000;
        .cell {
          padding: 13px 24px;
        }
      }
      .el-table__body {
        .cell {
          padding: 16px 24px;
        }
      }
    }
  }
  .right {
    padding-top: 24px;
    padding-right: 56px;
    border-right: 1px solid #d8d8d8;
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
    :deep(.project-item) {
      width: 400px;
    }
    .submit {
      margin-top: 16px;
      display: flex;
      justify-content: space-between;
    }
    .empty {
      color: #999999;
      font-size: 14px;
      width: 400px;
      text-align: center;
      margin: 100px 0;
      .o-icon {
        margin-right: 8px;
      }
    }
  }
}
.o-dialog {
  .o-dialog-wrap {
    .dlg-title {
      text-align: center;
    }
    .dlg-foot {
      text-align: center;
      .o-button {
        margin: 0 12px 16px;
      }
    }
  }
  .upload-demo {
    :deep(.el-upload) {
      width: 733px;
      .el-upload-dragger {
        width: 100%;
        height: 210px;
        border: 1px solid #000000;
        border-radius: 0;
      }
    }
    .el-upload__text {
      color: #999999;
    }
  }
}
</style>
