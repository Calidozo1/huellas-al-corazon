import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Usamos una ruta base relativa para que funcione automáticamente en cualquier subdirectorio de GitHub Pages
  base: './',
  build: {
    outDir: 'docs' // Construimos en la carpeta docs para servir directamente desde la rama principal
  }
})
