<script setup>
import logoImg from '@/assets/imgs/footer-logo.png';
import qrCodeImg from '@/assets/imgs/qr-code.png';
import useWindowResize from './hooks/useWindowResize';

const screenWidth = useWindowResize();
</script>

<template>
  <footer class="footer">
    <div v-if="screenWidth > 768" class="footer-logo">
      <img :src="logoImg" alt="" srcset="" />
    </div>
    <div class="footer-content">
      <div class="above">
        <router-link class="text" to="/privacy">隐私政策</router-link>
        <div class="division"></div>
        <router-link class="text" to="/legal">法律声明</router-link>
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
  background-color: #060b29;
  color: rgba(255, 255, 255, 1);

  @media screen and (max-width: 1080px) {
    flex-direction: column-reverse;
    align-items: center;
    height: auto;
  }
  &-logo {
    display: flex;
    align-items: center;
    height: 64px;
    // cursor: pointer;
    img {
      vertical-align: top;
      height: 100%;
    }
  }

  &-content {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    @media screen and (max-width: 1080px) {
      position: static;
      left: 0;
      transform: none;
      margin-top: 16px;
    }
    .above {
      width: 202px;
      display: flex;
      justify-content: space-around;
      font-size: 14px;
      margin: 0 auto;
      @media screen and (max-width: 1080px) {
        width: auto;
        justify-content: center;
        align-items: center;
      }
      .text {
        color: rgba(255, 255, 255, 1);
        height: 26px;
        line-height: 26px;
        cursor: pointer;

        @media screen and (max-width: 1080px) {
          margin-left: 8px;

          &:first-child {
            margin-right: 8px;
          }
        }
      }

      .division {
        width: 1px;
        height: 20px;
        background-color: rgba(255, 255, 255, 1);
        margin-top: 2px;
        @media screen and (max-width: 1080px) {
          height: 14px;
        }
      }
    }

    .below {
      display: flex;
      font-size: 12px;
      margin-top: 20px;
      @media screen and (max-width: 1080px) {
        margin-top: 4px;
      }
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
