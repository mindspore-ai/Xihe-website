<script setup>
import { ref, reactive } from 'vue';

import { useRoute } from 'vue-router';
import { useUserInfoStore, useCompetitionData } from '@/stores';

import { ElMessage } from 'element-plus';
import { ElDialog } from 'element-plus';

import IconNecessary from '~icons/app/necessary.svg';
import IconPoppver from '~icons/app/popover.svg';
import IconGroup from '~icons/app/group.svg';
import IconCancel from '~icons/app/cancel.svg';
import IconTransition from '~icons/app/transition.svg';
import IconTips from '~icons/app/tips.svg';
import OButton from '@/components/OButton.vue';
import warningImg from '@/assets/icons/warning.png';

import {
  createTeam,
  getTeamInfor,
  getCompetition,
  joinTeam,
  changTeamName,
  transferCaptain,
  removeMember,
  quitTeam,
  dissolveTeam,
} from '@/api/api-competition';

const route = useRoute();
const i18n = {
  title: '您现在是个人参赛，您可以：',
  teamTips:
    '提示：选择团队参赛后，个人参赛的成绩会重置，请以团队名义重新上传结果',
  teamName: '团队名',
  leaderName: '队长账号',
  tips: '一个团队最多有3名成员',
  newTeamName: '新团队名',
  createTeam: '创建团队',
  editTeamName: '编辑团队名',
  joinTeam: '加入团队',
  quit: '退出',
  edit: '编辑',
  delete: {
    describe1: '确定删除这个团队吗？',
    describe2: '退出当前团队比赛成绩会重置，请重新上传结果',
    describe3: '删除当前团队会退出决赛，确定删除这个团队吗？',
    btnText: '删除',
    cancel: '取消',
    confirm: '确认',
  },
};
const activeName = ref('first');
const teamName1 = ref(null);
const leaderName = ref(null);
const queryRef3 = ref(null);
const teamData = ref([]); //  团队信息
const teamMemberData = ref([]); // 团队成员信息
const leaderData = ref([]); // 队长信息
const showTeam = ref(false);
const showDel = ref(false);
const showEdit = ref(false);
const showQuit = ref(false);
const userComData = useCompetitionData();
const userInfo = useUserInfoStore();

const form1 = reactive({
  teamName: '',
});
const form2 = reactive({
  leaderName: '',
});
const form3 = reactive({
  teamName: '',
});
const rules1 = reactive({
  teamName: [
    {
      required: true,
      message: '必填项',
      trigger: 'blur',
    },
    {
      // 只支持中英文，不超过20个字符
      pattern: /^[a-zA-Z\u4e00-\u9fa5]{1,20}$/,
      message: '团队名仅支持中英文，不超过20个字符',
      trigger: 'blur',
    },
  ],
});
// 队长账号校验
const rules2 = reactive({
  leaderName: [
    {
      required: true,
      message: '必填项',
      trigger: 'blur',
    },
  ],
});
const rules3 = reactive({
  teamName: [
    {
      required: true,
      message: '必填项',
      trigger: 'blur',
    },
    {
      // 只支持中英文，不超过20个字符
      pattern: /^[a-zA-Z\u4e00-\u9fa5]{1,20}$/,
      message: '团队名仅支持中英文，不超过20个字符',
      trigger: 'blur',
    },
  ],
});

function getTeamData() {
  if (userComData.competitionData.team_id) {
    getTeamInfor(userComData.competitionData.id).then((res) => {
      teamData.value = res.data.data;
      teamMemberData.value = res.data.data.members;
      leaderData.value = teamMemberData.value.filter((item) => {
        return item.role === 'leader';
      });
      showTeam.value = true;
    });
  }
}
getTeamData();
// 创建团队
async function foundTeam(formEl) {
  if (!formEl) return;
  try {
    const valid = await new Promise((resolve) => {
      formEl.validate((valid) => {
        resolve(valid);
      });
    });
    if (valid) {
      let params = {
        team_name: form1.teamName,
      };
      await createTeam(userComData.competitionData.id, params);
      const res = await getCompetition({ id: route.params.id });
      userComData.setCompetitionData(res.data.data);
      getTeamData();
      ElMessage({
        type: 'success',
        message: '创建团队成功！',
      });
      form1.teamName = '';
    } else {
      console.error('error submit!');
      return false;
    }
  } catch (error) {
    if (error.response.data.code === 'competition_team_exists') {
      ElMessage({
        type: 'warning',
        message: '此团队名已存在，请重新输入!',
      });
    }
  }
}

// 加入团队
async function addTeam(formEl) {
  if (!formEl) return;
  try {
    const valid = await formEl.validate();
    if (valid) {
      // 通过团队名获取团队信息判断团队名是否存在
      const params = {
        leader_account: form2.leaderName,
      };
      await joinTeam(userComData.competitionData.id, params);
      const res = await getCompetition({ id: route.params.id });
      userComData.setCompetitionData(res.data.data);
      getTeamData();
      ElMessage({
        type: 'success',
        message: '加入团队成功!',
      });
      form2.leaderName = '';
    } else {
      console.error('error submit!');
      return false;
    }
  } catch (error) {
    if (error.response.data.code === 'competition_team_members_enough') {
      ElMessage({
        type: 'warning',
        message: '加入失败，团队成员已达上限!',
      });
    } else if (
      error.response.data.code === 'competition_no_corresponding_team' ||
      error.response.data.msg === 'it is not a team' ||
      error.response.data.msg === 'invalid user name'
    ) {
      ElMessage({
        type: 'warning',
        message: '无对应的比赛团队，请检查队长用户名!',
      });
      form2.leaderName = '';
    }
  }
}

// 编辑团队名
function confirmEdit(formEl) {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      let params = {
        team_name: form3.teamName,
      };
      changTeamName(userComData.competitionData.id, params).then(() => {
        getTeamData();
        showEdit.value = false;
        form3.teamName = '';
        ElMessage({
          type: 'success',
          message: '修改团队名成功!',
        });
      });
    } else {
      console.error('error submit!');
      return false;
    }
  });
}

// 移除队员
function deleteMember(account) {
  if (userComData.competitionData.phase === 'preliminary') {
    const params = { competitor_account: account };
    removeMember(userComData.competitionData.id, params).then(() => {
      getTeamData();
      ElMessage({
        type: 'success',
        message: '移除成员成功!',
      });
    });
  } else {
    ElMessage({
      type: 'warning',
      message: '仅初赛期间可移除队员!',
    });
  }
}

// 移交队长
function handleCaptain(account) {
  if (userComData.competitionData.phase === 'preliminary') {
    const params = { competitor_account: account };
    transferCaptain(userComData.competitionData.id, params).then(() => {
      userComData.competitionData.team_role = '';
      getTeamData();
      ElMessage({
        type: 'success',
        message: '移交队长成功!',
      });
    });
  } else {
    ElMessage({
      type: 'warning',
      message: '仅初赛期间可移交队长!',
    });
  }
}
// 退出团队
function confirmQuit() {
  quitTeam(userComData.competitionData.id).then(() => {
    ElMessage({
      type: 'success',
      message: '退出团队成功!',
    });
    userComData.competitionData.team_id = '';
    showQuit.value = false;
  });
}
// 删除团队（解散）
function confirmDel() {
  dissolveTeam(userComData.competitionData.id).then(() => {
    ElMessage({
      type: 'success',
      message: '删除团队成功!',
    });
    userComData.competitionData.team_id = '';
    showDel.value = false;
  });
}
</script>
<template>
  <div class="competitionTeam">
    <div v-if="!userComData.competitionData.team_id" class="personal-page">
      <div class="title">
        <span>{{ userInfo.userName }}，</span>
        <span>
          {{ i18n.title }}
        </span>
      </div>
      <div class="tips">
        {{ i18n.teamTips }}
      </div>
      <el-tabs v-model="activeName" class="team-tabs">
        <el-tab-pane label="创建团队" name="first">
          <div class="creating">
            <el-form ref="teamName1" :model="form1" :rules="rules1">
              <div class="requirement">
                <icon-necessary></icon-necessary
                ><span>{{ i18n.teamName }}</span>
                <el-popover
                  placement="bottom-start"
                  :width="260"
                  trigger="hover"
                  :teleported="true"
                >
                  <template #reference>
                    <o-icon style="font-size: 18px"
                      ><icon-poppver></icon-poppver
                    ></o-icon>
                  </template>
                  <div>团队名仅支持中英文，不超过20个字符</div>
                </el-popover>
              </div>
              <el-form-item prop="teamName">
                <el-input
                  v-model="form1.teamName"
                  placeholder="请输入团队名"
                ></el-input>
                <o-button
                  v-if="userComData.competitionData.phase === 'preliminary'"
                  type="primary"
                  @click="foundTeam(teamName1)"
                >
                  {{ i18n.createTeam }}
                </o-button>
                <o-button v-else disabled type="primary">
                  {{ i18n.createTeam }}
                </o-button>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
        <el-tab-pane label="加入团队" name="second">
          <div class="join-team">
            <el-form ref="leaderName" :model="form2" :rules="rules2">
              <div class="requirement">
                <icon-necessary></icon-necessary>
                <span>{{ i18n.leaderName }}</span>
              </div>
              <el-form-item prop="leaderName">
                <el-input
                  v-model="form2.leaderName"
                  placeholder="请输入队长用户名"
                ></el-input>
                <o-button
                  v-if="userComData.competitionData.phase === 'preliminary'"
                  type="primary"
                  @click="addTeam(leaderName)"
                >
                  {{ i18n.joinTeam }}
                </o-button>
                <o-button v-else disabled type="primary">
                  {{ i18n.joinTeam }}
                </o-button>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div
      v-if="userComData.competitionData.team_id && showTeam"
      class="team-page"
    >
      <div class="header">
        <div class="header-title">
          <div class="text">
            我<span v-if="userComData.competitionData.team_role === 'leader'"
              >创建</span
            >
            <span v-else>加入</span>的团队：{{ teamData.name }}
          </div>
          <div
            v-if="userComData.competitionData.team_role === 'leader'"
            class="tips"
          >
            <icon-tips class="tips-icon"></icon-tips>
            <div class="tips-text">{{ i18n.tips }}</div>
          </div>
        </div>
        <div
          v-if="userComData.competitionData.team_role === 'leader'"
          class="header-button"
        >
          <OButton
            v-if="userComData.competitionData.phase === 'preliminary'"
            class="delete"
            size="small"
            @click="showDel = true"
          >
            {{ i18n.delete.btnText }}
          </OButton>
          <OButton v-else disabled type="primary" size="small" class="delete">
            {{ i18n.delete.btnText }}
          </OButton>
          <OButton
            v-if="userComData.competitionData.phase === 'preliminary'"
            type="primary"
            size="small"
            @click="showEdit = true"
          >
            {{ i18n.edit }}
          </OButton>
          <OButton v-else disabled type="primary" size="small">
            {{ i18n.edit }}
          </OButton>
        </div>
        <div v-else class="quit-button">
          <OButton
            v-if="userComData.competitionData.phase === 'preliminary'"
            type="primary"
            size="small"
            @click="showQuit = true"
          >
            {{ i18n.quit }}
          </OButton>
          <OButton v-else disabled type="primary" size="small">
            {{ i18n.quit }}
          </OButton>
        </div>
      </div>
      <el-table :data="teamMemberData" style="width: 100%">
        <el-table-column prop="name" width="300">
          <template #header>
            <o-icon><icon-group></icon-group></o-icon>
            <span>团队成员</span>
          </template>
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <span>{{ scope.row.name }}</span>
              <span v-if="scope.row.role === 'leader'">(队长)</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="email" label="邮箱" />
        <el-table-column
          v-if="userComData.competitionData.team_role === 'leader'"
          prop="address"
          label="操作"
          width="350"
        >
          <template
            v-if="userComData.competitionData.phase === 'preliminary'"
            #default="scope"
          >
            <div v-if="scope.row.role !== 'leader'" class="operate">
              <div
                class="delete"
                disabled
                @click="deleteMember(scope.row.account)"
              >
                <o-icon class="del2"><icon-cancel></icon-cancel></o-icon>
                <span>移除</span>
              </div>
              <div class="delivery" @click="handleCaptain(scope.row.account)">
                <o-icon class="remove2">
                  <icon-transition></icon-transition>
                </o-icon>
                <span>移交队长</span>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
  <!-- 编辑团队名弹窗 -->
  <el-dialog
    v-model="showEdit"
    width="640px"
    :show-close="false"
    center
    align-center
    destroy-on-close
  >
    <template #header="{ titleId, title }">
      <div :id="titleId" :class="title">
        {{ i18n.editTeamName }}
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
      <el-form
        ref="queryRef3"
        class="dialog-form"
        style="display: flex; justify-content: center"
        :model="form3"
        :rules="rules3"
      >
        <div class="requirement" style="margin-right: 55px">
          <icon-necessary></icon-necessary>
          <span>{{ i18n.newTeamName }} </span>
        </div>
        <el-form-item prop="teamName">
          <el-input
            v-model="form3.teamName"
            placeholder="请输入新的团队名"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <div class="dlg-actions" style="display: flex; justify-content: center">
        <o-button
          size="small"
          style="margin-right: 16px"
          @click="(showEdit = false), (form3.teamName = '')"
        >
          {{ i18n.delete.cancel }}
        </o-button>
        <o-button size="small" type="primary" @click="confirmEdit(queryRef3)">
          {{ i18n.delete.confirm }}
        </o-button>
      </div>
    </template>
  </el-dialog>
  <!-- 退出团队弹窗 -->
  <el-dialog
    v-model="showQuit"
    width="640px"
    :show-close="false"
    center
    align-center
    destroy-on-close
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
      {{ i18n.delete.describe2 }}
    </div>
    <template #footer>
      <div class="dlg-actions" style="display: flex; justify-content: center">
        <o-button
          size="small"
          style="margin-right: 16px"
          @click="showQuit = false"
        >
          {{ i18n.delete.cancel }}
        </o-button>
        <o-button size="small" type="primary" @click="confirmQuit">
          {{ i18n.delete.confirm }}
        </o-button>
      </div>
    </template>
  </el-dialog>
  <!-- 删除团队 -->
  <el-dialog
    v-model="showDel"
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
      {{ i18n.delete.describe1 }}
    </div>
    <template #footer>
      <div class="dlg-actions" style="display: flex; justify-content: center">
        <o-button
          size="small"
          style="margin-right: 16px"
          @click="showDel = false"
        >
          {{ i18n.delete.cancel }}
        </o-button>
        <o-button size="small" type="primary" @click="confirmDel">
          {{ i18n.delete.confirm }}
        </o-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.competitionTeam {
  .personal-page {
    width: 640px;
    margin: 0 auto;
    padding: 48px 0 100px;
    .title {
      height: 32px;
      line-height: 32px;
      font-size: 24px;
      color: #000000;
    }
    .tips {
      color: #555;
      margin: 15px 0 48px;
    }
    :deep(.el-tabs) {
      .el-tabs__header {
        margin-bottom: 24px;
      }
      .el-tabs__content {
        .creating,
        .join-team {
          .el-form {
            width: 100%;
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .requirement {
              display: flex;
              align-items: center;
              span {
                font-size: 14px;
                color: #555;
                margin-left: 4px;
              }
              .el-tooltip__trigger {
                margin-left: 6px;
                margin-right: 16px;
              }
            }
            .el-form-item {
              margin-bottom: 0px;
              .el-form-item__content {
                .el-form-item__error {
                  position: absolute;
                  top: 45px;
                  left: 15px;
                }
              }
              .o-button {
                font-size: 14px;
                padding: 5px 10px !important;
                min-width: 80px;
                margin-left: 8px;
              }
            }
          }
        }
      }
    }
  }
  .team-page {
    padding: 40px 40px 64px;
    .header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 40px;
      &-title {
        display: flex;
        align-items: center;
        .text {
          font-size: 24px;
          line-height: 32px;
          margin-right: 40px;
        }
        .tips {
          line-height: 38px;
          display: flex;
          align-items: center;
          position: relative;
          background: rgba(13, 141, 255, 0.03);
          border: 1px solid #d8d8d8;
          border-radius: 19px;
          .tips-icon {
            position: absolute;
            left: 16px;
          }
          .tips-text {
            color: #555555;
            font-size: 14px;
            padding-left: 48px;
            padding-right: 24px;
          }
        }
        /* :deep(.el-input) {
          width: 220px;
          .el-input__wrapper {
            padding-left: 45px !important;
            background: rgba(13, 141, 255, 0.03);
          }
        } */
      }
      &-button {
        .delete {
          margin-right: 10px;
        }
      }
    }
    :deep(.el-table) {
      .el-table__inner-wrapper {
        .el-table__cell {
          .cell {
            display: flex;
            .o-icon {
              font-size: 16px;
              line-height: 24px;
              margin-right: 3px;
              display: flex;
              align-items: center;
            }
          }
        }
        .el-table__body {
          .el-table__row {
            &:hover {
              .el-table_1_column_3 {
                .cell {
                  color: #0d8dff;
                }
              }
            }
            .cell {
              .operate {
                display: flex;
                align-items: center;
                .delete,
                .delivery {
                  display: flex;
                  align-items: center;
                  cursor: pointer;
                  margin-right: 24px;
                  .o-icon {
                    display: inline-block;
                    display: flex;
                    align-items: center;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
:deep(.dialog-form, .el-form) {
  .el-form-item {
    margin-bottom: 0px;
    .el-form-item__error {
      top: 48px;
      left: 0px;
    }
  }
}
:deep(.el-input) {
  .el-input__wrapper {
    border-radius: 16px;
  }
}
</style>
