<script setup>
import { ref, watch, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Markdown from 'markdown-it';

import OButton from '@/components/OButton.vue';
import RelateCard from '@/components/RelateCard.vue';
import ProjectRelateCard from '@/components/ProjectRelateCard.vue';
import NoRelate from '@/components/NoRelate.vue';

import IconTime from '~icons/app/time';
import IconDownload from '~icons/app/download';
import IconHeart from '~icons/app/heart';
import IconAddFile from '~icons/app/add-file';
import IconFile from '~icons/app/dataset';

import { downloadObs, findFile } from '@/api/api-obs';
import { useFileData } from '@/stores';

const router = useRouter();
const route = useRoute();
let routerParams = router.currentRoute.value.params;

const mkit = new Markdown({ html: true });
const codeString = ref('');
const result = ref();
let README = '';
const detailData = computed(() => {
  return useFileData().fileStoreData;
});
const pushParams = {
  user: routerParams.user,
  name: routerParams.name,
  contents: routerParams.contents,
};

const i18n = {
  recentDownload: '近期下载量',
  dataset: '相关模型',
  download: '下载量',
  uploadTime: '上传时间',
  relatedItem: '相关项目',
  editor: '编辑',
  uploadReadMe: [
    '当前无数据集卡片，点击',
    '新建README.md文件',
    '或',
    '上传README.md文件',
  ],
  emptyVisited: '无数据集卡片',
};
// 获取README文件
function getReadMeFile() {
  try {
    findFile(
      `xihe-obj/datasets/${route.params.user}/${routerParams.name}/`
    ).then((tree) => {
      if (
        tree.status === 200 &&
        tree.data.children &&
        tree.data.children.length
      ) {
        README = tree.data.children.filter((item) => {
          return item.name === 'README.md';
        });
        if (README[0]) {
          downloadObs(README[0].path).then((res) => {
            res ? (codeString.value = res) : '';
          });
          result.value = mkit.render(codeString.value);
        } else {
          codeString.value = '';
        }
      }
    });
  } catch (error) {
    console.error(error);
  }
}

function goEditor() {
  pushParams.contents = ['README.md'];
  router.push({
    name: 'datasetFileEditor',
    params: pushParams,
  });
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
function goDetailClick(val) {
  router.push(`/models/${val.owner_name.name}/${val.name}`);
}
function goProjectClick(val) {
  router.push(`/projects/${val.owner_name.name}/${val.name}`);
}
// 文本监听
watch(
  () => codeString.value,
  (val) => {
    typeof val === 'string' ? '' : (val = '');
    codeString.value = val;
    result.value = mkit.render(codeString.value);
  }
);
// 路由监听
watch(
  () => route,
  () => {
    if (route.name === 'datasetCard') {
      codeString.value = '';
      getReadMeFile();
    }
  },
  {
    deep: true,
    immediate: true,
  }
);
</script>
<template>
  <div v-if="detailData.id" class="model-card">
    <div v-if="codeString" class="markdown-body">
      <div v-highlight class="markdown-file" v-html="result"></div>
      <o-button v-if="detailData.is_owner" @click="goEditor">{{
        i18n.editor
      }}</o-button>
    </div>
    <div v-else-if="detailData.is_owner" class="upload-readme markdown-body">
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
    <div v-else class="upload-readme markdown-body">
      <div class="upload-readme-img">
        <o-icon> <icon-file></icon-file> </o-icon>
      </div>
      <div class="upload-readme-tip">
        <p>
          {{ i18n.emptyVisited }}
        </p>
      </div>
    </div>
    <div class="right-data">
      <div class="download-data">
        <h4 class="download-title">{{ i18n.recentDownload }}</h4>
        <span class="download-count">{{ detailData.download_count }}</span>
      </div>
      <!-- 相关模型 -->
      <div class="dataset-data">
        <h4 class="title">{{ i18n.dataset }}</h4>
        <div class="dataset-box">
          <no-relate
            v-if="
              !detailData.relate_models_list ||
              detailData.relate_models_list.length === 0
            "
            relate-name="model"
          ></no-relate>
          <relate-card
            :detail-data="detailData"
            :name="'relate_models_list'"
            @jump="goDetailClick"
          ></relate-card>
        </div>
      </div>
      <!-- 相关项目 -->
      <div class="related-project">
        <div class="title">{{ i18n.relatedItem }}</div>
        <no-relate
          v-if="
            !detailData.relate_projects_list ||
            detailData.relate_projects_list.length === 0
          "
          relate-name="project"
        ></no-relate>
        <project-relate-card
          v-else
          :detail-data="detailData"
          :name="'relate_projects_list'"
          @jump="goProjectClick"
        ></project-relate-card>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.model-card {
  display: flex;
  padding-bottom: 40px;
  min-height: calc(100vh - 340px);
  background-color: #f5f6f8;
  .markdown-body {
    position: relative;
    margin-right: 40px;
    width: 100%;
    border-right: 1px solid #d8d8d8;
    .markdown-file {
      padding-right: 40px;
    }
    .o-button {
      position: absolute;
      top: 0px;
      right: 40px;
    }
  }
  .upload-readme {
    display: flex;
    flex-direction: column;
    align-items: center;
    // justify-content: center;
    font-size: 14px;
    .upload-readme-img {
      margin-top: 200px;
      .o-icon {
        display: block;
      }
      font-size: 48px;
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
  .right-data {
    :deep(.remove-item) {
      visibility: hidden;
    }
    max-width: 425px;
    width: 100%;
    color: #000;
    .download-data {
      .download-title {
        font-size: 16px;
        color: #555;
      }
      .download-count {
        font-size: 18px;
        color: #000;
      }
    }
    .dataset-data {
      .dataset-box {
        :deep(.remove-item) {
          visibility: hidden;
        }
        display: grid;
        grid-template-columns: repeat(1, minmax(200px, 1fr));
        column-gap: 24px;
        row-gap: 24px;
        margin-top: 24px;
        .dataset-item {
          max-width: 424px;
          width: 100%;
          padding: 24px;
          background-color: #fff;
          .dataset-top {
            margin-bottom: 14px;
          }
          .dataset-bottom {
            display: flex;
            justify-content: start;
            align-items: center;
            & > div {
              display: flex;
              align-items: center;
              margin-right: 24px;
              span {
                font-size: 20px;
                padding-right: 4px;
              }
            }
          }
        }
      }
    }
    .title {
      margin: 48px 0 24px;
      font-size: 18px;
      line-height: 24px;
    }
  }
}
</style>
