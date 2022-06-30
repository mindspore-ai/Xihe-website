<script setup>
import { useRouter } from 'vue-router';
import logoImg from '@/assets/imgs/footer-logo.png';
import qrCodeImg from '@/assets/imgs/qr-code.png';

const router = useRouter();

function goToPage(url) {
  router.push(`/${url}`);
}
</script>

<template>
  <footer class="footer">
    <div class="footer-logo">
      <img :src="logoImg" alt="" srcset="" />
    </div>
    <div class="footer-content">
      <div class="above">
        <span class="text" @click="goToPage('privacy')">隐私政策</span>
        <div class="division"></div>
        <span class="text" @click="goToPage('legal')">法律声明</span>
      </div>
      <div class="below">
        <span>版权所有</span>
        <span>©&nbsp;2022&nbsp;MindSpore</span>
        <span>&nbsp;保留一切权利</span>
      </div>
    </div>
    <div class="footer-code">
      <img :src="qrCodeImg" />
      <p>扫码关注公众号</p>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
.footer {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1472px;
  margin: 0 auto;
  height: 200px;
  padding: 16px 16px;
  color: rgba(255, 255, 255, 1);

  &-logo {
    display: flex;
    align-items: center;
    height: 64px;
    cursor: pointer;
    img {
      vertical-align: top;
      height: 100%;
    }
  }

  &-content {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    .above {
      width: 202px;
      display: flex;
      justify-content: space-around;
      font-size: 14px;
      margin: 0 auto;
      .text {
        color: rgba(255, 255, 255, 1);
        height: 26px;
        line-height: 26px;
        cursor: pointer;
      }

      .division {
        width: 1px;
        height: 20px;
        background-color: rgba(255, 255, 255, 1);
        margin-top: 2px;
      }
    }

    .below {
      display: flex;
      font-size: 12px;
      margin-top: 21px;
    }
  }

  &-code {
    display: flex;
    flex-direction: column;
    align-items: center;
    img {
      width: 78px;
      height: 78px;
    }

    p {
      margin-top: 8px;
      font-size: 12px;
      color: #ffffff;
      opacity: 0.8;
      line-height: 12px;
    }
  }
}
</style>
