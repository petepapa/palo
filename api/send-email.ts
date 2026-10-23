import { contactDeliveryConfig } from '../.palo/contact-config.mjs'

type ContactPayload = {
  name?: unknown
  email?: unknown
  identity?: unknown
  topics?: unknown
  message?: unknown
}

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

const MAX_CONTACT_BODY_BYTES = 100_000
const IDENTITY_LABELS: Record<string, string> = {
  creator: 'Content Creator',
  designer: 'Designer / Artist',
  musician: 'Musician / Band Leader',
  dev: 'Passionate Dev',
  kindred: 'Just a kindred spirit',
}
const TOPIC_LABELS: Record<string, string> = {
  visual: 'Visual Identity & Branding',
  web: 'Interactive Web Experiences',
  motion: 'Motion Typography & Video',
  audiovisual: 'Audio-Visual / Music Project',
  chat: 'Coffee & Late-night chat',
}

function sanitize(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function sanitizeHeaderValue(value: string): string {
  let safeValue = ''
  let previousWasControl = false

  for (const character of value) {
    const code = character.charCodeAt(0)
    const isControl = code <= 0x1f || code === 0x7f
    if (isControl) {
      if (!previousWasControl) safeValue += ' '
    } else {
      safeValue += character
    }
    previousWasControl = isControl
  }

  return safeValue.trim()
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
  const declaredLength = Array.isArray(contentLength) ? contentLength[0] : contentLength
  if (declaredLength && Number(declaredLength) > MAX_CONTACT_BODY_BYTES) {
    respond(res, 413, { error: 'Request body is too large.' })
    return
  }

  if (req.body === null || typeof req.body !== 'object' || Array.isArray(req.body)) {
    respond(res, 400, { error: 'Invalid request body.' })
    return
  }

  if (new TextEncoder().encode(JSON.stringify(req.body)).byteLength > MAX_CONTACT_BODY_BYTES) {
    respond(res, 413, { error: 'Request body is too large.' })
    return
  }

  const payload = req.body as ContactPayload
  const name = typeof payload.name === 'string' ? payload.name.trim() : ''
  const email = typeof payload.email === 'string' ? payload.email.trim() : ''
  const message = typeof payload.message === 'string' ? payload.message.trim() : ''

  if (!name || !email || !message) {
    respond(res, 400, { error: 'Name, email, and message are required.' })
    return
  }

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    respond(res, 400, { error: 'Invalid email address.' })
    return
  }

  const apiKey = process.env.RESEND_API_KEY
  const recipient = contactDeliveryConfig.to?.trim()
  const senderAddress =
    contactDeliveryConfig.fromDomain?.trim() && contactDeliveryConfig.fromLocalPart?.trim()
      ? `${contactDeliveryConfig.fromLocalPart.trim()}@${contactDeliveryConfig.fromDomain.trim()}`
      : contactDeliveryConfig.from?.trim()

  if (!apiKey?.trim() || !recipient || !senderAddress) {
    respond(res, 503, { error: 'The contact form is not configured.' })
    return
  }

  const siteName = contactDeliveryConfig.brandName?.trim() || 'Website'
  const contactLabel = `${siteName} Contact`
  const identity = typeof payload.identity === 'string' ? payload.identity : ''
  const topics = Array.isArray(payload.topics)
    ? payload.topics.filter((topic): topic is string => typeof topic === 'string')
    : []
  const identityLabel = IDENTITY_LABELS[identity] || identity || 'Not specified'
  const topicsList =
    topics.map((topic) => `&bull; ${sanitize(TOPIC_LABELS[topic] || topic)}`).join('<br>') ||
    '&bull; None specified'
  const html = [
    '<div style="font-family:system-ui,sans-serif;max-width:600px">',
    `<h2>New ${sanitize(siteName)} Contact Inquiry</h2>`,
    `<p><strong>Name:</strong> ${sanitize(name)}</p>`,
    `<p><strong>Email:</strong> ${sanitize(email)}</p>`,
    `<p><strong>Identity:</strong> ${sanitize(identityLabel)}</p>`,
    `<p><strong>Topics of Interest:</strong><br>${topicsList}</p>`,
    `<p><strong>Message:</strong><br>${sanitize(message).replace(/\n/g, '<br>')}</p>`,
    '</div>',
  ].join('')

  try {
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `${contactLabel} <${senderAddress}>`,
        to: [recipient],
        reply_to: sanitizeHeaderValue(email),
        subject: `[${contactLabel}] New Inquiry from ${sanitizeHeaderValue(name)}`,
        html,
      }),
    })

    if (!resendResponse.ok) {
      const diagnostic = await resendResponse.text()
      console.error(`[contact] Resend returned ${resendResponse.status}: ${diagnostic}`)
      respond(res, 502, { error: 'Unable to send your message right now.' })
      return
    }
  } catch (error) {
    console.error('[contact] Resend request failed:', error)
    respond(res, 502, { error: 'Unable to send your message right now.' })
    return
  }

  respond(res, 200, { success: true })
}
