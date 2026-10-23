import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'
import yaml from 'js-yaml'
import { validateConfig } from './validateConfig.ts'

type TestConfig = {
  site: Record<string, unknown>
  components: {
    paloPageHeader: Record<string, unknown>
  }
}

function loadConfig() {
  return yaml.load(fs.readFileSync('src/config.yaml', 'utf8')) as TestConfig
}

test('current config passes validation', () => {
  assert.doesNotThrow(() => validateConfig(loadConfig()))
})

test('site feature flags are validated', () => {
  const config = loadConfig()
  config.site.backToTop = 'yes'

  assert.throws(() => validateConfig(config), /site\.backToTop/)
})

test('smooth wheel scrolling setting must be boolean', () => {
  const config = loadConfig()
  config.site.smoothWheelScroll = 'yes'

  assert.throws(() => validateConfig(config), /site\.smoothWheelScroll/)
})

test('PaloPageHeader defaults are validated', () => {
  const config = loadConfig()
  config.components.paloPageHeader.alignV = 'middle'

  assert.throws(() => validateConfig(config), /components\.paloPageHeader\.alignV/)
})
