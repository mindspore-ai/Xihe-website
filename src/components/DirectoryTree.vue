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
// console.log('类型: ', props.optionType);

const dirPath = ref(''); // 自定义路径，末尾不带/
const headContents = ref([]); // 头部路径，最终代码目录路径(数组)
// const bootFile = ref('');
// const radio = ref();

let routerParams = router.currentRoute.value.params;
// let contents = routerParams.contents;
const filesList = ref([]); //文件树table内容

const emit = defineEmits(['handle']);

// 获取目录树的内容（表格数据）
async function getDetailData(dirPath2) {
  try {
    // gitlab
    await getGitlabTree({
      type: 'project',
      user: routerParams.user,
      path: dirPath2,
      id: props.repoDetail.id,
      name: routerParams.name,
    }).then((res) => {
      if (res.data) {
        filesList.value = res.data;
        // console.log('获取文件目录树结果: ', filesList.value);
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
function pathClick(item, index) {
  if (item) {
    console.log('item: ', item, index);
    let arr = headContents.value.slice(0, index + 1);
    // let str = arr.join('/') + '/';
    let str = arr.join('/');
    dirPath.value = str; //再次请求数据
    headContents.value = headContents.value.slice(0, index + 1);
    emit('handle', headContents.value);
    // getDetailData(str);
  } else {
    // 返回根目录
    // getDetailData('');
    dirPath.value = '';
    headContents.value = [];
  }
}

// 点击文件夹或者文件
function goBlob(item) {
  // console.log('item111: ', item);

  // 如果是文件夹
  if (item.is_dir) {
    // 如果是代码目录弹窗
    if (props.optionType === 'directory') {
      dirPath.value = item.path;
      // console.log('dirPath值变化了: ', dirPath.value);
      let lastPath = dirPath.value.split('/').slice(-1).toString();
      headContents.value.push(lastPath);
      console.log('headContents.valu11111: ', headContents.value);
      emit('handle', headContents.value);
    } else {
      // 如果是启动文件弹窗
      console.log('item: ', item);
      dirPath.value = item.path;
      console.log('启动文件dirPath: ', dirPath.value);
      let lastPath = dirPath.value.split('/').slice(-1).toString();
      headContents.value.push(lastPath);
      console.log('headContents.value: ', headContents.value);

      //
    }

    // 取头部数组headContents的最后一位
    // /* let headLastPath = '';
    // headLastPath = headContents.value.pop();
    // dirPath.value = item.path;
    // let lastPath = dirPath.value.split('/').slice(-1).toString();
    // if (headLastPath === lastPath) {
    //   headContents.value.splice(
    //     headContents.value.indexOf(lastPath),
    //     1,
    //     lastPath
    //   );
    //   // emit('handle', headContents.value);
    // } else {
    //   //  headContents.value.splice(-1);
    //   // headContents.value.push(lastPath);
    //   emit('handle', headContents.value);
    // } */
  } else {
    return;
  }
}

// 点击文件单选框
function handleFile(item) {
  console.log('dirPath值: ', dirPath.value);

  emit('handle', item.name);
  // emit('handle', dirPath.value + item.name);
}
</script>

<template>
  <div class="model-file">
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
            @click="pathClick(item, index)"
          >
            /{{ item }}
          </div>
        </div>
      </div>
    </div>
    <div class="file-body">
      <!-- v-if="!repoDetailData.is_empty" -->
      <div class="tree">
        <el-table
          :header-cell-style="{ background: '#e5e8f0' }"
          :data="filesList"
          style="width: 100%"
        >
          <el-table-column
            prop="name"
            label="名称"
            width="300"
            class="file-name"
          >
            <template #default="scope">
              <!-- v-if="optionType === 'file' && !item.is_dir" -->
              <input
                v-if="optionType === 'file' && !scope.row.is_dir"
                type="radio"
                name="tableRadio"
                @click="handleFile(scope.row)"
              />
              <div
                class="file-blob"
                :style="{
                  paddingLeft:
                    optionType === 'file' && !scope.row.is_dir ? '8px' : '0px',
                }"
                @click="goBlob(scope.row)"
              >
                <o-icon v-if="!scope.row.is_dir"
                  ><icon-file></icon-file>
                </o-icon>
                <o-icon v-else><icon-folder></icon-folder> </o-icon>
                <span>
                  {{ scope.row.name }}
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="is_dir" label="描述" />
        </el-table>

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
          .first-radio {
            // display: flex;
            position: relative;
            input {
              position: absolute;
              top: 50%;
              transform: translateY(-50%);
              left: 24px;
            }
            .first-box {
              margin-left: 20px;
              cursor: pointer;
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

:deep(.el-table) {
  border: 1px solid #ccc;
  // 头部样式
  .el-table__header {
    // padding: 12px;
    tr {
      height: 48px;
      color: #555;
      th {
        &:first-child {
          padding-left: 12px;
        }
      }
    }
  }
  // 主体样式
  // .el-table__body-wrapper {
  // padding: 0 12px;
  .el-table__body {
    color: #555;
    // 行
    .el-table__row {
      // border-bottom: 1px solid red !important;
      height: 48px;
      .el-table_1_column_1 {
        padding-left: 12px;
        .cell {
          display: flex;
          .file-blob {
            display: flex;
            padding-left: 8px;
            cursor: pointer;
          }
        }
      }
    }
  }
  // }
}

.o-icon {
  margin-right: 6px;
  font-size: 24px;
}
</style>
