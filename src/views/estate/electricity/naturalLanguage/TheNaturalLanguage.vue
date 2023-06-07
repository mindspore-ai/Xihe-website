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
    type: '综合服务应用建设小组',
    name: '基于自然语言处理技术的合同履行信息提取方法及系统与流程，利用合同义务识别模型识别合同条款”。',
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
      'https://obs-xihe-beijing4.obs.cn-north-4.myhuaweicloud.com/xihe-img/default_avatar/catimg_07.png',
    desc: '基于最新NLP模型实现电力巡检异常识别,完成目标检测训练和推理部署。',
    download_count: 3,
    id: '647e96555f4262ac9e4e56bd',
    like_count: 2,
    name: 'testNLPmodel',
    owner: 'yyj',
    tags: [
      'apache-2.0',
      'Image Classification',
      'Object Detection',
      'electricity',
    ],
    title: '电力巡检目标检测和推理部署',
    updated_at: '2023-06-01',
  },
];
const datasetData = [
  {
    avatar_id:
      'https://obs-xihe-beijing4.obs.cn-north-4.myhuaweicloud.com/xihe-img/default_avatar/catimg_07.png',
    desc: '电力安全帽检测数据集，大部分图片来自电力行业，包括电杆安装、电力高架施工、电力抢修等场景；小部分来自其他行业。',
    download_count: 0,
    id: '647d9e364136e7a01cbeeb0f',
    like_count: 1,
    name: 'GEFCom2014-datasets',
    owner: 'MindSpore',
    tags: ['apache-2.0', 'electricity', 'Dialogue Generation'],
    title: '电力安全帽检测数据集',
    updated_at: '2023-06-05',
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
