import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * In production the astrology proxy runs as a Vercel serverless function (api/astro.js).
 * `vite dev` doesn't execute that, so this plugin mounts the very same handler as dev
 * middleware — `npm run dev` behaves like production without the Vercel CLI.
 */
function astroApiDevServer(env) {
  return {
    name: 'astro-api-dev-server',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/astro/')) return next()

        const url = new URL(req.url, 'http://localhost')
        const query = Object.fromEntries(url.searchParams)
        query.path = url.pathname.replace('/api/astro/', '')

        // Vercel injects the key from its own env; locally it comes from .env.local
        process.env.VEDINTEL_API_KEY ||= env.VEDINTEL_API_KEY

        const { default: handler } = await server.ssrLoadModule('/api/astro.js')

        // Minimal Vercel-style response shim covering what the handler uses
        const shim = {
          status(code) { res.statusCode = code; return shim },
          setHeader(k, v) { res.setHeader(k, v); return shim },
          send(body) { res.end(body) },
          json(body) {
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(body))
          },
        }

        try {
          await handler({ method: req.method, query, headers: req.headers }, shim)
        } catch (error) {
          res.statusCode = 500
          res.end(JSON.stringify({ error: error.message }))
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return { plugins: [react(), astroApiDevServer(env)] }
})
