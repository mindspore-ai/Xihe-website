<script setup>
import { ref, onMounted } from 'vue';

import ExampleCesium from '@/shared/modelzoo/luojia/example-cesium';
import { rectToImg } from '@/shared/modelzoo/luojia/tiles-to-img';

import IconSelect from '~icons/app/luojia-select';
// import IconCompare from '~icons/app/luojia-compare';
import IconStart from '~icons/app/luojia-start';
import IconHistory from '~icons/app/luojia-history';
import IconDownload from '~icons/app/download';

const dialogTableVisible = ref(false);
const dialogTableVisibleDetail = ref(false);
const gridData = [
  {
    date: '123456789',
    name: '目标识别',
    address: '地图数据源',
  },
  {
    date: '123456789',
    name: '目标识别',
    address: '地图数据源',
  },
  {
    date: '123456789',
    name: '目标识别',
    address: '地图数据源',
  },
  {
    date: '123456789',
    name: '目标识别',
    address: '地图数据源',
  },
];

// const isShowSlider = ref(false);

const isSelected = ref(false);
const cesiumContainer = ref('');
const viewer = ref(null);
const nowModelName = ref('高德影像');
const zoomlv = ref(18);
const tblob = ref(null);

async function handleDrawClick() {
  // console.log(viewer);
  isSelected.value = !isSelected.value;
  //  开始选区/结束选区
  isSelected.value ? viewer.value.startDrawRect() : viewer.value.stopDrawRect();

  if (!isSelected.value) {
    // 获取矩形框坐标
    const location = viewer.value.drawer.getAnsShapeRectCoor();
    // console.log(location);
    const ltpoint = [location.west, location.north];
    const rbpoint = [location.east, location.south];
    tblob.value = await rectToImg(
      ltpoint,
      rbpoint,
      zoomlv.value,
      nowModelName.value
    );
    // console.log(tblob.value);
    // blob文件获取完成后取消下载图片按钮置灰

    const aurl = URL.createObjectURL(tblob.value);
    const tempimg = document.createElement('img');
    tempimg.src = aurl;
    viewer.value.setImageAsLayer(tempimg);
  }
}

// function handleCompareClick() {
//   isShowSlider.value = !isShowSlider.value;
// }
// 下载图片
// function handleImgDownload() {
//   if (tblob.value) {
//     const url = URL.createObjectURL(tblob.value);
//     let a = document.createElement('a');
//     a.download = 'input.png';
//     a.href = url;
//     a.click();
//   } else {
//     ElMessage({
//       type: 'warning',
//       message: '请框选区域',
//     });
//   }
// }

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
      <p class="type">目标识别（Object Detection）</p>
      <p class="desc">
        指一个特殊目标（或一种类型的目标）从其它目标（或其它类型的目标）中被区分出来的过程。它既包括俩个非常相似目标的识别，也包括一种类型的目标同其他类型目标的识别。
      </p>
    </div>
    <div class="luojia-bottom">
      <div ref="cesiumContainer" class="map-container">
        <!-- 对比分割线 -->
        <div id="slider" class="slider"></div>

        <div class="select-button button-wrap" @click="handleDrawClick">
          <o-icon><icon-select></icon-select></o-icon>
          <span>{{ isSelected ? '结束选区' : '开始选区' }}</span>
        </div>

        <div class="result-button button-wrap">
          <!-- <div @click="handleCompareClick">
            <o-icon><icon-compare></icon-compare></o-icon>
            <span>开启对比</span>
          </div>

          <span class="divider"></span> -->

          <div @click="dialogTableVisible = true">
            <o-icon><icon-history></icon-history></o-icon>
            <span>历史记录</span>
          </div>
        </div>

        <div class="start-button button-wrap">
          <o-icon><icon-start></icon-start></o-icon>
          <span>开始识别</span>
        </div>
      </div>
    </div>
    <!-- 列表 -->
    <el-dialog v-model="dialogTableVisible" title="历史记录">
      <el-table :data="gridData">
        <el-table-column property="date" label="任务ID" width="230" />
        <el-table-column property="name" label="任务类型" width="150" />
        <el-table-column property="address" label="地图源数据" />
        <el-table-column property="address" label="状态" />
        <el-table-column property="address" label="创建时间" />
        <el-table-column label="操作">
          <span class="detail" @click="handleDetailClick">查看详情</span>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- 详情 -->
    <el-dialog v-model="dialogTableVisibleDetail" title="详情" width="750px">
      <div class="compare-box">
        <div class="original">
          <img
            src="https://img0.baidu.com/it/u=2371305810,3587591415&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=281"
            alt=""
          />
          <div class="botoom">
            <p>原图</p>
            <div class="download">
              <o-icon><icon-download></icon-download></o-icon>
              <span>下载</span>
            </div>
          </div>
        </div>
        <div class="result">
          <img
            src="https://img0.baidu.com/it/u=3443901670,2726678779&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=281"
            alt=""
          />
          <div class="botoom">
            <p>结果图</p>
            <div class="download">
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
    &:hover {
      color: #0d8dff;
    }
  }
  // th.el-table__cell.is-leaf {
  //   border-bottom: none;
  // }
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
  :deep(.cesium-toolbar-button) {
    display: none;
  }
  :deep(.cesium-viewer-toolbar) {
    right: 330px;
    top: 16px;
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
  cursor: pointer;
  .o-icon {
    margin-right: 8px;
  }
  position: absolute;
  z-index: 100;
  top: 16px;
}
.select-button {
  left: 16px;
}

.result-button {
  right: 125px;
  display: flex;
  align-items: center;
  div {
    display: flex;
    align-items: center;
    line-height: 18px;
  }
  .divider {
    // align-self: center;
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
  // left: -3500px;
  z-index: 9999;
  width: 5px;
  height: 100%;
  background-color: #d3d3d3;
}
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
