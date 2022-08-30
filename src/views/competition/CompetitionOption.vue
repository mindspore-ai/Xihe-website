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

const storeTeamId = computed(() => {
  return useCompetitionData().teamId;
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
    isIndividual: false,
  },
  {
    id: 'team',
    label: '我的团队',
    href: 'team',
    isIndividual: false,
  },
  {
    id: 'leaderboard',
    label: '排行榜',
    href: 'leaderboard',
    isIndividual: true,
  },
  // {
  //   id: 'discussion',
  //   label: '讨论',
  //   href: 'discussion',
  //   isIndividual: true,
  // },
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
  router.push(`/competition/${route.params.id}/0/${item.href}`);
}
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
    // opacity: 1;
    // top: 180px;
    font-size: 90px;
    height: 48px;
    background-color: #fbfbfb;
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
}
</style>
