import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import yaml from 'js-yaml'

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(scriptDirectory, '..')

export function syncVercelRouting(trailingSlash, vercelConfig) {
  if (typeof trailingSlash !== 'boolean') {
    throw new TypeError('site.trailingSlash must be true or false.')
  }

  const nextConfig = { ...vercelConfig }
  if (trailingSlash) {
    delete nextConfig.cleanUrls
    nextConfig.trailingSlash = true
  } else {
    delete nextConfig.trailingSlash
    nextConfig.cleanUrls = true
  }

  return nextConfig
}

function main() {
  const yamlPath = path.join(projectRoot, 'src/config.yaml')
  const vercelPath = path.join(projectRoot, 'vercel.json')
  const yamlConfig = yaml.load(fs.readFileSync(yamlPath, 'utf8'))
  const vercelConfig = JSON.parse(fs.readFileSync(vercelPath, 'utf8'))
  const nextConfig = syncVercelRouting(yamlConfig?.site?.trailingSlash, vercelConfig)
  const nextJson = `${JSON.stringify(nextConfig, null, 2)}\n`

  if (fs.readFileSync(vercelPath, 'utf8') !== nextJson) {
    fs.writeFileSync(vercelPath, nextJson)
  }

  console.log(
    `[vercel-routing] site.trailingSlash=${yamlConfig.site.trailingSlash}; ` +
      `Vercel uses ${yamlConfig.site.trailingSlash ? 'trailingSlash' : 'cleanUrls'}.`,
  )
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (isDirectRun) main()
