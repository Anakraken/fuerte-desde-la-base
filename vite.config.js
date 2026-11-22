import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' = rutas relativas: funciona igual en Vercel, Netlify
// y en GitHub Pages (usuario.github.io/nombre-del-repo/).
export default defineConfig({
  plugins: [react()],
  base: './',
});
