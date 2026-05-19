import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

// O Astro injeta automaticamente "production" quando o robô do GitHub roda o build
const isProd = process.env.NODE_ENV === 'production';

export default defineConfig({
  site: 'https://www.maxebina.com.br',
  // 👇 Se for produção, usa a subpasta. Se for localhost, roda na raiz normalmente!
  base: isProd ? '/portfolio-teste' : '/', 
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()]
  }
});