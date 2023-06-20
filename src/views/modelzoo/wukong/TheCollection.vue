<script setup>
import { ref, onMounted, nextTick } from 'vue';

import html2canvas from 'html2canvas';

import IconEyeopen from '~icons/app/eye-open';
import IconCollected from '~icons/app/wk-collecte';
import IconShare from '~icons/app/share';
import IconSharegray from '~icons/app/share-gray';
import IconHeart from '~icons/app/heart-white';
import IconHeart2 from '~icons/app/heart-gray';
import IconDownload from '~icons/app/wukong-download';
import IconCopy from '~icons/app/copy-nickname';
import useClipboard from 'vue-clipboard3';

import {
  collectedPictures,
  cancelLikePicture,
  publicCollectedPicture,
} from '@/api/api-modelzoo.js';

import { useUserInfoStore } from '@/stores';
import { ElMessage } from 'element-plus';
import useWindowResize from '@/shared/hooks/useWindowResize.js';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const screenWidth = useWindowResize();

const userInfoStore = useUserInfoStore();
const { toClipboard } = useClipboard();

const collecteImages = ref([]);
// 给生成图片加文字水印
function addWatermark(imgUrl, index) {
  const img = new Image();
  img.crossOrigin = 'Anonymous';
  img.src = imgUrl;

  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, img.width, img.height);

    ctx.font = '24px 微软雅黑';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(t('wukong.BY_AI'), img.width - 182, img.height - 24);

    collecteImages.value[index].waterImg = canvas.toDataURL('image/png');

    return collecteImages.value[index];
  };
}
// 获取收藏图片
async function getCollectedImages() {
  try {
    const res = await collectedPictures();
    if (res.status === 200 && res.data.data) {
      collecteImages.value = res.data.data;
      res.data.data.forEach((item, index) => {
        addWatermark(item.link, index);
      });
    }
  } catch (err) {
    console.error(err);
  }
}
onMounted(() => {
  getCollectedImages();
});
// 取消收藏
const showConfirmDlg = ref(false);
const imgId = ref('');
function cancelCollect(id) {
  imgId.value = id;
  showConfirmDlg.value = true;
}
// 取消收藏图片
async function confirmQuitPublic() {
  try {
    const res = await cancelLikePicture(imgId.value);
    if (res.status === 204) {
      imgInfoDlg.value = false;
      ElMessage({
        type: 'success',
        message: t('wukong.CANCEL_COLLECTION_SUCCESS'),
      });
    }
    getCollectedImages();
  } catch (err) {
    console.error(err);
  }
  showConfirmDlg.value = false;
}
function cancelQuitPublic(val) {
  showConfirmDlg.value = val;
}

// 下载图片
function downloadImage(item) {
  let aLink = document.createElement('a');
  aLink.href = item;
  aLink.download = 'collection.png';
  aLink.click();
  aLink.remove();
}
const posterDlg = ref(false);
const posterLink = ref('');
const posterInfo = ref('');
const userAvatar = ref('');
userAvatar.value = userInfoStore.avatar.replace(
  'https://obs-xihe-beijing4.obs.cn-north-4.myhuaweicloud.com/',
  '/obs-xihe-avatar/'
);

const isSharedPoster = ref(false);
const shareImg = ref('');
// 分享海报dlg
function shareImage(link, desc, style) {
  posterInfo.value = desc + '  ' + style;
  posterLink.value = link.replace(
    'https://big-model-deploy.obs.cn-central-221.ovaijisuan.com:443/',
    '/obs-big-model/'
  );
  posterDlg.value = true;

  if (screenWidth.value <= 820) {
    nextTick(() => {
      const poster = document.querySelector('#screenshot');
      html2canvas(poster, {
        useCORS: true,
      }).then((canvas) => {
        shareImg.value = canvas.toDataURL('image/png');
        isSharedPoster.value = true;
      });
    });
  }
}
// 绘制圆角矩形（使用 arcTo）
function drawRoundedRect(ctx, x, y, width, height, radius) {
  // 保存当前环境的状态
  ctx.save();
  // 重置当前路径
  ctx.beginPath();
  // 移动到左上角
  ctx.moveTo(x + radius, y);
  // 绘制右上角
  ctx.arcTo(x + width, y, x + width, y + radius, radius);
  // 绘制右下角
  ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
  // 绘制左下角
  ctx.arcTo(x, height, x, height - radius, radius);
  // 绘制左上角
  ctx.arcTo(x, y, x + radius, y, radius);
  // 填充当前路径
  ctx.fill();
}
// 下载海报截图
function downloadPoster() {
  const poster = document.querySelector('#screenshot');
  html2canvas(poster, {
    useCORS: true,
  }).then((canvas) => {
    let url = canvas.toDataURL('image/png');
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = url;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      // 绘制圆角矩形
      drawRoundedRect(ctx, 0, 0, img.width, img.height, 38);
      // 对矩形进行剪切
      ctx.clip();
      // 绘制图片
      ctx.drawImage(img, 0, 0, img.width, img.height);

      const posterLink = canvas.toDataURL('image/png');
      let aLink = document.createElement('a');
      aLink.style.display = 'none';
      aLink.href = posterLink;
      aLink.download = 'poster.png';
      aLink.click();
      aLink.remove();
    };
  });
}
// 海报蒙层关闭事件
function handleDlgClose() {
  posterLink.value = '';
  isSharedPoster.value = false;
}
// 复制用户名
async function copyText(textValue) {
  await toClipboard(textValue);
  ElMessage({
    type: 'success',
    message: t('wukong.COPY'),
    center: true,
  });
}
// 公开收藏图片
async function publicImage(imgId) {
  try {
    const res = await publicCollectedPicture({ id: imgId });

    if (res.data.data.id) {
      ElMessage({
        type: 'success',
        message: t('wukong.PUBLIC_SUCCESS'),
      });
    }
  } catch (err) {
    if (err.code === 'wukong_no_authorization') {
      ElMessage({
        type: 'warning',
        message: t('wukong.EXISTED'),
      });
    } else if (err.code === 'wukong_duplicate_like') {
      ElMessage({
        type: 'warning',
        message: t('wukong.REPEAT_PUBLIC'),
      });
    }
  }
}

const copyContent = 'https://xihe.mindspore.cn/modelzoo/wukong';

// 移动端点击收藏图片
const imgInfoDlg = ref(false);
const imageInfo = ref();
function handleImageClick(img) {
  imageInfo.value = img;
  imgInfoDlg.value = true;
}
</script>
<template>
  <div class="collection">
    <div v-if="collecteImages.length !== 0" class="have-collections">
      <div v-for="item in collecteImages" :key="item.id" class="collect-item">
        <div v-if="screenWidth > 820" class="image-box">
          <img draggable="false" :src="item.waterImg" alt="" />

          <div class="handles">
            <div
              v-if="item.owner === userInfoStore.userName"
              class="icon-item"
              @click="publicImage(item.id)"
            >
              <o-icon><icon-eyeopen></icon-eyeopen></o-icon>
            </div>
            <div v-else></div>
            <div class="right">
              <div class="icon-item" @click="downloadImage(item.waterImg)">
                <o-icon><icon-download></icon-download></o-icon>
              </div>
              <div
                class="icon-item middle"
                @click="shareImage(item.link, item.desc, item.style)"
              >
                <o-icon><icon-share></icon-share></o-icon>
              </div>
              <div class="icon-item" @click="cancelCollect(item.id)">
                <o-icon><icon-heart></icon-heart></o-icon>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="image-box" @click="handleImageClick(item)">
          <img
            class="collected-img"
            draggable="false"
            :src="item.link"
            alt=""
          />
        </div>
        <div class="img-desc">
          <p>
            {{ t('wukong.FROM') }}{{ item.desc }}&nbsp;&nbsp;
            <span v-if="item.style">
              #{{ t('wukong.STYLE') }}{{ item.style }}
            </span>
          </p>
          <div class="img-owner">
            <div class="info-left">
              <img :src="item.avatar" alt="" />
              <span class="user-name">
                {{ item.owner }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="no-collection">
      <o-icon><icon-collected></icon-collected></o-icon>
      <p>{{ t('wukong.NO_COLLECTION') }}</p>
    </div>

    <!-- 移动端大图弹窗 -->
    <el-dialog
      v-model="imgInfoDlg"
      class="imginfo-dlg fullscreen-dialog"
      :fullscreen="true"
      center
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <template #header="{ titleClass }">
        <p :class="titleClass">
          {{ t('wukong.FROM') }}{{ imageInfo.desc }}&nbsp;&nbsp;
          <span v-if="imageInfo.style">
            #{{ t('wukong.STYLE') }}{{ imageInfo.style }}</span
          >
        </p>
      </template>

      <div class="image-info">
        <img class="collect-img" :src="imageInfo.link" alt="" />

        <div class="information">
          <div class="user-info">
            <img :src="userInfoStore.avatar" alt="" />
            <p>{{ userInfoStore.userName }}</p>
          </div>
        </div>
      </div>

      <div class="mobile-dlg-handles">
        <div class="img-handles">
          <div
            v-if="imageInfo.owner === userInfoStore.userName"
            class="icon-item"
            @click="publicImage(imageInfo.id)"
          >
            <o-icon><icon-eyeopen></icon-eyeopen></o-icon>
          </div>
          <div
            v-if="screenWidth > 820"
            class="icon-item"
            @click="downloadImage(imageInfo.link)"
          >
            <o-icon><icon-download></icon-download></o-icon>
            <!-- 测试移动端下载图片到本地 -->
          </div>
          <div
            class="icon-item"
            @click="shareImage(imageInfo.link, imageInfo.desc, imageInfo.style)"
          >
            <o-icon><icon-sharegray></icon-sharegray></o-icon>
          </div>
          <div class="icon-item" @click="cancelCollect(imageInfo.id)">
            <o-icon><icon-heart2></icon-heart2></o-icon>
          </div>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      v-model="posterDlg"
      align-center
      width="434"
      class="poster-dlg"
      :show-close="false"
      :close-on-press-escape="false"
      @close="handleDlgClose"
    >
      <div class="poster">
        <div v-if="!isSharedPoster" id="screenshot" class="poster-image">
          <img class="infer-img" draggable="false" :src="posterLink" alt="" />

          <img
            draggable="false"
            class="qr-code"
            src="@/assets/imgs/wukong/qr-code.png"
            alt=""
          />
          <img
            draggable="false"
            class="logo"
            src="@/assets/imgs/logo.png"
            alt=""
          />

          <p class="water-mark">{{ t('wukong.BY_AI') }}</p>

          <div class="mask"></div>

          <div class="info">
            <p class="desc">{{ posterInfo }}</p>
            <div class="user-info">
              <img :src="userAvatar" alt="" />
              <p>{{ userInfoStore.userName }}</p>
            </div>
          </div>
        </div>
        <img v-else class="shared-image" :src="shareImg" alt="" />

        <div class="poster-download">
          <div class="link">
            <p>{{ copyContent }}</p>
            <o-icon @click="copyText(`${copyContent}`)"
              ><icon-copy></icon-copy
            ></o-icon>
          </div>
          <div v-if="screenWidth > 820" class="button" @click="downloadPoster">
            {{ t('wukong.DOWNLOAD_POSTER') }}
          </div>
        </div>
        <p v-if="screenWidth <= 820" class="poster-tip">
          {{ t('wukong.SAVE_POSTER') }}
        </p>
      </div>
    </el-dialog>
    <textarea class="input-dom"></textarea>
    <el-dialog
      v-model="showConfirmDlg"
      class="confirm-dlg"
      width="640"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <template #header>
        <p class="confirm-title">{{ t('wukong.TIP_TITLE2') }}</p>
      </template>
      <div class="confirm-desc">
        {{ t('wukong.TIP_TEXT2') }}
      </div>
      <template #footer>
        <OButton
          :size="screenWidth < 820 ? 'mini' : 'small'"
          style="margin-right: 16px"
          @click="cancelQuitPublic(false)"
          >{{ t('wukong.BUTTON_CANCEL') }}</OButton
        >
        <OButton
          type="primary"
          :size="screenWidth < 820 ? 'mini' : 'small'"
          @click="confirmQuitPublic"
          >{{ t('wukong.BUTTON_CONFIRM') }}</OButton
        >
      </template>
    </el-dialog>
  </div>
</template>
<style lang="scss" scoped>
:deep(.el-dialog) {
  .el-dialog__header {
    padding: 0;
    position: sticky;
    top: 0;
    z-index: 200;
    .el-dialog__title {
      @media screen and (max-width: 820px) {
        font-size: 14px;
        line-height: 24px;
        padding: 0 40px;
      }
    }
  }
  .el-dialog__body {
    padding-top: 0;
    @media screen and (max-width: 820px) {
      width: 640px;
    }
    @media screen and (max-width: 767px) {
      width: 100%;
    }
  }

  .el-dialog__headerbtn {
    width: 48px;
    height: 48px;
    position: fixed;
    top: 6px;
    right: 15px;
    z-index: 201;
    @media screen and (max-width: 820px) {
      width: 24px;
      height: 24px;
      top: 12px;
      right: 12px;
    }
    .el-dialog__close {
      color: #fff;
      font-size: 40px;
      @media screen and (max-width: 820px) {
        font-size: 24px;
      }
    }
  }
}
// 大图弹窗
:deep(.imginfo-dlg.fullscreen-dialog) {
  border-radius: 0;
  .el-dialog__header {
    height: 80px;
    @media screen and (max-width: 768px) {
      height: 48px;
      line-height: 14px;
      padding: 12px 0;
    }
  }
  .el-dialog__body {
    height: calc(100vh - 80px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    background-color: #f5f6f8;
    border-radius: 24px 24px 0px 0px;
    @media screen and (max-width: 821px) {
      height: calc(100vh - 48px);
      padding: 0 16px;
    }
  }
  .image-info {
    position: relative;
    .collect-img {
      width: 100%;
      border-radius: 16px;
    }
    .information {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      color: #555;
      font-size: 14px;
      line-height: 24px;
      width: 100%;
      position: absolute;
      top: -40px;
      .user-info {
        display: flex;
        align-items: flex-end;
        img {
          width: 24px;
          border-radius: 50%;
          margin-right: 8px;
        }
      }
    }
  }
  .mobile-dlg-handles {
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    font-size: 16px;
    margin-top: 16px;
    .img-handles {
      padding: 8px;
      display: flex;
      align-items: center;
      background-color: #fff;
      border-radius: 22px;
      .icon-item {
        width: 16px;
        height: 16px;
        margin-right: 8px;
        border-radius: 50%;
        color: #b2b2b2;
        background: rgba(255, 255, 255, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        &:last-child {
          margin-right: 0px;
        }
      }
    }
  }
}
// 分享海报弹窗
:deep(.el-dialog.poster-dlg) {
  background-color: transparent;

  .el-dialog__header {
    display: none;
  }
  .el-dialog__body {
    padding: 0;
    @media screen and (max-width: 820px) {
      padding: 0 16px;
    }

    @media screen and (max-width: 767px) {
      // margin-top: 4vh;
    }
  }
  .poster {
    width: 100%;
    background: #ffffff;
    padding: 16px;
    margin: 0 auto;
    border-radius: 16px;

    @media screen and (max-width: 767px) {
      width: 100%;
      height: auto;
      padding: 8px 8px 16px;
    }
    .poster-image {
      width: 100%;
      position: relative;
      @media screen and (max-width: 768px) {
        width: 100%;
        height: calc(100% - 40px);
      }
      .mask {
        width: 100%;
        height: 80px;
        background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 100%);
        position: absolute;
        bottom: 55px;
        @media screen and (max-width: 768px) {
          bottom: 40px;
          height: 60px;
        }
      }
      .water-mark {
        position: absolute;
        right: 16px;
        bottom: 72px;
        z-index: 2;
        font-size: 12px;
        color: #fff;
        @media screen and (max-width: 768px) {
          bottom: 48px;
          right: 8px;
          font-size: 8px;
        }
      }
      .qr-code {
        width: 68px;
        height: 68px;
        position: absolute;
        right: 16px;
        bottom: 100px;
        z-index: 1;
        @media screen and (max-width: 768px) {
          width: 56px;
          height: 56px;
          right: 8px;
          bottom: 70px;
        }
      }
      .logo {
        position: absolute;
        left: 16px;
        bottom: 78px;
        width: 64px;
        height: 21px;
        z-index: 1;
        @media screen and (max-width: 768px) {
          width: 48px;
          height: 16px;
          left: 8px;
          bottom: 48px;
        }
      }
      .infer-img {
        width: 100%;
        min-height: 300px;
        border-radius: 16px 16px 0 0;
        @media screen and (max-width: 820px) {
          height: calc(100% - 40px);
        }
      }
      .info {
        width: 100%;
        background: #f5f6f8;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-radius: 0 0 16px 16px;
        padding: 16px;
        @media screen and (max-width: 768px) {
          padding: 8px;
        }
        .desc {
          font-size: 14px;
          font-weight: 400;
          color: #000000;
          line-height: 24px;
          @media screen and (max-width: 768px) {
            font-size: 12px;
            line-height: 24px;
          }
        }
        .user-info {
          display: flex;
          align-items: center;

          img {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            margin-right: 8px;
            @media screen and (max-width: 768px) {
              width: 16px;
              height: 16px;
              margin-right: 4px;
            }
          }
          p {
            font-size: 14px;
            font-weight: 400;
            color: #555555;
            line-height: 24px;
          }
        }
      }
    }
    .shared-image {
      width: 100%;
      height: auto;
    }
    .poster-download {
      margin-top: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      @media screen and (max-width: 768px) {
        margin-top: 8px;
      }
      .link {
        flex: 1;
        height: 36px;
        background: #ffffff;
        border: 1px solid #999999;
        padding-left: 16px;
        padding-right: 10px;
        margin-right: 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-radius: 18px;
        @media screen and (max-width: 768px) {
          width: 200px;
          height: 32px;
          padding: 0 8px;
        }
        p {
          font-size: 12px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .o-icon {
          cursor: pointer;
        }
      }
      .button {
        width: 112px;
        height: 36px;
        line-height: 36px;
        border: 1px solid #40adff;
        color: #40adff;
        text-align: center;
        cursor: pointer;
        border-radius: 18px;
        @media screen and (max-width: 768px) {
          width: 74px;
          height: 32px;
          line-height: 30px;
          font-size: 12px;
        }
      }
    }
    .poster-tip {
      font-size: 12px;
      color: #555;
      margin-top: 8px;
    }
  }
}
/* 确认取消收藏弹窗 */
:deep(.confirm-dlg) {
  --el-dialog-margin-top: 34vh;
  @media screen and (max-width: 768px) {
    --el-dialog-width: 80vw !important;
    .confirm-title {
      font-size: 16px;
    }
    .confirm-desc {
      font-size: 12px;
      line-height: 18px;
      margin-top: 4px;
    }
  }
  .el-dialog__header {
    padding: 40px 40px 24px;
    @media screen and (max-width: 768px) {
      padding: 16px 0 0;
    }
  }
  .el-dialog__body {
    @media screen and (max-width: 820px) {
      padding: 8px 16px !important;
      width: 454px;
      margin: 0 auto;
    }
    @media screen and (max-width: 767px) {
      width: 100%;
    }
  }
  .el-dialog__footer {
    display: flex;
    justify-content: center;
    @media screen and (max-width: 768px) {
      padding: 16px;
      .o-button:first-child {
        margin-right: 8px !important;
      }
    }
  }
}
.input-dom {
  position: fixed;
  top: -100px;
}
.collection {
  .no-collection {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-top: 25vh;
    @media screen and (max-width: 820px) {
      margin-top: calc(50vh - 240px);
    }
    .o-icon {
      font-size: 48px;
      @media screen and (max-width: 820px) {
        font-size: 32px;
      }
    }
    p {
      margin-top: 12px;
      font-size: 16px;
      color: #555555;
      line-height: 18px;
      @media screen and (max-width: 820px) {
        font-size: 12px;
        margin-top: 8px;
      }
    }
  }
  .have-collections {
    display: grid;
    grid-template-columns: repeat(3, 310px);
    grid-gap: 24px;

    @media screen and (max-width: 820px) {
      grid-template-columns: repeat(2, 1fr);
      grid-gap: 12px;
      padding: 16px 0px 40px;
    }
    .collect-item {
      cursor: pointer;
      background: rgba(255, 255, 255, 0.95);
      box-shadow: 0px 1px 5px 0px rgba(45, 47, 51, 0.1);
      border-radius: 16px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .image-box {
        position: relative;
        flex: 1;
        display: flex;
        // align-items: center;
        // @media screen and (max-width: 820px) {
        //   width: calc(50vw - 24px);
        // }
        &:hover {
          .handles {
            opacity: 1;
          }
        }
        .handles {
          width: 100%;
          height: 151px;
          background: linear-gradient(
            180deg,
            rgba(0, 0, 0, 0) 0%,
            #000000 100%
          );
          position: absolute;
          left: 0;
          bottom: 0;
          padding: 0 16px 16px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          opacity: 0;
          .o-icon {
            color: #fff;
            font-size: 24px;
          }
          .right {
            display: flex;
            .middle {
              margin: 0 8px;
            }
          }
          .icon-item {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.1);
            display: flex;
            justify-content: center;
            align-items: center;
            &:hover {
              background: rgba(255, 255, 255, 0.3);
            }
          }
        }
        img {
          width: 310px;
          min-height: 232px;
          border-radius: 16px 16px 0 0;
          object-fit: cover;
          object-position: right bottom;
          @media screen and (max-width: 820px) {
            width: 100%;
            min-height: 270px;
          }
          @media screen and (max-width: 767px) {
            width: 100%;
            min-height: 122px;
          }
        }
      }
      .img-desc {
        margin-bottom: 16px;
        p {
          padding: 0 16px;
        }
        .img-owner {
          color: #999;
          font-size: 14px;
          margin-top: 16px;
          padding: 0 16px;
          img {
            width: 24px;
            @media screen and (max-width: 768px) {
              width: 16px;
            }
          }
          .info-left {
            display: flex;
            align-items: center;
            .user-name {
              margin-left: 8px;
            }
          }
          @media screen and (max-width: 768px) {
            font-size: 12px;
          }
        }
      }
      p {
        font-size: 16px;
        font-weight: 500;
        color: #000;
        line-height: 26px;
        text-align: left;
        margin-top: 8px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        @media screen and (max-width: 820px) {
          width: calc(50vw - 22px);
        }
        @media screen and (max-width: 768px) {
          font-size: 12px;
          font-weight: 400;
          color: #000000;
          line-height: 17px;
        }
      }
    }
  }
}
</style>
