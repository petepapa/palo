/// <reference types="astro/client" />

/**
 * YAML configuration module declaration.
 *
 * Allows TypeScript to understand imports from .yaml files,
 * providing type safety when used with the Vite YAML plugin.
 *
 * The YAML file now only contains site, metadata, branding, layout,
 * and typography config — navigation and socials have been migrated
 * to src/navigation.ts for better type safety.
 */
declare module '*.yaml' {
  import type { PaloConfig } from './types/config'
  const config: PaloConfig
  export default config
}
