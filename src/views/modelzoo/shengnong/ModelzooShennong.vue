<script setup>
import { ref, nextTick } from 'vue';
// import { useRoute, useRouter } from 'vue-router';
import OButton from '@/components/OButton.vue';

import { ArrowRight } from '@element-plus/icons-vue';
import shennongBanner from '@/assets/imgs/shennong/shennong-banner.png';
import shennongInfo1 from '@/assets/imgs/shennong/shennong-info1.png';
import shennongVideo from '@/assets/imgs/shennong/shennong-video2.png';
import shennongPlay from '@/assets/imgs/taichu/taichuplay.png';
import taichuClose from '@/assets/imgs/taichu/taichu-close.png';
const shennongvideo =
  'https://obs-9be7.obs.cn-east-2.myhuaweicloud.com/turing/newVideo/%E9%B9%8F%E5%9F%8E%E7%A5%9E%E5%86%9C.mp4';
const showShennongVideo = ref(false);

// 播放视频
function playShennongVideo() {
  showShennongVideo.value = true;
  nextTick(() => {
    const shennongVideo = document.getElementById('shennongVideo');
    shennongVideo.play();
  });
}
// 结束视频
function closeShennongVideo() {
  const shennongVideo = document.getElementById('shennongVideo');
  shennongVideo.pause();
  shennongVideo.currentTime = 0;
  showShennongVideo.value = false;
}
</script>

<template>
  <div class="shennong">
    <div class="shennong-wrap">
      <div class="shennong-bread">
        <el-breadcrumb :separator-icon="ArrowRight">
          <el-breadcrumb-item :to="{ path: '/modelzoo' }"
            >大模型</el-breadcrumb-item
          >
          <el-breadcrumb-item>鹏程.神农</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="shennong-content">
        <div class="shennong-banner">
          <div class="banner-left">
            <img :src="shennongBanner" alt="" />
          </div>
          <div class="banner-right">
            <div class="right-wrapper">
              <div class="banner-right-title">鹏程.神农</div>
              <div class="banner-right-content">
                面向生物医学领域的人工智能平台，包含蛋白质结构预测等多个模块，为制药企业和医学研究机构提供平台能力，加速新型药物的筛选与创制。
              </div>
            </div>
            <div class="banner-right-btn">
              <OButton type="secondary" size="small" animation class="home-btn">
                敬请期待
              </OButton>
            </div>
          </div>
        </div>
        <div class="shennong-detail">
          <div class="shennong-detail-desc">
            <div class="title">简述</div>
            <p class="info">
              以蛋白质研究为起点，基于“鹏城云脑II”超大规模算力集群以及MindSpore
              AI框架，打造“鹏程.神农”生物信息研究平台，旨在用AI的力量助力生物医药的探索。“鹏程.神农”是一个面向生物医学领域的人工智能平台，包含蛋白质结构预测、小分子生成、靶点与小分子相互作用预测以及新抗菌多肽设计与效果评价等模块。制药企业和医学研究机构可以使用“鹏程.神农”提供的AI能力，加速新型药物的筛选和创制。
            </p>
            <div class="info-img">
              <img :src="shennongInfo1" alt="" />
            </div>
            <div class="introduce-video">
              <div class="introduce-video-title">介绍视频</div>
              <div class="introduce-video-content">
                <img class="content-img" :src="shennongVideo" alt="" />
                <div class="video-img">
                  <img :src="shennongPlay" alt="" @click="playShennongVideo" />
                </div>
                <div v-if="showShennongVideo" class="video-info">
                  <img
                    class="close-btn"
                    :src="taichuClose"
                    alt=""
                    @click="closeShennongVideo"
                  />
                  <video
                    id="shennongVideo"
                    controls="controls"
                    :src="shennongvideo"
                    class="shennong-video"
                  ></video>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.shennong {
  min-height: calc(100vh - 200px);
  background-color: #f5f6f8;
  padding-top: 80px;
  @media screen and (max-width: 820px) {
    padding-top: 22px;
  }
  .shennong-wrap {
    padding: 42px 16px 64px;
    margin: 0 auto;
    max-width: 1472px;
    padding-bottom: 40px;
    .shennong-bread {
      margin-bottom: 40px;
      .el-breadcrumb {
        height: 21px;
        line-height: 21px;
        .el-breadcrumb__item {
          :deep(.el-breadcrumb__inner.is-link) {
            color: #555;
            font-weight: 400;
            &:hover {
              color: #0d8dff;
            }
          }
          :deep(.el-breadcrumb__separator.el-icon) {
            color: #555;
          }
        }
        :deep(.el-breadcrumb__item:last-child .el-breadcrumb__inner) {
          color: #000;
        }
      }
      @media screen and (max-width: 820px) {
        display: none;
      }
    }
    .shennong-content {
      .shennong-banner {
        padding: 40px;
        background-color: #fff;
        display: flex;
        border-radius: 16px;
        @media screen and (max-width: 820px) {
          margin-top: 0;
          padding: 16px;
        }
        @media screen and (max-width: 768px) {
          margin-top: 0;
          padding: 16px;
        }
        .banner-left {
          margin-right: 40px;
          img {
            width: 416px;
            height: 100%;
            border-radius: 16px;
          }
          @media screen and (max-width: 820px) {
            display: none;
          }
        }
        .banner-right {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          &-title {
            height: 48px;
            line-height: 48px;
            font-size: 36px;
            color: #000000;
            margin-bottom: 16px;
            @media screen and (max-width: 820px) {
              margin: 0 0 8px;
              font-size: 14px;
              line-height: 22px;
              height: 22px;
            }
          }
          &-content {
            font-size: 14px;
            color: #555555;
            line-height: 22px;
            @media screen and (max-width: 820px) {
              margin: 8px 0 16px;
              font-size: 12px;
              line-height: 18px;
              height: auto;
            }
          }
          @media screen and (max-width: 820px) {
            .o-button {
              line-height: 22px;
              padding: 2px !important;
              font-size: 14px;
            }
          }
        }
      }
      .shennong-detail {
        margin-top: 24px;
        padding: 40px 80px;
        background-color: #fff;
        border-radius: 16px;
        @media screen and (max-width: 820px) {
          padding: 16px;
          margin-top: 16px;
        }
        &-desc {
          .title {
            height: 32px;
            line-height: 32px;
            font-size: 24px;
            font-weight: 500;
            color: #000000;
            margin-bottom: 24px;
            @media screen and (max-width: 820px) {
              margin: 0 0 8px;
              font-size: 14px;
              line-height: 22px;
              height: 22px;
            }
          }
          .info {
            // height: 308px;
            line-height: 22px;
            font-size: 14px;
            color: #555555;
            margin-bottom: 16px;
            @media screen and (max-width: 820px) {
              margin: 8px 0;
              font-size: 12px;
              line-height: 18px;
              height: auto;
            }
          }
          .info-img {
            width: 100%;
            img {
              width: 100%;
            }
          }
          .introduce-video {
            &-title {
              height: 28px;
              line-height: 28px;
              font-size: 20px;
              color: #000000;
              margin: 64px 0 16px;
              @media screen and (max-width: 820px) {
                margin: 24px 0 8px;
                font-size: 14px;
                line-height: 22px;
                height: 22px;
              }
            }
            &-content {
              position: relative;
              .content-img {
                width: 100%;
              }
              .video-img {
                width: 100%;
                text-align: center;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 9;
                cursor: pointer;
              }
              .video-info {
                width: 100%;
                height: 100%;
                position: relative;
                position: absolute;
                top: 0;
                left: 0;
                z-index: 10;
                .close-btn {
                  height: 100px;
                  position: absolute;
                  right: 16px;
                  top: 16px;
                  width: 22px;
                  height: 22px;
                  z-index: 99;
                  color: #fff;
                  cursor: pointer;
                }
                video {
                  width: 100%;
                  height: 100%;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
