import assert from 'node:assert/strict'
import test from 'node:test'
import { getTagOptions, slugify } from './slugify.ts'

test('slugify preserves existing separator semantics while supporting Unicode labels', () => {
  assert.equal(slugify('UI/UX'), 'ui-ux')
  assert.equal(slugify('Design & Development'), 'design-development')
  assert.equal(slugify('  随笔  '), '随笔')
  assert.equal(slugify('Caf\u00e9 Design'), 'café-design')
  assert.equal(slugify('Cafe\u0301 Design'), 'café-design')
})

test('getTagOptions omits unusable labels and deduplicates routes', () => {
  assert.deepEqual(getTagOptions(['随笔', '!!!', 'UI/UX', 'UI UX', '']), [
    { label: 'UI UX', slug: 'ui-ux' },
    { label: '随笔', slug: '随笔' },
  ])
})
