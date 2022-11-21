<script setup>
import ModelzooCard from '@/components/ModelzooCard.vue';

import taichu from '@/assets/imgs/modelzoo/taichu.png';
import luojia from '@/assets/imgs/modelzoo/luojia.png';
// import codegeex from '@/assets/imgs/modelzoo/codegeex.png';
import pangu from '@/assets/imgs/modelzoo/pangu.png';
import shenlong from '@/assets/imgs/modelzoo/shenlong.png';
import dasheng from '@/assets/imgs/modelzoo/dasheng1.png';

import IconArrow from '~icons/app/arrow-blue';
import OIcon from '@/components/OIcon.vue';
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
    // {
    //   title: 'CodeGeeX',
    //   introduce: '130亿参数的多编程语言代码生成预训练模型',
    //   url: codegeex,
    //   // path: '/modelzoo/codegeex',
    //   openness: true,
    // },
    {
      title: '紫东.太初',
      introduce: '全球首个三模态千亿参数大模型',
      url: taichu,
      path: '/modelzoo/taichu',
      openness: true,
    },
    {
      title: '武大.LuoJia',
      introduce: '全球首个遥感专用框架及最大遥感样本库',
      url: luojia,
      path: '/modelzoo/luojia',
      openness: true,
    },
    {
      title: '鹏程.盘古',
      introduce: '业界首个千亿级参数中文自然语言处理大模型',
      url: pangu,
      path: '/modelzoo/pangu',
      openness: true,
    },
    {
      title: '鹏程.神农',
      introduce: '面向生物医学领域的人工智能平台',
      url: shenlong,
      path: '/modelzoo/shennong',
      openness: true,
    },
    {
      title: '鹏程.大圣',
      introduce: '业界首个千亿参数规模机器视觉分析领域大模',
      url: dasheng,
      openness: false,
    },
  ],
};
function goModelzoo() {
  window.open('https://www.hiascend.com/software/modelzoo');
}
</script>
<template>
  <div class="modelzoo">
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
    <div class="card-lists">
      <div v-for="item in i18n.cardLists" :key="item">
        <ModelzooCard
          :title="item.title"
          :introduce="item.introduce"
          :url="item.url"
          :path="item.path"
          :openness="item.openness"
        />
      </div>
    </div>
    <div class="watch-more" @click="goModelzoo">
      <span class="text">点击去往ModelZoo查看更多大模型</span>
      <o-icon><icon-arrow></icon-arrow></o-icon>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.wrap {
  margin: 0 auto;
  padding: 50px 16px 136px 16px;
  max-width: 1472px;
}
.modelzoo {
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
  .watch-more {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    max-width: 1472px;
    padding-bottom: 64px;
    cursor: pointer;
    &:hover {
      .o-icon {
        transform: translate(3px);
        transition: all 0.2s linear;
      }
    }
    .text {
      text-align: center;
      font-size: 14px;
      font-weight: 400;
      color: #000000;
      line-height: 22px;
    }
    .o-icon {
      font-size: 16px;
      margin-left: 8px;
      transform: translate(0px);
      transition: all 0.2s linear;
    }
  }
  .card-lists {
    margin: 0 auto;
    padding: 50px 16px 136px 16px;
    max-width: 1472px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    row-gap: 24px;
    column-gap: 24px;
    padding: 64px 16px 24px 16px;
  }
}
</style>
