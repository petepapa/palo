/**
 * Vite Plugin: Co-located Image Sync (dev)
 *
 * Frontmatter coverImage: ./cover.jpg resolves to /posts/{slug}/cover.jpg in dev.
 * That URL is served from public/, not src/content/. This plugin mirrors
 * co-located images into public/ whenever they are added or changed during dev,
 * and triggers a full reload so cover URLs pick up fresh cache-bust params.
 */

import type { Plugin, ViteDevServer } from 'vite'
import path from 'node:path'
import {
  copyColocatedImages,
  copyContentEntryImages,
  copySingleColocatedImage,
} from './copy-colocated-images.mjs'

const COLLECTIONS = ['posts', 'projects'] as const
const WATCH_GLOBS = COLLECTIONS.map((c) => `src/content/${c}/**/*`)
const ENTRY_INDEX = /index\.(md|mdx)$/

export function paloCopyColocatedImages(): Plugin {
  return {
    name: 'palo-copy-colocated-images',
    apply: 'serve',
    configureServer(server) {
      const root = server.config.root
      const srcContentRoot = path.join(root, 'src/content')
      const publicRoot = path.join(root, 'public')

      for (const glob of WATCH_GLOBS) {
        server.watcher.add(glob)
      }

      const syncAll = () => {
        for (const collection of COLLECTIONS) {
          copyColocatedImages(srcContentRoot, publicRoot, collection)
        }
      }

      syncAll()

      server.watcher.on('add', (file) => handleFileEvent(server, file, root, srcContentRoot, publicRoot))
      server.watcher.on('change', (file) => handleFileEvent(server, file, root, srcContentRoot, publicRoot))
    },
  }
}

function handleFileEvent(
  server: ViteDevServer,
  changedFile: string,
  root: string,
  srcContentRoot: string,
  publicRoot: string,
) {
  const absoluteFile = path.isAbsolute(changedFile)
    ? changedFile
    : path.resolve(root, changedFile)

  for (const collection of COLLECTIONS) {
    const collectionRoot = path.join(srcContentRoot, collection)
    if (!absoluteFile.startsWith(collectionRoot + path.sep)) continue

    let copied: string[] = []

    if (ENTRY_INDEX.test(absoluteFile)) {
      const entryDir = path.dirname(absoluteFile)
      copied = copyContentEntryImages(entryDir, srcContentRoot, publicRoot, collection)
      if (copied.length) {
        console.log(`[copy-images] (watch) ${copied.join(', ')}`)
      }
    } else {
      const single = copySingleColocatedImage(absoluteFile, srcContentRoot, publicRoot, collection)
      if (single) {
        copied = [single]
        console.log(`[copy-images] (watch) ${single}`)
      }
    }

    if (copied.length) {
      server.ws.send({ type: 'full-reload', path: '*' })
    }
    return
  }
}
