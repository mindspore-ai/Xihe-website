<script setup>
import { ref, onMounted } from 'vue';
import html2canvas from 'html2canvas';

import emptyImg from '@/assets/imgs/model-empty.png';

import { getCertificate } from '@/api/api-course';
import { useCourseData } from '@/stores';

const certificateData = ref({});
const courseInfo = useCourseData().courseData;
getCertificate(courseInfo.id).then((res) => {
  certificateData.value = res.data;
  // console.log('certificateData.value: ', certificateData.value);
});

// 生成证书
function generateCertificate() {
  const certificateDiv = document.querySelector('#certificate');
  html2canvas(certificateDiv, {
    useCORS: true,
  }).then((canvas) => {
    const dataUrl = canvas.toDataURL('image/png');
    // console.log('dataUrl: ', dataUrl);
    const img = new Image();
    img.src = dataUrl;
    // console.log('img: ', img);
    document.body.appendChild(img);
    // const link = document.createElement('a');
    // link.style.display = 'none';
    // link.download = 'certificate.png';
    // link.href = dataUrl;
    // link.click();
    // console.log('img: ', link);
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
      id="certificate"
      class="certificate-img"
    >
      <p>杨勇军{{ certificateData.owner }}</p>
      <!-- https://obs-xihe-beijing4-test.obs.cn-north-4.myhuaweicloud.com/xihe-img/course/cert-test.png -->
      <img :src="certificateData.cert" alt="" />
    </div>
    <div v-else class="empty">
      <img :src="emptyImg" alt="" />
      <p>暂未获得节课证书，继续努力吧～</p>
    </div>
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
