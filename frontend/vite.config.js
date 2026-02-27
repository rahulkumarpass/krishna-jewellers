import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png'],

      // === ADD THIS TO SEE THE INSTALL BUTTON ON LOCALHOST ===
      devOptions: {
        enabled: true
      },

      manifest: {
        name: 'Krishna Jewelry and Readymade',
        short_name: 'Krishna Store',
        description: 'Shop premium jewelry and clothing directly from our app.',
        theme_color: '#3b82f6',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'favicon.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'favicon.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})