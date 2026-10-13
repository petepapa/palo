import type { IncomingMessage, ServerResponse } from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import yaml from 'js-yaml'
import type { Plugin } from 'vite'
import { sendContactEmail, type ContactPayload } from '../src/utils/contact-email'

const CONFIG_FILE = 'src/config.yaml'
const MAX_BODY_BYTES = 100_000

function respond(res: ServerResponse, status: number, body: Record<string, unknown>) {
  res.writeHead(status, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(body))
}

async function readBody(req: IncomingMessage): Promise<string> {
  let body = ''
  for await (const chunk of req) {
    body += chunk
    if (body.length > MAX_BODY_BYTES) throw new Error('Request body is too large.')
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

        const config = yaml.load(fs.readFileSync(configPath, 'utf-8')) as {
          contact?: {
            resendApiKey?: string
            receiveEmail?: string
            resendDomain?: string
            resendFromLocalPart?: string
            resendFromEmail?: string
          }
        }
        const result = await sendContactEmail(payload, {
          apiKey: config.contact?.resendApiKey || process.env.RESEND_API_KEY,
          to: config.contact?.receiveEmail,
          fromDomain: config.contact?.resendDomain,
          fromLocalPart: config.contact?.resendFromLocalPart,
          from: config.contact?.resendFromEmail,
        })

        if (result.diagnostic) console.error('[palo-contact-dev-api]', result.diagnostic)
        respond(res, result.status, result.body)
      })
    },
  }
}
