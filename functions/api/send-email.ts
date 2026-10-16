import { sendContactEmail } from '../../src/utils/contact-email'
import { readContactRequest } from '../../src/utils/contact-request'
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
  const requestResult = await readContactRequest(request)
  if (!requestResult.ok) return json(requestResult.body, requestResult.status)

  const result = await sendContactEmail(requestResult.payload, {
    apiKey: env.RESEND_API_KEY,
    ...contactDeliveryConfig,
  })

  if (result.diagnostic) console.error('[contact]', result.diagnostic)
  return json(result.body, result.status)
}
