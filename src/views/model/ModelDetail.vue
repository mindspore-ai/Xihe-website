<script setup>
import { ref, reactive, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import IconX from '~icons/app/x';
import IconCopy from '~icons/app/copy-nickname';
import IconClear from '~icons/app/clear';
import IconPlus from '~icons/app/plus';

import OHeart from '@/components/OHeart.vue';
import OButton from '@/components/OButton.vue';
import OIcon from '@/components/OIcon.vue';

import {
  getModelData,
  getUserDig,
  getModelTags,
  modifyModel,
} from '@/api/api-model';

import { useUserInfoStore, useFileData } from '@/stores';

const fileData = useFileData();
const userInfoStore = useUserInfoStore();

const isDigged = ref(false);
const digCount = ref(0);
const router = useRouter();
const route = useRoute();
const headTags = ref([]);
const inputDom = ref();

const detailData = computed(() => {
  return useFileData().fileStoreData;
});

let reopt = {
  method: 'PUT',
  url: null,
  headers: null,
};

let isTagShow = ref(false);
const tabPosition = ref('left');

let renderList = ref([]);
let queryDate = {
  device_target: [],
  libraries: [],
  licenses: [],
  tags: [],
  task: [],
  model_format: [],
};

let dialogList = {
  head: {
    title: '已选标签',
    delete: '删除',
  },
  tags: [],

  menuList: [
    { tab: '应用分类', key: 'task' },
    { tab: '处理器', key: 'device_target' },
    { tab: '文件格式', key: 'model_format' },
    { tab: '框架', key: 'libraries' },
    { tab: '协议', key: 'licenses' },
    { tab: '其他', key: 'tags' },
  ],
};

let tabTitle = reactive([
  {
    label: '模型卡片',
    id: 0,
    path: '',
    isPrivate: false,
  },
  {
    label: '文件',
    id: 1,
    path: 'tree',
    isPrivate: false,
  },
  {
    label: '设置',
    id: 2,
    path: 'settings',
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

let modelTags = ref([]);
function getDetailData() {
  try {
    getModelData({
      name: route.params.name,
      owner_name: route.params.user,
    }).then((res) => {
      if (res.results.data.length) {
        let storeData = res.results.data[0];
        // 判断仓库是否属于自己
        storeData['is_owner'] =
          userInfoStore.userName === storeData.owner_name.name;
        // 文件列表是否为空
        if (detailData.value) {
          storeData['is_empty'] = detailData.value.is_empty;
        }
        fileData.setFileData(storeData);
        digCount.value = detailData.value.digg_count;
        const {
          licenses_list,
          libraries_list,
          task_list,
          tags_list,
          device_target_list,
          files_list,
        } = detailData.value;
        isDigged.value = detailData.value.digg.includes(userInfoStore.id);

        modelTags.value = [
          ...licenses_list,
          ...task_list,
          ...tags_list,
          ...libraries_list,
          ...device_target_list,
          ...files_list,
        ];
        modelTags.value = [...licenses_list, ...task_list, ...tags_list];
        modelTags.value = modelTags.value.map((item) => {
          return item;
        });
        headTags.value = [...modelTags.value];
      } else {
        router.push('/notfound');
      }
    });
  } catch (error) {
    console.log(error);
  }
}
getDetailData();

// 点击标签
// function tagClick(it, key) {
//   // if (key === 'task' || key === 'licenses') {
//   if (null) {
//     if (it.isActive) {
//       headTags.value.forEach((item, index) => {
//         if (item.name == it.name) {
//           headTags.value.splice(index, 1);
//         }
//       });
//     } else {
//       renderList.value[key].forEach((item) => {
//         item.isActive = false;
//         headTags.value.push(it);
//       });
//       it.isActive = !it.isActive;
//     }

//     return;
//   } else {
//     it.isActive = !it.isActive;
//     if (it.isActive === true) {
//       headTags.value.push(it);
//     } else {
//       headTags.value.forEach((item, index) => {
//         if (item.name == it.name) {
//           headTags.value.splice(index, 1);
//         }
//       });
//     }
//   }
// }
function tagClick(it, key) {
  if (key === 'task' || key === 'licenses') {
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
        if (item.isActive === true) {
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
    } else if (menuitem === 'status') {
      renderList.value[menuitem].forEach((it) => {
        if (detailData.value.status_name === it.name) {
          it.isActive = true;
        }
      });
    } else if (menuitem === 'sdk') {
      renderList.value[menuitem].forEach((it) => {
        if (detailData.value.sdk_name === it.name) {
          it.isActive = true;
        }
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
    } else {
      queryDate[menu.key] = [];
      renderList.value[menu.key].forEach((item) => {
        if (item.isActive) {
          queryDate[menu.key].push(item.id);
        }
      });
    }
  });
  let params = queryDate;
  params.id = detailData.value.id;
  modifyModel(params).then((res) => {
    if (res.status === 200) {
      getDetailData();
    }
  });
  isTagShow.value = false;
}

// 取消
function concelBtn() {
  isTagShow.value = false;
}
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
      });
    }
  });

  modelTags.value.forEach((item) => {
    menu.forEach((menuitem) => {
      if (menuitem == 'task') {
        renderList.value[menuitem].forEach((mit) => {
          mit.task_list.map((it) => {
            if (it.name == item.name) {
              it.isActive = true;
            }
          });
        });
      } else if (menuitem === 'status') {
        renderList.value[menuitem].forEach((it) => {
          if (detailData.value.status_name === it.name) {
            it.isActive = true;
          }
        });
      } else if (menuitem === 'sdk') {
        renderList.value[menuitem].forEach((it) => {
          if (detailData.value.sdk_name === it.name) {
            it.isActive = true;
          }
        });
      } else {
        renderList.value[menuitem].forEach((it) => {
          if (it.name == item.name) {
            it.isActive = true;
          }
        });
      }
    });
  });
});

function handleTabClick(item) {
  router.push(
    `/models/${route.params.user}/${route.params.name}/${
      tabTitle[Number(item.index)].path
    }`
  );
}

// 点赞
function digClick() {
  reopt.url = `/api/models/${detailData.value.id}/digg`;
  reopt.headers = { Authorization: 'Bearer ' + userInfoStore.token };
  getUserDig(reopt).then((res) => {
    if (res.data.status === 200) {
      getDetailData();
    }
  });
}

// 复制用户名
function copyText(textValue) {
  inputDom.value.value = textValue;
  inputDom.value.select();
  if (document.execCommand('Copy'))
    ElMessage({
      type: 'success',
      message: '复制成功',
      center: true,
    });
}
// 搜索进入页面更新
watch(
  () => {
    return route.params.name;
  },
  () => {
    if (route.name == 'modelCard') {
      getDetailData();
    }
  }
);
// tab切换高亮更新
watch(
  () => {
    return route.name;
  },
  () => {
    if (route.meta.index === 1) {
      activeName.value = 'tree';
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
</script>

<template>
  <div v-if="detailData && detailData.id" class="model-detail">
    <textarea ref="inputDom" class="input-dom"></textarea>
    <div class="card-head warp">
      <div class="card-head-top">
        <div class="portrait">
          <img :src="detailData.owner_name.avatar_url" alt="" />
        </div>
        <router-link :to="{ path: `/${route.params.user}` }">
          {{ detailData.owner_name.name }} </router-link
        >/
        <span>{{ detailData.name }}</span>
        <div
          class="card-head-copy"
          @click="copyText(`${detailData.owner_name.name}/${detailData.name}`)"
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
        <div
          v-if="detailData.is_owner"
          class="label-add-item"
          @click="addTagClick"
        >
          <o-icon><icon-plus></icon-plus></o-icon>
          添加标签
        </div>
      </div>
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane
          v-for="item in renderNav"
          :key="item.id"
          :label="item.label"
          :name="item.path"
        >
        </el-tab-pane>
      </el-tabs>
    </div>
    <div v-if="detailData.id" class="model-detail-body">
      <router-view class="warp" @on-click="getDetailData()"></router-view>
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
                      { 'condition-single': item.isSelected },
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
  </div>
  <!-- <NotFound v-else></NotFound> -->
</template>

<style lang="scss" scoped>
$theme: #0d8dff;
.input-dom {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
}
// :deep .el-dialog {
//   width: 800px;
//   min-height: 502px;
//   --el-dialog-margin-top: 24vh;
//   .el-dialog__body {
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     justify-content: center;
//     height: 472px;
//     padding-bottom: 60px;
//   }

//   img {
//     width: 56px;
//     height: 56px;
//   }
//   p {
//     font-size: 18px;
//     color: #555555;
//     line-height: 22px;
//     margin-top: 22px;
//   }
// }
.dialog-head {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  .head-left {
    width: 188px;
    display: flex;
    align-items: center;
    .head-title {
      margin-right: 16px;
      font-size: 18px;
      line-height: 24px;
    }
    .head-delete {
      font-size: 12px;
      line-height: 18px;
      margin-right: 52px;
      display: flex;

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
      margin: 0 16px 16px 0;
      height: 28px;
      font-size: 14px;
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
:deep .el-dialog {
  min-height: 664px;
}
.dialog-body {
  :deep .el-tabs__item {
    width: 188px;
    height: 56px;
    text-align: center;
    line-height: 56px;
    font-size: 18px;
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
  .condition-single {
    color: #ccc;
  }
  .body-right-container {
    padding-left: 24px;
    height: 428px;
    overflow-y: scroll;
    .noTask-box {
      display: flex;
    }
    .body-right {
      // margin-left: 24px;
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

.btn-box {
  display: flex;
  justify-content: center;
  margin-top: 48px;
}
.warp {
  margin: 0 auto;
  padding: 0 16px;
  max-width: 1440px;
}
.model-detail {
  .card-head-top {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    font-size: 24px;
    color: #555;
    .portrait {
      margin-right: 8px;
      width: 40px;
      height: 40px;
      background-color: #4d66ca;
      border-radius: 50%;
      border: 1px solid #b7ddff;
      overflow: hidden;
      img {
        width: 100%;
      }
    }
    a {
      color: inherit;
    }
    & > span:hover,
    & > a:hover {
      cursor: pointer;
      color: #0d8dff;
    }
  }
  .card-head-copy {
    cursor: pointer;
    display: flex;
    align-items: center;
    margin-left: 8px;
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
    .o-icon {
      font-size: 18px;
    }
    span {
      margin-left: 6px;
    }
  }
  .card-head {
    padding-top: 105px;
    .card-head-1 {
      display: flex;
      margin-bottom: 16px;
      .name {
        font-size: 24px;
        color: #555555;
        line-height: 27px;
      }
    }
    .label-box {
      display: flex;
      margin: 8px 0;
      font-size: 12px;
      flex-wrap: wrap;
      .label-item {
        cursor: pointer;
        padding: 3px 6px;
        margin-right: 8px;
        margin-bottom: 8px;
        font-size: 14px;
        color: #555;
        border: 1px solid #dbedff;
        background-color: #f3f9ff;
        border-radius: 8px;
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
