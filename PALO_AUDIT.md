# PALO 全景扫描报告 — v5.2.0

> 生成日期：2026-05-17 | 框架：Astro 6.x | 构建模式：SSG

---

## 一、数据流向拓扑

`config.yaml` 是唯一的数据源头。所有参数通过两条路径渗透到 UI：

```
config.yaml
    │
    ├── 构建时 JS 读取 (Astro frontmatter)
    │   ├── resolveCssLength()   → 标准化 CSS 单位
    │   ├── buildScaleStep()     → 流体字号阶梯
    │   └── buildFontFaceCss()   → 搜索字体文件
    │
    └── HTML <style> 注入 → :root { ... }
        ├── Tailwind @theme 映射
        ├── 组件 scoped CSS 消费
        └── SCSS / @layer 消费
```

---

### Zod 构建时校验门（v5.1.0+）

在 `js-yaml.load()` 之后、配置消费之前，插入 Zod schema 校验：

```
config.yaml  →  js-yaml.load()  →  validateConfig()  →  Astro / Vite
                    │                      │
                    │              ┌───────┴────────┐
                    │              │ ✅ pass → silent │
                    │              │ ❌ fail → throw  │
                    │              └────────────────┘
                    │
           No validation = silent CSS corruption
```

**实现位置：**

1. **`src/utils/validateConfig.ts`** — 完整的 Zod schemas 和验证逻辑
2. **`astro.config.mjs:21`** — 在配置加载后立即调用验证

**关键代码（`validateConfig.ts`）：

```ts
import { z } from 'zod'

// 自定义 CSS length 正则验证
const CSS_LENGTH_RE = /^(?:$|-?\d*\.?\d+(?:px|rem|em|%|vh|vw|vmin|vmax|ch|ex|cm|mm|in|pt|pc|s|ms)?)$/

function cssLength(fieldLabel: string) {
  return z.string().regex(CSS_LENGTH_RE, `${fieldLabel}: Expected a CSS length like "0.1rem" / "16px" / "-0.05em", or "" to inherit`)
}

// 完整的配置 schema
export const paloConfigSchema = z.object({
  site: siteConfigSchema,
  metadata: metadataConfigSchema,
  branding: brandingConfigSchema,
  layout: layoutConfigSchema,
  typography: typographyConfigSchema,
  navigation: navigationConfigSchema.optional(),
  border: borderConfigSchema.optional(),
  radius: radiusConfigSchema.optional(),
}).strip()

export function validateConfig(config: unknown): void {
  const result = paloConfigSchema.safeParse(config)
  if (!result.success) {
    // 输出详细的错误信息
    const issues = result.error.issues
    const lines = [`❌ config.yaml validation failed with ${issues.length} error(s):`]
    for (const issue of issues) {
      const path = issue.path.length > 0 ? issue.path.join('.') : '(root)'
      lines.push(`  • ${path}: ${issue.message}`)
    }
    throw new Error(lines.join('\n'))
  }
}
```

**astro.config.mjs 中的集成：

```js
import { validateConfig } from './src/utils/validateConfig.ts'

const rawYaml = fs.readFileSync(configPath, 'utf-8')
const yamlConfig = yaml.load(rawYaml)
validateConfig(yamlConfig) // 构建时校验！
```

**验证范围：

| 类型 | 示例 |
|------|------|
| CSS length | `"0.1rem"` / `"16px"` / `"-0.05em"` / `""` |
| Font weights | 整数 100-900 |
| Numbers (scale) | 0.1-5.0 范围 |
| Booleans | `true` / `false` |
| Enums | `'left'` / `'center'` / `'right'` |

---

### 关键计算链路

**border + radius：**

```
config.yaml                      DefaultLayout.astro
─────────────────────────────────────────────────
border:                           resolveCssLength(config.border.globalWidth, '3px')
  globalWidth: '0.1rem'  ───────►   ──► --border-width-global: 0.1rem
  formWidth: '0.075rem' ────────►   ──► --border-width-form: 0.075rem
                                       ──► border: var(--border-width-form, ...) solid ...

radius:                           resolveCssLength(config.radius.globalSize, '0.5rem')
  globalSize: '0.75rem' ────────►   ──► --radius-global: 0.75rem
  formSize: ''                  ►   ──► --radius-s: calc(0.75rem * 0.5)
                                       ──► --form-control-radius: var(--radius-form, ...)
```

**input 浮动 label 居中：**

```
config.yaml                       _form.scss (CSS var chain)
────────────────────────────────────────────────────────
font:                             --font-cap-height-offset: -0.05em
  capHeightOffset: '-0.05em'      --border-width-form: 0.075rem
border:                           --form-control-radius: 0.75rem
  formWidth: '0.075rem'           ──► --floating-label-rest-top:
radius:                                calc(border + 0.875em + radius/2 - capHeightOffset)
  globalSize: '0.75rem'              = 中心点精确对齐
```

**居中 padding：**

```
总高 H = 2.75em + border×2 + radius
内容区 Hc = H - border×2 = 2.75em + radius
文字高 = 1em (line-height=1)
上下居中 → padding-block = (Hc - 1em) / 2 = 0.875em + radius/2
```

radius 在 config 调整时，H 重新计算，padding 自动重新匹配。

---

## 二、路由与部署协议

### astro.config.mjs 闭环

```js
import { defineConfig, envField } from 'astro/config'
import yaml from 'js-yaml'
import compress from 'astro-compress'
import icon from 'astro-icon'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import { enhanceConfigForWorkspace } from './scripts/workspace-config.js'

const yamlConfig = yaml.load(fs.readFileSync('src/config.yaml', 'utf-8'))
const siteUrl = String(yamlConfig.metadata?.siteUrl ?? '').trim()

export default defineConfig({
  site: siteUrl || undefined,
  trailingSlash: yamlConfig.site.trailingSlash ? 'always' : 'never',
  build: { format: 'directory' },
  integrations: [compress(), icon(), mdx(), siteUrl && sitemap()].filter(Boolean),
  vite: enhanceConfigForWorkspace({
    define: {
      __PALO_TRAILING_SLASH__: JSON.stringify(Boolean(yamlConfig.site.trailingSlash)),
    },
    resolve: {
      alias: {
        '@config': './src/config.yaml',
        '@components': './src/components',
        '@layouts': './src/layouts',
        '@utils': './src/utils',
        // ... 其余别名
      },
    },
  }),
})
```

### trailingSlash 穿透链路

```
config.yaml → astro.config.mjs → __PALO_TRAILING_SLASH__ (Vite define)
                                        │
                                        ▼
                              src/utils/trailingSlash.ts
                              normalizePath() / ensureTrailingSlash()
                                        │
                                        ▼
                              PageHeader.astro (面包屑 href)
                              Blog/Portfolio 动态路由
                              DefaultLayout.astro (canonical URL)
```

核心工具函数（`src/utils/trailingSlash.ts`）：

- `normalizePath(path)` — 根据 `__PALO_TRAILING_SLASH__` 统一格式化
- `ensureTrailingSlash(href)` — 保留 query/hash，跳过静态文件
- `createPath(...segments)` — 分段拼接，自动格式化
- `getCanonical(path, site)` — 生成绝对 canonical URL

### 部署

无 `vercel.json`。`astro build` 输出 `dist/`，支持任意静态托管。

### dev 增强

**主方案：Vite HMR 插件** `scripts/vite-plugin-palo-config.ts`
- 在 `astro dev` 时启用（`apply: 'serve'`），`astro build` 时自动跳过
- 通过 Vite 的 `server.watcher` 监听 `src/config.yaml`
- 文件变化时调用 `validateConfig()` 进行 Zod 校验
- 校验通过 → `server.ws.send({ type: 'full-reload' })` 触发浏览器全量刷新
- 校验失败 → `server.ws.send({ type: 'error' })` 显示错误遮罩，不刷新页面
- 相比旧方案（进程重启），反馈延迟从数秒降至毫秒级

**备用方案：** `scripts/dev-legacy-watch.mjs`（`npm run dev:legacy`）
- 使用 `fs.watch` 监听 + `SIGTERM` → `spawn` 全量重启 dev server
- 保留供调试或环境兼容性使用

---

## 三、样式架构扫描

### 加载顺序（index.scss）

```scss
@use 'base/reset';         // 1. 重置
@use 'base/root';          // 2. CSS 自定义属性 (OKLCH 色板、间距)
@use 'base/font';          // 3. 字体声明
@use 'base/list';          // 4. 列表
@use 'base/breakpoint';    // 5. 响应式断点
@use 'base/general';       // 6. 全局覆盖 (border/radius/toggle/badge/modal/launcher)
@use 'base/kbd';           // 7. 键盘样式
@use 'base/mixins';        // 8. SCSS 工具
@use 'base/utility';       // 9. 工具类
@use 'components/button';  // 10. 按钮覆盖
@use 'components/form';    // 11. 表单覆盖 (浮动label、输入居中、fieldset)
```

### @layer 分布

已实施 CSS `@layer` 体系，覆盖全部四种样式来源：

```css
/* src/styles/tailwind.css */
@layer reset, tokens, base, components, overrides, utilities, scoped;
```

| Layer | 用途 | 文件位置 |
|-------|------|----------|
| `reset` | 基础样式重置 | `src/assets/scss/base/_reset.scss` |
| `tokens` | CSS 自定义属性（颜色、间距、字体等） | `DefaultLayout.astro` / `src/assets/scss/base/_root.scss` |
| `base` | 全局基础样式 | `_font.scss` / `_list.scss` / `_general.scss` / `_kbd.scss` |
| `components` | 组件样式 | `.astro` 组件中的样式块 / `_button.scss` / `_form.scss` |
| `overrides` | 第三方库样式覆盖（高优先级） | `_font.scss` / `Header.astro` / `Navigation.astro` / `Logo.astro` |
| `utilities` | 工具类 | `src/assets/scss/base/_utility.scss` / `tailwind.css` |
| `scoped` | 页面局部样式（最优先级） | 页面 `.astro` 中未标记层的样式块 |

**优先级顺序（从低到高）：**
`reset` → `tokens` → `base` → `components` → `overrides` → `utilities` → `scoped`

**unlayered 例外（最高优先级）：**
| **unlayered** | **最高** | `_button.scss`, `_form.scss`（覆盖第三方组件库）|

**关键约束：**
- `_button.scss`、`_form.scss` 必须保持 unlayered
- Avatar / Badge / Notification / Tabs 组件覆盖样式位于 `_general.scss` 的 `@layer base` 块内，配合 `!important` 实现对第三方库的覆盖，功能等效于 unlayered

### Tailwind @theme 映射（src/styles/tailwind.css）

```css
@import 'tailwindcss' source(none);
@source '../../src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}';
@custom-variant dark (&:where(.darkmode, .darkmode *));

@theme {
  --color-primary: var(--brand-primary);
  --color-secondary: var(--brand-secondary);
  --font-family-body: var(--font-body);
  --font-family-heading: var(--font-heading);
  --font-size--2: var(--font-size--2);
  /* ... --font-size-* fluid clamp chain ... */
}
```

### 样式注入位置

`DefaultLayout.astro` 在 `<head>` 注入 `is:global` `<style>`：

```html
<style is:global>
  ${themeVariablesCss}     <!-- :root { --brand-primary, --font-family, ... } -->
  ${fontScaleVars}         <!-- --font-size-* (clamp 公式) -->
  ${fontFaceCss}           <!-- @font-face 声明 -->
</style>
```

### 字体加载策略

`DefaultLayout.astro` 中的 `buildFontFaceCss()` 实现了完整的字体加载策略：

| 特性 | 实现 |
|------|------|
| `font-display: swap` | 所有 `@font-face` 声明使用 `swap`，优先使用系统字体，自定义字体加载后自动切换 |
| 可变字体优先 | 优先检测 `public/fonts/` 中的可变字体（如 `VariableFont.ttf`），支持字重范围 `100 900` |
| 静态字体回退 | 如果没有可变字体，回退到静态字体，为每个字重（`body`、`accent`、`heading`）生成单独的 `@font-face` |
| 字体预加载 | 预加载 `body` 字重的 woff2 字体到 `<link rel="preload">`，减少 CLS |

**关键代码**：

```astro
// buildFontFaceCss() 自动选择可变字体或静态字体
@font-face {
  font-family: "Atkinson Hyperlegible";
  src: url("/fonts/AtkinsonHyperlegible-VariableFont.ttf") format("truetype");
  font-style: normal;
  font-weight: 100 900;
  font-display: swap;
}

// 预加载标签
<link rel="preload" as="font" type="font/woff2" crossorigin href="/fonts/AtkinsonHyperlegible-Bold.woff2" />
```

---

## 四、功能组件范式

### Navigation.astro — config → 渲染

```astro
---
import themeConfig from '@config'

const navMinHeight = themeConfig.navigation?.minHeight ?? ''
const navAlignment = themeConfig.navigation?.desktopMenuAlignment ?? 'center'
---
<div id="main-navigation"
     style={navMinHeight ? `--nav-min-height: ${navMinHeight}` : ''}>
  <div class="container">
    <div class="nav-bar"><Logo /><NavigationItems /><ResponsiveToggle /></div>
    <nav class="mobile-menu"><NavigationItems /></nav>
  </div>
</div>

<style is:global>
  #main-navigation {
    display: flex; flex-direction: column;
    min-height: var(--nav-min-height, auto);
  }
  #main-navigation > .container {
    margin-block: auto;         // 仅剩余空间时居中
  }
  .nav-bar {
    min-block-size: var(--nav-min-height, auto);
  }
  .mobile-menu {
    height: 0; opacity: 0; overflow: hidden;
    will-change: height, opacity;
    transition: height var(--mobile-menu-duration) var(--mobile-menu-easing),
                opacity var(--mobile-menu-fade-duration) ease-out;
  }
</style>
```

**模式**：`minHeight` 为空 → CSS var 不注入 → `min-height: auto` → 内容自适应；有值 → `style="--nav-min-height:5rem"` → min-height 生效。

### PageHeader.astro — 纯视觉组件

```astro
---
interface Props {
  title: string
  bgType?: 'primary' | 'secondary' | 'neutral' | 'gradient' | 'bordered'
  featuredImage?: string
  showBreadcrumbs?: boolean
}
---

<section class:list={['page-header', className]}>
  <!-- 面包屑: URL path → formatSegment() + ensureTrailingSlash() -->
  <div class:list={['py-16', bgType && `bg-${bgType}`]}>
    <Heading level="h1">{title}</Heading>
    {sanitizedSubtitle && <p set:html={sanitizedSubtitle} />}
  </div>
</section>

<style>
  .bg-primary   { background-color: light-dark(var(--color-primary-100), var(--color-primary-500)); }
  .bg-bordered  { border: var(--border-width-divider) solid var(--border-color-subtle); border-inline: 0; }
  .bg-gradient  { background-image: linear-gradient(315deg, ...); }
</style>
```

### 表单 floating label — config → CSS var → 组件

```
config.yaml → DefaultLayout.astro → :root {
                  --font-cap-height-offset: -0.05em;
                  --border-width-form: 0.075rem;
                  --radius-form: 0.75rem;
              }
                │
                ▼
_form.scss:   --floating-label-rest-top: calc(border + 0.875em + radius/2 - capHeightOffset)
              --floating-label-padding-block: calc(0.875em + radius/2)
                │
                ▼
.input-group label       → inset-block-start: var(--floating-label-rest-top)
.input-group input       → padding-block: var(--floating-label-padding-block)
:focus-within label      → inset-block-start: 0; transform: translateY(-50%) scale(0.78)
```

运行时 JS：`paloInitFloatingFormLabels()` 监听 `input`/`change` 事件设置 `data-floating-active`。

### 按钮圆角 — config → CSS var → 组件

_button.scss 已接入配置系统：
```scss
// 修改前
--button-radius: 0.25rem;

// 修改后
--button-radius: var(--radius-button, 0.25rem);
```
不再硬编码，`radius.buttonSize` 参数现在生效。

---

## 五、SCSS 文件清单

```
src/assets/scss/
├── index.scss
├── base/
│   ├── _reset.scss         # 重置
│   ├── _root.scss          # OKLCH 色板 + 间距 token
│   ├── _font.scss          # 字体变量
│   ├── _list.scss          # 列表样式
│   ├── _breakpoint.scss    # 响应式断点 mixin
│   ├── _general.scss       # 全局覆盖（border/radius/badge/modal/launcher）
│   ├── _kbd.scss           # 键盘样式
│   ├── _mixins.scss        # SCSS 工具
│   └── _utility.scss       # 工具类
└── components/
    ├── _button.scss        # 按钮覆盖（unlayered，覆盖第三方组件库）
    └── _form.scss          # 表单覆盖（unlayered，覆盖第三方组件库）
```

---

## 六、架构原则（开发铁律）

### 原则一：配置驱动 (Config-Driven Architecture)

一切样式变量必须源自 `config.yaml`。禁止在组件中硬编码设计令牌值（颜色、字体、圆角、描边、间距）。新增参数的标准流程：

1. `config.yaml` — 添加配置项 + 中英双语注释
2. `src/types/config.ts` — 添加 TypeScript 接口字段
3. `DefaultLayout.astro` — 构建时读取 → CSS var 注入
4. 组件 — 只消费 CSS 自定义属性，不直接 import config

### 原则二：优先级治理 (Specificity Governance)

- **已实施 @layer 体系**：覆盖全部四种样式来源（SCSS / Astro scoped / is:global / Tailwind）
- **层顺序**：`@layer reset, tokens, base, components, overrides, utilities, scoped;`
- **unlayered 例外**：`_button.scss`、`_form.scss` 保持 unlayered；Avatar / Badge / Notification / Tabs 覆盖写在 `_general.scss` 的 `@layer base` 块内，配合 `!important` 实现等效覆盖能力

**库样式覆盖记录（2026-05-17）**

accessible-astro-components 存在以下已知覆盖行为，
均已通过对应方式修复：

| 组件/属性 | 库的行为 | 修复方式 |
|-----------|----------|----------|
| 标题 font-size | 库覆盖 --font-size-* 自定义属性 | DefaultLayout.astro 注入时加 !important |
| 标题 line-height | Heading.astro 用 font-size 变量作为 line-height | @layer overrides 中覆盖每个标题层级 |
| Card border-width | Card.astro 硬编码 border: 2px solid ... | _general.scss 中加 !important |
| 导航 active 效果 | active 样式被全局 font-size 覆盖 | accessible-components.astro 中加 !important |

### 原则三：路由闭环 (Route Closure)

所有内部链接必须通过 `ensureTrailingSlash()` 处理。规则：

- 静态资源路径（含文件扩展名）：原样保留
- 内部页面路径：根据 `config.yaml → site.trailingSlash` 统一格式化
- Canonical URL：由 `getCanonical()` 生成
- 面包屑、分页、动态路由参数拼接均绕经 `createPath()` / `normalizePath()`

### 原则四：无运行时样式计算 (Build-Time CSS)

所有 CSS 值在构建时完成计算（`resolveCssLength()`、`buildScaleStep()`），通过 HTML `<style is:global>` 注入 `:root` 变量。运行时零 JS 参与样式值的计算。唯一的运行时样式 JS 是状态切换（如 `data-floating-active`），不计算具体 CSS 值。

---

## 附录：最新修改记录（2026-05-17）

### 1. 按钮圆角配置接入

**问题**：按钮组件使用硬编码的圆角值，未接入 config.yaml 配置系统

**修改文件**：
- [_button.scss](file:///Users/petelee/工作/palo/src/assets/scss/components/_button.scss)

**修改内容**：
```scss
// 修改前
--button-radius: 0.25rem;

// 修改后
--button-radius: var(--radius-button, 0.25rem);
```

---

### 2. 标题字体大小被库覆盖问题

**问题**：accessible-astro-components 库在页面加载时会覆盖我们的 `--font-size-*` 自定义属性

**修改文件**：
- [DefaultLayout.astro](file:///Users/petelee/工作/palo/src/layouts/DefaultLayout.astro#L502-L512)
- [_font.scss](file:///Users/petelee/工作/palo/src/assets/scss/base/_font.scss)

**修改内容**：

#### DefaultLayout.astro
给所有 `--font-size-*` 变量添加了 `!important` 标记，防止被库覆盖：
```astro
--font-size--2: clamp(...) !important;
--font-size--1: clamp(...) !important;
--font-size-0: clamp(...) !important;
--font-size-1: clamp(...) !important;
--font-size-2: clamp(...) !important;
--font-size-3: clamp(...) !important;
--font-size-4: clamp(...) !important;
--font-size-5: clamp(...) !important;
--font-size-6: clamp(...) !important;
--font-size-7: clamp(...) !important;
--font-size-8: clamp(...) !important;
```

#### _font.scss
添加了 @layer overrides 确保标题样式优先级：
```scss
@layer overrides {
  h1.heading.h1, h1, .heading.h1 {
    font-size: var(--font-size-5) !important;
  }
}
```

---

### 3. 标题行高松紧度参数未生效问题

**问题**：config.yaml 中的 `lineHeightScale` 和 `headingLineHeightScale` 参数没有正确工作，根本原因是 accessible-astro-components 库中的 [Heading.astro](file:///Users/petelee/工作/palo/node_modules/accessible-astro-components/src/components/heading/Heading.astro#L49-L77) 使用了特殊的设计：

```css
:where(.h1) {
  font-size: var(--font-size-6);
  line-height: var(--font-size-7);  /* 用另一个 font-size 变量作为行高！*/
}
```

这导致库的 line-height 完全绕过了 `--heading-line-height-scale` 设置。

**修改文件**：
- [DefaultLayout.astro](file:///Users/petelee/工作/palo/src/layouts/DefaultLayout.astro#L413-L414) - 添加缺失的 `--line-height-scale` 变量
- [DefaultLayout.astro](file:///Users/petelee/工作/palo/src/layouts/DefaultLayout.astro#L514-L526) - 给行高变量添加 `!important`
- [_font.scss](file:///Users/petelee/工作/palo/src/assets/scss/base/_font.scss#L96-L140) - 覆盖库的 line-height 设置

**修改内容**：

#### DefaultLayout.astro
添加了缺失的 `--line-height-scale` 变量定义：
```astro
--line-height-scale: ${typography.lineHeightScale};
--heading-line-height-scale: ${typography.headingLineHeightScale};
```

给所有行高变量添加了 `!important`，并给大标题行高额外乘以 `headingLineHeightScale`：
```astro
--text-5xl--line-height: calc(1 * var(--line-height-scale) * var(--heading-line-height-scale)) !important;
--text-6xl--line-height: calc(1 * var(--line-height-scale) * var(--heading-line-height-scale)) !important;
...
```

#### _font.scss
在 @layer overrides 中为每个标题层级添加了明确的 line-height 覆盖：
```scss
@layer overrides {
  h1.heading.h1, h1, .heading.h1 {
    --heading-line-height: 1.05 !important;
    font-size: var(--font-size-5) !important;
    line-height: calc(var(--heading-line-height, 1.05) * var(--line-height-scale, 1) * var(--heading-line-height-scale, 1)) !important;
  }
  // ... h2 到 h6 类似
}
```

**计算示例**：
- 当 `headingLineHeightScale: 0.85` 时，h1 的行高为：`1.05 × 1.0 × 0.85 = 0.8925`（非常紧凑）

---

### 4. Card 组件描边粗细参数未生效问题

**问题**：config.yaml 中的 `cardWidth` 配置对 card 组件不起作用，原因是 accessible-astro-components 库中的 [Card.astro](file:///Users/petelee/工作/palo/node_modules/accessible-astro-components/src/components/card/Card.astro#L129) 使用了硬编码的 `border: 2px solid ...`，而 [_general.scss](file:///Users/petelee/工作/palo/src/assets/scss/base/_general.scss#L64-L67) 中的覆盖样式没有使用 `!important`。

**修改文件**：
- [_general.scss](file:///Users/petelee/工作/palo/src/assets/scss/base/_general.scss#L64-L67) - 给 border-width 加上 !important

**修改内容**：
```scss
// 修改前
.card {
  border-width: var(--border-width-card, ...);
  border-radius: var(--radius-card, ...) !important;
}

// 修改后
.card {
  border-width: var(--border-width-card, ...) !important;
  border-radius: var(--radius-card, ...) !important;
}
```

---

### 5. 页面导航 active 状态效果不明显

**问题**：页面内容导航的 active 变大效果变得不明显了，原因是我们之前给 font-size 变量加了 `!important`，而 `.active` 样式没有足够的优先级。

**修改文件**：
- [accessible-components.astro](file:///Users/petelee/工作/palo/src/pages/accessible-components.astro#L813-L817) - 给 active 样式加上 !important

**修改内容**：
```scss
// 修改前
.active {
  transform: scale(1.08);
  font-weight: var(--font-weight-heading, 500);
  font-size: 1.25rem;
}

// 修改后
.active {
  transform: scale(1.08) !important;
  font-weight: var(--font-weight-heading, 500) !important;
  font-size: 1.25rem !important;
}
```


