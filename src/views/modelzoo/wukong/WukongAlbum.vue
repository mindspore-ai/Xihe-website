<script setup>
import { ref, onMounted, nextTick, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useLoginStore, useUserInfoStore } from '@/stores';
import { throttle } from 'lodash/function';
import html2canvas from 'html2canvas';
import useWindowResize from '@/shared/hooks/useWindowResize.js';

import { goAuthorize } from '@/shared/login';
import {
  getWuKongPic,
  toDigg,
  cancelDigg,
  addLikePicture2,
  cancelLikePicture,
} from '@/api/api-modelzoo.js';

import { ArrowRight } from '@element-plus/icons-vue';
import IconLikes1 from '~icons/app/likes1.svg';
import IconLiked from '~icons/app/liked.svg';
import IconLeft from '~icons/app/left.svg';
import IconRight from '~icons/app/right.svg';
import IconDownload from '~icons/app/wukong-download';
import IconDownloadgray from '~icons/app/download-gray';
import IconShare from '~icons/app/share';
import IconSharegray from '~icons/app/share-gray';
import IconHeartgray from '~icons/app/heart-gray';
import IconLike from '~icons/app/wukong-like';
import IconHeart from '~icons/app/collected';
import IconCopy from '~icons/app/copy-nickname';

import arrow from '@/assets/imgs/wukong/arrow.png';

import writeToClipboard from '@/shared/hooks/writeToClipboard.js';

import { useI18n } from 'vue-i18n';
import { ElMessage } from 'element-plus';

const { t } = useI18n();

const router = useRouter();
const userInfo = useUserInfoStore();
const isLogined = useLoginStore().isLogined;
const imgs = ref([]);
const activeName = ref('official');
const screenWidth = useWindowResize();

const showPic = ref(false);
const showShare = ref(false);
const isSharedPoster = ref(false);
const shareImg = ref('');
const dialogData = ref();
const picIndex = ref();
const picTotal = ref();
const params = ref({
  page_num: 1,
  count_per_page: 28,
  level: 'official',
});

const copyContent = 'https://xihe.mindspore.cn/modelzoo/wukong';

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

    imgs.value[index].waterImg = canvas.toDataURL('image/png');

    return imgs.value[index];
  };
}

getWuKongPic(params.value).then((res) => {
  picTotal.value = res.data.total;
  imgs.value = res.data.pictures;

  res.data.pictures.forEach((item, index) => {
    addWatermark(item.link, index);
  });
});

function getMore() {
  params.value.page_num++;
  if (imgs.value.length < picTotal.value) {
    getWuKongPic(params.value)
      .then((res) => {
        let oldLen = imgs.value.length;

        imgs.value = imgs.value.concat(res.data.pictures);

        for (let i = oldLen; i < imgs.value.length; i++) {
          addWatermark(imgs.value[i].link, i);
        }
      })
      .catch(() => {
        ElMessage({
          type: 'error',
          message: 'error',
        });
      });
  }
}
const throttleGet = throttle(getMore, 1000, {
  leading: true,
});
const handleScroll = () => {
  const scrollTop =
    document.documentElement.scrollTop ||
    window.pageYOffset ||
    document.body.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight;
  const windowHeight = document.documentElement.clientHeight;
  const total = scrollTop + windowHeight;

  if (Number((total + 100).toFixed(0)) > scrollHeight) {
    throttleGet();
  }
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

function changeTab(name) {
  params.value.level = name;
  params.value.page_num = 1;
  getWuKongPic(params.value).then((res) => {
    picTotal.value = res.data.total;
    imgs.value = res.data.pictures;
    res.data.pictures.forEach((item, index) => {
      addWatermark(item.link, index);
    });
  });
}

// 获取dialogData的数据
function getDialogData(num) {
  dialogData.value = imgs.value[num];
  picIndex.value = num;
  dialogData.value.link = dialogData.value.link;
  dialogData.value.avatar = dialogData.value.avatar;
  userInfo.avatar = userInfo.avatar;
}

// 点击大图弹窗
function toggleDialog(num) {
  showPic.value = true;
  getDialogData(num);
}

// 点赞图片
function giveLike(num) {
  if (isLogined) {
    if (imgs.value[num].is_digg) {
      cancelDigg({ user: imgs.value[num].owner, id: imgs.value[num].id }).then(
        (res) => {
          imgs.value[num].is_digg = false;
          imgs.value[num].digg_count = res.data.digg_count;
          ElMessage({
            type: 'success',
            message: t('wukong.CANCEL_DIG'),
            offset: 64,
            center: true,
          });
        }
      );
    } else {
      toDigg({ user: imgs.value[num].owner, id: imgs.value[num].id }).then(
        (res) => {
          imgs.value[num].is_digg = true;
          imgs.value[num].digg_count = res.data.digg_count;
          ElMessage({
            type: 'success',
            message: t('wukong.DIGGED'),
            offset: 64,
            center: true,
          });
        }
      );
    }
  } else {
    goAuthorize();
  }
}

// 下载图片
function downloadPic(index) {
  if (typeof index === 'number') {
    getDialogData(index);
  }
  let x = new XMLHttpRequest();
  x.open('GET', dialogData.value.waterImg, true);
  x.responseType = 'blob';
  x.onload = function () {
    const blobs = new Blob([x.response], { type: 'image/png' });
    let url = window.URL.createObjectURL(blobs);
    let a = document.createElement('a');
    a.href = url;
    a.download = 'infer.png';
    a.click();
  };
  x.send();
}

// 分享图片
function sharePic(index) {
  if (typeof index === 'number') {
    getDialogData(index);
  }
  if (isLogined) {
    showShare.value = true;
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
  } else {
    goAuthorize();
  }
}
function handleDlgClose() {
  isSharedPoster.value = false;
}
function closeDialog() {
  showShare.value = false;
}
// 收藏图片
function collectPic(index) {
  if (typeof index === 'number') {
    getDialogData(index);
  }
  if (isLogined) {
    if (dialogData.value.is_like) {
      cancelLikePicture(dialogData.value.like_id).then(() => {
        dialogData.value.is_like = false;
        ElMessage({
          type: 'success',
          message: t('wukong.CANCEL_COLLECT'),
          offset: 64,
        });
      });
    } else {
      addLikePicture2({
        id: dialogData.value.id,
        owner: dialogData.value.owner,
      }).then((res) => {
        dialogData.value.is_like = true;
        dialogData.value.like_id = res.data.id;
        ElMessage({
          type: 'success',
          message: t('wukong.COLLECT'),
          offset: 64,
        });
      });
    }
  } else {
    goAuthorize();
  }
}
async function copyText(textValue) {
  await writeToClipboard(textValue);
  ElMessage({
    type: 'success',
    message: t('wukong.COPY'),
    offset: 64,
    center: true,
  });
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
      // 绘制圆角矩形（使用 arcTo）
      let radius = 24;
      ctx.save(); // 保存当前环境的状态
      ctx.beginPath(); // 重置当前路径
      ctx.moveTo(0 + radius, 0); // 移动到左上角
      ctx.arcTo(0 + img.width, 0, 0 + img.width, 0 + radius, radius); // 绘制右上角
      ctx.arcTo(
        0 + img.width,
        0 + img.height,
        0 + img.width - radius,
        0 + img.height,
        radius
      ); // 绘制右下角
      ctx.arcTo(0, img.height, 0, img.height - radius, radius); // 绘制左下角
      ctx.arcTo(0, 0, 0 + radius, 0, radius); // 绘制左上角
      ctx.fill(); // 填充当前路径
      ctx.clip(); // 对矩形进行剪切
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

function goUser(owner) {
  router.push(`/${owner}`);
}
function toPrePic() {
  if (picIndex.value > 0) {
    picIndex.value = picIndex.value - 1;
    dialogData.value = imgs.value[picIndex.value];
    dialogData.value.link = dialogData.value.link;
  } else {
    ElMessage({
      type: 'warning',
      message: t('wukong.FIRST_IMG'),
      offset: 64,
      center: true,
    });
  }
}
function toNextPic() {
  if (picIndex.value < imgs.value.length - 1) {
    picIndex.value = Number(picIndex.value) + 1;
    dialogData.value = imgs.value[picIndex.value];
    dialogData.value.link = dialogData.value.link;
  } else {
    ElMessage({
      type: 'error',
      message: t('wukong.LAST_IMG'),
      offset: 64,
      center: true,
    });
  }
}
</script>
<template>
  <div class="wrapper">
    <div class="picture-album">
      <div class="album-top">
        <el-breadcrumb :separator-icon="ArrowRight">
          <el-breadcrumb-item :to="{ path: '/modelzoo' }">{{
            t('wukong.BIG_MODEL')
          }}</el-breadcrumb-item>
          <el-breadcrumb-item
            :to="{ path: '/modelzoo/wukong' }"
            class="breadcrumb-item"
            >{{ t('wukong.TITLE_2') }}</el-breadcrumb-item
          >
          <el-breadcrumb-item>{{
            t('wukong.AI_PAINTINGS')
          }}</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- tab栏 -->
        <el-tabs
          v-model="activeName"
          class="album-tabs"
          @tab-change="changeTab"
        >
          <el-tab-pane
            v-if="screenWidth <= 820"
            :label="t('wukong.FILTER')"
            name="0"
            disabled
          ></el-tab-pane>
          <el-tab-pane
            :label="t('wukong.AUTHORITY')"
            name="official"
          ></el-tab-pane>
          <el-tab-pane :label="t('wukong.ALL')" name=""></el-tab-pane>
        </el-tabs>
      </div>

      <!-- 画集图片 -->
      <div class="album-item">
        <div
          v-for="(items, index) in imgs"
          :key="items.id"
          class="img-box"
          @click="toggleDialog(index)"
        >
          <!-- <div> -->
          <div class="box-top">
            <img :src="items.waterImg" alt="" />
            <div class="handles">
              <div class="right">
                <div class="icon-item" @click.stop="downloadPic(index)">
                  <o-icon><icon-download></icon-download></o-icon>
                </div>
                <div class="icon-item middle" @click.stop="sharePic(index)">
                  <o-icon><icon-share></icon-share></o-icon>
                </div>
                <div class="icon-item" @click.stop="collectPic(index)">
                  <o-icon v-if="items.is_like"
                    ><icon-heart></icon-heart
                  ></o-icon>
                  <o-icon v-else><icon-like></icon-like></o-icon>
                </div>
              </div>
            </div>
          </div>
          <div class="box-bottom">
            <div class="style">
              {{ t('wukong.FROM') }}{{ items.desc }}
              <p v-if="items.style">
                #{{ t('wukong.STYLE') }}：{{ items.style }}
              </p>
            </div>
            <div class="imgs-info">
              <div class="user" @click.stop="goUser(items.owner)">
                <img :src="items.avatar" alt="" /><span class="user-name">{{
                  items.owner
                }}</span>
              </div>
              <div class="like" @click.stop="giveLike(index)">
                <o-icon v-if="items?.is_digg"> <icon-liked /></o-icon>
                <o-icon v-else class="likes1"> <icon-likes1 /></o-icon>
                <span>{{ items?.digg_count }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 画集图片弹窗 -->
    <el-dialog
      v-model="showPic"
      :destroy-on-close="true"
      :fullscreen="true"
      lock-scroll
      center
      class="fullscreen-dialog"
      @close="closeDialog"
    >
      <template #header="{ titleClass }">
        <p :class="titleClass">
          {{ t('wukong.FROM') }}{{ dialogData.desc }}&nbsp;&nbsp;
          <span v-if="dialogData.style">
            #{{ t('wukong.STYLE') }}：{{ dialogData.style }}
          </span>
        </p>
      </template>
      <div class="album-wrapper">
        <o-icon class="check" @click="toPrePic"> <icon-left /></o-icon>
        <div class="pic-box">
          <div class="pic-info">
            <div class="pic-source">
              来自{{ dialogData.desc }}&nbsp;&nbsp;
              <span v-if="dialogData.style">
                #风格：{{ dialogData.style }}
              </span>
            </div>
            <img :src="dialogData.waterImg" alt="" />
            <div class="user-info">
              <p class="left" @click="goUser(dialogData.owner)">
                <img :src="dialogData.avatar" alt="" />
                <span>{{ dialogData.owner }}</span>
              </p>
              <p class="right" @click="giveLike(picIndex)">
                <o-icon v-if="dialogData.is_digg"> <icon-liked /></o-icon>
                <o-icon v-else class="o-like"> <icon-likes1 /></o-icon>
                <span class="digg-count">{{ dialogData?.digg_count }}</span>
              </p>
            </div>
            <div class="pic-handle">
              <div class="func-item download-item">
                <o-icon class="download" @click.stop="downloadPic">
                  <icon-downloadgray></icon-downloadgray>
                </o-icon>
                <img class="arrow" :src="arrow" alt="" />
                <div class="icon-name">{{ t('wukong.DOWNLOAD') }}</div>
              </div>
              <div class="func-item">
                <o-icon class="share" @click="sharePic">
                  <icon-sharegray></icon-sharegray>
                </o-icon>
                <img class="arrow" :src="arrow" alt="" />
                <div class="icon-name">{{ t('wukong.SHARE') }}</div>
              </div>
              <div class="func-item">
                <div v-if="!dialogData.is_like">
                  <o-icon class="heart" @click="collectPic">
                    <icon-heartgray></icon-heartgray>
                  </o-icon>
                  <img class="arrow" :src="arrow" alt="" />
                  <div class="icon-name">{{ t('wukong.ICON_COLLECT') }}</div>
                </div>
                <div v-else>
                  <o-icon class="heart" @click="collectPic">
                    <icon-heart></icon-heart>
                  </o-icon>
                  <img class="arrow" :src="arrow" alt="" />
                  <div class="icon-name">
                    {{ t('wukong.ICON_CANCEL_COLLECT') }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <o-icon class="check" @click="toNextPic"> <icon-right /></o-icon>
      </div>
    </el-dialog>
    <!-- 海报弹窗 -->
    <el-dialog
      v-model="showShare"
      class="poster-dialog"
      align-center
      width="434"
      @close="handleDlgClose"
    >
      <div class="poster">
        <div v-if="!isSharedPoster" id="screenshot" class="poster-image">
          <img
            class="infer-img"
            draggable="false"
            :src="dialogData.link"
            alt=""
          />

          <img
            class="qr-code"
            draggable="false"
            src="@/assets/imgs/wukong/qr-code.png"
            alt=""
          />
          <img
            class="logo"
            draggable="false"
            src="@/assets/imgs/logo.png"
            alt=""
          />
          <p class="water-mark">{{ t('wukong.BY_AI') }}</p>

          <div class="mask"></div>

          <div class="info">
            <p class="desc">{{ dialogData.desc }}</p>
            <div class="user-info">
              <img :src="dialogData.avatar" alt="" />
              <p>{{ dialogData.owner }}</p>
            </div>
          </div>
        </div>
        <img v-else class="shared-image" :src="shareImg" alt="" />
        <div class="poster-download">
          <div class="link">
            <p>{{ copyContent }}</p>

            <o-icon class="pc-copy" @click.stop="copyText(`${copyContent}`)"
              ><icon-copy></icon-copy
            ></o-icon>

            <o-icon class="mobile-copy" @click.stop="copyText(`${copyContent}`)"
              ><icon-copy></icon-copy
            ></o-icon>
          </div>
          <div class="button" @click.stop="downloadPoster">
            {{ t('wukong.DOWNLOAD_POSTER') }}
          </div>
        </div>
        <div class="poster-tip">{{ t('wukong.SAVE_POSTER') }}</div>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.input-dom {
  position: fixed;
  top: -1200px;
}
.el-breadcrumb {
  padding-top: 120px;
}
.wrapper {
  background-color: #f5f6f8;
  padding: 0 16px;
  background-image: url(@/assets/imgs/wukong/wukong-banner.png);
  background-size: 100% 246px;
  background-repeat: no-repeat;
  @media screen and (max-width: 821px) {
    background-image: unset;
    .el-breadcrumb {
      padding-top: 68px;
    }
  }
  .picture-album {
    max-width: 1416px;
    margin: 0 auto;
    width: 100%;
    overflow: hidden;
    :deep(.album-tabs) {
      .el-tabs__header {
        margin: 68px 0px 0px;
        @media screen and (max-width: 821px) {
          margin-top: 16px;
          height: 22px;
          .el-tabs__nav {
            height: 22px;
            .el-tabs__item {
              height: 22px;
              line-height: 22px;
              padding: 0 8px;
              margin-right: 8px;
              &:nth-child(2) {
                color: #000;
                font-weight: 550;
                padding-left: 0px;
                margin-right: 16px;
              }
            }
            .el-tabs__active-bar {
              display: none;
            }
          }
          .el-tabs__item.is-active {
            border: 1px solid #0d8dff;
            border-radius: 11px;
          }
        }
      }
    }

    .album-item {
      display: grid;
      grid-template-columns: repeat(4, 336px);
      column-gap: 24px;
      row-gap: 24px;
      padding-bottom: 64px;
      margin-top: 64px;
      @media screen and (max-width: 821px) {
        grid-template-columns: repeat(3, 246px);
        margin-top: 26px;
      }
      @media screen and (max-width: 820px) {
        grid-template-columns: repeat(3, 230px);
      }
      @media screen and (max-width: 768px) {
        grid-template-columns: 1fr 1fr;
        padding-bottom: 40px;
        column-gap: 8px;
        row-gap: 8px;
      }
      .img-box {
        cursor: pointer;
        background-color: #fff;
        border-radius: 16px;
        display: flex;
        flex-direction: column;
        position: relative;
        &:hover {
          box-shadow: 0px 1px 30px 0px rgba(0, 0, 0, 0.05);
          transition: all 0.3s linear;
        }
        @media screen and (max-width: 376px) {
          width: 167px;
        }
        @media screen and (max-width: 360px) {
          width: 160px;
        }
        .box-top {
          height: 342px;
          position: relative;
          overflow: hidden;
          @media screen and (max-width: 821px) {
            height: 160px;
          }
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: right center;
            border-radius: 16px 16px 0 0;
          }
          &:hover {
            .handles {
              opacity: 1;
              transition: all 0.2s linear;
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
        }
        .box-bottom {
          height: calc(100% - 340px);
          padding: 0 16px 16px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          @media screen and (max-width: 821px) {
            height: calc(100% - 160px);
          }
          .style {
            margin: 8px 0px 16px;
            line-height: 22px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            @media screen and (max-width: 768px) {
              font-size: 12px;
              line-height: 18px;
              width: 140px;
            }
            p {
              width: 100%;
              height: 22px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              @media screen and (max-width: 768px) {
                height: 18px;
              }
            }
          }
          .imgs-info {
            font-size: 14px;
            text-overflow: ellipsis;
            color: #999999;
            display: flex;
            justify-content: space-between;
            line-height: 24px;
            @media screen and (max-width: 768px) {
              font-size: 10px;
              height: 18px;
              line-height: 18px;
              .user-name {
                display: inline-block;
                width: 60px;
                overflow: hidden;
                text-overflow: ellipsis;
              }
            }
            .user {
              img {
                width: 24px;
                margin-right: 8px;
                @media screen and (max-width: 768px) {
                  width: 16px;
                  margin-right: 4px;
                }
              }
            }
            .like {
              display: flex;
              align-items: center;
              .o-icon {
                margin-right: 8px;
              }
              .likes1 {
                color: #fff;
              }
            }
          }
        }
      }
    }
  }
  // 画集大图弹窗
  :deep(.el-dialog.fullscreen-dialog) {
    border-radius: 0px;
    position: relative;
    overflow: hidden;
    background: rgba(0, 0, 0, 0.5);
    .el-dialog__header {
      height: 80px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: rgba(0, 0, 0, 0.5);
      @media screen and (max-width: 768px) {
        height: 48px;
        line-height: 14px;
        padding: 12px 0;
      }
      .el-dialog__title {
        color: #fff;
        font-size: 14px;
        display: none;
        @media screen and (max-width: 821px) {
          display: block;
          line-height: 24px;
          padding: 0 40px;
        }
      }
      .el-dialog__headerbtn {
        width: 48px;
        height: 48px;
        position: fixed;
        top: 16px;
        right: 24px;
        z-index: 201;
        @media screen and (max-width: 768px) {
          top: 12px;
          right: 12px;
          width: 24px;
          height: 24px;
        }
        .el-dialog__close {
          color: #fff;
          font-size: 40px;
          @media screen and (max-width: 768px) {
            font-size: 24px;
          }
        }
      }
    }

    .el-dialog__body {
      width: 100%;
      height: calc(100vh - 80px);
      padding: 0 68px;
      background-color: #f5f6f8;
      border-radius: 24px 24px 0px 0px;
      @media screen and (max-width: 821px) {
        height: calc(100vh - 48px);
        padding: 0 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        .pic-box .pic-info .pic-handle {
          width: auto;
          margin-top: 16px;
          padding: 8px;
          display: flex;
          right: 0;
          top: 100%;
          .func-item {
            &:nth-child(2) {
              margin-right: 8px;
            }
          }
          .o-icon {
            color: #b2b2b2;
            margin-bottom: 0;
          }
        }
        .pic-source {
          display: none;
        }
      }
    }
    .album-wrapper {
      display: flex;
      align-items: center;
      padding-top: 40px;
      .o-icon {
        font-size: 60px;
        cursor: pointer;
      }
      .check {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 72px;
        height: 72px;
        border-radius: 50%;
        color: #fff;
        background: #e5e8f0;
        @media screen and (max-width: 821px) {
          display: none;
        }
      }
      .pic-box {
        margin: 0 auto;
        position: relative;
        display: flex;
        @media screen and (max-width: 821px) {
          width: 100%;
        }
        .pic-info {
          width: 100%;
          position: relative;
          .pic-source {
            height: 24px;
            font-size: 18px;
            color: #555;
            line-height: 24px;
            margin-bottom: 38px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          img {
            max-height: 512px;
            border-radius: 16px;
            @media screen and (max-width: 821px) {
              width: 100%;
            }
          }
          .user-info {
            margin-top: 40px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            @media screen and (max-width: 821px) {
              margin-top: 0px;
              width: 100%;
              position: absolute;
              top: -40px;
            }
            .left,
            .right {
              cursor: pointer;
              img {
                width: 24px;
              }
              span {
                line-height: 24px;
                color: #555;
                margin-left: 8px;
              }
              .o-icon {
                color: #b2b2b2;
                font-size: 18px;
                line-height: 18px;
                @media screen and (max-width: 768px) {
                  display: inline-block;
                  font-size: 16px;
                  line-height: 12px;
                  vertical-align: middle;
                }
              }
              .o-like {
                color: #fff;
              }
              .digg-count {
                line-height: 10px;
                height: 18px;
                @media screen and (max-width: 768px) {
                  font-size: 14px;
                  line-height: 12px;
                  vertical-align: middle;
                }
              }
            }
          }
        }
        .pic-handle {
          width: 40px;
          background-color: #fff;
          border-radius: 22px;
          padding: 16px 8px;
          position: absolute;
          top: 62px;
          right: -65px;
          z-index: 100;
          .func-item {
            cursor: pointer;
            position: relative;
            &:hover {
              .icon-name,
              .arrow {
                display: block;
              }
            }
            .o-icon {
              color: #b2b2b2;
              height: 40px;
              display: flex;
              justify-content: center;
              align-items: center;
              cursor: pointer;
              &:hover {
                color: #0d8dff;
              }
              &:last-child {
                margin-bottom: 0;
              }
            }
            .icon-name {
              color: #b2b2b2;
              font-size: 14px;
              line-height: 20px;
              text-align: center;
              position: absolute;
              left: 50px;
              white-space: nowrap;
              top: 8px;
              padding: 4px 8px;
              background-color: #ffffff;
              border-radius: 3px;
              display: none;
              box-shadow: 0px 0px 24px 0px rgba(0, 0, 0, 0.05);
              @media screen and (max-width: 1280px) {
                font-size: 12px;
                top: 4px;
                left: 44px;
              }
            }
            .arrow {
              position: absolute;
              left: 25px;
              top: -18px;
              width: 80px;
              height: 80px;
              display: none;
              @media screen and (max-width: 1280px) {
                left: 20px;
                top: -12px;
                height: 60px;
              }
            }
          }

          @media screen and (max-width: 821px) {
            .func-item {
              height: 16px;
              .o-icon {
                height: 16px;
                width: 16px;
                height: 16px;
                font-size: 16px;
              }
              &:hover {
                .icon-name,
                .arrow {
                  display: none;
                }
              }
            }
            .download-item {
              display: none;
            }
          }
        }
      }
    }
  }
  // 分享海报弹窗
  :deep(.el-dialog.poster-dialog) {
    background-color: transparent;
    .el-dialog__header {
      display: none;
    }
    .el-dialog__body {
      background-color: transparent;
      padding: 0;
    }

    @media screen and (max-width: 821px) {
      .el-dialog__body {
        padding: 0;
      }
    }
    @media screen and (max-width: 769px) {
      width: 100%;
      .el-dialog__body {
        width: 100%;
        padding: 0 16px;
        .poster {
          width: 100%;
          .poster-image {
            width: 100%;
          }
        }
      }
    }
    .poster {
      width: 100%;
      background: #ffffff;
      padding: 16px;
      margin: 0 auto;
      border-radius: 16px;
      @media screen and (max-width: 820px) {
        width: auto;
        height: auto;
      }
      @media screen and (max-width: 767px) {
        width: 100%;
        height: auto;
        padding: 8px;
      }
      &-image {
        width: 402px;
        position: relative;
        @media screen and (max-width: 768px) {
          width: 100%;
        }
        .mask {
          width: 100%;
          height: 198px;
          background: linear-gradient(
            180deg,
            rgba(0, 0, 0, 0) 0%,
            #000000 100%
          );
          position: absolute;
          bottom: 55px;
          @media screen and (max-width: 768px) {
            bottom: 40px;
            height: 160px;
          }
        }
        .qr-code {
          width: 78px;
          height: 78px;
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
        .water-mark {
          position: absolute;
          right: 20px;
          bottom: 72px;
          color: #fff;
          font-size: 12px;
          z-index: 2;
          @media screen and (max-width: 768px) {
            bottom: 48px;
            right: 8px;
            font-size: 8px;
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
          border-radius: 16px 16px 0 0;
        }
        img {
          width: 100%;
          @media screen and (max-width: 768px) {
            // height: calc(100% - 40px);
          }
        }
        .info {
          width: 100%;
          height: 56px;
          background: #f5f6f8;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 16px;
          border-radius: 0 0 16px 16px;
          @media screen and (max-width: 768px) {
            padding: 8px;
            height: auto;
          }
          .desc {
            font-size: 14px;
            font-weight: 400;
            color: #000000;
            line-height: 24px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
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
              color: #555;
              line-height: 24px;
              white-space: nowrap;
              @media screen and (max-width: 768px) {
                font-size: 12px;
                line-height: 24px;
              }
            }
          }
        }
      }
      .poster-tip {
        font-size: 12px;
        color: #555;
        margin-top: 8px;
        display: none;
        @media screen and (max-width: 820px) {
          display: block;
        }
      }
      .shared-image {
        width: 100%;
        height: auto;
        border-radius: 16px;
      }
      &-download {
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
          color: #adadad;
          border-radius: 18px;
          @media screen and (max-width: 768px) {
            height: 32px;
            padding: 0 8px;
          }
          p {
            font-size: 12px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          .pc-copy {
            cursor: pointer;
            color: #999999;
            font-size: 16px;
            @media screen and (max-width: 820px) {
              display: none;
            }
            &:hover {
              color: #40adff;
            }
          }
          .mobile-copy {
            display: none;
            font-size: 14px;
            color: #999999;
            @media screen and (max-width: 820px) {
              display: block;
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
          border-radius: 18px;
          @media screen and (max-width: 768px) {
            width: 74px;
            height: 32px;
            line-height: 30px;
            font-size: 12px;
          }
          @media screen and (max-width: 820px) {
            display: none;
          }
        }
      }
    }
  }
}
</style>
