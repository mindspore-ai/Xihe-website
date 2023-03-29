<script setup>
import electricity1 from '@/assets/imgs/estate/electricity/electricity1.png';
import electricity2 from '@/assets/imgs/estate/electricity/electricity2.png';
import electricity3 from '@/assets/imgs/estate/electricity/electricity3.png';
</script>
<template>
  <div class="case-explain">
    <div class="explain-title">项目说明</div>
    <div class="case-background">
      <div class="title">案例背景：</div>
      <div class="background-desc">
        <div>
          {{ electricityDetail.background1 }}
        </div>
        <div class="background-img">
          <img :src="electricity1" alt="" />
        </div>
        <div>
          {{ electricityDetail.background2 }}
        </div>
      </div>
    </div>
    <div class="case-intro">
      <div class="title">案例简介：</div>
      <div class="introduction-desc">
        <div>
          {{ electricityDetail.introduction1 }}
        </div>
        <div class="introduction-img">
          <img :src="electricity2" alt="" />
        </div>
        <div>
          {{ electricityDetail.introduction2 }}
        </div>
      </div>
    </div>
    <div class="case-painspot">
      <div class="title">案例痛点：</div>
      <div class="painspot-desc">
        {{ electricityDetail.painspot }}
      </div>
    </div>
    <div class="solution">
      <div class="title">案例优势：</div>
      <div class="solution-desc">
        <div>
          {{ electricityDetail.solution1 }}
        </div>
        <div class="introduction-img">
          <img :src="electricity3" alt="" />
        </div>
        <div>
          {{ electricityDetail.solution2 }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.case-explain {
  .explain-title {
    line-height: 22px;
    font-size: 24px;
    color: #000000;
    margin-bottom: 24px;
  }
  .case-background {
    margin-bottom: 40px;
    .background-desc {
      font-size: 14px;
      font-weight: normal;
      color: #555555;
      line-height: 22px;
    }
    .background-img {
      margin: 24px 0;
      img {
        width: 100%;
        margin-right: 24px;
      }
    }
  }
  .case-intro {
    margin-bottom: 40px;
    .introduction-desc {
      font-size: 14px;
      font-weight: normal;
      color: #555555;
      line-height: 22px;
      .introduction-img {
        margin: 24px 0;
        img {
          width: 100%;
          margin-right: 24px;
        }
      }
    }
  }
  .case-painspot {
    .painspot-desc {
      font-size: 14px;
      font-weight: normal;
      color: #555555;
      line-height: 22px;
    }
    margin-bottom: 40px;
  }
  .solution {
    .solution-desc {
      font-size: 14px;
      font-weight: normal;
      color: #555555;
      line-height: 22px;
      .introduction-img {
        margin: 24px 0;
        display: flex;
        justify-content: center;
        img {
          width: 90%;
        }
      }
    }
  }
  .title {
    line-height: 22px;
    font-size: 18px;
    color: #000000;
    margin-bottom: 16px;
  }
}
</style>
