import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import Icons from 'unplugin-icons/vite';
import { FileSystemIconLoader } from 'unplugin-icons/loaders';
// const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

export default defineConfig({
  base: process.env.NODE_ENV === 'development' ? './' : '/',
  resolve: {
    alias: {
      '@/': `${path.resolve(__dirname, './src')}/`,
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
    // optimizeDeps({
    //   include: [
    //     `monaco-editor/esm/vs/language/json/json.worker`,
    //     `monaco-editor/esm/vs/editor/editor.worker`
    //   ],
    // }),
    // chainWebpack(config) {
    //   config.plugin('monaco').use(new MonacoWebpackPlugin()) // monaco-editor
    // },
    // monaco.use(new MonacoWebpackPlugin())
    // new MonacoWebpackPlugin(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'https://xihebackend.test.osinfra.cn/',
        changeOrigin: true,
      },
      '/wss': {
        target: 'https://xihebackend.test.osinfra.cn/',
        changeOrigin: true,
      },
    },
  },
});
