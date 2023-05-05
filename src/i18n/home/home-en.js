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

import card1 from '@/assets/imgs/home1/more/more_card1.png';
import card2 from '@/assets/imgs/home1/more/more_card2.png';
import card3 from '@/assets/imgs/home1/more/more_card3.png';

import competition1 from '@/assets/imgs/home1/more/competition11.png';
import competition2 from '@/assets/imgs/home1/more/competition21.png';
import competition3 from '@/assets/imgs/home1/more/competition31.png';

import activity1 from '@/assets/imgs/home1/more/activity11.png';
import activity2 from '@/assets/imgs/home1/more/activity21.png';
import activity3 from '@/assets/imgs/home1/more/activity31.png';
export default {
  APP_HEADER: {
    HOME: 'Home',
    PROJECT: 'Colab Environment',
    MODEL: 'Models',
    MODELZOO: 'Foundation Models',
    EXPERENCE: 'Experience',
    FINE_TUNING: 'Fine-tuning',
    DATASET: 'Datasets',
    COURSE: 'Courses',
    COMPETITION: 'Competitions',
    ACTIVITY: 'Activities',
    DOCUMENT: 'Docs',
    INDUSTRY: 'Industries',
  },
  SCANNING_CODE: 'Public Account',
  PRIVACY_POLICY: 'Privacy Policy',
  LEGAL_NOTICE: 'Terms of Use',
  COPYRIGHT: 'Copyright',
  OWNERSHIP: 'All Rights Reserved',
  LANG: '中文',
  BANNER_BUTTON_1: 'MindSpore LLM Platform',
  BANNER_BUTTON_2: 'AI Painter',
  BANNER_BUTTON_3: '昇思3周年',
  // 轮播
  SWIPER: [
    {
      TITLE: 'MindSpore LLM Platform',
      INTRODUCE:
        "The MindSpore foundation model platform is an AI learning and practice community that integrates model selection, ideas sharing, and online experience. The community provides the ultimate Ascend computing power you need for practice. You can experience foundation models and gain knowledge and experience through practice. The community also offers free, high-quality resources, typical and easy-to-use sample code, and successful enterprise cases and hosts AI competitions suitable for different skill levels. You're welcome to try our advanced challenges.",
    },
    {},
  ],
  // AI实验室
  AI_LAB: {
    TITLE: 'Colab Environment',
    INTRODUCE:
      'Perform full-process development in multiple domains, experience inference visualization, and get trained online.',
    CARDS: [
      {
        NAME: 'Handwritten digit recognition',
        TYPE: 'CV',
        PATH: '/projects/MindSpore/lenet5/train',
      },
      {
        NAME: 'Artist Painting Style Migration',
        TYPE: 'CV',
        PATH: '/projects/MindSpore/CycleGAN//train',
      },
      {
        NAME: 'Image Classification',
        TYPE: 'CV',
        PATH: '/projects/MindSpore/vit_image_classification/train',
      },
      {
        NAME: 'Emotion Analysis',
        TYPE: 'NLP',
        PATH: '/projects/MindSpore/LSTM/train',
      },
      {
        NAME: 'Sequence Labeling',
        TYPE: 'NLP',
        PATH: '/projects/MindSpore/token_classification/train',
      },
      {
        NAME: 'Text Classification',
        TYPE: 'NLP',
        PATH: '/projects/MindSpore/text_classification/train',
      },
    ],
  },
  // 大模型体验
  MODELZOO: {
    TITLE: 'Foundation Model Inference',
    INTRODUCE:
      'Use powerful language understanding and dialog generation capabilities in NLP and CV scenarios. You can implement applications such as cross-modal retrieval, text-to-image generation, and image information extraction. You can also detect targets in remote sensing data.',
    // QUCIK_START: '立即体验',
    CARDS: [
      {
        MODELZOO_NAME: 'Wukong-Huahua',
        MODELZOO_DESC:
          "Industry's first Chinese text-to-image foundation model based on the diffusion model",
        IMAGE: modelzoo_wukong,
        PATH: '/modelzoo/wukong',
      },
      {
        MODELZOO_NAME: 'Zidong.Taichu',
        MODELZOO_DESC:
          "The world's first three-modal 100-billion-parameter model",
        IMAGE: modelzoo_taichu,
        PATH: '/modelzoo/taichu',
      },
      {
        MODELZOO_NAME: 'LuoJia.NET',
        MODELZOO_DESC:
          "The world's first dedicated remote sensing framework and the largest remote sensing sample library",
        IMAGE: modelzoo_luojia,
        PATH: '/modelzoo/luojia',
      },
      // {
      //   MODELZOO_NAME: 'PCL-L',
      //   MODELZOO_DESC:
      //     " Industry's first 100-billion-parameter Chinese NLP model",
      //   IMAGE: modelzoo_pangu,
      //   PATH: '/modelzoo/pangu',
      // },
    ],
  },
  // 模型库
  MODEL: {
    TITLE: 'Models',
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
        PATH: '/models/MindSpore/vgg16_imagenet2012',
      },
      {
        MODEL_NAME: 'Object Detection',
        TYPE: 'CV',
        CATAGORIES: 'YOLOv5｜SSD ｜MobileNet …',
        HREF: 'https://xihe.mindspore.cn/models/MindSpore/yolov5shape640',
        IMAGE: models2,
        PATH: '/models/MindSpore/yolov5shape640',
      },
      {
        MODEL_NAME: 'NLP',
        TYPE: 'NLP',
        CATAGORIES: 'BERT｜GRU｜Transformer …',
        HREF: 'https://xihe.mindspore.cn/models/MindSpore/bertbase_cnnews128',
        IMAGE: models3,
        PATH: '/models/MindSpore/tokcls_bert_base_chineses_cluener',
      },
      {
        MODEL_NAME: 'Audio',
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
    TITLE: 'Featured Gallery',
    INTRODUCE:
      'Experience the Chinese text-to-image generative model: Wukong-Huahua. You can generate inspiring images of various styles through text.',
    GALLARY_BUTTON: 'Start Drawing',
    PAINTINGS_BUTTON: 'All Artbooks',
    PATH: '/modelzoo/wukong',
    PATH1: '/modelzoo/wukong/album',
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
            NAME: 'Open Course on AI Foundation Models',
            DESC: 'The MindSpore AI framework natively supports foundation model training, which is the key to developing foundation models. Multiple scientific research institutes in China have built a series of foundation models based on MindSpore. At the same time, MindSpore offers a one-stop foundation model platform that exposes foundation model capabilities to developers, allowing them to explore and learn more about foundation models.',
            IMAGE: card1,
            // TYPE: '免费',
            DETAIL: 'View Details',
            PATH: '/course/c001/introduction',
          },
          {
            NAME: 'Computer Vision',
            DESC: 'Computer vision is an important AI field that enables computers to derive meaningful information from visual inputs, including images and video, and take actions based on the information. Based on MindSpore, this course combines theory and practice to help you get started quickly.',
            IMAGE: card2,
            // TYPE: '免费',
            DETAIL: 'View Details',
            PATH: '/course/c002/introduction',
          },
          {
            NAME: 'Introduction to MindSpore',
            DESC: 'With basic programming knowledge, you can get started with deep learning and understand parameter tuning and optimization methods in a day.',
            IMAGE: card3,
            // TYPE: '免费',
            DETAIL: 'View Details',
            PATH: '/course/c003/introduction',
          },
        ],
      },
      {
        TAB_TITLE: 'Competitions',
        IMAGE: open2,
        CARDS: [
          {
            NAME: '',
            DESC: 'This is an invitation to participate in an AI art creation event and win up to CNY10,000. The Ivory Tower: AI Painter Competition was officially launched in March 2023 for global AI developers. The topics are closely related to diffusion models. The competition provides developers with an opportunity to learn MindSpore and diffusion models.',
            IMAGE: competition1,
            TYPE: '',
            DETAIL: 'View Details',
            PATH: '/competition/ai_painter/0/introduction',
          },
          {
            NAME: '',
            DESC: 'MindSpore is a deep learning framework that aims to achieve easy development, efficient execution, and all-scenario coverage. The MindSpore AI Challenge was officially launched in September 2022. It is oriented toward global AI developers and allows them to learn MindSpore and use AI algorithm capabilities. Image classification is fundamental to computer vision, and related algorithms are developing rapidly. This challenge familiarizes participants with MindSpore and allows them to use MindSpore to preprocess and classify images.',
            IMAGE: competition2,
            TYPE: '',
            DETAIL: 'View Details',
            PATH: '/competition/3/0/introduction',
          },
          {
            NAME: '',
            DESC: 'MindSpore is a deep learning framework that aims to achieve easy development, efficient execution, and all-scenario coverage. The MindSpore AI Challenge was officially launched in September 2022. It is oriented toward global AI developers and allows them to learn MindSpore and use AI algorithm capabilities. They can study various theories and methods that can realize effective communication between human beings and computers by using natural languages. Text classification plays an important role in AI. This challenge familiarizes participants with MindSpore and allows them to use MindSpore to process and classify text based on NLP.',
            IMAGE: competition3,
            TYPE: '',
            DETAIL: 'View Details',
            PATH: '/competition/2/0/introduction',
          },
        ],
      },
      {
        TAB_TITLE: 'Activities',
        IMAGE: open3,
        CARDS: [
          {
            NAME: '',
            DESC: "MindCon Geek Week is a biannual developer carnival held by MindSpore. It inspires research and exploration of AI. At the 4th MindCon Geek Week, challenging tasks were published in multiple fields for developers with different skill levels to explore interesting open-source AI applications. At each MindCon event, experts from various fields are invited to share and experience cutting-edge AI technologies. Participants have the chance to win many prizes and MindSpore certificates. This challenge familiarizes participants with MindSpore and allows them to use MindSpore to classify Xi'an tourism images.",
            IMAGE: activity1,
            TYPE: '',
            DETAIL: 'View Details',
            PATH: '/competition/xian_travel/0/introduction',
          },
          {
            NAME: '',
            DESC: 'MindCon Geek Week is a biannual developer carnival held by MindSpore. It inspires research and exploration of AI. At the 4th MindCon Geek Week, challenging tasks were published in multiple fields for developers with different skill levels to explore interesting open-source AI applications. At each MindCon event, experts from various fields are invited to share and experience cutting-edge AI technologies. Participants have the chance to win many prizes and MindSpore certificates. This challenge familiarizes participants with MindSpore and allows them to use MindSpore to classify takeout reviews.',
            IMAGE: activity2,
            TYPE: '',
            DETAIL: 'View Details',
            PATH: '/competition/text_classification/0/introduction',
          },
          {
            NAME: '',
            DESC: 'MindCon Geek Week is a biannual developer carnival held by MindSpore. It inspires research and exploration of AI. At the 4th MindCon Geek Week, challenging tasks were published in multiple fields for developers with different skill levels to explore interesting open-source AI applications. At each MindCon event, experts from various fields are invited to share and experience cutting-edge AI technologies. Participants have the chance to win many prizes and MindSpore certificates. This challenge familiarizes participants with MindSpore and allows them to use MindSpore to detect masks on images.',
            IMAGE: activity3,
            TYPE: '',
            DETAIL: 'View Details',
            PATH: '/competition/mask_detection/0/introduction',
          },
        ],
      },
    ],
  },
  // 产业
  INDUSTRY: {
    TITLE: 'Industries',
    INTRODUCE:
      'Experience applications used in multiple scenarios, including problem locating, solution design, data processing, model training and deployment, and idea optimization; gain full-process guidance and accumulate industry knowledge to contribute to industry development.',
    CARDS: [
      {
        NAME: 'Electric Power',
        DESC: 'Build AI models by training electric power data to predict electric power data and fluctuation and assist enterprises in energy management and scheduling.',
        IMAGE: industy2,
        PATH: '/estate/electricity',
      },
      {
        NAME: 'Industry',
        DESC: 'Build AI models by training object detection data to intelligently identify industrial objects widely used in industrial detection and smart manufacturing.',
        IMAGE: industy1,
        PATH: '/estate/industry',
      },
      {
        NAME: 'Healthcare',
        DESC: 'Build AI models by exploring medical data to analyze medical big data that is widely used in medical research and decision-making.',
        IMAGE: industy3,
        STATUS: '',
        PATH: '/estate/medicine',
      },
      {
        NAME: 'Humanities',
        DESC: "Build an AI model by training humanities-related graphic data sets, realize recommendation search, and generate innovative national trend content that meets the public's aesthetics. It is widely used in video recommendation, modeling and design assistance, and other fields.",
        IMAGE: industy4,
        STATUS: '',
        PATH: '/estate/humanity',
      },
    ],
  },
  PARTNER: {
    TITLE: 'Partner',
  },
};
