<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import html2canvas from 'html2canvas';

import emptyImg from '@/assets/imgs/model-empty.png';
import IconDownload from '~icons/app/wukong-download';

import { getCertificate } from '@/api/api-course';
import { useCourseData } from '@/stores';

const router = useRouter();

const certificateRef = ref(null);
const certificateData = ref({});
const courseInfo = useCourseData().courseData;
const show = ref(false);
const showImg = ref(true);

function gainCertificate() {
  if (courseInfo.is_apply) {
    getCertificate(courseInfo.id).then((res) => {
      certificateData.value = res.data;
      show.value = true;
    });
  } else {
    router.push(`/course/${courseInfo.id}`);
  }
}
gainCertificate();
const loadDone = ref(false);
const certRef = ref(null);
// const certNewvalue = ref('');
// 生成证书
const certificateUrl = ref('');
function generateCertificate() {
  const certificateDiv = certificateRef.value;
  html2canvas(certificateDiv).then((canvas) => {
    const dataUrl = canvas.toDataURL('image/png');
    certificateUrl.value = dataUrl;
    showImg.value = false;
  });
}
function loadImg() {
  loadDone.value = true;
  generateCertificate();
}

// 下载证书
function downloadImage(url) {
  let aLink = document.createElement('a');
  aLink.style.display = 'none';
  aLink.href = url;
  aLink.download = 'certificate.png';
  aLink.click();
  aLink.remove();
}
</script>
<template>
  <div v-if="show" class="course-certificate">
    <div
      v-if="certificateData.is_pass && certificateUrl"
      class="certificate-box"
    >
      <img :src="certificateUrl" alt="" class="certificate-loadImg" />
      <div class="certificate-hover">
        <div class="icon-item" @click="downloadImage(certificateUrl)">
          <o-icon><icon-download></icon-download></o-icon>
        </div>
      </div>
    </div>
    <div v-if="!certificateData.is_pass" class="empty">
      <img :src="emptyImg" alt="" />
      <p>暂未获得节课证书，继续努力吧～</p>
    </div>
    <div
      v-if="certificateData.is_pass && showImg"
      ref="certificateRef"
      class="certificate-img"
    >
      <p>123{{ certificateData.owner }}</p>
      <img ref="certRef" src="@/assets/imgs/course/cert.png" @load="loadImg" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.course-certificate {
  overflow: hidden;
  .certificate-box {
    position: relative;
    cursor: pointer;
    &:hover {
      .certificate-hover {
        opacity: 1;
      }
    }
    .certificate-loadImg {
      width: 100%;
    }
    .certificate-hover {
      width: 100%;
      height: 128px;
      background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 100%);
      position: absolute;
      left: 0;
      bottom: 0;
      display: flex;
      justify-content: flex-end;
      align-items: flex-end;
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.2s ease-in-out;
      .icon-item {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.1);
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        top: -40px;
        right: 40px;
        .o-icon {
          color: #fff;
          font-size: 24px;
        }
        &:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      }
    }
  }
  .certificate-img {
    position: relative;
    // display: none;
    // opacity: 0;
    img {
      width: 100%;
      // height: 640px;
    }
    p {
      color: #000;
      font-size: 36px;
      font-weight: 600;
      position: absolute;
      // z-index: 10px;
      top: 375px;
      left: 185px;
    }
  }
  .empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 116px 0;
    img {
      width: 280px;
    }
    p {
      color: #555555;
      margin-top: 24px;
      font-size: 18px;
    }
  }
}
</style>
