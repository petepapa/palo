import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'

const config = JSON.parse(fs.readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'))

test('Vercel runs the project build and bundles generated contact settings', () => {
  assert.equal(config.buildCommand, 'npm run build')
  assert.equal(config.functions['api/send-email.ts'].includeFiles, '.palo/contact-config.mjs')

  const handler = fs.readFileSync(new URL('../api/send-email.ts', import.meta.url), 'utf8')
  assert.doesNotMatch(handler, /from ['"]\.\.\/src\//)
})
