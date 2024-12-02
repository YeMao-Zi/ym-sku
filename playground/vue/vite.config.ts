import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  resolve: {
    alias: {
      'ym-sku': path.resolve(__dirname, '../../lib/index.ts'),
    },
  },
  plugins: [vue()],
});
