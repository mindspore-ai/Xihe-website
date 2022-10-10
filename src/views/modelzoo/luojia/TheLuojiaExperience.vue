<script setup>
// import { ref } from 'vue';

// const cesiumContainer = ref(null);

// const viewer = new Cesium.Viewer('cesiumContainer', {});

// viewer.extend(Cesium.viewerDragDropMixin);
</script>
<template>
  <div class="luojia">
    <div class="luojia-top">
      <p class="type">目标识别（Object Detection）</p>
      <p class="desc">
        指一个特殊目标（或一种类型的目标）从其它目标（或其它类型的目标）中被区分出来的过程。它既包括俩个非常相似目标的识别，也包括一种类型的目标同其他类型目标的识别。
      </p>
    </div>
    <div class="luojia-bottom">
      <div ref="cesiumContainer"></div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.luojia {
  &-top {
    .type {
      font-size: 20px;
      font-weight: normal;
      color: #000000;
      line-height: 28px;
      margin-top: 40px;
    }
    .desc {
      font-size: 14px;
      font-weight: 400;
      color: #555555;
      line-height: 22px;
      margin-top: 10px;
    }
  }
  &-bottom {
    margin-top: 40px;
  }
}
</style>
