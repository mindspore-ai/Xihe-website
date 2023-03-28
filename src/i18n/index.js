import { createI18n } from 'vue-i18n';

import home from './home';

const messages = {
  zh: { home: home.zh },
  en: { home: home.en },
};

const i18n = createI18n({
  globalInjection: true,
  locale: 'zh',
  legacy: false,
  messages,
});

export default i18n;
