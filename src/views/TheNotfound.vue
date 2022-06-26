<script setup>
import IconSearcherror from '~icons/app/search-error';
</script>
<template>
  <div class="notFound">
    <div class="notFound-wrap">
      <o-icon class="notFound-icon"
        ><icon-searcherror></icon-searcherror
      ></o-icon>
      <div>你所访问的页面不存在！</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.notFound {
  min-height: 100vh;
  background-color: #f5f6f8;
  display: flex;
  justify-content: center;
  align-items: center;
  &-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    .notFound-icon {
      font-size: 240px;
    }
  }
}
</style>
