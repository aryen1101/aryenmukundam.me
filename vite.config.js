import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/github': {
        target: 'https://api.github.com/users/aryen1101',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/github/, ''),
        headers: {
          Accept: 'application/vnd.github+json',
          'User-Agent': 'aryen-portfolio-dev'
        }
      }
    }
  }
});
