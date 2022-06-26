<script setup>
import { ref, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import IconModel from '~icons/app/model-blue';
import IconFolder from '~icons/app/folder';
import IconFile from '~icons/app/file';
import IconDownload from '~icons/app/download';
import IconAddFile from '~icons/app/add-file';
import IconFileVisited from '~icons/app/other-file';

import { downloadFile, findFile } from '@/api/api-obs';
import { changeByte } from '@/shared/utils';

import { useUserInfoStore, useFileData } from '@/stores';

const detailData = computed(() => {
  return useFileData().fileStoreData;
});

const router = useRouter();
const route = useRoute();

const userInfoStore = useUserInfoStore();

const isAuthentic = computed(() => {
  return route.params.user === userInfoStore.userName;
});

let routerParams = router.currentRoute.value.params;
let contents = routerParams.contents;
const pushParams = {
  user: routerParams.user,
  name: routerParams.name,
  contents: routerParams.contents,
};
const filesList = ref([]);

const i18n = {
  uploadTime: '更新时间',
  download: '下载',
  uploadReadMe: ['当前无文件，点击', '新建文件', '或', '上传文件'],
  emptyVisited: '该用户还未上传任何文件',
};

function getDetailData(path) {
  try {
    findFile(path).then((tree) => {
      if (
        (tree.status === 200 &&
          tree.data.children &&
          tree.data.children.length) ||
        (route.params.contents && route.params.contents.length)
      ) {
        filesList.value = tree.data.children;
        useFileData().fileStoreData['is_empty'] = false;
        filesList.value.sort((a, b) => {
          return b.is_folder - a.is_folder;
        });
      } else {
        useFileData().fileStoreData['is_empty'] = true;
      }
    });
  } catch (error) {
    console.log(error);
  }
}

function getFilesByPath() {
  routerParams = router.currentRoute.value.params;
  contents = routerParams.contents;
  if (contents && contents.length) {
    getDetailData(
      `xihe-obj/datasets/${route.params.user}/${
        routerParams.name
      }/${contents.join('/')}/`
    );
  } else {
    // 根目录下
    getDetailData(
      `xihe-obj/datasets/${route.params.user}/${routerParams.name}/`
    );
  }
}
function emptyClick(ind) {
  if (ind === 1) {
    router.push({
      name: 'datasetFileNew',
      params: pushParams,
    });
  } else if (ind === 3) {
    router.push({
      name: 'datasetFileUpload',
      params: pushParams,
    });
  }
}
function goBlob(item) {
  let contents = [...routerParams.contents, decodeURI(item.name)];
  if (!item.is_folder) {
    router.push({
      name: 'datasetFileBlob',
      params: {
        user: routerParams.user,
        name: routerParams.name,
        contents,
      },
    });
  } else {
    router.push({
      name: 'datasetFile',
      params: {
        user: routerParams.user,
        name: routerParams.name,
        contents,
      },
    });
  }
}
// function downLoad(objkey, fileName) {
//   try {
//     getDownLoadToken({ objkey }).then((res) => {
//       reopt.method = 'get';
//       reopt.url = res.data.signedUrl;
//       reopt.responseType = 'blob';
//       console.log(reopt);
//       downloadFileObs(reopt).then((res) => {
//         console.log(res);
//         let blob = new Blob([res], { type: res.type });
//         let downloadElement = document.createElement('a');
//         // 创建下载的链接
//         let href = window.URL.createObjectURL(blob);
//         console.log(href);
//         downloadElement.href = href;
//         //下载后文件名
//         downloadElement.download = fileName;
//         document.body.appendChild(downloadElement);
//         //点击下载
//         downloadElement.click();
//         //下载完成移除元素
//         document.body.removeChild(downloadElement);
//         //释放掉blob对象
//         window.URL.revokeObjectURL(href);
//         // 添加下载记录 下载量以仓库为单位
//         addDownloadRecord(detailData.id).then((res) => {
//           ElMessage({
//             type: 'success',
//             message: res.msg,
//             center: true,
//           });
//         });
//       });
//     });
//   } catch (error) {
//     ElMessage({
//       type: 'error',
//       message: error,
//       center: true,
//     });
//   }
// }
watch(
  () => router,
  (val) => {
    if (val.currentRoute.value.name === 'datasetFile') {
      getFilesByPath();
    }
  },
  {
    immediate: true,
    deep: true,
  }
);
</script>
<template>
  <div v-if="filesList.length" class="tree">
    <table class="tree-table">
      <tr class="tree-head">
        <td class="tree-head-left">
          <div class="inner-box">
            <o-icon><icon-model></icon-model> </o-icon>
            <span class="tree-head-left-describe" title="数据集描述"
              >数据集描述</span
            >
          </div>
        </td>
        <td></td>
        <td></td>
        <td class="tree-head-right">
          <div class="inner-box">
            {{ i18n.uploadTime }}
          </div>
        </td>
      </tr>
      <tr
        v-for="item in filesList"
        :key="item.download_path"
        class="tree-table-item"
      >
        <td class="tree-table-item-name" @click="goBlob(item)">
          <div class="inner-box">
            <o-icon v-if="!item.is_folder"><icon-file></icon-file> </o-icon>
            <o-icon v-else><icon-folder></icon-folder> </o-icon>
            <span>{{ item.name }}</span>
          </div>
        </td>
        <td
          class="tree-table-item-download"
          @click="downloadFile(item.path, item.name, detailData.id)"
        >
          <div v-if="item.size" class="inner-box">
            <o-icon><icon-download></icon-download></o-icon>
            <span class="size">{{ changeByte(item.size) }}</span>
          </div>
        </td>
        <td class="tree-table-item-from">
          <div class="inner-box">
            {{ item.description }}
          </div>
        </td>
        <td class="tree-table-item-time">
          <div class="inner-box">
            {{ item.time_pass }}
          </div>
        </td>
      </tr>
    </table>
  </div>
  <div v-else-if="isAuthentic" class="empty-own">
    <div class="upload-readme-img">
      <o-icon> <icon-add-file></icon-add-file> </o-icon>
    </div>
    <div class="upload-readme-tip">
      <p
        v-for="(item, index) in i18n.uploadReadMe"
        :key="item"
        :class="{ 'link-style': index === 1 || index === 3 }"
        @click="emptyClick(index)"
      >
        {{ item }}
      </p>
    </div>
  </div>
  <div v-else class="empty-visited empty-own">
    <div class="upload-readme-img">
      <o-icon> <icon-file-visited></icon-file-visited> </o-icon>
    </div>
    <div class="upload-readme-tip">
      <p>
        {{ i18n.emptyVisited }}
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.o-icon {
  margin-right: 6px;
  font-size: 24px;
}
.tree {
  min-height: calc(100vh - 400px);
  &-head {
    // display: block;
    padding: 12px 24px;
    width: 100%;
    font-size: 14px;
    background-color: #e5e8f0;
    &-left {
      display: flex;
      align-items: center;
      height: 56px;
      &-describe {
        padding-left: 6px;
        color: #555;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    &-right {
      padding-right: 70px;
    }
  }
  &-table {
    padding: 0 24px;
    width: 100%;
    border: 1px solid #e5e5e5;
    background-color: #fff;
    tr {
      height: 56px;
      td {
        border-bottom: 1px solid #e5e5e5;
        .inner-box {
          display: flex;
          align-items: center;
        }
      }
      td:first-child {
        padding-left: 36px;
        width: 330px;
      }
      td:nth-child(3) {
        max-width: 800px;
      }
    }
    &-item {
      &-name {
        cursor: pointer;
      }
      &-time {
        width: 170px;
        padding-right: 50px;
      }
      &-download {
        cursor: pointer;
        width: 115px;
        font-size: 12px;
        color: #999;
        .o-icon {
          font-size: 16px;
        }
      }
    }
    &-item-inner {
      // display: flex;
      // align-items: center;
      // justify-content: space-between;
      padding: 16px 0;
      border-bottom: 1px solid #e5e5e5;
      & > div {
        display: flex;
        align-items: center;
      }
    }
  }
}
.empty-own {
  min-height: calc(100vh - 400px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  .upload-readme-img {
    .o-icon {
      display: block;
      font-size: 48px;
    }
  }
  .upload-readme-tip {
    display: flex;
    margin-top: 24px;
    line-height: 17px;
    color: #999;
    .link-style {
      cursor: pointer;
      color: #33b3ff;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>
