<script setup></script>
<template>
  <div class="industry">
    <div class="industry-head">
      <img src="@/assets/imgs/industry/industry-banner.png" alt="" />
      <div class="industry-banner"></div>
      <!-- <div class="wrap">
        <div class="industry-prefecture"></div>
      </div> -->
    </div>
    <div class="wrap">1111</div>
  </div>
</template>

<style lang="scss" scoped>
$theme: #0d8dff;
.wrap {
  //   background-color: red;
  margin: 0 auto;
  padding: 50px 16px 136px 16px;
  max-width: 1472px;
}
.industry {
  background-color: #f5f6f8;
  .industry-head {
    width: 100%;
    height: 560px;
    img {
      width: 100%;

      height: 100%;
    }
  }
}
</style>
