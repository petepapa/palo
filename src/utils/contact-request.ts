import type { ContactPayload } from './contact-email.ts'

export const MAX_CONTACT_BODY_BYTES = 100_000

export type ContactRequestResult =
  | { ok: true; payload: ContactPayload }
  | { ok: false; status: 400 | 413; body: { error: string } }

export function isContentLengthTooLarge(contentLength: string | null): boolean {
  if (contentLength === null) return false
  const bytes = Number(contentLength)
  return Number.isFinite(bytes) && bytes > MAX_CONTACT_BODY_BYTES
}

export function isContactPayloadTooLarge(payload: unknown): boolean {
  const serialized = JSON.stringify(payload)
  return new TextEncoder().encode(serialized ?? '').byteLength > MAX_CONTACT_BODY_BYTES
}

export async function readContactRequest(request: Request): Promise<ContactRequestResult> {
  if (isContentLengthTooLarge(request.headers.get('content-length'))) {
    return { ok: false, status: 413, body: { error: 'Request body is too large.' } }
  }

  if (!request.body) {
    return { ok: false, status: 400, body: { error: 'Invalid request body.' } }
  }

  const reader = request.body.getReader()
  const chunks: Uint8Array[] = []
  let byteLength = 0

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      byteLength += value.byteLength
      if (byteLength > MAX_CONTACT_BODY_BYTES) {
        await reader.cancel()
        return { ok: false, status: 413, body: { error: 'Request body is too large.' } }
      }
      chunks.push(value)
    }
  } finally {
    reader.releaseLock()
  }

  const bytes = new Uint8Array(byteLength)
  let offset = 0
  for (const chunk of chunks) {
    bytes.set(chunk, offset)
    offset += chunk.byteLength
  }

  try {
    const payload: unknown = JSON.parse(new TextDecoder().decode(bytes))
    if (payload === null || typeof payload !== 'object' || Array.isArray(payload)) {
      return { ok: false, status: 400, body: { error: 'Invalid request body.' } }
    }
    return { ok: true, payload: payload as ContactPayload }
  } catch {
    return { ok: false, status: 400, body: { error: 'Invalid request body.' } }
  }
}
