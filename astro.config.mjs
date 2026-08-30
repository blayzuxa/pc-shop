import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://scoutpc.ru',
  output: 'static',
  build: { format: 'file' },
  compressHTML: true,
  vite: {
    server: {
      host: '0.0.0.0',
      allowedHosts: ['terminal.local'],
    },
  },
});
