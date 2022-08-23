<script setup>
import { ref } from 'vue';
import useClipboard from 'vue-clipboard3';
import { useUserInfoStore } from '@/stores';

import successIcon from '@/assets/icons/success.png';

// import firstImg from '@/assets/imgs/first.png';
// import secondImg from '@/assets/imgs/second.png';
// import thirdImg from '@/assets/imgs/third.png';

import { getRank } from '@/api/api-user';

const tableData = ref([]);

const { toClipboard } = useClipboard();

const DOMAIN = import.meta.env.VITE_DOMAIN;
const userInfoStore = useUserInfoStore();

const invitationUrl = ref(
  `https://${DOMAIN}/?invited=${userInfoStore.userName}`
);

const invitationInput = ref(null);
const showDlg = ref(false);
const invitedNum = parseInt(userInfoStore.bonus / 10);

const handleCopy = async () => {
  try {
    await toClipboard(invitationUrl.value);
    toggleDlg(true);
  } catch (e) {
    console.error(e);
  }
};

const toggleDlg = (flag) => {
  showDlg.value = flag;
};
getRank().then((res) => {
  console.log(res.data.user_invited);
  tableData.value = res.data.user_invited;
  console.log(tableData);
});
</script>

<template>
  <div class="setting-box">
    <p class="settin-title">我的专属邀请链接</p>
    <div class="setting-content">
      <el-input
        ref="invitationInput"
        v-model="invitationUrl"
        disabled
      ></el-input>
      <OButton type="text" size="small" class="copy-btn" @click="handleCopy"
        >复制</OButton
      >
    </div>
  </div>
  <div class="setting-box">
    <p class="settin-title">
      成功邀请：<span class="setting-title-tip"
        >被邀请用户成功注册后计入邀请成功人数</span
      >
    </p>
    <div class="setting-content">
      <span class="invited-num">{{ invitedNum }}</span>
      <span class="invited-unit">人</span>
    </div>
  </div>

  <ODialog :show="showDlg" :close="false">
    <div class="dlg-body">
      <img
        :src="successIcon"
        :style="{ width: '48px', height: '48px', marginBottom: '32px' }"
      />
      <p class="tip-content">
        复制成功，分享链接给好友并成功注册，即有机会赢取万元京东卡
      </p>

      <OButton type="primary" size="small" @click="toggleDlg(fasle)"
        >确定</OButton
      >
    </div>
  </ODialog>
  <!-- <div class="rank-header">邀请人数排行榜</div>
  <div class="rank-body">
    <el-table :data="tableData">
      <el-table-column prop="date" width="120">
        <template #default="scope">
          <img v-if="scope.$index === 0" :src="firstImg" alt="" />
          <img v-else-if="scope.$index === 1" :src="secondImg" alt="" />
          <img v-else-if="scope.$index === 2" :src="thirdImg" alt="" />
          <div v-else-if="scope.$index < 9" class="num">
            {{ '0' + (scope.$index + 1) }}
          </div>
          <div v-else class="num">{{ scope.$index + 1 }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="name">
        <template #default="scope">
          <div class="user">
            <img :src="tableData[scope.$index].avatar_url" alt="" />
            <span>{{ tableData[scope.$index].username }} </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column width="90">
        <template #default="scope">
          <div class="score">
            <span>{{ tableData[scope.$index].bonus / 10 }} </span
            ><span class="man">人</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div> -->
</template>

<style lang="scss" scoped>
.setting-box {
  margin-top: 24px;

  .setting-title {
    height: 24px;
    font-size: 18px;
    font-weight: normal;
    color: #000000;
    line-height: 24px;

    &-tip {
      height: 24px;
      font-size: 14px;
      font-weight: normal;
      color: #555555;
      line-height: 24px;
    }
  }

  .setting-content {
    margin-top: 16px;
    .invited-num {
      height: 48px;
      font-size: 36px;
      font-weight: normal;
      color: #000000;
      line-height: 48px;
    }

    .invited-unit {
      height: 48px;
      font-size: 14px;
      font-weight: normal;
      color: #555555;
      line-height: 48px;
    }
  }

  .copy-btn {
    margin-left: 8px;
  }
}

.dlg-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .tip-content {
    height: 28px;
    font-size: 18px;
    font-weight: normal;
    color: #555555;
    line-height: 28px;
    margin-bottom: 60px;
  }
}
// .rank-header {
//   margin-top: 40px;
//   background-image: url(@/assets/imgs/rank-bg.png);
//   color: #ffffff;
//   font-size: 24px;
//   line-height: 32px;
//   text-align: center;
//   padding: 24px;
//   width: 532px;
// }
// .rank-body {
//   width: 532px;
//   img {
//     width: 41px;
//   }
//   :deep(.el-table__header-wrapper) {
//     display: none;
//   }
//   :deep(.el-table--fit) {
//     --el-table-fixed-box-shadow: none;
//   }
//   // margin-left: 40px;
//   :deep(.el-table__inner-wrapper) {
//     th {
//       color: #000000;
//     }
//     color: #555555;
//     .el-table__header {
//       font-size: 18px;
//       line-height: 26px;
//       .cell {
//         margin: 24px 0;
//       }
//       tr {
//         --el-table-fixed-box-shadow: none;
//       }
//     }
//     .el-table__cell {
//       padding: 0;
//       .cell {
//         padding: 0;
//       }
//     }
//     // .el-table_1_column_1 {
//     //   padding-left: 40px !important;
//     // }
//     .el-table__body {
//       font-size: 16px;
//       line-height: 24px;
//       // .el-table_1_column_1 {
//       //   font-size: 28px;
//       // }
//       // .el-table_1_column_3 {
//       //   color: #ff7f0d;
//       // }
//       .el-table__row:first-child {
//         background: linear-gradient(to right, #fff, #fffbef);
//         border: none;
//         box-shadow: none;
//       }
//       .el-table__row:nth-child(2) {
//         background: linear-gradient(to right, #fff, #fafcfc);
//       }
//       .el-table__row:nth-child(3) {
//         background: linear-gradient(to right, #fff, #fffaf6);
//       }
//     }
//     .cell {
//       margin: 20px 0;
//       .num {
//         margin: 4px 40px;
//         // margin-left: 12px;
//         font-size: 28px;
//         line-height: 36px;
//       }
//       img {
//         margin-left: 40px;
//       }
//       .score {
//         color: #ff7f0d;
//         font-size: 24px;
//         vertical-align: sub;
//         .man {
//           font-size: 14px;
//         }
//       }
//       .user {
//         color: #555555;
//         display: flex;
//         align-items: center;
//         img {
//           margin-right: 15px;
//         }
//       }
//     }
//     .el-table__append-wrapper {
//       // text-align: center;
//       margin-top: 27px;
//       margin-bottom: 40px;
//       margin-right: 40px;
//       font-size: 14px;
//       color: #40c4ff;
//       display: flex;
//       justify-content: center;
//       align-items: center;
//       cursor: pointer;
//       .o-icon {
//         font-size: 24px;
//         color: #0d8dff;
//         margin-left: 8px;
//       }
//     }
//   }
// }
</style>
