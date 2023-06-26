import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import { router } from './routers';

import i18n from './i18n';

import hljs from 'highlight.js';
import 'highlight.js/styles/dark.css';
import 'element-plus/theme-chalk/el-loading.css';
import '@/shared/styles/base.scss';
import '@/shared/styles/editor.scss';
import '@/shared/styles/o-theme/index.scss';

import Pagination from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
// import enLocale from 'element-plus/es/locale/lang/en';
import OIcon from '@/components/OIcon.vue';
import OAlert from '@/components/hooks/useAlert';
import VueDOMPurifyHTML from 'vue-dompurify-html';

const app = createApp(App);

app.directive('highlight', (el) => {
  hljs.configure({
    useBR: true,
    // 需要加防范XSS注入攻击
    ignoreUnescapedHTML: true,
  });
  let blocks = el.querySelectorAll('pre code');
  blocks.forEach((block) => {
    hljs.highlightElement(block);
  });
});

app.use(i18n);
app.use(Pagination, {
  locale: zhCn,
});
app.use(createPinia());
app.use(router);
app.use(VueDOMPurifyHTML); // 防止v-html进行xss注入

app.provide('message', OAlert);
app.component('OIcon', OIcon);
app.mount('#app');
