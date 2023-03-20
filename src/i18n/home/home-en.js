import modelzoo_taichu from '@/assets/imgs/home1/modelzoo1.jpg';
import modelzoo_wukong from '@/assets/imgs/home1/modelzoo2.jpg';
import modelzoo_luojia from '@/assets/imgs/home1/modelzoo3.jpg';
import modelzoo_pangu from '@/assets/imgs/home1/modelzoo_pangu.jpg';

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

import card1 from '@/assets/imgs/home1/more/more_card1.png';
import card2 from '@/assets/imgs/home1/more/more_card2.png';
import card3 from '@/assets/imgs/home1/more/more_card3.png';

import competition1 from '@/assets/imgs/home1/more/competition1.png';
import competition2 from '@/assets/imgs/home1/more/competition2.png';
import competition3 from '@/assets/imgs/home1/more/competition3.png';

import activity1 from '@/assets/imgs/home1/more/activity1.png';
import activity2 from '@/assets/imgs/home1/more/activity2.png';
import activity3 from '@/assets/imgs/home1/more/activity3.png';
export default {
  APP_HEADER: {
    PROJECT: 'AI Lab',
    MODEL: 'Model Library',
    MODELZOO: 'Foundation Models',
    DATASET: 'Datasets',
    COURSE: 'Courses',
    COMPETITION: 'Competitions',
    ACTIVITY: 'Activities',
    DOCUMENT: 'Documents',
    INDUSTRY: 'Industry',
  },
  SCANNING_CODE: 'Public Account',
  PRIVACY_POLICY: 'Privacy Policy',
  LEGAL_NOTICE: 'Terms of Use',
  COPYRIGHT: 'Copyright',
  OWNERSHIP: 'All Rights Reserved',
  LANG: 'English',
  BANNER_BUTTON_1: 'The MindSpore foundation model platform',
  BANNER_BUTTON_2: 'AI Challenges',
  BANNER_BUTTON_3: 'AI Learning Competition',
  // 轮播
  SWIPER: [
    {
      TITLE: 'The MindSpore foundation model platform',
      INTRODUCE:
        "The MindSpore foundation model platform is an AI learning and practice community that integrates model selection, ideas sharing, and online experience. The community provides the ultimate Ascend computing power you need for practice. You can experience foundation models and gain knowledge and experience through practice. The community also offers free, high-quality resources, typical and easy-to-use sample code, and successful enterprise cases and hosts AI competitions suitable for different skill levels. You're welcome to try our advanced challenges.",
    },
    {},
  ],
  // AI实验室
  AI_LAB: {
    TITLE: 'AI Lab',
    INTRODUCE:
      'Perform full-process development in multiple domains, experience inference visualization, and get trained online.',
    CARDS: [
      { NAME: 'Multi-class Image Classification', TYPE: 'CV' },
      { NAME: 'Image Recognition', TYPE: 'CV' },
      { NAME: 'Style Migration', TYPE: 'CV' },
      { NAME: 'Text Classification', TYPE: 'NLP' },
      { NAME: 'Sequence Labeling', TYPE: 'NLP' },
      { NAME: 'Text Translation', TYPE: 'NLP' },
    ],
  },
  // 大模型体验
  MODELZOO: {
    TITLE: 'Foundation Model Experience',
    INTRODUCE:
      'Use powerful language understanding and dialog generation capabilities in NLP and CV scenarios. You can implement applications such as cross-modal retrieval, text-to-image generation, and image information extraction. You can also detect targets in remote sensing data.',
    // QUCIK_START: '立即体验',
    CARDS: [
      {
        MODELZOO_NAME: 'Zidong.Taichu',
        MODELZOO_DESC:
          "The world's first three-modal 100-billion-parameter model",
        IMAGE: modelzoo_taichu,
      },
      {
        MODELZOO_NAME: 'Wukong-Huahua',
        MODELZOO_DESC:
          "Industry's first Chinese text-to-image foundation model based on the diffusion model",
        IMAGE: modelzoo_wukong,
      },
      {
        MODELZOO_NAME: 'LuoJiaNET',
        MODELZOO_DESC:
          "The world's first dedicated remote sensing framework and the largest remote sensing sample library",
        IMAGE: modelzoo_luojia,
      },
      {
        MODELZOO_NAME: 'PCL-L',
        MODELZOO_DESC:
          " Industry's first 100-billion-parameter Chinese NLP model",
        IMAGE: modelzoo_pangu,
      },
    ],
  },
  // 模型库
  MODEL: {
    TITLE: 'Model Library',
    INTRODUCE:
      "Use mainstream models in all domains and experience MindSpore foundation model inference APIs. You can download public pre-trained models or upload self-trained model files. In addition, you can take advantage of GitLab's one-stop code hosting and large file storage (LFS), and upload files in batches.",
    // MORE: '探索更多模型',
    CARDS: [
      {
        MODEL_NAME: 'Image Classification',
        TYPE: 'CV',
        CATAGORIES: 'VGG16｜ResNet-101｜InceptionV4 …',
        HREF: 'https://xihe.mindspore.cn/models/MindSpore/vgg16_cifar10',
        IMAGE: models1,
      },
      {
        MODEL_NAME: 'Object Detection',
        TYPE: 'CV',
        CATAGORIES: 'YOLOv5｜SSD ｜MobileNet …',
        HREF: 'https://xihe.mindspore.cn/models/MindSpore/yolov5shape640',
        IMAGE: models2,
      },
      {
        MODEL_NAME: 'NLP',
        TYPE: 'NLP',
        CATAGORIES: 'BERT｜GRU｜Transformer …',
        HREF: 'https://xihe.mindspore.cn/models/MindSpore/bertbase_cnnews128',
        IMAGE: models3,
      },
      {
        MODEL_NAME: 'Recommendation',
        TYPE: 'Recommendation',
        CATAGORIES: 'DeepFM｜Wide&Deep｜NCF …',
        HREF: 'https://xihe.mindspore.cn/models/MindSpore/deepfm_criteo',
        IMAGE: models4,
      },
    ],
  },
  // 精选画廊
  GALLARY: {
    TITLE: 'Featured Gallery',
    INTRODUCE:
      'Experience the Chinese text-to-image generative model: Wukong-Huahua. You can generate inspiring images of various styles through text.',
    GALLARY_BUTTON: 'Start Drawing',
  },
  // 开启昇思之旅
  SHENGSI_JOURNEY: {
    TITLE: 'Your MindSpore Journey',
    INTRODUCE:
      'Quickly master AI knowledge from the entry-level to the advanced level and put theory into practice.',
    CHECK_DETAIL: 'View Details',
    CHECK_MORE: 'View More',

    TABLISTS: [
      {
        TAB_TITLE: 'Courses',
        IMAGE: open1,
        CARDS: [
          {
            NAME: 'Foundation Models',
            DESC: '昇思 MindSpore AI 框架原生支持大模型训练是发展大模型的关键，国内多个科研机构基于MindSpore打造了一系列大模型，…',
            IMAGE: card1,
            TYPE: '免费',
            DETAIL: 'View Details',
          },
          {
            NAME: 'Vision',
            DESC: '计算机视觉（Computer Vision）作为人工智能的一个重要的领域，主要是开发赋予计算机视觉能力的技术。本课程基于昇思…',
            IMAGE: card2,
            TYPE: '免费',
            DETAIL: 'View Details',
          },
          {
            NAME: 'Get Started',
            DESC: '本课程使用原理讲解加实战的方式学习神经网络模型，掌握算法调参和使用昇思MindSpore编程的能力。',
            IMAGE: card3,
            TYPE: '免费',
            DETAIL: 'View Details',
          },
        ],
      },
      {
        TAB_TITLE: 'Competitions',
        IMAGE: open2,
        CARDS: [
          {
            NAME: '',
            DESC: '一封通往艺术殿堂的邀请函，万元奖金邀您参与AI艺术创作，象牙之塔-AI画家大赛于2023年3月正式开启，面向全球AI开发者，…',
            IMAGE: competition1,
            TYPE: '',
            DETAIL: 'View Details',
          },
          {
            NAME: '',
            DESC: '昇思MindSpore是一个全场景深度学习框架,旨在实现易开发、高效执行、全场景覆盖三大目标。 昇思AI挑战赛于2022年9月正…',
            IMAGE: competition2,
            TYPE: '',
            DETAIL: 'View Details',
          },
          {
            NAME: '',
            DESC: '昇思MindSpore是一个全场景深度学习框架,旨在实现易开发、高效执行、全场景覆盖三大目标。 昇思AI挑战赛于2022年9月正…',
            IMAGE: competition3,
            TYPE: '',
            DETAIL: 'View Details',
          },
        ],
      },
      {
        TAB_TITLE: 'Activities',
        IMAGE: open3,
        CARDS: [
          {
            NAME: '',
            DESC: 'MindCon极客周是昇思MindSpore每半年举办一次的开发者狂欢盛会，旨在引领兴趣者们走入AI探索的世界。第四届MindCon极…',
            IMAGE: activity1,
            TYPE: '',
            DETAIL: 'View Details',
          },
          {
            NAME: '',
            DESC: '昇思MindSpore是一个全场景深度学习框架,旨在实现易开发、高效执行、全场景覆盖三大目标。 昇思AI挑战赛于2022年9月正…',
            IMAGE: activity2,
            TYPE: '',
            DETAIL: 'View Details',
          },
          {
            NAME: '',
            DESC: '昇思MindSpore是一个全场景深度学习框架,旨在实现易开发、高效执行、全场景覆盖三大目标。 昇思AI挑战赛于2022年9月正…',
            IMAGE: activity3,
            TYPE: '',
            DETAIL: 'View Details',
          },
        ],
      },
    ],
  },
  // 产业
  INDUSTRY: {
    TITLE: 'Industry',
    INTRODUCE:
      'Experience applications used in multiple scenarios, including problem locating, solution design, data processing, model training and deployment, and idea optimization; gain full-process guidance and accumulate industry knowledge to contribute to industry development.',
    CARDS: [
      {
        NAME: 'Industry',
        DESC: 'Build AI models by training object detection data to intelligently identify industrial objects widely used in industrial detection and smart manufacturing.',
        IMAGE: industy1,
      },
      {
        NAME: 'Electric Power',
        DESC: 'Build AI models by training electric power data to predict electric power data and fluctuation and assist enterprises in energy management and scheduling.',
        IMAGE: industy2,
      },
      {
        NAME: 'Healthcare',
        DESC: 'Build AI models by exploring medical data to analyze medical big data that is widely used in medical research and decision-making.',
        IMAGE: industy3,
      },
      {
        NAME: 'Finance',
        DESC: 'Build AI models by training financial industry data widely used in financial institutions to reduce costs and increase profits.',
        IMAGE: industy4,
      },
    ],
  },
};
