<script setup>
import { ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
const router = useRouter();
const route = useRoute();

const sections = [
  {
    id: 0,
    name: '电力专区',
    path: '/industry/electric',
    routeName: 'electricPower',
    icon: '',
  },
  {
    id: 1,
    name: '金融专区',
    path: '/industry/finance',
    routeName: 'finance',
    icon: '',
  },
  {
    id: 2,
    name: '医疗专区',
    path: '/industry/medical',
    routeName: 'medicalTreatment',
    icon: '',
  },
  {
    id: 3,
    name: '工业专区',
    path: '/industry/industrial-zone',
    routeName: 'industrialZone',
    icon: '',
  },
];
const activeIndex = ref(0);

function toggleSection(path, index) {
  activeIndex.value = index;
  router.push(path);
}

watch(
  () => route.name,
  () => {
    sections.forEach((item) => {
      if (item.routeName === route.name) {
        activeIndex.value = item.id;
      }
    });
  },
  { immediate: true }
);
</script>
<template>
  <div class="industry">
    <div class="industry-head">
      <img src="@/assets/imgs/industry/industry-banner.png" alt="" />
      <div class="industry-banner"></div>
      <!-- <div class="wrap">
        <div class="industry-prefecture"></div>
      </div> -->
    </div>
    <div class="wrap">
      <div class="tab">
        <div
          v-for="item in sections"
          :key="item.name"
          class="tab-item"
          :class="activeIndex === item.id ? 'active' : ''"
          @click="toggleSection(item.path, item.id)"
        >
          {{ item.name }}
        </div>
      </div>
      <div>
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$theme: #0d8dff;
.wrap {
  //   background-color: red;
  margin: 0 auto;
  padding: 50px 16px 136px 16px;
  max-width: 1472px;
  .tab {
    display: flex;
    background: rgba(255, 255, 255, 0.75);
    backdrop-filter: blur(6px);
    .tab-item {
      padding: 12px 16px;
      cursor: pointer;
    }
    .active {
      color: #fff;
      background: $theme;
    }
  }
}
.industry {
  background-color: #f5f6f8;
  .industry-head {
    width: 100%;
    height: 560px;
    img {
      width: 100%;

      height: 100%;
    }
  }
}
</style>
