<script setup>
import { ref } from 'vue';
import { useUserInfoStore } from '@/stores';

import { setUserData } from '@/api/api-user';

import OButton from '@/components/OButton.vue';
// import OInput from '@/components/OInput.vue';
import ODialog from '@/components/ODialog.vue';

import { getModelTags } from '@/api/api-shared';
// import { useFilterData } from '@/stores';
const filterData = ref();

const userInfoStore = useUserInfoStore();
const nickName = ref(userInfoStore.nickName); // 昵称
const userDescription = ref(userInfoStore.description); //个人介绍
const avatar = ref(userInfoStore.avatar); // 头像
const showAvatarList = ref(false);
const checkedAvatar = ref(1);

try {
  getModelTags().then((res) => {
    filterData.value = res.data;
    getCheckedId(filterData.value.user_avatar);
  });
} catch (error) {
  console.log(error);
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
  getCheckedId(filterData.value.user_avatar);
  setUserData({
    nickname: nickName.value.trim() || userInfoStore.avatar,
    description: userDescription.value || userInfoStore.description,
    avatar: checkedAvatar.value,
  }).then((res) => {
    if (res.status === 200) {
      userInfoStore.nickName = nickName.value;
      userInfoStore.description = userDescription.value;
      userInfoStore.avatar =
        filterData.value.user_avatar[checkedAvatar.value - 1].url;
      ElMessage({
        type: 'success',
        message: res.msg,
        center: true,
      });
    } else {
      ElMessage({
        type: 'error',
        message: res.msg,
        center: true,
      });
    }
  });
}
function selectAvatar(id) {
  checkedAvatar.value = id;
}
function confirmAvatar() {
  avatar.value = filterData.value.user_avatar[checkedAvatar.value - 1].url;
  toggleDelDlg(false);
}
</script>

<template>
  <div class="setting-box">
    <p class="setting-title">昵称</p>
    <el-input
      v-model="nickName"
      placeholder="请输入您的昵称"
      class="setting-input"
    ></el-input>
  </div>
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
      class="setting-input"
    ></el-input>
  </div>

  <o-button type="primary" @click="saveData">保存</o-button>
  <o-dialog :show="showAvatarList" @close-click="toggleDelDlg(false)">
    <template #head>
      <div class="dlg-title" :style="{ textAlign: 'center' }">选择头像</div>
    </template>
    <div
      class="dlg-body"
      :style="{
        fontSize: '18px',
        textAlign: 'center',
        padding: '0 60px',
      }"
    >
      <ul v-if="filterData" class="avatar-list">
        <li
          v-for="item in filterData.user_avatar"
          :key="item.id"
          class="avatar-item"
          :class="{ 'checked-avater': item.id === checkedAvatar }"
          @click="selectAvatar(item.id)"
        >
          <img :src="item.url" alt="" />
        </li>
      </ul>
    </div>
    <template #foot>
      <div
        class="dlg-actions"
        :style="{
          display: 'flex',
          justifyContent: 'center',
          paddingBottom: '16px',
        }"
      >
        <o-button :style="{ marginRight: '38px' }" @click="toggleDelDlg(false)"
          >取消</o-button
        >
        <o-button type="primary" @click="confirmAvatar">确认</o-button>
      </div>
    </template>
  </o-dialog>
</template>
<style lang="scss" scoped>
.o-dialog {
  width: 800px;
}
.dlg-body {
  width: 800px;
  padding: 0 40px;
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
    &:hover {
      .avatar-uploader-box {
        display: flex;
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
