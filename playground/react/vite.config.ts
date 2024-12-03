import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'

export default defineConfig({
  resolve: {
    alias: {
      'ym-sku': path.resolve(__dirname, '../../lib/index.ts'),
    },
  },
  plugins: [react()],
});
