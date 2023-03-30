<script setup>
import backgroundImg from '@/assets/imgs/estate/industry/algorithm/algorithm-background.png';
</script>
<template>
  <div class="project-explain">
    <div class="explain-title">项目说明</div>
    <div class="case-background">
      <div class="title">案例背景</div>
      <div class="description">
        <div>
          工业AI是智能制造的一个重要发展方向，有望能有效地推动生产力的发展，也是未来国家间竞争的关键。
          工业质检是工业生产中最重要的环节之一，也是工业转型升级的重要突破口。传统工业质检依靠人力，不仅效率低、出错率高，而且人力成本高，人员易流失。基于AI的工业视觉检测是工业AI的一个重要的内容，主要针对工业生产中的各种产品的进行品质监控，筛选有缺陷的产品。在TCL自身的工业AI视觉实践中，我们发现由于工业生产场景自身的特点，缺陷检测任务经常缺乏足够的异常样本用作训练。因此，在工业质检领域，基于正常样本的弱监督/自监督/无监督算法有着相当重要的价值，甚至在一定程度上可以帮助AI算法在工业领域突破大规模应用的红线。
        </div>
        <div class="case-img">
          <img :src="backgroundImg" alt="" />
        </div>
        <div>
          相关统计数据显示，中国每天在产线上进行目视检查的工人超过350万，其中仅3C行业就超过了150万人。这些质检人员每天都要花费大量的时间去判断工业零件的质量，不但有害员工视力，还会存在速度和稳定性差等问题，对检测效率和质量造成影响。同时，传统的工业质检方法是通过实验，人工用放大镜、显微镜等多种工具选取亮度、颜色、尺寸、形状等特征及其参数来设计判决规则，仅可判别定量缺陷检测、无法自适应，泛用性低，并且人工成本高。
        </div>
      </div>
    </div>
    <div class="case-intro">
      <div class="title">案例简介</div>
      <div class="description">
        <div>
          针对以上的问题，无监督缺陷检测算法在学术界获得了极大的关注同时涌现了大批先进的算法。无监督缺陷检测可以在仅仅使用少量正常样本训练的情况下完成缺陷定位及异常检测的任务。然而，工业视觉领域并不是一个非常开放的领域，社区也不是很活跃，缺乏优秀的开源项目。因此，为了推动无监督异常检测算法在工业视觉领域的应用和研究，在对无监督异常检测进行了大量的创新与实践之后，TCL工业研究院将自己的实践总结成了READ算法库，并启动了READ项目，旨在为工业检测领域提供一个无监督异常检测的框架。
        </div>
        <div class="case-desc">
          READ专注于研发与集成基于无监督监督学习的大规模异常检测算法和模型，重点解决工业质检中小样本和数据长尾问题，通过针对不同行业的业务和数据特点，研发可在无异常（无缺陷）图像上进行自学习和自训练的异常检测技术。未来，READ项目将搭建工业级别的开源数据库和技术生态平台，寻找更加鲁棒的和自动化的自监督训练方法，建立工业异常检测的标准化流程及评测指标，提升工业异常检测技术的性能和跨行业扩展性。
        </div>
        <div>
          Read(Reconstruction or Embedding based Anomaly
          Detection)项目作为第一个工业视觉无监督异常检测框架，目前已经集成了许多学术界前沿的优秀的无监督异常检测算法，可以在仅使用少量正常样本训练的情况下完成缺陷定位及异常检测的任务。主要涉及到的技术有迁移学习、表征学习、Transformer、标准化流、统计分布、无监督学习、弱监督学习等计算机视觉前沿技术。READ提供两个主要功能：<br />
          1）用于实现新的异常检测算法的接口；
          2）用于封装各种异常检测任务的模板。考虑到使用的开发便利，READ框架架构简洁，使用一个统一的架构将全部的算法串接起来，代码模块化，可以使用简单通用的接口调用使用者需求的算法模型，更易调用和阅读。在精度层面，实现了大量sota算法，并保证实现的精度与原作的精度一致。READ框架具有的主要优势有以下三点：算法丰富、开箱即用、精度保证。READ同时支持PyTorch和昇思MindSpore框架的算法训练，适应了不同开发者的多种部署需求，在追求快速落地的同时又满足部分开发者将模型迁移至国产框架上的需求。
        </div>
      </div>
    </div>
    <div class="case-difficulty">
      <div class="title">案例难点</div>
      <div class="description">
        <div>
          1、开发过程是漫长艰辛的，也是困难重重，主要是昇思MindSpore框架还没有稳定下来，我们的算法里面包含很多自定义的或者相对复杂的算子计算API，昇思MindSpore有些还没有实现到位，我们需要自己去“拓荒”，这个过程耗时耗力，往往还会遇到不少问题。开心的是，昇思MindSpore工作人员比较积极配合帮助，在昇思MindSpore和我们的共同努力下，双方都互利共赢，我们算法实现了，昇思MindSpore也加入更新了很多算子，更新速度也比较快。
        </div>
        <div class="case-desc">
          2、从刚开始的欣喜若狂到后面的逐渐平静，开发过程大部分时间是枯燥乏味的。开发昇思MindSpore版本对于我来说就像在一片混沌中寻找光明，因为它没有前车之鉴，需要我们自己去寻找其中的玄机，我在黑暗中慢慢摸索，困难重重。幸运的是，经过不断努力，我们成功了，尽管过程不是那么让人愿意回味，但是不置可否，昇思MindSpore给我们带来了惊喜。
        </div>
        <div>
          3、开发过程中的心酸主要是两方面的：一个是算法本身，另外一个就是框架了。算法方面呢，我们设计的无监督异常检测需要在只有少量正常图片训练的情况下，完成异常检测和缺陷分割两个任务，在没有强监督的情况下完成这个任务确实不简单。现有的sota算法有基于传统算法的，基于CNN的，基于Transformer的，基于normalizing
          flow的，五花八门包罗万象，可以说是深度学习领域的万花筒了，我们团队在开发的时候经常需要像学生时代那样对着论文一句一句过，查漏补缺，基本上大部分主流的模型架构都重新熟悉了一遍。框架方面呢，由于团队成员一开始都是习惯使用的TensorFlow/PyTorch，对于MindSpore并不熟悉，同时由于昇思MindSpore还在快速发展时期，有时候我们需要从头实现一些函数，但是由于Mindspore的开源项目暂时也不是很多，所以我们可以借鉴的代码也比较少，因此有时候大量翻阅MindSpore的API文档也是家常便饭的事情。当然了，做READ项目本身还是一个充满乐趣的事情。对我个人而言，做开源项目最大的收获是获得对于很多的算法更深的理解，同时也确确实实地在社区里留下了自己的东西。
        </div>
      </div>
    </div>
    <div class="case-advantage">
      <div class="title">案例优势</div>
      <div class="description">
        <div>
          由TCL工业研究院基于昇思MindSpore实现的工业AI算法库READ，专注于研发与集成基于无监督监督学习的大规模异常检测算法和模型，重点解决工业质检中小样本和数据长尾问题，通过针对不同行业的业务和数据特点，研发可在无异常（无缺陷）图像上进行自学习和自训练的异常检测技术，旨在为工业检测领域提供一个无监督异常检测的框架。
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
  .case-difficulty,
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
      .case-desc {
        margin: 16px 0;
      }
      .case-img {
        margin: 24px auto;
        // padding: 24px 0;
        background: #f5f9fb;
        display: flex;
        flex-direction: column;
        align-items: center;
        img {
          width: 100%;
        }
        .solution-img {
          margin-top: 24px;
        }
      }
      .summary {
        margin-top: 24px;
      }
    }
  }
  .case-advantage {
    margin-bottom: 0px;
  }
}
</style>
