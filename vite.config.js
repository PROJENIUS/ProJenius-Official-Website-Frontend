import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { buildSiteLinks, buildSitemap } from './src/siteLinks.js'

const DEFAULT_SITE_URL = 'https://pro-jenius-official-website-fronten.vercel.app'

/* Serves (dev) and writes (build) two files made from src/siteLinks.js:
   /site-links.json — read by the backend for the admin "Opens" list
   /sitemap.xml     — for search engines */
function siteLinksFiles(siteUrl) {
  const files = {
    'site-links.json': { type: 'application/json', body: () => `${JSON.stringify(buildSiteLinks(), null, 2)}\n` },
    'sitemap.xml': { type: 'application/xml', body: () => buildSitemap(siteUrl) },
  }
  return {
    name: 'projenius-site-links',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const file = files[(req.url || '').split('?')[0].replace(/^\//, '')]
        if (!file) return next()
        res.setHeader('Content-Type', `${file.type}; charset=utf-8`)
        res.setHeader('Cache-Control', 'no-store')
        res.end(file.body())
      })
    },
    generateBundle() {
      for (const [fileName, file] of Object.entries(files)) this.emitFile({ type: 'asset', fileName, source: file.body() })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  return {
    plugins: [react(), siteLinksFiles(env.VITE_SITE_URL || DEFAULT_SITE_URL)],
  }
})
