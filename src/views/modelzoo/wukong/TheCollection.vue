<script setup>
import { ref } from 'vue';

import html2canvas from 'html2canvas';

// import IconArrow from '~icons/app/arrow-top';
import IconCollected from '~icons/app/wk-collecte';
import IconShare from '~icons/app/share';
import IconHeart from '~icons/app/collected';
import IconDownload from '~icons/app/wukong-download';
import IconCopy from '~icons/app/copy-nickname';

import {
  collectedPictures,
  cancelLikePicture,
  temporaryLink,
  // publicCollectedPicture,
} from '@/api/api-modelzoo.js';

import { useUserInfoStore } from '@/stores';
import { ElMessage } from 'element-plus';

const userInfoStore = useUserInfoStore();

const collecteImages = ref([]);

// 获取收藏图片
async function getCollectedImages() {
  const res = await collectedPictures();
  collecteImages.value = res.data.data;
}
getCollectedImages();
// 取消收藏
function cancelCollect(id) {
  cancelLikePicture(id).then((res) => {
    if (res.status === 204) {
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
// 分享海报dlg
function shareImage(link, desc, style) {
  posterInfo.value = desc + '  ' + style;
  posterLink.value = link.replace(
    'https://big-model-deploy.obs.cn-central-221.ovaijisuan.com:443/',
    '/obs-big-model/'
  );
  posterDlg.value = true;
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
}
const inputDom = ref();
// 复制用户名
function copyText(textValue) {
  inputDom.value.value = textValue;
  inputDom.value.select();
  if (document.execCommand('Copy'))
    ElMessage({
      type: 'success',
      message: '复制成功',
      center: true,
    });
}

// 公开收藏图片
// async function publicImage(imgId) {
//   try {
//     const res = await publicCollectedPicture({ id: imgId });
//     if (res.data.data.id) {
//       ElMessage({
//         type: 'success',
//         message: '公开成功',
//       });
//     }
//   } catch (err) {
//     console.error(err);
//   }
// }
</script>
<template>
  <div class="collection">
    <div v-if="collecteImages" class="have-collections">
      <div v-for="item in collecteImages" :key="item.id" class="collect-item">
        <div class="image-box">
          <img draggable="false" :src="item.link" alt="" />
          <div class="handles">
            <!-- <div class="icon-item" @click="publicImage(item.id)">
              <o-icon><icon-arrow></icon-arrow></o-icon>
            </div> -->
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
        <p>{{ item.desc }}&nbsp;{{ item.style }}</p>
      </div>
    </div>
    <div v-else class="no-collection">
      <o-icon><icon-collected></icon-collected></o-icon>
      <p>暂无收藏</p>
    </div>
    <el-dialog
      v-model="posterDlg"
      :fullscreen="true"
      center
      class="poster-dlg"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="handleDlgClose"
    >
      <div class="poster">
        <div id="screenshot" class="poster-image">
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

        <div class="poster-download">
          <div class="link">
            <p>https://xihe.mindspore.cn/modelzoo/wukong</p>
            <o-icon
              @click="copyText(`https://xihe.mindspore.cn/modelzoo/wukong`)"
              ><icon-copy></icon-copy
            ></o-icon>
          </div>
          <div class="button" @click="downloadPoster">下载海报</div>
        </div>
      </div>
    </el-dialog>
    <textarea ref="inputDom" class="input-dom"></textarea>
  </div>
</template>
<style lang="scss" scoped>
:deep(.poster-dlg) {
  --el-dialog-bg-color: rgba(0, 0, 0, 0.85) !important;

  .poster {
    width: 434px;
    height: 566px;
    background: #ffffff;
    padding: 16px;
    margin: 0 auto;
    margin-top: calc(50vh - 330px);
    &-image {
      width: 402px;
      height: 457px;
      position: relative;
      .mask {
        width: 100%;
        height: 198px;
        background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 100%);
        position: absolute;
        bottom: 55px;
      }
      .qr-code {
        width: 78px;
        height: 78px;
        position: absolute;
        right: 16px;
        bottom: 72px;
        z-index: 1;
      }
      .logo {
        position: absolute;
        left: 16px;
        bottom: 78px;
        width: 64px;
        height: 21px;
        z-index: 1;
      }
      img {
        width: 100%;
        height: 402px;
      }
      .info {
        width: 100%;
        height: 56px;
        background: #f5f6f8;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 16px;
        .desc {
          font-size: 14px;
          font-weight: 400;
          color: #000000;
          line-height: 24px;
        }
        .user-info {
          display: flex;
          align-items: center;

          img {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            margin-right: 8px;
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
    &-download {
      margin-top: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .link {
        flex: 1;
        height: 36px;
        line-height: 36px;
        background: #ffffff;
        border: 1px solid #999999;
        padding-left: 16px;
        padding-right: 10px;
        margin-right: 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        p {
          font-size: 12px;
        }
        .o-icon {
          cursor: pointer;
          &:hover {
            color: #40adff;
          }
        }
      }
      .button {
        width: 112px;
        height: 36px;
        border: 1px solid #40adff;
        color: #40adff;
        text-align: center;
        line-height: 36px;
        cursor: pointer;
      }
    }
  }
  .el-dialog__header {
    padding: 15px 0 15px;
    position: sticky;
    top: 0;
    background: #000;
    z-index: 200;
    span {
      color: #fff;
      font-size: 24px;
    }
  }
  .el-dialog__body {
    padding-top: 0;
  }
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background-color: #d8d8d8;
    background-clip: content-box;
  }
  &::-webkit-scrollbar-track {
    border-radius: 3px;
    box-shadow: inset 0 0 2px rgba($color: #000000, $alpha: 0.2);
    background: #ffffff;
  }
  .el-dialog__headerbtn {
    position: fixed;
    top: 6px;
    right: 15px;
    z-index: 201;
    .el-dialog__close {
      color: #fff;
      font-size: 40px;
    }
  }
}
.input-dom {
  position: fixed;
  top: -100px;
}
.collection {
  .no-collection {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .o-icon {
      font-size: 48px;
    }
    p {
      margin-top: 12px;
      font-size: 16px;
      color: #555555;
      line-height: 18px;
    }
  }
  .have-collections {
    display: grid;
    grid-template-columns: repeat(3, 310px);
    grid-gap: 24px;
    .collect-item {
      cursor: pointer;
      &:first-child {
        margin-top: 0;
      }
      &:nth-child(2) {
        margin-top: 0;
      }
      &:nth-child(3) {
        margin-top: 0;
      }
      .image-box {
        position: relative;
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
          // justify-content: space-between;
          justify-content: flex-end;
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
            // .o-icon {
            //   color: #fff;
            //   font-size: 18px;
            // }
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
          height: 310px;
        }
      }
      p {
        font-size: 14px;
        font-weight: 500;
        color: #555555;
        line-height: 26px;
        text-align: left;
        margin-top: 8px;
      }
    }
  }
}
</style>
