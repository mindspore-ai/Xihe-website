import modelzoo_taichu from '@/assets/imgs/home1/modelzoo1.jpg';
import modelzoo_wukong from '@/assets/imgs/home1/modelzoo2.jpg';
import modelzoo_luojia from '@/assets/imgs/home1/modelzoo3.jpg';
// import modelzoo_pangu from '@/assets/imgs/home1/modelzoo_pangu.jpg';

import models1 from '@/assets/imgs/home1/models1.png';
import models2 from '@/assets/imgs/home1/models2.png';
import models3 from '@/assets/imgs/home1/models3.png';
import models4 from '@/assets/imgs/home1/models4.png';

import industy1 from '@/assets/imgs/home1/industy/industy1.png';
import industy2 from '@/assets/imgs/home1/industy/industy2.png';
import industy3 from '@/assets/imgs/home1/industy/industy3.png';
import industy4 from '@/assets/imgs/home1/industy/industy4.png';

import open1 from '@/assets/imgs/home1/open/open1.png';
import open2 from '@/assets/imgs/home1/open/open2.png';
import open3 from '@/assets/imgs/home1/open/open3.png';

import card1 from '@/assets/imgs/home1/more/more_card1.jpg';
import card2 from '@/assets/imgs/home1/more/more_card2.jpg';
import card3 from '@/assets/imgs/home1/more/more_card3.jpg';

import competition1 from '@/assets/imgs/home1/more/competition1.png';
import competition2 from '@/assets/imgs/home1/more/competition2.png';
import competition3 from '@/assets/imgs/home1/more/competition3.png';

import activity1 from '@/assets/imgs/home1/more/activity1.png';
import activity2 from '@/assets/imgs/home1/more/activity2.png';
import activity3 from '@/assets/imgs/home1/more/activity3.png';
export default {
  APP_HEADER: {
    HOME: '首页',
    PROJECT: 'AI实验室',
    MODEL: '模型库',
    MODELZOO: '大模型',
    EXPERENCE: '在线体验',
    FINE_TUNING: '模型微调',
    DATASET: '数据集',
    COURSE: '课程',
    COMPETITION: '比赛',
    ACTIVITY: '活动',
    DOCUMENT: '文档',
    ESTATE: '产业',
    Electric_Power: '电力专区',
    HEALTHCARE: '医疗专区',
    INDUSTRY: '工业专区',
    HUMAN_CULTURE: '人文专区',
  },
  SCANNING_CODE: '扫码关注公众号',
  PRIVACY_POLICY: '隐私政策',
  LEGAL_NOTICE: '法律声明',
  COPYRIGHT: '版权所有',
  OWNERSHIP: '保留一切权利',
  LANG: 'En',
  BANNER_BUTTON_1: '昇思大模型平台',
  BANNER_BUTTON_2: 'AI画家大赛',
  BANNER_BUTTON_3: '昇思3周年',
  // 轮播
  SWIPER: [
    {
      TITLE: '昇思大模型平台',
      INTRODUCE:
        '昇思大模型平台是集算法选型、创意分享、模型实验和大模型在线体验为一体的AI学习与实践社区，提供超强Ascend算力、免费课程资源、经典样例代码、企业落地案例和多层级挑战赛，欢迎广大开发者注册试用。',
    },
    {},
  ],
  // AI实验室
  AI_LAB: {
    TITLE: 'AI实验室',
    INTRODUCE:
      '覆盖多领域任务，体验全流程开发，支持用户在线训练和推理可视化，感受用户的创新创意实践',
    CARDS: [
      {
        NAME: '手写数字体识别',
        TYPE: 'CV',
        PATH: '/projects/MindSpore/lenet5/train',
      },
      {
        NAME: '艺术家画作风格迁移',
        TYPE: 'CV',
        PATH: '/projects/MindSpore/CycleGAN/train',
      },
      {
        NAME: '图像分类',
        TYPE: 'CV',
        PATH: '/projects/MindSpore/vit_image_classification/train',
      },
      {
        NAME: '情感分析',
        TYPE: 'NLP',
        PATH: '/projects/MindSpore/LSTM/train',
      },
      {
        NAME: '序列标注',
        TYPE: 'NLP',
        PATH: '/projects/MindSpore/token_classification/train',
      },
      {
        NAME: '文本分类',
        TYPE: 'NLP',
        PATH: '/projects/MindSpore/text_classification/train',
      },
    ],
  },
  // 大模型体验
  MODELZOO: {
    TITLE: '大模型',
    INTRODUCE:
      '覆盖NLP和CV等场景。面向语言理解、语言生成，具有超强语言理解能力以及对话生成；可实现跨模态检索、图文生成、图片文档的信息提取等应用；可实现对遥感数据的目标检测等',
    EXPERENCE: '在线体验',
    INTRODUCTION: '查看介绍',
    CARDS: [
      {
        MODELZOO_NAME: '悟空.画画',
        MODELZOO_DESC: '业界首个基于扩散模型的中文文生图大模型',
        IMAGE: modelzoo_wukong,
        PATH: '/modelzoo/wukong',
        INTRO: '/modelzoo/wukong/introduce',
      },
      {
        MODELZOO_NAME: '紫东.太初',
        MODELZOO_DESC: '全球首个三模态千亿参数大模型',
        IMAGE: modelzoo_taichu,
        PATH: '/modelzoo/taichu',
        INTRO: '/modelzoo/taichu/introduce',
      },
      {
        MODELZOO_NAME: '武大.LuoJia',
        MODELZOO_DESC: '全球首个遥感专用框架及最大遥感样本库',
        IMAGE: modelzoo_luojia,
        PATH: '/modelzoo/luojia',
        INTRO: '/modelzoo/luojia/introduce',
      },
      // {
      //   MODELZOO_NAME: '鹏程.盘古',
      //   MODELZOO_DESC: '业界首个千亿级参数中文自然语言处理大模型',
      //   IMAGE: modelzoo_pangu,
      //   PATH: '/modelzoo/pangu',
      // },
    ],
  },
  // 模型库
  MODEL: {
    TITLE: '模型库',
    INTRODUCE:
      '覆盖全领域主流模型，可体验MindSpore大模型推理API，用户既可下载公开的预训练模型，也可以上传自行训练的模型文件，同时平台提供GITLAB一站式代码托管，支持文件批量上传，支持LFS大文件管理',
    // MORE: '探索更多模型',
    CARDS: [
      {
        MODEL_NAME: '图像分类',
        TYPE: 'CV',
        CATAGORIES: 'VGG16｜ResNet-101｜InceptionV4 …',
        HREF: 'https://xihe.mindspore.cn/models/MindSpore/vgg16_cifar10',
        IMAGE: models1,
        PATH: '/models/MindSpore/vgg16_imagenet2012',
      },
      {
        MODEL_NAME: '目标检测',
        TYPE: 'CV',
        CATAGORIES: 'YOLOv5｜SSD ｜MobileNet …',
        HREF: 'https://xihe.mindspore.cn/models/MindSpore/yolov5shape640',
        IMAGE: models2,
        PATH: '/models/MindSpore/yolov5shape640',
      },
      {
        MODEL_NAME: '自然语言处理',
        TYPE: 'NLP',
        CATAGORIES: 'BERT｜GRU｜Transformer …',
        HREF: 'https://xihe.mindspore.cn/models/MindSpore/bertbase_cnnews128',
        IMAGE: models3,
        PATH: '/models/MindSpore/tokcls_bert_base_chineses_cluener',
      },
      {
        MODEL_NAME: '语音',
        TYPE: 'Audio',
        CATAGORIES: 'ECAPA-TDNN｜LPCNet｜MelGan …',
        HREF: 'https://xihe.mindspore.cn/models/MindSpore/deepfm_criteo',
        IMAGE: models4,
        PATH: '/models/MindSpore/deepfm_criteo',
      },
    ],
  },
  // 精选画廊
  GALLARY: {
    TITLE: '精选画廊',
    INTRODUCE:
      '进入精选画廊体验中文文图生成模型-悟空画画模型进行创作；您就可以通过文字生成多样风格的图片，带你寻找生活中的灵感',
    GALLARY_BUTTON: '开始画画',
    PAINTINGS_BUTTON: '全部画集',
    PATH: '/modelzoo/wukong',
    PATH1: '/modelzoo/wukong/album',
  },
  // 开启昇思之旅
  SHENGSI_JOURNEY: {
    TITLE: '开启昇思之旅',
    INTRODUCE: '从入门到高阶，从理论到实践，助力开发者快速掌握AI知识',
    CHECK_DETAIL: '查看详情',
    CHECK_MORE: '查看更多',
    TABLISTS: [
      {
        TAB_TITLE: '课程',
        IMAGE: open1,
        CARDS: [
          {
            NAME: '',
            DESC: '昇思 MindSpore AI 框架原生支持大模型训练是发展大模型的关键，国内多个科研机构基于MindSpore打造了一系列大模型。同时，昇思MindSpore推出一站式大模型平台，将大模型能力开放给开发者，让你我皆可触碰大模型的魅力。',
            IMAGE: card1,
            // TYPE: '免费',
            DETAIL: '了解详情',
            PATH: '/course/c001/introduction',
          },
          {
            NAME: '',
            DESC: '计算机视觉（Computer Vision）作为人工智能的一个重要的领域，主要是开发赋予计算机视觉能力的技术。本课程基于昇思MindSpore，采用理论与实践相结合的方法带你轻松入门。',
            IMAGE: card2,
            // TYPE: '免费',
            DETAIL: '了解详情',
            PATH: '/course/c002/introduction',
          },
          {
            NAME: '',
            DESC: '本课程使用原理讲解加实战的方式学习神经网络模型，掌握算法调参和使用昇思MindSpore编程的能力。',
            IMAGE: card3,
            // TYPE: '免费',
            DETAIL: '了解详情',
            PATH: '/course/c003/introduction',
          },
        ],
      },
      {
        TAB_TITLE: '比赛',
        IMAGE: open2,
        CARDS: [
          {
            NAME: '',
            DESC: '一封通往艺术殿堂的邀请函，万元奖金邀您参与AI艺术创作，象牙之塔-AI画家大赛于2023年3月正式开启，面向全球AI开发者，赛题与扩散模型（Diffusion Model）紧密结合。大赛旨在为开发者提供一个学习昇思MindSpore和Diffusion Models的机会。',
            IMAGE: competition1,
            TYPE: '',
            DETAIL: '了解详情',
            PATH: '/competition/ai_painter/0/introduction',
          },
          {
            NAME: '',
            DESC: '昇思MindSpore是一个全场景深度学习框架,旨在实现易开发、高效执行、全场景覆盖三大目标。 昇思AI挑战赛于2022年9月正式开启,面向全球AI开发者,赛题涵盖AI基础领域。挑战赛旨在为开发者提供一个学习MindSpore和锻炼算法能力的机会。 图像分类是计算机视觉中最基础的任务,目前图像分类的算法仍然在飞速发展。本赛题旨在让参赛者熟悉MindSpore并锻炼参赛者使用MindSpore进行图像分类预处理、图像分类的能力。',
            IMAGE: competition2,
            TYPE: '',
            DETAIL: '了解详情',
            PATH: '/competition/3/0/introduction',
          },
          {
            NAME: '',
            DESC: '昇思MindSpore是一个全场景深度学习框架,旨在实现易开发、高效执行、全场景覆盖三大目标。 昇思AI挑战赛于2022年9月正式开启,面向全球AI开发者,赛题涵盖AI基础领域。挑战赛旨在为开发者提供一个学习MindSpore和锻炼算法能力的机会。 它研究能实现人与计算机之间用自然语言进行有效通信的各种理论和方法。文本分类在AI领域承担了重要角色。本赛题旨在让参赛者熟悉MindSpore并锻炼参赛者使用MindSpore进行NLP的文本处理、文本分类的能力。',
            IMAGE: competition3,
            TYPE: '',
            DETAIL: '了解详情',
            PATH: '/competition/2/0/introduction',
          },
        ],
      },
      {
        TAB_TITLE: '活动',
        IMAGE: open3,
        CARDS: [
          {
            NAME: '',
            DESC: 'MindCon极客周是昇思MindSpore每半年举办一次的开发者狂欢盛会，旨在引领兴趣者们走入AI探索的世界。第四届MindCon极客周以超级挑战赛为主题，发布多领域多级别应用场景的挑战任务，与开发者共同探索AI开源趣味世界。邀请各领域大咖分享前沿技术，感受前沿AI技术。还有丰厚挑战赛礼品与昇思官方证书欢迎你来战！本赛题旨在让参赛者熟悉MindSpore并锻炼参赛者使用MindSpore进行西安旅游主题图像分类的能力。',
            IMAGE: activity1,
            TYPE: '',
            DETAIL: '了解详情',
            PATH: '/competition/xian_travel/0/introduction',
          },
          {
            NAME: '',
            DESC: 'MindCon极客周是昇思MindSpore每半年举办一次的开发者狂欢盛会，旨在引领兴趣者们走入AI探索的世界。第四届MindCon极客周以超级挑战赛为主题，发布多领域多级别应用场景的挑战任务，与开发者共同探索AI开源趣味世界。邀请各领域大咖分享前沿技术，感受前沿AI技术。还有丰厚挑战赛礼品与昇思官方证书欢迎你来战！本赛题旨在让参赛者熟悉MindSpore并锻炼参赛者使用MindSpore进行外卖文本分类的能力。',
            IMAGE: activity2,
            TYPE: '',
            DETAIL: '了解详情',
            PATH: '/competition/text_classification/0/introduction',
          },
          {
            NAME: '',
            DESC: 'MindCon极客周是昇思MindSpore每半年举办一次的开发者狂欢盛会，旨在引领兴趣者们走入AI探索的世界。第四届MindCon极客周以超级挑战赛为主题，发布多领域多级别应用场景的挑战任务，与开发者共同探索AI开源趣味世界。邀请各领域大咖分享前沿技术，感受前沿AI技术。还有丰厚挑战赛礼品与昇思官方证书欢迎你来战！本赛题旨在让参赛者熟悉MindSpore并锻炼参赛者使用MindSpore进行图像口罩检测的能力。',
            IMAGE: activity3,
            TYPE: '',
            DETAIL: '了解详情',
            PATH: '/competition/mask_detection/0/introduction',
          },
        ],
      },
    ],
  },
  // 产业
  INDUSTRY: {
    TITLE: '产业',
    INTRODUCE:
      '涵盖了多领域落地的相关应用；包括对相关应用的问题定位、方案设计、数据处理、模型训练部署及思路的优化；提供了全流程零门槛入门的指导，沉淀了丰富的行业领域知识助力行业快速发展',
    CARDS: [
      {
        NAME: '电力',
        DESC: '通过训练电力数据集构建AI模型，实现对电力数据的预测，可以预测电力波动，辅助企业能源管理、能源调度等',
        IMAGE: industy2,
        PATH: '/electricity',
      },
      {
        NAME: '工业',
        DESC: '通过训练物体检测构建AI模型，实现对工业物体的智能识别，广泛应用于工业检测、智能制造等',
        IMAGE: industy1,
        PATH: '/industry',
      },

      {
        NAME: '医疗',
        DESC: '通过对医疗数据的探索构建AI模型，实现对医疗大数据的分析，广泛应用于临床决策、医学研究等',
        IMAGE: industy3,
        STATUS: '',
        PATH: '/medicine',
      },
      {
        NAME: '人文',
        DESC: '通过训练人文相关的图文数据集构建AI模型，实现推荐搜索，生成符合大众审美的创新性国潮内容，广泛应用于视频推荐、建模设计辅助等领域',
        IMAGE: industy4,
        STATUS: '',
        PATH: '/humanity',
      },
    ],
  },
  PARTNER: {
    TITLE: '合作伙伴',
  },
};
