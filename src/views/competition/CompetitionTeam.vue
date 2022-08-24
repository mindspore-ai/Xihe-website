<script setup>
import { reactive, ref } from 'vue';

import { useRoute, useRouter } from 'vue-router';
import { useUserInfoStore } from '@/stores';

import IconNecessary from '~icons/app/necessary.svg';
import IconPoppver from '~icons/app/popover.svg';
import IconGroup from '~icons/app/group.svg';
import IconCancel from '~icons/app/cancel.svg';
import IconDelivery from '~icons/app/delivery.svg';
import IconTips from '~icons/app/tips.svg';

import { ElMessage } from 'element-plus';

import { createTeam } from '@/api/api-competition';
import { getTeamInfo } from '@/api/api-competition';
import { joinTeam } from '@/api/api-competition';
import { getTeamInfoByName } from '@/api/api-competition';

const userInfoStore = useUserInfoStore();

console.log(userInfoStore.userName);
// import IconCancelBlue from '~icons/app/cancelBlue.svg';
// import IconDeliveryBlue from '~icons/app/deliveryBlue.svg';
const route = useRoute();
const router = useRouter();
const i18n = {
  title: '您现在是个人参赛，您可以：',
  teamName: '团队名',
  createTeam: '创建团队',
  joinTeam: '加入团队',
};
const activeName = ref('first');
const queryRef = ref(null);
const is_individual = ref(true); //TODO:是否是个人参赛
const teamData = ref([]); //创建团队后的团队信息
const form1 = reactive({
  teamName: '',
});
const form2 = reactive({
  teamName: '',
});
// 团队成员数据
const tableData = [
  {
    date: '1',
    name: 'Tom',
    address: 'No. 189',
  },
  {
    date: '2',
    name: 'Tom',
    address: 'No. 189',
  },
  {
    date: '3',
    name: 'Tomnnnnnnnnnnnnnnnnnn',
    address: 'No. 189',
  },
];
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
function handleClick() {
}
// 获取团队信息
function getTeamData() {
  let params = { id: route.params.id };
  getTeamInfo(params).then((res) => {
    console.log('www', res);
  });
}
getTeamData();
// 创建团队
function fountTeam() {
  let params = {
    name: form1.teamName,
    relate_competition: route.params.id,
    is_individual: false,
  };
  createTeam(params).then((res) => {
    // TODO:is_individual.value
    // console.log('res.data', res.data);
    teamData.value = res.data;
    console.log('teamData.value: ', teamData.value);
    is_individual.value = teamData.value.is_individual;
  });
}
// 加入团队
async function addTeam() {
  // 通过团队名获取团队信息
  let teamId = null;
  await getTeamInfoByName({ name: form2.teamName }).then((res) => {
    if (res.status === 200) {
      console.log('团队信息', res.data);
      teamId = res.data[0].id;
    }
  });
  // 加入团队
  if (teamId) {
    joinTeam({ id: teamId }).then((res) => {
      if (res.status === 200) {
        // TODO:变成团队参赛
        console.log('加入团队', res);
      } else if (res.status === -1) {
        console.log(1111111111);
        ElMessage({
          type: 'warning',
          message: '您已经在该团队中',
        });
      }
    });
  } else {
    console.log(6666666);
  }
}
</script>
<template>
  <div v-if="is_individual" class="noteam-page">
    <div class="title">
      {{ i18n.title }}
    </div>
    <el-tabs v-model="activeName" class="team-tabs" @tab-click="handleClick">
      <el-tab-pane label="创建团队" name="first">
        <div class="creating">
          <el-form ref="queryRef" :model="form1" :rules="rules1">
            <div class="requirement">
              <icon-necessary></icon-necessary><span>{{ i18n.teamName }}</span>
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
            </el-form-item>
            <!-- TODO:逻辑交互未写 -->
            <o-button type="primary" @click="fountTeam">{{
              i18n.createTeam
            }}</o-button>
          </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane label="加入团队" name="second">
        <div class="join">
          <el-form ref="queryRef" :model="form2" :rules="rules2">
            <div class="requirement">
              <icon-necessary></icon-necessary><span>{{ i18n.teamName }}</span>
              <el-popover
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
              </el-popover>
            </div>
            <el-form-item prop="teamName">
              <el-input
                v-model="form2.teamName"
                placeholder="请输入团队名"
              ></el-input>
            </el-form-item>
            <!-- TODO:逻辑交互未写 -->
            <o-button type="primary" @click="addTeam">{{
              i18n.joinTeam
            }}</o-button>
          </el-form>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
  <div v-else class="haveteam-page">
    <div class="header">
      <div class="header-title">
        <div class="text">
          我<span v-if="userInfoStore.userName === teamData.leader_name.name"
            >创建</span
          >
          <span v-else>加入</span>的团队：{{ teamData.name }}
        </div>
        <el-input readonly placeholder="一个团队最多有3名成员" />
      </div>
      <div class="header-button">
        <OButton size="small">删除</OButton>
        <OButton type="primary" size="small">编辑</OButton>
      </div>
    </div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="name" width="400">
        <template #header>
          <o-icon><icon-group></icon-group></o-icon>
          <span>团队成员</span>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="邮箱" />
      <el-table-column
        v-if="userInfoStore.userName === teamData.leader_name.name"
        prop="address"
        label="操作"
        width="300"
      >
        <!-- TODO: -->
        <template #default="scope">
          <div class="delete">
            <o-icon><icon-cancel></icon-cancel></o-icon>
            <span>移除</span>
          </div>
          <div class="delivery">
            <o-icon><icon-delivery></icon-delivery></o-icon>
            <span>移交队长</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style lang="scss" scoped>
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
          }
          .o-button {
            font-size: 14px;
            padding: 5px 10px !important;
            min-width: 80px;
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
      :deep(.el-input) {
        width: 220px;
        .el-input__wrapper {
          padding-left: 45px !important;
          background: rgba(13, 141, 255, 0.03);
        }
      }
    }
    &-button {
      .o-button {
        &:last-child {
          margin-left: 10px;
        }
      }
      // width: 400px;
      // display: flex;
      // justify-content: space-between;
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
</style>
