<script setup>
import { ref, computed } from 'vue';

import { useLoginStore } from '@/stores';

import { timestampToTime } from '@/shared/utils';

import { LOGIN_KEYS } from '@/shared/login';
import {
  cloudDisposeList,
  cloudDisposeTarget,
  cloudSubscribe,
} from '@/api/api-project';

function getHeaderConfig() {
  const headersConfig = localStorage.getItem(LOGIN_KEYS.USER_TOKEN)
    ? {
        headers: {
          'private-token': localStorage.getItem(LOGIN_KEYS.USER_TOKEN),
        },
      }
    : {};
  return headersConfig;
}
const isLogined = computed(() => useLoginStore().isLogined);

const buttonText = ref('启动');
const isDisabled = ref(false); //按钮是否禁用
const isfinshed = ref(false); //是否推理结束
const deadTime = ref('');
const jupyterUrl = ref('');
let socket;
const cloudId = ref('');

function handleCardClick(item, index) {
  if (index === 1) {
    return;
  } else {
    // 启动中不能选取资源配置
    if (isDisabled.value) {
      return;
    } else {
      if (item.isActive) {
        item.isActive = !item.isActive;
        cloudId.value = '';
      } else {
        disposeList.value.forEach((val) => {
          val.isActive = false;
        });
        item.isActive = !item.isActive;
        cloudId.value = item.id;
      }
    }
  }
}

// 获取pod信息
async function getPodInfo(id) {
  try {
    const res = await cloudDisposeTarget(id);
    if (res.data.status === '') {
      // 表示用户没有启动实例  按钮为启动
      // buttonText.value = '启动';
      return;
    } else if (
      res.data.status === 'starting' ||
      res.data.status === 'creating'
    ) {
      // 启动中  按钮为启动中
      buttonText.value = '启动中';
      isDisabled.value = true;

      // 根据cloud_id将对应resource_id的资源置为选中状态，且其他资源不可选
      disposeList.value.forEach((item) => {
        item.isActive = false;
        if (item.id === res.data.cloud_id) {
          item.isActive = true;
        }
      });

      // 如果没有建立ws，建立ws链接
      socket = new WebSocket(
        `wss://xihe.mindspore.cn/server/cloud/${cloudId.value}`,
        [getHeaderConfig().headers['private-token']]
      );

      socket.onmessage = function (event) {
        if (JSON.parse(event.data).data.access_url) {
          isfinshed.value = true;
          jupyterUrl.value = JSON.parse(event.data).data.access_url;

          isDisabled.value = true;
        }
      };
    } else if (res.data.status === 'running') {
      isDisabled.value = false;

      deadTime.value = timestampToTime(res.data.expiry);
      //判断当前时间戳是否大于获取的时间戳，大于即过期
      const currentTime = new Date().getTime();
      // 是否到期
      if (res.data.expiry * 1000 > currentTime) {
        if (res.data.access_url) {
          // 按钮打开jupyter（对应url）
          isfinshed.value = true;
          jupyterUrl.value = res.data.access_url;

          isDisabled.value = true;

          // 根据cloud_id将对应resource_id的资源置为选中状态，且其他资源不可选
          disposeList.value.forEach((item) => {
            item.isActive = false;
            if (item.id === res.data.cloud_id) {
              item.isActive = true;
            }
          });
        } else {
          // 弹窗显示  '异常，请重试'
          ElMessage({
            type: 'error',
            message: '异常，请重试',
          });
          isfinshed.value = false;
          buttonText.value = '启动';
        }
      } else {
        // 过期，按钮变为启动
        buttonText.value = '启动';
        isfinshed.value = false;
      }
    } else if (res.data.status === 'fail') {
      // 弹窗显示 "启动失败, 请重试"，按钮变回之前的启动
      isDisabled.value = isfinshed.value = false;
      buttonText.value = '启动';
      ElMessage({
        type: 'error',
        message: '启动失败, 请重试',
      });
    }
  } catch (e) {
    console.error(e);
  }
}

const disposeList = ref([]);
// 获取云资源配置列表
async function getCloudDisposeList() {
  try {
    const res = await cloudDisposeList();
    disposeList.value = res.data.data;
    disposeList.value.forEach((item) => {
      item.isActive = false;
      if (isLogined.value && item.has_holding) {
        cloudId.value = item.id;
        getPodInfo(cloudId.value);
      } else {
        buttonText.value = '启动';
      }
    });
  } catch (e) {
    console.error(e);
  }
}
getCloudDisposeList();

// 订阅
async function orderCloudSbuscrible(id) {
  try {
    const res = await cloudSubscribe(id);
    if (res.data.data === 'success') {
      // 启动中  按钮为启动中
      buttonText.value = '启动中';
      isDisabled.value = true;

      // 资源订阅成功，连接websocket
      socket = new WebSocket(
        `wss://xihe.mindspore.cn/server/cloud/${cloudId.value}`,
        [getHeaderConfig().headers['private-token']]
      );

      socket.onmessage = function (event) {
        if (JSON.parse(event.data).data.access_url) {
          isfinshed.value = true;
          jupyterUrl.value = JSON.parse(event.data).data.access_url;

          isDisabled.value = true;
        }
      };
    }
  } catch (e) {
    console.error(e);
  }
}

// 启动Jupyter
function startJupyter() {
  if (!isLogined.value) {
    goAuthorize();
  } else {
    if (!cloudId.value) {
      ElMessage({
        type: 'warning',
        message: '请选择资源',
      });
    } else {
      disposeList.value.forEach((val) => {
        if (val.isActive) {
          if (val.is_idle) {
            cloudId.value = val.id;
            // 接口cloud_id字段加上以后，cloudId.value带入请求
            orderCloudSbuscrible(cloudId.value);
          } else {
            ElMessage({
              type: 'warning',
              message: '目前暂无资源，请稍后再来看看',
            });
          }
        }
      });
    }
  }
}

function openJupyter() {
  window.open(jupyterUrl.value, '_blank');
}
</script>
<template>
  <div class="develop-environment">
    <div class="header">
      <div class="title">Jupyter云上开发</div>
      <div v-if="deadTime" class="time-remaining">
        到期时间&nbsp;&nbsp;<span style="color: #999">{{ deadTime }}</span>
      </div>
    </div>

    <div class="tip">
      云上开发环境，无需配置环境，既可灵活调试运行代码。注意一个用户只能启动一个jupyter实例，且2个小时后会自动释放资源，到期时间前请及时将资源下载到本地。
    </div>

    <div class="specifications">
      <div
        v-for="(item, index) in disposeList"
        :key="item.name"
        class="specification-card"
        :class="[
          item.isActive ? 'active' : '',
          isDisabled ? 'banned' : '',
          index === 1 ? 'specification-card-disabled' : '',
        ]"
        @click="handleCardClick(item, index)"
      >
        <img
          class="card-image"
          src="@/assets/imgs/specification-bg.png"
          alt=""
        />

        <div v-if="!item.credit" class="price-tag">免费</div>
        <div v-else class="price-tag waiting-tag">敬请期待</div>

        <div class="card-inner">
          <div class="card-top">
            <p class="specification-name">{{ item.processor }}</p>
            <template v-if="!item.credit">
              <p v-if="item.is_idle" class="use-tip">
                单次运行时长为2小时，关闭后将会释放资源
              </p>
              <p v-else class="use-tip">目前暂无资源，请稍后再来看看</p>
            </template>
            <template v-else>
              <div></div>
            </template>
          </div>

          <div class="card-bottom">
            <div class="info-item">
              <p class="title">规格：</p>
              <p class="content">{{ item.spec }}</p>
            </div>
            <div class="info-item">
              <p class="title">镜像：</p>
              <p class="content">{{ item.image }}</p>
            </div>
            <div class="info-item">
              <p class="title">特性：</p>
              <p class="content">{{ item.feature }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="footer">
      <template v-if="isfinshed">
        <!-- <o-button>关闭</o-button> -->
        <o-button type="primary" @click="openJupyter">查看jupyter</o-button>
      </template>

      <o-button
        v-else
        :disabled="isDisabled"
        type="primary"
        @click="startJupyter"
        >{{ buttonText }}</o-button
      >
    </div>
  </div>
</template>
<style lang="scss" scoped>
.develop-environment {
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    line-height: 22px;
    .title {
      font-size: 18px;
      line-height: 32px;
      color: #000000;
    }
    .time-remaining {
      color: #555555;
      min-width: 194px;
    }
  }
  .tip {
    font-size: 14px;
    line-height: 22px;
    color: #999999;
    margin-top: 8px;
  }
  .specifications {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 24px;
    margin-top: 24px;
    .specification-card {
      position: relative;
      height: 224px;
      border: 1px solid #d8d8d8;
      cursor: pointer;
      .card-inner {
        width: 100%;
        height: 100%;
        padding: 16px 24px;
        position: absolute;
        left: 0;
        top: 0;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .card-top {
          .specification-name {
            font-size: 18px;
            line-height: 32px;
            color: #000000;
          }
          .use-tip {
            font-size: 14px;
            line-height: 22px;
            color: #999999;
            margin-top: 8px;
          }
        }
        .card-bottom {
          .info-item {
            display: flex;
            margin-top: 16px;
            &:first-child {
              margin-top: 0;
            }
            .title {
              font-size: 14px;
              line-height: 22px;
              color: #555555;
              margin-right: 8px;
            }
            .content {
              font-size: 14px;
              line-height: 22px;
              color: #000000;
            }
          }
          .waiting-tip {
            font-size: 14px;
            line-height: 22px;
            color: #999999;
            text-align: center;
            padding-bottom: 84px;
          }
        }
      }
      .card-image {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
      }
      .price-tag,
      .waiting-tag {
        position: absolute;
        right: 0;
        top: 0;
        padding: 3px 8px;
        font-size: 12px;
        color: #ffffff;
        line-height: 14px;
        background: linear-gradient(326deg, #0d8dff 0%, #a5d4ff 100%);
      }
      .waiting-tag {
        background: linear-gradient(
          90deg,
          rgba(255, 193, 94, 0.5) 0%,
          #ffab3b 100%
        );
      }
    }
    .active {
      border: 1px solid #0d8dff;
    }
    .specification-card-disabled {
      cursor: no-drop !important;
    }
    .banned {
      cursor: default;
    }
  }

  .footer {
    margin-top: 40px;
    display: flex;
    justify-content: center;
  }
}
</style>
