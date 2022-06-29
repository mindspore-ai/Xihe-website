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
    proxy: {
      '/api': {
        target: 'https://xihebackend.test.osinfra.cn/',
        changeOrigin: true,
      },
    },
  },
});
