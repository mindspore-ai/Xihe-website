import { createI18n } from 'vue-i18n';

import home from './home';
import modelzoo from './modelzoo';
import wukong from './modelzoo/wukong';
import taichu from './modelzoo/taichu';
import luojia from './modelzoo/luojia';
import shennong from './modelzoo/shennong';
import mindcon from './activity/mindcon';

const messages = {
  zh: {
    home: home.zh,
    modelzoo: modelzoo.zh,
    wukong: wukong.zh,
    taichu: taichu.zh,
    luojia: luojia.zh,
    shennong: shennong.zh,
    mindcon: mindcon.zh,
  },
  en: {
    home: home.en,
    modelzoo: modelzoo.en,
    wukong: wukong.en,
    taichu: taichu.en,
    luojia: luojia.en,
    shennong: shennong.en,
    mindcon: mindcon.en,
  },
};

const i18n = createI18n({
  globalInjection: true,
  locale: 'zh',
  legacy: false,
  messages,
});

export default i18n;
