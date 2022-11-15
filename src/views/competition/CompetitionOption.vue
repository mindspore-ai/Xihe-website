<script setup>
import { ref, watch, computed, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ONav from '@/components/ONav.vue';
// import { getGroupid } from '@/api/api-competition';
import { useCompetitionData } from '@/stores';

const route = useRoute();
const router = useRouter();
const teamId = ref(null);
const activeNavItem = ref('');
// const fixed = ref(false);

const storeTeamId = computed(() => {
  return useCompetitionData().teamId;
});
const comInfo = computed(() => {
  return useCompetitionData().competitionData;
});

watch(
  () => {
    return storeTeamId.value;
  },
  (newVal) => {
    teamId.value = newVal;
  },
  { immediate: true }
);
const navItems = reactive([
  {
    id: 'introduction',
    label: '介绍',
    href: 'introduction',
    isIndividual: true,
  },
  {
    id: 'dataset',
    label: '数据集',
    href: 'dataset',
    isIndividual: true,
  },
  {
    id: 'result',
    label: '结果',
    href: 'result',
    isIndividual: true,
  },
  {
    id: 'team',
    label: '我的团队',
    href: 'team',
    isIndividual: true,
  },
  {
    id: 'leaderboard',
    label: '排行榜',
    href: 'leaderboard',
    isIndividual: true,
  },
  {
    id: 'discussion',
    label: '讨论',
    href: comInfo.value.discuss_link,
    windowOpen: true,
    isIndividual: true,
  },
  {
    id: 'agreement',
    label: '协议',
    href: 'agreement',
    isIndividual: true,
  },
]);

// 渲染的nav数据 (区分是否报名)
const renderNav = computed(() => {
  return teamId.value
    ? navItems
    : navItems.filter((item) => {
        return item.isIndividual;
      });
});

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
    // fixed.value = newVal;
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
    // position: sticky;
    // z-index: 1000;
    // // opacity: 1;
    // top: 174px;
    font-size: 90px;
    height: 48px;
    background-color: #fbfbfb;
    display: flex;
    justify-content: center;
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
