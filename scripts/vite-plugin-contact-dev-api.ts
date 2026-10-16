import type { IncomingMessage, ServerResponse } from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import yaml from 'js-yaml'
import type { Plugin } from 'vite'
import { sendContactEmail, type ContactPayload } from '../src/utils/contact-email'
import { MAX_CONTACT_BODY_BYTES } from '../src/utils/contact-request'

const CONFIG_FILE = 'src/config.yaml'

function respond(res: ServerResponse, status: number, body: Record<string, unknown>) {
  res.writeHead(status, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(body))
}

async function readBody(req: IncomingMessage): Promise<string> {
  const chunks: Buffer[] = []
  let byteLength = 0
  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
    byteLength += buffer.byteLength
    if (byteLength > MAX_CONTACT_BODY_BYTES) throw new RequestBodyTooLargeError()
    chunks.push(buffer)
  }
  return Buffer.concat(chunks).toString('utf8')
}

class RequestBodyTooLargeError extends Error {}

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

        let body: string
        try {
          body = await readBody(req)
        } catch (error) {
          if (error instanceof RequestBodyTooLargeError) {
            respond(res, 413, { error: 'Request body is too large.' })
            return
          }
          throw error
        }

        let parsedPayload: unknown
        try {
          parsedPayload = JSON.parse(body)
        } catch {
          respond(res, 400, { error: 'Invalid request body.' })
          return
        }

        if (parsedPayload === null || typeof parsedPayload !== 'object' || Array.isArray(parsedPayload)) {
          respond(res, 400, { error: 'Invalid request body.' })
          return
        }

        const payload = parsedPayload as ContactPayload
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
