<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';

import { request } from '@/shared/axios';

import { useUserInfoStore } from '@/stores';

import { handleTextRview, handleVqaInference } from '@/api/api-modelzoo';
import { handleVqaUpload } from '@/api/api-obs';

import IconSend from '~icons/app/vqa-send';
import IconUpload from '~icons/app/modelzoo-upload';
import avatar from '@/assets/imgs/taichu/vqa-avatar.png';
import { ElMessage } from 'element-plus';

const userInfoStore = useUserInfoStore();

const inp = ref(null);
const inputMsg = ref('');
const sendBtn = ref(null);
const fileList = ref([]);
let formData = new FormData();

const imgLists = [
  {
    id: 0,
    url: 'taichu_vision_1',
  },
  {
    id: 1,
    url: 'taichu_vision_2',
  },
  {
    id: 2,
    url: 'taichu_vision_3',
  },
  {
    id: 3,
    url: 'taichu_vision_4',
  },
  {
    id: 4,
    url: 'taichu_vision_5',
  },
  {
    id: 5,
    url: 'taichu_vision_6',
  },
];

const srcList = ref([]);
const imgUrl = ref(null);
const avatarUrl = ref('');
const msgList = ref([
  {
    message:
      '您好，欢迎体验视觉问答！请选择例图片或自定义图片，再用简体中文输入一个相关问题进行问答。',
    type: 0,
    url: '',
    isPicture: false,
    isLoading: false,
  },
]);
const sendList = ref([]);
const isClick = ref(true);

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

const getImage = (name) => {
  return new URL(
    `../../../assets/imgs/taichu/taichu-vision/${name}.jpg`,
    import.meta.url
  ).href;
};

function successCallback() {
  msgList.value.push({
    message: '',
    type: 1,
    url: imgUrl.value,
    isPicture: true,
  });
  srcList.value.push(imgUrl.value);

  if (!sendList.value.length) {
    if (srcList.value.length === 1) {
      setTimeout(() => {
        msgList.value.push({
          message: '请输入一个与图片的相关问题。',
          type: 0,
          url: '',
          isPicture: false,
        });
      }, 300);
    } else if (srcList.value.length > 1) {
      setTimeout(() => {
        msgList.value.push({
          message: '请输入一个最新图片的相关问题。',
          type: 0,
          url: '',
          isPicture: false,
        });
      }, 300);
    }
  } else {
    if (msgList.value[msgList.value.length - 1].isPicture) {
      setTimeout(() => {
        msgList.value.push({
          message: '请输入一个与图片的相关问题。',
          type: 0,
          url: '',
          isPicture: false,
          isLoading: false,
        });
      }, 300);
    }
  }
}

// 样例
function selectImage(val) {
  if (isClick.value) {
    isClick.value = false;

    imgUrl.value = getImage(val);

    formData.delete('file');
    formData = new FormData();

    request
      .get(imgUrl.value, {
        responseType: 'blob',
      })
      .then((res) => {
        let file = new File([res.data], 'img', {
          type: 'image/png',
          lastModified: Date.now(),
        });

        fileList.value = [];
        fileList.value[0] = { raw: file }; // formData.append('blob', file);

        handleVqaUpload(
          {
            path: `vqa/uploads/${userInfoStore.userName}/result.jpg`,
            file: fileList.value[0].raw,
            isEdit: false,
            description: '',
          },
          null,
          successCallback
        );
      });
  }

  setTimeout(() => {
    isClick.value = true;
  }, 500);
}

// 自定义图片
function customUpload() {
  inp.value.click();
}
const latestIndex = ref(0);

// 发送文本
function sendMessage() {
  if (inputMsg.value.trim() === '') return;

  if (isClick.value) {
    isClick.value = false;

    msgList.value.push({
      message: inputMsg.value,
      type: 1,
      url: '',
      isPicture: false,
      isLoading: true,
    });

    latestIndex.value = msgList.value.length;
    handleTextRview({ is_img: false, content: inputMsg.value }).then((res) => {
      if (res.status === 200) {
        sendList.value.push(inputMsg.value);

        msgList.value[latestIndex.value - 1].isLoading = false;

        if (!srcList.value.length) {
          setTimeout(() => {
            msgList.value.push({
              message: '请选择一张图片。',
              type: 0,
              url: '',
              isPicture: false,
            });
          }, 300);
        } else {
          handleVqaInference({
            image_path: `vqa/uploads/${userInfoStore.userName}/result.jpg`,
            question: inputMsg.value,
          }).then((res) => {
            if (res.status === 200) {
              msgList.value.push({
                message: res.data.instances,
                type: 0,
                url: '',
                isPicture: false,
              });
            } else if (res.status === -1) {
              ElMessage({
                type: 'warning',
                message: '请登录',
              });
            }
          });
        }

        inputMsg.value = '';
      }
    });
  }

  setTimeout(() => {
    isClick.value = true;
  }, 500);
}

// 获取当前预览图片索引
const previewIndex = ref(0);
function getPreviewImgIndex(val) {
  previewIndex.value = srcList.value.indexOf(val);
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
  // 1.获取本地选取的图片
  inp.value.onchange = function (e) {
    imgUrl.value = window.URL.createObjectURL(e.target.files[0]);

    srcList.value.push(imgUrl.value);

    formData.delete('file');
    formData = new FormData();

    request
      .get(imgUrl.value, {
        responseType: 'blob',
      })
      .then((res) => {
        let file = new File([res.data], 'img', {
          type: 'image/png',
          lastModified: Date.now(),
        });

        fileList.value = [];
        fileList.value[0] = { raw: file }; // formData.append('blob', file);

        handleVqaUpload(
          {
            path: `vqa/uploads/${userInfoStore.userName}/result.jpg`,
            file: fileList.value[0].raw,
            isEdit: false,
            description: '',
          },
          null,
          successCallback
        );
      });
  };

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
        <span>视觉问答（Visual Question Answer, VQA）</span>
        <span class="new-tag">new</span>
      </div>

      <p class="description">
        视觉问答是给定一幅图片和一个相关的问题，算法输出相应的答案，是多模态理解中的基础任务之一。
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
          <div class="message" :class="item.isPicture ? 'message-img' : ''">
            <!-- loading -->
            <img
              v-if="item.isLoading"
              class="msg-loading"
              src="@/assets/gifs/vqa-message.loading.gif"
              alt=""
            />

            <div v-if="!item.isPicture">
              {{ item.message }}
            </div>

            <el-image
              v-else
              class="image-modal"
              :src="item.url"
              :preview-src-list="srcList"
              :initial-index="previewIndex"
              :hide-on-click-modal="true"
              fit="cover"
              @click="getPreviewImgIndex(item.url)"
            />
          </div>
        </div>
      </div>

      <div class="input-area">
        <div class="input-box">
          <el-input
            id="inpMsg"
            v-model="inputMsg"
            placeholder="请先选择图片再输入问题，不超过30个字"
            style="width: 100%"
            maxlength="30"
          />
        </div>

        <span ref="sendBtn" class="btn-send" @click="sendMessage">
          <o-icon><icon-send></icon-send></o-icon>
        </span>
      </div>

      <div class="img-list">
        <div
          v-for="(item, index) in imgLists"
          :key="item"
          class="img-list-item"
          :class="index >= 4 && screenWidth < 530 ? 'hide-img' : ''"
          @click="selectImage(item.url)"
        >
          <img draggable="false" :src="getImage(item.url)" />
        </div>

        <div class="img-list-item custom" @click="customUpload">
          <o-icon><icon-upload></icon-upload></o-icon>
          <p>自定义</p>

          <input
            ref="inp"
            type="file"
            accept="image/png,image/jpg,image/jpeg"
            style="display: none"
          />
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
    // background-image: none;
    // background: #f5f6f8;
  }
  &-box {
    margin: 0 auto;
    width: 918px;
    background-color: #fff;
    box-shadow: 0px 1px 30px 0px rgba(0, 0, 0, 0.05);
    padding: 40px 8px 40px 40px;
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
          img {
            min-height: 160px;
          }
        }

        .message-img {
          padding: 8px;
          line-height: 0px;
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
      padding-right: 40px;
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
        // &:hover {
        //   transform: scale(1.1);
        // }
        .o-icon {
          font-size: 48px;
          @media screen and (max-width: 1080px) {
            font-size: 24px;
          }
        }
      }
    }

    .img-list {
      padding: 24px 32px 0 0;
      display: flex;
      background-color: #fff;
      justify-content: space-between;
      align-items: center;
      @media screen and (max-width: 1080px) {
        padding: 16px 0 0;
      }
      .custom {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #0d8dff;
        border: 2px dashed #d1e9ff;
        // background-color: #e7f4ff;

        .o-icon {
          font-size: 48px;
          @media screen and (max-width: 1080px) {
            font-size: 24px;
          }
        }

        p {
          font-size: 14px;
          font-weight: 400;
          line-height: 20px;
          margin-top: 8px;
          @media screen and (max-width: 1080px) {
            font-size: 9px;
            font-weight: 400;
            line-height: 13px;
            margin-top: 2px;
          }
        }
      }

      &-item {
        width: 106px;
        height: 106px;
        position: relative;
        cursor: pointer;
        @media screen and (max-width: 1080px) {
          width: 54px;
          height: 54px;
        }
        img {
          width: 100%;
          height: 100%;
        }

        &:hover {
          border: 1px solid #a0d2ff;
        }
      }
    }
  }
}
</style>