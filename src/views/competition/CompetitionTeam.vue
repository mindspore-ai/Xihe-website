<script setup>
import { ref, reactive, computed, watch } from 'vue';

import { useRoute, useRouter } from 'vue-router';
import { useUserInfoStore, useCompetitionData } from '@/stores';

import { revampTeam } from '@/api/api-competition';
import { joinTeam } from '@/api/api-competition';
import { getTeamInfoByName } from '@/api/api-competition';
import { getTeamInfoById } from '@/api/api-competition';
import { deleteTeam } from '@/api/api-competition';
import { quitTeam } from '@/api/api-competition';
import { removeMember } from '@/api/api-competition';
import { transferCaptain } from '@/api/api-competition';
// import { createTeam } from '@/api/api-competition';

import { ElMessage } from 'element-plus';

import IconNecessary from '~icons/app/necessary.svg';
import IconPoppver from '~icons/app/popover.svg';
import IconGroup from '~icons/app/group.svg';
import IconCancel from '~icons/app/cancel.svg';
import IconDelivery from '~icons/app/delivery.svg';
import warningImg from '@/assets/icons/warning.png';
import IconTips from '~icons/app/tips.svg';
import ODialog from '@/components/ODialog.vue';
import OButton from '@/components/OButton.vue';

const userInfoStore = useUserInfoStore();
// import IconCancelBlue from '~icons/app/cancelBlue.svg';
// import IconDeliveryBlue from '~icons/app/deliveryBlue.svg';
const route = useRoute();
const router = useRouter();
const i18n = {
  title: '您现在是个人参赛，您可以：',
  teamName: '团队名',
  tips: '一个团队最多有3名成员',
  newTeamName: '新团队名',
  createTeam: '创建团队',
  editTeamName: '编辑团队名',
  joinTeam: '加入团队',
  quit: '退出',
  edit: '编辑',
  delete: {
    describe1: '确定删除这个团队吗？',
    btnText: '删除',
    cancel: '取消',
    confirm: '确认',
  },
};
const activeName = ref('first');
const queryRef1 = ref(null);
const queryRef2 = ref(null);
const queryRef3 = ref(null);
const teamData = ref([]); //创建团队后的团队信息
const teamMemberData = ref([]); //创建团队后的团队成员信息
const showDel = ref(false);
const showEdit = ref(false);
const is_individual = ref(true); //判断是否个人参赛
const show = ref(false);
const userComData = useCompetitionData();

const form1 = reactive({
  teamName: '',
});
const form2 = reactive({
  teamName: '',
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
      message: '团队名支持中英文，不超过20个字符',
      trigger: 'blur',
    },
  ],
});
const rules2 = reactive({
  teamName: [
    {
      required: true,
      message: '必填项',
      trigger: 'blur',
    },
    {
      // 只支持中英文，不超过20个字符
      pattern: /^[a-zA-Z\u4e00-\u9fa5]{1,20}$/,
      message: '团队名支持中英文，不超过20个字符',
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
// 含个人参赛的团队Id和团队参赛的团队Id
const teamId = computed(() => {
  return useCompetitionData().teamId;
});
function handleClick() {}
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

// 进入页面获得is_individual值，判断是否个人参赛
async function getIndividual(id) {
  // 通过团队id获得团队信息
  let res = await getTeamInfoById(id);
  // console.log('res2: ', res2);
  if (res.status === 200) {
    teamData.value = res.data;
    teamMemberData.value = res.data.members_order_list;
    is_individual.value = res.data.is_individual;
    show.value = true;
  }
}

// 点击创建团队（修改团队）
function fountTeam() {
  let params = {
    name: form1.teamName,
    is_individual: false,
  };
  // 修改团队
  revampTeam(params, teamId.value).then((res) => {
    if (res.status === 200) {
      teamData.value = res.data;
      teamMemberData.value = res.data.members_order_list;
      is_individual.value = false;
      form1.teamName = '';
    }
  });
}
// 加入团队
async function addTeam() {
  // 通过团队名获取团队信息判断团队名是否存在
  let newTeamId = null; //新加入的团队id
  let params = { name: form2.teamName };
  let res = await getTeamInfoByName(params.name);
  if (res.status === 200 && res.data.length !== 0) {
    newTeamId = res.data[0].id;
  } else {
    ElMessage({
      type: 'warning',
      message: '团队不存在！',
    });
    return;
  }
  // 删除原来的个人团队信息
  // await deleteTeam(teamId.value);
  // 加入团队
  let res3 = await joinTeam({ id: newTeamId });
  if (res3.status === 200) {
    form2.teamName = '';
    userComData.setTeamId(newTeamId);
    ElMessage({
      type: 'success',
      message: '加入团队成功!',
    });
  }
}

// 移除成员
async function deleteMember(memberId) {
  const memberIds = teamMemberData.value.map((item) => {
    return item.id;
  });
  let index = memberIds.indexOf(memberId);
  memberIds.splice(index, 1);
  let params = { members: memberIds };
  let res = await removeMember(params, teamId.value);
  if (res.status === 200) {
    teamMemberData.value = res.data.members_order_list;
    ElMessage({
      type: 'success',
      message: '移除成功！',
    });
  }
}

// 移交队长
function handleCaptain(memberId) {
  let params = {
    id: teamId.value,
    leader: memberId,
  };
  transferCaptain(params).then((res) => {
    if (res.status === 200) {
      teamData.value = res.data;
      teamMemberData.value = res.data.members_order_list;
      ElMessage({
        type: 'success',
        message: '移交队长成功！',
      });
    }
  });
}

// 退出团队
async function handleQuitTeam() {
  let params = { id: teamId.value };
  let res = await quitTeam(params);
  if (res.status === 200) {
    ElMessage({
      type: 'success',
      message: '退出团队成功！',
    });
    is_individual.value = true;
  }
}

// 删除团队
function confirmDel() {
  deleteTeam(teamId.value).then((res) => {
    if (res.status === 200) {
      // userComData.setTeamId(null);
      showDel.value = false;
      ElMessage({
        type: 'success',
        message: '团队删除成功！',
      });
      /* router.push({
        name: 'introduction',
        params: {
          id: route.params.id, //比赛id
        },
      }); */
      is_individual.value = true;
    } else {
      ElMessage({
        type: 'error',
        message: res.msg,
      });
    }
  });
}
function toggleDelDlg(flag) {
  if (flag === undefined) {
    showDel.value = !showDel.value;
  } else {
    showDel.value = flag;
  }
}
// 编辑团队名
function confirmEdit() {
  let params = {
    name: form3.teamName,
  };
  revampTeam(params, teamId.value).then((res) => {
    if (res.status === 200) {
      teamData.value = res.data;
      showEdit.value = false;
      form3.teamName = '';
      ElMessage({
        type: 'success',
        message: '团队名修改成功！',
      });
    }
  });
}

function toggleEditDlg(flag) {
  if (flag === undefined) {
    showEdit.value = !showEdit.value;
  } else {
    showEdit.value = flag;
  }
}
</script>
<template>
  <div v-if="show" class="competitionTeam">
    <div v-if="is_individual" class="noteam-page">
      <div class="title">
        {{ i18n.title }}
      </div>
      <el-tabs v-model="activeName" class="team-tabs" @tab-click="handleClick">
        <el-tab-pane label="创建团队" name="first">
          <div class="creating">
            <el-form ref="queryRef1" :model="form1" :rules="rules1">
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
                  <div>团队名支持中英文，不超过20个字符</div>
                </el-popover>
              </div>
              <el-form-item prop="teamName">
                <el-input
                  v-model="form1.teamName"
                  placeholder="请输入团队名"
                ></el-input>
                <o-button type="primary" @click="fountTeam">{{
                  i18n.createTeam
                }}</o-button>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
        <el-tab-pane label="加入团队" name="second">
          <div class="join">
            <el-form
              ref="queryRef2"
              class="form2"
              :model="form2"
              :rules="rules2"
            >
              <div class="requirement">
                <icon-necessary></icon-necessary
                ><span>{{ i18n.teamName }}</span>
                <!-- <el-popover
                  placement="bottom-start"
                  :width="372"
                  trigger="hover"
                  :teleported="true"
                >
                  <template #reference>
                    <o-icon style="font-size: 18px"
                      ><icon-poppver></icon-poppver
                    ></o-icon>
                  </template>
                  <div>团队名支持中英文，不超过20个字符</div>
                </el-popover> -->
              </div>
              <el-form-item prop="teamName">
                <el-input
                  v-model="form2.teamName"
                  placeholder="请输入团队名"
                ></el-input>
                <o-button type="primary" @click="addTeam">{{
                  i18n.joinTeam
                }}</o-button>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div v-else class="haveteam-page">
      <div class="header">
        <div class="header-title">
          <div class="text">
            我<span v-if="userInfoStore.userName == teamData.leader_name.name"
              >创建</span
            >
            <span v-else>加入</span>的团队：{{ teamData.name }}
          </div>
          <div
            v-if="userInfoStore.userName == teamData.leader_name.name"
            class="tips"
          >
            <icon-tips class="tips-icon"></icon-tips>
            <div class="tips-text">{{ i18n.tips }}</div>
          </div>
        </div>
        <div
          v-if="userInfoStore.userName == teamData.leader_name.name"
          class="header-button"
        >
          <OButton class="delete" size="small" @click="showDel = true">{{
            i18n.delete.btnText
          }}</OButton>
          <OButton type="primary" size="small" @click="showEdit = true">{{
            i18n.edit
          }}</OButton>
        </div>
        <div v-else class="quit-button">
          <OButton type="primary" size="small" @click="handleQuitTeam">{{
            i18n.quit
          }}</OButton>
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
              <span v-if="teamData.leader_name.name === scope.row.name"
                >(队长)</span
              >
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="email" label="邮箱" />
        <el-table-column
          v-if="userInfoStore.userName == teamData.leader_name.name"
          prop="address"
          label="操作"
          width="350"
        >
          <template #default="scope">
            <div
              v-if="teamData.leader_name.name !== scope.row.name"
              class="operate"
            >
              <div class="delete" @click="deleteMember(scope.row.id)">
                <o-icon><icon-cancel></icon-cancel></o-icon>
                <span>移除</span>
              </div>
              <div class="delivery" @click="handleCaptain(scope.row.id)">
                <o-icon><icon-delivery></icon-delivery></o-icon>
                <span>移交队长</span>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
  <!-- 删除团队弹窗 -->
  <o-dialog :show="showDel" :close="false" @close-click="toggleDelDlg(false)">
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
        padding: '8px 0 12px',
        fontSize: '18px',
        textAlign: 'center',
        width: '640px',
      }"
    >
      {{ i18n.delete.describe1 }}
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
        <o-button
          :style="{ marginRight: '24px' }"
          @click="toggleDelDlg(false)"
          >{{ i18n.delete.cancel }}</o-button
        >
        <o-button type="primary" @click="confirmDel">{{
          i18n.delete.confirm
        }}</o-button>
      </div>
    </template>
  </o-dialog>
  <!-- 编辑团队名弹窗 -->
  <o-dialog :show="showEdit" :close="false" @close-click="toggleEditDlg(false)">
    <template #head>
      <div
        class="dlg-title"
        :style="{ textAlign: 'center', paddingTop: '8px', color: '#000' }"
      >
        {{ i18n.editTeamName }}
      </div>
    </template>
    <div
      class="dlg-body"
      :style="{
        padding: '8px 0 12px',
        fontSize: '18px',
        textAlign: 'center',
        width: '640px',
      }"
    >
      <el-form
        ref="queryRef3"
        class="form3"
        :style="{ display: 'flex', justifyContent: 'center', align: 'center' }"
        :model="form3"
        :rules="rules3"
      >
        <div
          class="requirement"
          :style="{ lineHeight: '36px', marginRight: '55px' }"
        >
          <icon-necessary></icon-necessary><span>{{ i18n.newTeamName }}</span>
        </div>
        <el-form-item :style="{ marginBottom: '0px' }" prop="teamName">
          <el-input
            v-model="form3.teamName"
            placeholder="请输入新的团队名"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <template #foot>
      <div
        class="dlg-actions"
        :style="{
          display: 'flex',
          justifyContent: 'center',
          paddingBottom: '24px',
        }"
      >
        <o-button
          :style="{ marginRight: '24px' }"
          @click="toggleEditDlg(false)"
          >{{ i18n.delete.cancel }}</o-button
        >
        <o-button type="primary" @click="confirmEdit">{{
          i18n.delete.confirm
        }}</o-button>
      </div>
    </template>
  </o-dialog>
</template>

<style lang="scss" scoped>
.competitionTeam {
  .noteam-page {
    width: 640px;
    margin: 0 auto;
    padding: 48px 0 100px;
    .title {
      height: 32px;
      line-height: 32px;
      font-size: 24px;
      color: #000000;
      margin-bottom: 48px;
    }
    :deep(.el-tabs) {
      .el-tabs__header {
        margin-bottom: 24px;
        .el-tabs__nav-wrap {
          &::after {
            height: 0px;
          }
          .el-tabs__active-bar {
            height: 1px;
          }
        }
      }
      .el-tabs__content {
        .creating,
        .join {
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
  .haveteam-page {
    padding: 60px 40px 64px;
    .header {
      display: flex;
      justify-content: space-between;
      &-title {
        display: flex;
        align-items: center;
        .text {
          margin-right: 40px;
        }
        .tips {
          line-height: 38px;

          display: flex;
          align-items: center;
          position: relative;
          background: rgba(13, 141, 255, 0.03);
          border: 1px solid #d8d8d8;
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
        :deep(.el-input) {
          width: 220px;
          .el-input__wrapper {
            padding-left: 45px !important;
            background: rgba(13, 141, 255, 0.03);
          }
        }
      }
      &-button {
        .delete {
          margin-right: 10px;
        }
      }
    }
    :deep(.el-table) {
      margin-top: 24px;
      --el-table-header-bg-color: #e5e8f0;
      --el-table-header-text-color: #555;
      .el-table__inner-wrapper {
        .el-table__cell {
          padding: 0;
          .cell {
            display: flex;
            // align-items: center;
            .o-icon {
              font-size: 16px;
              line-height: 24px;
              margin-right: 6px;
              display: flex;
              align-items: center;
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
          .el-table__row {
            &:hover {
              .el-table_1_column_3 {
                .cell {
                  // .delete {
                  color: #0d8dff;
                  // }
                }
              }
            }
            .cell {
              padding: 16px 24px;
              .operate {
                display: flex;
                align-items: center;
                .delete {
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
                .delivery {
                  display: flex;
                  align-items: center;
                  cursor: pointer;
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
</style>
