<script setup>
import { ref, watch, computed, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import { handleMarkdown } from '@/shared/markdown';

import { useUserInfoStore } from '@/stores';

import IconPlus from '~icons/app/plus';
import IconAddFile from '~icons/app/add-file';
import IconFile from '~icons/app/project';

import RelateCard from '@/components/RelateCard.vue';
import NoRelate from '@/components/NoRelate.vue';

import { downloadObs, findFile } from '@/api/api-obs';
import { getGitlabFileRaw, getGitlabTree } from '@/api/api-gitlab';
import {
  addDataset,
  deleteDataset,
  modifyProjectAdd,
  addModel,
  deleteModel,
  modifyModelAdd,
  startInference,
  startInference2,
  stopInference,
  getGuide,
  getLog,
} from '@/api/api-project';
import { useFileData } from '@/stores';
import { ElMessage } from 'element-plus';
import { LOGIN_KEYS } from '@/shared/login';
// import project from '@/routers/project';
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

const DOMAIN = import.meta.env.VITE_DOMAIN;

const userInfo = useUserInfoStore();

const router = useRouter();
const route = useRoute();
let routerParams = router.currentRoute.value.params;

const mkit = handleMarkdown();

const codeString = ref('');
const codeString2 = ref('');
const result = ref();
const result2 = ref();
let README = '';
const detailData = computed(() => {
  return useFileData().fileStoreData;
});
const pushParams = {
  user: routerParams.user,
  name: routerParams.name,
  contents: routerParams.contents,
};

const i18n = {
  recentDownload: '近期下载量',
  dataset: '相关数据集',
  addDataset: '添加相关数据集',
  download: '下载量',
  uploadTime: '上传时间',
  relatedItem: '相关模型',
  addModel: '添加相关模型',
  editor: '编辑',
  uploadReadMe: [
    '当前无项目文件，点击',
    '新建README.md文件',
    '或',
    '上传README.md文件',
  ],
  emptyVisited: '无项目卡片',
  emptystart: '暂未启动项目',
};

const isShow = ref(false);
const isShow1 = ref(false);
const addSearch = ref('');

route.hash ? getReadMeFile() : '';

function addRelateClick() {
  isShow.value = true;
}
const emit = defineEmits(['on-click']);

// 训练数据集添加
function confirmAdd() {
  // 如果填写为空,提示
  if (addSearch.value === '') {
    ElMessage({
      type: 'error',
      message: '请输入拥有者/数据集',
    });
    return;
  }
  let params = {};
  let paramsArr = addSearch.value.split('/');

  if (
    addSearch.value.split('').indexOf('/') === -1 ||
    addSearch.value === '/'
  ) {
    ElMessage({
      type: 'error',
      message: '请按照(拥有者/模型名)格式输入',
    });
    return;
  } else if (paramsArr[0] === '') {
    ElMessage({
      type: 'error',
      message: '请输入用户名',
    });
    return;
  } else if (paramsArr[1] === '') {
    ElMessage({
      type: 'error',
      message: '请输入数据集名',
    });
    return;
  } else {
    params.owner = paramsArr[0];
    params.name = paramsArr[1];

    addDataset(params, detailData.value.owner, detailData.value.id)
      .then((res) => {
        if (res.data.length === 0) {
          ElMessage({
            type: 'error',
            message: '没有查询到数据！',
          });
          return;
        } else {
          // let modifyParams = {
          //   relate_infer_datasets: [],
          // };
          // detailData.value.relate_infer_datasets_list.forEach((item) => {
          //   modifyParams.relate_infer_datasets.push(item.id);
          // });
          // let projectId = detailData.value.id;
          // modifyParams.relate_infer_datasets.push(res.results.data[0].id);
          // modifyProjectAdd(modifyParams, projectId).then((res) => {
          //   if (res.status === 200) {
          ElMessage({
            type: 'success',
            message: '添加成功',
          });
          emit('on-click');
          isShow.value = false;
          addSearch.value = '';
          //   }
          // });
          // detailData.value.related_datasets.push(res.data);
        }
      })
      .catch((err) => {
        isShow.value = false;
        addSearch.value = '';
        ElMessage({
          type: 'error',
          message: '未查询到数据',
        });
      });
  }
}
// 模型添加
function confirmClick() {
  // 如果填写为空,提示-->return  TODO:提示
  if (addSearch.value === '') {
    ElMessage({
      type: 'error',
      message: '请输入拥有者/模型名',
    });
    return;
  }
  let params = {};
  let paramsArr = addSearch.value.split('/');
  if (
    addSearch.value.split('').indexOf('/') === -1 ||
    addSearch.value === '/'
  ) {
    ElMessage({
      type: 'error',
      message: '请按照(拥有者/模型名)格式输入',
    });
    return;
  } else if (paramsArr[0] === '') {
    ElMessage({
      type: 'error',
      message: '请输入用户名',
    });
    return;
  } else if (paramsArr[1] === '') {
    ElMessage({
      type: 'error',
      message: '请输入模型名',
    });
    return;
  } else {
    params.owner = paramsArr[0];
    params.name = paramsArr[1];
    addModel(params, detailData.value.owner, detailData.value.id)
      .then((res) => {
        // let modifyParams = {
        //   related_models: [],
        // };

        // detailData.value.related_models.forEach((item) => {
        //   modifyParams.related_models.push(item.id);
        // });

        // let projectId = detailData.value.id;
        // modifyParams.related_models.push(res.data.id);

        // modifyModelAdd(modifyParams, projectId).then((res) => {
        //   if (res.status === 200) {
        emit('on-click');
        isShow1.value = false;
        addSearch.value = '';
        //   }
        // });
      })
      .catch((err) => {
        isShow1.value = false;
        addSearch.value = '';
        ElMessage({
          type: 'error',
          message: '未查询到数据',
        });
      });
  }
}

// 删除关联仓库
function deleteClick(item) {
  // console.log(item);
  // let projectId = detailData.value.id;
  // let modifyParams = {
  //   relate_infer_datasets: [],
  // };
  // let modelParams = {
  //   relate_infer_models: [],
  // };
  if (item.type === 'dataset') {
    // detailData.value.relate_infer_datasets_list.forEach((child) => {
    //   if (item[0].id !== child.id) {
    //     modifyParams.relate_infer_datasets.push(child.id);
    //   }
    // });
    deleteDataset(
      { id: item.id, owner: item.owner.name },
      detailData.value.owner,
      detailData.value.id
    ).then((res) => {
      // if (res.status === 200) {
      ElMessage({
        type: 'success',
        message: '删除成功！你可再次添加相关数据集。',
      });
      emit('on-click');
      // }
    });
  } else if (item.type === 'model') {
    // detailData.value.relate_infer_models_list.forEach((child) => {
    //   if (item[0].id !== child.id) {
    //     modelParams.relate_infer_models.push(child.id);
    //   }
    // });
    deleteModel(
      { id: item.id, owner: item.owner.name },
      detailData.value.owner,
      detailData.value.id
    ).then((res) => {
      // if (res.status === 200) {
      ElMessage({
        type: 'success',
        message: '删除成功！你可再次添加相关模型。',
      });
      emit('on-click');
      // }
    });
  }
}

function addModeClick() {
  isShow1.value = true;
}
// 获取README文件
function getReadMeFile() {
  try {
    if (detailData.value.type === 'Gradio') {
      getGuide().then((tree) => {
        README = tree.data;
        codeString2.value = README;
        result2.value = mkit.render(codeString2.value);
      });
    } else {
      getGitlabTree({
        type: 'project',
        user: routerParams.user,
        path: '',
        id: detailData.value.id,
        name: routerParams.name,
      })
        .then((tree) => {
          README = tree?.data?.filter((item) => {
            return item.name === 'README.md';
          });
          if (README[0]) {
            getGitlabFileRaw({
              type: 'project',
              user: routerParams.user,
              path: 'README.md',
              id: detailData.value.repo_id,
              name: routerParams.name,
            }).then((res) => {
              res ? (codeString.value = res) : '';
              result.value = mkit.render(codeString.value);
            });
          } else {
            codeString.value = '';
          }
        })
        .catch((err) => {
          console.error(err);
        });
      /* findFile(
        `xihe-obj/projects/${route.params.user}/${routerParams.name}/`
      ).then((tree) => {
        if (
          tree.status === 200 &&
          tree.data.children &&
          tree.data.children.length
        ) {
          README = tree.data.children.filter((item) => {
            return item.name === 'README.md';
          });
          if (README[0]) {
            downloadObs(README[0].path).then((res) => {
              res ? (codeString.value = res) : '';
            });
            result.value = mkit.render(codeString.value);
          } else {
            codeString.value = '';
          }
        }
      }); */
    }
  } catch (error) {
    console.error(error);
  }
}
// 路由监听
watch(
  () => route,
  () => {
    if (route.name === 'projectCard' && !route.hash) {
      codeString.value = '';
      getReadMeFile();
    }
  },
  {
    deep: true,
    immediate: true,
  }
);
function goEditor() {
  pushParams.contents = ['README.md'];
  router.push({
    name: 'projectFileEditor',
    params: pushParams,
  });
}
function emptyClick(ind) {
  if (ind === 1) {
    router.push({
      name: 'projectFileNew',
      params: pushParams,
    });
  } else if (ind === 3) {
    router.push({
      name: 'projectFileUpload',
      params: pushParams,
    });
  }
}

function goDetailClick(val) {
  router.push(`/models/${val.owner.name}/${val.name}`);
}

function goDetasetClick(val) {
  router.push(`/datasets/${val.owner.name}/${val.name}`);
}

watch(
  () => codeString.value,
  (val) => {
    if (typeof val === 'number') {
      val = val.toString();
    }
    typeof val === 'string' ? '' : (val = '');
    codeString.value = val;
    result.value = mkit.render(codeString.value);
  }
);
const failLog = ref('');
const loading = ref(true);
// getLog(detailData.value.id).then((res) => {
//   if (res.data.data) {
//     failLog.value = res.data.data.replace(/\n/g, '<br>');
//     failLog.value = `<span> ${failLog.value}</span>`;
//   }
//   loading.value = true;
// });
//判断显示哪一个页面
const canStart = ref(false);
const msg = ref('未启动');
const hasPrefix = computed(() => {
  return msg.value === '启动中' ? true : false;
});
const clientSrc = ref('');
let timer = null;
// 游客启动推理
function start() {
  // startInference(detailData.value.id).then((res) => {
  //   if (res.data.status === 200) msg.value = '启动中';
  // socket.send(JSON.stringify({ pk: detailData.value.id }));
  // });
  socket.value = new WebSocket(
    `wss://${DOMAIN}/server/inference/project/${detailData.value.owner}/${detailData.value.id}`
  );
}
//拥有者启动推理
function start2() {
  // if (socket.value) {
  if (detailData.value.owner === userInfo.userName) {
    socket.value = new WebSocket(
      `wss://${DOMAIN}/server/inference/project/${detailData.value.owner}/${detailData.value.id}`,
      [getHeaderConfig().headers['private-token']]
    );
    // socket.value.onopen = function () {
    //   console.log('连接成功');
    // };
    socket.value.onmessage = function (event) {
      console.log('111', JSON.parse(event.data));
      if (
        JSON.parse(event.data).data &&
        JSON.parse(event.data).data.access_url
      ) {
        clientSrc.value = JSON.parse(event.data).data.access_url;
        msg.value = '运行中';
        closeConn();
      } else {
        failLog.value = JSON.parse(event.data).data.error.replace(
          /\n/g,
          '<br />'
        );
        failLog.value = `<span> ${failLog.value}</span>`;
        msg.value = '启动失败';
        closeConn();
      }
    };
    // startInference2({
    //   owner: detailData.value.owner,
    //   pid: detailData.value.id,
    // }).then((res) => {
    // if (res.data.status === 200) {
    msg.value = '启动中';
    // }
    // socket.send(JSON.stringify({ pk: detailData.value.id }));
    // });
  } else {
    socket.value = new WebSocket(
      `wss://${DOMAIN}/server/inference/project/${detailData.value.owner}/${detailData.value.id}`,
      [`visitor-${detailData.value.id}`]
    );
    socket.value.onmessage = function (event) {
      if (
        JSON.parse(event.data).data &&
        JSON.parse(event.data).data.access_url
      ) {
        clientSrc.value = JSON.parse(event.data).data.access_url;
        msg.value = '运行中';
        closeConn();
      } else {
        msg.value = '未启动';
        canStart.value = false;
        closeConn();
      }
    };
    msg.value = '启动中';
  }
  // } else {
  //   socket.value = new WebSocket(`wss://${DOMAIN}/wss/inference`);
  //   socket.value.onopen = function () {
  //     socket.value.send(JSON.stringify({ pk: detailData.value.id }));
  //     clearInterval(timer);
  //     timer = setInterval(() => {
  //       socket.value.send(JSON.stringify({ pk: detailData.value.id }));
  //     }, 10000);
  //   };
  //   startInference2(detailData.value.id).then((res) => {
  //     if (res.data.status === 200) msg.value = '启动中';
  //     // socket.send(JSON.stringify({ pk: detailData.value.id }));
  //   });
  //   socket.value.onmessage = function (event) {
  //     msg.value = JSON.parse(event.data).msg;
  //     if (!!JSON.parse(event.data).data) {
  //       failLog.value = '';
  //       clientSrc.value = JSON.parse(event.data).data.url;
  //       closeConn(); //断开连接
  //     } else {
  //       if (
  //         JSON.parse(event.data).msg === '启动失败' ||
  //         JSON.parse(event.data).msg === '文件收集失败'
  //       ) {
  //         msg.value = '启动失败';
  //         closeConn(); //断开连接
  //         stopInference(detailData.value.id); //删除任务
  //         // if (failLog.value) {
  //         loading.value = false;
  //         getLog(detailData.value.id).then((res) => {
  //           if (res.data.data) {
  //             failLog.value = res.data.data.replace(/\n/g, '<br>');
  //             failLog.value = `<span> ${failLog.value}</span>`;
  //           }
  //           loading.value = true;
  //         });
  //         // }
  //         ElMessage({
  //           type: 'error',
  //           message: JSON.parse(event.data).msg + '，请检查文件后重试',
  //         });
  //       } else if (JSON.parse(event.data).msg === '任务已销毁') {
  //         stopInference(detailData.value.id); //删除任务
  //         ElMessage({
  //           type: 'error',
  //           message: '当前任务已结束，请重新启动',
  //         });
  //       }
  //     }
  //   };
  // }
}

//停止推理
function stop() {
  // stopInference(detailData.value.id).then(() => {
  // socket.value.send(JSON.stringify({ pk: detailData.value.id }));
  closeConn();
  // clearInterval(timer);
  msg.value = '';
  // });
}
const socket = ref(null);

//拥有者判断是否有app.py，非拥有者判断启动状态
canStart.value = true;
if (detailData.value.owner === userInfo.userName) {
  console.log(detailData.value.owner, userInfo.userName);
  // findFile(`xihe-obj/projects/${route.params.user}/${routerParams.name}/inference/app.py`)
  getGitlabTree({
    type: 'project',
    user: routerParams.user,
    path: 'inference',
    id: detailData.value.id,
    name: routerParams.name,
  }).then((res) => {
    console.log(res);
    let apppy = res?.data?.filter((item) => {
      return item.name === 'app.py';
    });
    if (apppy) {
      try {
        canStart.value = true;
        // if (detailData.value.type === 'Gradio' && canStart.value) {
        //   socket.value = new WebSocket(
        //     `wss://${DOMAIN}/server/inference/project/${detailData.value.owner}/${detailData.value.id}`
        //   );
        //   socket.value.onopen = function () {
        //     // socket.value.send(JSON.stringify({ pk: detailData.value.id }));
        //     // clearInterval(timer);
        //     // timer = setInterval(() => {
        //     //   socket.value.send(JSON.stringify({ pk: detailData.value.id }));
        //     // }, 10000);
        //     console.log('连接成功');
        //   };
        //   socket.value.onmessage = function (event) {
        //     console.log(event);
        //     msg.value = JSON.parse(event.data).msg;
        //     if (!!JSON.parse(event.data).data) {
        //       failLog.value = '';
        //       clientSrc.value = JSON.parse(event.data).data.url;
        //       closeConn(); //断开连接
        //     } else {
        //       if (
        //         JSON.parse(event.data).msg === '启动失败' ||
        //         JSON.parse(event.data).msg === '文件收集失败'
        //       ) {
        //         msg.value = '启动失败';
        //         closeConn(); //断开连接
        //         stopInference(detailData.value.id); //删除任务
        //         // if (failLog.value) {
        //         loading.value = false;
        //         getLog(detailData.value.id).then((res) => {
        //           if (res.data.data) {
        //             failLog.value = res.data.data.replace(/\n/g, '<br>');
        //             failLog.value = `<span> ${failLog.value}</span>`;
        //           }
        //           loading.value = true;
        //         });
        //         // }
        //         ElMessage({
        //           type: 'error',
        //           message: '程序错误，请检查文件后重试',
        //         });
        //       } else if (JSON.parse(event.data).msg === '任务已销毁') {
        //         stopInference(detailData.value.id); //删除任务
        //         closeConn(); //断开连接
        //         ElMessage({
        //           type: 'error',
        //           message: '当前任务已结束，请重新启动',
        //         });
        //       } //else if (JSON.parse(event.data).msg === '未启动') {
        //       //closeConn(); //断开连接
        //       // }
        //     }
        //   };
        // }
      } catch {
        console.log('canStart', canStart.value);
      }
    }
  });
} else {
  // if (detailData.value.status_name === '可运行') {
  // socket.value = new WebSocket(
  //   `wss://${DOMAIN}/server/inference/project/${detailData.value.owner}/${detailData.value.id}`
  // );
  // socket.value.onopen = function () {
  // socket.value.send(
  //   JSON.stringify({ pk: detailData.value.id, user_type: 'guest' })
  // );
  // clearInterval(timer);
  // timer = setInterval(() => {
  //   socket.value.send(
  //     JSON.stringify({ pk: detailData.value.id, user_type: 'guest' })
  //   );
  // }, 10000);
  //   console.log('连接成功');
  // };
  // socket.value.onmessage = function (event) {
  //   console.log(event);
  // msg.value = JSON.parse(event.data).msg;
  // if (!!JSON.parse(event.data).data) {
  //   clientSrc.value = JSON.parse(event.data).data.url;
  //   closeConn(); //断开连接
  // } else {
  //   if (JSON.parse(event.data).msg === '未启动') {
  //     start();
  //   } else if (JSON.parse(event.data).msg === '任务已销毁') {
  //     stopInference(detailData.value.id).then((res) => {
  //       if (res.data.status === 200) {
  //         ElMessage({
  //           type: 'error',
  //           message: '当前任务已结束，正在准备重启',
  //         });
  //         start();
  //       }
  //     }); //删除任务
  //   }
  // }
  // };
  // }
}

// if (socket.value) {
// debugger;
// socket.value.onmessage = function (event) {
//   msg.value = JSON.parse(event.data).msg;
//   if (!!JSON.parse(event.data).data) {
//     clientSrc.value = JSON.parse(event.data).data.url;
//     closeConn(); //断开连接
//   } else if (detailData.value.is_owner) {
//     if (
//       JSON.parse(event.data).msg === '启动失败' ||
//       JSON.parse(event.data).msg === '文件收集失败'
//     ) {
//       stopInference(detailData.value.id); //删除任务
//       ElMessage({
//         type: 'error',
//         message: JSON.parse(event.data).msg + '，请检查文件后重试',
//       });
//     } else if (JSON.parse(event.data).msg === '任务已销毁') {
//       stopInference(detailData.value.id); //删除任务
//       ElMessage({
//         type: 'error',
//         message: '当前任务已结束，请重新启动',
//       });
//     }
//   } else {
//     if (JSON.parse(event.data).msg === '未启动') {
//       start();
//     } else if (JSON.parse(event.data).msg === '任务已销毁') {
//       stopInference(detailData.value.id); //删除任务
//       ElMessage({
//         type: 'error',
//         message: '当前任务已结束，正在准备重启',
//       });
//     }
//   }
// };
// }
function closeConn() {
  if (socket.value) {
    socket.value.close(); // 向服务端发送断开连接的请求
    // clearInterval(timer);
    // socket.value = null;
  }
}
onUnmounted(() => {
  closeConn();
});
// let ht = setInterval(getHeight, 100);

// function getHeight() {
//   if (document.readyState === 'complete') {
//     let height = document.body.scrollHeight + 'px';
//     // console.log(height);

//     $('parentdiv', window.parent.document).css('height', height);

//     window.clearInterval(ht);
//   }
// }
// console.log(detailData);
</script>
<template>
  <div v-if="detailData" class="model-card">
    <div v-if="detailData.type === 'Gradio' && loading" class="left-data2">
      <div v-if="msg === '运行中'" class="markdown-body">
        <iframe
          :src="clientSrc"
          width="100%"
          height="100%"
          frameborder="0"
          :style="{ height: hasPrefix ? '100%' : '800px' }"
        ></iframe>
        <o-button status="error" @click="stop">停止</o-button>
      </div>
      <div v-else-if="msg === '启动中'" class="markdown-body">
        <div class="loading">
          <img src="@/assets/gifs/loading.gif" alt="" />
          <p>启动大约需要5分钟,请耐心等待</p>
        </div>
        <o-button status="error" @click="stop">停止</o-button>
      </div>
      <div
        v-else-if="
          (msg === '未启动' || '启动失败') && failLog && detailData.is_owner
        "
        class="markdown-body"
      >
        <div class="fail">
          <div class="fail-title">推理启动日志</div>
          <div class="fail-body">
            <div>
              启动失败，推理启动日志如下，你可以根据推理日志的提示更改gradio相关文件
            </div>
          </div>
          <div class="fail-log">
            <div v-html="failLog"></div>
          </div>
        </div>
        <o-button v-if="detailData.is_owner" type="primary" @click="start2"
          >重新启动</o-button
        >
      </div>
      <div v-else-if="detailData.is_owner" class="markdown-body">
        <div class="markdown-file" v-html="result2"></div>
        <o-button type="primary" :disabled="!canStart" @click="start2"
          >启动</o-button
        >
      </div>
      <div v-else class="upload-readme markdown-body">
        <o-button type="primary" :disabled="!canStart" @click="start2"
          >启动</o-button
        >
        <div class="upload-readme-img">
          <o-icon> <icon-file></icon-file> </o-icon>
        </div>
        <div class="upload-readme-tip">
          <p>
            {{ i18n.emptystart }}
          </p>
        </div>
      </div>
    </div>
    <div v-else class="left-data1">
      <div v-if="codeString" class="markdown-body">
        <div v-highlight class="markdown-file" v-html="result"></div>
        <o-button v-if="detailData.is_owner" @click="goEditor">{{
          i18n.editor
        }}</o-button>
      </div>
      <div v-else-if="detailData.is_owner" class="upload-readme markdown-body">
        <div class="upload-readme-img">
          <o-icon> <icon-add-file></icon-add-file> </o-icon>
        </div>
        <div class="upload-readme-tip">
          <p
            v-for="(item, index) in i18n.uploadReadMe"
            :key="item"
            :class="{ 'link-style': index === 1 || index === 3 }"
            @click="emptyClick(index)"
          >
            {{ item }}
          </p>
        </div>
      </div>
      <div v-else class="upload-readme markdown-body">
        <div class="upload-readme-img">
          <o-icon> <icon-file></icon-file> </o-icon>
        </div>
        <div class="upload-readme-tip">
          <p>
            {{ i18n.emptyVisited }}
          </p>
        </div>
      </div>
    </div>
    <div v-if="loading" class="right-data">
      <div class="download-data">
        <h4 class="download-title">{{ i18n.recentDownload }}</h4>
        <span class="download-count">{{ detailData.download_count }}</span>
      </div>
      <!-- 添加数据集 -->
      <div class="dataset-data">
        <div class="add-title">
          <h4 class="title">{{ i18n.dataset }}</h4>
          <p
            v-if="userInfo.userName === detailData.owner"
            class="add"
            @click="addRelateClick"
          >
            {{ i18n.addDataset }} <o-icon><icon-plus></icon-plus></o-icon>
          </p>
        </div>
        <div class="dataset-box">
          <relate-card
            v-if="detailData.related_datasets"
            :detail-data="detailData.related_datasets"
            :name="'related_datasets'"
            @delete="deleteClick"
            @jump="goDetasetClick"
          ></relate-card
          ><no-relate v-else :relate-name="'dataset'"></no-relate>
        </div>
      </div>
      <!-- 添加模型 -->
      <div class="related-project">
        <div class="add-title">
          <h4 class="title">{{ i18n.relatedItem }}</h4>
          <p
            v-if="userInfo.userName === detailData.owner"
            class="add"
            @click="addModeClick"
          >
            {{ i18n.addModel }} <o-icon><icon-plus></icon-plus></o-icon>
          </p>
        </div>
        <relate-card
          v-if="detailData.related_models"
          :detail-data="detailData.related_models"
          :name="'related_models'"
          @delete="deleteClick"
          @jump="goDetailClick"
        ></relate-card>
        <no-relate v-else :relate-name="'model'"></no-relate>
      </div>
    </div>

    <!-- 添加数据集 -->
    <el-dialog
      v-model="isShow"
      :title="i18n.addDataset"
      width="30%"
      destroy-on-close
      :show-close="false"
      center
    >
      <el-form>
        <el-form-item label="拥有者/数据集名称">
          <el-input
            v-model="addSearch"
            placeholder="你可以直接复制拥有者/数据集名称进行输入"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <o-button style="margin-right: 38px" @click="isShow = false"
            >取消</o-button
          >
          <o-button type="primary" @click="confirmAdd">确定</o-button>
        </span>
      </template>
    </el-dialog>
    <!-- 添加模型 -->
    <el-dialog
      v-model="isShow1"
      :title="i18n.addModel"
      width="30%"
      destroy-on-close
      :show-close="false"
      center
    >
      <el-form>
        <el-form-item label="拥有者/模型名称">
          <el-input
            v-model="addSearch"
            placeholder="你可以直接复制拥有者/模型名称进行输入"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer" style="padding-bottom: 48">
          <o-button style="margin-right: 38px" @click="isShow1 = false"
            >取消</o-button
          >
          <o-button type="primary" @click="confirmClick">确定</o-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
:deep .el-overlay-dialog {
  top: 100px;
}
:deep .el-dialog {
  min-height: 292px !important;
  width: 800px;
  .el-dialog__header {
    padding-top: 40px !important;
    padding-bottom: 15px !important;
    .el-dialog__title {
      font-size: 24px;
      line-height: 32px;
    }
  }
  .el-dialog__body {
    display: flex;
    justify-content: center;
  }
}
.model-card {
  display: flex;
  padding-bottom: 40px;
  min-height: calc(100vh - 340px);
  background-color: #f5f6f8;
  .markdown-body {
    .fail {
      &-title {
        padding-top: 64px; //内容在按钮下16px
        font-size: 24px;
      }
      &-body {
        margin-top: 16px;
        display: flex;
        font-size: 14px;
        a {
          color: #0d8dff;
        }
      }
      &-log {
        max-width: 100%;
        margin-top: 16px;
        margin-right: 48px;
        padding: 24px;
        background-color: #e9f0f8;
        font-size: 14px;
        line-height: 22px;
        word-break: break-all;
      }
    }
    iframe {
      padding-top: 64px; //内容在按钮下16px
      height: 666px;
    }
    .markdown-file {
      padding-right: 48px;
    }
    position: relative;
    // margin-right: 40px;
    // width: 100%;
    // border-right: 1px solid #d8d8d8;
    height: 100%;
    .o-button {
      position: absolute;
      top: 0;
      right: 0;
      margin-right: 48px;
    }
    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      img {
        width: 56px;
      }
      p {
        font-size: 18px;
        color: #555555;
        margin-top: 19px;
      }
    }
  }
  .upload-readme {
    display: flex;
    flex-direction: column;
    align-items: center;
    // justify-content: center;
    font-size: 14px;
    max-height: 700px;
    .upload-readme-img {
      margin-top: 205px;
      .o-icon {
        display: block;
      }
      font-size: 48px;
    }
    .upload-readme-tip {
      display: flex;
      margin-top: 24px;
      line-height: 17px;
      color: #999;
      .link-style {
        cursor: pointer;
        color: #33b3ff;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
  .left-data1 {
    margin-right: 40px;
    width: 100%;
    border-right: 1px solid #d8d8d8;
  }
  .left-data2 {
    margin-right: 40px;
    width: 100%;
    border-right: 1px solid #d8d8d8;
  }
  .right-data {
    max-width: 425px;
    width: 100%;
    color: #000;
    .download-data {
      .download-title {
        margin-bottom: 8px;
        font-size: 16px;
        color: #555;
      }
      .download-count {
        font-size: 18px;
        color: #000;
      }
    }
    .card-top {
      display: flex;
      padding-bottom: 14px;

      .portrait {
        width: 24px;
        height: 24px;
        border-radius: 100%;
        background-color: #33ffcc;
        margin-right: 8px;
      }
    }

    .no-data-box {
      width: 100%;
      height: 104px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      color: #999;
      .o-icon {
        margin-right: 8px;
        font-size: 32px;
      }
    }
    .dataset-data {
      .dataset-box {
        cursor: pointer;
        display: grid;
        grid-template-columns: repeat(1, minmax(200px, 1fr));
        column-gap: 24px;
        row-gap: 24px;
        // margin-top: 24px;
        .dataset-item {
          // max-width: 424px;
          width: 100%;
          padding: 24px;
          background-color: #fff;
          box-shadow: 0px 1px 5px 0px rgba(45, 47, 51, 0.1);
          position: relative;
          &:hover {
            box-shadow: 0px 6px 18px 0px rgba(13, 141, 255, 0.14);
            .remove-item {
              display: block;
            }
          }
          .remove-item {
            position: absolute;
            right: 8px;
            top: 8px;
            display: none;
          }
          .dataset-top {
            margin-bottom: 14px;
          }
          .dataset-bottom {
            display: flex;
            justify-content: start;
            align-items: center;
            & > div {
              display: flex;
              align-items: center;
              margin-right: 24px;
              span {
                font-size: 20px;
                padding-right: 4px;
              }
            }
          }
        }
      }
    }
    .add-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .title {
      margin: 48px 0 24px;
      font-size: 18px;
      line-height: 24px;
    }
    .add {
      margin: 48px 0 24px;
      font-size: 12px;
      line-height: 24px;
      color: #0d8dff;
      display: flex;
      align-items: center;
      cursor: pointer;
      .o-icon {
        margin-left: 4px;
        font-size: 12px;
      }
    }
  }
}
</style>
