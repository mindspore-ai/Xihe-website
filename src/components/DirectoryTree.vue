<script setup>
import { useRouter, useRoute } from 'vue-router';
import { ref, computed, watch } from 'vue';

// import OButton from '@/components/OButton.vue';
// import FileTree from './FileTree.vue';
import IconProject from '~icons/app/project-tree';
import IconFolder from '~icons/app/folder';
import IconFile from '~icons/app/file';
import { getGitlabTree } from '@/api/api-gitlab';

// import { useFileData } from '@/stores';

const router = useRouter();
const route = useRoute();
const props = defineProps({
  repoDetail: {
    type: Object,
    default: () => {
      return {};
    },
  },
});
console.log('仓库详情数据: ', props.repoDetail);

let routerParams = router.currentRoute.value.params;
let contents = routerParams.contents;
const filesList = ref([]);
// console.log('route: ', router);
// 获取目录树的内容（表格数据）
async function getDetailData(path) {
  console.log('path: ', path);
  try {
    // gitlab
    await getGitlabTree({
      user: routerParams.user,
      path: path,
      id: repoDetail.value.id,
      name: routerParams.name,
    }).then((res) => {
      if (res.data) {
        filesList.value = res.data;
        console.log('filesList.value: ', filesList.value);
      }
    });
    // await getGitlabCommit(path, repoDetailData.value.repo_id).then((res) => {
    //   commitData.value = res;
    //   console.log(res);
    // });
  } catch (error) {
    console.error(error);
  }
}

function getFilesByPath() {
  routerParams = router.currentRoute.value.params;
  contents = routerParams.contents;
  if (contents && contents.length) {
    getDetailData(`${contents.join('/')}/`);
  } else {
    // 根目录下
    getDetailData('');
  }
}
function goBlob(item) {
  let contents = [...routerParams.contents, decodeURI(item.name)];
  let targetRoute = null;
  if (!item.is_dir) {
    targetRoute = `projectFileBlob`;
  } else {
    targetRoute = `projectFile`;
  }
  return {
    name: targetRoute,
    params: {
      user: routerParams.user,
      name: routerParams.name,
      contents,
    },
  };
}
// console.log('route: ', route);
// console.log('router: ', router);

watch(
  () => route.fullPath,
  () => {
    console.log('route.fullPath: ', route.fullPath);
    if (router.currentRoute.value.name === `projectFile`) {
      getFilesByPath();
    }
  },
  {
    immediate: true,
    deep: true,
  }
);

// TODO:点击选择目录
function pathClick(index) {
  let contents = '';
  if (route.params.contents) {
    // console.log('route.params.contents: ', route.params.contents);
    contents = route.params.contents.splice(0, index);
  }
  router.push({
    name: `projectFile`,
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
    <div class="file-top">
      <div class="file-top-left">
        <div class="file-path">
          <div class="item-path" @click="pathClick()">
            <!-- {{ repoDetailData.name }} -->
            {{ repoDetail.name }}
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
    </div>
    <div class="file-body">
      <!-- v-if="!repoDetailData.is_empty" -->
      <div class="tree">
        <table class="tree-table">
          <!-- <col width="330px" />
          <col width="670px" /> -->
          <tbody style="100%">
            <tr class="tree-head">
              <td>
                <div class="inner-box">
                  <o-icon>
                    <icon-project></icon-project>
                  </o-icon>
                  <span class="tree-head-left-name">名称</span>
                </div>
              </td>
              <td class="tree-head-right">
                <div class="inner-box">描述</div>
              </td>
            </tr>
            <template v-if="filesList.length">
              <tr
                v-for="item in filesList"
                :key="item.download_path"
                class="tree-table-item"
              >
                <td class="tree-table-item-name" :title="item.name">
                  <router-link :to="goBlob(item)" class="inner-box">
                    <o-icon v-if="!item.is_dir"
                      ><icon-file></icon-file>
                    </o-icon>
                    <o-icon v-else><icon-folder></icon-folder> </o-icon>
                    <span>{{ item.name }}</span>
                  </router-link>
                </td>
                <td class="tree-table-item-time">
                  <div class="inner-box">
                    <!-- TODO:确实描述字段 -->
                    描述~~~
                    {{ item.path }}
                  </div>
                </td>
              </tr>
            </template>
            <!-- TODO:如果没有数据 -->
          </tbody>
        </table>
        <!-- <div v-if="!filesList.length" class="empyt-folder">空文件夹</div> -->
      </div>
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
  }
  .file-body {
    .tree {
      &-head {
        // display: block;
        padding: 12px 24px;
        width: 100%;
        font-size: 14px;
        background-color: #e5e8f0 !important;
        &-left {
          display: flex;
          align-items: center;
          height: 48px;
          &-name {
            padding-left: 6px;
            color: #555;
            line-height: 20px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
        &-right {
          padding-right: 70px;
          height: 48px;
        }
      }
      &-table {
        padding: 0 24px;
        width: 100% !important;
        border: 1px solid #e5e5e5;
        background-color: #fff;
        table-layout: fixed;
        word-break: break-all;
        border-collapse: collapse;
        @media screen and (max-width: 1280px) {
          width: inherit;
        }
        tr {
          height: 48px;
          transition: all 0.3s;
          &:hover {
            background: #f7f8fa;
            .delete-folder {
              display: flex;
            }
            .is-visitor {
              display: none;
            }
          }
          .check-name {
            display: flex;
            justify-content: space-between;
            padding: 0 30px;
            span {
              cursor: pointer;
            }
          }
          td {
            overflow: hidden;
            word-wrap: break-word;
            border-bottom: 1px solid #e5e5e5;
            .inner-box {
              display: flex;
              align-items: center;
              padding-right: 8px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              span {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
            }
          }
          td:first-child {
            padding-left: 24px;
            padding-right: 40px;
            span:nth-child(1) {
              flex-shrink: 0;
            }
          }
        }
        &-item {
          &-name {
            cursor: pointer;
            .inner-box {
              color: #555;
              &:hover {
                color: #33b3ff;
                text-decoration: underline;
              }
            }
          }
          &-from {
            color: #555;
            .inner-box {
              justify-content: space-between;
              .delete-folder {
                display: none;
                cursor: pointer;
                padding-right: 50px;
                flex-direction: column;
                color: #33b3ff;
                justify-content: center;
                align-items: center;
                .o-icon {
                  font-size: 16px;
                }
                span {
                  padding-top: 5px;
                  font-size: 12px;
                }
              }
            }
          }
          &-time {
            padding-right: 50px;
          }
          &-download {
            cursor: pointer;
            font-size: 12px;
            color: #999;
            .inner-box {
              padding: 0 24px;
            }
            span {
              line-height: 18px;
            }
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
  }
}
.o-icon {
  margin-right: 6px;
  font-size: 24px;
}
</style>
