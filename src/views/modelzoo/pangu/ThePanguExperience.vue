<script setup>
import { ref, onMounted, watch, nextTick, computed, onUnmounted } from 'vue';

import { useUserInfoStore, useLoginStore } from '@/stores';
import { goAuthorize } from '@/shared/login';

import IconSend from '~icons/app/vqa-send';
import IconRefresh from '~icons/app/refresh-taichu';

import { handlePanguInfer } from '@/api/api-modelzoo';

const userInfoStore = useUserInfoStore();
const isLogined = computed(() => useLoginStore().isLogined);

const inputMsg = ref('');
const sendBtn = ref(null);

const avatarUrl = ref('');

avatarUrl.value = userInfoStore.avatar;

const lists = [
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
  { text: '人间四月芳菲尽', isSelected: false },
  { text: '黄梅时节家家雨', isSelected: false },
  { text: '千山鸟飞绝', isSelected: false },
  { text: '中国的首都是哪里', isSelected: false },
  { text: '足球起源于哪里', isSelected: false },
]);

const msgList = ref([
  {
    message: '请输入一个具体的问题，模型会生成对应答案。',
    type: 0,
    isLoading: false,
  },
]);

// 随机选取五个样例
function getRandom(arr, count) {
  let shuffled = arr.slice(0),
    i = arr.length,
    min = i - count,
    temp,
    index;
  while (i-- > min) {
    index = Math.floor((i + 1) * Math.random());
    temp = shuffled[index];
    shuffled[index] = shuffled[i];
    shuffled[i] = temp;
  }
  return shuffled.slice(min);
}

// 换一批
function refreshTags() {
  examples.value = getRandom(lists, 5);
}

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

  if (!isLogined.value) {
    goAuthorize();
  } else {
    msgList.value.push({
      message: inputMsg.value,
      type: 1,
      isLoading: true,
    });

    examples.value.forEach((item) => {
      item.isSelected = false;
    });

    handlePanguInfer({ question: inputMsg.value }).then((res) => {
      if (res.status === 201 && res.data.data) {
        msgList.value.forEach((item) => (item.isLoading = false));

        msgList.value.push({
          message: res.data.data.answer,
          type: 0,
          isLoading: false,
        });
      } else {
        msgList.value.forEach((item) => (item.isLoading = false));
        if (res.code === 'bigmodel_sensitive_info') {
          ElMessage({
            type: 'error',
            message: '内容审核不通过，请重新输入',
          });
        }
      }
    });

    inputMsg.value = '';
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

const handleKeydown = (e) => {
  if (e.keyCode === 13) {
    // 回车执行查询
    sendBtn.value.click();
  }
};

const inputContent = ref(null);
const inputDom = ref(null);

onMounted(() => {
  inputDom.value = inputContent.value.ref;
  inputContent.value.ref.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('resize', onResize);

  inputDom.value.removeEventListener('keydown', handleKeydown);
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
            <img
              :src="
                item.type === 0
                  ? '	https://obs-xihe-beijing4.obs.cn-north-4.myhuaweicloud.com/xihe-img/default_avatar/catimg_04.png'
                  : avatarUrl
              "
              alt=""
            />
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
            ref="inputContent"
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
  @media screen and (max-width: 820px) {
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
  @media screen and (max-width: 820px) {
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
    @media screen and (max-width: 820px) {
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
  @media screen and (max-width: 820px) {
    padding: 16px 16px 40px;
    background-image: none;
    min-height: calc(100vh - 480px);
  }
  &-box {
    margin: 0 auto;
    width: 918px;
    background-color: #fff;
    box-shadow: 0px 1px 30px 0px rgba(0, 0, 0, 0.05);
    padding: 40px;
    @media screen and (max-width: 820px) {
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
      @media screen and (max-width: 820px) {
        font-size: 14px;
        color: #000000;
        line-height: 28px;
      }
    }

    .description {
      font-size: 18px;
      font-weight: 300;
      color: #000000;
      line-height: 24px;
      margin-top: 16px;
      text-align: center;
      @media screen and (max-width: 820px) {
        font-size: 12px;
        font-weight: 400;
        color: #555555;
        line-height: 18px;
        margin-top: 8px;
        text-align: left;
      }
    }

    .chat-box {
      height: 596px;
      border-top: 1px solid #f5f6f8;
      border-bottom: 1px solid #f5f6f8;
      margin-top: 40px;
      overflow: auto;
      padding-top: 24px;
      @media screen and (max-width: 820px) {
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
        @media screen and (max-width: 820px) {
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
          @media screen and (max-width: 820px) {
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
            @media screen and (max-width: 820px) {
              width: 12px;
              height: 12px;
              left: -20px;
            }
          }
        }

        .message-img {
          padding: 8px;
          line-height: 0px;
          @media screen and (max-width: 820px) {
            padding: 4px;
          }
        }

        .avatar {
          min-width: 48px;
          min-height: 48px;
          border-radius: 50%;
          margin-left: 8px;
          @media screen and (max-width: 820px) {
            min-width: 24px;
            min-height: 24px;
          }
          img {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            @media screen and (max-width: 820px) {
              width: 24px;
              height: 24px;
            }
          }
        }
      }
      .message-box-vqa {
        display: flex;
        margin-bottom: 24px;
        @media screen and (max-width: 820px) {
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
          @media screen and (max-width: 820px) {
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
          @media screen and (max-width: 820px) {
            min-width: 24px;
            min-height: 24px;
          }
          img {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            @media screen and (max-width: 820px) {
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
      @media screen and (max-width: 820px) {
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
        @media screen and (max-width: 820px) {
          width: 24px;
          margin-left: 16px;
        }
        .o-icon {
          font-size: 48px;
          @media screen and (max-width: 820px) {
            font-size: 24px;
          }
        }
      }
    }

    .examplse-box {
      display: flex;
      justify-content: space-between;
      @media screen and (max-width: 820px) {
        display: block;
      }
      .examples {
        margin-top: 8px;
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        &-item {
          font-size: 14px;
          line-height: 18px;
          color: #555;
          padding: 7px 12px;
          margin-top: 16px;
          margin-right: 10px;
          border-radius: 8px;
          border: 1px solid #dbedff;
          // box-sizing: border-box;
          background-color: #f3f9ff;
          cursor: pointer;
          @media screen and (max-width: 820px) {
            font-size: 12px;
            line-height: 8px;
            padding: 4px 7px;
            margin-top: 8px;
            margin-right: 8px;
          }
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
        @media screen and (max-width: 820px) {
          padding-top: 8px;
          width: 100%;
          justify-content: right;
        }
      }
    }
  }
}
</style>
