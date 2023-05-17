<script setup>
import logoImg from '@/assets/imgs/footer-logo1.png';
import logoImg1 from '@/assets/imgs/footer-logo.png';
import logoImg2 from '@/assets/imgs/logo2.png';
import qrCodeImg from '@/assets/imgs/qr-code.png';
import IconClose from '~icons/app/close';

import { toRefs } from 'vue';
import { useRoute } from 'vue-router';

import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n();

const route = useRoute();

const props = defineProps({
  isCookieTip: {
    type: Boolean,
    default: false,
  },
});
// 点击关闭cookies使用提示
const { isCookieTip } = toRefs(props);
const emits = defineEmits(['click-cookie']);
function onCookieClick() {
  emits('click-cookie');
}
</script>

<template>
  <footer class="footer">
    <div v-if="locale === 'zh'" class="footer-logo">
      <!-- <img
        v-if="route.path === '/modelzoo/wukong'"
        :src="logoImg1"
        alt=""
        srcset=""
      /> -->
      <img :src="logoImg" alt="" srcset="" />
    </div>
    <div v-else class="footer-logo">
      <img :src="logoImg2" alt="" srcset="" />
    </div>
    <div class="footer-content">
      <div class="above">
        <router-link class="text" to="/privacy">{{
          t('home.PRIVACY_POLICY')
        }}</router-link>
        <div class="division"></div>
        <router-link class="text" to="/legal">{{
          t('home.LEGAL_NOTICE')
        }}</router-link>
      </div>
      <div class="below">
        <span>{{ t('home.COPYRIGHT') }}</span>
        <span>©&nbsp;2023&nbsp;MindSpore</span>
        <span>&nbsp;{{ t('home.OWNERSHIP') }}</span>
      </div>
    </div>
    <div class="footer-code">
      <img :src="qrCodeImg" />
      <p>{{ t('home.SCANNING_CODE') }}</p>
    </div>
    <!-- 隐私政策 -->
    <div v-if="isCookieTip" class="cookie-privacy">
      <!-- <template>
        <span>{{ i18n.common.COOKIE_LEGAL_TEXT }} </span>
        <a :href="'/' + lang + '/other/privacy/'">{{
          i18n.common.COOKIE_LEGAL_LINK_TEXT
        }}</a>
      </template> -->
      <span> 本站点使用Cookies，继续浏览表示您同意我们使用Cookies。</span>
      <a href="/privacy">Cookies和隐私政策。</a>
      <o-icon class="icon" @click="onCookieClick">
        <icon-close></icon-close>
      </o-icon>
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
  padding: 141px 16px 87px;
  // color: rgba(255, 255, 255, 1);
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
  &-logo2 {
    display: flex;
    align-items: center;
    height: 80px;
    @media screen and (max-width: 820px) {
      display: none;
    }
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
        // color: rgba(255, 255, 255, 1);
        color: #000000;
        height: 26px;
        line-height: 26px;
        cursor: pointer;
      }

      .division {
        width: 1px;
        height: 20px;
        // background-color: rgba(255, 255, 255, 1);
        background-color: #000000;
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
      // color: #ffffff;
      opacity: 0.8;
      line-height: 12px;
    }
  }
  .cookie-privacy {
    line-height: 48px;
    width: 100%;
    height: 48px;
    background-color: #f5f6f8;
    color: #3f3f3f;
    font-size: 14px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    bottom: 0;
    right: 0;
    left: 0;
    z-index: 999;
    box-shadow: 0 1px 5px rgba(45, 47, 51, 0.1);
    text-align: center;
    @media screen and (max-width: 820px) {
      font-size: 12px;
      line-height: 20px;
      display: inline-block;
      padding-left: 12px;
      padding-right: 12px;
    }
    a {
      cursor: pointer;
      text-decoration: solid;
      white-space: pre;
      color: #0d8dff;
    }
    .icon {
      cursor: pointer;
      vertical-align: middle;
      margin-left: 16px;
      width: 24px;
      height: 24px;
      background: #2e2e2e;
      border-radius: 50%;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      svg {
        font-size: 20px;
        color: var(--el-color-white);
      }
      @media screen and (max-width: 820px) {
        width: 20px;
        height: 20px;
        margin-left: 12px;
      }
    }
  }
}
</style>
