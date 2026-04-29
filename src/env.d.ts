/// <reference types="astro/client" />

/**
 * YAML configuration module declaration.
 *
 * Allows TypeScript to understand imports from .yaml files,
 * providing type safety when used with the Vite YAML plugin.
 */
declare module '*.yaml' {
  import type { PaloConfig } from './types/config'
  const config: PaloConfig
  export default config
}