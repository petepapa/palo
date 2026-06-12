---
title: Slogan Component Beta
description: Discover the Slogan component - a versatile tool for displaying brand messages with three display variants (default, inline, marquee scrolling). Learn about customizable speeds, scrolling directions, hover pause functionality, and how to control text styles through class parameters
publishDate: 2026-06-09
author:
  name: "Pete"
  image: "/branding/avatar.png"
  bio: "PetePa.com"
tags: ['Components', 'Documentation', 'Slogan']
coverImage: /posts/docs/slogan.png
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
views: 1500

---

### Introduction

The Slogan component is a versatile component designed for displaying brand slogans, taglines, or any text content that needs special presentation. It supports three display variants: default, inline (fit-to-width), and marquee (scrolling text).

Slogan 组件是一个多功能组件，专为显示品牌口号、标语或任何需要特殊展示的文字内容而设计。它支持三种显示变体：默认、内联（适应宽度）和跑马灯（滚动文字）。

This component is perfect for:
- Hero section taglines
- Brand slogans
- Scrolling announcements
- Responsive text displays
- Accessibility-friendly animations

该组件非常适合用于：
- 英雄区块标语
- 品牌口号
- 滚动公告
- 响应式文字显示
- 无障碍动画

---

### What is Slogan Component?

Slogan is more than just a text display - it's a complete solution for brand messaging that handles:
- Three display variants (default, inline, marquee)
- Responsive text sizing
- Customizable animation speed and direction
- Hover pause functionality
- Seamless scrolling loops
- `prefers-reduced-motion` support

Slogan 不仅仅是一个文字显示 - 它是一个完整的品牌消息解决方案，可以处理：
- 三种显示变体（默认、内联、跑马灯）
- 响应式文字大小
- 可自定义的动画速度和方向
- Hover 暂停功能
- 无缝滚动循环
- `prefers-reduced-motion` 支持

---

### Core Parameters

#### Basic Parameters

##### `text`
- **Type**: `string`
- **Required**: `true`
- **Function**: The text content to display

**Example**:
```astro
<Slogan text="Welcome to Palo" />
```

##### `variant`
- **Type**: `'default' | 'inline' | 'marquee'`
- **Required**: `false`
- **Default**: `'default'`
- **Function**: Display variant of the slogan

选择 slogan 的显示变体。

**Example**:
```astro
<Slogan text="Scrolling Text" variant="marquee" />
```

---

#### Style Parameters

##### `class`
- **Type**: `string`
- **Required**: `false`
- **Default**: `''`
- **Function**: CSS classes for the text element

Apply custom styles to the text. Supports all Tailwind CSS classes.

应用于文字的自定义样式。支持所有 Tailwind CSS 类。

**Example**:
```astro
<Slogan
  text="Styled Text"
  class="text-3xl md:text-5xl font-bold text-primary"
/>
```

##### `wrapperClass`
- **Type**: `string`
- **Required**: `false`
- **Default**: `''`
- **Function**: CSS classes for the container element

Apply custom styles to the wrapper/container. Useful for padding, margins, and background colors.

应用于容器元素的自定义样式。用于内边距、外边距和背景颜色。

**Example**:
```astro
<Slogan
  text="Wrapped Text"
  wrapperClass="bg-neutral-100 px-8 py-4"
/>
```

---

#### Marquee Animation Parameters

##### `speed`
- **Type**: `'slow' | 'normal' | 'fast'`
- **Required**: `false`
- **Default**: `'normal'`
- **Function**: Scrolling speed for marquee variant

速度定义：
- `slow`: 40 pixels/second
- `normal`: 80 pixels/second
- `fast`: 160 pixels/second

**Example**:
```astro
<Slogan text="Fast Scrolling" variant="marquee" speed="fast" />
```

##### `direction`
- **Type**: `'left' | 'right'`
- **Required**: `false`
- **Default**: `'left'`
- **Function**: Scrolling direction for marquee variant

- `left`: Text scrolls from right to left
- `right`: Text scrolls from left to right

**Example**:
```astro
<Slogan text="Right to Left" variant="marquee" direction="right" />
```

##### `pause`
- **Type**: `boolean`
- **Required**: `false`
- **Default**: `true`
- **Function**: Enable/disable hover pause functionality

When enabled, the scrolling will pause when user hovers over the slogan.

启用后，当用户悬停在 slogan 上时滚动会暂停。

**Example**:
```astro
<Slogan text="No Pause on Hover" variant="marquee" pause={false} />
```

---

### Display Variants Explained

#### Default Variant

The default variant displays static text with optional custom styling. This is useful for simple slogan display without animation.

默认变体显示带有可选自定义样式的静态文字。这适用于没有动画的简单 slogan 显示。

**Example**:
```astro
<Slogan text="Simple Slogan" class="text-xl text-primary" />
```

#### Inline Variant

The inline variant automatically adjusts the text size to fit the container width. The text will always display on a single line, stretching to fill the available space.

内联变体自动调整文字大小以适应容器宽度。文字将始终显示在一行上，伸展以填充可用空间。

**Example**:
```astro
<Slogan
  text="Fit to Width"
  variant="inline"
  wrapperClass="w-full"
  class="text-primary uppercase"
/>
```

#### Marquee Variant

The marquee variant creates a scrolling text animation. The text continuously scrolls in the specified direction. This is perfect for attention-grabbing announcements or brand slogans.

跑马灯变体创建滚动文字动画。文字按指定方向连续滚动。这非常适合引人注目的公告或品牌口号。

**Example**:
```astro
<Slogan
  text="Scrolling Brand Slogan"
  variant="marquee"
  speed="normal"
  direction="left"
  pause={true}
/>
```

---

### Practical Examples

#### Example 1: Simple Default Slogan

A basic slogan with custom text styling.

带有自定义文字样式的基本 slogan。

```astro
<Slogan
  text="Building Beautiful Websites"
  class="text-4xl font-bold text-primary"
/>
```

#### Example 2: Marquee with Responsive Typography

A scrolling slogan that adapts to screen size with responsive text classes.

带有响应式文字类的滚动 slogan，可适应屏幕尺寸。

```astro
<Slogan
  text="Palo Astro Theme"
  variant="marquee"
  speed="fast"
  class="text-3xl md:text-5xl lg:text-7xl text-neutral uppercase"
/>
```

#### Example 3: Marquee with Pause Control

A scrolling slogan with hover pause disabled.

禁用 hover 暂停的滚动 slogan。

```astro
<Slogan
  text="Continuous Scrolling"
  variant="marquee"
  speed="slow"
  pause={false}
/>
```

#### Example 4: Inline Fit-to-Width Slogan

A slogan that automatically sizes to fill its container.

自动调整大小以填充其容器的 slogan。

```astro
<Slogan
  text="Fully Responsive"
  variant="inline"
  wrapperClass="w-full bg-secondary"
  class="text-neutral-100 uppercase"
/>
```

#### Example 5: Footer Brand Slogan

Complete marquee setup as typically used in footer.

页脚中通常使用的完整跑马灯设置。

```astro
<CreativeSection
  class="bg-primary- py-4 sm:py-8 md:py-16"
  useContainer={false}
>
  <img src="/branding/logo-text.svg" class="w-full" />

  <Slogan
    text="Palo Astro Theme"
    variant="marquee"
    speed="normal"
    pause={false}
    direction="left"
    class="text-neutral- uppercase text-3xl md:text-5xl lg:text-9xl"
  />
</CreativeSection>
```

---

### Pro Tips

1. **Use Responsive Classes**: Always use responsive text classes (e.g., `text-3xl md:text-5xl`) for better visual appeal across devices
2. **Choose Appropriate Speed**: Match the scroll speed to the text length - longer texts work better with faster speeds
3. **Consider Accessibility**: Keep `pause={true}` for accessibility, unless continuous scrolling is essential
4. **Use Inline for Headlines**: The inline variant is perfect for hero headlines that should be bold and prominent
5. **Test on Mobile**: Always test marquee effects on mobile devices to ensure smooth performance

1. **使用响应式类**：始终使用响应式文字类（如 `text-3xl md:text-5xl`）以获得更好的跨设备视觉效果
2. **选择适当的速度**：根据文字长度匹配滚动速度 - 较长的文字适合较快的速度
3. **考虑无障碍**：保持 `pause={true}` 以确保无障碍，除非连续滚动是必需的
4. **用于标题使用内联变体**：内联变体非常适合应该醒目突出的英雄标题
5. **在移动设备上测试**：始终在移动设备上测试跑马灯效果以确保流畅性能

---

### Accessibility First

The Slogan component is built with accessibility at its core:

Slogan 组件以无障碍为核心构建：

- **`prefers-reduced-motion` Support**: Marquee animations are disabled when users have motion reduction enabled, showing static text instead
- **Keyboard Navigation**: All text remains fully accessible via keyboard
- **ARIA Labels**: Marquee variants include `aria-label` for screen readers
- **Hover Pause**: Built-in pause on hover for users who need more time to read
- **Focus Indicators**: No focus outline removal

- **`prefers-reduced-motion` 支持**：当用户启用动态效果减弱时，跑马灯动画会被禁用，改为显示静态文字
- **键盘导航**：所有文字都可以通过键盘完全访问
- **ARIA 标签**：跑马灯变体包含屏幕阅读器的 `aria-label`
- **Hover 暂停**：内置的悬停暂停功能，为需要更多阅读时间的用户提供帮助
- **焦点指示器**：不删除焦点轮廓

---

### Conclusion

The Slogan component provides a flexible, accessible, and visually appealing solution for displaying brand messaging. Whether you need a simple static slogan, a responsive inline headline, or an eye-catching scrolling marquee, this component has you covered with customizable speed, direction, and pause controls.

Slogan 组件为显示品牌消息提供了一个灵活、无障碍且美观的解决方案。无论你需要简单的静态 slogan、响应式内联标题还是引人注目的滚动跑马灯，这个组件都为你提供了可自定义的速度、方向和暂停控制。
