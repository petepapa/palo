import { contactFormConfig } from '../contactForm'

export interface ContactPayload {
  name?: unknown
  email?: unknown
  identity?: unknown
  topics?: unknown
  message?: unknown
}

export interface ContactEmailSettings {
  apiKey?: string
  to?: string
  from?: string
}

export interface ContactEmailResult {
  body: Record<string, unknown>
  diagnostic?: string
  status: number
}

const DEFAULT_TO_EMAIL = 'contact@petepa.com'
const DEFAULT_FROM_EMAIL = 'hello@palo.petepa.com'

function sanitize(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function labelFor(value: string, options: typeof contactFormConfig.dynamicSections.identity.options): string {
  return options.find((option) => option.value === value)?.label || value
}

export async function sendContactEmail(
  payload: ContactPayload,
  { apiKey, to = DEFAULT_TO_EMAIL, from = DEFAULT_FROM_EMAIL }: ContactEmailSettings,
): Promise<ContactEmailResult> {
  const name = typeof payload.name === 'string' ? payload.name.trim() : ''
  const email = typeof payload.email === 'string' ? payload.email.trim() : ''
  const message = typeof payload.message === 'string' ? payload.message.trim() : ''

  if (!name || !email || !message) {
    return { status: 400, body: { error: 'Name, email, and message are required.' } }
  }

  if (!apiKey) {
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
    details.push(`<p><strong>${sanitize(contactFormConfig.dynamicSections.identity.legend)}:</strong> ${sanitize(identityLabel)}</p>`)
  }

  if (contactFormConfig.dynamicSections.collaboration.enable) {
    const topicLabels = topics.map((topic) => labelFor(topic, contactFormConfig.dynamicSections.collaboration.options))
    const topicsList = topicLabels.map((topic) => `&bull; ${sanitize(topic)}`).join('<br>') || '&bull; None specified'
    details.push(`<p><strong>${sanitize(contactFormConfig.dynamicSections.collaboration.legend)}:</strong><br>${topicsList}</p>`)
  }

  details.push(`<p><strong>Message:</strong><br>${sanitize(message).replace(/\n/g, '<br>')}</p>`)
  const html = [
    '<div style="font-family:system-ui,sans-serif;max-width:600px">',
    '<h2>New Contact Inquiry</h2>',
    ...details,
    '</div>',
  ].join('')

  const resendResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: `Palo Contact <${from}>`,
      to: [to],
      reply_to: email,
      subject: `[Palo Contact] New Inquiry from ${name}`,
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
