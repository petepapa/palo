import { spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')
const configPath = path.join(projectRoot, 'src', 'config.yaml')
const forwardArgs = process.argv.slice(2)

let child = null
let restartTimer = null
let isShuttingDown = false

function startDevServer() {
  child = spawn('npm', ['run', 'dev:astro', '--', ...forwardArgs], {
    cwd: projectRoot,
    stdio: 'inherit',
    shell: true,
  })

  child.on('exit', (code, signal) => {
    if (isShuttingDown) {
      process.exit(code ?? (signal ? 1 : 0))
    }
  })
}

function restartDevServer(reason) {
  if (isShuttingDown || !child) {
    return
  }

  console.log(`\n[Config Watcher] ${reason}. Restarting Astro dev server...\n`)
  child.kill('SIGTERM')
  setTimeout(() => {
    startDevServer()
  }, 250)
}

function shutdown() {
  isShuttingDown = true
  if (child) {
    child.kill('SIGTERM')
  } else {
    process.exit(0)
  }
}

startDevServer()

fs.watch(configPath, () => {
  clearTimeout(restartTimer)
  restartTimer = setTimeout(() => restartDevServer('config.yaml changed'), 150)
})

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
