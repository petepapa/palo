import type { APIRoute } from 'astro'
import { Resend } from 'resend'
import config from '@config'
import type { ContactConfig } from '../../types/config'

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

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json()
    const { name, email, identity, topics, message } = body

    // ── Validate required fields ──
    const missing: string[] = []
    if (!name || typeof name !== 'string' || !name.trim()) missing.push('name')
    if (!email || typeof email !== 'string' || !email.trim()) missing.push('email')
    if (!message || typeof message !== 'string' || !message.trim()) missing.push('message')

    if (missing.length > 0) {
      return new Response(JSON.stringify({ error: 'Missing required fields', fields: missing }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // ── Initialize Resend ──
    // Priority: config.yaml → Vercel env (RESEND_API_KEY)
    const contact: ContactConfig | undefined = (config as any).contact
    const apiKey = contact?.resendApiKey || import.meta.env.RESEND_API_KEY
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'Server misconfigured: missing API key' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } },
      )
    }

    const receiveEmail = contact?.receiveEmail || 'hello@petepa.com'
    const fromEmail = contact?.resendFromEmail || receiveEmail

    const resend = new Resend(apiKey)

    // ── Build email body ──
    const identityLabel = identity ? IDENTITY_LABELS[identity] || identity : 'Not specified'

    const topicsList = (Array.isArray(topics) ? topics : [])
      .map((t: string) => `  • ${TOPIC_LABELS[t] || t}`)
      .join('\n')

    const htmlBody = [
      '<div style="font-family: system-ui, sans-serif; max-width: 600px;">',
      '<h2 style="margin-bottom: 0.5rem;">New Contact Inquiry</h2>',
      '<hr style="border: 1px solid #e5e7eb; margin-bottom: 1rem;">',
      `<p><strong>Name:</strong> ${sanitize(name)}</p>`,
      `<p><strong>Email:</strong> ${sanitize(email)}</p>`,
      `<p><strong>Identity:</strong> ${sanitize(identityLabel)}</p>`,
      '<p><strong>Topics of Interest:</strong></p>',
      `<pre style="margin-left: 1rem; color: #374151;">${sanitize(topicsList || '  • None specified')}</pre>`,
      '<p><strong>Message:</strong></p>',
      `<blockquote style="margin-left: 1rem; padding-left: 1rem; border-left: 3px solid #d1d5db; color: #374151;">${sanitize(message)}</blockquote>`,
      '<hr style="border: 1px solid #e5e7eb; margin-top: 1rem;">',
      '<p style="color: #9ca3af; font-size: 0.875rem;">Sent via Palo Contact Form</p>',
      '</div>',
    ].join('\n')

    const { data, error } = await resend.emails.send({
      from: `Palo Contact <${fromEmail}>`,
      to: [receiveEmail],
      subject: `[Palo Contact] New Inquiry from ${name}`,
      html: htmlBody,
    })

    if (error) {
      console.error('Resend API error:', error)
      return new Response(JSON.stringify({ error: 'Failed to send email' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ success: true, id: data?.id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Unexpected API error:', err)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

/** Rudimentary HTML entity escaping to prevent injection in email HTML. */
function sanitize(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
