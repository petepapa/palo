---
title: Tailwind CSS Typography Guide
description: A practical guide to using Tailwind CSS utility classes for typography and styling
publishDate: 2026-06-09
author:
  name: "Pete"
  image: "/branding/avatar.png"
  bio: "PetePa.com"
tags: ['Documentation', 'Tailwind', 'Typography', 'CSS']
coverImage: ./cover.jpg
coverImagePosition: head
breadcrumbs: true
customBreadcrumbLabels:
  "blog": "博客"
  "current": ""
joinLastBreadcrumb: false
source: "https://github.com/petepapa/palo"
liveDemo: "https://palo.petepa.com/"
divider: true
toc: true
views: 900

---

### Introduction

Tailwind CSS is a utility-first CSS framework that lets you build custom designs directly in your HTML. This guide covers the most commonly used Tailwind utility classes with simple visual examples.

Tailwind CSS 是一个实用优先的 CSS 框架，让您直接在 HTML 中构建设计。本指南涵盖排版、颜色、间距和布局中最常用的 Tailwind 实用类。

---

### Text Sizing

Tailwind provides a comprehensive set of text sizing utilities. Each size corresponds to a specific font-size and line-height combination.

Tailwind 提供了一套完整的文字大小工具。

#### Available Sizes

<table>
  <thead>
    <tr><th>Class</th><th>Preview</th></tr>
  </thead>
  <tbody>
    <tr><td><code>text-xs</code></td><td><span style="font-size:0.64rem;">The quick brown fox</span></td></tr>
    <tr><td><code>text-sm</code></td><td><span style="font-size:0.8rem;">The quick brown fox</span></td></tr>
    <tr><td><code>text-base</code></td><td><span style="font-size:1rem;">The quick brown fox</span></td></tr>
    <tr><td><code>text-lg</code></td><td><span style="font-size:1.5625rem;">The quick brown fox</span></td></tr>
    <tr><td><code>text-xl</code></td><td><span style="font-size:1.953125rem;">The quick brown fox</span></td></tr>
    <tr><td><code>text-2xl</code></td><td><span style="font-size:2.4414rem;">Headline text</span></td></tr>
    <tr><td><code>text-3xl</code></td><td><span style="font-size:3.0518rem;">Headline text</span></td></tr>
    <tr><td><code>text-4xl</code></td><td><span style="font-size:3.8147rem;">Headline text</span></td></tr>
  </tbody>
</table>

#### Responsive Heading

Use responsive prefixes (`sm:`, `md:`, `lg:`) to change text size across breakpoints.

使用响应式前缀在不同断点调整字号。

```html
<h1 class="text-2xl md:text-4xl lg:text-5xl font-bold">
  Responsive Heading
</h1>
```

---

### Text & Background Colors

#### Theme Color Palette

<table>
  <thead>
    <tr><th>Class</th><th>Preview</th></tr>
  </thead>
  <tbody>
    <tr><td><code>bg-primary</code></td><td><div style="background:var(--brand-primary);color:#fff;padding:0.75rem 1rem;border-radius:6px;">Primary</div></td></tr>
    <tr><td><code>bg-secondary</code></td><td><div style="background:var(--brand-secondary);color:#fff;padding:0.75rem 1rem;border-radius:6px;">Secondary</div></td></tr>
    <tr><td><code>bg-info</code></td><td><div style="background:var(--brand-info);color:var(--brand-primary);padding:0.75rem 1rem;border-radius:6px;">Info</div></td></tr>
    <tr><td><code>bg-success</code></td><td><div style="background:var(--brand-success);color:#fff;padding:0.75rem 1rem;border-radius:6px;">Success</div></td></tr>
    <tr><td><code>bg-warning</code></td><td><div style="background:var(--brand-warning);color:#222;padding:0.75rem 1rem;border-radius:6px;">Warning</div></td></tr>
    <tr><td><code>bg-danger</code></td><td><div style="background:var(--brand-danger);color:#fff;padding:0.75rem 1rem;border-radius:6px;">Danger</div></td></tr>
  </tbody>
</table>

#### Text Colors

<table>
  <thead>
    <tr><th>Class</th><th>Preview</th></tr>
  </thead>
  <tbody>
    <tr><td><code>text-primary</code></td><td><span style="color:var(--brand-primary);font-weight:500;">Primary brand color text</span></td></tr>
    <tr><td><code>text-secondary</code></td><td><span style="color:var(--brand-secondary);font-weight:500;">Secondary accent color text</span></td></tr>
    <tr><td><code>text-info</code></td><td><span style="color:var(--brand-info);font-weight:500;">Info blue text</span></td></tr>
    <tr><td><code>text-success</code></td><td><span style="color:var(--brand-success);font-weight:500;">Success green text</span></td></tr>
    <tr><td><code>text-muted</code></td><td><span style="color:var(--color-neutral-500, #888);font-weight:500;">Muted / gray text for subtitles</span></td></tr>
  </tbody>
</table>

---

### Font Weight & Alignment

#### Font Weight

<table>
  <thead>
    <tr><th>Class</th><th>Preview</th></tr>
  </thead>
  <tbody>
    <tr><td><code>font-normal</code></td><td><span style="font-weight:400;font-size:1.25rem;">Normal weight text</span></td></tr>
    <tr><td><code>font-medium</code></td><td><span style="font-weight:500;font-size:1.25rem;">Medium weight text</span></td></tr>
    <tr><td><code>font-semibold</code></td><td><span style="font-weight:600;font-size:1.25rem;">Semi bold text</span></td></tr>
    <tr><td><code>font-bold</code></td><td><span style="font-weight:700;font-size:1.25rem;">Bold weight text</span></td></tr>
  </tbody>
</table>

#### Text Alignment

<table>
  <thead>
    <tr><th>Class</th><th>Preview</th></tr>
  </thead>
  <tbody>
    <tr><td><code>text-left</code></td><td><div style="text-align:left;padding:0.5rem 0.75rem;border:1px solid var(--border-color, #ddd);border-radius:6px;">Left-aligned text content goes here</div></td></tr>
    <tr><td><code>text-center</code></td><td><div style="text-align:center;padding:0.5rem 0.75rem;border:1px solid var(--border-color, #ddd);border-radius:6px;">Center-aligned text content goes here</div></td></tr>
    <tr><td><code>text-right</code></td><td><div style="text-align:right;padding:0.5rem 0.75rem;border:1px solid var(--border-color, #ddd);border-radius:6px;">Right-aligned text content goes here</div></td></tr>
  </tbody>
</table>

---

### Spacing

Use `m-*` for margin and `p-*` for padding. Each unit equals 0.25rem.

使用 `m-*` 表示外边距，`p-*` 表示内边距。

#### Padding

<table>
  <thead>
    <tr><th>Class</th><th>Preview</th></tr>
  </thead>
  <tbody>
    <tr><td><code>p-2</code></td><td><div style="padding:0.5rem;background:var(--brand-info);color:var(--brand-primary);border-radius:6px;display:inline-block;">Small padding</div></td></tr>
    <tr><td><code>p-4</code></td><td><div style="padding:1rem;background:var(--brand-info);color:var(--brand-primary);border-radius:6px;display:inline-block;">Standard padding</div></td></tr>
    <tr><td><code>p-6</code></td><td><div style="padding:1.5rem;background:var(--brand-info);color:var(--brand-primary);border-radius:6px;display:inline-block;">Comfortable padding</div></td></tr>
    <tr><td><code>px-6 py-2</code></td><td><div style="padding:0.5rem 1.5rem;background:var(--brand-info);color:var(--brand-primary);border-radius:6px;display:inline-block;">Wide X, small Y</div></td></tr>
    <tr><td><code>px-3 py-6</code></td><td><div style="padding:1.5rem 0.75rem;background:var(--brand-info);color:var(--brand-primary);border-radius:6px;display:inline-block;">Narrow X, tall Y</div></td></tr>
  </tbody>
</table>

#### Margin

Margin classes work the same way — `mt-4` (top), `mb-6` (bottom), `mx-auto` (horizontal centering).

Margin 类用法相同 — `mt-4`（上）、`mb-6`（下）、`mx-auto`（水平居中）。

```html
<div class="mx-auto max-w-md p-4 bg-info rounded-lg">
  This box is centered and has a max width
</div>
```

---

### Borders & Shadows

#### Border & Rounded Corners

<table>
  <thead>
    <tr><th>Class</th><th>Preview</th></tr>
  </thead>
  <tbody>
    <tr><td><code>border rounded</code></td><td><div style="border:1px solid var(--color-neutral-300,#ccc);border-radius:6px;padding:0.75rem 1rem;display:inline-block;">Default border</div></td></tr>
    <tr><td><code>border-2 border-primary rounded-xl</code></td><td><div style="border:2px solid var(--brand-primary);border-radius:12px;padding:0.75rem 1rem;display:inline-block;color:var(--brand-primary);">Thick colored border</div></td></tr>
    <tr><td><code>rounded-full bg-primary text-white</code></td><td><div style="background:var(--brand-primary);color:#fff;border-radius:9999px;padding:0.5rem 1.25rem;display:inline-block;">Pill shape</div></td></tr>
    <tr><td><code>rounded-2xl bg-primary text-white shadow</code></td><td><div style="background:var(--brand-primary);color:#fff;border-radius:16px;padding:0.75rem 1.5rem;display:inline-block;box-shadow:0 1px 3px rgba(0,0,0,0.1);">Large rounded with shadow</div></td></tr>
  </tbody>
</table>

#### Shadow Levels

<table>
  <thead>
    <tr><th>Class</th><th>Preview</th></tr>
  </thead>
  <tbody>
    <tr><td><code>shadow-sm</code></td><td><div style="box-shadow:0 1px 2px rgba(0,0,0,0.05);padding:0.75rem 1.5rem;border-radius:6px;display:inline-block;">Subtle shadow</div></td></tr>
    <tr><td><code>shadow</code></td><td><div style="box-shadow:0 1px 3px rgba(0,0,0,0.1);padding:0.75rem 1.5rem;border-radius:6px;display:inline-block;">Default shadow</div></td></tr>
    <tr><td><code>shadow-md</code></td><td><div style="box-shadow:0 4px 6px rgba(0,0,0,0.1);padding:0.75rem 1.5rem;border-radius:6px;display:inline-block;">Medium shadow</div></td></tr>
    <tr><td><code>shadow-lg</code></td><td><div style="box-shadow:0 10px 15px rgba(0,0,0,0.1);padding:0.75rem 1.5rem;border-radius:6px;display:inline-block;">Large shadow</div></td></tr>
    <tr><td><code>shadow-xl</code></td><td><div style="box-shadow:0 20px 25px rgba(0,0,0,0.15);padding:0.75rem 1.5rem;border-radius:6px;display:inline-block;">Extra large shadow</div></td></tr>
  </tbody>
</table>

---

### Layout

#### Flexbox

Flexbox is used for one-dimensional layouts (rows or columns).

Flexbox 用于一维布局（行或列）。

```html
<!-- Row with space between -->
<div class="flex justify-between items-center">
  <span>Logo</span>
  <span>Menu</span>
</div>

<!-- Column on mobile, row on desktop -->
<div class="flex flex-col md:flex-row gap-4">
  <div>Left</div>
  <div>Middle</div>
  <div>Right</div>
</div>

<!-- Perfect center -->
<div class="flex justify-center items-center">
  Centered content
</div>
```

#### Grid

Grid is used for two-dimensional layouts.

Grid 用于二维布局。

```html
<!-- 2 columns on mobile, 4 columns on desktop -->
<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
  <div>Card A</div>
  <div>Card B</div>
  <div>Card C</div>
  <div>Card D</div>
</div>
```

---

### Common Combinations

These are reusable patterns combining the utilities above.

这些是组合上述工具类的可复用组件模式。

#### Hero Section

```html
<section class="py-12 text-center">
  <h1 class="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 text-primary">
    Your Product Name
  </h1>
  <p class="text-base md:text-lg text-muted max-w-xl mx-auto mb-6 px-4">
    A short description of what you offer and why it matters to your customers.
  </p>
  <div class="flex flex-col sm:flex-row justify-center gap-3 px-4">
    <button class="bg-primary text-white px-8 py-3 rounded-lg font-medium">
      Get Started
    </button>
    <button class="bg-white text-primary px-8 py-3 rounded-lg font-medium border border-primary">
      Learn More
    </button>
  </div>
</section>
```

#### Feature Card Grid

```html
<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
  <div class="p-6 bg-white rounded-lg shadow border border-gray-100 text-center">
    <h4 class="font-bold mb-1">Fast</h4>
    <p class="text-muted text-sm">Optimized performance and page speed.</p>
  </div>
  <div class="p-6 bg-white rounded-lg shadow border border-gray-100 text-center">
    <h4 class="font-bold mb-1">Modern</h4>
    <p class="text-muted text-sm">Built with the latest web technologies.</p>
  </div>
  <div class="p-6 bg-white rounded-lg shadow border border-gray-100 text-center">
    <h4 class="font-bold mb-1">Focused</h4>
    <p class="text-muted text-sm">Designed for specific developer needs.</p>
  </div>
</div>
```

---

### Quick Reference

<table>
  <thead>
    <tr><th>Category</th><th>Common Classes</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>Text Size</strong></td><td><code>text-sm</code>, <code>text-base</code>, <code>text-lg</code>, <code>text-2xl</code>, <code>text-3xl</code>, <code>text-4xl</code></td></tr>
    <tr><td><strong>Text Color</strong></td><td><code>text-primary</code>, <code>text-secondary</code>, <code>text-info</code>, <code>text-success</code>, <code>text-muted</code>, <code>text-white</code></td></tr>
    <tr><td><strong>Background</strong></td><td><code>bg-primary</code>, <code>bg-info</code>, <code>bg-success</code>, <code>bg-warning</code>, <code>bg-danger</code>, <code>bg-white</code></td></tr>
    <tr><td><strong>Font Weight</strong></td><td><code>font-normal</code>, <code>font-medium</code>, <code>font-semibold</code>, <code>font-bold</code></td></tr>
    <tr><td><strong>Alignment</strong></td><td><code>text-left</code>, <code>text-center</code>, <code>text-right</code>, <code>items-center</code>, <code>justify-center</code>, <code>justify-between</code></td></tr>
    <tr><td><strong>Padding</strong></td><td><code>p-2</code>, <code>p-4</code>, <code>p-6</code>, <code>px-4</code>, <code>py-6</code></td></tr>
    <tr><td><strong>Margin</strong></td><td><code>m-4</code>, <code>mt-4</code>, <code>mb-6</code>, <code>mx-auto</code></td></tr>
    <tr><td><strong>Border</strong></td><td><code>border</code>, <code>border-2</code>, <code>rounded</code>, <code>rounded-lg</code>, <code>rounded-full</code></td></tr>
    <tr><td><strong>Shadow</strong></td><td><code>shadow</code>, <code>shadow-md</code>, <code>shadow-lg</code>, <code>shadow-xl</code></td></tr>
    <tr><td><strong>Layout</strong></td><td><code>flex</code>, <code>flex-col</code>, <code>gap-4</code>, <code>grid</code>, <code>grid-cols-3</code>, <code>container</code></td></tr>
    <tr><td><strong>Responsive</strong></td><td><code>md:</code>, <code>lg:</code>, <code>xl:</code> prefixes</td></tr>
  </tbody>
</table>

---

### Conclusion

Tailwind CSS utilities provide a fast and consistent way to style your Palo website. By combining text sizing, colors, spacing, and layout classes, you can create professional designs without writing custom CSS.

Tailwind CSS 工具类提供了快速且一致的方式来设置您的 Palo 网站样式。通过组合文字大小、颜色、间距和布局类，您可以创建专业的设计。

**Want to go deeper?** Check the official [Tailwind CSS Documentation](https://tailwindcss.com/docs) for hundreds of additional utilities.

**想深入了解？** 查看官方 [Tailwind CSS 文档](https://tailwindcss.com/docs) 了解更多工具类。
