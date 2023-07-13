<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const i18n = {
  models: {
    new: '新建模型',
    introduce: '新建一个模型仓库，你可以将预训练模型文件上传到此仓库，详细操作',
    reference: '参考文档',
    progress1: '创建一个模型仓库',
    progress2: '上传文件',
    docUrl: 'https://xihe-docs.mindspore.cn/zh/basics/model_ui/',
  },
  datasets: {
    new: '新建数据集',
    introduce: '新建一个数据集仓库，你可以将合规的数据集上传到此仓库，详细操作',
    reference: '参考文档',
    progress1: '创建一个数据集仓库',
    progress2: '上传文件',
    docUrl: 'https://xihe-docs.mindspore.cn/zh/basics/dataset_ui/',
  },
  projects: {
    new: '新建项目',
    introduce: '新建一个项目仓库，你可以将训练或推理代码上传到此仓库，详细操作',

    reference: '参考文档',
    progress1: '创建一个项目仓库',
    progress2: '上传文件',
    docUrl: 'https://xihe-docs.mindspore.cn/zh/basics/project_ui/',
  },
};

const bannerLabel = computed(() => {
  return route.path.split('/')[2];
});
</script>

<template>
  <div class="creating-banner">
    <div class="wrap">
      <div>
        <div class="title">{{ i18n[bannerLabel].new }}</div>
        <div class="introduce">
          {{ i18n[bannerLabel].introduce }}
          <a
            :href="i18n[bannerLabel].docUrl"
            rel="noopener noreferrer"
            target="blank"
            >{{ i18n[bannerLabel].reference }}</a
          >
        </div>
      </div>
    </div>
  </div>

  <router-view></router-view>
</template>

<style lang="scss" scoped>
.wrap {
  max-width: 1448px;
}
.creating-banner {
  padding-top: 80px;
  background-size: cover;
  background-image: url('@/assets/imgs/banner-model.png');

  .wrap {
    display: flex;
    justify-content: space-between;
    padding: 40px 16px;
    color: #000;
    margin: 0 auto;

    .title {
      padding-bottom: 8px;
      font-size: 36px;
    }
    .introduce {
      font-size: 18px;
      a {
        color: #000;
        cursor: pointer;
        text-decoration: underline;
        &:hover {
          color: #0d8dff;
        }
      }
    }
  }
}
</style>
