import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

import Icons from 'unplugin-icons/vite';
import { FileSystemIconLoader } from 'unplugin-icons/loaders';

import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import ElementPlus from 'unplugin-element-plus/vite';

export default defineConfig({
  base: process.env.NODE_ENV === 'development' ? './' : '/',
  resolve: {
    alias: {
      '@/': `${path.resolve(__dirname, './src')}/`,
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/shared/styles/o-theme/var.scss" as *;`,
      },
    },
  },
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    Icons({
      compiler: 'vue3',
      customCollections: {
        app: FileSystemIconLoader('./src/assets/svg-icons'),
      },
    }),
    ElementPlus({
      useSource: true,
    }),
  ],
  server: {
    https: true,
    port: '9999',
    proxy: {
      '/api/v1/': {
        // target: 'https://xihe-dev.test.osinfra.cn/',
        target: 'https://xihe2.test.osinfra.cn/',
        changeOrigin: true,
      },
      '/server': {
        target: 'https://xihe2.test.osinfra.cn/',
        // target: 'https://xihe-dev.test.osinfra.cn/',
        changeOrigin: true,
      },
      '/gitlab-lfs/': {
        target: 'https://chenzeng-test1.obs.cn-north-4.myhuaweicloud.com/',
        changeOrigin: true,
      },
      '/obs-big-model/': {
        target: 'https://big-model-deploy.obs.cn-central-221.ovaijisuan.com/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/obs-big-model/, ''),
      },
      '/obs-xihe-avatar/': {
        target: 'https://obs-xihe-beijing4.obs.cn-north-4.myhuaweicloud.com/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/obs-xihe-avatar/, ''),
      },
      '/oneid': {
        target: 'https://xiheapi.test.osinfra.cn/',
        changeOrigin: true,
      },
    },
  },
});
