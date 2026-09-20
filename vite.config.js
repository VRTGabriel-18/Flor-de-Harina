import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// base: '/Flor-de-Harina/' para GitHub Pages (coincide con el repo VRTGabriel-18/Flor-de-Harina)
export default defineConfig({
  base: '/Flor-de-Harina/',
  plugins: [react()],
})
