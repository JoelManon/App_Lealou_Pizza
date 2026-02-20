import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'

// https://vite.dev/config/
export default defineConfig({
  plugins: [solid({ ssr: true })],
  server: {
    hmr: { port: 24679 }, // évite le conflit si un autre dev server tourne
  },
})
