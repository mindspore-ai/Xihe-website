<script setup>
import { ref, onMounted, nextTick } from 'vue';
import html2canvas from 'html2canvas';

import emptyImg from '@/assets/imgs/model-empty.png';

import { getCertificate } from '@/api/api-course';
import { useCourseData } from '@/stores';

const certificate = ref(null);
const certificateData = ref({});
const courseInfo = useCourseData().courseData;
getCertificate(courseInfo.id).then((res) => {
  certificateData.value = res.data;
  console.log('certificateData.value: ', certificateData.value);
});

// const certificateUrl = ref('');
// 生成证书
function generateCertificate() {
  // const certificateDiv = document.querySelector('#certificate');
  const certificateDiv = certificate.value;
  nextTick(() => {
    html2canvas(certificateDiv).then((canvas) => {
      const dataUrl = canvas.toDataURL('image/png');
      // certificateUrl.value = dataUrl;
      // const img = new Image();
      // img.src = dataUrl;
      // document.body.appendChild(img);
      // const link = document.createElement('a');
      // link.download = 'certificate.png';
      // link.href = dataUrl;
      // link.click();
      // link.remove();
    });
  });
}
onMounted(() => {
  generateCertificate();
});
</script>
<template>
  <div class="course-certificate">
    <div
      v-if="!certificateData.is_pass"
      ref="certificate"
      class="certificate-img"
    >
      <p>123{{ certificateData.owner }}</p>
      <img :src="certificateData.cert" alt="" />
      <!-- <img src="@/assets/imgs/logo.png" alt="" /> -->
    </div>
    <div v-else class="empty">
      <img :src="emptyImg" alt="" />
      <p>暂未获得节课证书，继续努力吧～</p>
    </div>
    <!-- <div v-if="certificateUrl">
      <img :src="certificateUrl" alt="" />
    </div> -->
  </div>
</template>

<style lang="scss" scoped>
.course-certificate {
  overflow: hidden;
  .certificate-img {
    position: relative;
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
