import { defineConfig, envField } from 'astro/config'
import { fileURLToPath } from 'url'
import fs from 'node:fs'
import path from 'node:path'
import yaml from 'js-yaml'
import compress from 'astro-compress'
import icon from 'astro-icon'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import { enhanceConfigForWorkspace } from './scripts/workspace-config.js'

// Read config.yaml for site settings (used at build-time for Astro config)
const configPath = path.resolve(fileURLToPath(new URL('./src/config.yaml', import.meta.url)))
const rawYaml = fs.readFileSync(configPath, 'utf-8')
const yamlConfig = yaml.load(rawYaml)
const siteUrl = String(yamlConfig.metadata?.siteUrl ?? '').trim()

/**
 * Vite plugin to import .yaml/.yml files as ES modules.
 * Enables: import config from '../config.yaml'
 */
function yamlPlugin() {
  return {
    name: 'palo:yaml-loader',
    transform(code, id) {
      if (id.endsWith('.yaml') || id.endsWith('.yml')) {
        const config = yaml.load(code)
        return {
          code: `export default ${JSON.stringify(config)}`,
          map: null,
        }
      }
    },
    handleHotUpdate(ctx) {
      if (!ctx.file.endsWith('.yaml') && !ctx.file.endsWith('.yml')) {
        return
      }

      const modules = ctx.server.moduleGraph.getModulesByFile(ctx.file)
      if (modules) {
        for (const mod of modules) {
          ctx.server.moduleGraph.invalidateModule(mod)
        }
      }

      ctx.server.ws.send({
        type: 'full-reload',
        path: '*',
      })

      return modules ? [...modules] : []
    },
  }
}

// Vite configuration with path aliases, YAML plugin, and SCSS settings
const viteConfig = {
  define: {
    __PALO_TRAILING_SLASH__: JSON.stringify(Boolean(yamlConfig.site.trailingSlash)),
  },
  css: {
    preprocessorOptions: {
      scss: {
        loadPaths: [fileURLToPath(new URL('./src/assets', import.meta.url))],
        logger: {
          warn: () => {},
        },
      },
    },
  },
  plugins: [tailwindcss(), yamlPlugin()],
  resolve: {
    alias: {
      '@config': fileURLToPath(new URL('./src/config.yaml', import.meta.url)),
      '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
      '@layouts': fileURLToPath(new URL('./src/layouts', import.meta.url)),
      '@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
      '@content': fileURLToPath(new URL('./src/content', import.meta.url)),
      '@pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
      '@public': fileURLToPath(new URL('./public', import.meta.url)),
      '@post-images': fileURLToPath(new URL('./public/posts', import.meta.url)),
      '@project-images': fileURLToPath(new URL('./public/projects', import.meta.url)),
      '@utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
    },
  },
}

// Build-time configuration logging for production debugging
console.log('\n[Build Config] ===== Astro Build Configuration =====')
console.log('[Build Config] config.yaml path:', configPath)
console.log('[Build Config] raw trailingSlash from config.yaml:', yamlConfig.site.trailingSlash)
console.log('[Build Config] siteUrl:', siteUrl || '(empty)')
console.log('[Build Config] Astro trailingSlash mapping:', yamlConfig.site.trailingSlash ? 'always' : 'never')
console.log('[Build Config] Astro build.format mapping:', yamlConfig.site.trailingSlash ? 'directory' : 'file')
console.log('[Build Config] URL policy is controlled by config.yaml -> Astro trailingSlash/build.format')
console.log('[Build Config] ==========================================\n')

const integrations = [compress(), icon(), mdx()]
if (siteUrl) integrations.push(sitemap())

// https://astro.build/config
export default defineConfig({
  compressHTML: true,
  site: siteUrl || undefined,
  trailingSlash: yamlConfig.site.trailingSlash ? 'always' : 'never',
  build: {
    format: 'directory',
  },
  integrations,
  vite: enhanceConfigForWorkspace(viteConfig),
  env: {
    schema: {
      BLOG_API_URL: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
        default: 'https://jsonplaceholder.typicode.com/posts',
      }),
    },
  },
})
