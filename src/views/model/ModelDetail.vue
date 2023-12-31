<script setup>
import { ref, reactive, computed, watch, nextTick } from 'vue';
import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router';

import IconX from '~icons/app/x';
import IconCopy from '~icons/app/copy-nickname';
import IconClear from '~icons/app/clear2';
import IconPlus from '~icons/app/plus';
import IconTag from '~icons/app/icon-tag';
import IconTime from '~icons/app/time';
import IconRight from '~icons/app/arrow-right2';
import IconUp from '~icons/app/up';

import TrainLikes from '@/components/train/TrainLikes.vue';
import OButton from '@/components/OButton.vue';
import OIcon from '@/components/OIcon.vue';

import protocol from '../../../config/protocol';
import { getTags, modifyTags } from '@/api/api-model';
import { getUserDig, cancelCollection } from '@/api/api-project';

import { getRepoDetailByName } from '@/api/api-gitlab';
import { useUserInfoStore, useFileData } from '@/stores';
import { goAuthorize } from '@/shared/login';
import { ElMessage } from 'element-plus';

const fileData = useFileData();
const userInfoStore = useUserInfoStore();

const isDigged = ref(false);
const router = useRouter();
const route = useRoute();
const headTags = ref([]);
const inputDom = ref();

const containerRef = ref(null);
const tagRef = ref(null);
const sumWidth = ref(0);
const containerWidth = ref(0);
const isWrap = ref(false);

const detailData = computed(() => {
  return useFileData().fileStoreData;
});

let isTagShow = ref(false);
const tabPosition = ref('left');

let renderList = ref([]);

let dialogList = {
  head: {
    title: '已选标签',
    delete: '清除全部',
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
    id: 'card',
    path: '',
    isPrivate: false,
  },
  {
    label: '文件',
    id: 'tree',
    path: 'tree',
    isPrivate: false,
  },
  {
    label: '设置',
    id: 'settings',
    path: 'settings',
    isPrivate: true,
  },
]);
const activeName = ref(tabTitle[route.meta.index].label);
const preStorage = ref();

function getRenderNav() {
  if (detailData.value.is_owner) {
    return tabTitle;
  } else {
    if (detailData.value.repo_type === 'online') {
      return [...tabTitle].splice(0, 1);
    } else if (detailData.value.repo_type === 'public') {
      return [...tabTitle].splice(0, 2);
    }
  }
}
// 渲染的nav数据 (区分访客和用户)
const renderNav = computed(() => {
  return getRenderNav();
});

// 离开详情页清除 pinia数据
onBeforeRouteLeave(() => {
  fileData.$reset();
});

function getTagList() {
  getTags('model').then((res) => {
    renderList.value = res.data;
    dialogList.menuList = res.data.map((item, index) => {
      return { tab: item.domain, key: index };
    });
    let menu = dialogList.menuList.map((item) => item.key);
    menu.forEach((key) => {
      renderList.value[key].items.forEach((item) => {
        item.items = item.items.map((it) => {
          return {
            name: it,
            isActive: false,
          };
        });
      });
    });
    headTags.value.forEach((item) => {
      menu.forEach((menuitem) => {
        renderList.value[menuitem].items.forEach((mit) => {
          mit.items.forEach((it) => {
            if (it.name === item.name) it.isActive = true;
          });
        });
      });
    });
  });
}

let modelTags = ref([]);
// 模型详情数据
function getDetailData() {
  getRepoDetailByName({
    user: route.params.user,
    repoName: route.params.name,
    modular: 'model',
  })
    .then((res) => {
      let storeData = res.data;
      // 判断仓库是否属于自己
      storeData['is_owner'] = userInfoStore.userName === storeData.owner;
      // 文件列表是否为空
      if (detailData.value) {
        storeData['is_empty'] = detailData.value.is_empty;
      }
      fileData.setFileData(storeData);
      const { tags } = detailData.value;
      isDigged.value = detailData.value.liked;

      modelTags.value = [];
      headTags.value = [];
      if (tags) {
        tags.forEach((item) => {
          modelTags.value.push({ name: item });
        });
        headTags.value = modelTags.value.filter((item) => {
          let a = protocol.map((it) => {
            if (it.name === item.name) {
              return false;
            }
            return true;
          });
          if (!a.indexOf(false)) return false;
          else return true;
        });
      }
      preStorage.value = JSON.stringify(headTags.value);
      // 处理框架标签
      const mindspore = [];
      modelTags.value.forEach((element, index) => {
        if (/^MindSpore/.test(element.name)) {
          mindspore.push(modelTags.value.splice(index, 1, 1)[0]);
        }
      });
      mindspore.forEach((item, index) => {
        mindspore[index] = item.name.substring(9);
        mindspore[index] = Number(mindspore[index]);
      });
      mindspore.sort();
      if (mindspore.length) {
        modelTags.value.push({ name: 'MindSpore' + mindspore.join(', ') });
      }
      modelTags.value = modelTags.value.filter((item) => {
        return item !== 1;
      });

      getTagList();
    })
    .catch(() => {
      router.push('/404');
    });
}
getDetailData();

function tagClick(it, key) {
  if (key === 'task' || key === 'licenses') {
    if (it.isActive) {
      it.isActive = false;
      renderList.value[key].forEach((item) => {
        item.isSelected = false;
      });
      headTags.value.forEach((item, index) => {
        if (item.name === it.name) {
          headTags.value.splice(index, 1);
        }
      });
    } else {
      renderList.value[key].forEach((item) => {
        if (item.isActive === true) {
          headTags.value.forEach((tag, index) => {
            if (item.name === tag.name) {
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
        if (item.name === it.name) {
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
    renderList.value[key].items.forEach((item) => {
      item.items.forEach((it) => {
        if (it.name === tag.name) {
          it.isActive = false;
        }
      });
    });
  });
}

// 编辑标签头部标签删除
function deleteModelTags() {
  headTags.value = [];
  let menu = dialogList.menuList.map((item) => item.key);

  menu.forEach((menuitem) => {
    renderList.value[menuitem].items.forEach((it) => {
      it.items.forEach((item) => {
        item.isActive = false;
      });
    });
  });
}

// 确认
function confirmBtn() {
  headTags.value = headTags.value.map((item) => {
    return item.name;
  });
  preStorage.value = JSON.parse(preStorage.value);

  preStorage.value = preStorage.value.map((item) => {
    return item.name;
  });

  let add = [];
  let remove = [];
  preStorage.value.forEach((item) => {
    if (headTags.value.indexOf(item) === -1) {
      remove.push(item);
    }
  });
  headTags.value.forEach((item) => {
    if (preStorage.value.indexOf(item) === -1) {
      add.push(item);
    }
  });
  modifyTags({ add, remove }, userInfoStore.userName, detailData.value.id).then(
    () => {
      getDetailData();
    }
  );
  isTagShow.value = false;

  if (detailData.value?.id) {
    nextTick(() => {
      tagRef.value.forEach((item) => {
        sumWidth.value += item.offsetWidth + 4;
      });
      containerWidth.value = containerRef.value.offsetWidth;

      isWrap.value = sumWidth.value - containerWidth.value > 1 ? true : false;

      sumWidth.value = 0;
    });
  }
}

// 取消
function cancelBtn() {
  isTagShow.value = false;
}

function handleTabClick(item) {
  router.push(
    `/models/${route.params.user}/${route.params.name}/${
      tabTitle[Number(item.index)].path
    }`
  );
}

function handleModelLike() {
  let params = {
    name: detailData.value.name,
    owner: detailData.value.owner,
    resource_type: 'model',
  };
  if (!userInfoStore.id) {
    // 如未登录
    goAuthorize();
  } else {
    if (!isDigged.value) {
      // 点赞(收藏)
      getUserDig(params)
        .then((res) => {
          if (res.status === 201) {
            getDetailData();
          }
        })
        .catch((err) => {
          throw err;
        });
    } else {
      // 取消收藏
      cancelCollection(params)
        .then((res) => {
          if (res.status === 204) {
            getDetailData();
          }
        })
        .catch((err) => {
          throw err;
        });
    }
  }
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
    if (route.name === 'modelCard') {
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
    if (Object.prototype.hasOwnProperty.call(route.meta, 'index')) {
      activeName.value = tabTitle[route.meta.index].label;
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
const isExpand = ref(false);

function checkAllTags(val) {
  isExpand.value = val;
}
function retractAlltags(val) {
  isExpand.value = val;
}
watch(
  () => detailData.value,
  () => {
    if (detailData.value?.id) {
      nextTick(() => {
        tagRef.value.forEach((item) => {
          sumWidth.value += item.offsetWidth + 4;
        });
        containerWidth.value = containerRef.value.offsetWidth;

        isWrap.value = sumWidth.value - containerWidth.value > 1 ? true : false;

        sumWidth.value = 0;
      });
    }
  }
);
</script>

<template>
  <div v-if="detailData?.id" class="model-detail">
    <textarea ref="inputDom" class="input-dom"></textarea>
    <div class="card-head">
      <div class="card-head-content">
        <div class="card-head-info wrap">
          <div class="head-info-title">
            <p v-if="detailData.title">{{ detailData.title }}</p>
            <p v-else>{{ detailData.name }}</p>
            <train-likes
              v-if="userInfoStore.userName !== detailData.owner"
              :is-digged="isDigged"
              :dig-count="detailData.like_count"
              class="loves"
              @click="handleModelLike"
            ></train-likes>
          </div>
        </div>

        <div v-if="detailData.desc" class="head-info-desc wrap">
          <p>{{ detailData.desc }}</p>
        </div>

        <div class="card-head-top wrap">
          <div class="head-top-left">
            <div class="portrait">
              <img :src="detailData.avatar_id" alt="" />
            </div>

            <router-link :to="{ path: `/${route.params.user}` }">
              {{ detailData.owner }} </router-link
            >/
            <span class="name">{{ detailData.name }}</span>
            <div
              class="card-head-copy"
              @click="copyText(`${detailData.owner}/${detailData.name}`)"
            >
              <o-icon><icon-copy></icon-copy></o-icon>
            </div>
          </div>

          <div class="card-head-time">
            <o-icon>
              <icon-time> </icon-time>
            </o-icon>
            <p>{{ detailData.updated_at.replaceAll('-', '.') }}</p>
          </div>

          <div class="label-box">
            <p class="tag-icon">
              <o-icon>
                <icon-tag></icon-tag>
              </o-icon>
            </p>
            <div
              v-if="detailData.is_owner"
              class="label-add-item"
              @click="addTagClick"
            >
              <o-icon><icon-plus></icon-plus></o-icon>
              添加标签
            </div>
            <div
              ref="containerRef"
              class="label-box-left"
              :class="isExpand ? 'tags-expand' : 'tags-retract'"
            >
              <div
                v-for="(label, index) in modelTags"
                :key="index"
                ref="tagRef"
                class="label-item"
              >
                {{ label.name === 'electricity' ? '电力' : label.name }}
              </div>

              <template v-if="isWrap">
                <div
                  v-if="!isExpand"
                  class="check-tags"
                  @click="checkAllTags(true)"
                >
                  查看全部
                  <o-icon><icon-right></icon-right></o-icon>
                </div>

                <div v-else class="retract-tags" @click="retractAlltags(false)">
                  收起
                  <o-icon><icon-up></icon-up></o-icon>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>

      <div class="card-head-tabs">
        <el-tabs v-model="activeName" class="wrap" @tab-click="handleTabClick">
          <el-tab-pane
            v-for="item in renderNav"
            :key="item.id"
            :label="item.label"
            :name="item.label"
          >
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <div v-if="detailData.id" class="model-detail-body">
      <router-view class="wrap" @on-click="getDetailData()"></router-view>
    </div>
    <!-- 标签管理 -->
    <div class="tags-box">
      <el-dialog
        v-model="isTagShow"
        width="800px"
        align-center
        :show-close="false"
        destroy-on-close
      >
        <template #header="{ titleId, title }">
          <div :id="titleId" :class="title">
            <div class="dialog-head">
              <div class="dialog-head-top">
                <div class="head-title">{{ dialogList.head.title }}</div>
                <div class="head-delete" @click="deleteModelTags">
                  <o-icon><icon-clear></icon-clear></o-icon>
                  {{ dialogList.head.delete }}
                </div>
              </div>

              <div class="head-tags">
                <div
                  v-for="it in headTags"
                  :key="it"
                  class="dlg-condition-detail"
                >
                  {{ it.name === 'electricity' ? '电力' : it.name }}
                  <o-icon class="icon-x" @click="deleteClick(it)"
                    ><icon-x></icon-x
                  ></o-icon>
                </div>
              </div>
            </div>
          </div>
        </template>
        <div class="dialog-body">
          <el-tabs :tab-position="tabPosition" style="height: 100%">
            <el-tab-pane
              v-for="menu in dialogList.menuList"
              :key="menu.key"
              :label="menu.tab"
            >
              <div class="body-right-container">
                <div
                  v-for="item in renderList[menu.key].items"
                  :key="item"
                  class="detail-box"
                >
                  <div>
                    <p class="tan-title">
                      {{ item.kind }}
                    </p>
                    <div class="tag-box">
                      <div
                        v-for="it in item.items"
                        :key="it.id"
                        class="condition-detail"
                        :class="{ 'condition-active': it.isActive }"
                        @click="tagClick(it, menu.key)"
                      >
                        {{ it.name === 'electricity' ? '电力' : it.name }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
        <template #footer>
          <div class="btn-box" style="display: flex; justify-content: center">
            <o-button style="margin-right: 16px" @click="cancelBtn"
              >取消</o-button
            >
            <o-button type="primary" @click="confirmBtn">确定</o-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$theme: #0d8dff;
.input-dom {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
}
.tags-box {
  :deep(.el-dialog) {
    .el-dialog__header {
      justify-content: flex-start;
      padding-bottom: 16px;
    }
  }
  .dialog-head {
    display: flex;
    flex-direction: column;
    .dialog-head-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 10px;
      .head-title {
        margin-right: 16px;
        font-size: 18px;
        line-height: 24px;
        min-width: 72px;
      }
      .head-delete {
        font-size: 12px;
        line-height: 18px;
        color: #555;
        display: flex;
        align-items: center;
        cursor: pointer;
        .o-icon {
          font-size: 16px;
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
      margin-top: 6px;
      .dlg-condition-detail {
        cursor: pointer;
        display: flex;
        align-items: center;
        padding: 0px 10px 0 12px;
        margin: 10px 16px 0 0;
        height: 24px;
        font-size: 14px;
        color: $theme;
        user-select: none;
        background-color: #f3f9ff;
        border-radius: 14px;
        border: 1px solid #e5e5e5;
        .icon-x {
          padding: 2px;
          font-size: 20px;
        }
      }
      .condition-active {
        color: $theme;
      }
    }
  }
  .dialog-body {
    border-top: 1px solid #d8d8d8;
    :deep(.el-tabs__item) {
      width: 188px;
      height: 56px;
      text-align: left;
      line-height: 56px;
      font-size: 18px;
      padding-left: 24px;
    }
    :deep(.el-tabs__content) {
      text-align: left;
    }
    :deep(.el-tabs .el-tabs__header) {
      box-shadow: none;
      min-height: 320px;
      background: #f7f8fa;
    }
    :deep(.el-tabs__nav) {
      background: #f7f8fa;
    }

    .el-tabs--left,
    .el-tabs--right {
      border-bottom: 1px solid #d8d8d8;
    }
    :deep .el-tabs__item.is-active {
      background: #fff;
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
      border-radius: 14px;
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
      height: 320px;
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

.wrap {
  margin: 0 auto;
  padding: 0 16px;
  max-width: 1448px;
}
.model-detail {
  background-color: #fff;
  .card-head-top {
    display: flex;
    align-items: flex-start;
    margin-top: 24px;
    font-size: 14px;
    line-height: 22px;
    color: #000;
    .head-top-left {
      align-self: flex-start;
      align-items: center;
      display: flex;
      line-height: 20px;
      height: 20px;
    }
    .portrait {
      margin-right: 8px;
      width: 20px;
      min-width: 20px;
      height: 20px;
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
    .name {
      white-space: nowrap;
    }
  }
  .card-head-copy {
    cursor: pointer;
    display: flex;
    align-items: center;
    margin-left: 8px;
    margin-right: 24px;
    .o-icon {
      font-size: 20px;
      color: #555;
    }
    .o-icon:hover {
      color: #0d8dff;
    }
  }
  .loves {
    cursor: pointer;
    margin-left: 40px;
    font-size: 14px;
    line-height: 18px;
    .o-icon {
      font-size: 18px;
    }
    span {
      margin-left: 6px;
    }
  }
  .card-head {
    // padding-top: 80px;
    .card-head-1 {
      display: flex;
      margin-bottom: 16px;
      .name {
        font-size: 24px;
        color: #555555;
        line-height: 27px;
      }
    }

    .card-head-time {
      align-self: flex-start;
      display: flex;
      align-items: center;
      height: 20px;
      margin-right: 24px;
      p {
        color: #555;
      }
      .o-icon {
        margin-right: 8px;
        svg {
          color: #555;
          font-size: 20px;
        }
      }
    }
    .tag-icon {
      align-self: flex-start;
      margin-right: 8px;
      display: flex;
      align-items: center;
      .o-icon {
        font-size: 20px;
      }
    }
    .handle-overlength {
      margin-right: 50px !important;
    }
    .tags-retract {
      height: 20px;
      overflow-y: hidden;
      padding-right: 92px;
    }
    .tags-expand {
      height: auto;
      overflow: unset;
      padding-right: 64px;
    }
    .label-box {
      display: flex;
      font-size: 12px;
      flex-wrap: nowrap;
      .label-box-left {
        display: flex;
        flex-wrap: wrap;
        position: relative;
        .check-tags,
        .retract-tags {
          position: absolute;
          right: 0;
          bottom: 0px;
          font-size: 14px;
          color: #555555;
          line-height: 18px;
          padding: 2px 4px;
          color: #0d8dff;
          cursor: pointer;
          .o-icon {
            font-size: 16px;
          }
        }
        .retract-tags {
          bottom: 14px;
        }
      }
    }
    .label-item {
      display: flex;
      align-items: center;
      height: 20px;
      margin-right: 4px;
      margin-bottom: 8px;
      padding: 0px 12px;
      font-size: 12px;
      color: #555;
      border: 1px solid #dbedff;
      background-color: #f3f9ff;
      border-radius: 14px;
      white-space: nowrap;
    }
    .label-add-item {
      display: flex;
      align-items: center;
      height: 20px;
      padding: 2px 8px 2px 4px;
      background: rgba(13, 141, 255, 0.15);
      border-radius: 14px;
      color: #0d8dff;
      border: 1px dashed #0d8dff;
      white-space: nowrap;
      margin-right: 4px;
      cursor: pointer;
      .o-icon {
        margin-right: 4px;
      }
    }
  }
  .card-head-tabs {
    box-shadow: 0px 1px 3px 0px rgba(190, 196, 204, 0.2);
    background: rgba(251, 251, 251, 0.85);
  }
  .card-head-content {
    padding: 108px 0 24px 0;
    background-image: url('@/assets/imgs/model-detail-banner.png');
    background-size: cover;
    background-repeat: no-repeat;
  }
  .card-head-info {
    display: flex;
    justify-content: space-between;
  }
  .head-info-title {
    flex: 1;
    font-size: 24px;
    color: #555555;
    line-height: 38px;
    display: flex;
    justify-content: space-between;
    p {
      max-width: 1128px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .head-info-desc {
    font-size: 14px;
    font-weight: 400;
    color: #555555;
    line-height: 22px;
    margin-top: 10px;
    p {
      max-width: 1128px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .model-detail-body {
    min-height: calc(100vh - 455px);
    background-color: #f5f6f8;
    padding: 40px 0 64px;
  }
}
:deep(.el-tabs) {
  .el-tabs__header {
    background-color: #ffffff;
    margin-bottom: 0;
    background: rgba(251, 251, 251, 0.85);
  }

  .el-tabs__item {
    height: 48px;
    font-size: 16px;
    color: #555555;
    font-weight: normal;
    line-height: 48px;

    &:hover {
      color: #0d8dff;
    }

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
