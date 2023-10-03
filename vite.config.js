import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dotenv from 'dotenv'
dotenv.config()

let backPlannerUrl
switch (process.env.PLANNER_SERVER) {

  case 'development':
    backPlannerUrl = 'http://127.0.0.1:1631/api/v1/'
    break
  case 'production':
    backPlannerUrl = 'https://mael-planner-back.vercel.app/api/v1/'
    break
  default:
    backPlannerUrl = 'http://127.0.0.1:1631/api/v1/'
    break
} 
// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/planner': {
        target: backPlannerUrl, changeOrigin: true,
        rewrite: (path) => path.replace(/^\/planner/, '')
      }
    }
  },
  plugins: [
    vue(),
    
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },

})
