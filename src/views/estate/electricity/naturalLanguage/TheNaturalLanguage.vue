<script setup>
import { ref, markRaw, defineProps } from 'vue';
import { useRouter } from 'vue-router';

import IconArrowBlue from '~icons/app/arrow-blue';

// import hostImg from '@/assets/imgs/estate/electricity/substation-host.png';
import opsImg from '@/assets/imgs/estate/electricity/substation-ops.png';
// import decisionImg from '@/assets/imgs/estate/electricity/substation-decision.png';

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

import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const router = useRouter();

const activeName = ref(t('naturalLang.ACTIVE_TAB'));

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
    id: 0,
    type: t('naturalLang.CASE1_TITLE'),
    name: t('naturalLang.CASE1_DESC'),
    image: opsImg,
    url: '/electricity/laborcontract',
  },
];

function goCasePath(item) {
  router.push(item.url);
}

// 开启昇思之旅
let classify = ref([
  {
    type: 'course',
    name: t('naturalLang.COURSES.TYPE'),
    path: '/course/c001/introduction',
    icon: markRaw(IconCourse),
    detail: [
      {
        desc: t('naturalLang.COURSES.CHILDREN[0].DESC'),
        image: card1,
        count: '77',
        detail: t('naturalLang.LEARN_DETAIL'),
        path: '/course/c001/introduction',
      },
      {
        desc: t('naturalLang.COURSES.CHILDREN[1].DESC'),
        image: card2,
        count: '28',
        detail: t('naturalLang.LEARN_DETAIL'),
        path: '/course/c002/introduction',
      },
      {
        desc: t('naturalLang.COURSES.CHILDREN[2].DESC'),
        image: card3,
        count: '46',
        detail: t('naturalLang.LEARN_DETAIL'),
        path: '/course/c003/introduction',
      },
    ],
  },
  {
    type: 'competition',
    name: t('naturalLang.COMPETITION.TYPE'),
    path: '/estate/medicine',
    icon: markRaw(IconCompetition),
    detail: [
      {
        name: t('naturalLang.COMPETITION.CHILDREN[0].NAME'),
        desc: t('naturalLang.COMPETITION.CHILDREN[0].DESC'),
        image: competition1,
        count: '0',
        detail: t('naturalLang.LEARN_DETAIL'),
        path: '/competition/southern_power/0/introduction',
      },
      {
        desc: t('naturalLang.COMPETITION.CHILDREN[1].DESC'),
        image: competition2,
        count: '249',
        detail: t('naturalLang.LEARN_DETAIL'),
        path: '/competition/3/0/introduction',
      },
      {
        desc: t('naturalLang.COMPETITION.CHILDREN[2].DESC'),
        image: competition3,
        count: '152',
        detail: t('naturalLang.LEARN_DETAIL'),
        path: '/competition/2/0/introduction',
      },
    ],
  },
  {
    type: 'activity',
    name: t('naturalLang.ACTIVITY.TYPE'),
    path: '/estate/industry',
    icon: markRaw(IconMindcon),
    detail: [
      {
        desc: t('naturalLang.ACTIVITY.CHILDREN[0].DESC'),
        image: activity1,
        count: '320',
        detail: t('naturalLang.LEARN_DETAIL'),
        path: '/competition/xian_travel/0/introduction',
      },
      {
        desc: t('naturalLang.ACTIVITY.CHILDREN[1].DESC'),
        image: activity2,
        count: '320',
        detail: t('naturalLang.LEARN_DETAIL'),
        path: '/competition/text_classification/0/introduction',
      },
      {
        desc: t('naturalLang.ACTIVITY.CHILDREN[2].DESC'),
        image: activity3,
        count: '320',
        detail: t('naturalLang.LEARN_DETAIL'),
        path: '/competition/mask_detection/0/introduction',
      },
    ],
  },
]);

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
const beforeLeave = (activeTab) => {
  if (activeTab === t('naturalLang.ACTIVE_TAB')) {
    ElMessage({
      type: 'warning',
      message: t('naturalLang.COLSED_MSG'),
      duration: 3000,
      offset: 64,
      center: true,
    });
    return false;
  }
};
</script>
<template>
  <div class="natural-language">
    <div class="application-cases">
      <p class="application-title">{{ t('naturalLang.CASE') }}</p>
      <div class="prefecture">
        <div class="southern-power">
          <span> {{ t('naturalLang.MORE_ZONE') }} </span>
          <o-icon><icon-arrowBlue></icon-arrowBlue></o-icon>
        </div>
        <div class="more-models" @click="goProjects">
          <span> {{ t('naturalLang.MORE_CASE') }} </span>
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
      <p class="application-title">{{ t('naturalLang.MODEL') }}</p>

      <div class="prefecture">
        <div class="southern-power">
          <span> {{ t('naturalLang.MORE_ZONE') }} </span>
          <o-icon><icon-arrowBlue></icon-arrowBlue></o-icon>
        </div>
        <div class="more-models" @click="goModels">
          <span> {{ t('naturalLang.MORE_MODEL') }} </span>
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
      <p class="application-title">{{ t('naturalLang.DATASET') }}</p>

      <div class="prefecture">
        <div class="southern-power">
          <span> {{ t('naturalLang.MORE_ZONE') }} </span>
          <o-icon><icon-arrowBlue></icon-arrowBlue></o-icon>
        </div>
        <div class="more-datasets" @click="goDatasets">
          <span> {{ t('naturalLang.MORE_DATASET') }} </span>
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
      <p class="application-title">{{ t('naturalLang.JOURNEY') }}</p>
      <p class="desc">{{ t('naturalLang.JOURNEY_DESC') }}</p>

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
    <!-- <div class="platform-data">
      <div class="platform-desc">
        <div class="title">最活跃的AI+电力行业生产平台</div>
        <div class="desc">
          昇思赋能电力行业，覆盖从AI生产（输出算法模型）到应用（实现算法工程化封装）各环节，有效解决AI+电力研发门槛高、成本高和效率低的问题。
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
    </div> -->
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
.natural-language {
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
          bottom: 24px;
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
      grid-template-columns: repeat(3, minmax(200px, 1fr));
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
