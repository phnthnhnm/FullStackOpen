import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      '/api': {
        target: 'https://phonebook-backend-mu.vercel.app/',
        changeOrigin: true,
      },
    },
  },
})
