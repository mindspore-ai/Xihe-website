<script setup>
import { ref, reactive, markRaw } from 'vue';
import { useRouter } from 'vue-router';

import hostImg from '@/assets/imgs/estate/electricity/substation-host.png';
import opsImg from '@/assets/imgs/estate/electricity/substation-ops.png';
import decisionImg from '@/assets/imgs/estate/electricity/substation-decision.png';

import IconArrowBlue from '~icons/app/arrow-blue';
import IconCourse from '~icons/app/course';
import IconCompetition from '~icons/app/competition';
import IconMindcon from '~icons/app/mindcon';
import IconCount from '~icons/app/count';

import appCard from '@/components/AppCard.vue';
import electricityCard from '@/views/estate/electricity/electricityCard.vue';
// TODO:替换图片
import taichu from '@/assets/imgs/modelzoo/taichu.png';

import { getElectricitydata } from '@/api/api-estate';

const router = useRouter();

const activeName = ref('课程');

const cases = [
  {
    id: 0,
    type: '变电站AI分析主机',
    name: '变电站AI分析主机内置设备缺陷识别、设备状态判别、安全管控、环境状态感知等多类模型，可以对变电站内设备、环境状态、作业安全进行自动诊断和预警，实现“智能巡检”。',
    image: hostImg,
    url: '/electricity/substation-host',
  },
  {
    id: 1,
    type: '变电站运维图像识别分析解决方案',
    name: '智能运维的“第三只眼”，变电站运维图像识别分析解决方案，推动变电站运维工作的无人化、智能化、信息化转…',
    image: opsImg,
    url: '/electricity/substation-ops',
  },
  {
    id: 2,
    type: '智能在线决策系统',
    name: '智能在线决策系统有效应对复杂实时电力调度',
    image: decisionImg,
    url: '/electricity/intelligent-system',
  },
];

// 开启昇思之旅
/* const journey = {
  title: '开启昇思之旅',
  introduce: '从入门到高阶，从理论到实践，助力开发者快速掌握AI知识',
  check_detail: '查看详情',
  check_morE: '查看更多',
  tablists: [
    {
      tab_title: '课程',
      image: open1,
      cards: [
        {
          name: '',
          desc: '昇思 MindSpore AI 框架原生支持大模型训练是发展大模型的关键，国内多个科研机构基于MindSpore打造了一系列大模型。同时，昇思MindSpore推出一站式大模型平台，将大模型能力开放给开发者，让你我皆可触碰大模型的魅力。',
          image: card1,
          // type: '免费',
          detail: '了解详情',
          path: '/course/c001/introduction',
        },
        {
          name: '',
          desc: '计算机视觉（Computer Vision）作为人工智能的一个重要的领域，主要是开发赋予计算机视觉能力的技术。本课程基于昇思MindSpore，采用理论与实践相结合的方法带你轻松入门。',
          image: card2,
          // type: '免费',
          detail: '了解详情',
          path: '/course/c002/introduction',
        },
        {
          name: '',
          desc: '本课程使用原理讲解加实战的方式学习神经网络模型，掌握算法调参和使用昇思MindSpore编程的能力。',
          image: card3,
          // TYPE: '免费',
          detail: '了解详情',
          path: '/course/c003/introduction',
        },
      ],
    },
    {
      tab_title: '比赛',
      image: open2,
      cards: [
        {
          name: '',
          desc: '一封通往艺术殿堂的邀请函，万元奖金邀您参与AI艺术创作，象牙之塔-AI画家大赛于2023年3月正式开启，面向全球AI开发者，赛题与扩散模型（Diffusion Model）紧密结合。大赛旨在为开发者提供一个学习昇思MindSpore和Diffusion Models的机会。',
          image: competition1,
          type: '',
          detail: '了解详情',
          path: '/competition/ai_painter/0/introduction',
        },
        {
          name: '',
          desc: '昇思MindSpore是一个全场景深度学习框架,旨在实现易开发、高效执行、全场景覆盖三大目标。 昇思AI挑战赛于2022年9月正式开启,面向全球AI开发者,赛题涵盖AI基础领域。挑战赛旨在为开发者提供一个学习MindSpore和锻炼算法能力的机会。 图像分类是计算机视觉中最基础的任务,目前图像分类的算法仍然在飞速发展。本赛题旨在让参赛者熟悉MindSpore并锻炼参赛者使用MindSpore进行图像分类预处理、图像分类的能力。',
          image: competition2,
          type: '',
          detail: '了解详情',
          path: '/competition/3/0/introduction',
        },
        {
          name: '',
          desc: '昇思MindSpore是一个全场景深度学习框架,旨在实现易开发、高效执行、全场景覆盖三大目标。 昇思AI挑战赛于2022年9月正式开启,面向全球AI开发者,赛题涵盖AI基础领域。挑战赛旨在为开发者提供一个学习MindSpore和锻炼算法能力的机会。 它研究能实现人与计算机之间用自然语言进行有效通信的各种理论和方法。文本分类在AI领域承担了重要角色。本赛题旨在让参赛者熟悉MindSpore并锻炼参赛者使用MindSpore进行NLP的文本处理、文本分类的能力。',
          image: competition3,
          type: '',
          detail: '了解详情',
          path: '/competition/2/0/introduction',
        },
      ],
    },
    {
      tab_title: '活动',
      image: open3,
      cards: [
        {
          name: '',
          desc: 'MindCon极客周是昇思MindSpore每半年举办一次的开发者狂欢盛会，旨在引领兴趣者们走入AI探索的世界。第四届MindCon极客周以超级挑战赛为主题，发布多领域多级别应用场景的挑战任务，与开发者共同探索AI开源趣味世界。邀请各领域大咖分享前沿技术，感受前沿AI技术。还有丰厚挑战赛礼品与昇思官方证书欢迎你来战！本赛题旨在让参赛者熟悉MindSpore并锻炼参赛者使用MindSpore进行西安旅游主题图像分类的能力。',
          image: activity1,
          type: '',
          detail: '了解详情',
          path: '/competition/xian_travel/0/introduction',
        },
        {
          name: '',
          desc: 'MindCon极客周是昇思MindSpore每半年举办一次的开发者狂欢盛会，旨在引领兴趣者们走入AI探索的世界。第四届MindCon极客周以超级挑战赛为主题，发布多领域多级别应用场景的挑战任务，与开发者共同探索AI开源趣味世界。邀请各领域大咖分享前沿技术，感受前沿AI技术。还有丰厚挑战赛礼品与昇思官方证书欢迎你来战！本赛题旨在让参赛者熟悉MindSpore并锻炼参赛者使用MindSpore进行外卖文本分类的能力。',
          image: activity2,
          type: '',
          detail: '了解详情',
          path: '/competition/text_classification/0/introduction',
        },
        {
          name: '',
          desc: 'MindCon极客周是昇思MindSpore每半年举办一次的开发者狂欢盛会，旨在引领兴趣者们走入AI探索的世界。第四届MindCon极客周以超级挑战赛为主题，发布多领域多级别应用场景的挑战任务，与开发者共同探索AI开源趣味世界。邀请各领域大咖分享前沿技术，感受前沿AI技术。还有丰厚挑战赛礼品与昇思官方证书欢迎你来战！本赛题旨在让参赛者熟悉MindSpore并锻炼参赛者使用MindSpore进行图像口罩检测的能力。',
          image: activity3,
          type: '',
          detail: '了解详情',
          path: '/competition/mask_detection/0/introduction',
        },
      ],
    },
  ],
}; */

const modelData = ref([]); //应用模型
const datasetData = ref([]); //应用数据集

const classify = reactive([
  {
    type: 'course',
    name: '课程',
    path: '/estate/electricity',
    // path: '/estate/industrial-zone',
    icon: markRaw(IconCourse),
    detail: [],
  },
  {
    type: 'competition',
    name: '比赛',
    path: '/estate/medicine',
    icon: markRaw(IconCompetition),
    detail: [],
  },
  {
    type: 'activity',
    name: '活动',
    path: '/estate/industry',
    icon: markRaw(IconMindcon),
    detail: [
      {
        name: '视觉课程',
        desc: '课程简介---全球首个三模态千亿参数大模型',
        poster: taichu,
        path: '/modelzoo/taichu',
        count: '2K+',
      },
      {
        name: '昇思入门课',
        desc: '课程简介--个遥感专用框架及最大遥能平台',
        poster: taichu,
        path: '/modelzoo/shennong',
        count: '2K+',
      },
      // {
      //   name: '昇思入门课',
      //   introduce: '课程简介---全球首个遥感专用框架及最大遥感样本库',
      //   url: taichu,
      //   path: '/modelzoo/luojia',
      //   count: '2K+',
      // },
    ],
  },
]);

// 电力之旅
const electricityData = ref([
  {
    name: '大模型课程',
    introduce: '课程简介---全球首个三模态千亿参数大模型',
    url: taichu,
    path: '/modelzoo/taichu',
    count: '2K+',
  },
  {
    name: '视觉课程',
    introduce: '课程简介---面向生物医学领域的人工智能平台',
    url: taichu,

    path: '/modelzoo/shennong',
    count: '2K+',
  },

  {
    name: '昇思入门课',
    introduce: '课程简介---全球首个遥感专用框架及最大遥感样本库',
    url: taichu,
    path: '/modelzoo/luojia',
    count: '2K+',
  },
]);
function goCasePath(item) {
  router.push(item.url);
}
// 获取电力主页数据

async function getElectricityInfor() {
  const res = await getElectricitydata();
  modelData.value = res.data.model.projects;
  datasetData.value = res.data.dataset.projects;
  classify[0].detail = res.data.course;
  classify[1].detail = res.data.comp;
}
getElectricityInfor();

function goModelDetail(user, name) {
  // 点击在新页签打开
  let routerData = router.resolve({
    path: `/models/${user}/${name}`,
  });
  window.open(routerData.href, '_blank');
}

function goDatasetDetail(user, name) {
  // 点击在新页签打开
  let routerData = router.resolve({
    path: `/datasets/${user}/${name}`,
  });
  window.open(routerData.href, '_blank');
}
</script>
<template>
  <div class="computer-vision">
    <div class="application-cases">
      <p class="application-title">应用案例</p>
      <div class="case-cards">
        <div
          v-for="item in cases"
          :key="item.name"
          class="case-item"
          @click="goCasePath(item)"
        >
          <img :src="item.image" alt="" />

          <div class="case-info">
            <p class="case-type">{{ item.type }}</p>
            <p class="case-name">{{ item.name }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="application-models">
      <p class="application-title">应用模型</p>

      <div class="prefecture">
        <div class="southern-power">
          <span> 南网专区 </span>
          <o-icon><icon-arrowBlue></icon-arrowBlue></o-icon>
        </div>
        <div class="more-models">
          <span> 更多模型 </span>
          <o-icon><icon-arrowBlue></icon-arrowBlue></o-icon>
        </div>
      </div>
      <div class="model-list">
        <app-card
          v-for="item in modelData"
          :key="item.id"
          :card-data="item"
          :avatar-img="item.avatar_id"
          @click="goModelDetail(item.owner, item.name)"
        ></app-card>
      </div>
    </div>
    <div class="application-datasets">
      <p class="application-title">应用数据集</p>

      <div class="prefecture">
        <div class="southern-power">
          <span> 南网专区 </span>
          <o-icon><icon-arrowBlue></icon-arrowBlue></o-icon>
        </div>
        <div class="more-datasets">
          <span> 更多数据集 </span>
          <o-icon><icon-arrowBlue></icon-arrowBlue></o-icon>
        </div>
      </div>
      <div class="dataset-list">
        <app-card
          v-for="item in datasetData"
          :key="item.id"
          :card-data="item"
          :avatar-img="item.avatar_id"
          card-type="dataset"
          @click="goDatasetDetail(item.owner, item.name)"
        ></app-card>
      </div>
    </div>
    <div class="electric-travel">
      <p class="application-title">开启电力之旅</p>
      <p class="desc">从入门到高阶，从理论到实践，助力开发者快速掌握深度学习</p>

      <el-tabs v-model="activeName" class="electricity-tabs">
        <el-tab-pane
          v-for="item in classify"
          :key="item.id"
          :name="item.name"
          :disabled="item.disabled"
        >
          <template #label>
            <span class="estate-tabs-title">
              <o-icon><component :is="item.icon"></component></o-icon>
              <span class="region-name">{{ item.name }}</span>
            </span>
          </template>
          <div class="electricity-content">
            <electricity-card
              v-for="val in item.detail"
              :key="val.type"
              :type="item.type"
              :card-data="val"
            ></electricity-card>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="platform-data">
      <div class="platform-desc">
        <div class="title">最活跃的AI+电力行业生产平台</div>
        <div class="desc">
          描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述
        </div>
        <div class="more">
          <span> 共建AI+电力生态 </span>
          <o-icon><icon-arrowBlue></icon-arrowBlue></o-icon>
        </div>
      </div>
      <div class="data-list">
        <div class="data-item">
          <o-icon><icon-count></icon-count></o-icon>
          <div class="count">1.9M+</div>
          <div class="title">用户访问量</div>
        </div>
        <div class="data-item">
          <o-icon><icon-count></icon-count></o-icon>
          <div class="count">1.96K+</div>
          <div class="title">模型使用次数</div>
        </div>
        <div class="data-item">
          <o-icon><icon-count></icon-count></o-icon>
          <div class="count">20.7K+</div>
          <div class="title">日活数</div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.application-title {
  font-size: 36px;
  line-height: 48px;
  color: #000000;
  text-align: center;
}
.computer-vision {
  .application-cases {
    margin-top: 40px;
    .case-cards {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-gap: 24px;
      grid-template-rows: 320px 320px;
      margin: 40px 0 64px;
      padding: 0px 16px;
      .case-item {
        cursor: pointer;
        border-radius: 16px;
        position: relative;
        &:hover {
          box-shadow: 0 6px 18px #0d8dff24;
        }
        .case-info {
          color: #fff;
          margin: 0 24px;
          position: absolute;
          top: 206px;
          .case-type {
            font-size: 24px;
            line-height: 26px;
            font-weight: 500;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: '...';
          }
          .case-name {
            font-size: 16px;
            line-height: 22px;
            font-weight: 400;
            margin-top: 16px;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: '...';
          }
        }
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  .application-models {
    margin-top: 64px;
    .prefecture {
      line-height: 22px;
      font-size: 14px;
      font-weight: 400;
      color: #000000;
      margin-top: 24px;
      display: flex;
      justify-content: center;
      .southern-power,
      .more-models {
        .o-icon {
          margin-left: 8px;
          svg {
            vertical-align: middle;
          }
        }
      }
      .more-models {
        margin-left: 42px;
      }
    }
    .model-list {
      position: relative;
      display: grid;
      grid-template-columns: repeat(3, minmax(200px, 1fr));
      grid-template-columns: repeat(3, 1fr);
      column-gap: 24px;
      row-gap: 24px;
      margin-top: 40px;
    }
  }
  .application-datasets {
    margin-top: 64px;
    .prefecture {
      line-height: 22px;
      font-size: 14px;
      font-weight: 400;
      color: #000000;
      margin-top: 24px;
      display: flex;
      justify-content: center;
      .southern-power,
      .more-datasets {
        .o-icon {
          margin-left: 8px;
          svg {
            vertical-align: middle;
          }
        }
      }
      .more-datasets {
        margin-left: 42px;
      }
    }
    .dataset-list {
      position: relative;
      display: grid;
      grid-template-columns: repeat(3, minmax(200px, 1fr));
      grid-template-columns: repeat(3, 1fr);
      column-gap: 24px;
      row-gap: 24px;
      margin-top: 40px;
    }
  }
  .electric-travel {
    margin-top: 64px;
    padding: 64px 0;
    :deep(.electricity-tabs) {
      .el-tabs__header {
        padding: 0;
        .el-tabs__nav {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          .el-tabs__item {
            height: 80px;
            .region-name {
              color: #000;
            }
          }
          .is-active {
            background: linear-gradient(
              270deg,
              #0d8dff 0%,
              rgba(30, 193, 255, 0.5) 100%
            );
            .region-name {
              color: #fff;
            }
          }
        }
      }
      .el-tabs__content {
        .electricity-content {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-column-gap: 24px;
        }
      }
    }
    .title {
      height: 48px;
      line-height: 48px;
      font-size: 36px;
      color: #000000;
    }
    .desc {
      margin: 24px 0 40px;
      text-align: center;
    }
    .electricity-content {
      margin-top: 24px;
    }
  }
  .platform-data {
    margin-top: 64px;
    display: flex;
    .platform-desc {
      background-image: url('@/assets/imgs/estate/electricity/platform-cover.png');
      background-size: 100% 100%;
      width: 37%;
      margin-right: 40px;
      padding: 40px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      .title {
        height: 32px;
        line-height: 32px;
        font-size: 24px;
        font-weight: 500;
        color: #000000;
      }
      .desc {
        line-height: 22px;
        font-size: 14px;
        font-weight: 400;
        color: #000000;
        margin: 16px 0 37px;
      }
      .more {
        line-height: 22px;
        font-size: 14px;
        font-weight: 400;
        color: #000000;
      }
    }
    .data-list {
      width: calc(63% - 40px);
      background: #ffffff;
      border-radius: 16px;
      padding: 50px 100px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      .data-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        .o-icon {
          font-size: 48px;
        }
        .count {
          height: 32px;
          line-height: 32px;
          font-size: 24px;
          font-weight: 500;
          color: #0d8dff;
          margin: 14px 0 8px;
        }
        .title {
          height: 24px;
          font-size: 18px;
          font-weight: 400;
          color: #000000;
          line-height: 26px;
        }
      }
    }
  }
}
</style>
