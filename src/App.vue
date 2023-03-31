<script setup>
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import AppHeader from '@/components/AppHeader.vue';
import AppFooter from '@/components/AppFooter.vue';

import IconBack from '~icons/app/left.svg';
import IconMenu from '~icons/app/meau-header.svg';
import logoImg from '@/assets/imgs/logo1.png';
import logoImg2 from '@/assets/imgs/logo2.png';

import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n();

const route = useRoute();
const router = useRouter();

const showFooter = computed(() => {
  return !(route.path === '/' || route.path === '/home');
});

const header = ref(null);
const isHeaderTransparent = ref(false);

const setHeader = () => {
  const scrollTop = document.documentElement.scrollTop;
  const scrollLeft = document.documentElement.scrollLeft;

  isHeaderTransparent.value = scrollTop > 0 ? true : false;
  header.value && (header.value.style.left = `-${scrollLeft}px`);
};

onMounted(() => {
  window.addEventListener('scroll', setHeader);
});

onUnmounted(() => {
  window.removeEventListener('scroll', setHeader);
});

// header适配mobile
const currentPage = ref('');
const routeLists = {
  taichu: {
    name: '紫东太初',
    child: [
      'taichuIntroduction',
      'textToImage',
      'imageCaption',
      'taichuVision',
    ],
    back: '/modelzoo',
  },
  wukong: {
    name: '悟空.画画',
    child: ['wukongExperience', 'wukongIntroduce', 'wukong', 'AIAlbum'],
    back: '/modelzoo',
  },
  pangu: {
    name: '鹏程.盘古',
    child: ['pangu', 'panguExperience', 'panguIntroduce'],
    back: '/modelzoo',
  },
  shennong: {
    name: '鹏程.神农',
    child: ['shennong'],
    back: '/modelzoo',
  },
  modelzoo: {
    name: '大模型',
    child: ['modelzoo'],
    back: '/',
  },
  manage: {
    name: '画作管理',
    child: ['wukongCollection', 'wukongPublic'],
    back: '/modelzoo/wukong',
  },
  luojia: {
    name: '武汉.LuoJia',
    child: ['luojia', 'luojiaExperience', 'luojiaIntroduce'],
    back: '/modelzoo',
  },
  album: {
    name: 'AI画集',
    child: ['AIAlbum'],
    back: '/modelzoo/wukong',
  },
  home: {
    name: '首页',
    child: ['home'],
    back: '',
  },
};

const isMobileFit = ref(false);
const backUrl = ref('');
watch(
  () => route,
  () => {
    currentPage.value = '';
    noHeader.value = false;
    Object.keys(routeLists).forEach((key) => {
      let bool = routeLists[key].child.includes(route.name);
      if (bool) {
        currentPage.value = routeLists[`${key}`].name;
      }
    });

    isMobileFit.value = currentPage.value ? true : false;

    noHeader.value = false;
  },
  { deep: true },
  { immediate: true }
);

const screenWidth = ref(
  window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth
);

const onResize = () => {
  screenWidth.value =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
};

watch(
  () => screenWidth.value,
  (newValue) => {
    screenWidth.value = newValue;
  }
);

onMounted(() => {
  window.addEventListener('resize', onResize);
});

function goBack() {
  Object.keys(routeLists).forEach((key) => {
    if (routeLists[key].name === currentPage.value) {
      backUrl.value = routeLists[key].back;
    }
  });

  router.push(backUrl.value);
}
const noHeader = ref(false);
function Scroll(e) {
  e = e || window.event;
  if (e.wheelDelta) {
    if (e.wheelDelta > 0) {
      noHeader.value = false;
    } else if (route.name === 'home') {
      noHeader.value = true;
    }
  }
}
window.onmousewheel = document.onmousewheel = Scroll;

const mobilNav = reactive([
  {
    name: computed(() => {
      return t('home.APP_HEADER.HOME');
    }),
    isactive: true,
    path: '/',
  },
  {
    name: computed(() => {
      return t('home.APP_HEADER.PROJECT');
    }),
    isactive: false,
    path: '/projects',
  },
  {
    name: computed(() => {
      return t('home.APP_HEADER.MODEL');
    }),
    isactive: false,
    path: '/models',
  },
  {
    name: computed(() => {
      return t('home.APP_HEADER.MODELZOO');
    }),
    isactive: false,
    children: [
      {
        name: computed(() => {
          return t('home.APP_HEADER.EXPERENCE');
        }),
        path: '/modelzoo',
      },
      {
        name: computed(() => {
          return t('home.APP_HEADER.FINE_TUNING');
        }),
        path: '/finetune',
      },
    ],
  },
  {
    name: computed(() => {
      return t('home.APP_HEADER.DATASET');
    }),
    isactive: false,
    path: '/datasets',
  },
  {
    name: computed(() => {
      return t('home.APP_HEADER.INDUSTRY');
    }),
    isactive: false,
    path: '/estate/electricity',
  },
  {
    name: computed(() => {
      return t('home.APP_HEADER.COURSE');
    }),
    isactive: false,
    path: '/course',
  },
  {
    name: computed(() => {
      return t('home.APP_HEADER.COMPETITION');
    }),
    isactive: false,
    path: '/competition',
  },
  {
    name: computed(() => {
      return t('home.APP_HEADER.ACTIVITY');
    }),
    isactive: false,
    path: '/activity',
  },
  {
    name: computed(() => {
      return t('home.APP_HEADER.DOCUMENT');
    }),
    isactive: false,
    path: '/docs',
  },
]);

const meauActive = ref(false);
function toggleMenu(menu) {
  meauActive.value = menu;
  mobilNav[3].isactive = false;
}
function toPage(path) {
  if (path === '/') {
    mobilNav[0].isactive = true;
    mobilNav[3].isactive = false;
  } else if (path === '/docs') {
    window.open('https://xihe-docs.mindspore.cn');
  } else if (path) {
    isMobileFit.value = false;
    meauActive.value = false;
    mobilNav[3].isactive = false;
    router.push(path);
  } else {
    mobilNav[0].isactive = false;
    mobilNav[3].isactive = true;
  }
}
const handleCommand = () => {
  const { pathname } = window.location;

  if (pathname === '/en') {
    window.location.href = pathname.replace('en', '');
  } else {
    window.location.href = '/en';
  }
};
</script>

<template>
  <header
    v-if="isMobileFit && screenWidth <= 820"
    ref="header"
    class="mobile-header"
    :class="
      (route.name === 'wukongExperience' ? 'wukong-header-bg' : '',
      noHeader === true ? 'no-header' : '')
    "
  >
    <div
      v-if="currentPage === '首页'"
      class="back"
      @click="toggleMenu(!meauActive)"
    >
      <OIcon><icon-menu></icon-menu></OIcon>
    </div>
    <div v-else class="back" @click="goBack">
      <OIcon><icon-back></icon-back></OIcon>
    </div>

    <img
      v-if="currentPage === '首页' && locale === 'zh'"
      :src="logoImg"
      alt=""
      @click="toPage('/')"
    />
    <img
      v-else-if="currentPage === '首页' && locale === 'en'"
      :src="logoImg2"
      alt=""
      class="en-logo"
      @click="toPage('/')"
    />
    <span v-else>{{ currentPage }}</span>
  </header>

  <header
    v-else
    ref="header"
    class="app-header"
    :class="{
      opaque: isHeaderTransparent,
      'no-header': noHeader,
      wukong1: route.path === '/modelzoo/wukong',
    }"
  >
    <app-header></app-header>
  </header>

  <main class="app-body">
    <router-view></router-view>
  </main>
  <footer
    v-if="showFooter"
    class="app-footer"
    :class="{ wukong1: route.path === '/modelzoo/wukong' }"
  >
    <app-footer></app-footer>
  </footer>
  <div class="mobile-menu" :class="{ 'menu-active': meauActive }">
    <div class="menu-side" :class="{ 'menu-active': meauActive }">
      <div class="nav">
        <div
          v-for="item in mobilNav"
          :key="item"
          class="nav-item"
          :class="{ active: item.isactive }"
        >
          <span @click="toPage(item.path)">{{ item.name }}</span>
        </div>
      </div>
      <div
        class="item-children"
        :class="{ 'children-active': mobilNav[3].isactive }"
      >
        <div v-for="item in mobilNav[3].children" :key="item" class="nav-item">
          <span @click="toPage(item.path)">{{ item.name }}</span>
        </div>
      </div>
      <div class="language" @click="handleCommand">中文 ｜ EN</div>
    </div>
  </div>
</template>

<style lang="scss">
// 移动端
.mobile-fit {
  min-width: auto;
  width: 100vw;

  #app {
    min-width: auto;
    // width: 100vw;
  }

  .app-header,
  .app-body,
  .app-footer {
    min-width: auto;
    // width: 100vw;
  }

  .mobile-header {
    display: none;
    @media screen and (max-width: 820px) {
      display: flex;
    }
    position: fixed;
    // z-index: 2014;
    z-index: 2009;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-right: 16px;
    background: rgb(255, 255, 255);
    box-shadow: 0 3px 8px #0000000d;
    backdrop-filter: blur(5px);
    font-size: 16px;
    color: #000;
    height: 48px;
    .back {
      position: absolute;
      height: 100%;
      display: flex;
      align-items: center;
      left: 0px;
      padding: 0 8px 0 16px;
      font-size: 24px;
      color: #000;
    }
    img {
      width: 74px;
    }
    .en-logo {
      width: auto;
      height: 40px;
    }
  }
  .wukong-header-bg {
    background: #060c29;
    color: #fff;
    .back {
      color: #ffffff;
    }
  }
  .app-footer {
    @media screen and (max-width: 1080px) {
      .footer {
        flex-direction: column-reverse;
        height: 170px;
        justify-content: space-evenly;
      }
      .footer-code {
        img {
          width: 55px;
          height: 55px;
        }
        p {
          font-size: 8px;
          line-height: 12px;
        }
      }
      .footer-logo {
        display: none;
      }
      .footer-content {
        position: static;
        transform: none;
        margin-top: 16px;
        .above {
          font-size: 12px;
          color: #ffffff;
          line-height: 26px;
          width: 180px;
          .division {
            margin: 2px 8px 0;
          }
        }
        .below {
          margin-top: 8px;
          font-size: 9px;
          color: #ffffff;
          color: #000;
          line-height: 12px;
        }
      }
    }
  }
  .app-body {
    @media screen and (max-width: 1080px) {
      min-height: calc(100vh - 170px);
    }
  }
}

// 处理开启弹窗页面闪动
body {
  width: 100% !important;
  padding-right: 0px !important;
}
body.el-popup-parent--hidden {
  overflow: auto !important;
}

#app {
  min-width: 1280px;
}
.app-header {
  position: fixed;
  z-index: 1000;
  height: 80px;
  left: 0;
  top: 0;
  right: 0;
  // background-color: rgba(6, 11, 41, 0.85);
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(5px);
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
  min-width: 1280px;
  transition: all 0.5s;
}
.no-header {
  top: -80px;
}

.opaque {
  z-index: 100;
  // background-color: rgba(6, 11, 41, 1);
  background: rgba(255, 255, 255, 0.5);
}

.app-body {
  min-width: 1280px;
  min-height: calc(100vh - 200px);
  background: #f5f6f8;
}

.app-footer {
  min-width: 1280px;
  // background-color: #18191d;
  background-color: #f5f7fc;
  background-image: url(@/assets/imgs/footer-bg1.png);
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.wukong1 {
  // background: rgba(6, 11, 41, 0.85);
  .header-content {
    .el-menu {
      .el-menu-item {
        color: #fff;
      }
      .el-sub-menu {
        .el-sub-menu__title {
          color: #fff !important;
        }
      }
    }
    .header-right {
      .header-search {
        .header-right-input {
          border: 1px #999 solid !important;
        }
        .o-icon {
          color: #979797;
        }
      }
    }
    .header-center {
      .header-input {
        .search-icon {
          color: #979797;
        }
        .search-input {
          border-bottom: 1px solid #999;
        }
        .empty-icon {
          color: #979797;
        }
      }
    }
    .header-right .header-tool .user-login-icon {
      color: #fff;
    }
  }
  .footer-content {
    .above {
      .text {
        color: #fff;
      }
      .division {
        background: #fff;
      }
    }
    .below {
      color: #fff !important;
    }
  }
  background: #060b29;
  .header-menu {
    color: #fff;
  }
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.5s cubic-bezier(0.5, 0.05, 0.5, 0.95);
}

.slide-enter-from {
  position: absolute;
  top: -100%;
}

.slide-enter-to {
  position: absolute;
  top: 0;
}

.slide-leave-from {
  position: absolute;
  top: 0;
}

.slide-leave-to {
  position: absolute;
  top: 100%;
}

.app-questionnaire {
  position: fixed;
  z-index: 1;
  bottom: 16px;
  left: 16px;
  .tip-content {
    position: relative;
    margin-right: 16px;
    .tip-img {
      max-width: 200px;
      object-fit: fill;
      cursor: pointer;
    }
    .tip-btn {
      position: absolute;
      right: 2px;
      top: 0;
      max-width: 17px;
      cursor: pointer;
    }
  }
}

.dlg-title {
  text-align: center;
  font-size: 24px;
  font-weight: normal;
  color: #000000;
  line-height: 32px;
}

.dlg-content {
  font-size: 14px;
  font-weight: normal;
  color: #555555;
  line-height: 22px;
  a {
    color: #0d8dff;
  }
  span {
    font-weight: 600;
  }
}
.mobile-menu {
  background: rgba(0, 0, 0, 0.4);
  position: fixed;
  width: 100%;
  left: 0;
  top: 48px;
  height: calc(100% - 48px);
  z-index: 201;
  visibility: hidden;
  display: none;
  @media screen and (max-width: 820px) {
    display: block;
  }
  .menu-side {
    height: 100%;
    display: inline-block;
    background-color: rgba(255, 255, 255, 0.9);
    transition: all 0.3s linear;
    overflow-y: auto;
    width: 164px;
    position: relative;
    left: -100%;
    .nav {
    }
    .nav-item {
      font-size: 12px;
      line-height: 18px;
      padding-left: 16px;
      min-width: 164px;
      span {
        border-bottom: 2px solid rgba(0, 0, 0, 0);
      }
    }
    span {
      display: inline-block;
      padding: 15px 16px;
      padding-left: 0;
    }
    .active {
      background-color: #ffffff;
      span {
        border-bottom: 2px solid #40adff;
      }
    }
    .item-children {
      width: 100%;
      height: 100%;
      background-color: #fff;
      position: fixed;
      top: 48px;
      left: -100%;
      // left: 164px;
    }
    .children-active {
      left: 164px;
    }
  }
  .language {
    font-size: 12px;
    margin-left: 16px;
    position: fixed;
    bottom: 35px;
    cursor: pointer;
  }
}
.menu-active {
  visibility: visible;
  width: 0;
  .menu-side {
    left: 0;
  }
}
</style>
