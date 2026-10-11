import type { IncomingMessage, ServerResponse } from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import yaml from 'js-yaml'
import type { Plugin } from 'vite'

const CONFIG_FILE = 'src/config.yaml'
const MAX_BODY_BYTES = 100_000

type ContactPayload = {
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

function sanitize(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function respond(res: ServerResponse, status: number, body: Record<string, unknown>) {
  res.writeHead(status, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(body))
}

async function readBody(req: IncomingMessage): Promise<string> {
  let body = ''
  for await (const chunk of req) {
    body += chunk
    if (body.length > MAX_BODY_BYTES) {
      throw new Error('Request body is too large.')
    }
  }
  return body
}

export function paloContactDevApi(): Plugin {
  return {
    name: 'palo-contact-dev-api',
    apply: 'serve',
    configureServer(server) {
      const configPath = path.resolve(server.config.root, CONFIG_FILE)

      server.middlewares.use('/api/send-email', async (req, res) => {
        if (req.method !== 'POST') {
          res.setHeader('Allow', 'POST')
          respond(res, 405, { error: 'Method not allowed.' })
          return
        }

        let payload: ContactPayload
        try {
          payload = JSON.parse(await readBody(req))
        } catch {
          respond(res, 400, { error: 'Invalid request body.' })
          return
        }

        const name = typeof payload.name === 'string' ? payload.name.trim() : ''
        const email = typeof payload.email === 'string' ? payload.email.trim() : ''
        const message = typeof payload.message === 'string' ? payload.message.trim() : ''
        if (!name || !email || !message) {
          respond(res, 400, { error: 'Name, email, and message are required.' })
          return
        }

        const config = yaml.load(fs.readFileSync(configPath, 'utf-8')) as {
          contact?: { resendApiKey?: string; receiveEmail?: string; resendFromEmail?: string }
        }
        const apiKey = config.contact?.resendApiKey || process.env.RESEND_API_KEY
        if (!apiKey) {
          respond(res, 503, { error: 'The contact form is not configured.' })
          return
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

        const to = config.contact?.receiveEmail || 'contact@petepa.com'
        const from = config.contact?.resendFromEmail || to
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
          console.error('[palo-contact-dev-api] Resend returned', resendResponse.status)
          respond(res, 502, { error: 'Unable to send your message right now.' })
          return
        }

        respond(res, 200, { success: true })
      })
    },
  }
}
