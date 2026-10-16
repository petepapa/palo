import { contactFormConfig } from '../contactForm.ts'

export interface ContactPayload {
  name?: unknown
  email?: unknown
  identity?: unknown
  topics?: unknown
  message?: unknown
}

export interface ContactEmailSettings {
  apiKey?: string
  brandName?: string
  to?: string
  from?: string
  fromDomain?: string
  fromLocalPart?: string
}

export interface ContactEmailResult {
  body: Record<string, unknown>
  diagnostic?: string
  status: number
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

function labelFor(value: string, options: typeof contactFormConfig.dynamicSections.identity.options): string {
  return options.find((option) => option.value === value)?.label || value
}

export async function sendContactEmail(
  payload: ContactPayload,
  { apiKey, brandName, to, from, fromDomain, fromLocalPart }: ContactEmailSettings,
): Promise<ContactEmailResult> {
  const name = typeof payload.name === 'string' ? payload.name.trim() : ''
  const email = typeof payload.email === 'string' ? payload.email.trim() : ''
  const message = typeof payload.message === 'string' ? payload.message.trim() : ''

  if (!name || !email || !message) {
    return { status: 400, body: { error: 'Name, email, and message are required.' } }
  }

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { status: 400, body: { error: 'Invalid email address.' } }
  }

  const recipient = to?.trim()
  const siteName = brandName?.trim() || 'Website'
  const contactLabel = `${siteName} Contact`
  const senderAddress =
    fromDomain?.trim() && fromLocalPart?.trim() ? `${fromLocalPart.trim()}@${fromDomain.trim()}` : from?.trim()

  if (!apiKey?.trim() || !recipient || !senderAddress) {
    return { status: 503, body: { error: 'The contact form is not configured.' } }
  }

  const identity = typeof payload.identity === 'string' ? payload.identity : ''
  const topics = Array.isArray(payload.topics)
    ? payload.topics.filter((topic): topic is string => typeof topic === 'string')
    : []
  const details = [
    `<p><strong>Name:</strong> ${sanitize(name)}</p>`,
    `<p><strong>Email:</strong> ${sanitize(email)}</p>`,
  ]

  if (contactFormConfig.dynamicSections.identity.enable) {
    const identityLabel = labelFor(identity, contactFormConfig.dynamicSections.identity.options) || 'Not specified'
    details.push(
      `<p><strong>${sanitize(contactFormConfig.dynamicSections.identity.legend)}:</strong> ${sanitize(identityLabel)}</p>`,
    )
  }

  if (contactFormConfig.dynamicSections.collaboration.enable) {
    const topicLabels = topics.map((topic) => labelFor(topic, contactFormConfig.dynamicSections.collaboration.options))
    const topicsList = topicLabels.map((topic) => `&bull; ${sanitize(topic)}`).join('<br>') || '&bull; None specified'
    details.push(
      `<p><strong>${sanitize(contactFormConfig.dynamicSections.collaboration.legend)}:</strong><br>${topicsList}</p>`,
    )
  }

  details.push(`<p><strong>Message:</strong><br>${sanitize(message).replace(/\n/g, '<br>')}</p>`)
  const html = [
    '<div style="font-family:system-ui,sans-serif;max-width:600px">',
    `<h2>New ${sanitize(siteName)} Contact Inquiry</h2>`,
    ...details,
    '</div>',
  ].join('')
  const resendResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey.trim()}`,
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
    return {
      status: 502,
      body: { error: 'Unable to send your message right now.' },
      diagnostic: `Resend returned ${resendResponse.status}: ${await resendResponse.text()}`,
    }
  }

  return { status: 200, body: { success: true } }
}
