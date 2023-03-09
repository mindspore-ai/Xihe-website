<script setup>
import { ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import IconElectricity from '~icons/app/electricity';

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
/* const activeIndex = ref(0);

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
); */
const activeName = ref('first');
const handleClick = (tab, event) => {
  console.log(tab, event);
};
</script>
<template>
  <div class="industry">
    <div class="industry-head">
      <img src="@/assets/imgs/industry/industry-banner.png" alt="" />
      <div class="industry-banner"></div>
    </div>
    <div class="wrap">
      <el-tabs
        v-model="activeName"
        class="industry-tabs"
        @tab-click="handleClick"
      >
        <el-tab-pane name="first">
          <template #label>
            <span class="industry-tabs-title">
              <o-icon><icon-electricity></icon-electricity></o-icon>
              <span class="electricity">电力专区</span>
            </span>
          </template>
          User
        </el-tab-pane>
        <el-tab-pane label="Config" name="second">Config</el-tab-pane>
        <el-tab-pane label="Role" name="third">Role</el-tab-pane>
        <el-tab-pane label="Task" name="fourth">Task</el-tab-pane>
      </el-tabs>
      <!-- <div class="tab">
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
      </div> -->
    </div>
  </div>
</template>

<style lang="scss" scoped>
$theme: #0d8dff;
.wrap {
  //   background-color: red;
  margin: 0 auto;
  padding: 0px 16px 64px 16px;
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
:deep(.el-tabs) {
  .el-tabs__header {
    .el-tabs__nav-wrap {
      border-radius: 16px;
      backdrop-filter: blur(10px);
      .el-tabs__nav {
        width: 100%;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        .el-tabs__active-bar {
          display: none;
        }
        .el-tabs__item {
          height: 128px;
          font-size: 24px;
          line-height: 33px;
          color: #555;
          display: flex;
          justify-content: center;
          align-items: center;
          // backdrop-filter: blur(10px);
          .industry-tabs-title {
            display: flex;
            align-items: center;
            height: 48px;
            .o-icon {
              font-size: 48px;
            }
            .electricity {
              margin-left: 24px;
            }
          }
        }
        .is-active {
          background: rgba(13, 141, 255, 0.65);
          color: #ffffff;
        }
      }
    }
  }
}
</style>
