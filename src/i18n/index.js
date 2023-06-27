import { createI18n } from 'vue-i18n';

import home from './home';
import modelzoo from './modelzoo';
import wukong from './modelzoo/wukong';
import taichu from './modelzoo/taichu';
import luojia from './modelzoo/luojia';
import shennong from './modelzoo/shennong';
import mindcon from './activity/mindcon';
import electricity from './estate/electricity';
import system from './estate/electricity/computer-vision/intelligentsystem';
import substation from './estate/electricity/computer-vision/substationhost';
import substationops from './estate/electricity/computer-vision/substationops';
import naturalLang from './estate/electricity/naturalLanguage';
import laborcontract from './estate/electricity/naturalLanguage/laborcontract';
import intelligent from './estate/electricity/nature-network/intelligentsystem';
import medicine from './estate/medicine';
import diagnosis from './estate/medicine/diagnosis';
import truesight from './estate/medicine/truesight';
import humanity from './estate/humanity';
import aigc from './estate/humanity/aigc';
import sign from './estate/humanity/sign';
import yuzhi from './estate/humanity/yuzhi';
import industry from './estate/industry';
import algorithm from './estate/industry/algorithm';
import intelligence from './estate/industry/intelligence';
import metalpart from './estate/industry/metalpart';

const messages = {
  zh: {
    home: home.zh,
    modelzoo: modelzoo.zh,
    wukong: wukong.zh,
    taichu: taichu.zh,
    luojia: luojia.zh,
    shennong: shennong.zh,
    mindcon: mindcon.zh,
    electricity: electricity.zh,
    system: system.zh,
    substation: substation.zh,
    substationops: substationops.zh,
    naturalLang: naturalLang.zh,
    laborcontract: laborcontract.zh,
    intelligent: intelligent.zh,
    medicine: medicine.zh,
    diagnosis: diagnosis.zh,
    truesight: truesight.zh,
    humanity: humanity.zh,
    aigc: aigc.zh,
    sign: sign.zh,
    yuzhi: yuzhi.zh,
    industry: industry.zh,
    algorithm: algorithm.zh,
    intelligence: intelligence.zh,
    metalpart: metalpart.zh,
  },
  en: {
    home: home.en,
    modelzoo: modelzoo.en,
    wukong: wukong.en,
    taichu: taichu.en,
    luojia: luojia.en,
    shennong: shennong.en,
    mindcon: mindcon.en,
    electricity: electricity.en,
    system: system.en,
    substation: substation.en,
    substationops: substationops.en,
    naturalLang: naturalLang.en,
    laborcontract: laborcontract.en,
    intelligent: intelligent.en,
    medicine: medicine.en,
    diagnosis: diagnosis.en,
    truesight: truesight.en,
    humanity: humanity.en,
    aigc: aigc.en,
    sign: sign.en,
    yuzhi: yuzhi.en,
    industry: industry.en,
    algorithm: algorithm.en,
    intelligence: intelligence.en,
    metalpart: metalpart.en,
  },
};

const i18n = createI18n({
  globalInjection: true,
  locale: 'zh',
  legacy: false,
  messages,
});

export default i18n;
