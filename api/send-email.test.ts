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
