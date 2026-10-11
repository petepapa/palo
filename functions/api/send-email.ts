interface Env {
  RESEND_API_KEY?: string
  CONTACT_TO_EMAIL?: string
  CONTACT_FROM_EMAIL?: string
}

interface ContactPayload {
  name?: unknown
  email?: unknown
  identity?: unknown
  topics?: unknown
  message?: unknown
}

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

type PagesContext = {
  request: Request
  env: Env
}

function json(body: Record<string, unknown>, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

function sanitize(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export async function onRequestPost({ request, env }: PagesContext): Promise<Response> {
  let payload: ContactPayload
  try {
    payload = await request.json()
  } catch {
    return json({ error: 'Invalid request body.' }, 400)
  }

  const name = typeof payload.name === 'string' ? payload.name.trim() : ''
  const email = typeof payload.email === 'string' ? payload.email.trim() : ''
  const message = typeof payload.message === 'string' ? payload.message.trim() : ''

  if (!name || !email || !message) {
    return json({ error: 'Name, email, and message are required.' }, 400)
  }

  if (!env.RESEND_API_KEY) {
    return json({ error: 'The contact form is not configured.' }, 503)
  }

  const identity = typeof payload.identity === 'string' ? payload.identity : ''
  const topics = Array.isArray(payload.topics)
    ? payload.topics.filter((topic): topic is string => typeof topic === 'string')
    : []
  const identityLabel = IDENTITY_LABELS[identity] || identity || 'Not specified'
  const topicsList = topics.map((topic) => `&bull; ${sanitize(TOPIC_LABELS[topic] || topic)}`).join('<br>') || '&bull; None specified'

  const html = [
    '<div style="font-family:system-ui,sans-serif;max-width:600px">',
    '<h2>New Contact Inquiry</h2>',
    `<p><strong>Name:</strong> ${sanitize(name)}</p>`,
    `<p><strong>Email:</strong> ${sanitize(email)}</p>`,
    `<p><strong>Identity:</strong> ${sanitize(identityLabel)}</p>`,
    `<p><strong>Topics of Interest:</strong><br>${topicsList}</p>`,
    `<p><strong>Message:</strong><br>${sanitize(message).replace(/\n/g, '<br>')}</p>`,
    '</div>',
  ].join('')

  const to = env.CONTACT_TO_EMAIL || 'contact@petepa.com'
  const from = env.CONTACT_FROM_EMAIL || 'hello@palo.petepa.com'
  const resendResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
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
    return json({ error: 'Unable to send your message right now.' }, 502)
  }

  return json({ success: true }, 200)
}
