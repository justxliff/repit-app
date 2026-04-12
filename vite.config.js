import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5000,
    allowedHosts: true,
  },
  define: {
    'import.meta.env.AI_INTEGRATIONS_OPENAI_BASE_URL': JSON.stringify(process.env.AI_INTEGRATIONS_OPENAI_BASE_URL || ''),
    'import.meta.env.AI_INTEGRATIONS_OPENAI_API_KEY': JSON.stringify(process.env.AI_INTEGRATIONS_OPENAI_API_KEY || ''),
  },
})
