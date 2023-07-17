<script setup>
import { ref, reactive, computed, watch, nextTick } from 'vue';
import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router';

import IconX from '~icons/app/x';
import IconClear from '~icons/app/clear2';
import IconCopy from '~icons/app/copy-nickname';
import IconPlus from '~icons/app/plus';
import IconFork from '~icons/app/fork';
import IconTag from '~icons/app/icon-tag';
import IconTime from '~icons/app/time';
import IconRight from '~icons/app/arrow-right2';

import OButton from '@/components/OButton.vue';
import OIcon from '@/components/OIcon.vue';
import TrainLikes from '@/components/train/TrainLikes.vue';
import OPopper from '@/components/OPopper.vue';

import { useUserInfoStore, useFileData, useLoginStore } from '@/stores';

import protocol from '@/shared/config/protocol';
import { trainSdk, inferSdk } from '@/shared/config/protocol';

import {
  modifyTags,
  getTags,
  getUserDig,
  cancelCollection,
  projectFork,
  checkNames,
} from '@/api/api-project';
import { checkEmail } from '@/api/api-user';

import { getRepoDetailByName } from '@/api/api-gitlab';
import { goAuthorize } from '@/shared/login';
import { ElMessage } from 'element-plus';

onBeforeRouteLeave(() => {
  fileData.$reset();
});
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
const inputDom = ref();
const forkShow = ref(false);
const loadingShow = ref(false);
const renderList = ref([]);
const isShow = ref();
const isTagShow = ref(false);
const tabPosition = ref('left');

let dialogList = {
  head: {
    title: '已选标签',
    delete: '清除全部',
  },
  tags: [],

  menuList: [
    { tab: '应用分类', key: '0' },
    // { tab: '项目类型', key: 'infer_sdk' },
    { tab: '训练平台', key: '1' },
    // { tab: '协议', key: 'licenses' },
    { tab: '其他', key: '2' },
  ],
};

let tabTitle = reactive([
  {
    label: '推理',
    id: 0,
    path: '',
    isPrivate: false,
    isOnline: '',
  },
  {
    label: '训练',
    id: 1,
    path: 'train',
    isPrivate: false,
    isOnline: '',
  },
  {
    label: '文件',
    id: 2,
    path: 'tree',
    isPrivate: false,
    isOnline: 'online',
  },
  {
    label: '设置',
    id: 3,
    path: 'settings',
    isPrivate: true,
    isOnline: '',
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

const activeName = ref(tabTitle[route.meta.index].label);
if (route.meta.index === 1) {
  activeName.value = 'train';
}
// 渲染的nav数据 (区分访客和用户)
const renderNav = computed(() => {
  return detailData.value.is_owner
    ? tabTitle
    : tabTitle.filter((item) => {
        return !item.isPrivate && item.isOnline !== detailData.value.repo_type;
      });
});

// 训练选项
const trainSelect = reactive([
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
]);

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
      pattern: /^[^\u4e00-\u9fa5]/g,
      message: '暂不支持中文字符',
      trigger: 'blur',
    },
    {
      pattern: /^[^\u4e00-\u9fa5]{3,35}$/g,
      message: '长度为3-35个字符',
      trigger: 'blur',
    },
    {
      pattern: /^[^\*/?\\<>|:;]*$/g,
      message: '不能含有:/\\*;?<>|等特殊字符',
      trigger: 'blur',
    },
    {
      pattern: /^[^.].*[^.]$/,
      message: '不能以.开头或结尾',
      trigger: 'blur',
    },
    {
      pattern: /^(?!.*(-)\1+).*$/,
      message: '不能连续两个及以上中划线',
      trigger: 'blur',
    },
    { validator: checkName, trigger: 'change' },
  ],
  describe: [{ min: 1, max: 100, message: '内容不能为空', trigger: 'blur' }],
});

const forkForm = reactive({
  owner: null,
  storeName: null,
  describe: null,
  projectName: null,
});
const ownerName = ref([]);
ownerName.value.push(userInfoStore.userName);

// 项目详情数据
function getDetailData() {
  try {
    getRepoDetailByName({
      user: route.params.user,
      repoName: route.params.name,
      modular: 'project',
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

        isShow.value = userInfoStore.userName === storeData.owner;
        forkForm.storeName = detailData.value.name;
        forkForm.owner = userInfoStore.userName;

        if (detailData.value.type !== 'Gradio') {
          tabTitle[0].label = '项目卡片';
          activeName.value = '项目卡片';
        }
        isDigged.value = detailData.value.liked;
        const { tags } = detailData.value;
        modelTags.value = [];
        headTags.value = [];
        if (tags) {
          tags.forEach((item) => {
            modelTags.value.push({ name: item });
          });
        }
        modelTags.value = modelTags.value.map((item) => {
          return item;
        });
        if (tags) {
          tags.forEach((item) => {
            headTags.value.push({ name: item });
          });
        }
        headTags.value = headTags.value.filter((item) => {
          const protocolData = protocol.some((it) => it.name === item.name);
          const trainSdkData = trainSdk.some((it) => it.name === item.name);
          const inferSdkData = inferSdk.some((it) => it.name === item.name);
          return !(protocolData || trainSdkData || inferSdkData);
        });
        preStorage.value = JSON.stringify(headTags.value);
        getAllTags();
      })
      .catch((error) => {
        ElMessage({
          type: 'error',
          message: error,
          center: true,
        });
        router.push('/404');
      });
  } catch (error) {
    ElMessage({
      type: 'error',
      message: 'error',
    });
  }
}
const preStorage = ref();
getDetailData();

function handleTabClick(item) {
  if (item.index === '1' && userInfoStore.userName === detailData.value.owner) {
    return;
  }
  router.push(
    `/projects/${route.params.user}/${route.params.name}/${
      tabTitle[Number(item.index)].path
    }`
  );
}

// 点击标签
function tagClick(it, key, index) {
  if (key === '应用分类') {
    renderList.value.forEach((a) => {
      if (a.domain === key) {
        if (it.isActive) {
          it.isActive = false;
          a.items[index].items.forEach((item) => {
            item.isSelected = false;
          });
          headTags.value.forEach((item, index) => {
            if (item.name === it.name) {
              headTags.value.splice(index, 1);
            }
          });
        } else {
          a.items[index].items.forEach((item) => {
            if (item.isActive) {
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
      }
    });
  } else {
    it.isActive = !it.isActive;
    if (it.isActive) {
      if (!headTags.value[0]) headTags.value[0] = it;
      else headTags.value.push(it);
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

// 点赞，取消点赞
function handleProjectLike() {
  let params = {
    name: detailData.value.name,
    owner: detailData.value.owner,
    resource_type: 'project',
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
// 编辑标签头部标签删除全部已添加标签
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
    if (item) return item.name;
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

      isWrap.value = sumWidth.value - containerWidth.value > 28 ? true : false;
      sumWidth.value = 0;
    });
  }
}

// 取消
function cancelBtn() {
  isTagShow.value = false;
}

function getAllTags() {
  getTags('project').then((res) => {
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
    // 已添加标签高亮
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
  ruleFormRef.value.validate(async (valid) => {
    if (valid) {
      forkShow.value = false;
      let params = {};
      params.name = forkForm.storeName;
      params.desc = forkForm.describe;
      forkShow.value = false;
      projectFork(detailData.value.owner, detailData.value.id, params)
        .then(() => {
          loadingShow.value = false;
          fileData.$reset();
          router.push(
            `/projects/${userInfoStore.userName}/${forkForm.storeName}`
          );
        })
        .catch(() => {
          ElMessage({
            type: 'error',
            message: '暂不能fork该项目',
            center: true,
          });
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

const nameList = ref([]);
nameList.value.push(userInfoStore.userName);
forkForm.owner = nameList.value[0];

function forkClick() {
  if (!userInfoStore.id) {
    // 如未登录
    goAuthorize();
  } else {
    checkEmail().then(() => {
      forkShow.value = true;
      nextTick(() => {
        document.querySelector('.el-input__inner').focus();
      });
    });
  }
}

watch(
  () => {
    return [route.params.name, router.currentRoute];
  },
  () => {
    if (route.name === 'projectCard') {
      getDetailData();
    } else if (
      router.currentRoute.value.path ===
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
    if (Object.prototype.hasOwnProperty.call(route.meta, 'index')) {
      if (route.meta.index === 1) {
        activeName.value = 'train';
      } else {
        activeName.value = tabTitle[route.meta.index].label;
      }
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

let time = null;
function checkName(rule, value, callback) {
  if (time !== null) {
    clearTimeout(time);
  }
  time = setTimeout(() => {
    checkNames({ name: value, owner: userInfoStore.userName }).then((res) => {
      if (res.data.can_apply) {
        callback();
      } else {
        callback(new Error('该名称已存在'));
      }
    });
  }, 500);
}

// 开启Jupyter
function openJupyter() {
  router.push(
    `/projects/${userInfoStore.userName}/${detailData.value.name}/clouddev`
  );
}

const containerRef = ref(null);
const tagRef = ref(null);
const sumWidth = ref(0);
const containerWidth = ref(0);
const isWrap = ref(false);

watch(
  () => detailData.value,
  () => {
    if (detailData.value?.id) {
      nextTick(() => {
        tagRef.value.forEach((item) => {
          sumWidth.value += item.offsetWidth + 4;
        });
        containerWidth.value = containerRef.value.offsetWidth;
        isWrap.value =
          sumWidth.value - containerWidth.value > 28 ? true : false;
        sumWidth.value = 0;
      });
    }
  }
);
</script>

<template>
  <div v-if="detailData && detailData.id" class="model-detail">
    <textarea ref="inputDom" class="input-dom"></textarea>
    <div class="card-head">
      <div class="head-top">
        <div class="head-wrap">
          <div class="card-head-info">
            <p class="head-info-desc">
              {{ detailData.title ? detailData.title : detailData.name }}
            </p>
            <div class="project-handle">
              <div class="head-info-likes">
                <train-likes
                  v-if="userInfoStore.userName !== detailData.owner"
                  :is-digged="isDigged"
                  :dig-count="detailData.like_count"
                  class="loves"
                  @click="handleProjectLike"
                ></train-likes>
              </div>
              <div class="fork-btn">
                <o-button
                  v-if="
                    userInfoStore.userName !== detailData.owner &&
                    detailData.repo_type === 'public'
                  "
                  size="small"
                  @click="forkClick"
                >
                  <div class="fork-icon">
                    <o-icon><icon-fork></icon-fork></o-icon> Fork
                  </div>
                </o-button>
              </div>
              <div
                v-if="
                  loginStore.isLogined &&
                  userInfoStore.userName === detailData.owner
                "
                class="jupyter-btn"
              >
                <o-button type="primary" @click="openJupyter">
                  打开Jupyter
                </o-button>
              </div>
            </div>
          </div>
          <div class="card-desc">
            {{ detailData.desc }}
          </div>
          <div class="card-detail">
            <div class="detail-left">
              <div class="avatar">
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
              <div class="card-head-time">
                <o-icon>
                  <icon-time> </icon-time>
                </o-icon>
                <p>{{ detailData.updated_at.replace(/-/g, '.') }}</p>
              </div>
            </div>
            <div class="label-box">
              <p class="tag-icon">
                <o-icon>
                  <icon-tag></icon-tag>
                </o-icon>
              </p>
              <div v-if="isShow" class="label-add-item" @click="addTagClick">
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

                  <div
                    v-else
                    class="retract-tags"
                    @click="retractAlltags(false)"
                  >
                    收起
                    <o-icon><icon-right></icon-right></o-icon>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="head-tabs">
        <el-tabs v-model="activeName" class="wrap" @tab-click="handleTabClick">
          <template v-for="item in renderNav">
            <el-tab-pane
              v-if="item.label !== '训练'"
              :key="item.id"
              :label="item.label"
              :name="item.label"
            >
            </el-tab-pane>
            <el-tab-pane
              v-else
              :key="item.label"
              class="center-tab-pane"
              :name="item.path"
              :disabled="userInfoStore.userName === detailData.owner"
            >
              <template #label>
                <el-dropdown placement="bottom" popper-class="nav">
                  <p>训练</p>
                  <template
                    v-if="userInfoStore.userName === detailData.owner"
                    #dropdown
                  >
                    <el-dropdown-menu>
                      <el-dropdown-item
                        v-for="menu in trainSelect"
                        :key="menu.id"
                      >
                        <router-link
                          :to="{
                            path: `/projects/${route.params.user}/${route.params.name}/${menu.path}`,
                          }"
                          >{{ menu.label }}</router-link
                        >
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
    <div v-if="detailData?.id" class="model-detail-body">
      <router-view
        class="wrap"
        :detail-data="detailData"
        @on-click="getDetailData()"
      ></router-view>
    </div>
    <!-- 标签管理 -->
    <div class="tags-box">
      <el-dialog
        v-model="isTagShow"
        width="800px"
        :show-close="false"
        align-center
        destroy-on-close
      >
        <template #header="{ titleId, title }">
          <div :id="titleId" :class="title" style="width: 100%">
            <div class="dialog-head">
              <div class="head-left">
                <div class="head-title">{{ dialogList.head.title }}</div>
                <div class="head-delete" @click="deleteModelTags">
                  <o-icon><icon-clear></icon-clear></o-icon>
                  {{ dialogList.head.delete }}
                </div>
              </div>
              <div v-if="headTags[0]" class="head-tags">
                <div v-for="it in headTags" :key="it" class="condition-detail">
                  {{ it.name === 'electricity' ? '电力' : it.name }}
                  <o-icon class="icon-x" @click="deleteClick(it)">
                    <icon-x></icon-x>
                  </o-icon>
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
                <div class="body-right">
                  <div
                    v-for="(item, index) in renderList[menu.key].items"
                    :key="item"
                    class="detail-box"
                  >
                    <div>
                      <p class="tan-title">
                        {{ item.kind }}
                      </p>
                      <div v-if="menu.tab === '应用分类'" class="noTask-box">
                        <div
                          v-for="it in item.items"
                          :key="it"
                          class="condition-detail"
                          :class="[
                            { 'condition-active': it.isActive },
                            { 'condition-active1': it.isSelected },
                          ]"
                          @click="tagClick(it, menu.tab, index)"
                        >
                          {{ it.name }}
                        </div>
                      </div>
                      <div v-else class="tag-box">
                        <div
                          v-for="it in item.items"
                          :key="it"
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
    <!-- Fork -->
    <div class="fork-dialog">
      <el-dialog
        v-model="forkShow"
        width="640px"
        title="创建Fork"
        :show-close="false"
        destroy-on-close
        center
        align-center
      >
        <template #header="{ titleId, title }">
          <div :id="titleId" :class="title">
            <div class="fork-title">创建Fork</div>
            <div class="fork-intro">
              允许用户使用自定义数据集和模型进行实践而不会对原有的项目做改动
            </div>
          </div>
        </template>
        <el-form
          ref="ruleFormRef"
          :model="forkForm"
          :rules="rules"
          :label-position="tabPosition"
          hide-required-asterisk
        >
          <el-form-item label="拥有者" prop="owner">
            <el-select v-model="forkForm.owner">
              <el-option v-for="item in nameList" :key="item" :value="item">
                {{ item }}
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="仓库名称" class="store-name" prop="storeName">
            <el-input
              v-model="forkForm.storeName"
              placeholder="请输入仓库名称"
            ></el-input>
            <o-popper></o-popper>
          </el-form-item>
          <el-form-item
            label="项目名称"
            class="project-name"
            prop="projectName"
          >
            <el-input
              v-model="forkForm.projectName"
              placeholder="请输入项目中文名称"
            ></el-input>
            <!-- <o-popper></o-popper> -->
          </el-form-item>
          <el-form-item label="描述" prop="describe" class="fork-desc">
            <el-input
              v-model="forkForm.describe"
              type="textarea"
              placeholder="请输入内容"
              maxlength="100"
              show-word-limit
            ></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <div
            class="dlg-actions"
            style="display: flex; justify-content: center"
          >
            <o-button style="margin-right: 16px" @click="forkShow = false"
              >取消</o-button
            >
            <o-button type="primary" @click="forkCreateClick">确定</o-button>
          </div>
        </template>
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
    // width: 800px;
    // min-height: 502px;
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
    .el-dialog__header {
      .fork-title {
        line-height: 32px;
        font-size: 24px;
        font-weight: normal;
        color: #000000;
        margin-bottom: 16px;
      }
      .fork-intro {
        line-height: 22px;
        font-size: 14px;
        font-weight: normal;
        color: #999999;
      }
    }
    .el-form {
      display: flex;
      flex-direction: column;
      // align-items: center;
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
          right: 15px;
          top: 6px;
        }
      }
      .el-form-item {
        margin-bottom: 24px;
        display: flex;
        align-items: center;
      }
      .fork-desc {
        margin-bottom: 0px;
      }
      .o-button {
        margin: 24px 38px 0 0;
      }
    }

    .el-form--label-left .el-form-item__label {
      width: 90px;
      font-size: 14px;
      margin-right: 18px;
    }
  }
}
.tags-box {
  :deep(.el-dialog) {
    .el-dialog__header {
      justify-content: flex-start;
    }
    .el-dialog__body {
      text-align: left;
    }
  }
  .dialog-head {
    display: flex;
    flex-direction: column;
    .head-left {
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
        display: flex;
        align-items: center;
        cursor: pointer;
        .o-icon {
          margin-right: 6px;
          align-self: center;
          font-size: 16px;
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
      .condition-detail {
        cursor: pointer;
        display: flex;
        align-items: center;
        padding: 0 12px;
        margin: 10px 16px 0 0;
        height: 28px;
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
    }
  }
  .dialog-body {
    border-top: 1px solid #d8d8d8;
    :deep .el-tabs__item {
      width: 188px;
      height: 56px;
      text-align: left;
      line-height: 56px;
      font-size: 18px;
      padding-left: 24px;
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
      border-radius: 14px;
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

.wrap {
  margin: 0 auto;
  padding: 0 16px;
  max-width: 1448px;
}
.input-dom {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
}
.model-detail {
  background-color: #fff;
  .card-head {
    padding-top: 80px;
    background-image: url('@/assets/imgs/model-detail-banner.png');
    background-size: cover;
    background-repeat: no-repeat;
    .head-top {
      padding: 24px 0;
      .head-wrap {
        margin: 0 auto;
        padding: 0 16px;
        max-width: 1448px;
        .card-head-info {
          display: flex;
          justify-content: space-between;
          .head-info-desc {
            flex: 1;
            font-size: 24px;
            color: #555555;
            line-height: 38px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .project-handle {
            display: flex;
            align-items: center;
            .head-info-likes {
              margin-right: 8px;
            }
            .fork-btn {
              font-size: 14px;
              .o-button {
                min-width: 82px;
                max-height: 32px;
                padding: 10px 16px !important;
                display: flex;
                align-items: center;
              }
              .fork-icon {
                font-size: 14px;
                display: flex;
                align-items: center;
                .o-icon {
                  font-size: 16px;
                  margin-right: 8px;
                }
              }
            }
            .jupyter-btn {
              .o-button {
                height: 36px;
                font-size: 14px;
                padding: 6px 16px !important;
              }
            }
          }
        }
        .card-desc {
          max-width: 80%;
          margin: 10px 0 25px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 14px;
          color: #555;
        }
        .card-detail {
          display: flex;
          align-items: center;
          align-items: flex-start;
          .detail-left {
            display: flex;
            align-items: center;
            font-size: 14px;
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
              width: 20px;
              height: 20px;
              border-radius: 50%;
              margin-right: 8px;
              background-color: #3d8df7;
            }
            .name {
              white-space: nowrap;
            }
            .card-head-copy {
              cursor: pointer;
              display: flex;
              align-items: center;
              margin-left: 8px;
              font-size: 16px;
              .o-icon:hover {
                color: #0d8dff;
              }
            }
            .card-head-time {
              align-self: flex-start;
              display: flex;
              align-items: center;
              height: 20px;
              margin: 0 24px;
              .o-icon {
                margin-right: 8px;
                svg {
                  color: #555;
                  font-size: 16px;
                }
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
            flex-wrap: nowrap;
            font-size: 12px;
            .tags-retract {
              height: 20px;
              overflow-y: hidden;
              padding-right: 92px;
            }
            .tags-expand {
              height: auto;
              overflow: unset;
            }
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
            .tag-icon {
              margin-right: 8px;
              .o-icon svg {
                width: 20px;
                height: 20px;
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
              background: rgba(5, 142, 240, 0.15);
              border-radius: 14px;
              color: #0d8dff;
              white-space: nowrap;
              cursor: pointer;
              margin-right: 4px;
              border: 1px dashed #0d8dff;
              .o-icon {
                margin-right: 4px;
              }
            }
          }
        }
      }
    }

    .head-tabs {
      box-shadow: 0px 1px 3px 0px rgba(190, 196, 204, 0.2);
      background: rgba(251, 251, 251, 0.85);
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
      .empty-status {
        display: none;
      }
      .el-tabs {
        --o-tabs-header-font_size: 16px;
        background: rgba(251, 251, 251, 0.85);
        :deep(.el-tabs__nav) {
          display: flex;
          .el-tabs__item {
            cursor: pointer;
            // background-color: red;
            &:hover {
              .el-dropdown {
                color: #3d8df7;
              }
            }
          }
          .is-active {
            p {
              color: #3d8df7;
            }
          }
          .el-dropdown {
            line-height: 48px;
            color: #555;
            font-size: 16px;
          }
        }
      }
    }
  }
  .model-detail-body {
    min-height: calc(100vh - 512px);
    background-color: #f5f6f8;
    padding: 40px 0 64px;
  }
}
:deep(.el-tabs) {
  .el-tabs__header {
    // background-color: #ffffff;
    margin-bottom: 0;
    // box-shadow: 0px 1px 3px 0px rgba(190, 196, 204, 0.2);
  }

  .el-tabs__item {
    height: 48px;
    font-size: 16px;
    color: #555555;
    font-weight: normal;
    line-height: 48px;
    padding-bottom: 7px;
    &:hover {
      color: #3d8df7;
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
// 训练下拉菜单样式
.el-popper.nav {
  .el-dropdown-menu {
    padding: 4px;
    a {
      width: 100%;
      color: #555;
      text-align: center;
      &:hover {
        background: #edeff2;
        border-radius: 8px;
        color: $theme;
      }
    }
  }
}
</style>
