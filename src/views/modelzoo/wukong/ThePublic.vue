<script setup>
import { ref } from 'vue';

import IconPublic from '~icons/app/public';
import IconFingure from '~icons/app/fingure';
import IconCancel from '~icons/app/cancel-public';

import { publicPictures, cancelPublic } from '@/api/api-modelzoo.js';

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
</script>
<template>
  <div class="public">
    <div v-if="publicList.length !== 0" class="have-public">
      <div v-for="item in publicList" :key="item.id" class="collect-item">
        <div class="image-box">
          <img draggable="false" :src="item.link" alt="" />
          <div class="handles">
            <div class="icon-item" @click="quitPublicClick(item.id)">
              <o-icon><icon-cancel></icon-cancel></o-icon>
            </div>
            <div class="right">
              <o-icon><icon-fingure></icon-fingure></o-icon>
              <p class="dig-counts">{{ item.digg_count }}</p>
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

    <el-dialog
      v-model="showConfirmDlg"
      class="confirm-dlg"
      width="640"
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
  </div>
</template>

<style lang="scss" scoped>
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
    display: flex;
    justify-content: center;
  }
}
.public {
  width: 100%;
  height: 100%;
  .no-public {
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
          .o-icon {
            color: #fff;
            font-size: 24px;
          }
        }
        .right {
          display: flex;
          .o-icon {
            align-self: center;
            margin-right: 8px;
            // font-size: 18px;
          }
          .dig-counts {
            margin: 0;
            color: #ffffff;
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
