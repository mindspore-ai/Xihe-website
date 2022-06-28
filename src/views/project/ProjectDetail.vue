<script setup>
import { ref, reactive, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import IconX from '~icons/app/x';
import IconClear from '~icons/app/clear';
import IconCopy from '~icons/app/copy-nickname';
import IconPlus from '~icons/app/plus';
import IconPopver from '~icons/app/popover.svg';
import IconFork from '~icons/app/fork';

import OButton from '@/components/OButton.vue';
import OIcon from '@/components/OIcon.vue';
import OHeart from '@/components/OHeart.vue';
import OPopper from '@/components/OPopper.vue';

import { useUserInfoStore, useFileData, useLoginStore } from '@/stores';

import {
  getProjectData,
  modifyProject,
  getModelTags,
  getUserDig,
  projectFork,
  trainList,
} from '@/api/api-project';
const fileData = useFileData();
const userInfoStore = useUserInfoStore();
const loginStore = useLoginStore();

const router = useRouter();
const route = useRoute();
const detailData = computed(() => {
  return useFileData().fileStoreData;
});

const modelTags = ref([]);
const headTags = ref([]);
const isDigged = ref(false);
const digCount = ref(0);
const inputDom = ref();
const forkShow = ref(false);
const loadingShow = ref(false);
const renderList = ref([]);
const isShow = ref();
const isTagShow = ref(false);
const tabPosition = ref('left');

let reopt = {
  method: 'PUT',
  url: null,
  headers: null,
};

let queryDate = {
  infer_sdk: null,
  train_sdk: null,
  licenses: [],
  tags: [],
  task: [],
};

let dialogList = {
  head: {
    title: '已选标签',
    delete: '删除',
  },
  tags: [],

  menuList: [
    { tab: '应用分类', key: 'task' },
    { tab: '项目类型', key: 'infer_sdk' },
    { tab: '训练平台', key: 'train_sdk' },
    { tab: '协议', key: 'licenses' },
    { tab: '其他', key: 'tags' },
  ],
};

let tabTitle = reactive([
  {
    label: '推理',
    id: 0,
    path: '',
    isPrivate: false,
  },
  {
    label: '训练',
    id: 1,
    path: 'train',
    isPrivate: false,
  },
  {
    label: '文件',
    id: 2,
    path: 'tree',
    isPrivate: false,
  },
  {
    label: '设置',
    id: 3,
    path: 'settings',
    isPrivate: true,
  },
  {
    // label: '训练数据',
    // id: 4,
    path: 'trainlist',
    isPrivate: true,
  },
  {
    // label: '训练日志',
    // id: 5,
    path: 'trainlog',
    isPrivate: true,
  },
]);

const activeName = ref(tabTitle[route.meta.index].path);

// 渲染的nav数据 (区分访客和用户)
const renderNav = computed(() => {
  return detailData.value.is_owner
    ? tabTitle
    : tabTitle.filter((item) => {
        return !item.isPrivate;
      });
});

// 训练选项
const trainSelect = [
  {
    id: 1,
    label: '训练代码',
    path: 'train',
  },
  {
    id: 2,
    label: '训练列表',
    path: 'trainlist',
  },
];

const ruleFormRef = ref();
const rules = reactive({
  owner: [
    {
      required: true,
      message: '请选择拥有者',
      trigger: 'blur',
    },
  ],
  storeName: [
    { required: true, message: '必填项', trigger: 'blur' },
    {
      pattern: /^[^\u4e00-\u9fa5]{1,1000}$/g,
      message: '不允许输⼊中⽂',
      trigger: 'blur',
    },
    {
      pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9!@#$^&().']+$/,
      message: '格式不正确',
      trigger: 'blur',
    },
    {
      pattern: /^[^.].*[^.]$/,
      message: '格式不正确',
      trigger: 'blur',
    },
  ],
  describe: [
    { required: true, message: '必填项', trigger: 'blur' },
    { min: 1, max: 100, message: '内容不能为空', trigger: 'blur' },
  ],
});

const forkForm = reactive({
  owner: null,
  storeName: null,
  describe: null,
});
const ownerName = ref([]);
ownerName.value.push(userInfoStore.userName);

// 详情数据
function getDetailData() {
  try {
    getProjectData({
      name: route.params.name,
      owner_name: route.params.user,
    }).then((res) => {
      if (res.results.data.length) {
        let storeData = res.results.data[0];
        console.log(storeData);
        // 判断仓库是否属于自己
        storeData['is_owner'] =
          userInfoStore.userName === storeData.owner_name.name;
        // 文件列表是否为空
        if (detailData.value) {
          storeData['is_empty'] = detailData.value.is_empty;
        }

        fileData.setFileData(storeData);
        console.log(detailData.value);
        // trainList(detailData.value.id).then((res) => {
        //   console.log(res.data.data);
        //   res.data.data.forEach((item) => {
        //     if (item.status === 'Running') {
        //     runingStatus.value = true;
        //     }else{
        //     completedStatus.value = true
        //   }
        //   });
        // });
        isShow.value = userInfoStore.userName === storeData.owner_name.name;

        forkForm.storeName = detailData.value.name;
        forkForm.owner = userInfoStore.userName;

        /*  detailData.value = res.results.data[0]; */
        if (detailData.value.sdk_name !== 'Gradio') {
          console.log('1', tabTitle);
          tabTitle[0].label = '项目卡片';
        }

        digCount.value = detailData.value.digg_count;

        const { licenses_list, task_list, tags_list } = detailData.value;
        isDigged.value = detailData.value.digg.includes(userInfoStore.id);

        modelTags.value = [...licenses_list, ...task_list, ...tags_list];
        modelTags.value = modelTags.value.map((item) => {
          return item;
        });
        headTags.value = [...modelTags.value];
      } else {
        router.push('/notfound');
      }
    });
  } catch (error) {}
}
getDetailData();

const runingStatus = ref(false);
const completedStatus = ref(false);
// 获取训练列表
// function getTrainList() {
// trainList(detailData.value.id).then((res) => {
//   console.log(res.data.data);
//   res.data.data.forEach((item) => {
//     if (item.status === 'Running') {
//     runingStatus.value = true;
//     }else{
//     completedStatus.value = true
//   }
//   });
// });
// }
// getTrainList();

function handleTabClick(item) {
  router.push(
    `/projects/${route.params.user}/${route.params.name}/${
      tabTitle[Number(item.index)].path
    }`
  );
}

// 点击标签
function tagClick(it, key) {
  if (key === 'train_sdk' || key === 'infer_sdk' || key === 'licenses') {
    if (it.isActive) {
      it.isActive = false;
      renderList.value[key].forEach((item) => {
        item.isSelected = false;
      });
      headTags.value.forEach((item, index) => {
        if (item.name == it.name) {
          headTags.value.splice(index, 1);
        }
      });
    } else {
      renderList.value[key].forEach((item) => {
        if (item.isActive) {
          headTags.value.forEach((tag, index) => {
            if (item.name == tag.name) {
              headTags.value.splice(index, 1);
            }
          });
          item.isActive = false;
        }
        item.isSelected = true;
      });
      it.isActive = true;
      it.isSelected = false;
      headTags.value.push(it);
    }
  } else {
    it.isActive = !it.isActive;
    if (it.isActive) {
      headTags.value.push(it);
    } else {
      headTags.value.forEach((item, index) => {
        if (item.name == it.name) {
          headTags.value.splice(index, 1);
        }
      });
    }
  }
}

// 添加标签
function addTagClick() {
  isTagShow.value = true;
  getAllTags();
  getDetailData();
}

// 点赞
function digClick() {
  reopt.url = `/api/projects/${detailData.value.id}/digg`;
  reopt.headers = { Authorization: 'Bearer ' + userInfoStore.token };
  getUserDig(reopt).then((res) => {
    if (res.data.status === 200) {
      getDetailData();
    }
  });
  // }
}

// 删除
function deleteClick(tag) {
  let i = headTags.value.indexOf(tag);
  headTags.value.splice(i, 1);

  let menu = dialogList.menuList.map((item) => item.key);
  menu.forEach((key) => {
    if (key == 'task') {
      renderList.value[key].forEach((item) => {
        item.task_list.forEach((it) => {
          if (it.name == tag.name) {
            it.isActive = false;
          }
        });
      });
    } else {
      renderList.value[key].forEach((item) => {
        if (item.name == tag.name) {
          item.isActive = false;
        }
      });
    }
  });
}

// 编辑标签头部标签删除
function deleteModelTags() {
  headTags.value = [];
  let menu = dialogList.menuList.map((item) => item.key);

  menu.forEach((menuitem) => {
    if (menuitem == 'task') {
      renderList.value[menuitem].forEach((mit) => {
        mit.task_list.map((it) => {
          it.isActive = false;
        });
      });
    } else {
      renderList.value[menuitem].forEach((it) => {
        it.isActive = false;
      });
    }
  });
}

// 确认
function confirmBtn() {
  dialogList.menuList.forEach((menu) => {
    if (menu.key == 'task') {
      queryDate[menu.key] = [];
      renderList.value[menu.key].forEach((item) => {
        item.task_list.forEach((it) => {
          if (it.isActive == true) {
            queryDate[menu.key].push(it.id);
          } else {
            return;
          }
        });
      });
    } else if (menu.key == 'tags') {
      queryDate[menu.key] = [];
      renderList.value[menu.key].forEach((item) => {
        if (item.isActive == true) {
          queryDate[menu.key].push(item.id);
        }
      });
    } else if (menu.key == 'licenses') {
      queryDate[menu.key] = [];
      renderList.value[menu.key].forEach((item) => {
        if (item.isActive) {
          queryDate[menu.key].push(item.id);
        }
      });
    } else {
      renderList.value[menu.key].forEach((item) => {
        if (item.isActive === true) {
          queryDate[menu.key] = item.id;
        }
      });
    }
  });
  let params = queryDate;
  params.id = detailData.value.id;

  modifyProject(params).then((res) => {
    if (res.status === 200) {
      getDetailData();
      getAllTags();
      console.log(detailData.value);
    }
  });
  isTagShow.value = false;
}

// 取消
function concelBtn() {
  isTagShow.value = false;
  getAllTags();
  getDetailData();
}

function getAllTags() {
  getModelTags().then((res) => {
    renderList.value = res.data;
    localStorage.setItem('photoList', JSON.stringify(res.data.projects_photo));

    let menu = dialogList.menuList.map((item) => item.key);
    menu.forEach((key) => {
      if (key == 'task') {
        renderList.value[key].forEach((item) => {
          item.task_list.forEach((it) => {
            it.isActive = false;
          });
        });
      } else {
        renderList.value[key].forEach((item) => {
          item.isActive = false;
          item.isSelected = false;
        });
      }
    });

    modelTags.value.forEach((item) => {
      menu.forEach((menuitem) => {
        if (menuitem === 'task') {
          renderList.value[menuitem].forEach((mit) => {
            mit.task_list.forEach((it) => {
              if (it.name === item.name) {
                it.isActive = true;
              }
            });
          });
        } else if (menuitem === 'tags') {
          renderList.value[menuitem].forEach((it) => {
            if (it.name === item.name) {
              it.isActive = true;
            }
          });
        } else {
          renderList.value[menuitem].forEach((it) => {
            if (it.name === item.name) {
              it.isActive = true;
            }
          });
        }
      });
    });
  });
}
getAllTags();
// 复制用户名
function copyText(textValue) {
  inputDom.value.value = textValue;
  inputDom.value.select();
  if (document.execCommand('Copy')) {
    // 执行浏览器复制命令
    ElMessage({
      type: 'success',
      message: '复制成功',
      center: true,
    });
  }
}

function forkCreateClick() {
  ruleFormRef.value.validate((valid) => {
    if (valid) {
      forkShow.value = false;
      loadingShow.value = true;
      let projectId = detailData.value.id;
      let params = {};
      params.name = forkForm.storeName;
      params.owner_id = userInfoStore.id;
      params.description = forkForm.describe;
      params.owner_type = JSON.parse(localStorage.getItem('base')).user_type_id;

      forkShow.value = false;
      loadingShow.value = true;
      projectFork(params, projectId).then((res) => {
        console.log(res);
        if (res.status === 200 && res.data.status === 200) {
          loadingShow.value = false;
          router.push(
            `/projects/${userInfoStore.userName}/${forkForm.storeName}`
          );
        } else {
          loadingShow.value = false;
          ElMessage({
            type: 'error',
            message: res.data.msg,
            center: true,
          });
        }
      });
    } else {
      ElMessage({
        type: 'error',
        message: '请按要求填写信息',
        center: true,
      });
      return;
    }
  });
}

function forkClick() {
  forkShow.value = true;
}

watch(
  () => {
    return [route.params.name, router.currentRoute];
  },
  () => {
    if (route.name == 'projectCard') {
      getDetailData();
    } else if (
      router.currentRoute.value.path ==
      `/projects/${userInfoStore.userName}/${forkForm.storeName}`
    ) {
      getDetailData();
    }
  }
);
// 在router里面配置mate nav高亮跟随
watch(
  () => {
    return route.name;
  },
  () => {
    if (route.meta.index === 2) {
      activeName.value = 'tree';
    } else if (route.meta.index === 1) {
      activeName.value = 'train';
    }
  }
);
// 中途登录页面更新
watch(
  () => {
    return useUserInfoStore().token;
  },
  (token) => {
    if (token) {
      getDetailData();
    }
  }
);

function goTrain(path) {
  router.push(`/projects/${route.params.user}/${route.params.name}/${path}`);
  // router.push(path);
}
</script>

<template>
  <div v-if="detailData && detailData.id" class="model-detail">
    <textarea ref="inputDom" class="input-dom"></textarea>
    <div class="card-head warp">
      <div class="head-top">
        <div>
          <div class="card-head-1">
            <div class="avatar">
              <img :src="detailData.owner_name.avatar_url" alt="" />
            </div>

            <router-link :to="{ path: `/${route.params.user}` }">
              {{ detailData.owner_name.name }} </router-link
            >/
            <span>{{ detailData.name }}</span>
            <div
              class="card-head-copy"
              @click="
                copyText(`${detailData.owner_name.name}/${detailData.name}`)
              "
            >
              <o-icon><icon-copy></icon-copy></o-icon>
            </div>
            <div class="loves">
              <o-heart
                :is-digged="isDigged"
                :dig-count="digCount"
                @click="digClick"
              ></o-heart>
            </div>
          </div>
          <div class="label-box">
            <div v-for="label in modelTags" :key="label" class="label-item">
              {{ label.name }}
            </div>
            <div v-if="isShow" class="label-add-item" @click="addTagClick">
              <o-icon><icon-plus></icon-plus></o-icon>
              添加标签
            </div>
          </div>
        </div>
        <div v-if="loginStore.isLogined">
          <o-button @click="forkClick">
            <div class="fork-btn">
              <o-icon><icon-fork></icon-fork></o-icon> Fork
            </div>
          </o-button>
        </div>
      </div>
      <div class="head-tabs">
        <el-tabs v-model="activeName" @tab-click="handleTabClick">
          <template v-for="item in renderNav">
            <el-tab-pane
              v-if="item.label !== '训练'"
              :key="item.id"
              :label="item.label"
              :name="item.path"
            >
            </el-tab-pane>
            <el-tab-pane
              v-else
              :key="item.id"
              class="center-tab-pane"
              :name="item.path"
            >
              <template #label>
                <el-dropdown placement="bottom" popper-class="nav">
                  <!-- <p>训练 </p> -->
                  <p>
                    训练
                    <span
                      v-if="completedStatus"
                      class="status train-status"
                    ></span>
                    <span
                      v-if="runingStatus"
                      class="status train-status1"
                    ></span>
                    <!-- <span class="status train-status2"></span>
                    <span class="status train-status3"></span> -->
                  </p>
                  <template
                    v-if="userInfoStore.userName === detailData.owner_name.name"
                    #dropdown
                  >
                    <el-dropdown-menu>
                      <el-dropdown-item
                        v-for="menu in trainSelect"
                        :key="menu.id"
                        @click="goTrain(menu.path)"
                      >
                        {{ menu.label }}
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </template>
            </el-tab-pane>
          </template>
        </el-tabs>
      </div>
    </div>
    <div v-if="detailData.id" class="model-detail-body">
      <router-view
        class="warp"
        :detail-data="detailData"
        @on-click="getDetailData()"
      ></router-view>
    </div>
    <!-- 标签管理 -->
    <div class="tags-box">
      <el-dialog v-model="isTagShow" width="804px" :show-close="false">
        <div class="dialog-head">
          <div class="head-left">
            <div class="head-title">{{ dialogList.head.title }}</div>
            <div class="head-delete" @click="deleteModelTags">
              <o-icon><icon-clear></icon-clear></o-icon>
              {{ dialogList.head.delete }}
            </div>
          </div>
          <div class="head-tags">
            <div v-for="it in headTags" :key="it" class="condition-detail">
              {{ it.name }}
              <o-icon class="icon-x" @click="deleteClick(it)"
                ><icon-x></icon-x
              ></o-icon>
            </div>
          </div>
        </div>
        <div class="dialog-body">
          <el-tabs :tab-position="tabPosition" style="height: 100%">
            <el-tab-pane
              v-for="menu in dialogList.menuList"
              :key="menu.key"
              :label="menu.tab"
            >
              <div class="body-right-container">
                <div v-if="menu.key == 'task'" class="body-right">
                  <div
                    v-for="item in renderList[menu.key]"
                    :key="item.id"
                    class="detail-box"
                  >
                    <div>
                      <p class="tan-title">
                        {{ item.name }}
                      </p>
                      <div class="tag-box">
                        <div
                          v-for="it in item.task_list"
                          :key="it.id"
                          class="condition-detail"
                          :class="{ 'condition-active': it.isActive }"
                          @click="tagClick(it, menu.key)"
                        >
                          {{ it.name }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-else class="noTask-box">
                  <div
                    v-for="item in renderList[menu.key]"
                    :key="item.id"
                    class="condition-detail"
                    :class="[
                      { 'condition-active': item.isActive },
                      { 'condition-active1': item.isSelected },
                    ]"
                    @click="tagClick(item, menu.key)"
                  >
                    {{ item.name }}
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
          <div class="btn-box">
            <o-button style="margin-right: 24px" @click="concelBtn"
              >取消</o-button
            >
            <o-button type="primary" @click="confirmBtn">确定</o-button>
          </div>
        </div>
      </el-dialog>
    </div>
    <!-- Fork -->
    <div class="fork-dialog">
      <el-dialog v-model="forkShow" title="创建FORK" center>
        <el-form
          ref="ruleFormRef"
          :model="forkForm"
          :rules="rules"
          :label-position="tabPosition"
          hide-required-asterisk
        >
          <el-form-item label="拥有者" prop="owner">
            <el-select v-model="forkForm.owner">
              <el-option v-for="item in ownerName" :key="item" :value="item">{{
                item
              }}</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="仓库名称" class="store-name" prop="storeName">
            <el-input
              v-model="forkForm.storeName"
              placeholder="请输入仓库名称"
            ></el-input>
            <o-popper></o-popper>
          </el-form-item>
          <el-form-item label="描述" prop="describe">
            <el-input
              v-model="forkForm.describe"
              type="textarea"
              placeholder="请输入内容"
              maxlength="100"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item>
            <o-button @click="forkShow = false">取消</o-button>
            <o-button type="primary" @click="forkCreateClick">确定</o-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
    <!-- loading -->
    <div class="loading">
      <el-dialog
        v-model="loadingShow"
        :show-close="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
      >
        <img src="@/assets/gifs/loading.gif" alt="" />
        <p>加载中,请耐心等待</p>
      </el-dialog>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$theme: #0d8dff;
.loading {
  :deep .el-dialog {
    width: 800px;
    min-height: 502px;
    --el-dialog-margin-top: 24vh;
    .el-dialog__body {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 472px;
      padding-bottom: 60px;
    }

    img {
      width: 56px;
      height: 56px;
    }
    p {
      font-size: 18px;
      color: #555555;
      line-height: 22px;
      margin-top: 22px;
    }
  }
}
.fork-dialog {
  :deep .el-dialog {
    width: 800px;
    min-height: 502px;
    --el-dialog-margin-top: 24vh;
    .el-dialog__header {
      padding-bottom: 15px;
      padding-top: 40px;
    }
    .el-dialog__title {
      font-size: 24px;
      line-height: 32px;
    }
    .el-form {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .store-name {
        position: relative;
        :deep(.el-popover.el-popper) {
          padding: 24px 16px 16px 16px;
          font-size: 12px;
          line-height: 16px;
          color: #656565;
          .remind {
            color: #f13b35;
          }
        }
        .o-popper {
          position: absolute;
          right: -40px;
          font-size: 24px;
          top: 8px;
        }
      }
      .el-form-item {
        margin-bottom: 24px;
        display: flex;
        align-items: center;
      }
      .o-button {
        margin: 24px 38px 0 0;
      }
    }

    .el-form--label-left .el-form-item__label {
      width: 88px;
      font-size: 14px;
    }
  }
}
.tags-box {
  :deep .el-dialog {
    --el-dialog-margin-top: 20vh;
  }
  .dialog-head {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    border-bottom: 1px solid #d8d8d8;
    .head-left {
      width: 188px;
      display: flex;
      padding-left: 20px;
      align-items: center;
      margin-bottom: 7px;
      .head-title {
        margin-right: 16px;
        font-size: 18px;
        line-height: 24px;
        min-width: 72px;
      }
      .head-delete {
        font-size: 12px;
        line-height: 18px;
        // margin-right: 52px;
        display: flex;
        align-items: center;
        cursor: pointer;
        .o-icon {
          margin-right: 6px;
          align-self: center;
        }
      }
    }

    .icon-x {
      margin-left: 4px;
    }
    .head-tags {
      flex: 1;
      display: flex;
      flex-wrap: wrap;
      .condition-detail {
        cursor: pointer;
        display: flex;
        align-items: center;
        padding: 0 12px;
        margin: 0 16px 10px 0;
        height: 28px;
        font-size: 14px;
        // color: #555;
        color: $theme;
        user-select: none;
        background-color: #f3f9ff;
        border-radius: 8px;
        border: 1px solid #e5e5e5;
        .icon-x {
          padding: 2px;
          font-size: 20px;
        }
      }
    }
  }
  .dialog-body {
    :deep .el-tabs__item {
      width: 188px;
      height: 56px;
      text-align: left;
      line-height: 56px;
      font-size: 18px;
    }
    :deep .el-tabs .el-tabs__header {
      box-shadow: none;
    }
    .el-tabs--left,
    .el-tabs--right {
      border-bottom: 1px solid #d8d8d8;
    }
    :deep .el-tabs__item.is-active {
      background: #f7f8fa;
    }
    .tan-title {
      margin: 14px 0;
    }
    .noTask-box {
      display: flex;
      flex-wrap: wrap;
    }
    .detail-box {
      .tag-box {
        display: flex;
        flex-wrap: wrap;
      }
    }
    .condition-detail {
      cursor: pointer;
      display: flex;
      align-items: center;
      padding: 0 12px;
      margin: 0 16px 16px 0;
      height: 28px;
      font-size: 14px;
      color: #555;
      user-select: none;
      background-color: #f3f9ff;
      border-radius: 8px;
      border: 1px solid #e5e5e5;
    }
    .condition-active {
      color: $theme;
    }
    .condition-active1 {
      color: #ccc;
    }
    .body-right-container {
      padding-left: 24px;
      height: 280px;
      overflow-y: scroll;
      .noTask-box {
        display: flex;
      }
      .body-right {
        .tan-title {
          font-size: 16px;
          line-height: 24px;
        }
        .el-tag {
          margin: 13px 16px 29px 0;
        }
      }
    }
    .body-right-container::-webkit-scrollbar {
      width: 10px;
    }
    .body-right-container::-webkit-scrollbar-thumb {
      background: #bfbfbf;
      border-radius: 10px;
    }
  }
}

.btn-box {
  display: flex;
  justify-content: center;
  margin: 48px 0 14px 0;
}
.warp {
  margin: 0 auto;
  padding: 0 16px;
  max-width: 1440px;
}
.input-dom {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
}
.model-detail {
  .card-head-top {
    display: flex;
    margin-bottom: 16px;
    font-size: 24px;
    color: #555;
    & > span:hover {
      cursor: pointer;
      color: #0d8dff;
    }
  }

  .card-head {
    padding-top: 105px;
    .head-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .fork-btn {
      font-size: 16px;
      display: flex;
      align-items: center;
      .o-icon {
        font-size: 24px;
        margin-right: 8px;
      }
    }
    .card-head-1 {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
      font-size: 24px;
      color: #555;
      a {
        color: inherit;
      }
      & > span:hover,
      & > a:hover {
        cursor: pointer;
        color: #0d8dff;
      }
      .avatar img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 8px;
        background-color: #3d8df7;
      }
      .card-head-copy {
        cursor: pointer;
        display: flex;
        align-items: center;
        margin-left: 8px;
        font-size: 24px;
        .o-icon:hover {
          color: #0d8dff;
        }
      }
      .loves {
        cursor: pointer;
        margin-left: 40px;
        font-size: 14px;
        line-height: 18px;
        display: flex;
        align-items: center;
        span {
          margin-left: 6px;
        }
        .o-icon:hover {
          svg {
            fill: rgba(13, 141, 255, 1);
          }
        }
      }
    }
    .label-box {
      display: flex;
      margin: 8px 0 16px;
      font-size: 14px;
      .label-item {
        align-self: center;
        height: 28px;
        line-height: 28px;
        padding: 0 12px;
        margin-right: 16px;
        color: #555;
        border: 1px solid #dbedff;
        background-color: #f3f9ff;
        border-radius: 8px;
        cursor: pointer;
      }
      .label-add-item {
        height: 28px;
        line-height: 28px;
        padding: 0px 12px;
        background: #f7f8fa;
        border-radius: 8px;
        border: 1px solid #999999;
        display: flex;
        align-items: center;
        cursor: pointer;
        .o-icon {
          margin-right: 4px;
        }
      }
    }
    .head-tabs {
      .status {
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
      }
      .train-status {
        background-color: rgba(98, 175, 48, 1);
      }
      .train-status1 {
        background-color: rgba(77, 205, 255, 1);
      }
      .train-status2 {
        background-color: rgba(204, 204, 204, 1);
      }
      .train-status3 {
        background-color: rgba(228, 22, 15, 1);
      }
      .el-tabs {
        :deep .el-tabs__nav {
          display: flex;
          .el-tabs__item:nth-child(3) {
            display: flex;
            align-items: center;
            padding-bottom: 0;
          }
          .el-dropdown {
            height: 100%;
            line-height: 48px;
            color: #555;
            font-size: 16px;
          }
        }
      }
    }
  }
  .model-detail-body {
    background-color: #f5f6f8;
    padding: 35px 0 64px;
  }
}
:deep(.el-tabs) {
  .el-tabs__header {
    background-color: #ffffff;
    margin-bottom: 0;
    box-shadow: 0px 1px 3px 0px rgba(190, 196, 204, 0.2);
  }

  .el-tabs__item {
    height: 48px;
    font-size: 16px;
    color: #555555;
    font-weight: normal;
    line-height: 48px;
    padding-bottom: 7px;

    &.is-active {
      color: #3d8df7;
    }

    &.el-tabs__active-bar {
      background-color: #3d8df7;
    }
  }

  .el-tabs__nav-wrap::after {
    display: none;
  }
}
</style>
