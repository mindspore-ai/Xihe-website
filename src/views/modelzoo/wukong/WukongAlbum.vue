<script setup>
import { ref, reactive, watch } from 'vue';

// TODO:
import ceshi1 from '@/assets/imgs/wukong/ceshi1.png';
import ceshi2 from '@/assets/imgs/wukong/ceshi2.png';
const imgsVisible = ref(false);

const imgs = reactive([
  {
    link: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic1.win4000.com%2Fwallpaper%2Fa%2F586ddfd220e8b.jpg&refer=http%3A%2F%2Fpic1.win4000.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1673076183&t=37b258a21bc8060d74d78e956c6698d3',
    style: '#风格：动漫 宫崎骏',
    source: '来自深渊 风景 绘画 写实风格',
  },
  {
    link: 'https://img0.baidu.com/it/u=1006845469,3789220614&fm=253&fmt=auto&app=120&f=JPEG?w=1422&h=800',
    style: '#风格：动漫 宫崎骏',
    source: '来自深渊 风景 绘画 写实风格',
  },
  {
    link: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Flmg.jj20.com%2Fup%2Fallimg%2F4k%2Fs%2F01%2F210924111Q92048-0-lp.jpg&refer=http%3A%2F%2Flmg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1673076522&t=44064e2c5d93bcf723227e5691aa4cc9',
    style: '#风格：动漫 宫崎骏',
    source: '来自深渊 风景 绘画 写实风格',
  },
  {
    link: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Flmg.jj20.com%2Fup%2Fallimg%2F4k%2Fs%2F01%2F210924111Q92048-0-lp.jpg&refer=http%3A%2F%2Flmg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1673076522&t=44064e2c5d93bcf723227e5691aa4cc9',
    style: '#风格：动漫 宫崎骏',
    source: '来自深渊 风景 绘画 写实风格',
  },
  {
    link: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic1.win4000.com%2Fwallpaper%2Fa%2F586ddfd220e8b.jpg&refer=http%3A%2F%2Fpic1.win4000.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1673076183&t=37b258a21bc8060d74d78e956c6698d3',
    style: '#风格：动漫 宫崎骏',
    source: '来自深渊 风景 绘画 写实风格',
  },
  {
    link: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic1.win4000.com%2Fwallpaper%2Fa%2F586ddfd220e8b.jpg&refer=http%3A%2F%2Fpic1.win4000.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1673076183&t=37b258a21bc8060d74d78e956c6698d3',
    style: '#风格：动漫 宫崎骏',
    source: '来自深渊 风景 绘画 写实风格',
  },
  {
    link: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic1.win4000.com%2Fwallpaper%2Fa%2F586ddfd220e8b.jpg&refer=http%3A%2F%2Fpic1.win4000.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1673076183&t=37b258a21bc8060d74d78e956c6698d3',
    style: '#风格：动漫 宫崎骏',
    source: '来自深渊 风景 绘画 写实风格',
  },
]);
</script>
<template>
  <div>
    <div class="picture-album">
      <div class="album-list">
        <div class="album-item1">
          <div v-for="item in imgs" :key="item" class="img-box">
            <img :src="item.link" alt="" />
            <div class="imgs-info">
              <div class="style">#风格：动漫 宫崎骏</div>
              <div class="source">
                来自深渊 风景 绘画写实风格来自深渊 风景深渊 风景 绘画写实风格
              </div>
            </div>
          </div>
        </div>
        <div class="album-item2">
          <div v-for="item in imgs" :key="item" class="img-box">
            <img :src="item.link" alt="" />
            <div class="imgs-info">
              <div class="style">#风格：动漫 宫崎骏</div>
              <div class="source">
                来自深渊 风景 绘画写实风格来自深渊 风景深渊 风景 绘画写实风格
              </div>
            </div>
          </div>
        </div>
        <div class="album-item3">
          <div v-for="item in imgs" :key="item" class="img-box">
            <img :src="item.link" alt="" />
            <div class="imgs-info">
              <div class="style">#风格：动漫 宫崎骏</div>
              <div class="source">
                来自深渊 风景 绘画写实风格来自深渊 风景深渊 风景 绘画写实风格
              </div>
            </div>
          </div>
        </div>
        <div class="album-item4">
          <div v-for="item in imgs" :key="item" class="img-box">
            <img :src="item.link" alt="" />
            <div class="imgs-info">
              <div class="style">#风格：动漫 宫崎骏</div>
              <div class="source">
                来自深渊 风景 绘画写实风格来自深渊 风景深渊 风景 绘画写实风格
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// TODO:
:deep(.el-dialog) {
  // background: rgba(0, 0, 0, 0.85);
  // padding-left: 6%;
  // padding-right: 6%;
  .el-dialog__header {
    height: 80px;
    // width: 100%;
    position: fixed;
    z-index: 10;
    background: #000000;
    margin-right: 0px;
    padding-bottom: 18px;
    span {
      height: 24px;
      line-height: 24px;
      font-size: 24px;
      color: #ffffff;
      // position: fixed;
    }
  }
  .el-dialog__body {
    padding-top: 40px;
    // padding-left: 6%;
    // padding-right: 6%;
    // background: rgba(0, 0, 0, 0.85);
    .picture-album {
      .album-list {
        .album-item1 {
          .img-box {
            &:first-child {
              grid-area: 1 / 1 / 3 / 3;
            }
          }
        }
        .album-item2 {
          .img-box {
            &:nth-child(2) {
              grid-area: 1 / 2 / 3 / 4;
            }
          }
        }
        .album-item3 {
          .img-box {
            &:nth-child(3) {
              grid-area: 1 / 3 / 3 / 5;
            }
          }
        }
        .album-item4 {
          .img-box {
            &:nth-child(4) {
              grid-area: 1 / 4 / 3 / 6;
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
            background-color: #bfa;
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
  }
  .el-dialog__headerbtn {
    position: fixed;
    right: 16px;
    .el-dialog__close {
      width: 48px;
      height: 48px;
      color: #fff;
      svg {
        font-size: 24px;
      }
    }
  }
}

.picture-album {
  .album-list {
    .album-item1 {
      .img-box {
        &:first-child {
          grid-area: 1 / 1 / 3 / 3;
        }
      }
    }
    .album-item2 {
      .img-box {
        &:nth-child(2) {
          grid-area: 1 / 2 / 3 / 4;
        }
      }
    }
    .album-item3 {
      .img-box {
        &:nth-child(3) {
          grid-area: 1 / 3 / 3 / 5;
        }
      }
    }
    .album-item4 {
      .img-box {
        &:nth-child(4) {
          grid-area: 1 / 4 / 3 / 6;
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
        background-color: #bfa;
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
