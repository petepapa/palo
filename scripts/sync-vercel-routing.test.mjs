import assert from 'node:assert/strict'
import test from 'node:test'
import { syncVercelRouting } from './sync-vercel-routing.mjs'

const originalConfig = {
  headers: [{ source: '/fonts/(.*)', headers: [{ key: 'Cache-Control', value: 'public' }] }],
  rewrites: [{ source: '/legacy', destination: '/' }],
}

test('Vercel uses clean URLs when trailing slashes are disabled', () => {
  const config = syncVercelRouting(false, { ...originalConfig, trailingSlash: true })

  assert.equal(config.cleanUrls, true)
  assert.equal('trailingSlash' in config, false)
  assert.deepEqual(config.headers, originalConfig.headers)
  assert.deepEqual(config.rewrites, originalConfig.rewrites)
})

test('Vercel enforces trailing slashes when enabled', () => {
  const config = syncVercelRouting(true, { ...originalConfig, cleanUrls: true })

  assert.equal(config.trailingSlash, true)
  assert.equal('cleanUrls' in config, false)
  assert.deepEqual(config.headers, originalConfig.headers)
  assert.deepEqual(config.rewrites, originalConfig.rewrites)
})

test('Vercel routing sync rejects invalid trailing slash values', () => {
  assert.throws(() => syncVercelRouting(undefined, originalConfig), /must be true or false/)
})
