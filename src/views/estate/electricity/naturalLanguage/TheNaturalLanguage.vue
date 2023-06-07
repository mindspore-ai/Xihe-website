<script setup>
import { ref, markRaw } from 'vue';
import { useRouter } from 'vue-router';

import IconArrowBlue from '~icons/app/arrow-blue';
import { getElectricitydata } from '@/api/api-estate';

import hostImg from '@/assets/imgs/estate/electricity/substation-host.png';
import opsImg from '@/assets/imgs/estate/electricity/substation-ops.png';
import decisionImg from '@/assets/imgs/estate/electricity/substation-decision.png';

const router = useRouter();
const cases = [
  {
    id: 0,
    type: '电力合同风险评估与管理',
    name: '识别电力合同的风险控制点，并对合同内容进行情感分析，实现对合同风险的快速识别和及时管控。同时，该工具还提供模板化风险维护建议和全盘风险展示功能，助力电力企业实现更高效、全面的合同风险管理。',
    image: opsImg,
    url: '/electricity/laborcontract',
  },
  /* {
    id: 1,
    type: '变电站运维图像识别分析解决方案',
    name: '智能运维的“第三只眼”，变电站运维图像识别分析解决方案，推动变电站运维工作的无人化、智能化、信息化转…',
    image: hostImg,
    url: '/electricity/substation-ops',
  }, */
  // {
  //   id: 2,
  //   type: '智能在线决策系统',
  //   name: '智能在线决策系统有效应对复杂实时电力调度',
  //   image: decisionImg,
  //   // url: '/electricity/intelligent-system',
  // },
];

// const modelData = ref([]); //应用模型
// const datasetData = ref([]); //应用数据集

function goCasePath(item) {
  router.push(item.url);
}
// 获取电力主页数据

async function getElectricityInfor() {
  const res = await getElectricitydata();
  modelData.value = res.data.model.projects;
  datasetData.value = res.data.dataset.projects;
  // classify[0].detail = res.data.course.slice(0, 3);
  // classify[1].detail = res.data.comp.slice(0, 3);
}
getElectricityInfor();
const modelData = [
  {
    avatar_id:
      'https://obs-xihe-beijing4.obs.cn-north-4.myhuaweicloud.com/xihe-img/default_avatar/man-3.png',
    desc: '利用NLP技术提取合同内容，智能识别合同履行义务，确定发电量、服务范围、报酬方式及期限，提高合同履行效率及准确性。',
    download_count: 0,
    id: '647e96555f4262ac9e4e56bd',
    like_count: 0,
    name: 'electricity_service',
    owner: 'yyj',
    tags: ['apache-2.0', 'Text Classification', 'electricity'],
    title: '生产服务模型',
    updated_at: '2023-06-08',
  },
  {
    avatar_id:
      'https://obs-xihe-beijing4.obs.cn-north-4.myhuaweicloud.com/xihe-img/default_avatar/man-3.png',
    desc: '智能分析用户需求，针对性制定推广方案，提供个性化、多样化的智能服务，提高转化率，实现销售目标。',
    download_count: 0,
    id: '647e96555f4262ac9e4e56bd',
    like_count: 0,
    name: 'electricity_sales',
    owner: 'yyj',
    tags: [
      'apache-2.0',
      'Word Embedding',
      'Text Classification ',
      'electricity',
    ],
    title: '电力销售推广建设',
    updated_at: '2023-06-08',
  },
  {
    avatar_id:
      'https://obs-xihe-beijing4.obs.cn-north-4.myhuaweicloud.com/xihe-img/default_avatar/man-3.png',
    desc: '智能识别电力设备维修合同中的重要条款，如维修范围、方式、时间限制与报酬等，提高合同内容管理效率，降低后续争议风险。',
    download_count: 0,
    id: '647e96555f4262ac9e4e56bd',
    like_count: 0,
    name: 'electrical_equipment',
    owner: 'yyj',
    tags: [
      'apache-2.0',
      'Dialogue Generation',
      'Text Classification ',
      'electricity',
    ],
    title: '电力设备维修',
    updated_at: '2023-06-08',
  },
];
const datasetData = [
  {
    avatar_id:
      'https://obs-xihe-beijing4.obs.cn-north-4.myhuaweicloud.com/xihe-img/default_avatar/man-3.png',
    desc: '电力宣传活动将通过NLP技术展示电力从生成、传输到应用的全过程，以图文结合的方式，生动形象地展现电力行业的魅力，引导消费者深入了解电力行业，提高电力行业的知名度和影响力。',
    download_count: 0,
    id: '647d9e364136e7a01cbeeb0h',
    like_count: 1,
    name: 'electricity_publicity',
    owner: 'yyj',
    tags: ['apache-2.0', 'electricity', 'Text Classification'],
    title: '电力宣传模型',
    updated_at: '2023-06-05',
  },
  {
    avatar_id:
      'https://obs-xihe-beijing4.obs.cn-north-4.myhuaweicloud.com/xihe-img/default_avatar/man-3.png',
    desc: '基于NLP技术挖掘数据趋势，分析市场动态及竞争格局，为行业决策提供辅助参考，提高决策准确度。',
    download_count: 0,
    id: '647d9e364136e7a01cbeeb0h',
    like_count: 0,
    name: 'electricity_marketing',
    owner: 'yyj',
    tags: [
      'apache-2.0',
      'electricity',
      'Text Classification',
      'Word Embedding',
    ],
    title: '行业营销白皮书',
    updated_at: '2023-06-03',
  },
  {
    avatar_id:
      'https://obs-xihe-beijing4.obs.cn-north-4.myhuaweicloud.com/xihe-img/default_avatar/man-3.png',
    desc: '该系统采用自然语言处理技术，智能提取电力贸易合同的关键信息，如双方权益、供需量、报酬方式、期限等，降低合同争议风险及管理工作量。同时，提高合同管理效率，为电力贸易合同签署方提供保障。',
    download_count: 0,
    id: '647d9e364136e7a01cbeeb0h',
    like_count: 0,
    name: 'electricity_trade',
    owner: 'yyj',
    tags: [
      'apache-2.0',
      'electricity',
      'Dialogue Generation',
      'Text Classification',
    ],
    title: '基于NLP技术的电力贸易合同管理系统',
    updated_at: '2023-06-03',
  },
];
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
    params: {
      tag_kinds: 'NLP',
      tags: 'electricity',
    },
  });
}
// 更多数据集
function goDatasets() {
  router.push({
    name: 'datasets',
    params: {
      tag_kinds: 'NLP',
      tags: 'electricity',
    },
  });
}
// 更多项目
function goProjects() {
  router.push({
    name: 'projects',
    params: {
      tag_kinds: 'NLP',
      tags: 'electricity',
    },
  });
}
</script>
<template>
  <div class="natural-language">
    <div class="application-cases">
      <p class="application-title">应用案例</p>
      <div class="prefecture">
        <div class="southern-power">
          <span> 南网专区 </span>
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
          <span> 南网专区 </span>
          <o-icon><icon-arrowBlue></icon-arrowBlue></o-icon>
        </div>
        <div class="more-models" @click="goModels">
          <span> 更多模型 </span>
          <o-icon><icon-arrowBlue></icon-arrowBlue></o-icon>
        </div>
      </div>
      <div class="model-list">
        <app-card
          v-for="item in modelData.slice(0, 3)"
          :key="item.id"
          :card-data="item"
          :avatar-img="item.avatar_id"
          card-type="model"
          :show-name="false"
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
        <div class="more-datasets" @click="goDatasets">
          <span> 更多数据集 </span>
          <o-icon><icon-arrowBlue></icon-arrowBlue></o-icon>
        </div>
      </div>
      <div class="dataset-list">
        <app-card
          v-for="item in datasetData.slice(0, 3)"
          :key="item.id"
          :card-data="item"
          :avatar-img="item.avatar_id"
          card-type="dataset"
          :show-name="false"
          @click="goDatasetDetail(item.owner, item.name)"
        ></app-card>
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
.natural-language {
  .application-cases {
    margin-top: 40px;
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
        cursor: pointer;
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
        cursor: pointer;
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
        cursor: pointer;
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
}
</style>
