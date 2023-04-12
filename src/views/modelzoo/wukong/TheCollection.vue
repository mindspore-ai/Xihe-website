<script setup>
import { ref, onMounted, nextTick } from 'vue';

import html2canvas from 'html2canvas';

import IconArrow from '~icons/app/arrow-top';
import IconCollected from '~icons/app/wk-collecte';
import IconShare from '~icons/app/share';
import IconHeart from '~icons/app/collected';
import IconDownload from '~icons/app/wukong-download';
import IconCopy from '~icons/app/copy-nickname';
// import IconFingure from '~icons/app/fingure';
import useClipboard from 'vue-clipboard3';

import {
  collectedPictures,
  cancelLikePicture,
  temporaryLink,
  publicCollectedPicture,
} from '@/api/api-modelzoo.js';

import { useUserInfoStore } from '@/stores';
import { ElMessage } from 'element-plus';
import useWindowResize from '@/shared/hooks/useWindowResize.js';

const screenWidth = useWindowResize();

const userInfoStore = useUserInfoStore();
const { toClipboard } = useClipboard();

const collecteImages = ref([]);
// 获取收藏图片
async function getCollectedImages() {
  try {
    const res = await collectedPictures();
    if (res.status === 200) {
      collecteImages.value = res.data.data;
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
// 下载图片
function requestImage(item) {
  const link = item.replace(
    'https://big-model-deploy.obs.cn-central-221.ovaijisuan.com:443/',
    '/obs-big-model/'
  );
  let x = new XMLHttpRequest();
  x.open('GET', link, true);
  x.responseType = 'blob';
  x.onload = function () {
    const blobs = new Blob([x.response], { type: 'image/png' });
    let url = window.URL.createObjectURL(blobs);
    let a = document.createElement('a');
    a.href = url;
    a.download = 'collection.png';
    a.click();
  };
  x.send();
}

function downloadImage(item) {
  const j1 = item.indexOf('=');
  const j2 = item.indexOf('=', j1 + 1);

  const i1 = item.indexOf('&');
  const i2 = item.indexOf('&', i1 + 1);

  const deadTime = item.substring(j2 + 1, i2);
  const currentTime = (new Date().getTime() + '').substring(0, 10);

  if ((deadTime - currentTime) / 60 < 1) {
    temporaryLink({ link: item }).then((res) => {
      if (res.data.data) {
        requestImage(res.data.data.link);
      }
    });
  } else {
    requestImage(item);
  }
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
          <img draggable="false" :src="item.link" alt="" />

          <div class="handles">
            <div class="icon-item" @click="publicImage(item.id)">
              <o-icon><icon-arrow></icon-arrow></o-icon>
            </div>
            <div class="right">
              <div class="icon-item" @click="downloadImage(item.link)">
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

        <p>{{ item.desc }}&nbsp;{{ item.style }}</p>
      </div>
    </div>

    <div v-else class="no-collection">
      <o-icon><icon-collected></icon-collected></o-icon>
      <p>暂无收藏</p>
    </div>

    <el-dialog
      v-model="imgInfoDlg"
      class="imginfo-dlg"
      :fullscreen="true"
      center
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <template #header="{ titleClass }">
        <p :class="titleClass">
          {{ imageInfo.desc }}&nbsp;&nbsp;&nbsp;<span v-if="imageInfo.style"
            >#风格：</span
          >{{ imageInfo.style }}
        </p>
      </template>

      <div class="image-info">
        <img class="collect-img" :src="imageInfo.link" alt="" />

        <div class="information">
          <div class="user-info">
            <img :src="userInfoStore.avatar" alt="" />
            <p>{{ userInfoStore.userName }}</p>
          </div>
          <!-- <div class="dig-counts">
            <o-icon><icon-fingure></icon-fingure></o-icon>
            <span>999</span>
          </div> -->
        </div>
      </div>

      <div class="mobile-dlg-handles">
        <div class="icon-item" @click="publicImage(imageInfo.id)">
          <o-icon><icon-arrow></icon-arrow></o-icon>
        </div>
        <div class="right">
          <div
            v-if="screenWidth > 820"
            class="icon-item"
            @click="downloadImage(imageInfo.link)"
          >
            <o-icon><icon-download></icon-download></o-icon>
            <!-- 测试移动端下载图片到本地 -->
          </div>
          <div
            class="icon-item middle"
            @click="shareImage(imageInfo.link, imageInfo.desc, imageInfo.style)"
          >
            <o-icon><icon-share></icon-share></o-icon>
          </div>
          <div class="icon-item" @click="cancelCollect(imageInfo.id)">
            <o-icon><icon-heart></icon-heart></o-icon>
          </div>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      v-model="posterDlg"
      :fullscreen="true"
      center
      class="poster-dlg"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="handleDlgClose"
    >
      <template #header="{ titleClass }">
        <p :class="titleClass">{{ posterInfo }}</p>
      </template>

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
  --el-dialog-bg-color: rgba(0, 0, 0, 0.85) !important;
  .el-dialog__header {
    padding: 0;
    position: sticky;
    top: 0;
    background: #000;
    height: 48px;
    z-index: 200;
    @media screen and (max-width: 820px) {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 0;
    }
    .el-dialog__title {
      color: #fff;
      padding-top: 27px;
      @media screen and (max-width: 820px) {
        font-size: 14px;
        line-height: 24px;
        padding: 0;
      }
    }
  }
  .el-dialog__body {
    padding-top: 0;
    @media screen and (max-width: 820px) {
      padding: 16px !important;
      width: 640px;
      margin: 14vh auto 0;
    }
    @media screen and (max-width: 767px) {
      width: 100%;
    }
  }

  .el-dialog__headerbtn {
    position: fixed;
    top: 6px;
    right: 15px;
    z-index: 201;
    @media screen and (max-width: 820px) {
      top: -4px;
      right: 4px;
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
:deep(.imginfo-dlg) {
  .el-dialog__body {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .image-info {
    position: relative;
    .collect-img {
      width: 100%;
    }
    .information {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      color: #ffffff;
      font-size: 12px;
      line-height: 18px;
      height: 74px;
      width: 100%;
      background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 100%);
      padding: 8px;
      position: absolute;
      bottom: 0;
      .user-info {
        display: flex;
        align-items: flex-end;
        img {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          margin-right: 4px;
        }
        p {
          line-height: 24px;
        }
      }
    }
  }
  .mobile-dlg-handles {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #fff;
    font-size: 16px;
    margin-top: 8px;
    .icon-item {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .right {
      display: flex;
      .middle {
        margin: 0 4px;
      }
    }
  }
}
:deep(.poster-dlg) {
  .poster {
    width: 520px;
    background: #ffffff;
    padding: 16px;
    margin: 0 auto;
    @media screen and (max-width: 767px) {
      width: 100%;
      height: auto;
      padding: 8px 8px 16px;
    }
    .poster-image {
      // width: 402px;
      width: 100%;
      // height: 457px;
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
        // height: 56px;
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
      padding: 16px 16px 40px;
    }
    .collect-item {
      cursor: pointer;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .image-box {
        position: relative;
        background: #fff;
        flex: 1;
        display: flex;
        align-items: center;
        @media screen and (max-width: 820px) {
          width: calc(50vw - 24px);
        }
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
      p {
        font-size: 14px;
        font-weight: 500;
        color: #555555;
        line-height: 26px;
        height: 26px;
        text-align: left;
        margin-top: 8px;
        @media screen and (max-width: 768px) {
          font-size: 12px;
          font-weight: 400;
          color: #000000;
          line-height: 17px;
          height: 17px;
        }
      }
    }
  }
}
</style>
