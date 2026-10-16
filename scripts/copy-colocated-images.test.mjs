import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { copyColocatedImages } from './copy-colocated-images.mjs'

test('copy sync removes deleted entries and stale image mirrors', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'palo-copy-images-'))
  const srcDir = path.join(root, 'src/content')
  const publicDir = path.join(root, 'public')
  const entryDir = path.join(srcDir, 'posts', 'temporary')
  const publicEntryDir = path.join(publicDir, 'posts', 'temporary')

  try {
    fs.mkdirSync(entryDir, { recursive: true })
    fs.writeFileSync(path.join(entryDir, 'index.md'), '---\ntitle: Temporary\n---')
    fs.writeFileSync(path.join(entryDir, 'cover.png'), 'image')
    fs.mkdirSync(path.join(publicDir, 'posts'), { recursive: true })
    fs.writeFileSync(path.join(publicDir, 'posts', 'manual.png'), 'manual')

    copyColocatedImages(srcDir, publicDir, 'posts')
    assert.equal(fs.existsSync(path.join(publicEntryDir, 'cover.png')), true)

    fs.rmSync(path.join(entryDir, 'cover.png'))
    copyColocatedImages(srcDir, publicDir, 'posts')
    assert.equal(fs.existsSync(path.join(publicEntryDir, 'cover.png')), false)
    assert.equal(fs.existsSync(path.join(publicDir, 'posts', 'manual.png')), true)

    fs.rmSync(entryDir, { recursive: true })
    copyColocatedImages(srcDir, publicDir, 'posts')
    assert.equal(fs.existsSync(publicEntryDir), false)
  } finally {
    fs.rmSync(root, { recursive: true, force: true })
  }
})
