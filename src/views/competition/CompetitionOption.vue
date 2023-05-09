<script setup>
import { ref, watch, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ONav from '@/components/ONav.vue';
import { useCompetitionData } from '@/stores';

const route = useRoute();
const router = useRouter();
const activeNavItem = ref('');
const comInfo = useCompetitionData().competitionData;
console.log('comInfo: ', comInfo);

const navItems = reactive([
  {
    id: 'introduction',
    label: '介绍',
    href: 'introduction',
    isIndividual: true,
    showDiscuss: true,
    competitionType: 'competition',
  },
  {
    id: 'dataset',
    label: '数据集',
    href: 'dataset',
    isIndividual: true,
    showDiscuss: true,
    competitionType: 'competition',
  },
  {
    id: 'result',
    label: '结果',
    href: 'result',
    isIndividual: false,
    showDiscuss: true,
    competitionType: 'competition',
  },
  {
    id: 'team',
    label: '我的团队',
    href: 'team',
    isIndividual: false,
    showDiscuss: true,
    competitionType: 'challenge',
  },
  {
    id: 'leaderboard',
    label: '排行榜',
    href: 'leaderboard',
    isIndividual: true,
    showDiscuss: true,
    competitionType: 'competition',
  },
  {
    id: 'discussion',
    label: '讨论',
    href: comInfo.forum,
    windowOpen: true,
    isIndividual: true,
    showDiscuss: comInfo.forum ? true : false, //无forum时不显示讨论tab
    competitionType: 'challenge',
  },
  {
    id: 'agreement',
    label: '协议',
    href: 'agreement',
    isIndividual: true,
    showDiscuss: true,
    competitionType: 'competition',
  },
]);

const renderNav = ref([]);
// 渲染的nav数据 (区分是否报名)
watch(
  () => comInfo.is_competitor,
  (newValue) => {
    // 如果已经报名
    if (newValue) {
      // 比赛
      if (comInfo.type === '') {
        renderNav.value = navItems.filter((item) => {
          return item.showDiscuss;
        });
      } else {
        // 活动
        renderNav.value = navItems.filter((item) => {
          return item.competitionType === 'competition';
        });
      }
    } else {
      if (comInfo.type === '') {
        console.log('renderNav.value: ', renderNav.value);
        // 南方电网比赛只显示介绍
        if (comInfo.id === 'southern_power') {
          renderNav.value = navItems.filter((item) => {
            return item.id === 'introduction';
          });
        } else {
          renderNav.value = navItems.filter((item) => {
            return item.isIndividual && item.showDiscuss;
          });
        }
      } else {
        renderNav.value = navItems.filter((item) => {
          return item.isIndividual && item.label !== '讨论';
        });
      }
    }
  },
  { immediate: true }
);

watch(
  () => {
    return route.name;
  },
  (val) => {
    if (
      /^introduction|dataset|result|team|leaderboard|discussion|agreement/g.test(
        val
      )
    ) {
      activeNavItem.value = val;
    } else {
      activeNavItem.value = '';
    }
  },
  { immediate: true }
);
// 点击导航
function handleNavClick(item) {
  if (item.windowOpen) {
    window.open(item.href);
  } else {
    router.push(`/competition/${route.params.id}/0/${item.href}`);
  }
}

const props = defineProps({
  fixed: {
    type: Boolean,
    default: () => {
      return {};
    },
  },
});
watch(
  () => {
    return props.fixed;
  },
  (newVal) => {
    let tab = document.querySelector('.competition-desc-tab');
    let box = document.querySelector('.competition-desc-info');
    if (newVal) {
      tab.classList.add('fixed');
      box.style.paddingTop = '30px';
    } else {
      if (tab && Array.from(tab.classList).indexOf('fixed')) {
        tab.classList.remove('fixed');
        box.style.paddingTop = '0px';
      }
    }
  },
  { immediate: true }
);
</script>
<template>
  <div class="competition-desc">
    <div class="competition-desc-tab">
      <o-nav
        :nav-items="renderNav"
        :active-item="activeNavItem"
        @nav-click="handleNavClick"
      ></o-nav>
    </div>
    <div class="competition-desc-info">
      <router-view />
    </div>
  </div>
</template>

<style lang="scss">
.competition-desc {
  &-tab {
    font-size: 90px;
    height: 69px;
    background-color: #fbfbfb;
    display: flex;
    justify-content: center;
    border-radius: 16px 16px 0px 0px;
    .o-nav {
      width: 100%;
      display: flex;
      justify-content: center;
      margin: 0 auto;
      .nav-item {
        color: #555;
      }
    }
  }
  .fixed {
    position: fixed;
    transition: all 1s linear;
    z-index: 100;
    top: 208px;
    display: flex;
    justify-content: center;
    width: 100%;
    max-width: 1440px;
  }
}
</style>
