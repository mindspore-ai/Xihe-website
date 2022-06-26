<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
router.replace({ path: '/:user', name: 'user' });
</script>
<template></template>

<style lang="scss" scoped></style>
