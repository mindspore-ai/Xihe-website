<script setup>
import ModelzooCard from './ModelzooCard.vue';
import AppContent from '@/components/AppContent.vue';

import taichu from '@/assets/imgs/modelzoo/taichu.png';
import luojia from '@/assets/imgs/modelzoo/Luojia.png';
import shenlong from '@/assets/imgs/modelzoo/shenlong.png';
import dasheng from '@/assets/imgs/modelzoo/dasheng.png';
import wukong from '@/assets/imgs/modelzoo/wukong.png';
import TextDetector from '@/assets/imgs/modelzoo/text-detector.png';

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
    {
      title: 'AI文本检测器',
      introduce:
        '根据长短文本的不同特性，华为诺亚方舟实验室提出了一种基于PU学习的多尺度AI生成文本检测器MPU，能够在各种场景下识别由AI生成的文字。',
      url: TextDetector,
      path: '/modelzoo/text-detector',
      openness: true,
    },
    {
      title: '悟空画画',
      introduce:
        '华为诺亚方舟实验室与MindSpore社区联合打造的中文图像生成大模型',
      url: wukong,
      path: '/modelzoo/wukong',
      openness: true,
    },
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

function goMindformers() {
  window.open('https://gitee.com/mindspore/mindformers', '_blank');
}

function goAscend() {
  window.open('https://www.hiascend.com/zh/software/modelzoo', '_blank');
}
</script>
<template>
  <div class="modelzoo">
    <div class="modelzoo-head">
      <div class="wrap">
        <div class="banner-left">
          <div class="title">{{ i18n.head.title }}</div>
          <div class="introduce">
            {{ i18n.head.introduce }}
          </div>
        </div>
      </div>
    </div>

    <AppContent :mobile-top="16">
      <div class="card-lists">
        <div v-for="item in i18n.cardLists" :key="item" class="card-item">
          <ModelzooCard
            :title="item.title"
            :introduce="item.introduce"
            :url="item.url"
            :path="item.path"
            :openness="item.openness"
          />
        </div>
      </div>

      <div class="watch-more">
        <div class="more-item" @click="goMindformers">
          <span class="text">点击获取MindSpore更多大模型</span>
          <o-icon><icon-arrow></icon-arrow></o-icon>
        </div>
        <div class="more-item" @click="goAscend">
          <span class="text">点击访问昇腾ModelZoo</span>
          <o-icon><icon-arrow></icon-arrow></o-icon>
        </div>
      </div>
    </AppContent>
  </div>
</template>

<style lang="scss" scoped>
.modelzoo {
  .modelzoo-head {
    padding-top: 80px;
    background-size: cover;
    background-image: url('@/assets/imgs/modelzoo/modelzoo-banner.png');
    .wrap {
      max-width: 1472px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      padding: 104px 16px;
      color: #000;
      .title {
        padding-bottom: 8px;
        font-size: 36px;
        @media screen and (max-width: 768px) {
          font-size: 20px;
          line-height: 28px;
          font-weight: 400;
        }
      }
      .introduce {
        padding-right: 24px;
        font-size: 18px;
        @media screen and (max-width: 768px) {
          font-size: 12px;
          font-weight: 400;
          line-height: 18px;
        }
        .reference {
          color: #4dcdff;
        }
      }
      .banner-right {
        display: flex;
        align-items: center;
      }
    }
    @media screen and (max-width: 821px) {
      padding-top: 48px;
      .wrap {
        padding: 44px 16px 62px;
      }
    }
  }
  .watch-more {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    margin-top: 64px;
    max-width: 1472px;

    @media screen and (max-width: 1080px) {
      margin-top: 40px;
    }
    @media screen and (max-width: 820px) {
      margin-top: 24px;
    }

    @media screen and (max-width: 768px) {
      flex-direction: column;
    }

    .more-item {
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      text-align: center;

      & + .more-item {
        margin-left: 64px;
        @media screen and (max-width: 768px) {
          margin-left: 0;
          margin-top: 8px;
        }
      }

      &:hover {
        .o-icon {
          transform: translate(3px);
          transition: all 0.2s linear;
        }
      }
      .text {
        font-size: 14px;
        font-weight: 400;
        color: #000000;
        line-height: 22px;
        @media screen and (max-width: 768px) {
          font-size: 12px;
          line-height: 22px;
        }
      }
      .o-icon {
        font-size: 16px;
        margin-left: 8px;
        transform: translate(0px);
        transition: all 0.2s linear;
        @media screen and (max-width: 768px) {
          font-size: 12px;
          display: inline-block;
        }
      }
    }
  }
  .card-lists {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 24px;
    @media screen and (max-width: 821px) {
      grid-template-columns: repeat(2, 1fr);
      grid-gap: 16px;
    }
    @media screen and (max-width: 768px) {
      grid-template-columns: repeat(1, 1fr);
    }
  }
}
</style>
