import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        proxy: {
          '/api': {
            target: 'https://generativelanguage.googleapis.com',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
            configure: (proxy, _options) => {
              proxy.on('proxyReq', (proxyReq, req, _res) => {
                console.log(`[Proxy Req] ${req.method} ${req.url}`);
                // Strip browser-added headers so the target API treats it as server-to-server
                proxyReq.removeHeader('origin');
                proxyReq.removeHeader('referer');
              });
              proxy.on('proxyRes', (proxyRes, req, _res) => {
                console.log(`[Proxy Res] ${proxyRes.statusCode} for ${req.method} ${req.url}`);
              });
              proxy.on('error', (err, req, _res) => {
                console.error(`[Proxy Err]`, err);
              });
            }
          }
        }
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
