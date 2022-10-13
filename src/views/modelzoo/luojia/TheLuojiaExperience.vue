<script setup>
import { ref, onMounted } from 'vue';

import ExampleCesium from '@/shared/modelzoo/luojia/example-cesium';
import { rectToImg } from '@/shared/modelzoo/luojia/tiles-to-img';

import OButton from '@/components/OButton.vue';

const isSelected = ref(false);
const cesiumContainer = ref('');
const viewer = ref(null);
const nowModelName = ref('高德影像');
const zoomlv = ref(18);
const tblob = ref(null);

async function drawClick() {
  console.log(viewer);
  isSelected.value = !isSelected.value;
  //  开始选区/结束选区
  isSelected.value ? viewer.value.startDrawRect() : viewer.value.stopDrawRect();

  if (!isSelected.value) {
    // 获取矩形框坐标
    const location = viewer.value.drawer.getAnsShapeRectCoor();

    const ltpoint = [location.west, location.north];
    const rbpoint = [location.east, location.south];
    tblob.value = await rectToImg(
      ltpoint,
      rbpoint,
      zoomlv.value,
      nowModelName.value
    );

    // TODO: blob文件获取完成后取消下载图片按钮置灰

    const aurl = URL.createObjectURL(tblob.value);
    const tempimg = document.createElement('img');
    tempimg.src = aurl;
    viewer.value.setImageAsLayerWithCoor(tempimg, location, true, false);
  }
}

function handleImgDownload() {
  if (tblob.value) {
    const url = URL.createObjectURL(tblob.value);
    let a = document.createElement('a');
    a.download = 'input.png';
    a.href = url;
    a.click();
  } else {
    ElMessage({
      type: 'warning',
      message: '请框选区域',
    });
  }
}

onMounted(() => {
  viewer.value = new ExampleCesium(cesiumContainer.value);
});
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
      <div>
        <OButton :type="isSelected ? 'error' : 'primary'" @click="drawClick">
          {{ isSelected ? '结束框选实验区域' : '开始框选实验区域' }}
        </OButton>

        <OButton @click="handleImgDownload">原图下载</OButton>
        <OButton>结果下载</OButton>
      </div>
      <div ref="cesiumContainer"></div>
      <div id="slider"></div>
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
