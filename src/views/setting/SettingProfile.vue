<script setup>
import { ref, reactive, watch } from 'vue';
import { useUserInfoStore } from '@/stores';

import { setUserData } from '@/api/api-user';

import OButton from '@/components/OButton.vue';
// import OInput from '@/components/OInput.vue';
import ODialog from '@/components/ODialog.vue';

// import { getModelTags } from '@/api/api-shared';
// import { useFilterData } from '@/stores';
import avatarUrl from '../../../config/avatar-url';
const filterData = ref();

const userInfoStore = useUserInfoStore();
const nickName = ref(userInfoStore.nickName); // 昵称
const userDescription = ref(userInfoStore.description); //个人介绍
const avatar = ref(userInfoStore.avatar); // 头像
const showAvatarList = ref(false);
const checkedAvatar = ref(1);

const avatarCount = ref(0);
let query = reactive({
  page: 1,
  size: 12,
});

const layout = ref('sizes, prev, pager, next, jumper');
function handleSizeChange(val) {
  if (avatarCount.value / val < 8) {
    layout.value = layout.value.split(',').splice(0, 4).join(',');
  }
  query.size = val;
}

try {
  // getModelTags().then((res) => {
  filterData.value = avatarUrl;
  avatarCount.value = filterData.value.user_avatar.length;
  getCheckedId(filterData.value.user_avatar);
  // });
} catch (error) {
  console.error(error);
}

function getCheckedId(list) {
  list.forEach((item) => {
    if (item.url === avatar.value) {
      checkedAvatar.value = item.id;
    }
  });
}

function toggleDelDlg(flag) {
  if (flag === undefined) {
    showAvatarList.value = !showAvatarList.value;
  } else {
    showAvatarList.value = flag;
  }
}
function saveData() {
  // if (!nickName.value) {
  //   ElMessage({
  //     type: 'error',
  //     message: '昵称不能为空',
  //     center: true,
  //   });
  //   return;
  // }
  getCheckedId(filterData.value.user_avatar);
  setUserData({
    // nickname: nickName.value,
    bio: userDescription.value || userInfoStore.description,
    avatar_id: avatar.value,
  })
    .then(() => {
      // if (res.status === 200) {
      userInfoStore.nickName = nickName.value;
      userInfoStore.description = userDescription.value;
      userInfoStore.avatar =
        filterData.value.user_avatar[checkedAvatar.value - 1].url;
      ElMessage({
        type: 'success',
        message: '个人信息更新成功',
        center: true,
      });
      disabled.value = true;
    })
    .catch((err) => {
      ElMessage({
        type: 'error',
        message: err,
        center: true,
      });
    });
}
function selectAvatar(id) {
  checkedAvatar.value = id;
}
function confirmAvatar() {
  avatar.value = filterData.value.user_avatar[checkedAvatar.value - 1].url;
  toggleDelDlg(false);
}
function handleCurrentChange(val) {
  query.page = val;
}
const disabled = ref(true);
watch([userDescription, avatar], () => {
  disabled.value = false;
});
</script>

<template>
  <!-- <div class="setting-box">
    <p class="setting-title">昵称</p>
    <el-input
      v-model.trim="nickName"
      placeholder="请输入您的昵称"
      class="setting-input"
    ></el-input>
  </div> -->
  <div class="setting-box">
    <p class="setting-title">头像</p>
    <div class="avatar-uploader" @click="toggleDelDlg(true)">
      <img :src="avatar" class="avatar" />
      <div class="avatar-uploader-box">
        <p>选择头像</p>
      </div>
    </div>
  </div>
  <div class="setting-box">
    <p class="setting-title">个人简介</p>
    <el-input
      v-model="userDescription"
      placeholder="一句话介绍你自己"
      maxlength="200"
      show-word-limit
      class="setting-input"
    ></el-input>
  </div>

  <o-button type="primary" :disabled="disabled" @click="saveData"
    >保存</o-button
  >
  <el-dialog
    v-model="showAvatarList"
    width="640px"
    :show-close="false"
    center
    align-center
  >
    <template #header="{ titleId, title }">
      <div :id="titleId" :class="title">选择头像</div>
    </template>
    <div class="dlg-body">
      <ul v-if="filterData" class="avatar-list">
        <li
          v-for="item in filterData.user_avatar.slice(
            (query.page - 1) * query.size,
            query.page * query.size
          )"
          :key="item.id"
          class="avatar-item"
          :class="{ 'checked-avater': item.id === checkedAvatar }"
          @click="selectAvatar(item.id)"
        >
          <img :src="item.url" alt="" />
        </li>
      </ul>
      <div v-if="avatarCount > 5" class="pagination">
        <el-pagination
          :page-sizes="[5, 10, 15]"
          :current-page="query.page"
          :page-size="12"
          :total="avatarCount"
          hide-on-single-page
          :layout="layout"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
    </div>
    <template #footer>
      <div class="dlg-actions" style="display: flex; justify-content: center">
        <o-button style="margin-right: 16px" @click="toggleDelDlg(false)"
          >取消</o-button
        >
        <o-button type="primary" @click="confirmAvatar">确认</o-button>
      </div>
    </template>
  </el-dialog>
</template>
<style lang="scss" scoped>
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 24px;
  :deep(.el-pagination__sizes) {
    display: none;
  }
  :deep(.el-pagination__jump) {
    display: none;
  }
  :deep(.el-pager) {
    li {
      background-color: #fff;
    }
  }
  .el-select {
    display: none;
  }
}
.dlg-body {
  padding: 0 20px;
  min-height: 438px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .avatar-list {
    display: grid;
    grid-template-columns: repeat(4, minmax(100px, 1fr));
    column-gap: 32px;
    row-gap: 32px;
    .avatar-item {
      width: 106px;
      height: 106px;
      background: #f7f8fa;
      border: 1px solid #dfe1e8;
      cursor: pointer;
      border-radius: 8px;
      img {
        width: 100%;
      }
    }
    .checked-avater {
      background: rgba(165, 213, 255, 0.5);
      border: 2px solid #a0d2ff;
    }
  }
}
.setting-box {
  margin-bottom: 24px;

  .setting-title {
    width: 400px;
    height: 24px;
    line-height: 24px;
    font-size: 18px;
    color: #000000;
    margin-bottom: 14px;
  }

  .avatar-uploader {
    cursor: pointer;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 140px;
    height: 140px;
    background: #f7f8fa;
    border: 1px solid #dfe1e8;
    overflow: hidden;
    border-radius: 8px;
    &:hover {
      .avatar-uploader-box {
        display: flex;
        border-radius: 0px 0px 8px 8px;
      }
    }
    .avatar {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
    &-box {
      position: absolute;
      display: flex;
      display: none;
      justify-content: center;
      align-items: center;
      width: 100%;
      bottom: 0;
      height: 50px;
      background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #3f3f3f 100%);
      p {
        color: #fff;
        font-size: 14px;
        line-height: 18px;
      }
    }
  }
}
</style>
