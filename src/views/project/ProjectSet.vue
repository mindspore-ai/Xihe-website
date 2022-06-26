<script setup>
import { ref, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import OButton from '@/components/OButton.vue';
import OSelect from '@/components/OSelect.vue';
import OInput from '@/components/OInput.vue';
import ODialog from '@/components/ODialog.vue';

import { useUserInfoStore, useFileData } from '@/stores';
import {
  modifyProject,
  deleteProject,
  getProjectData,
} from '@/api/api-project';
import { fileRename } from '@/api/api-obs';

import warningImg from '@/assets/icons/warning.png';
import successImg from '@/assets/icons/success.png';

let detailData = reactive(useFileData().fileStoreData);

const router = useRouter();
const route = useRoute();
let routerParams = router.currentRoute.value.params;

const userInfoStore = useUserInfoStore();
const organizationAdminList = reactive(userInfoStore.organizationAdminList);
const fileData = useFileData();

const i18n = {
  visible: {
    title: '仓库属性',
    options: [
      {
        value: 'Private',
        label: 'Private',
        id: 1,
        describe:
          '其他用户将无法搜索、查看你的模项目，仅你及你的团队成员可查看和编辑此项目。',
      },
      {
        value: 'Public',
        label: 'Public',
        id: 2,
        describe:
          '其他用户将无法搜索、查看你的模项目，仅你及你的团队成员可查看和编辑此项目。',
      },
    ],
    btnText: '保存更改',
  },
  rename: {
    title: '重命名和转移',
    newOwn: '新拥有者',
    newName: '新项目名',
    placeholder: '请输入项目名',
    describe: '你可重命名项目，并转移你的项目至组织。',
    btnText: '确定',
  },
  covers: {
    title: '项目封面',
  },
  delete: {
    title: '删除项目',
    describe:
      '此操作将会删除与项目相关的所有资源，且此操作不可逆，请谨慎确认是否要删除此项目。',
    describe1:
      '此操作将会删除与项目相关的所有资源，且此操作不可逆，请谨慎确认是否要删除此项目！',
    btnText: '删除',
    cancel: '取消',
    confirm: '确认',
  },
};

const visibleOptions = reactive(i18n.visible.options);
const visibleValue = ref('');
const newOwn = ref('');
const newName = ref('');
const visibleIndex = ref(0);
const showDel = ref(false);
const showConfirm = ref(false); // 控制删除成功跳转个人主页弹窗

detailData.is_private ? (visibleIndex.value = 0) : (visibleIndex.value = 1);

function getIndex(value) {
  visibleIndex.value = value;
}
function getOwnSelect(value) {
  newOwn.value = value;
}
function getVisiableSelect(value) {
  console.log(value);
  value === 'Private'
    ? (visibleValue.value = true)
    : (visibleValue.value = false);
}

const photos = ref([]);
const photoId = ref(0);
photos.value = JSON.parse(localStorage.getItem('photoList'));
photos.value.forEach((item) => {
  item.is_active = false;
});

function selectImgClick(item) {
  console.log(item);
  photoId.value = item.id;
  photos.value.forEach((single) => {
    single.is_active = false;
  });
  item.is_active = true;
}
function confirmAmend() {
  let query = {
    id: detailData.id,
    photo: photoId.value,
  };
  modifyProject(query).then((res) => {
    console.log(res);
    if (res.status === 200) {
      ElMessage({
        type: 'success',
        message: '仓库信息更新成功',
      });
    }
  });
}

async function confirmRename() {
  try {
    let query = {
      new_path: `xihe-obj/projects/${route.params.user}/${newName.value}/`,
      old_path: `xihe-obj/projects/${route.params.user}/${routerParams.name}/`,
    };
    await fileRename(query).then((res) => {
      if (res.status === 200) {
        // 改名成功更新pinia数据
        getProjectData({ name: newName.value }).then((res) => {
          if (res.results.data.length) {
            let storeData = res.results.data[0];
            storeData['is_owner'] =
              userInfoStore.userName === storeData.owner_name.name;
            fileData.setFileData(storeData);
          }
          ElMessage({
            type: 'success',
            message: '仓库信息更新成功',
          });
          router.push({
            name: 'projectSet',
            params: {
              user: routerParams.user,
              name: newName.value,
            },
          });
        });
      } else {
        ElMessage({
          type: 'error',
          message: res.msg,
        });
      }
    });
  } catch (error) {
    ElMessage({
      type: 'error',
      message: error,
    });
  }
}
function confirmPrivate() {
  let query = {
    is_private: visibleValue.value,
    id: detailData.id,
  };
  modifyProject(query).then((res) => {
    if (res.status === 200) {
      ElMessage({
        type: 'success',
        message: res.msg,
      });
    } else {
      ElMessage({
        type: 'error',
        message: res.msg,
      });
    }
  });
}
function confirmDel() {
  deleteProject(detailData.id).then((res) => {
    if (res.status === 200) {
      showDel.value = false;
      showConfirm.value = true;
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
</script>
<template>
  <div class="setting-warp">
    <div class="setting-inner">
      <div class="setting-main">
        <div class="setting-title">{{ i18n.visible.title }}</div>
        <o-select
          :select-data="visibleOptions"
          keys="value"
          value="value"
          :default-value="i18n.visible.options[visibleIndex].value"
          @click="getIndex"
          @change="getVisiableSelect"
        ></o-select>
        <p class="setting-tip">
          {{ i18n.visible.options[visibleIndex].describe }}
        </p>
        <o-button @click="confirmPrivate">{{ i18n.visible.btnText }}</o-button>
        <div class="setting-title">{{ i18n.rename.title }}</div>
        <p class="setting-tip">{{ i18n.rename.newOwn }}</p>
        <o-select
          :select-data="organizationAdminList"
          :placeholder="detailData.owner_name.name"
          keys="id"
          value="name"
          @change="getOwnSelect"
        ></o-select>
        <p class="setting-tip">{{ i18n.rename.newName }}</p>
        <o-input v-model="newName" :placeholder="i18n.rename.placeholder">
        </o-input>
        <p class="setting-tip">{{ i18n.rename.describe }}</p>
        <o-button @click="confirmRename">{{ i18n.rename.btnText }}</o-button>
        <!-- 封面 -->
        <h4 class="setting-title">{{ i18n.covers.title }}</h4>
        <div class="photo_container">
          <div v-for="item in photos" :key="item.id" class="container-single">
            <div
              class="img-modal"
              :class="item.is_active ? 'select_active' : ''"
              @click="selectImgClick(item)"
            ></div>
            <img :src="item.url" alt="" />
          </div>
        </div>
        <o-button @click="confirmAmend">{{ i18n.visible.btnText }}</o-button>

        <h4 class="setting-title">{{ i18n.delete.title }}</h4>
        <p class="setting-tip">{{ i18n.delete.describe }}</p>
        <o-button
          class="delete-btn"
          :style="{
            color: '##F3524DFF',
            borderColor: '##F3524DFF',
          }"
          @click="showDel = true"
          >{{ i18n.delete.btnText }}</o-button
        >
      </div>
      <o-dialog :show="showDel" @close-click="toggleDelDlg(false)">
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
            padding: '8px 0 30px',
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
      <o-dialog :show="showConfirm" @close-click="toggleDelDlg(false)">
        <template #head>
          <div
            class="dlg-title"
            :style="{ textAlign: 'center', paddingTop: '40px' }"
          >
            <img :src="successImg" alt="" />
          </div>
        </template>
        <div
          class="dlg-body"
          :style="{
            fontSize: '18px',
            textAlign: 'center',
            width: '640px',
          }"
        >
          {{ i18n.delete.describe2 }}
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
            <router-link :to="{ path: `/${userInfoStore.userName}` }">
              <o-button type="primary">{{ i18n.delete.confirm }}</o-button>
            </router-link>
          </div>
        </template>
      </o-dialog>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.select_active {
  display: block !important;
  background-color: rgba(165, 213, 255, 0.5);
}
.setting-inner {
  display: flex;
  justify-content: center;
  background-color: #fff;
  .setting-main {
    max-width: 600px;
    margin-bottom: 40px;
    width: 100%;
    .photo_container {
      display: flex;
      .container-single {
        position: relative;
        img {
          width: 152px;
          height: 86px;
          margin: 0 16px 24px 0;
        }
        .img-modal {
          position: absolute;
          left: -2px;
          top: -2px;
          width: 157px;
          height: 90px;
          z-index: 100;
          background-color: rgba(165, 213, 255, 0.5);
          display: none;
        }
        &:hover {
          .img-modal {
            display: block;
          }
        }
      }
    }
    .setting-title {
      margin: 40px 0 16px;
      font-size: 18px;
      font-family: FZLTHJW--GB1-0, FZLTHJW--GB1;
      color: #000000;
      line-height: 24px;
    }
    .setting-tip {
      margin: 8px 0 16px;
      color: #999999;
    }
    .delete-btn {
      color: #f3524dff;
      border-color: #f3524dff;
      &:hover {
        color: #b4110cff;
        border-color: #b4110cff;
      }
    }
  }
}
</style>
