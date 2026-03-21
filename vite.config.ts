import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // 注入 package.json 中的 version 供全局使用
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
  build: {
    chunkSizeWarningLimit: 1000, // 提高警告阈值到 1000KB (1MB)
    rollupOptions: {
      output: {
        // 使用函数形式进行手动拆分代码块
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('lucide-react')) {
              return 'icons';
            }
            if (id.includes('zustand')) {
              return 'store';
            }
            return 'vendor'; // 其他第三方依赖
          }
        }
      }
    }
  }
})
