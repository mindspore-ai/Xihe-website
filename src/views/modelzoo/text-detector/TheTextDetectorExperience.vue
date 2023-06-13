<script setup>
import { ref, watch, nextTick, computed } from 'vue';

import { useUserInfoStore, useLoginStore } from '@/stores';
import { goAuthorize } from '@/shared/login';

import IconSend from '~icons/app/vqa-send';
import avatar from '@/assets/imgs/taichu/vqa-avatar.png';
import IconCircleCheck from '~icons/app/circle-check';
import IconCircleClose from '~icons/app/circle-close';
import { textDetectorInfer } from '@/api/api-modelzoo';
import { ElMessage } from 'element-plus';

const userInfoStore = useUserInfoStore();
const isLogined = computed(() => useLoginStore().isLogined);

const i18n = {
  TITLE: 'AI文本检测器',
  TITLE_EN: 'AI-Generated Text Detector',
  DESCRIPTION:
    '基于PU学习的多尺度AI生成文本检测器MPU，能够在各种场景下识别由AI生成的文字',
  DESCRIPTION_EN:
    'MPU, a multi-scale AI-generated text detector based on PU learning, can identify AI-generated text in various scenarios.',

  LANGUAGES: [
    {
      name: '中文检测',
      value: 'zh',
    },
    {
      name: 'English Detection',
      value: 'en',
    },
  ],

  PROMPT: '您好，欢迎体验AI文本检测器，请在下方输入您想检测的语段',
  PROMPT_EN:
    'Welcome to experience the AI Text Detector. Please enter the text you want to detect below.',

  PLACEHOLDER: '建议输入长度不少于100个单词的语段',
  PLACEHOLDER_EN:
    'It is recommended for input text segments of at least 100 words in length',
  SELECT: '选择示例',
  SELECT_EN: 'Example',

  EXAMPLES: [
    {
      CLASS: 'human',
      NAME: '人工生成',
      NAME_EN: 'Human-written',
      CONTENT:
        'ChatGPT，全称聊天生成预训练转换器（Chat Generative Pre-trained Transformer），是OpenAI开发的人工智能聊天机器人程序，于2022年11月推出。该程序使用基于GPT-3.5架构的大型语言模型并以强化学习训练。ChatGPT目前仍以文字方式交互，而除了可以用人类自然对话方式来交互，还可以用于甚为复杂的语言工作，包括自动生成文本、自动问答、自动摘要等多种任务。如：在自动文本生成方面，ChatGPT可以根据输入的文本自动生成类似的文本（剧本、歌曲、企划等），在自动问答方面，ChatGPT可以根据输入的问题自动生成答案。还有编写和调试计算机程序的能力。',
      CONTENT_EN:
        "We report the development of GPT-4, a large-scale, multimodal model which can accept image and text inputs and produce text outputs. While less capable than humans in many real-world scenarios, GPT-4 exhibits human-level performance on various professional and academic benchmarks, including passing a simulated bar exam with a score around the top 10% of test takers. GPT-4 is a Transformer-based model pre-trained to predict the next token in a document. The post-training alignment process results in improved performance on measures of factuality and adherence to desired behavior. A core component of this project was developing infrastructure and optimization methods that behave predictably across a wide range of scales. This allowed us to accurately predict some aspects of GPT-4's performance based on models trained with no more than 1/1,000th the compute of GPT-4.",
    },
    {
      CLASS: 'ai',
      NAME: 'AI生成',
      NAME_EN: 'AI-Generated',
      CONTENT:
        'ChatGPT(Chat-based Generative Pre-trained Transformer)是一款由OpenAI开发的先进人工智能语言模型，基于GPT-4架构。该模型利用深度学习和自然语言处理技术，通过分析大量文本数据进行训练，从而实现与人类用户进行智能对话和生成自然、流畅的文本回答。截止2021年9月，ChatGPT已经在各种领域取得了广泛的应用，包括自动回复、智能助手、知识问答、创意助手等。然而，尽管ChatGPT具有强大的语言理解和生成能力，它仍然可能受限于数据训练时的知识水平和偏见，并在某些情况下可能产生误导或不准确的回答。',
      CONTENT_EN:
        "They are not colored . Just as white paint is usually made from minerals found in clay . The crystals in white paint reflects all light equally making it appear white . Just liek snow . Primarily the eye color is based on the density and distribution of melanin in the eye . It just looks a certain color when light illuminates the eye . It reflects light unqually .Piracy and copyright law can be contentious issues on the internet because they involve complex questions about how to balance the rights of creators and the interests of consumers. Some people argue that artists should have the right to control how their works are distributed and to charge what they feel is appropriate, while others believe that the free exchange of information is important and that artists should not be able to control how their works are used. It's important to remember that copyright law exists to protect the rights of creators and to encourage the creation of new works by ensuring that artists can earn a fair income from their creations. When someone pirates (unauthorized copying) or uses a copyrighted work without permission, they are taking something that belongs to someone else and using it for their own benefit, without paying the person who created it. This can be seen as unfair to the creator and can discourage them from creating new works in the future. At the same time, it's also important to recognize that not everyone has the same access to information and that copyright laws can sometimes make it difficult or impossible for people to access the works they want to use. This is why it's important to have a balance between protecting the rights of creators and ensuring that everyone has access to the information and works they need.",
    },
  ],
  USAGE_INSTRUCTION: '使用指南',
  USAGE_INSTRUCTION_EN: 'Usage Instructions',

  MAX_LENGTH: '・输入长度：',
  MAX_LENGTH_EN: '・Input Length:',

  MAX_LENGTH_DESC:
    '本检测器对于过短的句子检测精度较低，建议输入长度不少于100个单词的语段。',
  MAX_LENGTH_DESC_EN:
    ' This detector has lower accuracy in detecting short sentences. It is recommended for input text segments of at least 100 words in length.',

  FEATURE_LIMIT: '・功能限制：',
  FEATURE_LIMIT_EN: '・Feature Limitations:',

  FEATURE_LIMIT_DESC:
    '暂不支持检测使用AI对人类创作的文本进行翻译/内容提取/语法修正等方式生成的文本，以及人类修改后的AI文本。',
  FEATURE_LIMIT_DESC_EN:
    'It does not yet support detection of text generated by AI through translation, content extraction or grammar correction of human-created text, as well as text modified by humans from AI-generated content.',

  DIFFICULTY: '・鉴别困难：',
  DIFFICULTY_EN: '・Difficulty in Distinguishing: ',

  DIFFICULTY_DESC:
    '较难分辨使用new bing等使用网上信息生成的文本，因为此方式可能直接使用了网上人类创作的文本。',
  DIFFICULTY_DESC_EN:
    'It is difficult to distinguish text generated using generators like new bing that leverage online information, as this method may directly utilize human-created text from the internet.',

  UNCONVENTIONAL: '・非常规文本：',
  UNCONVENTIONAL_EN: '・Unconventional Text:',

  UNCONVENTIONAL_DESC:
    '较难分辨AI生成的诗词、戏剧类或带有强烈情绪的非常规文本，以及大量中英文混杂的文本。',
  UNCONVENTIONAL_DESC_EN:
    'It is also challenging to differentiate AI-generated unconventional text, such as poetry, drama, or those with strong emotions, and mixed text containing both Chinese and English. ',

  PRODUCTION_INTRO_1: '本产品目前处于',
  PRODUCTION_INTRO_1_EN: 'This product is currently in the',

  PRODUCTION_INTRO_2: '测试阶段',
  PRODUCTION_INTRO_2_EN: ' testing phase',

  PRODUCTION_INTRO_3:
    '，主要开发人员来自华为中央研究院诺亚方舟实验室、中央软件院分布式与并行软件实验室，如有任何意见，',
  PRODUCTION_INTRO_3_EN:
    ", supported by Noah's Ark Lab, Huawei Central Research Institute and Distributed and Parallel Software Lab, Central Software Institute. If you have any issues, please ",

  PRODUCTION_INTRO_4: '点击此处反馈。',
  PRODUCTION_INTRO_4_EN: 'give feedback',
};

const feedbackLink = 'https://github.com/YuchuanTian/AIGC_text_detector';
const btnRef = ref();
const inputMsg = ref('');
const detectionLang = ref('zh');
const inputContent = ref(null);

const avatarUrl = ref('');
avatarUrl.value = userInfoStore.avatar;

const msgList = ref([]);

function selectExample(val) {
  inputMsg.value = val;
  inputContent.value.focus();
}

async function sendMessage() {
  if (inputMsg.value.trim() === '') return;

  if (!isLogined.value) {
    goAuthorize();
  } else {
    try {
      msgList.value.push({
        message: inputMsg.value.replaceAll('\n', '<br/>'),
        type: 'USER',
      });

      let sendMsg = inputMsg.value;
      inputMsg.value = '';

      const res = await textDetectorInfer({
        lang: detectionLang.value,
        text: sendMsg,
      });

      if (!res.data.is_machine) {
        msgList.value.push({
          message: 'This paragraph is human-written.',
          type: 'SERVER',
          status: '0',
          isChecked1: false,
          isChecked2: false,
        });
      } else {
        msgList.value.push({
          message: 'This paragraph is AI-generated.',
          type: 'SERVER',
          status: '1',
          isChecked1: false,
          isChecked2: false,
        });
      }
    } catch (e) {
      if (e.code === 'bigmodel_sensitive_info') {
        ElMessage({
          message: '审核未通过，请修改文字内容',
          type: 'error',
        });
      }
      console.error(e);
    }
  }
}

function feedbackRight(item) {
  item.isChecked2 = true;
}

function feedBackError(item) {
  item.isChecked1 = true;
}

watch(
  () => msgList.value,
  () => {
    const obj = document.querySelector('#txt');
    nextTick(() => {
      obj.scrollTop = obj.scrollHeight + 100;
    });
  },
  {
    deep: true,
  }
);

function keyDown(e) {
  if (e.ctrlKey && e.keyCode === 13) {
    //用户点击了ctrl+enter触发
    inputMsg.value += '\n';
  } else if (e.keyCode === 13) {
    //用户点击了enter触发
    btnRef.value.click();
    e.preventDefault();
  }
}
</script>
<template>
  <div class="experience">
    <div class="experience-left">
      <div class="title">
        {{ detectionLang === 'zh' ? i18n.TITLE : i18n.TITLE_EN }}

        <el-select v-model="detectionLang" class="languages">
          <el-option
            v-for="item in i18n.LANGUAGES"
            :key="item.name"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="description">
        {{ detectionLang === 'zh' ? i18n.DESCRIPTION : i18n.DESCRIPTION_EN }}
      </div>

      <div id="txt" class="chat-box">
        <div class="message-box-1">
          <div class="avatar">
            <img :src="avatar" alt="" />
          </div>
          <div class="message">
            <div>
              {{ detectionLang === 'zh' ? i18n.PROMPT : i18n.PROMPT_EN }}
            </div>
          </div>
        </div>

        <div
          v-for="item in msgList"
          :key="item"
          :class="item.type === 'SERVER' ? 'message-box-1' : 'message-box'"
        >
          <div class="avatar">
            <img :src="item.type === 'SERVER' ? avatar : avatarUrl" alt="" />
          </div>
          <!-- 用户消息 -->
          <div
            v-if="item.type === 'USER'"
            class="message"
            v-html="item.message"
          ></div>
          <!-- 响应消息 -->
          <template v-else>
            <div
              class="message"
              :class="item.status === '0' ? ' message-bg1' : ' message-bg2'"
            >
              {{ item.message }}
              <div class="check-box">
                <o-icon
                  :class="item.isChecked1 ? 'disappear' : ''"
                  @click="feedbackRight(item, 1)"
                  ><icon-circle-check></icon-circle-check
                ></o-icon>
                <o-icon
                  :class="item.isChecked2 ? 'disappear' : ''"
                  @click="feedBackError(item, 2)"
                  ><icon-circle-close></icon-circle-close
                ></o-icon>
              </div>
            </div>
          </template>
        </div>
      </div>

      <div class="input-area">
        <div class="input-box">
          <el-input
            ref="inputContent"
            v-model="inputMsg"
            type="textarea"
            :rows="1"
            :placeholder="
              detectionLang === 'zh' ? i18n.PLACEHOLDER : i18n.PLACEHOLDER_EN
            "
            :maxlength="detectionLang === 'zh' ? 500 : 2000"
            show-word-limit
            style="width: 100%"
            @keydown.enter="keyDown"
          />
        </div>

        <div ref="btnRef" class="btn-send" @click="sendMessage">
          <o-icon><icon-send></icon-send></o-icon>

          <p class="enter-tip">按Enter键发送，按Ctrl+Enter键换行</p>
        </div>
      </div>

      <div class="examples">
        <div class="examples-title">
          {{ detectionLang === 'zh' ? i18n.SELECT : i18n.SELECT_EN }}
        </div>
        <div class="examples-tags">
          <p
            v-for="item in i18n.EXAMPLES"
            :key="item.NAME"
            class="examples-tags-item"
            @click="
              selectExample(
                detectionLang === 'zh' ? item.CONTENT : item.CONTENT_EN
              )
            "
          >
            {{ detectionLang === 'zh' ? item.NAME : item.NAME_EN }}
          </p>
        </div>
      </div>
    </div>
    <div class="experience-right">
      <div class="experience-right-top">
        <p class="right-top-title">{{ i18n.USAGE_INSTRUCTION }}</p>

        <p class="right-top-item">
          <span>{{ i18n.MAX_LENGTH }}</span>
          {{ i18n.MAX_LENGTH_DESC }}
        </p>
        <p class="right-top-item">
          <span>{{ i18n.FEATURE_LIMIT }}</span>
          {{ i18n.FEATURE_LIMIT_DESC }}
        </p>
        <p class="right-top-item">
          <span>{{ i18n.DIFFICULTY }}</span>
          {{ i18n.DIFFICULTY_DESC }}
        </p>
        <p class="right-top-item">
          <span>{{ i18n.UNCONVENTIONAL }}</span>
          {{ i18n.UNCONVENTIONAL_DESC }}
        </p>

        <div class="right-top-tip">
          {{ i18n.PRODUCTION_INTRO_1 }}
          <span class="tip-blod">{{ i18n.PRODUCTION_INTRO_2 }}</span>
          {{ i18n.PRODUCTION_INTRO_3 }}
          <a class="tip-link" :href="feedbackLink" target="blank">
            {{ i18n.PRODUCTION_INTRO_4 }}
          </a>
        </div>
      </div>

      <div class="experience-right-bottom">
        <p class="right-top-title">{{ i18n.USAGE_INSTRUCTION_EN }}</p>

        <p class="right-bottom-item">
          <span>{{ i18n.MAX_LENGTH_EN }}</span>
          {{ i18n.MAX_LENGTH_DESC_EN }}
        </p>
        <p class="right-bottom-item">
          <span>{{ i18n.FEATURE_LIMIT_EN }}</span>
          {{ i18n.FEATURE_LIMIT_DESC_EN }}
        </p>
        <p class="right-bottom-item">
          <span>{{ i18n.DIFFICULTY_EN }}</span>
          {{ i18n.DIFFICULTY_DESC_EN }}
        </p>
        <p class="right-bottom-item">
          <span>{{ i18n.UNCONVENTIONAL_EN }}</span>
          {{ i18n.UNCONVENTIONAL_DESC_EN }}
        </p>

        <div class="right-bottom-tip">
          {{ i18n.PRODUCTION_INTRO_1_EN }}
          <span class="tip-blod">{{ i18n.PRODUCTION_INTRO_2_EN }}</span>
          {{ i18n.PRODUCTION_INTRO_3_EN }}
          <a class="tip-link" :href="feedbackLink" target="blank">
            {{ i18n.PRODUCTION_INTRO_4_EN }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.disappear {
  display: none;
}
.experience {
  display: flex;
}
.experience-left {
  flex: 1;
  margin-right: 24px;
  padding: 24px;
  background: #fff;
  border-radius: 16px;
  // @media screen and (max-width: 1080px) {
  //   padding: 16px 16px 24px;
  //   width: 100%;
  // }
  position: relative;
  .languages {
    position: absolute;
    top: 32px;
    right: 40px;
    width: 164px;
    @media screen and(max-width:1080px) {
      width: 140px;
    }
    :deep(.el-input) {
      @media screen and(max-width:1080px) {
        height: 28px;
      }
      .el-input__wrapper {
        padding: 6px 12px;
      }
      .el-input__inner {
        @media screen and(max-width:1080px) {
          font-size: 12px;
        }
      }
    }
  }
}
.experience-right {
  width: 34%;
  padding: 24px;
  background: #fff;
  border-radius: 16px;
}
.title {
  font-size: 36px;
  color: #000000;
  line-height: 48px;
  font-weight: 300;
  text-align: center;
  @media screen and (max-width: 1330px) {
    text-align: left;
  }
  @media screen and (max-width: 1080px) {
    font-weight: normal;
    font-size: 24px;
    color: #000000;
    // line-height: 28px;
  }
}
.description {
  font-size: 18px;
  color: #000000;
  line-height: 24px;
  margin-top: 16px;
  text-align: center;
  @media screen and (max-width: 1330px) {
    text-align: left;
  }
  @media screen and (max-width: 1080px) {
    font-size: 16px;
    color: #555555;
    // line-height: 18px;
    margin-top: 8px;
  }
}
.chat-box {
  height: 472px;
  border-top: 1px solid #f5f6f8;
  border-bottom: 1px solid #f5f6f8;
  margin-top: 40px;
  overflow: auto;
  padding-top: 24px;
  @media screen and (max-width: 1080px) {
    margin-top: 16px;
    height: 460px;
  }
  @media screen and (max-width: 767px) {
    height: 360px;
  }
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background-color: #d8d8d8;
    background-clip: content-box;
  }

  &::-webkit-scrollbar-track {
    border-radius: 3px;
    box-shadow: inset 0 0 2px rgba($color: #000000, $alpha: 0.2);
    background: #ffffff;
  }

  .message-box {
    display: flex;
    flex-direction: row-reverse;
    margin-bottom: 24px;
    padding-right: 26px;
    @media screen and (max-width: 1080px) {
      margin-bottom: 16px;
      padding-right: 16px;
    }

    .message {
      padding: 16px 24px;
      background: rgba(13, 141, 255, 0.1);
      border-radius: 16px 0px 16px 16px;
      margin-left: 56px;
      font-size: 16px;
      color: #000000;
      line-height: 22px;
      position: relative;
      @media screen and (max-width: 1080px) {
        padding: 8px;
        margin-left: 28px;
        font-size: 12px;
        color: #000000;
        line-height: 17px;
        border-radius: 8px 0px 8px 8px;
      }
    }

    .avatar {
      min-width: 48px;
      min-height: 48px;
      border-radius: 50%;
      margin-left: 8px;
      @media screen and (max-width: 1080px) {
        min-width: 24px;
        min-height: 24px;
      }
      img {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        @media screen and (max-width: 1080px) {
          width: 24px;
          height: 24px;
        }
      }
    }
  }
  .message-box-1 {
    display: flex;
    margin-bottom: 24px;
    @media screen and (max-width: 1080px) {
      margin-bottom: 16px;
    }
    .message {
      padding: 16px 24px;
      background: rgba(255, 127, 13, 0.1);
      border-radius: 0px 16px 16px 16px;
      margin-right: 82px;
      font-size: 16px;
      color: #000000;
      line-height: 22px;
      position: relative;
      @media screen and (max-width: 1080px) {
        padding: 12px;
        margin-right: 64px;
        font-size: 14px;
        color: #000000;
        line-height: 18px;
        border-radius: 0px 8px 8px 8px;
      }
      .check-box {
        position: absolute;
        right: -64px;
        top: 50%;
        transform: translateY(-50%);
        min-width: 56px;
        @media screen and (max-width: 1080px) {
          min-width: 32px;
          right: -56px;
        }
        .o-icon {
          font-size: 24px;
          cursor: pointer;
          @media screen and (max-width: 1080px) {
            font-size: 18px;
          }
          &:first-child {
            margin-right: 8px;
            @media screen and (max-width: 1080px) {
              margin-right: 4px;
            }
          }
          &:nth-child(2) {
            color: red;
          }
        }
      }
    }

    .avatar {
      min-width: 48px;
      min-height: 48px;
      border-radius: 50%;
      margin-right: 8px;
      @media screen and (max-width: 1080px) {
        min-width: 24px;
        min-height: 24px;
      }
      img {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        @media screen and (max-width: 1080px) {
          width: 24px;
          height: 24px;
        }
      }
    }
  }
  .message-bg1 {
    background: rgba(237, 248, 187, 0.5) !important;
  }
  .message-bg2 {
    background: rgba(253, 205, 197, 0.5) !important;
  }
}
.input-area {
  margin-top: 24px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  @media screen and (max-width: 1080px) {
    padding-right: 0px;
    margin-top: 16px;
  }
  .input-box {
    flex: 1;
    :deep(.el-textarea) {
      --o-textarea-box_shadow: none;
      --o-textarea-focus-box_shadow: none;
      .el-textarea__inner {
        border-radius: 8px;
        padding: 16px;
        height: 160px;
        background: #f5f6f8;
        &::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        &::-webkit-scrollbar-thumb {
          border-radius: 3px;
          background-color: #d8d8d8;
          background-clip: content-box;
        }

        &::-webkit-scrollbar-track {
          border-radius: 3px;
          box-shadow: inset 0 0 2px rgba($color: #000000, $alpha: 0.2);
          background: #ffffff;
        }
      }
      .el-input__count {
        background: #f5f6f8;
      }
    }
  }

  .btn-send {
    margin-left: 24px;
    width: 48px;
    cursor: pointer;
    position: relative;
    @media screen and (max-width: 1080px) {
      width: 24px;
      margin-left: 16px;
    }
    &:hover {
      .enter-tip {
        transition: all 0.5s;
        opacity: 1;
      }
    }
    .o-icon {
      font-size: 48px;
      @media screen and (max-width: 1080px) {
        font-size: 24px;
      }
    }
    .enter-tip {
      min-width: 216px;
      font-size: 12px;
      padding: 8px 12px;
      background: #f5f6f8;
      border-radius: 8px;
      position: absolute;
      top: 54px;
      left: 0px;
      opacity: 0;
    }
  }
}
.examples {
  display: flex;
  align-items: center;
  margin-top: 16px;
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;
  color: #000000;
}
.examples-title {
  margin-right: 16px;
}
.examples-tags {
  display: flex;
}
.examples-tags-item {
  padding: 4px 16px;
  background: #f4f5f7;
  margin-right: 8px;
  border-radius: 16px;
  cursor: pointer;
}
.experience-right {
}
.experience-right-top {
  padding-bottom: 24px;
  border-bottom: 1px solid #f5f6f8;
}
.right-top-title {
  font-size: 18px;
  line-height: 25px;
  font-weight: 500;
  color: #000000;
  padding-bottom: 16px;
}
.right-top-item,
.right-bottom-item {
  font-size: 16px;
  line-height: 22px;
  color: #555;
  span {
    font-weight: 600;
    color: #000000;
  }
}
.experience-right-bottom {
  margin-top: 20px;
}
.right-top-tip,
.right-bottom-tip {
  margin-top: 16px;
  font-size: 16px;
  line-height: 22px;
  color: #555;
  .tip-blod {
    font-weight: 600;
    color: #000;
  }
  .tip-link {
    color: #0d8dff;
    cursor: pointer;
  }
}
</style>
