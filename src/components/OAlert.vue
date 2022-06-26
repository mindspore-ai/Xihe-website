<script setup>
import { ref } from 'vue';
const props = defineProps({
  message: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: '',
  },
  time: {
    type: Number,
    default: null,
  },
});
const isShow = ref(true);
props.time ? autoClose(props.time) : '';
// function autoClose(time) {
//   setTimeout(() => {
//     isShow.value = false;
//   }, time);
// }
</script>
<template>
  <transition name="fade">
    <el-alert
      v-if="isShow"
      class="o-alert xtx-message"
      :title="message"
      :type="type"
      center
    />
  </transition>
</template>

<style lang="scss">
.down {
  &-enter {
    &-from {
      transform: translateY(-75px);
      opacity: 0;
    }
    &-active {
      transition: all 0.5s;
    }
    &-to {
      transform: none;
      opacity: 1;
    }
  }
}
.xtx-message {
  width: 300px;
  height: 50px;
  position: fixed;
  z-index: 9999;
  left: 50%;
  margin-left: -150px;
  top: 75px;
  line-height: 50px;
  padding: 0 25px;
  border: 1px solid #e4e4e4;
  background: #f5f5f5;
  color: #999;
  border-radius: 4px;
  i {
    margin-right: 4px;
    vertical-align: middle;
  }
  .text {
    vertical-align: middle;
  }
}
.o-alert {
  position: fixed;
  width: 400px;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
}
.el-alert {
  margin: 20px 0 0;
}
.el-alert:first-child {
  margin: 0;
}
</style>
