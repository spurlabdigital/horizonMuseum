import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import mkcert from 'vite-plugin-mkcert'

// https://vitejs.dev/config/
export default defineConfig({
  server: { https: false },
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.includes('swiper-')
        }
      }
    })
  ],
  base: './'
})
