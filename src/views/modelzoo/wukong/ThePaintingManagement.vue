<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

import html2canvas from 'html2canvas';

import IconArrow from '~icons/app/arrow-top';
import IconLike from '~icons/app/like';
import IconCollected from '~icons/app/wk-collecte';
import IconShare from '~icons/app/share';
import IconHeart from '~icons/app/collected';
import IconDownload from '~icons/app/wukong-download';
import IconPublic from '~icons/app/public';
import IconFingure from '~icons/app/fingure';
import IconCancel from '~icons/app/cancel-public';
import IconCopy from '~icons/app/copy-nickname';

import image from '@/assets/imgs/wukong/umbrella-women.png';

import {
  collectedPictures,
  cancelLikePicture,
  temporaryLink,
} from '@/api/api-modelzoo.js';

import { goAuthorize } from '@/shared/login';
import { useLoginStore, useUserInfoStore } from '@/stores';

const router = useRouter();
const isLogined = computed(() => useLoginStore().isLogined);
const userInfoStore = useUserInfoStore();
if (!isLogined.value) {
  goAuthorize();
}

const navItems = ref([
  { tag: '我的收藏', icon: '1' },
  { tag: '我的公开', icon: '2' },
]);
const currentNav = ref('1');
const collecteImages = ref([]);
const publicList = ref([
  {
    link: image,
  },
  {
    link: image,
  },
  {
    link: image,
  },
  {
    link: image,
  },
]);

// 获取收藏图片
async function getCollectedImages() {
  const res = await collectedPictures();
  if (res.data.data) {
    collecteImages.value = res.data.data;
    // publicList.value = res.data.data;
  }
}
getCollectedImages();

const showConfirmDlg = ref(false);
function quitPublicClick(id) {
  console.log(id);
  showConfirmDlg.value = true;
}

function cancelQuitPublic(val) {
  console.log('继续公开');
  showConfirmDlg.value = val;
}

function confirmQuitPublic() {
  console.log('确认取消公开');
  showConfirmDlg.value = false;
}

// 取消收藏
function cancelCollect(id) {
  cancelLikePicture(id).then((res) => {
    console.log(res);
    if (res.status === 204) {
      getCollectedImages();
      ElMessage({
        type: 'success',
        message: '取消收藏成功',
      });
    }
  });
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

const posterDlg = ref(false);
const posterLink = ref('');
const posterInfo = ref('');
const userAvatar = ref('');
userAvatar.value = userInfoStore.avatar.replace(
  'https://obs-xihe-beijing4.obs.cn-north-4.myhuaweicloud.com/',
  '/obs-xihe-avatar/'
);
// 开启分享海报dlg
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
  console.log(item);
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

function handleNavClick(i) {
  currentNav.value = i;
}

function goToBigmodel() {
  router.push('/modelzoo');
}
function goToWukong() {
  router.push('/modelzoo/wukong');
}
</script>
<template>
  <div class="wrapper">
    <div class="painting-management">
      <div class="painting-management-bread">
        <p @click="goToBigmodel">大模型</p>
        <span>></span>
        <p @click="goToWukong">悟空</p>
        <span>></span>
        <p class="current">画作管理</p>
      </div>

      <div class="painting-management-main">
        <div class="left">
          <div class="user-info">
            <img :src="userInfoStore.avatar" alt="" />
            <p>{{ userInfoStore.userName }}</p>
          </div>

          <div class="nav">
            <div
              v-for="item in navItems"
              :key="item.tag"
              class="nav-item"
              :class="currentNav === item.icon ? 'active' : ''"
              @click="handleNavClick(item.icon)"
            >
              <o-icon v-if="item.icon === '1'">
                <icon-like></icon-like>
              </o-icon>
              <o-icon v-else>
                <icon-arrow></icon-arrow>
              </o-icon>
              <p>{{ item.tag }}</p>
            </div>
          </div>
        </div>
        <div class="content">
          <!-- 我的收藏 -->
          <div v-if="currentNav === '1'" class="collection">
            <div v-if="collecteImages.length !== 0" class="have-collections">
              <div
                v-for="item in collecteImages"
                :key="item.id"
                class="collect-item"
              >
                <div class="image-box">
                  <img draggable="false" :src="item.link" alt="" />
                  <div class="handles">
                    <div class="icon-item">
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
                <p>{{ item.desc }}&nbsp;{{ item.style }}</p>
              </div>
            </div>
            <div v-else class="no-collection">
              <o-icon><icon-collected></icon-collected></o-icon>
              <p>无收藏</p>
            </div>
          </div>

          <!-- 我的公开 -->
          <div v-else class="public">
            <div v-if="publicList.length !== 0" class="have-public">
              <div
                v-for="item in publicList"
                :key="item.id"
                class="collect-item"
              >
                <div class="image-box">
                  <img draggable="false" :src="item.link" alt="" />
                  <div class="handles">
                    <div class="icon-item" @click="quitPublicClick(item.id)">
                      <o-icon><icon-cancel></icon-cancel></o-icon>
                    </div>
                    <div class="right">
                      <o-icon><icon-fingure></icon-fingure></o-icon>
                      <p class="dig-counts">999+</p>
                    </div>
                  </div>
                </div>
                <p>{{ item.desc }}&nbsp;{{ item.style }}</p>
              </div>
            </div>
            <div v-else class="no-public">
              <o-icon><icon-public></icon-public></o-icon>
              <p>暂无公开画作</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 确认弹窗 -->
    <el-dialog
      v-model="showConfirmDlg"
      class="confirm-dlg"
      width="652"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <template #header>
        <p>取消公开画作</p>
      </template>
      <div>若该作品未收藏，取消公开后将无法找回，是否确定取消公开画作？</div>
      <template #footer>
        <OButton
          size="small"
          style="margin-right: 24px"
          @click="cancelQuitPublic(false)"
          >取消</OButton
        >
        <OButton type="primary" size="small" @click="confirmQuitPublic"
          >确认</OButton
        >
      </template>
    </el-dialog>
    <!-- 海报弹窗 -->
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
.input-dom {
  position: fixed;
  top: -100px;
}
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

:deep(.confirm-dlg) {
  --el-dialog-margin-top: 34vh;
  .el-dialog__header {
    text-align: center;
    margin-right: 0;
    padding: 40px 0 24px;
  }
  .el-dialog__body {
    padding: 0 40px 40px;
    text-align: center;
  }
  .el-dialog__footer {
    padding: 0 40px 40px;
    display: flex;
    justify-content: center;
  }
}
.wrapper {
  background-color: #f5f6f8;
}
.painting-management {
  padding: 120px 16px 64px;
  margin: 0 auto;
  max-width: 1472px;
  height: 100%;
  &-bread {
    display: flex;
    height: 18px;
    p {
      font-size: 12px;
      line-height: 18px;
      color: #555550;
      font-weight: bold;
      cursor: pointer;
    }
    span {
      margin: 0 4px;
      color: #555550;
    }
    .current {
      color: #000;
      font-weight: bold;
      cursor: auto;
    }
  }
  &-main {
    margin-top: 40px;
    display: flex;
    .left {
      width: 436px;
      margin-right: 24px;
      min-height: calc(100vh - 442px);
      background-color: #fff;
      .user-info {
        margin-top: 48px;
        display: flex;
        flex-direction: column;
        align-items: center;
        img {
          width: 160px;
          height: 160px;
          border-radius: 50%;
        }
        p {
          font-size: 24px;
          color: #000000;
          line-height: 24px;
          margin-top: 16px;
        }
      }
      .nav {
        margin-top: 48px;
        &-item {
          width: 100%;
          height: 56px;
          background: #fff;
          display: flex;
          padding-left: 48px;
          align-items: center;
          cursor: pointer;
          .o-icon {
            margin-right: 12px;
            font-size: 22px;
          }
        }
      }
      .active {
        background: #f7f8fa;
        backdrop-filter: blur(0px);
        border-right: 2px solid #0d8dff;
      }
    }
    .content {
      flex: 1;
      .collection {
        width: 100%;
        height: 100%;
        .no-collection {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          padding-bottom: 160px;
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
      }
      .have-collections,
      .have-public {
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
              justify-content: space-between;
              align-items: flex-end;
              opacity: 0;

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
              .o-icon {
                color: #fff;
                font-size: 18px;
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
      .public {
        width: 100%;
        height: 100%;
        .have-public {
          .handles {
            .icon-item {
              .o-icon {
                font-size: 14px;
              }
            }
          }
          .right {
            align-items: center;
            color: #fff;

            .dig-counts {
              color: #fff;
              margin-left: 8px;
              margin-top: 0;
            }
          }
        }
        .no-public {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          padding-bottom: 160px;
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
      }
    }
  }
}
</style>
