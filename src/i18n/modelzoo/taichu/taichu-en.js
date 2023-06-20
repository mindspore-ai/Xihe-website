export default {
  TITLE: 'Zidong.Taichu',
  BIG_MODEL: 'Foundation Models',
  TAICHU_DESC:
    "Omni-perception pre-trainer (OPT) is an important achievement of the Institute of Automation of the Chinese Academy of Sciences and Huawei in exploring the road to general artificial intelligence. Based on OPT, the world's first image-text-speech tri-modal 100-billion-parameter model Zidong.Taichu was released in September 2021. It supports efficient collaboration between text, visual, and voice modals and supports industry applications such as film creation, industrial quality inspection, and intelligent driving.",
  LEARN_MORE: 'Learn More',
  EXPERIENCE_LIVE: 'Experience Live',
  NAV_ITEMS: [
    // 'Introduction',
    'Image Caption',
    'Text-to-Image',
    'VQA',
    // 'Visual Question Answering',
  ],
  INVALID_TEXT: '内容审核不通过，请重新输入',
  INPUT_CHINESE: 'Enter a description.',
  // 以图生文
  IMAGE_CAPTION: {
    NAME: 'Image Caption',
    DESCRIPTION:
      'The algorithm automatically generates descriptive text based on the input image. It is an important task in image understanding.',
    START_INFER: 'Start Inference',
    ACTION: 'Drag and upload an image (JPG, JEPG, or PNG) less than 2M.',
    MOBIlE_ACTION:
      'Select and upload an image (JPG, JEPG, or PNG) less than 2M.',
    CUSTOM_IMG: 'Custom image',
    MOBIlE_CUSTOM: 'Custom',
    ANALYSE_RESULT: 'Result Analysis',
    IMG_LIMIT: '图片大小不应超过2M',
  },
  // 介绍
  INTRODUCTION: {
    RESUME: 'Description',
    RESUME_DESC1:
      "Zidong.Taichu is the world's first image-text-speech tri-modal model jointly built by the Institute of Automation of the Chinese Academy of Sciences and the MindSpore community. Zidong.Taichu efficiently coordinates the text, visual, and voice modals to achieve robust performance. The image-text cross-modal understanding and generation capabilities are ahead of those of the SOTA model. Downstream tasks such as cross-modal detection, visual question answering, and semantic description are completed with high efficiency. In addition, the video understanding and description performance ranks No. 1 globally. Zidong.Taichu won first place in this year's two international contests, ACM Multimedia and ICCV.",
    RESUME_DESC2:
      'The release of Zidong.Taichu will change the AI R&D paradigm of a single model corresponding to a single task, implement a unified semantic expression of image-text-speech tri-modal, and significantly improve the performance of basic tasks in fields such as text, voice, image, and video. It has a huge potential market value in commercial applications such as multi-modal content understanding, search, recommendation, Q&A, speech recognition and synthesis, human-machine interaction, and unmanned driving.',
    APPLICATION_TITLE:
      "World's First Tri-Modal Foundation Model 'Zidong.Taichu', Facilitates Scientific Research, Innovation, and Application Incubation",
    APPLICATION_1: 'Text-to-Image',
    APPLICATION_2: 'Image-to-Speech',
    APPLICATION_3: 'Speech-to-Image',
    XIAOCHU_TITLE:
      'Reference Design: Multimodal Dialogue Virtual Human "Xiaochu"',
    XIAOCHU_DESC:
      'The following video shows Xu Bo, director of the Institute of Automation of the Chinese Academy of Sciences, having a dialogue with the 3D virtual human "Xiaochu," who was built based on Zidong.Taichu. The video demonstrates the modal conversion and generation instances, covering multiple functions, such as video generation, video description, image generation, intelligent Q&A, and speech recognition. In addition, Xu Bo introduces the practical application of the Zidong.Taichu foundation model in a textile industry production line. During the operation of a weaving machine, Zidong.Taichu fuses multi-modal information to judge the thread out and broken pick through speech recognition and judge the defects of the cloth through visual recognition. It demonstrates powerful, comprehensive analysis capabilities and broad application prospects.',
    VIDEO_DESC: "World's First Tri-Modal Foundation Model ",
    SIGN_LANGUAGE:
      'Application Example: Keenbow Sign Language Teaching and Examination Appliance',
    LANGUAGE_DESC1:
      'China has over 27 million hearing-impaired people. They face communication and employment problems due to sign language learning difficulties. There are three main challenges: lack of sign language vocabulary, the shortage of teachers, and difficulty unifying sign language standards. Keenbow uses MindSpore to develop a sign language multi-modal model based on Zidong.Taichu, which immediately understood the linkage between sign language actions and schematic pictures and texts, making it more convenient for beginners to understand. Based on the sign language multi-modal model and the Ascend AI software and hardware platform, the sign language teaching and examination appliance has been developed to help students quickly learn and take exams.',
    LANGUAGE_DESC2:
      'While solving the shortage of sign language teachers, the multi-modal model also promotes sign language standards. Currently, the appliance has been rolled out in dozens of special schools.',
    LEARNING: '听障群体持续学习成为难题',
    CHALLENGES:
      'There are three challenges in the long-term sign language learning process of hearing-impaired people.',
    CHALLENGE1_TITLE: 'Lack of vocabulary',
    // CHALLENGE1_DESC:  '69,000 entries in Contemporary Chinese Dictionary',
    CHALLENGE1_DESC: '69,000 entries in Contemporary Chinese Dictionary',
    CHALLENGE1_DESC_1: 'new things, new technologies...',
    CHALLENGE1_DESC_2: '8200 entries in Contemporary Chinese Dictionary',

    CHALLENGE2_TITLE: 'Shortage of teachers',
    CHALLENGE2_DESC: 'About 4.6 million hearing- or speech-impaired people',
    CHALLENGE2_DESC_2: 'About 10,000 sign language teachers',

    CHALLENGE3_TITLE: 'Different standards',
    CHALLENGE3_DESC: 'Dialect differences',
    CHALLENGE3_DESC_1: 'Grammar differences',
    CHALLENGE3_DESC_2: 'Cognitive differences',
    AI_EMPOWERMENT:
      'AI Makes Sign Language Learning Effortless and Sustainable',
    THREE_CHALLENGES:
      'Three challenges in the long-term sign language learning process of hearing-impaired people',
    CHALLENGE_1: 'Continuously enriching the sign language vocabulary library',
    CHALLENGE_2:
      'Promoting the formulation of national standards for sign language',
    CHALLENGE_3: 'Continuously enriching the sign language vocabulary library',
  },
  // 以文生图
  IMG_GENERATE: {
    TITLE: 'Text-to-Image',
    MODEL_DESC:
      'An important task in conditional image generation, the text-to-image task requires the model to understand the semantic information of the input text and generate a vivid image consistent with the description provided.',
    INPUT: 'Enter Description',
    INPUT_1: 'Description',
    PLACEHOLDER: 'Enter simplified Chinese or select a sample',
    SAMPLES: 'Samples',
    CHANGE: 'Change',
    REINPUT: 'Reset',
    START_INFER: 'Start Inference',
    GENERATE_THREE: 'Generate 3 images',
    GENERATE_THREE1: 'Generate 3 images',
    GENERATE_ONE: 'Generate 1 images',
    IMG_RESULT: 'Result',
    DOWNLOAD: 'Download',
    LISTS: [
      'A dog riding a motorcycle',
      'Twisted space and black holes in the universe',
      'Flying cars in cyberpunk',
      'Lake during the early morning with the sky reflected in the water',
      'Two girls on the beach',
      'A child playing football',
      'Starry sky',
      'The Starry Night by Van Gogh',
      'Blue sky and white clouds',
      'A lovely cat sitting on the lawn',
      'Skyscraper',
      'A plane',
      'Sunset at the lake',
      'Hamburgers and fries',
      'A ginger cat dancing on the balcony',
    ],
  },
  // 视觉问答
  VISION: {
    QUESTION_TIP:
      'Hello, welcome to VQA! Select a sample or custom image, and then enter a question in simplified Chinese.',
    TITLE: 'Visual Question Answering (VQA)',
    VISION_DESC:
      'VQA is one of the essential tasks in multi-modal understanding. You provide a picture and a related question, and the algorithm outputs the corresponding answer.',
    MESSAGE_TIP: '请输入一个与图片的相关问题。',
    MESSAGE_TIP_1: '请输入一个最新图片的相关问题。',
    MESSAGE_TIP_2: '请选择一张图片。',
    PLACEHOLDER:
      'Select an image before entering a question (max. 30 characters).',
    CUSTOM: 'Custom',
  },
};
