import { sendContactEmail, type ContactPayload } from '../src/utils/contact-email'

type VercelRequest = {
  body?: unknown
  method?: string
}

type VercelResponse = {
  setHeader(name: string, value: string): void
  status(code: number): VercelResponse
  json(body: Record<string, unknown>): void
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    res.status(405).json({ error: 'Method not allowed.' })
    return
  }

  const payload = (req.body && typeof req.body === 'object' ? req.body : {}) as ContactPayload
  const result = await sendContactEmail(payload, {
    apiKey: process.env.RESEND_API_KEY,
    to: process.env.CONTACT_TO_EMAIL,
    from: process.env.CONTACT_FROM_EMAIL,
  })

  if (result.diagnostic) console.error('[contact]', result.diagnostic)
  res.status(result.status).json(result.body)
}
