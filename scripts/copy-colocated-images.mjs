import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function copyColocatedImages(srcDir, publicDir, collectionName) {
  const srcPath = path.join(srcDir, collectionName)
  const publicPath = path.join(publicDir, collectionName)

  if (!fs.existsSync(srcPath)) {
    console.log(`[copy-images] ${collectionName}: 目录不存在，跳过`)
    return
  }

  const entries = fs.readdirSync(srcPath, { withFileTypes: true })

  for (const entry of entries) {
    const srcEntryPath = path.join(srcPath, entry.name)

    if (entry.isDirectory()) {
      // 检查目录中是否有 index.md 或 index.mdx
      const indexFiles = fs.readdirSync(srcEntryPath).filter(f => 
        f === 'index.md' || f === 'index.mdx'
      )

      if (indexFiles.length > 0) {
        // 这是一个内容目录（使用 co-location 模式）
        const publicEntryPath = path.join(publicPath, entry.name)
        
        if (!fs.existsSync(publicEntryPath)) {
          fs.mkdirSync(publicEntryPath, { recursive: true })
        }

        // 复制目录中的所有图片文件
        const files = fs.readdirSync(srcEntryPath)
        const imageFiles = files.filter(f => 
          /\.(jpg|jpeg|png|gif|webp|svg|avif)$/i.test(f)
        )

        for (const imageFile of imageFiles) {
          const srcImagePath = path.join(srcEntryPath, imageFile)
          const publicImagePath = path.join(publicEntryPath, imageFile)
          fs.copyFileSync(srcImagePath, publicImagePath)
          console.log(`[copy-images] ${collectionName}/${entry.name}/${imageFile}`)
        }
      }
    }
  }
}

// 主函数
function main() {
  const srcDir = path.join(__dirname, '../src/content')
  const publicDir = path.join(__dirname, '../public')

  console.log('[copy-images] 开始复制 co-located 图片...')

  copyColocatedImages(srcDir, publicDir, 'posts')
  copyColocatedImages(srcDir, publicDir, 'projects')

  console.log('[copy-images] 完成！')
}

main()
