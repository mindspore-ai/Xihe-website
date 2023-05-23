<script setup></script>
<template>
  <div class="explain">
    <p class="title-1">项目说明</p>
    <p class="title-2">案例背景</p>
    <p class="text-1">
      根据有关数据，国潮在过去十年的关注度不断上涨，并且海外市场正在不断升温。集东方美学与现代时尚为一体的国潮正成为连接中国和世界新的文化桥梁。国潮可以说是顺应青年群体的审美品位和个性特征，对传统文化进行再创作和再表达。比如故宫、三星堆等博物馆基于中国经典文物元素设计开发文创产品，河南电视台用视听语言重新复原唐朝风貌，央视春晚通过高科技将传统山水意境融入现代舞台等。<br />
      国潮立足青年群体尤其是Z世代的审美取向和文化旨趣，不仅为未来的国际传播创造了新的中国特色的符号中介，同时切中全世界青年人共同的“潮”“酷”等个性化诉求，为超越国家层面的文化再生产开辟出潜在空间。<br />
      拉动着国潮产业发展的是设计师的一个个原创的国风设计。而设计的根本在人，但传统的人工设计面临着时间成本高、周期长、难度大、创新难等诸多问题，一张精美的国潮图案需要由设计师经过前期的大量调研，灵感的深度挖掘，素描轮廓的绘制、上色、修饰等环节才能最终形成成图，耗时耗力。
    </p>
    <p class="title-3">案例简介</p>
    <p class="text-1">
      湖南禾福文化科技有限公司“薪火芳华”团队基于全场景AI框架昇思MindSpore，自行研发基于知识图谱和大模型的国潮AIGC生态系统（AI生成2D平面图像、3D模型、视频等元宇宙数字内容），为元宇宙空间提供可商用的优质数字内容，优化工业设计到生产的流程效率，降本增效，有效的将文化遗产演变为数字资产，打通“文化-科技-消费”全链路径，释放国潮文化的源头生产力，在消费端打造一个率先出海的青年国潮品牌“薪火芳华”。
    </p>
    <p class="title-3">解决思路</p>
    <p class="text-1">
      薪火芳华团队走访了137个非物质文化遗产发源乡，拜访了583位非遗传承人，历时五年时间搭建起以青年大学生为主要力量传播和推广中华优秀文化的平台，并积累了丰富的传统文化
      IP 素材库，为日后图像生成算法的训练奠定了原始数据集的积累。
    </p>
    <div class="img-container">
      <img
        class="img-method"
        src="@/assets/imgs/estate/humanity/aigc/solve-method.png"
        alt=""
      />
      <p class="img-intro">国潮特色原创IP数据库</p>
    </div>
    <p class="title-3">案例优势</p>
    <p class="text-1">
      团队创新研发了2D生成模型YouthNet及3D生成模型YouthDimension，通过自建高质量数据集训练深度学习网络，利用数据集中的多种文化元素使计算机能够自主生成符合大众审美的创新性国潮2D图像和3D模型，减少繁琐的人工挑选及绘制步骤，能够帮助用户零门槛地体验平面设计和建模设计。
    </p>
    <div class="img-container">
      <img
        class="img-advantage1"
        src="@/assets/imgs/estate/humanity/aigc/advantage-1.png"
        alt=""
      />
      <p class="img-intro">创新研发模型</p>
    </div>
    <p class="text-2">
      基于图像创新技术，结合设计师的精加工，目前已形成十六大系列面向市场的国潮文创产品。
    </p>
    <div class="img-container">
      <img
        class="img-advantage2"
        src="@/assets/imgs/estate/humanity/aigc/advantage-2.png"
        alt=""
      />
      <p class="img-intro">国潮文创产品</p>
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

    .img-method,
    .img-advantage1,
    .img-advantage2 {
      height: 440px;
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
