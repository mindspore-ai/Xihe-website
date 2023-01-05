<script setup>
import { ref, onMounted } from 'vue';

import { getWuKongPic } from '@/api/api-modelzoo.js';

const imgs = ref([]);
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
      bottom: 0;
      background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 100%);
      width: 100%;
      height: 60%;
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
      column-gap: 24px;
      row-gap: 24px;
      margin-bottom: 24px;
      .img-box {
        position: relative;
        cursor: pointer;
        &:hover {
          .imgs-info {
            display: block;
          }
        }
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
          z-index: 200;
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
