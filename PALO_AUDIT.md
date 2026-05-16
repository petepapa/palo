# PALO 全景扫描报告 — v5.1.0

> 生成日期：2026-05-15 | 框架：Astro 6.x | 构建模式：SSG

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

### Zod 构建时校验门（v5.1.0+）

在 `js-yaml.load()` 之后、配置消费之前，插入 Zod schema 校验：

```
src/config.yaml
    │
    ├── fs.readFileSync() ──► yaml.load() ──► raw config object
    │                                              │
    │                          ┌───────────────────┘
    │                          ▼
    │               validateConfig(rawConfig)  ← src/utils/validateConfig.ts
    │                    │            │
    │              ✅ pass          ❌ fail
    │              silent           throw Error(msg)
    │                    │            │
    │                    ▼            ▼
    │              继续构建      构建终止，打印字段路径 + 期望格式
    │
    └── 消费方：astro.config.mjs / DefaultLayout.astro / 组件
```

**校验覆盖范围：**

| 类别 | 示例 | 校验规则 |
|------|------|----------|
| CSS 长度值 | `'0.1rem'`, `'16px'`, `'-0.05em'` | 正则 `/^-?\d*\.?\d+(px\|rem\|em\|%\|vw\|…)?$/`，允许空字符串 `''` 表示继承 |
| 布尔值 | `trailingSlash`, `showLauncher` | `z.boolean()` — 拒绝字符串 `'true'`、数字 `1` |
| 枚举 | `activeStyle`, `desktopMenuAlignment` | `z.enum(['wavy','underline','bold'])` / `z.enum(['left','center','right'])` |
| 数值范围 | `headerBackgroundOpacity`, 字重 | `z.number().min(0).max(1)` / `.min(100).max(900)` |
| 必填字符串 | `site.name`, `metadata.title` 等 | `z.string().min(1)` |

**错误信息格式示例：**
```
❌ config.yaml validation failed with 3 errors:

  • site.trailingSlash: Expected boolean, received string
  • navigation.activeStyle: Invalid enum value. Expected 'wavy' | 'underline' | 'bold', received 'boldd'
  • border.globalWidth: Expected a CSS length like "0.1rem" / "16px" / "-0.05em", or "" to inherit

  Fix the errors above in src/config.yaml and rebuild.
```

**架构决策：**
- Zod schema 反映 `config.yaml` 实际结构（非 `src/types/config.ts` 的 TypeScript 接口），两者独立演进
- 使用 `.strip()` 忽略未知字段，避免阻塞未来配置扩展
- `validateConfig()` 返回 `void`（非 `PaloConfig`），仅做副作用校验；保持现有消费代码零修改
- 校验文件路径：`src/utils/validateConfig.ts`，在 `astro.config.mjs` 中 `yaml.load()` 后立即调用

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
  globalSize: '0.75rem'              = calc(0.075rem + 0.875em + 0.375rem + 0.05em)
                                      = 中心点精确对齐
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
@layer reset, tokens, base, components, overrides, utilities, scoped;
```

**层顺序（优先级由低到高）：**

| 层名 | 优先级 | 来源 |
|------|--------|------|
| `reset` | 最低 | SCSS: `_reset.scss` |
| `tokens` | ↓ | SCSS: `_root.scss` + DefaultLayout.astro: `:root { CSS vars }` |
| `base` | ↓ | SCSS: `_font.scss`, `_list.scss`, `_general.scss`, `_kbd.scss` + DefaultLayout.astro: `@font-face` |
| `components` | ↓ | 所有 Astro 组件的 scoped CSS |
| `overrides` | ↓ | Logo 链接去下划线等 |
| `utilities` | ↓ | SCSS: `_utility.scss` + Tailwind v4 utilities |
| `scoped` | ↓ | 极少数需要压倒所有其他层的组件样式 |
| **unlayered** | **最高** | `_button.scss`, `_form.scss`, `_overrides.scss`（依赖 `!important` 覆盖第三方组件库） |

**样式来源映射：**

| 来源 | 文件 | 层归属 |
|------|------|--------|
| A: SCSS 文件 | `src/assets/scss/base/*.scss` | 各层内部 `@layer { }` |
| A: SCSS 文件 | `src/assets/scss/components/*.scss` | `_button.scss`, `_form.scss`, `_overrides.scss` 为 **unlayered**；其他各层内部 `@layer { }` |
| B: Astro scoped CSS | 所有 `.astro` 组件的 `<style>` 块 | `@layer components { }` |
| C: is:global 注入 | `DefaultLayout.astro` | `@layer tokens { }` (CSS vars) + `@layer base { }` (@font-face) |
| D: Tailwind utilities | `src/styles/tailwind.css` | Tailwind v4 内部层 → `@layer utilities` |

**关键约束：**
- `src/styles/tailwind.css` 顶部声明全局层顺序，确保浏览器按预期处理优先级
- SCSS 文件内部包裹各自的 `@layer`，避免 `@use` 在层声明之后的问题
- **组件覆盖样式**（`_button.scss`, `_form.scss`, `_overrides.scss`）必须保持为 **unlayered**，原因：
  - `node_modules/accessible-astro-components/` 的样式是 unlayered
  - 根据 CSS `@layer` 规范：**unlayered `!important` > layered `!important`**
  - 放入 `@layer` 后会导致无法覆盖第三方组件库样式
- `_overrides.scss` 职责：Avatar、Badge、Notification、Tabs 组件的 `border-width`、`border-radius` 和布局对齐
- Astro scoped CSS 通过 `<style lang="scss">` 和 `is:global` 指令使用，样式选择器编译后带 `[data-astro-cid-xxx]` 属性选择器

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

#### font-display: swap（覆盖所有字重）

`buildFontFaceCss()` 生成的每条 `@font-face` 声明均包含 `font-display: swap;`：

- **变量字体路径**：当检测到 `variablefont` 文件时，生成单条 `@font-face`，`font-weight: 100 900`，`font-display: swap`
- **静态字体路径**：遍历 `uniqueConfiguredWeights`（body / accent / heading），逐条生成带各自 `font-weight` 的 `@font-face`，每条均带 `font-display: swap`

效果：字体加载期间浏览器先以系统字体渲染文字（FOUT），字体就绪后无缝替换。文字始终可见，彻底消除 FOIT。

#### body 字重 preload

`DefaultLayout.astro` 在 `<head>` 的 favicon 之后、`@font-face` 样式之前，动态输出 `<link rel="preload">`：

```html
<link rel="preload" as="font" type="font/woff2" crossorigin
      href="[拼接路径]" />
```

**拼接逻辑**（构建时 frontmatter 计算）：

1. 若存在变量字体文件 → 以变量字体文件为目标
2. 否则 → 调用 `selectStaticFontFile(font.weights.body)` 定位正文字重文件
3. 通过 `getPublicUrl()` 将文件系统绝对路径转换为 `/public` 下的站点相对路径
4. 仅当目标文件为 `.woff2` 格式时才输出 `<link>`（`type="font/woff2"`）

**只 preload body 字重**，accent 和 heading 字重仅依赖 `font-display: swap` 降级显示，避免首屏并行下载过多字体文件。

**数据来源**：`config.yaml` → `branding.font.path`（字体目录） + `branding.font.weights.body`（body 字重值，如 `400`）


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
    ├── _button.scss        # 按钮覆盖
    └── _form.scss          # 表单覆盖
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

- **已实施 @layer 体系**：通过 CSS `@layer` 控制优先级，覆盖全部四种样式来源
- **层顺序**：`@layer reset, tokens, base, components, overrides, utilities, scoped;`
- **层归属记录**：
  - `reset`: `_reset.scss`
  - `tokens`: `_root.scss` + DefaultLayout.astro CSS vars
  - `base`: `_font.scss`, `_list.scss`, `_general.scss`, `_kbd.scss` + DefaultLayout.astro @font-face
  - `components`: 所有 Astro scoped CSS
  - `overrides`: Logo 链接去下划线等
  - `utilities`: `_utility.scss` + Tailwind v4 utilities
  - `scoped`: 极少数需要最高优先级的组件样式
- **第三方组件库优先级处理**（2026-05-16 修复）：
  - **问题**：`node_modules/accessible-astro-components/` 的样式是 **unlayered**
  - **CSS @layer 规范**：unlayered `!important` > layered `!important`
  - **解决方案**：以下样式必须保持为 **unlayered**（不使用 `@layer` 包裹），因为它们依赖 `!important` 来覆盖第三方组件库的样式：
    - `_button.scss` - 按钮样式覆盖
    - `_form.scss` - 表单样式覆盖
    - `_overrides.scss` - Avatar、Badge、Notification、Tabs 组件样式覆盖
  - **关键约束**：
    - 组件覆盖样式必须放在 `index.scss` 最后加载
    - 使用 `!important` 确保覆盖第三方组件库的默认样式
    - 禁止将这些样式放入任何 `@layer`，否则会失去对 unlayered 样式的覆盖能力
  - **_overrides.scss 职责范围**：
    - Avatar 组件：`border-width`、`border-radius`、`initials/title/subtitle` 垂直对齐
    - Badge 组件：`border-width`、`border-radius`、circular 尺寸、svg 对齐
    - Notification 组件：`border-width`、`border-radius`、padding 计算
    - Tabs 组件：`border-width`

### 原则三：路由闭环 (Route Closure)

所有内部链接必须通过 `ensureTrailingSlash()` 处理。规则：

- 静态资源路径（含文件扩展名）：原样保留
- 内部页面路径：根据 `config.yaml → site.trailingSlash` 统一格式化
- Canonical URL：由 `getCanonical()` 生成
- 面包屑、分页、动态路由参数拼接均绕经 `createPath()` / `normalizePath()`

### 原则四：无运行时样式计算 (Build-Time CSS)

所有 CSS 值在构建时完成计算（`resolveCssLength()`、`buildScaleStep()`），通过 HTML `<style is:global>` 注入 `:root` 变量。运行时零 JS 参与样式值的计算。唯一的运行时样式 JS 是状态切换（如 `data-floating-active`），不计算具体 CSS 值。
