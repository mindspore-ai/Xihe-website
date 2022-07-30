<script setup>
import IconArrow from '~icons/app/arrow-blue';
import { ArrowRight } from '@element-plus/icons-vue';

function knowMore() {
  window.open('https://github.com/WHULuoJiaTeam/luojianet');
}
function enterLuoJiaNet() {
  window.open('http://58.48.42.237/luojiaNet/user/login');
}
function enterLuoJiaSet() {
  window.open('http://58.48.42.237/luojiaSet/user/login?redirect=%2F');
}
</script>
<template>
  <div class="luojia">
    <div class="luojia-main">
      <div class="bread">
        <el-breadcrumb :separator-icon="ArrowRight">
          <el-breadcrumb-item :to="{ path: '/modelzoo' }"
            >大模型</el-breadcrumb-item
          >
          <el-breadcrumb-item>武汉.Luojia</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="luojia-title">
        <img src="@/assets/imgs/modelzoo2.png" alt="" />
        <div class="luojia-title-intro">
          <p class="headline">武汉.Luojia</p>
          <p class="text">
            腾AI团队联合研发，是遥感领域首个国产化自主可控的遥感专用机器学习框架，针对遥感数据像幅尺寸大、数据通道多、尺度变化大等特性，
            具备内存可扩展、尺度通道灵活创建、数据通道自主优选、框架与数据协同处理的特点。可兼容已有深度学习框架，
            并提供用户友好的、可拖拽的交互式网络结构搭建界面的方法。能屏蔽不同硬件设备间差异，同时管理多样化的遥感影像样本库LuoJiaSET，
            实现遥多源感影像样本的高效存储管理。
          </p>
          <div class="entrance">
            <p class="entrance-item" @click="enterLuoJiaSet">
              <span class="entrance-item-title">LuoJiaSET入口</span>
              <o-icon><icon-arrow></icon-arrow></o-icon>
            </p>
            <p class="entrance-item" @click="enterLuoJiaNet">
              <span class="entrance-item-title">LuoJiaNET入口</span>
              <o-icon><icon-arrow></icon-arrow></o-icon>
            </p>
            <div class="entrance-item" @click="knowMore">
              <span class="entrance-item-title">了解更多</span>
              <o-icon><icon-arrow></icon-arrow></o-icon>
            </div>
          </div>
        </div>
      </div>
      <div class="sketch">
        <p class="sketch-title">简述</p>
        <p class="sketch-content">
          LuoJiaNET遥感专用深度学习框架，是遥感领域首个自主可控的专用机器学习框架。针对遥感数据像幅尺寸大、数据通道多、尺度变化大等特性，具备内存可扩展、尺度通道灵活创建、数据通道自主优选、框架与数据协同处理的特点。其与国产人工智能硬件NPU深度融合，可支持CPU、GPU、NPU等计算设备，形成融合探测机理与地学知识的统一计算图表达、编译优化、图算融合、自动混合并行的新一代遥感智能解译框架。LuoJiaNET构建了针对遥感影像“场景-目标-像素”多层级任务的遥感应用模型，包括场景检索、目标检测、地物分类、变化检测、多视角三维重建等五大类模型。
        </p>
        <p class="sketch-content">
          LuoJiaSET是遥感领域满足OGC标准的大规模遥感影像样本库，其制定了支持全球范围的遥感影像样本分类标准、标注规范，建立涵盖不同遥感任务的统一分类体系，形成样本要素的采集要求、内容和流程规范，可支持多级别、多类型遥感影像样本库的采集、制作、管理、共享、应用。针对当前现有样本数据集面临的问题：1）分类体系不统一。2）样本数据集传感器种类单一，通常样本库都是全色或者RGB彩色，缺少高光谱、红外、SAR遥感影像的样本；且通常是二维数据，缺乏三维数据。3）现有数据空间跨度有限、时间覆盖不均，导致模型泛化能力弱。4）样本集受标注人员水平限制，质量参差不齐。LuoJiaSET建立统一类别体系，提供大量数据集，其覆盖范围广、时间跨度大、涵盖传感器种类多，同时提供标准化的标注工具，大幅提升影像标注效率。
        </p>
        <h4 class="center">Luojia系列总体架构</h4>
        <img
          class="architecture-img"
          src="@/assets/imgs/luojia/luojia-1.png"
          alt=""
        />
        <h4 class="left">LuoJiaNET支持通道优选</h4>
        <p class="text-class">
          基于自研LuoJiaNET框架，使用数据通道自适应优选模块，对高光谱遥感影像（尺寸为200×145×145，分辨率为20m）进行直接处理得到的分类结果为：
        </p>
        <img class="img-class" src="@/assets/imgs/luojia/luojia-2.png" />
        <img class="img-class" src="@/assets/imgs/luojia/luojia-3.png" />
        <h4 class="left">LuoJiaNET支持遥感经验知识引导</h4>
        <p class="text-class">
          大量实验表明：在植被指数、干旱指数、建筑物指数、地形指数等多个遥感经验知识模型引导下，深度网络的分类性能可以得到较为明显的提升。
        </p>
        <div class="guide-box">
          <img
            class="img-class guide-left"
            src="@/assets/imgs/luojia/luojia-4.png"
          />
          <img
            class="img-class guide-right"
            src="@/assets/imgs/luojia/luojia-5.png"
          />
        </div>
        <h4 class="left">LuoJiaNET支持大幅面处理</h4>
        <p class="text-class">
          基于自研LuoJiaNET框架，使用算子等价分解的分布式计算方式，对整张大幅遥感影像（尺寸为4×6000×6000，分辨率为2m）进行直接处理得到的分类结果：
        </p>
        <img class="img-class" src="@/assets/imgs/luojia/luojia-6.png" />
        <img class="img-class" src="@/assets/imgs/luojia/luojia-7.png" />
        <h4 class="left">LuoJiaSET遥感影像样本库概况</h4>
        <div class="luojia-set">
          <div class="general-situation">
            <p><span class="circle"></span>数据集：73个 （武大19个）</p>
            <p><span class="circle"></span>原始样本数量：约143万张</p>
            <p><span class="circle"></span>折算512×512尺寸：约256万张</p>
            <p><span class="circle"></span>多光谱样本：5个 （62万张）</p>
            <p><span class="circle"></span>高光谱样本：1个</p>
            <p><span class="circle"></span>SAR影像样本：4个（1.3万张）</p>
          </div>
          <div class="date-situation">
            <img class="img-class" src="@/assets/imgs/luojia/luojia-8.png" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.luojia {
  width: 100%;
  height: 100%;
  background-color: #f5f6f8;
}
.luojia-main {
  max-width: 1472px;
  margin: 0 auto;
  padding: 80px 0 64px 0;
  .bread {
    margin: 40px 0;
    .el-breadcrumb {
      height: 21px;
      line-height: 21px;
      .el-breadcrumb__item {
        :deep(.el-breadcrumb__inner.is-link) {
          color: #555;
          font-weight: 400;
          &:hover {
            color: #0d8dff;
          }
        }
        :deep(.el-breadcrumb__separator.el-icon) {
          color: #555;
        }
      }
      :deep(.el-breadcrumb__item:last-child .el-breadcrumb__inner) {
        color: #000;
      }
    }
  }
}
.luojia-title {
  padding: 75px 80px 75px 40px;
  display: flex;
  justify-content: space-between;
  background-color: #fff;
  margin-bottom: 24px;
  img {
    width: 392px;
    height: 220px;
    margin-right: 105px;
  }
  &-intro {
    flex: 1;
    padding: 5px 0;
    .headline {
      font-size: 36px;
      font-weight: 300;
      color: #000000;
      line-height: 48px;
    }
    .text {
      font-size: 14px;
      color: #555555;
      line-height: 22px;
      margin: 15px 0 37px 0;
    }
    .entrance {
      display: flex;
      &-item {
        margin-right: 49px;
        display: flex;
        cursor: pointer;
        .o-icon {
          transform: translate(0px);
          transition: all 0.2s linear;
        }
        &:hover {
          .o-icon {
            transform: translate(3px);
            transition: all 0.2s linear;
          }
        }
        &-title {
          margin-right: 8px;
        }
      }
    }
  }
}
.sketch {
  background-color: #fff;
  padding: 40px 80px;
  &-title {
    font-size: 24px;
    font-weight: 500;
    color: #000000;
    line-height: 32px;
    margin-bottom: 24px;
  }
  &-content {
    margin-bottom: 24px;
    font-size: 14px;
    font-weight: 400;
    color: #555555;
    line-height: 22px;
  }
  .center {
    font-size: 24px;
    color: #000000;
    line-height: 32px;
    margin-bottom: 24px;
    text-align: center;
  }
  .architecture-img {
    width: 100%;
  }
  .left {
    font-size: 24px;
    color: #000000;
    line-height: 32px;
    margin: 39px 0 16px 0;
  }
  .text-class {
    font-size: 14px;
    font-weight: 400;
    color: #555555;
    line-height: 22px;
  }
  .img-class {
    width: 100%;
    margin-top: 24px;
  }
  .guide-box {
    // display: flex;
    .guide-left {
      width: 434px;
      height: 523px;
      margin-right: 15px;
    }
    .guide-right {
      width: 808px;
      height: 547px;
    }
  }
  .luojia-set {
    display: flex;
    align-items: center;
    .general-situation {
      width: 260px;
      font-size: 14px;
      font-weight: 400;
      color: #555555;
      line-height: 22px;
      p {
        display: flex;
        align-items: center;
      }
      .circle {
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background-color: #555;
        margin-right: 14px;
      }
    }
    .date-situation {
      flex: 1;
    }
  }
}
</style>
