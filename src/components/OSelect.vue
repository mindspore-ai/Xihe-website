<script setup>
import { ref } from 'vue';

const props = defineProps({
  selectData: {
    type: Array,
    default: () => {
      return [];
    },
  },
  defaultValue: {
    type: String,
    default: '',
  },
  value: {
    type: [String, Number],
    default: '',
  },
  keys: {
    type: [String, Number],
    default: '',
  },
  placeholder: {
    type: String,
    default: 'Select',
  },
});
const isSelect = ref(props.defaultValue);
const emit = defineEmits(['change', 'click', 'point']);

function onChange() {
  emit('change', isSelect.value);
}
function onClick(index) {
  emit('click', index);
}
function onPoint(keys) {
  emit('point', keys);
}
</script>
<template>
  <div class="o-select">
    <el-select
      v-model="isSelect"
      class="m-2"
      :placeholder="placeholder"
      :deprecated="false"
      @change="onChange"
    >
      <el-option
        v-for="(item, index) in selectData"
        :key="item[keys]"
        :value="item[value]"
        @click="onClick(index), onPoint(item[keys])"
      />
    </el-select>
  </div>
</template>

<style lang="scss" scoped>
.o-select {
  :deep(.el-select) {
    width: 400px;
    height: 36px;
    .el-input__wrapper {
      border-radius: 16px;
      // box-shadow: 0 0 0 1px #999;
      .el-input__inner {
        height: 36px;
        color: #000;
        &::-webkit-input-placeholder {
          color: #999;
        }
      }
      .el-input__inner::placeholder {
        color: #999;
      }
      .el-input__inner::-webkit-input-placeholder {
        color: #999;
      }
      .el-input__inner:-moz-placeholder {
        color: #999;
      }
      .el-input__inner:-ms-input-placeholder {
        color: #999;
      }
      .el-select__icon {
        font-size: 22px;
        color: #000;
      }
      .el-input__suffix {
        .el-input__suffix-inner {
          .el-select__icon {
            // border: 1px dashed black;
          }
        }
      }
    }
  }
}

:deep(.el-popper__arrow) {
  visibility: hidden;
  border-bottom-color: #2048a8;
}
.el-popper {
  // .el-scrollbar__wrap--hidden-default {
  //   border: 1px solid #555;
  // }
  .el-select-dropdown__item.selected {
    color: #000;
    // border: 1px solid #555;
  }
}
</style>
