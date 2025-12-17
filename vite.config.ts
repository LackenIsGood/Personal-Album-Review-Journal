import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // IMPORTANT: Update 'my-music-journal' to match YOUR GitHub repository name
  // For example, if your repo is 'album-reviews', change this to '/album-reviews/'
  base: '/my-music-journal/',
});
