import { sendContactEmail, type ContactPayload } from '../../src/utils/contact-email'
import { contactDeliveryConfig } from '../../.palo/contact-config.mjs'

interface Env {
  RESEND_API_KEY?: string
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

export async function onRequestPost({ request, env }: PagesContext): Promise<Response> {
  let payload: ContactPayload
  try {
    payload = await request.json()
  } catch {
    return json({ error: 'Invalid request body.' }, 400)
  }

  const result = await sendContactEmail(payload, {
    apiKey: env.RESEND_API_KEY,
    ...contactDeliveryConfig,
  })

  if (result.diagnostic) console.error('[contact]', result.diagnostic)
  return json(result.body, result.status)
}
