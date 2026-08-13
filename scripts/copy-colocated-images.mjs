import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const IMAGE_EXT = /\.(jpg|jpeg|png|gif|webp|svg|avif)$/i

export function isContentEntryDir(dirPath) {
  if (!fs.existsSync(dirPath)) return false
  return fs.readdirSync(dirPath).some((f) => f === 'index.md' || f === 'index.mdx')
}

export function copyImageFile(srcImagePath, publicImagePath) {
  fs.mkdirSync(path.dirname(publicImagePath), { recursive: true })
  fs.copyFileSync(srcImagePath, publicImagePath)
}

/**
 * Copy a single co-located image from src/content/{collection}/{slug}/ to public/{collection}/{slug}/.
 * Returns the public-relative path (e.g. posts/slug/cover.png) or null if skipped.
 */
/**
 * Copy every image in a content entry directory (e.g. when index.md is saved).
 * Returns list of public-relative paths copied.
 */
export function copyContentEntryImages(entryDir, srcContentRoot, publicRoot, collectionName) {
  if (!isContentEntryDir(entryDir)) return []

  const entryName = path.basename(entryDir)
  const publicEntryPath = path.join(publicRoot, collectionName, entryName)
  fs.mkdirSync(publicEntryPath, { recursive: true })

  const copied = []
  for (const file of fs.readdirSync(entryDir)) {
    if (!IMAGE_EXT.test(file)) continue
    const srcImagePath = path.join(entryDir, file)
    const publicImagePath = path.join(publicEntryPath, file)
    copyImageFile(srcImagePath, publicImagePath)
    copied.push(`${collectionName}/${entryName}/${file}`)
  }

  return copied
}

export function copySingleColocatedImage(srcImagePath, srcContentRoot, publicRoot, collectionName) {
  if (!IMAGE_EXT.test(srcImagePath)) return null

  const relativeToCollection = path.relative(path.join(srcContentRoot, collectionName), srcImagePath)
  if (relativeToCollection.startsWith('..')) return null

  const segments = relativeToCollection.split(path.sep)
  if (segments.length < 2) return null

  const entryDir = path.join(srcContentRoot, collectionName, segments[0])
  if (!isContentEntryDir(entryDir)) return null

  const publicImagePath = path.join(publicRoot, collectionName, ...segments)
  copyImageFile(srcImagePath, publicImagePath)

  const publicRelative = path.join(collectionName, ...segments).replace(/\\/g, '/')
  return publicRelative
}

export function copyColocatedImages(srcDir, publicDir, collectionName) {
  const srcPath = path.join(srcDir, collectionName)
  const publicPath = path.join(publicDir, collectionName)

  if (!fs.existsSync(srcPath)) {
    console.log(`[copy-images] ${collectionName}: 目录不存在，跳过`)
    return []
  }

  const copied = []
  const entries = fs.readdirSync(srcPath, { withFileTypes: true })

  for (const entry of entries) {
    const srcEntryPath = path.join(srcPath, entry.name)

    if (entry.isDirectory()) {
      if (!isContentEntryDir(srcEntryPath)) continue

      const publicEntryPath = path.join(publicPath, entry.name)
      fs.mkdirSync(publicEntryPath, { recursive: true })

      const files = fs.readdirSync(srcEntryPath)
      const imageFiles = files.filter((f) => IMAGE_EXT.test(f))

      for (const imageFile of imageFiles) {
        const srcImagePath = path.join(srcEntryPath, imageFile)
        const publicImagePath = path.join(publicEntryPath, imageFile)
        copyImageFile(srcImagePath, publicImagePath)
        copied.push(`${collectionName}/${entry.name}/${imageFile}`)
        console.log(`[copy-images] ${collectionName}/${entry.name}/${imageFile}`)
      }
    }
  }

  return copied
}

function main() {
  const srcDir = path.join(__dirname, '../src/content')
  const publicDir = path.join(__dirname, '../public')

  console.log('[copy-images] 开始复制 co-located 图片...')

  copyColocatedImages(srcDir, publicDir, 'posts')
  copyColocatedImages(srcDir, publicDir, 'projects')

  console.log('[copy-images] 完成！')
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === __filename
if (isDirectRun) {
  main()
}
