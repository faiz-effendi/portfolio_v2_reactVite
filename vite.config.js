import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { createHandler } from './netlify/functions/sarang-naga-status.js'

const sarangNagaDevApi = (env) => ({
  name: 'sarang-naga-dev-api',
  configureServer(server) {
    const handler = createHandler({ env })

    server.middlewares.use(async (request, response, next) => {
      const requestUrl = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`)
      if (requestUrl.pathname !== '/api/sarang-naga/status') {
        next()
        return
      }

      try {
        const functionResponse = await handler(new Request(requestUrl, {
          method: request.method,
          headers: request.headers,
        }))
        response.statusCode = functionResponse.status
        functionResponse.headers.forEach((value, name) => response.setHeader(name, value))
        response.end(Buffer.from(await functionResponse.arrayBuffer()))
      } catch {
        response.statusCode = 500
        response.setHeader('Content-Type', 'application/json; charset=utf-8')
        response.end(JSON.stringify({
          schemaVersion: 1,
          generatedAt: new Date().toISOString(),
          error: { code: 'LOCAL_SERVER_ERROR', message: 'The local monitoring endpoint failed.' },
        }))
      }
    })
  },
})

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const monitoringEnv = {
    ...process.env,
    ...loadEnv(mode, '.', 'UPTIMEROBOT_'),
  }

  return {
    plugins: [
      sarangNagaDevApi(monitoringEnv),
      react(),
      tailwindcss(),
    ],
  }
})
