<script setup>
import { ref, onMounted, computed } from 'vue';

import { request } from '@/shared/axios';
import { goAuthorize } from '@/shared/login';
import { useLoginStore, useUserInfoStore } from '@/stores';

import ExampleCesium from '@/shared/modelzoo/luojia/luojianet.js';
import { rectToImg } from '@/shared/modelzoo/luojia/tiles-to-img.js';

import IconSelect from '~icons/app/luojia-select';
import IconStart from '~icons/app/luojia-start';
import IconHistory from '~icons/app/luojia-history';
import IconDownload from '~icons/app/download';
import IconUpload from '~icons/app/modelzoo-upload';

import gif from '@/assets/gifs/loading.gif';
import { ElMessage } from 'element-plus';

import {
  handleLuoJiaInfer,
  handleLuoJiaHistory,
  handleLuojiaUploadPic,
} from '@/api/api-modelzoo';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const userInfoStore = useUserInfoStore();
const isLogined = computed(() => useLoginStore().isLogined);

const dialogTableVisible = ref(false);
const dialogTableVisibleDetail = ref(false);
const gridData = ref([]);
const historyInfo = ref({
  name: t('luojia.EXPERIENCE.HISTORY_INFO.NAME'),
  origin: t('luojia.EXPERIENCE.HISTORY_INFO.ORIGIN'),
  status: t('luojia.EXPERIENCE.HISTORY_INFO.STATUS'),
  create_at: '',
  id: '',
});

const cesiumContainer = ref('');
const viewer = ref(null);
const nowModelName = ref('高德影像');

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
        loadingText.value = t('luojia.EXPERIENCE.LOADING_TEXT');

        tblob.value = await rectToImg(
          ltpoint,
          rbpoint, // zoomlv.value,
          nowModelName.value
        );

        isShow.value = false;
        isInfer.value = true;
        loadingText.value = '';
      } catch (err) {
        ElMessage({
          type: 'warning',
          message: t('luojia.EXPERIENCE.WARNING_MSG1'),
        });
      }
    }
  }
}

const activeIndex1 = ref(-1);
const fileList = ref([]);
const activeIndex = ref(-1);
const analysis = ref('');
const imageUrl = ref('');
function handleMobile(mobile) {
  if (mobile === 'mobile') {
    activeIndex1.value = -1;
    if (!isLogined.value) {
      goAuthorize();
    } else {
      if (fileList.value[0]) {
        isInfer.value = true;
      } else {
        ElMessage({
          type: 'warning',
          message: t('luojia.EXPERIENCE.WARNING_MSG3'),
        });
        return;
      }
    }
  }
}
function handleRes(mobile, res) {
  if (res.data?.data) {
    if (mobile === 'mobile') {
      activeIndex.value = -1;
      analysis.value = '';
      formData.delete('file');
      formData = new FormData();
      imageUrl.value = res.data.data.answer;
      request
        .get(res.data.data.answer, {
          responseType: 'blob',
        })
        .then((res) => {
          let file = new File([res.data], 'img', {
            type: 'image/png',
            lastModified: Date.now(),
          });
          fileList.value = [];
          fileList.value[0] = { raw: file };
        });

      handleLuoJiaHistory().then((res) => {
        if (res.data) {
          gridData.value = [];
          historyInfo.value.create_at = res.data[0].created_at;
          historyInfo.value.id = res.data[0].id;
          gridData.value.push(historyInfo.value);
        } else {
          gridData.value = [];
        }
      });
    } else {
      const aurl = res.data.data.answer;
      const tempimg = document.createElement('img');
      tempimg.src = aurl;
      viewer.value.setImageAsLayer(tempimg);
    }
  }
}
// 1. 未选区域，点击识别提示，不发请求
// 2. 选区结束，推理完成后，未再次选区，点击识别提示，不发请求
function handleInferClick(mobile) {
  if (loadingText.value === t('luojia.EXPERIENCE.LOADING_TEXT')) {
    ElMessage({
      type: 'warning',
      message: t('luojia.EXPERIENCE.WARNING_MSG2'),
    });
    return;
  }
  handleMobile(mobile);
  if (isInfer.value) {
    isShow.value = true;
    loadingText.value = t('luojia.EXPERIENCE.LOADING_TEXT1');
    if (mobile === 'mobile') {
      formData.append('picture', fileList.value[0].raw);
    } else {
      formData = new FormData();
      formData.append('picture', tblob.value);
    }
    // 上传图片到obs;
    handleLuojiaUploadPic(formData).then((res) => {
      if (res.data.data) {
        loadingText.value = t('luojia.EXPERIENCE.LOADING_TEXT2');
        handleLuoJiaInfer().then((res) => {
          isShow.value = false;
          handleRes(mobile, res);
        });
      } else {
        isShow.value = false;
        ElMessage({
          type: 'error',
          message: res.data.msg,
        });
      }
    });
  } else if (!isInfer.value && mobile !== 'mobile') {
    ElMessage({
      type: 'warning',
      message: t('luojia.EXPERIENCE.WARNING_MSG4'),
    });
  } else if (isSelected.value) {
    ElMessage({
      type: 'warning',
      message: t('luojia.EXPERIENCE.WARNING_MSG5'),
    });
  }
}

const inputImg = `https://big-model-deploy.obs.cn-central-221.ovaijisuan.com/luojianet/infer/${userInfoStore.userName}/input.png`;

const outputImg = `https://big-model-deploy.obs.cn-central-221.ovaijisuan.com/luojianet/infer/${userInfoStore.userName}/output.png`;

// 下载图片
function handleOriImgDownload() {
  fetch(inputImg)
    .then((res) => res.blob())
    .then((blob) => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'input.png';
      a.click();
      URL.revokeObjectURL(a.href);
      a.remove();
    });
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
  if (!isLogined.value) {
    goAuthorize();
  } else {
    dialogTableVisible.value = true;
    gridData.value = [];
    gridData.value.push(historyInfo.value);
    handleLuoJiaHistory().then((res) => {
      if (res.data) {
        console.log('res.data: ', res.data);

        gridData.value = [];
        historyInfo.value.create_at = res.data[0].created_at;
        gridData.value.push(historyInfo.value);
        historyInfo.value.id = res.data[0].id;
      } else {
        gridData.value = [];
      }
    });
  }
}
if (isLogined.value) {
  handleLuoJiaHistory().then((res) => {
    if (res.data) {
      gridData.value = [];
      historyInfo.value.create_at = res.data[0].created_at;
      gridData.value.push(historyInfo.value);
    } else {
      gridData.value = [];
    }
  });
}
function handleDetailClick() {
  dialogTableVisible.value = false;
  dialogTableVisibleDetail.value = true;
}

onMounted(() => {
  viewer.value = new ExampleCesium(cesiumContainer.value);
});
// 移动端
const imgLists = [
  {
    id: 0,
    url: 'luojia-example-00',
  },
  {
    id: 1,
    url: 'luojia-example-01',
  },
  {
    id: 2,
    url: 'luojia-example-02',
  },
  {
    id: 3,
    url: 'luojia-example-03',
  },
  {
    id: 4,
    url: 'luojia-example-04',
  },
];
function handleChange(val) {
  if (
    val.raw.type === 'image/jpeg' ||
    val.raw.type === 'image/png' ||
    val.raw.type === 'image/jpg'
  ) {
    if (val.size > 5242880) {
      return ElMessage({
        type: 'warning',
        message: t('taichu.IMAGE_CAPTION.IMG_LIMIT'),
      });
    } else {
      activeIndex1.value = 5;
      analysis.value = '';
      formData.delete('file');
      formData = new FormData();
      fileList.value[0] = val;
      fileList.value.length > 1 ? fileList.value.splice(0, 1) : '';
      activeIndex.value = -1;
      imageUrl.value = URL.createObjectURL(val.raw);
    }
  } else {
    ElMessage({
      type: 'warning',
      message: '请选择jpeg/jpg/png图片上传',
    });
    return;
  }
}

const getImage = (name) => {
  return new URL(
    `../../../assets/imgs/luojia/luojia-example/${name}.jpg`,
    import.meta.url
  ).href;
};
function selectImage(item, index) {
  activeIndex.value = index;
  activeIndex1.value = index;
  if (imageUrl.value !== getImage(item)) {
    analysis.value = '';
    formData.delete('file');
    formData = new FormData();
    imageUrl.value = getImage(item);
    request
      .get(getImage(item), {
        responseType: 'blob',
      })
      .then((res) => {
        let file = new File([res.data], 'img', {
          type: 'image/png',
          lastModified: Date.now(),
        });
        fileList.value = [];
        fileList.value[0] = { raw: file };
      });
  }
}

const showPic = ref(false);
const dialogImg = ref('');
function enlarge(url) {
  showPic.value = true;
  dialogImg.value = url;
}
</script>
<template>
  <div class="luojia">
    <div class="luojia-top">
      <p class="type">{{ t('luojia.EXPERIENCE.MODEL_TYPE') }}</p>
      <p class="desc">
        {{ t('luojia.EXPERIENCE.MODEL_DESC') }}
      </p>
    </div>
    <div class="luojia-bottom">
      <div ref="cesiumContainer" class="map-container">
        <!-- 对比分割线 -->
        <div id="slider" class="slider"></div>

        <div v-if="!isShow" class="select-button" @click="handleDrawClick">
          <o-icon><icon-select></icon-select></o-icon>
          <span>{{
            isSelected
              ? t('luojia.EXPERIENCE.END_SELECT')
              : t('luojia.EXPERIENCE.START_SELECT')
          }}</span>
          <div v-if="isSelected" class="select-tip">
            {{ t('luojia.EXPERIENCE.SELECT_RULE') }}
            <div class="triangle"></div>
          </div>
        </div>

        <div class="result-button button-wrap">
          <div @click="handleHistoryClick">
            <o-icon><icon-history></icon-history></o-icon>
            <span>{{ t('luojia.EXPERIENCE.HISTORY') }}</span>
          </div>
        </div>

        <div class="start-button button-wrap">
          <o-icon><icon-start></icon-start></o-icon>
          <span @click="handleInferClick">{{
            t('luojia.EXPERIENCE.DISCRIMINATE')
          }}</span>
        </div>

        <div v-if="isShow" class="loading-box">
          <img :src="gif" alt="" />
          <p>{{ loadingText }}</p>
        </div>
      </div>

      <div class="process">
        <span>①&nbsp;{{ t('luojia.EXPERIENCE.STEP_1') }}</span>
        <span>②&nbsp;{{ t('luojia.EXPERIENCE.STEP_2') }}</span>
        <span>③&nbsp;{{ t('luojia.EXPERIENCE.STEP_3') }}</span>
        <span>④&nbsp;{{ t('luojia.EXPERIENCE.STEP_4') }}</span>
        <span>⑤&nbsp;{{ t('luojia.EXPERIENCE.STEP_5') }}</span>
        <span>⑥&nbsp;{{ t('luojia.EXPERIENCE.STEP_6') }}</span>
        <span>⑦&nbsp;{{ t('luojia.EXPERIENCE.STEP_7') }}</span>
        <span>⑧&nbsp;{{ t('luojia.EXPERIENCE.STEP_8') }}</span>
      </div>

      <div class="tip">
        {{ t('luojia.EXPERIENCE.LOADING_TIP') }}
      </div>
    </div>
    <!-- 列表 -->
    <el-dialog v-model="dialogTableVisible">
      <template #header>
        <p>{{ t('luojia.EXPERIENCE.HISTORY') }}</p>
      </template>
      <el-table :data="gridData" table-layout="auto">
        <el-table-column
          property="id"
          :label="t('luojia.EXPERIENCE.TAB_ITEM_7')"
        />
        <el-table-column
          property="name"
          :label="t('luojia.EXPERIENCE.TAB_ITEM_1')"
        />
        <el-table-column
          property="origin"
          :label="t('luojia.EXPERIENCE.TAB_ITEM_2')"
        />
        <el-table-column
          property="status"
          :label="t('luojia.EXPERIENCE.TAB_ITEM_3')"
          width="92"
        />
        <el-table-column
          property="create_at"
          :label="t('luojia.EXPERIENCE.TAB_ITEM_4')"
        />
        <el-table-column :label="t('luojia.EXPERIENCE.TAB_ITEM_5')">
          <span class="detail" @click="handleDetailClick">{{
            t('luojia.EXPERIENCE.VIEW_DETAIL')
          }}</span>
        </el-table-column>
      </el-table>
      <p class="history-tip">{{ t('luojia.EXPERIENCE.HISTORY_TIP') }}</p>
    </el-dialog>
    <!-- 详情 -->
    <el-dialog
      v-model="dialogTableVisibleDetail"
      class="result-dlg"
      :title="t('luojia.EXPERIENCE.DETAIL')"
    >
      <div class="compare-box">
        <div class="original">
          <img :src="inputImg" alt="" />
          <div class="botoom">
            <p>{{ t('luojia.EXPERIENCE.ORIGIN') }}</p>
            <div class="download" @click="handleOriImgDownload">
              <o-icon><icon-download></icon-download></o-icon>
              <span>{{ t('luojia.EXPERIENCE.DOWNLOAD') }}</span>
            </div>
          </div>
        </div>

        <div class="result">
          <img :src="outputImg" alt="" />
          <div class="botoom">
            <p>{{ t('luojia.EXPERIENCE.RESULT') }}</p>
            <div class="download" @click="handleResImgDownload">
              <o-icon><icon-download></icon-download></o-icon>
              <span>{{ t('luojia.EXPERIENCE.DOWNLOAD') }}</span>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
    <div class="luojia-mobile">
      <div class="image-upload">
        <el-upload
          drag
          action=""
          :multiple="false"
          accept=".png,.jpeg,.jpg"
          list-type="picture"
          :file-list="fileList"
          :auto-upload="false"
          :show-file-list="false"
          :on-change="handleChange"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <div v-else class="empty-status">
            <o-icon><icon-upload></icon-upload></o-icon>
            <p class="upload-tip">
              {{ t('luojia.EXPERIENCE.MOBILD_UPLOAD') }}
            </p>
          </div>
        </el-upload>
      </div>
      <div class="img-list">
        <div
          v-for="(item, index) in imgLists"
          :key="item"
          class="img-list-item"
          :class="item.id === activeIndex ? 'active' : ''"
          @click="selectImage(item.url, index)"
        >
          <div class="img">
            <img draggable="false" :src="getImage(item.url)" />
          </div>
          <div class="modal"></div>
        </div>
        <!-- <o-icon
          @click="selectImage(imgLists[activeIndex - 1].url, activeIndex - 1)"
          ><icon-left></icon-left
        ></o-icon>
        <o-icon
          @click="selectImage(imgLists[activeIndex + 1].url, activeIndex + 1)"
          ><icon-left></icon-left
        ></o-icon> -->
      </div>
      <o-button
        :disabled="activeIndex1 === -1"
        type="primary"
        size="mini"
        @click="handleInferClick('mobile')"
        >{{ t('luojia.EXPERIENCE.DISCRIMINATE') }}</o-button
      >
      <div class="history">
        <span>{{ t('luojia.EXPERIENCE.HISTORY') }}</span>
        <span>{{ t('luojia.EXPERIENCE.HISTORY_TIP') }}</span>
      </div>
      <div class="table">
        <el-table :data="gridData">
          <el-table-column
            property="name"
            :label="t('luojia.EXPERIENCE.TAB_ITEM_1')"
          />
          <el-table-column
            property="origin"
            :label="t('luojia.EXPERIENCE.TAB_ITEM_6')"
          />
          <el-table-column
            property="status"
            :label="t('luojia.EXPERIENCE.TAB_ITEM_3')"
          />
          <el-table-column
            property="create_at"
            :label="t('luojia.EXPERIENCE.TAB_ITEM_4')"
            width="90"
          />
          <!-- <el-table-column label="操作">
            <span class="detail" @click="handleDetailClick">查看详情</span>
          </el-table-column> -->
        </el-table>
      </div>
      <div v-if="gridData.length">
        <div class="img-detail">{{ t('luojia.EXPERIENCE.DETAIL') }}</div>
        <div class="compare-box">
          <div class="original">
            <img :src="inputImg" alt="" @click="enlarge(inputImg)" />
            <div class="botoom">
              <p>{{ t('luojia.EXPERIENCE.ORIGIN') }}</p>
              <!-- <div class="download" @click="handleOriImgDownload">
                <o-icon><icon-download></icon-download></o-icon>
                <span>下载</span>
              </div> -->
            </div>
          </div>
          <div class="result">
            <img :src="outputImg" alt="" @click="enlarge(outputImg)" />
            <div class="botoom">
              <p>{{ t('luojia.EXPERIENCE.RESULT') }}</p>
              <!-- <div class="download" @click="handleResImgDownload">
                <o-icon><icon-download></icon-download></o-icon>
                <span>下载</span>
              </div> -->
            </div>
          </div>
        </div>
      </div>
      <el-dialog
        v-model="showPic"
        :destroy-on-close="true"
        :fullscreen="true"
        lock-scroll
        center
      >
        <img :src="dialogImg" alt=""
      /></el-dialog>
    </div>
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
    border-radius: 16px;
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

    @media screen and (max-width: 768px) {
      .el-table__empty-text {
        line-height: 52px;
      }
    }
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

:deep(.result-dlg) {
  width: 750px;
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
    justify-content: flex-start;

    .el-dialog__title {
      font-size: 18px;
      font-weight: 400;
      color: #000000;
      line-height: 25px;
    }
  }

  .el-dialog__body {
    padding: 0px 40px 24px !important;

    .history-tip {
      font-size: 14px;
      color: #555555;
      line-height: 22px;
      margin-top: 24px;
    }
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

  :deep(.cesium-infoBox) {
    display: none !important;
  }

  :deep(.cesium-widget) {
    canvas {
      border-radius: 16px;
    }
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
  width: 296px;
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
  .luojia-top {
    .type {
      font-size: 36px;
      color: #000000;
      text-align: center;
      line-height: 48px;
      margin-top: 40px;

      @media screen and (max-width: 768px) {
        font-size: 14px;
        height: 22px;
        line-height: 22px;
        margin: 0 0 8px;
        text-align: center;
      }
    }

    .desc {
      font-size: 14px;
      font-weight: 400;
      color: #555555;
      text-align: center;
      line-height: 22px;
      margin-top: 16px;

      @media screen and (max-width: 768px) {
        height: auto;
        font-size: 12px;
        line-height: 18px;
        margin-bottom: 8px;
      }
    }
  }

  &-bottom {
    margin-top: 24px;

    @media screen and (max-width: 768px) {
      display: none;
    }

    @media screen and (max-width: 820px) {
      display: none;
    }

    .process {
      margin-top: 20px;
      font-size: 14px;
      line-height: 28px;
      font-weight: 400;
      color: #555555;

      span {
        margin-left: 4px;
      }

      @media screen and (max-width: 768px) {
        display: none;
      }

      @media screen and (max-width: 820px) {
        display: none;
      }
    }

    .tip {
      font-size: 14px;
      font-weight: 400;
      color: #555555;
      line-height: 22px;
      margin-top: 24px;
    }
  }
}

.luojia-mobile {
  display: none;

  @media screen and (max-width: 768px) {
    display: block;
  }

  @media screen and (max-width: 820px) {
    display: block;
  }

  :deep(.el-dialog) {
    --el-dialog-margin-top: 0;

    @media screen and (max-width: 820px) {
      overflow: scroll;
    }

    @media screen and (max-width: 767px) {
      overflow: hidden;
    }

    .el-dialog__body {
      img {
        width: 100%;
      }

      // padding: 60px 16px 40px !important;
      margin-top: 0;

      @media screen and (max-width: 820px) {
        height: 100%;
        display: flex;
        align-items: center;
      }
    }
  }

  :deep(.el-upload) {
    width: 100%;

    .el-upload-dragger {
      width: 100%;
      border: none;
      border-radius: 0;
      // padding: 24px 40px 24px 40px;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #acacac;

      @media screen and (max-width: 820px) {
        height: 346px;
        margin: 16px 0;
      }

      @media screen and (max-width: 767px) {
        height: 196px;
        margin: 0;
      }

      border: 1px solid #acacac;
      background-color: #f5f6f8;

      img {
        border: 1px solid #a0d2ff;
        max-height: 100%;
        max-width: 100%;
        object-fit: fill;
      }
    }
  }

  .empty-status {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0 40px;

    .o-icon {
      color: #ccc;
      font-size: 48px;

      @media screen and (max-width: 820px) {
        font-size: 32px;
      }
    }

    .upload-tip {
      font-size: 14px;
      color: #ccc;
      line-height: 22px;
      margin-top: 8px;

      span {
        color: #0d8dff;
        white-space: nowrap;
      }
    }
  }

  .img-list {
    display: flex;
    background-color: #f5f6f8;
    // justify-content: space-around;
    align-items: center;
    margin: 16px 0 0;
    position: relative;

    .o-icon {
      color: #b2b2b2;
      position: absolute;
      left: -16px;

      &:last-child {
        left: unset;
        right: -16px;
        rotate: 180deg;
      }
    }

    // width: 100%;
    .img-list-item {
      position: relative;
      cursor: pointer;
      width: 100%;
      // height: 0;
      // padding-bottom: 100%;
      border: 1px solid transparent;

      .img {
        width: 100%;
        height: 0;
        padding-bottom: 100%;
        overflow: hidden;

        img {
          width: 180%;
        }
      }

      .modal {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        display: none;
        background: rgba(165, 213, 255, 0.5);
      }
    }

    .img-list-item + .img-list-item {
      @media screen and (max-width: 820px) {
        margin-left: 8px;
      }

      @media screen and (max-width: 767px) {
        margin-left: 4px;
      }
    }

    .active {
      border: 1px solid #a0d2ff;

      .modal {
        display: block;
      }
    }
  }

  .o-button {
    display: block;
    margin: 16px auto 0;
  }

  .history {
    font-size: 14px;
    height: 22px;
    line-height: 22px;
    margin: 24px 0 16px;
    display: flex;
    justify-content: space-between;

    span:last-child {
      color: #999;
    }

    @media screen and (max-width: 820px) {
      span:last-child {
        font-size: 12px;
      }
    }
  }

  .table {
    :deep(.el-table) {
      overflow: auto;
      box-shadow: none;

      .el-table__header {
        .el-table__cell {
          height: 36px;
          font-size: 12px;
          line-height: 22px;

          .cell {
            padding: 0 10px;
          }
        }
      }

      .el-table__body-wrapper {
        .el-table__cell {
          height: 52px;
          font-size: 12px;
          line-height: 22px;

          .cell {
            padding: 0 10px;
          }
        }
      }
    }
  }

  .img-detail {
    font-size: 14px;
    height: 22px;
    line-height: 22px;
    margin: 24px 0 16px;
  }

  .compare-box {
    img {
      @media screen and (max-width: 820px) {
        width: 300px;
        height: 300px;
      }

      @media screen and (max-width: 767px) {
        width: 160px;
        height: 160px;
      }
    }
  }

  .el-overlay {
    @media screen and (max-width: 820px) {
      display: none;

      .el-overlay-dialog {
        display: none;
      }

      .el-dialog {
        display: none;
      }
    }
  }
}
</style>
