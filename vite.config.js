import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

function aiGeneratorPlugin() {
  return {
    name: 'ai-generator',
    configureServer(server) {
      server.middlewares.use('/api/generate-workout', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end('Method Not Allowed')
          return
        }

        let body = ''
        req.on('data', chunk => { body += chunk })
        req.on('end', async () => {
          try {
            const { prompt } = JSON.parse(body)

            const baseURL = process.env.AI_INTEGRATIONS_OPENAI_BASE_URL
            const apiKey = process.env.AI_INTEGRATIONS_OPENAI_API_KEY

            if (!baseURL || !apiKey) {
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'AI integration not configured.' }))
              return
            }

            const endpoint = baseURL.endsWith('/')
              ? `${baseURL}chat/completions`
              : `${baseURL}/chat/completions`

            const aiRes = await fetch(endpoint, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
              },
              body: JSON.stringify({
                model: 'gpt-4o',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 4096,
              }),
            })

            const data = await aiRes.json()

            if (!aiRes.ok) {
              res.statusCode = aiRes.status
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: data.error?.message || 'AI request failed.' }))
              return
            }

            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(data))
          } catch (err) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: err.message || 'Server error.' }))
          }
        })
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), aiGeneratorPlugin()],
  server: {
    host: '0.0.0.0',
    port: 5000,
    allowedHosts: true,
  },
})
