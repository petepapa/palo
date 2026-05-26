# Palo — Accessible & Config-Driven Astro Starter

<img width="1200" height="627" alt="social-preview-image" src="https://github.com/user-attachments/assets/bcd886fb-dd70-4a81-ac73-e138f3ce8d35" />

[![Built with Astro](https://astro.badg.es/v2/built-with-astro/small.svg)](https://astro.build)

**Palo** (based on the flagship **Accessible Astro Starter** ecosystem) is a premium, developer-first, SEO-optimized, and fully accessible Astro starter template. Built with modern web standards, WCAG 2.2 AA guidelines, and European Accessibility Act (EAA) compliance in mind, it provides a solid foundation for creating inclusive websites.

What sets **Palo** apart is its unified **Config-Driven Architecture**, strict **Build-Time CSS Calculations**, and robust **CSS specificity governance** via Cascade Layers (`@layer`).

[![LIVE DEMO](https://img.shields.io/badge/LIVE_DEMO-4ECCA3?style=for-the-badge&logo=astro&logoColor=black)](https://accessible-astro-starter.incluud.dev/) &nbsp;
[![DOCUMENTATION](https://img.shields.io/badge/DOCUMENTATION-A682FF?style=for-the-badge&logo=astro&logoColor=black)](https://accessible-astro.incluud.dev/) &nbsp;
[![Sponsor on Open Collective](https://img.shields.io/badge/Open%20Collective-7FADF2?style=for-the-badge&logo=opencollective&logoColor=white)](https://opencollective.com/incluud) &nbsp;

---

## 🌟 Palo Signature Core Features

### 1. Config-Driven Architecture
Say goodbye to design tokens scattered across multiple components. In Palo, [`src/config.yaml`](file:///Users/petelee/工作/palo/src/config.yaml) is the **single source of truth** for your entire design system:
*   **Colors**: Brand colors, pulse colors, semantic states (info, success, warning, error), and focus outlines.
*   **Typography**: Font families, font weights, and responsive heading scales.
*   **Borders & Radius**: Global thickness and rounding that cascade down to individual components (buttons, cards, forms, toggles, badges, avatars) with localized overrides.
*   **Navigation Layout**: Opacity, backdrop blurs, alignments, dropdown stylings, and menu heights.

### 2. Build-Time Validation (Zod Gate)
Palo parses your `config.yaml` at build-time using **Zod schemas** to guarantee structural and syntactic correctness.
*   Any invalid CSS length (e.g., `"0.1rem"`, `"16px"`, `"-0.05em"`) or invalid font weights will fail the build immediately rather than corrupting your site's styles silently.
*   **Vite HMR Hot-Reloading**: In development, a custom Vite plugin watches `config.yaml`. Valid edits trigger a full browser reload in milliseconds, while invalid edits show a graceful error overlay without crashing the dev server.

### 3. Specificity Governance (CSS Cascade Layers)
To prevent styles from conflicting (a common pain point when overriding third-party components), Palo utilizes native CSS `@layer` in [`src/styles/tailwind.css`](file:///Users/petelee/工作/palo/src/styles/tailwind.css):

```css
@layer reset, tokens, base, components, overrides, utilities, scoped;
```

*   **`reset`**: Standardizes element base styles.
*   **`tokens`**: Places design variable properties injected from `config.yaml`.
*   **`base`**: Holds global defaults like keyframes, scrollbars, and focus rings.
*   **`components`**: Local scoped component styles.
*   **`overrides`**: Highest layered priority for targeting and correcting third-party library styles.
*   **`unlayered`** (*Highest overall priority*): Reserved for `_button.scss` and `_form.scss` to guarantee your config overrides always apply over external component library defaults.

### 4. High-Performance Fluid Typography
We compute fluid typography values at build-time rather than dynamically on the client:
*   Computes CSS `clamp()` equations based on your `mobileHeadingScale` and `desktopHeadingScale` configs.
*   Automatically scales heading levels (`H1` down to `H6`) smoothly between mobile and desktop viewports with zero runtime JS overhead.
*   Supports Atkinson Hyperlegible (with preloaded variables for minimized Layout Shift / CLS).

---

## 🛠️ Getting Started

To get started, clone this theme locally and run any of the following commands in your terminal:

```bash
# 1. Install dependencies
npm install

# 2. Start local dev server (default port 4321)
npm run dev

# 3. Build production-ready static site to `./dist/`
npm run build

# 4. Preview your production build locally
npm run preview
```

### Script Reference

| Command | Action | Description |
| :--- | :--- | :--- |
| `npm run dev` | `astro dev --host 0.0.0.0` | Starts local dev server with Vite HMR config watchers. |
| `npm run dev:legacy` | `node scripts/dev-legacy-watch.mjs` | Legacy file-watch dev daemon fallback. |
| `npm run build` | `astro build` | Runs Zod validation and outputs optimized static files. |
| `npm run preview` | `astro preview --host 0.0.0.0` | Previews the build output locally. |

---

## 📂 Project Directory Structure

```bash
src/
├── config.yaml          # 🌟 Single Source of Truth configuration file
├── assets/scss/         # 🎨 SCSS styling files
│   ├── index.scss       # Main SCSS entry point
│   ├── base/            # Cascade layer styles (_reset, _root, _font, _kbd, etc.)
│   └── components/      # Unlayered form & button overrides
├── components/          # 🧩 Customizable UI components (Hero, Nav, ColorContrast, etc.)
├── content/             # 📂 MDX content collections (dynamic projects and blog collections)
├── layouts/             # 📐 Page layout engines
│   ├── DefaultLayout.astro   # Main shell (injects variables, manages meta, preloads fonts)
│   └── MarkdownLayout.astro  # Layout for MDX/Markdown pages
├── pages/               # 📄 Static page router
│   ├── index.astro           # Homepage
│   ├── accessible-components.astro  # Component playground & showcases
│   ├── color-contrast-checker.astro # Real-time WCAG checker
│   ├── contact.astro         # Compliant contact form
│   └── sitemap.astro         # Accessible HTML sitemap index
├── utils/               # 🔧 Build-time config loaders, validators, and route formatters
└── styles/
    └── tailwind.css     # Global Tailwind CSS imports & @layer orders
```

---

## ♿ Comprehensive Accessibility Checklist (WCAG 2.2 AA)

*   **Keyboard Navigation**: Full keyboard traps mitigation and visual custom outline indicators on both dark & light backgrounds.
*   **Preference Toggles**: In-house preference controls for Dark Mode, High Contrast, and Reduced Motion (respecting `prefers-reduced-motion` browser settings).
*   **Form Validation**: Auto validation showcasing accessible inputs, error announcements, custom patterns, and focus shifts.
*   **Semantic Markup**: Strict compliance using landmark structures (`header`, `main`, `footer`, `section`, `nav`) and `.sr-only` classes.
*   **Skip Links**: Keyboard users can jump straight to main navigation or primary content.

---

## 🧱 Accessible Astro Ecosystem

Palo acts as the premium configuration layer on top of the **Accessible Astro** universe:

*   [Accessible Astro Components](https://github.com/incluud/accessible-astro-components): Reusable accessible component blocks.
*   [Accessible Astro Dashboard](https://github.com/incluud/accessible-astro-dashboard): A clean, user-friendly dashboard template.
*   [Accessible Astro Launcher](https://github.com/incluud/accessible-astro-launcher): Built-in command launcher (Cmd/Ctrl+K) for keyboard-driven preference control.
*   [Accessible Astro Docs](https://github.com/incluud/accessible-astro-docs): Comprehensive guides.

---

## 🤝 Contributing & Community

We'd love to have your help making this template even better!
1.  [File an Issue](https://github.com/incluud/accessible-astro-starter/issues) for bug reports or feature requests.
2.  [Submit a Pull Request](https://github.com/incluud/accessible-astro-starter/pulls) to contribute code enhancements.
3.  [Support on Open Collective](https://opencollective.com/incluud) to help us cover development costs.

### Heartfelt thanks to our sponsors, contributors, and the incredible Astro ecosystem! ❤️

<a href="https://github.com/incluud/accessible-astro-starter/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=incluud/accessible-astro-starter" />
</a>

---

*Remember: Accessibility is not a feature — it is a fundamental human right. Thank you for building a more inclusive web!* ✨
