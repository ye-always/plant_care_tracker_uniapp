import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import uni from '@dcloudio/vite-plugin-uni'

export default defineConfig({
  plugins: [vue(), uni],
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
  }
})