<script setup>
import { ref, onMounted } from 'vue';

import { getWuKongPic } from '@/api/api-modelzoo.js';
// const imgsVisible = ref(false);

const imgs = ref([
  // {
  //   link: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic1.win4000.com%2Fwallpaper%2Fa%2F586ddfd220e8b.jpg&refer=http%3A%2F%2Fpic1.win4000.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1673076183&t=37b258a21bc8060d74d78e956c6698d3',
  //   style: '#风格：动漫 宫崎骏',
  //   source: '来自深渊 风景 绘画 写实风格',
  // },
]);
const params = { page_num: 1, count_per_page: 28 };
getWuKongPic(params).then((res) => {
  imgs.value = res.data.pictures;
});
let timer = null;
onMounted(() => {
  document
    .getElementsByClassName('el-dialog')[0]
    .addEventListener('scroll', (e) => {
      let scrollTop = e.target.scrollTop;
      let windowHeitht = e.target.clientHeight;
      let scrollHeight = e.target.scrollHeight;
      let total = scrollTop + windowHeitht;
      if (Math.floor(total) === scrollHeight && imgs.value.length < 108) {
        if (timer) {
          return;
        }
        timer = setTimeout(() => {
          params.page_num++;
          getWuKongPic(params).then((res) => {
            // console.log(Math.floor(total), scrollHeight);
            imgs.value = imgs.value.concat(res.data.pictures);
          });
          timer = null;
        }, 100);
      }
    });
});
</script>
<template>
  <div>
    <div class="picture-album">
      <div
        v-for="item in Math.ceil(imgs.length / 28)"
        :key="item"
        class="album-list"
      >
        <div class="album-item1">
          <div v-for="items in 7" :key="items" class="img-box">
            <div v-if="imgs[items + (item - 1) * 28 - 1]">
              <img :src="imgs[items + (item - 1) * 28 - 1].link" alt="" />
              <div class="imgs-info">
                <div class="style">
                  #风格：{{ imgs[items + (item - 1) * 28 - 1].style }}
                </div>
                <div class="source">
                  {{ imgs[items + (item - 1) * 28 - 1].desc }}
                </div>
              </div>
              <div class="img-mask"></div>
            </div>
          </div>
        </div>
        <div class="album-item2">
          <div v-for="items in 7" :key="items" class="img-box">
            <div v-if="imgs[items + (item - 1) * 28 + 6]">
              <img :src="imgs[items + (item - 1) * 28 + 6].link" alt="" />
              <div class="imgs-info">
                <div class="style">
                  #风格：{{ imgs[items + (item - 1) * 28 + 6].style }}
                </div>
                <div class="source">
                  {{ imgs[items + (item - 1) * 28 + 6].desc }}
                </div>
              </div>
              <div class="img-mask"></div>
            </div>
          </div>
        </div>
        <div class="album-item3">
          <div v-for="items in 7" :key="items" class="img-box">
            <div v-if="imgs[items + (item - 1) * 28 + 13]">
              <img :src="imgs[items + (item - 1) * 28 + 13].link" alt="" />
              <div class="imgs-info">
                <div class="style">
                  #风格：{{ imgs[items + (item - 1) * 28 + 13].style }}
                </div>
                <div class="source">
                  {{ imgs[items + (item - 1) * 28 + 13].desc }}
                </div>
              </div>
              <div class="img-mask"></div>
            </div>
          </div>
        </div>
        <div class="album-item4">
          <div v-for="items in 7" :key="items" class="img-box">
            <div v-if="imgs[items + (item - 1) * 28 + 20]">
              <img :src="imgs[items + (item - 1) * 28 + 20].link" alt="" />
              <div class="imgs-info">
                <div class="style">
                  #风格：{{ imgs[items + (item - 1) * 28 + 20].style }}
                </div>
                <div class="source">
                  {{ imgs[items + (item - 1) * 28 + 20].desc }}
                </div>
              </div>
              <div class="img-mask"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.picture-album {
  max-width: 1440px;
  margin: 0 auto;
  .album-list {
    .img-mask {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      opacity: 50%;
      background: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1));
      display: none;
    }
    .album-item1 {
      .img-box {
        position: relative;
        &:first-child {
          grid-area: 1 / 1 / 3 / 3;
        }
        &:hover {
          .img-mask {
            display: block;
          }
        }
      }
    }
    .album-item2 {
      .img-box {
        position: relative;
        &:nth-child(2) {
          grid-area: 1 / 2 / 3 / 4;
        }
        &:hover {
          .img-mask {
            display: block;
          }
        }
      }
    }
    .album-item3 {
      .img-box {
        position: relative;
        &:nth-child(3) {
          grid-area: 1 / 3 / 3 / 5;
        }
        &:hover {
          .img-mask {
            display: block;
          }
        }
      }
    }
    .album-item4 {
      .img-box {
        position: relative;
        &:nth-child(4) {
          grid-area: 1 / 4 / 3 / 6;
        }
        &:hover {
          .img-mask {
            display: block;
          }
        }
      }
    }
    .album-item1,
    .album-item2,
    .album-item3,
    .album-item4 {
      width: 100%;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
      // grid-template-columns: repeat(4, 100px);
      column-gap: 24px;
      row-gap: 24px;
      margin-bottom: 24px;
      .img-box {
        // background-color: #bfa;
        position: relative;
        cursor: pointer;
        &:hover {
          .imgs-info {
            display: block;
          }
        }
        // &:first-child {
        //   grid-area: 1 / 1 / 3 / 3;
        // }
        img {
          width: 100%;
          height: 100%;
        }
        .imgs-info {
          display: none;
          width: 100%;
          font-size: 18px;
          color: #ffffff;
          position: absolute;
          bottom: 24px;
          left: 0;
          padding: 0 24px;
          .style {
            margin-bottom: 10px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .source {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
    }
  }
}
</style>
