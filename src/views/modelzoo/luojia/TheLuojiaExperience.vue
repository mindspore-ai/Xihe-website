<script setup>
import { ref, onMounted, computed } from 'vue';

import { goAuthorize } from '@/shared/login';
import { useLoginStore, useUserInfoStore } from '@/stores';

import ExampleCesium from '@/shared/modelzoo/luojia/luojianet.js';
import { rectToImg } from '@/shared/modelzoo/luojia/tiles-to-img.js';

import IconSelect from '~icons/app/luojia-select';
import IconStart from '~icons/app/luojia-start';
import IconHistory from '~icons/app/luojia-history';
import IconDownload from '~icons/app/download';

import gif from '@/assets/gifs/loading.gif';

import {
  handleLuoJiaInfer,
  // handleLuoJiaHistory,
  handleLuojiaUploadPic,
} from '@/api/api-modelzoo';

const userInfoStore = useUserInfoStore();
const isLogined = computed(() => useLoginStore().isLogined);

const dialogTableVisible = ref(false);
const dialogTableVisibleDetail = ref(false);
const gridData = ref([]);
const historyInfo = ref({
  name: '目标识别',
  origin: '高德地图',
  status: '已完成',
  create_at: '2022-11-14',
});

const cesiumContainer = ref('');
const viewer = ref(null);
const nowModelName = ref('高德影像');
const zoomlv = ref(18);

const isSelected = ref(false);
const tblob = ref(null);

const location = ref(null);

const loadingText = ref('');
const isShow = ref(false);
const isInfer = ref(false);

let formData = new FormData();

async function handleDrawClick() {
  isSelected.value = !isSelected.value;

  if (isSelected.value) {
    viewer.value.removeEntities();
    viewer.value.removeImageLayers();

    viewer.value.startDrawRect();
  } else {
    if (!isLogined.value) {
      goAuthorize();
    } else {
      viewer.value.stopDrawRect();
      try {
        location.value = viewer.value.drawer.getAnsShapeRectCoor();

        const ltpoint = [location.value.west, location.value.north];
        const rbpoint = [location.value.east, location.value.south];

        isShow.value = true;
        loadingText.value = '获取图片中';

        tblob.value = await rectToImg(
          ltpoint,
          rbpoint,
          zoomlv.value,
          nowModelName.value
        );

        isShow.value = false;
        isInfer.value = true;
        loadingText.value = '';
      } catch (err) {
        ElMessage({
          type: 'warning',
          message: '请选择区域',
        });
      }
    }
  }
}
// 1. 未选区域，点击识别提示，不发请求
// 2. 选区结束，推理完成后，未再次选区，点击识别提示，不发请求
function handleInferClick() {
  if (loadingText.value === '获取图片中') {
    ElMessage({
      type: 'warning',
      message: '获取图片中，请稍等...',
    });
    return;
  }

  if (isInfer.value) {
    isShow.value = true;
    loadingText.value = '上传图片中，请耐心等待';
    formData = new FormData();
    formData.append('picture', tblob.value);
    // 上传图片到obs;
    handleLuojiaUploadPic(formData).then((res) => {
      if (res.status === 201 && res.data.data) {
        loadingText.value = '推理中，请耐心等待';
        handleLuoJiaInfer().then((res) => {
          isShow.value = false;
          if (res.status === 201 && res.data.data) {
            const aurl = res.data.data.answer;
            const tempimg = document.createElement('img');
            tempimg.src = aurl;
            viewer.value.setImageAsLayer(tempimg);
          }
        });
      } else {
        isShow.value = false;
        ElMessage({
          type: 'error',
          message: res.data.msg,
        });
      }
    });
  } else if (!isInfer.value) {
    ElMessage({
      type: 'warning',
      message: '请先框选，再开始识别',
    });
  } else if (isSelected.value && !isInfer.value) {
    ElMessage({
      type: 'warning',
      message: '请先结束框选，再开始识别',
    });
  }
}

const inputImg = `https://luojianet.obs.cn-central-221.ovaijisuan.com/infer/${userInfoStore.userName}/input.png`;

const outputImg = `https://luojianet.obs.cn-central-221.ovaijisuan.com/infer/${userInfoStore.userName}/output.png`;

// 下载图片
function handleOriImgDownload() {
  let a = document.createElement('a');
  a.download = 'input.png';
  a.href = inputImg;
  a.click();
}

function handleResImgDownload() {
  fetch(outputImg)
    .then((res) => res.blob())
    .then((blob) => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'output.png';
      a.click();
    });
}

function handleHistoryClick() {
  // ElMessage({
  //   type: 'warning',
  //   message: '开发中，敬请期待。',
  // });
  dialogTableVisible.value = true;
  gridData.value = [];
  gridData.value.push(historyInfo.value);
  // handleLuoJiaHistory().then((res) => {
  //   if (res.status === 200) {
  //     gridData.value = [];
  //     historyInfo.value.create_at = res.create_time;
  //     gridData.value.push(historyInfo.value);
  //   }
  // });
}

function handleDetailClick() {
  dialogTableVisible.value = false;
  dialogTableVisibleDetail.value = true;
}

onMounted(() => {
  viewer.value = new ExampleCesium(cesiumContainer.value);
});
</script>
<template>
  <div class="luojia">
    <div class="luojia-top">
      <p class="type">目标检测（Object Detection）</p>
      <p class="desc">
        指一个特殊目标（或一种类型的目标）从其它目标（或其它类型的目标）中被区分出来的过程。它既包括俩个非常相似目标的识别，也包括一种类型的目标同其他类型目标的识别。<br />
      </p>

      <div class="process">
        <span class="title">操作流程：</span>
        <span>①&nbsp;选择区域-></span>
        <span>②&nbsp;点击左上角开始选区按钮-></span>
        <span>③&nbsp;左键选择区域角点-></span>
        <span>④&nbsp;再次左键选择区域另一角点-></span>
        <span>⑤&nbsp;右键取消选区操作-></span>
        <span>⑥&nbsp;点击左上角取消选区，获取选区图片-></span>
        <span>⑦&nbsp;点击右上角开始识别按钮-></span>
        <span>⑧&nbsp;请耐心等待约1分钟，可在历史记录中查看最近的一条数据</span>
      </div>
    </div>
    <div class="luojia-bottom">
      <div ref="cesiumContainer" class="map-container">
        <!-- 对比分割线 -->
        <div id="slider" class="slider"></div>

        <div v-if="!isShow" class="select-button" @click="handleDrawClick">
          <o-icon><icon-select></icon-select></o-icon>
          <span>{{ isSelected ? '结束选区' : '开始选区' }}</span>
          <div v-if="isSelected" class="select-tip">
            左键选点，右键确定矩形
            <div class="triangle"></div>
          </div>
        </div>

        <div class="result-button button-wrap">
          <div @click="handleHistoryClick">
            <o-icon><icon-history></icon-history></o-icon>
            <span>历史记录</span>
          </div>
        </div>

        <div class="start-button button-wrap">
          <o-icon><icon-start></icon-start></o-icon>
          <span @click="handleInferClick">开始识别</span>
        </div>

        <div v-if="isShow" class="loading-box">
          <img :src="gif" alt="" />
          <p>{{ loadingText }}</p>
        </div>
      </div>
      <div class="tip">温馨提示：加载较慢，请耐心等待，或刷新重试。</div>
    </div>
    <!-- 列表 -->
    <el-dialog v-model="dialogTableVisible" title="历史记录">
      <el-table :data="gridData">
        <el-table-column property="name" label="任务类型" />
        <el-table-column property="origin" label="地图源数据" />
        <el-table-column property="status" label="状态" />
        <el-table-column property="create_at" label="创建时间" width="220" />
        <el-table-column label="操作">
          <span class="detail" @click="handleDetailClick">查看详情</span>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- 详情 -->
    <el-dialog v-model="dialogTableVisibleDetail" title="详情" width="750px">
      <div class="compare-box">
        <div class="original">
          <img :src="inputImg + '?' + Math.random()" alt="" />
          <div class="botoom">
            <p>原图</p>
            <div class="download" @click="handleOriImgDownload">
              <o-icon><icon-download></icon-download></o-icon>
              <span>下载</span>
            </div>
          </div>
        </div>

        <div class="result">
          <img :src="outputImg + '?' + Math.random()" alt="" />
          <div class="botoom">
            <p>结果图</p>
            <div class="download" @click="handleResImgDownload">
              <o-icon><icon-download></icon-download></o-icon>
              <span>下载</span>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<style lang="scss" scoped>
// 对比框
.compare-box {
  display: flex;
  justify-content: space-between;
  img {
    width: 315px;
    height: 315px;
  }
  .original,
  .result {
    .botoom {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      font-weight: 400;
      color: #555555;
      line-height: 22px;
      margin-top: 16px;
      .download {
        display: flex;
        align-items: center;
        cursor: pointer;
        &:hover {
          color: #0d8dff;
        }
        .o-icon {
          margin-right: 4px;
        }
      }
    }
  }
}
:deep(.el-table) {
  --el-table-header-bg-color: #e5e8f0;
  --el-table-row-hover-bg-color: #f7f8fa;
  --el-table-border-color: #e5e5e5;
  box-shadow: 0 1px 5px rgba(45, 47, 51, 0.1);
  color: #707070;
  --el-table-border: none;
  .el-table__empty-block {
    background-color: #fff;
  }
  thead {
    font-size: 14px;
    color: #000000;
    line-height: 22px;
  }
  .detail {
    cursor: pointer;
    color: #0d8dff;
  }
  tr {
    background: #fff;
    position: relative;
    &::after {
      width: calc(100% - 32px);
      background: #e5e5e5;
      content: ' ';
      display: inline-block;
      height: 1px;
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);

      z-index: 1;
    }
    &:last-child::after {
      height: 0;
    }
    td {
      color: #707070;
    }
  }
  .el-table__cell {
    padding: 16px 0;
    font-size: 14px;
    color: #555555;
    line-height: 22px;
  }
}

:deep(.el-dialog) {
  --el-dialog-margin-top: 30vh;
  z-index: 1000;
  .el-dialog__headerbtn {
    top: 16px;
    right: 16px;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .el-dialog__header {
    padding: 24px 40px;
    .el-dialog__title {
      font-size: 18px;
      font-weight: 400;
      color: #000000;
      line-height: 25px;
    }
  }
  .el-dialog__body {
    padding: 0px 40px 40px;
  }
}
.map-container {
  position: relative;

  :deep(.cesium-viewer-toolbar) {
    right: 156px;
    top: 16px;

    .cesium-toolbar-button {
      border: none;
      background: none;
      &:nth-child(1) {
        display: none;
      }
    }
    .cesium-home-button {
      background: rgba(0, 0, 0, 0.5);
      border: 1px solid #444;
    }
    .cesium-baseLayerPicker-selected {
      display: none;
    }

    .cesium-svgPath-svg {
      width: 20px;
      height: 20px;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
  :deep(.cesium-geocoder-searchButton) {
    background: none;
  }
  :deep(.cesium-viewer-geocoderContainer .cesium-geocoder-input) {
    background: rgba(0, 0, 0, 0.5);
    border-radius: 4px;
  }
  :deep(.cesium-viewer-bottom) {
    display: none;
  }
  :deep(.cesium-viewer-fullscreenContainer) {
    display: none !important;
  }
}
.loading-box {
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 100;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 90px;
  img {
    width: 60px;
  }
  p {
    font-size: 16px;
    color: #ffffff;
    line-height: 22px;
  }
}
.button-wrap {
  color: #fff;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
  font-size: 14px;
  line-height: 16px;
  position: absolute;
  z-index: 99;
  top: 16px;
  &:hover {
    box-shadow: 0 0 8px #fff;
  }
  cursor: pointer;
  .o-icon {
    margin-right: 8px;
  }
  &:hover {
    color: #66e6ff;
  }
}
.select-button {
  color: #fff;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
  font-size: 14px;
  line-height: 16px;
  cursor: pointer;
  z-index: 99;
  top: 16px;
  left: 16px;
  &:hover {
    box-shadow: 0 0 8px #fff;
  }
  .o-icon {
    margin-right: 8px;
  }
  position: absolute;
  &:hover {
    color: #66e6ff;
    .o-icon {
      color: #66e6ff;
    }
    .select-tip {
      display: block;
    }
  }
}
.select-tip {
  position: absolute;
  top: 52px;
  left: 0px;
  width: 152px;
  z-index: 100;
  font-size: 12px;
  color: #ffffff;
  line-height: 20px;
  padding: 10px;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.5);
  box-shadow: 0px -10px 32px 0px rgba(45, 47, 51, 0.18);
  .triangle {
    position: absolute;
    top: -16px;
    left: 12px;
    width: 0;
    height: 0;
    border-top: 8px solid transparent;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 8px solid rgba(0, 0, 0, 0.5);
  }
}

.result-button {
  right: 125px;
  display: flex;
  align-items: center;
  div {
    display: flex;
    align-items: center;
    line-height: 16px;
  }
  .divider {
    margin: 0 7px;
    width: 1px;
    height: 17px;
    border: 1px dashed #979797;
  }
}
.start-button {
  right: 15px;
}
.slider {
  position: absolute;
  top: 0px;
  left: -3500px;
  z-index: 10;
  width: 5px;
  height: 100%;
  background-color: #d3d3d3;
}
.luojia {
  &-top {
    .process {
      margin-top: 8px;
      font-size: 14px;
      line-height: 28px;
      font-weight: 400;
      color: #555555;
      .title {
        color: #000000;
        font-weight: 600;
      }
      span {
        margin-left: 4px;
      }
    }
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
    margin-top: 24px;
    .tip {
      font-size: 14px;
      font-weight: 400;
      color: #555555;
      line-height: 22px;
      margin-top: 16px;
    }
  }
}
</style>
