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
import tip from '@/assets/imgs/wukong/tip.png';
import wukongbg from '@/assets/imgs/wukong/wukong-bg1.png';
import warning from '@/assets/imgs/wukong/warning.png';
import arrow from '@/assets/imgs/wukong/arrow.png';
import viewAllImg from '@/assets/imgs/wukong/style/view-all.png';

import IconRefresh from '~icons/app/refresh-taichu';
import IconDownload from '~icons/app/download-gray';
import IconLike from '~icons/app/heart-gray';
import IconX from '~icons/app/x';
import IconHeart from '~icons/app/collected';
import IconCancel from '~icons/app/eye-close';
import IconArrow from '~icons/app/eye-open';
import IconShare from '~icons/app/share-gray';
import IconCopy from '~icons/app/copy-nickname';
import IconRight from '~icons/app/arrow-right';
import IconRight2 from '~icons/app/arrow-right2';
import IconLeft from '~icons/app/left';
import IconAlbum from '~icons/app/wukong-album';
import IconPainting from '~icons/app/painting';
import IconArrowRight from '~icons/app/arrow-right.svg';

import { goAuthorize } from '@/shared/login';
import { useLoginStore, useUserInfoStore } from '@/stores';
import useClipboard from 'vue-clipboard3';

import {
  wuKongInfer,
  addLikePicture,
  cancelLikePicture,
  temporaryLink,
  publicTemporaryPicture,
  cancelPublic,
  getPic,
} from '@/api/api-modelzoo.js';
import { LOGIN_KEYS } from '@/shared/login';
import { ElMessage } from 'element-plus';
import useWindowResize from '@/shared/hooks/useWindowResize.js';

import { useRouter } from 'vue-router';
import { ArrowRight } from '@element-plus/icons-vue';

const screenWidth = useWindowResize();
const isLogined = computed(() => useLoginStore().isLogined);
const userInfoStore = useUserInfoStore();

const { toClipboard } = useClipboard();

const inputText = ref('');
const sortTag = ref('');
const styleIndex = ref(0);

const showInferDlg = ref(false);
const isInferred = ref(false);
const isError = ref(false);

const styleBackground = ref([]);
const styleBackground1 = ref([]);

const styleData = ref([
  {
    style: '动漫',
    options: [
      { tag: '宫崎骏', isSelected: false },
      { tag: '新海诚', isSelected: false },
    ],
  },
  {
    style: '经典',
    options: [
      { tag: '达芬奇', isSelected: false },
      { tag: '毕加索', isSelected: false },
      { tag: '梵高', isSelected: false },
      { tag: '莫奈', isSelected: false },
      { tag: '温斯洛.霍默', isSelected: false },
      { tag: '莫里茨.科内利斯.埃舍尔', isSelected: false },
    ],
  },
  {
    style: '幻想艺术',
    options: [
      { tag: '韦恩.巴洛', isSelected: false },
      { tag: '格雷格.鲁特科夫斯基', isSelected: false },
    ],
  },
  {
    style: '更多风格',
    options: [
      { tag: '动漫', isSelected: false },
      { tag: '国风', isSelected: false },
      { tag: '田园', isSelected: false },
      { tag: '涂鸦', isSelected: false },
      { tag: '立体', isSelected: false },
      { tag: '浮雕', isSelected: false },
      { tag: '水彩', isSelected: false },
      { tag: '油画', isSelected: false },
      { tag: '暗黑', isSelected: false },
      { tag: '写实', isSelected: false },
      { tag: '高清', isSelected: false },
      { tag: '蜡笔画', isSelected: false },
      { tag: '专业CG艺术', isSelected: false },
      { tag: '彩色国风水墨', isSelected: false },
      { tag: '生动色彩', isSelected: false },
      { tag: '星际漫游', isSelected: false },
      { tag: '赛博朋克', isSelected: false },
      { tag: '印象主义', isSelected: false },
      { tag: '现代主义', isSelected: false },
      { tag: '巴洛克风格', isSelected: false },
      { tag: '像素风格', isSelected: false },
      { tag: '浮世绘', isSelected: false },
      { tag: '蒸汽波', isSelected: false },
    ],
  },
  {
    style: '随机风格',
    options: [],
  },
]);

const mobileStyleData = ref([]);
mobileStyleData.value = [...styleData.value].splice(0, 4);
const mobileRandomData = ref([
  {
    style: '随机风格',
    options: [],
  },
]);

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

const exampleData = ref([
  { text: '秋水共长天一色', isSelected: false },
  { text: '城市夜景', isSelected: false },
]);
const isLarge = ref(false);
const largeImg = ref({});
const largeIndex = ref(null);
function handleEnlage(value, key) {
  largeImg.value = {};
  largeImg.value[key] = value;
  largeIndex.value = key;
  isLarge.value = true;
}
function handleReturn() {
  isLarge.value = false;
  largeImg.value = {};
}
function toggleCollectionDlg() {
  if (!isLogined.value) {
    goAuthorize();
  } else {
    router.push('/modelzoo/wukong/admin');
  }
}
const router = useRouter();
nextTick(() => {
  let bgImg = document.getElementById('app');

  bgImg.style.background = `url(${wukongbg})`;
  bgImg.style.backgroundSize = 'cover';
  bgImg.children[1].style.background = 'unset';
  bgImg.children[2].style.backgroundColor = 'unset';
});
onUnmounted(() => {
  let bgImg = document.getElementById('app');
  bgImg.children[1].style.backgroundColor = '#f5f7fc';
  bgImg.children[2].style.backgroundColor = '#f5f7fc';
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
let token = getHeaderConfig().headers
  ? getHeaderConfig().headers['private-token']
  : null;
let socket = new WebSocket(
  'wss://xihe2.test.osinfra.cn/server/bigmodel/wukong/rank/wukong',
  [token]
);
socket.onmessage = function (event) {
  try {
    isLine.value = JSON.parse(event.data).data.rank;
    if (JSON.parse(event.data).data.rank === 0) {
      getPic()
        .then((res) => {
          styleBackground.value = res.data;
          styleBackground.value.forEach((item, index) => {
            // TODO:公开记录
            inferList.value[index].isCollected = item.is_like;
            inferList.value[index].id = item.like_id;
          });
          // res.data.pictures.forEach((item, index) => {
          //   addWatermark(item, index);
          // });

          const index1 = styleBackground.value[0].link.indexOf('=');
          const index2 = styleBackground.value[0].link.indexOf('=', index1 + 1);

          const i1 = styleBackground.value[0].link.indexOf('&');
          const i2 = styleBackground.value[0].link.indexOf('&', i1 + 1);

          const deadTime = styleBackground.value[0].link.substring(
            index2 + 1,
            i2
          );
          const currentTime = (new Date().getTime() + '').substring(0, 10);

          if ((deadTime - currentTime) / 60 < 60) {
            temporaryLink({ link: styleBackground.value[0].link }).then(
              (res) => {
                styleBackground1.value[0] = res.data.data.link;
                addWatermark(res.data.data.link, 0);
                temporaryLink({ link: styleBackground.value[1].link }).then(
                  (res) => {
                    styleBackground1.value[1] = res.data.data.link;
                    addWatermark(res.data.data.link, 1);
                  }
                );
              }
            );
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
  } catch {}
};

function imgErr() {}
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

const posterDlg = ref(false);
const posterLink = ref('');
const posterInfo = ref('');
const userAvatar = ref('');

userAvatar.value = userInfoStore.avatar.replace(
  'https://obs-xihe-beijing4.obs.cn-north-4.myhuaweicloud.com/',
  '/obs-xihe-avatar/'
);

// 公开图片
async function publicImage(val, index) {
  try {
    const res = await publicTemporaryPicture({
      obspath: decodeURIComponent(
        styleBackground1.value[index]
          .split('?')[0]
          .split(
            'https://big-model-deploy.obs.cn-central-221.ovaijisuan.com:443/'
          )[1]
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
    console.error(err);
  }
}
// 取消公开
async function cancelPublicImage(i) {
  try {
    const res = await cancelPublic(inferList.value[i].publicId);
    inferList.value[i].publicId = '';
    ElMessage({
      offset: 64,
      type: 'success',
      message: '已取消公开',
    });
  } catch (err) {
    console.error(err);
  }
}

// 分享图片
const isSharedPoster = ref(false);
const shareImg = ref('');
function shareImage(url) {
  posterDlg.value = true;
  posterLink.value = url.replace(
    'https://big-model-deploy.obs.cn-central-221.ovaijisuan.com:443/',
    '/obs-big-model/'
  );
  posterInfo.value = inputText.value + '  ' + sortTag.value;
  if (posterInfo.value === '  ') {
    posterInfo.value = decodeURIComponent(styleBackground1.value[1])
      .split('?')[0]
      .split(
        'https://big-model-deploy.obs.cn-central-221.ovaijisuan.com:443/'
      )[1]
      .split('/')[5]
      .split('-01.jpg')[0];
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
// 绘制圆角矩形（使用 arcTo）
function drawRoundedRect(ctx, x, y, width, height, radius) {
  // 保存当前环境的状态
  ctx.save();
  // 重置当前路径
  ctx.beginPath();
  // 移动到左上角
  ctx.moveTo(x + radius, y);
  // 绘制右上角
  ctx.arcTo(x + width, y, x + width, y + radius, radius);
  // 绘制右下角
  ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
  // 绘制左下角
  ctx.arcTo(x, height, x, height - radius, radius);
  // 绘制左上角
  ctx.arcTo(x, y, x + radius, y, radius);
  // 填充当前路径
  ctx.fill();
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
      // 绘制圆角矩形
      drawRoundedRect(ctx, 0, 0, img.width, img.height, 38);
      // 对矩形进行剪切
      ctx.clip();
      // 绘制图片
      ctx.drawImage(img, 0, 0, img.width, img.height);

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
  await toClipboard(textValue);
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
//
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
    // newStyleData.value[0].isSelected = true;
  }
}
// 选择风格标签
// function choseSortTag(val) {
//   val.isSelected = !val.isSelected;
// }
// 随机风格
function getRandomStyle(index) {
  if (index === 0) {
    const i = Math.floor(Math.random() * randomList.value.length);
    styleData.value[index].options = mobileRandomData.value.options = [
      randomList.value[i],
    ];
  } else {
    return;
  }
}

// 初始化推理数据
function initData() {
  sortTag.value = '';

  styleBackground.value = [];

  styleData.value.forEach((item) => {
    item.options.forEach((tag) => {
      tag.isSelected = false;
    });
  });

  exampleData.value.forEach((item) => {
    item.isSelected = false;
  });
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

const errorMsg = ref('');
// wk推理
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

      try {
        const res = await wuKongInfer({
          desc: inputText.value,
          style: sortTag.value,
        });
        isInferred.value = true;
        // isWaiting.value = false;
        // styleBackground.value = res.data.data.pictures;
        if (res.status === 201) {
          setTimeout(() => {
            socket = new WebSocket(
              'wss://xihe2.test.osinfra.cn/server/bigmodel/wukong/rank/wukong',
              [getHeaderConfig().headers['private-token']]
            );
            socket.onmessage = function (event) {
              isWaiting.value = false;
              isLine.value = JSON.parse(event.data).data.rank;
              if (JSON.parse(event.data).data.rank === 0) {
                getPic()
                  .then((res) => {
                    styleBackground1.value = [
                      res.data[0].link,
                      res.data[1].link,
                    ];
                    res.data.forEach((item, index) => {
                      addWatermark(item.link, index);
                    });

                    isLarge.value = false;
                  })
                  .catch((err) => {
                    isWaiting.value = false;
                    isLine.value = null;
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
            };
          }, 2000);
        }
      } catch (err) {
        isWaiting.value = false;
        isLine.value = null;
        if (err.code === 'bigmodel_sensitive_info') {
          errorMsg.value = '内容不合规，请重新输入描述词';
        } else if (err.code === 'bigmodel_resource_busy') {
          errorMsg.value = '前方道路拥挤，请稍后再试';
        } else if (err.code === 'system_error') {
          errorMsg.value = '系统错误';
        }
        // isWaiting.value = false;
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
const inferList = ref([
  { isCollected: false, id: '', publicId: '' },
  { isCollected: false, id: '', publicId: '' },
  { isCollected: false, id: '', publicId: '' },
  { isCollected: false, id: '', publicId: '' },
]);
// 收藏
function handleCollect(key, index) {
  addLikePicture({
    obspath: decodeURIComponent(
      styleBackground1.value[index]
        .split('?')[0]
        .split(
          'https://big-model-deploy.obs.cn-central-221.ovaijisuan.com:443/'
        )[1]
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
// 下载图片
function requestImg(item) {
  let x = new XMLHttpRequest();
  x.open('GET', item, true);
  x.responseType = 'blob';
  x.onload = function () {
    const blobs = new Blob([x.response], { type: 'image/png' });
    let url = window.URL.createObjectURL(blobs);
    let a = document.createElement('a');
    a.href = url;
    a.download = 'infer.png';
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };
  x.send();
}
// 临时url小于1min重新获取下载
function downloadImage(item) {
  // const index1 = item.indexOf('=');
  // const index2 = item.indexOf('=', index1 + 1);

  // const i1 = item.indexOf('&');
  // const i2 = item.indexOf('&', i1 + 1);

  // const deadTime = item.substring(index2 + 1, i2);
  // const currentTime = (new Date().getTime() + '').substring(0, 10);

  // if ((deadTime - currentTime) / 60 < 60) {
  //   temporaryLink({ link: item }).then((res) => {
  //     if (res.data.data) {
  //       requestImg(res.data.data.link);
  //     }
  //   });
  // } else {
  requestImg(item);
  // }
}
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

const resultIndex = ref(-1);

function handleResultClcik(i) {
  resultIndex.value = i;
}
const showConfirmDlg = ref(false);
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
  <div class="wk-experience">
    <div class="wrap-left">
      <el-input
        v-model="inputText"
        maxlength="75"
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
      <div class="wk-experience-examples">
        <!-- <p class="title">选择样例</p> -->
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
        <div class="refresh" @click="refreshTags" @animationend="reset(false)">
          <o-icon :class="svgRotate ? 'rotating' : ''"
            ><icon-refresh></icon-refresh
          ></o-icon>
          <!-- <p>换一批</p> -->
        </div>
      </div>
      <div class="wk-experience-styles">
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
                :src="
                  item.isSelected && activeIndex === 0 ? item.img : item.img1
                "
                alt=""
                :class="item.isSelected && activeIndex === 0 ? 'active-1' : ''"
              />
              <img
                v-else
                :src="item.img"
                alt=""
                :class="item.isSelected ? 'active-1' : ''"
              />

              <div class="style-item-name" @click="getRandomStyle(index)">
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

          <!-- <div class="sort-tag">
            <div
              v-for="item in styleData[styleIndex].options"
              :key="item"
              class="sort-item"
              :class="item.isSelected ? 'active' : ' '"
              @click="choseSortTag(item)"
            >
              {{ item.tag }}
            </div>

            <div class="triangle" :class="`triangle${styleIndex}`"></div>
          </div> -->
        </div>
      </div>
      <!-- <div class="wk-experience-btn" @click="handleInfer">立即生成</div> -->
      <div class="experience-btn">
        <o-button type="primary" @click="handleInfer">立即生成</o-button>
      </div>
    </div>
    <div class="wrap-right">
      <div class="sider-content">
        <div v-if="isLarge" class="content-left" @click="handleReturn">
          <o-icon><icon-right></icon-right></o-icon>
          返回
        </div>
        <div v-else></div>
        <div class="content-right">
          <span class="album" @click="router.push('/modelzoo/wukong/album')">
            <o-icon><icon-album></icon-album></o-icon>
            AI画集
          </span>
          <span class="painting" @click="toggleCollectionDlg">
            <o-icon><icon-painting></icon-painting></o-icon>
            画作管理
          </span>
        </div>
      </div>
      <div v-if="!styleBackground.length" class="empty">
        <div v-if="isWaiting" class="waiting">
          <img :src="loading" alt="" />
          <p>正在创作中，请耐心等待</p>
        </div>
        <div v-else-if="isLine !== null" class="waiting">
          <img :src="loading" alt="" />
          <p v-if="isLine <= 1">正在创作中，请耐心等待</p>
          <p v-else>前面还有{{ isLine }}位排队，请耐心等待</p>
        </div>
        <div v-else-if="errorMsg" class="waiting">
          <img :src="warning" alt="" />
          <p>敏感信息，请重新输入关键词</p>
        </div>
        <div v-else class="tip">
          <img :src="tip" alt="" />
          <p>在左侧选择样例风格开始画画</p>
        </div>
      </div>
      <div v-else class="img-box">
        <template v-if="!isLarge">
          <div
            v-for="(value, key, index) in styleBackground"
            :key="key"
            class="result-item"
          >
            <img
              :src="value"
              alt=""
              :onerror="imgErr"
              @click="handleEnlage(value, key, index)"
            />
          </div>
        </template>
        <template v-else>
          <div v-for="(value, key) in largeImg" :key="key" class="result-item1">
            <o-icon
              class="turn"
              @click="
                handleEnlage(
                  Object.values(styleBackground)[0],
                  Object.keys(styleBackground)[0],
                  0
                )
              "
              ><icon-left></icon-left
            ></o-icon>
            <img :src="value" alt="" />
            <o-icon
              class="turn"
              @click="
                handleEnlage(
                  Object.values(styleBackground)[1],
                  Object.keys(styleBackground)[1],
                  1
                )
              "
              ><icon-right2></icon-right2
            ></o-icon>
            <div class="handles">
              <div class="public">
                <template v-if="!inferList[largeIndex].publicId">
                  <div class="func-item" @click="showConfirmDlg = true">
                    <p>
                      <o-icon><icon-arrow></icon-arrow></o-icon>
                    </p>
                    <img class="arrow" :src="arrow" alt="" />
                    <div class="icon-name">公开</div>
                  </div>
                </template>

                <template v-else>
                  <div class="func-item" @click="cancelPublicImage(largeIndex)">
                    <p class="icon-item">
                      <o-icon><icon-cancel></icon-cancel></o-icon>
                    </p>
                    <img class="arrow" :src="arrow" alt="" />
                    <div class="icon-name">取消公开</div>
                  </div>
                </template>
              </div>
              <div class="handles-contain">
                <div
                  class="func-item"
                  @click="downloadImage(styleBackground[largeIndex])"
                >
                  <p>
                    <o-icon><icon-download></icon-download></o-icon>
                  </p>
                  <img class="arrow" :src="arrow" alt="" />
                  <div class="icon-name">下载</div>
                </div>

                <div class="func-item" @click="shareImage(value)">
                  <p>
                    <o-icon><icon-share></icon-share></o-icon>
                  </p>
                  <img class="arrow" :src="arrow" alt="" />
                  <div class="icon-name">分享</div>
                </div>

                <template v-if="!inferList[largeIndex].isCollected">
                  <div class="func-item">
                    <p @click="handleCollect(value, largeIndex)">
                      <o-icon><icon-like></icon-like></o-icon>
                    </p>
                    <img class="arrow" :src="arrow" alt="" />
                    <div class="icon-name">收藏</div>
                  </div>
                </template>

                <template v-else>
                  <div class="func-item">
                    <p class="liked" @click="handleCancelCollect(largeIndex)">
                      <o-icon><icon-heart></icon-heart></o-icon>
                    </p>
                    <img class="arrow" :src="arrow" alt="" />
                    <div class="icon-name">取消收藏</div>
                  </div>
                </template>
              </div>
            </div>
            <!-- <div class="mask"></div> -->
          </div>
        </template>
      </div>
    </div>

    <textarea class="input-dom"></textarea>
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
      maxlength="75"
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

            <div class="style-item-name" @click="getRandomStyle(index)">
              {{ index === 0 ? item.tag1 : item.tag }}
            </div>

            <!-- <div v-if="styleIndex === index" class="triangle"></div> -->
          </div>
          <div v-if="!isAllStyle" class="style-item" @click="viewAll">
            <img :src="viewAllImg" alt="" />
          </div>

          <!-- <div v-if="styleIndex < 4" class="sort-tag">
            <div
              v-for="item in styleData[styleIndex].options"
              :key="item"
              class="sort-item"
              :class="item.isSelected ? 'active' : ' '"
              @click="choseSortTag(item)"
            >
              {{ item.tag }}
            </div>
          </div> -->
        </div>
        <div v-if="isAllStyle" class="all-kind retract" @click="retract">
          收起
        </div>

        <!-- <div class="style-tag">
          <div
            v-for="(item, index) in mobileRandomData"
            :key="item.style"
            class="style-item"
            :class="styleIndex === index + 4 ? 'active-1' : ''"
            @click="choseStyleSort(index + 4)"
          >
            <img :src="styleBackgrounds[index + 4]" alt="" />

            <div class="style-item-name" @click="getRandomStyle(index + 4)">
              {{ item.style }}
            </div>
            <div v-if="styleIndex === 4" class="triangle"></div>
          </div>
          <div v-if="styleIndex === 4" class="sort-tag">
            <div
              v-for="item in mobileRandomData.options"
              :key="item"
              class="sort-item"
              :class="item.isSelected ? 'active' : ' '"
              @click="choseSortTag(item)"
            >
              {{ item.tag }}
            </div>
          </div>
        </div> -->
      </div>
    </div>

    <!-- <div class="mobile-btn" @click="handleInfer">立即生成</div> -->
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
          <p>敏感信息，请重新输入关键词</p></template
        >
        <template v-else> </template>
      </div>

      <div v-if="styleBackground.length && !isError" class="infer-dlg-result">
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
                  <!-- <div class="icon-name">公开</div> -->
                </div>
              </template>

              <template v-else>
                <div class="func-item" @click="cancelPublicImage(key)">
                  <p class="icon-item">
                    <o-icon><icon-cancel></icon-cancel></o-icon>
                  </p>
                  <!-- <div class="icon-name">取消公开</div> -->
                </div>
              </template>
            </div>
            <div class="handles-contain">
              <!-- <p @click="downloadImage(value)">
                  <o-icon><icon-download></icon-download></o-icon>
                </p> -->
              <div class="func-item">
                <p @click="shareImage(value)">
                  <o-icon><icon-share></icon-share></o-icon>
                </p>
                <!-- <div class="icon-name">分享</div> -->
              </div>

              <template v-if="!inferList[key].isCollected">
                <div class="func-item" @click="handleCollect(value, key)">
                  <p>
                    <o-icon><icon-like></icon-like></o-icon>
                  </p>
                  <!-- <div class="icon-name">收藏</div> -->
                </div>
              </template>

              <template v-if="inferList[key].isCollected">
                <div class="func-item" @click="handleCancelCollect(key)">
                  <p class="liked">
                    <o-icon><icon-heart></icon-heart></o-icon>
                  </p>
                  <!-- <div class="icon-name">取消收藏</div> -->
                </div>
              </template>
            </div>
          </div>
          <!-- <div class="mask"></div> -->
        </div>
      </div>

      <!-- <div v-if="isError" class="infer-dlg-error">
        <p>
          <o-icon><icon-warning></icon-warning></o-icon>
        </p>

        <p>{{ errorMsg }}</p>

        <p @click="reEnterDesc">
          <span>重新输入</span>
          <o-icon><icon-right></icon-right></o-icon>
        </p>
      </div> -->
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
  max-width: 1472px;
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
          .icon-name {
            color: #fff;
            font-size: 14px;
            margin-top: 6px;
            text-align: center;
            @media screen and (max-width: 768px) {
              font-size: 12px;
            }
          }
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
        height: 365px;
        padding-bottom: 55px;
      }
      .style-tag {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        column-gap: 50px;
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
  .mobile-btn {
    background-image: url('@/assets/imgs/wukong/button-bg.png');
    background-repeat: no-repeat;
    background-size: cover;
    width: 104px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    color: #fff;
    font-size: 12px;
    font-weight: 500;
    margin: 24px auto 8px;
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
.wk-experience {
  display: flex;
  width: 100%;
  max-width: 1472px;
  padding: 24px 16px 64px;
  margin: 0 auto;

  .wrap-left {
    width: 354px;
    text-align: center;
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 16px;
    padding-bottom: 40px;
    position: relative;
    :deep(.el-textarea) {
      width: calc(100% - 48px) !important;
      margin: 24px 24px 16px;
      border-radius: 8px;
      .el-textarea__inner {
        background: rgba(255, 255, 255, 0.9);
        box-shadow: 0 0 0 1px #fff inset;
        border-radius: 8px;
      }
    }
  }
  .wrap-right {
    width: calc(100% - 370px);
    background-color: rgba(255, 255, 255, 0.8);
    margin-left: 16px;
    border-radius: 16px;
    .sider-content {
      padding: 24px 40px;
      display: flex;
      justify-content: space-between;
    }
    .content-left {
      font-size: 14px;
      color: #555555;
      padding: 4px 12px;
      background: rgba(13, 141, 255, 0.1);
      border-radius: 14px;
      cursor: pointer;
      .o-icon svg {
        transform: rotate(180deg);
        color: #0d8dff;
        margin-left: 2px;
        font-size: 16px;
      }
    }
    .content-right {
      text-align: right;
      font-size: 14px;
      color: #555555;
      .album {
        margin-right: 12px;
      }
      .painting,
      .album {
        padding: 4px 12px;
        background: rgba(13, 141, 255, 0.1);
        border-radius: 14px;
        cursor: pointer;
      }
      .o-icon {
        color: #0d8dff;
        margin-left: 2px;
        font-size: 16px;
      }
    }
    .empty {
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px dashed #dfe7fa;
      border-radius: 16px;
      margin: 0 40px 40px;
      height: calc(100% - 116px);
      p {
        width: 100%;
        color: #555555;
        font-size: 14px;
        margin-top: 21px;
      }
      img {
        width: 54px;
        height: 54px;
      }
      .tip {
        text-align: center;
        img {
          width: 99px;
        }
      }
      .waiting {
        text-align: center;
      }
    }
    .img-box {
      display: flex;
      height: calc(100% - 116px);
      align-items: center;
      gap: 24px;
      margin: 0 40px;
      width: calc(100% - 80px);
      img {
        width: 100%;
        max-width: 500px;
        border-radius: 18px;
        cursor: pointer;
      }
    }
    /* pc生成图片 */
    .result-item1 {
      position: relative;
      margin: 54px 36px;
      width: calc(100% - 64px);
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 42px;
      .turn {
        font-size: 28px;
        color: #fff;
        background-color: rgba(229, 232, 240, 1);
        border-radius: 50%;
        cursor: pointer;
      }
      @media screen and (max-width: 767px) {
        display: none;
      }

      img {
        height: 100%;
        width: calc(100% - 138px);
        max-width: 670px;
      }
      .mask {
        position: absolute;
        bottom: 0;
        background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 100%);
        width: 100%;
        height: 16vh;
        border-radius: 18px;
        @media screen and (max-width: 768px) {
          height: 10vh;
        }
      }

      .handles {
        position: absolute;
        top: -20px;
        right: 20px;
        z-index: 20;
        display: flex;
        flex-direction: column;
        padding: 16px 0;
        background: #fff;
        color: #b2b2b2;
        border-radius: 22px;
        max-height: 190px;
        box-shadow: 0px 0px 24px 0px rgba(0, 0, 0, 0.05);

        @media screen and (max-width: 1080px) {
          top: -50px;
        }
        @media screen and (max-width: 768px) {
          padding: 8px;
        }
        .handles-contain,
        .public {
          display: flex;
          flex-direction: column;

          .o-icon {
            color: #b2b2b2;
            font-size: 24px;
            &:hover {
              color: #2197ff;
            }
          }

          .liked {
            .o-icon {
              font-size: 20px;
            }
          }
          .icon-name {
            color: #b2b2b2;
            font-size: 14px;
            text-align: center;
            cursor: pointer;
          }
          .func-item {
            cursor: pointer;
            position: relative;
            .icon-name {
              color: #b2b2b2;
              font-size: 14px;
              line-height: 20px;
              text-align: center;
              position: absolute;
              left: 50px;
              white-space: nowrap;
              top: 8px;
              z-index: 15;
              padding: 4px 8px;
              background-color: #ffffff;
              border-radius: 3px;
              display: none;
              box-shadow: 0px 0px 24px 0px rgba(0, 0, 0, 0.05);
              @media screen and (max-width: 1280px) {
                font-size: 12px;
                top: 4px;
                left: 30px;
              }
            }
            .arrow {
              position: absolute;
              left: 25px;
              top: -18px;
              width: 80px;
              height: 80px;
              z-index: 10;
              display: none;
              @media screen and (max-width: 1280px) {
                left: 8px;
                top: -12px;
                height: 60px;
              }
            }
            &:hover {
              .icon-name {
                display: block;
              }
              .arrow {
                display: block;
              }
            }
          }
          p {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.1);
            font-size: 24px;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            margin: 0 auto;
            @media screen and (max-width: 1280px) {
              width: 24px;
              height: 24px;
              .o-icon {
                font-size: 16px;
              }
            }
            &:nth-child(2) {
              margin: 0 16px;
              @media screen and (max-width: 1450px) {
                margin: 0 8px;
              }
            }
            &:hover {
              background: rgba(255, 255, 255, 0.3);
            }
          }
        }
      }
    }
  }
  @media screen and (max-width: 820px) {
    display: none;
  }
  .title {
    font-size: 16px;
    font-weight: 400;
    color: #555;
    line-height: 25px;
    margin-right: 24px;
  }
  .active {
    color: #0d8dff !important;
    background: #e5f3ff !important;
  }
  .active-1 {
    border: 3px solid #008eff !important;
    border-radius: 6px;
  }

  .wk-experience-examples {
    display: flex;
    margin-top: 48px;
    align-items: center;
    margin: 0 24px;
    @media screen and (max-width: 820px) {
      margin-top: 24px;
      align-items: flex-start;
    }
    .example-items {
      flex: 1;
      display: flex;
      max-width: 280px;
      flex-wrap: nowrap;
      p {
        color: #b2b2b2;
        // border: 1px solid #0d8dff;
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
    .refresh {
      font-size: 12px;
      font-weight: 400;
      color: #0d8dff;
      cursor: pointer;
      display: flex;
      align-items: center;
      .o-icon {
        margin-right: 4px;
        font-size: 16px;
      }
    }
  }
  .wk-experience-styles {
    margin-top: 30px;
    // display: flex;
    .title {
      text-align: left;
      margin-left: 24px;
      display: flex;
      justify-content: space-between;
    }
    @media screen and (max-width: 820px) {
      flex-direction: column;
      margin-top: 16px;
    }
    .content {
      flex: 1;
      height: 380px;
      padding-bottom: 67px;
      overflow: auto;
      margin-top: 16px;
      &::-webkit-scrollbar {
        width: 0;
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
        // background:transparent;
      }
      @media screen and (max-width: 820px) {
        margin-top: 24px;
      }
      .style-tag {
        display: flex;
        cursor: pointer;
        justify-content: space-between;
        flex-wrap: wrap;
        padding: 0 24px;
      }
      .sort-tag {
        display: flex;
        flex-wrap: wrap;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(5px);
        border-radius: 8px;
        margin-top: 16px;
        padding: 8px 24px 24px;
        width: 100%;
        min-height: 93px;
        position: relative;
        .triangle {
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-bottom: 10px solid rgba(85, 85, 85, 0.3);
          position: absolute;
          top: -10px;
        }
        .triangle0 {
          left: 62px;
        }
        .triangle1 {
          left: 202px;
        }
        .triangle2 {
          left: 358px;
        }
        .triangle3 {
          left: 498px;
        }
        .triangle4 {
          left: 638px;
        }
        .sort-item {
          background: rgba(13, 141, 255, 0.3);
          border-radius: 8px;
          border: 1px solid #0d8dff;
          padding: 12px 16px;
          margin-right: 16px;
          margin-top: 16px;
          font-size: 18px;
          font-weight: 400;
          color: #b2b2b2;
          cursor: pointer;
          @media screen and (max-width: 768px) {
            padding: 8px 12px;
            font-size: 16px;
            height: 36px;
            line-height: 18px;
          }
        }
      }
    }
    .style-item {
      justify-content: center;
      width: 65px;
      margin-bottom: 16px;
      border-radius: 5px;
      color: #555555;
      position: relative;
      overflow: hidden;
      img {
        width: 65px;
        height: 65px;
      }
      &-name {
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding-top: 7px;
        text-align: center;
        font-size: 14px;
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
  }
  .wk-experience-btn {
    background-image: url('@/assets/imgs/wukong/button-bg.png');
    background-repeat: no-repeat;
    background-size: cover;
    width: 130px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    color: #fff;
    font-size: 14px;
    font-weight: 500;
    margin: 25px auto 40px;
    cursor: pointer;
    @media screen and (max-width: 820px) {
      margin: 24px auto 0px;
    }
  }
  .experience-btn {
    padding-top: 24px;
    background: rgba(255, 255, 255, 0.8);
    position: absolute;
    bottom: 40px;
    width: 100%;
    backdrop-filter: blur(10px);
  }
  .o-button {
    padding: 9px 28px;
    border-radius: 22px;
  }
}
:deep(.confirm-dlg) {
  @media screen and (max-width: 768px) {
    // --el-dialog-width: 80vw !important;
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
