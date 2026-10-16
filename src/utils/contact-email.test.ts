import assert from 'node:assert/strict'
import test from 'node:test'
import { sendContactEmail } from './contact-email.ts'

const payload = { name: 'Taylor', email: 'taylor@example.com', message: 'Hello' }

test('contact delivery refuses to use an implicit recipient or sender', async () => {
  const result = await sendContactEmail(payload, { apiKey: 're_test' })

  assert.equal(result.status, 503)
  assert.deepEqual(result.body, { error: 'The contact form is not configured.' })
})

test('contact delivery uses the configured domain and local part', async (t) => {
  let request: RequestInit | undefined
  t.mock.method(globalThis, 'fetch', async (_url: RequestInfo | URL, init?: RequestInit) => {
    request = init
    return new Response('{}', { status: 200 })
  })

  const result = await sendContactEmail(payload, {
    apiKey: 're_test',
    brandName: 'Studio Example',
    to: 'owner@example.com',
    fromDomain: 'mail.example.com',
    fromLocalPart: 'inbox',
  })

  assert.equal(result.status, 200)
  assert.match(String(request?.body), /inbox@mail\.example\.com/)
  assert.match(String(request?.body), /owner@example\.com/)
  assert.match(String(request?.body), /Studio Example Contact/)
  assert.match(String(request?.body), /New Studio Example Contact Inquiry/)
})

test('contact delivery rejects malformed email addresses', async () => {
  const result = await sendContactEmail(
    { ...payload, email: 'not-an-email' },
    { apiKey: 're_test', to: 'owner@example.com', from: 'hello@example.com' },
  )

  assert.equal(result.status, 400)
  assert.deepEqual(result.body, { error: 'Invalid email address.' })
})

test('contact delivery removes line breaks from email headers', async (t) => {
  let request: RequestInit | undefined
  t.mock.method(globalThis, 'fetch', async (_url: RequestInfo | URL, init?: RequestInit) => {
    request = init
    return new Response('{}', { status: 200 })
  })

  await sendContactEmail(
    { ...payload, name: 'Taylor\r\nBcc: attacker@example.com' },
    { apiKey: 're_test', to: 'owner@example.com', from: 'hello@example.com' },
  )

  const message = JSON.parse(String(request?.body))
  assert.equal(message.subject, '[Website Contact] New Inquiry from Taylor Bcc: attacker@example.com')
  assert.equal(message.reply_to, payload.email)
})
