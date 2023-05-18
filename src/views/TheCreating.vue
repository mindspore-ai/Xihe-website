<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const i18n = {
  models: {
    new: '新建模型',
    introduce:
      '新建一个模型仓库，你可以将预训练模型文件上传到此仓库，详细操作参考文档。',
    progress1: '创建一个模型仓库',
    progress2: '上传文件',
  },
  datasets: {
    new: '新建数据集',
    introduce:
      '新建一个数据集仓库，你可以将合规的数据集上传到此仓库，详细操作参考文档。',

    progress1: '创建一个数据集仓库',
    progress2: '上传文件',
  },
  projects: {
    new: '新建项目',
    introduce:
      '新建一个项目仓库，你可以将训练或推理代码上传到此仓库，详细操作参考文档。',

    progress1: '创建一个项目仓库',
    progress2: '上传文件',
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
        <div class="introduce">{{ i18n[bannerLabel].introduce }}</div>
      </div>
      <!-- <div class="step">
        <span class="step-step1">1</span>
        <span class="step-text1">{{ i18n[bannerLabel].progress1 }}</span>
        <span class="step-point">························</span>
        <span class="step-step2">2</span>
        <span class="step-text2">{{ i18n[bannerLabel].progress2 }}</span>
      </div> -->
    </div>
  </div>

  <router-view></router-view>
</template>

<style lang="scss" scoped>
.wrap {
  max-width: 1448px;
}
.creating-banner {
  // width: 100%;
  // padding: 0 16px;
  padding-top: 80px;
  background-size: cover;
  background-image: url('@/assets/imgs/banner-head.png');

  .wrap {
    display: flex;
    justify-content: space-between;
    padding: 42px 16px;
    color: #000;
    margin: 0 auto;

    .title {
      padding-bottom: 8px;
      font-size: 36px;
    }
    .introduce {
      font-size: 18px;
    }
    // .step {
    //   margin-top: 22px;
    //   &-step1 {
    //     background-color: #40adff;
    //     display: inline-block;
    //     width: 22px;
    //     text-align: center;
    //     border-radius: 50%;
    //   }
    //   &-text1 {
    //     color: #40adff;
    //     font-size: 16px;
    //     margin: 0 10px;
    //   }
    //   &-point {
    //     display: inline-block;
    //     line-height: 5px;
    //     margin-right: 10px;
    //   }
    //   &-step2 {
    //     border: 2px solid #ffffff;
    //     display: inline-block;
    //     width: 22px;
    //     height: 22px;
    //     text-align: center;
    //     line-height: 18px;
    //     border-radius: 50%;
    //   }
    //   &-text2 {
    //     color: #ffffff;
    //     font-size: 16px;
    //     margin: 0 10px;
    //   }
    // }
  }
}
</style>
