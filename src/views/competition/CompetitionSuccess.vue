<script setup>
import { inject } from 'vue';
import OButton from '@/components/OButton.vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const getDetailData = inject('getDetailData');

const i18n = {
  success: '报名成功，祝贺您取得好成绩！',
  joinTeam:
    '您还未加入团队，您可以选择建立团队或加入团队，您也可以选择个人参赛。',
  personal: '个人参赛',
  team: '团队参赛',
};

// 点击个人参赛进入比赛介绍页
function goCompetitionIntro() {
  router.push({
    name: 'option',
    params: {
      id: route.params.id, // 比赛id
    },
  });
  getDetailData();
}
// 团队tab页
function goTeam() {
  router.push({
    name: 'team',
    params: {
      id: route.params.id,
    },
  });
  getDetailData();
}
</script>
<template>
  <!-- 报名成功页 -->
  <div class="application-result">
    <div class="title">
      {{ i18n.success }}
    </div>
    <div class="tips">{{ i18n.joinTeam }}</div>
    <div class="btn">
      <o-button type="primary" size="small" @click="goCompetitionIntro">
        {{ i18n.personal }}
      </o-button>
      <o-button type="primary" size="small" @click="goTeam">
        {{ i18n.team }}
      </o-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// 报名成功
.application-result {
  margin: 80px 300px 40px;
  text-align: center;
  .title {
    height: 32px;
    line-height: 32px;
    font-size: 24px;
    color: #000000;
  }
  .tips {
    line-height: 32px;
    font-size: 14px;
    color: #555;
    margin: 16px 0 40px;
  }
  .btn {
    .o-button {
      margin-right: 24px;
    }
  }
}
</style>
