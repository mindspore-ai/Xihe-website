import { createI18n } from 'vue-i18n';

import home from './home';
import modelzoo from './modelzoo';

const messages = {
  zh: { home: home.zh, modelzoo: modelzoo.zh },
  en: { home: home.en, modelzoo: modelzoo.en },
};

const i18n = createI18n({
  globalInjection: true,
  locale: 'zh',
  legacy: false,
  messages,
});

export default i18n;
