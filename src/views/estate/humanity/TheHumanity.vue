<script setup>
import case1 from '@/assets/imgs/estate/humanity/case-aigc.png';
import case2 from '@/assets/imgs/estate/humanity/case-yuzhi.png';
import case3 from '@/assets/imgs/estate/humanity/case-shouyu.png';

const cases = [
  {
    id: 1,
    type: '国潮AIGC生态系统',
    name: '湖南禾福文化科技有限公司“薪火芳华”团队基于全场景AI框架昇思MindSpore，自行研发基于知识图谱和大模型…',
    image: case1,
    url: '/estate/industry/metal-part',
  },
  {
    id: 2,
    type: '玉知-悟空图文理解大模型',
    name: '作为国内专业从事游戏与泛娱乐AI研究和应用的顶尖机构，网易伏羲于2021年起着力打造“玉知”多模态理解大…',
    image: case2,
    url: '/estate/industry/metal-part',
  },
  {
    id: 3,
    type: '手语教考一体机',
    name: 'AI破解手语难题，用科技连接孤岛，拨亮人文关怀的灯盏',
    image: case3,
    url: '/estate/industry/metal-part',
  },
];
</script>
<template>
  <div class="humanity">
    <p class="application-cases">应用案例</p>
    <div class="case-cards">
      <div v-for="item in cases" :key="item.id" class="card">
        <p>{{ item.type }}</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$theme: #0d8dff;
.humanity {
  .application-cases {
    margin-top: 40px;
    font-size: 36px;
    line-height: 48px;
    color: #000000;
    text-align: center;
  }
  .case-cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 24px;
    margin: 40px 0 64px;
    padding: 0px 16px;
  }
}
</style>
