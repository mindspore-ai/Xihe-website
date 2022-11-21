<script setup>
import { useRouter, useRoute } from 'vue-router';
import { computed, ref } from 'vue';
import useClipboard from 'vue-clipboard3';

import OButton from '@/components/OButton.vue';
import FileTree from './FileTree.vue';

import IconDownload from '~icons/app/download';
import IconPlus from '~icons/app/plus';
import IconCopy from '~icons/app/copy-nickname';

import { gitlabDownloadAll } from '@/api/api-gitlab';
import { useFileData } from '@/stores';
const GITLAB_ADDRESS = import.meta.env.VITE_GITLAB_ADDRESS;

const { toClipboard } = useClipboard();
const router = useRouter();
const route = useRoute();
let routerParams = route.params;
const repoDetailData = computed(() => {
  return useFileData().fileStoreData;
});
const gitCloneUrl = ref(
  `${GITLAB_ADDRESS}/${routerParams.user}/${routerParams.name}.git`
);
const prop = defineProps({
  moduleName: {
    type: String,
    default: '',
  },
});
const i18n = {
  addList: [
    {
      value: '新建文件',
      path: `${prop.moduleName}FileNew`,
      action: () => {
        router.push({
          name: `${prop.moduleName}FileNew`,
          params: {
            user: route.params.user,
            name: route.params.name,
            contents: route.params.contents,
          },
        });
      },
    },
    {
      value: '新建文件夹',
      path: false,
      action: () => {
        useFileData().setShowFolder(true);
      },
    },
    {
      value: '上传文件',
      path: `${prop.moduleName}FileUpload`,
      action: () => {
        router.push({
          name: `${prop.moduleName}FileUpload`,
          params: {
            user: route.params.user,
            name: route.params.name,
            contents: route.params.contents,
          },
        });
      },
    },
  ],
  downloadAll: '克隆/下载',
  downloadZip: '下载ZIP',
  addNew: '添加',
};
const handleCopy = async () => {
  try {
    await toClipboard(gitCloneUrl.value);
    ElMessage({
      type: 'success',
      message: '复制成功',
    });
  } catch (e) {
    console.error(e);
  }
};

function pathClick(index) {
  let contents = '';
  if (route.params.contents) {
    contents = route.params.contents.splice(0, index);
  }
  router.push({
    name: `${prop.moduleName}File`,
    params: {
      user: route.params.user,
      name: route.params.name,
      contents,
    },
  });
}
async function downloadZip() {
  try {
    let href = null;
    if (repoDetailData.value.repo_type === 'public') {
      href = `/api/v1/repo/${prop.moduleName}/${route.params.user}/${route.params.name}`;
    } else {
      await gitlabDownloadAll({
        type: prop.moduleName,
        name: route.params.name,
        user: route.params.user,
      }).then((res) => {
        href = window.URL.createObjectURL(res); // 创建下载的链接
      });
    }
    let downloadElement = document.createElement('a'); //创建一个a 虚拟标签
    downloadElement.href = href;
    downloadElement.download = `${route.params.name}.zip`; // 下载后文件名
    document.body.appendChild(downloadElement);
    downloadElement.click(); // 点击下载
    document.body.removeChild(downloadElement); // 下载完成移除元素
    window.URL.revokeObjectURL(href);
  } catch (error) {
    throw new Error(error);
  }
}
</script>
<template>
  <div class="model-file">
    <div
      :class="{
        'file-top-hide': repoDetailData.is_empty && !route.params.contents,
      }"
      class="file-top"
    >
      <div class="file-top-left">
        <div class="file-path">
          <div class="item-path" @click="pathClick()">
            {{ repoDetailData.name }}
          </div>
          <div
            v-for="(item, index) in route.params.contents"
            :key="item"
            class="item-path"
            @click="pathClick(index + 1)"
          >
            /{{ item }}
          </div>
        </div>
      </div>
      <div class="file-top-right">
        <div class="o-popper">
          <el-popover :width="360" trigger="click" :teleported="false">
            <template #reference>
              <o-button class="download-all"
                ><a>{{ i18n.downloadAll }}</a>
              </o-button>
            </template>
            <div class="clone-download">
              <div class="clone-repo">
                <h5>HTTPS:</h5>
                <el-input v-model="gitCloneUrl" disabled>
                  <template #suffix>
                    <o-icon @click="handleCopy"><icon-copy></icon-copy></o-icon>
                  </template>
                </el-input>
              </div>
              <div class="download-zip">
                <o-button size="small" class="download-all" @click="downloadZip"
                  ><a>{{ i18n.downloadZip }}</a>
                  <template #suffix>
                    <o-icon><icon-download></icon-download></o-icon>
                  </template>
                </o-button>
              </div>
            </div>
          </el-popover>
        </div>

        <el-dropdown v-if="repoDetailData.is_owner" popper-class="filter">
          <o-button type="primary" class="add-new"
            >{{ i18n.addNew }}
            <template #prefix>
              <o-icon><icon-plus></icon-plus></o-icon>
            </template>
          </o-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="item in i18n.addList"
                :key="item.value"
                @click="item.action()"
                >{{ item.value }}</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <div class="file-body">
      <file-tree :module-name="moduleName"></file-tree>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$theme: #0d8dff;
:deep(.el-popover) {
  inset: 0 auto auto -70px !important;
  --el-popover-padding: 16px;
  .el-popper__arrow {
    display: block;
    left: 70px !important;
  }
}
.model-file {
  .file-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
    &-left {
      .file-path {
        display: flex;
        font-size: 18px;
        .item-path {
          cursor: pointer;
          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
    &-right {
      display: flex;
      .el-popover {
        --el-popover-padding: 16px;
        .clone-download {
          display: flex;
          flex-direction: column;
          align-items: center;
          .clone-repo {
            padding-bottom: 16px;
            width: 100%;
            border-bottom: 1px solid #e5e5e5;
            h5 {
              font-weight: 500;
              color: #000;
              font-size: 14px;
            }
            .el-input {
              margin: 8px 0 16px;
              margin-bottom: 0;
              width: 100%;
              :deep(.el-input__wrapper) {
                padding: 6px 8px !important;
              }
              .o-icon {
                cursor: pointer;
                font-size: 16px;
                color: #555;
                &:hover {
                  color: #0d8dff;
                }
              }
            }
          }
          .download-zip {
            margin-top: 16px;
            .o-button {
              padding: 4px 10px !important;
              min-width: 0;
              a {
                line-height: 18px;
                font-size: 12px;
              }
            }
            .o-icon {
              font-size: 16px;
            }
          }
        }
      }
      .add-new {
        margin-left: 24px;
      }
      .o-icon {
        font-size: 24px;
      }
    }
  }
  .file-top-hide {
    visibility: hidden;
  }
}
</style>
