<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import wukongModel from '@/assets/imgs/wukong/wukong-model.png';
import wukongDataset from '@/assets/imgs/wukong/wukong-dataset.png';
import abysmView from '@/assets/imgs/wukong/abysm-view.png';
import arkShip from '@/assets/imgs/wukong/ark-ship.png';
import blackHole from '@/assets/imgs/wukong/black-hole.png';
import cityView from '@/assets/imgs/wukong/city-view.png';
import seaRunner from '@/assets/imgs/wukong/sea-runner.png';
import umbrellaWomen from '@/assets/imgs/wukong/umbrella-women.png';
import wukongBanner1 from '@/assets/imgs/wukong/wukong-banner1.png';

// import IconArrowRight from '~icons/app/arrow-right.svg';
import { ArrowRight } from '@element-plus/icons-vue';

import useWindowResize from '@/shared/hooks/useWindowResize.js';

const router = useRouter();
const screenWidth = useWindowResize();

const effectImg = reactive([
  {
    imgUrl: cityView,
    title: '城市夜景 赛博朋克 格雷格·鲁特科夫斯基',
  },
  {
    imgUrl: umbrellaWomen,
    title: '莫奈 撑阳伞的女人 月亮 梦幻',
  },
  {
    imgUrl: seaRunner,
    title: '海上日出时候的奔跑者',
  },
  {
    imgUrl: abysmView,
    title: '来自深渊 风景 绘画 写实',
  },
  {
    imgUrl: arkShip,
    title: '诺亚方舟在世界末日起航 科幻插画',
  },
  {
    imgUrl: blackHole,
    title: ' 时空 黑洞 辐射',
  },
]);

function goExperience() {
  router.push(`/modelzoo/wukong`);
}

// 了解更多
function learnWukongMore() {
  window.open(
    'https://github.com/mindspore-lab/minddiffusion/tree/main/vision/wukong-huahua'
  );
}
</script>
<template>
  <div class="wukong-intro">
    <div class="wukong-bread">
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/modelzoo' }"
          >大模型</el-breadcrumb-item
        >
        <el-breadcrumb-item>悟空画画</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="intro-head">
      <div class="wukong-left">
        <img draggable="false" :src="wukongBanner1" alt="" />
        <!-- <img v-else draggable="false" :src="wukongBanner2" alt="" /> -->
      </div>

      <div class="wukong-right">
        <div class="wukong-right-top">
          <div class="wukong-right-title">悟空.画画</div>
          <div class="wukong-right-content">
            借助目前最大的中文开源多模态数据集悟空数据集进行训练，悟空-画画模型拥有优秀的中文文本-图像生成能力。模型能够识别各类场景描述与绘画风格，给用户带来良好的使用体验。
          </div>
        </div>

        <div class="right-button">
          <OButton
            type="outline"
            :size="screenWidth < 820 ? 'mini' : 'medium'"
            animation
            @click="goExperience"
          >
            在线体验
          </OButton>
          <OButton
            type="primary"
            :size="screenWidth < 820 ? 'mini' : 'medium'"
            animation
            @click="learnWukongMore"
          >
            了解更多
            <!-- <template #suffix>
              <OIcon><IconArrowRight /></OIcon>
            </template> -->
          </OButton>
        </div>
      </div>
    </div>
    <div class="intro-detail">
      <div class="intro">
        <div class="intro-title">简述</div>
        <div class="intro-concept">
          Wukong-Huahua是基于扩散模型的中文以文生图大模型，由华为诺亚团队携手中软分布式并行实验室、昇腾计算产品部联合开发，使用昇思框架(MindSpore)+昇腾(Ascend)软硬件解决方案实现。该模型是基于目前最大的中文开源多模态数据集悟空数据集进行训练得来，具备优秀的中文文本-图像生成能力，能够实现多场景的绘画风格，可生成高质量的图像，给用户带来良好的使用体验。
        </div>
      </div>
      <div class="model">
        <div class="model-title">模型结构与训练</div>
        <div class="model-img">
          <img :src="wukongModel" alt="" />
        </div>
        <div class="model-detail">
          悟空画画模型分别由中文文本编码器以及Stable
          Diffusion生成模型组成。具体的训练方法如下：
          <div class="train-method">
            <div class="first-method">
              1.预训练中文图文判别模型，得到一个具有中文图文对齐能力的文本编码器；
            </div>
            <div class="seconde-method">
              2.我们结合Stable
              Diffusion图像生成模型和第一步训练得到的文本编码器，在悟空中文多模态数据集上进行训练，得到中文文图生成模型——悟空画画模型。
            </div>
          </div>
        </div>
      </div>
      <div class="dataset">
        <div class="dataset-title">悟空中文多模态数据集</div>
        <div class="dataset-img">
          <img :src="wukongDataset" alt="" />
        </div>
        <div class="dataset-detail">
          <div class="first-step">
            悟空画画模型的训练依赖于悟空数据集，它是当时已开源的最大规模的中文多模态数据集。我们首先在百度搜索引擎上利用一百万个中文高频文本作为关键词进行图片搜索，获得接近20亿的原始图文对数据，此时这部分数据中包含了大量的噪声。
          </div>
          <div class="second-step">
            <div>
              第二步我们对这些原始数据进行多种方式的筛选清洗，主要操作包括：
            </div>
            <ul class="content">
              <li>
                <span class="content-item">•</span>
                <span>
                  对图片的尺寸进行过滤，去除边长小于200px或者长宽比超出1/3~3范围的样本
                </span>
              </li>
              <li>
                <span class="content-item">•</span>
                <span>
                  去除文本为无意义的词如 “Image”, “图片”，“照片”等的样本
                </span>
              </li>
              <li>
                <span class="content-item">•</span>
                <span>
                  过滤文本长度过短，文本出现频次过高（如“如下图所示”等描述文本）的样本
                </span>
              </li>
              <li>
                <span class="content-item">•</span>
                <span> 过滤文本中包含隐私/敏感词的样本 </span>
              </li>
            </ul>
            <div class="result">
              最终我们经过过滤得到了一亿较高质量中文图文对。
            </div>
          </div>
          <div class="final-sample">
            <div class="more-dataset">
              <div>
                <span> 更多数据集相关细节可以参考</span>
                <a
                  href="https://wukong-dataset.github.io/wukong-dataset/"
                  target="_blank"
                >
                  https://wukong-dataset.github.io/wukong-dataset/
                </a>
                <span>。</span>
              </div>
              <div class="conclusion">
                <span>
                  进一步地，在训练悟空画画模型时，我们对悟空数据集的数据根据图文匹配分数、水印分数以及艺术性分数
                </span>
                <a
                  href="https://github.com/christophschuhmann/improved-aesthetic-predictor"
                  target="_blank"
                >
                  https://github.com/christophschuhmann/improved-aesthetic-predictor
                </a>
                <span>
                  再次进行筛选，最终获得25M左右的数据进行训练。该部分数据具有较高的图像质量，并对常见文本内容进行了良好的覆盖，使得训练得到的悟空画画模型对文本拥有广泛的识别能力，并能根据不同的提示词生成多样的图片风格。
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="generating-effect">
        <div class="title">生成效果：</div>
        <div class="effect-list">
          <div v-for="item in effectImg" :key="item.title" class="effect-item">
            <div class="effect-img">
              <img :src="item.imgUrl" alt="" />
            </div>
            <div class="text">{{ item.title }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.wukong-intro {
  padding: 120px 16px 64px;
  margin: 0 auto;
  max-width: 1472px;
  height: 100%;
  @media screen and (max-width: 820px) {
    padding: 48px 0px 40px;
  }
  .wukong-bread {
    margin-bottom: 40px;
    @media screen and (max-width: 820px) {
      display: none;
    }
    :deep(.el-breadcrumb) {
      font-size: 12px;
      line-height: 18px;
      .el-breadcrumb__item {
        .el-breadcrumb__inner {
          color: #555;
        }
        &:last-child .el-breadcrumb__inner {
          color: #000;
        }
      }
      // :deep(.el-breadcrumb__item:last-child .el-breadcrumb__inner) {
      //   // color: #fff !important;
      //   z-index: 99;
      // }
      // :deep(.el-breadcrumb__item:first-child .el-breadcrumb__inner) {
      //   color: #b2b2b2 !important;
      //   z-index: 99;
      // }
    }
  }
  .intro-head {
    padding: 40px;
    background-color: #fff;
    box-shadow: 0px 1px 5px 0px rgba(45, 47, 51, 0.1);
    display: flex;
    margin: 40px 0px;
    border-radius: 16px;
    @media screen and (max-width: 820px) {
      padding: 16px;
      margin: 16px;
    }
    .wukong-left {
      margin-right: 40px;
      @media screen and (max-width: 820px) {
        display: none;
      }
      img {
        width: 416px;
      }
    }
    .wukong-right {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .wukong-right-top {
        .wukong-right-title {
          line-height: 48px;
          font-size: 36px;
          color: #000000;
          margin-bottom: 16px;
          @media screen and (max-width: 820px) {
            font-size: 20px;
            line-height: 32px;
            font-weight: 300;
            margin-bottom: 16px;
          }
          @media screen and (max-width: 768px) {
            font-size: 16px;
            line-height: 24px;
            font-weight: 300;
            margin-bottom: 8px;
          }
        }
        .wukong-right-content {
          font-size: 14px;
          color: #555555;
          line-height: 22px;
          @media screen and (max-width: 820px) {
            margin-bottom: 24px;
            font-size: 14px;
            line-height: 18px;
            font-weight: 400;
          }
          @media screen and (max-width: 768px) {
            margin-bottom: 16px;
            font-size: 12px;
            line-height: 18px;
            font-weight: 400;
          }
        }
      }
      .right-button {
        .o-button:first-child {
          margin-right: 16px;
          @media screen and (max-width: 820px) {
            margin-right: 12px;
          }
        }
      }
    }
  }
  .intro-detail {
    background: #ffffff;
    border-radius: 16px;
    padding: 40px 80px;
    @media screen and (max-width: 820px) {
      padding: 24px 16px;
      margin: 16px 16px 0;
    }
    .intro {
      margin-bottom: 40px;
      @media screen and (max-width: 768px) {
        margin-bottom: 24px;
      }
      .intro-title {
        line-height: 32px;
        font-size: 24px;
        color: #000000;
        margin-bottom: 24px;
        @media screen and (max-width: 768px) {
          font-size: 14px;
          line-height: 22px;
          margin-bottom: 8px;
        }
      }
      .intro-concept {
        line-height: 22px;
        font-size: 14px;
        color: #555555;
        @media screen and (max-width: 768px) {
          font-size: 12px;
          line-height: 18px;
        }
      }
    }
    .model {
      margin-bottom: 40px;
      @media screen and (max-width: 768px) {
        margin-bottom: 24px;
      }
      .model-title {
        line-height: 32px;
        font-size: 20px;
        color: #000000;
        margin-bottom: 24px;
        @media screen and (max-width: 768px) {
          font-size: 14px;
          line-height: 22px;
          margin-bottom: 8px;
        }
      }
      .model-img {
        text-align: center;
        margin-bottom: 24px;
        @media screen and (max-width: 768px) {
          margin-bottom: 8px;
        }
        img {
          width: 100%;
        }
      }
      .model-detail {
        line-height: 22px;
        font-size: 14px;
        color: #555555;
        @media screen and (max-width: 768px) {
          font-size: 12px;
          line-height: 18px;
        }
        .train-method {
          text-indent: 10px;
        }
      }
    }
    .dataset {
      margin-bottom: 40px;
      @media screen and (max-width: 768px) {
        margin-bottom: 24px;
      }
      .dataset-title {
        line-height: 32px;
        font-size: 20px;
        color: #000000;
        margin-bottom: 24px;
        @media screen and (max-width: 768px) {
          font-size: 14px;
          line-height: 22px;
          margin-bottom: 8px;
        }
      }
      .dataset-img {
        text-align: center;
        margin-bottom: 24px;
        @media screen and (max-width: 768px) {
          margin-bottom: 8px;
        }
        img {
          width: 100%;
        }
      }
      .dataset-detail {
        line-height: 22px;
        font-size: 14px;
        color: #555555;
        @media screen and (max-width: 768px) {
          font-size: 12px;
          line-height: 18px;
        }
        .first-step {
          margin-bottom: 16px;
          @media screen and (max-width: 768px) {
            margin-bottom: 0px;
          }
        }
        .second-step {
          margin-bottom: 16px;
          @media screen and (max-width: 768px) {
            margin-bottom: 0px;
          }
          ul {
            li {
              text-indent: 10px;
              .content-item {
                display: inline-block;
                font-size: 18px;
                color: #555;
                margin-right: 4px;
              }
            }
          }
          .result {
            margin-bottom: 24px;
            @media screen and (max-width: 768px) {
              margin-bottom: 8px;
            }
          }
        }
        .final-sample {
          .sample-img {
            text-align: center;
            margin-bottom: 24px;
            img {
              width: 100%;
            }
          }
          .more-dataset {
            line-height: 22px;
            font-size: 14px;
            color: #555555;
            a {
              color: #0d8dff;
            }
          }
        }
      }
    }
    .generating-effect {
      .title {
        line-height: 32px;
        font-size: 20px;
        color: #000000;
        margin-bottom: 24px;
        @media screen and (max-width: 768px) {
          font-size: 14px;
          line-height: 22px;
          margin-bottom: 8px;
        }
      }
      .effect-list {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        .effect-item {
          width: 32%;
          margin-bottom: 24px;
          @media screen and (max-width: 768px) {
            margin-bottom: 8px;
          }
          .text {
            line-height: 22px;
            font-size: 14px;
            color: #555555;
            text-align: center;
            @media screen and (max-width: 768px) {
              line-height: 20px;
              font-size: 12px;
            }
          }
          .effect-img {
            margin-bottom: 10px;
            width: 100%;
            img {
              width: 100%;
            }
          }
        }
      }
    }
  }
}
</style>
