<script setup>
import { ref, markRaw, defineProps } from 'vue';
import { useRouter } from 'vue-router';

import hostImg from '@/assets/imgs/estate/electricity/substation-host.png';
import opsImg from '@/assets/imgs/estate/electricity/substation-ops.png';
import decisionImg from '@/assets/imgs/estate/electricity/substation-decision.png';

import IconArrowBlue from '~icons/app/arrow-blue';
import IconCourse from '~icons/app/course';
import IconCompetition from '~icons/app/competition';
import IconMindcon from '~icons/app/mindcon';

import card1 from '@/assets/imgs/home1/more/more_card1.jpg';
import card2 from '@/assets/imgs/home1/more/more_card2.jpg';
import card3 from '@/assets/imgs/home1/more/more_card3.jpg';
import competition1 from '@/assets/imgs/home1/more/more_card1.png';
import competition2 from '@/assets/imgs/home1/more/competition2.png';
import competition3 from '@/assets/imgs/home1/more/competition3.png';
import activity1 from '@/assets/imgs/home1/more/activity1.png';
import activity2 from '@/assets/imgs/home1/more/activity2.png';
import activity3 from '@/assets/imgs/home1/more/activity3.png';

import appCard from '@/components/AppCard.vue';
import electricityCard from '@/views/estate/electricity/ElectricityCard.vue';
import { ElMessage } from 'element-plus';

const router = useRouter();

const activeName = ref('课程');
const props = defineProps({
  modelData: {
    type: Array,
    default: () => {
      return [];
    },
  },
  datasetData: {
    type: Array,
    default: () => {
      return [];
    },
  },
});

const cases = [
  {
    id: 1,
    type: '变电站运维图像识别分析解决方案',
    name: '智能运维的“第三只眼”，变电站运维图像识别分析解决方案，推动变电站运维工作的无人化、智能化、信息化转…',
    image: opsImg,
    url: '/electricity/substation-ops',
  },
  {
    id: 2,
    type: '电力设备安全隐患分析解决方案',
    name: '基于无人机电力巡检捕获图像或者视频，并将数据传回中台或者盒子，并对关键线路进行检测。以实时检测安全问题、实时预警、排查故障。大大降低工作出错率与风险和提高了电网巡检效率。',
    image: decisionImg,
    url: '/electricity/intelligent-system',
  },
  {
    id: 3,
    type: '变电站AI分析主机',
    name: '变电站AI分析主机内置设备缺陷识别、设备状态判别、安全管控、环境状态感知等多类模型，可以对变电站内设备、环境状态、作业安全进行自动诊断和预警，实现“智能巡检”。',
    image: hostImg,
    url: '/electricity/substation-host',
  },
];

// 开启昇思之旅
let classify = ref([
  {
    type: 'course',
    name: '课程',
    path: '/course/c001/introduction',
    icon: markRaw(IconCourse),
    detail: [
      {
        desc: '昇思 MindSpore AI 框架原生支持大模型训练是发展大模型的关键，国内多个科研机构基于MindSpore打造了一系列大模型。同时，昇思MindSpore推出一站式大模型平台，将大模型能力开放给开发者，让你我皆可触碰大模型的魅力。',
        image: card1,
        count: '106',
        detail: '了解详情',
        path: '/course/c001/introduction',
      },
      {
        desc: '计算机视觉（Computer Vision）作为人工智能的一个重要的领域，主要是开发赋予计算机视觉能力的技术。本课程基于昇思MindSpore，采用理论与实践相结合的方法带你轻松入门。',
        image: card2,
        count: '34',
        detail: '了解详情',
        path: '/course/c002/introduction',
      },
      {
        desc: '本课程使用原理讲解加实战的方式学习神经网络模型，掌握算法调参和使用昇思MindSpore编程的能力。',
        image: card3,
        count: '55',
        detail: '了解详情',
        path: '/course/c003/introduction',
      },
    ],
  },
  {
    type: 'competition',
    name: '比赛',
    path: '/estate/medicine',
    icon: markRaw(IconCompetition),
    detail: [
      {
        name: '2023南方电网人工智能科技有限公司安全生产域算法“赛马”',
        desc: '2023年南方电网人工智能科技有限公司第一批人工智能应用场景（安全生产域）算法“赛马”项目，对输电线路塔基异常智能识别和输电线路导线异物智能识别2个算法进行算法比拼，比拼结果分别作为“输电线路塔基异常智能识别、配电线路塔基异常智能识别算法‘赛马’项目”和“输电线路导线异物智能识别、配电线路通道异物智能识别‘赛马’项目”技术评分依据，结合综合评估法，择优选取单位，作为合作伙伴进入项目实施，按4个场景分别交付相应的人工智能算法组件。',
        image: competition1,
        count: '0',
        detail: '了解详情',
        path: '/competition/southern_power/0/introduction',
      },
      {
        desc: '昇思MindSpore是一个全场景深度学习框架,旨在实现易开发、高效执行、全场景覆盖三大目标。 昇思AI挑战赛于2022年9月正式开启,面向全球AI开发者,赛题涵盖AI基础领域。挑战赛旨在为开发者提供一个学习MindSpore和锻炼算法能力的机会。 图像分类是计算机视觉中最基础的任务,目前图像分类的算法仍然在飞速发展。本赛题旨在让参赛者熟悉MindSpore并锻炼参赛者使用MindSpore进行图像分类预处理、图像分类的能力。',
        image: competition2,
        count: '249',
        detail: '了解详情',
        path: '/competition/3/0/introduction',
      },
      {
        desc: '昇思MindSpore是一个全场景深度学习框架,旨在实现易开发、高效执行、全场景覆盖三大目标。 昇思AI挑战赛于2022年9月正式开启,面向全球AI开发者,赛题涵盖AI基础领域。挑战赛旨在为开发者提供一个学习MindSpore和锻炼算法能力的机会。 它研究能实现人与计算机之间用自然语言进行有效通信的各种理论和方法。文本分类在AI领域承担了重要角色。本赛题旨在让参赛者熟悉MindSpore并锻炼参赛者使用MindSpore进行NLP的文本处理、文本分类的能力。',
        image: competition3,
        count: '152',
        detail: '了解详情',
        path: '/competition/2/0/introduction',
      },
    ],
  },
  {
    type: 'activity',
    name: '活动',
    path: '/estate/industry',
    icon: markRaw(IconMindcon),
    detail: [
      {
        desc: 'MindCon极客周是昇思MindSpore每半年举办一次的开发者狂欢盛会，旨在引领兴趣者们走入AI探索的世界。第四届MindCon极客周以超级挑战赛为主题，发布多领域多级别应用场景的挑战任务，与开发者共同探索AI开源趣味世界。邀请各领域大咖分享前沿技术，感受前沿AI技术。还有丰厚挑战赛礼品与昇思官方证书欢迎你来战！本赛题旨在让参赛者熟悉MindSpore并锻炼参赛者使用MindSpore进行西安旅游主题图像分类的能力。',
        image: activity1,
        count: '320',
        detail: '了解详情',
        path: '/competition/xian_travel/0/introduction',
      },
      {
        desc: 'MindCon极客周是昇思MindSpore每半年举办一次的开发者狂欢盛会，旨在引领兴趣者们走入AI探索的世界。第四届MindCon极客周以超级挑战赛为主题，发布多领域多级别应用场景的挑战任务，与开发者共同探索AI开源趣味世界。邀请各领域大咖分享前沿技术，感受前沿AI技术。还有丰厚挑战赛礼品与昇思官方证书欢迎你来战！本赛题旨在让参赛者熟悉MindSpore并锻炼参赛者使用MindSpore进行外卖文本分类的能力。',
        image: activity2,
        count: '320',
        detail: '了解详情',
        path: '/competition/text_classification/0/introduction',
      },
      {
        desc: 'MindCon极客周是昇思MindSpore每半年举办一次的开发者狂欢盛会，旨在引领兴趣者们走入AI探索的世界。第四届MindCon极客周以超级挑战赛为主题，发布多领域多级别应用场景的挑战任务，与开发者共同探索AI开源趣味世界。邀请各领域大咖分享前沿技术，感受前沿AI技术。还有丰厚挑战赛礼品与昇思官方证书欢迎你来战！本赛题旨在让参赛者熟悉MindSpore并锻炼参赛者使用MindSpore进行图像口罩检测的能力。',
        image: activity3,
        count: '320',
        detail: '了解详情',
        path: '/competition/mask_detection/0/introduction',
      },
    ],
  },
]);

function goCasePath(item) {
  router.push(item.url);
}

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

// 更多模型
function goModels() {
  router.push({
    name: 'models',
    state: {
      tag_kinds: 'CV',
      tags: 'electricity',
    },
  });
}
// 更多数据集
function goDatasets() {
  router.push({
    name: 'datasets',
    state: {
      tag_kinds: 'CV',
      tags: 'electricity',
    },
  });
}
// 更多项目
function goProjects() {
  router.push({
    name: 'projects',
    state: {
      tag_kinds: 'CV',
      tags: 'electricity',
    },
  });
}
const beforeLeave = (activeTab) => {
  if (activeTab === '活动') {
    ElMessage({
      type: 'warning',
      message: '暂未开放，敬请期待！',
      duration: 3000,
      offset: 64,
      center: true,
    });
    return false;
  }
};
</script>
<template>
  <div class="computer-vision">
    <div class="application-cases">
      <p class="application-title">应用案例</p>
      <div class="prefecture">
        <div class="southern-power">
          <span> 更多电力人工智能专区 </span>
          <o-icon><icon-arrowBlue></icon-arrowBlue></o-icon>
        </div>
        <div class="more-models" @click="goProjects">
          <span> 更多案例 </span>
          <o-icon><icon-arrowBlue></icon-arrowBlue></o-icon>
        </div>
      </div>
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
          <span> 更多电力人工智能专区 </span>
          <o-icon><icon-arrowBlue></icon-arrowBlue></o-icon>
        </div>
        <div class="more-models" @click="goModels">
          <span> 更多模型 </span>
          <o-icon><icon-arrowBlue></icon-arrowBlue></o-icon>
        </div>
      </div>
      <div class="model-list">
        <app-card
          v-for="item in props.modelData.slice(0, 3)"
          :key="item.id"
          :card-data="item"
          card-type="model"
          @click="goModelDetail(item.owner, item.name)"
        ></app-card>
      </div>
    </div>
    <div class="application-datasets">
      <p class="application-title">应用数据集</p>

      <div class="prefecture">
        <div class="southern-power">
          <span> 更多电力人工智能专区 </span>
          <o-icon><icon-arrowBlue></icon-arrowBlue></o-icon>
        </div>
        <div class="more-datasets" @click="goDatasets">
          <span> 更多数据集 </span>
          <o-icon><icon-arrowBlue></icon-arrowBlue></o-icon>
        </div>
      </div>
      <div class="dataset-list">
        <app-card
          v-for="item in props.datasetData.slice(0, 3)"
          :key="item.id"
          :card-data="item"
          card-type="dataset"
          @click="goDatasetDetail(item.owner, item.name)"
        ></app-card>
      </div>
    </div>
    <div class="electric-travel">
      <p class="application-title">开启电力之旅</p>
      <p class="desc">从入门到高阶，从理论到实践，助力开发者快速掌握深度学习</p>

      <el-tabs
        v-model="activeName"
        :before-leave="beforeLeave"
        class="travel-tabs"
      >
        <el-tab-pane
          v-for="(item, index) in classify"
          :key="index"
          :name="item.name"
          :disabled="item.disabled"
        >
          <template #label>
            <span class="estate-tabs-title">
              <o-icon><component :is="item.icon"></component></o-icon>
              <span class="option-name">{{ item.name }}</span>
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
  </div>
</template>
<style lang="scss" scoped>
.application-title {
  font-size: 36px;
  line-height: 48px;
  color: #000000;
  text-align: center;
  @media screen and (max-width: 820px) {
    font-size: 16px;
    line-height: 24px;
  }
}
.prefecture {
  line-height: 22px;
  font-size: 14px;
  font-weight: 400;
  color: #000000;
  margin-top: 24px;
  display: flex;
  justify-content: center;
  @media screen and (max-width: 820px) {
    margin-top: 16px;
  }
}
.computer-vision {
  .application-cases {
    .prefecture {
      .southern-power,
      .more-models {
        cursor: pointer;
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
    .case-cards {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-gap: 24px;
      grid-template-rows: 320px;
      margin: 40px 0 64px;
      padding: 0px 16px;
      @media screen and (max-width: 820px) {
        display: grid;
        grid-template-columns: repeat(1, 1fr);
        grid-template-rows: 230px;
        grid-gap: 16px;
        margin: 24px 0 0px;
      }
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
        @media screen and (max-width: 820px) {
          height: 230px;
          .case-info {
            bottom: 16px;
            top: 146px;
            .case-type {
              font-size: 16px;
              line-height: 24px;
            }
            .case-name {
              font-size: 12px;
              line-height: 18px;
              margin-top: 8px;
            }
          }
        }
      }
    }
  }
  .application-models {
    margin-top: 64px;
    padding: 0px 16px;

    @media screen and (max-width: 820px) {
      margin-top: 40px;
    }
    .prefecture {
      .southern-power,
      .more-models {
        cursor: pointer;
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
      grid-template-columns: repeat(3, 1fr);
      column-gap: 24px;
      row-gap: 24px;
      margin-top: 40px;
      @media screen and (max-width: 820px) {
        display: grid;
        grid-template-columns: repeat(1, 1fr);
        grid-gap: 16px;
        margin: 16px 0 0px;
      }
    }
  }
  .application-datasets {
    margin-top: 64px;
    padding: 0px 16px;
    @media screen and (max-width: 820px) {
      margin-top: 40px;
    }
    .prefecture {
      .southern-power,
      .more-datasets {
        cursor: pointer;
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
      grid-template-columns: repeat(3, 1fr);
      column-gap: 24px;
      row-gap: 24px;
      margin-top: 40px;
      @media screen and (max-width: 820px) {
        display: grid;
        grid-template-columns: repeat(1, 1fr);
        grid-gap: 16px;
        margin: 16px 0 0px;
      }
    }
  }
  .electric-travel {
    margin-top: 64px;
    padding: 64px 16px;
    @media screen and (max-width: 820px) {
      margin-top: 24px;
      padding: 24px 16px;
    }
    :deep(.travel-tabs) {
      .el-tabs__header {
        padding: 0;
        .el-tabs__nav-scroll {
          width: 100%;
        }
        .el-tabs__nav-wrap {
          border-radius: 20px;
        }
        .el-tabs__nav {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          .el-tabs__item {
            height: 80px;
            @media screen and (max-width: 820px) {
              height: 40px;
            }
            .estate-tabs-title {
              @media screen and (max-width: 820px) {
                height: 22px;
                line-height: 22px;
                .o-icon {
                  font-size: 24px;
                }
                .option-name {
                  margin-left: 8px;
                }
              }
            }
            .option-name {
              color: #000;
              margin-left: 16px;
            }
          }
          .is-active {
            background: linear-gradient(
              270deg,
              #0d8dff 0%,
              rgba(30, 193, 255, 0.5) 100%
            );
            .option-name {
              color: #fff;
            }
          }
        }
      }
      .el-tabs__content {
        .electricity-content {
          margin-top: 24px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-column-gap: 24px;
          @media screen and (max-width: 820px) {
            display: grid;
            grid-template-columns: repeat(1, 1fr);
            // grid-template-rows: 230px;
            grid-gap: 16px;
            margin: 16px 0 0px;
          }
        }
      }
    }
    .application-title {
      @media screen and (max-width: 820px) {
        font-size: 14px;
      }
    }
    .desc {
      margin: 24px 0 40px;
      text-align: center;
      @media screen and (max-width: 820px) {
        font-size: 12px;
        margin: 4px 0 16px;
      }
    }
  }
  .platform-data {
    margin-top: 64px;
    padding: 0px 16px;
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
        svg {
          vertical-align: middle;
        }
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
    @media screen and (max-width: 820px) {
      margin-top: 24px;
      flex-direction: column;
      .platform-desc {
        width: 100%;
        padding: 16px;
        margin-bottom: 16px;
        .title {
          font-size: 14px;
          line-height: 22px;
        }
        .desc {
          font-size: 12px;
          line-height: 18px;
          margin: 8px 0 16px;
          color: #555;
        }
        .more {
          font-size: 12px;
          line-height: 18px;
        }
      }
      .data-list {
        width: 100%;
        padding: 16px;
        .data-item {
          // background-color: red;
          .o-icon {
            font-size: 24px;
          }
          .count {
            font-size: 14px;
            margin: 4px 0px;
            line-height: 22px;
          }
          .title {
            font-size: 12px;
            line-height: 15px;
          }
        }
      }
    }
  }
}
</style>
