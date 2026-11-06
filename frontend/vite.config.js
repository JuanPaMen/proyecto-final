import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// En producción la página vive en https://USUARIO.github.io/proyecto-final/,
// por eso los archivos se piden desde esa subcarpeta ("base").
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/proyecto-final/' : '/',
  plugins: [react()],
}))
