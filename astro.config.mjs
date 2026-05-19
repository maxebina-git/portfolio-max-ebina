import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react'; // 👈 Reimportando o plugin do React

// https://astro.build/config
export default defineConfig({
  integrations: [react()], // 👈 Ativando o motor do React no Astro!
  vite: {
    plugins: [tailwindcss()]
  }
});