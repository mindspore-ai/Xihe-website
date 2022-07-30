<script setup>
import { ref, nextTick } from 'vue';

import taichuEfficient from '@/assets/imgs/taichu/taichu-efficient.png';
import taichuEfficient1 from '@/assets/imgs/taichu/taichu-efficient1.png';
import taichuEfficient2 from '@/assets/imgs/taichu/taichu-efficient2.png';
import taichuEfficient3 from '@/assets/imgs/taichu/taichu-efficient3.png';
import taichuLargeimg1 from '@/assets/imgs/taichu/taichu-largeimg1.png';
import taichuLargeimg2 from '@/assets/imgs/taichu/taichu-largeimg2.png';
import taichuArrows from '@/assets/imgs/taichu/taichu-arrows.png';
import taichuVideo1 from '@/assets/imgs/taichu/taichu-video1.png';
import taichuVideo2 from '@/assets/imgs/taichu/taichu-video2.png';
import taichuVideo3 from '@/assets/imgs/taichu/taichu-video3.png';
import taichuVideo4 from '@/assets/imgs/taichu/taichu-video4.png';
import taichuVideo5 from '@/assets/imgs/taichu/taichuvideo5.png';
import taichuPlay from '@/assets/imgs/taichu/taichuplay.png';
import taichuClose from '@/assets/imgs/taichu/taichu-close.png';
import taichuCompanyImg from '@/assets/imgs/taichu/taichu-companyimg.png';
const taichuvideo1 =
  'https://obs-9be7.obs.cn-east-2.myhuaweicloud.com/turing/newVideo/%E4%BB%A5%E5%9B%BE%E7%94%9F%E9%9F%B3%2001.mp4';
const taichuvideo2 =
  'https://obs-9be7.obs.cn-east-2.myhuaweicloud.com/turing/newVideo/%E4%BB%A5%E5%9B%BE%E7%94%9F%E9%9F%B3%2002.mp4';
const taichuvideo3 =
  'https://obs-9be7.obs.cn-east-2.myhuaweicloud.com/turing/newVideo/%E4%BB%A5%E9%9F%B3%E7%94%9F%E5%9B%BE%2001.mp4';
const taichuvideo4 =
  'https://obs-9be7.obs.cn-east-2.myhuaweicloud.com/turing/newVideo/%E4%BB%A5%E9%9F%B3%E7%94%9F%E5%9B%BE%2002.mp4';
const referencevideo =
  'https://obs-9be7.obs.cn-east-2.myhuaweicloud.com/turing/newVideo/%E7%B4%AB%E4%B8%9C%E5%A4%AA%E5%88%9D.mp4';
const instancevideo =
  'https://obs-9be7.obs.cn-east-2.myhuaweicloud.com/turing/newVideo/%E5%A4%9A%E6%A8%A1%E6%80%81%E5%BA%94%E7%94%A8%E8%A7%86%E9%A2%91%E8%B0%83%E8%89%B2%E7%89%88-0614.mp4';
// const videoSrc = ref('');
const showVideo = ref(false);
const showReferenceVideo = ref(false);
const showInstanceVideo = ref(false);
// 图片数组
const videoImgArr1 = [
  {
    id: 1,
    src: taichuVideo1,
    videoUrl: taichuvideo1,
  },
  {
    id: 2,
    src: taichuVideo3,
    videoUrl: taichuvideo2,
  },
];
const videoImgArr2 = [
  {
    id: 1,
    src: taichuVideo2,
    videoUrl: taichuvideo3,
  },
  {
    id: 2,
    src: taichuVideo2,
    videoUrl: taichuvideo4,
  },
];
function playVideo(videoUrl) {
  // console.log(videoUrl);
  // 获得视频元素
  const video = document.getElementById('video');
  // console.log('video: ', video.src);
  showVideo.value = true;
  video.src = videoUrl;
  video.play();
}
function toggleDialog() {
  const video = document.getElementById('video');
  showVideo.value = false;
  // 结束视频
  video.pause();
  video.currentTime = 0;
}
// 播放参考设计部分的视频
function playReferenceVideo() {
  showReferenceVideo.value = true;
  nextTick(() => {
    const referenceVideo = document.getElementById('referenceVideo');
    referenceVideo.play();
  });
}
// 结束参考设计部分的视频
function closeReferenceVideo() {
  const referenceVideo = document.getElementById('referenceVideo');
  referenceVideo.pause();
  referenceVideo.currentTime = 0;
  showReferenceVideo.value = false;
}
// 播放应用实例部分的视频
function playInstanceVideo() {
  showInstanceVideo.value = true;
  nextTick(() => {
    const instanceVideo = document.getElementById('instanceVideo');
    instanceVideo.play();
  });
}
// 结束应用实例部分的视频
function closeInstanceVideo() {
  const instanceVideo = document.getElementById('instanceVideo');
  instanceVideo.pause();
  instanceVideo.currentTime = 0;
  showInstanceVideo.value = false;
}
</script>
<template>
  <div class="taichu-detail">
    <div class="taichu-detail-intro">
      <div class="intro-title">简述</div>
      <p class="intro-info info1">
        紫东.太初是中科院自动化所与MindSpore社区联合打造的全球首个图、文、音三模态大模型。紫东.太初将文本
        + 视觉 + 语音
        各个模型高效协同，实现超强性能，在图文跨模态理解与生成性能上都能领先目前业界的SOTA模型，高效完成跨模态检测、视觉问答、语义描述等下游任务。此外，视频理解与描述的性能更是实现了全球第一，在今年的两个国际大赛中，ACM
        Multimedia（国际多媒体大会）
        和ICCV（国际计算机视觉大会）紫东太初都获得了第一名的成绩。
      </p>
      <p class="intro-info">
        紫东.太初的发布将改变当前单一模型对应单一任务的人工智能研发范式，实现三模态图文音的统一语义表达，大幅提升文本、语音、图像和视频等领域的基础任务性能，并在多模态内容的理解、搜索、推荐和问答，语音识别和合成，人机交互和无人驾驶等商业应用中具有潜力巨大的市场价值。
      </p>
      <div class="intro-body">
        <div class="intro-body-title">
          全球首个三模态大模型“紫东.太初”——助力科研创新与应用孵化
        </div>
        <div class="intro-body-diagram">
          <img class="diagram-left" :src="taichuEfficient" alt="" />
          <div class="diagram-right">
            <div class="text">
              <img :src="taichuEfficient1" alt="" />
              <img :src="taichuEfficient2" alt="" />
              <img :src="taichuEfficient3" alt="" />
              <p>以文搜图</p>
            </div>
            <div class="diagram-video">
              <div
                v-for="item in videoImgArr1"
                :key="item.id"
                class="diagram-video-img"
                @click="playVideo(item.videoUrl)"
              >
                <img class="video-img1" :src="item.src" alt="" />
                <img class="video-img2" :src="taichuPlay" alt="" />
              </div>
              <!-- <div class="audio-video-img" @click="playVideo">
                <img class="audio-video-img1" :src="taichuVideo3" alt="" />
                <img class="audio-video-img2" :src="taichuPlay" alt="" />
              </div> -->
              <p>以图生音</p>
            </div>
            <div class="diagram-video">
              <div
                v-for="item in videoImgArr2"
                :key="item.id"
                class="diagram-video-img"
                @click="playVideo(item.videoUrl)"
              >
                <img class="video-img1" :src="taichuVideo2" alt="" />
                <img class="video-img2" :src="taichuPlay" alt="" />
              </div>
              <!-- <div class="audio-video-img" @click="playVideo">
                <img class="audio-video-img1" :src="taichuVideo2" alt="" />
                <img class="audio-video-img2" :src="taichuPlay" alt="" />
              </div> -->
              <p>以音生图</p>
            </div>
          </div>
        </div>
      </div>
      <div class="intro-img">
        <img :src="taichuLargeimg1" alt="" />
      </div>
    </div>
    <div class="taichu-detail-reference">
      <div class="reference-title">参考设计——多模态对话虚拟人“小初”</div>
      <p class="reference-info">
        自动化所所长徐波与自动化所基于紫东太初打造的三维虚拟人“小初”进行了跨时空对话，展示了不同模态间的互相转换和生成实例，涵盖视频生成、视频描述、图像生成、智能问答、语音识别等多个功能。徐波同时介绍了紫东太初大模型在纺织工业生产线中的实际应用案例。在纺织厂织机运转的过程中，紫东太初融合多模态信息，可以通过语音识别来判断断纬和断经，通过视觉识别来判断布匹的缺陷，展示出强大的综合研判能力和广阔的应用前景。
      </p>
      <div class="reference-video">
        <img class="video-img1" :src="taichuVideo4" alt="" />
        <div class="video-img2">
          <img :src="taichuPlay" alt="" @click="playReferenceVideo" />
          <div>紫东.太初</div>
          <p>全球首个三模态大模型</p>
        </div>
        <div v-if="showReferenceVideo" class="video-content">
          <!-- <span class="close-btn" @click="closeReferenceVideo"> -->
          <!-- <img src="" alt=""> -->
          <img
            class="close-btn"
            :src="taichuClose"
            alt=""
            @click="closeReferenceVideo"
          />
          <!-- </span> -->
          <video
            id="referenceVideo"
            controls="controls"
            :src="referencevideo"
            class="reference-video"
          ></video>
        </div>
      </div>
    </div>
    <div class="taichu-detail-instance">
      <div class="instance-title">应用实例——千博手语教考一体机</div>
      <p class="instance-info">
        手语教考一体机：我国共有2700多万听障人士，他们面临沟通难、就业难等一系列问题，究其原因，主要是手语知识学习的挑战，这其中手语词汇匮乏、师资短缺、手语标准难统一是三大挑战
        。千博信息基于紫东.太初利用昇思MindSpore开发了手语多模态模型，开创性地实现手语动作与示意图片和文字的联动，让初学者更加方便的理解；基于手语多模态模型，利用昇腾AI基础软硬件平台开发了手语教考一体机，帮助学生随学随练随考，高效学习。
        <br />
        在解决手语师资短缺的同时，还能推动手语标准的推广。目前一体机已在湘潭特校等数十个学校陆续上线。
      </p>
      <div class="instance-desc">
        <div class="instance-desc-title">听障群体持续学习成为难题</div>
        <div class="instance-desc-title2">
          听障人士长期手语学习过程中的三大挑战
        </div>
        <ul class="challenges">
          <li class="challenges-item">
            <div class="challenges-item-left">
              <p class="challenges-item-left-num">1</p>
              <p class="challenges-item-left-title">词汇匮乏</p>
            </div>
            <div class="challenges-item-right">
              <div class="top">
                <span class="top-strip strip"></span>
                <div class="top-total">
                  <p class="title1">69000个词语</p>
                  <p class="title2">《现代汉语词典》新事物 新技术…</p>
                </div>
              </div>
              <div class="bottom">
                <span class="bottom-strip strip"></span>
                <span class="bottom-title">8200个词语</span>
              </div>
            </div>
          </li>
          <li class="challenges-item">
            <div class="challenges-item-left">
              <p class="challenges-item-left-num">2</p>
              <p class="challenges-item-left-title">师资短缺</p>
            </div>
            <div class="challenges-item-right">
              <div class="top">
                <span class="top-strip strip"></span>
                <div class="top-total">
                  <p class="title1">约460万聋哑学生</p>
                  <!-- <p class="title2">《现代汉语词典》新事物 新技术…</p> -->
                </div>
              </div>
              <div class="bottom">
                <span class="bottom-strip strip"></span>
                <span class="bottom-title3"> 约1万名手语教师</span>
              </div>
            </div>
          </li>
          <li class="challenges-item">
            <div class="challenges-item-left">
              <p class="challenges-item-left-num">3</p>
              <p class="challenges-item-left-title">标准不一</p>
            </div>
            <div class="challenges-item-right">
              <ul class="difference-arr">
                <li class="difference-item">
                  <span class="color-block"></span>
                  <span class="text-block">方言差异</span>
                </li>
                <li class="difference-item">
                  <span class="color-block"></span>
                  <span class="text-block">语法差异</span>
                </li>
                <li class="difference-item">
                  <span class="color-block"></span>
                  <span class="text-block">认知差异</span>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
      <div class="instance-AIdesc">
        <div class="instance-AIdesc-title">
          AI赋能，让手语学习更简单、可持续
        </div>
        <ul class="instance-AIdesc-title2">
          <li>
            <span>持续丰富手语词汇库</span>
            <img :src="taichuArrows" alt="" />
          </li>
          <li>
            <span>推动融合手语国家标准制定</span>
            <img :src="taichuArrows" alt="" />
          </li>
          <li>
            <span>持续丰富手语词汇库</span>
          </li>
        </ul>
        <div class="instance-AIdesc-img">
          <img :src="taichuLargeimg2" alt="" />
        </div>
        <img
          class="instance-AIdesc-companyimg"
          :src="taichuCompanyImg"
          alt=""
        />
        <div class="instance-AIdesc-video">
          <img class="video-img1" :src="taichuVideo5" alt="" />
          <div class="video-img2">
            <img :src="taichuPlay" alt="" @click="playInstanceVideo" />
          </div>
          <div v-if="showInstanceVideo" class="video-content">
            <img
              class="close-btn"
              :src="taichuClose"
              alt=""
              @click="closeInstanceVideo"
            />
            <video
              id="instanceVideo"
              controls="controls"
              :src="instancevideo"
              class="instance-video"
            ></video>
          </div>
        </div>
      </div>
    </div>
    <o-dialog :is-center="true" :show="showVideo" @close-click="toggleDialog">
      <video
        id="video"
        width="198"
        height="90"
        controls="controls"
        :src="taichuvideo1"
        class="home-video"
      ></video>
    </o-dialog>
  </div>
</template>

<style lang="scss" scoped>
.taichu-detail {
  padding: 40px 80px;
  background-color: #fff;
  &-intro {
    .intro-title {
      height: 32px;
      font-size: 24px;
      font-weight: 500;
      color: #000000;
      line-height: 32px;
      margin-bottom: 24px;
    }
    .intro-info {
      font-size: 14px;
      font-weight: normal;
      color: #555555;
      line-height: 22px;
    }
    .info1 {
      margin-bottom: 16px;
    }
    .intro-body {
      padding: 24px 128px;
      margin-top: 40px;
      margin-bottom: 24px;
      background-color: #f5f9f8;
      &-title {
        height: 28px;
        line-height: 28px;
        font-size: 20px;
        color: #000000;
        margin-bottom: 24px;
        text-align: center;
      }
      &-diagram {
        display: flex;
        justify-content: space-between;
        .diagram-left {
          width: 213px;
          margin-right: 166px;
        }
        .diagram-right {
          display: flex;
          .text {
            img {
              display: block;
              width: 177px;
              margin-bottom: 24px;
            }
            p {
              height: 14px;
              line-height: 14px;
              font-size: 12px;
              color: #000000;
              text-align: center;
            }
          }
          .diagram-video {
            width: 198px;
            height: 90px;
            margin-left: 24px;
            &-img {
              width: 100%;
              margin-bottom: 24px;
              position: relative;
              cursor: pointer;
              img {
                width: 100%;
              }
              .video-img2 {
                width: 36px;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 1;
              }
            }
            // video {
            //   margin-bottom: 17px;
            // }
            p {
              height: 14px;
              line-height: 14px;
              font-size: 12px;
              color: #000000;
              text-align: center;
            }
          }
        }
      }
    }
    .intro-img {
      img {
        width: 100%;
      }
    }
  }
  &-reference {
    .reference-title {
      height: 28px;
      line-height: 28px;
      font-size: 20px;
      color: #000000;
      margin-top: 40px;
    }
    .reference-info {
      height: 66px;
      line-height: 22px;
      font-size: 14px;
      font-weight: 400;
      color: #555555;
      margin: 10px 0 24px;
    }
    .reference-video {
      width: 100%;
      height: 707px;
      position: relative;
      .video-img1 {
        width: 100%;
        height: 100%;
      }
      .video-img2 {
        width: 100%;
        text-align: center;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 9;
        cursor: pointer;
        div {
          height: 28px;
          font-size: 20px;
          color: #ffffff;
          line-height: 28px;
          margin-top: 16px;
          margin-bottom: 6px;
        }
        p {
          height: 22px;
          font-size: 14px;
          color: #ffffff;
          line-height: 22px;
        }
      }
      .video-content {
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
  &-instance {
    .instance-title {
      height: 28px;
      line-height: 28px;
      font-size: 20px;
      font-weight: 400;
      color: #000000;
      margin: 40px 0 24px;
    }
    .instance-info {
      line-height: 22px;
      font-size: 14px;
      font-weight: 400;
      color: #555555;
    }
    .instance-desc {
      &-title {
        height: 28px;
        line-height: 28px;
        font-size: 20px;
        font-weight: 600;
        color: #000000;
        text-align: center;
        margin: 40px 0 6px;
      }
      &-title2 {
        height: 22px;
        line-height: 22px;
        font-size: 14px;
        font-weight: 400;
        color: #555555;
        text-align: center;
        margin-bottom: 26px;
      }
      .challenges {
        display: flex;
        justify-content: center;
        &-item {
          // width: 410px;
          height: 136px;
          padding: 17px 16px;
          align-items: center;
          background: #f5f9fb;
          margin-right: 16px;
          display: flex;
          // 最后一个子元素
          &:last-child {
            margin-right: 0;
          }
          .challenges-item-left {
            text-align: center;
            padding-right: 16px;
            border-right: 1px solid #eee;
            &-num {
              height: 48px;
              line-height: 48px;
              font-size: 40px;
              font-weight: 600;
              color: #999999;
            }
            &-title {
              height: 24px;
              line-height: 24px;
              font-size: 14px;
              font-weight: 500;
              color: #000000;
            }
          }
          .challenges-item-right {
            padding-left: 16px;
            .top {
              display: flex;
              align-items: center;
              .top-strip {
                width: 90px;
                height: 24px;
                background: #0d8dff;
                margin-right: 10px;
              }
              .strip {
                width: 152px;
              }
              .top-total {
                .title1 {
                  height: 22px;
                  line-height: 22px;
                  font-size: 14px;
                  font-weight: 400;
                  color: #000000;
                }
                .title2 {
                  height: 18px;
                  line-height: 18px;
                  font-size: 12px;
                  font-weight: 400;
                  color: #555555;
                }
              }
            }
            .bottom {
              margin-top: 10px;
              display: flex;
              align-items: center;
              .bottom-strip {
                width: 21px;
                height: 24px;
                background: #ff7f0d;
                margin-right: 12px;
              }
              .strip {
                width: 15px;
              }
              .bottom-title {
                height: 22px;
                line-height: 22px;
                font-size: 14px;
                font-weight: 400;
                color: #000000;
              }
            }
            // .bottom {
            //   margin-top: 10px;
            // }
            .difference-arr {
              display: flex;
              .difference-item {
                display: flex;
                align-items: center;
                margin-left: 24px;
                .color-block {
                  width: 12px;
                  height: 12px;
                  background: #0d8dff;
                  margin-right: 4px;
                }
                .text-block {
                  height: 22px;
                  line-height: 22px;
                  font-size: 12px;
                  font-weight: 400;
                  color: #000000;
                }
              }
            }
          }
        }
      }
    }
    .instance-AIdesc {
      &-title {
        height: 28px;
        line-height: 28px;
        font-size: 20px;
        font-weight: 600;
        color: #000000;
        text-align: center;
        margin: 84px 0 6px;
      }
      &-title2 {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 18px;
        li {
          display: flex;
          align-items: center;
          span {
            height: 22px;
            line-height: 22px;
            font-size: 14px;
            font-weight: 400;
            color: #555555;
          }
          img {
            width: 30px;
            margin: 0 16px;
          }
        }
      }
      &-img {
        img {
          width: 100%;
          padding-bottom: 26px;
          border-bottom: 1px solid #eee;
        }
      }
      &-companyimg {
        display: block;
        width: 421px;
        margin: 52px auto 64px;
      }
      &-video {
        // width: 100%;
        height: 707px;
        background-color: #bfa;
        position: relative;
        .video-img1 {
          width: 100%;
          height: 100%;
        }
        .video-img2 {
          width: 100%;
          text-align: center;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 9;
          cursor: pointer;
        }
        .video-content {
          width: 100%;
          height: 100%;
          position: relative;
          position: absolute;
          z-index: 10;
          top: 0;
          left: 0;
          .close-btn {
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
.o-dialog {
  video {
    width: 100%;
    height: 520px;
  }
}
</style>
