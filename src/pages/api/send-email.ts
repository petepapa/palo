// ═══════════════════════════════════════════════════════════════
// 强制运行时渲染 —— 禁止 Vercel 构建阶段静态化该路由
// ═══════════════════════════════════════════════════════════════
export const prerender = false

// ── DEBUG MODE ──────────────────────────────────────────────
// 部署到 Vercel 后如果依然报错，打开下面这行（取消注释）即可
// 开启前端 debug 返回，上线前请注释回去。
const DEBUG = false
// ─────────────────────────────────────────────────────────────

import type { APIRoute } from 'astro'
import { Resend } from 'resend'
import config from '@config'
import type { ContactConfig } from '../../types/config'
import { contactFormConfig } from '../../config/contact-form'

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

/** Return a debug-enriched 500 response when DEBUG is on; otherwise plain text. */
function debugResp(
  step: string,
  payload: Record<string, unknown>,
  status = 500,
): Response {
  const body = DEBUG
    ? { _debug: true, debug_step: step, ...payload }
    : { error: payload.error || 'Internal server error' }

  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

export const POST: APIRoute = async ({ request }) => {
  // ── Parse request body ──
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return debugResp('request_parsing', {
      error: '无法解析请求体 JSON。前端发过来的数据格式可能不对。',
    })
  }

  const { name, email, identity, topics, message } = body

  // ── Validate required fields ──
  const missing: string[] = []
  if (!name || typeof name !== 'string' || !(name as string).trim()) missing.push('name')
  if (!email || typeof email !== 'string' || !(email as string).trim()) missing.push('email')
  if (!message || typeof message !== 'string' || !(message as string).trim()) missing.push('message')

  if (missing.length > 0) {
    return debugResp('request_fields_validation', {
      error: `字段校验失败！缺失或无效的字段: [${missing.join(', ')}]`,
      received_body_keys: Object.keys(body),
      received_body_json: body,
    }, 400)
  }

  // ═══════════════════════════════════════════════════════════════
  // Resolve credentials at runtime (every request)
  //
  // Priority chain:
  //   1. config.yaml  contact.resendApiKey   (local dev override)
  //   2. process.env  RESEND_API_KEY          (Vercel runtime)
  //   3. import.meta.env  RESEND_API_KEY       (Astro/Vite fallback)
  // ═══════════════════════════════════════════════════════════════
  const contact: ContactConfig | undefined = (config as any).contact

  const yamlKey = contact?.resendApiKey || ''
  const procKey =
    typeof process !== 'undefined' ? (process.env as any)?.RESEND_API_KEY || '' : ''
  const viteKey = (import.meta.env as any).RESEND_API_KEY || ''

  const finalApiKey = yamlKey || procKey || viteKey

  // ── API key 诊断 ──
  if (!finalApiKey) {
    return debugResp('api_key_resolution', {
      error: 'Resend API key 完全是空的！yaml、process.env、import.meta.env 都没捞到值。',
      yamlKey_present: !!yamlKey,
      yamlKey_value: yamlKey ? maskKey(yamlKey) : '(empty)',
      process_env_present: !!procKey,
      process_env_value: procKey ? maskKey(procKey) : '(empty)',
      vite_env_present: !!viteKey,
      vite_env_value: viteKey ? maskKey(viteKey) : '(empty)',
      hint: '请在 Vercel Dashboard → Settings → Environment Variables 中添加 RESEND_API_KEY，或在 config.yaml contact.resendApiKey 中填入。',
    })
  }

  if (!finalApiKey.startsWith('re_') || finalApiKey.length < 20) {
    return debugResp('api_key_format', {
      error: `Resend API key 格式可疑（前缀: "${finalApiKey.slice(0, 4)}...", 长度: ${finalApiKey.length}）。`,
      hint: '有效的 Resend API key 以 "re_" 开头且长度通常 > 30 字符。请检查 config.yaml 或 Vercel 环境变量中的值是否正确。',
      key_prefix: finalApiKey.slice(0, 4),
      key_length: finalApiKey.length,
    })
  }

  const receiveEmail = contact?.receiveEmail || 'hello@petepa.com'
  const fromEmail = contact?.resendFromEmail || receiveEmail

  // ── Build email body ──
  const identityLabel = identity ? IDENTITY_LABELS[identity as string] || identity : 'Not specified'

  const topicsList = (Array.isArray(topics) ? topics : [])
    .map((t: string) => `  • ${TOPIC_LABELS[t] || t}`)
    .join('\n')

  const htmlParts = [
    '<div style="font-family: system-ui, sans-serif; max-width: 600px;">',
    '<h2 style="margin-bottom: 0.5rem;">New Contact Inquiry</h2>',
    '<hr style="border: 1px solid #e5e7eb; margin-bottom: 1rem;">',
    `<p><strong>Name:</strong> ${sanitize(name as string)}</p>`,
    `<p><strong>Email:</strong> ${sanitize(email as string)}</p>`,
  ]

  // Only include identity when the section is enabled in config
  if (contactFormConfig.dynamicSections.identity.enable) {
    htmlParts.push(
      `<p><strong>Identity:</strong> ${sanitize(identityLabel as string)}</p>`,
    )
  }

  // Only include topics when the section is enabled in config
  if (contactFormConfig.dynamicSections.collaboration.enable) {
    htmlParts.push(
      '<p><strong>Topics of Interest:</strong></p>',
      `<pre style="margin-left: 1rem; color: #374151;">${sanitize(topicsList || '  • None specified')}</pre>`,
    )
  }

  htmlParts.push(
    '<p><strong>Message:</strong></p>',
    `<blockquote style="margin-left: 1rem; padding-left: 1rem; border-left: 3px solid #d1d5db; color: #374151; white-space: pre-wrap;">${sanitize(message as string)}</blockquote>`,
    '<hr style="border: 1px solid #e5e7eb; margin-top: 1rem;">',
    '<p style="color: #9ca3af; font-size: 0.875rem;">Sent via Palo Contact Form</p>',
    '</div>',
  )

  const htmlBody = htmlParts.join('\n')

  // ── Send via Resend ──
  let data: { id?: string } | null = null
  let resendError: unknown = null

  try {
    const resend = new Resend(finalApiKey)
    const result = await resend.emails.send({
      from: `Palo Contact <${fromEmail}>`,
      to: [receiveEmail],
      subject: `[Palo Contact] New Inquiry from ${name}`,
      html: htmlBody,
    })
    data = result.data
    resendError = result.error
  } catch (sendErr) {
    // Network-level or SDK-level exception
    return debugResp('resend_send_exception', {
      error: '调用 Resend SDK 时抛出异常（网络或 SDK 内部错误）。',
      exception_message: sendErr instanceof Error ? sendErr.message : String(sendErr),
      exception_stack: sendErr instanceof Error ? (sendErr.stack ?? '(no stack)') : '(no stack)',
    })
  }

  if (resendError) {
    return debugResp('resend_send', {
      error: 'Resend API 返回了错误。',
      resend_error: DEBUG
        ? (typeof resendError === 'object' ? JSON.stringify(resendError) : String(resendError))
        : undefined,
      resend_error_keys: typeof resendError === 'object' && resendError !== null
        ? Object.keys(resendError as Record<string, unknown>)
        : [],
      hint: '常见原因：① API key 无效或被吊销 ② from 邮箱域名未在 Resend 验证 ③ Resend 账户欠费/限流。',
    })
  }

  // ── 深度探测 data 对象 ──
  if (!data || !data.id) {
    return debugResp('resend_response', {
      error: 'Resend 返回了成功状态，但 data 对象缺失 id 字段（邮件可能未实际发出）。',
      data_keys: data ? Object.keys(data) : [],
      data_json: data ? JSON.stringify(data) : 'null',
    })
  }

  return new Response(JSON.stringify({ success: true, id: data.id }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
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

/** Mask an API key for safe logging: show first 6 + last 4 chars. */
function maskKey(key: string): string {
  if (key.length <= 10) return key.slice(0, 3) + '***'
  return key.slice(0, 6) + '****' + key.slice(-4)
}
