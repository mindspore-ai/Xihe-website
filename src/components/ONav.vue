<script setup>
defineProps({
  navItems: {
    type: Object,
    default() {
      return [];
    },
  },
  activeItem: {
    type: String,
    default: '',
  },
});

const emits = defineEmits(['navClick']);

function onNavClick(item) {
  emits('navClick', item);
}
</script>

<template>
  <ul class="o-nav">
    <li
      v-for="item in navItems"
      :key="item.id"
      :class="[activeItem === item.id ? 'active' : '']"
      class="nav-item"
      @click="onNavClick(item)"
    >
      {{ item.label }}
    </li>
  </ul>
</template>

<style lang="scss">
.o-nav {
  height: 100%;
  display: flex;

  .nav-item {
    position: relative;
    display: inline-flex;
    align-items: center;
    height: 100%;
    font-size: 18px;
    line-height: 24px;
    color: #ffffff;
    cursor: pointer;

    & + .nav-item {
      margin-left: 32px;
    }

    &.active {
      color: #0d8dff !important;
    }

    &:hover {
      color: #0d8dff;
    }

    &::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      right: 0;
      height: 2px;
      background: transparent;
      border-radius: 1px;
      transition: background 0.3s;
    }

    &.active::after {
      background: #0d8dff;
    }
  }
}
</style>
