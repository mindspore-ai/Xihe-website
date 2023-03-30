<script setup>
import conceptImg from '@/assets/imgs/estate/medicine/diagnosis/diagnostic-concept.png';
import advantageImg from '@/assets/imgs/estate/medicine/diagnosis/advantage.png';
</script>
<template>
  <div class="project-explain">
    <div class="explain-title">项目说明</div>
    <div class="case-background">
      <div class="title">案例背景</div>
      <div class="description">
        <div>
          病理报告被称为疾病诊断的“金标准”。传统的病理切片分析需要病理医师在显微镜下逐个寻找相关区域进行分析。病理医师每天要分析许多病理切片，一张病理切片通常包含数百万个细胞，工作量之大可想而知，再加上国内病理医师紧缺，病理诊断行业的时效性还有很大的提升空间。
        </div>
        <div>
          AI与诊断病理学的融合，符合诊断病理学现代化发展的趋势，已经展现出巨大的发展潜力。
        </div>
      </div>
    </div>
    <div class="case-intro">
      <div class="title">案例简介</div>
      <div class="description">
        <div>
          病理报告被称为疾病诊断的“金标准”。传统的病理切片分析需要病理医师在显微镜下逐个寻找相关区域进行分析。病理医师每天要分析许多病理切片，一张病理切片通常包含数百万个细胞，工作量之大可锟元方青智慧病理诊断系统以我国病理科的发展需求为基础，依托昇腾AI基础软硬件平台，包括Atlas系列硬件、全场景AI框架昇思MindSpore，对病理诊断方式进行变革，帮助医师快速识别病理细胞，进行精准的分类和定位，从而将医师从基础、琐碎的筛查工作中解放出来，专注于病理的深层研究与诊断。
        </div>
        <div class="case-img">
          <img :src="conceptImg" alt="" />
          <p class="concept-title">锟元方青智慧病理诊断方案</p>
        </div>
      </div>
    </div>
    <div class="case-advantage">
      <div class="title">案例优势</div>
      <div class="description">
        <div>
          当前，锟元方青智慧病理诊断系统已在全国数十家医院成功商用落地，辅助病理医师进行样本数据初筛，提高诊断效率和诊断质量。以在宫颈液基细胞病理诊断中的应用为例，锟元方青智慧病理诊断系统具有三大优势：
        </div>
        <div>
          1、更准确：通过超万例测试验证，可实现15类宫颈细胞的病变分类，敏感性>99%，排阴率
          > 80%，相当于从业15年以上的专业医师。
        </div>
        <div>
          2、更高效：提供疑难疾病的诊断指导，将医师的读片效率从10分钟降至10秒，效率提升60倍。
        </div>
        <div>
          3、更稳定： 支持7*24
          小时无间断自动化运行，自动抓取可见异常，错失自动报警，实现数据0遗漏。
        </div>
        <div class="case-img advantage-img">
          <img :src="advantageImg" alt="" />
          <p class="concept-title">
            基于锟元方青智慧病理平台的宫颈液基细胞病理诊断界面
          </p>
        </div>
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
          width: 64%;
        }
        .concept-title {
          margin-top: 16px;
        }
      }
      .advantage-img {
        margin-bottom: 0;
        img {
          width: 58%;
        }
      }
    }
  }
  .case-advantage {
    margin-bottom: 0;
  }
}
</style>
