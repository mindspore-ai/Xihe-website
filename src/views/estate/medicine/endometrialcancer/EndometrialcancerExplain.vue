<script setup>
import backgroundImg from '@/assets/imgs/estate/medicine/cancer/background.png';
import solutionImg1 from '@/assets/imgs/estate/medicine/cancer/solution-img1.png';
import solutionImg2 from '@/assets/imgs/estate/medicine/cancer/solution-img2.png';
import solutionImg3 from '@/assets/imgs/estate/medicine/cancer/solution-img3.png';
import useWindowResize from '@/shared/hooks/useWindowResize.js';
const screenWidth = useWindowResize();
</script>
<template>
  <div class="project-explain">
    <div class="explain-title">项目说明</div>
    <div class="case-background">
      <div class="title">案例背景</div>
      <div class="description">
        <div>
          随着社会经济的发展，人们生活水平提高，疾病谱发生了很大的变化。现今，癌症已经超越感染性疾病、心脑血管疾病，成为危害人民身体健康最重要的原因。子宫内膜癌是最常见的女性生殖系统肿瘤之一，发病率逐年升高，目前仅次于宫颈癌，居女性生殖系统恶性肿瘤的第二位。
        </div>
        <div>
          2018年全球新增病例约37.84万例。随着人类预期寿命的延长和生活习惯的改变，子宫内膜癌的发病率呈上升趋势，且患者趋向于年轻化。在恰当的治疗下，早期子宫内膜癌的5年生存率大于85%，中期子宫内膜癌的5年生存率为49%～71%，而晚期的5年生存率小于17%。因此，建议对暴露于高风险的女性进行筛查。强烈建议对子宫内膜癌和癌前病变筛查以早期诊断并降低发病率和死亡率。子宫内膜癌发病率逐年上升，开展子宫内膜癌筛查已迫在眉睫。
        </div>
        <div class="case-img">
          <img :src="backgroundImg" alt="" class="background-img" />
        </div>
        <div>
          早期子宫内膜在筛查的研究主要集中在微创的组织病理学和细胞病理学方向。
          子宫内膜细胞学检查(ECT)已在许多国家开展，包括意大利、美国和日本。
          子宫内膜细胞学检查（ECT）于1987年被列入日本《老年人保健法》。
          日本高危妇女的子宫内膜癌（EC）死亡率从1950年的20%下降到1999年的8%。
          近20年来，不同地区的学者提出了对子宫内膜采样器的发明和改进，并提出了子宫内膜细胞病理学诊断系统。大量子宫内膜细胞病理切片需要诊断，从而暴露出病理学家的匮乏。
        </div>
        <div>
          随着医学成像技术的发展，医学图像数量正在以指数增加。医学图像的诊断与分析在过去通常由医学专业人员执行，专业人员数量的匮乏以及他们有限的精力与不可避免的主观性，限制了临床诊断和后续治疗的效率深度学习算法，特别是卷积神经网络（CNN），已迅速成为分析医学图像的首选方法。
        </div>
      </div>
    </div>
    <div class="case-intro">
      <div class="title">案例简介</div>
      <div class="subtitle">
        华为&西安美佳家医疗科技有限责任公司子宫内膜癌筛查联合方案
      </div>
      <div class="description">
        <div>
          子宫内膜癌筛查需求的飙升暴露了世界范围内细胞病理学家的严重短缺。基于卷积神经网络的深度学习算法已成功应用于医学图像的分类。因此，西安美佳家医疗科技有限责任公司基于昇思MindSpore
          AI框架在华为昇腾910处理器中成功构建了一套人工智能系统对恶性和良性ECCs进行分类，减少病理学家的工作量，提供决策帮助，促进子宫内膜癌筛查的发展。
        </div>
      </div>
    </div>
    <div class="case-difficulty">
      <div class="title">案例难点</div>
      <div class="description">
        <p>
          人工智能已成功应用于病理图像的识别和恶性、良性肿瘤的识别。然而，关于癌细胞识别的研究相对较少。
        </p>
        <p>
          在现有的研究成果中，建立了一个计算机辅助形态学程序来区分良性和恶性细胞，测量核的几何和密度特征进行分析。然而，增加了对子宫内膜典型的三维形状(细胞核拥挤和重叠)的误判。在另一个实验中，建立了一个子宫内膜组织病理学AI识别系统，尽管它有一个相对较高的假阴性率，因为一些细微的特征是无法检测到的细胞水平。
        </p>
      </div>
    </div>
    <div class="case-solution">
      <div class="title">解决思路</div>
      <div class="description">
        <p>
          在这些研究的启发下，美佳家开发了一个基于CNNs的识别系统来自动识别良性和恶性子宫内膜细胞团块(ECCs)。通过分析细胞团块的结构和细胞学特征，克服上述两种研究的不足。
        </p>
        <div v-if="screenWidth > 820" class="case-img">
          <img :src="solutionImg1" alt="" />
          <img :src="solutionImg2" alt="" class="solution-img" />
        </div>
        <div v-else class="case-img2">
          <img :src="solutionImg3" alt="" class="solution-img" />
        </div>
        <p>
          美佳家共收集113例(42例恶性，71例良性)子宫内膜样本，构建了包含15,913张图像的数据集。该分割网络共获得了39,000个ECCs补丁。然后，分别使用26880和11520个补丁进行训练和测试。在训练集达到100%的前提下，测试集的准确率为93.5%，特异性为92.2%，灵敏度为92.0%，成功建立了自动识别和诊断子宫内膜细胞团块(ECCs)病理图像的人工智能系统。
        </p>
      </div>
    </div>
    <div class="case-advantage">
      <div class="title">案例优势</div>
      <div class="description">
        <p>
          子宫内膜癌筛查需求的飙升暴露了世界范围内细胞病理学家的严重短缺。基于卷积神经网络的深度学习算法已成功应用于医学图像的分类。方案基于子宫内膜细胞数据集
          + 昇思MindSpore全场景AI框架，在atlas800
          9000训练服务器上跑resnet50模型，利用子宫内膜液细胞学结合AI图像分类技术，对ECC癌变细胞进行筛查分类，可以有效减少病理学家的工作量。
        </p>
        <p class="summary">
          子宫内膜癌筛查联合方案具有自动化、高精度、高效率等优势，减少病理学家的工作量，为他们提供了决策帮助，极大的促进子宫内膜癌筛查行业的发展。
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.project-explain {
  .explain-title {
    line-height: 22px;
    font-size: 24px;
    color: #000;
    margin-bottom: 24px;
  }

  .case-background,
  .case-intro,
  .case-difficulty,
  .case-solution,
  .case-advantage {
    margin-bottom: 40px;
    .title {
      line-height: 22px;
      font-size: 18px;
      color: #000;
      margin-bottom: 16px;
    }
    .subtitle {
      line-height: 22px;
      font-size: 16px;
      color: #000;
      margin-bottom: 16px;
    }
    .description {
      font-size: 14px;
      color: #555;
      line-height: 22px;
      .case-img {
        margin: 24px auto;
        padding: 24px 0;
        background: #f5f9fb;
        display: flex;
        flex-direction: column;
        align-items: center;
        img {
          width: 50%;
        }
        .solution-img {
          margin-top: 24px;
        }
      }
      .case-img2 {
        margin: 8px 0;
        img {
          width: 100%;
          height: 322px;
        }
      }
      .summary {
        margin-top: 24px;
      }
    }
  }
  @media screen and (max-width: 820px) {
    .explain-title {
      font-size: 16px;
      line-height: 24px;
      margin-bottom: 16px;
    }
    .case-background,
    .case-intro,
    .case-difficulty,
    .case-solution,
    .case-advantage {
      margin-bottom: 24px;
      .title {
        font-size: 14px;
        line-height: 22px;
        margin-bottom: 8px;
      }
      .subtitle {
        font-size: 12px;
        line-height: 18px;
        margin-bottom: 8px;
      }
      .description {
        font-size: 12px;
        line-height: 18px;
        .case-img {
          margin-top: 8px;
          margin-bottom: 8px;
          padding: 8px;
          .background-img {
            width: 100%;
          }
        }
        .summary {
          margin-top: 16px;
        }
      }
    }
    .case-advantage {
      margin-bottom: 0px;
    }
  }
}
</style>
