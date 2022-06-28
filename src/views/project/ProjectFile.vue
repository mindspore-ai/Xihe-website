<script setup>
import { useRouter, useRoute } from 'vue-router';
import { computed } from 'vue';
import OButton from '@/components/OButton.vue';
import FileTree from './FileTree.vue';

import IconDownload from '~icons/app/download';
import IconPlus from '~icons/app/plus';

import { useFileData } from '@/stores';

import { useLoginStore } from '@/stores';

const loginStore = useLoginStore();

const router = useRouter();
const route = useRoute();
const detailData = computed(() => {
  return useFileData().fileStoreData;
});
const i18n = {
  addList: [
    {
      value: '新建文件',
      path: 'projectFileNew',
      action: () => {
        router.push({
          name: 'projectFileNew',
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
      path: 'projectFileUpload',
      action: () => {
        router.push({
          name: 'projectFileUpload',
          params: {
            user: route.params.user,
            name: route.params.name,
            contents: route.params.contents,
          },
        });
      },
    },
  ],
  downloadAll: '下载全部',
  addNew: '添加',
};
function pathClick(index) {
  let contents = '';
  if (route.params.contents) {
    contents = route.params.contents.splice(0, index);
  }
  router.push({
    name: 'projectFile',
    params: {
      user: route.params.user,
      name: route.params.name,
      contents,
    },
  });
}
</script>
<template>
  <div class="model-file">
    <div
      :class="{
        'file-top-hide': detailData.is_empty && !route.params.contents,
      }"
      class="file-top"
    >
      <div class="file-top-left">
        <div class="file-path">
          <div class="item-path" @click="pathClick()">
            {{ detailData.name }}
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
        <!-- <o-button v-if="loginStore.isLogined" class="download-all"
          >{{ i18n.downloadAll }}
          <template #suffix>
            <o-icon><icon-download></icon-download></o-icon>
          </template>
        </o-button> -->
        <el-dropdown v-if="detailData.is_owner" popper-class="filter">
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
      <file-tree></file-tree>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$theme: #0d8dff;
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
