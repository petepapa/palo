---
title: "Contact Form Setup & Resend Integration"
description: Learn how to customize your contact form fields, radio/checkbox options, and set up Resend email service with Vercel environment variables — including API key security best practices.
publishDate: 2026-08-14
author:
  name: "Pete"
  image: "/branding/avatar.png"
  bio: "PetePa.com"
tags: ['Documentation', 'Configuration', 'Contact', 'Resend', 'Email']
coverImage: ./cover.jpg
coverImagePosition: head
breadcrumbs: true
customBreadcrumbLabels:
  "blog": "Blog"
  "current": ""
joinLastBreadcrumb: false
source: "https://github.com/petepapa/palo"
liveDemo: "https://palo.petepa.com/contact"
divider: both
toc: true
views: 0
---

### Introduction

The Contact form is one of the few features in Palo that touches both **`src/contactForm.ts`** (field labels, choices) and **`src/config.yaml`** (email delivery via Resend). This guide walks through every customization point — from renaming labels to wiring up Resend on Vercel.

Contact 表单是 Palo 中少数同时涉及 **`src/contactForm.ts`**（字段标签、选项）和 **`src/config.yaml`**（通过 Resend 发送邮件）的功能。本指南涵盖所有自定义点——从修改标签到在 Vercel 上配置 Resend。

| What you want | Where to edit |
|---------------|---------------|
| Change labels, placeholders, error messages | `src/contactForm.ts` → `fields` |
| Add/remove radio or checkbox options | `src/contactForm.ts` → `dynamicSections` |
| Hide a section entirely | `src/contactForm.ts` → `enable: false` |
| Change recipient email | `src/config.yaml` → `contact.receiveEmail` |
| Set up Resend API key | Vercel Dashboard → Environment Variables |

| 想做什么 | 在哪修改 |
|---------|---------|
| 修改标签、占位符、错误提示 | `src/contactForm.ts` → `fields` |
| 增删单选/复选项 | `src/contactForm.ts` → `dynamicSections` |
| 完全隐藏某个区域 | `src/contactForm.ts` → `enable: false` |
| 修改收件邮箱 | `src/config.yaml` → `contact.receiveEmail` |
| 配置 Resend API key | Vercel Dashboard → Environment Variables |

---

### Architecture Overview

The contact system has three moving parts:

联系系统由三个部分组成：

```
User fills form  →  Frontend validates  →  POST /api/send-email  →  Resend delivers email
     ↑                    ↑                    ↑                      ↑
contact.astro     contactForm.ts         send-email.ts         config.yaml + Vercel Env
```

| Layer | File | Responsibility |
|-------|------|---------------|
| **UI** | `src/pages/contact.astro` | Renders form, client-side validation, AJAX submit |
| **Config** | `src/contactForm.ts` | All labels, options, enable/disable toggles |
| **API** | `src/pages/api/send-email.ts` | Server-side validation, Resend API call, HTML email building |
| **Delivery** | `src/config.yaml` + Vercel env | Resend credentials, recipient email, sender email |

| 层级 | 文件 | 职责 |
|------|------|------|
| **UI** | `src/pages/contact.astro` | 渲染表单、客户端校验、AJAX 提交 |
| **配置** | `src/contactForm.ts` | 所有标签、选项、开关 |
| **API** | `src/pages/api/send-email.ts` | 服务端校验、调用 Resend、构建 HTML 邮件 |
| **投递** | `src/config.yaml` + Vercel 环境变量 | Resend 凭证、收件邮箱、发件邮箱 |

---

### Customizing Form Fields

All static text fields live in `src/contactForm.ts` under `fields`.

所有静态文本字段都在 `src/contactForm.ts` 的 `fields` 下。

```typescript
fields: {
  name: {
    label: 'YOUR NAME',              // Floating label inside the input
    emptyMsg: 'Please enter your name',  // Error shown after failed submit
  },
  email: {
    label: 'EMAIL ADDRESS',
    emptyMsg: 'Please enter your email address',
    invalidMsg: 'Please enter a valid email address',
  },
  message: {
    label: 'YOUR PROJECT OR IDEA',
    emptyMsg: 'Please tell me about your project or idea',
    placeholder: 'Tell me about your product goals, budget scope, or timeline...',
  },
},
```

| Property | Type | Description |
|----------|------|-------------|
| `label` | `string` | Floating label displayed inside the input |
| `emptyMsg` | `string` | Error shown when the field is empty |
| `invalidMsg` | `string` | Error for email format validation (email field only) |
| `placeholder` | `string` | Placeholder text visible when textarea is focused |

| 属性 | 类型 | 说明 |
|------|------|------|
| `label` | `string` | 输入框内的浮动标签 |
| `emptyMsg` | `string` | 字段为空时的错误提示 |
| `invalidMsg` | `string` | 邮箱格式错误提示（仅 email 字段） |
| `placeholder` | `string` | 文本区聚焦时显示的占位文字 |

#### Example: Translate to Chinese

```typescript
fields: {
  name: {
    label: '您的姓名',
    emptyMsg: '请输入您的姓名',
  },
  email: {
    label: '电子邮箱',
    emptyMsg: '请输入您的邮箱',
    invalidMsg: '请输入有效的邮箱地址',
  },
  message: {
    label: '您的项目或想法',
    emptyMsg: '请告诉我您的项目或想法',
    placeholder: '请描述您的产品目标、预算范围或时间线...',
  },
},
```

---

### Customizing Radio (Identity) and Checkbox (Collaboration)

The two dynamic sections — **Identity** (radio) and **Collaboration** (checkbox) — are configured via `dynamicSections`.

两个动态区域——**身份识别**（单选）和**协作内容**（多选）——通过 `dynamicSections` 配置。

#### Radio Section: Identity

单选区域：身份识别

```typescript
identity: {
  enable: true,                    // false = hide the section entirely
  legend: 'WHO ARE YOU?',          // Heading inside the fieldset border
  options: [
    { value: 'creator', label: 'Content Creator' },
    { value: 'designer', label: 'Designer / Artist' },
    { value: 'musician', label: 'Musician / Band Leader' },
    { value: 'dev', label: 'Passionate Dev' },
    { value: 'kindred', label: 'Just a kindred spirit' },
  ],
},
```

#### Checkbox Section: Collaboration

多选区域：协作内容

```typescript
collaboration: {
  enable: true,
  legend: "WHAT'S ON YOUR MIND?",
  options: [
    { value: 'visual', label: 'Visual Identity & Branding' },
    { value: 'web', label: 'Interactive Web Experiences' },
    { value: 'motion', label: 'Motion Typography & Video' },
    { value: 'audiovisual', label: 'Audio-Visual / Music Project' },
    { value: 'chat', label: 'Coffee & Late-night chat' },
  ],
},
```

#### Adding a New Option

添加新选项

```typescript
options: [
  { value: 'creator', label: 'Content Creator' },
  { value: 'designer', label: 'Designer / Artist' },
  // Add your new option here:
  { value: 'photographer', label: 'Photographer' },
  { value: 'musician', label: 'Musician / Band Leader' },
],
```

**Important:** The `value` field is machine-readable and sent to the API. Use short, lowercase, hyphen-free strings. The `label` is what users see.

**注意：** `value` 字段是机器可读的，会发送给 API。使用简短的、小写的、无连字符的字符串。`label` 是用户看到的内容。

#### Hiding a Section

隐藏某个区域

Set `enable: false` to completely hide either section. The frontend will skip rendering, and the API will skip including it in the email.

设置 `enable: false` 可完全隐藏对应区域。前端会跳过渲染，API 也会跳过在邮件中包含该部分。

```typescript
identity: {
  enable: false,  // Radio section hidden
  legend: 'WHO ARE YOU?',
  options: [ /* ... */ ],
},
```

**When both sections are hidden**, the form becomes a simple 3-field contact form (Name, Email, Message) — perfect for minimal sites.

**当两个区域都被隐藏时**，表单变为简单的 3 字段联系表单（姓名、邮箱、留言）——非常适合极简风格的网站。

#### How Options Flow into the Email

选项如何流转到邮件中

The `value` strings map to human-readable labels in the API layer via `IDENTITY_LABELS` and `TOPIC_LABELS` in `send-email.ts`:

`value` 字符串通过 `send-email.ts` 中的 `IDENTITY_LABELS` 和 `TOPIC_LABELS` 映射为人类可读的标签：

```typescript
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
```

**If you add a new option** (e.g., `{ value: 'photographer', label: 'Photographer' }`), the email will fall back to displaying the `value` string (`photographer`) unless you also add it to the label maps in `send-email.ts`.

**如果添加了新选项**（如 `{ value: 'photographer', label: 'Photographer' }`），邮件会回退显示 `value` 字符串（`photographer`），除非你同时在 `send-email.ts` 的标签映射中添加了对应条目。

---

### Resend Configuration

Resend is the email delivery service Palo uses. Configuration lives in two places:

Resend 是 Palo 使用的邮件投递服务。配置分布在两个位置：

1. **`src/config.yaml`** — for recipient email and local API key override
2. **Vercel Environment Variables** — for the production API key (secure)

1. **`src/config.yaml`** — 收件邮箱和本地 API key 覆盖
2. **Vercel 环境变量** — 生产环境 API key（安全存储）

#### config.yaml Settings

```yaml
contact:
  receiveEmail: "contact@yourdomain.com"       # Where you receive notifications
  resendFromEmail: "hello@yourdomain.com"       # Verified sender domain (optional)
  resendApiKey: ""                               # Local dev only — leave empty in production
```

| Key | Required | Description |
|-----|----------|-------------|
| `receiveEmail` | Yes | The inbox that receives contact form submissions |
| `resendFromEmail` | Recommended | A verified email on your Resend domain — improves deliverability. Falls back to `receiveEmail` if empty. |
| `resendApiKey` | Local only | **Only use for local testing.** Never commit this to a public repo. |

| 键 | 必填 | 说明 |
|----|------|------|
| `receiveEmail` | 是 | 接收表单提交的邮箱地址 |
| `resendFromEmail` | 推荐 | Resend 域名上已验证的发件邮箱——提高送达率。留空则使用 `receiveEmail`。 |
| `resendApiKey` | 仅本地 | **仅用于本地测试。** 切勿提交到公共仓库。 |

#### API Key Resolution Order

API key 解析顺序

The API resolves the key in this order (first match wins):

API 按以下顺序解析 key（第一个匹配生效）：

1. `config.yaml` → `contact.resendApiKey` (for local development)
2. `process.env.RESEND_API_KEY` (Vercel serverless runtime)
3. `import.meta.env.RESEND_API_KEY` (Astro/Vite fallback)

1. `config.yaml` → `contact.resendApiKey`（本地开发用）
2. `process.env.RESEND_API_KEY`（Vercel 无服务器运行时）
3. `import.meta.env.RESEND_API_KEY`（Astro/Vite 回退）

---

### Setting Up Resend on Vercel

This is the recommended production setup.

这是推荐的生产环境配置方式。

#### Step 1: Create a Resend Account

1. Go to [resend.com](https://resend.com) and sign up
2. Verify your email address
3. On the free tier, you can add **1 domain** and send up to **100 emails/day**

#### 第一步：创建 Resend 账户

1. 访问 [resend.com](https://resend.com) 并注册
2. 验证邮箱地址
3. 免费版可添加 **1 个域名**，每天最多发送 **100 封邮件**

> ⚠️ **Resend Free Tier Limit:** One Resend account can only add **one domain** for free. If you need to send from multiple domains, you'll need a paid plan ($24/year as of 2026).

> ⚠️ **Resend 免费版限制：** 一个 Resend 账户只能免费添加 **一个域名**。如果需要从多个域名发送邮件，需要付费套餐（2026 年为 $24/年）。

#### Step 2: Add Your Domain

1. In Resend Dashboard → **Domains** → **Add Domain**
2. Enter your domain (e.g., `yourdomain.com`)
3. Follow the DNS setup instructions (add MX, SPF, DKIM records to your domain registrar)
4. Wait for domain verification (usually a few minutes)

#### 第二步：添加域名

1. 在 Resend 控制台 → **Domains** → **Add Domain**
2. 输入你的域名（如 `yourdomain.com`）
3. 按照 DNS 设置说明操作（在域名注册商添加 MX、SPF、DKIM 记录）
4. 等待域名验证通过（通常几分钟）

#### Step 3: Create an API Key

1. In Resend Dashboard → **Settings** → **API Keys** → **Create API Key**
2. Give it a name (e.g., `Vercel Production`)
3. Copy the key — it looks like `re_xxxxxxxxxxxxxxxxxxxxxxxxx`
4. **You won't see it again after closing the modal!**

#### 第三步：创建 API Key

1. 在 Resend 控制台 → **Settings** → **API Keys** → **Create API Key**
2. 填写名称（如 `Vercel Production`）
3. 复制 key——格式为 `re_xxxxxxxxxxxxxxxxxxxxxxxxx`
4. **关闭弹窗后将无法再查看完整 key！**

#### Step 4: Add Environment Variable to Vercel

#### 第四步：在 Vercel 添加环境变量

1. Go to your Vercel Project → **Settings** → **Environment Variables**
2. Add a new variable:

| Field | Value |
|-------|-------|
| **Key** | `RESEND_API_KEY` |
| **Value** | `re_xxxxxxxxxxxxxxxxxxxxxxxxx` (your Resend API key) |
| **Environment** | Select all: Production, Preview, Development |

| 字段 | 值 |
|------|-----|
| **Key** | `RESEND_API_KEY` |
| **Value** | `re_xxxxxxxxxxxxxxxxxxxxxxxxx`（你的 Resend API key） |
| **Environment** | 全部勾选：Production, Preview, Development |

3. Click **Save**
4. Redeploy your site (push any commit, or use Vercel's Redeploy button)

3. 点击 **Save**
4. 重新部署站点（推送任意 commit，或使用 Vercel 的 Redeploy 按钮）

#### Step 5: Configure config.yaml

#### 第五步：配置 config.yaml

```yaml
contact:
  receiveEmail: "hello@yourdomain.com"
  resendFromEmail: "hello@yourdomain.com"
  resendApiKey: ""    # Leave empty — Vercel handles it
```

**For local testing only**, you can temporarily paste the API key:

**仅本地测试时**，可临时粘贴 API key：

```yaml
contact:
  receiveEmail: "hello@yourdomain.com"
  resendFromEmail: "hello@yourdomain.com"
  resendApiKey: "re_xxxxxxxxxxxxxxxxxxxxxxxxx"  # TEMPORARY — remove before commit!
```

---

### API Key Security Warning

**Never commit your Resend API key to a public repository.**

**切勿将 Resend API key 提交到公共仓库。**

If your project is open-source and you hardcode the API key in `config.yaml`, anyone who finds your repo can:

如果你的项目是开源的，且你在 `config.yaml` 中硬编码了 API key，任何看到仓库的人都可以：

- Send unlimited emails **using your quota**
- Spam others **from your domain** (ruining your sender reputation)
- Incur **unexpected charges** on your Resend account
- Access the **inbox of your `receiveEmail`** (if they craft a malicious form)

- 使用你的配额**无限制发送邮件**
- **从你的域名**发送垃圾邮件（损害发件人信誉）
- 在你的 Resend 账户上产生**意外费用**
- 访问你 `receiveEmail` 的**收件箱**（如果他们构造了恶意表单）

#### Safe Practices

安全最佳实践

1. **Production:** Always use Vercel Environment Variables (`RESEND_API_KEY`) — never hardcode
2. **Local testing:** Paste the key in `config.yaml` → `contact.resendApiKey`, then **remove it before committing**
3. **Add `.env` to `.gitignore`** — never commit environment-specific config
4. **Rotate keys** immediately if you suspect a leak
5. **Monitor** your Resend dashboard for unexpected activity

1. **生产环境：** 始终使用 Vercel 环境变量（`RESEND_API_KEY`）——绝不硬编码
2. **本地测试：** 在 `config.yaml` → `contact.resendApiKey` 中临时粘贴，然后**提交前务必清除**
3. **将 `.env` 加入 `.gitignore`** —— 绝不提交环境相关配置
4. **立即更换** key 如果你怀疑泄露了
5. **监控** Resend 控制台的异常活动

---

### Testing the Contact Form

#### 1. Local Development

```bash
# In config.yaml, set:
# contact.resendApiKey: "re_xxxxxxxxxxxxxxxxxxxxxxxxx"
npm run dev
# Visit http://localhost:4321/contact
# Fill and submit the form
```

Check your inbox — the email should arrive within a few seconds.

检查收件箱——邮件应在几秒内到达。

#### 2. Production (Vercel)

1. Push your changes to GitHub
2. Wait for Vercel to build and deploy
3. Visit your production URL → Contact page
4. Submit a test form

Watch Vercel logs for the `/api/send-email` route to confirm delivery.

查看 Vercel 的 `/api/send-email` 路由日志以确认投递状态。

#### 3. Debug Mode

If emails aren't sending, open debug mode in `send-email.ts`:

如果邮件无法发送，在 `send-email.ts` 中开启 debug 模式：

```typescript
const DEBUG = true  // Change from false to true
```

This returns detailed error information in the API response — useful for diagnosing API key issues, domain verification problems, or Resend account limits.

这会在 API 响应中返回详细错误信息——用于诊断 API key 问题、域名验证问题或 Resend 账户限制。

---

### Email Format

The API builds a clean, responsive HTML email:

API 会构建简洁、响应式的 HTML 邮件：

```html
New Contact Inquiry
─────────────────────
Name: Jane Doe
Email: jane@example.com
Identity: Designer / Artist
Topics of Interest:
  • Visual Identity & Branding
  • Interactive Web Experiences

Message:
  I'd love to work with you on a brand redesign...
```

The email respects your `contactForm.ts` configuration — disabled sections (identity, collaboration) are automatically excluded from the email body.

邮件遵循 `contactForm.ts` 的配置——被禁用的区域（identity、collaboration）会自动从邮件正文中排除。

---

### Thank You Page

After successful submission, the user is redirected to `/thank-you`. You can customize this page at `src/pages/thank-you.astro`.

提交成功后，用户会被重定向到 `/thank-you`。可在 `src/pages/thank-you.astro` 自定义该页面。

---

### Quick Reference

| Task | File | Key/Property |
|------|------|-------------|
| Change field labels | `src/contactForm.ts` | `fields.*.label` |
| Change error messages | `src/contactForm.ts` | `fields.*.emptyMsg`, `fields.email.invalidMsg` |
| Change placeholder | `src/contactForm.ts` | `fields.message.placeholder` |
| Add radio option | `src/contactForm.ts` | `dynamicSections.identity.options` |
| Add checkbox option | `src/contactForm.ts` | `dynamicSections.collaboration.options` |
| Hide identity section | `src/contactForm.ts` | `dynamicSections.identity.enable: false` |
| Hide collaboration section | `src/contactForm.ts` | `dynamicSections.collaboration.enable: false` |
| Change recipient | `src/config.yaml` | `contact.receiveEmail` |
| Change sender | `src/config.yaml` | `contact.resendFromEmail` |
| Set API key (prod) | Vercel Dashboard | `RESEND_API_KEY` env var |
| Set API key (local) | `src/config.yaml` | `contact.resendApiKey` |
| Add new label mapping | `src/pages/api/send-email.ts` | `IDENTITY_LABELS`, `TOPIC_LABELS` |

| 任务 | 文件 | 键/属性 |
|------|------|--------|
| 修改字段标签 | `src/contactForm.ts` | `fields.*.label` |
| 修改错误提示 | `src/contactForm.ts` | `fields.*.emptyMsg`, `fields.email.invalidMsg` |
| 修改占位符 | `src/contactForm.ts` | `fields.message.placeholder` |
| 添加单选项 | `src/contactForm.ts` | `dynamicSections.identity.options` |
| 添加复选项 | `src/contactForm.ts` | `dynamicSections.collaboration.options` |
| 隐藏身份区域 | `src/contactForm.ts` | `dynamicSections.identity.enable: false` |
| 隐藏协作区域 | `src/contactForm.ts` | `dynamicSections.collaboration.enable: false` |
| 修改收件邮箱 | `src/config.yaml` | `contact.receiveEmail` |
| 修改发件邮箱 | `src/config.yaml` | `contact.resendFromEmail` |
| 设置 API key（生产） | Vercel 控制台 | `RESEND_API_KEY` 环境变量 |
| 设置 API key（本地） | `src/config.yaml` | `contact.resendApiKey` |
| 添加新标签映射 | `src/pages/api/send-email.ts` | `IDENTITY_LABELS`, `TOPIC_LABELS` |

---

### AI-Assisted Setup

You can describe changes in plain language and let AI edit the files for you:

你可以用自然语言描述变更，让 AI 帮你编辑文件：

> "Translate all contact form labels to Chinese"

> "Hide the identity radio section and add a 'Pricing' checkbox option"

> "Change receiveEmail to 'hello@mydomain.com' and set resendFromEmail to match"

> "Help me set up Resend on Vercel — walk me through the steps"

---

### Conclusion

The Palo contact form balances **simplicity** (no code required for basic changes) with **flexibility** (full control over options and delivery). Remember:

Palo 联系表单在**简洁性**（基本修改无需代码）和**灵活性**（完全控制选项和投递）之间取得了平衡。请记住：

- **`contactForm.ts`** controls what users see — labels, options, sections
- **`config.yaml`** controls where emails go — recipient, sender, local API key
- **Vercel Environment Variables** keep production credentials secure
- **Resend** handles delivery with a generous free tier (1 domain, 100 emails/day)

- **`contactForm.ts`** 控制用户看到的内容——标签、选项、区域
- **`config.yaml`** 控制邮件投递目标——收件人、发件人、本地 API key
- **Vercel 环境变量** 保护生产环境凭证安全
- **Resend** 负责邮件投递，免费版提供 1 个域名、每天 100 封邮件

Happy emailing! 📧