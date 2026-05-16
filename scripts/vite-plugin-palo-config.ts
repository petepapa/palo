/**
 * Vite Plugin: Palo Config HMR
 *
 * Watches src/config.yaml during dev (`astro dev`) and:
 *   1. On change → validates via shared Zod schema
 *   2. Valid   → triggers full-reload (Vite HMR)
 *   3. Invalid → shows error overlay, does NOT reload
 *
 * This replaces the legacy process‑restart watcher (scripts/dev-legacy-watch.mjs)
 * with a zero‑restart, sub‑second feedback loop.
 */

import type { Plugin } from 'vite'
import fs from 'node:fs'
import path from 'node:path'
import yaml from 'js-yaml'
import { validateConfig } from '../src/utils/validateConfig.ts'

const CONFIG_FILE = 'src/config.yaml'

export function paloConfigHmr(): Plugin {
  return {
    name: 'palo-config-hmr',
    apply: 'serve', // dev‑only — skip during `astro build`
    configureServer(server) {
      const configPath = path.resolve(server.config.root, CONFIG_FILE)

      // Register the config file with Vite's file watcher
      server.watcher.add(configPath)

      server.watcher.on('change', (changedFile: string) => {
        if (path.resolve(changedFile) !== configPath) return

        try {
          const rawYaml = fs.readFileSync(configPath, 'utf-8')
          const config = yaml.load(rawYaml)
          validateConfig(config)

          // ✅ Config is valid — trigger a full page reload
          server.ws.send({ type: 'full-reload' })
          console.log('[palo-config-hmr] ✅ config.yaml valid — reloading')
        } catch (err: unknown) {
          // ❌ Config is invalid — show error overlay, do NOT reload
          const message = err instanceof Error ? err.message : String(err)
          console.error('[palo-config-hmr] ❌', message)
          server.ws.send({
            type: 'error',
            err: {
              message,
              stack: '',
              plugin: 'palo-config-hmr',
            },
          })
        }
      })
    },
  }
}
