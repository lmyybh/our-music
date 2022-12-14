import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [
      vue(),
      vueJsx(),
      AutoImport({
        resolvers: [
          ElementPlusResolver(),
        ],
      }),
      Components({
        resolvers: [
          ElementPlusResolver(),
          // 自动注册图标组件
          IconsResolver({
            enabledCollections: ['ep'],
          }),],
      }),
      Icons({
        autoInstall: true,
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      host: '0.0.0.0',
      port: 8888,
      proxy: {
        '/api': {
          target: env.VITE_API_URL,	//实际请求地址
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        },
        '/server': {
          target: env.VITE_SERVER_URL,	//实际请求地址
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/server/, '')
        },
      }
    },
  }
})
