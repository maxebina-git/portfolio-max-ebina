import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

// O Astro injeta automaticamente "production"
// quando o GitHub Actions roda o build
const isProd =
  process.env.NODE_ENV === 'production';

export default defineConfig({

  // SPA fallback friendly
  output: 'static',

  site: 'https://www.maxebina.com.br',

  // Em produção:
  // https://www.maxebina.com.br/portfolio-teste/
  //
  // Em localhost:
  // http://localhost:4321/
  base: isProd
    ? '/portfolio-teste'
    : '/',

  integrations: [
    react()
  ],

  vite: {
    plugins: [
      tailwindcss()
    ]
  }

});