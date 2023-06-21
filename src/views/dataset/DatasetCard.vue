<script setup>
import { ref, watch, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import { handleMarkdown } from '@/shared/markdown';

import OButton from '@/components/OButton.vue';
import RelateCard from '@/components/train/RelateCard.vue';
import ProjectRelateCard from '@/components/train/ProjectRelateCard.vue';
import NoRelate from '@/components/train/NoRelate.vue';

import IconAddFile from '~icons/app/add-file';
import IconFile from '~icons/app/dataset';

import { getGitlabFileRaw } from '@/api/api-gitlab';
import { getReadmeInfo } from '@/api/api-dataset';
import { useFileData } from '@/stores';

const router = useRouter();
const route = useRoute();
let routerParams = router.currentRoute.value.params;

const mkit = handleMarkdown();

const codeString = ref('');
const result = ref();
const rightModel = ref(null);
const licensesHeight = ref(0);

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
    getReadmeInfo(detailData.value.owner, detailData.value.name)
      .then((tree) => {
        if (tree.data.has_file) {
          getGitlabFileRaw({
            type: 'dataset',
            user: routerParams.user,
            path: 'README.md',
            id: detailData.value.id,
            name: routerParams.name,
          }).then((res) => {
            res ? (codeString.value = res) : '';
            result.value = mkit.render(codeString.value);
          });
        } else {
          codeString.value = '';
        }
      })
      .catch((err) => {
        console.error(err);
      });
  } catch (error) {
    console.error(error);
  }
}

route.hash ? getReadMeFile() : '';

function handleEditor() {
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
function handleDetailClick(val) {
  router.push(`/models/${val.owner.name}/${val.name}`);
}
function handleProjectClick(val) {
  router.push(`/projects/${val.owner.name}/${val.name}`);
}
onMounted(() => {
  licensesHeight.value = `${rightModel.value.offsetHeight + 40}px`;
});
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
    if (route.name === 'datasetCard' && !route.hash) {
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
      <div v-highlight v-dompurify-html="result" class="markdown-file"></div>
      <o-button v-if="detailData.is_owner" @click="handleEditor">{{
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
      <div ref="rightModel" class="right-inner">
        <div class="download-data">
          <div class="download-title">{{ i18n.recentDownload }}</div>
          <span class="download-count">{{ detailData.download_count }}</span>
        </div>
        <!-- 相关模型 -->
        <div class="dataset-data">
          <div class="title">{{ i18n.dataset }}</div>
          <div class="dataset-box">
            <relate-card
              v-if="detailData.related_models"
              :detail-data="detailData"
              :name="'related_models'"
              @jump="handleDetailClick"
            ></relate-card>
            <no-relate v-else relate-name="model"></no-relate>
          </div>
        </div>
        <!-- 相关项目 -->
        <div class="related-project">
          <div class="title">{{ i18n.relatedItem }}</div>
          <project-relate-card
            v-if="detailData.related_projects"
            :detail-data="detailData"
            :name="'related_projects'"
            @jump="handleProjectClick"
          ></project-relate-card>
          <no-relate v-else relate-name="project"></no-relate>
        </div>
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
    margin-right: 24px;
    width: 100%;
    border-radius: 16px;
    background: #fff;
    :deep(.markdown-file) {
      padding: 24px;
      padding-right: 40px;
      .license {
        position: absolute;
        max-width: 425px;
        width: 100%;
        top: v-bind('licensesHeight');
        left: calc(100% + 40px);
        center {
          display: flex;
          img {
            min-width: 0;
            width: 100%;
          }
        }
      }
    }
  }
  .o-button {
    position: absolute;
    top: 24px;
    right: 24px;
  }
}
.upload-readme {
  display: flex;
  flex-direction: column;
  align-items: center;
  // justify-content: center;
  font-size: 14px;
  .upload-readme-img {
    margin-top: 205px;
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
  max-width: 463px;
  width: 100%;
  color: #000;
  background: #fff;
  padding: 40px 24px;
  border-radius: 16px;
  .download-data {
    .download-title {
      margin-bottom: 8px;
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
</style>
