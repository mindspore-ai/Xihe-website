import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import { router } from './router';

import '@authing/native-js-ui-components/lib/index.min.css';
import hljs from 'highlight.js';
import 'highlight.js/styles/dark.css';
import 'element-plus/theme-chalk/el-loading.css';
import '@/shared/styles/base.scss';
import '@/shared/styles/editor.scss';
import '@/shared/styles/o-theme/index.scss';

import Pagination from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import OIcon from '@/components/OIcon.vue';
import OAlert from '@/components/hooks/useAlert';

const app = createApp(App);

app.directive('highlight', (el) => {
  hljs.configure({ useBR: true });
  let blocks = el.querySelectorAll('pre code');
  blocks.forEach((block) => {
    hljs.highlightElement(block);
  });
});

app.use(Pagination, {
  locale: zhCn,
});
app.use(createPinia());
app.use(router);

app.provide('message', OAlert);
app.component('OIcon', OIcon);
app.mount('#app');
