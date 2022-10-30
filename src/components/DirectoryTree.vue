<script setup>
import { useRouter, useRoute } from 'vue-router';
import { ref, watch } from 'vue';

// import OButton from '@/components/OButton.vue';
// import FileTree from './FileTree.vue';
import IconProject from '~icons/app/project-tree';
import IconFolder from '~icons/app/folder';
import IconFile from '~icons/app/file';
import { getGitlabTree } from '@/api/api-gitlab';

const router = useRouter();
const route = useRoute();
const props = defineProps({
  repoDetail: {
    type: Object,
    default: () => {
      return {};
    },
  },
  optionType: {
    type: String,
    default: () => {
      return '';
    },
  },
});
// console.log('仓库详情数据: ', props.repoDetail);
console.log('仓库详情数据: ', props.optionType);

const dirPath = ref(''); // 自定义路径
const headContents = ref([]); // 头部路径，数组
const bootFile = ref('');
const radio = ref();

let routerParams = router.currentRoute.value.params;
// let contents = routerParams.contents;
const filesList = ref([]); //文件树内容

const emit = defineEmits(['handle']);

// 获取目录树的内容（表格数据）
async function getDetailData(dirPath2) {
  // console.log('dirPath路径222: ', dirPath2);
  try {
    // gitlab
    await getGitlabTree({
      user: routerParams.user,
      path: dirPath2,
      id: props.repoDetail.id,
      name: routerParams.name,
    }).then((res) => {
      if (res.data) {
        filesList.value = res.data;
        console.log('获取文件目录树结果: ', filesList.value);
      }
    });
  } catch (error) {
    console.error(error);
  }
}
function getFilesByPath(item) {
  // 不是根目录下
  if (item) {
    getDetailData(item + '/');
  } else {
    // 根目录下
    getDetailData(item);
  }
}

watch(
  () => dirPath.value,
  () => {
    getFilesByPath(dirPath.value);
  },
  {
    immediate: true,
    deep: true,
  }
);

// 头部点击选择目录
function pathClick(item) {
  if (item) {
    // console.log('点击头部参数: ', item);
    let index = headContents.value.indexOf(item);
    let arr = headContents.value.slice(0, index + 1);
    let str = arr.join('/') + '/';
    getDetailData(str);
    headContents.value = headContents.value.slice(0, index + 1);
  } else {
    getDetailData('');
    headContents.value = [];
  }
}

// 点击文件夹或者文件
function goBlob(item) {
  // 如果是文件夹
  if (item.is_dir) {
    // console.log('是文件夹');
    // dirPath.value = dirPath.value + `${item.path}`;
    dirPath.value = item.path;
    let lastPath = dirPath.value.split('/').slice(-1).toString();
    headContents.value.push(lastPath);
    emit('handle', headContents.value);
  } else {
    // :TODO:
    return;
    console.log('不是是文件夹', item);
    // headContents.value.push(item.name);
    // emit('handle', headContents.value);
    console.log('dirPath.value: ', dirPath.value);
  }
}

function handleChange(item) {
  console.log('item: ', item);
}
</script>

<template>
  <div class="model-file">
    <!-- <div class="title">代码目录钱钱钱</div> -->
    <div class="file-top">
      <div class="file-top-left">
        <div class="file-path">
          <!-- <div v-if="optionType === 'directory'" class="current-path"> -->
          <div class="current-path">当前路径 :</div>
          <div class="item-path" @click="pathClick()">
            {{ repoDetail.name }}
          </div>
          <div
            v-for="(item, index) in headContents"
            :key="index"
            class="item-path"
            @click="pathClick(item)"
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
              <!-- TODO:单选框 -->

              <tr
                v-for="(item, index) in filesList"
                :key="index"
                class="tree-table-item"
              >
                <div style="width: 100%">
                  <el-radio-group v-model="radio" @change="handleChange">
                    <el-radio :label="item.name">
                      <td class="tree-table-item-name" :title="item.name">
                        <div class="inner-box" @click="goBlob(item)">
                          <o-icon v-if="!item.is_dir"
                            ><icon-file></icon-file>
                          </o-icon>
                          <o-icon v-else><icon-folder></icon-folder> </o-icon>
                          <span>{{ item.name }}</span>
                        </div>
                      </td>
                      <td class="tree-table-item-time">
                        <div class="inner-box">描述~~~</div>
                      </td>
                    </el-radio>
                  </el-radio-group>
                </div>
              </tr>
              <!--  <tr
                v-for="(item, index) in filesList"
                :key="index"
                class="tree-table-item"
              >
                <td class="tree-table-item-name" :title="item.name">
                  <div class="inner-box" @click="goBlob(item)">
                    <o-icon v-if="!item.is_dir"
                      ><icon-file></icon-file>
                    </o-icon>
                    <o-icon v-else><icon-folder></icon-folder> </o-icon>
                    <span>{{ item.name }}</span>
                  </div>
                </td>
                <td class="tree-table-item-time">
                  <div class="inner-box">描述~~~</div>
                </td>
              </tr> -->
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
        .current-path {
          color: #000;
          margin-right: 6px;
          font-weight: 500;
        }
        .item-path {
          cursor: pointer;
          color: #555;
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
          width: 100%;
          height: 48px;
          font-size: 14px;
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
          /* .el-radio-group {
            // width: 100% !important;
            width: 640px;
            height: 48px;

            background-color: #bfa;
            .el-radio {
              width: 100%;
            }
          } */
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
// .tree-table-item {
// width: 700px;
:deep(.el-radio-group) {
  // width: 100% !important;
  width: 640px;
  height: 48px;

  // background-color: #bfa;
  .el-radio {
    width: 100%;
    .el-radio__label {
      display: inline-block;
      width: 100%;
      // width: 640px !important;
      // background-color: #bfa;
    }
  }
}
// }
</style>
