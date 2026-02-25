import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/instagram': {
        target: 'https://www.instagram.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/instagram/, '/api/v1/users/web_profile_info/'),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            const url = new URL(req.url || '', 'http://localhost');
            const username = url.searchParams.get('username') || 'microwave.30';
            proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
            proxyReq.setHeader('X-IG-App-ID', '936619743392459');
            proxyReq.setHeader('Referer', `https://www.instagram.com/${username}/`);
            proxyReq.setHeader('Accept-Language', 'en-US,en;q=0.9');
            // Overwrite the path to include the username as query param
            proxyReq.path = `/api/v1/users/web_profile_info/?username=${username}`;
          });

          proxy.on('proxyRes', (proxyRes) => {
            if (proxyRes.statusCode !== 200) {
              console.log('Instagram Proxy failed, providing fallback.');
            }
          });
        }
      }
    }
  }
})
