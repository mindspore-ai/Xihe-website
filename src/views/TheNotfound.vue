<script setup>
import IconSearcherror from '~icons/app/search-error';
</script>
<template>
  <div class="not-found">
    <div class="not-found-wrap">
      <o-icon class="not-found-icon"
        ><icon-searcherror></icon-searcherror
      ></o-icon>
      <div class="not-found-tip">你所访问的页面不存在！</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.not-found {
  min-height: calc(100vh - 200px);
  background-color: #f5f6f8;
  display: flex;
  justify-content: center;
  align-items: center;
  &-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    .not-found-icon {
      font-size: 300px;
    }
    .not-found-tip {
      height: 28px;
      font-size: 18px;
      color: #555555;
      line-height: 28px;
    }
  }
}
</style>
