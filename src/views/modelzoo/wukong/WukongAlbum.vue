<!-- eslint-disable vue/no-deprecated-v-on-native-modifier -->
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
import IconLikes from '~icons/app/likes.svg';
import IconLikes1 from '~icons/app/likes1.svg';
import IconLiked from '~icons/app/liked.svg';
// import IconLiked1 from '~icons/app/liked1.svg';
import IconLeft from '~icons/app/left.svg';
import IconRight from '~icons/app/right.svg';
import IconDownload from '~icons/app/wukong-download';
import IconShare from '~icons/app/share';
import IconLike from '~icons/app/wukong-like';
import IconHeart from '~icons/app/collected';
import IconCopy from '~icons/app/copy-nickname';

import useClipboard from 'vue-clipboard3';
const { toClipboard } = useClipboard();

const router = useRouter();
// const route = useRoute();
const userInfo = useUserInfoStore();
const isLogined = useLoginStore().isLogined;
const imgs = ref([]);
const activeName = ref('official');
const params = ref({
  page_num: 1,
  count_per_page: 28,
  level: 'official',
});
const picTotal = ref();
getWuKongPic(params.value).then((res) => {
  imgs.value = res.data.pictures;
  picTotal.value = res.data.total;
});
function getMore() {
  params.value.page_num++;
  if (imgs.value.length < picTotal.value) {
    getWuKongPic(params.value)
      .then((res) => {
        imgs.value = imgs.value.concat(res.data.pictures);
      })
      .catch((err) => {
        console.error(err);
      });
  }
}
const throttleGet = throttle(getMore, 1000, {
  leading: true,
});
const handleScroll = () => {
  const scrollTop = document.documentElement.scrollTop;
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
    imgs.value = res.data.pictures;
    picTotal.value = res.data.total;
  });
}

function toggleDigg(num) {
  if (isLogined) {
    if (imgs.value[num].is_digg) {
      cancelDigg({ user: imgs.value[num].owner, id: imgs.value[num].id }).then(
        (res) => {
          imgs.value[num].is_digg = false;
          imgs.value[num].digg_count = res.data.digg_count;
        }
      );
    } else {
      toDigg({ user: imgs.value[num].owner, id: imgs.value[num].id }).then(
        (res) => {
          imgs.value[num].is_digg = true;
          imgs.value[num].digg_count = res.data.digg_count;
          ElMessage({
            type: 'success',
            message: '点赞成功',
            center: true,
          });
        }
      );
    }
  } else {
    goAuthorize();
  }
}
function downloadPic() {
  let x = new XMLHttpRequest();
  x.open('GET', dialogData.value.link, true);
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
const isSharedPoster = ref(false);
const shareImg = ref('');
function sharePic() {
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
function savePic() {
  if (isLogined) {
    if (dialogData.value.is_like) {
      cancelLikePicture(dialogData.value.like_id).then(() => {
        dialogData.value.is_like = false;
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
          message: '收藏成功，可在画作管理中查看',
        });
      });
    }
  } else {
    goAuthorize();
  }
}
async function copyText(textValue) {
  await toClipboard(textValue);
  ElMessage({
    type: 'success',
    message: '复制成功',
    center: true,
  });
}

const screenWidth = useWindowResize();

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

const showPic = ref(false);
const showShare = ref(false);
const dialogData = ref();
const picIndex = ref();
function toggleDialog(num) {
  showPic.value = true;
  dialogData.value = imgs.value[num];
  picIndex.value = num;
  dialogData.value.link = dialogData.value.link.replace(
    'https://big-model-deploy.obs.cn-central-221.ovaijisuan.com/',
    '/obs-big-model/'
  );
  dialogData.value.avatar = dialogData.value.avatar.replace(
    'https://obs-xihe-beijing4.obs.cn-north-4.myhuaweicloud.com/',
    '/obs-xihe-avatar/'
  );
  userInfo.avatar = userInfo.avatar.replace(
    'https://obs-xihe-beijing4.obs.cn-north-4.myhuaweicloud.com/',
    '/obs-xihe-avatar/'
  );
}

// function goToBigmodel() {
//   router.push('/modelzoo');
// }
// function goToWukong() {
//   router.push('/modelzoo/wukong');
// }

function goUser(owner) {
  router.push(`/${owner}`);
}
function toPrePic() {
  if (picIndex.value > 0) {
    picIndex.value = picIndex.value - 1;
    dialogData.value = imgs.value[picIndex.value];
    dialogData.value.link = dialogData.value.link.replace(
      'https://big-model-deploy.obs.cn-central-221.ovaijisuan.com/',
      '/obs-big-model/'
    );
  } else {
    ElMessage({
      type: 'error',
      message: '已是第一张',
      center: true,
    });
  }
}
function toNextPic() {
  if (picIndex.value < imgs.value.length - 1) {
    picIndex.value = Number(picIndex.value) + 1;
    dialogData.value = imgs.value[picIndex.value];
    dialogData.value.link = dialogData.value.link.replace(
      'https://big-model-deploy.obs.cn-central-221.ovaijisuan.com/',
      '/obs-big-model/'
    );
  } else {
    ElMessage({
      type: 'error',
      message: '已是最后一张',
      center: true,
    });
  }
}
</script>
<template>
  <div class="wrapper">
    <div class="picture-album">
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/modelzoo/' }"
          >大模型</el-breadcrumb-item
        >
        <el-breadcrumb-item
          :to="{ path: '/modelzoo/wukong' }"
          class="breadcrumb-item"
          >悟空</el-breadcrumb-item
        >
        <el-breadcrumb-item>AI画集</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- <div class="painting-management-bread">
        <p @click="goToBigmodel">大模型</p>
        <span>></span>
        <p @click="goToWukong">悟空</p>
        <span>></span>
        <p class="current">AI画集</p>
      </div> -->
      <!-- tab栏 -->
      <el-tabs
        v-model="activeName"
        type="card"
        class="demo-tabs1"
        @tab-change="changeTab"
      >
        <el-tab-pane label="筛选" name="0" disabled></el-tab-pane>
        <el-tab-pane label="官方" name="official"></el-tab-pane>
        <el-tab-pane label="全部" name=""></el-tab-pane>
        <!-- <el-tab-pane label="最热" name="3"></el-tab-pane>
        <el-tab-pane label="最新" name="4"></el-tab-pane> -->
      </el-tabs>
      <!-- 画集图片 -->
      <el-dialog
        v-model="showPic"
        :title="dialogData?.desc"
        :destroy-on-close="true"
        :fullscreen="true"
        lock-scroll
        center
        @close="closeDialog"
      >
        <o-icon class="check" @click="toPrePic"> <icon-left /></o-icon>
        <div class="pic-box">
          <div class="img-mask"></div>
          <img :src="dialogData.link" alt="" />
          <div class="user-info">
            <p class="left" @click="goUser(dialogData.owner)">
              <img :src="dialogData.avatar" alt="" />
              <span>{{ dialogData.owner }}</span>
            </p>
            <p class="right" @click="toggleDigg(picIndex)">
              <o-icon v-if="dialogData.is_digg"> <icon-liked /></o-icon>
              <o-icon v-else> <icon-likes /></o-icon>
              <span class="digg-count">{{ dialogData?.digg_count }}</span>
            </p>
            <o-icon class="download pic-right1" @click.stop="downloadPic"
              ><icon-download></icon-download
            ></o-icon>
            <o-icon class="share pic-right2" @click="sharePic"
              ><icon-share></icon-share
            ></o-icon>
            <o-icon
              v-if="dialogData.is_like"
              class="heart pic-right3"
              @click="savePic"
              ><icon-heart></icon-heart
            ></o-icon>
            <o-icon v-else class="heart pic-right3" @click="savePic"
              ><icon-like></icon-like
            ></o-icon>
          </div>
        </div>
        <o-icon class="check" @click="toNextPic"> <icon-right /></o-icon>
        <el-dialog
          v-model="showShare"
          :fullscreen="true"
          class="share-pic"
          @click="showShare = false"
          @close="handleDlgClose"
        >
          <div class="poster">
            <div v-if="!isSharedPoster" id="screenshot" class="poster-image">
              <img draggable="false" :src="dialogData.link" alt="" />

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
                <p>https://xihe.mindspore.cn/modelzoo/wukong</p>

                <o-icon
                  class="pc-copy"
                  @click.stop="
                    copyText(`https://xihe.mindspore.cn/modelzoo/wukong`)
                  "
                  ><icon-copy></icon-copy
                ></o-icon>

                <o-icon
                  class="mobile-copy"
                  @click.stop="
                    copyText(`https://xihe.mindspore.cn/modelzoo/wukong`)
                  "
                  ><icon-copy></icon-copy
                ></o-icon>
              </div>
              <div class="button" @click.stop="downloadPoster">下载海报</div>
            </div>
            <div class="poster-tip">长按保存海报</div>
          </div>
        </el-dialog>
      </el-dialog>
      <!-- 画集图片 -->
      <div class="album-item1">
        <div v-for="(items, index) in imgs" :key="items.id" class="img-box">
          <div @click="toggleDialog(index)">
            <div class="img">
              <img :src="items.link" alt="" />
            </div>
            <div class="style">
              来自{{ items.desc }}
              <p v-if="items.style">#风格：{{ items.style }}</p>
            </div>
            <div class="imgs-info">
              <div class="user" @click.stop="goUser(items.owner)">
                <img :src="items.avatar" alt="" /><span class="user-name">{{
                  items.owner
                }}</span>
              </div>
              <div class="like" @click.stop="toggleDigg(index)">
                <o-icon v-if="items?.is_digg"> <icon-liked /></o-icon>
                <o-icon v-else class="likes1"> <icon-likes1 /></o-icon>
                <span>{{ items?.digg_count }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.input-dom {
  position: fixed;
  top: -1200px;
}

.el-breadcrumb {
  height: 21px;
  line-height: 21px;
  padding-top: 120px;
  @media screen and (max-width: 820px) {
    display: none;
  }
  @media screen and (max-width: 768px) {
    display: none;
  }

  .el-breadcrumb__item {
    :deep(.el-breadcrumb__inner.is-link) {
      color: #555;
      font-weight: 400;
      &:hover {
        color: #0d8dff;
      }
    }
    :deep(.el-breadcrumb__separator.el-icon) {
      color: #555;
    }
  }
  :deep(.el-breadcrumb__item:last-child .el-breadcrumb__inner) {
    color: #000;
  }
  :deep(.el-breadcrumb__item:nth-child(2) .el-breadcrumb__inner) {
    cursor: pointer;
  }
}
.wrapper {
  background-color: #f5f6f8;
  padding: 0 16px;
  .picture-album {
    max-width: 1440px;
    margin: 0 auto;
    width: 100%;
    .painting-management-bread {
      padding: 120px 0 0;
      display: flex;
      height: 18px;
      p {
        font-size: 12px;
        line-height: 18px;
        color: #555550;
        // font-weight: bold;
        cursor: pointer;
      }
      span {
        margin: 0 4px;
        color: #555550;
      }
      .current {
        color: #000;
        // font-weight: bold;
        cursor: auto;
      }
    }

    :deep(.demo-tabs1) {
      .el-tabs__header {
        border: none;
        margin: 40px 0px 24px;
        height: 100%;
        box-shadow: 0px 1px 5px 0px rgba(45, 47, 51, 0.1);
        @media screen and (max-width: 820px) {
          margin: 0;
          padding: 74px 0 24px;
          box-shadow: none;
        }
        // @media screen and (max-width: 820px) {
        // }
        .el-tabs__nav {
          border: none;
        }
        .el-tabs__nav-scroll {
          background-color: #ffffff;
          @media screen and (max-width: 768px) {
            background-color: #f5f6f8;
          }
        }
        .el-tabs__item {
          border: none;
          line-height: 28px;
          height: 28px;
          margin: 14px 6px;
          padding: 0 12px;
          color: #555555;
          &:first-child {
            color: #000000;
            font-weight: 550;
            margin-left: 12px;
            margin-right: 22px;
            @media screen and (max-width: 768px) {
              margin-left: 0;
              margin-right: 16px;
              padding-left: 0;
            }
          }
          &:last-child {
            padding-right: 12px;
            @media screen and (max-width: 768px) {
              padding-right: 8px;
            }
          }
          @media screen and (max-width: 768px) {
            padding: 2px 8px;
            margin: 0;
            font-size: 12px;
            height: 20px;
            line-height: 18px;
          }
        }
        .is-active {
          box-shadow: 0 0 0 1px #0d8dff inset;
          color: #0d8dff;
          @media screen and (max-width: 768px) {
            // box-shadow: none;
            // border: 1px solid #0d8dff;
          }
        }
      }
    }

    :deep(.el-dialog) {
      --el-dialog-bg-color: rgba(0, 0, 0, 0.85) !important;
      position: relative;
      overflow: hidden;
      .el-dialog__title {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: inline-block;
        max-width: calc(100vh - 380px);
      }
      @media screen and (max-width: 820px) {
        .el-dialog__body {
          width: 640px;
          margin: 0 auto;
        }
      }
      @media screen and (max-width: 767px) {
        .el-dialog__body {
          width: 100%;
        }
      }
      .share-pic {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background-color: rgba(0, 0, 0, 0.85);
        .poster {
          width: 434px;
          // height: 566px;
          background: #ffffff;
          padding: 16px;
          margin: 0 auto;
          margin-top: -5%;
          // margin-top: calc(50vh - 430px);
          // margin-top: 100px;
          @media screen and (max-width: 820px) {
            width: auto;
            height: auto;
          }
          @media screen and (max-width: 767px) {
            width: 100%;
            height: auto;
            // margin-top: -15vh;
            padding: 8px;
          }
          &-image {
            width: 402px;
            // height: 457px;
            position: relative;
            @media screen and (max-width: 768px) {
              width: 100%;
              // height: calc(100% - 40px);
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
            img {
              width: 100%;
              // height: 402px;
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
                  color: #555555;
                  line-height: 24px;
                  white-space: nowrap;
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
              // line-height: 36px;
              background: #ffffff;
              border: 1px solid #999999;
              padding-left: 16px;
              padding-right: 10px;
              margin-right: 8px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              color: #adadad;
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
      .el-dialog__header {
        padding: 15px 0 15px;
        position: sticky;
        top: 0;
        background: #000;
        z-index: 200;
        @media screen and (max-width: 768px) {
          height: 48px;
          line-height: 14px;
          padding: 12px 0 12px;
        }
        span {
          color: #fff;
          font-size: 24px;
          @media screen and (max-width: 768px) {
            font-size: 14px;
          }
        }
      }
      .el-dialog__body {
        padding-top: 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: calc(100vh - 80px);
        color: #fff;
        padding: 16px !important;
        margin-top: auto;
        transform: none;
        @media screen and (max-width: 768px) {
          height: auto;
          margin-top: 12vh;
          // transform: translateY(-50%);
        }
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
        @media screen and (max-width: 768px) {
          top: 12px;
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
        background: #000;
        @media screen and (max-width: 768px) {
          display: none;
        }
        &:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      }
      .pic-box {
        width: 33%;
        position: relative;
        @media screen and (max-width: 820px) {
          width: auto;
        }
        @media screen and (max-width: 768px) {
          width: 100%;
          .img-mask {
            position: absolute;
            height: 74px;
            right: 0;
            left: 0;
            bottom: 0;
            background: linear-gradient(
              180deg,
              rgba(0, 0, 0, 0) 0%,
              #000000 100%
            );
          }
        }
        img {
          width: 100%;
        }
        .user-info {
          margin-top: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          @media screen and (max-width: 768px) {
            position: absolute;
            right: 8px;
            left: 8px;
            bottom: 8px;
          }
          .left,
          .right {
            cursor: pointer;
          }
          img {
            width: 24px;
          }
          span {
            line-height: 24px;
            color: #fff;
            margin-left: 8px;
          }
          .o-icon {
            font-size: 18px;
            line-height: 18px;
            @media screen and (max-width: 768px) {
              display: inline-block;
              font-size: 12px;
              line-height: 12px;
            }
          }
          .digg-count {
            line-height: 10px;
            height: 18px;
            @media screen and (max-width: 768px) {
              font-size: 10px;
              line-height: 12px;
            }
          }
        }
        .download,
        .pic-right1 {
          position: absolute;
          right: -64px;
          bottom: 200px;
          height: 40px;
          width: 40px;
          border-radius: 50%;
          background: #3a3a3a;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          &:hover {
            background: rgba(255, 255, 255, 0.3);
          }
          @media screen and (max-width: 768px) {
            height: 24px;
            width: 24px;
            right: 64px;
            bottom: -32px;
            background-color: rgba(255, 255, 255, 0.1);
            font-size: 16px !important;
            display: flex !important;
          }
          @media screen and (max-width: 820px) {
            display: none !important;
          }
        }
        .pic-right2,
        .share {
          position: absolute;
          right: -64px;
          bottom: 144px;
          height: 40px;
          width: 40px;
          border-radius: 50%;
          background: #3a3a3a;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          &:hover {
            background: rgba(255, 255, 255, 0.3);
          }
          @media screen and (max-width: 768px) {
            height: 24px;
            width: 24px;
            right: 32px;
            bottom: -32px;
            background-color: rgba(255, 255, 255, 0.1);
            font-size: 16px !important;
            display: flex !important;
          }
        }
        .heart,
        .pic-right3 {
          position: absolute;
          right: -64px;
          bottom: 88px;
          height: 40px;
          width: 40px;
          border-radius: 50%;
          background: #3a3a3a;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          &:hover {
            background: rgba(255, 255, 255, 0.3);
          }
          @media screen and (max-width: 768px) {
            height: 24px;
            width: 24px;
            right: 0;
            bottom: -32px;
            background-color: rgba(255, 255, 255, 0.1);
            font-size: 16px !important;
            display: flex !important;
          }
        }
      }
    }

    .album-item1 {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      column-gap: 24px;
      row-gap: 24px;
      padding-bottom: 64px;
      @media screen and (max-width: 820px) {
        grid-template-columns: 1fr 1fr 1fr;
      }
      @media screen and (max-width: 767px) {
        grid-template-columns: 1fr 1fr;
        padding-bottom: 40px;
        column-gap: 8px;
        row-gap: 8px;
      }
      .img-box {
        cursor: pointer;
        background-color: #fff;
        box-shadow: 0px 1px 5px 0px rgba(45, 47, 51, 0.1);
        &:hover {
          box-shadow: 0 6px 18px #0d8dff24;
        }
        position: relative;
        .img {
          width: 100%;
          height: 0;
          padding-bottom: 100%;
          // position: relative;
          img {
            width: 100%;
            // position: absolute;
            // top: 50%;
            // transform: translate(0, -50%);
          }
        }
        .imgs-info {
          margin: 0 16px 16px;
          text-overflow: ellipsis;
          color: #999999;
          display: flex;
          justify-content: space-between;
          // width: 100%;
          // align-items: center;
          line-height: 24px;
          position: absolute;
          bottom: 0;
          right: 0;
          left: 0;
          @media screen and (max-width: 768px) {
            font-size: 10px;
            height: 18px;
            line-height: 18px;
            margin: 0 8px 8px;
            .user-name {
              display: inline-block;
              width: 60px;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
          img {
            width: 24px;
            margin-right: 8px;
            @media screen and (max-width: 768px) {
              width: 16px;
              margin-right: 4px;
            }
          }
        }
        .style {
          margin: 8px 16px 56px;
          line-height: 22px;
          white-space: nowrap;
          width: 180px;
          overflow: hidden;
          text-overflow: ellipsis;
          @media screen and (max-width: 768px) {
            font-size: 12px;
            line-height: 18px;
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
          @media screen and (max-width: 768px) {
            margin: 8px 8px 34px;
            width: 140px;
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
</style>
