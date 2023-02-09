<script setup>
import { ref } from 'vue';

import IconPublic from '~icons/app/public';
import IconFingure from '~icons/app/fingure';
import IconCancel from '~icons/app/cancel-public';

import image from '@/assets/imgs/wukong/umbrella-women.png';

const publicList = ref([
  {
    id: 1,
    link: image,
  },
  {
    id: 2,
    link: image,
  },
  {
    id: 3,
    link: image,
  },
  {
    id: 4,
    link: image,
  },
]);

const cancelPublicId = ref(0);

const showConfirmDlg = ref(false);
function quitPublicClick(id) {
  cancelPublicId.value = id;
  showConfirmDlg.value = true;
}
// 继续公开
function cancelQuitPublic(val) {
  console.log('继续公开');
  showConfirmDlg.value = val;
}
// 取消公开图片
function confirmQuitPublic() {
  console.log('确认取消公开');

  publicList.value.forEach((item, index) => {
    if (item.id === cancelPublicId.value) {
      publicList.value.splice(index, 1);
    }
  });

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
              <p class="dig-counts">999+</p>
            </div>
          </div>
        </div>
        <p>
          {{ item.desc }}&nbsp;{{ item.style }}城市夜景 赛博朋克
          格雷格·鲁特科夫斯基
        </p>
      </div>
    </div>
    <div v-else class="no-public">
      <o-icon><icon-public></icon-public></o-icon>
      <p>暂无公开画作</p>
    </div>
    <!-- 确认弹窗 -->
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
}
</style>
