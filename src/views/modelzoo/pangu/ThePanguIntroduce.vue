<script setup>
// import { ref, watch } from 'vue';
// import { useRoute, useRouter } from 'vue-router';
import IconDocument from '~icons/app/document.svg';

import model from '@/assets/imgs/pangu/model.png';
import dataset from '@/assets/imgs/pangu/dataset.png';
import mindspore from '@/assets/imgs/pangu/mindspore.png';
import config from '@/assets/imgs/pangu/config.png';
import require from '@/assets/imgs/pangu/require.png';
</script>

<template>
  <div class="pangu-wrap">
    <div class="pangu-content">
      <div class="pangu-detail">
        <div class="pangu-detail-desc">
          <div class="title">简述</div>
          <p class="info">
            “鹏程·盘古α“由以鹏城实验室为首的技术团队联合攻关，首次基于“鹏城云脑Ⅱ”和国产MindSpore框架的自动混合并行模式实现在2048卡算力集群上的大规模分布式训练，训练出业界首个2000亿参数以中文为核心的预训练生成语言模型。鹏程·盘古α预训练模型支持丰富的场景应用，在知识问答、知识检索、知识推理、阅读理解等文本生成领域表现突出，具备很强的小样本学习能力。
          </p>
          <p class="info">鹏程·盘古α具有以下特点：</p>
          <p class="info">· 业界首个2000亿参数中文自回归语言模型</p>
          <p class="info">· 代码、模型逐步全开源</p>
          <p class="info">· 首创顺序自回归预训练语言模型ALM</p>
          <p class="info">· MindSpore超大规模自动并行技术</p>
          <p class="info">
            ·
            模型基于国产全栈式软硬件协同生态（MindSpore+CANN+昇腾910+ModelArts）
          </p>
        </div>
        <div class="pangu-detail-model">
          <div class="model-title">模型结构</div>
          <div class="model-img">
            <img :src="model" alt="" />
          </div>
          <div class="model-desc">
            上图为鹏程·盘古α模型的网络结构，该模型是基于单向的Transformer
            decoder发展而来。query层堆叠在transformer层之上。query层的基本结构与transformer层相似，只是引入了一个额外的Query
            layer，来预测生成下一个query Q的位置。
          </div>
        </div>
        <div class="pangu-detail-dataset">
          <div class="dataset-title">数据集</div>
          <div class="dataset-subtitle">
            海量语料是预训练模型研究的基础，联合团队从开源开放数据集、common
            crawl网页数据、电子书等收集了近80TB原始数据。
          </div>
          <div class="dataset-img">
            <img :src="dataset" alt="" />
          </div>
          <div class="dataset-desc">
            上图为鹏程·盘古α的数据集处理流程，搭建了面向大型语料库预处理的分布式集群，通过数据清洗过滤、去重、质量评估等处理流程，构建了一个约1.1TB的高质量中文语料数据集，经统计Token数量约为250B规模。通过对不同的开源数据集独立进行处理，完全清除了跟下游任务相关的标签信息，以保证源数据的无偏性。
          </div>
        </div>
        <div class="pangu-detail-mindspore">
          <div class="mindspore-title">MindSpore超大规模自动并行</div>
          <div class="mindspore-subtitle">
            大集群下高效训练千亿至万亿参数模型，用户需要综合考虑参数量、计算量、计算类型、集群带宽拓扑和样本数量等才能设计出性能较优的并行切分策略，模型编码除了考虑算法以外，还需要编写大量并行切分和通信代码。
          </div>
          <div class="mindspore-img">
            <img :src="mindspore" alt="" />
          </div>
          <div class="mindspore-desc">
            MindSpore是业界首个支持全自动并行的框架，MindSpore多维度自动并行，通过数据并行、算子级模型并行、Pipeline模型并行、优化器模型并行、异构并行、重计算、高效内存复用，及拓扑感知调度，实现整体迭代时间最小（计算时间+通信时间）。编程接口高效易用，实现了算法逻辑和并行逻辑解耦，串行代码自动分布式并行。
          </div>
        </div>
        <div class="pangu-detail-config">
          <div class="config-title">软硬件配置</div>
          <div class="config-img">
            <img :src="config" alt="" />
          </div>
        </div>
        <div class="pangu-detail-require">
          <div class="require-title">环境要求</div>
          <div class="require-img">
            <img :src="require" alt="" />
          </div>
          <div class="require-subtitle">环境配置</div>
          <div class="require-lines">
            <OIcon><IconDocument /></OIcon>
            <ul>
              <li>mindspore</li>
              <li>jieba 0.42.1</li>
              <li>sentencepiece 0.1.94</li>
            </ul>
          </div>
        </div>
        <div class="pangu-detail-train">
          <div class="train-title">训练</div>
          <div class="train-subtitle">
            运行如下命令开始训练， MODE 选择 2.6B, 13B 或 200B.
          </div>
          <div class="train-lines">
            <OIcon><IconDocument /></OIcon>
            <ul>
              <li>export MODE=2.6B</li>
              <li>
                bash scripts/run_distribute_train.sh 8 /home/data/
                /home/config/rank_table_8p.json $MODE
              </li>
            </ul>
          </div>
        </div>
        <div class="pangu-detail-inference">
          <div class="inference-title">npu推理</div>
          <div class="inference-info">
            <div>首先下载以下三个文件:</div>
            <ul>
              <li>
                · tokenizier: vocal.vocab 和 vocab.model
                在“$FILE_PATH/tokenizer/”目录
              </li>
              <li>· 模型: 下载模型文件放在“$FILE_PATH/checkpiont_file/”目录</li>
              <li>
                · 策略文件:
                该文件描述了模型的切分策略，文件位于”$FILE_PATH/strategy_load_ckpt/“目录
              </li>
            </ul>
          </div>
          <div class="inference-subtitle">执行推理</div>
          <div class="inference-lines">
            <OIcon><IconDocument /></OIcon>
            <ul>
              <li>$FILE_PATH=/home/your_path</li>
              <li>
                bash scripts/run_distribute_predict.sh 8
                /home/config/rank_table_8p.json ${FILE_PATH}/strategy_load_ckpt
                \
              </li>
              <li>
                ${FILE_PATH}/tokenizer/ ${FILE_PATH}/checkpiont_file filitered
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.pangu-content {
  .pangu-detail {
    padding: 40px 80px;
    background-color: #fff;
    &-desc {
      .title {
        height: 32px;
        line-height: 32px;
        font-size: 24px;
        font-weight: 500;
        color: #000000;
        margin-bottom: 24px;
      }
      .info {
        line-height: 22px;
        font-size: 14px;
        color: #555555;
        margin-bottom: 16px;
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
    &-model {
      overflow: hidden;
      .model-title {
        height: 32px;
        line-height: 32px;
        font-size: 24px;
        font-weight: 500;
        color: #000000;
        margin: 40px 0 24px;
      }
      .model-desc {
        height: 44px;
        line-height: 22px;
        font-size: 14px;
        color: #555555;
        margin-top: 17px;
      }
    }
    &-dataset {
      overflow: hidden;

      .dataset-title {
        height: 32px;
        line-height: 32px;
        font-size: 24px;
        font-weight: 500;
        color: #000000;
        margin: 40px 0 24px;
      }
      .dataset-subtitle {
        height: 22px;
        font-size: 14px;
        color: #555555;
        line-height: 22px;
        margin-bottom: 24px;
      }
      /* .dataset-img {
          } */
      .dataset-desc {
        height: 44px;
        line-height: 22px;
        font-size: 14px;
        color: #555555;
        margin-top: 17px;
      }
    }
    &-mindspore {
      overflow: hidden;
      .mindspore-title {
        height: 32px;
        line-height: 32px;
        font-size: 24px;
        font-weight: 500;
        color: #000000;
        margin: 40px 0 24px;
      }
      .mindspore-subtitle {
        height: 22px;
        font-size: 14px;
        color: #555555;
        line-height: 22px;
        margin-bottom: 24px;
      }
      /* .mindspore-img {
          } */
      .mindspore-desc {
        height: 44px;
        line-height: 22px;
        font-size: 14px;
        color: #555555;
        margin-top: 17px;
      }
    }
    &-config {
      overflow: hidden;
      .config-title {
        height: 32px;
        line-height: 32px;
        font-size: 24px;
        font-weight: 500;
        color: #000000;
        margin: 40px 0 24px;
      }
      .config-img {
        img {
          width: 100%;
        }
      }
    }
    &-require {
      overflow: hidden;
      .require-title {
        height: 32px;
        line-height: 32px;
        font-size: 24px;
        font-weight: 500;
        color: #000000;
        margin: 40px 0 24px;
      }
      .require-img {
        img {
          width: 100%;
        }
      }
      .require-subtitle {
        height: 24px;
        line-height: 24px;
        font-size: 16px;
        color: #000000;
        margin: 24px 0 16px;
      }
      .require-lines {
        background: #f5f6f8;
        display: flex;
        padding: 24px;
        .o-icon {
          font-size: 24px;
          margin-right: 16px;
        }
        ul {
          li {
            font-size: 14px;
            line-height: 22px;
            color: #000000;
          }
        }
      }
    }
    &-train {
      overflow: hidden;
      .train-title {
        height: 32px;
        line-height: 32px;
        font-size: 24px;
        font-weight: 500;
        color: #000000;
        margin: 40px 0 24px;
      }
      .train-subtitle {
        height: 22px;
        line-height: 22px;
        font-size: 14px;
        color: #555555;
        margin: 24px 0 16px;
      }
      .train-lines {
        background: #f5f6f8;
        display: flex;
        padding: 24px;
        .o-icon {
          font-size: 24px;
          margin-right: 16px;
        }
        ul {
          li {
            font-size: 14px;
            line-height: 22px;
            color: #000000;
          }
        }
      }
    }
    &-inference {
      overflow: hidden;
      .inference-title {
        height: 32px;
        line-height: 32px;
        font-size: 24px;
        font-weight: 500;
        color: #000000;
        margin: 40px 0 24px;
      }
      .inference-info {
        div {
          height: 22px;
          line-height: 22px;
          font-size: 14px;
          color: #555555;
          margin-bottom: 8px;
        }
        ul {
          li {
            line-height: 22px;
            font-size: 14px;
            color: #555555;
            margin-bottom: 16px;
            &:last-child {
              margin-bottom: 0;
            }
          }
        }
      }
      .inference-subtitle {
        height: 24px;
        line-height: 24px;
        font-size: 16px;
        color: #000000;
        margin: 24px 0 16px;
      }
      .inference-lines {
        background: #f5f6f8;
        display: flex;
        padding: 24px;
        .o-icon {
          font-size: 24px;
          margin-right: 16px;
        }
        ul {
          li {
            font-size: 14px;
            line-height: 22px;
            color: #000000;
          }
        }
      }
    }
  }
}
</style>
