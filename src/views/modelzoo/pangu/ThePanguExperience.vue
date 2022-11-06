<script setup>
import { ref, onMounted, watch, nextTick, reactive } from 'vue';

import { useUserInfoStore } from '@/stores';

import IconSend from '~icons/app/vqa-send';
import IconRefresh from '~icons/app/refresh-taichu';

import avatar from '@/assets/imgs/taichu/vqa-avatar.png';

import { handleTextRview, handlePanguInfer } from '@/api/api-modelzoo';

const userInfoStore = useUserInfoStore();

const inputMsg = ref('');
const sendBtn = ref(null);

const avatarUrl = ref('');

const lists = [
  { text: '一只狗在骑摩托车', isSelected: false },
  { text: '宇宙中扭曲的空间与黑洞', isSelected: false },
  { text: '赛博朋克的汽车在飞', isSelected: false },
  { text: '清晨的湖面倒映着天空', isSelected: false },
  { text: '两个女生在沙滩上', isSelected: false },
  { text: '小孩踢足球', isSelected: false },
  { text: '夜晚的星空', isSelected: false },
  { text: '梵高的星空', isSelected: false },
  { text: '蓝天白云', isSelected: false },
  { text: '一只可爱的猫坐在草坪上', isSelected: false },
  { text: '摩天大楼', isSelected: false },
  { text: '一架飞机', isSelected: false },
  { text: '日落湖边', isSelected: false },
  { text: '汉堡和薯条', isSelected: false },
  { text: '一只橘猫在阳台跳舞', isSelected: false },
  { text: '人间四月芳菲尽', isSelected: false },
  { text: '黄梅时节家家雨', isSelected: false },
  { text: '千山鸟飞绝', isSelected: false },
  { text: '中国的首都是哪里', isSelected: false },
  { text: '足球起源于哪里', isSelected: false },
  { text: '四川的省会是哪里', isSelected: false },
  { text: '一年四季春常在', isSelected: false },
  { text: '欢天喜地度佳节', isSelected: false },
  { text: '五湖四海皆春色', isSelected: false },
];

const examples = ref([
  { text: '一只狗在骑摩托车', isSelected: false },
  { text: '宇宙中扭曲的空间与黑洞', isSelected: false },
  { text: '赛博朋克的汽车在飞', isSelected: false },
  { text: '清晨的湖面倒映着天空', isSelected: false },
  { text: '两个女生在沙滩上', isSelected: false },
]);

const msgList = ref([
  {
    message: '请输入一个具体的问题，模型会生成对应答案。',
    type: 0,
    isLoading: false,
  },
]);

avatarUrl.value = userInfoStore.avatar;

const screenWidth = ref(
  window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth
);

const onResize = () => {
  screenWidth.value =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
};
window.addEventListener('resize', onResize);

// 发送文本
function sendMessage() {
  if (inputMsg.value.trim() === '') return;

  msgList.value.push({
    message: inputMsg.value,
    type: 1,
    isLoading: true,
  });

  examples.value.forEach((item) => {
    item.isSelected = false;
  });

  handlePanguInfer({ question: inputMsg.value }).then((res) => {
    console.log(res);
    // TODO: 状态码处理
    if (res.status === 201) {
      msgList.value.forEach((item) => (item.isLoading = false));

      msgList.value.push({
        message: res.data.data.answer,
        type: 0,
        isLoading: false,
      });
    } else {
      msgList.value.forEach((item) => (item.isLoading = false));

      ElMessage({
        type: 'error',
        message: res.data.msg,
      });
    }
  });

  inputMsg.value = '';
}

// 换一批
function refreshTags() {
  let counts = Math.floor(Math.random() * 20);
  examples.value = [];
  for (let i = counts; i <= counts + 5; i++) {
    examples.value.push(lists[i]);
  }
}

function handleTextChange() {
  examples.value.forEach((item) => {
    if (item.text === inputMsg.value) {
      item.isSelected = true;
    } else {
      item.isSelected = false;
    }
  });
}

// 点击tag
function handleTagClick(val) {
  val.isSelected = !val.isSelected;

  examples.value.forEach((item) => {
    item.isSelected = false;
    val.isSelected = true;
    inputMsg.value = val.text;
  });
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

onMounted(() => {
  // handleGetExamples();

  document.querySelector(' #inpMsg').addEventListener('keydown', function (e) {
    if (e.keyCode === 13) {
      //回车执行查询
      sendBtn.value.click();
    }
  });
});
</script>
<template>
  <div class="vision">
    <div class="vision-box">
      <div class="title">
        <span>对话生成（Dialogue Generation）</span>
      </div>

      <p class="description">
        自然语言对话技术是自然语言处理领域离人类最近的技术，人工智能领域想要走向理想状态，势必要解决自然语言对话面临的一系列问题和挑战。
      </p>

      <div id="txt" class="chat-box">
        <div
          v-for="item in msgList"
          :key="item"
          :class="item.type === 0 ? 'message-box-vqa' : 'message-box'"
        >
          <div class="avatar">
            <img :src="item.type === 0 ? avatar : avatarUrl" alt="" />
          </div>
          <div class="message">
            <!-- loading -->
            <img
              v-if="item.isLoading"
              class="msg-loading"
              src="@/assets/gifs/vqa-message.loading.gif"
              alt=""
            />

            <div>
              {{ item.message }}
            </div>
          </div>
        </div>
      </div>

      <div class="input-area">
        <div class="input-box">
          <el-input
            id="inpMsg"
            v-model="inputMsg"
            placeholder="请用简体中文输入问题或选择下方样例，不超过30个字"
            style="width: 100%"
            maxlength="30"
            @input="handleTextChange"
          />
        </div>

        <span ref="sendBtn" class="btn-send" @click="sendMessage">
          <o-icon><icon-send></icon-send></o-icon>
        </span>
      </div>

      <div class="examplse-box">
        <div class="examples">
          <div
            v-for="item in examples"
            :key="item"
            class="examples-item"
            :class="item.isSelected ? 'active' : ''"
            @click="handleTagClick(item)"
          >
            {{ item.text }}
          </div>
        </div>

        <div class="refresh-btn" @click="refreshTags">
          <o-icon><icon-refresh></icon-refresh></o-icon>
          <p>换一批</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.hide-img {
  display: none;
}

:deep(.el-image) {
  width: 160px;
  height: 160px;
  border-radius: 16px;
  @media screen and (max-width: 1080px) {
    width: 104px;
    height: 108px;
    .el-image-viewer__canvas {
      img {
        width: 76% !important;
        height: 76vw;
      }
    }
    .el-image-viewer__close {
      display: none;
    }
    .el-image-viewer__prev {
      left: 4px;
      background: none;
    }
    .el-image-viewer__next {
      background: none;
      right: 4px;
    }
    .el-image-viewer__actions {
      display: none;
    }
  }
}

:deep(.el-input) {
  height: 48px;
  @media screen and (max-width: 1080px) {
    height: 29px;
  }
  .el-input__wrapper {
    border-radius: 32px;
    background: #f5f6f8;
    box-shadow: none;
    padding: 12px 24px;
    &:hover {
      box-shadow: none;
    }
    @media screen and (max-width: 1080px) {
      padding: 6px 16px;
      height: 29px;
      .el-input__inner {
        font-size: 12px;
      }
    }
  }
  .is-focus {
    box-shadow: none !important;
  }
}
.vision {
  background-image: url(../../../assets/imgs/taichu/vqa-background-image.png);
  background-position: 0% 0%;
  background-size: 100%;
  width: 100%;
  padding: 40px 64px 64px;
  @media screen and (max-width: 1080px) {
    padding: 16px 16px 40px;
    background-image: none;
    // background-image: none;
    // background: #f5f6f8;
  }
  &-box {
    margin: 0 auto;
    width: 918px;
    background-color: #fff;
    box-shadow: 0px 1px 30px 0px rgba(0, 0, 0, 0.05);
    padding: 40px;
    @media screen and (max-width: 1080px) {
      padding: 16px 16px 24px;
      width: 100%;
    }
    .title {
      font-size: 36px;
      font-weight: 300;
      color: #000000;
      line-height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      @media screen and (max-width: 1080px) {
        font-size: 14px;
        color: #000000;
        line-height: 28px;
      }
      .new-tag {
        display: inline-block;
        width: 44px;
        line-height: 20px;
        background: #ff7f0d;
        text-align: center;
        color: #fff;
        font-size: 12px;
        @media screen and (max-width: 1080px) {
          display: none;
        }
      }
    }

    .description {
      font-size: 18px;
      font-weight: 300;
      color: #000000;
      line-height: 24px;
      margin-top: 16px;
      text-align: center;
      @media screen and (max-width: 1080px) {
        font-size: 12px;
        font-weight: 400;
        color: #555555;
        line-height: 18px;
        margin-top: 8px;
      }
    }

    .chat-box {
      height: 596px;
      border-top: 1px solid #f5f6f8;
      border-bottom: 1px solid #f5f6f8;
      margin-top: 40px;
      overflow: auto;
      padding-top: 24px;
      @media screen and (max-width: 1080px) {
        margin-top: 16px;
        height: 400px;
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
          font-weight: 400;
          color: #000000;
          line-height: 22px;
          position: relative;
          @media screen and (max-width: 1080px) {
            padding: 8px;
            margin-left: 28px;
            font-size: 12px;
            font-weight: 400;
            color: #000000;
            line-height: 17px;
            border-radius: 8px 0px 8px 8px;
          }
          .msg-loading {
            position: absolute;
            left: -30px;
            width: 20px;
            height: 20px;
            @media screen and (max-width: 1080px) {
              width: 12px;
              height: 12px;
              left: -20px;
            }
          }
        }

        .message-img {
          padding: 8px;
          line-height: 0px;
          @media screen and (max-width: 1080px) {
            padding: 4px;
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
      .message-box-vqa {
        display: flex;
        margin-bottom: 24px;
        @media screen and (max-width: 1080px) {
          margin-bottom: 16px;
        }
        .message {
          white-space: pre-wrap;
          padding: 16px 24px;
          background: rgba(255, 127, 13, 0.1);
          border-radius: 0px 16px 16px 16px;
          margin-right: 82px;
          font-size: 16px;
          font-weight: 400;
          color: #000000;
          line-height: 22px;
          @media screen and (max-width: 1080px) {
            padding: 8px;
            margin-right: 28px;
            font-size: 12px;
            font-weight: 400;
            color: #000000;
            line-height: 17px;
            border-radius: 0px 8px 8px 8px;
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
    }

    .input-area {
      margin-top: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      // padding-right: 40px;
      @media screen and (max-width: 1080px) {
        padding-right: 0px;
        margin-top: 16px;
      }
      .input-box {
        flex: 1;
      }

      .btn-send {
        margin-left: 24px;
        width: 48px;
        cursor: pointer;
        @media screen and (max-width: 1080px) {
          width: 24px;
          margin-left: 16px;
        }
        .o-icon {
          font-size: 48px;
          @media screen and (max-width: 1080px) {
            font-size: 24px;
          }
        }
      }
    }

    .examplse-box {
      display: flex;
      justify-content: space-between;
      .examples {
        margin-top: 8px;
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        &-item {
          padding: 7px 12px;
          border-radius: 8px;
          border: 1px solid #dbedff;
          box-sizing: border-box;
          background-color: #f3f9ff;
          margin-top: 16px;
          font-size: 14px;
          color: #555;
          margin-right: 10px;
          line-height: 18px;
          cursor: pointer;
        }
        .active {
          border: 1px solid #a0d2ff;
          color: #0d8dff;
        }
      }

      .refresh-btn {
        display: flex;
        align-items: center;
        padding-top: 24px;
        width: 60px;
        cursor: pointer;
        p {
          font-size: 10px;
          font-weight: 400;
          color: #0d8dff;
          line-height: 14px;
        }
        .o-icon {
          font-size: 12px;
          margin-right: 2px;
        }
      }
    }
  }
}
</style>
