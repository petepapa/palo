import assert from 'node:assert/strict'
import test from 'node:test'
import { MAX_CONTACT_BODY_BYTES, readContactRequest } from './contact-request.ts'

test('contact request reader parses valid JSON', async () => {
  const request = new Request('http://localhost/api/send-email', {
    method: 'POST',
    body: JSON.stringify({ name: 'Taylor', email: 'taylor@example.com' }),
  })

  const result = await readContactRequest(request)

  assert.equal(result.ok, true)
  if (result.ok) assert.equal(result.payload.name, 'Taylor')
})

test('contact request reader rejects malformed JSON and non-object payloads', async () => {
  const malformed = await readContactRequest(new Request('http://localhost', { method: 'POST', body: '{' }))
  const arrayPayload = await readContactRequest(new Request('http://localhost', { method: 'POST', body: '[]' }))

  assert.equal(malformed.ok, false)
  if (!malformed.ok) assert.equal(malformed.status, 400)
  assert.equal(arrayPayload.ok, false)
  if (!arrayPayload.ok) assert.equal(arrayPayload.status, 400)
})

test('contact request reader rejects bodies over the byte limit', async () => {
  const body = new Uint8Array(MAX_CONTACT_BODY_BYTES + 1)
  const request = new Request('http://localhost', { method: 'POST', body })

  const result = await readContactRequest(request)

  assert.equal(result.ok, false)
  if (!result.ok) assert.equal(result.status, 413)
})
