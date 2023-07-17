<script setup>
import IconSearcherror from '~icons/app/search-error';
</script>
<template>
  <div class="not-access">
    <div class="not-access-wrap">
      <o-icon class="not-access-icon"
        ><icon-searcherror></icon-searcherror
      ></o-icon>
      <div class="not-access-tip">暂无权限访问</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.not-access {
  min-height: calc(100vh - 200px);
  background-color: #f5f6f8;
  display: flex;
  justify-content: center;
  align-items: center;
  &-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    .not-access-icon {
      font-size: 300px;
    }
    .not-access-tip {
      height: 28px;
      font-size: 18px;
      color: #555555;
      line-height: 28px;
    }
  }
}
</style>
