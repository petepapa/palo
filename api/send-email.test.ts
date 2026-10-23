import assert from 'node:assert/strict'
import test from 'node:test'
import handler from './send-email.ts'

function createResponse() {
  let statusCode = 200
  const headers: Record<string, string> = {}
  let body: Record<string, unknown> = {}

  return {
    headers,
    get body() {
      return body
    },
    get statusCode() {
      return statusCode
    },
    setHeader(name: string, value: string) {
      headers[name] = value
    },
    status(code: number) {
      statusCode = code
      return this
    },
    json(value: Record<string, unknown>) {
      body = value
    },
  }
}

test('Vercel contact function loads and rejects unsupported methods', async () => {
  const response = createResponse()

  await handler({ method: 'GET' }, response)

  assert.equal(response.statusCode, 405)
  assert.equal(response.headers.Allow, 'POST')
  assert.deepEqual(response.body, { error: 'Method not allowed.' })
})

test('Vercel contact function returns validation errors without sending mail', async () => {
  const response = createResponse()

  await handler({ method: 'POST', body: {} }, response)

  assert.equal(response.statusCode, 400)
  assert.deepEqual(response.body, { error: 'Name, email, and message are required.' })
})

test('Vercel contact function sends a valid message through the configured delivery service', async (t) => {
  const originalApiKey = process.env.RESEND_API_KEY
  process.env.RESEND_API_KEY = 're_test'
  t.after(() => {
    if (originalApiKey === undefined) delete process.env.RESEND_API_KEY
    else process.env.RESEND_API_KEY = originalApiKey
  })

  let request: RequestInit | undefined
  t.mock.method(globalThis, 'fetch', async (_url: RequestInfo | URL, init?: RequestInit) => {
    request = init
    return new Response('{}', { status: 200 })
  })

  const response = createResponse()
  await handler({
    method: 'POST',
    body: {
      name: 'Taylor',
      email: 'taylor@example.com',
      identity: 'creator',
      topics: ['visual'],
      message: 'Hello',
    },
  }, response)

  assert.equal(response.statusCode, 200)
  assert.deepEqual(response.body, { success: true })
  assert.equal((request?.headers as Record<string, string>).Authorization, 'Bearer re_test')
  assert.match(String(request?.body), /Visual Identity &amp; Branding/)
})

test('Vercel contact function returns a service error if Resend cannot be reached', async (t) => {
  const originalApiKey = process.env.RESEND_API_KEY
  process.env.RESEND_API_KEY = 're_test'
  t.after(() => {
    if (originalApiKey === undefined) delete process.env.RESEND_API_KEY
    else process.env.RESEND_API_KEY = originalApiKey
  })
  t.mock.method(globalThis, 'fetch', async () => {
    throw new Error('network unavailable')
  })

  const response = createResponse()
  await handler({
    method: 'POST',
    body: { name: 'Taylor', email: 'taylor@example.com', message: 'Hello' },
  }, response)

  assert.equal(response.statusCode, 502)
  assert.deepEqual(response.body, { error: 'Unable to send your message right now.' })
})
