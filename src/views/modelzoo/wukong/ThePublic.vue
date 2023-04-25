<script setup>
import { ref } from 'vue';

import IconPublic from '~icons/app/public';
import IconFingure from '~icons/app/fingure2';
import IconEyeclose from '~icons/app/eye-close';
import IconHeart from '~icons/app/collected';
import IconLike from '~icons/app/wukong-like';
import IconHeartgray from '~icons/app/heart-gray';

import { useUserInfoStore } from '@/stores';

import {
  publicPictures,
  cancelPublic,
  addLikePicture2,
  cancelLikePicture,
} from '@/api/api-modelzoo.js';
import useWindowResize from '@/shared/hooks/useWindowResize.js';

const userInfoStore = useUserInfoStore();
const screenWidth = useWindowResize();
const publicList = ref([]);
const cancelPublicId = ref('');

// 开启取消公开弹窗
const showConfirmDlg = ref(false);
function quitPublicClick(id) {
  cancelPublicId.value = id;
  showConfirmDlg.value = true;
}

// 获取公开图片
async function getPublicPictures() {
  try {
    const res = await publicPictures();
    publicList.value = res.data.data ? res.data.data : [];
  } catch (e) {
    console.error(e);
  }
}
getPublicPictures();

// 继续公开
function cancelQuitPublic(val) {
  showConfirmDlg.value = val;
}
// 取消公开图片
async function confirmQuitPublic() {
  try {
    const res = await cancelPublic(cancelPublicId.value);
    if (res.status === 204) {
      imgInfoDlg.value = false;
      ElMessage({
        type: 'success',
        message: '取消公开成功',
      });
    }
    getPublicPictures();
  } catch (err) {
    console.error(err);
  }
  showConfirmDlg.value = false;
}
// 移动端点击公开图片
const imgInfoDlg = ref(false);
const imageInfo = ref();
function handleImageClick(info) {
  imageInfo.value = info;
  imgInfoDlg.value = true;
}

// 收藏公开图片
function collectPublickImage(item) {
  addLikePicture2({
    owner: item.owner,
    id: item.id,
  }).then((res) => {
    if (res.data) {
      item.is_like = true;
      ElMessage({
        type: 'success',
        message: '收藏成功，可在画作管理中查看',
      });
    }
  });
}

// 取消收藏公开图片
async function cancelImgCollected(item) {
  try {
    const res = await cancelLikePicture(item.like_id);
    if (res.status === 204) {
      ElMessage({
        type: 'success',
        message: '取消收藏成功',
      });
      item.is_like = false;
    }
  } catch (e) {
    console.error(e);
  }
}
</script>
<template>
  <div class="public">
    <div v-if="publicList.length !== 0" class="have-public">
      <div v-for="item in publicList" :key="item.id" class="collect-item">
        <div v-if="screenWidth > 820" class="image-box">
          <img draggable="false" :src="item.link" alt="" />
          <div class="handles">
            <div class="left">
              <p class="cancel-public" @click="quitPublicClick(item.id)">
                <o-icon><icon-eyeclose></icon-eyeclose></o-icon>
              </p>
              <p
                v-if="item.is_like"
                class="collect-image"
                @click="cancelImgCollected(item)"
              >
                <o-icon><icon-heart></icon-heart></o-icon>
              </p>
              <p
                v-else
                class="collect-image"
                @click="collectPublickImage(item)"
              >
                <o-icon><icon-like></icon-like></o-icon>
              </p>
            </div>
            <!-- <div class="right">
              <o-icon><icon-fingure></icon-fingure></o-icon>
              <p class="dig-counts">{{ item.digg_count }}</p>
            </div> -->
          </div>
        </div>

        <div v-else class="image-box" @click="handleImageClick(item)">
          <img draggable="false" :src="item.link" alt="" />
        </div>
        <div class="img-desc">
          <p>
            来自{{ item.desc }}&nbsp;&nbsp;
            <span v-if="item.style"> #风格：{{ item.style }}</span>
          </p>
          <div class="img-owner">
            <div class="info-left">
              <img :src="userInfoStore.avatar" alt="" />
              <span class="user-name">
                {{ userInfoStore.userName }}
              </span>
            </div>
            <div class="info-right">
              <o-icon><icon-fingure></icon-fingure></o-icon>
              <div class="count">{{ item.digg_count }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="no-public">
      <o-icon><icon-public></icon-public></o-icon>
      <p>暂无公开画作</p>
    </div>
    <!-- 移动端大图弹窗 -->
    <el-dialog
      v-model="imgInfoDlg"
      class="fullscreen-dialog"
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
        <div class="img-owner">
          <div class="info-left">
            <img :src="userInfoStore.avatar" alt="" />
            <span class="user-name">
              {{ userInfoStore.userName }}
            </span>
          </div>
          <div class="info-right">
            <o-icon><icon-fingure></icon-fingure></o-icon>
            <div class="count">{{ imageInfo.digg_count }}</div>
          </div>
        </div>
        <img class="collect-img" :src="imageInfo.link" alt="" />
        <div class="information">
          <div class="mobile-handle">
            <p class="cancel-public" @click="quitPublicClick(imageInfo.id)">
              <o-icon><icon-eyeclose></icon-eyeclose></o-icon>
            </p>
            <p
              v-if="imageInfo.is_like"
              class="collect-image"
              @click="cancelImgCollected(imageInfo)"
            >
              <o-icon><icon-heart></icon-heart></o-icon>
            </p>

            <p
              v-else
              class="collect-image"
              @click="collectPublickImage(imageInfo)"
            >
              <o-icon><icon-heartgray></icon-heartgray></o-icon>
            </p>
          </div>

          <div v-if="imageInfo.digg_count" class="dig-count">
            <o-icon><icon-fingure></icon-fingure></o-icon>
            <p>{{ imageInfo.digg_count }}</p>
          </div>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      v-model="showConfirmDlg"
      class="confirm-dlg"
      width="640"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <template #header>
        <p class="confirm-title">取消公开画作</p>
      </template>
      <div class="confirm-desc">
        若该作品未收藏，取消公开后将无法找回，是否确定取消公开画作？
      </div>
      <template #footer>
        <OButton
          :size="screenWidth < 820 ? 'mini' : 'small'"
          style="margin-right: 16px"
          @click="cancelQuitPublic(false)"
          >取消</OButton
        >
        <OButton
          type="primary"
          :size="screenWidth < 820 ? 'mini' : 'small'"
          @click="confirmQuitPublic"
          >确认</OButton
        >
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
/* :deep(.el-dialog) {
  .el-dialog__header {
    @media screen and (max-width: 820px) {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 0;
    }
    .el-dialog__title {
      color: #fff;
      padding-top: 27px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      @media screen and (max-width: 820px) {
        font-size: 14px;
        line-height: 24px;
        padding: 0 40px;
      }
    }
  }

  .el-dialog__headerbtn {
    position: fixed;
    top: 6px;
    right: 15px;
    z-index: 201;
    @media screen and (max-width: 820px) {
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
} */
/* 移动端点击图片dlg */
:deep(.fullscreen-dialog) {
  border-radius: 0;
  .el-dialog__header {
    height: 80px;
    @media screen and (max-width: 769px) {
      height: 48px;
      line-height: 14px;
      padding: 12px 0;
      .el-dialog__title {
        padding: 0 40px;
      }
    }
    .el-dialog__headerbtn {
      width: 24px;
      height: 24px;
      position: fixed;
      top: 6px;
      right: 15px;
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
    height: calc(100vh - 80px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    background-color: #f5f6f8;
    border-radius: 24px 24px 0px 0px;

    @media screen and (max-width: 768px) {
      height: calc(100vh - 48px);
      padding: 0 16px;
    }
  }
  .image-info {
    position: relative;
    .img-owner {
      color: #555;
      font-size: 14px;
      margin-bottom: 17px;
      display: flex;
      justify-content: space-between;
      img {
        width: 24px;
      }
      .info-left {
        display: flex;
        align-items: center;
        .user-name {
          margin-left: 8px;
        }
      }
      .info-right {
        display: flex;
        align-items: center;
        .o-icon {
          font-size: 17px;
        }
        .count {
          margin-left: 8px;
        }
      }
      @media screen and (max-width: 820px) {
        font-size: 12px;
      }
    }
    .collect-img {
      width: 100%;
      border-radius: 16px;
    }
    .information {
      display: flex;
      justify-content: flex-end;
      font-size: 12px;
      line-height: 18px;
      height: 32px;
      margin-top: 16px;
      .mobile-handle {
        display: flex;
        align-items: center;
        background-color: #fff;
        border-radius: 22px;
        padding: 8px;
        .cancel-public {
          margin-right: 12px;
          @media screen and (max-width: 767px) {
            margin-right: 8px;
          }
        }
        .cancel-public,
        .collect-image {
          width: 24px;
          height: 24px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          .o-icon {
            font-size: 24px;
            @media screen and (max-width: 767px) {
              font-size: 16px;
            }
          }
        }
      }
      .dig-count {
        display: flex;
        align-items: center;
        .o-icon {
          margin-right: 8px;
          font-size: 24px;
          @media screen and (max-width: 767px) {
            margin-right: 4px;
            font-size: 16px;
          }
        }
      }
    }
  }
}
/* 确认公开弹窗 */
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
.public {
  .no-public {
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
  .have-public {
    display: grid;
    grid-template-columns: repeat(3, 310px);
    grid-gap: 24px;
    @media screen and (max-width: 821px) {
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

          .left {
            display: flex;
            .cancel-public {
              margin-right: 8px;
            }

            .cancel-public,
            .collect-image {
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
          .right {
            display: flex;
            .o-icon {
              align-self: center;
              margin-right: 8px;
            }
            .dig-counts {
              margin: 0;
              color: #ffffff;
            }
          }
        }

        img {
          width: 100%;
          border-radius: 16px 16px 0 0;
          @media screen and (max-width: 820px) {
            width: calc(50vw - 24px);
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
          display: flex;
          justify-content: space-between;
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
              @media screen and (max-width: 768px) {
                margin-left: 4px;
              }
            }
          }
          .info-right {
            display: flex;
            align-items: center;
            .o-icon {
              font-size: 17px;
              @media screen and (max-width: 768px) {
                font-size: 12px;
              }
            }
            .count {
              margin-left: 8px;
              @media screen and (max-width: 768px) {
                margin-left: 2px;
              }
            }
          }
          @media screen and (max-width: 820px) {
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
