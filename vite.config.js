import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: true, // 允许外部访问
    port: 5173 // 固定端口
  },
  base: '/club-management-system/',
  build: {
    outDir: 'dist', // 输出到dist目录
    emptyOutDir: true, // 清空目录
    rollupOptions: {
      output: {
        entryFileNames: 'assets/index.js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  }
})