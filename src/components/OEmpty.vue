<script setup>
defineProps({
  img: {
    type: String,
    default: '',
  },
  describe: {
    type: String,
    default: '',
  },
});
</script>
<template>
  <div class="o-empty">
    <div class="empty-img">
      <img :src="img" alt="" />
    </div>
    <p class="empty-text">{{ describe }}</p>
  </div>
</template>

<style lang="scss">
.o-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 150px 0;
  .empty-text {
    margin-top: 24px;
    color: #555;
    font-size: 18px;
    line-height: 28px;
  }
}
</style>
