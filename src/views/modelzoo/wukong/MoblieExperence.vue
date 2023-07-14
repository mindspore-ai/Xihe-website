<script setup>
import { ref, computed, nextTick, onUnmounted, watch } from 'vue';

import html2canvas from 'html2canvas';

import style from '@/assets/imgs/wukong/style/style.png';
import style1 from '@/assets/imgs/wukong/style/style1.png';
import style2 from '@/assets/imgs/wukong/style/style2.png';
import style3 from '@/assets/imgs/wukong/style/style3.png';
import style4 from '@/assets/imgs/wukong/style/style4.png';
import style5 from '@/assets/imgs/wukong/style/style5.png';
import style6 from '@/assets/imgs/wukong/style/style6.png';
import style7 from '@/assets/imgs/wukong/style/style7.png';
import style8 from '@/assets/imgs/wukong/style/style8.png';
import style9 from '@/assets/imgs/wukong/style/style9.png';
import style10 from '@/assets/imgs/wukong/style/style10.png';
import style11 from '@/assets/imgs/wukong/style/style11.png';
import style12 from '@/assets/imgs/wukong/style/style12.png';
import style13 from '@/assets/imgs/wukong/style/style13.png';
import style14 from '@/assets/imgs/wukong/style/style14.png';
import style15 from '@/assets/imgs/wukong/style/style15.png';
import style16 from '@/assets/imgs/wukong/style/style16.png';
import style17 from '@/assets/imgs/wukong/style/style17.png';
import style18 from '@/assets/imgs/wukong/style/style18.png';
import style19 from '@/assets/imgs/wukong/style/style19.png';
import style20 from '@/assets/imgs/wukong/style/style20.png';
import loading from '@/assets/gifs/loading.gif';
import wukongbg from '@/assets/imgs/wukong/wukong-bg1.png';
import warning from '@/assets/imgs/wukong/warning.png';
import viewAllImg from '@/assets/imgs/wukong/style/view-all.png';

import IconRefresh from '~icons/app/refresh-taichu';
import IconLike from '~icons/app/heart-gray';
import IconX from '~icons/app/x';
import IconHeart from '~icons/app/collected';
import IconCancel from '~icons/app/eye-close';
import IconArrow from '~icons/app/eye-open';
import IconShare from '~icons/app/share-gray';
import IconCopy from '~icons/app/copy-nickname';
import IconAlbum from '~icons/app/wukong-album';
import IconPainting from '~icons/app/painting';
import IconArrowRight from '~icons/app/arrow-right.svg';
import { goAuthorize } from '@/shared/login';
import { useLoginStore, useUserInfoStore } from '@/stores';

import writeToClipboard from '@/shared/hooks/writeToClipboard.js';
import {
  wuKongInfer,
  addLikePicture,
  cancelLikePicture,
  temporaryLink,
  publicTemporaryPicture,
  cancelPublic,
  getPic,
} from '@/api/api-modelzoo.js';
import { getHeaderConfig } from '@/shared/login';
import { ElMessage } from 'element-plus';
import useWindowResize from '@/shared/hooks/useWindowResize.js';
import { useRouter } from 'vue-router';
import { ArrowRight } from '@element-plus/icons-vue';
const DOMAIN = import.meta.env.VITE_DOMAIN;
const screenWidth = useWindowResize();
const isLogined = computed(() => useLoginStore().isLogined);
const userInfoStore = useUserInfoStore();
const router = useRouter();

const inputText = ref('');
const sortTag = ref('');
const styleIndex = ref(0);
const showInferDlg = ref(false);
const isInferred = ref(false);
const isError = ref(false);
const styleBackground = ref([]);
const styleBackground1 = ref([]);
const randomList = ref([
  { tag: '巴洛克', isSelected: false, img: style1 },
  { tag: '毕加索', isSelected: false, img: style2 },
  { tag: '达芬奇', isSelected: false, img: style3 },
  { tag: '梵高', isSelected: false, img: style5 },
  { tag: '浮世绘', isSelected: false, img: style6 },
  { tag: '宫崎骏', isSelected: false, img: style7 },
  { tag: '国风', isSelected: false, img: style8 },
  { tag: '莫奈', isSelected: false, img: style9 },
  { tag: '赛博朋克', isSelected: false, img: style10 },
  { tag: '水彩', isSelected: false, img: style11 },
  { tag: '田园', isSelected: false, img: style12 },
  { tag: '涂鸦', isSelected: false, img: style13 },
  { tag: '现代主义', isSelected: false, img: style14 },
  { tag: '像素风', isSelected: false, img: style15 },
  { tag: '写实', isSelected: false, img: style16 },
  { tag: '新海城', isSelected: false, img: style17 },
  { tag: '印象主义', isSelected: false, img: style18 },
  { tag: '油画', isSelected: false, img: style19 },
  { tag: '蒸汽波', isSelected: false, img: style20 },
  { tag: '动漫', isSelected: false, img: style4 },
]);
const newStyleData = ref([]);
const isAllStyle = ref(false);
newStyleData.value = randomList.value.slice(0, 10);
newStyleData.value.unshift(
  randomList.value[Math.floor(Math.random() * randomList.value.length)]
);
newStyleData.value[0].tag1 = '随机风格';
newStyleData.value[0].img1 = style;
function retract() {
  isAllStyle.value = false;
  newStyleData.value = newStyleData.value.slice(0, 11);
}
function viewAll() {
  isAllStyle.value = !isAllStyle.value;
  newStyleData.value = newStyleData.value.concat(randomList.value.slice(10));
}
const isWaiting = ref(false);
const isLine = ref(null);
const errorMsg = ref('');
const exampleData = ref([
  { text: '秋水共长天一色', isSelected: false },
  { text: '城市夜景', isSelected: false },
]);
const isLarge = ref(false);
const largeIndex = ref(null);

const posterDlg = ref(false);
const posterLink = ref('');
const posterInfo = ref('');
const userAvatar = ref('');
const imgQuantity = ref(4);
const inferList = ref([
  { isCollected: false, id: '', publicId: '' },
  { isCollected: false, id: '', publicId: '' },
  { isCollected: false, id: '', publicId: '' },
  { isCollected: false, id: '', publicId: '' },
]);

nextTick(() => {
  let bgImg = document.getElementById('app');
  bgImg.style.background = `url(${wukongbg})`;
  bgImg.style.backgroundSize = 'cover';
  bgImg.children[1].style.background = 'unset';
  bgImg.children[2].style.backgroundColor = 'unset';
});
onUnmounted(() => {
  let bgImg = document.getElementById('app');
  bgImg.children[1].style.backgroundColor = '#F5F6F8';
  bgImg.children[2].style.backgroundColor = '#F5F6F8';
});
const routeList = [
  {
    name: 'AI画集',
    path: '/modelzoo/wukong/album',
    icon: IconAlbum,
  },
  {
    name: '画作管理',
    path: '/modelzoo/wukong/admin',
    icon: IconPainting,
  },
];
function goPath(val) {
  router.push(val);
}
// 给生成图片加文字水印
function addWatermark(imgUrl, index) {
  const img = new Image();
  img.crossOrigin = 'Anonymous';
  img.src = imgUrl;
  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, img.width, img.height);
    ctx.font = '24px 微软雅黑';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('由AI模型生成', img.width - 182, img.height - 24);
    styleBackground.value[index] = canvas.toDataURL('image/png');
    return styleBackground.value[index];
  };
}

let token = getHeaderConfig().headers
  ? getHeaderConfig().headers['csrf-token']
  : null;

function handlePic(styleBackground, styleBackground1) {
  temporaryLink({ link: styleBackground.value[0].link }).then((res) => {
    styleBackground1.value[0] = res.data.data.link;
    addWatermark(res.data.data.link, 0);
    temporaryLink({ link: styleBackground.value[1].link }).then((res) => {
      styleBackground1.value[1] = res.data.data.link;
      addWatermark(res.data.data.link, 1);
      if (styleBackground.value.length === 4) {
        temporaryLink({
          link: styleBackground.value[2].link,
        }).then((res) => {
          styleBackground1.value[2] = res.data.data.link;
          addWatermark(res.data.data.link, 2);
          temporaryLink({
            link: styleBackground.value[3].link,
          }).then((res) => {
            styleBackground1.value[3] = res.data.data.link;
            addWatermark(res.data.data.link, 3);
          });
        });
      }
    });
  });
}

let socket;
if (isLogined.value) {
  socket = new WebSocket(`wss://${DOMAIN}/server/bigmodel/wukong/rank`, [
    token,
  ]);
  socket.onmessage = function (event) {
    try {
      isLine.value = JSON.parse(event.data).data.rank;
      if (JSON.parse(event.data).data.rank === 0) {
        getPic()
          .then((res) => {
            isLine.value = null;
            styleBackground.value = res.data;
            styleBackground.value.forEach((item, index) => {
              inferList.value[index].isCollected = item.is_like;
              inferList.value[index].id = item.like_id;
              inferList.value[index].publicId = item.public_id;
            });

            const index1 = styleBackground.value[0].link.indexOf('=');
            const index2 = styleBackground.value[0].link.indexOf(
              '=',
              index1 + 1
            );

            const i1 = styleBackground.value[0].link.indexOf('&');
            const i2 = styleBackground.value[0].link.indexOf('&', i1 + 1);

            const deadTime = styleBackground.value[0].link.substring(
              index2 + 1,
              i2
            );
            const currentTime = (new Date().getTime() + '').substring(0, 10);

            if ((deadTime - currentTime) / 60 < 60) {
              handlePic(styleBackground, styleBackground1);
            }
          })
          .catch((err) => {
            isWaiting.value = false;
            isLine.value = null;
            if (err.response.data.code === 'bigmodel_no_wukong_picture') {
              errorMsg.value = '';
            } else if (err.response.data.code === 'bigmodel_sensitive_info') {
              errorMsg.value = '内容不合规，请重新输入描述词';
            }
            isInferred.value = true;
            isError.value = true;
          });
      }
    } catch (err) {
      ElMessage({
        type: 'error',
        message: 'error',
      });
    }
  };
}

watch(
  () => {
    return screenWidth.value;
  },
  (val) => {
    if (val > 820) {
      showInferDlg.value = false;
    }
  }
);
const lists = ref([
  { text: '城市夜景 油画', isSelected: false },
  { text: '星空 梵高', isSelected: false },
  { text: '落日 莫奈', isSelected: false },
  { text: '抽烟的女人 毕加索', isSelected: false },
  { text: '教堂 巴洛克风格', isSelected: false },
  { text: '程序员 头像 像素风格', isSelected: false },
  { text: '城市夜景 赛博朋克 格雷格.鲁特科夫斯基', isSelected: false },
  { text: '都市 天际线 日出', isSelected: false },
  { text: '天气播报 背景 云', isSelected: false },
  { text: '海滩 美景 高清', isSelected: false },
  { text: '沙漠 美景 高清', isSelected: false },
  { text: '森林 落叶 美景 高清', isSelected: false },
  { text: '悬崖 美景 壮观 高清', isSelected: false },
  { text: '时空 黑洞 辐射', isSelected: false },
  { text: '西湖 烟雨', isSelected: false },
  { text: '山水 水墨 写意', isSelected: false },
  { text: '温馨的森林木屋', isSelected: false },
  { text: '空山新雨后', isSelected: false },
  { text: '小桥流水人家', isSelected: false },
  { text: '飞流直下三千尺，疑是银河落九天', isSelected: false },
  { text: '永无夜晚铜锣湾', isSelected: false },
  { text: '上海陆家嘴 未来城市 科幻风格', isSelected: false },
  { text: '梅花香自苦寒来', isSelected: false },
  { text: '北极圈极夜前的最后一次日落', isSelected: false },
  { text: '星河欲坠时', isSelected: false },
  { text: '北国风光', isSelected: false },
  { text: '花海 城堡 卡通', isSelected: false },
  { text: '猫咪 可爱', isSelected: false },
  { text: '有山有水有点田', isSelected: false },
  { text: '星空 高清', isSelected: false },
  { text: '重峦叠嶂 山水画', isSelected: false },
]);
const showConfirmDlg = ref(false);

userAvatar.value = userInfoStore.avatar;
// 公开图片
async function publicImage(val, index) {
  try {
    const res = await publicTemporaryPicture({
      obspath: decodeURIComponent(
        styleBackground1.value[index].split('?')[0].split('443/')[1]
      ),
    });
    if (res.data) {
      inferList.value[index].publicId = res.data.data.id;

      ElMessage({
        offset: 64,
        type: 'success',
        message: '公开成功，可在画作管理中查看',
      });
    }
    showConfirmDlg.value = false;
  } catch (err) {
    showConfirmDlg.value = false;
  }
}
// 取消公开
async function cancelPublicImage(i) {
  try {
    await cancelPublic(inferList.value[i].publicId);
    inferList.value[i].publicId = '';
    ElMessage({
      offset: 64,
      type: 'success',
      message: '已取消公开',
    });
  } catch (err) {
    ElMessage({
      type: 'error',
      message: 'error',
    });
  }
}
// 分享图片
const isSharedPoster = ref(false);
const shareImg = ref('');
function shareImage(url) {
  posterDlg.value = true;
  posterLink.value = url;
  posterInfo.value = inputText.value + '  ' + sortTag.value;
  if (posterInfo.value === '  ') {
    posterInfo.value = decodeURIComponent(
      styleBackground1.value[1].split('?')[0].split('/')[8]
    ).split('-01.jpg')[0];
  }
  if (screenWidth.value <= 820) {
    nextTick(() => {
      const poster = document.querySelector('#screenshot');
      html2canvas(poster, {
        useCORS: true,
      }).then((canvas) => {
        shareImg.value = canvas.toDataURL('image/png');
        isSharedPoster.value = true;
      });
    });
  }
}

// 下载海报截图
function downloadPoster() {
  const poster = document.querySelector('#screenshot');
  html2canvas(poster, {
    useCORS: true,
  }).then((val) => {
    let url = val.toDataURL('image/png');
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = url;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      // 绘制圆角矩形（使用 arcTo）
      let radius = 22;
      ctx.save(); // 保存当前环境的状态
      ctx.beginPath(); // 重置当前路径
      ctx.moveTo(0 + radius, 0); // 移动到左上角
      ctx.arcTo(0 + img.width, 0, 0 + img.width, 0 + radius, radius); // 绘制右上角
      ctx.arcTo(
        0 + img.width,
        0 + img.height,
        0 + img.width - radius,
        0 + img.height,
        radius
      ); // 绘制右下角
      ctx.arcTo(0, img.height, 0, img.height - radius, radius); // 绘制左下角
      ctx.arcTo(0, 0, 0 + radius, 0, radius); // 绘制左上角
      ctx.fill(); // 填充当前路径
      ctx.clip(); // 对矩形进行剪切
      ctx.drawImage(img, 0, 0, img.width, img.height); // 绘制图片
      const posterLink = canvas.toDataURL('image/png');
      let aLink = document.createElement('a');
      aLink.style.display = 'none';
      aLink.href = posterLink;
      aLink.download = 'poster.png';
      aLink.click();
      aLink.remove();
    };
  });
}
// 海报蒙层关闭事件
function handlePosterDlgClose() {
  posterLink.value = '';
  isSharedPoster.value = false;
}
// 复制用户名
async function copyText(textValue) {
  await writeToClipboard(textValue);
  ElMessage({
    offset: 64,
    type: 'success',
    message: '复制成功',
    center: true,
  });
}
// 选择样例
function exampleSelectHandler(item) {
  exampleData.value.forEach((item) => {
    item.isSelected = false;
  });
  item.isSelected = true;
  inputText.value = item.text;
}
// 清除输入样例
function clearInputText() {
  inputText.value = '';

  exampleData.value.forEach((item) => {
    item.isSelected = false;
  });
}
function handleInput() {
  exampleData.value.forEach((item) => {
    if (item.text === inputText.value) {
      item.isSelected = true;
    } else {
      item.isSelected = false;
    }
  });
}
const activeIndex = ref(null);
// 选择风格类别
function choseStyleSort(val, item) {
  activeIndex.value = val;
  styleIndex.value = val;
  item.isSelected = !item.isSelected;
  if (val === 0 && item.isSelected === false) {
    newStyleData.value[0] =
      randomList.value[Math.floor(Math.random() * randomList.value.length)];
    newStyleData.value[0].tag1 = '随机风格';
    newStyleData.value[0].img1 = style;
  }
}
// 初始化推理数据
function initData() {
  sortTag.value = '';
  styleBackground.value = [];
  exampleData.value.forEach((item) => {
    item.isSelected = false;
  });
}
// wk推理
const inferDisabled = ref(false);
async function handleInfer() {
  if (!isLogined.value) {
    goAuthorize();
  } else {
    if (inputText.value) {
      if (screenWidth.value < 821) {
        showInferDlg.value = true;
      }
      styleBackground.value = [];
      isWaiting.value = true;
      let count = 0;
      randomList.value.forEach((item) => {
        if (item.isSelected) {
          count++;
          if (count <= 1) {
            sortTag.value = item.tag;
          } else {
            sortTag.value = sortTag.value + ' ' + item.tag;
          }
        }
      });
      // 重置喜欢公开数据
      inferList.value = [
        { isCollected: false, id: '', publicId: '' },
        { isCollected: false, id: '', publicId: '' },
        { isCollected: false, id: '', publicId: '' },
        { isCollected: false, id: '', publicId: '' },
      ];
      try {
        isLine.value = null;
        inferDisabled.value = true;
        const res = await wuKongInfer({
          desc: inputText.value,
          style: sortTag.value,
          img_quantity: imgQuantity.value,
        });
        isInferred.value = true;

        if (res.status === 201) {
          setTimeout(() => {
            socket = new WebSocket(
              `wss://${DOMAIN}/server/bigmodel/wukong/rank`,
              [getHeaderConfig().headers['csrf-token']]
            );
            socket.onmessage = function (event) {
              isWaiting.value = false;
              try {
                isLine.value = JSON.parse(event.data).data.rank;
                if (JSON.parse(event.data).data.rank === 0) {
                  inferDisabled.value = false;
                  getPic()
                    .then((res) => {
                      inferDisabled.value = false;
                      if (res.data.length > 2) {
                        styleBackground1.value = [
                          res.data[0].link,
                          res.data[1].link,
                          res.data[2].link,
                          res.data[3].link,
                        ];
                      } else {
                        styleBackground1.value = [
                          res.data[0].link,
                          res.data[1].link,
                        ];
                      }
                      res.data.forEach((item, index) => {
                        addWatermark(item.link, index);
                      });

                      isLarge.value = false;
                    })
                    .catch((err) => {
                      isWaiting.value = false;
                      isLine.value = null;
                      inferDisabled.value = false;
                      if (
                        err.response.data.code === 'bigmodel_no_wukong_picture'
                      ) {
                        errorMsg.value = '';
                      } else if (
                        err.response.data.code === 'bigmodel_sensitive_info'
                      ) {
                        errorMsg.value = '内容不合规，请重新输入描述词';
                      }
                      isInferred.value = true;
                      isError.value = true;
                    });
                }
              } catch (err) {
                ElMessage({
                  type: 'error',
                  message: 'error',
                });
              }
            };
          }, 2000);
        }
      } catch (err) {
        isWaiting.value = false;
        isLine.value = null;
        inferDisabled.value = false;
        if (err.code === 'bigmodel_sensitive_info') {
          errorMsg.value = '内容不合规，请重新输入描述词';
        } else if (err.code === 'bigmodel_resource_busy') {
          errorMsg.value = '前方道路拥挤，请稍后再试';
        } else if (err.code === 'system_error') {
          errorMsg.value = '系统错误';
        }
        isInferred.value = true;
        isError.value = true;
      }
    } else if (!inputText.value) {
      ElMessage({
        offset: 64,
        type: 'warning',
        message: '请输入样例描述',
      });
    }
  }
}
// 收藏
function handleCollect(key, index) {
  addLikePicture({
    obspath: decodeURIComponent(
      styleBackground1.value[index].split('?')[0].split('443/')[1]
    ),
  }).then((res) => {
    if (res.data.data) {
      inferList.value[index].isCollected = true;
      inferList.value[index].id = res.data.data.id;
      ElMessage({
        offset: 64,
        type: 'success',
        message: '收藏成功，可在画作管理中查看',
      });
    }
  });
}
// 取消收藏
function handleCancelCollect(index) {
  cancelLikePicture(inferList.value[index].id).then((res) => {
    if (res.status === 204) {
      inferList.value[index].isCollected = false;
      inferList.value[index].id = '';
      ElMessage({
        offset: 64,
        type: 'success',
        message: '取消收藏成功',
      });
    }
  });
}
const resultIndex = ref(-1);
// 推理dlg关闭-触发
function handleDlgClose() {
  showInferDlg.value = false;

  isInferred.value = false;
  isError.value = false;
  posterLink.value = '';
  resultIndex.value = -1;

  inferList.value.forEach((item) => {
    item.isCollected = false;
    item.id = '';
  });

  initData();
}
// 随机选取五个样例
function getDescExamples(arr, count) {
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
const svgRotate = ref(false);
// 换一批
function refreshTags() {
  svgRotate.value = true;
  exampleData.value = getDescExamples(lists.value, 2);
}
function reset(val) {
  svgRotate.value = val;
}
function handleResultClcik(i) {
  resultIndex.value = i;
}
const numOptions = ref([
  { id: 4, active: true },
  { id: 2, active: false },
]);
function handleNum(index) {
  numOptions.value.forEach((item, option) => {
    if (index === option) {
      item.active = true;
      imgQuantity.value = item.id;
    } else {
      item.active = false;
    }
  });
}
</script>
<template>
  <div class="wukong-bread">
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item :to="{ path: '/modelzoo' }"
        >大模型</el-breadcrumb-item
      >
      <el-breadcrumb-item>悟空在线体验</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
  <!-- mobile -->
  <div class="mobile-sider-content">
    <div
      v-for="item in routeList"
      :key="item.path"
      class="jump-item"
      @click="goPath(item.path)"
    >
      <div class="left">
        <OIcon><component :is="item.icon"></component></OIcon>
        <span>{{ item.name }}</span>
      </div>
      <div class="right">
        <o-icon><icon-arrowRight></icon-arrowRight></o-icon>
      </div>
    </div>
  </div>
  <div class="wk-experience-mobile">
    <el-input
      v-model="inputText"
      maxlength="55"
      placeholder="请输入简体中文或选择下方样例"
      show-word-limit
      type="textarea"
      @input="handleInput"
    >
      <template #suffix
        ><o-icon v-if="inputText" class="clear-input" @click="clearInputText"
          ><icon-x></icon-x></o-icon
      ></template>
    </el-input>

    <div class="mobile-examples">
      <div class="example-head">
        <!-- <p class="title">选择样例</p> -->
        <div class="refresh" @click="refreshTags" @animationend="reset(false)">
          <o-icon :class="svgRotate ? 'rotating' : ''"
            ><icon-refresh></icon-refresh
          ></o-icon>
          <!-- <p>换一批</p> -->
        </div>
      </div>

      <div class="example-items">
        <p
          v-for="item in exampleData"
          :key="item.text"
          :class="item.isSelected ? 'active' : ''"
          @click="exampleSelectHandler(item)"
        >
          {{ item.text }}
        </p>
      </div>
    </div>

    <div class="mobile-styles">
      <div class="title">选择风格</div>
      <div class="content">
        <div class="style-tag">
          <div
            v-for="(item, index) in newStyleData"
            :key="item.style"
            class="style-item"
            @click="choseStyleSort(index, item)"
          >
            <img
              v-if="index === 0"
              :src="item.isSelected && activeIndex === 0 ? item.img : item.img1"
              alt=""
              :class="item.isSelected && activeIndex === 0 ? 'active-1' : ''"
            />
            <img
              v-else
              :src="item.img"
              alt=""
              :class="item.isSelected ? 'active-1' : ''"
            />

            <div class="style-item-name">
              {{ index === 0 ? item.tag1 : item.tag }}
            </div>
          </div>
          <div v-if="!isAllStyle" class="style-item" @click="viewAll">
            <img :src="viewAllImg" alt="" />
          </div>
        </div>
        <div v-if="isAllStyle" class="all-kind retract" @click="retract">
          收起
        </div>

        <div class="title num-title">生成数量</div>
        <div class="option-box">
          <div
            class="option"
            :class="{ 'active-option': numOptions[0].active }"
            @click="handleNum(0)"
          >
            生成4张
          </div>
          <div
            class="option"
            :class="{ 'active-option': numOptions[1].active }"
            @click="handleNum(1)"
          >
            生成2张
          </div>
        </div>
      </div>
    </div>

    <div class="experience-btn">
      <o-button size="mini" type="primary" @click="handleInfer"
        >立即生成</o-button
      >
    </div>
  </div>
  <div>
    <el-dialog
      v-model="showInferDlg"
      class="infer-dlg"
      lock-scroll
      :fullscreen="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="handleDlgClose"
    >
      <template #header="{ titleClass }">
        <p :class="titleClass">
          {{ inputText }}&nbsp;&nbsp;&nbsp;<span v-if="sortTag">#风格：</span
          >{{ sortTag }}
        </p>
      </template>

      <div v-if="!styleBackground.length" class="infer-dlg-loading">
        <template v-if="isWaiting">
          <img :src="loading" alt="" />
          <p>正在创作中，请耐心等待</p></template
        >
        <template v-else-if="isLine !== null">
          <img :src="loading" alt="" />
          <p v-if="isLine <= 1">正在创作中，请耐心等待</p>
          <p v-else>前面还有{{ isLine }}位排队，请耐心等待</p></template
        >
        <template v-else-if="errorMsg">
          <img :src="warning" alt="" />
          <p>{{ errorMsg }}</p></template
        >
        <template v-else> </template>
      </div>

      <div
        v-if="styleBackground.length"
        class="infer-dlg-result"
        :class="{ 'infer-dlg-result4': styleBackground.length > 2 }"
      >
        <!-- mobile -->
        <div
          v-for="(value, key) in styleBackground"
          :key="key"
          class="mobile-result-item"
          @click="handleResultClcik(key)"
        >
          <img :src="value" alt="" />

          <div class="handles">
            <div class="public">
              <template v-if="!inferList[key].publicId">
                <div
                  class="func-item"
                  @click="
                    showConfirmDlg = true;
                    largeIndex = key;
                  "
                >
                  <p>
                    <o-icon><icon-arrow></icon-arrow></o-icon>
                  </p>
                </div>
              </template>

              <template v-else>
                <div class="func-item" @click="cancelPublicImage(key)">
                  <p class="icon-item">
                    <o-icon><icon-cancel></icon-cancel></o-icon>
                  </p>
                </div>
              </template>
            </div>
            <div class="handles-contain">
              <div class="func-item">
                <p @click="shareImage(value)">
                  <o-icon><icon-share></icon-share></o-icon>
                </p>
              </div>

              <template v-if="!inferList[key].isCollected">
                <div class="func-item" @click="handleCollect(value, key)">
                  <p>
                    <o-icon><icon-like></icon-like></o-icon>
                  </p>
                </div>
              </template>

              <template v-if="inferList[key].isCollected">
                <div class="func-item" @click="handleCancelCollect(key)">
                  <p class="liked">
                    <o-icon><icon-heart></icon-heart></o-icon>
                  </p>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      v-model="posterDlg"
      center
      align-center
      class="poster-dlg-wk"
      width="434"
      :close-on-press-escape="false"
      @close="handlePosterDlgClose"
    >
      <template #header="{ titleClass }">
        <p :class="titleClass">
          {{ inputText }}&nbsp;&nbsp;&nbsp;<span v-if="sortTag">#风格：</span
          >{{ sortTag }}
        </p>
      </template>

      <div class="poster">
        <div v-if="!isSharedPoster" id="screenshot" class="poster-image">
          <img class="infer-img" draggable="false" :src="posterLink" alt="" />

          <img
            class="qr-code"
            draggable="false"
            src="@/assets/imgs/wukong/qr-code.png"
            alt=""
          />
          <img
            class="logo"
            draggable="false"
            src="@/assets/imgs/logo.png"
            alt=""
          />

          <p class="water-mark-text">由AI模型生成</p>

          <div class="mask"></div>

          <div class="info">
            <p class="desc">{{ posterInfo }}</p>
            <div class="user-info">
              <img :src="userAvatar" alt="" />
              <p>{{ userInfoStore.userName }}</p>
            </div>
          </div>
        </div>

        <img v-else class="shared-image" :src="shareImg" alt="" />

        <div class="poster-download">
          <div class="link">
            <p>https://xihe.mindspore.cn/modelzoo/wukong</p>

            <o-icon
              @click="copyText(`https://xihe.mindspore.cn/modelzoo/wukong`)"
              ><icon-copy></icon-copy
            ></o-icon>
          </div>
          <div v-if="screenWidth > 820" class="button" @click="downloadPoster">
            下载海报
          </div>
        </div>
        <p v-if="screenWidth <= 820" class="poster-tip">长按保存海报</p>
      </div>
    </el-dialog>

    <el-dialog
      v-model="showConfirmDlg"
      class="confirm-dlg"
      align-center
      width="640"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <template #header>
        <p class="confirm-title">公开画作</p>
      </template>
      <div class="confirm-desc">
        当前体验服务的内容均由人工智能模型生成，平台对其生成内容的准确性、完整性和功能性不做任何保证，在使用体验服务前，请您务必仔细阅读并理解透彻
        <a
          target="blank"
          rel="noopener noreferrer"
          href="https://xihe-docs.mindspore.cn/zh/appendix/license/"
          >《昇思大模型平台协议》</a
        >
      </div>
      <template #footer>
        <OButton
          :size="screenWidth < 820 ? 'mini' : 'small'"
          style="margin-right: 16px"
          @click="showConfirmDlg = false"
          >取消</OButton
        >
        <OButton
          type="primary"
          :size="screenWidth < 820 ? 'mini' : 'small'"
          @click="publicImage(styleBackground[largeIndex], largeIndex)"
          >提交审核</OButton
        >
      </template>
    </el-dialog>
  </div>
</template>
<style lang="scss" scoped>
.wukong-bread {
  padding-top: 104px;
  padding-left: 16px;
  max-width: 1448px;
  margin: 0 auto;
  @media screen and (max-width: 820px) {
    padding-top: 64px;
    padding-bottom: 16px;
  }
  :deep(.el-breadcrumb) {
    font-size: 12px;
    line-height: 18px;
    .el-breadcrumb__item {
      .el-breadcrumb__inner {
        color: #555;
      }
      &:last-child .el-breadcrumb__inner {
        color: #000;
      }
    }
  }
}
/* 推理弹窗 */
.infer-dlg-result {
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 0 24px;
  @media screen and (max-width: 820px) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 8px;
    margin-top: 12vh;
  }
  @media screen and (max-width: 767px) {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    margin-top: 0;
  }

  /* mobile生成图片 */
  .mobile-result-item {
    position: relative;
    margin-right: 0;
    width: auto;
    height: calc(50vw - 20px);
    display: none;
    @media screen and (max-width: 820px) {
      display: block;
      width: 100%;
      height: auto;
    }
    &:last-child {
      margin-right: 0;
    }
    img {
      max-width: 360px;
      width: 100%;
      border-radius: 16px;
    }
    .mask {
      position: absolute;
      bottom: 0;
      background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 100%);
      width: 100%;
      height: 16vh;
      height: 10vh;
    }

    .handles {
      width: 100%;
      position: relative;
      z-index: 20;
      display: flex;
      justify-content: space-between;
      bottom: 0px;
      padding: 8px;
      .handles-contain,
      .public {
        display: flex;
        background-color: rgba(255, 255, 255, 0.95);
        padding: 3px 5px;

        .o-icon {
          color: #b2b2b2;
          font-size: 24px;
          @media screen and (max-width: 768px) {
            font-size: 16px;
          }
        }
        .func-item {
          margin-left: 12px;
          cursor: pointer;
        }

        .liked {
          margin: 0 auto;
          .o-icon {
            font-size: 24px;
            @media screen and (max-width: 768px) {
              font-size: 16px;
            }
          }
        }
        p {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          font-size: 16px;
          display: flex;
          justify-content: center;
          align-items: center;
          @media screen and (max-width: 768px) {
            width: 24px;
            height: 24px;
          }
          &:nth-child(2) {
            margin: 0 4px;
          }
        }
      }
      .public {
        border-bottom-left-radius: 16px;
        border-top-left-radius: 16px;
        padding-right: 0;
      }
      .handles-contain {
        border-bottom-right-radius: 16px;
        border-top-right-radius: 16px;
        padding-left: 0;
      }
    }
  }
}
.infer-dlg-result4 {
  grid-template-columns: repeat(2, 1fr);
  padding: 0;
}
.infer-dlg-loading {
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  img {
    width: 56px;
    align-self: center;
    @media screen and (max-width: 820px) {
      width: 48px;
    }
  }
  p {
    font-size: 18px;
    font-weight: 400;
    color: #555555;
    line-height: 25px;
    text-align: center;
    @media screen and (max-width: 820px) {
      font-size: 14px;
      line-height: 20px;
    }
  }
}
.infer-dlg-error {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #fff;
  @media screen and (max-width: 820px) {
    margin-top: 20vh;
  }
  p {
    align-self: center;
    &:first-child {
      .o-icon {
        font-size: 48px;
        @media screen and (max-width: 820px) {
          font-size: 32px;
        }
      }
    }
    &:nth-child(2) {
      font-size: 18px;
      font-weight: 400;
      line-height: 25px;
      margin-top: 40px;
      @media screen and (max-width: 820px) {
        margin-top: 16px;
        font-size: 12px;
        line-height: 18px;
      }
    }
    &:nth-child(3) {
      border: 1px solid #fff;
      padding: 12px 60px 12px 28px;
      font-size: 16px;
      line-height: 24px;
      margin-top: 48px;
      cursor: pointer;
      position: relative;
      @media screen and (max-width: 820px) {
        margin-top: 16px;
        font-size: 12px;
        line-height: 18px;
        padding: 8px 32px 8px 16px;
      }
      &:hover {
        .o-icon {
          right: 16px;
        }
      }
      .o-icon {
        margin-left: 16px;
        font-size: 24px;
        position: absolute;
        right: 20px;
        transition: all 0.2s linear;
        @media screen and (max-width: 820px) {
          right: 8px;
          margin-left: 8px;
          font-size: 16px;
        }
      }
    }
  }
}
/* 海报 */
.poster-dlg-wk {
  .el-dialog__body {
    padding-top: 0;
    @media screen and (max-width: 820px) {
      padding: 16px !important;
      width: 434px;
      margin-left: 50%;
      transform: translateX(-50%);
    }
    @media screen and (max-width: 767px) {
      width: 100%;
    }
  }
  .poster {
    width: 434px;
    background: #ffffff;
    padding: 16px;
    margin: 0 auto;
    border-radius: 16px;
    overflow: hidden;
    @media screen and (max-width: 767px) {
      width: 328px;
      padding: 8px 8px 16px;
    }
    .poster-image {
      width: 100%;
      position: relative;
      border-radius: 16px;
      background: transparent;
      @media screen and (max-width: 768px) {
        width: 100%;
        height: calc(100% - 40px);
      }
      .mask {
        width: 100%;
        height: 70px;
        background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 100%);
        position: absolute;
        bottom: 55px;
        @media screen and (max-width: 768px) {
          bottom: 40px;
          height: 160px;
        }
      }
      .water-mark-text {
        color: #fff;
        position: absolute;
        bottom: 66px;
        right: 18px;
        z-index: 2;
        font-size: 12px;
        @media screen and (max-width: 768px) {
          bottom: 48px;
          right: 8px;
          font-size: 8px;
        }
      }
      .qr-code {
        width: 78px;
        height: 78px;
        position: absolute;
        right: 16px;
        bottom: 92px;
        z-index: 1;
        @media screen and (max-width: 768px) {
          width: 56px;
          height: 56px;
          right: 8px;
          bottom: 70px;
        }
      }
      .logo {
        position: absolute;
        left: 16px;
        bottom: 78px;
        width: 64px;
        height: 21px;
        z-index: 1;
        @media screen and (max-width: 768px) {
          width: 48px;
          height: 16px;
          left: 8px;
          bottom: 48px;
        }
      }
      .infer-img {
        width: 100%;
        border-top-left-radius: 16px;
        border-top-right-radius: 16px;
        @media screen and (max-width: 820px) {
        }
      }
      .info {
        width: 100%;
        background: #f5f6f8;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px;
        border-bottom-left-radius: 16px;
        border-bottom-right-radius: 16px;
        @media screen and (max-width: 768px) {
          padding: 8px;
        }
        .desc {
          font-size: 14px;
          font-weight: 400;
          color: #000000;
          line-height: 24px;
          max-width: 250px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          @media screen and (max-width: 768px) {
            font-size: 12px;
            line-height: 24px;
          }
        }
        .user-info {
          display: flex;
          align-items: center;

          img {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            margin-right: 8px;
            @media screen and (max-width: 768px) {
              width: 16px;
              height: 16px;
              margin-right: 4px;
            }
          }
          p {
            font-size: 14px;
            font-weight: 400;
            color: #555555;
            line-height: 24px;
            white-space: nowrap;
          }
        }
      }
    }
    .shared-image {
      width: 100%;
      height: auto;
    }
    .poster-download {
      margin-top: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      @media screen and (max-width: 768px) {
        margin-top: 8px;
      }
      .link {
        flex: 1;
        height: 36px;
        background: #ffffff;
        border: 1px solid #999999;
        padding-left: 16px;
        padding-right: 10px;
        margin-right: 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-radius: 16px;
        @media screen and (max-width: 768px) {
          width: 200px;
          height: 32px;
          padding: 0 8px;
        }
        p {
          font-size: 12px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .o-icon {
          cursor: pointer;
        }
      }
      .button {
        width: 112px;
        height: 36px;
        line-height: 36px;
        border: 1px solid #40adff;
        color: #40adff;
        text-align: center;
        cursor: pointer;
        border-radius: 18px;
        @media screen and (max-width: 768px) {
          width: 74px;
          height: 32px;
          line-height: 30px;
          font-size: 12px;
        }
      }
    }
    .poster-tip {
      font-size: 12px;
      color: #555;
      margin-top: 8px;
    }
  }
}
:deep(.poster-dlg-wk) {
  background: transparent;
  .el-dialog__header {
    display: none;
  }
  .el-dialog__body {
    padding: 0;
  }
  .el-dialog__title {
    display: none;
  }

  .el-dialog__headerbtn {
    display: none;
    .el-icon {
      color: #ffffff;
    }
  }
}
:deep(.infer-dlg) {
  background: rgba(0, 0, 0, 0.75);
  border-radius: 0;
  .el-dialog__header {
    padding: 12px 0;
    backdrop-filter: blur(5px);
  }
  .el-dialog__title {
    font-size: 14px;
    color: #ffffff;
  }
  .el-dialog__headerbtn {
    top: 0;
    color: #ffffff;
    .el-icon {
      color: #ffffff;
    }
  }
  .el-dialog__body {
    min-height: calc(100% - 48px);
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.95);
    border-top-right-radius: 16px;
    border-top-left-radius: 16px;
    padding: 0 16px;
  }
  .mobile-result-item {
    .handles {
      justify-content: flex-end;
      .o-icon {
        color: #b2b2b2;
      }
    }
  }
}

.mobile-sider-content {
  display: none;
  @media screen and (max-width: 767px) {
    position: relative;
    display: flex;
    justify-content: space-between;
    padding: 0 16px 24px;
    font-size: 18px;
    line-height: 24px;
    font-weight: 400;
    color: #555555;
  }
  @media screen and (max-width: 767px) {
    font-size: 12px;
    padding: 0 16px 16px;
  }
  .jump-item {
    flex: 1;
    background: #ffffff;
    box-shadow: 0px 1px 30px 0px rgba(0, 0, 0, 0.05);
    border-radius: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    @media screen and (max-width: 820px) {
      padding: 24px;
    }
    @media screen and (max-width: 767px) {
      padding: 8px 12px;
    }
    &:first-child {
      margin-right: 16px;
    }
    .left {
      display: flex;
      align-items: center;
      .o-icon {
        font-size: 24px;
        margin-right: 12px;
      }
    }
    .right {
      font-size: 24px;
      height: 24px;
      @media screen and (max-width: 767px) {
        font-size: 12px;
        height: 12px;
      }
    }
  }
}
.wk-experience-mobile {
  display: none;
  position: relative;
  @media screen and (max-width: 820px) {
    display: block;
  }
  margin: 0 16px 34px;
  padding: 16px 16px 24px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 16px;

  :deep(.el-textarea) {
    width: 100% !important;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.9);
    .el-textarea__inner {
      background: rgba(255, 255, 255, 0.9);
      box-shadow: 0 0 0 1px #fff inset;
      border-radius: 8px;
      padding: 8px;
      height: 80px;
    }
  }
  .active {
    color: #fff !important;
    background: #008eff !important;
  }
  .active-1 {
    border: 2px solid #008eff !important;
    border-radius: 6px;
  }

  .mobile-examples {
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    margin-top: 8px;
    .example-head {
      display: flex;
      justify-content: space-between;
      .title {
        font-size: 14px;
        font-weight: 400;
        color: #ffffff;
        line-height: 20px;
      }
      .refresh {
        font-size: 10px;
        font-weight: 400;
        color: #0d8dff;
        line-height: 14px;
        display: flex;
        align-items: center;
        .o-icon {
          margin-right: 4px;
          font-size: 16px;
        }
        p {
          white-space: nowrap;
        }
      }
    }
    .example-items {
      display: flex;
      max-width: 280px;
      flex-wrap: nowrap;

      p {
        color: #b2b2b2;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-right: 4px;
        border-radius: 8px;
        background: #f5f5f5;
        padding: 3px 8px;
        font-size: 12px;
        margin: 4px 2px;
        cursor: pointer;
        @media screen and (max-width: 820px) {
          margin-bottom: 8px;
        }
      }
    }
  }
  .mobile-styles {
    .title {
      font-size: 16px;
      line-height: 20px;
      font-weight: 400;
      color: #555;
      margin-top: 16px;
      display: flex;
      justify-content: space-between;
      .all-kind {
        font-size: 12px;
      }
    }

    .content {
      padding-bottom: 85px;
      overflow: auto;
      margin-top: 16px;
      &::-webkit-scrollbar {
        width: 0;
        height: 6px;
      }
      @media screen and (max-width: 476px) {
        height: 455px;
        padding-bottom: 55px;
      }
      .style-tag {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        justify-content: space-between;
        column-gap: 50px;
        justify-items: center;
        @media screen and (max-width: 476px) {
          gap: 12px;
        }

        .style-item {
          flex: 1;
          margin-bottom: 4px;
          position: relative;
          width: 68px;
          border-radius: 6px;
          border: 1px solid transparent;
          flex: unset;
          .triangle {
            width: 0;
            height: 0;
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            border-bottom: 10px solid rgba(85, 85, 85, 0.3);
            position: absolute;
            bottom: -17px;
            left: 50%;
            transform: translateX(-50%);
          }

          img {
            width: 65px;
            height: 65px;
            border-radius: 6px;
          }
          .style-item-name {
            padding-top: 7px;
            bottom: 0px;
            font-size: 12px;
            line-height: 17px;
            font-weight: 400;
            color: #555555;
            width: 100%;
            text-align: center;
            border-radius: 0 0 6px 6px;
          }
        }
      }
      .all-kind {
        text-align: center;
        color: #555555;
        cursor: pointer;
        font-size: 12px;
        padding: 4px 14px;
        background: #e1effd;
        width: 52px;
        margin: 10px auto 0;
        border-radius: 14px;
        .o-icon {
          margin-left: 8px;
        }
      }
      .retract {
        .o-icon svg {
          transform: rotate(180deg);
        }
      }
      .sort-tag {
        display: flex;
        flex-wrap: wrap;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(5px);
        border-radius: 8px;
        margin-top: 16px;
        padding: 0 8px 8px;
        width: 100%;
        min-height: auto;
        .sort-item {
          background: rgba(13, 141, 255, 0.3);
          border-radius: 6px;
          border: 1px solid #0d8dff;
          padding: 6px;
          margin-right: 8px;
          margin-top: 8px;
          font-size: 12px;
          color: #b2b2b2;
        }
      }

      .option-box {
        display: flex;
        margin: 16px 0 0;
        font-size: 14px;
        height: 36px;
        line-height: 36px;
        color: #555;
        .option {
          display: flex;
          align-items: center;
          padding: 0 16px;
          background-color: rgba(13, 141, 255, 0.1);
          border-radius: 8px;
          cursor: pointer;
          &:last-child {
            span {
              height: 12px;
            }
          }
        }
        .active-option {
          color: #008eff;
          span {
            border: 1px solid #008eff;
          }
        }
        span {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 1px solid #555;
          line-height: 36px;
          border-radius: 2px;
          margin-right: 8px;
        }
        .option + .option {
          margin-left: 16px;
        }
      }
    }
  }
  .experience-btn {
    padding-top: 16px;
    position: absolute;
    bottom: 22px;
    width: calc(100% - 32px);
    @media screen and (max-width: 476px) {
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(10px);
    }
  }

  .o-button {
    display: block;
    margin: 0 auto 0;
    padding: 9px 12px;
  }
}
@keyframes rotate {
  0% {
    transform: rotateZ(0deg);
  }
  100% {
    transform: rotateZ(180deg);
  }
}
.rotating {
  animation: rotate 0.4s ease-out;
}
:deep(.confirm-dlg) {
  @media screen and (max-width: 768px) {
    max-width: 335px;
    .confirm-title {
      font-size: 16px;
    }
    .confirm-desc {
      font-size: 14px;
      line-height: 18px;
      margin-top: 4px;
    }
  }
  .el-dialog__footer {
    text-align: center;
  }
  .confirm-desc {
    a {
      color: #008eff;
    }
  }
}
.input-dom {
  position: fixed;
  top: -1200px;
}
.clear-input {
  cursor: pointer;
}
:deep(.el-input) {
  max-width: 1416px;
  width: 100%;
  .el-input__wrapper {
    box-shadow: none;
    height: 56px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    backdrop-filter: blur(5px);
    padding: 8px 24px;
    @media screen and (max-width: 820px) {
      height: 40px;
    }
    @media screen and (max-width: 767px) {
      padding: 4px 8px;
      height: 30px;
    }
    .el-input__inner {
      font-size: 14px;
      color: #fff;
      @media screen and (max-width: 768px) {
        font-size: 12px;
        line-height: 18px;
      }
    }
    .el-input__count .el-input__count-inner {
      background: none;
    }
  }
}
</style>
