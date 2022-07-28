<script setup>
import ModelzooCard from '@/components/ModelzooCard.vue';

let i18n = {
  head: {
    title: '大模型',
    introduce: '在线体验预训练超大模型任务',
    btn: '新建模型',
    count: '总数',
  },
  back: '返回上一级',
  taskSort: '应用分类',
  tagPlacholder: '请输入tag名称',
  more: '更多',
  clear: '清除',
  cardLists: [
    {
      title: '紫东.太初',
      introduce: '全球首个三模态千亿参数大模型',
      url: '/img/modelzoo/modelzoo-taichu.png',
      path: '/modelzoo/taichu',
    },
    {
      title: '武大.Luojia',
      introduce: '全球首个遥感专用框架及最大遥感样本库',
      url: '/img/modelzoo/modelzoo-luojia.png',
    },
    {
      title: '鹏程.盘古',
      introduce: '业界首个千亿级参数中文自然语言处理大模型',
      url: '/img/modelzoo/modelzoo-pangu.png',
    },
    {
      title: '鹏程.神农',
      introduce: '面向生物医学领域的人工智能平台',
      url: '/img/modelzoo/modelzoo-shenlong.png',
    },
    {
      title: '鹏程.大圣',
      introduce: '业界首个千亿参数规模机器视觉分析领域大模',
      url: '/img/modelzoo/modelzoo-dasheng.png',
    },
  ],
};
</script>
<template>
  <div class="model-page">
    <div class="model-head">
      <div class="wrap">
        <div class="banner-left">
          <div class="title">{{ i18n.head.title }}</div>
          <div class="introduce">
            {{ i18n.head.introduce }}
          </div>
        </div>
      </div>
    </div>
    <div class="wrap">
      <div v-for="item in i18n.cardLists" :key="item">
        <ModelzooCard
          :title="item.title"
          :introduce="item.introduce"
          :url="item.url"
          :path="item.path"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.wrap {
  margin: 0 auto;
  // padding: 50px 16px 136px 16px;
  max-width: 1472px;
}
.model-page {
  // background-color: #f5f6f8;

  .model-head {
    padding-top: 80px;
    background-size: cover;
    background-image: url('@/assets/imgs/banner-head.png');
    .wrap {
      display: flex;
      justify-content: space-between;
      padding: 42px 16px;
      color: #fff;
      .title {
        padding-bottom: 8px;
        font-size: 36px;
      }
      .introduce {
        padding-right: 24px;
        font-size: 18px;
        .reference {
          color: #4dcdff;
        }
      }
      .banner-right {
        display: flex;
        align-items: center;
      }
    }
  }
  .wrap {
    margin: 0 auto;
    padding: 50px 16px 136px 16px;
    max-width: 1472px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    row-gap: 24px;
    column-gap: 24px;
    padding: 64px 16px;
  }
}
</style>
