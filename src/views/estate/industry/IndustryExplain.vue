<script setup>
defineProps({
  industryDetail: {
    type: Object,
    default: null,
  },
});
</script>
<template>
  <div class="case-explain">
    <div class="explain-title">项目说明</div>
    <div class="case-background">
      <div class="title">案例背景</div>
      <div class="background-desc">
        {{ industryDetail.background }}
      </div>
    </div>
    <div class="case-painspot">
      <div class="title">案例痛点</div>
      <div class="painspot-desc">
        {{ industryDetail.background }}
      </div>
    </div>
    <div class="solution">
      <div class="title">解决方案</div>
      <div class="solution-desc">
        {{ industryDetail.background }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.case-explain {
  .explain-title {
    line-height: 22px;
    font-size: 24px;
    color: #000000;
    margin-bottom: 24px;
  }
  .case-background {
    .background-desc {
      font-size: 14px;
      font-weight: normal;
      color: #555555;
      line-height: 22px;
    }
    margin-bottom: 40px;
  }
  .case-painspot {
    .painspot-desc {
      font-size: 14px;
      font-weight: normal;
      color: #555555;
      line-height: 22px;
    }
    margin-bottom: 40px;
  }
  .solution {
    .solution-desc {
      font-size: 14px;
      font-weight: normal;
      color: #555555;
      line-height: 22px;
    }
  }
  .title {
    line-height: 22px;
    font-size: 18px;
    color: #000000;
    margin-bottom: 16px;
  }
}
</style>
