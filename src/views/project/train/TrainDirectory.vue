<script setup>
import { useRouter } from 'vue-router';
import { ref, watch, defineProps, defineEmits } from 'vue';

import IconFolder from '~icons/app/folder';
import IconFile from '~icons/app/file';
import { getGitlabTree } from '@/api/api-gitlab';

const router = useRouter();
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

const dirPath = ref(''); // 代码目录自定义路径，末尾不带/
const filePath = ref(''); // 启动文件自定义路径，末尾不带/
const inp = ref(null);
const dirHeadPath = ref([]); // 代码目录弹窗头部路径，最终代码目录路径(数组)
const fileHeadPath = ref([]); // 启动文件弹窗头部路径

let routerParams = router.currentRoute.value.params;
const dirTableData = ref([]); // 代码目录文件树table内容
const fileTableData = ref([]); // 启动文件文件树table内容

const emit = defineEmits(['handle']);

// 获取代码目录的内容（表格数据）
async function getDirData(dirPath2) {
  try {
    await getGitlabTree({
      type: 'project',
      user: routerParams.user,
      path: dirPath2,
      id: props.repoDetail.id,
      name: routerParams.name,
    }).then((res) => {
      if (res.data) {
        dirTableData.value = res.data;
        fileTableData.value = res.data;
      }
    });
  } catch (error) {
    return error;
  }
}
function getDirByPath(item) {
  // 不是根目录下
  if (item) {
    getDirData(item + '/');
  } else {
    // 根目录下
    getDirData('');
  }
}

watch(
  () => dirPath.value,
  () => {
    getDirByPath(dirPath.value);
  },
  {
    immediate: true,
    deep: true,
  }
);
// 获取启动文件的内容（表格数据）
async function getFileData(dirPath2) {
  try {
    await getGitlabTree({
      type: 'project',
      user: routerParams.user,
      path: dirPath2,
      id: props.repoDetail.id,
      name: routerParams.name,
    }).then((res) => {
      if (res.data) {
        fileTableData.value = res.data;
      }
    });
  } catch (error) {
    return error;
  }
}
function getFileByPath(item) {
  // 不是根目录下
  if (item) {
    getFileData(item + '/');
  } else {
    // 根目录下
    getFileData('');
  }
}

watch(
  () => filePath.value,
  () => {
    getFileByPath(filePath.value);
  },
  {
    deep: true,
  }
);

const fileRelativePath = ref([]);
// 头部点击选择目录
function handleClick(item, index) {
  // 代码目录
  if (props.optionType === 'directory') {
    if (item) {
      let arr = dirHeadPath.value.slice(0, index + 1);
      let str = arr.join('/');
      dirPath.value = str; // 再次请求数据
      dirHeadPath.value = dirHeadPath.value.slice(0, index + 1);
      emit('handle', dirHeadPath.value.join('/') + '/');
      fileHeadPath.value = dirHeadPath.value.map((item) => {
        return item;
      });
    } else {
      // 返回根目录
      dirPath.value = '';
      dirHeadPath.value = [];
      fileHeadPath.value = [];
      emit('handle', dirHeadPath.value.join('/'));
    }
  } else {
    // 启动文件
    if (item && index >= dirHeadPath.value.length - 1) {
      let arr = fileHeadPath.value.slice(0, index + 1);
      let str = arr.join('/');
      filePath.value = str; // 再次请求数据
      fileHeadPath.value = fileHeadPath.value.slice(0, index + 1);
      fileRelativePath.value.splice(index);
    } else {
      return;
    }
  }
}

// 点击文件夹或者文件
function goBlob(item) {
  // 如果是文件夹
  if (item.is_dir) {
    // 代码目录弹窗
    if (props.optionType === 'directory') {
      dirPath.value = item.path;
      let lastPath = dirPath.value.split('/').slice(-1).toString();
      dirHeadPath.value.push(lastPath);
      emit('handle', dirHeadPath.value.join('/') + '/');
      fileHeadPath.value = JSON.parse(JSON.stringify(dirHeadPath.value));
    } else {
      // 启动文件弹窗
      filePath.value = item.path;
      let lastPath = filePath.value.split('/').slice(-1).toString();
      fileHeadPath.value.push(lastPath);
    }
  } else {
    return;
  }
}

// 点击文件单选框
function handleFile(item) {
  const fileArr = item.path.split('/');
  fileRelativePath.value = fileArr.slice(dirHeadPath.value.length);
  if (!item.name) {
    emit('handle', item.name);
  } else {
    emit('handle', fileRelativePath.value.join('/'));
  }
}
</script>

<template>
  <div class="model-file">
    <div class="file-top">
      <div class="file-top-left">
        <div class="file-path">
          <!-- <div v-if="optionType === 'directory'" class="current-path"> -->
          <div class="current-path">当前路径 :</div>
          <div class="item-path" @click="handleClick()">
            {{ repoDetail.name }}
          </div>
          <div v-if="optionType === 'directory'" class="item-path">
            <div
              v-for="(item, index) in dirHeadPath"
              :key="index"
              class="dir-path"
              @click="handleClick(item, index)"
            >
              /{{ item }}
            </div>
          </div>
          <div v-else class="item-path">
            <div
              v-for="(item, index) in fileHeadPath"
              :key="index"
              class="dir-path"
              @click="handleClick(item, index)"
            >
              /{{ item }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="file-body">
      <!-- 代码目录弹窗内容 -->
      <div v-if="optionType === 'directory'" class="tree">
        <el-table
          :header-cell-style="{ background: '#e5e8f0' }"
          :data="dirTableData"
          style="width: 100%"
        >
          <el-table-column
            prop="name"
            label="名称"
            width="350"
            class="file-name"
          >
            <template #default="scope">
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
          <el-table-column label="描述" />
        </el-table>
      </div>
      <!-- 启动文件弹窗内容 -->
      <div v-else class="tree">
        <el-table
          :header-cell-style="{ background: '#e5e8f0' }"
          :data="fileTableData"
          style="width: 100%"
        >
          <el-table-column
            prop="name"
            label="名称"
            width="300"
            class="file-name"
          >
            <template #default="scope">
              <input
                v-if="
                  optionType === 'file' &&
                  !scope.row.is_dir &&
                  fileHeadPath.length >= dirHeadPath.length
                "
                ref="inp"
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
          <el-table-column label="描述" />
        </el-table>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$theme: #0d8dff;
input {
  outline: none;
}
.model-file {
  .file-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
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
          display: flex;
          cursor: pointer;
          color: #555;
          .dir-path {
            &:hover {
              text-decoration: underline;
            }
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
  .el-table__body {
    color: #555;
    // 行
    .el-table__row {
      height: 48px;
      .el-table__cell {
        padding-left: 12px;
        .cell {
          display: flex;
          // font-size: 30px;
          .file-blob {
            display: flex;
            padding-left: 8px;
            cursor: pointer;
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
