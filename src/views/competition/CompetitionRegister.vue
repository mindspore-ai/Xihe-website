<script setup>
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const active = ref(1);
const stepData = ref([
  { title: '登录/注册' },
  { title: '比赛协议' },
  { title: '填写报名表' },
  { title: '报名成功' },
]);

// 处理跳转法律声明，报名表，报名成功页
function goNextStep() {
  active.value++;
  if (active.value === 1) {
    router.push({
      name: 'statement',
    });
  } else if (active.value === 2) {
    router.push({
      name: 'application',
    });
  } else if (active.value === 3) {
    router.push({
      name: 'success',
    });
  }
}
watch(
  () => route.name,
  () => {
    if (route.name === 'statement') {
      active.value = 1;
    } else if (route.name === 'application') {
      active.value = 2;
    } else if (route.name === 'success') {
      active.value = 3;
    }
  },
  {
    immediate: true,
  }
);
</script>
<template>
  <div class="application-page">
    <el-steps :active="active" align-center>
      <el-step
        v-for="item in stepData"
        :key="item.title"
        :title="item.title"
      ></el-step>
    </el-steps>
    <router-view @go-next-step="goNextStep()"></router-view>
  </div>
</template>

<style lang="scss" scoped>
.application-page {
  padding: 48px 40px 40px;
  :deep(.el-steps) {
    padding-right: 80px;
    .is-center {
      &:nth-child(3) {
        .el-step__head {
          .el-step__line {
            position: absolute;
            left: 90%;
            right: -40%;
          }
        }
      }
      .el-step__head {
        .el-step__line {
          border-top: 2px dashed #ccd1de;
          // height: 0px;
          background-color: transparent;
          position: absolute;
          left: 84%;
          right: -40%;
          .el-step__line-inner {
            border-width: 0px !important;
          }
        }
      }
      .is-finish {
        .el-step__line {
          border-color: #0d8dff;
        }
      }
      .el-step__main {
        .el-step__title {
          position: absolute;
          left: 56%;
          top: -40%;
          font-size: 18px;
        }
        .el-step__title.is-process {
          color: #0d8dff;
          font-weight: 400;
        }
      }
      .el-step__head.is-finish {
        .el-step__icon.is-text {
          background-color: #0d8dff;
          color: #fff;
          border-color: #0d8dff;
        }
      }
      .el-step__head.is-process {
        .el-step__icon.is-text {
          background-color: #0d8dff !important;
          color: #fff;
          border-color: #0d8dff;
        }
      }
    }
  }
}
</style>
