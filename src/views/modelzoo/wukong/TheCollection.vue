<script setup>
import { ref, onMounted, nextTick } from 'vue';

import html2canvas from 'html2canvas';

import IconEyeopen from '~icons/app/eye-open';
import IconCollected from '~icons/app/wk-collecte';
import IconShare from '~icons/app/share';
import IconSharegray from '~icons/app/share-gray';
import IconHeart from '~icons/app/heart-gray';
import IconDownload from '~icons/app/wukong-download';
import IconCopy from '~icons/app/copy-nickname';
import useClipboard from 'vue-clipboard3';

import {
  collectedPictures,
  cancelLikePicture,
  // temporaryLink,
  publicCollectedPicture,
} from '@/api/api-modelzoo.js';

import { useUserInfoStore } from '@/stores';
import { ElMessage } from 'element-plus';
import useWindowResize from '@/shared/hooks/useWindowResize.js';

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
    ctx.fillText('由AI模型生成', img.width - 182, img.height - 24);

    collecteImages.value[index].waterImg = canvas.toDataURL('image/png');

    return collecteImages.value[index];
  };
}
// 获取收藏图片
async function getCollectedImages() {
  try {
    const res = await collectedPictures();
    if (res.status === 200) {
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
function cancelCollect(id) {
  cancelLikePicture(id).then((res) => {
    if (res.status === 204) {
      imgInfoDlg.value = false;
      getCollectedImages();
      ElMessage({
        type: 'success',
        message: '取消收藏成功',
      });
    }
  });
}

// function requestImage(item) {
// const link = item.replace(
//   'https://big-model-deploy.obs.cn-central-221.ovaijisuan.com:443/',
//   '/obs-big-model/'
// );
// let x = new XMLHttpRequest();
// x.open('GET', link, true);
// x.responseType = 'blob';
// x.onload = function () {
//   const blobs = new Blob([x.response], { type: 'image/png' });
//   let url = window.URL.createObjectURL(blobs);
//   let a = document.createElement('a');
//   a.href = url;
//   a.download = 'collection.png';
//   a.click();
// };
// x.send();
// }

// 下载图片
function downloadImage(item) {
  let aLink = document.createElement('a');
  aLink.href = item;
  aLink.download = 'collection.png';
  aLink.click();
  document.body.removeChild(aLink);

  // const j1 = item.indexOf('=');
  // const j2 = item.indexOf('=', j1 + 1);

  // const i1 = item.indexOf('&');
  // const i2 = item.indexOf('&', i1 + 1);

  // const deadTime = item.substring(j2 + 1, i2);
  // const currentTime = (new Date().getTime() + '').substring(0, 10);

  // if ((deadTime - currentTime) / 60 < 1) {
  //   temporaryLink({ link: item }).then((res) => {
  //     if (res.data.data) {
  //       requestImage(res.data.data.link);
  //     }
  //   });
  // } else {
  //   requestImage(item);
  // }
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

// 下载海报截图
function downloadPoster() {
  const poster = document.querySelector('#screenshot');
  html2canvas(poster, {
    useCORS: true,
  }).then((canvas) => {
    let url = canvas.toDataURL('image/png');
    let aLink = document.createElement('a');
    aLink.style.display = 'none';
    aLink.href = url;
    aLink.download = 'poster.png';
    aLink.click();
    aLink.remove();
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
    message: '复制成功',
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
        message: '公开成功',
      });
    }
  } catch (err) {
    if (err.code === 'wukong_no_authorization') {
      ElMessage({
        type: 'warning',
        message: '公开图片已存在',
      });
    } else if (err.code === 'wukong_duplicate_like') {
      ElMessage({
        type: 'warning',
        message: '重复公开',
      });
    }
  }
}

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
    <div v-if="collecteImages" class="have-collections">
      <div v-for="item in collecteImages" :key="item.id" class="collect-item">
        <div v-if="screenWidth > 820" class="image-box">
          <img draggable="false" :src="item.waterImg" alt="" />

          <div class="handles">
            <div class="icon-item" @click="publicImage(item.id)">
              <o-icon><icon-eyeopen></icon-eyeopen></o-icon>
            </div>
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
            来自{{ item.desc }}&nbsp;&nbsp;
            <span v-if="item.style"> #风格：{{ item.style }} </span>
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
      <p>暂无收藏</p>
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
          来自{{ imageInfo.desc }}&nbsp;&nbsp;
          <span v-if="imageInfo.style">#风格：{{ imageInfo.style }}</span>
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
          <div class="icon-item" @click="publicImage(imageInfo.id)">
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
            <o-icon><icon-heart></icon-heart></o-icon>
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
            <p>https://xihe.mindspore.cn/modelzoo/wukong</p>
            <o-icon
              @click="copyText(`https://xihe.mindspore.cn/modelzoo/wukong`)"
              ><icon-copy></icon-copy
            ></o-icon>
          </div>
          <div v-if="screenWidth > 820" class="button" @click="downloadPoster">
            下载海报
          </div>
        </div>
        <p v-if="screenWidth <= 820" class="poster-tip">长按保存海报</p>
      </div>
    </el-dialog>
    <textarea class="input-dom"></textarea>
  </div>
</template>
<style lang="scss" scoped>
:deep(.el-dialog) {
  .el-dialog__header {
    padding: 0;
    position: sticky;
    top: 0;
    height: 48px;
    z-index: 200;
    .el-dialog__title {
      // color: #fff;
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
        width: 24px;
        height: 24px;
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
      .qr-code {
        width: 68px;
        height: 68px;
        position: absolute;
        right: 16px;
        bottom: 72px;
        z-index: 1;
        @media screen and (max-width: 768px) {
          width: 56px;
          height: 56px;
          right: 8px;
          bottom: 48px;
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
