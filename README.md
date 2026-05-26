# Palo

**The Astro theme that thinks like an artist. / 为艺术家思考的 Astro 主题。**

A minimalist, design-forward, and fully accessible portfolio framework for artists, musicians, and designers who demand total control over their digital aesthetic.

一款极简、设计优先且完全无障碍的作品集框架，专为拒绝妥协、追求极致视觉掌控力的艺术家、音乐人和设计师量身打造。

→ [Live Demo / 演示站](https://palo.petepa.com) · [Read the Docs / 阅读文档](#) · [Star on GitHub / 关注项目](#)

---

## 01. Brand Philosophy / 品牌理念

> **Your work deserves a canvas, not a template.**
> 
> **你的作品值得一块画布，而不是一个模版。**

* **EN:** Most website templates are built for businesses. Palo is built for people who make things. It is not a business theme with a creative skin. It's a portfolio-first, design-forward Astro framework built from the ground up for illustrators, musicians, designers, and authors who refuse to look like everyone else.
* **ZH:** 大多数网站模版是为企业设计的。Palo 是为创作者设计的。Palo 不是披着创意外衣的商业主题，它是一个以作品集为核心、设计优先的 Astro 框架，从零开始专为拒绝千篇一律的插画师、音乐人、设计师和作家打造。

---

## 02. Why Palo? / 为什么选择 Palo？

* 🎨 **Design-First Config / 设计优先配置**
  * **EN:** Control colors, fonts, radius, and borders from a single file. Your entire visual identity lives in one place. No scattered CSS variables, no theme overrides.
  * **ZH:** 通过一个配置文件掌控全站的色彩、字体、圆角和描边。你的整个视觉识别系统都在这里，彻底告别零散的 CSS 变量与繁琐的主题覆写。
* 🖼 **Multi-Format Portfolio Layouts / 多格式作品集布局**
  * **EN:** Showcase paintings in 8:5, albums in 1:1, posters in 5:7, short films in 9:16, or cinema in 16:9. Palo understands that different mediums require different frames.
  * **ZH:** 以 8:5 展示绘画，以 1:1 展示专辑，以 5:7 展示海报，以 9:16 展示短视频，或以 16:9 展示影片。Palo 懂得，不同的作品媒介需要不同的框架。
* 🎬 **Flexible Hero & Headers / 极具弹性的视觉区块**
  * **EN:** Add background images or videos, define text and background colors per section, and stretch any visual block edge-to-edge with a single prop. Your landing moment, your rules.
  * **ZH:** 轻松添加背景图片或视频，逐个区块定义前景色与背景色，通过单一参数让 Hero 铺满屏幕。你的主视觉，规则由你定。
* 🌙 **Native Dark Mode / 底层烘焙的深色模式**
  * **EN:** A refined dark mode that isn't an afterthought. It is baked into the design system from the ground up, respecting your exact brand palette in both light and dark states.
  * **ZH:** 精打细磨的深色模式并非事后堆砌。它从最底层融入设计系统，在亮色与暗色模式下，都能忠实呈现你配置的品牌质感。
* 📖 **Reading-Focused Blog / 专为阅读而生的博客**
  * **EN:** Generous spacing, considered typography, and clean contrast hierarchy. Not just a database dump, but a clean editorial home where people actually want to read.
  * **ZH:** 充裕的呼吸感间距、考究的排版和清晰的层级关系。它不只是存放内容的数据库，而是一块真正能唤起阅读欲望的纸质级排版空间。
* ♿ **Zero-Compromise Accessibility / 零妥协的无障碍体验**
  * **EN:** Built to comply with strict EAA (European Accessibility Act) and WCAG 2.2 AA standards. Smooth micro-interactions that automatically respect `prefers-reduced-motion`.
  * **ZH:** 严密遵循 EAA（欧洲无障碍法案）和 WCAG 2.2 AA 标准构建。细腻的微交互会自动感知并适配用户的“减弱动态效果”系统偏好。

---

## 03. Architecture & Tech Specs / 技术架构规范

### 1. Build-Time Configuration & Zod Gate / 构建时校验门
Palo 的设计系统完全由 [`src/config.yaml`](file:///Users/petelee/工作/palo/src/config.yaml) 驱动。为了保障样式的健壮性，系统在构建时引入了校验管道：
```
config.yaml  ──►  js-yaml.load()  ──►  Zod Validation (validateConfig.ts)
                                                │
                                       ┌────────┴────────┐
                                       ▼                 ▼
                                   [✅ Pass]         [❌ Fail]
                              Inject to CSS :root   Throw build error
```
* **EN:** An invalid font weight or an incorrect CSS length (e.g., misspelling a unit) will trigger a compile-time error immediately, preventing broken styles on production.
* **ZH:** 任何不合法的字重或错误的 CSS 长度单位 (例如写错单位名称) 都会在编译时被拦截并抛出错误，防止损坏的样式被部署上线。
* **Fast HMR Watcher / 毫秒级热更新**: During development (`npm run dev`), Palo utilizes a Vite watcher. Valid configuration edits update the browser instantly via Hot Module Replacement (HMR) without restarting the server. Invalid configurations display a graceful error overlay.

### 2. Specificity Governance (CSS Cascade Layers) / 样式优先级治理
Palo implements native CSS `@layer` inside [`src/styles/tailwind.css`](file:///Users/petelee/工作/palo/src/styles/tailwind.css) to eliminate style override battles:
```css
@layer reset, tokens, base, components, overrides, utilities, scoped;
```
* **EN:** Standard styles reside inside lower specificity layers (`reset` to `components`). External third-party library adjustments sit in `overrides`. Custom configurations and complex form/button styles are marked as `unlayered` (highest priority) to guarantee your config values are absolutely respected.
* **ZH:** 常用样式分布在低优先级的级联层中 (`reset` 到 `components`)。第三方库冲突纠正集中在 `overrides` 中。而你所定制的核心按钮 ([`_button.scss`](file:///Users/petelee/工作/palo/src/assets/scss/components/_button.scss)) 与表单样式 ([`_form.scss`](file:///Users/petelee/工作/palo/src/assets/scss/components/_form.scss)) 处于 unlayered 层，享有最高特权，确保配置文件中的参数绝对生效。

### 3. Build-Time Fluid Typography / 构建时流体字号
* **EN:** Fluid font sizes (`--font-size-0` to `--font-size-8`) are calculated at build-time using `mobileHeadingScale` and `desktopHeadingScale` ratios. Spacing and titles dynamically and smoothly scale using pure CSS `clamp()` based on viewport width, requiring **zero client-side JS**.
* **ZH:** 系统在构建阶段根据 `mobileHeadingScale` (小屏标题缩放比) 与 `desktopHeadingScale` (大屏标题缩放比) 自动输出全套流体字号阶梯。完全依靠纯 CSS 的 `clamp()` 算法在不同视口宽度下平滑缩放，**不需要任何客户端 JS 计算**。

---

## 04. Configuration Dictionary / 配置文件映射字典

Your site's core visual DNA is determined by [`src/config.yaml`](file:///Users/petelee/工作/palo/src/config.yaml):

| Domain / 领域 | Config Key / 配置项 | Visual Mapping / 视觉映射 |
| :--- | :--- | :--- |
| **Site / 站点** | `site.showLauncher` | Toggles the keyboard palette (`Cmd+K` / `Ctrl+K`) / 键盘命令面板开关 |
| **Colors / 颜色** | `branding.colors.primary` | Primary brand highlight accent / 主品牌色前景色与交互高亮 |
| | `branding.colors.outline` | High-contrast accessibility focus ring / 焦点高反差焦点轮廓圈 |
| **Typography / 排版** | `branding.font.name` | Custom typeface preloaded automatically / 自动预加载并应用的自定义字体族 |
| | `typography.lineHeightScale` | Generous multiplier for body reading flow / 正文与段落的行高缩放比例 |
| | `typography.uppercaseDisplayText` | Forces heading levels to uppercase/小写大写转换 / 所有标题与UI文本的大写转换 |
| **Borders / 描边** | `border.globalWidth` | Global baseline fallback stroke / 全站默认描边的基本粗细 |
| | `border.cardWidth` | Override card frame borders / Card卡片的独立描边粗细 |
| **Radius / 圆角** | `radius.globalSize` | Universal rounding variable / 全站默认的圆角基础比例 |
| | `radius.buttonSize` | Customize active interactive buttons / 按钮与按钮链接的圆角尺寸 |
| **Navigation / 导航** | `navigation.fixedHeader` | Pin menu during scroll / 顶栏滚动粘性固定开关 |
| | `navigation.headerBackgroundBlur`| Glassmorphism blur filter intensity / 毛玻璃背景模糊像素强度 |
| | `navigation.activeStyle` | Nav underline effects: `wavy` \| `underline` \| `bold` / 导航激活效果选择 |

---

## 05. Project Directory Map / 项目目录地图

Navigate through Palo's codebase with ease:

```bash
src/
├── config.yaml          # 🌟 Single Source of Truth / 唯一的视觉设计源头
├── content.config.ts    # 📦 Schema definitions for projects and blog collections / 集合 Schema 定义
├── assets/scss/         # 🎨 Cascade-layered styling / 级联层级样式
│   ├── index.scss       # Main SCSS entry / 样式主入口
│   ├── base/            # Design tokens & variables / 全局基础级联层配置
│   │   ├── _root.scss   # OKLCH palettes and margins / OKLCH 调色板与间距定义
│   │   ├── _font.scss   # Preloaded font declarations / 字体规则定义
│   │   └── _general.scss# Radius/Border overrides / 覆盖通用组件样式
│   └── components/      # Unlayered style overwrites / 高特权组件覆盖样式 (Form, Button)
├── components/          # 🧩 Modular page blocks / 积木式无障碍 UI 组件
│   ├── Navigation.astro # Responsive drop-down navigation / 响应式无障碍下拉导航
│   ├── ColorContrast.astro # WCAG compliance checking panel / WCAG 色彩实时检测面板
│   └── LauncherTrigger.astro # Command palette trigger button / 命令面板启动器
├── layouts/             # 📐 Page shell architectures / 基础页面骨架布局
│   ├── DefaultLayout.astro   # Primary wrapper (SEO, view transitions, scripts) / 全站主骨架布局
│   └── MarkdownLayout.astro  # Beautiful shell for articles / 文章排版专用布局
└── pages/               # 📄 Application routing / 应用路由页面
    ├── index.astro           # Homepage with brand sections / 首页
    ├── contact.astro         # Compliant forms with client validation / 无障碍联系表单页
    ├── color-contrast-checker.astro # Visual accessibility debug panel / 对比度实用检测页
    └── accessible-components.astro  # Live playground for all components / 全组件无障碍预览页
```

---

## 06. Development & Deployment / 开发与部署

### Development Setup / 本地开发
Ensure you have Node.js (version 22.12.0 or higher) installed on your system.

```bash
# 1. Install dependencies / 安装依赖包
npm install

# 2. Launch the developer console / 启动开发热重载服务器
npm run dev
# Starts at http://localhost:4321
```

### Build & Deploy / 构建与部署
Palo is an ultra-fast static website (SSG). You can host it on Netlify, Vercel, Cloudflare Pages, GitHub Pages, or any static hosting service.

```bash
# 1. Output production static files / 构建生产静态包
npm run build
# Output goes directly to `./dist/`

# 2. Preview the built package locally / 在本地预览生产构建包
npm run preview
```

---

## 07. Key Vocabulary / 核心词汇表

To maintain consistent branding and communication, Palo uses the following terminology:

| English | 中文 | Context / 场景 |
| :--- | :--- | :--- |
| **Creative** | **创作者** | The protagonist of the Palo platform / Palo平台服务的目标群体泛称 |
| **Portfolio** | **作品集** | The primary frame of showcase / 作品展示的核心容器 |
| **Canvas** | **画布** | Palo's visual philosophy: non-intrusive / 品牌美学隐喻：低打扰度、忠于作品 |
| **Config-driven** | **配置驱动** | Palo's engineering paradigm / 全自动化、一站式的构建时参数驱动机制 |
| **Design-forward** | **设计优先** | Aesthetic standards: zero compromises / 设计导向的产品定位 |
| **Digital home** | **数字家园** | Portfolio landing spaces / 对创作者个人网站的情感主张与精神寄托 |

---

*Made for makers. Built with Astro. / 为创作者而做，基于 Astro 构建。*

*Remember: Accessibility is not a feature — it is a fundamental human right. Thank you for building a more inclusive web!* ✨
