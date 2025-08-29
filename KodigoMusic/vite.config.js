import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/itunes': {
        target: 'https://itunes.apple.com',
        changeOrigin: true,
        secure: true,
        rewrite: (p) => p.replace(/^\/api\/itunes/, '')
      }
    }
  }
})
