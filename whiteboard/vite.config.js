import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path'; // Import resolve
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'), // Add this line
    },
  },
  server: {
    host: '0.0.0.0', // Bind to all interfaces
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://0.0.0.0:5000', // Using 0.0.0.0 for accessibility
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});