<script setup>
import wukongModel from '@/assets/imgs/wukong/wukong-model.png';
import wukongDataset from '@/assets/imgs/wukong/wukong-dataset.png';
import wukongSample from '@/assets/imgs/wukong/wukong-sample.png';
</script>
<template>
  <div class="wukong-intro">
    <div class="intro">
      <div class="intro-title">简述</div>
      <div class="intro-detail">
        悟空画画模型是华为诺亚方舟实验室与MindSpore社区联合打造的中文图像生成大模型。它结合了生成与判别模型，借助悟空中文视觉-语言预训练模型的判别能力更好实现了中文文本-图像生成能力。
      </div>
    </div>
    <div class="model">
      <div class="model-title">模型结构与训练</div>
      <div class="model-img">
        <img :src="wukongModel" alt="" />
      </div>
      <div class="model-detail">
        悟空画画模型分别由中文文本编码器以及Stable
        Diffusion生成模型组成。在训练过程中，我们预训练中文图文判别模型，得到一个具有中文图文对齐能力的文本编码器；
        我们结合Stable
        Diffusion图像生成模型和第一步训练得到的文本编码器，在悟空中文多模态数据集上进行训练，得到中文文图生成模型——悟空画画模型。
      </div>
    </div>
    <div class="dataset">
      <div class="dataset-title">数据集</div>
      <div class="dataset-img">
        <img :src="wukongDataset" alt="" />
      </div>
      <div class="dataset-detail">
        <div class="first-step">
          悟空画画模型的训练依赖于悟空数据集，它是目前开源的最大规模的中文多模态数据集。我们首先在百度搜索引擎上利用一百万个中文高频文本作为关键词进行图片搜索，获得接近20亿的原始图文对数据，此时这部分数据中包含了大量的噪声。
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
              <span> 过滤文本中包含隐私/敏感词的样本 </span>
            </li>
          </ul>
          <div class="result">
            最终我们经过过滤得到了一亿较高质量中文图文对，部分样例如下图所示。图中英文为手动翻译结果，不属于数据集本身：
          </div>
        </div>
        <div class="final-sample">
          <div class="sample-img">
            <img :src="wukongSample" alt="" />
          </div>
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
  </div>
</template>
<style lang="scss" scoped>
.wukong-intro {
  .intro {
    margin-bottom: 40px;
    .intro-title {
      line-height: 32px;
      font-size: 24px;
      color: #000000;
      margin-bottom: 24px;
    }
    .intro-detail {
      line-height: 22px;
      font-size: 14px;
      color: #555555;
    }
  }
  .model {
    margin-bottom: 40px;
    .model-title {
      line-height: 32px;
      font-size: 20px;
      color: #000000;
      margin-bottom: 24px;
    }
    .model-img {
      text-align: center;
      margin-bottom: 24px;
      img {
        width: 100%;
      }
    }
    .model-detail {
      line-height: 22px;
      font-size: 14px;
      color: #555555;
    }
  }
  .dataset {
    .dataset-title {
      line-height: 32px;
      font-size: 20px;
      color: #000000;
      margin-bottom: 24px;
    }
    .dataset-img {
      text-align: center;
      margin-bottom: 24px;
      img {
        width: 100%;
      }
    }
    .dataset-detail {
      line-height: 22px;
      font-size: 14px;
      color: #555555;
      .first-step {
        margin-bottom: 16px;
      }
      .second-step {
        margin-bottom: 16px;
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
}
</style>
