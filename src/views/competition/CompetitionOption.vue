<script setup>
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ONav from '@/components/ONav.vue';

const route = useRoute();
const router = useRouter();

const activeNavItem = ref('');

// const props = defineProps({
//   teamId: {
//     type: String,
//     default: () => {
//       return '';
//     },
//   },
// });

// console.log(props.teamId);
const navItems = [
  {
    id: 'introduction',
    label: '介绍',
    href: 'introduction', //待修改
  },
  {
    id: 'dataset',
    label: '数据集',
    href: 'dataset',
  },
  {
    id: 'result',
    label: '结果提交',
    href: 'result',
  },
  {
    id: 'team',
    label: '我的团队',
    href: 'team',
  },
  {
    id: 'leaderboard',
    label: '排行榜',
    href: 'leaderboard',
  },
  {
    id: 'discussion',
    label: '讨论',
    href: 'discussion',
  },
  {
    id: 'agreement',
    label: '协议',
    href: 'agreement',
  },
];
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
  <div>
    <div class="competition-desc-tab">
      <o-nav
        :nav-items="navItems"
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
.competition-desc-tab {
  position: sticky;
  z-index: 1000;
  opacity: 1;
  background: #fbfbfb;
  top: 180px;
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
</style>
