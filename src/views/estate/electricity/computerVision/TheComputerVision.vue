<script setup>
import { ref } from 'vue';
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

const modelData = ref([
  {
    avatar_id:
      'https://obs-xihe-beijing4.obs.cn-north-4.myhuaweicloud.com/xihe-img/default_avatar/catimg_07.png',
    desc: 'this is for test',
    download_count: 0,
    id: '645dd6ef106e2cd739746264',
    like_count: 0,
    name: 'testv2',
    owner: 'MindSpore',
    tags: ['apache-2.0'],
    updated_at: '2023-05-12',
  },
  {
    avatar_id:
      'https://obs-xihe-beijing4.obs.cn-north-4.myhuaweicloud.com/xihe-img/default_avatar/catimg_01.png',
    desc: 'this is for test',
    download_count: 0,
    id: '645dd6ef106e2cd739746264',
    like_count: 0,
    name: 'testv2',
    owner: 'MindSpore',
    tags: ['apache-2.0'],
    updated_at: '2023-05-12',
  },
  {
    avatar_id:
      'https://obs-xihe-beijing4.obs.cn-north-4.myhuaweicloud.com/xihe-img/default_avatar/catimg_06.png',
    desc: 'this is for test',
    download_count: 0,
    id: '645dd6ef106e2cd739746264',
    like_count: 0,
    name: 'testv2',
    owner: 'MindSpore',
    tags: ['apache-2.0', 'abc'],
    updated_at: '2023-05-12',
  },
]);

const classify = [
  {
    id: 0,
    name: '课程',
    path: '/estate/electricity',
    // path: '/estate/industrial-zone',
    icon: IconCourse,
  },
  {
    id: 1,
    name: '比赛',
    path: '/estate/medicine',
    icon: IconCompetition,
  },
  {
    id: 2,
    name: '活动',
    path: '/estate/industry',
    icon: IconMindcon,
  },
];

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
          <span> 更多模型 </span>
          <o-icon><icon-arrowBlue></icon-arrowBlue></o-icon>
        </div>
      </div>
      <div class="dataset-list">
        <app-card
          v-for="item in modelData"
          :key="item.id"
          :card-data="item"
          :avatar-img="item.avatar_id"
          card-type="dataset"
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
              v-for="val in electricityData"
              :key="val.id"
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
    background-image: url('@/assets/imgs/estate/electricity/electric-travel.jpg');
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
