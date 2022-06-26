<script setup>
defineProps({
  placeholder: {
    type: String,
    default: '',
  },
  size: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'text',
  },
  name: {
    type: String,
    default: '',
  },
  modelValue: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:modelValue']);

function onInput(e) {
  emit('update:modelValue', e.target.value);
}
</script>
<template>
  <input
    class="o-input"
    :class="{ 'fill-width': size }"
    :value="modelValue"
    :type="type"
    :placeholder="placeholder"
    @input="onInput"
  />
</template>

<style lang="scss">
.o-input {
  max-width: 400px;
  width: 100%;
  height: 36px;
  padding: 0 11px;
  background: none;
  outline: none;
  border: 1px solid #999;
  &:focus {
    border: 1px solid #0d8dffff;
  }
  input::-webkit-input-placeholder {
    color: #999;
  }
  input:-moz-placeholder {
    color: #999;
  }
  input::-moz-placeholder {
    color: #999;
  }
  input:-ms-input-placeholder {
    color: #999;
  }
}
.fill-width {
  max-width: none;
}
</style>
