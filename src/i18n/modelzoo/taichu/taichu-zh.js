export default {
  TITLE: '紫东.太初',
  BIG_MODEL: '大模型',
  TAICHU_DESC:
    'OPT（Omni-Perception Pre-Trainer）是全场景感知预训练模型的简称，是中科院自动化和华为在探索通用人工智能道路上的重要成果，并在2021年9月发布了全球首个图文音三模态千亿大模型，中文名字叫紫东.太初；支持文本、视觉、语音不同模态间的高效协同，可支撑影视创作、工业质检、智能驾驶等产业应用。',
  LEARN_MORE: '了解更多',
  EXPERIENCE_LIVE: '在线体验', //Experience Live
  NAV_ITEMS: ['以图生文', '以文生图', '视觉问答'],
  INVALID_TEXT: '内容审核不通过，请重新输入',
  INPUT_CHINESE: '请输入中文描述',
  // 以图生文
  IMAGE_CAPTION: {
    NAME: '以图生文（Image Caption）',
    DESCRIPTION:
      '顾名思义，即让算法根据输入的一幅图自动生成对应的描述性的文字，是图像理解中非常重要的基础任务。',
    START_INFER: '开始推理',
    ACTION: '拖拽图片(jpg/jepg/png)到此处上传',
    MOBIlE_ACTION: '选择图片(jpg/jepg/png)上传',
    CUSTOM_IMG: '自定义图片',
    MOBIlE_CUSTOM: '自定义',
    ANALYSE_RESULT: '分析结果',
    IMG_LIMIT: '图片大小不应超过2M',
  },
  // 介绍
  INTRODUCTION: {
    RESUME: '简述',
    RESUME_DESC1:
      '紫东.太初是中科院自动化所与MindSpore社区联合打造的全球首个图、文、音三模态大模型。紫东.太初将文本 + 视觉 + 语音各个模型高效协同，实现超强性能，在图文跨模态理解与生成性能上都能领先目前业界的SOTA模型，高效完成跨模态检测、视觉问答、语义描述等下游任务。此外，视频理解与描述的性能更是实现了全球第一，在今年的两个国际大赛中，ACM Multimedia（国际多媒体大会）和ICCV（国际计算机视觉大会）紫东太初都获得了第一名的成绩。',
    RESUME_DESC2:
      '紫东.太初的发布将改变当前单一模型对应单一任务的人工智能研发范式，实现三模态图文音的统一语义表达，大幅提升文本、语音、图像和视频等领域的基础任务性能，并在多模态内容的理解、搜索、推荐和问答，语音识别和合成，人机交互和无人驾驶等商业应用中具有潜力巨大的市场价值。',
    APPLICATION_TITLE:
      '全球首个三模态大模型“紫东.太初”——助力科研创新与应用孵化',
    APPLICATION_1: '以文搜图',
    APPLICATION_2: '以图生音',
    APPLICATION_3: '以音生图',
    XIAOCHU_TITLE: '参考设计——多模态对话虚拟人“小初”',
    XIAOCHU_DESC:
      '自动化所所长徐波与自动化所基于紫东太初打造的三维虚拟人“小初”进行了跨时空对话，展示了不同模态间的互相转换和生成实例，涵盖视频生成、视频描述、图像生成、智能问答、语音识别等多个功能。徐波同时介绍了紫东太初大模型在纺织工业生产线中的实际应用案例。在纺织厂织机运转的过程中，紫东太初融合多模态信息，可以通过语音识别来判断断纬和断经，通过视觉识别来判断布匹的缺陷，展示出强大的综合研判能力和广阔的应用前景。',
    VIDEO_DESC: '全球首个三模态大模型',
    SIGN_LANGUAGE: '应用实例——千博手语教考一体机',
    LANGUAGE_DESC1:
      '手语教考一体机：我国共有2700多万听障人士，他们面临沟通难、就业难等一系列问题，究其原因，主要是手语知识学习的挑战，这其中手语词汇匮乏、师资短缺、手语标准难统一是三大挑战。千博信息基于紫东.太初利用昇思MindSpore开发了手语多模态模型，开创性地实现手语动作与示意图片和文字的联动，让初学者更加方便的理解；基于手语多模态模型，利用昇腾AI基础软硬件平台开发了手语教考一体机，帮助学生随学随练随考，高效学习。',
    LANGUAGE_DESC2:
      '在解决手语师资短缺的同时，还能推动手语标准的推广。目前一体机已在湘潭特校等数十个学校陆续上线。',
    LEARNING: '听障群体持续学习成为难题',
    CHALLENGES: '听障人士长期手语学习过程中的三大挑战',
    CHALLENGE1_TITLE: '词汇匮乏',
    CHALLENGE1_DESC: '69000个词语',
    CHALLENGE1_DESC_1: '现代汉语词典》新事物 新技术…',
    CHALLENGE1_DESC_2: '8200个词语',

    CHALLENGE2_TITLE: '师资短缺',
    CHALLENGE2_DESC: '约460万聋哑学生',
    CHALLENGE2_DESC_2: '约1万名手语教师',

    CHALLENGE3_TITLE: '标准不一',
    CHALLENGE3_DESC: '方言差异',
    CHALLENGE3_DESC_1: '语法差异',
    CHALLENGE3_DESC_2: '认知差异',
    AI_EMPOWERMENT: 'AI赋能，让手语学习更简单、可持续',
    THREE_CHALLENGES: ' 听障人士长期手语学习过程中的三大挑战',
    CHALLENGE_1: '持续丰富手语词汇库',
    CHALLENGE_2: '推动融合手语国家标准制定',
    CHALLENGE_3: '持续丰富手语词汇库',
  },
  // 以文生图
  IMG_GENERATE: {
    TITLE: '以文生图（Text-To-Image）',
    MODEL_DESC:
      '以文生图任务是条件图像生成任务中重要的任务之一，要求模型理解输入文本的语义信息并生成与输入文本描述内容一致的逼真图像。',
    INPUT: '输入描述',
    INPUT_1: '描述',
    PLACEHOLDER: '请输入简体中文或选择下方样例',
    SAMPLES: '选择样例',
    CHANGE: '换一批',
    REINPUT: '重新输入',
    START_INFER: '开始推理',
    GENERATE_THREE: '生成3张',
    GENERATE_THREE1: '生成三张',
    GENERATE_ONE: '生成一张',
    IMG_RESULT: '图片结果',
    DOWNLOAD: '下载',
    LISTS: [
      '一只狗在骑摩托车',
      '宇宙中扭曲的空间与黑洞',
      '赛博朋克的汽车在飞',
      '清晨的湖面倒映着天空',
      '两个女生在沙滩上',
      '小孩踢足球',
      '夜晚的星空',
      '梵高的星空',
      '蓝天白云',
      '一只可爱的猫坐在草坪上',
      '摩天大楼',
      '一架飞机',
      '日落湖边',
      '汉堡和薯条',
      '一只橘猫在阳台跳舞',
    ],
  },
  // 视觉问答
  VISION: {
    QUESTION_TIP:
      '您好，欢迎体验视觉问答！请选择例图片或自定义图片，再用简体中文输入一个相关问题进行问答。',
    TITLE: '视觉问答（Visual Question Answer, VQA）',
    VISION_DESC:
      '视觉问答是给定一幅图片和一个相关的问题，算法输出相应的答案，是多模态理解中的基础任务之一。',
    MESSAGE_TIP: '请输入一个与图片的相关问题。',
    MESSAGE_TIP_1: '请输入一个最新图片的相关问题。',
    MESSAGE_TIP_2: '请选择一张图片。',
    PLACEHOLDER: '请先选择图片再输入问题，不超过30个字',
    CUSTOM: '自定义',
  },
};