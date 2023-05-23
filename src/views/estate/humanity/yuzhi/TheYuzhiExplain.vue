<script setup></script>
<template>
  <div class="explain">
    <p class="title-1">项目说明</p>
    <p class="title-2">案例背景</p>
    <p class="text-1">
      不少人都有过这样的“心动”体验：上班路上打开网易新闻，推荐内容恰好是自己最近关注的行业动态；下班途中打开网易云音乐，惊喜的发现了几个小众宝藏歌手，忍不住直呼“网易云真是太懂我了！”个性化的推荐机制像一个贴心的朋友，在互联网的海量信息中，总能捕捉到最合你心意的那个。
    </p>
    <p class="title-3">案例简介</p>
    <p class="text-1">
      作为国内专业从事游戏与泛娱乐AI研究和应用的顶尖机构，网易伏羲于2021年起着力打造“玉知”多模态理解大模型。基于图片-文本双塔结构，先后训练了2亿、4亿、9亿参数的“玉知”版本。同时，利用网易伏羲开源的EET高效推理框架，对模型压缩、算法适配、硬件底层等方面进行优化，使其推理速度提升4倍，满足了线上的高并发需求，降低了部署资源的损耗。
    </p>
    <div class="img-container">
      <img
        class="img-introduction"
        src="@/assets/imgs/estate/humanity/yuzhi/introduction-1.png"
        alt=""
      />
      <p class="img-intro">
        在业务数据集的zero-shot评测中，“玉知”多模态理解大模型优于Chinese-CLIP的CN-CLIPViT-H/14
      </p>
    </div>
    <p class="text-2">
      “玉知”多模态理解大模型目前已在网易的多个业务场景中落地验证，为个性化推荐机制保驾护航：网易新闻基于“玉知”构建的图文内容表征，在推荐环节采用基于该图文向量的dropoutnet召回优化，对召回源、列表页视频试投、列表页试投整体等效果明显改进，实现视频和整体大盘的业务指标提升；网易云音乐基于“玉知”构建的内容表征引擎和内容相似检索引擎，在云音乐视频、长音频、广告等多个业务中，实现了对内容冷启动效率、CTR预估模型的优化，带来显著收益。
    </p>
    <div class="img-container">
      <img
        class="img-introduction2"
        src="@/assets/imgs/estate/humanity/yuzhi/introduction-2.png"
        alt=""
      />
    </div>
    <p class="title-3">解决思路</p>
    <p class="text-1">
      为了更好的使能大模型应用创新，昇腾AI构建了从规划、开发到产业化的大模型全流程使能体系，并于2022年正式发布了昇腾AI大模型开发使能平台，打通了大模型从开发到部署的全流程。
      <br />在大模型的开发上，通过昇思MindSpore提供的自动混合并行API来加速训练过程，利用高阶的Transformer
      API，百行代码实现千亿级参数的模型开发，同时获得更好的模型性能；为加速大模型场景化适配，打造了丰富的微调套件，已成功应用于紫东太初大模型开放服务平台建设，支持小样本训练和模型一键微调；在大模型的推理部署上，昇腾AI提供的模型压缩工具，在精度基本无损的情况下，降低了70%计算量，提升了20%以上的推理性能。
      <br />
      <br />
      为了给用户带来更好的智能体验，网易伏羲联合昇思MindSpore及华为诺亚团队，充分分析互联网行业数据集特性，对多模态模型结构进行优化，优选合适编码器并采用多阶段训练模式，基于昇腾AI大模型开发使能平台，共同打造了玉知-悟空图文理解大模型。
    </p>
    <div class="img-container">
      <img
        class="img-method"
        src="@/assets/imgs/estate/humanity/yuzhi/solve-method.png"
        alt=""
      />
    </div>
    <p class="title-3">案例优势</p>
    <p class="text-1">
      玉知-悟空图文理解大模型可广泛应用在互联网推荐搜索等业务中，通过提取图文的特征进行相关的检索。在网易视频推荐业务的应用中，玉知-悟空图文理解大模型在核心算法指标中得到近5%的提升，效果远超预期。未来，联合团队将进一步将成果应用到网易新闻、网易云音乐等更丰富的业务场景中，提升最终用户的个性化体验。
    </p>
    <div class="img-container">
      <img
        class="img-advantage"
        src="@/assets/imgs/estate/humanity/yuzhi/advantage.png"
        alt=""
      />
    </div>
  </div>
</template>
<style lang="scss" scoped>
.explain {
  .img-container {
    padding: 24px 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    background: #f5f9fb;
    margin-top: 24px;
    .img-intro {
      font-size: 14px;
      font-weight: 400;
      color: #555555;
      line-height: 22px;
      text-align: center;
      margin-top: 16px;
    }

    .img-introduction {
      height: 174px;
    }
    .img-introduction2 {
      height: 209px;
    }
    .img-method {
      height: 201px;
    }
    .img-advantage {
      height: 332px;
    }
  }
  .title-1 {
    font-size: 24px;
    line-height: 22px;
    color: #000000;
  }
  .title-2 {
    font-size: 18px;
    color: #000000;
    line-height: 22px;
    margin-top: 24px;
  }
  .title-3 {
    font-size: 18px;
    color: #000000;
    line-height: 22px;
    margin-top: 40px;
  }
  .text-1 {
    font-size: 14px;
    font-weight: 400;
    color: #555555;
    line-height: 22px;
    margin-top: 16px;
  }
  .text-2 {
    font-size: 14px;
    font-weight: 400;
    color: #555555;
    line-height: 22px;
    margin-top: 24px;
  }
}
</style>
