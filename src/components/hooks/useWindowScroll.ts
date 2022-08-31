import { onMounted, onUnmounted, ref } from 'vue';

const useWindowSroll = () => {
  const scrollTop = ref(
    document.documentElement.scrollTop || document.body.scrollTop
  );
  const onScroll = () => {
    scrollTop.value =
      document.documentElement.scrollTop || document.body.scrollTop;
  };

  onMounted(() => {
    scrollTop.value =
      document.documentElement.scrollTop || document.body.scrollTop;

    window.addEventListener('scroll', onScroll);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', onScroll);
  });

  return scrollTop;
};

export default useWindowSroll;
