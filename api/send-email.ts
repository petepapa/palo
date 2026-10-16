import { contactDeliveryConfig } from '../.palo/contact-config.mjs'
import { sendContactEmail, type ContactPayload } from '../src/utils/contact-email'
import { isContactPayloadTooLarge, isContentLengthTooLarge } from '../src/utils/contact-request'

type VercelRequest = {
  body?: unknown
  headers?: { 'content-length'?: string | string[] }
  method?: string
}

type VercelResponse = {
  setHeader(name: string, value: string): void
  status(code: number): VercelResponse
  json(body: Record<string, unknown>): void
}

function respond(res: VercelResponse, status: number, body: Record<string, unknown>): void {
  res.status(status).json(body)
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    respond(res, 405, { error: 'Method not allowed.' })
    return
  }

  const contentLength = req.headers?.['content-length']
  if (isContentLengthTooLarge(Array.isArray(contentLength) ? (contentLength[0] ?? null) : (contentLength ?? null))) {
    respond(res, 413, { error: 'Request body is too large.' })
    return
  }

  if (req.body === null || typeof req.body !== 'object' || Array.isArray(req.body)) {
    respond(res, 400, { error: 'Invalid request body.' })
    return
  }

  if (isContactPayloadTooLarge(req.body)) {
    respond(res, 413, { error: 'Request body is too large.' })
    return
  }

  const result = await sendContactEmail(req.body as ContactPayload, {
    apiKey: process.env.RESEND_API_KEY,
    ...contactDeliveryConfig,
  })

  if (result.diagnostic) console.error('[contact]', result.diagnostic)
  respond(res, result.status, result.body)
}
