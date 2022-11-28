<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import IconProject from '~icons/app/project-tree';

import OButton from '@/components/OButton.vue';
import ODialog from '@/components/ODialog.vue';
import ProjectRelateCard from '@/components/ProjectRelateCard.vue';

import IconUpload from '~icons/app/submit';
import IconAddFile from '~icons/app/add-file';

// import { handleUpload } from '@/api/api-obs';
import { useUserInfoStore, useCompetitionData } from '@/stores';
import { getSubmissions, submit } from '@/api/api-competition';

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
// const hour = date.getHours();
// const minute = date.getMinutes();
// const second = date.getSeconds();
if (month < 10) month = '0' + month;
if (day < 10) day = '0' + day;
const beforeUpload = (rawFile) => {
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
// 进度条
// function callback(transferredAmount, totalAmount) {
//   Progress.value = parseFloat(
//     ((transferredAmount * 100.0) / totalAmount).toFixed(2)
//   );
// }
async function upLoad(param) {
  togglePhoneDlg(false);
  submit(detailData1.value.id, detailData1.value.phase, param)
    .then(() => {
      getSubmissions(detailData1.value.id, detailData1.value.phase).then(
        (res) => {
          tableData.value = res.data.details;
          if (tableData.value.length > 3) {
            tableData.value = tableData.value.slice(0, 3);
          }
        }
      );
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
  // let path = `xihe-obj/competitions/${detailData1.value.name}/submit_result/${
  //   detailData.value.name
  // }_${detailData.value.is_individual ? 1 : 0}/${param.name}`;
  // 上传函数接收三个参数
  // 1.文件相关信息，编辑完成不需要验证文件名重复isEdit传true，其余传false。
  // 2.进度条回调函数
  // 3.上传成功的回调
  // TODO:是否统一封装失败情况
  // await handleUpload(
  //   {
  //     file: param,
  //     path,
  //     isEdit: true,
  //   },
  //   callback,
  //   function () {
  //     // pathClick(route.params.contents.length);
  //     togglePhoneDlg(false);
  //     Progress.value = '';
  //     fileList.value = [];
  //     handleSubmit(
  //       {
  //         file_name: param.name,
  //         competition_id: route.path.split('/')[2],
  //         period: 2,
  //       },
  //       route.path.split('/')[2]
  //     ).then((res) => {
  //       if (res.status === 200) {
  //         // ElMessage({
  //         //   type: 'success',
  //         //   message: '上传成功,正在自动评分中！',
  //         // });
  //         handleScoring({ file_name: param.name }, teamId.value).then((res) => {
  //           if (res.status === 200) {
  //             ElMessage({
  //               type: 'success',
  //               message: '上传成功,正在自动评分中！',
  //             });
  //             getIndividual(teamId.value);
  //           } else {
  //             ElMessage({
  //               type: 'error',
  //               message: res.msg,
  //             });
  //             getIndividual(teamId.value);
  //           }
  //         });
  //       } else {
  //         ElMessage({
  //           type: 'error',
  //           message: res.msg,
  //         });
  //       }
  //     });
  //   }
  // );
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
// 绑定相关项目
// const relatedPro = ref();
// function confirmAdd() {
//   if (relatedPro.value === '') return;
//   let params = {};
//   let paramsArr = relatedPro.value.split('/');
//   params.owner_name = paramsArr[0];
//   params.name = paramsArr[1];
//   addProject(params).then((res) => {
//     if (res.results.data.length === 0) {
//       ElMessage({
//         type: 'error',
//         message: '没有查询到数据！',
//       });
//       return;
//     } else {
//       let relate_project = res.results.data[0].id;
//       changeTeam({ relate_project }, teamId.value).then((res) => {
//         if (res.status === 200) {
//           detailData.value = res.data;
//           // TODO:更新时间
//           detailData.value.update_date_time = res.data.project_name.update_time;
//           detailData.value.project_name = [detailData.value.project_name];
//           ElMessage({
//             type: 'success',
//             message: '绑定成功！',
//           });
//         } else {
//           ElMessage({
//             type: 'error',
//             message: '只能绑定一个项目！',
//           });
//         }
//       });
//     }
//   });
// }

getSubmissions(detailData1.value.id, detailData1.value.phase).then((res) => {
  detailData.value = res.data;
  tableData.value = res.data.details;
  if (tableData.value && tableData.value.length > 3) {
    tableData.value = tableData.value.slice(0, 3);
  }
});

const detailData = ref();
function goProjectClick() {
  if (
    (detailData1.value.is_competitor && detailData1.value.team_id === '') ||
    detailData1.value.team_role === 'leader'
  ) {
    // router.push(`/projects/${val.owner}/${val.name}`);
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
// togglePhoneDlg(true)
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
    // } else if (
    //   detailData.value.competition_period !== detailData1.value.competition_period
    // ) {
    //   ElMessage({
    //     type: 'error',
    //     message: '您未进入决赛，无法提交结果！',
    //   });
    // } else {
    // if (detailData1.value.name === '昇思AI挑战赛-艺术家画作风格迁移') {
    //   ElMessage({
    //     type: 'error',
    //     message: '提交结果通道火速开通中，请您耐心等待哦~',
    //   });
  } else {
    togglePhoneDlg(true);
  }
  // }
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
      <!-- <div v-if="detailData">
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
      </div> -->
      <div v-if="detailData && detailData.project">
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
          <o-icon><icon-project></icon-project></o-icon
          >{{ detailData.project.split('/')[1] }}
        </div>
      </div>
      <div v-else class="empty">
        <o-icon><icon-project></icon-project></o-icon>
        当前暂未关联项目
      </div>
    </div>
    <div class="left">
      <div class="header">
        <div class="header-title">结果列表</div>
        <div class="header-button">
          <span>每日限提交1次</span>
          <OButton type="primary" size="small" @click="handelSubmit"
            >提交结果</OButton
          >
        </div>
      </div>
      <div class="table">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="project" width="295">
            <template #header>
              <div class="align">
                <o-icon><icon-upload></icon-upload> </o-icon
                >提交的最新结果（显示最近3条）
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
  width: 100%;
  padding: 36px 40px 40px;
  min-height: 319px;
  display: flex;
  justify-content: space-between;
  .left {
    padding-top: 24px;
    padding-bottom: 24px;
    max-width: 916px;
    width: 100%;
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
          // display: flex;
          text-align: center;
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
    max-width: 456px;
    width: 100%;
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
    // :deep(.project-item) {
    //   max-width: 400px;
    //   width: 100%;
    // }
    .submit {
      margin-top: 16px;
      display: flex;
      justify-content: space-between;
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
      margin-top: 24px;
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
      width: 100%;
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
